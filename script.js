/* ALJC México — interactions: i18n toggle, interactive map, leadership, news */
/* ===== INTERACTIVE MAP OF MEXICO (filled states by region) =====
   State geometry lives in mexico-geo.js (MX_GEO, MX_VIEWBOX). The PINS list
   below is kept only as the state code -> display name source (NAMES). */
const PINS=[
 ["AGS","Aguascalientes",367.9,294.3],
 ["BC","Baja California",54.3,74.6],
 ["BCS","Baja California Sur",138.1,196.8],
 ["CAM","Campeche",655.0,376.2],
 ["CHIS","Chiapas",602.4,436.0],
 ["CHIH","Chihuahua",274.5,118.8],
 ["COAH","Coahuila",377.4,155.2],
 ["COL","Colima",329.6,368.4],
 ["CDMX","Ciudad de México",445.6,355.4],
 ["DGO","Durango",305.6,217.6],
 ["GTO","Guanajuato",399.0,321.6],
 ["GRO","Guerrero",425.3,408.7],
 ["HGO","Hidalgo",454.0,329.4],
 ["JAL","Jalisco",336.7,334.6],
 ["MEX","Estado de México",427.7,371.0],
 ["MICH","Michoacán",379.8,368.4],
 ["MOR","Morelos",445.6,382.7],
 ["NAY","Nayarit",305.6,293.0],
 ["NL","Nuevo León",430.1,196.8],
 ["OAX","Oaxaca",504.3,425.6],
 ["PUE","Puebla",477.9,376.2],
 ["QRO","Querétaro",424.1,324.2],
 ["QROO","Quintana Roo",710.1,358.0],
 ["SLP","San Luis Potosí",413.3,277.4],
 ["SIN","Sinaloa",245.8,215.0],
 ["SON","Sonora",169.2,100.6],
 ["TAB","Tabasco",597.6,399.6],
 ["TAMS","Tamaulipas",461.2,235.8],
 ["TLAX","Tlaxcala",468.4,360.6],
 ["VER","Veracruz",511.5,365.8],
 ["YUC","Yucatán",686.2,324.2],
 ["ZAC","Zacatecas",358.3,259.2]
];
const NAMES={}; PINS.forEach(p=>NAMES[p[0]]=p[1]);

/* Four regions, 8 states each */
const REGIONS=[
 {key:'norte',   name:{es:'Norte',en:'North'},     color:'#E03131', states:['BC','BCS','SON','CHIH','COAH','NL','TAMS','DGO']},
 {key:'oeste',   name:{es:'Oeste',en:'West'},      color:'#F2C037', states:['SIN','NAY','JAL','COL','MICH','ZAC','AGS','GTO']},
 {key:'central', name:{es:'Central',en:'Central'}, color:'#3B82C4', states:['SLP','QRO','HGO','MEX','CDMX','TLAX','PUE','MOR']},
 {key:'sur',     name:{es:'Sur',en:'South'},       color:'#3FA34D', states:['GRO','OAX','CHIS','VER','TAB','CAM','YUC','QROO']}
];
const REGION_OF={}; REGIONS.forEach(r=>r.states.forEach(c=>REGION_OF[c]=r));

/* EDIT ME: add a pastor to a state and its pin fills in solid on the map.
   Key = state code (see PINS above). Optional "photo" = a data:image URI. */
