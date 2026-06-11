---
name: md-to-slides
description: 将 Markdown 文档提炼为章节化 Slide 大纲，再生成 Keynote 级别的网页 PPT（单 HTML 文件，零依赖）。支持快捷键翻页、激光笔模式、全屏、过渡动画。适用于培训、分享、视频会议投屏场景。当用户说「帮我做 PPT」「把这篇文档做成幻灯片」「md-to-slides」「文档转 PPT」「帮我出 Slides」「我要分享这篇文章」「做个演示文稿」时触发。
---

# MD to Slides

将 Markdown 文档提炼为网页版 PPT（HTML Slides），对标 Keynote 审美，支持培训/分享/视频会议投屏三种场景，零外部依赖，浏览器直接打开即可使用。

> ⚠️ **核心原则**：Slide ≠ 文档的搬运，而是文档核心观点的二次提炼。每张 Slide 只表达一个核心主张，文字极度精简，视觉层次清晰，留白是设计的一部分。禁止引用 CDN 资源。

---

## Step 1：读取并分析 Markdown 文件

用 `read_file` 工具读取用户指定的 Markdown 文件全部内容。

内部分析以下四个维度（不输出给用户）：

**① 文档类型识别**
- 教学 / 培训（方法论、步骤、框架）
- 观点分享 / 演讲（核心论点 + 论据）
- 产品 / 方案介绍（What / Why / How）
- 数据报告 / 复盘（背景 → 数据 → 结论）
- 工具指南 / 操作手册（流程 + 命令）

**② 情绪基调识别**：严肃专业 / 活泼轻快 / 深沉思辨 / 实用工程

**③ 关键结构盘点**：章节数、列表数、代码块、表格、金句/引用

**④ 预估 Slide 数量**：`章节数 × 1.5 + 封面 + 尾页`，控制在 8–20 张

分析完成后，自动进入 Step 2。

---

## Step 2：推理并展示风格候选

根据文档气质推理 **2–3 个**视觉风格，格式如下展示给用户：

```
我分析了这篇文档，内容类型是 [类型]，基调偏 [基调]。

推荐以下 [2/3] 种 Slide 风格：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
风格 A：[风格名称]
  适合理由：[一句话]
  视觉关键词：[3–5 个词，如：深色背景 · 大字标题 · 左侧色条 · 高亮数字]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
风格 B：[风格名称]
  适合理由：[一句话]
  视觉关键词：[3–5 个词]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
（风格 C 可选）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请选择风格（A / B / C），或描述你想要的方向。
预计生成 [N] 张 Slide（含封面和尾页）。
```

**等待用户回复：**
- 选 A / B / C → 进入 Step 3
- 「随便/你选」→ 选风格 A，告知用户，进入 Step 3
- 「直接生成/跳过」→ 选风格 A，**跳过 Step 3**，直接进入 Step 4

---

## Step 3：确认 Slide 大纲

在生成 HTML 前，先输出提炼后的 Slide 大纲供用户确认，格式：

```
📋 Slide 大纲（共 N 张）

Slide 01 | 封面
  标题：[文档主标题]
  副标题：[一句话概括]

Slide 02 | [章节/主题名]
  核心主张：[≤15字，单句]
  要点：
    • [≤12字]
    • [≤12字]
    • [≤12字]（最多3–4条）

Slide 03 | ...

Slide N  | 谢谢 / Q&A

确认大纲后开始生成 HTML，或告知我需要调整的 Slide。
```

**等待用户回复：**
- 「确认/可以/生成」→ 进入 Step 4
- 用户提出修改 → 更新对应 Slide，重新展示，再次等待
  - 再次等待时，如用户回复「确认」→ 进入 Step 4
  - 如用户回复「直接生成/算了就这样」→ 进入 Step 4
  - 如用户回复「重新选风格/从头来」→ 返回 Step 2，重新展示风格候选
  - **最多修改 3 轮后，若用户仍未确认，主动提示：「已完成 3 轮调整，是否直接生成当前版本？」**
- 「直接生成/不用看大纲」→ 直接进入 Step 4

---

## Step 4：生成 HTML Slides 文件

### 4.1 Slide 内容规范

| 元素 | 规范 |
|------|------|
| 封面 | 大标题 + 副标题 + 演讲者/日期（可选） |
| 章节 Slide | 核心主张（≤20字，大字）+ 要点列表（≤4条，每条≤15字）|
| 引用/金句 Slide | 全屏大字引用，署名小字 |
| 代码 Slide | 等宽字体代码块 + 简短说明标题 |
| 数据/对比 Slide | 大数字高亮 / 两栏对比布局 |
| 尾页 | 「谢谢」或「Q & A」+ 联系方式（可选）|

