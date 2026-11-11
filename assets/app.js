// =========================================================================
//  NOOZBAR SCRIPTS — MOTEUR DU SITE
//  Charge contenu/site.json (généré par build.js à partir des fichiers
//  modifiables dans /admin) et construit le menu + les pages.
//  Même fonctionnement que chaton-script.com : portail (accueil + pages
//  générales) et un guide par script avec son propre menu.
// =========================================================================

// Mode d'adresse : "path" (site en ligne : /gta6/activity/) ou "hash"
// (aperçu hors ligne : #/gta6/activity/). Réglé via <html data-router="hash">.
const ROUTER = document.documentElement.dataset.router === 'hash' ? 'hash' : 'path';
// ---- Langue (FR par defaut, EN = adresses #/en/...) ----
let LANG = 'fr';
const I18N = {
  fr:{accueil:'Accueil', mesScripts:'Mes scripts', ouvrir:'Ouvrir le guide →', bientot:'Bientôt disponible', surPage:'Sur cette page',
      prec:'← Précédent', suiv:'Suivant →', haut:'Remonter en haut', rech:'Rechercher…  ( / )', rechAria:'Rechercher dans le site', rechBtn:'Rechercher',
      aucun:'Aucun résultat pour', menu:'Menu', menuAria:'Menu principal', sousMarque:'Scripts Premium|· Cronus ZEN ·', navHaut:'Présentation', navPatch:'Patch Note', enLigne:'en ligne', membres:'membres', guide:'Guide', langAria:'Langue',
      enCours:'🚧 Traduction en cours : cette page n’est pas encore traduite.', copier:'Copier le lien', copie:'Lien copié !', copierAide:'Copier le lien de cette page pour le partager (Discord…)'},
  en:{accueil:'Home', mesScripts:'My scripts', ouvrir:'Open the guide →', bientot:'Coming soon', surPage:'On this page',
      prec:'← Previous', suiv:'Next →', haut:'Back to top', rech:'Search…  ( / )', rechAria:'Search the site', rechBtn:'Search',
      aucun:'No results for', menu:'Menu', menuAria:'Main menu', sousMarque:'Premium Scripts|· Cronus ZEN ·', navHaut:'Overview', navPatch:'Patch Note', enLigne:'online', membres:'members', guide:'Guide', langAria:'Language',
      enCours:'🚧 Translation in progress: this page has not been translated yet.', copier:'Copy link', copie:'Link copied!', copierAide:'Copy the link to this page to share it (Discord…)'}
};
function T(k){ return (I18N[LANG] || I18N.fr)[k]; }
// ajoute le prefixe de langue a une route (/x/ -> /en/x/)
function lp(path){ return (LANG==='en' && typeof path==='string' && path.startsWith('/') && !/^\/en(\/|$)/.test(path)) ? '/en' + path : path; }
function langStocke(){ try{ return localStorage.getItem('lang'); }catch(e){ return null; } }
function langMemo(l){ try{ localStorage.setItem('lang', l); }catch(e){} }
// Chemin d'un fichier du site (images, contenu) selon le mode
function A(u){
  if(typeof u !== 'string') return u;
  if(ROUTER === 'hash' && u.startsWith('/')) return u.slice(1);
  return u;
}
// Lien vers une route du site
function H(path){ path = lp(path); return ROUTER === 'hash' ? '#' + path : path; }

// =========================================================
//  ICÔNES SVG (même jeu d'icônes que chaton-script.com)
// =========================================================
// =========================================================

// Icones SVG au trait, par nom (choisi dans l'editeur)
const ICONS = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  link:'<path d="M9 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M15 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  screen:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  profils:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>',
  menu:'<path d="M4 5h16M4 12h16M4 19h16"/>',
  cible:'<path d="M12 3v6M12 21v-3"/><circle cx="12" cy="14" r="4"/><path d="M5 7l2 2M19 7l-2 2"/>',
  arme:'<path d="M4 7h13l3 3-3 3H9l-2-2H4z"/><path d="M9 13v4a2 2 0 0 0 2 2"/>',
  viseur:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  engrenage:'<circle cx="12" cy="12" r="3"/><path d="M19.4 13a7 7 0 0 0 0-2l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.4 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5L3 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1L9.5 22h5l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5z"/>',
  sliders:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/>',
  manette:'<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M7 12h3M8.5 10.5v3"/><circle cx="16" cy="11" r="1"/><circle cx="18" cy="14" r="1"/>',
  clavier:'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>',
  disquette:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7M8 13h8v6H8z"/>',
  liste:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  aide:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4 2c0 1.5-2 1.8-2 3"/><path d="M12 17h.01"/>',
  etoile:'<path d="M12 2l2.6 6.6L21 9.2l-5 4.3 1.6 6.5L12 16.5 6.4 20l1.6-6.5-5-4.3 6.4-.6z"/>',
  souris:"<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"7\"/><path d=\"M12 2v8\"/>",
  dossier:"<path d=\"M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>",
  livre:"<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"/>",
  video:"<rect x=\"3\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\"/><path d=\"m18 10 4-3v10l-4-3\"/>",
  telecharger:"<path d=\"M12 3v12m-5-5 5 5 5-5M5 18v3h14v-3\"/>",
  televerser:"<path d=\"M12 16V4m-5 5 5-5 5 5M5 18v3h14v-3\"/>",
  cadenas:"<rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3M12 15v3\"/>",
  bouclier:"<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/>",
  valide:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8 12 3 3 5-6\"/>",
  info:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5M12 8h.01\"/>",
  attention:"<path d=\"m12 3 10 18H2z\"/><path d=\"M12 9v5M12 17h.01\"/>",
  oeil:"<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  horloge:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
  graphique:"<path d=\"M3 21V3M3 21h18M7 16l4-5 4 3 5-8\"/>",
  cloche:"<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9zM10 21h4\"/>",
  drapeau:"<path d=\"M5 22V4m0 0c6-4 9 4 15 0v11c-6 4-9-4-15 0\"/>",
  boussole:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m16 8-2 6-6 2 2-6z\"/>",
  flamme:"<path d=\"M12 22c5 0 8-3 8-8 0-3-2-7-5-10-.3 3-1 5-3 6-1-2-2-4-2-7-4 3-6 7-6 11 0 5 3 8 8 8z\"/><path d=\"M12 22a4 4 0 0 0 4-4c0-2-1-3-3-5 0 2-1 3-2 4-1-1-2-2-2-3-1 2-1 3-1 4a4 4 0 0 0 4 4z\"/>",
  eclair:"<path d=\"M13 2 4 13h7l-1 9 10-12h-7z\"/>",
  coeur:"<path d=\"M20.8 5.5a5.5 5.5 0 0 0-7.8 0L12 6.6l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.7a5.5 5.5 0 0 0 0-7.8z\"/>",
  fusee:"<path d=\"M5 17c-2-3-2-6-1-7l4 1C11 5 16 2 22 2c0 6-3 11-9 14l1 4c-1 1-4 1-7-1z\"/><circle cx=\"16\" cy=\"8\" r=\"2\"/><path d=\"M5 17c-1 2-2 4-3 5 2-1 4-2 5-4\"/>",
  trophee:"<path d=\"M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4M12 14v5M8 21h8M9 19h6\"/>",
  crane:"<path d=\"M5 16a8 8 0 1 1 14 0v4H5z\"/><circle cx=\"9\" cy=\"12\" r=\"1.5\"/><circle cx=\"15\" cy=\"12\" r=\"1.5\"/><path d=\"M12 15v2M9 20v2M15 20v2\"/>",
  soleil:"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/>",
  lune:"<path d=\"M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z\"/>",
  wifi:"<path d=\"M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 20h.01\"/>",
  bluetooth:"<path d=\"m7 7 10 10-5 4V3l5 4L7 17\"/>",
  volume:"<path d=\"M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12\"/>",
  micro:"<rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\"/><path d=\"M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8\"/>",
  casque:"<path d=\"M3 14v-3a9 9 0 0 1 18 0v3M3 14h5v7H6a3 3 0 0 1-3-3zM21 14h-5v7h2a3 3 0 0 0 3-3z\"/>",
  telephone:"<rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\"/><path d=\"M11 18h2\"/>",
  ordinateur:"<rect x=\"2\" y=\"3\" width=\"20\" height=\"15\" rx=\"2\"/><path d=\"M8 22h8M12 18v4\"/>",
  code:"<path d=\"m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18\"/>",
  terminal:"<rect x=\"2\" y=\"3\" width=\"20\" height=\"18\" rx=\"2\"/><path d=\"m6 8 4 4-4 4M12 16h6\"/>",
  actualiser:"<path d=\"M20 7v5h-5M4 17v-5h5\"/><path d=\"M5.5 9A8 8 0 0 1 19 7l1 5M4 12l1 5a8 8 0 0 0 13.5-2\"/>",
  globe:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18\"/>",
  calendrier:"<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 2v6M17 2v6M3 10h18\"/>",
  carte:"<path d=\"m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16\"/>",
  marteau:"<path d=\"m14 4 6 6-3 3-6-6zM12 9 4 21l-2-2L10 7M16 2l6 6\"/>",
  couronne:"<path d=\"M11.56 3.27a.5.5 0 0 1 .88 0l2.95 5.6a1 1 0 0 0 1.52.3l4.27-3.67a.5.5 0 0 1 .8.52l-2.83 10.25a1 1 0 0 1-.96.73H5.81a1 1 0 0 1-.96-.73L2.02 6.02a.5.5 0 0 1 .8-.52l4.27 3.67a1 1 0 0 0 1.52-.3z\"/><path d=\"M5 21h14\"/>",
  outil:"<path d=\"M20 7a6 6 0 0 1-8 6L5 20a2 2 0 0 1-3-3l7-7a6 6 0 0 1 8-8l-4 4 4 4z\"/>",
  signal:"<path d=\"M3 21V16M8 21v-9M13 21V8M18 21V3\"/>",
  camera:"<rect x=\"2\" y=\"6\" width=\"20\" height=\"15\" rx=\"2\"/><circle cx=\"12\" cy=\"13.5\" r=\"4\"/><path d=\"M7 6l2-3h6l2 3\"/>",
  cadeau:"<rect x=\"3\" y=\"10\" width=\"18\" height=\"11\" rx=\"1\"/><path d=\"M2 7h20v4H2zM12 7v14M12 7H9a3 3 0 1 1 3-3zM12 7h3a3 3 0 1 0-3-3z\"/>",
  ampoule:"<path d=\"M9 18h6M9 22h6M8 14a7 7 0 1 1 8 0c-.7.7-1 2-1 4H9c0-2-.3-3.3-1-4z\"/>",
  pause:"<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/>",
  lecture:"<path d=\"m7 4 14 8-14 8z\"/>",
  chrono:"<circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M9 2h6M12 5v8l4 2M18 6l2-2\"/>",
  cibleplus:"<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 8v8M8 12h8\"/>",
  palmier:"<path d=\"M12 22c.4-4 .3-7.5 0-11\"/><path d=\"M12 11C10.5 6.5 6.5 5 3.5 6.5\"/><path d=\"M12 11C9.5 9.5 6 10 4.5 13\"/><path d=\"M12 11C13.5 6.5 17.5 5 20.5 6.5\"/><path d=\"M12 11C14.5 9.5 18 10 19.5 13\"/><path d=\"M12 11C11 7.5 11.5 5 13 3\"/><path d=\"M8 22h8\"/>",
  cowboy:"<path d=\"M6.5 12.5C6.5 8 8.5 5 12 5s5.5 3 5.5 7.5\"/><path d=\"M9 6.8c1.2 1 4.8 1 6 0\"/><path d=\"M6.7 11.2h10.6\"/><path d=\"M3 14.5c0-1.2 1.5-2 3.5-1.8 3 .8 8 .8 11 0 2-.2 3.5.6 3.5 1.8 0 1.6-4.5 3.5-9 3.5s-9-1.9-9-3.5z\"/>",
  reglages:"<path d=\"M3 6h18M3 12h18M3 18h18\"/><circle cx=\"7\" cy=\"6\" r=\"2\" fill=\"var(--bg,#0a0506)\"/><circle cx=\"16\" cy=\"12\" r=\"2\" fill=\"var(--bg,#0a0506)\"/><circle cx=\"9\" cy=\"18\" r=\"2\" fill=\"var(--bg,#0a0506)\"/>",
};
function svgIcon(name){
  const choice = String(name || 'menu').trim();
  const emoji = choice.startsWith('emoji:') ? choice.slice(6) : (!/^[a-z0-9_-]+$/i.test(choice) ? choice : '');
  // Les emoji choisis dans l'Admin ou colles dans le champ personnalise
  // gardent leur vraie apparence : aucun pictogramme SVG par defaut.
  if(emoji) return '<span class="ic icon-emoji" aria-hidden="true">'+esc(emoji.slice(0,18))+'</span>';
  const p = ICONS[choice] || ICONS.menu;
  return '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg></span>';
}