const PASTORS={
 "YUC":[
   {name:"Pastor Víctor Palomo", city:"San José Oriente, Yucatán", photo:"assets/yuc-urbina.jpg"},
   {name:"Pastor José Gómez", city:"Halachó, Yucatán", photo:"assets/yuc-jose.jpg"},
   {name:"Pastor Carlos Urbina", city:"Motul, Mérida", photo:"assets/Pastor-Carlos-Urbina.jpeg"},
   {role:"Hermana", name:"Hermana Elsa Gómez", city:"Centro, Mérida", photo:"assets/yuc-elsa.jpg"}
 ],
 "TAB":[
   {name:"Pastor Carlos Galdámez", city:"Cárdenas, Tabasco", photo:"assets/tab.jpg"},
   {name:"Pastor Isael Gómez", city:"Villahermosa, Tabasco", photo:"assets/isael.jpg"}
 ],
 "CHIS":[
   {name:"Pastor Andres Ramirez", city:"Trinitaria, Chiapas", photo:"assets/pastor-andres-ramirez.png", zoom:1.8, focus:"center 30%"}
 ],
 "NL":[
   {name:"Pastor Alberto Huerta", city:"Monterrey, Nuevo León", photo:"assets/nl.jpg"}
 ],
 "COAH":[
   {name:"Pastor Rogelio Palos", city:"Piedras Negras, Coahuila", photo:"assets/palos.jpg"},
   {name:"Pastor Eliazar García", city:"Monclova, Coahuila", photo:"assets/eliazar-garcia.jpg"}
 ],
 "MEX":[
   {name:"Pastor Héctor Flores", city:"Zumpango, Estado de México", photo:"assets/hector-flores.jpg"}
 ],
 "BCS":[
   {name:"Pastor Emir López", city:"Cabo San Lucas, B.C.S.", photo:"assets/bcs.jpg"}
 ],
 "BC":[
   {name:"Pastor Emilio García", city:"Ensenada, Baja California", photo:"assets/emilio-garcia.jpg"}
 ]
};

const SVGNS="http://www.w3.org/2000/svg";
const mexmap=document.getElementById('mexmap');
const svg=document.createElementNS(SVGNS,'svg');
svg.setAttribute('viewBox',MX_VIEWBOX);
svg.setAttribute('class','mexsvg');
svg.setAttribute('role','group');
svg.setAttribute('aria-label','Mapa interactivo de México por regiones');
svg.dataset.active='';
Object.keys(MX_GEO).forEach(code=>{
  const has=Array.isArray(PASTORS[code])&&PASTORS[code].length>0;
  const r=REGION_OF[code]; const col=r?r.color:'#888';
  const p=document.createElementNS(SVGNS,'path');
  p.setAttribute('d',MX_GEO[code]);
  p.setAttribute('class','state'+(has?' has':''));
  p.setAttribute('tabindex','0'); p.setAttribute('role','button'); p.setAttribute('aria-label',NAMES[code]||code);
  p.dataset.code=code; p.dataset.region=r?r.key:'';
  p.style.setProperty('--rc',col);
  p.addEventListener('click',()=>selectState(code));
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectState(code);}});
  svg.appendChild(p);
});
mexmap.appendChild(svg);

