function setCursor(state, clazz) {
  const selector = `.${clazz} .selectable, .${clazz} .clickable`;
  state.cursorObjects = selector;

  var raycasterEl = AFRAME.scenes[0].querySelector('[raycaster]');
  raycasterEl.setAttribute('raycaster', 'objects', state.cursorObjects);
  raycasterEl.components.raycaster.refreshObjects();
  return state;
}


function addToCursor(state, clazz) {
  const selector = `.${clazz} .selectable, .${clazz} .clickable`;

  state.cursorObjects += selector;

  var raycasterEl = AFRAME.scenes[0].querySelector('[raycaster]');
  raycasterEl.setAttribute('raycaster', 'objects', state.cursorObjects);
  raycasterEl.components.raycaster.refreshObjects();
}


const RAYCASTER_MENU = 500;
const RAYCASTER_EXPLORE = 1000;

AFRAME.registerState({
  initialState: {
    mainmenu: false,
    explore: false,
    quiz: false,

    menuVisible: false,
    menuEnabled: false,
    menuRotation: {
      x: 0,
      y: 0,
      z: 0
    },

    toolbarVisible: false,
    toolbarPosition: {
      x: 0,
      y: 0,
      z: 0
    },
    toolbarRotation: {
      x: 0,
      y: 0,
      z: 0
    },

    cursorObjects: '',
    
    isMobile: AFRAME.utils.device.isMobile(),
    cursorVisible: false,
    rayOrigin: AFRAME.utils.device.isMobile() ? 'entity' : 'mouse',
    fuseTimeout: 3000,
    raycasterInterval: 500,

    geographiclinesVisible: true,
    landbordersVisible: false,


    // explore
    layer: 'marble',
    month: 1,
    autoplay: false,
    transitionMs: 2000,

    // quiz
    quizLayer: 'marble',
    quizMonth: 1,

    monthA: 1,
    monthB: 2,
    monthC: 3,

    score: 0,
    round: 1,
    end: false,
    finished: false

  },

  handlers: {
    showMainmenu: function (state, action = {}) {
      state.mainmenu = true;
      state.explore = false;
      state.quiz = false;
      state.menuVisible = false;
      state.menuEnabled = false;
      state.toolbarVisible = false;

      state.menuRotation = Object.assign({}, action.rotation);
      state.menuRotation.x = state.menuRotation.z = 0;

      setCursor(state, 'mainmenuObjects');
      state.cursorVisible = true;
      return state;
    },
    showMenu: function (state, action) {
      state.menuVisible = true;
      state.menuRotation = Object.assign({}, action.rotation);
      state.toolbarVisible = false;

      if (state.quiz) {
        setCursor(state, 'quizMenuObjects');
      } else if (state.explore) {
        setCursor(state, 'exploreMenuObjects');
      }

      state.cursorVisible = true;
      return state;
    },
    hideMenu: function (state, action) {
      state.menuVisible = false;
      state.cursorVisible = false;

      if (state.quiz) {
        setCursor(state, 'quizObjects');
      } else if (state.explore) {
        setCursor(state, 'exploreObjects');
      }
      return state;
    },
    showToolbar: function (state, action) {
      if (!state.toolbarVisible && !state.menuVisible) {
        state.cursorVisible = true;
        state.toolbarVisible = true;
        state.toolbarPosition = Object.assign({}, action.position);
        state.toolbarRotation = Object.assign({}, action.rotation);

        if (state.quiz) {
          addToCursor(state, 'quizToolbarObjects');
        } else if (state.explore) {
          addToCursor(state, 'exploreToolbarObjects');
        }
      }
      return state;
    },
    hideToolbar: function (state, action) {
      state.cursorVisible = false;
      state.toolbarVisible = false;

      if (state.quiz) {
        setCursor(state, 'quizObjects');
      } else if (state.explore) {
        setCursor(state, 'exploreObjects');
      }

      return state;
    },




    startExplore: function (state, action) {
      state.mainmenu = false;
      state.explore = true;
      state.quiz = false;
      state.menuVisible = false;
      state.menuEnabled = true;
      state.toolbarVisible = false;
      setCursor(state, 'exploreObjects');
      state.cursorVisible = false;


      state.month = 1;
      state.autoplay = false;
      state.layer = 'marble';
      return state;
    },
    setLayer: function (state, action) {
      state.layer = action.layer;
      state.cursorVisible = false;
      return state;
    },
    setMonth: function (state, action) {
      state.month = action.month;
      return state;
    },
    nextMonth: function (state, action) {
      state.month += 1;
      state.month %= 12;
      if (state.month === 0) state.month = 1;
      return state;
    },
    prevMonth: function (state, action) {
      state.month -= 1;
      if (state.month === 0) state.month = 12;
      return state;
    },
    setAutoplay: function (state, action) {
      state.autoplay = action.autoplay;
      return state;
    },



    startQuiz: function (state, action) {
      state.mainmenu = false;
      state.explore = false;
      state.quiz = true;
      state.menuVisible = false;
      state.menuEnabled = true;
      state.toolbarVisible = false;

      setCursor(state, 'exploreObjects');
      state.cursorVisible = false;

      state.score = 0;
      state.round = 1;
      state.quizLayer = diceLayer();
      state.quizMonth = getRandomMonth();
      const answers = get3Answers(state.quizMonth);
      state.monthA = answers[0];
      state.monthB = answers[1];
      state.monthC = answers[2];
      state.finished = false;
      return state;
    },
    correctAnswer: function (state, action) {
      state.score += 1;
      return state;
    },
    wrongAnswer: function (state, action) {
      return state;
    },
    nextRound: function (state, action) {
      state.round += 1;
      state.quizLayer = diceLayer();
      state.quizMonth = getRandomMonth();
      const answers = get3Answers(state.quizMonth);
      state.monthA = answers[0];
      state.monthB = answers[1];
      state.monthC = answers[2];

      return state;
    },
    finishQuiz: function (state, action) {
      state.finished = true;
      state.menuEnabled = false;
      return state;
    }

  }
});

function diceLayer() {
  return Math.random() > 0.5 ? 'temperature' : 'marble';
}

function getRandomMonth() {
  return Math.ceil(Math.random() * 12);
}

function get3Answers(answer) {
  const answers = [];
  for (let i = 0; i < 3; i++) {
    const next = Math.ceil(Math.random() * 2) + 2;

    answers.push(answer);

    answer += next;
    answer %= 12;
    if (answer === 0) answer += 1;
  }
  answers.sort((a, b) => a - b);

  return answers;
}