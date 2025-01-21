import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  title: "Mini Markdown Editor",
  description: "字节青训营项目: mini markdown editor",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                }
              }
            }
          }
        }
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '本页目录'
    },
    nav: [
      { text: '指南', link: '/guide', activeMatch: '/guide' },
      { text: '文档', link: '/docs', activeMatch: '/docs' },
      { text: '关于我们', link: '/team', activeMatch: '/team' },
    ],
    sidebar,
    sidebarMenuLabel: '菜单',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaotianna/mini-markdown-editor' },
      { icon: 'gitee', link: 'https://gitee.com/lin-yaozhen/mini-markdown-editor' }
    ]
  }
})
