/* ===== JSON 格式化工具 - 逻辑 ===== */

(function() {
  'use strict';

  // === DOM 引用 ===
  var inputArea    = document.getElementById('inputArea');
  var outputArea   = document.getElementById('outputArea');
  var outputCode   = document.getElementById('outputCode');
  var inputStatus  = document.getElementById('inputStatus');
  var outputStatus = document.getElementById('outputStatus');
  var errorBox     = document.getElementById('errorBox');
  var errorMessage = document.getElementById('errorMessage');
  var charCount    = document.getElementById('charCount');
  var lineCount    = document.getElementById('lineCount');
  var keyCount     = document.getElementById('keyCount');

  var btnFormat   = document.getElementById('btnFormat');
  var btnCompress = document.getElementById('btnCompress');
  var btnValidate = document.getElementById('btnValidate');
  var btnCopy     = document.getElementById('btnCopy');
  var btnClear    = document.getElementById('btnClear');

  var indentRadios = document.getElementsByName('indent');

  // === 获取缩进空格数 ===
  function getIndent() {
    for (var i = 0; i < indentRadios.length; i++) {
      if (indentRadios[i].checked) return parseInt(indentRadios[i].value, 10);
    }
    return 2;
  }

  // === 语法高亮 JSON ===
  function highlightJSON(jsonStr) {
    // 转义 HTML
    var escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 匹配模式
    var patterns = [
      // 字符串键（在冒号前）
      { regex: /("[^"\\]*(?:\\.[^"\\]*)*")\s*:/g, cls: 'json-key' },
      // 字符串值
      { regex: /"[^"\\]*(?:\\.[^"\\]*)*"/g, cls: 'json-string' },
      // 数字
      { regex: /(?<!["\w])(-?\d+\.?\d*(?:[eE][+-]?\d+)?)(?!["\w])/g, cls: 'json-number' },
      // 布尔 + null
      { regex: /\b(true|false|null)\b/g, cls: function(m) {
        return m === 'null' ? 'json-null' : 'json-boolean';
      }},
      // 括号
      { regex: /([{}\[\]])/g, cls: 'json-bracket' },
      // 冒号
      { regex: /:/g, cls: 'json-colon' }
    ];

    // 用占位标记避免冲突
    var result = escaped;
    var marks = [];

    patterns.forEach(function(p) {
      result = result.replace(p.regex, function(match) {
        var cls = typeof p.cls === 'function' ? p.cls(match) : p.cls;
        var idx = marks.length;
        marks.push('<span class="' + cls + '">' + match + '</span>');
        return '\x00MARK' + idx + '\x00';
      });
    });

    // 还原占位
    result = result.replace(/\x00MARK(\d+)\x00/g, function(_, i) {
      return marks[parseInt(i, 10)];
    });

    return result;
  }

  // === 统计 JSON 键数 ===
  function countKeys(obj) {
    if (obj === null || typeof obj !== 'object') return 0;
    if (Array.isArray(obj)) {
      var sum = 0;
      for (var i = 0; i < obj.length; i++) sum += countKeys(obj[i]);
      return sum;
    }
    var keys = Object.keys(obj);
    var total = keys.length;
    for (var i = 0; i < keys.length; i++) {
      total += countKeys(obj[keys[i]]);
    }
    return total;
  }

  // === 更新统计信息 ===
  function updateStats(input, obj) {
    charCount.textContent = '字符：' + input.length;
    lineCount.textContent = '行数：' + (input ? input.split('\n').length : 0);
    if (obj && typeof obj === 'object') {
      keyCount.textContent = '键数：' + countKeys(obj);
    } else {
      keyCount.textContent = '键数：-';
    }
  }

  // === 隐藏错误 ===
  function hideError() {
    errorBox.classList.add('hidden');
    inputStatus.textContent = '';
    outputStatus.textContent = '';
  }

  // === 显示错误 ===
  function showError(msg) {
    errorBox.classList.remove('hidden');
    errorMessage.textContent = msg;
    outputStatus.textContent = '解析失败';
    outputStatus.classList.add('text-red-500');
    outputStatus.classList.remove('text-green-500', 'text-gray-400');
  }

  // === 格式化 JSON ===
  function doFormat() {
    hideError();
    var raw = inputArea.value.trim();
    if (!raw) {
      outputCode.innerHTML = '';
      outputStatus.textContent = '';
      inputStatus.textContent = '';
      updateStats('', null);
      return;
    }

    try {
      var obj = JSON.parse(raw);
      var formatted = JSON.stringify(obj, null, getIndent());
      var highlighted = highlightJSON(formatted);
      outputCode.innerHTML = highlighted;
      inputStatus.textContent = '✓ 有效 JSON';
      inputStatus.classList.add('text-green-500');
      inputStatus.classList.remove('text-red-500', 'text-gray-400');
      outputStatus.textContent = '格式化完成';
      outputStatus.classList.add('text-green-500');
      outputStatus.classList.remove('text-red-500', 'text-gray-400');
      updateStats(raw, obj);
    } catch (e) {
      showError(e.message);
      inputStatus.textContent = '✗ 无效 JSON';
      inputStatus.classList.add('text-red-500');
      inputStatus.classList.remove('text-green-500', 'text-gray-400');
      updateStats(raw, null);
    }
  }

  // === 压缩 JSON ===
  function doCompress() {
    hideError();
    var raw = inputArea.value.trim();
    if (!raw) return;

    try {
      var obj = JSON.parse(raw);
      outputCode.innerHTML = JSON.stringify(obj);
      inputStatus.textContent = '✓ 有效 JSON';
      inputStatus.classList.add('text-green-500');
      inputStatus.classList.remove('text-red-500', 'text-gray-400');
      outputStatus.textContent = '压缩完成';
      outputStatus.classList.add('text-green-500');
      outputStatus.classList.remove('text-red-500', 'text-gray-400');
      updateStats(raw, obj);
    } catch (e) {
      showError(e.message);
      inputStatus.textContent = '✗ 无效 JSON';
      inputStatus.classList.add('text-red-500');
      inputStatus.classList.remove('text-green-500', 'text-gray-400');
      updateStats(raw, null);
    }
  }

  // === 校验 JSON ===
  function doValidate() {
    hideError();
    var raw = inputArea.value.trim();
    if (!raw) {
      outputCode.innerHTML = '';
      outputStatus.textContent = '';
      inputStatus.textContent = '';
      updateStats('', null);
      return;
    }

    try {
      var obj = JSON.parse(raw);
      outputCode.innerHTML = '<span class="json-boolean">✓ 有效的 JSON</span>';
      inputStatus.textContent = '✓ 有效 JSON';
      inputStatus.classList.add('text-green-500');
      inputStatus.classList.remove('text-red-500', 'text-gray-400');
      outputStatus.textContent = '校验通过';
      outputStatus.classList.add('text-green-500');
      outputStatus.classList.remove('text-red-500', 'text-gray-400');
      updateStats(raw, obj);
    } catch (e) {
      showError(e.message);
      inputStatus.textContent = '✗ 无效 JSON';
      inputStatus.classList.add('text-red-500');
      inputStatus.classList.remove('text-green-500', 'text-gray-400');
      outputCode.innerHTML = '';
    }
  }

  // === 复制结果 ===
  function doCopy() {
    var text = outputCode.textContent;
    if (!text) return;

    // 使用 Clipboard API（现代浏览器都支持）
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('已复制到剪贴板');
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast('已复制到剪贴板');
    } catch (e) {
      showToast('复制失败，请手动复制', true);
    }
    document.body.removeChild(ta);
  }

  function showToast(msg, isError) {
    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = msg;
    if (isError) toast.style.background = '#dc2626';
    document.body.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2000);
  }

  // === 清空 ===
  function doClear() {
    inputArea.value = '';
    outputCode.innerHTML = '';
    inputStatus.textContent = '';
    outputStatus.textContent = '';
    hideError();
    updateStats('', null);
    inputArea.focus();
  }

  // === 事件绑定 ===
  btnFormat.addEventListener('click', doFormat);
  btnCompress.addEventListener('click', doCompress);
  btnValidate.addEventListener('click', doValidate);
  btnCopy.addEventListener('click', doCopy);
  btnClear.addEventListener('click', doClear);

  // 缩进切换时自动重新格式化
  for (var i = 0; i < indentRadios.length; i++) {
    indentRadios[i].addEventListener('change', function() {
      if (inputArea.value.trim()) doFormat();
    });
  }

  // 快捷键 Ctrl+Enter 格式化
  inputArea.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      doFormat();
    }
  });

  // 实时统计
  inputArea.addEventListener('input', function() {
    var val = inputArea.value;
    charCount.textContent = '字符：' + val.length;
    lineCount.textContent = '行数：' + (val ? val.split('\n').length : 0);
  });

})();
