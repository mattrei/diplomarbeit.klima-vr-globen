const setComponentProperty = AFRAME.utils.entity.setComponentProperty;

AFRAME.registerComponent('answer-buttons', {
  schema: {
    answer: {
      default: 1
    },
    finished: {
      type: 'boolean',
      default: false
    },
    round: {
      default: 1
    },
    maxRounds: {
      default: 1
    },
    answerA: {
      type: 'selector',
      default: '#answerA'
    },
    answerB: {
      type: 'selector',
      default: '#answerB'
    },
    answerC: {
      type: 'selector',
      default: '#answerC'
    },
    star: {
      type: 'selector',
      default: '#star'
    },
    fader: {
      type: 'selector',
      default: '#fadeBackground'
    }
  },
  init: function () {
    const data = this.data;
    data.answerA.addEventListener('click', evt => {
      this._checkAnswer(data.answerA);
    });
    data.answerB.addEventListener('click', evt => {
      this._checkAnswer(data.answerB);
    });
    data.answerC.addEventListener('click', evt => {
      this._checkAnswer(data.answerC);
    });

    data.fader.addEventListener('animationcomplete', evt => {
      data.fader.setAttribute('visible', false);
      console.log("fader complete")
    });
  },
  update: function (oldData) {
    const data = this.data;

    if (AFRAME.utils.deepEqual(data, oldData)) return;

    // TODO hack
    if (typeof data.star === 'string') {
      data.star = document.querySelector(data.star);
      data.answerA = document.querySelector(data.answerA);
      data.answerB = document.querySelector(data.answerB);
      data.answerC = document.querySelector(data.answerC);
      data.fader = document.querySelector(data.fader);
    }

    if (data.finished) {
      this._finished();
    } else {
      if (data.round > data.maxRounds) {
        this.el.sceneEl.emit('finishQuiz');
      } else {
        this._next();
      }
    }

    console.log('Answer = ' + data.answer);
  },
  _next: function () {
    const data = this.data;
    data.answerA.setAttribute('class', 'clickable');
    data.answerB.setAttribute('class', 'clickable');
    data.answerC.setAttribute('class', 'clickable');
    data.answerA.setAttribute('color', '#fff');
    data.answerB.setAttribute('color', '#fff');
    data.answerC.setAttribute('color', '#fff');
    data.answerA.setAttribute('visible', true);
    data.answerB.setAttribute('visible', true);
    data.answerC.setAttribute('visible', true);
    data.star.setAttribute('visible', false);
  },
  _finished: function () {
    const data = this.data;
    data.answerA.setAttribute('class', '');
    data.answerB.setAttribute('class', '');
    data.answerC.setAttribute('class', '');
    data.answerA.setAttribute('visible', false);
    data.answerB.setAttribute('visible', false);
    data.answerC.setAttribute('visible', false);

    this.el.sceneEl.emit('showMenu');
  },
  _checkAnswer: function (entity) {
    const data = this.data;
    const answer = entity.getAttribute('data-month');

    if (answer === data.answer.toString()) {
      entity.emit('green');

      this.el.sceneEl.emit('correctAnswer');

      data.star.emit('show');
      data.star.setAttribute('scale', '0.1 0.1 0.1');
      data.star.setAttribute('visible', true);

      this._nextRound();
    } else {
      entity.emit('red');
      this.el.sceneEl.emit('wrongAnswer');
      const answerA = data.answerA.getAttribute('data-month');
      const answerB = data.answerB.getAttribute('data-month');
      const answerC = data.answerC.getAttribute('data-month');

      switch (this.data.answer.toString()) {
        case answerA:
          data.answerA.emit('green');
          break;
        case answerB:
          data.answerB.emit('green');
          break;
        case answerC:
          data.answerC.emit('green');
          break;
      }

      this._nextRound();
    }
    entity.setAttribute('class', '');
  },
  _nextRound: function () {
    const data = this.data;
    setTimeout(_ => {
      //data.fader.setAttribute('visible', true);
      //data.fader.emit('fade');
      
      this.el.sceneEl.emit('hideToolbar');
      this.el.sceneEl.emit('hideMenu');
      data.star.setAttribute('visible', false);
      setTimeout(_ => {
        this.el.sceneEl.emit('nextRound');
      }, 1000);
    }, 2500);
  }
});

