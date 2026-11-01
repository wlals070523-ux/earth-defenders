/* ================= 자료: 용사 20명, 월드 7곳, 비법 카드 10장 ================= */
const HEROES=[
 {id:1,name:'퐁이 용사',em:'💧',c:'#5ec8f2',cape:'#2f7fe0',w:1,sp:'물 아끼기 힌트',ds:'작은 물방울 하나도 소중하게 여기는 용사예요.',hint:'수도꼭지는 꼭 잠갔는지 살펴보자!'},
 {id:2,name:'반짝이 용사',em:'💡',c:'#ffd84d',cape:'#ff9f1c',w:1,sp:'전등 끄기 힌트',ds:'불필요한 불빛을 가장 먼저 찾아내는 용사예요.',hint:'아무도 없는 방에 불이 켜져 있지 않을까?'},
 {id:3,name:'푸르미 용사',em:'🌱',c:'#8fd16a',cape:'#3fa34d',w:3,sp:'나무 키우기',ds:'씨앗을 심으면 숲이 쑥쑥 자라는 용사예요.',hint:'씨앗이 자라려면 물이 꼭 필요해!',deco:'none'},
 {id:4,name:'하양이 용사',em:'🐻',c:'#f4f8ff',cape:'#3aa0d8',w:7,sp:'에너지 절약',ds:'북극의 얼음을 지키려고 달려온 아기 곰 용사예요.',hint:'안 쓰는 전기제품부터 꺼 볼까?',deco:'ears'},
 {id:5,name:'뻐끔이 용사',em:'🐟',c:'#6fd0d0',cape:'#1f9aa6',w:4,sp:'바다 쓰레기 찾기',ds:'바닷속 쓰레기를 쏙쏙 찾아내는 용사예요.',hint:'물고기 말고 쓰레기만 살살 건져 보자!'},
 {id:6,name:'장보리 용사',em:'🧺',c:'#f6a96b',cape:'#d9622b',w:2,sp:'시장 미션 힌트',ds:'장바구니를 늘 챙기는 똑똑한 용사예요.',hint:'장바구니가 있으면 비닐봉지가 필요 없어!'},
 {id:7,name:'빙글이 용사',em:'♻️',c:'#7bdc9a',cape:'#1f9d55',w:2,sp:'분리배출',ds:'쓰레기를 알맞은 통에 쏙 넣어 주는 용사예요.',hint:'종이, 플라스틱, 캔을 구분해서 넣어 보자!'},
 {id:8,name:'별똥이 용사',em:'⭐',c:'#ffe066',cape:'#6c4dd1',w:6,sp:'밤하늘 지키기',ds:'맑은 밤하늘을 지키는 반짝이는 용사예요.',hint:'걷거나 함께 타면 별이 더 많이 반짝여!'},
 {id:9,name:'씽씽이 용사',em:'🚲',c:'#ff8fa3',cape:'#e0457b',w:6,sp:'이동 미션 힌트',ds:'자전거를 타고 씽씽 달리는 용사예요.',hint:'자동차 말고 다른 방법이 더 많이 있어!'},
 {id:10,name:'쑥쑥이 용사',em:'🥕',c:'#ffb067',cape:'#5fb64a',w:5,sp:'텃밭 가꾸기',ds:'텃밭에서 채소를 정성껏 키우는 용사예요.',hint:'채소 껍질은 흙을 건강하게 해 줘!'},
 {id:11,name:'싹싹이 용사',em:'🍚',c:'#fff1d6',cape:'#f08a4b',w:5,sp:'음식 남기지 않기',ds:'밥그릇을 싹싹 비우는 씩씩한 용사예요.',hint:'먹을 수 있는 음식은 나누거나 알맞게 덜자!'},
 {id:12,name:'올망이 용사',em:'🦉',c:'#c9a27a',cape:'#7a4b2a',w:3,sp:'숲 지킴이',ds:'밤에도 숲을 지키는 눈이 큰 부엉이 용사예요.',hint:'우리 가족이 살 집이 필요해, 나무 위에 둥지를 만들어 줘!',deco:'ears'},
 {id:13,name:'둥실이 용사',em:'🐳',c:'#7ab6ff',cape:'#2e5fd0',w:4,sp:'바다 청소',ds:'바다를 깨끗하게 지키는 아기 고래 용사예요.',hint:'바다는 쓰레기통이 아니야!'},
 {id:14,name:'꿈틀이 용사',em:'🐛',c:'#f4a0b5',cape:'#b8446a',w:5,sp:'흙 살리기',ds:'흙을 부드럽게 만드는 꿈틀꿈틀 용사예요.',hint:'남은 채소 껍질은 퇴비통으로!'},
 {id:15,name:'윙윙이 용사',em:'🐝',c:'#ffd23f',cape:'#8a5a00',w:3,sp:'꽃밭 지키기',ds:'꽃과 나무를 사랑하는 꿀벌 용사예요.',hint:'나무와 꽃이 많으면 우리 모두 행복해져!'},
 {id:16,name:'눈송이 용사',em:'⛄',c:'#e8f6ff',cape:'#4aa8e8',w:7,sp:'북극 지키기',ds:'녹지 않게 지구를 시원하게 지키는 용사예요.',hint:'얼음이 녹지 않게 에너지를 아껴 줘!'},
 {id:17,name:'해랑이 용사',em:'☀️',c:'#ffb347',cape:'#e8590c',w:6,sp:'맑은 날 만들기',ds:'맑고 따뜻한 하늘을 지키는 용사예요.',hint:'맑은 하늘이 보이도록 매연을 줄여 보자!'},
 {id:18,name:'휘리 용사',em:'🌀',c:'#b79cff',cape:'#6f4bd8',w:7,sp:'바람 에너지',ds:'깨끗한 바람의 힘을 아는 용사예요.',hint:'바람처럼 깨끗한 에너지를 생각해 봐!'},
 {id:19,name:'느릿이 용사',em:'🐢',c:'#9bd67d',cape:'#3f7f3a',w:1,sp:'천천히 아끼기',ds:'천천히 둘러보며 낭비를 찾아내는 용사예요.',hint:'천천히 둘러보면 낭비가 보여!'},
 {id:20,name:'사각이 용사',em:'📄',c:'#f4f6fa',cape:'#7a8aa3',w:2,sp:'종이 앞뒤로 쓰기',ds:'종이를 앞뒤로 알뜰하게 쓰는 용사예요.',hint:'종이는 앞뒤를 모두 쓰면 두 배로 쓸 수 있어!'}
];
const WORLDS=[
 {id:1,name:'반짝 우리 집',em:'🏠',x:449,y:114,lx:449,ly:182,card:1,bg:'linear-gradient(180deg,#ffe7b0,#ffd29a)',
  ok:'불필요한 전기와 물을 아끼면 지구가 한결 가벼워져!',
  intro:'집 안 곳곳에서 전기와 물이 낭비되고 있어요. 낭비되는 곳을 찾아 눌러 보세요!'},
 {id:2,name:'두근 시장',em:'🏪',x:275,y:332,lx:275,ly:400,card:2,bg:'linear-gradient(180deg,#ffe9a8,#ffd1a3)',
  ok:'장바구니를 쓰고 쓰레기를 알맞게 버리면 지구가 숨쉬기 편해져!',
  intro:'시장에 장을 보러 왔어요. 지구를 아끼는 물건을 골라 장바구니에 담아 보세요!'},
 {id:3,name:'푸른 숲',em:'🌳',x:278,y:562,lx:278,ly:630,card:6,bg:'linear-gradient(180deg,#bfe6ff,#d6f3c8 55%,#7bc96f)',
  ok:'나무와 작은 동물은 숲의 소중한 가족이야!',
  intro:'나무가 줄어서 부엉이 가족이 집을 잃었어요. 씨앗을 심어 숲을 살려 주세요!'},
 {id:4,name:'맑은 바다',em:'🌊',x:1492,y:372,lx:1492,ly:440,card:9,bg:'linear-gradient(180deg,#8fdcff,#3aa4f0 25%,#1659b8)',
  ok:'바다의 친구들이 다시 신나게 헤엄칠 수 있어!',
  intro:'바다에 쓰레기가 떠다녀요. 집게로 쓰레기만 살살 건져 주세요!'},
 {id:5,name:'쑥쑥 텃밭',em:'🥕',x:828,y:669,lx:828,ly:737,card:3,bg:'linear-gradient(180deg,#bfe6ff,#e5f5c9 45%,#a8d97a 46%,#8a5a35 62%,#7a4a28)',
  ok:'음식을 아끼면 흙도, 텃밭도, 지구도 건강해져!',
  intro:'텃밭 채소를 거두고, 남은 음식을 알맞은 곳으로 보내 주세요!'},
 {id:6,name:'별빛 하늘길',em:'🚌',x:1412,y:582,lx:1412,ly:650,card:10,bg:'linear-gradient(180deg,#26105a,#4b2a99 55%,#7b57d6)',
  ok:'함께 타고, 걷고, 자전거를 타면 하늘이 더 맑아져!',
  intro:'학교에 가는 길, 자동차 연기 때문에 별이 잘 안 보여요. 별이 늘어나는 방법을 골라 보세요!'},
 {id:7,name:'하양 북극',em:'❄️',x:1337,y:127,lx:1337,ly:195,card:4,bg:'linear-gradient(180deg,#0e2a5a,#26508f 45%,#9ed6ff)',
  ok:'에너지를 아끼면 북극곰 가족의 집을 지킬 수 있어!',
  intro:'얼음 길이 녹아 북극곰 가족이 집에 가지 못해요. 안 쓰는 전기제품을 꺼서 얼음 길을 만들어 주세요!'}
];
const CARDS=[
 {n:1,t:'필요 없는 전깃불은 꺼요',ic:'💡'},
 {n:2,t:'재활용 쓰레기는 종류별로 모아요',ic:'♻️'},
 {n:3,t:'음식을 남기지 않아요',ic:'🍚'},
 {n:4,t:'작은 동물들도 소중히 여겨요',ic:'🐾'},
 {n:5,t:'책은 친구들과 돌려 봐요',ic:'📚'},
 {n:6,t:'나무를 심어요',ic:'🌳'},
 {n:7,t:'종이는 앞면과 뒷면을 모두 써요',ic:'📄'},
 {n:8,t:'물을 아껴요',ic:'🚰'},
 {n:9,t:'쓰레기를 줄여요',ic:'🗑️'},
 {n:10,t:'에너지를 아끼는 나만의 방법을 만들어요',ic:'⚡'}
];
const PROMISES=[
 {ic:'💡',t:'사용하지 않는 전등을 끌래요.'},
 {ic:'🚰',t:'물을 아껴 쓸래요.'},
 {ic:'🍚',t:'음식을 먹을 만큼만 덜래요.'},
 {ic:'🧺',t:'장바구니를 사용할래요.'},
 {ic:'♻️',t:'쓰레기를 종류별로 버릴래요.'},
 {ic:'🚶',t:'걸을 수 있는 거리는 걸어갈래요.'}
];