let CURLANG='es', SELECTED=null;
const MT={
 role:{es:'Pastor',en:'Pastor'},
 def:{es:'Selecciona un estado en el mapa para ver al pastor de esa región.',en:'Select a state on the map to see the pastor for that region.'},
 openT:{es:'Por alcanzar',en:'To be reached'},
 openX:{es:'Aún no hay un pastor asignado en este estado. ¿Serás tú quien lleve el evangelio aquí?',en:'No pastor is assigned in this state yet. Will you be the one to bring the gospel here?'},
 cta:{es:'Quiero servir',en:'I want to serve'},
 noCity:{es:'Ciudad por confirmar',en:'City to be confirmed'}
};
function monogram(name){
  return (name||'').replace(/[\[\]]/g,'').split(' ')
    .filter(w=>w && !/^(pastor|hno\.?|nombre|del|de|la)$/i.test(w))
    .slice(0,2).map(w=>w[0]).join('').toUpperCase() || '\u2605';
}
function selectState(code){
  SELECTED=code;
  document.querySelectorAll('.state').forEach(p=>p.classList.toggle('sel',p.dataset.code===code));
  renderDetail();
}
function renderDetail(){
  const d=document.getElementById('mapDetail'); const L=CURLANG;
  if(!SELECTED){ d.innerHTML=`<p class="md-empty">${MT.def[L]}</p>`; return; }
  const name=NAMES[SELECTED], list=PASTORS[SELECTED], reg=REGION_OF[SELECTED];
  const regLine=reg?`<div class="md-region" style="color:${reg.color}">${reg.name[L]}</div>`:'';
  const cityIco=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FCBF49" stroke-width="2"><path d="M12 21s-7-4.6-7-10a7 7 0 0 1 14 0c0 5.4-7 10-7 10z"/><circle cx="12" cy="11" r="2.2"/></svg>`;
  const head=`<div class="md-state">${name}</div>${regLine}`;
  if(list && list.length){
    const cards=list.map(p=>{
      const role=p.role||MT.role[L];
      const imgStyle=p.zoom?` style="transform:scale(${p.zoom});transform-origin:${p.focus||'center center'}"`:'';
      const av=p.photo?`<img src="${p.photo}" alt="${p.name}"${imgStyle}>`:`<span class="md-mono">${monogram(p.name)}</span>`;
      const city=p.city?`<div class="md-city">${cityIco} ${p.city}</div>`:'';
      return `<div class="md-card"><div class="md-thumb">${av}</div><div class="md-info">`
        +`<div class="md-role">${role}</div><div class="md-name">${p.name}</div>${city}</div></div>`;
    }).join('');
    d.innerHTML=head+`<div class="md-list">${cards}</div>`;
  } else {
    d.innerHTML=head+`<div class="md-open"><div class="md-otag">${MT.openT[L]}</div><p>${MT.openX[L]}</p>`
      +`<a href="#unete" class="btn btn-ghost btn-sm">${MT.cta[L]}</a></div>`;
  }
}
function setLegendActive(key){
  document.querySelectorAll('.reg-chip').forEach(c=>c.classList.toggle('on',key&&c.dataset.region===key));
}
function highlightRegion(key){
  const already = svg.classList.contains('dim') && svg.dataset.active===key;
  document.querySelectorAll('.state').forEach(p=>p.classList.toggle('active',p.dataset.region===key));
  if(already){ svg.classList.remove('dim'); svg.dataset.active=''; setLegendActive(null); }
  else { svg.classList.add('dim'); svg.dataset.active=key; setLegendActive(key); }
}
function renderLegend(){
  const el=document.getElementById('regionLegend'); if(!el) return; el.innerHTML='';
  REGIONS.forEach(r=>{
    const c=document.createElement('button');
    c.type='button'; c.className='reg-chip'; c.dataset.region=r.key;
    c.innerHTML=`<i style="background:${r.color}"></i>${r.name[CURLANG]} <b>8</b>`;
    c.addEventListener('click',()=>highlightRegion(r.key));
    el.appendChild(c);
  });
  setLegendActive(svg.dataset.active||null);
}
renderLegend();
renderDetail();
document.getElementById('pastorCount').textContent=Object.keys(PASTORS).filter(k=>PASTORS[k]&&PASTORS[k].length).length;

/* ===== BOARD / MESA DIRECTIVA (editable placeholders) ===== */
const LEADERS=[
 {role:{es:"Secretario",en:"Secretary"},name:"Pastor Emilio García",city:"Ensenada, Baja California",photo:"assets/emilio-garcia.jpg"},
 {role:{es:"Tesorero",en:"Treasurer"},name:"Rev. Pedro Zavala",city:"Ensenada, Baja California",photo:"assets/tesorero.jpg"}
];
const lg=document.getElementById('leadersGrid');
LEADERS.forEach((p,i)=>{
  const initials=p.name.replace(/[\[\]]/g,'').split(' ').filter(w=>w&&w!=='Hno.').slice(0,2).map(w=>w[0]).join('').toUpperCase()||'•';
  const el=document.createElement('div'); el.className='leader reveal';
  const face=p.photo?`<img class="leader-img" src="${p.photo}" alt="${p.name}">`:`<span class="monogram">${initials}</span>`;
  const loc=p.city?`<div class="loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FCBF49" stroke-width="2"><path d="M12 21s-7-4.6-7-10a7 7 0 0 1 14 0c0 5.4-7 10-7 10z"/><circle cx="12" cy="11" r="2.2"/></svg> ${p.city}</div>`:'';
  el.innerHTML=`
    <div class="photo">${face}</div>
    <div class="body">
      <div class="role" data-leader="${i}-role">${p.role.es}</div>
      <h3>${p.name}</h3>
      ${loc}
    </div>`;
  lg.appendChild(el);
});

