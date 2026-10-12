/* ============================================================
   손봄 앱 로직 — 렌더링·라우팅·모달
   (보통 수정할 필요 없음. 데이터는 js/data.js, js/essays.js)
   ============================================================ */
const app = document.getElementById('app');
const $  = s => document.querySelector(s);
const pic = (seed,w,h)=>`https://picsum.photos/seed/${seed}/${w}/${h}.jpg`;
const artOf = id => ARTICLES.find(a=>a.id===id);
const artsOfWeek = wk => ARTICLES.filter(a=>a.week===wk);
const weekOf = id => WEEKS.find(w=>w.id===id);
const bySector = s => ARTICLES.filter(a=>a.sector===s);
const leadOf = t => (t.split(/(?<=\.)\s/).slice(0,2).join(' '));
const meter = (lv,small)=>`<span class="meter${small?' s':''}">${[1,2,3,4,5].map(i=>`<i class="${i<=lv?'on':''}"></i>`).join('')}</span>`;

/* 오늘 날짜 */
 $('#today').textContent = new Date()
  .toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'})
  .replace(/\./g,'.') + ' 발행';

/* 티커 */
const TICKS = [
 '<b>무인 매장 "범죄 2.3배"</b> — 분모는 매장 수 증가였습니다',
 '<b>누리호 "세계 3위"</b> — 비교 지표에 따라 4위에서 10위',
 '<b>혈중 미세플라스틱 87%</b> — 검출은 오염 확정이 아닙니다',
 '<b>"지지율 급락" 주장</b> — 3사 평균 기준 오차범위 내',
 '<b>"돌싱" 검색량 3배</b> — 검색량은 관심의 지표일 뿐입니다',
];
 $('#ticker').innerHTML = [0,1].map(()=>TICKS.map(t=>`<span class="tk">${t}</span><span class="tk sep">/</span>`).join('')).join('');

/* 내비 섹터 메뉴 */
 $('#nav-menu').innerHTML = Object.entries(SECTORS)
  .map(([k,v],i)=>`<a class="sec" data-n="0${i+1}" href="#/section/${k}">${v.name}</a>`).join('')
  + `<a href="#/">아카이브</a>`;

/* ============================================================
   뷰: 홈
   ============================================================ */
function renderHome(){
  const latest = WEEKS[0], hero = artsOfWeek(latest.id)[0];
  const tiles = WEEKS.map((w,i)=>{
    const a = artsOfWeek(w.id)[0];
    return `<a class="week-tile ${i===0?'big':''} reveal" href="#/week/${w.id}" style="transition-delay:${i*70}ms">
      <img class="wt-img" src="${pic(a.img, i===0?900:600, i===0?900:600)}" alt="">
      <div class="wt-top"><span>${w.label}</span><span>${w.range}</span></div>
      <div class="wt-bottom">
        <b data-count="${a.num}" data-decimals="${String(a.num).includes('.')?1:0}">${a.num}</b><span class="u">${a.unit} · ${a.unitLabel}</span>
        <h3>${a.headline}</h3>
        <span class="cnt">검증 ${artsOfWeek(w.id).length}건 열람 →</span>
      </div>
    </a>`;
  }).join('') + `
    <div class="week-tile soon reveal" style="transition-delay:280ms">
      <div class="soon-in"><b>11월 1주차</b>COMING SOON · 발행 예정</div>
    </div>`;

  const e = ESSAYS[0];
  app.innerHTML = `
  <div class="view wrap">
    <!-- 1면 히어로 -->
    <section class="hero reveal in">
      <div class="hero-media">
        <img src="${pic(hero.img,1200,900)}" alt="">
        <span class="week">${latest.label} · 대표 기사</span>
        <div class="hero-stat"><b data-count="${hero.num}" data-decimals="${String(hero.num).includes('.')?1:0}">0</b><i>${hero.unit} — ${hero.unitLabel}</i></div>
      </div>
      <div class="hero-text">
        <div class="k"><span class="tag red">${SECTORS[hero.sector].name}</span><span class="tag">${latest.range}</span></div>
        <h2>${hero.headline}</h2>
        <p class="lead">${leadOf(hero.summary)}</p>
        <div class="check-line">${meter(hero.level,true)} 검증 결과 <b>${LEVELS[hero.level]}</b> — ${hero.note.split('.')[0]}.</div>
        <div class="cta">
          <a class="btn" href="#/week/${latest.id}">이번 주 검증 5건 전체 보기
            <svg class="arrow" width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h14M9 1l5 5-5 5"/></svg></a>
          <a class="link-more" href="#" data-article="${hero.id}">기사 상세 검증 노트 열기 →</a>
        </div>
      </div>
    </section>

    <!-- 주간 아카이브 -->
    <div id="week-archive">
      <div class="sec-head">
        <h2>주간 검증 아카이브</h2>
        <p class="desc">정사각형 한 칸이 한 주입니다. 타일을 열면 정치·사회·과학·연애·스포츠 다섯 섹터의 카드뉴스가 펼쳐집니다.</p>
      </div>
      <div class="week-grid">${tiles}</div>
    </div>

    <!-- 월간 평론 -->
    <section class="essay-block" id="essay-block" style="margin:70px -28px -70px;padding-left:28px;padding-right:28px">
      <div class="wrap" style="padding:0">
        <div class="sec-head" style="margin-top:0;padding-top:8px">
          <h2>월간 평론</h2>
          <p class="desc">매달 마지막 주, 그 달의 이슈를 한 편의 에세이로 결산합니다.</p>
        </div>
        <div class="essay-grid reveal">
          <a class="essay-cover" href="#/essay/${e.id}">
            <img src="${pic(e.img,900,700)}" alt="">
            <span class="no">${e.no} · ${e.month}</span>
            <h3>${e.title}</h3>
            <p class="sub">${e.sub}</p>
            <div class="meta"><span>${e.by}</span><span>${e.date}</span></div>
          </a>
          <div class="essay-list">
            ${ESSAYS.map(x=>`
            <a class="essay-row" href="#/essay/${x.id}">
              <span class="n">${x.no}</span>
              <div><h4>${x.title}</h4><p>${x.sub}</p></div>
              <span class="date">${x.date}</span>
            </a>`).join('')}
          </div>
        </div>
      </div>
    </section>
  </div>`;
}

