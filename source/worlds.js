/* ================= 월드 공통 틀과 끌어 놓기 도구 ================= */
function hit(a,b){
  const r=a.getBoundingClientRect(),q=b.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  return cx>q.left&&cx<q.right&&cy>q.top&&cy<q.bottom;
}
function makeDrag(elm,targets,onDrop,onMiss){
  elm.classList.add('drag');
  elm._home=[parseFloat(elm.style.left)||0,parseFloat(elm.style.top)||0];
  let id=null,sx=0,sy=0,ox=0,oy=0;
  elm.addEventListener('pointerdown',e=>{
    if(elm._lock)return;e.preventDefault();id=e.pointerId;
    try{elm.setPointerCapture(id);}catch(_){}
    sx=e.clientX;sy=e.clientY;ox=parseFloat(elm.style.left)||0;oy=parseFloat(elm.style.top)||0;
    elm.classList.add('holding');sfx('pop');
  });
  elm.addEventListener('pointermove',e=>{
    if(e.pointerId!==id)return;
    elm.style.left=(ox+(e.clientX-sx)/SC)+'px';elm.style.top=(oy+(e.clientY-sy)/SC)+'px';
    targets().forEach(t=>t.classList.toggle('over',hit(elm,t)));
  });
  const end=e=>{
    if(e.pointerId!==id)return;id=null;elm.classList.remove('holding');
    const ts=targets();ts.forEach(t=>t.classList.remove('over'));
    const t=ts.find(t=>hit(elm,t));
    if(t&&onDrop(t,elm)===true)return;
    elm.style.left=elm._home[0]+'px';elm.style.top=elm._home[1]+'px';
    if(t&&onMiss)onMiss(t,elm);
  };
  elm.addEventListener('pointerup',end);elm.addEventListener('pointercancel',end);
}
function place(e,x,y,w,h){e.style.position='absolute';e.style.left=x+'px';e.style.top=y+'px';if(w)e.style.width=w+'px';if(h)e.style.height=h+'px';return e;}

const WORLD_FN={};
SCREENS.world=function(id){
  const w=WORLDS[id-1],t=token,e=el('div','screen world');
  e.style.background=w.bg;
  e.innerHTML=`<div class="head"><div class="ttl">${w.em} ${w.name}</div><div class="bubble" id="wb"></div><button class="btn small sun hintbtn" id="wHint" hidden>💡 힌트</button></div>
   <div class="scene" id="wScene"></div><div class="prog" id="wProg"></div>`;
  const hero=HEROES[S.hero-1]||HEROES[0];
  let hinted=false;
  const ctx={w,t,root:e,scene:$('#wScene',e),
    alive:()=>alive(t),
    say(msg){const b=$('#wb',e);b.innerHTML=bubbleHTML(msg);bindSay(b,msg);say(msg);},
    sleep(ms){return new Promise(r=>setTimeout(()=>{if(alive(t))r();},ms));},
    prog(done,total){
      const p=$('#wProg',e);if(total!==undefined)ctx._pt=total;
      let h='';for(let i=0;i<ctx._pt;i++)h+=`<span class="p ${i<done?'on':''}"></span>`;p.innerHTML=h;
    },
    fx(em,x,y){fx(em,x,y,ctx.scene);},
    reason(q,choices,ok){
      return new Promise(res=>{
        const ov=el('div','result');
        ov.innerHTML=`<div class="panel box"><div class="h2" style="margin-bottom:6px;font-size:46px">🤔 ${q}</div><div class="dim" style="font-size:30px;margin-bottom:16px">알맞은 이유를 골라 보세요.</div><div id="rc" style="display:flex;flex-direction:column;gap:14px"></div><div id="rf" style="margin-top:14px;font-size:34px;min-height:48px;font-family:var(--f-display)"></div></div>`;
        const box=$('#rc',ov);
        shuffle(choices.map((c,i)=>({c,i}))).forEach(o=>{
          const b=el('button','opt',`<span class="ic">${o.i===ok?'🌍':'💭'}</span>${o.c}`);b.style.fontSize='36px';
          b.onclick=()=>{
            if(o.i===ok){sfx('good');b.classList.add('on');$('#rf',ov).textContent='맞아요! 지구 수비대 최고예요!';
              say('맞아요! 지구 수비대 최고예요!');setTimeout(()=>{ov.remove();res();},1200);}
            else{sfx('soft');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');
              $('#rf',ov).textContent='앗, 다시 살펴볼까? 지구 수비대라면 어떤 이유를 고를까?';say('앗, 다시 살펴볼까?');}
          };
          box.appendChild(b);
        });
        e.appendChild(ov);say(q);
      });
    },
    done(){finishWorld(ctx);}
  };
  ctx._pt=0;
  if(S.hero&&hero.w===id){
    const hb=$('#wHint',e);hb.hidden=false;
    hb.onclick=()=>{if(hinted)return;hinted=true;sfx('good');hb.hidden=true;ctx.say(`${hero.name}: “${hero.hint}”`);};
  }
  ctx.say(w.intro);
  setTimeout(()=>{
    if(!alive(t))return;
    Promise.resolve(WORLD_FN[id](ctx)).catch(err=>{console.error(err);});
  },30);
  return e;
};

