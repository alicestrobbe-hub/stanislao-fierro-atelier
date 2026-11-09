'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import imageData from './images.json';

type Project = { slug: string; name: string; place: string; year: string; category: string; selected: boolean; description: string; competition?: string; credit?: string };
const projects: Project[] = [
 {slug:'piazza-silvius-magnago',name:'Piazza Silvius Magnago',place:'Bolzano',year:'2017',category:'Spazi pubblici',selected:true,competition:'2012 · 1° premio',description:'Un piano continuo davanti al Palazzo della Provincia. Pochi elementi in pietra, monoliti e sedute, misurano lo spazio e lasciano alla città la libertà di abitarlo.'},
 {slug:'centro-formazione-baza',name:'Formación y Empleo',place:'Baza, Spagna',year:'2015',category:'Edifici pubblici',selected:true,competition:'2007 · 1° premio',credit:'Fernando Alda',description:'Sul limite dell’Alcazaba, un edificio mette in relazione la parte alta e la parte bassa della città. Un luogo per la formazione, un nuovo passaggio pubblico. Con Daroca Arquitectos.'},
 {slug:'piazza-universita',name:'Piazza Università',place:'Bolzano',year:'2014',category:'Spazi pubblici',selected:true,competition:'2013 · 1° premio',description:'Pietra, alberi da fiore e sedute circolari. Lo spazio davanti all’università diventa un luogo di incontro, una pausa nel ritmo della città.'},
 {slug:'ipes-soprabolzano',name:'9 alloggi IPES',place:'Soprabolzano',year:'2012',category:'Residenziale',selected:false,description:'Un progetto residenziale a Soprabolzano. Disegni, immagini e dettagli dall’archivio dello studio.'},
 {slug:'scuola-materna-sluderno',name:'Scuola materna',place:'Sluderno',year:'2012',category:'Scuole',selected:false,description:'Il progetto della scuola materna di Sluderno, attraverso le immagini e i disegni dell’archivio.'},
 {slug:'palestra-nalles',name:'Palestra della scuola',place:'Nalles',year:'2011',category:'Scuole',selected:false,description:'La palestra della scuola elementare di Nalles. Una selezione di immagini e disegni di progetto.'},
 {slug:'centro-luson',name:'Il centro di Luson',place:'Luson',year:'2009–10',category:'Spazi pubblici',selected:true,competition:'2008 · 1° premio',description:'Una piazza ritrovata e un giardino incorporato nel disegno urbano. Scale, gradini e piattaforme ridefiniscono gli accessi e le relazioni tra gli edifici del paese.'},
 {slug:'abitazioni-funes',name:'Abitazioni a Funes',place:'Funes',year:'2005',category:'Residenziale',selected:false,description:'Abitare il paesaggio. Un progetto raccontato attraverso schizzi, modelli e disegni, dall’archivio dello studio.'},
 {slug:'piazza-tribunale',name:'Piazza Tribunale',place:'Bolzano',year:'2004',category:'Spazi pubblici',selected:true,competition:'2001 · 1° premio',description:'Uno spazio aperto davanti al Palazzo di Giustizia. Sotto la piazza, un parcheggio su più livelli riceve luce naturale attraverso tagli e lucernari.'}
];
const categories=['All projects','Selected','Spazi pubblici','Edifici pubblici','Scuole','Residenziale'];
const images=(p:Project)=>(imageData as Record<string,string[]>)[p.slug] || [];
const cover=(p:Project)=>images(p)[0];
const heroSlides = [
 { image: '/images/baza-hq-day.webp', label: 'La piazza' },
 { image: '/images/baza-hq-dusk.webp', label: 'La luce' },
 { image: '/images/baza-hq-interior.webp', label: 'Lo spazio' }
];
const heroProject = projects[1];
const drawings = [
 { image: '/images/centro-formazione-baza-2.jpg', title: 'Baza', project: projects[1], alt: 'Schizzo a mano del profilo urbano di Baza' },
 { image: '/images/piazza-silvius-magnago-4.jpg', title: 'Silvius Magnago', project: projects[0], alt: 'Schizzo a mano degli elementi in pietra di Piazza Silvius Magnago' },
 { image: '/images/piazza-tribunale-2.jpg', title: 'Tribunale', project: projects[8], alt: 'Schizzo a mano per Piazza Tribunale' }
];

