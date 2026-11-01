/* ================= 시작 ================= */
(function init(){
  load();applySettings();fit();
  window.addEventListener('resize',fit);
  window.addEventListener('orientationchange',()=>setTimeout(fit,200));
  document.addEventListener('pointerdown',()=>{
    ensureAudio();
    if(!Aud.started)startMusic();
    else if(Aud.ctx&&Aud.ctx.state==='suspended')musicApply();
  },true);
  $('#bHome').onclick=()=>{
    sfx('click');
    if(CUR.name==='start'){toast('여기가 처음 화면이에요!',1600);return;}
    closeAllOv();
    if(['world','castle','celebrate','promise','cert','dex','week'].includes(CUR.name)){
      confirmBox('월드 지도로 돌아갈까요?<br>지금까지 한 모험은 저장돼요.','돌아가요','계속할래요',()=>go('map'));return;
    }
    confirmBox('처음 화면으로 갈까요?<br>지금까지 한 모험은 저장돼요.','갈래요','계속할래요',()=>go('start'));
  };
  $('#bMusic').onclick=()=>{
    ensureAudio();setMusic(!S.set.music);
    toast(S.set.music?'🎵 음악을 켰어요':'🔇 음악을 껐어요',1500);
  };
  $('#bVol').onclick=(ev)=>{ev.stopPropagation();sfx('click');toggleVolPop();};
  document.addEventListener('pointerdown',ev=>{const p=$('#volPop');if(p&&!p.contains(ev.target)&&ev.target.id!=='bVol')p.remove();},true);
  $('#bSet').onclick=()=>{sfx('click');openSettings();};
  $('#teacherTag').onclick=()=>openTeacherPanel();
  go('start');
})();

function toggleVolPop(){
  const old=$('#volPop');if(old){old.remove();return;}
  const p=el('div','volpop');p.id='volPop';
  function draw(){
    const pc=Math.round((S.set.mvol||0)*100);
    p.innerHTML=`<div class="vr"><span>🎵 음악</span><input type="range" id="vpR" min="0" max="100" step="5" value="${pc}" aria-label="음악 크기" style="--p:${pc}%"><b>${S.set.music?pc+'%':'꺼짐'}</b><button class="vbtn" id="vpM">${S.set.music?'끄기':'켜기'}</button></div>
    <div class="vr"><span>🔔 효과음</span><button class="vbtn ${S.set.sfx?'on':''}" id="vpS">${S.set.sfx?'켜짐':'꺼짐'}</button></div>`;
    $('#vpR',p).oninput=ev=>{const v=ev.target.value/100;S.set.mvol=v;if(v>0&&!S.set.music)S.set.music=true;save();ensureAudio();Aud.started=true;applySettings();ev.target.style.setProperty('--p',ev.target.value+'%');$('b',p).textContent=S.set.music?ev.target.value+'%':'꺼짐';};
    $('#vpM',p).onclick=()=>{ensureAudio();setMusic(!S.set.music);if(S.set.music&&!S.set.mvol){S.set.mvol=.6;save();musicApply();}draw();};
    $('#vpS',p).onclick=()=>{S.set.sfx=!S.set.sfx;save();if(S.set.sfx)sfx('click');draw();};
  }
  draw();$('#stage').appendChild(p);
}