function finishWorld(ctx){
  const w=ctx.w,first=!S.cleared[w.id],card=CARDS[w.card-1];
  S.cleared[w.id]=true;S.cards[card.n]=true;save();updateBar();
  const n=clearedCount();
  const ov=el('div','result');
  const hero=HEROES[S.hero-1]||HEROES[0];
  ov.innerHTML=`<div class="panel box"><div class="heartpiece">❤️</div>
   <div class="h2">하트 조각을 찾았어요!${first?'':' (이미 모은 조각이에요)'}</div>
   <div class="gain"><div class="rcard"><div class="no">지구 지킴 비법 카드 ${card.n}</div><div class="ic">${card.ic}</div>${card.t}</div>
   <div style="width:210px">${heroSVG(hero)}</div></div>
   <div style="font-size:38px;margin-bottom:12px;font-family:var(--f-display)">“${w.ok}”</div>
   <div style="font-size:32px;margin-bottom:16px;color:var(--ink-soft)">${n>=7?'🏰 하트 조각 7개를 모두 모았어요! 대마왕의 성이 열렸어요!':`하트 조각 ${n} / 7`}</div>
   <button class="btn sun" id="rBack">🗺️ 지도로 가기</button></div>`;
  ctx.root.appendChild(ov);
  sfx('fanfare');setTimeout(()=>sfx('card'),900);
  say(w.ok+(n>=7?' 대마왕의 성이 열렸어요!':''));
  $('#rBack',ov).onclick=()=>{sfx('click');go('map');};
}

/* ================= 1) 반짝 우리 집 ================= */
WORLD_FN[1]=async function(ctx){
  const sc=ctx.scene;
  const rooms=[
    {cls:'r1',n:'거실',items:[{em:'🛋️',x:30,y:150,s:130},{em:'🪴',x:210,y:200,s:90},{em:'📺',x:330,y:110,s:110,waste:1,cap:'아무도 안 보는 TV'},{em:'💡',x:450,y:30,s:90,waste:1,cap:'켜진 전등'}]},
    {cls:'r2',n:'부엌',items:[{em:'🍳',x:40,y:170,s:100},{em:'🍎',x:200,y:215,s:80},{em:'🧊',x:390,y:50,s:140,waste:1,cap:'열려 있는 냉장고'}]},
    {cls:'r3',n:'욕실',items:[{em:'🛁',x:290,y:120,s:150},{em:'🧼',x:480,y:225,s:70},{em:'🚰',x:50,y:50,s:120,waste:1,cap:'계속 흐르는 물',drops:1}]},
    {cls:'r4',n:'내 방',items:[{em:'🛏️',x:60,y:140,s:150},{em:'🧸',x:300,y:210,s:90},{em:'💡',x:430,y:40,s:100,waste:1,cap:'빈 방의 전등'}]}
  ];
  const house=el('div','house');sc.appendChild(house);
  let fixed=0;const total=5;ctx.prog(0,total);
  rooms.forEach(r=>{
    const room=el('div','room '+r.cls,`<div class="rn">${r.n}</div>`);house.appendChild(room);
    r.items.forEach(it=>{
      const b=el('button','tap '+(it.waste?'glow':''),`<span class="emoji" style="font-size:${it.s}px">${it.em}</span>`);
      place(b,it.x,it.y);b.setAttribute('aria-label',it.waste?it.cap:'집 안 물건');room.appendChild(b);
      let drops=null;
      if(it.drops){drops=el('div');drops.innerHTML='<span class="drops" style="left:'+(it.x+30)+'px;top:'+(it.y+110)+'px">💧</span><span class="drops" style="left:'+(it.x+70)+'px;top:'+(it.y+110)+'px;animation-delay:.4s">💧</span>';room.appendChild(drops);}
      b.onclick=async()=>{
        if(it.waste){
          if(b._ok)return;b._ok=1;fixed++;sfx('good');b.classList.remove('glow');
          b.style.filter='grayscale(1) brightness(.75)';b.style.opacity='.75';
          if(drops)drops.remove();
          const cap=el('div','cap','✅ '+it.cap+' 끄기 완료!');cap.style.left=Math.max(10,it.x-30)+'px';cap.style.top=(it.y+it.s+6)+'px';room.appendChild(cap);
          fx('✨',it.x+20,it.y,room);ctx.prog(fixed,total);
          if(fixed===total){
            await ctx.sleep(500);house.classList.add('happy');sfx('collect');
            ctx.say('집이 반짝반짝 웃고 있어요!');await ctx.sleep(1500);
            await ctx.reason('왜 전기와 물을 아껴야 할까요?',['지구의 에너지와 물은 소중해서 아껴 써야 하니까','불이 켜져 있으면 심심하니까','TV가 고장 날 수도 있으니까'],0);
            ctx.done();
          }
        }else{
          sfx('soft');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');toast('여긴 괜찮아요! 낭비되는 곳을 더 찾아봐요.',1800);
        }
      };
    });
  });
};

