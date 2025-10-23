// === Utilities ===
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Populate year
document.getElementById('year').textContent = new Date().getFullYear();

// === Mobile nav toggle ===
const burger = $('#burger');
const navLinks = $('#navLinks');
burger && burger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? '' : 'flex';
});

// === Smooth scroll for nav links ===
$$('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
    // close mobile menu
    if (window.innerWidth <= 1000) navLinks.style.display = '';
  });
});

// === Typing effect (simple) ===
const phrases = ['Front-end Developer', 'Full-stack Enthusiast', 'Problem Solver', 'Open to Opportunities'];
const typedEl = document.getElementById('typed');
let tIdx = 0, charIdx = 0, forward = true;
function typeLoop(){
  const txt = phrases[tIdx];
  if(forward){
    charIdx++;
    if(charIdx > txt.length){ forward = false; setTimeout(typeLoop, 900); return; }
  } else {
    charIdx--;
    if(charIdx < 0){ forward = true; tIdx = (tIdx + 1) % phrases.length; setTimeout(typeLoop, 300); return; }
  }
  typedEl.textContent = txt.slice(0, charIdx);
  setTimeout(typeLoop, forward ? 80 : 35);
}
typeLoop();

// === Scroll reveal using IntersectionObserver ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('inview');
  });
}, {threshold: 0.12});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// === Skill bar fill (on reveal) ===
document.querySelectorAll('.fill').forEach(el => {
  const val = getComputedStyle(el).getPropertyValue('--pct') || '80%';
  el.style.width = '0%';
  // when parent becomes inview, set width
  const parent = el.closest('.reveal') || el;
  new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) el.style.width = val;
  }, {threshold:0.2}).observe(parent);
});

// === Project modal ===
const projButtons = $$('.view-project');
const modal = $('#projModal');
const modalClose = $('#modalClose');
const modalImg = $('#modalImg');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalLink = $('#modalLink');

projButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    modalImg.src = card.dataset.img || 'images/default.jpg';
    modalTitle.textContent = card.dataset.title || 'Project';
    modalDesc.textContent = card.dataset.desc || '';
    modalLink.href = card.dataset.link || '#';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  });
});
modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
});
modal.addEventListener('click', (e) => {
  if(e.target === modal) modalClose.click();
});

// === Contact form (simple client-side) ===
const contactForm = $('#contactForm');
contactForm && contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  if(!name || !email || !message){ alert('Please fill all fields'); return; }
  // For demo: open mailto with prefilled body (replace by API/backend as needed)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:youremail@example.com?subject=Portfolio%20contact%20from%20${encodeURIComponent(name)}&body=${body}`;
});
