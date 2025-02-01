javascript:!function(){"use strict";(()=>{if(window.drawingApp)return void window.drawingApp.toggleDrawing();const o=document.createElement("style");o.innerHTML="#drawingCanvas, .rainbow-overlay { position: absolute; top: 0; left: 0; } .rainbow-overlay { top: 6px; left: 6px; } #drawingControls { position: fixed; top: 10px; left: 10px; } #drawingCanvas { z-index: 9999; } #drawingControls { z-index: 10000; display: flex; flex-direction: row; padding: 10px; border-radius: 8px; } #drawingControls input, .color-circle { margin: 5px; } .color-circle { width: 20px; height: 20px; border-radius: 50%25; cursor: pointer; border: 1px solid black; } .rainbow-gradient { background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000 ); } .color-picker-wrapper { position: relative; display: inline-block; } .rainbow-overlay { width: 48px; height: 25px; right: 0; bottom: 0; pointer-events: none; border-radius: 2px; display: none; }",document.head.appendChild(o);const i=document.createElement("canvas");i.id="drawingCanvas",document.body.appendChild(i);const d=i.getContext("2d");let r=!1,a=n()?"#ffffff":"#000000",l=5,c=!0,s=!1,p=!1;const u=[];i.width=document.body.scrollWidth,i.height=document.body.scrollHeight;const f=document.createElement("div");f.id="drawingControls",f.style.backgroundColor=n()?"rgb(175, 175, 175)":"rgb(75, 75, 75)",document.body.appendChild(f);const g=document.createElement("div");g.className="color-picker-wrapper";const m=document.createElement("input");m.type="color",m.value=a;const w=document.createElement("div");w.className="rainbow-overlay rainbow-gradient";const h=()=>{p=!1,w.style.display="none"};m.addEventListener("input",(e=>{p||(a=e.target.value)})),m.addEventListener("click",(e=>{p&&(e.preventDefault(),h())})),g.appendChild(m),g.appendChild(w),f.appendChild(g),function(e){let t=!1,[n,o,i,d]=[0,0,0,0];e.addEventListener("mousedown",(r=>{t=!0,n=r.clientX,o=r.clientY,i=e.offsetLeft,d=e.offsetTop,document.body.style.userSelect="none"})),document.addEventListener("mousemove",(r=>{if(!t)return;const a=r.clientX-n,l=r.clientY-o;e.style.left=`${i+a}px`,e.style.top=`${d+l}px`})),document.addEventListener("mouseup",(()=>{t=!1,document.body.style.userSelect=""}))}(f);["#000000","#ffffff","#ff0000","#00ff00","#0000ff"].forEach((e=>{const t=document.createElement("div");t.className="color-circle",t.style.backgroundColor=e,t.addEventListener("click",(()=>{a=e,m.value=e,h()})),f.appendChild(t)}));const y=document.createElement("div");y.className="color-circle rainbow-circle rainbow-gradient",y.addEventListener("click",(()=>{p=!0,w.style.display="block"})),f.appendChild(y);const v=document.createElement("input");v.type="range",v.min="1",v.max="50",v.value=l.toString(),v.addEventListener("input",(e=>l=parseInt(e.target.value,10))),v.addEventListener("mousedown",(e=>e.stopPropagation())),f.appendChild(v);const b=e=>({x:e.clientX+window.scrollX,y:e.clientY+window.scrollY});i.addEventListener("mousedown",(e=>{c&&(r=!0,s=!1,d.beginPath())})),i.addEventListener("mouseup",(n=>{if(c){if(r=!1,!s){const{x:o,y:i}=b(n);t(d,o,i,p?`hsl(${e(o,i)}, 100%25, 50%25)`:a,1.25*l)}u.push(d.getImageData(0,0,i.width,i.height))}})),i.addEventListener("mousemove",(n=>{if(!r||!c)return;const{x:o,y:i}=b(n);t(d,o,i,p?`hsl(${e(o,i)}, 100%25, 50%25)`:a,l),s=!0})),document.addEventListener("keydown",(e=>{c&&("Escape"===e.key?window.drawingApp.toggleDrawing():"z"===e.key&&e.ctrlKey&&u.length>0&&(u.pop(),d.clearRect(0,0,i.width,i.height),u.length>0&&d.putImageData(u[u.length-1],0,0)))})),window.drawingApp={toggleDrawing:()=>{c=!c,i.style.display=c?"block":"none",f.style.display=c?"flex":"none"}}})();const e=(e,t)=>(e+t)%25360;function t(e,t,n,o,i){e.lineWidth=i,e.strokeStyle=o,e.lineCap="round",e.lineTo(t,n),e.stroke(),e.beginPath(),e.moveTo(t,n)}function n(){const e=getComputedStyle(document.body).backgroundColor.match(/\d+/g),[t,n,o]=(null==e?void 0:e.map((e=>parseInt(e))))||[255,255,255];return(299*t+587*n+114*o)/1e3<128}}();
