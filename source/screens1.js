/* ================= 시작 · 설정 · 사용방법 · 용사 고르기 · 프롤로그 · 지도 · 도감 · 체크표 ================= */
function bubbleHTML(txt){return `<span class="btx">${txt}</span>`;}
function bindSay(){}

/* ---------- 시작 ---------- */
SCREENS.start=function(){
  const e=el('div','screen start');
  e.style.backgroundImage=`url(${IMG.start})`;
  e.innerHTML=`<div class="logo"><div class="a">우리는 지구 수비대</div><div class="b">지구 구하기 월드</div></div>
  <div class="menu">
   <button class="btn" id="gStart">▶ 모험 시작</button>
   <button class="btn sun" id="gHow">📖 사용방법</button>
   <button class="btn ocean" id="gSet">⚙️ 설정</button>
   <button class="btn grape" id="gDex">📚 용사 도감</button>
  </div>
  <div class="volbox"><button class="vb" id="vMute" aria-label="음악 끄기 켜기"></button><input type="range" id="vRange" min="0" max="100" step="5" aria-label="음악 크기"><span id="vNum"></span></div>
  <div class="credit"><span class="who">🌿 만든사람 <b>이경미 선생님</b></span><span class="mail">✉️ elisa30@naver.com</span></div>`;
  $('#gStart',e).onclick=()=>{startMusic();sfx('click');go(S.hero?'map':'pick');};
  $('#gHow',e).onclick=()=>{sfx('click');go('howto');};
  $('#gSet',e).onclick=()=>{sfx('click');openSettings();};
  $('#gDex',e).onclick=()=>{sfx('click');go('dex',{from:'start'});};
  const vr=$('#vRange',e),vn=$('#vNum',e),vm=$('#vMute',e);
  function vshow(){const p=Math.round((S.set.mvol||0)*100);vr.value=p;vn.textContent=S.set.music?p+'%':'꺼짐';vm.textContent=(!S.set.music||p===0)?'🔇':(p<40?'🔉':'🔊');vr.style.setProperty('--p',p+'%');}
  vr.oninput=()=>{S.set.mvol=vr.value/100;if(S.set.mvol>0&&!S.set.music)S.set.music=true;save();ensureAudio();Aud.started=true;applySettings();vshow();};
  vm.onclick=()=>{ensureAudio();setMusic(!S.set.music);if(S.set.music&&!S.set.mvol){S.set.mvol=.6;save();musicApply();}vshow();};
  vshow();window.vshow=()=>{if(CUR.name==='start'&&document.body.contains(vr))vshow();};
  setTimeout(()=>say('우리는 지구 수비대, 지구 구하기 월드'),300);
  return e;
};

/* ---------- 설정 ---------- */
function openSettings(){
  closeAllOv();
  const wrap=el('div');
  const ov=openOv(wrap);
  function seg(label,ic,opts,cur,cb){
    const r=el('div','row');
    r.innerHTML=`<div class="lab">${ic} ${label}</div>`;
    const s=el('div','seg');
    opts.forEach(o=>{
      const b=el('button',cur===o[1]?'on':'',o[0]);
      b.onclick=()=>{cb(o[1]);sfx('click');render();};
      s.appendChild(b);
    });
    r.appendChild(s);return r;
  }
  function render(){
    wrap.innerHTML='<h3>⚙️ 설정</h3>';
    wrap.appendChild(seg('배경음악','🎵',[['켜기',true],['끄기',false]],S.set.music,v=>setMusic(v)));
    wrap.appendChild(seg('효과음','🔔',[['켜기',true],['끄기',false]],S.set.sfx,v=>{S.set.sfx=v;save();}));
    wrap.appendChild(seg('효과음 크기','🔊',[['낮게',0],['보통',1],['크게',2]],S.set.vol,v=>{S.set.vol=v;save();applySettings();}));
    wrap.appendChild(seg('글자 크기','🔠',[['보통',false],['크게',true]],S.set.big,v=>{S.set.big=v;save();applySettings();}));
    const a=el('div','acts');
    a.innerHTML=`<button class="btn small berry" id="sReset">🔁 처음부터 다시 하기</button><button class="btn small grape" id="sTeach">👩‍🏫 교사 도우미 모드</button><button class="btn" id="sClose">닫기</button>`;
    wrap.appendChild(a);
    $('#sClose',wrap).onclick=()=>{sfx('click');ov.close();};
    $('#sReset',wrap).onclick=()=>{sfx('click');ov.close();
      confirmBox('정말 처음부터 다시 할까요?<br>용사, 하트 조각, 비법 카드, 실천 약속이 모두 지워져요.','다시 시작할래요','그만둘래요',()=>{resetAll();go('start');toast('처음부터 다시 시작해요!');});};
    $('#sTeach',wrap).onclick=()=>{sfx('click');ov.close();openTeacher();};
  }
  render();
}

