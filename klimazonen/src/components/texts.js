
const DE_ZONES = {
  'subtropical': 'Subtropisches Klima',
  'tropical': 'Tropisches Klima',
  'warm': 'Kontinentales Klima',
  'boreal': 'Boreales Klima',
  'tundra': 'Tundrenklima',
  'ice': 'Dauerfrostklima'
}

AFRAME.registerComponent('cursor-text', {
  schema: {
    code: {
      default: '',
    },
    layer: {
    },
    menuVisible: {
      default: false
    },
    exploreEnabled: {
      default: false
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    const data = this.data;
    this.el.setAttribute('visible', !this.data.menuVisible && this.data.exploreEnabled);
    this.el.setAttribute('value', `${getValue(data.code, data.layer, data.lang)} ${getContext(data.layer, data.lang)}`);

    const x = data.layer === 'population' ? -0.1 : -0.7;
    const y = data.layer === 'population' ? -0.2 : -0.4;
    this.el.setAttribute('position', `${x} ${y} -4`)
  }

});

function getValue(value, layer, lang) {

  if (layer === 'population') {
    if (!value || value === undefined || value === '') {
      return 0;
    }
    return Math.round(value) || 0
  } else if (layer === 'climatezones') {
    if (!value || value === undefined ||  value === '') {
      return ''
    }
    return DE_ZONES[value] || '';
  }

}

function getContext(layer, lang) {
  switch (layer) {
    case 'population':
      return ''//'Personen / km²'
    default:
      return ''
  }
}

AFRAME.registerComponent('back-text', {
  schema: {
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    this.el.setAttribute('value', 'Zuruck');
  }
});

AFRAME.registerComponent('home-text', {
  schema: {
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    this.el.setAttribute('value', 'Hauptmenu');
  }
});

AFRAME.registerComponent('copyright-text', {
  schema: {
    copyright: {
      default: ''
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    this.el.setAttribute('value', `Copyright: ${this.data.copyright}`);
  }
});

