const stage=document.querySelector('.sequence'),visual=document.querySelector('.visual'),canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false}),title=document.querySelector('.title'),track=document.querySelector('.track i');
const mobile=matchMedia('(max-width:700px)').matches,motion=matchMedia('(prefers-reduced-motion:reduce)'),dir=mobile?'mobile':'desktop',limit=mobile?2:3,cache=new Map(),downloads=new Map();let wanted=0,drawn=-2,busy=false,raf=0,heroVisible=true,warming=false,nextWarm=0;
const src=i=>i===-1?`assets/${dir}/reduced-off.webp?v=10-final`:`assets/${dir}/frame-${String(i).padStart(3,'0')}.webp?v=10-final`;
function frameBlob(i,priority='low'){if(!downloads.has(i))downloads.set(i,fetch(src(i),{priority}).then(r=>{if(!r.ok)throw Error('Frame unavailable');return r.blob()}).catch(e=>{downloads.delete(i);throw e}));return downloads.get(i)}
async function warm(){if(warming||motion.matches||navigator.connection?.saveData||!heroVisible||document.hidden)return;warming=true;await Promise.all(Array.from({length:3},async()=>{while(nextWarm<60&&heroVisible&&!document.hidden&&!motion.matches){const i=nextWarm++;try{await frameBlob(i)}catch{}}}));warming=false}
function clearBitmaps(){for(const b of cache.values())b.close();cache.clear();canvas.dataset.cached='0'}
async function render(){if(busy||drawn===wanted||!heroVisible||document.hidden)return;busy=true;const i=wanted;try{let bitmap=cache.get(i);if(!bitmap){bitmap=await createImageBitmap(await frameBlob(i,'high'));if(!heroVisible||document.hidden){bitmap.close();return}cache.set(i,bitmap);while(cache.size>limit){const k=cache.keys().next().value;cache.get(k).close();cache.delete(k)}}if(i!==wanted)return;if(canvas.width!==bitmap.width){canvas.width=bitmap.width;canvas.height=bitmap.height}ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0);canvas.style.opacity=1;drawn=i;canvas.dataset.frame=i;canvas.dataset.lights=i>=34?'on':'off';canvas.dataset.cached=cache.size}catch{canvas.dataset.error='Frame unavailable; poster retained';drawn=i}finally{busy=false;if(drawn!==wanted&&heroVisible&&!document.hidden)render()}}
function update(){raf=0;const y=-stage.getBoundingClientRect().top,p=Math.max(0,Math.min(1,y/(motion.matches?innerHeight:stage.offsetHeight-innerHeight)));wanted=motion.matches?(p>=.25?59:-1):Math.round(p*59);title.style.opacity=motion.matches?1:1-Math.min(1,p*2.4)*.72;track.style.transform=`scaleX(${p})`;document.querySelector('.instruction').hidden=motion.matches;render()}
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});addEventListener('resize',update);motion.addEventListener('change',update);new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;canvas.dataset.active=String(heroVisible);if(heroVisible){drawn=-2;update();warm()}else clearBitmaps()}).observe(stage);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearBitmaps();else{drawn=-2;update();warm()}});update();setTimeout(warm,350);








