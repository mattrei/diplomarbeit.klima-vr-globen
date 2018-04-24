import {scaleLinear} from 'd3-scale'
const EVENT = "color-code-selected"

const COLOR_TO_CLIMATEZONE = {
    254: 'subtropical',
    238: 'tropical',
    30: 'warm',
    227: 'boreal',
    108: 'tundra',
    232: 'ice',
    0: ''
}

AFRAME.registerComponent('interpret-color-code', {
    dependencies: ['extract-color-code'],
    schema: {
        layer: {

        }
    },
    init: function () {

        const interpolate = scaleLinear()
            .domain([0, 64, 128, 192, 256])
            .range([1, 10, 100, 1000, 10000])

        this.el.addEventListener(EVENT, evt => {
            const data = this.data;

            const result = evt.detail;
            if (data.layer === 'population') {
                //console.log(256 - result)
                let code = 0;
                if (result > 0) {
                    code = interpolate(256-result)
                }
                this.el.sceneEl.emit('setCode', { code })

            } else if (data.layer === 'climatezones') {

                const code = COLOR_TO_CLIMATEZONE[result]
                this.el.sceneEl.emit('setCode', { code })
            }
        })
    }
})

AFRAME.registerComponent('extract-color-code', {
    dependencies: ['material', 'geometry'],
    schema: {
        src: {
            type: 'string'
        },
        texture: {
            type: 'string'
        },
        listener: {
            oneOf: ['click', 'raycaster-intersected'],
            default: 'raycaster-intersected'
        },
        latency: {
            default: 800
        }
    },

    init: function () {

        const data = this.data;

        this.lastResult = 0

        this.loader = new THREE.TextureLoader()

        this.isSelecting = false

        this.hitScene = new THREE.Scene();
        this.hitCamera = new THREE.PerspectiveCamera(0.001, 1, 0.01, 3000);
        this.hitTexture = new THREE.WebGLRenderTarget(1, 1, {
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType
        });
        this.hitTexture.texture.minFilter = THREE.NearestFilter;
        this.hitTexture.texture.magFilter = THREE.NearestFilter;
        this.hitTexture.generateMipMaps = false;
        this.hitTexture.setSize(100, 100);


        const geomComponent = this.el.components.geometry;
        const matComponent = this.el.components.material;
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        })

        const mesh = new THREE.Mesh(
            geomComponent.geometry.clone(),
            this.material
        );

        mesh.scale.copy(this.el.object3D.getWorldScale())
        mesh.rotation.copy(this.el.object3D.getWorldRotation())

        this.hitScene.add(mesh)


        this.select = AFRAME.utils.bind(this.select, this);
        this.el.addEventListener(data.listener, this.select);

        this.tick = AFRAME.utils.throttleTick(this.tick, data.latency, this)
    },
    update: function (oldData) {

        const data = this.data;
        if (!data.texture) return;

        data.texture = document.querySelector(data.texture)
        data.src = document.querySelector(data.src)

        this.loader.load(data.texture.src, (texture) => {
            this.material.map = texture
            this.material.needsUpdate = true;
        })

        // hack of state component
        this.el.setAttribute('material', 'src', data.src);
    },
    tick: function(time) {
        if (this.data.listener === 'raycaster-intersected') {
            
            const raycasterEl = document.querySelector('[raycaster]');
            const intersectedEls = raycasterEl.components.raycaster.intersectedEls
            if (intersectedEls.length > 0 && intersectedEls[intersectedEls.length-1] == this.el) {
                this.select();
            }
        }
    },
    select: (function () {

        const pixelBuffer = new Uint8Array(4)
        const dummy = new THREE.Object3D();
        return function () {
            let self = this;
            if (this.isSelecting) return;

            var entity = document.querySelector('[raycaster]');
            var raycaster = entity.components.raycaster.raycaster;


            var intersections = raycaster.intersectObject(this.el.getObject3D('mesh'));
            if (intersections.length > 0) {

                
                this.isSelecting = true;
                var p = intersections[0].point;
                dummy.lookAt(p);
                dummy.rotation.y += Math.PI;

                this.hitTest(dummy, pixelBuffer).then((result) => {

                    if (result !== this.lastResult) {
                        
                        this.el.emit(EVENT, result)

                        this.lastResult = result;
                    }

                    this.isSelecting = false;
                });
            }
        };
    }()),
    hitTest: function (obj, pixelBuffer) {

        const renderer = this.el.sceneEl.renderer;

        this.hitCamera.position.copy(obj.position);
        this.hitCamera.rotation.copy(obj.rotation);
        const isVREnabled = renderer.vr.enabled;

        renderer.vr.enabled = false;
        renderer.render(this.hitScene, this.hitCamera, this.hitTexture);
        renderer.vr.enabled = isVREnabled;

        return new Promise((resolve, reject) => {
            var res = null;

            renderer.readRenderTargetPixels(this.hitTexture, 0, 0, 1, 1, pixelBuffer);
            resolve(pixelBuffer[0]);
        });
    },
});