/* ---------- 사용방법 ---------- */
SCREENS.howto=function(){
  const pages=[
    {pic:'🗺️',tx:'지도에서 가고 싶은 월드를 눌러요.'},
    {pic:'🎣🧺',tx:'월드에서 지구를 돕는 행동을 해요.<br>끌어 놓기, 찾기, 고르기, 길 만들기 등 재미있는 게임이 기다리고 있어요.'},
    {pic:'❤️🏰',tx:'하트 조각 7개를 모으면 대마왕의 성이 열려요.'},
    {pic:'🎖️',tx:'대마왕에게 지구를 아끼는 방법을 알려 주고, 지구지킴이 임명장을 받아요.'}
  ];
  let i=0;
  const e=el('div','screen howto');
  e.innerHTML=`<div class="card"><div class="pic" id="hPic"></div><div><div class="no" id="hNo"></div><div class="tx" id="hTx"></div></div></div>
   <div class="dots" id="hDots"></div>
   <div class="nav"><button class="btn ghost" id="hPrev">◀ 이전</button><button class="btn" id="hNext">다음 ▶</button></div>`;
  function render(){
    $('#hPic',e).innerHTML=pages[i].pic;$('#hPic',e).style.fontSize=pages[i].pic.length>4?'150px':'230px';
    $('#hNo',e).textContent=`${i+1} / ${pages.length}`;
    $('#hTx',e).innerHTML=pages[i].tx;
    $('#hDots',e).innerHTML=pages.map((_,k)=>`<span class="dot ${k===i?'on':''}"></span>`).join('');
    $('#hPrev',e).style.visibility=i?'visible':'hidden';
    const nx=$('#hNext',e);
    nx.textContent=i===pages.length-1?'알겠어요! 용사가 될래요':'다음 ▶';
    nx.className='btn '+(i===pages.length-1?'sun':'');
    say(pages[i].tx.replace(/<br>/g,' '));
  }
  $('#hPrev',e).onclick=()=>{sfx('click');i=Math.max(0,i-1);render();};
  $('#hNext',e).onclick=()=>{sfx('click');if(i<pages.length-1){i++;render();}else{startMusic();go('pick');}};
  render();return e;
};

