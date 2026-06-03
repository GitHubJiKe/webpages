# 用纯 HTML+JS+CSS 实现提示词生成器

纯静态方案反而是最合适的——零依赖、部署简单、加载极快。核心就是把数据结构设计好，其他都是体力活。

---

## 一、项目文件结构

```
prompt-generator/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── data/
    │   ├── styles.js        # 风格类型定义
    │   ├── dimensions.js    # 维度配置（光线/构图等）
    │   └── options.js       # 各维度的选项词库
    ├── app.js               # 主逻辑
    └── generator.js         # 提示词拼接逻辑
```

---

## 二、核心数据结构设计

### 2.1 styles.js — 风格类型

```javascript
const STYLE_TYPES = [
  {
    id: 'anime',
    name: '动漫插画',
    icon: '🎌',
    desc: '二次元、ACG、日系插画风格',
    // 该风格启用哪些维度，以及顺序
    dimensions: [
      'artStyle',       // 画风
      'subject',        // 主体
      'character',      // 角色细节
      'scene',          // 场景背景
      'lighting',       // 光线
      'composition',    // 构图视角
      'colorTone',      // 色调
      'emotion',        // 情绪氛围
      'quality',        // 质量词
    ],
    // 提示词拼接顺序（可以和dimensions不同）
    promptOrder: ['quality', 'artStyle', 'subject', 'character', 'scene', 'lighting', 'composition', 'colorTone', 'emotion'],
    // 默认反向提示词
    defaultNegative: 'lowres, bad anatomy, bad hands, missing fingers, extra fingers, blurry, worst quality, low quality, jpeg artifacts',
  },
  {
    id: 'realistic',
    name: '写实摄影',
    icon: '📷',
    desc: '真实感人像、风景、产品摄影',
    dimensions: [
      'subject',
      'scene',
      'lighting',
      'cameraParams',   // 摄影参数（动漫没有这个）
      'composition',
      'colorTone',
      'skinDetail',     // 皮肤细节（写实专属）
      'emotion',
      'quality',
    ],
    promptOrder: ['subject', 'scene', 'lighting', 'cameraParams', 'composition', 'colorTone', 'skinDetail', 'emotion', 'quality'],
    defaultNegative: 'cartoon, anime, illustration, painting, drawing, art, render, cgi, blurry, out of focus, bad anatomy, deformed',
  },
  {
    id: 'concept',
    name: '概念艺术',
    icon: '🌌',
    desc: '奇幻、科幻、史诗场景',
    dimensions: [
      'subject',
      'worldSetting',   // 世界观（概念艺术专属）
      'scene',
      'lighting',
      'specialEffect',  // 特效（概念艺术专属）
      'composition',
      'colorTone',
      'emotion',
      'quality',
    ],
    promptOrder: ['quality', 'subject', 'worldSetting', 'scene', 'lighting', 'specialEffect', 'composition', 'colorTone', 'emotion'],
    defaultNegative: 'photo, realistic, photograph, blurry, bad anatomy, worst quality, low quality',
  },
  {
    id: 'design',
    name: '设计风格',
    icon: '🎨',
    desc: '海报、品牌、UI等平面设计',
    dimensions: [
      'designType',     // 设计类型（设计专属）
      'subject',
      'colorTone',
      'designStyle',    // 设计语言（设计专属）
      'layout',         // 版式（设计专属）
      'emotion',
      'quality',
    ],
    promptOrder: ['designType', 'designStyle', 'subject', 'colorTone', 'layout', 'emotion', 'quality'],
    defaultNegative: 'photo, realistic, blurry, noisy, cluttered, messy layout, bad typography',
  },
];
```

---

### 2.2 dimensions.js — 维度元信息