/* ================= 2) 두근 시장 ================= */
WORLD_FN[2]=async function(ctx){
  const sc=ctx.scene;
  const rounds=[
    {q:'장을 보러 갈 때 무엇을 가져갈까요?',a:{em:'🧺',t:'장바구니'},b:{em:'🛍️',t:'비닐봉지를 새로 받기'},tip:'장바구니를 쓰면 비닐봉지를 아낄 수 있어요.'},
    {q:'사과를 사요. 어떤 사과가 지구에게 좋을까요?',a:{em:'🍎',t:'포장 없이 파는 사과'},b:{em:'🎁',t:'겹겹이 포장한 사과'},tip:'포장이 적을수록 쓰레기가 줄어요.'},
    {q:'달걀을 사요. 어떤 포장이 좋을까요?',a:{em:'🥚',t:'종이 달걀판'},b:{em:'🥡',t:'플라스틱 용기와 비닐'},tip:'종이는 다시 쓸 수 있어서 더 좋아요.'},
    {q:'채소를 사요. 어떤 채소를 고를까요?',a:{em:'🥬',t:'포장 없는 채소'},b:{em:'🧅',t:'하나씩 비닐로 싼 채소'},tip:'비닐 포장이 없으면 쓰레기가 줄어요.'}
  ];
  const total=rounds.length+7;ctx.prog(0,total);
  const basket=el('div','basket','<div>🧺</div><div id="bk" style="font-size:60px;line-height:1.1;min-height:70px"></div>');
  place(basket,1240,120);basket.style.width='340px';sc.appendChild(basket);
  const bk=$('#bk',basket);
  let done=0;
  for(const r of rounds){
    ctx.say(r.q);
    await new Promise(res=>{
      const cards=[];
      const pair=shuffle([{...r.a,good:1},{...r.b,good:0}]);
      pair.forEach((p,k)=>{
        const c=el('button','card3',`<div class="big">${p.em}</div>${p.t}`);place(c,250+k*420,70);sc.appendChild(c);cards.push(c);
        c.onclick=()=>{
          if(p.good){
            sfx('good');c.classList.add('good');cards.forEach(x=>x.disabled=true);
            ctx.fx(p.em,330+k*420,160);bk.textContent+=p.em;done++;ctx.prog(done,total);
            ctx.say(r.tip);
            setTimeout(()=>{if(!ctx.alive())return;cards.forEach(x=>x.remove());res();},1500);
          }else{
            sfx('soft');c.classList.remove('nope');void c.offsetWidth;c.classList.add('nope');ctx.say('앗, 다시 살펴볼까? 지구 수비대라면 어떤 것을 고를까?');
          }
        };
      });
    });
  }
  /* 분리배출 */
  basket.remove();
  ctx.say('쓰레기를 알맞은 통에 끌어 놓아 주세요! 종이, 플라스틱, 캔, 일반 쓰레기로 나눠요.');
  const binsDef=[{k:'paper',t:'종이',em:'📦',c:'#c28a4a'},{k:'plastic',t:'플라스틱',em:'🧴',c:'#2f80ed'},{k:'can',t:'캔',em:'🥫',c:'#7a8aa3'},{k:'trash',t:'일반 쓰레기',em:'🗑️',c:'#4f6a55'}];
  const bins=binsDef.map((b,i)=>{
    const d=el('div','bin',`<div><div class="bi">${b.em}</div>${b.t}</div>`);d.style.background=b.c;d.dataset.k=b.k;place(d,150+i*350,470);sc.appendChild(d);return d;
  });
  const items=shuffle([
    {em:'📰',t:'신문지',k:'paper'},{em:'📦',t:'과일 상자',k:'paper'},{em:'🧴',t:'샴푸 통',k:'plastic'},
    {em:'🥤',t:'페트병',k:'plastic'},{em:'🥫',t:'참치 캔',k:'can'},{em:'🧻',t:'쓴 휴지',k:'trash'},{em:'🍬',t:'과자 봉지',k:'trash'}
  ]);
  let left=items.length;
  items.forEach((it,i)=>{
    const d=el('div','',`<div style="width:170px;height:200px;border-radius:30px;background:#fff;box-shadow:0 8px 0 rgba(0,0,0,.2);text-align:center;padding-top:14px;font-family:var(--f-display);font-size:28px"><div style="font-size:100px;line-height:1.15">${it.em}</div>${it.t}</div>`);
    place(d,60+i*220,120);sc.appendChild(d);
    makeDrag(d,()=>bins,(bin,elm)=>{
      if(bin.dataset.k===it.k){
        sfx('good');elm.remove();left--;done++;ctx.prog(done,total);ctx.fx('✨',+bin.style.left.replace('px','')+120,430);
        bin.classList.add('nope');setTimeout(()=>bin.classList.remove('nope'),400);
        if(left===0){(async()=>{await ctx.sleep(600);ctx.say('모두 알맞게 버렸어요!');await ctx.sleep(1200);
          await ctx.reason('왜 쓰레기를 종류별로 나눠 버릴까요?',['다시 쓸 수 있는 것은 재활용해서 쓰레기를 줄이려고','쓰레기통이 예뻐 보이려고','쓰레기 냄새가 좋아지도록'],0);ctx.done();})();}
        return true;
      }
      return false;
    },(bin,elm)=>{sfx('soft');ctx.say(`앗, 다시 살펴볼까? ${it.t}은(는) 어느 통에 넣을까요?`);});
  });
};

