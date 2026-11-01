'use strict';
/* ================= 기본 도구 ================= */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const TEACHER_PW='1234';   // 교사 도우미 모드 비밀번호 (필요하면 여기서 바꾸세요)
const STORE_KEY='earthDefenders.v1';
let SC=1; // 무대 축소 비율

/* ================= 저장 ================= */
const DEF={hero:0,nick:'',cleared:{},cards:{},castle:false,first:'',promise:'',
  week:{c:[0,0,0,0,0,0,0],n:['','','','','','',''],cheer:''},certName:'',certY:'',certM:'',certD:'',
  set:{music:true,sfx:true,vol:1,mvol:.6,big:false,read:false,vp:0,vi:0}};
let S=JSON.parse(JSON.stringify(DEF));
const T={on:false}; // 교사 모드(저장하지 않음)
function load(){
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(raw){const o=JSON.parse(raw);S=Object.assign(JSON.parse(JSON.stringify(DEF)),o);
      S.set=Object.assign({},DEF.set,o.set||{});S.week=Object.assign({},DEF.week,o.week||{});}
  }catch(e){}
}
function save(){try{localStorage.setItem(STORE_KEY,JSON.stringify(S));}catch(e){}}
function resetAll(){S=JSON.parse(JSON.stringify(DEF));save();applySettings();}

