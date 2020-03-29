const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const ignore = ['.vuepress'];
const ignoreFile = ['README.md', 'meta.json']

function loop(dir) {
    const dirs = fs.readdirSync(dir);
    if (dirs.length && dirs[0].includes('.md')) {
        const meta = [];
        for (let i = 0; i < dirs.length; i++) {
            const filePath = path.join(dir, dirs[i]);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                continue;
            }
            if (ignoreFile.includes(dirs[i])) {
                continue;
            }
            const file = fs.readFileSync(filePath);
            const context = file.toString();
            const fileName = dirs[i];
            const date = dayjs(stat.atime).format('YYYY-MM-DD HH:mm:ss');
            const title = context.split('\n')[0].replace('#', '');
            meta.push({
                title,
                date,
                path: fileName.replace('.md', '')
            })
        }
        console.log(meta);
        fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta));
    }
    dirs.map(item => {
        const childPath = path.join(dir, item);
        const stat = fs.statSync(childPath);
        if (stat.isDirectory() && !ignore.includes(item)) {
            loop(childPath);
        }
    })
}

loop('./docs');