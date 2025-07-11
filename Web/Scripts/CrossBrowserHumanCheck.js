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
    this.requiredPattern = this.generateRandomPattern();
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

  // 生成随机模式序列
  CrossBrowserHumanCheck.prototype.generateRandomPattern = function() {
    var numbers = [];
    // 从1-6中随机选择3个不重复的数字
    var available = [1, 2, 3, 4, 5, 6];
    for (var i = 0; i < 3; i++) {
      var randomIndex = Math.floor(Math.random() * available.length);
      numbers.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
    // 按升序排列
    numbers.sort(function(a, b) { return a - b; });
    return numbers;
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
      '  background: #f3f4f6;',
      '  border: 1px solid #e2e8f0;',
      '  padding: 8px 12px;',
      '  margin-top: 12px;',
      '  border-radius: 4px;',
      '  -moz-border-radius: 4px;',
      '  -webkit-border-radius: 4px;',
      '  font-size: 13px;',
      '  text-align: center;',
      '  color: #6b7280;',
      '}',
      '',
      '.cb-feedback.success {',
      '  background: #dcfce7;',
      '  border-color: #22c55e;',
      '  color: #166534;',
      '}',
      '',
      '.cb-feedback.error {',
      '  background: #fef2f2;',
      '  border-color: #ef4444;',
      '  color: #991b1b;',
      '}'
    ];

    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = styleId;
    
    if (style.styleSheet) {
      // IE8
      style.styleSheet.cssText = css.join('\n');
    } else {
      // 现代浏览器
      style.appendChild(document.createTextNode(css.join('\n')));
    }
    
    document.head.appendChild(style);
  };

  // 渲染控件
  CrossBrowserHumanCheck.prototype.render = function() {
    var html = [
      '<div class="cb-human-check-widget">',
      '  <div class="cb-header">',
      '    <span class="cb-title">请完成人机验证</span>',
      '    <button type="button" class="cb-switch-btn" id="switch_' + this.uniqueId + '">🔄</button>',
      '  </div>',
      '  <div class="cb-content" id="content_' + this.uniqueId + '">',
      '    ' + this.renderCurrentMode(),
      '  </div>',
      '  <div class="cb-status" id="status_' + this.uniqueId + '">',
      '    请完成上述验证操作',
      '  </div>',
      '</div>'
    ].join('');
    
    this.container.innerHTML = html;
  };

  // 渲染当前模式
  CrossBrowserHumanCheck.prototype.renderCurrentMode = function() {
    switch (this.currentMode) {
      case 'slider':
        return this.renderSliderMode();
      case 'math':
        return this.renderMathMode();
      case 'pattern':
        return this.renderPatternMode();
      default:
        return this.renderSliderMode();
    }
  };

  // 渲染滑块模式
  CrossBrowserHumanCheck.prototype.renderSliderMode = function() {
    return [
      '<p class="cb-instruction">请拖动滑块到右侧完成验证</p>',
      '<div class="cb-slider-container">',
      '  <div class="cb-slider-track" id="track_' + this.uniqueId + '">',
      '    <div class="cb-slider-thumb" id="thumb_' + this.uniqueId + '">→</div>',
      '    <div class="cb-slider-text">拖动滑块</div>',
      '  </div>',
      '</div>'
    ].join('');
  };

  // 渲染数学题模式
  CrossBrowserHumanCheck.prototype.renderMathMode = function() {
    return [
      '<p class="cb-instruction">请计算下面的数学题</p>',
      '<div class="cb-math-container">',
      '  <div class="cb-math-problem">' + this.mathProblem.a + ' + ' + this.mathProblem.b + ' = ?</div>',
      '  <div class="cb-math-input-group">',
      '    <input type="text" class="cb-math-input" id="mathInput_' + this.uniqueId + '" placeholder="答案" maxlength="3" />',
      '    <button type="button" class="cb-math-submit-btn" id="mathSubmit_' + this.uniqueId + '">确认</button>',
      '  </div>',
      '</div>'
    ].join('');
  };

  // 渲染图案点击模式
  CrossBrowserHumanCheck.prototype.renderPatternMode = function() {
    var html = [
      '<p class="cb-instruction">请按顺序点击第 ' + this.requiredPattern.join('、') + ' 个方块</p>',
      '<div class="cb-pattern-container">'
    ];
    
    for (var i = 1; i <= 6; i++) {
      html.push('<button type="button" class="cb-pattern-btn" data-number="' + i + '">' + i + '</button>');
    }
    
    html.push('</div>');
    return html.join('');
  };

  // 绑定事件
  CrossBrowserHumanCheck.prototype.bindEvents = function() {
    var self = this;
    
    // 切换模式按钮
    var switchBtn = document.getElementById('switch_' + this.uniqueId);
    if (switchBtn) {
      BrowserUtils.addEvent(switchBtn, 'click', function() {
        self.switchMode();
      });
    }

    this.bindCurrentModeEvents();
  };

  // 绑定当前模式的事件
  CrossBrowserHumanCheck.prototype.bindCurrentModeEvents = function() {
    var self = this;
    
    switch (this.currentMode) {
      case 'slider':
        this.bindSliderEvents();
        break;
      case 'math':
        this.bindMathEvents();
        break;
      case 'pattern':
        this.bindPatternEvents();
        break;
    }
  };

  // 绑定滑块事件
  CrossBrowserHumanCheck.prototype.bindSliderEvents = function() {
    var self = this;
    var thumb = document.getElementById('thumb_' + this.uniqueId);
    var track = document.getElementById('track_' + this.uniqueId);
    
    if (!thumb || !track) return;

    // 鼠标按下
    BrowserUtils.addEvent(thumb, 'mousedown', function(e) {
      self.isDragging = true;
      BrowserUtils.preventDefault(e);
    });

    // 鼠标移动
    BrowserUtils.addEvent(document, 'mousemove', function(e) {
      if (!self.isDragging) return;
      
      var mousePos = BrowserUtils.getMousePosition(e);
      var trackRect = BrowserUtils.getElementPosition(track);
      var thumbWidth = thumb.offsetWidth;
      var trackWidth = track.offsetWidth;
      
      var relativeX = mousePos.x - trackRect.left;
      var maxLeft = trackWidth - thumbWidth - 4;
      var newLeft = Math.max(2, Math.min(maxLeft, relativeX - thumbWidth / 2));
      
      thumb.style.left = newLeft + 'px';
      self.sliderValue = newLeft / maxLeft;
      
      // 检查是否完成
      if (self.sliderValue > 0.9) {
        self.completeVerification(true);
      }
    });

    // 鼠标释放
    BrowserUtils.addEvent(document, 'mouseup', function() {
      if (self.isDragging) {
        self.isDragging = false;
        
        // 如果没有拖到位，重置滑块
        if (self.sliderValue <= 0.9) {
          thumb.style.left = '2px';
          self.sliderValue = 0;
          self.showFeedback('请拖动滑块到最右侧', 'error');
        }
      }
    });

    // 触摸事件支持 (移动设备)
    BrowserUtils.addEvent(thumb, 'touchstart', function(e) {
      self.isDragging = true;
      BrowserUtils.preventDefault(e);
    });

    BrowserUtils.addEvent(document, 'touchmove', function(e) {
      if (!self.isDragging) return;
      
      var touch = e.touches[0];
      var trackRect = BrowserUtils.getElementPosition(track);
      var thumbWidth = thumb.offsetWidth;
      var trackWidth = track.offsetWidth;
      
      var relativeX = touch.clientX - trackRect.left;
      var maxLeft = trackWidth - thumbWidth - 4;
      var newLeft = Math.max(2, Math.min(maxLeft, relativeX - thumbWidth / 2));
      
      thumb.style.left = newLeft + 'px';
      self.sliderValue = newLeft / maxLeft;
      
      if (self.sliderValue > 0.9) {
        self.completeVerification(true);
      }
      
      BrowserUtils.preventDefault(e);
    });

    BrowserUtils.addEvent(document, 'touchend', function() {
      if (self.isDragging) {
        self.isDragging = false;
        
        if (self.sliderValue <= 0.9) {
          thumb.style.left = '2px';
          self.sliderValue = 0;
          self.showFeedback('请拖动滑块到最右侧', 'error');
        }
      }
    });
  };

  // 绑定数学题事件
  CrossBrowserHumanCheck.prototype.bindMathEvents = function() {
    var self = this;
    var input = document.getElementById('mathInput_' + this.uniqueId);
    var submitBtn = document.getElementById('mathSubmit_' + this.uniqueId);
    
    if (!input || !submitBtn) return;

    var checkAnswer = function() {
      var userAnswer = parseInt(input.value);
      if (userAnswer === self.mathProblem.answer) {
        self.completeVerification(true);
      } else {
        self.showFeedback('答案错误，请重新计算', 'error');
        input.value = '';
        input.focus();
      }
    };

    BrowserUtils.addEvent(submitBtn, 'click', checkAnswer);
    
    BrowserUtils.addEvent(input, 'keydown', function(e) {
      var event = BrowserUtils.getEvent(e);
      if (event.keyCode === 13) { // Enter键
        checkAnswer();
      }
    });

    // 只允许输入数字
    BrowserUtils.addEvent(input, 'keypress', function(e) {
      var event = BrowserUtils.getEvent(e);
      var charCode = event.which || event.keyCode;
      
      if (charCode < 48 || charCode > 57) {
        BrowserUtils.preventDefault(e);
      }
    });

    // 自动聚焦
    setTimeout(function() {
      if (input.focus) input.focus();
    }, 100);
  };

  // 绑定图案点击事件
  CrossBrowserHumanCheck.prototype.bindPatternEvents = function() {
    var self = this;
    var buttons = BrowserUtils.querySelectorAll(this.container, '.cb-pattern-btn');
    
    for (var i = 0; i < buttons.length; i++) {
      (function(button) {
        BrowserUtils.addEvent(button, 'click', function() {
          var number = parseInt(button.getAttribute('data-number'));
          self.handlePatternClick(number, button);
        });
      })(buttons[i]);
    }
  };

  // 处理图案点击
  CrossBrowserHumanCheck.prototype.handlePatternClick = function(number, button) {
    var expectedNumber = this.requiredPattern[this.patternClicks.length];
    
    if (number === expectedNumber) {
      // 正确点击
      this.patternClicks.push(number);
      BrowserUtils.addClass(button, 'selected');
      
      if (this.patternClicks.length === this.requiredPattern.length) {
        // 完成验证
        this.completeVerification(true);
      }
    } else {
      // 错误点击，重置
      this.showFeedback('点击顺序错误，请重新开始', 'error');
      this.resetPattern();
    }
  };

  // 重置图案
  CrossBrowserHumanCheck.prototype.resetPattern = function() {
    this.patternClicks = [];
    var buttons = BrowserUtils.querySelectorAll(this.container, '.cb-pattern-btn');
    for (var i = 0; i < buttons.length; i++) {
      BrowserUtils.removeClass(buttons[i], 'selected');
    }
  };

  // 切换模式
  CrossBrowserHumanCheck.prototype.switchMode = function() {
    var modes = ['slider', 'math', 'pattern'];
    var currentIndex = BrowserUtils.indexOf(modes, this.currentMode);
    var nextIndex = (currentIndex + 1) % modes.length;
    
    this.currentMode = modes[nextIndex];
    this.isVerified = false;
    this.sliderValue = 0;
    this.patternClicks = [];
    
    // 重新生成随机模式（如果是图案模式）
    if (this.currentMode === 'pattern') {
      this.requiredPattern = this.generateRandomPattern();
    }
    
    // 重新生成数学题（如果是数学模式）
    if (this.currentMode === 'math') {
      this.generateMathProblem();
    }
    
    // 重新渲染
    var content = document.getElementById('content_' + this.uniqueId);
    if (content) {
      content.innerHTML = this.renderCurrentMode();
      this.bindCurrentModeEvents();
      this.updateStatus('请完成上述验证操作');
    }
  };

  // 完成验证
  CrossBrowserHumanCheck.prototype.completeVerification = function(success) {
    this.isVerified = success;
    
    if (success) {
      this.updateStatus('验证成功！', 'success');
      this.showFeedback('人机验证通过', 'success');
    } else {
      this.updateStatus('验证失败，请重试', 'error');
      this.showFeedback('验证失败，请重试', 'error');
    }
    
    // 回调函数
    if (this.options.onVerificationComplete && typeof this.options.onVerificationComplete === 'function') {
      this.options.onVerificationComplete(success);
    }
  };

  // 更新状态显示
  CrossBrowserHumanCheck.prototype.updateStatus = function(message, type) {
    var status = document.getElementById('status_' + this.uniqueId);
    if (status) {
      status.textContent = message;
      status.className = 'cb-status' + (type ? ' ' + type : '');
    }
  };

  // 显示反馈消息
  CrossBrowserHumanCheck.prototype.showFeedback = function(message, type) {
    var content = document.getElementById('content_' + this.uniqueId);
    if (!content) return;
    
    // 移除现有反馈
    var existingFeedback = BrowserUtils.querySelector(content, '.cb-feedback');
    if (existingFeedback) {
      content.removeChild(existingFeedback);
    }
    
    // 添加新反馈
    var feedback = document.createElement('div');
    feedback.className = 'cb-feedback' + (type ? ' ' + type : '');
    feedback.textContent = message;
    content.appendChild(feedback);
    
    // 3秒后自动消失
    setTimeout(function() {
      if (feedback && feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3000);
  };

  // 重置验证
  CrossBrowserHumanCheck.prototype.reset = function() {
    this.isVerified = false;
    this.sliderValue = 0;
    this.patternClicks = [];
    this.generateMathProblem();
    
    if (this.currentMode === 'pattern') {
      this.requiredPattern = this.generateRandomPattern();
    }
    
    // 重新渲染
    var content = document.getElementById('content_' + this.uniqueId);
    if (content) {
      content.innerHTML = this.renderCurrentMode();
      this.bindCurrentModeEvents();
      this.updateStatus('请完成上述验证操作');
    }
  };

  // 获取验证状态
  CrossBrowserHumanCheck.prototype.getVerificationStatus = function() {
    return this.isVerified;
  };

  // 销毁控件
  CrossBrowserHumanCheck.prototype.destroy = function() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  };

  // 导出到全局作用域
  window.CrossBrowserHumanCheck = CrossBrowserHumanCheck;

})(window, document);