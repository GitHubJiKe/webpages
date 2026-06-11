# Slide Design Tokens 风格参考库

本文件供 `md-to-slides` Skill 的 Step 2 风格推理和 Step 4 HTML 生成使用。

---

## 风格 1：极简极客暗黑（Dark Hacker）

**适合**：技术教学、工程方案、代码分享、开发者培训

### 色彩 Token
```css
--bg:           #0d1117;
--bg-slide:     #161b22;
--bg-card:      #21262d;
--text-h1:      #e6edf3;
--text-body:    #c9d1d9;
--text-muted:   #8b949e;
--accent:       #58a6ff;
--accent-2:     #3fb950;
--accent-3:     #f78166;
--border:       #30363d;
--code-bg:      #1f2428;
--code-text:    #e6edf3;
--highlight:    rgba(88, 166, 255, 0.15);
```

### 排版规则
- 标题字号：`clamp(2.4rem, 5vw, 4rem)`，字重 `700`，字间距 `−0.02em`
- 要点字号：`clamp(1.2rem, 2.5vw, 1.8rem)`，行高 `1.7`
- 强调色用 `--accent` 包裹关键词 `<span class="hl">`
- 代码块：等宽字体 + `--code-bg` 背景，带左侧 4px `--accent` 色条
- 过渡动画：向上推入（`translateY(40px) → translateY(0)`）

### 封面模板
```
[深色背景 + 顶部细线装饰]
大标题（白色，极大字号）
副标题（accent蓝，中字号）
底部：演讲者 · 日期（灰色小字）
```

### Slide 布局变体
- **标题+要点**：左对齐，标题在上1/3，要点占下2/3
- **全屏引用**：居中，引号装饰，文字 `--accent`
- **代码展示**：标题顶部，代码块占 70% 空间
- **双栏对比**：左 Before / 右 After，用 `--border` 分隔线

---

## 风格 2：Keynote 白色经典（Apple Classic）

**适合**：培训课程、教学内容、产品介绍、方法论分享

### 色彩 Token
```css
--bg:           #ffffff;
--bg-slide:     #ffffff;
--bg-card:      #f5f5f7;
--text-h1:      #1d1d1f;
--text-body:    #424245;
--text-muted:   #86868b;
--accent:       #0071e3;
--accent-2:     #34aadc;
--accent-3:     #ff375f;
--border:       #d2d2d7;
--code-bg:      #f5f5f7;
--code-text:    #1d1d1f;
--highlight:    rgba(0, 113, 227, 0.08);
```

### 排版规则
- 标题字号：`clamp(2.2rem, 4.5vw, 3.6rem)`，字重 `700`，字间距 `−0.03em`
- 要点字号：`clamp(1.1rem, 2.2vw, 1.6rem)`，行高 `1.75`
- 底部细线：1px `--border` 色水平线作为 Slide 底部装饰
- 要点符号：实心圆点 `•`，`--accent` 色
- 过渡动画：淡入淡出 `opacity` + 轻微向左 `translateX(-20px → 0)`

### 封面模板
```
[白色背景]
大标题（黑色，占1/2宽）
一条 2px accent蓝横线
副标题（灰色）
底部右对齐：演讲者信息
```

### Slide 布局变体
- **标题+要点**：顶部标题 + 下方卡片式要点（圆角 12px，浅灰背景）
- **大数字强调**：中央大数字（`--accent` 色，8rem+）+ 小字说明
- **引用块**：左侧 4px 蓝色竖线，引用文字，右下署名
- **两栏对比**：左右各一张卡片，顶部标签区分

---

## 风格 3：深邃渐变演讲（Gradient Keynote）

**适合**：观点分享、演讲稿、思想启发、年度总结

### 色彩 Token
```css
--bg-from:      #1a1a2e;
--bg-to:        #16213e;
--bg-slide:     linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
--bg-card:      rgba(255,255,255,0.06);
--text-h1:      #ffffff;
--text-body:    rgba(255,255,255,0.85);
--text-muted:   rgba(255,255,255,0.5);
--accent:       #e94560;
--accent-2:     #f5a623;
--accent-3:     #0f3460;
--border:       rgba(255,255,255,0.12);
--code-bg:      rgba(0,0,0,0.3);
--code-text:    #f5a623;
--highlight:    rgba(233, 69, 96, 0.2);
```

### 排版规则
- 标题字号：`clamp(2.6rem, 5.5vw, 4.5rem)`，字重 `800`，字间距 `−0.01em`
- 要点字号：`clamp(1.2rem, 2.3vw, 1.7rem)`，行高 `1.8`
- 强调词：用 `--accent` 或 `--accent-2` 色 `<span>` 标注
- 磨砂玻璃卡片：`backdrop-filter: blur(12px)` + `--bg-card` 背景
- 过渡动画：向左滑动 `translateX(100% → 0)` + `opacity`

### 封面模板
```
[深色渐变背景 + 装饰性几何线条或粒子感]
超大标题（白色）
accent色副标题线
副标题（半透明白色）
底部：演讲者 · 日期（小字）
```

