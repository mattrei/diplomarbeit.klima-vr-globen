const setComponentProperty = AFRAME.utils.entity.setComponentProperty;

AFRAME.registerComponent('static-texture', {
  schema: {
    texturesPath: {
      default: 'marble'
    },
    month: {
      default: 1
    }
  },

  init: function () {
    this.loader = new THREE.TextureLoader();
  },

  update: function (oldData) {
    const data = this.data;

    if (AFRAME.utils.deepEqual(data, oldData)) return;

    this.actualMonth = this.data.month - 1;

    const extension = data.texturesPath === 'marble' ? 'jpg' : 'png';

    const url = `/assets/${data.texturesPath}/${data.month}.${extension}`;
    console.log(url)
    if (data.texturesPath !== oldData.texturesPath) {
      setComponentProperty(this.el, 'material.src', url);
    }
    if (data.month !== oldData.month) {
      setComponentProperty(this.el, 'material.src', url);
    }
  }

});
