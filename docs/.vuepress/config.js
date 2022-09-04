const _ = require('lodash')
const path = require('path')
const { algorithm, open, react, vue, node, frontend, debug, op, webpack, interview, canvas, svelte, three, git, grow, news, practice, vscode } = require('./algorithm.header')

function getFrontMatter (path, pp = './post') {
  const posts = require(pp)
  const postsByPath = _.keyBy(posts, 'path')
  const p = path.split(/\.|\//)[2]
  return _.get(postsByPath, p)
}

function extendMetaByPath (page, path) {
  if (page.path.includes(`/${path}`)) {
    const fm = getFrontMatter(page.path, `../${path}/meta.json`)
    // console.log("page===", fm, page.path);
    if (fm) {
      page.frontmatter = {
        ...page.frontmatter,
        ...fm,
      }
    }
    
  }
}

const outputConfig = {}

if (process.env.NODE_ENV === 'production') {
  outputConfig.output = {
    publicPath: 'https://cdn.qiufeng.blue/'
  }
    
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, '../assets')
      }
    },
    ...outputConfig
  },
  base: '/',
  title: '秋风的笔记',
  description: '',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['link', { rel: "stylesheet", href: "//at.alicdn.com/t/c/font_3628743_4xl29jxdfaf.css" } ], 
    ['script', {}, `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?fd8e413c5ce47d78c95f742fc41a7118";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    `]
  ],
  themeConfig: {
    repo: 'hua1995116/vuepress-blog',
    sidebarDepth: 2,
    nav: [
      { text: '主页', link: '/' },
      {
        text: '前端系列', items: [
          {text: 'js文章', link: '/frontend/' },
          {text: 'react实践', link: '/react/' },
          {text: 'vue实践', link: '/vue/' },
          {text: 'debug系列', link: '/debug/' },
          {text: 'webpack系列', link: '/webpack/' },
          {text: 'canvas系列', link: '/canvas/' },
          {text: 'git系列', link: '/git/' },
          {text: '前端学习系列', link: '/grow/' },
          {text: '前端新闻', link: '/news/' },
          { text: '前端实践', link: '/practice/' },
          { text: 'vscode', link: '/vscode/' },
        ]
      },
      { text: 'Svelte系列', link: '/svelte/' },
      { text: 'Three.js系列', link: '/three/' },
      { text: 'Node系列', link: '/node/' },
      { text: '面试', link: '/interview/' },
      // { text: '机器学习', link: '/machine/' },
      { text: '算法', link: '/algorithm/' },
      { text: '前端运维', link: '/op/' },
      { text: '开源项目', link: '/open/' },
      // { text: 'react 实践', link: '/react/' },
      // { text: 'vue 实践', link: '/vue/' },
      // { text: '关于我', link: '/about' },
      // {
      //   text: '笔记', items: [
      //     { text: 'flutter', link: '/post/flutter-guide/' },
      //     { text: 'Grid Layout', link: '/post/Grid-Guide/' },
      //     { text: 'spark', link: '/post/learning-spark/' },
      //     { text: 'scala', link: '/post/learning-scala/' },
      //   ]
      // },
    ],
    sidebar: {
      '/algorithm/': algorithm,
      '/node/': node,
      '/vue/': vue,
      '/react/': react,
      '/open/': open,
      '/frontend/': frontend,
      '/debug/': debug,
      '/op/': op,
      '/webpack/': webpack,
      '/interview/': interview,
      '/canvas/': canvas,
      '/svelte/': svelte,
      '/three/': three,
      '/git/': git,
      '/grow/': grow,
      '/news/': news,
      '/practice/': practice,
      '/vscode/': vscode
    },
    lastUpdated: 'Last Updated'
  },
  patterns: ['**/*.md', '**/*.vue', '!vue/vue-demo/**', '!frontend/demo/**'],
  plugins: [
    [ 
      '@vuepress/google-analytics',
      {
        'ga': 'UA-112201282-4'
      }
    ], 
    [
      'sitemap',
      {
        hostname: 'https://qiufeng.blue'
      },
    ],
    (options, ctx) => {
      return {
        name: 'archive',
        async additionalPages () {
          return [
            // {
            //   path: '/post/',
            //   frontmatter: {
            //     archive: true
            //   }
            // },
            {
              path: '/',
              frontmatter: {
                home: true
              }
            }
          ]
        },
        extendPageData($page) {
          extendMetaByPath($page, 'debug');
          extendMetaByPath($page, 'react');
          extendMetaByPath($page, 'webpack');
          extendMetaByPath($page, 'node');
          extendMetaByPath($page, 'vue');
          extendMetaByPath($page, 'interview');
          extendMetaByPath($page, 'node/websocket');
          extendMetaByPath($page, 'svelte');
          extendMetaByPath($page, 'three');
          extendMetaByPath($page, 'op');
          extendMetaByPath($page, 'algorithm');
          extendMetaByPath($page, 'babel');
          extendMetaByPath($page, 'canvas');
          extendMetaByPath($page, 'frontend');
          extendMetaByPath($page, 'interview');
          extendMetaByPath($page, 'git');
          extendMetaByPath($page, 'grow');
          extendMetaByPath($page, 'news');
          extendMetaByPath($page, 'practice');
          extendMetaByPath($page, 'vscode');

          // extendMetaByPath($page, 'database');

          
        //   // extendMetaByPath($page, 'node')
          // if ($page.path.includes('/post')) {
          //   const fm = getFrontMatter($page.path)
          //   if (fm) {
          //     $page.frontmatter = {
          //       ...fm,
          //       ...$page.frontmatter
          //     }
          //   }
          // }
          if ($page.frontmatter.keywords) {
            const meta = $page.frontmatter.meta
            $page.frontmatter.meta = meta ? [
              ...meta,
              {
                name: 'keywords',
                content: $page.frontmatter.keywords
              }
            ] : [
              {
                name: 'keywords',
                content: $page.frontmatter.keywords
              }
            ]
          }
          // if (/^\/(code)\/.+?$/.test($page.path)) {
          //   $page.frontmatter.sidebar = 'auto'
          // }
          // if (/^\/op\/.+?$/.test($page.path)) {
          //   $page.frontmatter.metaTitle = `${$page.title} | 个人 | 秋风的笔记`
          // }
        }
      }
    }
  ]
}