### Slide 布局变体
- **全屏引言**：居中大字，引号用 `--accent` 色装饰，字号 3–5rem
- **对比双栏**：毛玻璃卡片，左暗右亮渐变区分
- **数据展示**：大数字 `--accent-2` 色，描述小字在下
- **章节过渡**：章节编号 `--accent` 色大字 + 章节标题

---

## 风格 4：温暖麻纸手记（Warm Notebook）

**适合**：人文写作、教育分享、个人成长、写作者课程

### 色彩 Token
```css
--bg:           #faf6ef;
--bg-slide:     #faf6ef;
--bg-card:      #fdfaf4;
--text-h1:      #2c2316;
--text-body:    #6b5a45;
--text-muted:   #9e8a72;
--accent:       #8b4513;
--accent-2:     #c8783a;
--accent-3:     #d4a055;
--border:       #e0d5c5;
--code-bg:      #f0e8d8;
--code-text:    #7a3b1e;
--highlight:    rgba(139, 69, 19, 0.08);
```

### 排版规则
- 标题字体：衬线（`Georgia, 'Noto Serif SC', 'STSong', serif`），字重 `700`
- 正文字体：衬线，行高 `1.9`
- 标题字号：`clamp(2rem, 4vw, 3.2rem)`
- 要点字号：`clamp(1.1rem, 2vw, 1.5rem)`，行高 `1.9`
- 要点符号：`◆` `--accent-2` 色
- 底部装饰：手写感波浪线（SVG）或双线分隔
- 过渡动画：淡入 `opacity` + 向右轻推 `translateX(-30px → 0)`（翻书感）

### 封面模板
```
[米黄背景 + 顶部装饰性线条]
中央大标题（衬线字体，深棕色）
细线分隔
副标题 / 引言（中字号，棕色）
底部：演讲者信息（小字）
```

### Slide 布局变体
- **标题+要点**：居中标题 + 左对齐要点（带 ◆ 符号）
- **引用/金句**：居中大字，左侧竖线，底部署名斜体
- **章节过渡**：章节编号（`--accent` 色，大字，衬线体）+ 章节标题

---

## 通用 HTML 结构参考

```html
<!-- 每张 Slide 的基础 HTML 结构 -->
<section class="slide" data-index="0" data-type="cover">
  <div class="slide-inner">
    <h1 class="slide-title">标题文字</h1>
    <p class="slide-subtitle">副标题</p>
    <!-- 或 -->
    <ul class="slide-points">
      <li>要点一</li>
      <li>要点二</li>
    </ul>
  </div>
  <div class="slide-footer">
    <span class="slide-num">01 / 12</span>
  </div>
</section>
```

### 翻页核心 JS 逻辑骨架

```javascript
let current = 0;
const slides = document.querySelectorAll('.slide');
const total = slides.length;

function goTo(n, dir = 'next') {
  if (n < 0 || n >= total) return;
  const from = slides[current];
  const to = slides[n];
  // 设置动画方向类
  from.classList.add(dir === 'next' ? 'exit-left' : 'exit-right');
  to.classList.add(dir === 'next' ? 'enter-right' : 'enter-left');
  to.classList.add('active');
  // 动画结束后清理
  from.addEventListener('animationend', () => {
    from.classList.remove('active', 'exit-left', 'exit-right');
  }, { once: true });
  to.addEventListener('animationend', () => {
    to.classList.remove('enter-right', 'enter-left');
  }, { once: true });
  current = n;
  updateUI();
}

document.addEventListener('keydown', e => {
  const map = {
    ArrowRight: () => goTo(current + 1, 'next'),
    ArrowDown:  () => goTo(current + 1, 'next'),
    ' ':        () => goTo(current + 1, 'next'),
    ArrowLeft:  () => goTo(current - 1, 'prev'),
    ArrowUp:    () => goTo(current - 1, 'prev'),
    Home:       () => goTo(0, 'prev'),
    End:        () => goTo(total - 1, 'next'),
    f:          () => toggleFullscreen(),
    F:          () => toggleFullscreen(),
    l:          () => toggleLaser(),
    L:          () => toggleLaser(),
    o:          () => toggleOverview(),
    O:          () => toggleOverview(),
    Tab:        () => { e.preventDefault(); toggleOverview(); },
  };
  if (map[e.key]) { e.preventDefault(); map[e.key](); }
});
```

### 激光笔核心实现

```javascript
const laser = document.createElement('div');
laser.id = 'laser';
laser.style.cssText = `
  position: fixed; width: 24px; height: 24px;
  border-radius: 50%; pointer-events: none;
  background: rgba(255, 30, 30, 0.85);
  box-shadow: 0 0 0 4px rgba(255,30,30,0.3), 0 0 16px 6px rgba(255,0,0,0.4);
  transform: translate(-50%, -50%);
  z-index: 99999; display: none;
`;
document.body.appendChild(laser);

let laserActive = false;
function toggleLaser() {
  laserActive = !laserActive;
  laser.style.display = laserActive ? 'block' : 'none';
  document.body.style.cursor = laserActive ? 'none' : '';
}
document.addEventListener('mousemove', e => {
  if (!laserActive) return;
  laser.style.left = e.clientX + 'px';
  laser.style.top = e.clientY + 'px';
});
```