```javascript
// 定义每个维度的名称、交互类型、是否必填
const DIMENSIONS = {
  subject: {
    id: 'subject',
    name: '主体描述',
    type: 'input',          // 自由输入
    placeholder: '描述画面主体，例如：一个穿红色连衣裙的少女',
    required: true,
    tip: '主体是画面的核心，描述越具体效果越好',
  },
  artStyle: {
    id: 'artStyle',
    name: '画风',
    type: 'single-select',  // 单选
    required: true,
    tip: '决定整体视觉风格',
  },
  character: {
    id: 'character',
    name: '角色细节',
    type: 'multi-select',   // 多选
    required: false,
    tip: '可多选，叠加角色特征',
  },
  scene: {
    id: 'scene',
    name: '场景背景',
    type: 'single-select',
    required: false,
    tip: '画面所处的环境',
  },
  lighting: {
    id: 'lighting',
    name: '光线',
    type: 'single-select',
    required: false,
    tip: '光线对氛围影响极大',
  },
  composition: {
    id: 'composition',
    name: '构图视角',
    type: 'single-select',
    required: false,
    tip: '镜头角度和景别',
  },
  colorTone: {
    id: 'colorTone',
    name: '色调',
    type: 'single-select',
    required: false,
    tip: '整体色彩倾向',
  },
  emotion: {
    id: 'emotion',
    name: '情绪氛围',
    type: 'single-select',
    required: false,
    tip: '画面传达的情感',
  },
  quality: {
    id: 'quality',
    name: '质量词',
    type: 'multi-select',
    required: true,
    tip: '影响画面精细程度',
  },
  cameraParams: {
    id: 'cameraParams',
    name: '摄影参数',
    type: 'single-select',
    required: false,
    tip: '模拟真实相机效果',
  },
  skinDetail: {
    id: 'skinDetail',
    name: '皮肤质感',
    type: 'single-select',
    required: false,
    tip: '写实人像专属',
  },
  worldSetting: {
    id: 'worldSetting',
    name: '世界观设定',
    type: 'single-select',
    required: false,
    tip: '概念艺术的背景世界',
  },
  specialEffect: {
    id: 'specialEffect',
    name: '特效',
    type: 'multi-select',
    required: false,
    tip: '魔法、粒子等视觉特效',
  },
  designType: {
    id: 'designType',
    name: '设计类型',
    type: 'single-select',
    required: true,
    tip: '海报、图标、UI等',
  },
  designStyle: {
    id: 'designStyle',
    name: '设计语言',
    type: 'single-select',
    required: false,
    tip: '极简、包豪斯、赛博朋克等',
  },
  layout: {
    id: 'layout',
    name: '版式',
    type: 'single-select',
    required: false,
    tip: '元素的空间排布方式',
  },
};
```

---

### 2.3 options.js — 选项词库（核心内容）

