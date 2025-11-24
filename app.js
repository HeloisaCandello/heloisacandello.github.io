
(async function(){
  const res = await fetch('data/content.json', {cache:'no-store'});
  let data; try{ data = await res.json(); }catch(e){ console.error(e); return; }
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // ABOUT
  $('.about-text').innerHTML = data.about.map(p=>`<p>${p}</p>`).join('');
  $('.edu').innerHTML = data.education.map(e=>`<p><strong>${e.degree}</strong><br>${e.institution || ''}${e.period? ' — '+e.period:''}</p>`).join('');
  $('.exp').innerHTML = data.experience.map(x=>`<p><strong>${x.title}</strong>, ${x.org}${x.period? ' — '+x.period:''}<br>${x.location||''}</p><ul>${x.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`).join('');
  if(data.impact){
    const im = data.impact; const box = document.createElement('div'); box.className='impact';
    box.innerHTML = `<h3>Research Impact</h3><ul>
      <li>Citations: ${im.citations_total} total; ${im.citations_since_2020} since 2020</li>
      <li>h-index: ${im.hindex}</li>
      <li>i10-index: ${im.i10}</li>
    </ul>`; $('#about').appendChild(box);
  }

  // NEWS
  $('.news-list').innerHTML = (data.news||[]).map(n=>`<p>• ${n.date}: ${n.text}</p>`).join('');

  // PUBLICATIONS
  const pubsEl = $('.pubs');
  const allPubs = [...(data.publications.CHI||[]).map(p=>({...p, tag:'CHI'})),
                   ...(data.publications.CSCW||[]).map(p=>({...p, tag:'CSCW'})),
                   ...(data.publications.recent||[]).map(p=>({...p, tag:'recent'}))];
  function pubLi(p){
    const links = ['doi','pdf','link'].filter(k=>p[k]).map(k=>`<a href="${p[k]}" target="_blank" rel="noopener">${k.toUpperCase()}</a>`).join(' ');
    return `<li data-tag="${p.tag}"><div class="title">${p.title}</div><div class="venue">${p.venue||''}${p.year? ', '+p.year:''}</div><div class="actions">${links}</div></li>`;
  }
  function render(filter='all'){
    pubsEl.innerHTML = (filter==='all'? allPubs: allPubs.filter(p=>p.tag===filter)).map(pubLi).join('');
  }
  render('all');
  $$('.filters button').forEach(b=>b.addEventListener('click',()=>{
    $$('.filters button').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    render(b.dataset.filter);
  }));

  // PROJECTS
  $('.projects').innerHTML = (data.projects||[]).map(p=>`
    <article class="project">
      <h3>${p.title}</h3>
      ${p.meta? `<div class="meta">${p.meta}</div>`:''}
      ${p.summary? `<p>${p.summary}</p>`:''}
      ${p.links? `<p>${p.links.map(l=>`<a href="${l.href}">${l.label}</a>`).join(' · ')}</p>`:''}
    </article>`).join('');

  // SERVICE & TEACHING
  $('.service').innerHTML = (data.service||[]).map(s=>`<li><strong>${s.role}</strong><div class="where">${[s.org,s.venue,s.period].filter(Boolean).join(' • ')}</div></li>`).join('');
  $('.teaching').innerHTML = (data.teaching||[]).map(t=>`<li>${t}</li>`).join('');

  // Footer year
  $('.year').textContent = new Date().getFullYear();
})();
