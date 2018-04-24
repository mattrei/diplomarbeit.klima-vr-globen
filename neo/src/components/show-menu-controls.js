var bind = AFRAME.utils.bind;

AFRAME.registerComponent('show-menu-controls', {
  schema: {
    camera: {
      default: '#camera',
      type: 'selector'
    },
    menuOpen: {
      default: false
    },
    enabled: {
      default: true
    }
  },

  init: function () {
    this.clickTimer = null;
    this.bindMethods();
  },

  update: function (oldData) {
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  remove: function () {
    this.pause();
  },

  bindMethods: function () {
    this.onMouseDown = bind(this.onMouseDown, this);
    this.releaseMouse = bind(this.releaseMouse, this);
    this.onTouchStart = bind(this.onTouchStart, this);
    this.onTouchEnd = bind(this.onTouchEnd, this);
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;
    if (!canvasEl) {
      return;
    }
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mouseup', this.releaseMouse, false);

    canvasEl.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchend', this.onTouchEnd);
  },

  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;
    if (!canvasEl) {
      return;
    }

    canvasEl.removeEventListener('mousedown', this.onMouseDown);
    canvasEl.removeEventListener('mouseup', this.releaseMouse);
    canvasEl.removeEventListener('mouseout', this.releaseMouse);

    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchend', this.onTouchEnd);
  },

  onMouseDown: function (event) {
    if (this.clickTimer == null) {
      this.clickTimer = setTimeout(() => {
        this.clickTimer = null;
      }, 400);
    } else {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      this._toggleMenu();
    }
  },

  releaseMouse: function () {
  },

  onTouchStart: function (e) {
    if (e.touches.length !== 1) {
      return;
    }
    this._toggleMenu();
  },

  onTouchEnd: function () {
  },
  _toggleMenu: function () {
    const data = this.data;
    if (!data.enabled) return;

    if (data.menuOpen) {
      this.el.sceneEl.emit('hideMenu');
    } else {
      var rotation = new THREE.Euler().setFromQuaternion(this.el.sceneEl.camera.getWorldQuaternion(), 'YXZ');
      this.el.sceneEl.emit('showMenu', {
        rotation: {
          x: 0,
          y: THREE.Math.radToDeg(rotation.y),
          z: 0
        }
      });
    }
  }
});