```javascript
const OPTIONS = {

  artStyle: [
    { label: '赛璐璐动漫', value: 'anime style, cel shading, clean lineart', tag: '标准动漫' },
    { label: '厚涂插画', value: 'thick paint illustration, painterly style', tag: '绘画感' },
    { label: '水彩风', value: 'watercolor style, soft edges, transparent colors', tag: '清新' },
    { label: '像素艺术', value: 'pixel art, 16-bit style', tag: '复古' },
    { label: '国风工笔', value: 'Chinese traditional painting, gongbi style, ink wash', tag: '国风' },
    { label: '扁平插画', value: 'flat illustration, vector style, minimal shading', tag: '现代' },
    { label: '写实动漫', value: 'semi-realistic anime, detailed anime style', tag: '精细' },
  ],

  character: [
    { label: '长发飘逸', value: 'long flowing hair' },
    { label: '双马尾', value: 'twin tails' },
    { label: '猫耳', value: 'cat ears, nekomimi' },
    { label: '大眼睛', value: 'big sparkling eyes' },
    { label: '学生制服', value: 'school uniform' },
    { label: '汉服', value: 'hanfu, traditional Chinese clothing' },
    { label: '盔甲', value: 'armor, knight armor' },
    { label: '微笑表情', value: 'gentle smile' },
    { label: '严肃表情', value: 'serious expression' },
  ],

  scene: [
    { label: '樱花树下', value: 'under cherry blossom trees, sakura petals falling', tag: '春日' },
    { label: '城市街道', value: 'urban street, city background, neon signs', tag: '都市' },
    { label: '森林深处', value: 'deep forest, ancient trees, dappled light', tag: '自然' },
    { label: '海边日落', value: 'beach at sunset, ocean waves, golden sky', tag: '海洋' },
    { label: '雪山之巅', value: 'mountain peak, snow covered, vast sky', tag: '壮阔' },
    { label: '古典庭院', value: 'traditional courtyard, ancient architecture, stone path', tag: '古风' },
    { label: '赛博都市', value: 'cyberpunk city, futuristic buildings, holographic ads', tag: '科幻' },
    { label: '魔法学院', value: 'magic academy, gothic architecture, mystical atmosphere', tag: '奇幻' },
    { label: '咖啡馆内', value: 'cozy cafe interior, warm lighting, wooden furniture', tag: '日常' },
    { label: '星空旷野', value: 'open field under starry night sky, milky way', tag: '夜晚' },
  ],

  lighting: [
    { label: '黄金时段', value: 'golden hour lighting, warm sunlight', tag: '温暖' },
    { label: '蓝调时刻', value: 'blue hour, twilight lighting, cool tones', tag: '静谧' },
    { label: '体积光', value: 'volumetric lighting, god rays, light beams', tag: '神圣感' },
    { label: '霓虹灯光', value: 'neon lighting, colorful neon glow, night light', tag: '赛博' },
    { label: '烛光', value: 'candlelight, warm flickering light, intimate', tag: '温馨' },
    { label: '月光', value: 'moonlight, silver light, night atmosphere', tag: '夜晚' },
    { label: '逆光剪影', value: 'backlight, silhouette, rim lighting', tag: '戏剧' },
    { label: '漫射软光', value: 'soft diffused light, overcast, even lighting', tag: '柔和' },
    { label: '丁达尔效应', value: 'tyndall effect, light rays through leaves', tag: '森林' },
    { label: '赛璐璐平光', value: 'flat lighting, anime style lighting', tag: '动漫' },
  ],

  composition: [
    { label: '全身正面', value: 'full body, front view' },
    { label: '半身像', value: 'medium shot, waist up' },
    { label: '特写面部', value: 'close-up, face focus, portrait' },
    { label: '仰视角', value: 'low angle shot, looking up' },
    { label: '俯视角', value: 'bird\'s eye view, top down' },
    { label: '三分法构图', value: 'rule of thirds composition' },
    { label: '中心对称', value: 'centered composition, symmetrical' },
    { label: '宽幅远景', value: 'wide shot, establishing shot, panoramic' },
    { label: '过肩视角', value: 'over the shoulder shot' },
    { label: '动态构图', value: 'dynamic composition, diagonal lines' },
  ],

  colorTone: [
    { label: '暖橙色调', value: 'warm orange tones, amber color palette' },
    { label: '冷蓝色调', value: 'cool blue tones, cold color palette' },
    { label: '莫兰迪色', value: 'muted colors, Morandi color palette, desaturated' },
    { label: '高饱和鲜艳', value: 'vibrant colors, high saturation, vivid' },
    { label: '黑白灰度', value: 'black and white, monochrome, grayscale' },
    { label: '粉嫩少女', value: 'pastel colors, soft pink tones, dreamy palette' },
    { label: '赛博霓虹', value: 'neon colors, cyberpunk palette, purple and cyan' },
    { label: '复古胶片', value: 'vintage film colors, retro tones, film grain' },
    { label: '森系绿调', value: 'forest green tones, natural earthy palette' },
    { label: '高对比黑金', value: 'black and gold, high contrast, luxury palette' },
  ],

  emotion: [
    { label: '治愈温暖', value: 'warm, cozy, heartwarming atmosphere' },
    { label: '梦幻唯美', value: 'dreamy, ethereal, whimsical, magical' },
    { label: '史诗壮阔', value: 'epic, grand, majestic, awe-inspiring' },
    { label: '神秘感', value: 'mysterious, enigmatic, dark atmosphere' },
    { label: '清新自然', value: 'fresh, natural, airy, light-hearted' },
    { label: '孤独忧郁', value: 'melancholic, lonely, somber, wistful' },
    { label: '活力动感', value: 'energetic, dynamic, vibrant, exciting' },
    { label: '宁静祥和', value: 'peaceful, serene, tranquil, calm' },
    { label: '浪漫唯美', value: 'romantic, tender, soft, beautiful' },
    { label: '紧张压迫', value: 'tense, ominous, foreboding, dramatic' },
  ],

  quality: [
    { label: '超高清', value: 'ultra-detailed, 8K resolution' },
    { label: '杰作级', value: 'masterpiece, best quality' },
    { label: '精细细节', value: 'highly detailed, intricate details' },
    { label: '专业级', value: 'professional, award-winning' },
    { label: '锐利清晰', value: 'sharp focus, crisp' },
  ],

  // 写实专属
  cameraParams: [
    { label: '人像定焦 85mm', value: 'shot on 85mm lens, f/1.8 aperture, shallow depth of field' },
    { label: '广角 24mm', value: 'wide angle 24mm lens, environmental context' },
    { label: '长焦压缩 200mm', value: '200mm telephoto, compressed perspective, bokeh background' },
    { label: '微距特写', value: 'macro lens, extreme close-up, fine details' },
    { label: '胶片相机', value: 'shot on film camera, 35mm film, grain texture' },
    { label: '专业单反', value: 'DSLR photo, RAW photo, professional camera' },
  ],

  skinDetail: [
    { label: '自然皮肤', value: 'natural skin texture, realistic skin' },
    { label: '精致妆容', value: 'flawless skin, professional makeup' },
    { label: '毛孔质感', value: 'visible pores, hyper-realistic skin texture' },
    { label: '古铜肤色', value: 'tanned skin, sun-kissed complexion' },
  ],

  // 概念艺术专属
  worldSetting: [
    { label: '中世纪奇幻', value: 'medieval fantasy world, magic and swords era' },
    { label: '赛博朋克2077', value: 'cyberpunk dystopia, high tech low life, year 2077' },
    { label: '蒸汽朋克', value: 'steampunk world, Victorian era, steam-powered machines' },
    { label: '末世废土', value: 'post-apocalyptic wasteland, ruins, desolate world' },
    { label: '东方仙侠', value: 'Chinese xianxia world, immortal cultivation, ancient China' },
    { label: '星际宇宙', value: 'interstellar space, sci-fi universe, space opera' },
    { label: '克苏鲁神话', value: 'Lovecraftian horror, eldritch world, cosmic horror' },
  ],

  specialEffect: [
    { label: '魔法光效', value: 'magical glow, spell effects, arcane energy' },
    { label: '粒子特效', value: 'particle effects, floating particles, sparkles' },
    { label: '火焰特效', value: 'fire effects, flames, burning' },
    { label: '闪电特效', value: 'lightning effects, electric sparks' },
    { label: '樱花飘落', value: 'falling petals, cherry blossom particles' },
    { label: '冰霜特效', value: 'ice and frost effects, frozen crystals' },
  ],

  // 设计专属
  designType: [
    { label: '海报', value: 'poster design' },
    { label: '品牌Logo', value: 'logo design, brand identity' },
    { label: 'App图标', value: 'app icon design, iOS icon style' },
    { label: '名片', value: 'business card design' },
    { label: '包装设计', value: 'product packaging design' },
    { label: 'UI界面', value: 'UI design, mobile app interface' },
    { label: '封面设计', value: 'book cover design, magazine cover' },
  ],

  designStyle: [
    { label: '极简主义', value: 'minimalist design, clean, lots of white space' },
    { label: '包豪斯', value: 'Bauhaus style, geometric shapes, primary colors' },
    { label: '赛博朋克', value: 'cyberpunk design, neon colors, dark background' },
    { label: '新海派', value: 'neubrutalism, bold borders, raw aesthetic' },
    { label: '玻璃拟态', value: 'glassmorphism, frosted glass effect, blur' },
    { label: '日式简约', value: 'Japanese minimalism, zen aesthetic, negative space' },
    { label: '孟菲斯', value: 'Memphis design, bold patterns, 80s style' },
  ],

  layout: [
    { label: '居中对称', value: 'centered layout, symmetrical composition' },
    { label: '三栏网格', value: 'three column grid layout' },
    { label: '大字排版', value: 'large typography, text-dominant layout' },
    { label: '满版出血', value: 'full bleed layout, edge to edge' },
    { label: '留白极简', value: 'generous white space, minimal elements' },
  ],

};
```

