/**
 * 跨浏览器人机验证控件 - ASP.NET版本
 * 兼容: IE8+, Chrome, Firefox, Safari, Edge
 * 纯JavaScript实现，无框架依赖
 * 
 * 使用方法:
 * var widget = new CrossBrowserHumanCheck('containerId', {
 *   onVerificationComplete: function(isVerified) {
 *     console.log('验证结果:', isVerified);
 *   }
 * });
 */

(function(window, document) {
  'use strict';

  // 跨浏览器兼容工具函数
  var BrowserUtils = {
    // 浏览器检测
    browser: {
      isIE: (function() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || 
               navigator.userAgent.indexOf('Trident') !== -1;
      })(),
      isIE8: (function() {
        return navigator.userAgent.indexOf('MSIE 8') !== -1;
      })(),
      isChrome: (function() {
        return navigator.userAgent.indexOf('Chrome') !== -1;
      })(),
      isFirefox: (function() {
        return navigator.userAgent.indexOf('Firefox') !== -1;
      })()
    },

    // 跨浏览器事件处理
    addEvent: function(element, event, handler) {
      if (element.addEventListener) {
        // 现代浏览器 (Chrome, Firefox, IE9+)
        element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
        // IE8
        element.attachEvent('on' + event, handler);
      } else {
        // 备用方案
        element['on' + event] = handler;
      }
    },
    
    removeEvent: function(element, event, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(event, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent('on' + event, handler);
      } else {
        element['on' + event] = null;
      }
    },
    
    // 获取事件对象 (IE8兼容)
    getEvent: function(e) {
      return e || window.event;
    },
    
    // 获取事件目标元素
    getTarget: function(e) {
      return e.target || e.srcElement;
    },
    
    // 阻止默认事件
    preventDefault: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },
    
    // 获取鼠标位置 (兼容所有浏览器)
    getMousePosition: function(e) {
      var event = this.getEvent(e);
      return {
        x: event.clientX || event.pageX || 0,
        y: event.clientY || event.pageY || 0
      };
    },
    
    // 获取元素位置 (兼容IE8)
    getElementPosition: function(element) {
      var rect = {left: 0, top: 0, width: 0, height: 0};
      
      if (element.getBoundingClientRect) {
        // 现代浏览器
        var clientRect = element.getBoundingClientRect();
        rect = {
          left: clientRect.left + (document.documentElement.scrollLeft || document.body.scrollLeft || 0),
          top: clientRect.top + (document.documentElement.scrollTop || document.body.scrollTop || 0),
          width: clientRect.width || element.offsetWidth,
          height: clientRect.height || element.offsetHeight
        };
      } else {
        // IE8备用方案
        var obj = element;
        while (obj) {
          rect.left += obj.offsetLeft;
          rect.top += obj.offsetTop;
          obj = obj.offsetParent;
        }
        rect.width = element.offsetWidth;
        rect.height = element.offsetHeight;
      }
      
      return rect;
    },
    
    // CSS类操作 (IE8兼容)
    addClass: function(element, className) {
      if (element.classList) {
        // 现代浏览器
        element.classList.add(className);
      } else {
        // IE8
        var classes = element.className ? element.className.split(' ') : [];
        if (this.indexOf(classes, className) === -1) {
          classes.push(className);
          element.className = classes.join(' ');
        }
      }
    },
    
    removeClass: function(element, className) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        var classes = element.className ? element.className.split(' ') : [];
        var index = this.indexOf(classes, className);
        if (index !== -1) {
          classes.splice(index, 1);
          element.className = classes.join(' ');
        }
      }
    },
    
    hasClass: function(element, className) {
      if (element.classList) {
        return element.classList.contains(className);
      } else {
        var classes = element.className ? element.className.split(' ') : [];
        return this.indexOf(classes, className) !== -1;
      }
    },
    
    // Array.indexOf兼容 (IE8没有)
    indexOf: function(array, item) {
      if (array.indexOf) {
        return array.indexOf(item);
      } else {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === item) {
            return i;
          }
        }
        return -1;
      }
    },
    
    // querySelector兼容 (IE8部分支持)
    querySelector: function(parent, selector) {
      if (parent.querySelector) {
        return parent.querySelector(selector);
      } else {
        // IE8备用方案 - 简单的类名和ID选择器
        if (selector.charAt(0) === '#') {
          return document.getElementById(selector.substring(1));
        } else if (selector.charAt(0) === '.') {
          var className = selector.substring(1);
          var elements = parent.getElementsByTagName('*');
          for (var i = 0; i < elements.length; i++) {
            if (this.hasClass(elements[i], className)) {
              return elements[i];
            }
          }
        }
        return null;
      }
    },
    
    querySelectorAll: function(parent, selector) {
      if (parent.querySelectorAll) {
        return parent.querySelectorAll(selector);
      } else {
        // IE8备用方案
        var results = [];
        if (selector.charAt(0) === '.') {
          var className = selector.substring(1);
          var elements = parent.getElementsByTagName('*');
          for (var i = 0; i < elements.length; i++) {
            if (this.hasClass(elements[i], className)) {
              results.push(elements[i]);
            }
          }
        }
        return results;
      }
    },
    
    // 设置透明度 (IE8兼容)
    setOpacity: function(element, opacity) {
      if (element.style.opacity !== undefined) {
        // 现代浏览器
        element.style.opacity = opacity;
      } else {
        // IE8
        element.style.filter = 'alpha(opacity=' + Math.round(opacity * 100) + ')';
      }
    },

    // 生成唯一ID
    generateId: function() {
      return 'hc_' + Math.random().toString(36).substr(2, 9);
    }
  };

  // 人机验证控件构造函数
  function CrossBrowserHumanCheck(containerId, options) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = options || {};
    this.isVerified = false;
    this.currentMode = 'slider';
    this.sliderValue = 0;
    this.isDragging = false;
    this.mathProblem = { a: 0, b: 0, answer: 0 };
    this.patternClicks = [];
    this.requiredPattern = [1, 3, 5];
    this.uniqueId = BrowserUtils.generateId();
    
    if (!this.container) {
      throw new Error('容器元素不存在: ' + containerId);
    }
    
    this.init();
  }

  // 初始化控件
  CrossBrowserHumanCheck.prototype.init = function() {
    this.generateMathProblem();
    this.addStyles();
    this.render();
    this.bindEvents();
  };

  // 生成数学题
  CrossBrowserHumanCheck.prototype.generateMathProblem = function() {
    this.mathProblem.a = Math.floor(Math.random() * 10) + 1;
    this.mathProblem.b = Math.floor(Math.random() * 10) + 1;
    this.mathProblem.answer = this.mathProblem.a + this.mathProblem.b;
  };

  // 添加跨浏览器兼容样式
  CrossBrowserHumanCheck.prototype.addStyles = function() {
    var styleId = 'cross-browser-human-check-styles';
    if (document.getElementById(styleId)) return;
    
    var css = [
      '/* 跨浏览器人机验证控件样式 */',
      '.cb-human-check-widget {',
      '  background: #ffffff;',
      '  border: 2px solid #e2e8f0;',
      '  font-family: "Microsoft YaHei", "Segoe UI", Arial, sans-serif;',
      '  max-width: 350px;',
      '  margin: 0 auto;',
      '  position: relative;',
      '  padding: 20px;',
      '  /* IE8兼容的圆角 */',
      '  border-radius: 8px;',
      '  -moz-border-radius: 8px;',
      '  -webkit-border-radius: 8px;',
      '  /* IE8兼容的阴影 */',
      '  box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      '  -moz-box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      '  -webkit-box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      '  filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=135, Strength=4);',
      '}',
      '',
      '.cb-header {',
      '  margin-bottom: 16px;',
      '  *zoom: 1;',
      '}',
      '.cb-header:after {',
      '  content: "";',
      '  display: table;',
      '  clear: both;',
      '}',
      '',
      '.cb-title {',
      '  float: left;',
      '  font-weight: bold;',
      '  font-size: 15px;',
      '  color: #1f2937;',
      '}',
      '',
      '.cb-switch-btn {',
      '  float: right;',
      '  background: none;',
      '  border: none;',
      '  cursor: pointer;',
      '  font-size: 16px;',
      '  padding: 4px;',
      '  color: #6b7280;',
      '  border-radius: 3px;',
      '}',
      '.cb-switch-btn:hover {',
      '  color: #374151;',
      '  background: #f3f4f6;',
      '}',
      '',
      '.cb-instruction {',
      '  font-size: 13px;',
      '  color: #6b7280;',
      '  margin-bottom: 12px;',
      '  margin-top: 0;',
      '}',
      '',
      '/* 滑块样式 */',
      '.cb-slider-container {',
      '  position: relative;',
      '}',
      '',
      '.cb-slider-track {',
      '  background: #f1f5f9;',
      '  border: 1px solid #e2e8f0;',
      '  height: 42px;',
      '  position: relative;',
      '  cursor: pointer;',
      '  /* 跨浏览器圆角 */',
      '  border-radius: 21px;',
      '  -moz-border-radius: 21px;',
      '  -webkit-border-radius: 21px;',
      '}',
      '',
      '.cb-slider-thumb {',
      '  background: #22c55e;',
      '  height: 38px;',
      '  width: 38px;',
      '  position: absolute;',
      '  top: 2px;',
      '  left: 2px;',
      '  cursor: pointer;',
      '  text-align: center;',
      '  line-height: 38px;',
      '  color: white;',
      '  font-size: 16px;',
      '  font-weight: bold;',
      '  user-select: none;',
      '  -moz-user-select: none;',
      '  -webkit-user-select: none;',
      '  -ms-user-select: none;',
      '  /* 跨浏览器圆角 */',
      '  border-radius: 19px;',
      '  -moz-border-radius: 19px;',
      '  -webkit-border-radius: 19px;',
      '  /* 跨浏览器过渡效果 */',
      '  transition: left 0.2s ease;',
      '  -moz-transition: left 0.2s ease;',
      '  -webkit-transition: left 0.2s ease;',
      '  -o-transition: left 0.2s ease;',
      '}',
      '',
      '.cb-slider-text {',
      '  position: absolute;',
      '  top: 50%;',
      '  left: 50%;',
      '  margin-top: -8px;',
      '  margin-left: -35px;',
      '  font-size: 13px;',
      '  color: #6b7280;',
      '  pointer-events: none;',
      '  width: 70px;',
      '  text-align: center;',
      '}',
      '',
      '/* 数学题样式 */',
      '.cb-math-container {',
      '  text-align: center;',
      '}',
      '',
      '.cb-math-problem {',
      '  font-size: 20px;',
      '  font-weight: bold;',
      '  margin-bottom: 15px;',
      '  color: #1f2937;',
      '}',
      '',
      '.cb-math-input-group {',
      '  *zoom: 1;',
      '}',
      '.cb-math-input-group:after {',
      '  content: "";',
      '  display: table;',
      '  clear: both;',
      '}',
      '',
      '.cb-math-input {',
      '  width: 70px;',
      '  padding: 10px;',
      '  border: 1px solid #e2e8f0;',
      '  text-align: center;',
      '  margin-right: 10px;',
      '  float: left;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '  font-size: 14px;',
      '}',
      '',
      '.cb-math-submit-btn {',
      '  padding: 10px 16px;',
      '  background: #22c55e;',
      '  color: white;',
      '  border: none;',
      '  cursor: pointer;',
      '  float: left;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '  font-size: 14px;',
      '}',
      '.cb-math-submit-btn:hover {',
      '  background: #16a34a;',
      '}',
      '',
      '/* 模式点击样式 */',
      '.cb-pattern-container {',
      '  *zoom: 1;',
      '}',
      '.cb-pattern-container:after {',
      '  content: "";',
      '  display: table;',
      '  clear: both;',
      '}',
      '',
      '.cb-pattern-btn {',
      '  width: 16%;',
      '  height: 50px;',
      '  margin: 1%;',
      '  border: 2px solid #e2e8f0;',
      '  background: #f1f5f9;',
      '  cursor: pointer;',
      '  font-size: 16px;',
      '  font-weight: bold;',
      '  float: left;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '}',
      '.cb-pattern-btn:hover {',
      '  background: #e2e8f0;',
      '}',
      '.cb-pattern-btn.selected {',
      '  background: #22c55e;',
      '  border-color: #22c55e;',
      '  color: white;',
      '}',
      '',
      '/* 状态样式 */',
      '.cb-status {',
      '  text-align: center;',
      '  margin-top: 16px;',
      '  padding-top: 16px;',
      '  border-top: 1px solid #e2e8f0;',
      '  font-size: 13px;',
      '  color: #6b7280;',
      '}',
      '',
      '.cb-status.success {',
      '  color: #22c55e;',
      '}',
      '',
      '.cb-status.error {',
      '  color: #ef4444;',
      '}',
      '',
      '/* 反馈消息 */',
      '.cb-feedback {',
      '  margin-top: 12px;',
      '  padding: 10px;',
      '  text-align: center;',
      '  font-size: 13px;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '  display: none;',
      '}',
      '',
      '.cb-feedback.success {',
      '  background: #22c55e;',
      '  color: white;',
      '}',
      '',
      '.cb-feedback.error {',
      '  background: #ef4444;',
      '  color: white;',
      '}',
      '',
      '/* 重置按钮 */',
      '.cb-reset-btn {',
      '  width: 100%;',
      '  margin-top: 12px;',
      '  padding: 10px;',
      '  background: #f8fafc;',
      '  border: 1px solid #e2e8f0;',
      '  cursor: pointer;',
      '  font-size: 13px;',
      '  color: #6b7280;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '  display: none;',
      '}',
      '.cb-reset-btn:hover {',
      '  background: #f1f5f9;',
      '}'
    ].join('\n');
    
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = styleId;
    
    if (style.styleSheet) {
      // IE8
      style.styleSheet.cssText = css;
    } else {
      // 现代浏览器
      style.appendChild(document.createTextNode(css));
    }
    
    document.getElementsByTagName('head')[0].appendChild(style);
  };

  // 渲染控件HTML
  CrossBrowserHumanCheck.prototype.render = function() {
    var html = [
      '<div class="cb-human-check-widget">',
        '<div class="cb-header">',
          '<div class="cb-title">🛡️ 人机验证</div>',
          '<button class="cb-switch-btn" title="切换验证方式">⟲</button>',
        '</div>',
        '<div class="cb-content">',
          this.renderModeContent(),
        '</div>',
        '<div class="cb-status">🛡️ 等待验证</div>',
        '<div class="cb-feedback"></div>',
        '<button class="cb-reset-btn">重新验证</button>',
      '</div>'
    ].join('');
    
    this.container.innerHTML = html;
  };

  // 渲染不同模式的内容
  CrossBrowserHumanCheck.prototype.renderModeContent = function() {
    switch (this.currentMode) {
      case 'slider':
        return [
          '<div class="cb-mode-content">',
            '<p class="cb-instruction">拖动滑块完成验证</p>',
            '<div class="cb-slider-container">',
              '<div class="cb-slider-track">',
                '<div class="cb-slider-thumb">→</div>',
                '<div class="cb-slider-text">向右滑动</div>',
              '</div>',
            '</div>',
          '</div>'
        ].join('');
        
      case 'math':
        return [
          '<div class="cb-mode-content">',
            '<p class="cb-instruction">请计算下面的数学题</p>',
            '<div class="cb-math-container">',
              '<div class="cb-math-problem">' + this.mathProblem.a + ' + ' + this.mathProblem.b + ' = ?</div>',
              '<div class="cb-math-input-group">',
                '<input type="text" class="cb-math-input" placeholder="答案" maxlength="3">',
                '<button class="cb-math-submit-btn">确认</button>',
              '</div>',
            '</div>',
          '</div>'
        ].join('');
        
      case 'pattern':
        var buttons = '';
        for (var i = 1; i <= 6; i++) {
          buttons += '<button class="cb-pattern-btn" data-index="' + i + '">' + i + '</button>';
        }
        return [
          '<div class="cb-mode-content">',
            '<p class="cb-instruction">请按顺序点击第1、3、5个方块</p>',
            '<div class="cb-pattern-container">',
              buttons,
            '</div>',
          '</div>'
        ].join('');
        
      default:
        return '';
    }
  };

  // 绑定事件
  CrossBrowserHumanCheck.prototype.bindEvents = function() {
    var self = this;
    
    // 切换模式按钮
    var switchBtn = BrowserUtils.querySelector(this.container, '.cb-switch-btn');
    if (switchBtn) {
      BrowserUtils.addEvent(switchBtn, 'click', function(e) {
        BrowserUtils.preventDefault(e);
        self.switchMode();
      });
    }
    
    // 重置按钮
    var resetBtn = BrowserUtils.querySelector(this.container, '.cb-reset-btn');
    if (resetBtn) {
      BrowserUtils.addEvent(resetBtn, 'click', function(e) {
        BrowserUtils.preventDefault(e);
        self.reset();
      });
    }
    
    this.bindModeEvents();
  };

  // 绑定当前模式的事件
  CrossBrowserHumanCheck.prototype.bindModeEvents = function() {
    var self = this;
    
    switch (this.currentMode) {
      case 'slider':
        this.bindSliderEvents();
        break;
        
      case 'math':
        var submitBtn = BrowserUtils.querySelector(this.container, '.cb-math-submit-btn');
        var input = BrowserUtils.querySelector(this.container, '.cb-math-input');
        
        if (submitBtn) {
          BrowserUtils.addEvent(submitBtn, 'click', function(e) {
            BrowserUtils.preventDefault(e);
            self.checkMathAnswer();
          });
        }
        
        if (input) {
          BrowserUtils.addEvent(input, 'keypress', function(e) {
            var event = BrowserUtils.getEvent(e);
            if (event.keyCode === 13) {
              BrowserUtils.preventDefault(e);
              self.checkMathAnswer();
            }
          });
        }
        break;
        
      case 'pattern':
        var buttons = BrowserUtils.querySelectorAll(this.container, '.cb-pattern-btn');
        for (var i = 0; i < buttons.length; i++) {
          (function(btn) {
            BrowserUtils.addEvent(btn, 'click', function(e) {
              BrowserUtils.preventDefault(e);
              self.handlePatternClick(btn);
            });
          })(buttons[i]);
        }
        break;
    }
  };

  // 滑块事件绑定
  CrossBrowserHumanCheck.prototype.bindSliderEvents = function() {
    var self = this;
    var thumb = BrowserUtils.querySelector(this.container, '.cb-slider-thumb');
    
    if (!thumb) return;
    
    // 鼠标按下
    BrowserUtils.addEvent(thumb, 'mousedown', function(e) {
      if (self.isVerified) return;
      
      var event = BrowserUtils.getEvent(e);
      self.isDragging = true;
      BrowserUtils.preventDefault(event);
      
      // 添加全局鼠标事件
      self.addGlobalMouseEvents();
    });
    
    // 触摸事件支持 (移动设备)
    if ('ontouchstart' in window) {
      BrowserUtils.addEvent(thumb, 'touchstart', function(e) {
        if (self.isVerified) return;
        self.isDragging = true;
        self.addGlobalTouchEvents();
      });
    }
  };
  
  // 添加全局鼠标事件
  CrossBrowserHumanCheck.prototype.addGlobalMouseEvents = function() {
    var self = this;
    
    var mouseMoveHandler = function(e) {
      if (self.isDragging && !self.isVerified) {
        self.updateSlider(e);
      }
    };
    
    var mouseUpHandler = function(e) {
      if (self.isDragging) {
        self.isDragging = false;
        self.removeGlobalMouseEvents(mouseMoveHandler, mouseUpHandler);
        
        if (self.sliderValue < 95 && !self.isVerified) {
          setTimeout(function() {
            self.resetSlider();
          }, 500);
          self.showFeedback('请将滑块拖到最右边', false);
        }
      }
    };
    
    BrowserUtils.addEvent(document, 'mousemove', mouseMoveHandler);
    BrowserUtils.addEvent(document, 'mouseup', mouseUpHandler);
    
    // 存储处理器引用以便后续移除
    this._mouseMoveHandler = mouseMoveHandler;
    this._mouseUpHandler = mouseUpHandler;
  };
  
  // 移除全局鼠标事件
  CrossBrowserHumanCheck.prototype.removeGlobalMouseEvents = function(moveHandler, upHandler) {
    BrowserUtils.removeEvent(document, 'mousemove', moveHandler || this._mouseMoveHandler);
    BrowserUtils.removeEvent(document, 'mouseup', upHandler || this._mouseUpHandler);
  };
  
  // 添加全局触摸事件
  CrossBrowserHumanCheck.prototype.addGlobalTouchEvents = function() {
    var self = this;
    
    var touchMoveHandler = function(e) {
      if (self.isDragging && !self.isVerified) {
        BrowserUtils.preventDefault(e);
        self.updateSlider(e.touches[0]);
      }
    };
    
    var touchEndHandler = function(e) {
      if (self.isDragging) {
        self.isDragging = false;
        self.removeGlobalTouchEvents(touchMoveHandler, touchEndHandler);
        
        if (self.sliderValue < 95 && !self.isVerified) {
          setTimeout(function() {
            self.resetSlider();
          }, 500);
          self.showFeedback('请将滑块拖到最右边', false);
        }
      }
    };
    
    BrowserUtils.addEvent(document, 'touchmove', touchMoveHandler);
    BrowserUtils.addEvent(document, 'touchend', touchEndHandler);
    
    this._touchMoveHandler = touchMoveHandler;
    this._touchEndHandler = touchEndHandler;
  };
  
  // 移除全局触摸事件
  CrossBrowserHumanCheck.prototype.removeGlobalTouchEvents = function(moveHandler, endHandler) {
    BrowserUtils.removeEvent(document, 'touchmove', moveHandler || this._touchMoveHandler);
    BrowserUtils.removeEvent(document, 'touchend', endHandler || this._touchEndHandler);
  };

  // 更新滑块位置
  CrossBrowserHumanCheck.prototype.updateSlider = function(eventOrTouch) {
    var track = BrowserUtils.querySelector(this.container, '.cb-slider-track');
    var thumb = BrowserUtils.querySelector(this.container, '.cb-slider-thumb');
    
    if (!track || !thumb) return;
    
    var trackPos = BrowserUtils.getElementPosition(track);
    var mousePos = BrowserUtils.getMousePosition(eventOrTouch);
    
    var newValue = Math.max(0, Math.min(100, ((mousePos.x - trackPos.left) / trackPos.width) * 100));
    
    this.sliderValue = newValue;
    
    // 限制滑块位置，防止超出轨道
    var maxLeft = Math.min(newValue, 88);
    thumb.style.left = maxLeft + '%';
    
    if (newValue >= 95) {
      this.completeVerification(true);
    }
  };

  // 重置滑块
  CrossBrowserHumanCheck.prototype.resetSlider = function() {
    var thumb = BrowserUtils.querySelector(this.container, '.cb-slider-thumb');
    if (thumb) {
      this.sliderValue = 0;
      thumb.style.left = '2px';
    }
  };

  // 检查数学答案
  CrossBrowserHumanCheck.prototype.checkMathAnswer = function() {
    var input = BrowserUtils.querySelector(this.container, '.cb-math-input');
    if (!input) return;
    
    var answer = parseInt(input.value, 10);
    
    if (answer === this.mathProblem.answer) {
      this.completeVerification(true);
    } else {
      this.showFeedback('答案错误，请重试', false);
      input.value = '';
      this.generateMathProblem();
      this.updateMathProblem();
    }
  };

  // 更新数学题显示
  CrossBrowserHumanCheck.prototype.updateMathProblem = function() {
    var problemDiv = BrowserUtils.querySelector(this.container, '.cb-math-problem');
    if (problemDiv) {
      problemDiv.innerHTML = this.mathProblem.a + ' + ' + this.mathProblem.b + ' = ?';
    }
  };

  // 处理模式点击
  CrossBrowserHumanCheck.prototype.handlePatternClick = function(button) {
    if (this.isVerified) return;
    
    var index = parseInt(button.getAttribute('data-index'), 10);
    this.patternClicks.push(index);
    BrowserUtils.addClass(button, 'selected');
    
    if (this.patternClicks.length === this.requiredPattern.length) {
      var isCorrect = true;
      for (var i = 0; i < this.requiredPattern.length; i++) {
        if (this.patternClicks[i] !== this.requiredPattern[i]) {
          isCorrect = false;
          break;
        }
      }
      
      if (isCorrect) {
        this.completeVerification(true);
      } else {
        this.showFeedback('点击顺序错误，请按照要求重试', false);
        this.resetPattern();
      }
    }
  };

  // 重置模式点击
  CrossBrowserHumanCheck.prototype.resetPattern = function() {
    var buttons = BrowserUtils.querySelectorAll(this.container, '.cb-pattern-btn');
    for (var i = 0; i < buttons.length; i++) {
      BrowserUtils.removeClass(buttons[i], 'selected');
    }
    this.patternClicks = [];
  };

  // 完成验证
  CrossBrowserHumanCheck.prototype.completeVerification = function(success) {
    this.isVerified = success;
    this.updateStatus(success ? 'success' : 'error');
    
    if (success) {
      this.showFeedback('验证成功！', true);
      this.showResetButton();
      
      // 回调函数
      if (this.options.onVerificationComplete) {
        try {
          this.options.onVerificationComplete(true);
        } catch (e) {
          if (window.console && console.error) {
            console.error('验证回调函数执行错误:', e);
          }
        }
      }
    }
  };

  // 更新状态显示
  CrossBrowserHumanCheck.prototype.updateStatus = function(status) {
    var statusDiv = BrowserUtils.querySelector(this.container, '.cb-status');
    if (!statusDiv) return;
    
    BrowserUtils.removeClass(statusDiv, 'success');
    BrowserUtils.removeClass(statusDiv, 'error');
    
    switch (status) {
      case 'success':
        statusDiv.innerHTML = '✅ 验证成功';
        BrowserUtils.addClass(statusDiv, 'success');
        break;
      case 'error':
        statusDiv.innerHTML = '❌ 验证失败';
        BrowserUtils.addClass(statusDiv, 'error');
        break;
      default:
        statusDiv.innerHTML = '🛡️ 等待验证';
    }
  };

  // 显示反馈消息
  CrossBrowserHumanCheck.prototype.showFeedback = function(message, isSuccess) {
    var feedback = BrowserUtils.querySelector(this.container, '.cb-feedback');
    if (!feedback) return;
    
    feedback.innerHTML = message;
    feedback.className = 'cb-feedback ' + (isSuccess ? 'success' : 'error');
    feedback.style.display = 'block';
    
    setTimeout(function() {
      feedback.style.display = 'none';
    }, 3000);
  };

  // 显示重置按钮
  CrossBrowserHumanCheck.prototype.showResetButton = function() {
    var resetBtn = BrowserUtils.querySelector(this.container, '.cb-reset-btn');
    if (resetBtn) {
      resetBtn.style.display = 'block';
    }
  };

  // 切换模式
  CrossBrowserHumanCheck.prototype.switchMode = function() {
    var modes = ['slider', 'math', 'pattern'];
    var currentIndex = BrowserUtils.indexOf(modes, this.currentMode);
    this.currentMode = modes[(currentIndex + 1) % modes.length];
    this.reset();
  };

  // 重置验证
  CrossBrowserHumanCheck.prototype.reset = function() {
    // 清理全局事件
    this.removeGlobalMouseEvents();
    this.removeGlobalTouchEvents();
    
    this.isVerified = false;
    this.isDragging = false;
    this.sliderValue = 0;
    this.patternClicks = [];
    this.generateMathProblem();
    
    var content = BrowserUtils.querySelector(this.container, '.cb-content');
    if (content) {
      content.innerHTML = this.renderModeContent();
    }
    
    var feedback = BrowserUtils.querySelector(this.container, '.cb-feedback');
    if (feedback) {
      feedback.style.display = 'none';
    }
    
    var resetBtn = BrowserUtils.querySelector(this.container, '.cb-reset-btn');
    if (resetBtn) {
      resetBtn.style.display = 'none';
    }
    
    this.updateStatus('waiting');
    this.bindModeEvents();
  };

  // 销毁控件
  CrossBrowserHumanCheck.prototype.destroy = function() {
    // 清理全局事件
    this.removeGlobalMouseEvents();
    this.removeGlobalTouchEvents();
    
    // 清空容器
    if (this.container) {
      this.container.innerHTML = '';
    }
  };

  // 暴露到全局 (兼容不同模块系统)
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = CrossBrowserHumanCheck;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
      return CrossBrowserHumanCheck;
    });
  } else {
    // 全局变量
    window.CrossBrowserHumanCheck = CrossBrowserHumanCheck;
    // 兼容旧版本命名
    window.HumanCheckWidget = CrossBrowserHumanCheck;
  }

})(window, document);