/* ================= 3) 푸른 숲 ================= */
WORLD_FN[3]=async function(ctx){
  const sc=ctx.scene;const total=9;let n=0;ctx.prog(0,total);
  sc.appendChild(place(el('div','','☁️'),700,-10)).style.fontSize='200px';
  const soils=[260,760,1210].map(x=>{
    const d=el('div');d.style.cssText='position:absolute;width:240px;height:100px;border-radius:50%;background:#8a5a35;box-shadow:inset 0 -10px 0 #6b4226,0 6px 0 rgba(0,0,0,.2);border:0';
    place(d,x,500);sc.appendChild(d);return d;
  });
  const sprouts=[];
  ctx.say('씨앗을 흙으로 끌어 놓아 주세요!');
  await new Promise(res=>{
    let c=0;
    [0,1,2].forEach(i=>{
      const s=el('div','',`<div style="font-size:100px;line-height:1">🌰</div>`);place(s,100+i*130,260);sc.appendChild(s);
      makeDrag(s,()=>soils.filter(d=>!d.dataset.p),(soil,elm)=>{
        soil.dataset.p='1';sfx('good');elm.remove();
        const sp=el('div','',`<div style="font-size:120px;line-height:1">🌱</div>`);sp.style.transition='all .8s';
        place(sp,+soil.style.left.replace('px','')+60,400);sc.appendChild(sp);sprouts.push(sp);
        n++;ctx.prog(n,total);c++;if(c===3)res();return true;
      });
    });
  });
  ctx.say('새싹이 나왔어요! 구름에서 빗방울을 끌어와 물을 주세요.');
  await new Promise(res=>{
    let c=0;
    [0,1,2].forEach(i=>{
      const d=el('div','',`<div style="font-size:90px;line-height:1">💧</div>`);place(d,640+i*130,180);sc.appendChild(d);
      makeDrag(d,()=>sprouts.filter(s=>!s._g),(sp,elm)=>{
        sp._g=1;sfx('collect');elm.remove();sp.innerHTML='<div style="font-size:240px;line-height:1">🌳</div>';
        sp.style.top='250px';sp.style.left=(parseFloat(sp.style.left)-60)+'px';
        n++;ctx.prog(n,total);c++;if(c===3)res();return true;
      });
    });
  });
  ctx.say('나무가 쑥쑥 자랐어요! 부엉이 가족의 집을 지어 줄 재료를 나무 위 둥지 자리로 끌어 놓아 주세요.');
  const nest=el('div','nestT','둥지 자리');place(nest,1250,170);sc.appendChild(nest);
  await new Promise(res=>{
    let c=0;
    ['🌿','🪵','🍂'].forEach((m,i)=>{
      const d=el('div','',`<div style="font-size:100px;line-height:1">${m}</div>`);place(d,90+i*130,420);sc.appendChild(d);
      makeDrag(d,()=>[nest],(t,elm)=>{
        sfx('collect');elm.remove();c++;n++;ctx.prog(n,total);nest.textContent=['🌿','🌿🪵','🌿🪵🍂'][c-1];
        if(c===3)res();return true;
      });
    });
  });
  nest.innerHTML='🪺';nest.style.border='0';nest.style.fontSize='120px';sfx('fanfare');
  [['🦉',1180,120],['🐿️',900,520],['🦌',520,520],['🐦',1400,260]].forEach((a,k)=>setTimeout(()=>{if(!ctx.alive())return;const f=el('div','',`<div style="font-size:110px;line-height:1">${a[0]}</div>`);f.style.animation='pop .6s';place(f,a[1],a[2]);sc.appendChild(f);sfx('pop');},k*350));
  await ctx.sleep(2200);ctx.say('부엉이 가족이 새 집에 돌아왔어요!');await ctx.sleep(1500);ctx.done();
};