function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// --- Outils couleur : gere #rgb, #rrggbb, #rrggbbaa et rgb()/rgba() ---
function parseColor(v){
  if(!v) return null;
  v = String(v).trim();
  let m = v.match(/^rgba?\(([^)]+)\)/i);
  if(m){ const p=m[1].split(',').map(s=>parseFloat(s.trim())); return {r:p[0]||0,g:p[1]||0,b:p[2]||0,a:p.length>3?p[3]:1}; }
  let h = v[0]==='#' ? v.slice(1) : v;
  if(/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map(c=>c+c).join('');
  if(/^[0-9a-fA-F]{6}$/.test(h)) return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:1};
  if(/^[0-9a-fA-F]{8}$/.test(h)) return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:parseInt(h.slice(6,8),16)/255};
  return null;
}
// Renvoie une couleur CSS utilisable telle quelle (ou null si invalide)
function cssColor(v){
  if(!parseColor(v)) return null;
  v = String(v).trim();
  if(v[0]==='#' || /^rgb/i.test(v)) return v;
  return '#'+v;
}
// Construit un fond rgba a partir d'une couleur + opacite (0-100) optionnelle
function fondRgba(couleur, opacite){
  const c = parseColor(couleur);
  if(!c) return null;
  let a = c.a;
  if(opacite!==undefined && opacite!==null && opacite!=='') a = Math.max(0,Math.min(100,parseFloat(opacite)))/100;
  return `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`;
}
// Resout la couleur d'un bloc : couleur libre (pipette) prioritaire, sinon couleur nommee
function couleurCSS(b){
  const c = cssColor(b.couleurHex);
  if(c) return {hex:c, named:null};
  if(b.couleur && b.couleur!=='none') return {hex:null, named:b.couleur};
  return {hex:null, named:null};
}
// Construit le media optionnel d'un bloc (image ou video), insere dans n'importe quel bloc
function mediaInner(b){
  // image inseree
  if(b.media==='image' && b.mediaImage){
    return `<div class="bloc-media ${b.mediaAlign||'center'} ${b.mediaTaille||'m'}"><img src="${esc(A(b.mediaImage))}" alt="${esc(b.titre||'image')}" loading="lazy"></div>`;
  }
  // video inseree (youtube ou fichier)
  if(b.media==='video' && (b.mediaVideo||b.mediaVideoFichier)){
    let inner='';
    if(b.mediaVideoType==='youtube' && b.mediaVideo){
      inner = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.mediaVideo)}" loading="lazy" allow="accelerometer;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    } else if(b.mediaVideoFichier){
      inner = `<video src="${esc(A(b.mediaVideoFichier))}" controls playsinline preload="metadata"></video>`;
    }
    if(inner) return `<div class="bloc-media ${b.mediaAlign||'center'} ${b.mediaTaille||'m'} is-video">${inner}</div>`;
  }
  return '';
}

// =========================================================================
//  MISE EN FORME DU TEXTE
//  **gras**  *italique*  {L2} (touche)  [texte](lien)  (#ff0000:couleur)
//  (glow50:lueur)  — liens possibles : https://..., page:identifiant, /chemin/
// =========================================================================
function lienInterne(dest){
  // Renvoie {href, nav, ext} pour une destination
  dest = String(dest || '').trim();
  if(!dest) return {href:'#', nav:null, ext:false};
  if(/^(https?:|mailto:)/i.test(dest)) return {href:dest, nav:null, ext:true};
  if(dest.startsWith('#/')) dest = dest.slice(1);
  if(dest.startsWith('/')) return {href:H(dest), nav:dest, ext:false};
  const [id, ancre] = dest.replace(/^page:/, '').split('#');
  return {href:H(routeVers(id)), nav:routeVers(id), ext:false, ancre:ancre||''};
}
// Trouve l'adresse d'une page à partir de son identifiant :
// d'abord dans le guide en cours, puis dans le portail, puis dans les autres scripts.
function routeVers(id){
  if(!DATA) return '/';
  const s = getScript();
  if(s && (s.onglets||[]).some(o=>o.id===id)) return routeOnglet(s.id, id);
  if((DATA.portail.onglets||[]).some(o=>o.id===id)) return routeOnglet(null, id);
  for(const sc of DATA.scripts){ if((sc.onglets||[]).some(o=>o.id===id)) return routeOnglet(sc.id, id); }
  if(DATA.scripts.some(sc=>sc.id===id)) return '/' + encodeURIComponent(id) + '/';
  return '/';
}
function routeOnglet(scriptId, id){
  if(scriptId) return '/' + encodeURIComponent(scriptId) + '/' + (id && id!=='accueil' ? encodeURIComponent(id) + '/' : '');
  return id && id!=='accueil' ? '/' + encodeURIComponent(id) + '/' : '/';
}
function attrsLien(dest){
  const l = lienInterne(dest);
  return l.ext ? `href="${esc(l.href)}" target="_blank" rel="noopener"` : `href="${esc(l.href)}" data-nav="${esc(l.nav)}"${l.ancre?` data-cible="${esc(l.ancre)}"`:''}`;
}

