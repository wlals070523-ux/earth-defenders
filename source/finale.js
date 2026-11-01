/* ================= 대마왕의 성 ================= */
const CASTLE=[
 {n:'부엌',bg:'linear-gradient(180deg,#ffe9cf 0,#ffe9cf 64%,#c98b55 64%,#b87a45)',card:8,items:[
   {em:'☕',x:230,y:240,w:1,cap:'일회용 컵',tip:'텀블러를 써요'},
   {em:'🍝',x:640,y:400,w:1,cap:'먹다 남긴 음식',tip:'먹을 만큼 덜어요'},
   {em:'🛍️',x:1010,y:190,w:1,cap:'비닐봉지',tip:'장바구니를 써요'},
   {em:'🚰',x:1300,y:300,w:1,cap:'흐르는 수돗물',tip:'설거지할 때 물을 아껴요'},
   {em:'🍳',x:450,y:160},{em:'🍎',x:850,y:430},{em:'🫖',x:120,y:440}]},
 {n:'거실',bg:'linear-gradient(180deg,#e6dcff 0,#e6dcff 64%,#a98bd6 64%,#9674c4)',card:5,items:[
   {em:'💡',x:300,y:90,w:1,cap:'켜진 전등',tip:'사용하지 않는 전등을 꺼요'},
   {em:'📺',x:880,y:290,w:1,cap:'계속 켜진 텔레비전',tip:'보지 않는 화면은 꺼요'},
   {em:'🧊',x:1300,y:240,w:1,cap:'열린 냉장고 문',tip:'냉장고 문을 꼭 닫아요'},
   {em:'📚',x:560,y:430,w:1,cap:'읽지 않고 쌓아 둔 책',tip:'책은 친구들과 돌려 봐요'},
   {em:'🛋️',x:130,y:380},{em:'🪴',x:780,y:490},{em:'🖼️',x:1090,y:80}]},
 {n:'놀이터',bg:'linear-gradient(180deg,#bfe6ff 0,#d6f3c8 64%,#7bc96f 64%,#5fb457)',card:7,items:[
   {em:'🥤',x:300,y:450,w:1,cap:'아무 데나 버린 페트병',tip:'페트병을 분리배출해요'},
   {em:'📄',x:820,y:300,w:1,cap:'한쪽만 쓰고 버린 종이',tip:'종이 앞뒤를 모두 써요'},
   {em:'🗑️',x:1230,y:400,w:1,cap:'넘치는 쓰레기통',tip:'쓰레기를 줄여요'},
   {em:'🌳',x:130,y:130},{em:'⚽',x:600,y:530},{em:'🦆',x:1050,y:150},{em:'⛲',x:1400,y:110}]}
];
SCREENS.castle=function(){
  const t=token,e=el('div','screen world castle-scr');
  e.innerHTML=`<div class="head"><div class="ttl" id="cTtl"></div><div class="bubble" id="wb"></div></div><div class="room-scene" id="cRoom"></div><div class="prog" id="wProg"></div>`;
  const total=CASTLE.reduce((a,r)=>a+r.items.filter(i=>i.w).length,0);
  let found=0;const learned=[];
  function say2(msg){const b=$('#wb',e);b.innerHTML=bubbleHTML(msg);bindSay(b,msg);say(msg);}
  function prog(){let h='';for(let i=0;i<total;i++)h+=`<span class="p ${i<found?'on':''}"></span>`;$('#wProg',e).innerHTML=h;}
  prog();
  function room(ri){
    const r=CASTLE[ri],box=$('#cRoom',e);box.innerHTML='';box.style.background=r.bg;
    $('#cTtl',e).textContent=`🏰 대마왕의 성 · ${r.n} (${ri+1}/3)`;
    say2(`${r.n}에서 지구를 아프게 하는 물건을 찾아 눌러 보세요!`);
    const pr=el('div','practice');pr.style.display='none';box.appendChild(pr);
    let here=0;const need=r.items.filter(i=>i.w).length;
    r.items.forEach(it=>{
      const b=el('button','fnd',it.em);b.style.left=it.x+'px';b.style.top=it.y+'px';b.setAttribute('aria-label',it.w?it.cap:'성 안의 물건');
      box.appendChild(b);
      if(it.w)b.classList.add('glow');
      b.onclick=()=>{
        if(!it.w){sfx('soft');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');toast('여긴 괜찮아요! 지구를 아프게 하는 물건을 더 찾아봐요.',1800);return;}
        if(b._f)return;b._f=1;b.classList.remove('glow');b.classList.add('found');b.insertAdjacentHTML('beforeend','<span class="found-mark">✅</span>');
        sfx('good');found++;here++;prog();learned.push(it);
        pr.appendChild(el('div','pcard',`${it.em} ${it.cap} → 대신 이렇게 해요! <b>${it.tip}</b>`));
        say2(`${it.cap}! 대신 이렇게 해요. ${it.tip}`);
        if(here===need)setTimeout(()=>{
          if(!alive(t))return;
          const c=CARDS[r.card-1];S.cards[c.n]=true;save();sfx('card');
          toast(`🃏 비법 카드 ${c.n} 획득! ${c.t}`,3000);
          const nb=el('button','btn sun',ri<2?'다음 방으로 ▶':'대마왕을 만나러 가요! 😈');
          nb.style.cssText='position:absolute;right:30px;top:18px;z-index:12';
          nb.onclick=()=>{sfx('click');ri<2?room(ri+1):boss();};box.appendChild(nb);
        },900);
      };
    });
  }
  async function boss(){
    const box=$('#cRoom',e);box.innerHTML='';box.style.background='linear-gradient(180deg,#2c1b55,#6a3fc2 120%)';
    $('#cTtl',e).textContent='🏰 대마왕의 성 · 대마왕의 방';
    const b=el('div','',bossSVG(false));b.style.cssText='position:absolute;left:560px;top:20px;width:430px;height:430px;transition:transform 1.4s,opacity .6s;transform-origin:50% 90%';
    box.appendChild(b);
    const pr=el('div','practice');pr.style.bottom='12px';learned.forEach(it=>pr.appendChild(el('div','pcard',`${it.em} ${it.tip}`)));box.appendChild(pr);
    sfx('soft');say2('우리가 알려 준 실천 카드를 보여 주자!');
    const sl=ms=>new Promise(r=>setTimeout(()=>{if(alive(t))r();},ms));
    await sl(2600);say2('“으윽… 나는 지구를 괴롭히고 싶었던 게 아니야. 지구를 아끼는 방법을 몰랐어.”');
    b.style.transform='scale(.8)';await sl(3600);
    say2('“나도 지구 수비대가 될래!”');b.style.transform='scale(.55)';sfx('collect');await sl(2200);
    b.style.opacity='0';await sl(500);
    b.innerHTML=bossSVG(true);b.style.transform='scale(.8)';b.style.opacity='1';b.style.animation='bob 2.4s ease-in-out infinite';
    sfx('fanfare');S.castle=true;save();updateBar();
    for(let k=0;k<6;k++)fx('✨',300+k*160,80+(k%3)*120,box);
    say2('대마왕이 귀여운 ‘아낌이’로 변신했어요!');
    const nb=el('button','btn sun','지구 하트를 완성하자! ❤️');nb.style.cssText='position:absolute;right:30px;top:18px;z-index:12;font-size:38px';
    nb.onclick=()=>{sfx('click');go('celebrate');};box.appendChild(nb);
  }
  room(0);return e;
};

/* ================= 지구 회복 축하 ================= */
SCREENS.celebrate=function(){
  const e=el('div','screen cele');e.style.backgroundImage=`url(${IMG.cel})`;
  const hero=HEROES[S.hero-1]||HEROES[0];
  let c='';for(let i=0;i<22;i++)c+=`<span class="confetti" style="left:${Math.round(Math.random()*1600)}px;animation-duration:${(4+Math.random()*4).toFixed(1)}s;animation-delay:${(-Math.random()*6).toFixed(1)}s">${['🎊','✨','🌸','⭐','🎉'][i%5]}</span>`;
  const msg='고마워, 지구 수비대!<br>너희의 작은 실천이 나를 다시 웃게 했어!';
  e.innerHTML=`<div class="heartglow"></div>${c}
   <div class="words">${msg}</div>
   <div style="position:absolute;left:8px;top:640px;width:240px">${heroSVG(hero)}</div>
   <div style="position:absolute;right:14px;top:690px;width:210px">${bossSVG(true)}</div>
   <button class="btn sun" id="cNext" style="position:absolute;left:835px;top:760px;transform:translateX(-50%);min-height:70px;font-size:36px">나의 실천 약속 정하기 ▶</button>`;
  $('#cNext',e).onclick=()=>{sfx('click');go('promise');};
  sfx('fanfare');setTimeout(()=>say(msg.replace('<br>',' ')),700);
  return e;
};

/* ================= 나의 실천 약속 ================= */
SCREENS.promise=function(){
  const e=el('div','screen promise');
  const msg='게임 속에서 한 약속을 이제 진짜 생활에서도 해 볼까?';
  e.innerHTML=`<div style="position:absolute;left:100px;top:100px;width:1470px"><div class="bubble">${bubbleHTML(msg)}</div></div><div class="grid" id="pg" style="top:250px"></div>
   <div style="position:absolute;left:100px;right:100px;top:820px;display:flex;justify-content:flex-end;gap:16px"><button class="btn sun" id="pNext">임명장 받기 🎖️</button></div>`;
  bindSay($('.bubble',e),msg);
  const grid=$('#pg',e);
  const isOwn=()=>S.promise&&!PROMISES.some(p=>p.t===S.promise);
  function render(){
    grid.innerHTML='';
    PROMISES.forEach(p=>{
      const b=el('button','opt'+(S.promise===p.t?' on':''),`<span class="ic">${p.ic}</span>${p.t}`);
      b.onclick=()=>{sfx('pop');S.promise=p.t;save();render();};grid.appendChild(b);
    });
    const own=isOwn()||S._own;
    const ob=el('button','opt'+(own?' on':''),`<span class="ic">✏️</span>직접 쓰기`);
    ob.onclick=()=>{sfx('pop');S._own=true;if(!isOwn())S.promise='';save();render();setTimeout(()=>{const x=$('#pOwn2',grid);x&&x.focus();},50);};
    grid.appendChild(ob);
    if(own){
      const inp=el('input','txt');inp.id='pOwn2';inp.maxLength=34;inp.placeholder='나의 실천 약속을 써 보세요';inp.value=isOwn()?S.promise:'';
      inp.oninput=()=>{S.promise=inp.value.trim();save();$('#pNext',e).disabled=!S.promise;};grid.appendChild(inp);
    }
    $('#pNext',e).disabled=!S.promise;
  }
  $('#pNext',e).onclick=()=>{sfx('card');delete S._own;go('cert');};
  render();setTimeout(()=>say(msg),300);return e;
};

/* ================= 지구지킴이 임명장 ================= */
SCREENS.cert=function(){
  const e=el('div','screen cert');e.style.backgroundImage=`url(${IMG.cel})`;
  const pr=S.promise?S.promise:'＿＿＿＿＿＿＿＿＿＿＿＿';
  e.innerHTML=`<div class="doc">
    <div class="rw t" style="top:0">임 명 장</div>
    <div class="rw nm" style="top:64px">이름 : <input id="cN" class="blank" maxlength="10" aria-label="이름"></div>
    <div class="rw line" style="top:112px">위 사람은 「우리는 지구 수비대 : 지구 구하기 월드」의 모든<br>미션을 해내며, 지구를 아끼고 보살피는 마음과 실천을 보여 주었으므로<br>지구지킴이로 임명합니다.</div>
    <div class="rw line" style="top:218px;font-family:var(--f-display);font-size:28px">나의 실천 약속 : <span class="u">${pr}</span></div>
   </div>
   <div class="btns">
    <button class="btn small ghost" id="bPrint">🖨 인쇄하기</button>
    <button class="btn small ocean" id="bImg">🖼 이미지로 저장하기</button>
    <button class="btn small sun" id="bWeek">📅 7일 실천 체크표</button>
    <button class="btn small grape" id="bDex">📚 나의 용사 도감</button>
    <button class="btn small berry" id="bAgain">🔄 다시 탐험하기</button>
   </div>`;
  const map={cN:'certName'};
  Object.keys(map).forEach(k=>{const i=$('#'+k,e);i.value=S[map[k]]||'';i.oninput=()=>{S[map[k]]=i.value;save();};});
  $('#bPrint',e).onclick=()=>{sfx('click');printPage();};
  $('#bImg',e).onclick=()=>{sfx('click');saveCertImage();};
  $('#bWeek',e).onclick=()=>{sfx('click');go('week');};
  $('#bDex',e).onclick=()=>{sfx('click');go('dex',{from:'cert'});};
  $('#bAgain',e).onclick=()=>{sfx('click');
    confirmBox('월드를 처음부터 다시 탐험할까요?<br>용사와 얻은 카드는 그대로예요.','다시 탐험할래요','그만둘래요',()=>{S.cleared={};S.castle=false;S.promise='';save();go('map');});};
  sfx('fanfare');setTimeout(()=>say('지구지킴이 임명장이에요. 이름을 써 보세요.'),500);
  return e;
};
async function saveCertImage(){
  const c=document.createElement('canvas');c.width=1672;c.height=941;const g=c.getContext('2d');
  const img=new Image();img.src=IMG.cel;
  await new Promise(r=>{img.onload=r;img.onerror=r;});
  g.drawImage(img,0,0,1672,941);
  try{await document.fonts.load('52px Jua');await document.fonts.load('28px "Gowun Dodum"');}catch(e){}
  const F=(px,f)=>`${px}px ${f||'Jua'}, "Gowun Dodum", "Malgun Gothic", sans-serif`;
  g.fillStyle='#4a2f00';g.textAlign='center';g.textBaseline='alphabetic';
  const cx=835;
  g.font=F(52);g.fillText('임   명   장',cx,606);
  g.font=F(30);g.textAlign='right';g.fillText('이름 :',cx-60,652);
  g.textAlign='left';
  const name=(S.certName||'').trim();
  if(name){g.fillText(name,cx-30,652);}
  g.strokeStyle='#8a5a00';g.lineWidth=3;g.beginPath();g.moveTo(cx-40,660);g.lineTo(cx+250,660);g.stroke();
  g.textAlign='center';g.font=F(28,'"Gowun Dodum"');
  ['위 사람은 「우리는 지구 수비대 : 지구 구하기 월드」의 모든','미션을 해내며, 지구를 아끼고 보살피는 마음과 실천을 보여 주었으므로','지구지킴이로 임명합니다.'].forEach((t,i)=>g.fillText(t,cx,700+i*34));
  g.font=F(28);const lab='나의 실천 약속 : ';
  const w1=g.measureText(lab).width,pt=S.promise||'',w2=Math.max(g.measureText(pt).width,380),total=w1+w2;
  g.textAlign='left';g.fillText(lab,cx-total/2,806);g.fillText(pt,cx-total/2+w1+10,806);
  g.beginPath();g.moveTo(cx-total/2+w1,814);g.lineTo(cx+total/2+10,814);g.stroke();

  let url='';try{url=c.toDataURL('image/png');}catch(e){}
  const wrap=el('div');
  wrap.innerHTML=`<h3>🖼 임명장 이미지</h3><div class="ovtext">${url?'아래 그림을 길게 누르거나 마우스 오른쪽 버튼을 눌러 저장하세요. 저장한 그림은 그대로 인쇄할 수 있어요.':'이미지를 만들지 못했어요. 화면을 캡처해서 저장해 주세요.'}</div>
   <div style="text-align:center;margin-top:10px">${url?`<img class="cert-img" alt="지구지킴이 임명장" src="${url}">`:''}</div><div class="acts"><button class="btn" id="iClose">닫기</button></div>`;
  const ov=openOv(wrap);ov.firstChild.style.width='1180px';
  $('#iClose',wrap).onclick=()=>{sfx('click');ov.close();};
}

/* ================= 교사 도우미 모드 ================= */
function openTeacher(){
  if(T.on){openTeacherPanel();return;}
  const wrap=el('div','',`<h3>👩‍🏫 교사 도우미 모드</h3><div class="ovtext">비밀번호를 입력해 주세요.</div><input id="tPw" class="txt" type="password" inputmode="numeric" maxlength="12" autocomplete="off" aria-label="비밀번호" style="margin-top:12px"><div class="acts"><button class="btn ghost" id="tNo">닫기</button><button class="btn grape" id="tOk">열기</button></div>`);
  const ov=openOv(wrap,'confirm');
  const ok=()=>{
    if($('#tPw',wrap).value===TEACHER_PW){sfx('good');T.on=true;updateBar();ov.close();openTeacherPanel();}
    else{sfx('soft');toast('비밀번호가 맞지 않아요.',1800);$('#tPw',wrap).value='';}
  };
  $('#tOk',wrap).onclick=ok;$('#tNo',wrap).onclick=()=>ov.close();
  $('#tPw',wrap).addEventListener('keydown',ev=>{if(ev.key==='Enter')ok();});
  setTimeout(()=>$('#tPw',wrap).focus(),50);
}
function openTeacherPanel(){
  const hero=HEROES[S.hero-1];
  const wrap=el('div');
  const cards=Object.keys(S.cards).filter(k=>S.cards[k]).length;
  wrap.innerHTML=`<h3>👩‍🏫 교사 도우미</h3>
   <div class="tstat">용사: <b>${hero?hero.name:'아직 안 골랐어요'}</b>${S.nick?` (별명 ${S.nick})`:''}<br>월드 ${clearedCount()}/7 · 비법 카드 ${cards}/10 · 대마왕의 성 ${S.castle?'클리어':'아직'}<br>실천 약속: ${S.promise||'아직 없음'}</div>
   <div style="font-family:var(--f-display);font-size:34px;margin-top:12px">월드 바로 열기</div>
   <div class="teacher-grid" id="tw"></div>
   <div class="acts" style="justify-content:flex-start" id="ta"></div>
   <div class="acts"><button class="btn ghost small" id="tEnd">교사 모드 끝내기</button><button class="btn" id="tClose">닫기</button></div>`;
  const ov=openOv(wrap);
  WORLDS.forEach(w=>{const b=el('button','btn small'+(S.cleared[w.id]?'':' ocean'),`${w.em} ${w.name}${S.cleared[w.id]?' ⭐':''}`);b.style.fontSize='24px';b.style.padding='4px 10px';
    b.onclick=()=>{ov.close();go('world',w.id);};$('#tw',wrap).appendChild(b);});
  const ta=$('#ta',wrap);
  const add=(t,cls,fn)=>{const b=el('button','btn small '+cls,t);b.onclick=()=>{sfx('click');fn();};ta.appendChild(b);};
  if(CUR.name==='world')add('✅ 지금 월드 클리어 처리','sun',()=>{
    const w=WORLDS[CUR.arg-1];S.cleared[w.id]=true;S.cards[w.card]=true;save();ov.close();go('map');toast(`${w.name} 클리어 처리했어요.`);});
  add('🏰 대마왕의 성 바로 열기','grape',()=>{ov.close();go('castle');});
  add('🎖️ 임명장 바로 보기','ocean',()=>{ov.close();go('cert');});
  add('🧹 전체 초기화','berry',()=>{ov.close();confirmBox('모든 진행 기록을 지울까요?','지울래요','그만둘래요',()=>{resetAll();go('start');toast('처음 상태로 돌렸어요.');});});
  $('#tEnd',wrap).onclick=()=>{T.on=false;updateBar();ov.close();toast('교사 모드를 끝냈어요.');};
  $('#tClose',wrap).onclick=()=>{sfx('click');ov.close();};
}