/* ================= 4) 맑은 바다 ================= */
WORLD_FN[4]=async function(ctx){
  const sc=ctx.scene;
  const trash=[['🥤','페트병'],['🛍️','비닐'],['🥫','캔'],['🧴','플라스틱 병'],['🥤','페트병'],['🛍️','비닐']];
  const fish=['🐟','🐠','🐢','🐡','🐙'];
  const total=trash.length;let got=0;ctx.prog(0,total);
  const bucket=el('div','',`<div style="font-size:150px;line-height:1">🪣</div><div id="bc" style="position:absolute;left:0;right:0;top:50px;text-align:center;font-family:var(--f-display);font-size:48px;color:#fff;text-shadow:0 3px 0 #1d4f91">0</div>`);
  place(bucket,1450,520);bucket.style.width='160px';sc.appendChild(bucket);
  const all=shuffle([...trash.map(t=>({em:t[0],t:t[1],trash:1})),...fish.map(f=>({em:f,t:'물고기 친구',trash:0}))]);
  const items=all.map((o,i)=>{
    const b=el('button','tap',`<span class="emoji" style="font-size:110px">${o.em}</span>`);
    const it={el:b,x:Math.random()*1400,y:20+i*(450/all.length)+Math.random()*10,vx:(Math.random()<.5?-1:1)*(28+Math.random()*34),ph:Math.random()*6,busy:false,o};
    b.style.left=it.x+'px';b.style.top=it.y+'px';b.setAttribute('aria-label',o.t);sc.appendChild(b);
    b.onclick=()=>{
      if(it.busy)return;it.busy=true;
      if(o.trash){
        sfx('pop');
        const hook=el('div','hook','<div class="hl"></div><div class="hm">🪝</div>');hook.style.left=(it.x+45)+'px';sc.appendChild(hook);
        requestAnimationFrame(()=>{hook.style.height=(it.y+60)+'px';});
        setTimeout(()=>{
          if(!ctx.alive())return;
          b.style.transition='left .7s,top .7s,transform .7s';b.style.left='1490px';b.style.top='520px';b.style.transform='scale(.45)';hook.style.height='0px';
          setTimeout(()=>{
            if(!ctx.alive())return;hook.remove();b.remove();got++;sfx('collect');$('#bc',bucket).textContent=got;ctx.prog(got,total);
            if(got===total)finish();
          },750);
        },420);
      }else{
        sfx('soft');b.style.transition='transform .6s';b.style.transform='translateY(-60px) rotate(18deg)';
        ctx.say('앗, 물고기 친구를 놀라게 했어. 이번에는 쓰레기만 살살 찾아보자!');
        setTimeout(()=>{b.style.transform='';it.busy=false;},700);
      }
    };
    return it;
  });
  let last=performance.now();
  function loop(now){
    if(!ctx.alive())return;
    const dt=Math.min(.05,(now-last)/1000);last=now;
    items.forEach(it=>{
      if(it.busy||!it.el.isConnected)return;
      it.x+=it.vx*dt;if(it.x>1500)it.x=-130;if(it.x<-140)it.x=1490;
      it.el.style.left=it.x+'px';it.el.style.top=(it.y+Math.sin(now/600+it.ph)*10)+'px';
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  async function finish(){
    ctx.root.style.background='linear-gradient(180deg,#c8f1ff,#68d0ff 25%,#2f8bf0)';
    sfx('fanfare');ctx.say('바다가 맑아졌어요! 물고기 친구들이 신나게 헤엄쳐요.');
    items.forEach((it,k)=>{if(it.el.isConnected){it.busy=true;it.el.style.transition='transform .6s';setTimeout(()=>{it.el.style.transform='translateY(-70px) rotate(-14deg)';},k*120);}});
    for(let k=0;k<6;k++)ctx.fx('✨',200+k*230,200+(k%2)*160);
    await ctx.sleep(2600);ctx.done();
  }
};

/* ================= 5) 쑥쑥 텃밭 ================= */
WORLD_FN[5]=async function(ctx){
  const sc=ctx.scene;const total=4+5;let n=0;ctx.prog(0,total);
  const crate=el('div','',`<div style="font-size:190px;line-height:1">🧺</div><div id="cr" style="font-size:56px;min-height:60px;text-align:center"></div>`);
  place(crate,1330,330);sc.appendChild(crate);
  const vegs=['🥕','🍅','🥬','🍆'];
  await new Promise(res=>{
    let c=0;
    vegs.forEach((v,i)=>{
      const b=el('button','tap glow',`<span class="emoji" style="font-size:130px">🌱</span>`);place(b,160+i*270,380+(i%2)*40);sc.appendChild(b);
      b.setAttribute('aria-label','채소 거두기');
      b.onclick=()=>{
        if(b._d)return;b._d=1;b.classList.remove('glow');sfx('good');
        b.innerHTML=`<span class="emoji" style="font-size:160px">${v}</span>`;
        setTimeout(()=>{if(!ctx.alive())return;b.style.transition='left .6s,top .6s,transform .6s';b.style.left='1400px';b.style.top='340px';b.style.transform='scale(.4)';},350);
        setTimeout(()=>{if(!ctx.alive())return;b.remove();$('#cr',crate).textContent+=v;sfx('collect');n++;ctx.prog(n,total);c++;if(c===4)res();},1000);
      };
    });
  });
  crate.remove();
  ctx.say('남은 음식 카드가 나타났어요! 알맞은 곳으로 끌어 놓아 주세요.');
  const bd=[{k:'share',t:'나누기 · 먹을 만큼 덜기',em:'🤝',c:'#ff9f43',x:130},{k:'compost',t:'퇴비통',em:'🌱',c:'#6b8e23',x:600},{k:'waste',t:'음식물 쓰레기통',em:'🗑️',c:'#6c757d',x:1070}];
  const bins=bd.map(b=>{const d=el('div','bin',`<div><div class="bi">${b.em}</div>${b.t}</div>`);d.style.background=b.c;d.style.width='440px';d.style.height='230px';d.dataset.k=b.k;place(d,b.x,480);sc.appendChild(d);return d;});
  const cards=shuffle([{em:'🍞',t:'아직 먹을 수 있는 빵',k:'share'},{em:'🍚',t:'깨끗한 남은 밥',k:'share'},{em:'🥕',t:'당근 껍질',k:'compost'},{em:'🍎',t:'사과 씨와 심',k:'compost'},{em:'🥛',t:'상해 버린 우유',k:'waste'}]);
  let left=cards.length;
  cards.forEach((c,i)=>{
    const d=el('div','',`<div style="width:210px;height:240px;border-radius:30px;background:#fff;box-shadow:0 8px 0 rgba(0,0,0,.2);text-align:center;padding:14px 8px 0;font-family:var(--f-display);font-size:26px;line-height:1.2"><div style="font-size:110px;line-height:1.1">${c.em}</div>${c.t}</div>`);
    place(d,110+i*300,150);sc.appendChild(d);
    makeDrag(d,()=>bins,(bin,elm)=>{
      if(bin.dataset.k===c.k){
        sfx('good');elm.remove();left--;n++;ctx.prog(n,total);
        if(left===0)(async()=>{
          await ctx.sleep(500);
          ctx.say('퇴비를 주었더니 텃밭에 새 채소가 쑥쑥 자라요!');sfx('fanfare');
          ['🥬','🥕','🍅','🥬','🥕'].forEach((v,k)=>setTimeout(()=>{if(!ctx.alive())return;const f=el('div','',`<div style="font-size:120px;line-height:1">${v}</div>`);f.style.animation='pop .6s';place(f,160+k*290,120+(k%2)*60);sc.appendChild(f);sfx('pop');},k*300));
          await ctx.sleep(2600);ctx.done();
        })();
        return true;
      }
      return false;
    },()=>{sfx('soft');ctx.say(`앗, 다시 살펴볼까? ${c.t}은(는) 어디로 보내면 좋을까요?`);});
  });
};

/* ================= 6) 별빛 하늘길 ================= */
WORLD_FN[6]=async function(ctx){
  const sc=ctx.scene;const total=5;let n=0;ctx.prog(0,total);
  const pts=[[130,300],[330,90],[570,240],[820,70],[1040,260]];
  const cs=el('div','constel');sc.appendChild(cs);
  cs.innerHTML=`<svg viewBox="0 0 1150 400" style="position:absolute;inset:0;width:100%;height:100%">${pts.slice(1).map((p,i)=>`<line id="ln${i}" x1="${pts[i][0]+45}" y1="${pts[i][1]+45}" x2="${p[0]+45}" y2="${p[1]+45}" stroke="#ffe066" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 12" opacity="0"/>`).join('')}</svg>`;
  const stars=pts.map(p=>{const s=el('div','',`⭐`);s.style.cssText=`position:absolute;left:${p[0]}px;top:${p[1]}px;font-size:90px;line-height:1;filter:grayscale(1) brightness(.5);transition:filter .5s,transform .5s`;cs.appendChild(s);return s;});
  const smoke=el('div','');smoke.style.cssText='position:absolute;left:0;right:0;top:0;height:420px;background:linear-gradient(180deg,rgba(120,116,130,.85),rgba(120,116,130,.45) 70%,rgba(120,116,130,0));opacity:.9;transition:opacity .8s;pointer-events:none;z-index:2';
  sc.appendChild(smoke);
  const moon=el('div','','🌙');moon.style.cssText='position:absolute;right:50px;top:30px;font-size:120px;line-height:1';sc.appendChild(moon);
  const tc=el('div','tcards');sc.appendChild(tc);
  const list=shuffle([
    {em:'🚶',t:'걸어가요',g:1},{em:'🚲',t:'자전거를 타요',g:1},{em:'🚌',t:'버스를 타요',g:1},
    {em:'🚇',t:'지하철을 타요',g:1},{em:'🚙',t:'친구와 함께 타는 자동차',g:1},{em:'🚗',t:'혼자 타는 자동차',g:0}
  ]);
  list.forEach(c=>{
    const b=el('button','card3',`<div class="big">${c.em}</div>${c.t}`);tc.appendChild(b);
    b.onclick=async()=>{
      if(b._d)return;
      if(c.g){
        b._d=1;sfx('collect');b.classList.add('good');
        stars[n].style.filter='drop-shadow(0 0 20px #ffe066)';stars[n].style.transform='scale(1.2)';
        if(n>0)$('#ln'+(n-1),cs).setAttribute('opacity','1');
        n++;ctx.prog(n,total);smoke.style.opacity=String(.9-n*.18);ctx.fx('✨',pts[n-1][0]+300,pts[n-1][1]+40);
        if(n===total){
          await ctx.sleep(500);sfx('fanfare');ctx.say('별자리가 완성됐어요! 하늘이 맑아졌어요.');
          const nm=el('div','','✨ 지구 수비대자리 ✨');nm.style.cssText='position:absolute;left:260px;width:1150px;top:380px;text-align:center;font-family:var(--f-display);font-size:60px;color:#ffe066;text-shadow:0 4px 0 #3b1f8a;z-index:3';sc.appendChild(nm);
          smoke.style.opacity='0';await ctx.sleep(2000);
          await ctx.reason('왜 걷거나 함께 타면 하늘이 맑아질까요?',['자동차 연기(매연)가 줄어드니까','별이 심심해하니까','버스가 더 빨라서'],0);
          ctx.done();
        }
      }else{
        sfx('soft');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');
        ctx.say('혼자 타는 자동차는 연기를 많이 내서 별을 가려요. 다른 방법을 골라 볼까?');
      }
    };
  });
};

/* ================= 7) 하양 북극 ================= */
WORLD_FN[7]=async function(ctx){
  const sc=ctx.scene;const total=5;let n=0;ctx.prog(0,total);
  const list=shuffle([
    {em:'💡',t:'아무도 없는 방의 전등',w:1},{em:'📺',t:'아무도 안 보는 TV',w:1},{em:'🔌',t:'충전이 끝난 충전기',w:1},
    {em:'🌀',t:'빈 방의 선풍기',w:1},{em:'🎮',t:'놀지 않고 켜 둔 게임기',w:1},
    {em:'💻',t:'지금 공부하는 컴퓨터',w:0},{em:'🧊',t:'꼭 필요한 냉장고',w:0}
  ]);
  const aur=el('div','aurora');sc.appendChild(aur);
  const isl1=el('div','island');place(isl1,-40,540,360,160);sc.appendChild(isl1);
  const isl2=el('div','island');place(isl2,1350,540,360,160);sc.appendChild(isl2);
  const slots=[0,1,2,3,4].map(k=>{const s=el('div','slot');place(s,340+k*190,570);sc.appendChild(s);return s;});
  const bear=el('div','',`<div style="font-size:130px;line-height:1;display:inline-block">🐻‍❄️</div><div style="font-size:80px;line-height:1;display:inline-block">🐻‍❄️</div>`);
  place(bear,40,470);bear.style.transition='left 5s linear';bear.style.zIndex='6';sc.appendChild(bear);
  const home=el('div','',`<div style="font-size:150px;line-height:1">🏔️</div>`);place(home,1440,430);sc.appendChild(home);
  list.forEach((a,i)=>{
    const b=el('button','appl on',`<span class="big">${a.em}</span>${a.t}`);place(b,24+i*232,10);sc.appendChild(b);
    b.onclick=async()=>{
      if(b._d)return;
      if(a.w){
        b._d=1;b.classList.remove('on');b.classList.add('off');sfx('good');
        const ice=el('div','ice','❄️');place(ice,340+n*190,570);sc.appendChild(ice);
        n++;ctx.prog(n,total);ctx.fx('✨',360+(n-1)*190,520);
        if(n===total){
          await ctx.sleep(600);ctx.say('얼음 길이 완성됐어요! 북극곰 가족이 집으로 돌아가요.');
          bear.style.left='1380px';sfx('collect');await ctx.sleep(5200);
          ctx.root.style.background='linear-gradient(180deg,#0e2a5a,#2a7a74 35%,#8fe3d0 55%,#9ed6ff)';aur.style.opacity='1';sfx('fanfare');
          ctx.say('북극곰 가족이 무사히 건넜어요! 오로라가 나타났어요.');await ctx.sleep(2600);ctx.done();
        }
      }else{
        sfx('soft');b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');
        ctx.say('이건 지금 꼭 필요하니까 그대로 두자! 쓰지 않는 것만 꺼 보자.');
      }
    };
  });
};
