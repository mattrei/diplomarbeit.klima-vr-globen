
AFRAME.registerComponent('choose-layer', {
  schema: {
    type: 'string'
  },
  update: function (oldData) {
    const data = this.data;
    if (this.el.getAttribute('src').includes(data)) {
      this.el.setAttribute('material', 'visible', false)
      this.el.setAttribute('class', '')
    } else {
      this.el.setAttribute('material', 'visible', true)
      this.el.setAttribute('class', 'clickable')
    }
  }

});


AFRAME.registerComponent('photos-visible', {
  schema: {
    layer: {
    }
  },
  update: function (oldData) {
    const visible = this.data.layer === 'climatezones';
    this.el.setAttribute('visible', visible);
  }
});