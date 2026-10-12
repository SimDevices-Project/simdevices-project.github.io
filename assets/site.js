const carousel=document.querySelector('.showcase');
if(carousel){
 const slides=[...carousel.querySelectorAll('.slide')],tabs=[...carousel.querySelectorAll('[data-slide]')],track=carousel.querySelector('.slides'),count=document.querySelector('#slide-count');let current=0,start=null;
 function show(index){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==current);tabs.forEach((tab,i)=>{if(i===current)tab.setAttribute('aria-current','true');else tab.removeAttribute('aria-current')});count.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}
 tabs.forEach(tab=>tab.addEventListener('click',()=>show(Number(tab.dataset.slide))));carousel.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>show(current+Number(button.dataset.step))));
 track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1));track.focus({preventScroll:true})}});
 track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')start={x:event.clientX,y:event.clientY}});
 track.addEventListener('pointerup',event=>{if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){show(current+(dx<0?1:-1))}});
 track.addEventListener('pointercancel',()=>start=null);
}
