// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/fullscreenForm.js":[function(require,module,exports) {
/**
 * fullscreenForm.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;

(function (window) {
  'use strict';

  var support = {
    animations: Modernizr.cssanimations
  },
      animEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  },
      // animation end event name
  animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
  /**
   * extend obj function
   */

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  }
  /**
   * createElement function
   * creates an element with tag = tag, className = opt.cName, innerHTML = opt.inner and appends it to opt.appendTo
   */


  function createElement(tag, opt) {
    var el = document.createElement(tag);

    if (opt) {
      if (opt.cName) {
        el.className = opt.cName;
      }

      if (opt.inner) {
        el.innerHTML = opt.inner;
      }

      if (opt.appendTo) {
        opt.appendTo.appendChild(el);
      }
    }

    return el;
  }
  /**
   * FForm function
   */


  function FForm(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);

    this._init();
  }
  /**
   * FForm options
   */


  FForm.prototype.options = {
    // show progress bar
    ctrlProgress: true,
    // show navigation dots
    ctrlNavDots: true,
    // show [current field]/[total fields] status
    ctrlNavPosition: true,
    // reached the review and submit step
    onReview: function onReview() {
      return false;
    }
  };
  /**
   * init function
   * initialize and cache some vars
   */

  FForm.prototype._init = function () {
    // the form element
    this.formEl = this.el.querySelector('form'); // list of fields

    this.fieldsList = this.formEl.querySelector('ol.fs-fields'); // current field position

    this.current = 0; // all fields

    this.fields = [].slice.call(this.fieldsList.children); // total fields

    this.fieldsCount = this.fields.length; // show first field

    classie.add(this.fields[this.current], 'fs-current'); // create/add controls

    this._addControls(); // create/add messages


    this._addErrorMsg(); // init events


    this._initEvents();
  };
  /**
   * addControls function
   * create and insert the structure for the controls
   */


  FForm.prototype._addControls = function () {
    // main controls wrapper
    this.ctrls = createElement('div', {
      cName: 'fs-controls',
      appendTo: this.el
    }); // continue button (jump to next field)

    this.ctrlContinue = createElement('button', {
      cName: 'fs-continue',
      inner: 'Continuar',
      appendTo: this.ctrls
    });

    this._showCtrl(this.ctrlContinue); // navigation dots


    if (this.options.ctrlNavDots) {
      this.ctrlNav = createElement('nav', {
        cName: 'fs-nav-dots',
        appendTo: this.ctrls
      });
      var dots = '';

      for (var i = 0; i < this.fieldsCount; ++i) {
        dots += i === this.current ? '<button class="fs-dot-current"></button>' : '<button disabled></button>';
      }

      this.ctrlNav.innerHTML = dots;

      this._showCtrl(this.ctrlNav);

      this.ctrlNavDots = [].slice.call(this.ctrlNav.children);
    } // field number status


    if (this.options.ctrlNavPosition) {
      this.ctrlFldStatus = createElement('span', {
        cName: 'fs-numbers',
        appendTo: this.ctrls
      }); // current field placeholder

      this.ctrlFldStatusCurr = createElement('span', {
        cName: 'fs-number-current',
        inner: Number(this.current + 1)
      });
      this.ctrlFldStatus.appendChild(this.ctrlFldStatusCurr); // total fields placeholder

      this.ctrlFldStatusTotal = createElement('span', {
        cName: 'fs-number-total',
        inner: this.fieldsCount
      });
      this.ctrlFldStatus.appendChild(this.ctrlFldStatusTotal);

      this._showCtrl(this.ctrlFldStatus);
    } // progress bar


    if (this.options.ctrlProgress) {
      this.ctrlProgress = createElement('div', {
        cName: 'fs-progress',
        appendTo: this.ctrls
      });

      this._showCtrl(this.ctrlProgress);
    }
  };
  /**
   * addErrorMsg function
   * create and insert the structure for the error message
   */


  FForm.prototype._addErrorMsg = function () {
    // error message
    this.msgError = createElement('span', {
      cName: 'fs-message-error',
      appendTo: this.el
    });
  };
  /**
   * init events
   */


  FForm.prototype._initEvents = function () {
    var self = this; // show next field

    this.ctrlContinue.addEventListener('click', function () {
      self._nextField();
    }); // navigation dots

    if (this.options.ctrlNavDots) {
      this.ctrlNavDots.forEach(function (dot, pos) {
        dot.addEventListener('click', function () {
          self._showField(pos);
        });
      });
    } // jump to next field without clicking the continue button (for fields/list items with the attribute "data-input-trigger")


    this.fields.forEach(function (fld) {
      if (fld.hasAttribute('data-input-trigger')) {
        var input = fld.querySelector('input[type="radio"]') ||
        /*fld.querySelector( '.cs-select' ) ||*/
        fld.querySelector('select'); // assuming only radio and select elements (TODO: exclude multiple selects)

        if (!input) return;

        switch (input.tagName.toLowerCase()) {
          case 'select':
            input.addEventListener('change', function () {
              self._nextField();
            });
            break;

          case 'input':
            [].slice.call(fld.querySelectorAll('input[type="radio"]')).forEach(function (inp) {
              inp.addEventListener('change', function (ev) {
                self._nextField();
              });
            });
            break;

          /*
          // for our custom select we would do something like:
          case 'div' : 
          	[].slice.call( fld.querySelectorAll( 'ul > li' ) ).forEach( function( inp ) {
          		inp.addEventListener( 'click', function(ev) { self._nextField(); } );
          	} ); 
          	break;
          */
        }
      }
    }); // keyboard navigation events - jump to next field when pressing enter

    document.addEventListener('keydown', function (ev) {
      if (!self.isLastStep && ev.target.tagName.toLowerCase() !== 'textarea') {
        var keyCode = ev.keyCode || ev.which;

        if (keyCode === 13) {
          ev.preventDefault();

          self._nextField();
        }
      }
    });
  };
  /**
   * nextField function
   * jumps to the next field
   */


  FForm.prototype._nextField = function (backto) {
    if (this.isLastStep || !this._validade() || this.isAnimating) {
      return false;
    }

    this.isAnimating = true; // check if on last step

    this.isLastStep = this.current === this.fieldsCount - 1 && backto === undefined ? true : false; // clear any previous error messages

    this._clearError(); // current field


    var currentFld = this.fields[this.current]; // save the navigation direction

    this.navdir = backto !== undefined ? backto < this.current ? 'prev' : 'next' : 'next'; // update current field

    this.current = backto !== undefined ? backto : this.current + 1;

    if (backto === undefined) {
      // update progress bar (unless we navigate backwards)
      this._progress(); // save farthest position so far


      this.farthest = this.current;
    } // add class "fs-display-next" or "fs-display-prev" to the list of fields


    classie.add(this.fieldsList, 'fs-display-' + this.navdir); // remove class "fs-current" from current field and add it to the next one
    // also add class "fs-show" to the next field and the class "fs-hide" to the current one

    classie.remove(currentFld, 'fs-current');
    classie.add(currentFld, 'fs-hide');

    if (!this.isLastStep) {
      // update nav
      this._updateNav(); // change the current field number/status


      this._updateFieldNumber();

      var nextField = this.fields[this.current];
      classie.add(nextField, 'fs-current');
      classie.add(nextField, 'fs-show');
    } // after animation ends remove added classes from fields


    var self = this,
        onEndAnimationFn = function onEndAnimationFn(ev) {
      if (support.animations) {
        this.removeEventListener(animEndEventName, onEndAnimationFn);
      }

      classie.remove(self.fieldsList, 'fs-display-' + self.navdir);
      classie.remove(currentFld, 'fs-hide');

      if (self.isLastStep) {
        // show the complete form and hide the controls
        self._hideCtrl(self.ctrlNav);

        self._hideCtrl(self.ctrlProgress);

        self._hideCtrl(self.ctrlContinue);

        self._hideCtrl(self.ctrlFldStatus); // replace class fs-form-full with fs-form-overview


        classie.remove(self.formEl, 'fs-form-full');
        classie.add(self.formEl, 'fs-form-overview');
        classie.add(self.formEl, 'fs-show'); // callback

        self.options.onReview();
      } else {
        classie.remove(nextField, 'fs-show');

        if (self.options.ctrlNavPosition) {
          self.ctrlFldStatusCurr.innerHTML = self.ctrlFldStatusNew.innerHTML;
          self.ctrlFldStatus.removeChild(self.ctrlFldStatusNew);
          classie.remove(self.ctrlFldStatus, 'fs-show-' + self.navdir);
        }
      }

      self.isAnimating = false;
    };

    if (support.animations) {
      if (this.navdir === 'next') {
        if (this.isLastStep) {
          currentFld.querySelector('.fs-anim-upper').addEventListener(animEndEventName, onEndAnimationFn);
        } else {
          nextField.querySelector('.fs-anim-lower').addEventListener(animEndEventName, onEndAnimationFn);
        }
      } else {
        nextField.querySelector('.fs-anim-upper').addEventListener(animEndEventName, onEndAnimationFn);
      }
    } else {
      onEndAnimationFn();
    }
  };
  /**
   * showField function
   * jumps to the field at position pos
   */


  FForm.prototype._showField = function (pos) {
    if (pos === this.current || pos < 0 || pos > this.fieldsCount - 1) {
      return false;
    }

    this._nextField(pos);
  };
  /**
   * updateFieldNumber function
   * changes the current field number
   */


  FForm.prototype._updateFieldNumber = function () {
    if (this.options.ctrlNavPosition) {
      // first, create next field number placeholder
      this.ctrlFldStatusNew = document.createElement('span');
      this.ctrlFldStatusNew.className = 'fs-number-new';
      this.ctrlFldStatusNew.innerHTML = Number(this.current + 1); // insert it in the DOM

      this.ctrlFldStatus.appendChild(this.ctrlFldStatusNew); // add class "fs-show-next" or "fs-show-prev" depending on the navigation direction

      var self = this;
      setTimeout(function () {
        classie.add(self.ctrlFldStatus, self.navdir === 'next' ? 'fs-show-next' : 'fs-show-prev');
      }, 25);
    }
  };
  /**
   * progress function
   * updates the progress bar by setting its width
   */


  FForm.prototype._progress = function () {
    if (this.options.ctrlProgress) {
      this.ctrlProgress.style.width = this.current * (100 / this.fieldsCount) + '%';
    }
  };
  /**
   * updateNav function
   * updates the navigation dots
   */


  FForm.prototype._updateNav = function () {
    if (this.options.ctrlNavDots) {
      classie.remove(this.ctrlNav.querySelector('button.fs-dot-current'), 'fs-dot-current');
      classie.add(this.ctrlNavDots[this.current], 'fs-dot-current');
      this.ctrlNavDots[this.current].disabled = false;
    }
  };
  /**
   * showCtrl function
   * shows a control
   */


  FForm.prototype._showCtrl = function (ctrl) {
    classie.add(ctrl, 'fs-show');
  };
  /**
   * hideCtrl function
   * hides a control
   */


  FForm.prototype._hideCtrl = function (ctrl) {
    classie.remove(ctrl, 'fs-show');
  }; // TODO: this is a very basic validation function. Only checks for required fields..


  FForm.prototype._validade = function () {
    var fld = this.fields[this.current],
        input = fld.querySelector('input[required]') || fld.querySelector('textarea[required]') || fld.querySelector('select[required]'),
        error;
    if (!input) return true;

    switch (input.tagName.toLowerCase()) {
      case 'input':
        if (input.type === 'radio' || input.type === 'checkbox') {
          var checked = 0;
          [].slice.call(fld.querySelectorAll('input[type="' + input.type + '"]')).forEach(function (inp) {
            if (inp.checked) {
              ++checked;
            }
          });

          if (!checked) {
            error = 'NOVAL';
          }
        } else if (input.value === '') {
          error = 'NOVAL';
        }

        break;

      case 'select':
        // assuming here '' or '-1' only
        if (input.value === '' || input.value === '-1') {
          error = 'NOVAL';
        }

        break;

      case 'textarea':
        if (input.value === '') {
          error = 'NOVAL';
        }

        break;
    }

    if (error != undefined) {
      this._showError(error);

      return false;
    }

    return true;
  }; // TODO


  FForm.prototype._showError = function (err) {
    var message = '';

    switch (err) {
      case 'NOVAL':
        message = 'Por favor complete este campo antes de continuar';
        break;

      case 'INVALIDEMAIL':
        message = 'Por favor intruduzca una dirección de correo electrónico válido';
        break;
      // ...
    }

    ;
    this.msgError.innerHTML = message;

    this._showCtrl(this.msgError);
  }; // clears/hides the current error message


  FForm.prototype._clearError = function () {
    this._hideCtrl(this.msgError);
  }; // add to global namespace


  window.FForm = FForm;
})(window);
},{}],"../../../Users/Desarrollo/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55754" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../Users/Desarrollo/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/fullscreenForm.js"], null)
//# sourceMappingURL=/fullscreenForm.dd490dde.js.map