/* ============================================================
   뷰: 주차 상세
   ============================================================ */
function renderWeek(id){
  const w = weekOf(id); if(!w) return renderHome();
  const arts = artsOfWeek(id);
  const sectorBtns = `<button class="on" data-f="all">전체 <span class="ct">${arts.length}</span></button>` +
    Object.entries(SECTORS).map(([k,v])=>{
      const c = arts.filter(a=>a.sector===k).length;
      return `<button data-f="${k}" ${c? '':'disabled style="opacity:.35"'}>${v.name} <span class="ct">${c}</span></button>`;
    }).join('');
  app.innerHTML = `
  <div class="view wrap">
    <div class="crumbs"><a href="#/">홈</a> / 주간 아카이브 / <b>${w.label}</b></div>
    <header class="week-hero">
      <div>
        <span class="tag red">WEEKLY ISSUE</span>
        <h2>${w.label}</h2>
        <span class="range">${w.range} · 발행: 손봄 편집실</span>
      </div>
      <span class="badge">검증 ${arts.length}건 · 5단계 팩트 척도</span>
    </header>
    <div class="tabs" id="tabs">${sectorBtns}</div>
    <div class="news-grid" id="news-grid">
      ${arts.map(cardHTML).join('')}
    </div>
  </div>`;

  document.getElementById('tabs').addEventListener('click', e=>{
    const b = e.target.closest('button[data-f]'); if(!b) return;
    document.querySelectorAll('#tabs button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    document.querySelectorAll('#news-grid .news-card').forEach(c=>{
      c.classList.toggle('hide', b.dataset.f!=='all' && c.dataset.sector!==b.dataset.f);
    });
  });
}

/* 카드뉴스: 위 반쪽 사진+수치 / 아래 반쪽 요약 */
function cardHTML(a){
  const s = SECTORS[a.sector], w = weekOf(a.week);
  return `<article class="news-card reveal" data-sector="${a.sector}" data-article="${a.id}" style="cursor:pointer">
    <div class="nc-photo">
      <img src="${pic(a.img,700,520)}" alt="">
      <span class="nc-sector">${s.name} · ${s.en}</span>
      <div class="nc-stat"><b data-count="${a.num}" data-decimals="${String(a.num).includes('.')?1:0}">0</b><i>${a.unit} — ${a.unitLabel}</i></div>
    </div>
    <div class="nc-body">
      <h3>${a.headline}</h3>
      <p>${a.summary}</p>
      <div class="nc-foot">
        <span class="lv">${meter(a.level,true)} ${LEVELS[a.level]}</span>
        <span class="go">상세 검증 →</span>
      </div>
    </div>
  </article>`;
}