/* ---------- 용사 고르기 ---------- */
SCREENS.pick=function(){
  let idx=S.hero?S.hero-1:0;
  const e=el('div','screen pick');
  e.innerHTML=`<div class="big" id="pBig"></div>
   <button class="btn ghost arrow" id="pL" style="left:20px" aria-label="이전 용사">◀</button>
   <button class="btn ghost arrow" id="pR" style="left:650px" aria-label="다음 용사">▶</button>
   <div class="info"><div class="nm" id="pNm"></div><div class="sp" id="pSp"></div><div class="ds" id="pDs"></div>
    <div class="nick"><label for="pNick">별명(선택)</label><input id="pNick" class="txt" maxlength="8" placeholder="예: 민지" autocomplete="off"></div>
    <div class="dim" style="font-size:28px;margin-top:8px">별명을 지으면 게임 속에서 별명으로 불러 줘요.</div></div>
   <button class="btn sun go" id="pGo">이 용사로 출발! ▶</button>
   <div class="strip" id="pStrip"></div>`;
  const strip=$('#pStrip',e);
  HEROES.forEach((h,k)=>{
    const b=el('button','thumb',heroSVG(h,{still:true}));b.setAttribute('aria-label',h.name);
    b.onclick=()=>{sfx('pop');idx=k;render();};strip.appendChild(b);
  });
  $('#pNick',e).value=S.nick||'';
  function render(){
    const h=HEROES[idx];
    $('#pBig',e).innerHTML=heroSVG(h);
    $('#pNm',e).textContent=h.name;
    $('#pSp',e).textContent='특기 · '+h.sp;
    $('#pDs',e).textContent=h.ds;
    $$('.thumb',e).forEach((b,k)=>b.classList.toggle('on',k===idx));
    say(h.name+'. '+h.ds);
  }
  $('#pL',e).onclick=()=>{sfx('pop');idx=(idx+19)%20;render();};
  $('#pR',e).onclick=()=>{sfx('pop');idx=(idx+1)%20;render();};
  $('#pGo',e).onclick=()=>{
    sfx('good');S.hero=idx+1;S.nick=($('#pNick',e).value||'').trim().slice(0,8);save();
    go('prologue');
  };
  render();return e;
};

/* ---------- 프롤로그 ---------- */
SCREENS.prologue=function(){
  let i=0;
  const e=el('div','screen pro');
  e.innerHTML=`<div class="stagebox" id="prArt"></div><div class="say-box"><div class="bubble" id="prTx"></div></div>
   <div class="nextrow"><button class="btn ghost" id="prPrev">◀ 이전</button><span class="dim" id="prNo" style="color:#fff;font-family:var(--f-display)"></span><button class="btn" id="prNext">다음 ▶</button></div>`;
  const options=['지구야, 내가 도와줄게!','우리 함께 깨끗한 지구를 만들자!','지구야, 다시 환하게 웃어 줘!'];
  const steps=[
    {tx:()=>'지구의 빨간 하트가 일곱 조각으로 깨졌어요!',art:()=>{
      let p='';for(let k=0;k<7;k++){const a=k/7*Math.PI*2;p+=`<span class="piece" style="--dx:${Math.round(Math.cos(a)*520)}px;--dy:${Math.round(Math.sin(a)*230)}px;animation-delay:${(.9+k*.05).toFixed(2)}s">❤️</span>`;}
      return `<div class="ch" style="background:radial-gradient(circle at 50% 45%,#5a3ea0,#1b1440 72%)"><div class="bigheart">❤️</div>${p}</div>`;}},
    {tx:()=>'낭비 대마왕이 쓰레기 안개를 세상에 퍼뜨렸어요!',art:()=>
      `<div class="ch" style="background:linear-gradient(180deg,#3b3a4d,#1b1a26)"><div class="fogc" style="left:60px;top:300px"></div><div class="fogc" style="left:880px;top:260px"></div><div class="fogc" style="left:420px;top:380px"></div><div class="boss" style="left:470px;top:60px;width:380px;height:380px">${bossSVG(false)}</div></div>`},
    {tx:()=>'지구가 힘없이 말해요.<br>“지구 수비대야, 나를 도와줘!”',art:()=>
      `<div class="ch" style="background:linear-gradient(180deg,#59607a,#2a2c3d)"><div class="boss" style="left:470px;top:70px;width:380px;height:380px;animation:none">${earthSVG('sad')}</div><div class="fogc" style="left:40px;top:340px"></div><div class="fogc" style="left:900px;top:340px"></div></div>`},
    {tx:()=>`${heroName()}!<br>“걱정 마! 우리가 지구 하트를 되찾을게!”`,art:()=>
      `<div class="ch" style="background:linear-gradient(180deg,#8fd8ff,#d8f6ff)"><div class="boss" style="left:80px;top:150px;width:300px;height:300px;animation:none">${earthSVG('happy')}</div><div class="boss" style="left:480px;top:40px;width:420px;height:470px;animation:none">${heroSVG(HEROES[S.hero-1]||HEROES[0])}</div></div>`},
    {tx:()=>'지구에게 보내는 첫 말을 골라요. 직접 써도 좋아요.',art:()=>'choose'}
  ];
  function render(){
    const st=steps[i];
    $('#prTx',e).innerHTML=bubbleHTML(st.tx());bindSay($('#prTx',e),st.tx());
    const art=$('#prArt',e);
    if(st.art()==='choose'){
      art.style.background='linear-gradient(180deg,#bfe6ff,#dff6c8)';
      art.innerHTML=`<div style="position:absolute;inset:0;padding:30px 60px;display:flex;flex-direction:column;gap:16px;justify-content:center" id="chs"></div>`;
      const box=$('#chs',art);
      options.forEach(t=>{
        const b=el('button','opt'+(S.first===t?' on':''),`<span class="ic">💬</span>${t}`);
        b.onclick=()=>{sfx('pop');S.first=t;save();render();};box.appendChild(b);
      });
      const own=!options.includes(S.first)&&S.first!=='';
      const b=el('button','opt'+(own?' on':''),`<span class="ic">✏️</span>직접 쓰기`);
      b.onclick=()=>{sfx('pop');S.first=own?S.first:' ';save();render();setTimeout(()=>{const x=$('#pOwn',art);x&&x.focus();},50);};
      box.appendChild(b);
      if(own||S.first===' '){
        const inp=el('input','txt');inp.id='pOwn';inp.maxLength=30;inp.placeholder='지구에게 하고 싶은 말';
        inp.value=S.first===' '?'':S.first;inp.oninput=()=>{S.first=inp.value.trim()||' ';save();$('#prNext',e).disabled=!inp.value.trim();};
        box.appendChild(inp);
      }
    }else{
      art.style.background='';art.innerHTML=st.art();
    }
    $('#prNo',e).textContent=`${i+1} / ${steps.length}`;
    $('#prPrev',e).style.visibility=i?'visible':'hidden';
    const nx=$('#prNext',e),last=i===steps.length-1;
    nx.textContent=last?'지도로 출발! 🗺️':'다음 ▶';nx.className='btn '+(last?'sun':'');
    nx.disabled=last&&(!S.first||S.first===' ');
    say(st.tx());
    if(i===0)setTimeout(()=>sfx('soft'),600);
  }
  $('#prPrev',e).onclick=()=>{sfx('click');i=Math.max(0,i-1);render();};
  $('#prNext',e).onclick=()=>{sfx('click');if(i<steps.length-1){i++;render();}else{go('map');}};
  render();return e;
};

