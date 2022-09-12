const algorithm = require('../algorithm/meta.json')
const node = require('../node/meta.json')
const frontend = require('../frontend/meta.json')
const open = require('../open/meta.json')
const react = require('../react/meta.json')
const vue = require('../vue/meta.json')
const debug = require('../debug/meta.json')
const op = require('../op/meta.json')
const webpack = require('../webpack/meta.json')
const interview = require('../interview/meta.json')
const canvas = require('../canvas/meta.json')
const svelte = require('../svelte/meta.json')
const three = require('../three/meta.json')

const git = require('../git/meta.json')
const grow = require('../grow/meta.json')
const news = require('../news/meta.json')
const practice = require('../practice/meta.json')
const vscode = require('../vscode/meta.json')
const aipaint = require('../aipaint/meta.json')


function getHeader (posts) {
  const getPostPair = x => [x.path, x.sideTitle || x.title]
  if (posts[0] && posts[0].category) {
    let category = []
    for (const post of posts) {
      if (post.category) {
        category = [...category, { title: post.category, collapsable: false, children: [ getPostPair(post) ] }] 
      } else {
        category[category.length - 1].children.push(getPostPair(post))
      }
    }
    return category
  }
  return posts.map(getPostPair)
}

module.exports = {
  algorithm: getHeader(algorithm),
  node: getHeader(node),
  frontend: getHeader(frontend),
  open: getHeader(open),
  vue: getHeader(vue),
  react: getHeader(react),
  debug: getHeader(debug),
  op: getHeader(op),
  webpack: getHeader(webpack),
  interview: getHeader(interview),
  canvas: getHeader(canvas),
  svelte: getHeader(svelte),
  three: getHeader(three),
  git: getHeader(git),
  grow: getHeader(grow),
  news: getHeader(news),
  practice: getHeader(practice),
  vscode: getHeader(vscode),
  aipaint: getHeader(aipaint),
}
