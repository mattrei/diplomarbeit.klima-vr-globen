function setCursor(state, clazz) {
  const selector = `.${clazz} .selectable, .${clazz} .clickable`;
  state.cursorObjects = selector;

  var raycasterEl = AFRAME.scenes[0].querySelector('[raycaster]');
  raycasterEl.setAttribute('raycaster', 'objects', state.cursorObjects);
  raycasterEl.components.raycaster.refreshObjects();
  return state;
}

const RAYCASTER_MENU = 500;
const RAYCASTER_EXPLORE = 1000;

AFRAME.registerState({
  initialState: {
    mainmenu: false,
    explore: false,

    menuVisible: false,
    menuEnabled: false,
    menuRotation: {
      x: 0,
      y: 0,
      z: 0
    },

    cursorObjects: '',
    isMobile: AFRAME.utils.device.isMobile(),
    cursorVisible: false,
    rayOrigin: AFRAME.utils.device.isMobile() ? 'entity' : 'mouse',
    fuseTimeout: 3000,
    raycasterInterval: 1000,

    geographiclinesVisible: true,

    selectedCode: '',

    layer: 'population',
    coloredTextureId: '',
    dataTextureId: '',
    showPhoto: false,
    photoSrc: '',
    photoType: '',
    photoCopyright: ''
  },

  handlers: {
    showMainmenu: function (state, action) {
      state.mainmenu = true;
      state.explore = false;
      state.menuVisible = false;
      state.menuEnabled = false;
      state.raycasterInterval = RAYCASTER_MENU;

      state.menuRotation = Object.assign({}, action.rotation);

      setCursor(state, 'mainmenuObjects');
      state.cursorVisible = true;
      return state;
    },
    startExplore: function (state, action) {
      state.mainmenu = false;
      state.explore = true;
      state.menuVisible = false;
      state.menuEnabled = true;
      state.raycasterInterval = RAYCASTER_EXPLORE;

      state.layer = 'climatezones';
      state.coloredTextureId = '#img-climatezones'
      state.dataTextureId = '#img-climatezones'
      state.showPhoto = false;

      setCursor(state, 'exploreObjects');
      state.cursorVisible = true;
      return state;
    },

    showMenu: function (state, action) {
      state.menuVisible = true;
      state.menuRotation = Object.assign({}, action.rotation);
      state.toolbarVisible = false;
      state.raycasterInterval = RAYCASTER_MENU;

      setCursor(state, 'exploreMenuObjects');

      state.cursorVisible = true;
      return state;
    },
    hideMenu: function (state, action) {
      state.menuVisible = false;
      state.cursorVisible = true;
      state.raycasterInterval = RAYCASTER_EXPLORE;

      setCursor(state, 'exploreObjects');
      return state;
    },
    setLayer: function (state, action) {
      state.layer = action.layer;
      if (action.layer === 'population') {
        state.coloredTextureId = '#img-population-colored'
        state.dataTextureId = '#img-population'
      } else {
        state.coloredTextureId = '#img-climatezones'
        state.dataTextureId = '#img-climatezones'
      }
      return state;
    },
    setCode: function (state, action) {
      state.selectedCode = action.code;
      return state;
    },
    showPhoto: function (state, action) {
      state.showPhoto = true;
      state.photoSrc = action.src;
      state.photoType = action.type;
      state.photoCopyright = action.copyright;

      setCursor(state, 'photoObjects');
      return state;
    },
    hidePhoto: function (state, action) {
      state.showPhoto = false;
      state.photoSrc = '';
      state.photoType = '';
      state.photoCopyright = '';
      setCursor(state, 'exploreObjects');
      return state;
    }
  }
});