/* ---------- 지도 ---------- */
SCREENS.map=function(){
  const e=el('div','screen map');
  e.style.backgroundImage=`url(${IMG.map})`;
  const n=clearedCount(),all=n>=7;
  let html='';
  WORLDS.forEach(w=>{if(!S.cleared[w.id])html+=`<div class="fog" style="left:${w.x}px;top:${w.y}px"></div>`;});
  html+=`<button class="castle" id="mCastle" aria-label="대마왕의 성"></button>`;
  html+=`<div class="label" style="left:795px;top:262px">🏰 대마왕의 성${S.castle?' ✅':''}</div>`;
  if(all)html+=`<div class="unlock" style="left:790px;top:118px">${S.castle?'🔓':'🔑'}</div>`;
  WORLDS.forEach(w=>{
    const d=!!S.cleared[w.id];
    html+=`<button class="spot ${d?'done':''}" data-w="${w.id}" style="left:${w.x}px;top:${w.y}px" aria-label="${w.name}${d?' 클리어':''}"><span class="ring"></span><span class="em">${w.em}</span>${d?'<span class="star">⭐</span>':''}</button>`;
    html+=`<div class="label" style="left:${w.lx}px;top:${w.ly}px">${w.name}</div>`;
  });
  if(S.first&&S.first!==' ')html+=`<div class="words" style="left:836px;top:330px">${S.first}</div>`;
  html+=`<div class="dock"><button class="btn small ocean" id="mDex">📚 용사 도감</button>${S.castle?'<button class="btn small sun" id="mCert">🎖️ 임명장</button><button class="btn small grape" id="mWeek">📅 7일 체크표</button>':''}</div>`;
  e.innerHTML=html;
  $$('.spot',e).forEach(b=>b.onclick=()=>{sfx('pop');go('world',+b.dataset.w);});
  $('#mCastle',e).onclick=()=>{
    if(all){sfx('good');go('castle');}
    else{sfx('soft');const c=$('#mCastle',e);c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');toast(`하트 조각 7개를 모두 모으면 열려요! (${n}/7)`);say(`하트 조각 7개를 모두 모으면 열려요`);}
  };
  $('#mDex',e).onclick=()=>{sfx('click');go('dex',{from:'map'});};
  if(S.castle){$('#mCert',e).onclick=()=>{sfx('click');go('cert');};$('#mWeek',e).onclick=()=>{sfx('click');go('week');};}
  setTimeout(()=>{if(CUR.name==='map')say(all?'대마왕의 성이 열렸어요!':'가고 싶은 월드를 눌러요');},400);
  return e;
};

/* ---------- 용사 도감 ---------- */
SCREENS.dex=function(arg){
  const from=(arg&&arg.from)||'map';
  const e=el('div','screen dex');
  const sc=el('div','scroll');
  const got=Object.keys(S.cards).filter(k=>S.cards[k]).length;
  sc.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h4 style="margin:0;font-size:52px">📚 용사 도감</h4><button class="btn small ocean" id="dxBack">◀ 돌아가기</button></div>
   <h4>지구를 지키는 용사 20명</h4><div class="hg" id="dxH"></div><div class="detail" id="dxD"></div>
   <h4>지구 지킴 비법 카드 (${got}/10)</h4><div class="cg" id="dxC"></div>
   <h4>월드 도장 (${clearedCount()}/7)</h4><div class="stamps" id="dxS"></div>
   <h4>대마왕에서 변신한 친구</h4><div id="dxB"></div>`;
  e.appendChild(sc);
  const hg=$('#dxH',sc);
  HEROES.forEach(h=>{
    const b=el('button','hc'+(S.hero===h.id?' me':''),`${heroSVG(h,{still:true})}<div>${h.name.replace(' 용사','')}</div>`);
    b.onclick=()=>{sfx('pop');showDetail(h);};hg.appendChild(b);
  });
  function showDetail(h){
    const d=$('#dxD',sc);
    d.innerHTML=`<div class="panel" style="display:flex;gap:30px;align-items:center;padding:16px 30px"><div style="width:190px;flex:none">${heroSVG(h)}</div><div style="flex:1"><div style="font-family:var(--f-display);font-size:48px">${h.name}</div><div class="sp" style="display:inline-block;background:var(--sun);border-radius:20px;padding:2px 18px;font-family:var(--f-display);font-size:28px">특기 · ${h.sp}</div><div style="font-size:30px;margin-top:6px">${h.ds}</div></div>${S.hero===h.id?'<div style="font-family:var(--f-display);font-size:32px;color:var(--leaf-d)">⭐ 지금 함께하는 용사</div>':'<button class="btn small" id="dxPick">이 용사로 바꾸기</button>'}</div>`;
    say(h.name+'. '+h.ds);
    const p=$('#dxPick',d);if(p)p.onclick=()=>{sfx('good');S.hero=h.id;save();toast(h.name+'와 함께해요!');go('dex',{from});};
    d.scrollIntoView&&d.scrollIntoView({block:'nearest'});
  }
  const cg=$('#dxC',sc);
  CARDS.forEach(c=>{
    const has=S.cards[c.n];
    cg.appendChild(el('div','cd'+(has?'':' lock'),has?`<div class="ic">${c.ic}</div>${c.t}`:`<div class="ic">❓</div>아직 얻지 못한 카드`));
  });
  const st=$('#dxS',sc);
  WORLDS.forEach(w=>st.appendChild(el('div','st'+(S.cleared[w.id]?'':' lock'),`${w.em} ${w.name} ${S.cleared[w.id]?'⭐':''}`)));
  $('#dxB',sc).innerHTML=S.castle?`<div class="panel" style="display:flex;gap:26px;align-items:center;padding:12px 30px"><div style="width:170px">${bossSVG(true)}</div><div style="font-family:var(--f-display);font-size:40px">아낌이<div style="font-size:28px;font-family:var(--f-body)">지구를 아끼는 방법을 배워서 함께하게 된 친구예요.</div></div></div>`:`<div class="st lock" style="display:inline-block">❓ 대마왕의 성을 클리어하면 만날 수 있어요</div>`;
  $('#dxBack',sc).onclick=()=>{sfx('click');go(from==='start'?'start':(S.hero?'map':'start'));};
  return e;
};

/* ---------- 7일 실천 체크표 ---------- */
SCREENS.week=function(){
  const e=el('div','screen week');
  const days=['월','화','수','목','금','토','일'];
  const sheet=el('div','sheet');
  sheet.innerHTML=`<h4 style="font-family:var(--f-display);font-size:50px;margin:0 0 4px">📅 7일 실천 체크표</h4>
   <div style="font-size:34px;margin-bottom:6px">나의 약속 : <b>${S.promise||'＿＿＿＿＿＿＿＿＿＿＿＿'}</b></div>
   <table><thead><tr><th></th><th>실천했나요?</th><th>오늘 내가 한 행동</th></tr></thead><tbody id="wk"></tbody></table>
   <div style="display:flex;gap:16px;align-items:center;margin-top:4px"><label for="wkC" style="font-family:var(--f-display);font-size:32px;white-space:nowrap">가족·친구의 응원 한마디</label><input id="wkC" class="txt" maxlength="40"></div>
   <div style="display:flex;gap:16px;justify-content:flex-end;margin-top:14px"><button class="btn small ghost" id="wkPrint">🖨 인쇄하기</button><button class="btn small ocean" id="wkBack">◀ 임명장으로</button></div>`;
  e.appendChild(sheet);
  const nav=el('div','');nav.style.cssText='position:absolute;right:40px;top:104px;display:flex;gap:14px;z-index:5';
  nav.innerHTML='<button class="btn small ocean" id="wkB1">◀ 임명장으로</button><button class="btn small sun" id="wkB2">🗺️ 월드 지도</button>';
  e.appendChild(nav);
  $('#wkB1',nav).onclick=()=>{sfx('click');go('cert');};
  $('#wkB2',nav).onclick=()=>{sfx('click');go('map');};
  const tb=$('#wk',sheet);
  days.forEach((d,k)=>{
    const tr=el('tr');
    tr.innerHTML=`<td>${d}</td><td class="c"><button class="chk ${S.week.c[k]?'on':''}" aria-label="${d}요일 실천">${S.week.c[k]?'✔':''}</button></td><td><input class="txt" maxlength="30" aria-label="${d}요일 한 일"></td>`;
    const b=$('button',tr),inp=$('input',tr);inp.value=S.week.n[k]||'';
    b.onclick=()=>{S.week.c[k]=S.week.c[k]?0:1;save();b.classList.toggle('on',!!S.week.c[k]);b.textContent=S.week.c[k]?'✔':'';sfx(S.week.c[k]?'good':'click');};
    inp.oninput=()=>{S.week.n[k]=inp.value;save();};
    tb.appendChild(tr);
  });
  const c=$('#wkC',sheet);c.value=S.week.cheer||'';c.oninput=()=>{S.week.cheer=c.value;save();};
  $('#wkBack',sheet).onclick=()=>{sfx('click');go('cert');};
  $('#wkPrint',sheet).onclick=()=>{sfx('click');printPage();};
  return e;
};
function printPage(){
  try{window.print();}catch(e){}
  toast('인쇄 창이 열리지 않으면 임명장 화면의 「이미지로 저장하기」를 이용해 주세요.',3800);
}
