
AFRAME.registerComponent('show', {
  schema: {
    default: 'mainmenu',
    oneOf: ['mainmenu', 'explore', 'quiz']
  },
  init: function () {
    const data = this.data;
    if (data === 'mainmenu') {
      this.el.emit('showMainmenu', {});
    } else if (data === 'explore') {
      this.el.emit('startExplore', {});
    }
  }
});

AFRAME.registerComponent('showmainmenu-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('showMainmenu', {});
    });
  }
});

AFRAME.registerComponent('explore-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('startExplore', {});
    });
  }
});


AFRAME.registerComponent('layer-action', {
  schema: {
    default: ''
  },
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('setLayer', {
        layer: this.data
      });
      this.el.sceneEl.emit('hideMenu');
    });
  }
});


AFRAME.registerComponent('hidemenu-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('hideMenu');
    });
  }
});

AFRAME.registerComponent('home-action', {
  init: function () {

    this.el.addEventListener('click', evt => {

      const rotation = new THREE.Euler().setFromQuaternion(this.el.sceneEl.camera.getWorldQuaternion(), 'YXZ');
      this.el.sceneEl.emit('showMainmenu', {
        rotation: {
          x: 0,
          y: THREE.Math.radToDeg(rotation.y),
          z: 0
        }
      });
    });
  }
});

AFRAME.registerComponent('showphoto-action', {
  schema: {
    name: {

    },
    image: {

    },
    copyright: {

    }
  },
  init: function () {
    const data = this.data;
    this.el.addEventListener('click', evt => {

      const src = `/assets/photos/${data.image}`
      
      this.el.sceneEl.emit('showPhoto', {src: src, copyright: data.copyright});
    });
  }
});


AFRAME.registerComponent('hidephoto-action', {
  schema: {
  },
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('hidePhoto');
    });
  }
});