/* ============================================================
   뷰: 섹터 아카이브
   ============================================================ */
const SEC_DESC = {
  politics:'정치 헤드라인에서 가장 자주 지워지는 것은 오차범위와 비교 기준입니다.',
  society :'사회 통계는 분모를 숨길 때 가장 무서워집니다. 배수와 비율의 뒷면을 봅니다.',
  science :'연구 결과와 미래 전망은 다른 문장입니다. 논문 원문의 문구를 확인합니다.',
  love    :'설문·트렌드 기사는 표본과 "공감/실천"의 간격이 생명입니다.',
  sports  :'기록은 사실이지만, 해석은 시즌이 끝나기 전엔 성립하지 않습니다.',
};
function renderSection(id){
  const s = SECTORS[id]; if(!s) return renderHome();
  const arts = bySector(id).sort((a,b)=>b.week.localeCompare(a.week));
  app.innerHTML = `
  <div class="view wrap">
    <div class="crumbs"><a href="#/">홈</a> / 섹터 / <b>${s.name}</b></div>
    <header class="sec-hero">
      <span class="en">${s.en}</span>
      <h2>${s.name}</h2>
      <p>${SEC_DESC[id]} 전 주차에 걸쳐 <b>${arts.length}건</b>을 검증했습니다. 행을 누르면 검증 노트가 열립니다.</p>
      <div class="tabs" style="margin-bottom:0">
        ${Object.entries(SECTORS).map(([k,v])=>`<a class="tab ${k===id?'on':''}" href="#/section/${k}">${v.name}</a>`).join('')}
      </div>
    </header>
    <div class="rows">
      ${arts.map(a=>{
        const w = weekOf(a.week);
        return `<div class="row" data-article="${a.id}">
          <span class="w">${w.label}<br>${w.range}</span>
          <span class="st" data-count="${a.num}" data-decimals="${String(a.num).includes('.')?1:0}">${a.num}<small style="font-size:.45em">${a.unit}</small></span>
          <h4>${a.headline}</h4>
          <svg class="arrow ar" width="18" height="14" viewBox="0 0 16 12"><path d="M0 6h14M9 1l5 5-5 5"/></svg>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

/* ============================================================
   뷰: 평론 목록 / 리더
   ============================================================ */
function renderEssays(){
  const e = ESSAYS[0];
  app.innerHTML = `
  <div class="view">
    <div class="essay-block" style="margin-top:40px;padding-bottom:70px">
      <div class="wrap">
        <div class="sec-head" style="margin-top:0">
          <h2>월간 평론</h2>
          <p class="desc">그 달의 이슈를 결산하는 편집실 에세이. 매달 마지막 주에 발행됩니다.</p>
        </div>
        <div class="essay-grid reveal">
          <a class="essay-cover" href="#/essay/${e.id}">
            <img src="${pic(e.img,900,700)}" alt="">
            <span class="no">${e.no} · ${e.month} · 최신호</span>
            <h3>${e.title}</h3>
            <p class="sub">${e.sub}</p>
            <div class="meta"><span>${e.by}</span><span>${e.date}</span></div>
          </a>
          <div class="essay-list">
            ${ESSAYS.map(x=>`
            <a class="essay-row" href="#/essay/${x.id}">
              <span class="n">${x.no}</span>
              <div><h4>${x.title}</h4><p>${x.sub}</p></div>
              <span class="date">${x.date}</span>
            </a>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderEssay(id){
  const e = ESSAYS.find(x=>x.id===id); if(!e) return renderEssays();
  const i = ESSAYS.indexOf(e), prev = ESSAYS[i+1], next = ESSAYS[i-1];
  const body = e.body.map(b => b.t==='q'
    ? `<blockquote>${b.text}<i>— 손봄 편집실</i></blockquote>`
    : `<p class="${b.drop?'drop':''}">${b.text}</p>`).join('');
  app.innerHTML = `
  <div class="view">
    <div class="progress" id="progress"></div>
    <header class="essay-head">
      <span class="no">${e.no} · 월간 평론 · ${e.month}</span>
      <h1>${e.title}</h1>
      <p class="sub">${e.sub}</p>
      <div class="meta"><span>글 <b>${e.by}</b></span><span>발행 <b>${e.date}</b></span><span>분량 <b>${e.body.filter(b=>b.t==='p').length}문단</b></span></div>
    </header>
    <div class="essay-body" id="essay-body">${body}</div>
    <div class="essay-nav">
      ${prev?`<a href="#/essay/${prev.id}"><span class="d">← 이전 호 · ${prev.month}</span><h5>${prev.title}</h5></a>`:'<a style="visibility:hidden"></a>'}
      ${next?`<a class="next" href="#/essay/${next.id}"><span class="d">${next.month} · 다음 호 →</span><h5>${next.title}</h5></a>`:'<a style="visibility:hidden"></a>'}
    </div>
  </div>`;
  /* 읽기 진행바 */
  const pb = document.getElementById('progress');
  const onScroll = ()=>{
    const el = document.getElementById('essay-body');
    if(!el){ window.removeEventListener('scroll',onScroll); return; }
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - innerHeight*0.4;
    const p = Math.min(1, Math.max(0, (-r.top + innerHeight*0.5) / total));
    pb.style.width = (p*100)+'%';
  };
  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ============================================================
   기사 상세 모달
   ============================================================ */
const modal = document.getElementById('modal');
function openArticle(id){
  const a = artOf(id); if(!a) return;
  const s = SECTORS[a.sector], w = weekOf(a.week);
  document.getElementById('modal-card').innerHTML = `
    <button class="modal-x" data-close aria-label="닫기">
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2"/></svg>
    </button>
    <div class="m-photo"><img src="${pic(a.img,900,560)}" alt=""><span class="nc-sector">${s.name} · ${s.en}</span></div>
    <div class="m-body">
      <div class="m-meta">${w.label} · ${w.range}</div>
      <h2>${a.headline}</h2>
      <div class="m-statline"><b>${a.num.toLocaleString()}${a.unit}</b><i>${a.unitLabel}</i></div>
      <p class="m-summary">${a.summary}</p>
      <div class="m-check">
        <div class="mc-head">검증 노트<span>FACT CHECK NOTE</span></div>
        <div class="mc-claim"><em>주장</em><p>${a.claim}</p></div>
        <div class="mc-note"><em>확인</em><p>${a.note}</p></div>
        <div class="mc-foot">
          <div class="mc-meter">${meter(a.level)}<span class="ll">${LEVELS[a.level]}</span></div>
          <div class="stamp">${LEVELS[a.level]}</div>
        </div>
        <div class="mc-source">출처 — ${a.source}</div>
      </div>
      <div class="m-actions">
        <button class="btn" id="copy-link">기사 링크 복사
          <svg class="arrow" width="14" height="12" viewBox="0 0 16 12"><path d="M0 6h14M9 1l5 5-5 5"/></svg></button>
        <a class="link-more" style="align-self:center" href="#/week/${a.week}" data-close>같은 주차 기사 보기 →</a>
      </div>
    </div>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  $('#copy-link').addEventListener('click', ()=>{
    navigator.clipboard?.writeText(location.href.split('#')[0] + '#/week/' + a.week)
      .then(()=>toast('링크를 복사했습니다.'))
      .catch(()=>toast('복사에 실패했습니다.'));
  });
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
modal.addEventListener('click', e=>{ if(e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

/* 토스트 */
let toastT;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ============================================================
   라우터 & 공통 효과
   ============================================================ */
function route(){
  const [, view, param] = (location.hash || '#/').split('/');
  closeModal();
  window.scrollTo(0,0);
  if(view==='week')        renderWeek(param);
  else if(view==='section')renderSection(param);
  else if(view==='essays') renderEssays();
  else if(view==='essay')  renderEssay(param);
  else                     renderHome();
  app.classList.remove('view'); void app.offsetWidth;
  app.firstElementChild?.classList.add('view');
  initReveal(); initCounters();
}

/* 등장 애니메이션 */
const io = new IntersectionObserver(es=>es.forEach(x=>{
  if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); }
}),{threshold:.12});
function initReveal(){ document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el)); }

/* 숫자 카운트업 */
function initCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    if(el.dataset.done) return; el.dataset.done='1';
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals||'0');
    const fix = v => dec? v.toFixed(dec) : Math.round(v).toLocaleString();
    const t0 = performance.now(), dur = 1100;
    const step = t=>{
      const p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = fix(target*e);
      if(p<1) requestAnimationFrame(step); else el.textContent = fix(target);
    };
    requestAnimationFrame(step);
  });
}

/* 카드·행 클릭 → 상세 모달 (이벤트 위임) */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-article]');
  if(el){ e.preventDefault(); openArticle(el.dataset.article); }
});

window.addEventListener('hashchange', route);
route();