---

## 三、generator.js — 拼接逻辑

```javascript
// 当前用户的选择状态
const state = {
  styleId: null,       // 当前选中的风格
  selections: {},      // { dimensionId: value或[value1,value2] }
  customSubject: '',   // 主体自由输入
};

function generatePrompt() {
  const style = STYLE_TYPES.find(s => s.id === state.styleId);
  if (!style) return { positive: '', negative: '' };

  const parts = [];

  // 按 promptOrder 顺序拼接
  style.promptOrder.forEach(dimId => {
    if (dimId === 'subject') {
      // 主体是自由输入
      if (state.customSubject.trim()) {
        parts.push(state.customSubject.trim());
      }
      return;
    }

    const selection = state.selections[dimId];
    if (!selection) return;

    if (Array.isArray(selection)) {
      // 多选：把所有value拼在一起
      const values = selection.map(label => {
        const opt = OPTIONS[dimId].find(o => o.label === label);
        return opt ? opt.value : '';
      }).filter(Boolean);
      if (values.length) parts.push(values.join(', '));
    } else {
      // 单选
      const opt = OPTIONS[dimId].find(o => o.label === selection);
      if (opt) parts.push(opt.value);
    }
  });

  return {
    positive: parts.join(', '),
    negative: style.defaultNegative,
  };
}
```

