---
layout: home

hero:
  name: Mini Markdown Editor
  tagline: 轻量级、高性能 markdown 编辑器
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/start
    - theme: alt
      text: 开发文档
      link: /docs
  image:
    src: logo.svg
    alt: logo

features:
  - title: 支持React
    icon:
      dark: /react_dark.svg
      light: /react_light.svg
    details: React版的markdown编辑器
  - title: 轻量级、高性能
    icon: 🚀
    details: 依赖体积小，十万内容依然流畅
  - title: 上手容易
    icon: 📝
    details: 快速上手，API简单易用
---

<style>
:root {
  --vp-home-hero-image-background-image: linear-gradient(-135deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>