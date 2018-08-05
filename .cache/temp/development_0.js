(function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var nprogress = createCommonjsModule(function (module, exports) {
	(function(root, factory) {

	  if (typeof undefined === 'function' && undefined.amd) {
	    undefined(factory);
	  } else {
	    module.exports = factory();
	  }

	})(commonjsGlobal, function() {
	  var NProgress = {};

	  NProgress.version = '0.2.0';

	  var Settings = NProgress.settings = {
	    minimum: 0.08,
	    easing: 'ease',
	    positionUsing: '',
	    speed: 200,
	    trickle: true,
	    trickleRate: 0.02,
	    trickleSpeed: 800,
	    showSpinner: true,
	    barSelector: '[role="bar"]',
	    spinnerSelector: '[role="spinner"]',
	    parent: 'body',
	    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	  };

	  /**
	   * Updates configuration.
	   *
	   *     NProgress.configure({
	   *       minimum: 0.1
	   *     });
	   */
	  NProgress.configure = function(options) {
	    var key, value;
	    for (key in options) {
	      value = options[key];
	      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
	    }

	    return this;
	  };

	  /**
	   * Last number.
	   */

	  NProgress.status = null;

	  /**
	   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
	   *
	   *     NProgress.set(0.4);
	   *     NProgress.set(1.0);
	   */

	  NProgress.set = function(n) {
	    var started = NProgress.isStarted();

	    n = clamp(n, Settings.minimum, 1);
	    NProgress.status = (n === 1 ? null : n);

	    var progress = NProgress.render(!started),
	        bar      = progress.querySelector(Settings.barSelector),
	        speed    = Settings.speed,
	        ease     = Settings.easing;

	    progress.offsetWidth; /* Repaint */

	    queue(function(next) {
	      // Set positionUsing if it hasn't already been set
	      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

	      // Add transition
	      css(bar, barPositionCSS(n, speed, ease));

	      if (n === 1) {
	        // Fade out
	        css(progress, { 
	          transition: 'none', 
	          opacity: 1 
	        });
	        progress.offsetWidth; /* Repaint */

	        setTimeout(function() {
	          css(progress, { 
	            transition: 'all ' + speed + 'ms linear', 
	            opacity: 0 
	          });
	          setTimeout(function() {
	            NProgress.remove();
	            next();
	          }, speed);
	        }, speed);
	      } else {
	        setTimeout(next, speed);
	      }
	    });

	    return this;
	  };

	  NProgress.isStarted = function() {
	    return typeof NProgress.status === 'number';
	  };

	  /**
	   * Shows the progress bar.
	   * This is the same as setting the status to 0%, except that it doesn't go backwards.
	   *
	   *     NProgress.start();
	   *
	   */
	  NProgress.start = function() {
	    if (!NProgress.status) NProgress.set(0);

	    var work = function() {
	      setTimeout(function() {
	        if (!NProgress.status) return;
	        NProgress.trickle();
	        work();
	      }, Settings.trickleSpeed);
	    };

	    if (Settings.trickle) work();

	    return this;
	  };

	  /**
	   * Hides the progress bar.
	   * This is the *sort of* the same as setting the status to 100%, with the
	   * difference being `done()` makes some placebo effect of some realistic motion.
	   *
	   *     NProgress.done();
	   *
	   * If `true` is passed, it will show the progress bar even if its hidden.
	   *
	   *     NProgress.done(true);
	   */

	  NProgress.done = function(force) {
	    if (!force && !NProgress.status) return this;

	    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
	  };

	  /**
	   * Increments by a random amount.
	   */

	  NProgress.inc = function(amount) {
	    var n = NProgress.status;

	    if (!n) {
	      return NProgress.start();
	    } else {
	      if (typeof amount !== 'number') {
	        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
	      }

	      n = clamp(n + amount, 0, 0.994);
	      return NProgress.set(n);
	    }
	  };

	  NProgress.trickle = function() {
	    return NProgress.inc(Math.random() * Settings.trickleRate);
	  };

	  /**
	   * Waits for all supplied jQuery promises and
	   * increases the progress as the promises resolve.
	   *
	   * @param $promise jQUery Promise
	   */
	  (function() {
	    var initial = 0, current = 0;

	    NProgress.promise = function($promise) {
	      if (!$promise || $promise.state() === "resolved") {
	        return this;
	      }

	      if (current === 0) {
	        NProgress.start();
	      }

	      initial++;
	      current++;

	      $promise.always(function() {
	        current--;
	        if (current === 0) {
	            initial = 0;
	            NProgress.done();
	        } else {
	            NProgress.set((initial - current) / initial);
	        }
	      });

	      return this;
	    };

	  })();

	  /**
	   * (Internal) renders the progress bar markup based on the `template`
	   * setting.
	   */

	  NProgress.render = function(fromStart) {
	    if (NProgress.isRendered()) return document.getElementById('nprogress');

	    addClass(document.documentElement, 'nprogress-busy');
	    
	    var progress = document.createElement('div');
	    progress.id = 'nprogress';
	    progress.innerHTML = Settings.template;

	    var bar      = progress.querySelector(Settings.barSelector),
	        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
	        parent   = document.querySelector(Settings.parent),
	        spinner;
	    
	    css(bar, {
	      transition: 'all 0 linear',
	      transform: 'translate3d(' + perc + '%,0,0)'
	    });

	    if (!Settings.showSpinner) {
	      spinner = progress.querySelector(Settings.spinnerSelector);
	      spinner && removeElement(spinner);
	    }

	    if (parent != document.body) {
	      addClass(parent, 'nprogress-custom-parent');
	    }

	    parent.appendChild(progress);
	    return progress;
	  };

	  /**
	   * Removes the element. Opposite of render().
	   */

	  NProgress.remove = function() {
	    removeClass(document.documentElement, 'nprogress-busy');
	    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
	    var progress = document.getElementById('nprogress');
	    progress && removeElement(progress);
	  };

	  /**
	   * Checks if the progress bar is rendered.
	   */

	  NProgress.isRendered = function() {
	    return !!document.getElementById('nprogress');
	  };

	  /**
	   * Determine which positioning CSS rule to use.
	   */

	  NProgress.getPositioningCSS = function() {
	    // Sniff on document.body.style
	    var bodyStyle = document.body.style;

	    // Sniff prefixes
	    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
	                       ('MozTransform' in bodyStyle) ? 'Moz' :
	                       ('msTransform' in bodyStyle) ? 'ms' :
	                       ('OTransform' in bodyStyle) ? 'O' : '';

	    if (vendorPrefix + 'Perspective' in bodyStyle) {
	      // Modern browsers with 3D support, e.g. Webkit, IE10
	      return 'translate3d';
	    } else if (vendorPrefix + 'Transform' in bodyStyle) {
	      // Browsers without 3D support, e.g. IE9
	      return 'translate';
	    } else {
	      // Browsers without translate() support, e.g. IE7-8
	      return 'margin';
	    }
	  };

	  /**
	   * Helpers
	   */

	  function clamp(n, min, max) {
	    if (n < min) return min;
	    if (n > max) return max;
	    return n;
	  }

	  /**
	   * (Internal) converts a percentage (`0..1`) to a bar translateX
	   * percentage (`-100%..0%`).
	   */

	  function toBarPerc(n) {
	    return (-1 + n) * 100;
	  }


	  /**
	   * (Internal) returns the correct CSS for changing the bar's
	   * position given an n percentage, and speed and ease from Settings
	   */

	  function barPositionCSS(n, speed, ease) {
	    var barCSS;

	    if (Settings.positionUsing === 'translate3d') {
	      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
	    } else if (Settings.positionUsing === 'translate') {
	      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
	    } else {
	      barCSS = { 'margin-left': toBarPerc(n)+'%' };
	    }

	    barCSS.transition = 'all '+speed+'ms '+ease;

	    return barCSS;
	  }

	  /**
	   * (Internal) Queues a function to be executed.
	   */

	  var queue = (function() {
	    var pending = [];
	    
	    function next() {
	      var fn = pending.shift();
	      if (fn) {
	        fn(next);
	      }
	    }

	    return function(fn) {
	      pending.push(fn);
	      if (pending.length == 1) next();
	    };
	  })();

	  /**
	   * (Internal) Applies css properties to an element, similar to the jQuery 
	   * css method.
	   *
	   * While this helper does assist with vendor prefixed property names, it 
	   * does not perform any manipulation of values prior to setting styles.
	   */

	  var css = (function() {
	    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
	        cssProps    = {};

	    function camelCase(string) {
	      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
	        return letter.toUpperCase();
	      });
	    }

	    function getVendorProp(name) {
	      var style = document.body.style;
	      if (name in style) return name;

	      var i = cssPrefixes.length,
	          capName = name.charAt(0).toUpperCase() + name.slice(1),
	          vendorName;
	      while (i--) {
	        vendorName = cssPrefixes[i] + capName;
	        if (vendorName in style) return vendorName;
	      }

	      return name;
	    }

	    function getStyleProp(name) {
	      name = camelCase(name);
	      return cssProps[name] || (cssProps[name] = getVendorProp(name));
	    }

	    function applyCss(element, prop, value) {
	      prop = getStyleProp(prop);
	      element.style[prop] = value;
	    }

	    return function(element, properties) {
	      var args = arguments,
	          prop, 
	          value;

	      if (args.length == 2) {
	        for (prop in properties) {
	          value = properties[prop];
	          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
	        }
	      } else {
	        applyCss(element, args[1], args[2]);
	      }
	    }
	  })();

	  /**
	   * (Internal) Determines if an element or space separated list of class names contains a class name.
	   */

	  function hasClass(element, name) {
	    var list = typeof element == 'string' ? element : classList(element);
	    return list.indexOf(' ' + name + ' ') >= 0;
	  }

	  /**
	   * (Internal) Adds a class to an element.
	   */

	  function addClass(element, name) {
	    var oldList = classList(element),
	        newList = oldList + name;

	    if (hasClass(oldList, name)) return; 

	    // Trim the opening space.
	    element.className = newList.substring(1);
	  }

	  /**
	   * (Internal) Removes a class from an element.
	   */

	  function removeClass(element, name) {
	    var oldList = classList(element),
	        newList;

	    if (!hasClass(element, name)) return;

	    // Replace the class name.
	    newList = oldList.replace(' ' + name + ' ', ' ');

	    // Trim the opening and closing spaces.
	    element.className = newList.substring(1, newList.length - 1);
	  }

	  /**
	   * (Internal) Gets a space separated list of the class names on the element. 
	   * The list is wrapped with a single space on each end to facilitate finding 
	   * matches within the list.
	   */

	  function classList(element) {
	    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
	  }

	  /**
	   * (Internal) Removes an element from the DOM.
	   */

	  function removeElement(element) {
	    element && element.parentNode && element.parentNode.removeChild(element);
	  }

	  return NProgress;
	});
	});

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (!css || typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css = "/* Make clicks pass-through */\n#nprogress {\n  pointer-events: none;\n}\n#nprogress .bar {\n  background: #29d;\n\n  position: fixed;\n  z-index: 1031;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 2px;\n}\n/* Fancy blur effect */\n#nprogress .peg {\n  display: block;\n  position: absolute;\n  right: 0px;\n  width: 100px;\n  height: 100%;\n  box-shadow: 0 0 10px #29d, 0 0 5px #29d;\n  opacity: 1.0;\n\n  -webkit-transform: rotate(3deg) translate(0px, -4px);\n          transform: rotate(3deg) translate(0px, -4px);\n}\n/* Remove these to get rid of the spinner */\n#nprogress .spinner {\n  display: block;\n  position: fixed;\n  z-index: 1031;\n  top: 15px;\n  right: 15px;\n}\n#nprogress .spinner-icon {\n  width: 18px;\n  height: 18px;\n  box-sizing: border-box;\n\n  border: solid 2px transparent;\n  border-top-color: #29d;\n  border-left-color: #29d;\n  border-radius: 50%;\n\n  -webkit-animation: nprogress-spinner 400ms linear infinite;\n          animation: nprogress-spinner 400ms linear infinite;\n}\n.nprogress-custom-parent {\n  overflow: hidden;\n  position: relative;\n}\n.nprogress-custom-parent #nprogress .spinner,\n.nprogress-custom-parent #nprogress .bar {\n  position: absolute;\n}\n@-webkit-keyframes nprogress-spinner {\n  0%   { -webkit-transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(360deg); }\n}\n@keyframes nprogress-spinner {\n  0%   { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n}\n\n";
	styleInject(css);

	var css$1 = ".markdown-body {\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n  line-height: 1.6;\n  color: #444;\n  word-wrap: break-word;\n}\n\n.markdown-body a {\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects;\n}\n\n.markdown-body a:active,\n.markdown-body a:hover {\n  outline-width: 0;\n}\n\n.markdown-body strong {\n  font-weight: inherit;\n}\n\n.markdown-body strong {\n  font-weight: bolder;\n}\n\n.markdown-body h1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n  font-weight: normal;\n}\n\n.markdown-body img {\n  border-style: none;\n}\n\n.markdown-body svg:not(:root) {\n  overflow: hidden;\n}\n\n.markdown-body code,\n.markdown-body kbd,\n.markdown-body pre {\n  font-size: 1em;\n}\n\n.markdown-body hr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible;\n}\n\n.markdown-body strong {\n  font-weight: 600;\n}\n\n.markdown-body hr {\n  height: 0;\n  margin: 15px 0;\n  overflow: hidden;\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #dfe2e5;\n}\n\n.markdown-body hr::before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body hr::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body table {\n  border-spacing: 0;\n  border-collapse: collapse;\n}\n\n.markdown-body td,\n.markdown-body th {\n  padding: 0;\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body h2 {\n  font-size: 1.2em;\n  font-weight: normal;\n  padding: 0 0 0 0.6em;\n  border-left: 5px solid #1c88d4;\n}\n\n.markdown-body h3 {\n  font-size: 1.5em;\n  font-weight: normal;\n}\n\n.markdown-body h4 {\n  font-size: 1em;\n  font-weight: 600;\n  color:#888;\n}\n\n.markdown-body h5 {\n  font-size: 0.875em;\n  font-weight: 600;\n  color:#888;\n}\n\n.markdown-body h6 {\n  font-size: 0.875em;\n  font-weight: 600;\n  color:#888;\n}\n\n.markdown-body p {\n  margin-top: 0;\n  margin-bottom: 1em;\n}\n\n.markdown-body blockquote {\n  margin: 0;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding-left: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body ol ol,\n.markdown-body ul ol {\n  list-style-type: lower-roman;\n}\n\n.markdown-body ul ul ol,\n.markdown-body ul ol ol,\n.markdown-body ol ul ol,\n.markdown-body ol ol ol {\n  list-style-type: lower-alpha;\n}\n\n.markdown-body dd {\n  margin-left: 0;\n}\n\n.markdown-body code {\n  font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  font-size: 12px;\n}\n\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  font-size: 12px;\n}\n\n.markdown-body::before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body > *:first-child {\n  margin-top: 0 !important;\n}\n\n.markdown-body > *:last-child {\n  margin-bottom: 0 !important;\n}\n\n.markdown-body a:not([href]) {\n  color: inherit;\n  text-decoration: none;\n}\n\n.markdown-body p,\n.markdown-body blockquote,\n.markdown-body ul,\n.markdown-body ol,\n.markdown-body dl,\n.markdown-body table,\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 1em;\n}\n\n.markdown-body hr {\n  height: 0.25em;\n  padding: 0;\n  margin: 1.5em 0;\n  background-color: #e1e4e8;\n  border: 0;\n}\n\n.markdown-body blockquote {\n  padding: 0 1em;\n  color: #6a737d;\n  border-left: 0.25em solid #dfe2e5;\n}\n\n.markdown-body blockquote > :first-child {\n  margin-top: 0;\n}\n\n.markdown-body blockquote > :last-child {\n  margin-bottom: 0;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font-size: 11px;\n  line-height: 10px;\n  color: #444d56;\n  vertical-align: middle;\n  background-color: #fafbfc;\n  border: solid 1px #c6cbd1;\n  border-bottom-color: #959da5;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #959da5;\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 24px;\n  margin-bottom: 16px;\n  font-weight: normal;\n  line-height: 1.25;\n  word-break: break-all;\n}\n\n.markdown-body h1 {\n  font-size: 2em;\n}\n\n.markdown-body h2 {\n  margin-top: 2.6em;\n  font-size: 1.6em;\n}\n\n.markdown-body h3 {\n  margin-top: 2em;\n  font-size: 1.25em;\n}\n\n.markdown-body h4 {\n  margin-top: 1em;\n  font-size: 1em;\n}\n\n.markdown-body h5 {\n  font-size: 0.875em;\n}\n\n.markdown-body h6 {\n  font-size: 0.85em;\n  color: #6a737d;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding-left: 2em;\n}\n\n.markdown-body ul ul,\n.markdown-body ul ol,\n.markdown-body ol ol,\n.markdown-body ol ul {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body li > p {\n  margin-top: 1em;\n}\n\n.markdown-body li + li {\n  margin-top: 0.25em;\n}\n\n.markdown-body dl {\n  padding: 0;\n}\n\n.markdown-body dl dt {\n  padding: 0;\n  margin-top: 1em;\n  font-size: 1em;\n  font-style: italic;\n  font-weight: 600;\n}\n\n.markdown-body dl dd {\n  padding: 0 16px;\n  margin-bottom: 16px;\n}\n\n.markdown-body table {\n  width: 100%;\n  overflow: auto;\n}\n\n.markdown-body table th {\n  font-weight: 600;\n  text-align: left;\n}\n\n.markdown-body table th,\n.markdown-body table td {\n  padding: 0.7em 1em;\n  border-bottom: 1px solid #dfe2e5;\n}\n\n.markdown-body table tr {\n  background-color: #fff;\n}\n\n.markdown-body img {\n  max-width: 100%;\n  box-sizing: content-box;\n  background-color: #fff;\n}\n\n.markdown-body img[align=right] {\n  padding-left: 20px;\n}\n\n.markdown-body img[align=left] {\n  padding-right: 20px;\n}\n\n.markdown-body code {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 85%;\n  background-color: rgba(27,31,35,0.05);\n  border-radius: 3px;\n}\n\n.markdown-body code::before,\n.markdown-body code::after {\n  letter-spacing: -0.2em;\n  content: \"\\00a0\";\n}\n\n.markdown-body pre {\n  word-wrap: normal;\n}\n\n.markdown-body pre>code {\n  padding: 0;\n  margin: 0;\n  font-size: 100%;\n  word-break: normal;\n  white-space: pre;\n  background: transparent;\n  border: 0;\n}\n\n.markdown-body pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 85%;\n  line-height: 1.45;\n  background-color: #f6f8fa;\n  border-radius: 3px;\n}\n\n.markdown-body pre code {\n  display: inline;\n  max-width: auto;\n  padding: 0;\n  margin: 0;\n  overflow: visible;\n  line-height: inherit;\n  word-wrap: normal;\n  background-color: transparent;\n  border: 0;\n}\n\n.markdown-body pre code::before,\n.markdown-body pre code::after {\n  content: normal;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font: 11px \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  line-height: 10px;\n  color: #444d56;\n  vertical-align: middle;\n  background-color: #fafbfc;\n  border: solid 1px #d1d5da;\n  border-bottom-color: #c6cbd1;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #c6cbd1;\n}\n\n/**\n * responsive\n */\n\n@media screen and (max-width: 600px) {\n  .markdown-body table th,\n  .markdown-body table td {\n    font-size: 0.875em;\n    padding: 0.4em 0.6em;\n  }\n}\n";
	styleInject(css$1);

	var css$2 = ":root {\n  --primary-color: #498ff2;\n  --link-color: #53637a;\n  --text-color: #4f4f4f;\n  --danger-color: #e5675c;\n  --weak-text-color: #999;\n}\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  font: 16px/1.6 Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n\n#root {\n  min-height: 100%;\n}\n\n.navbar {\n  display: flex;\n  line-height: 4;\n  flex-direction: column;\n}\n\n.navbar__item {\n  display: block;\n  text-decoration: none;\n  transition: all 200ms ease;\n  line-height: 3;\n  padding-left: 2em\n}\n\n.navbar__item:hover {\n    background: color(#498ff2 l(95%));\n    background: color(var(--primary-color) l(95%));\n  }\n\n.navbar__item:focus {\n    outline-offset: -0.12em;\n  }\n\n.navbar__item:visited {\n    color: unset;\n  }\n\n.navbar .navbar__item.is-active,\n.navbar .navbar__item.router-link-exact-active {\n  background: #f0f6fe;\n  color: #498ff2;\n  color: var(--primary-color);\n  border-right: 2px solid;\n}\n\n/**\n * content\n */\n\n.markdown-body {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 20px 30px;\n  line-height: 1.8\n}\n\n.markdown-body a {\n    color: #498ff2;\n    color: var(--primary-color);\n  }\n\n.markdown-body:empty {\n    display: none;\n  }\n\n.markdown-body pre .hljs-tag {\n    color: #63a35c;\n  }\n\n.markdown-body h1,\n  .markdown-body h2,\n  .markdown-body h3,\n  .markdown-body h4 {\n    font-weight: 500;\n  }\n\n.markdown-body table {\n    min-width: 61.8%;\n  }\n\n/* scrollbar */\n\n::-webkit-scrollbar {\n  background-color: transparent;\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-thumb {\n  background-color: rgba(50, 50, 50, 0.65);\n  background-repeat: no-repeat;\n  background-position: center center;\n  border-radius: 3px;\n}\n\n.vue-demo-block .vue-demo {\n  margin: 30px 0 15px;\n}\n";
	styleInject(css$2);

	var $0_0 = {
	  install: function install(Vue) {}
	};

	var css$3 = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nbody {\n  background-color: #fff;\n}\n\n.app {\n  width: 100%;\n  height: 100%;\n  color: #444;\n}\n\n.navbar {\n  box-sizing: border-box;\n  border-right: 1px solid #f0f0f0\n}\n\n.navbar .site-title {\n    font: 28px/1.4 fantasy;\n    margin: 16px 0 6px;\n    text-align: center;\n    cursor: pointer;\n    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  }\n\n.navbar a {\n    color: #444;\n  }\n\n@media screen and (min-width: 720px) {\n  .navbar {\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    width: 200px;\n  }\n  .main {\n    margin-left: 200px;\n  }\n}\n";
	styleInject(css$3);

	var defaultLayout = {
	  render: function render() {
	    var _vm = this;

	    var _h = _vm.$createElement;

	    var _c = _vm._self._c || _h;

	    return _c('div', {
	      staticClass: "app"
	    }, [_c('div', {
	      staticClass: "navbar"
	    }, [_c('router-link', {
	      staticClass: "site-title",
	      attrs: {
	        "tag": "div",
	        "to": "/"
	      }
	    }, [_vm._v("data mining")]), _vm._l(_vm.pages, function (page, index) {
	      return _c('router-link', {
	        key: index,
	        staticClass: "navbar__item",
	        attrs: {
	          "to": page.path
	        }
	      }, [_vm._v(_vm._s(page.title))]);
	    })], 2), _c('div', {
	      staticClass: "main"
	    }, [_c('router-view')], 1)]);
	  },
	  staticRenderFns: [],
	  computed: {
	    currentPage: function currentPage() {
	      var path = this.$route.path;
	      return this.pages.filter(function (page) {
	        return page.path === path;
	      })[0];
	    }
	  },
	  created: function created() {
	    this.pages = this.$pages.sort(function (a, b) {
	      return a.index - b.index;
	    });
	  }
	};

	var $1_1 = Object.assign({
	  name: 'error'
	}, defaultLayout);

	var pluginReqs = function () {
	  var map = {
	    './index.js': $0_0
	  };

	  var req = function req(key) {
	    return map[key] || function () {
	      throw new Error("Cannot find module '" + key + "'.");
	    }();
	  };

	  req.keys = function () {
	    return Object.keys(map);
	  };

	  return req;
	}();

	var layoutReqs = function () {
	  var map = {
	    './default.vue': defaultLayout,
	    './error.vue': $1_1
	  };

	  var req = function req(key) {
	    return map[key] || function () {
	      throw new Error("Cannot find module '" + key + "'.");
	    }();
	  };

	  req.keys = function () {
	    return Object.keys(map);
	  };

	  return req;
	}();

	var getModule = function getModule(module) {
	  return module.__esModule && module.default || module;
	};

	var entry = {
	  install: function install(Vue) {
	    Vue.prototype.$nprogress = nprogress;
	    pluginReqs.keys().forEach(function (key) {
	      Vue.use(getModule(pluginReqs(key)));
	    });
	    layoutReqs.keys().forEach(function (key) {
	      var module = getModule(layoutReqs(key));
	      var name = module.name;

	      if (!name) {
	        var arr = key.split(/\/|\\/);
	        var basename = arr[arr.length - 1];
	        name = basename.replace(/\.vue$/, '');
	      }

	      Vue.component("layout-".concat(name), module);
	    }); // fallback

	    if (!Vue.component('layout-default')) {
	      Vue.component('layout-default', {
	        render: function render(h) {
	          return h('router-view');
	        }
	      });
	    }
	  }
	};

	if (typeof window !== 'undefined' && window.createApp) {
	  window.createApp.use(entry);
	}

	if (typeof module !== 'undefined') {
	  module.exports = entry;
	}

}());