---

## 四、app.js — 渲染与交互

```javascript
// 渲染风格选择卡片
function renderStyleCards() {
  const container = document.getElementById('style-cards');
  container.innerHTML = STYLE_TYPES.map(style => `
    <div class="style-card" data-id="${style.id}" onclick="selectStyle('${style.id}')">
      <span class="style-icon">${style.icon}</span>
      <span class="style-name">${style.name}</span>
      <span class="style-desc">${style.desc}</span>
    </div>
  `).join('');
}

// 选中风格后，动态渲染对应维度
function selectStyle(styleId) {
  state.styleId = styleId;
  state.selections = {};
  state.customSubject = '';

  // 高亮选中卡片
  document.querySelectorAll('.style-card').forEach(el => {
    el.classList.toggle('active', el.dataset.id === styleId);
  });

  const style = STYLE_TYPES.find(s => s.id === styleId);
  const container = document.getElementById('dimensions-container');

  container.innerHTML = style.dimensions.map(dimId => {
    const dim = DIMENSIONS[dimId];
    return renderDimension(dim);
  }).join('');

  // 显示配置区域
  document.getElementById('config-section').style.display = 'block';
  updatePreview();
}

// 渲染单个维度
function renderDimension(dim) {
  const requiredBadge = dim.required 
    ? '<span class="badge required">必填</span>' 
    : '<span class="badge optional">可选</span>';

  if (dim.type === 'input') {
    return `
      <div class="dimension-block" id="dim-${dim.id}">
        <div class="dim-header">
          <span class="dim-name">${dim.name}</span>
          ${requiredBadge}
          <span class="dim-tip">💡 ${dim.tip}</span>
        </div>
        <input 
          type="text" 
          class="subject-input"
          placeholder="${dim.placeholder}"
          oninput="onSubjectInput(this.value)"
        />
      </div>
    `;
  }

  const opts = OPTIONS[dim.id] || [];
  const isMulti = dim.type === 'multi-select';

  return `
    <div class="dimension-block" id="dim-${dim.id}">
      <div class="dim-header">
        <span class="dim-name">${dim.name}</span>
        ${requiredBadge}
        ${isMulti ? '<span class="multi-hint">可多选</span>' : ''}
        <span class="dim-tip">💡 ${dim.tip}</span>
      </div>
      <div class="options-grid">
        ${opts.map(opt => `
          <div 
            class="option-chip" 
            data-dim="${dim.id}" 
            data-label="${opt.label}"
            onclick="toggleOption('${dim.id}', '${opt.label}', ${isMulti})"
          >
            ${opt.label}
            ${opt.tag ? `<span class="opt-tag">${opt.tag}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 切换选项选中状态
function toggleOption(dimId, label, isMulti) {
  if (isMulti) {
    // 多选逻辑
    if (!state.selections[dimId]) state.selections[dimId] = [];
    const idx = state.selections[dimId].indexOf(label);
    if (idx > -1) {
      state.selections[dimId].splice(idx, 1);
    } else {
      state.selections[dimId].push(label);
    }
  } else {
    // 单选逻辑：再次点击取消选中
    state.selections[dimId] = state.selections[dimId] === label ? null : label;
  }

  // 更新UI高亮
  const chips = document.querySelectorAll(`[data-dim="${dimId}"]`);
  chips.forEach(chip => {
    const isSelected = isMulti
      ? state.selections[dimId]?.includes(chip.dataset.label)
      : state.selections[dimId] === chip.dataset.label;
    chip.classList.toggle('selected', isSelected);
  });

  updatePreview();
}

function onSubjectInput(value) {
  state.customSubject = value;
  updatePreview();
}

// 实时更新预览
function updatePreview() {
  const { positive, negative } = generatePrompt();
  document.getElementById('positive-output').textContent = positive || '请先选择风格并配置参数...';
  document.getElementById('negative-output').textContent = negative || '';
}

// 复制功能
function copyPrompt(type) {
  const { positive, negative } = generatePrompt();
  const text = type === 'positive' ? positive : negative;
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板 ✅');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderStyleCards();
});
```

---

## 五、index.html 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文生图提示词生成器</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="site-header">
    <h1>✨ 文生图提示词生成器</h1>
    <p>选择风格，配置参数，一键生成专业提示词</p>
  </header>

  <main class="container">

    <!-- Step 1: 选择风格 -->
    <section class="step-section">
      <h2 class="step-title">
        <span class="step-num">01</span> 选择图片风格
      </h2>
      <div id="style-cards" class="style-cards-grid"></div>
    </section>

    <!-- Step 2: 配置参数 -->
    <section class="step-section" id="config-section" style="display:none">
      <h2 class="step-title">
        <span class="step-num">02</span> 配置画面参数
      </h2>
      <div id="dimensions-container"></div>
    </section>

    <!-- Step 3: 生成结果 -->
    <section class="step-section result-section" id="result-section">
      <h2 class="step-title">
        <span class="step-num">03</span> 生成的提示词
      </h2>

      <div class="prompt-block">
        <div class="prompt-block-header">
          <span>✅ 正向提示词</span>
          <button onclick="copyPrompt('positive')" class="copy-btn">复制</button>
        </div>
        <div id="positive-output" class="prompt-output"></div>
      </div>

      <div class="prompt-block">
        <div class="prompt-block-header">
          <span>🚫 反向提示词</span>
          <button onclick="copyPrompt('negative')" class="copy-btn">复制</button>
        </div>
        <div id="negative-output" class="prompt-output negative"></div>
      </div>

    </section>

  </main>

  <div id="toast" class="toast"></div>

  <!-- 数据文件先加载 -->
  <script src="js/data/styles.js"></script>
  <script src="js/data/dimensions.js"></script>
  <script src="js/data/options.js"></script>
  <!-- 逻辑文件后加载 -->
  <script src="js/generator.js"></script>
  <script src="js/app.js"></script>

</body>
</html>
```

---

## 六、关键设计原则总结

```
数据 和 逻辑 完全分离
    ↓
新增一个风格类型：只改 styles.js
新增一个选项：    只改 options.js
调整拼接规则：    只改 generator.js

互不影响，维护成本极低
```