/* ================= 그림 만들기 (SVG) ================= */
function mix(hex,t,to){
  const n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
  const m=v=>Math.round(v+(to-v)*t);
  return '#'+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
let svgUid=0;
function heroSVG(h,opt){
  opt=opt||{};
  const id='hg'+(++svgUid),c=h.c,cp=h.cape,dk=mix(c,.28,0),lt=mix(c,.55,255);
  const ears=h.deco==='ears'?`<circle cx="50" cy="82" r="20" fill="${c}" stroke="${dk}" stroke-width="4"/><circle cx="150" cy="82" r="20" fill="${c}" stroke="${dk}" stroke-width="4"/><circle cx="50" cy="82" r="10" fill="#ffb3c4"/><circle cx="150" cy="82" r="10" fill="#ffb3c4"/>`:'';
  const wave=opt.still?'':`<animateTransform attributeName="transform" type="rotate" values="0 150 140;-12 150 140;0 150 140" dur="1.6s" repeatCount="indefinite"/>`;
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${h.name}">
<defs><radialGradient id="${id}" cx="36%" cy="28%" r="80%"><stop offset="0" stop-color="${lt}"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>
<path d="M54 112 Q18 168 34 206 Q100 190 166 206 Q182 168 146 112 Z" fill="${cp}"/>
${ears}
<ellipse cx="76" cy="207" rx="22" ry="11" fill="${dk}"/><ellipse cx="124" cy="207" rx="22" ry="11" fill="${dk}"/>
<g><ellipse cx="38" cy="140" rx="14" ry="22" transform="rotate(32 38 140)" fill="${c}" stroke="${dk}" stroke-width="4"/></g>
<g>${wave}<ellipse cx="162" cy="130" rx="14" ry="22" transform="rotate(-38 162 130)" fill="${c}" stroke="${dk}" stroke-width="4"/></g>
<circle cx="100" cy="132" r="66" fill="url(#${id})" stroke="${dk}" stroke-width="4"/>
<ellipse cx="78" cy="124" rx="8" ry="11" fill="#1f2f4d"/><ellipse cx="122" cy="124" rx="8" ry="11" fill="#1f2f4d"/>
<circle cx="81" cy="120" r="3.4" fill="#fff"/><circle cx="125" cy="120" r="3.4" fill="#fff"/>
<ellipse cx="62" cy="144" rx="11" ry="7" fill="#ff8fa9" opacity=".75"/><ellipse cx="138" cy="144" rx="11" ry="7" fill="#ff8fa9" opacity=".75"/>
<path d="M86 142 Q100 168 114 142 Z" fill="#c43d63" stroke="#1f2f4d" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M92 156 Q100 162 108 156" fill="#ff8fa9"/>
<circle cx="100" cy="184" r="13" fill="#fff" stroke="${cp}" stroke-width="4"/><text x="100" y="190" font-size="17" text-anchor="middle" fill="#ff4d6d">♥</text>
<text x="100" y="66" font-size="58" text-anchor="middle">${h.em}</text>
</svg>`;
}
function earthSVG(mood){
  const sad=mood==='sad';
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
<circle cx="150" cy="150" r="130" fill="${sad?'#6f93b8':'#4aa3f0'}"/>
<path d="M70 110 Q90 60 150 70 Q200 70 190 120 Q150 130 130 170 Q90 160 70 110Z" fill="${sad?'#7f9a7a':'#52c46b'}"/>
<path d="M190 170 Q240 150 250 200 Q230 250 190 240 Q170 200 190 170Z" fill="${sad?'#7f9a7a':'#52c46b'}"/>
<ellipse cx="110" cy="160" rx="12" ry="${sad?14:16}" fill="#1f2f4d"/><ellipse cx="190" cy="160" rx="12" ry="${sad?14:16}" fill="#1f2f4d"/>
${sad?'<path d="M92 142 Q110 130 128 140" stroke="#1f2f4d" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M172 140 Q190 130 208 142" stroke="#1f2f4d" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M120 218 Q150 196 180 218" stroke="#1f2f4d" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M112 178 q-6 26 0 34" stroke="#bfe6ff" stroke-width="8" fill="none" stroke-linecap="round"/>':'<path d="M118 196 Q150 232 182 196 Z" fill="#c43d63" stroke="#1f2f4d" stroke-width="5" stroke-linejoin="round"/><ellipse cx="86" cy="186" rx="16" ry="10" fill="#ff8fa9" opacity=".7"/><ellipse cx="214" cy="186" rx="16" ry="10" fill="#ff8fa9" opacity=".7"/>'}
<path d="M150 90 q-20 -20 -40 0 q0 22 40 40 q40 -18 40 -40 q-20 -20 -40 0z" fill="${sad?'#c9a0a8':'#ff4d6d'}" transform="translate(0,-8) scale(.62) translate(92,50)"/>
</svg>`;
}
function bossSVG(nice){
  const body=nice?'#cdbdff':'#6a3fc2',dk=nice?'#8f78e0':'#3f1f87';
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
${nice?'':'<path d="M70 80 L100 20 L128 78Z M172 78 L200 20 L230 80Z" fill="#2a1260"/>'}
${nice?'<path d="M150 66 q-10 -42 -48 -34 q8 38 48 34z" fill="#58c96f"/><path d="M150 66 q10 -42 48 -34 q-8 38 -48 34z" fill="#7ee08f"/>':''}
<path d="M40 250 Q20 140 80 90 Q150 50 220 90 Q280 140 260 250 Q150 280 40 250Z" fill="${body}" stroke="${dk}" stroke-width="8" stroke-linejoin="round"/>
${nice?'<ellipse cx="108" cy="150" rx="14" ry="20" fill="#1f2f4d"/><ellipse cx="192" cy="150" rx="14" ry="20" fill="#1f2f4d"/><circle cx="113" cy="143" r="5" fill="#fff"/><circle cx="197" cy="143" r="5" fill="#fff"/><ellipse cx="78" cy="188" rx="20" ry="12" fill="#ff9bb8" opacity=".8"/><ellipse cx="222" cy="188" rx="20" ry="12" fill="#ff9bb8" opacity=".8"/><path d="M120 190 Q150 232 180 190 Z" fill="#c43d63" stroke="#1f2f4d" stroke-width="5" stroke-linejoin="round"/>'
 :'<path d="M84 132 L134 150 M216 132 L166 150" stroke="#1f2f4d" stroke-width="10" stroke-linecap="round"/><ellipse cx="112" cy="162" rx="14" ry="16" fill="#ffe14d"/><ellipse cx="188" cy="162" rx="14" ry="16" fill="#ffe14d"/><circle cx="114" cy="164" r="6" fill="#1f2f4d"/><circle cx="186" cy="164" r="6" fill="#1f2f4d"/><path d="M110 218 Q150 192 190 218" stroke="#1f2f4d" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M130 210 l10 12 l10 -12 l10 12 l10 -12" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round"/>'}
</svg>`;
}
function heroName(){
  const h=HEROES[S.hero-1];if(!h)return '용사';
  return S.nick?`별빛 수비대 ${S.nick} 용사`:h.name;
}