**每张 Slide 只表达一个核心主张。文字量超过4条要点时，拆成两张 Slide。**

### 4.2 HTML 生成技术规范

**结构：**
- 所有 CSS 内联在 `<style>` 中，所有 JS 内联在 `<script>` 中
- 禁止任何外部 CDN 引用（字体、库、样式表）
- 每张 Slide 是一个 `<section class="slide">` 元素
- 使用系统字体栈，参考下方字体配置

> ⚠️ **已知坑点（必须遵守，否则必现 bug）**
>
> **坑 1：装饰性背景元素（blur 光晕/orb）禁止放在 slide 内部**
> `filter: blur()` 的 ink overflow 会撑大父级 flex 容器的内容区，导致 `justify-content: center` 失效，封面/尾页内容偏下。
> ✅ 正确做法：**不使用** `filter: blur` 光晕效果；如需背景装饰，用纯色渐变背景即可。
>
> **坑 2：切换动画中的鬼影问题——必须用 `visibility` 隔离非活跃 slide**
> 仅用 `opacity: 0` 隐藏非活跃 slide 不够，在某些浏览器合成层下会透出内容。
> ✅ 正确做法：非 active slide 同时设 `opacity: 0; visibility: hidden`；动画中的 exit/enter slide 设 `visibility: visible`；动画结束后清理 `style.visibility` 交回 CSS 控制。
>
> **坑 3：封面居中必须用 `margin: auto` wrapper，不能只靠 `justify-content`**
> 封面内容元素直接作为 flex 子项时，`justify-content: center` 容易被级联覆盖或受其他子项干扰。
> ✅ 正确做法：封面所有内容包裹在 `.cover-body` wrapper 内，wrapper 设 `margin: auto`，这样无论父级 `justify-content` 是什么值都能强制居中。
>
> **坑 4：`#stage` 必须用 `inset: 0` 铺满视口，禁止用居中缩放卡片模式**
> 用 `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)` 配合固定宽高会让 stage 浮在灰色 body 上，形成「卡片悬浮」效果，与 Keynote 满屏审美严重割裂。
> ✅ 正确做法：`#stage { position: fixed; inset: 0; }` 铺满全视口；`html, body { background: var(--bg-slide); }` 与 slide 背景色保持一致，消除任何缝隙感。
>
> **坑 5：尾页（End Slide）禁止使用与主色调对立的背景色**
> 在白色风格的 Slide 集中，给尾页单独设置深色背景（如 `background: #1d1d1f`）会造成视觉断层，用户翻到最后一页时极为突兀。
> ✅ 正确做法：尾页背景统一使用 `var(--bg-slide)`，所有文字颜色同样使用 CSS 变量（`var(--text-h1)`、`var(--text-muted)`），**禁止在尾页硬编码任何与主色调冲突的颜色**。深色风格的尾页只应出现在深色主题整体中。

**系统字体栈：**
```css
/* 标题 */
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
             'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
/* 正文/要点 */
font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont,
             'PingFang SC', 'Hiragino Sans GB', sans-serif;
/* 代码 */
font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', Consolas, monospace;
```

**slide 基础 CSS 模板（包含坑点修复）：**
```css
.slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(2rem, 6vw, 5rem) clamp(2.5rem, 8vw, 7rem);
  opacity: 0;
  visibility: hidden;          /* 坑2修复：防鬼影 */
  pointer-events: none;
  transition: opacity 0.45s ease, transform 0.45s ease;
  transform: translateX(60px);
  overflow: hidden;             /* 防止子元素溢出影响布局 */
  z-index: 0;
}
.slide.active {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
  transform: translateX(0);
  z-index: 2;
}
/* 动画中的 exit/enter slide 需设 visibility: visible（在 JS 里设置） */

/* 坑3修复：封面居中用 wrapper + margin: auto */
.cover-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;                 /* 强制垂直居中，不依赖 justify-content */
  text-align: center;
}
```

**必须实现的功能：**

1. **键盘快捷键翻页**
   - `→` / `↓` / `Space` / `PageDown`：下一张
   - `←` / `↑` / `PageUp`：上一张
   - `Home`：第一张，`End`：最后一张
   - `F`：全屏切换
   - `L`：激光笔模式切换
   - `Esc`：退出全屏 / 关闭激光笔
   - `G` 或数字+`Enter`：跳转到指定页

