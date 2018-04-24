
AFRAME.registerComponent('points-as-icons', {
    dependencies: ["geojson"],
    multiple: true,
    schema: {
        icon: {
            type: 'asset'
        }
        
    },
    init: function() {
        const data = this.data;

        this.el.addEventListener('geojson-loaded', event => {
            const map = event.detail.data
            map.forEach((entry, key) => {
                    const {image, name, copyright, type} = entry.properties;

                    const pos = new THREE.Vector3().copy(entry.position)
                    pos.setLength(4)
                    
                    const img = document.createElement('a-circle')
                    
                    img.setAttribute('src', data.icon.src)
                    img.setAttribute('opacity', 0.6);
                    img.setAttribute('side', 'double');
                    img.setAttribute('alpha-test', 0.5);
                    img.setAttribute('transparent', true);
                    img.setAttribute('radius', 0.15);
                    
                    img.setAttribute('position', pos);
                    img.setAttribute('look-at', '0 0 0')

                    img.setAttribute('mixin', 'clickable')
                    img.setAttribute('class', 'clickable')
                    img.setAttribute('showphoto-action', `image: ${image}; name: ${name}; copyright: ${copyright}`)
                    this.el.appendChild(img)
            })
            
        })
    }
});