const EVENT = 'textures-loaded';

AFRAME.registerComponent('blending-texture', {
  schema: {
    texturesPath: {
      default: 'marble'
    },
    months: {
      default: [...Array(12)].map((_, i) => i + 1)
    },
    month: {
      default: 1
    },
    autoplay: {
      default: false
    },
    transitionDur: {
      default: 1000
    }, // transition between two textures in milliseconds
    opacity: {
      default: 1
    },
    enabled: {
      default: false
    }
  },

  init: function () {
    this.actualMonth = 0;
    this.ready = false;
    this.elapsed = 0;
    this.loader = new THREE.TextureLoader();
  },

  update: function (oldData) {
    const data = this.data;

    if (AFRAME.utils.deepEqual(data, oldData)) return;

    if (!data.autoplay) {
      this.actualMonth = this.data.month - 1;
    }
    const promises = [];

    const extension = data.texturesPath === 'marble' ? 'jpg' : 'png';

    if (data.texturesPath !== oldData.texturesPath) {
      data.months.forEach(month => {
        promises.push(new Promise((resolve, reject) => {
          this.loader
            .load(
              `assets/${data.texturesPath}/${month}.${extension}`,
              texture => resolve(texture),
              xhr => {},
              err => reject(err)
            );
        }));
      });

      Promise.all(promises)
        .then(textures => this.generate(textures));
    }
  },

  generate: function (textures) {
    const data = this.data;
    const el = this.el;
    this.textures = textures;

    this.uniforms = {
      ratio: {
        value: 0
      },
      diffuseSourceA: {
        value: textures[this.actualMonth]
      },
      diffuseSourceB: {
        value: textures[(this.actualMonth + 1) % data.months.length]
      },
      opacity: {
        value: data.opacity
      }
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VS,
      fragmentShader: FS,
      side: THREE.BackSide,
      transparent: true // TODO?
    });

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());

    this.el.emit(EVENT);
  },
  applyToMesh: function () {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material = this.material;
    }
    this.ready = true;
  },

  tick: function (time, timeDelta) {
    const data = this.data;

    if (!data.enabled) return;
    if (!this.ready) return;

    const zn = data.months.length;

    this.elapsed += timeDelta;

    if (data.autoplay) {
      if (this.elapsed >= data.transitionDur) {
        this.actualMonth = (this.actualMonth + 1) % zn;
        this.elapsed = 0;

        this.el.sceneEl.emit('setMonth', {
          month: this.actualMonth + 1
        });
      }
    } else {
      this.actualMonth = data.month;
    }

    this.uniforms['ratio'].value = THREE.Math.clamp(this.elapsed / data.transitionDur, 0.0, 1.0);

    this.uniforms['diffuseSourceA'].value = this.textures[this.actualMonth];
    this.uniforms['diffuseSourceB'].value = this.textures[(this.actualMonth + 1) % zn];
  }
});

const VS = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vfUv;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    vNormal = normalize( normalMatrix * normal );
    vUv = vec2(1.-uv.s, uv.t);
    //vUv = uv;
}
`;

const FS = `
uniform sampler2D diffuseSourceA;
uniform sampler2D diffuseSourceB;
uniform sampler2D mask;

uniform float ratio;
uniform float opacity;

varying vec3 vNormal;
varying vec2 vUv;
void main()
{

  vec4 texelA = texture2D( diffuseSourceA, vUv );
  vec4 texelB = texture2D( diffuseSourceB, vUv );
  //vec4 texelM = texture2D( mask, vUv );

  vec4 mixed = mix( texelA, texelB, ratio );
  //if (mixed.rgb < vec3(0.1)) discard;
  gl_FragColor = vec4( mixed.rgb, opacity );
}
`;