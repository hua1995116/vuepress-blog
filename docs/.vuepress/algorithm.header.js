const algorithm = require('../algorithm/meta.json')
const node = require('../node/meta.json')
const frontend = require('../frontend/meta.json')
const open = require('../open/meta.json')
const react = require('../react/meta.json')
const vue = require('../vue/meta.json')
const debug = require('../debug/meta.json')
const op = require('../op/meta.json')

function getHeader (posts) {
  return posts.map(x => {
    return [x.path, x.title]
  })
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
}
