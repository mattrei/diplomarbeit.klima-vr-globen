
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
    } else if (data === 'quiz') {
      this.el.emit('startQuiz', {});
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

AFRAME.registerComponent('quiz-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('startQuiz', {});
    });
  }
});

AFRAME.registerComponent('layer-action', {
  schema: {
    default: 'marble'
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

AFRAME.registerComponent('toolbar-action', {
  init: function () {
    this.thetaStart = 0;
    this.thetaLength = 0;

    this.isIntersected = false;
    this.el.addEventListener('raycaster-intersected', evt => {
      if (!this.isIntersected) {
        this.isIntersected = true;

        this.thetaStart = this.el.getAttribute('geometry').thetaStart;
        this.thetaLength = this.el.getAttribute('geometry').thetaLength;

        this.el.setAttribute('geometry', 'thetaStart', this.thetaStart - 3);
        this.el.setAttribute('geometry', 'thetaLength', this.thetaLength + 3 * 2);

        const position = evt.detail.intersection.point.clone();
        position.setLength(1);

        this.el.sceneEl.emit('showToolbar', {
          position: position
        });
      }
    });

    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      //if (evt.currentTarget.id === evt.detail.target.id) {
        this.el.setAttribute('geometry', 'thetaStart', this.thetaStart);
        this.el.setAttribute('geometry', 'thetaLength', this.thetaLength);
        this.el.sceneEl.emit('hideToolbar');
        this.isIntersected = false;
      //}
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
    this.el.sceneEl.addEventListener('camera-set-active', (evt) => {
      this.camera = evt.detail.cameraEl.object3D.children[0];
    });

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

AFRAME.registerComponent('next-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('nextMonth');
      this.el.sceneEl.emit('setAutoplay', {autoplay: false});
    });
  }
});

AFRAME.registerComponent('prev-action', {
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('prevMonth');
      this.el.sceneEl.emit('setAutoplay', {autoplay: false});
    });
  }
});

AFRAME.registerComponent('playpause-action', {
  schema: {
    default: false
  },
  init: function () {
    this.el.addEventListener('click', evt => {
      this.el.sceneEl.emit('setAutoplay', {
        autoplay: !this.data
      });
    });
  }
});

AFRAME.registerComponent('next-round-action', {
  schema: {
    type: 'selector'
  },
  init: function () {
    this.el.addEventListener('click', evt => {
      console.log('Next round!');
      this.el.sceneEl.emit('nextRound');
      this.el.sceneEl.emit('hideToolbar');

      if (this.data) {
        console.log(this.data);
        this.data.emit('darken');
        this.data.emit('lighten');
      }
    });
  }
});