/* ===== CONSEJO GENERAL (international advisors; add photos to assets/ later) ===== */
const COUNCIL=[
 {name:"Nathan Holmes", photo:"assets/cg-holmes.png"},
 {name:"Nathaniel Urshan", photo:"assets/cg-urshan.png"},
 {name:"Kenneth Carpenter", photo:"assets/cg-carpenter.png"},
 {name:"Jesse Galindo", photo:"assets/cg-galindo.png"},
 {name:"Jonathan Vázquez", photo:"assets/cg-vazquez.png"},
 {name:"Matthew Ball", photo:"assets/cg-ball.png"},
 {name:"BJ Wilmoth", photo:"assets/cg-wilmoth.png"},
 {name:"Peter Gray", photo:"assets/cg-gray.jpg"}
];
const cg=document.getElementById('councilGrid');
if(cg){
  COUNCIL.forEach(p=>{
    const initials=p.name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'•';
    const el=document.createElement('div'); el.className='leader reveal';
    const face=p.photo?`<img class="leader-img" src="${p.photo}" alt="${p.name}">`:`<span class="monogram">${initials}</span>`;
    el.innerHTML=`
      <div class="photo">${face}</div>
      <div class="body">
        <div class="role" data-i18n="leaders.councilRole">Obispo</div>
        <h3>${p.name}</h3>
      </div>`;
    cg.appendChild(el);
  });
}

/* ===== NEWS / PRAISE REPORTS — real Instagram embeds live in index.html ===== */

/* ===== EMBERS ===== */
const field=document.getElementById('emberField');
if(field && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  for(let i=0;i<26;i++){
    const e=document.createElement('span');
    e.className='ember';
    e.style.left=Math.random()*100+'%';
    const dur=6+Math.random()*7, delay=Math.random()*7, drift=(Math.random()*60-30);
    e.style.animation=`rise ${dur}s linear ${delay}s infinite`;
    e.style.setProperty('--drift',drift+'px');
    field.appendChild(e);
  }
  const style=document.createElement('style');
  style.textContent=`@keyframes rise{0%{opacity:0;transform:translateY(0)}10%{opacity:.9}100%{opacity:0;transform:translate(var(--drift),-78vh)}}`;
  document.head.appendChild(style);
}

/* ===== COUNTERS ===== */
function animateCount(el){
  const target=+el.dataset.count; let cur=0;
  const step=Math.max(1,Math.round(target/45));
  const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t)}el.textContent=cur;},22);
}

/* ===== REVEAL + COUNTER OBSERVER ===== */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      en.target.querySelectorAll?.('[data-count]').forEach(animateCount);
      if(en.target.dataset && en.target.dataset.count) animateCount(en.target);
      io.unobserve(en.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));

/* ===== NAV BURGER ===== */
const burger=document.getElementById('burger'), navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

