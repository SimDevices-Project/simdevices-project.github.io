import {readFileSync,writeFileSync} from 'node:fs';
const parts=['header','footer'].map(tag=>[tag,readFileSync(new URL('../partials/'+tag+'.html',import.meta.url),'utf8').trim()]);
for(const [page,root] of [['index.html','./'],['products/simgeki-2/index.html','../../'],['products/simpad/index.html','../../']]){
 const file=new URL('../'+page,import.meta.url);
 let html=readFileSync(file,'utf8');
 for(const [tag,template] of parts){
  if((html.match(new RegExp('<'+tag+'\\b','g'))||[]).length!==1)throw new Error('Expected one '+tag+': '+page);
  html=html.replace(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'),template.replaceAll('{{ROOT}}',root));
 }
 writeFileSync(file,html);
}
