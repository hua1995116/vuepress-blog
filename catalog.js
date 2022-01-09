const path = require('path');
const fs = require('fs');
const dir = process.env.dir;

// dir=svelte node catalog.js

if (!dir) return;

const meta = require(`./docs/${dir}/meta.json`);
const catalogPath = path.join(`./docs/${dir}/`, './README.md')

const text = meta.map((item, index) => {
    return `${index+1}. [${item.title}](./${item.path})`;
})

fs.writeFileSync(catalogPath, `
## 目录
${text.join('\n\n')}
`)