export default function Home(){
 const [page,setPage]=useState('home');
 const [category,setCategory]=useState('All projects');
 const [active,setActive]=useState(projects[0]);
 const [project,setProject]=useState<Project|null>(null);
 const [slide,setSlide]=useState(0);
 const [sketchVisible, setSketchVisible] = useState(false);
 const [drawingIndex, setDrawingIndex] = useState(0);
 const drawing = drawings[drawingIndex];
 const [slideshowPaused, setSlideshowPaused] = useState(false);
 const backgroundRef = useRef<HTMLDivElement>(null);
 const [expanded,setExpanded]=useState<number|null>(null);
 const [copied,setCopied]=useState(false);
 const [closing,setClosing]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 const triggerRef=useRef<HTMLElement|null>(null);
 const filtered=projects.filter(p=>category==='All projects'||(category==='Selected'?p.selected:p.category===category));
 const grid=category==='All projects'||category==='Selected';
 useEffect(()=>{
  function readRoute(){setClosing(false);const parts=window.location.hash.slice(1).split('/');const found=projects.find(p=>p.slug===parts[1]);setProject(parts[0]==='project'?found||null:null);setPage(parts[0]==='project'?'projects':['projects','studio','contact'].includes(parts[0])?parts[0]:'home');}
  readRoute();window.addEventListener('hashchange',readRoute);return()=>window.removeEventListener('hashchange',readRoute);
 },[]);
 useEffect(() => {
  if (page !== 'home' || sketchVisible || slideshowPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 10000);
  return () => clearInterval(timer);
 }, [page, sketchVisible, slideshowPaused, slide]);
 useEffect(() => { setSketchVisible(false); }, [page]);
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     entry.target.classList.add('is-revealed');
     observer.unobserve(entry.target);
    }
   });
  }, { threshold: 0.08 });
  document.querySelectorAll('.editorial-image, .studio-bio, .awards').forEach(element => {
   const bounds = element.getBoundingClientRect();
   if (bounds.top > window.innerHeight) {
    element.classList.add('will-reveal');
    observer.observe(element);
   }
  });
  return () => observer.disconnect();
 }, [page, project]);
 function movePerspective(event: React.PointerEvent<HTMLDivElement>) {
  if (page !== 'home' || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 16;
  const y = (event.clientY / window.innerHeight - 0.5) * 12;
  backgroundRef.current?.style.setProperty('--look-x', `${x}px`);
  backgroundRef.current?.style.setProperty('--look-y', `${y}px`);
 }
 function resetPerspective() {
  backgroundRef.current?.style.setProperty('--look-x', '0px');
  backgroundRef.current?.style.setProperty('--look-y', '0px');
 }
 useEffect(()=>{document.body.style.overflow=project?'hidden':'';if(project){setExpanded(null);setCopied(false);closeRef.current?.focus({ preventScroll: true });}return()=>{document.body.style.overflow=''}},[project]);
 function navigate(next:string){setPage(next);window.location.hash=next==='home'?'':next;window.scrollTo({top:0,behavior:'instant'});}
 function openProject(p:Project){triggerRef.current=document.activeElement as HTMLElement;setProject(p);window.location.hash='project/'+p.slug;}
 function finishClose() {
  setProject(null);
  setClosing(false);
  window.location.hash = 'projects';
  requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
 }
 function closeProject() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
   finishClose();
  } else {
   setClosing(true);
  }
 }
 function toggleSketch() {
  if (!sketchVisible) setDrawingIndex(0);
  setSketchVisible(!sketchVisible);
 }
 function chooseCategory(c:string){setCategory(c);setActive(projects.find(p=>c==='All projects'||(c==='Selected'?p.selected:p.category===c))||projects[0]);}
 async function share(){try{await navigator.clipboard.writeText(window.location.href);setCopied(true)}catch{window.prompt('Copia il link del progetto',window.location.href)}}
 const footer=<footer><span>© {new Date().getFullYear()} Stanislao Fierro</span><span>Architetto · Bolzano</span><span>P. IVA 01639010212</span><a href="mailto:stanislao.fierro@archiworldpec.it">PEC ↗</a></footer>;
 return <div className={`site ${page==='home'?'is-home':'is-inside'} ${sketchVisible?'is-sketch':''}`} onPointerMove={movePerspective} onPointerLeave={resetPerspective}>
  <a className="skip" href="#main">Vai al contenuto</a>
  <div className="home-background" ref={backgroundRef}>
   <div className="photographic-plane">{heroSlides.map((item,i)=><img key={item.image} className={slide===i?'visible':''} src={item.image} fetchPriority={i===0?'high':'auto'} alt=""/>)}</div>
   <div className="shade"/>
   <div className="sketch-plane" aria-hidden={!sketchVisible || page !== 'home'}>
    <div className="drawing-registration"><span>SF / ARCHIVIO DEGLI SCHIZZI</span><span>{drawing.project.place}</span></div>
    <div className="drawing-frame"><img key={drawingIndex} src={drawing.image} alt={drawing.alt}/><span className="drawing-tick tick-one"/><span className="drawing-tick tick-two"/></div>
   </div>
  </div>
  <header className="site-header">
   <a className="wordmark" href="#" onClick={e=>{e.preventDefault();navigate('home')}} aria-label="Stanislao Fierro — Home"><span>stanislao</span><span>fierro<span className="logo-dot">.</span></span></a>
   <p className="manifesto" aria-hidden={page!=='home'}>{sketchVisible?'Il primo segno.':'Lo spazio, nella sua essenza.'}</p>
   <nav aria-label="Navigazione principale">{['Projects','Studio','Contact'].map((name,i)=><a key={name} href={'#'+name.toLowerCase()} onClick={e=>{e.preventDefault();navigate(name.toLowerCase())}} className={page===name.toLowerCase()?'current':''}><span className="nav-number">0{i+1}</span>{name}<span className="nav-arrow">↗</span></a>)}</nav>
  </header>
  {page==='home'?<main id="main" className="home-caption">
   <button className="sketch-switch" aria-pressed={sketchVisible} onClick={toggleSketch} aria-label={sketchVisible?'Torna alla fotografia':'Apri l’archivio degli schizzi'}>
    <span className="sketch-switch-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 28 L8 17 L18 17 L18 11 L31 11 L31 28 M5 28 L35 28"/><path className="pencil-line" d="M10 25 L28 15 M12 28 L31 18"/></svg></span>
    <span>{sketchVisible?'Torna allo spazio':'Scopri il primo segno'}<small>{sketchVisible?'Chiudi l’archivio':'Archivio degli schizzi'}</small></span>
   </button>
   <div><span className="eyebrow">ARCHITETTURA · BOLZANO</span><span className="home-year">Dal 1989</span></div>
   {sketchVisible ? (
    <>
     <button className="hero-project" onClick={() => openProject(drawing.project)}>
      <span>{drawing.project.name}</span><small>Vai al progetto ↗</small>
     </button>
     <div className="drawing-controls" role="group" aria-label="Schizzi per progetto">
      {drawings.map((item, index) => (
       <button key={item.image} onClick={() => setDrawingIndex(index)} aria-pressed={drawingIndex === index}>{item.title}</button>
      ))}
     </div>
    </>
   ) : (
    <button className="hero-project" onClick={() => openProject(heroProject)}><span>{heroProject.name}</span><small>{heroProject.place} · {heroProject.year} ↗</small><small className="hero-photo-credit">Fotografie © Fernando Alda</small></button>
   )}
   <div className="slide-controls" inert={sketchVisible} aria-hidden={sketchVisible}>
    <button className="slideshow-pause" onClick={()=>setSlideshowPaused(value=>!value)} aria-label={slideshowPaused?'Riprendi fotografie':'Pausa fotografie'}>{slideshowPaused?'▷':'Ⅱ'}</button>
    {heroSlides.map((item,i)=><button key={item.image} onClick={()=>setSlide(i)} aria-label={'Mostra '+item.label} aria-pressed={slide===i}><span className={i===slide?'active':''}/></button>)}<small>0{slide+1} / 03</small>
   </div>
  </main>:
  <main key={page} id="main" className={'page page-'+page}>
  {page==='projects'&&<>
   <div className="index-heading"><h1>Projects<span>({String(projects.length).padStart(2,'0')})</span></h1><span className="eyebrow">UN ARCHIVIO DI SPAZI, SEGNI E MATERIA</span></div>
   <div className="filter-bar" role="tablist" aria-label="Categorie progetti">{categories.map(c=><button key={c} role="tab" aria-selected={category===c} onClick={()=>chooseCategory(c)} className={category===c?'selected':''}>{c}{c===category&&<sup>{filtered.length}</sup>}</button>)}<span className="view-label">{grid?'Indice visivo ↙':'Indice dei progetti ↙'}</span></div>
   {grid?<div className="project-grid" key={category}>{filtered.map((p,i)=><button className="project-card" key={p.slug} onClick={()=>openProject(p)}><div className="card-image"><img src={cover(p)} alt={p.name+' — '+p.place} loading={i<4?'eager':'lazy'}/><span className="image-open">↗</span></div><div className="card-caption"><span>{p.name}</span><small>{p.place} · {p.year}</small><span className="card-index">{String(i+1).padStart(2,'0')}</span></div></button>)}</div>:<div className="category-view" key={category}><button className="category-image" onClick={()=>openProject(active)} aria-label={'Apri '+active.name}><img key={active.slug} src={cover(active)} alt={active.name}/><span>{active.name} <span>↗</span></span></button><div className="project-list"><span className="eyebrow list-intro">{category} / {String(filtered.length).padStart(2,'0')}</span>{filtered.map((p,i)=><div className={'project-row '+(active.slug===p.slug?'active':'')} key={p.slug}><button onMouseEnter={()=>setActive(p)} onFocus={()=>setActive(p)} onClick={()=>{if(window.matchMedia('(hover: none)').matches&&active.slug!==p.slug){setActive(p)}else openProject(p)}}><span className="row-index">{String(i+1).padStart(2,'0')}</span><span className="row-name">{p.name}</span><span className="row-meta">{p.place}<br/>{p.year}</span><span className="row-arrow">↗</span></button></div>)}<span className="list-hint">Esplora un nome. Entra in un progetto.</span></div></div>}
  </>}
  {page==='studio'&&<><div className="section-label"><h1>Studio</h1><span>01 / UN MODO DI GUARDARE</span></div><section className="studio-intro"><div><h2>Il progetto comincia<br/>da uno sguardo.</h2><p>Piazze, edifici, luoghi da abitare.<br/>Un’architettura fatta di relazioni,<br/>materia e misura.</p></div><figure><img src="/images/portrait.webp" alt="Stanislao Fierro"/><figcaption>Stanislao Fierro · Architetto</figcaption></figure></section><section className="studio-bio"><span className="eyebrow">PROFILO</span><div><h3>Da un segno a uno spazio.</h3><p>Nato a Taurasi nel 1961, Stanislao Fierro si laurea allo IUAV di Venezia nel 1988. Dal 1989 lavora a Bolzano, progettando spazi pubblici, edifici e residenze in Italia e in Europa.</p><p>Il concorso è un terreno di ricerca. Lo schizzo a mano, il primo strumento per leggere il luogo. Lo studio lavora con Nadine Saul, in Via Montello.</p></div><img src="/images/centro-formazione-baza-5.jpg" alt="Disegno di progetto dall’archivio dello studio"/></section><section className="awards"><span className="eyebrow">RICONOSCIMENTI SELEZIONATI</span>{[['2019','Premio Architettura Alto Adige','Piazza Silvius Magnago · Baza'],['2009','Premio Gubbio — segnalazione','Piazza Tribunale'],['2007','IV Premio Architettura Alto Adige','Piazza Tribunale'],['2000','Premio Architettura Città di Oderzo','Piazza Mazzini']].map(a=><div key={a[0]}><span>{a[0]}</span><h3>{a[1]}</h3><span>{a[2]}</span></div>)}</section><a className="studio-contact" href="#contact">Iniziamo un dialogo. <span>↗</span></a>{footer}</>}
  {page==='contact'&&<><div className="section-label"><h1>Contact</h1><span>02 / UN NUOVO INIZIO</span></div><section className="contact-layout"><div className="contact-visual"><img src="/images/piazza-tribunale-0.jpg" alt="Piazza Tribunale, Bolzano"/><span>46°29′ N &nbsp; 11°21′ E<br/>Bolzano, Alto Adige</span></div><div className="contact-info"><h2>Diamo spazio<br/>a un’idea.</h2><a className="email" href="mailto:stanislao.fierro@libero.it">stanislao.fierro@libero.it ↗</a><div className="contact-details"><div><span className="eyebrow">VIENI A TROVARCI</span><p>Via Montello 3<br/>39100 Bolzano, Italia</p><a href="https://www.google.com/maps/search/?api=1&query=Via+Montello+3+Bolzano" target="_blank" rel="noreferrer">Indicazioni ↗</a></div><div><span className="eyebrow">PARLIAMONE</span><p><a href="tel:+390471973896">+39 0471 973896</a></p><a href="mailto:stanislao.fierro@archiworldpec.it">Scrivi via PEC ↗</a></div></div><p className="business-details">Stanislao Fierro Architetto<br/>P. IVA 01639010212</p></div></section>{footer}</>}
  </main>}
  {project&&<div className={'project-sheet '+(closing?'is-closing':'')} role="dialog" aria-modal="true" aria-label={project.name} onAnimationEnd={event => {
   if (closing && event.target === event.currentTarget && event.animationName === 'sheetDown') finishClose();
  }} onKeyDown={e=>{if(e.key==='Escape')closeProject();if(e.key==='Tab'){const elements=e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');const first=elements[0],last=elements[elements.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}>
   <div className="marquee" aria-label={project.name}><div aria-hidden="true">{[0,1,2,3].map(i=><span key={i}>{project.name}<i> — </i></span>)}</div></div>
   <div className="sheet-toolbar"><span>{project.category} / {project.year}</span><div><button onClick={share}>{copied?'Link copiato ✓':'Condividi ↗'}</button><button ref={closeRef} className="close-project" onClick={closeProject} aria-label="Chiudi progetto">×</button></div></div>
   <article className="project-article"><div className="project-overview"><img src={cover(project)} alt={project.name}/><div className="project-facts"><h1>{project.name}</h1><p>{project.description}</p><dl><div><dt>Luogo</dt><dd>{project.place}</dd></div><div><dt>Anno</dt><dd>{project.year}</dd></div><div><dt>Ambito</dt><dd>{project.category}</dd></div>{project.competition&&<div><dt>Concorso</dt><dd>{project.competition}</dd></div>}{project.credit&&<div><dt>Fotografie</dt><dd>{project.credit}</dd></div>}</dl></div></div>
   <div className="editorial"><div className="editorial-note"><span className="eyebrow">IL PROGETTO, DA VICINO</span><p>Tra il primo segno<br/>e lo spazio costruito.</p><small>Clicca sulle immagini per esplorarle.</small></div>{images(project).slice(1,7).map((src,i)=><Fragment key={src}><figure className={`editorial-image image-${i} ${expanded===i?'expanded':''}`}><button onClick={()=>setExpanded(expanded===i?null:i)} aria-label={(expanded===i?'Riduci':'Espandi')+' immagine '+(i+1)} aria-expanded={expanded===i}><img loading="lazy" src={src} alt={`${project.name} — immagine d’archivio ${i+1}`}/><span>{expanded===i?'−':'+'}</span></button><figcaption><span>{String(i+1).padStart(2,'0')} / {project.name}</span><span>{project.credit && src.includes('baza-hq')?`© ${project.credit}`:'Archivio dello studio'}</span></figcaption></figure>{i===1&&<div className="editorial-note"><span className="eyebrow">SEGNI E RELAZIONI</span><p>La materia incontra<br/>il luogo.</p><small>{project.description}</small></div>}</Fragment>)}</div><button className="back-to-projects" onClick={closeProject}>← Torna ai progetti</button></article>
  </div>}
 </div>
}