/* ================= 소리 ================= */
const Aud={ctx:null,mus:null,sfxg:null,master:null,started:false,track:null,timer:null,step:0,next:0};
const midi=m=>440*Math.pow(2,(m-69)/12);
const TRACKS={
  home:{bpm:108,root:60,wave:'triangle',mel:[0,4,7,12,9,7,4,7,5,9,12,9,7,4,2,0],bass:[0,5,7,0]},
  map:{bpm:96,root:62,wave:'triangle',mel:[0,null,4,7,9,7,4,null,2,4,7,9,12,9,7,4],bass:[0,7,5,7]},
  w1:{bpm:112,root:65,wave:'square',mel:[0,2,4,2,7,4,2,0,0,4,7,12,9,7,4,2],bass:[0,5,0,7],vol:.6},
  w2:{bpm:120,root:67,wave:'triangle',mel:[0,4,0,4,7,null,4,7,9,7,4,2,0,null,2,4],bass:[0,0,5,7]},
  w3:{bpm:84,root:57,wave:'sine',mel:[0,4,7,null,9,7,4,null,2,4,7,4,0,null,null,null],bass:[0,7,5,0]},
  w4:{bpm:90,root:59,wave:'sine',mel:[7,4,0,4,7,9,12,9,7,4,2,4,7,null,null,null],bass:[0,5,7,5]},
  w5:{bpm:116,root:64,wave:'triangle',mel:[0,2,4,7,4,2,0,null,5,7,9,12,9,7,5,null],bass:[0,7,5,7]},
  w6:{bpm:76,root:64,wave:'sine',mel:[12,null,9,null,7,null,4,null,7,null,9,null,12,null,14,null],bass:[0,5,0,7]},
  w7:{bpm:80,root:62,wave:'sine',mel:[0,7,12,7,9,4,7,2,4,0,7,4,2,9,7,null],bass:[0,5,7,0]},
  boss:{bpm:92,root:57,wave:'sawtooth',mel:[0,null,3,null,7,null,3,0,0,null,5,null,8,null,5,3],bass:[0,0,-4,-2],vol:.45},
  joy:{bpm:124,root:60,wave:'triangle',mel:[0,4,7,12,7,4,7,12,9,12,16,12,7,12,14,16],bass:[0,5,7,0]}
};
function ensureAudio(){
  if(!Aud.ctx){
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      Aud.ctx=new C();Aud.master=Aud.ctx.createGain();Aud.master.connect(Aud.ctx.destination);
      Aud.mus=Aud.ctx.createGain();Aud.mus.connect(Aud.master);
      Aud.sfxg=Aud.ctx.createGain();Aud.sfxg.connect(Aud.master);
      applyVol();
    }catch(e){Aud.ctx=null;}
  }
  if(Aud.ctx&&Aud.ctx.state==='suspended'){try{Aud.ctx.resume();}catch(e){}}
}
function applyVol(){
  if(!Aud.ctx)return;
  const v=[.5,1,1.6][S.set.vol]||1;
  Aud.master.gain.value=v;
  Aud.mus.gain.value=musicLevel();
}
function note(freq,t,d,wave,g,dest){
  const c=Aud.ctx;if(!c)return;
  const o=c.createOscillator(),gn=c.createGain();
  o.type=wave;o.frequency.value=freq;
  gn.gain.setValueAtTime(0.0001,t);
  gn.gain.exponentialRampToValueAtTime(g,t+0.02);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+d);
  o.connect(gn);gn.connect(dest||Aud.mus);
  o.start(t);o.stop(t+d+0.05);
}
function tick(){
  const c=Aud.ctx;if(!c||!Aud.track||!S.set.music||!Aud.started)return;
  const TR=TRACKS[Aud.track];if(!TR)return;
  const dur=60/TR.bpm/2,vm=TR.vol||1;
  while(Aud.next<c.currentTime+0.3){
    const i=Aud.step%TR.mel.length,n=TR.mel[i];
    if(n!==null&&n!==undefined)note(midi(TR.root+n),Aud.next,dur*0.95,TR.wave,0.06*vm);
    if(i%4===0){const b=TR.bass[(i/4)%TR.bass.length];note(midi(TR.root+b-24),Aud.next,dur*3.6,'sine',0.1*vm);}
    Aud.next+=dur;Aud.step++;
  }
}
/* 배경음악: 파일을 WebAudio로 풀어서 반복 재생(막힘 방지), 안 되면 audio 태그로 */
function musicLevel(){return S.set.music?Math.max(0,Math.min(1,S.set.mvol==null?.6:S.set.mvol)):0;}
function loadMusic(){
  if(Aud.loading||Aud.buf||typeof MUSIC==='undefined'||!MUSIC||!Aud.ctx)return;
  Aud.loading=true;
  try{
    const b64=MUSIC.slice(MUSIC.indexOf(',')+1),bin=atob(b64),u8=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
    const done=buf=>{Aud.buf=buf;Aud.loading=false;musicApply();};
    const fail=()=>{Aud.loading=false;Aud.failed=true;musicApply();};
    const p=Aud.ctx.decodeAudioData(u8.buffer,done,fail);
    if(p&&p.catch)p.catch(fail);
  }catch(e){Aud.loading=false;Aud.failed=true;}
}
function musicEl(){
  if(!Aud.el&&typeof MUSIC!=='undefined'&&MUSIC){try{Aud.el=new Audio(MUSIC);Aud.el.loop=true;}catch(e){Aud.el=null;}}
  return Aud.el;
}
function setTrack(name){Aud.track=name;musicApply();}
function musicApply(){
  if(Aud.ctx)applyVol();
  if(!Aud.started)return;
  const lv=musicLevel();
  if(Aud.ctx&&!Aud.buf&&!Aud.failed)loadMusic();
  if(Aud.ctx&&Aud.buf){
    if(Aud.el){try{Aud.el.pause();}catch(e){}}
    if(!Aud.src){
      try{const s=Aud.ctx.createBufferSource();s.buffer=Aud.buf;s.loop=true;s.connect(Aud.mus);s.start(0);Aud.src=s;}catch(e){Aud.failed=true;}
    }
    if(Aud.ctx.state==='suspended'){try{Aud.ctx.resume();}catch(e){}}
    return;
  }
  if(Aud.failed||!Aud.ctx){
    const m=musicEl();if(!m)return;
    try{m.volume=lv;if(lv>0){const p=m.play();if(p&&p.catch)p.catch(()=>{});}else m.pause();}catch(e){}
  }
}
function startMusic(){
  ensureAudio();Aud.started=true;musicApply();
}
function sfx(kind){
  if(!S.set.sfx)return;
  ensureAudio();const c=Aud.ctx;if(!c)return;
  const t=c.currentTime;
  const seq={
    click:[[660,0,.07,'triangle',.1]],
    good:[[523,0,.12,'triangle',.14],[659,.09,.12,'triangle',.14],[784,.18,.2,'triangle',.14]],
    soft:[[392,0,.16,'sine',.1],[330,.12,.22,'sine',.1]],
    collect:[[880,0,.1,'sine',.14],[1175,.08,.1,'sine',.14],[1568,.16,.22,'sine',.14]],
    pop:[[500,0,.05,'square',.05],[760,.04,.07,'square',.05]],
    card:[[523,0,.12,'triangle',.15],[784,.1,.12,'triangle',.15],[1047,.2,.12,'triangle',.15],[1319,.3,.35,'triangle',.15]],
    fanfare:[[523,0,.14,'triangle',.16],[523,.14,.14,'triangle',.16],[523,.28,.14,'triangle',.16],[659,.42,.2,'triangle',.16],[784,.62,.5,'triangle',.16],[1047,1.1,.7,'triangle',.16]]
  }[kind]||[];
  seq.forEach(n=>note(n[0],t+n[1],n[2],n[3],n[4],Aud.sfxg));
}
function say(){}
function setRead(){}