AFRAME.registerComponent('playpause-icon', {
  schema: {
    default: false
  },
  init: function () {
    /*
    this.xfactor = 1;
    // eliminate golden gaze
    this.el.addEventListener('click', evt => {
      const pos = this.el.parentNode.getAttribute('position')
      this.el.parentNode.setAttribute('position', `${pos.x + this.xfactor} 0 0`)
      this.xfactor *= -1;
    });
    */
  },
  update: function (oldData) {
    const icon = this.data ? 'pause' : 'play';

    this.el.setAttribute('src', `#icon-${icon}`);
  }
});

AFRAME.registerComponent('score-stars', {
  schema: {
    score: {
      default: 0
    },
    maxRounds: {
      default: 10
    }
  },

  init: function () {
    this.stars = [];

    for (let i = 0; i < this.data.maxRounds; i++) {
      const star = document.createElement('a-image');
      star.setAttribute('src', '#icon-star');
      star.setAttribute('alpha-test', '0.5');
      star.setAttribute('shader', 'standard');
      // TODO shader!
      star.setAttribute('position', `${i * 0.25} 0 0`);
      star.setAttribute('scale', '0.2 0.2 0.2');
      star.setAttribute('visible', false);
      this.el.appendChild(star);

      this.stars.push(star);
    }
  },

  update: function (oldData) {
    const data = this.data;

    for (let i = 0; i < this.data.score; i++) {
      this.stars[i].setAttribute('visible', true);
      this.stars[i].setAttribute('emissive', '#ff0');
    }
  }

});

AFRAME.registerComponent('round-circles', {
  schema: {
    round: {
      default: 1
    },
    maxRounds: {
      default: 10
    },
    finished: {
      type: 'boolean',
      default: false
    }
  },

  init: function () {
    this.circles = [];

    for (let i = 0; i < this.data.maxRounds; i++) {
      const circle = document.createElement('a-image');
      circle.setAttribute('src', '#icon-openround');
      circle.setAttribute('alpha-test', '0.5');
      circle.setAttribute('shader', 'standard');
      circle.setAttribute('position', `${i * 0.25} 0 0`);
      circle.setAttribute('scale', '0.2 0.2 0.2');
      circle.setAttribute('visible', true);
      circle.setAttribute('emissive', '#00f');
      this.el.appendChild(circle);

      this.circles.push(circle);
    }
  },

  update: function (oldData) {
    const data = this.data;

    if (data.finished) return;

    for (let i = 0; i < this.data.round - 1; i++) {
      this.circles[i].setAttribute('src', '#icon-fullround');
      this.circles[i].setAttribute('visible', true);
      this.circles[i].setAttribute('opacity', 1);
      this.circles[i].removeAttribute('animation');
    }
    const actual = this.circles[this.data.round - 1];
    if (actual) {
      actual.setAttribute('src', '#icon-fullround');
      actual.setAttribute('animation', `property: opacity; dir: alternate; dur: 1000;
      loop: true; from: 1; to: 0.5;`);
    }
  }

});

AFRAME.registerComponent('choose-layer', {
  schema: {
    default: 'marble'
  },
  update: function (oldData) {
    const data = this.data;

    if (this.el.getAttribute('src').includes(data)) {
      this.el.setAttribute('material', 'visible', false);
      this.el.setAttribute('class', '');
    } else {
      this.el.setAttribute('material', 'visible', true);
      this.el.setAttribute('class', 'clickable');
    }
  }

});