2. **翻页过渡动画**
   - 默认：向左滑动（`translateX`）+ `opacity` 渐变
   - 可选风格：向上推入（深色极客风）/ 淡入淡出（简洁商务风）
   - 过渡时长：`0.4s cubic-bezier(0.4, 0, 0.2, 1)`
   - 动画期间禁止再次触发翻页（防连点）

3. **激光笔模式**（按 `L` 激活）
   - 鼠标位置出现红色发光圆点（直径 24px，`box-shadow` 红色晕光）
   - 激活时隐藏系统光标（`cursor: none`）
   - 退出时恢复光标

4. **全屏功能**（按 `F` 或点击全屏按钮）
   - 使用 `document.documentElement.requestFullscreen()` 原生 API
   - 全屏时隐藏 UI 控件（进度条/导航按钮）3秒后自动隐藏，鼠标移动时显示
   - 全屏状态下支持键盘翻页

5. **幻灯片导航 UI**
   - 底部居中：`当前页 / 总页数` 指示器
   - 左下角：上一张按钮（`‹`）
   - 右下角：下一张按钮（`›`）+ 全屏按钮（`⛶`）+ 激光笔按钮（`●`）
   - 所有控件在全屏 3 秒后自动隐藏，鼠标移动时重新显示（`opacity` 渐变）

6. **缩略图预览抽屉**（按 `O` 或 `Tab` 打开）
   - 底部抽屉展开，显示所有 Slide 缩略图（4列布局）
   - 点击缩略图直接跳转
   - 当前页高亮边框

7. **响应式支持**
   - Slide 比例固定 `16:9`，使用 `vw`/`vh` 加 CSS `aspect-ratio: 16/9` 保持比例
   - 宽度 100%，高度自适应
   - 全屏模式下拉伸填满视口

### 4.3 风格参考库

详见 [slide-design-tokens.md](slide-design-tokens.md)

简要参考：

**极简极客暗黑（技术/工程类文档）**
- 背景 `#0d1117`，标题 `#e6edf3`，强调 `#58a6ff`
- 等宽字体点缀，代码块语法高亮

**Keynote 白色经典（培训/教学类）**
- 背景 `#ffffff`，标题 `#1d1d1f`，强调 `#0071e3`（Apple 蓝）
- 大字标题，细线分隔，圆角卡片

**深邃渐变演讲（观点分享/演讲类）**
- 背景渐变 `#1a1a2e → #16213e`，强调 `#e94560` 或 `#f5a623`
- 大数字 / 引言全屏布局

**温暖麻纸手记（人文/教育/写作者）**
- 背景 `#faf6ef`，标题 `#2c2316`，强调 `#8b4513`
- 衬线字体，软阴影卡片

### 4.4 输出文件

- 文件名：输入 `my-doc.md` → 输出 `my-doc-slides.html`
- 输出路径：与输入 Markdown 文件同目录
- 禁止仅在对话中展示代码而不写入文件

**生成完成后告知用户：**

```
✅ 已生成：[输出文件路径]
风格：[选定风格] · 共 [N] 张 Slide · 文件大小：约 [估算]

快捷键参考：
  → / Space   下一张    ← / ↑   上一张
  F           全屏      L       激光笔
  O / Tab     缩略图    G       跳页

用浏览器直接打开：
  open [输出文件路径]
```

告知用户后，Skill 执行结束。如需调整样式、修改内容或重新生成，请重新触发本 Skill。

---

## 边界情况

**文档过短（< 3 个章节 / < 300 字）**
→ 提示：「文档内容较少，预计只能生成 [N] 张 Slide，继续吗？」

**文档过长（> 3000 字 / > 10 个章节）**
→ 提示：「文档较长，建议聚焦核心章节生成 Slide（预计 15+ 张）。是全量生成，还是指定章节？」

**含大量代码（代码占比 > 50%）**
→ 代码 Slide 只展示关键片段（≤ 15 行），其余以「见文档详细代码」替代，不强塞完整代码

**含图片引用**
→ 远程图片保留引用；本地图片告知用户离线访问需保持相对路径

---

## 版本记录

| 日期 | 变更 |
|------|------|
| 2026-06-11 | v1.0 初始版本：四步流程（分析→风格→大纲→生成），七大交互功能（键盘/激光笔/全屏/缩略图/导航/动画/响应式） |
| 2026-06-11 | v1.1 坑点反哺：① blur 光晕禁止放 slide 内（撑坏 flex 布局）② visibility 隔离防鬼影 ③ 封面用 cover-body + margin:auto 居中 |
| 2026-06-11 | v1.2 坑点反哺：④ stage 必须用 inset:0 满屏，禁止居中卡片模式（割裂感）⑤ 尾页背景必须与主色调一致，禁止硬编码对立色 |
