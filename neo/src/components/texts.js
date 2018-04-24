AFRAME.registerComponent('round-text', {
  schema: {
    round: {
      default: 0
    },
    maxRounds: {
      default: 0
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    this.el.setAttribute('value', `Runde ${this.data.round} (von ${this.data.maxRounds})`);
  }
});

AFRAME.registerComponent('score-text', {
  schema: {
    score: {
      default: 0
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    this.el.setAttribute('value', `${this.data.score} Punkte`);
  }
});

AFRAME.registerComponent('quizfinished-text', {
  schema: {
    finished: {
      default: false
    },
    score: {
      default: 0
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    if (this.data.finished) {
      this.el.setAttribute('visible', true);
      this.el.setAttribute('value', `Du hast ${this.data.score} Punkte erreicht!`);
    } else {
      this.el.setAttribute('visible', false);
    }
  }
});

AFRAME.registerComponent('quiztitle-text', {
  schema: {
    finished: {
      default: false
    },
    maxRounds: {
      default: 10
    },
    round: {
      default: 1
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    const data = this.data;
    if (data.finished) {
      this.el.setAttribute('value', 'Das Quiz ist zu Ende!');
      this.el.setAttribute('color', 'orange');
    } else {
      const diff = data.maxRounds - data.round;

      if (diff === 0) {
        this.el.setAttribute('value', `Letze Runde!`);
      } else {
        this.el.setAttribute('value', `Noch ${diff} Runden`);
      }
    }
  }
});

AFRAME.registerComponent('month-cursor-text', {
  schema: {
    month: {
      default: 1
    },
    cursorVisible: {
      default: false
    },
    toolbarVisible: {
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
    this.el.setAttribute('visible', (!data.cursorVisible || data.toolbarVisible) && data.exploreEnabled);
    this.el.setAttribute('value', getMonth(data.month, data.lang));
  }

});

AFRAME.registerComponent('month-text', {
  schema: {
    month: {
      default: 1
    },
    lang: {
      default: 'de'
    }
  },
  update: function (oldData) {
    const data = this.data;
    this.el.setAttribute('value', getMonthShort(data.month, data.lang));
  }

});

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

AFRAME.registerComponent('prev-text', {
  schema: {
    month: {
      default: 1
    },
    autoplay: {
      default: false
    },
    lang: {
      default: 'de'
    }
  },
  update: function () {
    const data = this.data;
    const prevMonth = data.month - 1 < 1 ? 12 : data.month - 1;
    this.el.setAttribute('value', `${getMonthShort(prevMonth, data.lang)}`);
  }
});

AFRAME.registerComponent('next-text', {
  schema: {
    month: {
      default: 1
    },
    autoplay: {
      default: false
    },
    lang: {
      default: 'de'
    }
  },
  update: function () {
    const data = this.data;
    const nextMonth = data.month + 1 > 12 ? 1 : data.month + 1;
    this.el.setAttribute('value', `${getMonthShort(nextMonth, data.lang)}`);
  }
});

function getMonthShort (month, lang) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return months[month - 1];
}

function getMonth (month, lang) {
  const months = ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return months[month - 1];
}