/* ===== i18n ===== */
const I18N={
 "nav.about":{es:"Nosotros",en:"About"},
 "nav.vision":{es:"Visión",en:"Vision"},
 "nav.states":{es:"Los 32x",en:"The 32x"},
 "nav.leaders":{es:"Liderazgo",en:"Leadership"},
 "nav.join":{es:"Únete",en:"Join"},
 "hero.scripture":{es:"«Arrepentíos, y bautícese cada uno… en el nombre de Jesucristo» — Hechos 2:38",en:"“Repent, and let every one be baptized… in the name of Jesus Christ” — Acts 2:38"},
 "hero.line":{es:"Vamos por los",en:"We're going for all"},
 "hero.sub":{es:"Una organización apostólica pentecostal comprometida con llevar el evangelio de Jesucristo a cada estado, cada ciudad y cada alma de México.",en:"An apostolic Pentecostal organization committed to bringing the gospel of Jesus Christ to every state, every city and every soul in Mexico."},
 "hero.cta1":{es:"Conoce la misión",en:"See the mission"},
 "hero.cta2":{es:"Sé parte",en:"Get involved"},
 "stat.states":{es:"Estados de México",en:"States of Mexico"},
 "stat.souls":{es:"Almas por alcanzar",en:"Souls to reach"},
 "stat.mission":{es:"Gran Comisión",en:"Great Commission"},
 "about.eyebrow":{es:"Quiénes somos",en:"Who we are"},
 "about.title":{es:"Bienvenidos a ALJC México",en:"Welcome to ALJC México"},
 "about.p1":{es:"Somos una organización apostólica pentecostal comprometida con la predicación del evangelio de Jesucristo en toda la República Mexicana. Nuestra pasión es ver vidas transformadas, iglesias establecidas, líderes capacitados y comunidades alcanzadas por el poder del evangelio.",en:"We are an apostolic Pentecostal organization committed to preaching the gospel of Jesus Christ throughout the Mexican Republic. Our passion is to see lives transformed, churches established, leaders trained and communities reached by the power of the gospel."},
 "about.p2":{es:"Desde las grandes ciudades hasta las comunidades indígenas más remotas, trabajamos para cumplir la Gran Comisión, llevando el mensaje de salvación a cada rincón de México.",en:"From the great cities to the most remote indigenous communities, we work to fulfill the Great Commission, carrying the message of salvation to every corner of Mexico."},
 "pillars.eyebrow":{es:"Nuestro corazón",en:"Our heart"},
 "pillars.title":{es:"Lema, visión y misión",en:"Motto, vision and mission"},
 "pillars.motto.k":{es:"Nuestro lema",en:"Our motto"},
 "pillars.motto.v":{es:"«Vamos por los 32x»",en:"“We're going for all 32x”"},
 "pillars.motto.p":{es:"Nuestra meta es clara: cada estado, cada ciudad, cada alma.",en:"Our goal is clear: every state, every city, every soul."},
 "pillars.vision.k":{es:"Nuestra visión",en:"Our vision"},
 "pillars.vision.t":{es:"32 estados, una obra",en:"32 states, one work"},
 "pillars.vision.p":{es:"Creemos que Jesús nos ha llamado a establecer una obra apostólica sólida en cada uno de los 32 estados de México.",en:"We believe Jesus has called us to establish a solid apostolic work in each of Mexico's 32 states."},
 "pillars.mission.k":{es:"Nuestra misión",en:"Our mission"},
 "pillars.mission.t":{es:"Plantar, formar, alcanzar",en:"Plant, train, reach"},
 "pillars.mission.p":{es:"Plantar iglesias saludables, formar líderes capacitados y llevar el evangelio a los 132 millones de habitantes de México.",en:"To plant healthy churches, train capable leaders and bring the gospel to Mexico's 132 million people."},
 "states.eyebrow":{es:"Vamos por los 32x — mapa de la misión",en:"We're going for all 32x — mission map"},
 "states.title":{es:"El mapa de la misión",en:"The mission map"},
 "states.p":{es:"Los 32 estados de México en un solo mapa. Toca un estado para ver al pastor de esa región — y los que aún esperan ser alcanzados.",en:"All 32 states of Mexico on one map. Tap a state to see the pastor for that region — and the ones still waiting to be reached."},
 "states.encendidos":{es:"estados con pastor",en:"states with a pastor"},
 "map.regions":{es:"Cuatro regiones · 8 estados cada una",en:"Four regions · 8 states each"},
 "map.legend.has":{es:"Con pastor",en:"Has pastor"},
 "map.legend.open":{es:"Por alcanzar",en:"To be reached"},
 "states.btn":{es:"Encender todos",en:"Ignite all"},
 "souls.eyebrow":{es:"El campo de cosecha",en:"The harvest field"},
 "souls.p":{es:"Ciento treinta y dos millones de almas viven en México. Cada una tiene un nombre, una historia y un lugar en el corazón de Dios. Por ellas trabajamos, oramos y vamos.",en:"One hundred thirty-two million souls live in Mexico. Each one has a name, a story and a place in the heart of God. For them we work, we pray, and we go."},
 "leaders.eyebrow":{es:"Liderazgo",en:"Leadership"},
 "obispo.role":{es:"Obispo Presidente",en:"Presiding Bishop"},
 "obispo.name":{es:"Roberto Rodríguez",en:"Roberto Rodríguez"},
 "obispo.couple":{es:"y su esposa, Maria",en:"& his wife, Maria"},
 "obispo.bio":{es:"Como Obispo Presidente, guía la visión de ALJC México de establecer una obra apostólica sólida en los 32 estados del país, sirviendo junto a su esposa con entrega y amor al pueblo de Dios.",en:"As Presiding Bishop, he leads ALJC México's vision of establishing a solid apostolic work in all 32 states of the country, serving alongside his wife with devotion and love for the people of God."},
 "leaders.title":{es:"Liderazgo",en:"Leadership"},
 "leaders.council":{es:"Consejo General",en:"National General Council"},
 "leaders.councilSub":{es:"Asesores internacionales que supervisan y acompañan la obra en México.",en:"International advisors who oversee and support the work in Mexico."},
 "leaders.councilRole":{es:"Obispo",en:"Bishop"},
 "leaders.p":{es:"Hombres y mujeres de Dios entregados a la obra, sirviendo y guiando juntos al pueblo que el Señor ha confiado a ALJC México.",en:"Men and women of God devoted to the work, serving and guiding together the people the Lord has entrusted to ALJC México."},
 "leaders.note":{es:"Nota: completa el nombre del Obispo Presidente y del Secretario, y reemplaza los nombres, fotos y ciudades de cada miembro de la Mesa Directiva.",en:"Note: complete the names of the Presiding Bishop and Secretary, and replace each board member's name, photo and city."},
 "join.eyebrow":{es:"Sé parte de la visión",en:"Be part of the vision"},
 "join.title":{es:'Cada estado. Cada ciudad. <span class="flame-text">Cada alma.</span>',en:'Every state. Every city. <span class="flame-text">Every soul.</span>'},
 "join.p":{es:"Únete en oración, ofrenda o servicio para que ALJC México alcance los 32 estados con el evangelio de Jesucristo.",en:"Join us in prayer, giving or service so ALJC México can reach all 32 states with the gospel of Jesus Christ."},
 "join.email.k":{es:"Correo",en:"Email"},
 "join.email.v":{es:'<a href="mailto:aljcmexico@gmail.com">aljcmexico@gmail.com</a>',en:'<a href="mailto:aljcmexico@gmail.com">aljcmexico@gmail.com</a>'},
 "join.phone.k":{es:"Teléfono",en:"Phone"},
 "join.phone.v":{es:'<a href="tel:+16462477595">(646) 247-7595</a>',en:'<a href="tel:+16462477595">(646) 247-7595</a>'},
 "join.give.k":{es:"Ofrenda misionera",en:"Missions giving"},
 "join.give.v":{es:"Apoya la obra",en:"Support the work"},
 "nav.give":{es:"Donar",en:"Give"},
 "nav.news":{es:"Noticias",en:"News"},
 "nav.fe":{es:"Fe",en:"Beliefs"},
 "fe.eyebrow":{es:"Lo que creemos",en:"What we believe"},
 "fe.title":{es:"Artículos de Fe",en:"Articles of Faith"},
 "fe.p":{es:"La doctrina apostólica que sostiene y guía la obra de ALJC México.",en:"The apostolic doctrine that sustains and guides the work of ALJC México."},
 "fe.pdf":{es:"Descargar documento completo (PDF)",en:"Download full document (PDF)"},
 "leaders.board":{es:"Mesa Directiva Nacional",en:"National Board of Directors"},
 "obispo.city":{es:"Ensenada, Baja California",en:"Ensenada, Baja California"},
 "video.eyebrow":{es:"Mensaje",en:"Message"},
 "video.title":{es:"Conoce nuestro corazón",en:"See our heart"},
 "video.p":{es:"Un vistazo a la visión y la obra de ALJC México.",en:"A look at the vision and work of ALJC México."},
 "video.ph":{es:"Pega aquí el enlace de tu video (YouTube o Vimeo) para que aparezca en esta sección.",en:"Paste your video link (YouTube or Vimeo) here so it appears in this section."},
 "give.eyebrow":{es:"Ofrenda",en:"Giving"},
 "give.title":{es:"Tu ofrenda enciende la misión",en:"Your giving ignites the mission"},
 "give.p":{es:"Cada aporte ayuda a plantar iglesias, capacitar líderes y llevar el evangelio a los rincones más remotos de México.",en:"Every gift helps plant churches, train leaders and bring the gospel to the most remote corners of Mexico."},
 "give.btn":{es:"Donar ahora",en:"Give now"},
 "give.checks":{es:"Cheques",en:"Checks"},
 "give.where.t":{es:"¿A dónde va tu ofrenda?",en:"Where does your gift go?"},
 "give.b1":{es:"Plantación de iglesias",en:"Church planting"},
 "give.b2":{es:"Capacitación de líderes",en:"Leadership training"},
 "give.b3":{es:"Misiones a comunidades indígenas",en:"Missions to indigenous communities"},
 "give.b4":{es:"Operación y administración",en:"Operations & administration"},
 "give.numbers.t":{es:"La meta",en:"The goal"},
 "give.n4b":{es:"Almas por alcanzar",en:"Souls to reach"},
 "give.n1":{es:"Iglesias plantadas",en:"Churches planted"},
 "give.n2":{es:"Líderes capacitados",en:"Leaders trained"},
 "give.n3":{es:"Estados objetivo",en:"Target states"},
 "give.n4":{es:"Miembros",en:"Members"},
 "give.note":{es:"Nota: conecta el botón “Donar ahora” a tu plataforma (PayPal, Stripe, Donorbox, etc.), ajusta los porcentajes y completa los números reales.",en:"Note: connect the “Give now” button to your platform (PayPal, Stripe, Donorbox, etc.), adjust the percentages and fill in the real numbers."},
 "news.eyebrow":{es:"Testimonios y noticias",en:"Testimonies & news"},
 "news.title":{es:"Reportes de las misiones",en:"Mission reports"},
 "news.p":{es:"Lo que Dios está haciendo a través de ALJC México.",en:"What God is doing through ALJC México."},
 "news.note":{es:"Nota: reemplaza estos reportes de ejemplo con tus testimonios y noticias reales.",en:"Note: replace these example reports with your real testimonies and news."},
 "news.follow":{es:"Síguenos en Instagram",en:"Follow us on Instagram"},
 "gallery.eyebrow":{es:"Nuestra gente",en:"Our people"},
 "gallery.title":{es:"Momentos de la misión",en:"Mission moments"},
 "gallery.p":{es:"Instantes de nuestras conferencias, graduaciones y del pueblo que Dios está levantando en cada rincón de México.",en:"Moments from our conferences, graduations, and the people God is raising up in every corner of Mexico."},
 "news2.eyebrow":{es:"Boletín",en:"Newsletter"},
 "news2.title":{es:"Recibe nuestro boletín",en:"Get our newsletter"},
 "news2.p":{es:"Mantente al tanto de la misión, los reportes de bendición y las próximas campañas.",en:"Stay up to date on the mission, reports of blessing and upcoming campaigns."},
 "news2.ph":{es:"tu@correo.com",en:"you@email.com"},
 "news2.btn":{es:"Suscribirme",en:"Subscribe"},
 "news2.note":{es:"Nota: reemplaza “your-form-id” en el formulario con tu ID de Formspree (u otro servicio) para recibir los correos.",en:"Note: replace “your-form-id” in the form with your Formspree (or other service) ID to receive the emails."},
 "footer.org":{es:"Asambleas del Señor Jesucristo de México",en:"Assemblies of the Lord Jesus Christ of Mexico"}
};
function setLang(lang){
  document.documentElement.lang=lang;
  document.getElementById('es').classList.toggle('active',lang==='es');
  document.getElementById('en').classList.toggle('active',lang==='en');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const t=I18N[el.dataset.i18n]; if(t) el.innerHTML=t[lang];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const t=I18N[el.dataset.i18nPh]; if(t) el.placeholder=t[lang];
  });
  document.querySelectorAll('[data-leader]').forEach(el=>{
    const [i,f]=el.dataset.leader.split('-'); const v=LEADERS[i][f];
    if(v&&typeof v==='object') el.textContent=v[lang];
  });
  CURLANG=lang; if(typeof renderLegend==='function') renderLegend(); if(typeof renderDetail==='function') renderDetail();
}

/* ===== NEWSLETTER (Formspree AJAX) ===== */
const NL_MSG={
  ok:{es:"¡Gracias! Te has suscrito al boletín.",en:"Thank you! You're subscribed to the newsletter."},
  err:{es:"No se pudo enviar. Inténtalo de nuevo.",en:"Couldn't send. Please try again."},
  unset:{es:"El formulario aún no está conectado a Formspree.",en:"The form isn't connected to Formspree yet."}
};
const nlForm=document.getElementById('newsletterForm');
if(nlForm){
  const status=document.getElementById('newsletterStatus');
  nlForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    if(nlForm.action.includes('your-form-id')){ status.textContent=NL_MSG.unset[CURLANG]; status.className='form-status err'; return; }
    status.textContent=''; status.className='form-status';
    try{
      const res=await fetch(nlForm.action,{method:'POST',body:new FormData(nlForm),headers:{'Accept':'application/json'}});
      if(res.ok){ nlForm.reset(); status.textContent=NL_MSG.ok[CURLANG]; status.className='form-status ok'; }
      else { status.textContent=NL_MSG.err[CURLANG]; status.className='form-status err'; }
    }catch(_){ status.textContent=NL_MSG.err[CURLANG]; status.className='form-status err'; }
  });
}