/* ================= 설정 반영 ================= */
function applySettings(){
  $('#stage').style.setProperty('--fz',S.set.big?'1.18':'1');
  const b=$('#bMusic');
  b.classList.toggle('off',!S.set.music);
  b.setAttribute('aria-pressed',String(S.set.music));
  b.title=S.set.music?'음악 끄기':'음악 켜기';
  musicApply();
  if(window.vshow)window.vshow();
}
function setMusic(on){
  S.set.music=on;save();
  if(on){startMusic();setTrack(Aud.track||'home');}
  applySettings();
}

/* ================= 무대 크기 맞춤 ================= */
function fit(){
  const app=$('#app'),st=$('#stage');
  const w=app.clientWidth,h=app.clientHeight;if(!w||!h)return;
  SC=Math.min(w/1672,h/941);
  st.style.transform=`translate(-50%,-50%) scale(${SC})`;
  $('#rotate').hidden=!(h>w*1.05&&w<760);
}

/* ================= 토스트·효과 ================= */
let toastT=null;
function toast(msg,ms){
  const t=$('#toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),ms||2600);
}
function fx(emoji,x,y,parent){
  const f=el('div','fx',emoji);f.style.left=x+'px';f.style.top=y+'px';
  (parent||$('#view')).appendChild(f);setTimeout(()=>f.remove(),1200);
}

/* ================= 오버레이(모달) ================= */
function openOv(inner,cls){
  const ov=el('div','ov');
  const m=el('div','panel modal '+(cls||''));
  if(typeof inner==='string')m.innerHTML=inner;else m.appendChild(inner);
  ov.appendChild(m);$('#ovLayer').appendChild(ov);ov.close=()=>ov.remove();return ov;
}
function closeAllOv(){$('#ovLayer').innerHTML='';}
function confirmBox(msg,yes,no,onYes,onNo){
  const ov=openOv(`<p>${msg}</p><div class="acts"><button class="btn ghost" id="cN">${no}</button><button class="btn berry" id="cY">${yes}</button></div>`,'confirm');
  $('#cN',ov).onclick=()=>{sfx('click');ov.close();onNo&&onNo();};
  $('#cY',ov).onclick=()=>{sfx('click');ov.close();onYes&&onYes();};
  say(msg.replace(/<br>/g,' '));
}

/* ================= 하트 바 ================= */
function clearedCount(){return Object.keys(S.cleared).filter(k=>S.cleared[k]).length;}
function updateBar(){
  const n=clearedCount(),box=$('#hearts');
  let h='';
  for(let i=0;i<7;i++)h+=`<span class="h ${i<n?'on':''}">❤️</span>`;
  h+=`<span class="sep"></span><span class="h boss ${S.castle?'on':''}">💜</span>`;
  box.innerHTML=h;
  box.setAttribute('aria-label',`지구 하트 ${n}개, 대마왕 하트 ${S.castle?1:0}개`);
  $('#teacherTag').hidden=!T.on;
}

/* ================= 화면 이동 ================= */
const SCREENS={};
let token=0;
const TRACK_OF={start:'home',howto:'home',pick:'home',prologue:'home',map:'map',castle:'boss',celebrate:'joy',promise:'joy',cert:'joy',week:'joy',dex:'map'};
let CUR={name:'',arg:null,world:0};
function go(name,arg){
  token++;closeAllOv();
  const v=$('#view');v.innerHTML='';
  CUR={name,arg,world:name==='world'?arg:0,prev:CUR.name};
  const e=SCREENS[name](arg);
  v.appendChild(e);
  setTrack(name==='world'?'w'+arg:(TRACK_OF[name]||'home'));
  updateBar();save();
}
function alive(t){return t===token;}