// ---- Touches de manette : encadres (PlayStation en bleu, Xbox en vert, "/" en blanc) ----
const KEY_PS=new Set(['CROSS','CIRCLE','SQUARE','TRIANGLE','L1','L2','L3','R1','R2','R3','OPTIONS','SHARE','PS','TOUCHPAD']);
const KEY_XB=new Set(['A','B','X','Y','LB','RB','LT','RT','LS','RS','MENUS','VIEW','XBOX']);
const KEY_DIR={HAUT:'⬆️',UP:'⬆️',BAS:'⬇️',DOWN:'⬇️',GAUCHE:'⬅️',LEFT:'⬅️',DROITE:'➡️',RIGHT:'➡️'};
const KEY_SL='<span class="k-sl"> / </span>';
function keyHTML(s){
  const t=String(s).trim();
  if(/^send to slot$/i.test(t)) return '<span class="zsl-btn zsl-send"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 20.5v-6l8-2.5-8-2.5v-6L22 12z"/></svg>Send to Slot</span>';
  if(/^program$/i.test(t)) return '<span class="zsl-btn zsl-prog"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 2 5 13.5h6L9.5 22 19 9.5h-6.2z"/></svg>Program</span>';
  const m=t.match(/^D-?Pad(?:\s+(HAUT|BAS|GAUCHE|DROITE|UP|DOWN|LEFT|RIGHT))?$/i);
  if(m) return '<span class="key key-dpad">D-Pad'+(m[1]?' '+KEY_DIR[m[1].toUpperCase()]:'')+'</span>';
  const parts=t.split('/').map(x=>x.trim());
  if(parts.length===1 && KEY_DIR[t.toUpperCase()]) return '<span class="key key-dpad">D-Pad '+KEY_DIR[t.toUpperCase()]+'</span>';
  if(parts.every(p=>KEY_DIR[p.toUpperCase()])) return '<span class="key key-dpad">'+parts.map(p=>KEY_DIR[p.toUpperCase()]).join(KEY_SL)+'</span>';
  return '<span class="key">'+parts.map(p=>KEY_PS.has(p)?'<span class="k-ps">'+p+'</span>':KEY_XB.has(p)?'<span class="k-xb">'+p+'</span>':p).join(KEY_SL)+'</span>';
}
// mots de touches ecrits sans accolades : remplaces automatiquement par l'encadre
const KEY_RAW=new RegExp('(?<![\\w{/-])(?:(?:L1|L2|L3|R1|R2|R3|CROSS|CIRCLE|SQUARE|TRIANGLE)(?:\\s*/\\s*(?:A|B|X|Y|LB|RB|LT|RT|LS|RS)(?!\\w))?|LB|RB|LT|RT|[LR][XY](?:\\s*/\\s*[LR][XY])?|D-?Pad(?:\\s+(?:HAUT|BAS|GAUCHE|DROITE|UP|DOWN|LEFT|RIGHT|Up|Down|Left|Right))?)(?![\\w}-])','g');
function toucheMots(out){
  return out.split(/(\{[^}]*\})/).map((seg,i)=>i%2?seg:seg.replace(KEY_RAW,m=>'{'+m+'}')).join('');
}
function touches(s, opt){
  let out = esc(s);
  out = out.replace(/ ([?!:;»])/g,'\u00a0$1').replace(/« /g,'«\u00a0');
  if(!(opt && opt.sansMots)) out = toucheMots(out);
  // chiffres emoji (1️⃣, 2️⃣...) -> meme pastille que les listes numerotees, partout sur le site
  out = out.replace(/(\d)\uFE0F?\u20E3/g, '<span class="num-badge">$1</span>');

  // 1) liens [texte](destination)
  out = out.replace(/\[((?:[^\[\]]|\[[^\]]*\])+)\]\(((?:https?:\/\/|mailto:|page:|\/)[^\s)]*)\)/g,
    (m, txt, dest) => `<a ${attrsLien(dest.replace(/&amp;/g,'&'))}>${txt}</a>`);

  // 2) gras puis italique
  out = out.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');

  // 3) couleur (#ff0000:texte) et lueur (glow50:texte)
  let prev, guard = 0;
  do {
    prev = out;
    out = out.replace(/\((#[0-9a-fA-F]{3,8}):([^()]*)\)/g, (m, code, txt) =>
      '<span style="color:'+code+';--glow-color:'+code+'">'+txt+'</span>');
    out = out.replace(/\(glow(\d{1,3}):([^()]*)\)/gi, (m, n, txt) => {
      const lvl = Math.max(1, Math.min(100, parseInt(n,10)||1));
      const gc = 'var(--glow-color,currentColor)';
      const b1 = Math.round(lvl<=20 ? lvl : 20 + 28*(lvl-20)/80);
      const b2 = b1*2;
      return '<span style="text-shadow:0 0 '+b1+'px '+gc+', 0 0 '+b2+'px '+gc+'">'+txt+'</span>';
    });
    guard++;
  } while(out !== prev && guard < 8);

  // 4) touches {L2} -> badge
  out = out.replace(/\{([^}]+)\}/g, (m,x)=>keyHTML(x));

  // 5) URL brutes restantes
  out = out.replace(/(^|[^"=>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  // 6) "console / plateforme", "RDR2 / RD Online"... : les mots separes par un "/" restent ensemble
  out = out.split(/(<[^>]*>)/).map(p=> p.charAt(0)==='<' || /https?:/.test(p) ? p
    : p.replace(/(\S) \/ (?=\S)/g, '$1\u00a0/\u00a0').replace(/([\wÀ-ÿ])\/(?=[\wÀ-ÿ])/g, '$1\u2060/\u2060').replace(/\([^()]{1,30}\)/g, m=>'<span class="nw">'+m+'</span>')).join('');
  return out;
}
function texteBrut(s){
  return String(s||'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*{}]/g,'').replace(/\((?:#[0-9a-fA-F]{3,8}|glow\d+):([^()]*)\)/g,'$1').trim();
}

// =========================================================================
//  RENDU DES BLOCS
// =========================================================================
function renderBloc(b, ctx){
  if(b && b.langue && b.langue!==LANG) return '';
  const c = couleurCSS(b);
  const col = c.named ? 'col-'+c.named : '';
  const fond = fondRgba(b.fondCouleur, b.fondOpacite);
  const styleCol = c.hex ? `color:${c.hex};` : '';
  const media = mediaInner(b);
  let html = '';
  switch(b.type){
    case 'texte':{
      const fondStyle = fond ? `background:${fond};padding:12px 16px;border-radius:10px;` : '';
      const st = (styleCol||fondStyle) ? ` style="${styleCol}${fondStyle}"` : '';
      const id = ctx.ancres.get(b) ? ` id="${ctx.ancres.get(b)}"` : '';
      html = `<div class="b-text ${b.style||'p'} ${col} ${b.align||'left'}${b.gros?' gros':''}"${id}${st}>${touches(b.contenu)}${media}</div>`;
      break;
    }
    case 'carte':{
      let cardStyle = '';
      if(c.hex) cardStyle += `border-left:3px solid ${c.hex};`;
      if(fond) cardStyle += `background:${fond};`;
      const bdStyle = cardStyle ? ` style="${cardStyle}"` : '';
      const bdClass = c.named ? 'bd-'+c.named : (c.hex ? '' : 'bd-accent');
      const imageSeule = !!b.image && !String(b.titre||'').trim() && !String(b.contenu||'').trim() && !media;
      if(imageSeule){
        const op = b.imageOpacite!=null ? Math.max(0,Math.min(1,Number(b.imageOpacite))) : 1;
        let img = `<img class="card-image-full" src="${esc(A(b.image))}" alt="${esc(b.alt||'Illustration')}" loading="lazy" style="opacity:${Number.isFinite(op)?op:1}">`;
        const lm = b.largeurMax ? ` style="max-width:${parseInt(b.largeurMax,10)}px"` : '';
        if(b.lien) img = `<a ${attrsLien(b.lien)}>${img}</a>`;
        html = `<div class="b-card b-card-image"${lm}>${img}</div>`;
      } else {
        const bg = b.image ? `<div class="card-bg" style="background-image:url('${esc(A(b.image))}');opacity:${b.imageOpacite!=null?b.imageOpacite:0.25}"></div>` : '';
        html = `<div class="b-card ${bdClass}"${bdStyle}>${bg}<div class="card-inner">${b.titre?`<h4>${touches(b.titre)}</h4>`:''}${b.contenu?`<div>${touches(b.contenu)}${media}</div>`:''}${(b.blocs||[]).map(x=>renderBloc(x,ctx)).join('')}</div></div>`;
      }
      break;
    }
    case 'images':{
      // plusieurs images cote a cote (une seule colonne sur petit ecran)
      html = `<div class="img-row">${(b.images||[]).map(im=>`<div class="b-card b-card-image"><img class="card-image-full" src="${esc(A(im.image))}" alt="${esc(im.alt||'Illustration')}" loading="lazy"></div>`).join('')}</div>`;
      break;
    }
    case 'video':
      html = `<div class="b-video ${b.taille||'m'} ${b.align||'center'}">${videoInner(b)}</div>`;
      break;
    case 'aide':{
      const n = ++ctx.aide;
      html = `<div class="b-fix"><div class="fh"><div class="fn">${n}</div><div class="ft">${touches(b.titre)}</div></div>
        ${videoInner(b)?`<div class="b-video full">${videoInner(b)}</div>`:''}
        <div class="fsol"><span class="lb">Solution</span>${touches(b.solution)}${media}</div></div>`;
      break;
    }
    case 'touches':{
      const ks = (b.contenu||'').split('|').map(k=>keyHTML(esc(k.trim()))).join(' ');
      html = `<div class="b-keys">${ks}${media}</div>`;
      break;
    }
    case 'etiquettes':{
      // Pastilles : si b.mods est renseigne, chaque pastille ouvre/ferme la description du MOD (source unique DATA.mods)
      const ids = Array.isArray(b.mods) ? b.mods : [];
      const tags = (b.contenu||'').split('|').map(t=>t.trim()).filter(Boolean).map((t,i)=>{
        const id = ids[i];
        return id ? `<button type="button" class="tag tag-mod" data-mod="${esc(id)}">${touches(t)}</button>` : `<span class="tag">${touches(t)}</span>`;
      }).join('');
      html = `<div class="b-tags">${tags}</div>${ids.length ? '<div class="mod-panel" hidden></div>' : ''}${media}`;
      break;
    }
    case 'liste':{
      // Une ligne = un élément. "- texte" = sous-élément. "> texte" = suite de l'élément précédent.
      const items = [];
      const _lg=(b.contenu||'').split('\n').filter(l=>l.trim());
      const tousTirets = _lg.length>0 && _lg.every(l=>/^\s*-\s+/.test(l)); // liste ou chaque ligne commence par "- " : chaque ligne est un point de meme niveau
      (b.contenu||'').split('\n').forEach(l=>{
        if(!l.trim()) return;
        const last = items[items.length-1];
        if(!tousTirets && /^\s*-\s+/.test(l) && last) last.subs.push(l.replace(/^\s*-\s+/,''));
        else if(/^\s*>\s?/.test(l) && last) last.suite.push(l.replace(/^\s*>\s?/,''));
        else items.push({t:l.replace(/^\s*-\s+/,''), subs:[], suite:[]});
      });
      const li = items.map(it=>`<li>${touches(it.t)}${it.suite.map(x=>'<br>'+touches(x)).join('')}${
        it.subs.length?`<ul class="sub">${it.subs.map(x=>`<li>${touches(x)}</li>`).join('')}</ul>`:''}</li>`).join('');
      const vars = [];
      if(c.hex) vars.push(`--puce:${c.hex}`); else if(c.named) vars.push(`--puce:var(--${c.named})`);
      const debut = parseInt(b.debut,10) || 1;
      if(b.numerote) vars.push(`--debut:${debut-1}`);
      const st = vars.length ? ` style="${vars.join(';')}"` : '';
      html = b.numerote ? `<ol class="b-list" start="${debut}"${st}>${li}</ol>${media}` : `<ul class="b-list"${st}>${li}</ul>${media}`;
      break;
    }
    case 'cartesscripts':{
      // Encadres des scripts + documentation + Discord, a l'endroit voulu de la page d'accueil
      html = cartesScriptsHTML(b.partie);
      break;
    }
    case 'depliant':{
      // Bloc depliant : titre cliquable qui ouvre/ferme un contenu (soit une description commune DATA.mods, soit des blocs propres)
      let corps = '';
      if(b.mod){ const m=(DATA.mods||[]).find(x=>x.id===b.mod); if(m) corps = m.blocs.map(x=>renderBloc(x,ctx)).join(''); }
      else corps = (b.blocs||[]).map(x=>renderBloc(x,ctx)).join('');
      const col = b.couleurHex && cssColor(b.couleurHex) ? ` style="--dp:${cssColor(b.couleurHex)}"` : '';
      const sub = b.soustitre ? `<small class="dp-sub">${touches(b.soustitre)}</small>` : '';
      html = `<details class="mod-acc depliant"${col}${b.ancre?` id="${esc(b.ancre)}"`:''}><summary><span class="dp-txt"><span class="dp-titre">${touches(b.titre||'')}</span>${sub}</span></summary><div class="mod-body">${corps}</div></details>`;
      break;
    }
    case 'cartegroupe':{
      const ms=(b.ids||[]).map(id=>(DATA.mods||[]).find(x=>x.id===id)).filter(Boolean);
      const faux={id:b.id||'groupe', titre:b.titre||'', blocs:[], fiche:{colonnes:[{titre:b.colonne||'', liens:[]}]}};
      ms.forEach(m=>{ const de=faux.blocs.length; faux.blocs.push(...m.blocs); faux.fiche.colonnes[0].liens.push({titre:m.titre, de, a:faux.blocs.length-1}); });
      html = ficheHTML(faux, ctx);
      break;
    }
    case 'duo':{
      html = '<div class="duo">' + (b.cartes||[]).map(c=>`<div class="duo-carte duo-${esc(c.couleur||'vert')}"><div class="duo-titre">${touches(c.titre||'')}</div>${(c.blocs||[]).map(x=>renderBloc(x,ctx)).join('')}</div>`).join('') + '</div>';
      break;
    }
    case 'tuiles':{
      const secs=[]; const t=(b.tuiles||[]).map((u,i)=>{ secs.push(`<div class="mf-sec" data-sec="${i}" hidden>${(u.blocs||[]).map(x=>renderBloc(x,ctx)).join('')}</div>`);
        return `<button type="button" class="mf-chip tl-tuile" data-sec="${i}" aria-expanded="false"><span class="tl-ic" aria-hidden="true">${esc(u.icone||'')}</span><span class="tl-titre">${touches(u.titre||'')}</span><span class="tl-txt">${touches(u.contenu||'')}</span><span class="tl-plus" aria-hidden="true"></span></button>`; }).join('');
      html = `<section class="mod-fiche tuiles" id="tuiles-${esc(b.id||'x')}"><div class="tl-grille">${t}</div><div class="mf-panel">${secs.join('')}</div></section>`;
      break;
    }
    case 'encadre':{
      html = '<div class="b-encadre">' + (b.blocs||[]).map(x=>renderBloc(x,ctx)).join('') + '</div>';
      break;
    }
    case 'groupe':{
      // Plusieurs blocs (ex. depliants) reunis dans un seul encadre
      html = '<div class="dep-groupe">' + (b.blocs||[]).map(x=>renderBloc(x,ctx)).join('') + '</div>';
      break;
    }
    case 'modbody':{
      // Affiche directement (sans accordeon) le contenu d'une description commune
      const m=(DATA.mods||[]).find(x=>x.id===b.mod);
      if(m && m.fiche && b.carte!==false) return ficheHTML(m,ctx,null,{sansTitre:!!b.sansTitre});
      return m ? m.blocs.map(x=>renderBloc(x,ctx)).join('') : '';
    }
    case 'mods':{
      // Accordeon : chaque MOD est decrit une seule fois dans DATA.mods
      const liste=(b.ids||[]).map(id=>(DATA.mods||[]).find(m=>m.id===id)).filter(m=>m&&(!m.scripts||!activeScript||m.scripts.includes(activeScript)));
      const somm = b.sommaire && liste.length>1 ? `<nav class="sommaire mods-somm" aria-label="${T('surPage')}"><span class="lb">${T('surPage')}</span>${liste.map(m=>`<button type="button" data-aller="mod-${esc(m.id)}">${touches(m.titre,{sansMots:true})}</button>`).join('')}</nav>` : '';
      html=somm+liste.map(m=>m.fiche ? ficheHTML(m,ctx) : `<details class="mod-acc" id="mod-${m.id}"><summary>${touches(m.titre, m.titreBrut?{sansMots:true}:null)}</summary><div class="mod-body">${m.blocs.map(x=>renderBloc(x,ctx)).join('')}</div></details>`).join('');
      break;
    }
    case 'cartelien':{
      const ico = b.icone ? svgIcon(b.iconePersonnalisee || b.icone) : '';
      const large = (b.affichage==='pleine') ? ' cl-pleine' : '';
      let clStyle = c.hex ? `--cl-accent:${c.hex};` : '';
      if(fond) clStyle += `background:${fond};`;
      const bdStyle = clStyle ? ` style="${clStyle}"` : '';
      const bdClass = c.named ? 'bd-'+c.named : (c.hex ? 'bd-perso' : 'bd-accent');
      const thumb = b.image ? `<div class="cl-thumb${/\/bibliotheque\//.test(b.image)?' cl-carre':''}"><img src="${esc(A(b.image))}" alt="" loading="lazy"></div>` : '';
      html = `<a class="b-cartelien ${bdClass}${large}"${bdStyle} ${attrsLien(b.destination)}>${thumb}
        <div class="cl-head">${ico}<span class="cl-titre">${touches(b.titre||'')}</span></div>
        ${b.contenu?`<div class="cl-desc">${touches(b.contenu)}</div>`:''}</a>`;
      if(b.affichage!=='pleine') return html; // regroupé en grille par renderMain
      break;
    }
    case 'formules':{
      // Cartes de tarifs (Acces libre / VIP). Lignes "inclus" cochees, lignes "exclus" grisees.
      const lignes = (t, cls) => String(t||'').split('\n').map(x=>x.trim()).filter(Boolean)
        .map(x=>`<li class="${cls}"><span class="fm-puce" aria-hidden="true"></span><span>${touches(x)}</span></li>`).join('');
      html = '<div class="formules">' + (b.cartes||[]).map(f=>{
        const vip = !!f.vedette;
        return `<div class="fm-carte${vip?' fm-vip':''}">
          <div class="fm-haut"><span class="fm-etiq">${touches(f.etiquette||'')}</span>${f.badge?`<span class="fm-badge">${touches(f.badge)}</span>`:''}</div>
          <div class="fm-prix"><span class="fm-montant">${touches(f.prix||'')}</span>${f.periode?`<span class="fm-per">${touches(f.periode)}</span>`:''}</div>
          ${f.sousPrix?`<div class="fm-sous">${touches(f.sousPrix)}</div>`:''}
          <ul class="fm-liste">${lignes(f.inclus,'fm-ok')}${lignes(f.exclus,'fm-non')}</ul>
          ${f.bouton?(f.lien?`<a class="fm-btn" ${attrsLien(f.lien)}>${touches(f.bouton)}</a>`:`<span class="fm-btn fm-off" aria-disabled="true">${touches(f.bouton)}</span>`):''}
          ${f.note?`<div class="fm-note">${touches(f.note)}</div>`:''}
        </div>`;
      }).join('') + '</div>';
      break;
    }
    case 'etapes':{
      if(Array.isArray(b.etapes)){
        const lb = b.etiquette || 'Étape';
        const d0 = (parseInt(b.depart,10)||1)-1;
        html = '<ol class="etapes et-photos">' + b.etapes.map((e,n)=>{ n+=d0;
          const imgs=(e.images||[]).map(s=>`<img src="${esc(A(s))}" alt="" loading="lazy">`).join('');
          return `<li class="et-carte"><div class="et-num">${touches(lb)} ${n+1}</div>${(e.icone||e.titre)?`<div class="et-tete">${e.icone?`<span class="et-ic" aria-hidden="true">${esc(e.icone)}</span>`:''}<span class="et-titre">${touches(e.titre||'')}</span></div>`:''}${(e.contenu||e.blocs)?`<div class="et-txt">${e.contenu?renderBloc({type:'texte',style:'p',contenu:e.contenu},ctx):''}${(e.blocs||[]).map(x=>renderBloc(x,ctx)).join('')}</div>`:''}${imgs?`<div class="et-img${(e.images||[]).length>1?' et-img2':''}">${imgs}</div>`:''}</li>`;
        }).join('') + '</ol>';
        break;
      }
      // Etapes numerotees en cartes : une ligne = "emoji | titre | texte"
      const lb = b.etiquette || 'Étape';
      html = '<ol class="etapes">' + String(b.contenu||'').split('\n').filter(x=>x.trim()).map((l,n)=>{
        const [ic,ti,tx] = l.split('|').map(x=>(x||'').trim());
        return `<li class="et-carte"><div class="et-num">${touches(lb)} ${n+1}</div><div class="et-ic" aria-hidden="true">${esc(ic)}</div><div class="et-titre">${touches(ti)}</div>${tx?`<div class="et-txt">${touches(tx)}</div>`:''}</li>`;
      }).join('') + '</ol>';
      break;
    }
    case 'partenaire':{
      html = `<a class="pt-band" ${attrsLien(b.lien||'#')}>
        ${b.image?`<img class="pt-ava" src="${esc(A(b.image))}" alt="" loading="lazy">`:''}
        <div class="pt-txt">${b.etiquette?`<div class="pt-etiq">${touches(b.etiquette)}</div>`:''}<div class="pt-titre">${touches(b.titre||'')}</div>${b.contenu?`<div class="pt-desc">${touches(b.contenu)}</div>`:''}</div>
        ${b.bouton?`<span class="pt-btn">${touches(b.bouton)}</span>`:''}
      </a>`;
      break;
    }
    case 'discord':{
      // Bandeau Discord : nombre de membres en ligne / total mis a jour en direct (API d'invitation Discord)
      const code = String(b.invite||'').replace(/[^\w-]/g,'');
      const logo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.6 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1 0-.13l.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01l.37.29a.08.08 0 0 1 0 .13c-.6.35-1.22.64-1.88.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.23 1.99a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42z"/></svg>';
      html = `<a class="dc-band" data-invite="${esc(code)}" ${attrsLien(b.lien||('https://discord.gg/'+code))}>
        <div class="dc-ava">${b.image?`<img src="${esc(A(b.image))}" alt="" loading="lazy">`:''}<span class="dc-logo">${logo}</span></div>
        <div class="dc-txt">
          ${b.etiquette?`<div class="dc-etiq">${touches(b.etiquette)}</div>`:''}
          <div class="dc-titre">${touches(b.titre||'')}</div>
          ${b.contenu?`<div class="dc-desc">${touches(b.contenu)}</div>`:''}
          <div class="dc-stats"><span class="dc-on" hidden><i class="dc-dot on"></i><b class="n"></b> ${T('enLigne')}</span><span class="dc-mb"><i class="dc-dot"></i><b class="n">${esc(b.membresSecours||'')}</b> ${T('membres')}</span></div>
        </div>
        ${b.bouton?`<span class="dc-btn">${touches(b.bouton)}</span>`:''}
      </a>`;
      break;
    }
    default: return '';
  }
  return `<div class="bloc-wrap esp-${b.espace||'normal'}">${html}</div>`;
}
function videoInner(b){
  if(b.videoType==='youtube' && b.video) return `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.video)}" title="${esc(b.titre||'video')}" loading="lazy" allow="accelerometer;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
  if(b.videoType==='fichier' && b.video) return `<video class="clip" loop muted playsinline preload="metadata" controls src="${esc(A(b.video))}"></video>`;
  return '';
}

// =========================================================================
//  ÉTAT ET NAVIGATION
// =========================================================================
let DATA = null;
let activeScript = null;   // id du script en cours (null = portail)
let activeId = null;       // id de la page en cours
const navOuverts = new Set();   // rubriques du menu ouvertes a la main pendant la visite
let SEARCH_IDX = null;      // index de recherche (construit au premier usage)

function openMenu(){ document.body.classList.add('menu-open'); }
function closeMenu(){ document.body.classList.remove('menu-open'); }
function toggleMenu(){ document.body.classList.toggle('menu-open'); }
function getScript(){ return DATA && activeScript ? (DATA.scripts.find(s=>s.id===activeScript) || null) : null; }
function ongletsCourants(){
  const s = getScript();
  if(s) return s.onglets || [];
  return (DATA.portail && DATA.portail.onglets) ? DATA.portail.onglets : [];
}
function ongletsNavigables(){ return ongletsCourants().filter(o=>!o.lien && !o.cache); }

// ---- Menu latéral ----
function renderNav(){
  if(!activeScript && DATA.portail && DATA.portail.menu){ renderNavPortail(); return; }
  const nav = document.getElementById('nav');
  let html = '';
  if(activeScript){
    html += `<a class="nav-back nav-link" href="${H('/')}" data-nav="/">${svgIcon('home')}${T('accueil')}</a>`;
  }
  window.__navHaut=false; window.__navPatch=false;
  ongletsCourants().forEach(o=>{
    if(o.cache) return;
    if(activeScript && o.id==='accueil') return; // la presentation du script s'ouvre via le nom du script (en haut du menu)
    if(o.separateurAvant && !o.rubrique) html += '<div class="sep"></div>';
    if(o.rubrique) html += `<div class="nav-rubrique">${esc(o.rubrique)}</div>`;
    const st = o.couleurOnglet ? ` style="color:${esc(o.couleurOnglet)}"` : '';
    const ico = svgIcon(o.iconePersonnalisee || o.icone);
    if(o.lien){
      const l = lienInterne(o.lien);
      html += `<a class="nav-link" ${attrsLien(o.lien)}${st}>${ico}${touches(o.titre)}${l.ext?'<span class="ext"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></span>':''}</a>`;
      return;
    }
    if(activeScript && !window.__navHaut && enSectionScript(o)){ window.__navHaut=true;
      html += `<a class="nav-link nav-section" href="#" data-section="__haut">${svgIcon('info')}${T('navHaut')}</a>`; }
    if(activeScript && enSectionScript(o)){
      const pres = routeOnglet(activeScript, 'accueil');
      html += `<a class="nav-link nav-section" href="${H(pres)}" data-section="${esc(o.id)}"${st}>${ico}${touches(o.titre)}</a>`;
      return;
    }
    const path = routeOnglet(activeScript, o.id);
    const act = o.id===activeId ? ' active" aria-current="page' : '';
    html += `<a class="nav-link${act}" href="${H(path)}" data-nav="${path}"${st}>${ico}${touches(o.titre)}</a>`;
  });
  if(activeScript && window.__navHaut){ window.__navPatch=true;
    html += `<a class="nav-link nav-section" href="#" data-section="__patch">${svgIcon('horloge')}${T('navPatch')}</a>`; }
  if(activeScript){
    const sc = DATA.scripts.map(x=>{ const p='/'+encodeURIComponent(x.id)+'/'; return `<a class="nav-link${x.id===activeScript?' active':''}" href="${H(p)}" data-nav="${p}">${svgIcon(x.iconePersonnalisee||x.icone||'manette')}<span class="nav-t">${touches(x.nom)}${x.jeu?`<small>${touches(x.jeu)}</small>`:''}</span></a>`; }).join('');
    html += `<details class="nav-group"${navOuverts.has('Mes scripts')?' open':''} data-g="Mes scripts"><summary class="nav-rubrique">${T('mesScripts')}</summary><div class="nav-items">${sc}</div></details>`;
  }
  nav.innerHTML = html;
  renderNavFoot();
}

// ---- Cartes des scripts (accueil du portail) ----
function cartesScriptsHTML(partie){
  let cartes = '';
  (partie==="extra" ? [] : DATA.scripts).forEach(s=>{
    const dispo = s.disponible !== false;
    const ico = s.logoBadge ? `<img src="${esc(A(s.logoBadge))}" alt="">` : svgIcon(s.iconePersonnalisee || s.icone || 'manette');
    const hex = cssColor(s.couleurHex);
    const nomColor = cssColor(s.couleurNomHex);
    const vars = [];
    if(hex) vars.push(`--sc-accent:${hex}`);
    if(nomColor) vars.push(`--sc-name-color:${nomColor}`);
    const st = vars.length ? ` style="${vars.join(';')}"` : '';
    const bg = s.image ? `<div class="card-bg" style="background-image:url('${esc(A(s.image))}');opacity:${s.imageOpacite!=null?s.imageOpacite:0.3}"></div>` : '';
    const path = '/' + encodeURIComponent(s.id) + '/';
    const open = dispo ? `<a class="script-card bd-perso"${st} href="${H(path)}" data-nav="${path}">` : `<div class="script-card bd-perso soon"${st} aria-disabled="true">`;
    cartes += `${open}${bg}
      <div class="sc-ic${s.logoBadge?' has-logo':''}">${ico}</div>
      ${s.jeu?`<div class="sc-jeu">${touches(s.jeu)}</div>`:''}
      <div class="sc-nom">${touches(s.nom)}</div>
      <div class="sc-desc">${touches(s.description||'')}</div>
      ${dispo?'<div class="sc-go">'+T('ouvrir')+'</div>':'<div class="sc-soon">'+T('bientot')+'</div>'}
    ${dispo?'</a>':'</div>'}`;
  });
  (partie==="scripts" ? [] : (DATA.portail.cartesExtra || [])).forEach(x=>{
    const hex = cssColor(x.couleurHex);
    const st = hex ? ` style="--sc-accent:${hex}"` : '';
    cartes += `<a class="script-card bd-perso"${st} ${attrsLien(x.lien)}>
      <div class="sc-ic${cssColor(x.couleurIconeHex)?' ic-perso':''}"${cssColor(x.couleurIconeHex)?` style="color:${cssColor(x.couleurIconeHex)}"`:''}>${svgIcon(x.iconePersonnalisee||x.icone||'etoile')}</div>
      <div class="sc-nom">${touches(x.nom||'')}</div>
      <div class="sc-desc">${touches(x.description||'')}</div>
      <div class="sc-go"${cssColor(x.couleurIconeHex)?` style="color:${cssColor(x.couleurIconeHex)}"`:''}>${esc(x.bouton||'Ouvrir →')}</div></a>`;
  });
  return `<div class="scripts-grid">${cartes}</div>`;
}

// ---- Sommaire "Sur cette page" ----
function preparerSommaire(o, ancres){
  const blocs = o.blocs || [];
  const titres = lvl => blocs.filter(b=>b.type==='texte' && (b.style===lvl || (lvl==='h1' && b.style==='titre')) && !b.horsSommaire && texteBrut(b.contenu));
  let liste = titres('h1');
  if(liste.length < 3) liste = titres('h2');
  liste.forEach((b,i)=>ancres.set(b, 'sec-'+(i+1)));
  if(!o.sommaire || liste.length < 3) return '';
  const btns = liste.map((b,i)=>`<button type="button" data-ancre="sec-${i+1}">${esc(texteBrut(b.contenu)).replace(/(\S) \/ (?=\S)/g,"$1\u00a0/\u00a0").replace(/\([^()]{1,30}\)/g,m=>"<span class=\"nw\">"+m+"</span>")}</button>`).join('');
  return `<nav class="sommaire" aria-label="${T('surPage')}"><span class="lb">${T('surPage')}</span>${btns}</nav>`;
}

// ---- Rendu d'une page ----
function renderMain(){
  const main = document.getElementById('main');
  const liste = ongletsNavigables();
  const o = liste.find(x=>x.id===activeId) || liste[0];
  if(!o){ main.innerHTML='<div class="panel"><p style="padding:20px;color:var(--txt-dim)">Aucun contenu.</p></div>'; return; }
  activeId = o.id;
  const s = getScript();

  let bg = '';
  if(o.imageFond) bg = `<div class="panel-bg" style="background-image:url('${esc(A(o.imageFond))}');opacity:${o.imageFondOpacite!=null?o.imageFondOpacite:0.15}"></div>`;

  const stT = o.couleurTitre ? ` style="color:${o.couleurTitre};-webkit-text-fill-color:${o.couleurTitre};background:none"` : '';
  const stS = o.couleurSousTitre ? ` style="color:${o.couleurSousTitre}"` : '';
  let entete = '';
  if(o.entete==='accueil'){
    entete = `<h1 class="title"${stT}>${touches(o.grandTitre||o.titre)}</h1>`+(o.sousTitre?`<p class="lead"${stS}>${String(o.sousTitre).split('\n').map(x=>touches(x)).join('<br>')}</p>`:'');
  } else {
    let fil = `<a ${attrsLien('/')}>${T('accueil')}</a>`;
    if(s) fil += ` › <a ${attrsLien('/'+s.id+'/')}>${esc(texteBrut(s.nom))}</a>`;
    entete = `<div class="fil">${fil}</div><h1 class="section"${stT}>${svgIcon(o.iconePersonnalisee || o.icone)}<span>${touches(o.titrePage||o.titre)}</span></h1>`
      + (o.sousTitre?`<p class="lead"${stS}>${String(o.sousTitre).split('\n').map(x=>touches(x)).join('<br>')}</p>`:'');
  }

  if(!(!s && o.id==='accueil')) entete = `<button type="button" class="copie-lien" title="${esc(T('copierAide'))}">🔗 <span>${T('copier')}</span></button>` + entete;
  const ctx = {aide:0, ancres:new Map()};
  const sommaire = preparerSommaire(o, ctx.ancres);
  const cartes = (!activeScript && o.entete==='accueil' && !(o.blocs||[]).some(b=>b.type==='cartesscripts')) ? cartesScriptsHTML() : '';

  const blocs = o.blocs || [];
  let body = '';
  let i = 0;
  // Une image placée en tout premier (bannière) s'affiche avant le sommaire
  let banniere = '';
  if(blocs[0] && blocs[0].type==='carte' && blocs[0].image && !blocs[0].titre && !blocs[0].contenu){
    banniere = renderBloc(blocs[0], ctx); i = 1;
  }
  while(i < blocs.length){
    const b = blocs[i];
    if(b.type==='cartelien' && b.affichage!=='pleine'){
      let grid = '';
      while(i < blocs.length && blocs[i].type==='cartelien' && blocs[i].affichage!=='pleine'){
        grid += renderBloc(blocs[i], ctx); i++;
      }
      body += `<div class="bloc-wrap esp-normal"><div class="cartelien-grid">${grid}</div></div>`;
      continue;
    }
    body += renderBloc(b, ctx);
    i++;
  }

  // Page précédente / suivante (dans l'ordre du menu)
  const listePager = liste.filter(x=>(!x.pageSeule || x===o) && !x.section);
  const idx = listePager.indexOf(o);
  const prev = o.pageSeule ? null : listePager[idx-1], next = o.pageSeule ? null : listePager[idx+1];
  const lienPage = (p, cls, lb) => {
    const path = routeOnglet(activeScript, p.id);
    return `<a class="${cls}" href="${H(path)}" data-nav="${path}"><small>${lb}</small><span>${esc(texteBrut(p.titrePage||p.titre))}</span></a>`;
  };
  const pager = (prev||next) ? `<nav class="pager">${prev?lienPage(prev,'prev',T('prec')):'<span style="flex:1"></span>'}${next?lienPage(next,'next',T('suiv')):'<span style="flex:1"></span>'}</nav>` : '';
  const pied = (DATA.pied ? `<div class="pied">${touches(DATA.pied)}</div>` : '') + (DATA.mentions ? `<div class="mentions">${touches(DATA.mentions)}</div>` : '');

  const noteTrad = (LANG==='en' && o.nonTraduit) ? `<p class="trad-note">${T('enCours')}</p>` : '';
  main.innerHTML = `<div class="panel">${bg}<div class="page-head">${entete}</div>${noteTrad}${cartes}${banniere}${sommaire}${body}${pager}${pied}</div>`;

  setTimeout(()=>{ if(window.__allerSection){ const id=window.__allerSection; window.__allerSection=null; window.__sectionClic={id, t:Date.now()+1200}; const f=()=>allerSection(id,false); f(); setTimeout(f,300); setTimeout(f,900); } suiviSections(); }, 30);
  main.querySelectorAll('.sommaire [data-ancre]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const el = document.getElementById(btn.getAttribute('data-ancre'));
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  setupClips();
  const pnl=main.querySelector('.panel'); if(pnl) pnl.classList.toggle('pres-script', !!activeScript && activeId==='accueil');

  const nomSite = DATA.nomSite || 'noozbar Scripts';
  const t = texteBrut(o.titrePage || o.titre);
  if(o.titreGoogle){ document.title = texteBrut(o.titreGoogle); return; }
  document.title = (!s && o.id==='accueil') ? (DATA.titreSite || nomSite) : (s ? (o.id==='accueil' ? `${t} | ${nomSite}` : `${texteBrut(s.nom)} — ${t} | ${nomSite}`) : `${t} | ${nomSite}`);
}

function setupClips(){
  const clips = document.querySelectorAll('video.clip');
  if(!('IntersectionObserver' in window)){ clips.forEach(v=>v.play().catch(()=>{})); return; }
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting && e.intersectionRatio>=0.5) e.target.play().catch(()=>{}); else e.target.pause(); });
  },{threshold:[0,0.5,1]});
  clips.forEach(v=>io.observe(v));
}

// ---- Adresses propres / historique ----
function cheminBrut(){
  if(ROUTER === 'hash') return (location.hash || '#/').slice(1) || '/';
  return location.pathname;
}
// chemin sans le prefixe de langue
function cheminActuel(){ return cheminBrut().replace(/^\/en(?=\/|$)/,'') || '/'; }
function setLang(l){
  LANG = (l==='en' && window.SITE_DATA_EN) ? 'en' : 'fr';
  DATA = LANG==='en' ? window.SITE_DATA_EN : window.SITE_DATA;
  SEARCH_IDX = null;
  document.documentElement.lang = LANG;
  majLangUI();
}
function majLangUI(){
  const q=(id)=>document.getElementById(id);
  const inp=q('search-input'); if(inp){ inp.placeholder=T('rech'); inp.setAttribute('aria-label',T('rechAria')); }
  const sb=q('search-btn'); if(sb) sb.setAttribute('aria-label',T('rechBtn'));
  const bu=q('burger'); if(bu) bu.setAttribute('aria-label',T('menu'));
  const na=q('nav'); if(na) na.setAttribute('aria-label',T('menuAria'));
  const tt=q('to-top'); if(tt) tt.setAttribute('aria-label',T('haut'));
  const ls=q('lang-sw'); if(ls){ ls.setAttribute('aria-label',T('langAria')); ls.querySelectorAll('button').forEach(b=>{ const on=b.dataset.lang===LANG; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false'); }); }
}
function changerLangue(l){
  langMemo(l);
  const chemin = cheminActuel();
  LANG = l;           // go() ajoute le prefixe selon LANG
  go(chemin);
}
function applyUrl(){
  setLang(/^\/en(\/|$)/.test(cheminBrut()) ? 'en' : 'fr');
  navOuverts.clear(); // on change de page : les menus deroulants ouverts a la main se referment
  const parts = cheminActuel().split('/').filter(Boolean).map(x=>{ try{return decodeURIComponent(x)}catch(e){return x} });
  const script = parts[0] ? DATA.scripts.find(s=>s.id===parts[0] && s.disponible!==false) : null;
  if(script){
    activeScript = script.id;
    const ong = (script.onglets||[]).filter(o=>!o.lien);
    const ALIAS = {'online-cheat':'online-action','story-cheat':'story-action','quick-cheat':'quick-action'};
    if(parts[1] && ALIAS[parts[1]]) parts[1] = ALIAS[parts[1]];
    const cible = parts[1] && ong.find(o=>o.id===parts[1]);
    if(cible && cible.section){ window.__allerSection = cible.id; activeId = ong[0] ? ong[0].id : null; try{ history.replaceState(null,'',H(routeOnglet(script.id, activeId))); }catch(e){} }
    else activeId = cible ? parts[1] : (ong[0] ? ong[0].id : null);
  } else {
    activeScript = null;
    const redir = (DATA.portail.redirections||{})[parts[0]]; if(redir){ parts[0] = redir; try{ history.replaceState(null,'',H('/'+redir+'/')); }catch(e){} }
    const ong = ongletsNavigables();
    activeId = (parts[0] && ong.some(o=>o.id===parts[0])) ? parts[0] : (ong[0] ? ong[0].id : null);
  }
  updateChrome();
  render();
}
function go(path){
  if(ROUTER === 'hash'){
    path = lp(path); if(location.hash.slice(1) !== path) location.hash = path; else applyUrl();
  } else {
    path = lp(path); if(location.pathname !== path) history.pushState({}, '', path);
    applyUrl();
  }
  closeMenu();
  window.scrollTo({top:0, behavior:'smooth'});
}
window.addEventListener('popstate', ()=>{ if(DATA && ROUTER==='path') applyUrl(); });
window.addEventListener('hashchange', ()=>{ if(DATA && ROUTER==='hash'){ applyUrl(); window.scrollTo({top:0}); } });

function updateChrome(){
  const s = getScript();
  document.body.dataset.mode = s ? 'script' : 'portail';
  const nom = s ? s.nom : (DATA.portail.marque || 'NOOZBAR');
  const sub = s ? (s.jeuPage || s.jeu || s.description || T('guide')) : (DATA.portail.sousMarque || T('sousMarque'));
  document.getElementById('brand-home').innerHTML = touches(nom);
  document.getElementById('brand-sub').innerHTML = String(sub).split('|').map(x=>touches(x.trim())).join('<br>');
  document.getElementById('topbar-title').innerHTML = touches(nom);
  const st = s && cssColor(s.couleurNomHex) ? cssColor(s.couleurNomHex) : '';
  document.getElementById('brand-home').style.color = st;
}

function render(){ renderNav(); renderMain(); majDiscord(); }

// ---- Interface ----
document.getElementById('burger').addEventListener('click', toggleMenu);
document.getElementById('overlay').addEventListener('click', closeMenu);
document.getElementById('brand-home').addEventListener('click', ()=>{
  const s = getScript();
  go(s ? '/' + s.id + '/' : '/');
});
// Tous les liens internes (menu, cartes, textes) passent par le routeur
document.addEventListener('click', e=>{
  const a = e.target.closest('a[data-nav]');
  if(!a || e.defaultPrevented || e.button!==0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go(a.getAttribute('data-nav'));
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

// ---- Chargement du contenu ----
// (apercu.html embarque le contenu dans window.SITE_DATA pour fonctionner sans serveur)
if(ROUTER==='path' && /^#\//.test(location.hash)){ try{ history.replaceState({},'',location.hash.slice(1)); }catch(e){} }
if(window.SITE_DATA){
  DATA = window.SITE_DATA;
  // premiere visite sans prefixe : langue memorisee, sinon langue du navigateur
  const robot = /bot|crawl|spider|slurp|google|bing|yandex|duckduck|facebookexternal|discord/i.test(navigator.userAgent||'');
  if(window.SITE_DATA_EN && !robot && (ROUTER==='hash' || cheminActuel()==='/') && !/^\/en(\/|$)/.test(cheminBrut())){
    const pref = langStocke() || ((navigator.language||'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en');
    if(pref==='en'){ LANG='en'; const p=lp(cheminActuel()); if(ROUTER==='hash') history.replaceState(null,'','#'+p); else history.replaceState({},'',p); }
  }
  applyUrl();
}
else fetch(A('/contenu/site.json') + '?' + Date.now())
  .then(r=>r.json())
  .then(d=>{ DATA = d; applyUrl(); })
  .catch(e=>{
    document.getElementById('main').innerHTML = '<p style="padding:40px">Erreur de chargement du contenu : '+esc(e.message)+'</p>';
  });

// ---- Bouton flottant "remonter en haut" ----
(function(){
  const btn=document.createElement('button');
  btn.id='to-top';btn.type='button';btn.setAttribute('aria-label',T('haut'));btn.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.body.appendChild(btn);
  const maj=()=>btn.classList.toggle('show',window.scrollY>400);
  window.addEventListener('scroll',maj,{passive:true});maj();
})();

// ---- Pastilles de MODs cliquables : un clic ouvre la description, un second clic la ferme ----
document.addEventListener('click', e=>{
  const t = e.target.closest('.tag-mod');
  if(!t) return;
  const wrap = t.closest('.bloc-wrap');
  const panel = wrap && wrap.querySelector('.mod-panel');
  if(!panel) return;
  const ouvert = t.classList.contains('active');
  // une seule carte ouverte sur toute la page : on referme les autres sections, sans faire sauter la pastille cliquee
  const avant = t.getBoundingClientRect().top;
  document.querySelectorAll('.tag-mod.active').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.mod-panel').forEach(p=>{ if(p!==panel && !p.hidden){ p.hidden = true; p.innerHTML = ''; } });
  const recaler = ()=>{ const d = t.getBoundingClientRect().top - avant; if(Math.abs(d)>1) window.scrollBy(0, d); };
  if(ouvert){ panel.hidden = true; panel.innerHTML = ''; recaler(); return; }
  const m = (DATA.mods||[]).find(x=>x.id===t.getAttribute('data-mod'));
  if(!m) return;
  const ctx = {aide:0, ancres:new Map()};
  panel.innerHTML = m.fiche ? ficheHTML(m, ctx, null, {sansTitre:true}) : '<div class="mod-body">' + m.blocs.map(x=>renderBloc(x,ctx)).join('') + '</div>';
  panel.hidden = false;
  t.classList.add('active');
  recaler();
  montrerOuvert(t, panel);
  setupClips();
});

// =========================================================================
//  MENU DU PORTAIL : rubriques repliables (violet) + lien Accueil
// =========================================================================
function renderNavPortail(){
  const nav = document.getElementById('nav');
  const pageCourante = (DATA.portail.onglets||[]).find(o=>o.id===activeId);
  document.body.classList.toggle('page-seule', !!(pageCourante && pageCourante.pageSeule));
  if(pageCourante && pageCourante.pageSeule){
    nav.innerHTML = `<a class="nav-link nav-home" href="${H('/')}" data-nav="/">${svgIcon('home')}<span class="nav-t">${T('accueil')}</span></a>`;
    const foot = document.getElementById('nav-foot'); if(foot) foot.innerHTML = '';
    return;
  }
  const accueil = (DATA.portail.onglets||[]).find(o=>o.id==='accueil');
  const surAccueil = activeId==='accueil';
  let html = '';
  if(accueil && !surAccueil){
    html += `<a class="nav-link nav-home" href="${H('/')}" data-nav="/">${svgIcon('home')}<span class="nav-t">${T('accueil')}</span></a>`;
  }
  const lien = (o, titre) => {
    const st = o.couleurOnglet ? ` style="color:${esc(o.couleurOnglet)}"` : '';
    const ico = svgIcon(o.iconePersonnalisee || o.icone);
    if(o.lien){
      const l = lienInterne(o.lien);
      return `<a class="nav-link" ${attrsLien(o.lien)}${st}>${ico}<span class="nav-t">${touches(titre||o.titre)}</span>${l.ext?'<span class="ext"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></span>':''}</a>`;
    }
    const path = routeOnglet(null, o.id);
    const act = o.id===activeId ? ' active" aria-current="page' : '';
    return `<a class="nav-link${act}" href="${H(path)}" data-nav="${path}"${st}>${ico}<span class="nav-t">${touches(titre||o.titre)}</span></a>`;
  };
  (DATA.portail.menu||[]).forEach(g=>{
    let contientActif = false, items = '';
    (g.items||[]).forEach(it=>{
      if(typeof it==='object' && it.sousTitre){ items += `<div class="nav-sous">${esc(it.sousTitre)}</div>`; return; }
      if(typeof it==='object' && it.script){
        const s = DATA.scripts.find(x=>x.id===it.script); if(!s) return;
        const path = '/' + encodeURIComponent(s.id) + '/';
        const ico = svgIcon(s.iconePersonnalisee || s.icone || 'manette');
        items += `<a class="nav-link" href="${H(path)}" data-nav="${path}">${ico}<span class="nav-t">${touches(s.nom)}${s.jeu?`<small>${touches(s.jeu)}</small>`:''}</span></a>`;
        return;
      }
      const id = typeof it==='string' ? it : it.page;
      const o = (DATA.portail.onglets||[]).find(x=>x.id===id); if(!o || o.cache) return;
      if(o.id===activeId) contientActif = true;
      items += lien(o, typeof it==='object' ? it.titre : null);
    });
    const ouvert = contientActif || navOuverts.has(g.titre) || (surAccueil && g.ouvertAccueil);
    html += `<details class="nav-group"${ouvert?' open':''} data-g="${esc(g.titre)}"><summary class="nav-rubrique">${esc(g.titre)}</summary><div class="nav-items">${items}</div></details>`;
  });
  nav.innerHTML = html;
  renderNavFoot();
}
// A propos + Discord : fixes en bas du menu, sur toutes les pages
function renderNavFoot(){
  const foot = document.getElementById('nav-foot'); if(!foot) return;
  const P = DATA.portail.onglets||[];
  const ap = P.find(o=>o.id==='a-propos'), dc = P.find(o=>o.id==='discord');
  let h = '';
  if(ap){ const p = routeOnglet(null, ap.id); h += `<a class="nav-link${(!activeScript && activeId===ap.id)?' active':''}" href="${H(p)}" data-nav="${p}">${svgIcon(ap.iconePersonnalisee||ap.icone)}<span class="nav-t">${touches(ap.titre)}</span></a>`; }
  if(dc && dc.lien){ h += `<a class="nav-link" ${attrsLien(dc.lien)}>${svgIcon(dc.iconePersonnalisee||dc.icone)}<span class="nav-t">${touches(dc.titre)}</span><span class="ext"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></span></a>`; }
  const ab = P.find(o=>o.id==='abonnement');
  if(ab){ const p = routeOnglet(null, ab.id); h += `<a class="nav-link nav-vip${(!activeScript && activeId===ab.id)?' active':''}" href="${H(p)}" data-nav="${p}">${svgIcon('couronne')}<span class="nav-t">${touches(ab.titre)}</span></a>`; }
  foot.innerHTML = h;
}
document.addEventListener('click', e=>{
  const sm = e.target.closest && e.target.closest('summary.nav-rubrique');
  if(!sm) return;
  const det = sm.parentElement;
  setTimeout(()=>{ const t = det.getAttribute('data-g'); if(det.open) navOuverts.add(t); else navOuverts.delete(t); }, 0);
});

// =========================================================================
//  RECHERCHE (en haut a droite de chaque page)
// =========================================================================
function sNorm(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s/+]/g,' ').replace(/\s+/g,' ').trim();
}
function sPlain(s){
  return texteBrut(String(s||'').replace(/\{([^}]+)\}/g,'$1').replace(/(\d)️?⃣/g,'$1')).replace(/\s+/g,' ').trim();
}
function sBuild(){
  const idx = [], vus = new Set();
  const add = (e)=>{
    const t = sPlain(e.text); if(!t) return;
    const cle = e.route + '|' + (e.cibleId||e.cible||'') + '|' + t;
    const cle2 = t + '|' + (e.cibleId||e.cible||'');
    if(vus.has(cle) || vus.has(cle2)) return;
    vus.add(cle); vus.add(cle2);
    idx.push({route:e.route, page:e.page, section:e.section||'', cible:e.cible||'', cibleId:e.cibleId||'', text:t, titre:!!e.titre, n:sNorm(t), ns:sNorm((e.section||'')+' '+e.page)});
  };
  const modById = id => (DATA.mods||[]).find(m=>m.id===id);
  const walk = (blocs, c)=>{
    (blocs||[]).forEach(b=>{
      switch(b.type){
        case 'texte':
          if(['h1','h2','h3','titre'].includes(b.style)){ const t=sPlain(b.contenu); add({...c, text:t, titre:true, section:t, cible:t}); }
          else add({...c, text:b.contenu});
          break;
        case 'liste': add({...c, text:b.contenu}); break;
        case 'carte': add({...c, text:(b.titre?b.titre+'. ':'')+(b.contenu||'')}); if(b.blocs) walk(b.blocs, c); break;
        case 'modbody': { const m=modById(b.mod); if(m) walk(m.blocs, c); break; }
        case 'groupe': case 'encadre': walk(b.blocs, c); break;
        case 'duo': (b.cartes||[]).forEach(k=>{ add({...c, text:k.titre}); walk(k.blocs, c); }); break;
        case 'tuiles': (b.tuiles||[]).forEach(k=>{ add({...c, text:k.titre+'. '+(k.contenu||'')}); walk(k.blocs, c); }); break;
        case 'etapes': if(Array.isArray(b.etapes)) b.etapes.forEach(k=>{ add({...c, text:(k.titre?k.titre+'. ':'')+(k.contenu||'')}); walk(k.blocs, c); }); else add({...c, text:b.contenu}); break;
        case 'cartegroupe': (b.ids||[]).forEach(id=>{ const m=modById(id); if(m){ const t=sPlain(m.titre); add({...c, text:t, titre:true, section:t, cible:t}); walk(m.blocs, {...c, section:t, cible:t}); } }); break;
        case 'depliant': {
          const t = sPlain(b.titre);
          const c2 = {...c, section:t, cible:t};
          add({...c2, text:t, titre:true});
          if(b.mod){ const m=modById(b.mod); if(m) walk(m.blocs, c2); } else walk(b.blocs, c2);
          break; }
        case 'mods':
          (b.ids||[]).forEach(id=>{
            const m = modById(id); if(!m) return;
            if(m.scripts && c.script && !m.scripts.includes(c.script)) return;
            const t = sPlain(m.titre);
            const c2 = {...c, section:t, cible:t, cibleId:'mod-'+m.id};
            add({...c2, text:t, titre:true});
            walk(m.blocs, c2);
          });
          break;
      }
    });
  };
  const nomPage = (o, s) => (s ? sPlain(s.nom)+' › ' : '') + sPlain(o.titrePage||o.titre);
  (DATA.portail.onglets||[]).forEach(o=>{ if(o.lien) return;
    const route = routeOnglet(null, o.id);
    if(o.id!=='accueil') add({route, page:nomPage(o,null), text:o.titrePage||o.titre, titre:true});
    walk(o.blocs, {route, page:nomPage(o,null), script:null}); });
  (DATA.scripts||[]).forEach(s=>(s.onglets||[]).forEach(o=>{ if(o.lien) return;
    const route = routeOnglet(s.id, o.id);
    add({route, page:nomPage(o,s), text:(o.id==='accueil'?s.nom:o.titrePage||o.titre), titre:true});
    walk(o.blocs, {route, page:nomPage(o,s), script:s.id}); }));
  return idx;
}
function sMap(s){ // texte normalise + correspondance des positions avec le texte d'origine (pour surligner)
  let n='', map=[];
  for(let i=0;i<s.length;i++){
    const c = s[i].normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
    for(const ch of c){ n+=ch; map.push(i); }
  }
  return {n, map};
}
function sSnippet(texte, tokens){
  const {n, map} = sMap(texte);
  let pos = -1;
  for(const t of tokens){ const p=n.indexOf(t); if(p>=0 && (pos<0 || p<pos)) pos=p; }
  const debut = pos<0 ? 0 : Math.max(0, (map[pos]||0) - 50);
  let fin = Math.min(texte.length, debut + 150);
  let extrait = texte.slice(debut, fin);
  let out = esc(extrait);
  // surlignage (sur l'extrait uniquement)
  const m2 = sMap(extrait); const marques = [];
  for(const t of tokens){ let p=0; while((p=m2.n.indexOf(t,p))>=0){ marques.push([m2.map[p], (m2.map[p+t.length-1]||0)+1]); p+=t.length; } }
  marques.sort((a,b)=>a[0]-b[0]);
  const fus=[]; marques.forEach(m=>{ const l=fus[fus.length-1]; if(l && m[0]<=l[1]) l[1]=Math.max(l[1],m[1]); else fus.push([...m]); });
  let res='', cur=0;
  fus.forEach(([a,b])=>{ res+=esc(extrait.slice(cur,a))+'<mark>'+esc(extrait.slice(a,b))+'</mark>'; cur=b; });
  res+=esc(extrait.slice(cur));
  return (debut>0?'… ':'')+res+(fin<texte.length?' …':'');
}
function sRechercher(q){
  if(!SEARCH_IDX) SEARCH_IDX = sBuild();
  const tokens = sNorm(q).split(' ').filter(t=>t.length>=2);
  if(!tokens.length) return [];
  const groupes = new Map();
  SEARCH_IDX.forEach(e=>{
    const tout = e.n+' '+e.ns;
    if(!tokens.every(t=>tout.includes(t))) return;
    let sc = 0;
    tokens.forEach(t=>{ if(e.ns.includes(t)) sc+=4; if(e.n.includes(t)) sc+=1; });
    if(e.titre) sc += 5;
    if(e.n===sNorm(q)) sc += 6;
    const cle = e.route+'|'+(e.cibleId||e.cible||'');
    const g = groupes.get(cle);
    if(!g || sc>g.sc) groupes.set(cle, {e, sc: sc + (g?g.sc*0.2:0)}); else g.sc += sc*0.2;
  });
  return [...groupes.values()].sort((a,b)=>b.sc-a.sc).slice(0,12).map(g=>({...g.e, tokens}));
}
function sAfficher(){
  const input = document.getElementById('search-input'), box = document.getElementById('search-results');
  const q = input.value.trim();
  if(q.length<2){ box.hidden=true; box.innerHTML=''; return; }
  const res = sRechercher(q);
  if(!res.length){ box.innerHTML='<div class="sr-vide">'+T('aucun')+' « '+esc(q)+' »</div>'; box.hidden=false; return; }
  box.innerHTML = res.map((r,i)=>`<a class="sr-item${i===0?' sel':''}" href="${H(r.route)}" data-r="${i}">
      <span class="sr-titre">${esc(r.section||r.page.split(' › ').pop())}</span>
      <span class="sr-page">${esc(r.page)}</span>
      ${r.titre?'':`<span class="sr-snip">${sSnippet(r.text, r.tokens)}</span>`}</a>`).join('');
  box._res = res; box.hidden = false;
}
function sOuvrir(r){
  const box = document.getElementById('search-results'); box.hidden = true;
  document.getElementById('search-wrap').classList.remove('open');
  document.getElementById('search-input').blur();
  go(r.route);
  window.__cible = {cible:r.cible, cibleId:r.cibleId};
  let essais = 0;
  const tenter = ()=>{
    const c = window.__cible; if(!c) return;
    const main = document.getElementById('main');
    let el = c.cibleId ? document.getElementById(c.cibleId) : null;
    if(!el && c.cible){
      const n = sNorm(c.cible);
      el = [...main.querySelectorAll('summary, .b-text.h1, .b-text.h2, .b-text.h3, .b-text.titre')].find(x=>sNorm(x.textContent).includes(n)) || null;
    }
    if(!el){ if(++essais<12) setTimeout(tenter, 60); else window.__cible=null; return; }
    window.__cible = null;
    // ouvrir l'accordeon cible et ceux qui le contiennent
    let p = el; while(p && p!==main){ if(p.tagName==='DETAILS') p.open = true; p = p.parentElement; }
    const sm = el.tagName==='DETAILS' ? el.querySelector('summary') : el;
    setTimeout(()=>{ (sm||el).scrollIntoView({behavior:'smooth', block:'start'}); (sm||el).classList.add('flash'); setTimeout(()=>(sm||el).classList.remove('flash'), 1800); }, 80);
  };
  setTimeout(tenter, 120);
}
(function(){
  const wrap = document.getElementById('search-wrap'); if(!wrap) return;
  const input = document.getElementById('search-input'), box = document.getElementById('search-results'), btn = document.getElementById('search-btn');
  input.addEventListener('input', sAfficher);
  input.addEventListener('focus', ()=>{ if(input.value.trim().length>=2) sAfficher(); });
  input.addEventListener('keydown', e=>{
    const items = [...box.querySelectorAll('.sr-item')];
    const cur = items.findIndex(x=>x.classList.contains('sel'));
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(!items.length) return;
      const n = e.key==='ArrowDown' ? Math.min(items.length-1,cur+1) : Math.max(0,cur-1);
      items.forEach(x=>x.classList.remove('sel')); items[n].classList.add('sel'); items[n].scrollIntoView({block:'nearest'});
    } else if(e.key==='Enter'){ e.preventDefault(); if(items[cur>=0?cur:0] && box._res) sOuvrir(box._res[+items[cur>=0?cur:0].dataset.r]); }
    else if(e.key==='Escape'){ box.hidden=true; wrap.classList.remove('open'); input.blur(); }
  });
  box.addEventListener('click', e=>{ const a=e.target.closest('.sr-item'); if(!a) return; e.preventDefault(); sOuvrir(box._res[+a.dataset.r]); });
  box.addEventListener('mousemove', e=>{ const a=e.target.closest('.sr-item'); if(!a) return; box.querySelectorAll('.sr-item.sel').forEach(x=>x.classList.remove('sel')); a.classList.add('sel'); });
  btn.addEventListener('click', ()=>{ wrap.classList.toggle('open'); if(wrap.classList.contains('open')) setTimeout(()=>input.focus(),30); else box.hidden=true; });
  document.addEventListener('click', e=>{ if(!wrap.contains(e.target)){ box.hidden=true; if(window.matchMedia('(max-width:820px)').matches) wrap.classList.remove('open'); } });
  document.addEventListener('keydown', e=>{
    const tag = (e.target.tagName||'').toLowerCase();
    if((e.key==='/' && tag!=='input' && tag!=='textarea') || ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k')){ e.preventDefault(); wrap.classList.add('open'); input.focus(); input.select(); }
  });
})();

// ---- Boutons de langue (FR / EN) ----
(function(){
  const ls=document.getElementById('lang-sw'); if(!ls) return;
  ls.addEventListener('click', e=>{ const b=e.target.closest('button[data-lang]'); if(!b) return; if(b.dataset.lang===LANG) return; changerLangue(b.dataset.lang); });
  majLangUI();
})();

// =========================================================================
//  DISCORD : membres en ligne / total en direct (API publique d'invitation)
// =========================================================================
function discordCache(){ return (discordCache.c = discordCache.c || {}); }
function discordAppliquer(el, d){
  const fmt = n => new Intl.NumberFormat(LANG==='en'?'en-US':'fr-FR').format(n).replace(/[  ]/g,' ');
  if(d.approximate_presence_count!=null){ const on=el.querySelector('.dc-on'); on.querySelector('.n').textContent=fmt(d.approximate_presence_count); on.hidden=false; }
  if(d.approximate_member_count!=null){ el.querySelector('.dc-mb .n').textContent=fmt(d.approximate_member_count); }
  const g=d.guild||{};
  if(g.id && g.icon){ const img=el.querySelector('.dc-ava img'); const src='https://cdn.discordapp.com/icons/'+g.id+'/'+g.icon+'.png?size=128'; if(img){ if(img.getAttribute('src')!==src) img.src=src; } }
}
function majDiscord(){
  document.querySelectorAll('.dc-band[data-invite]').forEach(el=>{
    const code=el.dataset.invite; if(!code) return;
    const C=discordCache(); const c=C[code];
    if(c && c.d) discordAppliquer(el,c.d);
    if(c && Date.now()-c.t < 55000) return;
    C[code]={t:Date.now(), d:c&&c.d};
    fetch('https://discord.com/api/v9/invites/'+encodeURIComponent(code)+'?with_counts=true')
      .then(r=>r.ok?r.json():Promise.reject(r.status))
      .then(d=>{ C[code]={t:Date.now(), d}; document.querySelectorAll('.dc-band[data-invite="'+code+'"]').forEach(e=>discordAppliquer(e,d)); })
      .catch(()=>{});
  });
}
setInterval(()=>{ if(!document.hidden) majDiscord(); }, 60000);

// =========================================================================
//  FICHE DE MOD : mots-cles cliquables qui ouvrent chaque partie sur place
//  m.fiche.colonnes = [{titre, liens:[{titre, de, a}]}]  (de/a = index dans m.blocs)
// =========================================================================
function ficheHTML(m, ctx, v, opts){
  v = v || 'A';
  const sid = (opts&&opts.script) || (typeof activeScript!=='undefined' ? activeScript : null);
  const cols = (m.fiche.colonnes||[]).map(c=>{ const liens=(c.liens||[]).filter(l=> sid ? (!l.scripts||l.scripts.includes(sid)) : !l.seulScript);
    return {...c, liens, masques:(c.liens||[]).length-liens.length}; });
  const corps = l => m.blocs.slice(l.de, l.a+1).map(x=>renderBloc(x,ctx)).join('');
  const titre = (opts&&opts.sansTitre) ? '' : `<h2 class="mf-titre">${touches(m.titre,{sansMots:true})}</h2>`;
  const lab = t => String(t||'').split('\n').map(x=>touches(x,{sansMots:true})).join('<br>');
  // carte sans mots-cles (description tres courte, ex. MOD en developpement)
  if(!cols.length) return `<section class="mod-fiche" id="mod-${esc(m.id)}">${titre}<div class="mf-sec mf-seul">${m.blocs.map(x=>renderBloc(x,ctx)).join('')}</div></section>`;
  // A : mots-cles en deux colonnes
  let n=0; const secs=[];
  const html=cols.map(c=>{
    const chips=(c.liens||[]).map(l=>{ const i=n++; secs.push(`<div class="mf-sec" data-sec="${i}" hidden>${corps(l)}</div>`);
      return `<button type="button" class="mf-chip" data-sec="${i}" aria-expanded="false">${lab(l.titre)}</button>`; }).join('');
    return `<div class="mf-col">${c.titre?`<div class="mf-lb">${lab(c.titre)}</div>`:''}<div class="mf-chips">${chips}</div></div>`;
  }).join('');
  return `<section class="mod-fiche" id="mod-${esc(m.id)}">${titre}<div class="mf-grille">${html}</div><div class="mf-panel">${secs.join('')}</div></section>`;
}
document.addEventListener('click', e=>{
  const chip=e.target.closest && e.target.closest('.mf-chip');
  if(chip){
    const f=chip.closest('.mod-fiche'); const ouvert=chip.getAttribute('aria-expanded')==='true';
    // une seule partie ouverte a la fois sur toute la page (toutes cartes confondues)
    document.querySelectorAll('.mod-fiche .mf-chip').forEach(c=>c.setAttribute('aria-expanded','false'));
    document.querySelectorAll('.mod-fiche .mf-panel > .mf-sec').forEach(s=>s.hidden=true);
    if(!ouvert){ chip.setAttribute('aria-expanded','true'); const s=f.querySelector('.mf-sec[data-sec="'+chip.dataset.sec+'"]'); if(s){ s.hidden=false; }
      // si la carte a remonte (une partie plus haut s'est refermee), on garde la carte cliquee a l'ecran
      const r=f.getBoundingClientRect(); if(r.top<0) f.scrollIntoView({behavior:'smooth', block:'start'}); else if(s) montrerOuvert(chip, s); }
    return;
  }
  const aller=e.target.closest && e.target.closest('[data-aller]');
  if(aller){
    const el=document.getElementById(aller.dataset.aller); if(!el) return;
    if(el.tagName==='DETAILS') el.open=true;
    el.scrollIntoView({behavior:'smooth', block:'start'});
  }
});

// =========================================================================
//  SECTIONS D'UN SCRIPT dans le menu de gauche
// =========================================================================
// pages de la rubrique "Bibliotheque des MODs" d'un script = sections de sa page Presentation
function enSectionScript(o){ return !!(activeScript && o && o.section); }
function titreSection(id){
  if(id==='__haut') return null;
  if(id==='__patch') return [...document.querySelectorAll('main .b-text.titre')].find(t=>/patch note/i.test(t.textContent));
  const s=(DATA.scripts||[]).find(x=>x.id===activeScript); const o=s&&(s.onglets||[]).find(x=>x.id===id); if(!o) return null;
  if(o.ancre) return document.getElementById(o.ancre);
  const nom=texteBrut(o.titre).toLowerCase().replace(/^[^a-z0-9]+/,'');
  return [...document.querySelectorAll('main .b-text.titre')].find(t=>t.textContent.toLowerCase().includes(nom.split(' - ').pop().trim()));
}
function allerSection(id, doux){
  if(id==='__haut'){ window.scrollTo({top:0, behavior: doux?'smooth':'auto'}); return; }
  const t=titreSection(id); if(!t) return;
  if(t.tagName==='DETAILS') t.open=true;
  const w=t.closest('.bloc-wrap')||t; w.scrollIntoView({behavior: doux?'smooth':'auto', block:'start'});
}
function majSuiviSections(){
  const liens=[...document.querySelectorAll('#nav .nav-section')]; if(!liens.length) return;
  let act=null;
  const clic=window.__sectionClic;
  if(clic && Date.now()-clic.t<1500){ act=liens.find(a=>a.dataset.section===clic.id)||null; }
  else if(activeId==='accueil'){
    // une section reste en evidence tant que son titre est visible ; quand il sort par le haut de l'ecran, on passe a la suivante
    const titres=[...document.querySelectorAll('main .b-text.titre')];
    const tit=a=> a.dataset.section==='__haut' ? titres[0] : titreSection(a.dataset.section);
    act=liens.find(a=>{ const t=tit(a); return t && t.getBoundingClientRect().bottom>0; }) || liens[liens.length-1]; }
  liens.forEach(a=>a.classList.toggle('active', a===act));
}
function suiviSections(){
  if(!window.__suiviSections){ window.__suiviSections=true; window.addEventListener('scroll', majSuiviSections, {passive:true}); }
  majSuiviSections(); setTimeout(majSuiviSections, 350); setTimeout(majSuiviSections, 900);
}
document.addEventListener('click', e=>{
  const a=e.target.closest && e.target.closest('#nav .nav-section'); if(!a) return;
  e.preventDefault();
  window.__sectionClic={id:a.dataset.section, t:Date.now()};
  const pres=routeOnglet(activeScript,'accueil');
  if(activeId==='accueil'){ allerSection(a.dataset.section, true); }
  else { window.__allerSection=a.dataset.section; go(pres); }
  closeMenu();
}, true);

// fait defiler juste ce qu'il faut pour voir le bas de l'element ouvert, sans faire sortir le declencheur par le haut
function montrerOuvert(declencheur, el){
  requestAnimationFrame(()=>{ const r=el.getBoundingClientRect(), h=window.innerHeight;
    if(r.bottom<=h-12) return;
    const d=Math.min(r.bottom-h+24, declencheur.getBoundingClientRect().top-90);
    if(d>0) window.scrollBy({top:d, behavior:'smooth'}); });
}

// =========================================================================
//  ZOOM SUR LES IMAGES DES TUTORIELS
// =========================================================================
(function(){
  const SEL='main .card-image-full, main .et-img img, main .bloc-media img';
  let ov=null;
  const fermer=()=>{ if(!ov) return; ov.classList.remove('on'); document.documentElement.classList.remove('zoom-ouvert'); setTimeout(()=>{ if(ov) ov.hidden=true; },180); };
  document.addEventListener('click', e=>{
    const img=e.target.closest && e.target.closest(SEL);
    if(ov && !ov.hidden && e.target.closest('.zoom-ov')){ fermer(); return; }
    if(!img || img.closest('a')) return;
    e.preventDefault();
    if(!ov){ ov=document.createElement('div'); ov.className='zoom-ov'; ov.hidden=true; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.innerHTML='<img alt="">'; document.body.appendChild(ov); }
    const z=ov.querySelector('img'); z.src=img.currentSrc||img.src; z.alt=img.alt||'';
    ov.hidden=false; document.documentElement.classList.add('zoom-ouvert'); requestAnimationFrame(()=>ov.classList.add('on'));
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') fermer(); });
  window.addEventListener('hashchange', fermer);
})();

// =========================================================================
//  DEPLIANTS GROUPES : un seul ouvert a la fois dans un meme encadre
// =========================================================================
document.addEventListener('click', e=>{
  const s=e.target.closest && e.target.closest('summary'); if(!s) return;
  const d=s.parentElement; if(!d || d.tagName!=='DETAILS' || d.open) return;
  const w=d.parentElement, g=w && w.parentElement;
  if(!g || !g.classList.contains('dep-groupe')) return;
  const avant=s.getBoundingClientRect().top;
  g.querySelectorAll(':scope > .bloc-wrap > details[open]').forEach(x=>{ if(x!==d) x.open=false; });
  // on garde le titre clique a la meme place a l'ecran (le depliant du dessus s'est referme)
  requestAnimationFrame(()=>{ const dt=s.getBoundingClientRect().top-avant; if(Math.abs(dt)>1) window.scrollBy({top:dt, behavior:'instant'}); });
}, true);

// lien vers une section precise d'une page (ex. page:guide-cronus-zen#output-protocol) : ouvre le depliant et y defile
document.addEventListener('click', e=>{
  const a=e.target.closest && e.target.closest('a[data-cible]'); if(!a) return;
  const id=a.dataset.cible; let n=0;
  const t=()=>{ const el=document.getElementById(id);
    if(!el){ if(++n<15) setTimeout(t,60); return; }
    let p=el; while(p && p.tagName!=='MAIN'){ if(p.tagName==='DETAILS'){
        const g=p.parentElement && p.parentElement.parentElement;
        if(g && g.classList.contains('dep-groupe')) g.querySelectorAll(':scope > .bloc-wrap > details[open]').forEach(x=>{ if(x!==p) x.open=false; });
        p.open=true; } p=p.parentElement; }
    const sm=el.tagName==='DETAILS' ? el.querySelector('summary') : el;
    setTimeout(()=>{ sm.scrollIntoView({behavior:'smooth', block:'start'}); sm.classList.add('flash'); setTimeout(()=>sm.classList.remove('flash'),1800); }, 80);
  };
  setTimeout(t, 150);
});

// =========================================================================
//  BARRE DU HAUT (recherche + langue) : se cache quand on descend, revient des qu'on remonte
// =========================================================================
(function(){
  const r=document.documentElement; let y0=window.scrollY;
  const fond=document.createElement('div'); fond.id='barre-fond'; fond.setAttribute('aria-hidden','true'); document.body.appendChild(fond);
  const maj=()=>{
    const y=window.scrollY, dy=y-y0;
    const sw=document.getElementById('search-wrap'), ae=document.activeElement;
    if((sw && sw.classList.contains('open')) || (ae && ae.id==='search-input') || document.body.classList.contains('menu-open')){ r.classList.remove('barre-cachee'); y0=y; return; }
    if(y<60) r.classList.remove('barre-cachee');
    else if(dy>8) r.classList.add('barre-cachee');
    else if(dy<-8) r.classList.remove('barre-cachee');
    if(Math.abs(dy)>8 || y<60) y0=y;
    r.classList.toggle('barre-fond', y>10);
  };
  window.addEventListener('scroll', maj, {passive:true});
  window.addEventListener('hashchange', ()=>{ r.classList.remove('barre-cachee'); y0=window.scrollY; });
})();

// =========================================================================
//  TELEPHONE / TABLETTE : glisser le doigt pour ouvrir ou fermer le menu de gauche
// =========================================================================
(function(){
  let x0=null, y0=0, t0=0;
  const actif=()=>{ const tb=document.getElementById('topbar'); return tb && getComputedStyle(tb).display!=='none'; };
  document.addEventListener('touchstart', e=>{
    if(e.touches.length!==1 || !actif()){ x0=null; return; }
    const t=e.touches[0], el=e.target;
    // pas de geste depuis un champ, un curseur, ou une zone qui defile deja horizontalement
    if(el.closest && el.closest('input,textarea,select,.zoom-ov')){ x0=null; return; }
    let p=el; while(p && p!==document.body){ if(p.scrollWidth>p.clientWidth+2 && /(auto|scroll)/.test(getComputedStyle(p).overflowX)){ x0=null; return; } p=p.parentElement; }
    x0=t.clientX; y0=t.clientY; t0=Date.now();
  }, {passive:true});
  document.addEventListener('touchend', e=>{
    if(x0===null) return; const t=e.changedTouches[0]; const dx=t.clientX-x0, dy=t.clientY-y0, dt=Date.now()-t0; const depart=x0; x0=null;
    if(dt>800 || Math.abs(dx)<70 || Math.abs(dx)<Math.abs(dy)*1.8) return;
    const ouvert=document.body.classList.contains('menu-open');
    // ouverture : le geste ne part pas du bord de l'ecran (reserve au "retour" du telephone)
    if(dx>0 && !ouvert && depart>24) openMenu();
    else if(dx<0 && ouvert) closeMenu();
  }, {passive:true});
})();

// ---- Copier le lien de partage (adresse sans # : noozbar.com/route/) ----
function lienPartage(){
  const route = (ROUTER==='hash' ? (location.hash||'#/').slice(1) : location.pathname) || '/';
  let p = route.split('#')[0].replace(/\/?$/,'/');
  // page Presentation d'un script : on partage la section en cours de lecture (ex. /fps-tps/profile-mods/)
  const sec = document.querySelector('#nav .nav-section.active');
  if(activeScript && activeId==='accueil' && sec && sec.dataset.section && !/^__/.test(sec.dataset.section) && window.scrollY>150) p += sec.dataset.section + '/';
  return location.origin.replace(/^http:\/\/(127|localhost).*/,'https://noozbar.com') + p;
}
document.addEventListener('click', e=>{
  const b = e.target.closest && e.target.closest('.copie-lien'); if(!b) return;
  const url = lienPartage();
  const ok = ()=>{ const sp=b.querySelector('span'); sp.textContent=T('copie'); b.classList.add('ok'); setTimeout(()=>{ sp.textContent=T('copier'); b.classList.remove('ok'); }, 1800); };
  const repli = ()=>{ const t=document.createElement('textarea'); t.value=url; t.style.position='fixed'; t.style.opacity='0'; document.body.appendChild(t); t.select(); try{ document.execCommand('copy'); }catch(err){} t.remove(); ok(); };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, repli); else repli();
});
