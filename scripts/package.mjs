import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import JSZip from 'jszip';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const zip = new JSZip();
const files = ['csh-assistant.php', 'knowledge.txt', 'public/index.html', 'public/app.js', 'public/demo.js', 'public/widget.js', 'public/app.css'];
for (const file of files) zip.file('csh-study-companion/' + file, await fs.readFile(path.join(root, file)));
await fs.mkdir(path.join(root, 'dist'), {recursive: true});
await fs.writeFile(path.join(root, 'dist', 'csh-study-companion.zip'), await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
console.log('Created dist/csh-study-companion.zip');
