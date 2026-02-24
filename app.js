  // DEBUG - Vérifie que le script est chargé
console.log('✅ app.js chargé !');

 
// PARTIE A — Menu burger accessible
 
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

console.log('🍔 Burger:', burger);
console.log('📱 Nav:', nav);

if (burger && nav) {
  burger.addEventListener('click', function() {
    console.log('🖱️ Click détecté !');
    
    // Alterne l'attribut hidden
    if (nav.hasAttribute('hidden')) {
      nav.removeAttribute('hidden');
      burger.setAttribute('aria-expanded', 'true');
      console.log('✅ Menu ouvert');
    } else {
      nav.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      console.log('❌ Menu fermé');
    }
  });
} else {
  console.error('❌ Burger ou Nav introuvable !');
  console.log('Burger existe ?', !!burger);
  console.log('Nav existe ?', !!nav);
}

// Fermeture avec Échap
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && nav && !nav.hasAttribute('hidden')) {
    nav.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
    console.log('⌨️ Menu fermé avec Échap');
  }
});

// PARTIE B — Thème clair/sombre persistant
 
const root = document.documentElement;
const KEY = 'theme-dark';
const toggle = document.getElementById('themeToggle');

console.log('🎨 Toggle:', toggle);

if (toggle) {
  // À l'ouverture
  const saved = localStorage.getItem(KEY) === '1';
  root.classList.toggle('theme-dark', saved);
  toggle.checked = saved;
  console.log('💾 Thème chargé:', saved ? 'dark' : 'light');
  
  // À l'action
  toggle.addEventListener('change', function(e) {
    const isDark = e.target.checked;
    root.classList.toggle('theme-dark', isDark);
    localStorage.setItem(KEY, isDark ? '1' : '0');
    console.log('🔄 Thème changé:', isDark ? 'dark' : 'light');
  });
}
 
// PARTIE C — Validation de formulaire
 
const form = document.querySelector('form');

function showError(el, msg) {
  el.setAttribute('aria-invalid', 'true');
  const p = document.createElement('p');
  p.setAttribute('role', 'alert');
  p.style.color = '#c1121f';
  p.style.margin = '0.25rem 0 0.5rem';
  p.textContent = msg;
  el.insertAdjacentElement('afterend', p);
}

if (form) {
  form.addEventListener('submit', function(e) {
    let ok = true;
    const nom = form.querySelector('#nom');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    // Reset des erreurs
    form.querySelectorAll('[role="alert"]').forEach(n => n.remove());
    [nom, email, message].forEach(el => el?.setAttribute('aria-invalid', 'false'));
    
    // Validation Nom
    if (nom && !nom.value.trim()) {
      ok = false;
      showError(nom, 'Le nom est requis.');
    }
    
    // Validation Email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      ok = false;
      showError(email, 'Email invalide.');
    }
    
    // Validation Message
    if (message && message.value.trim().length < 10) {
      ok = false;
      showError(message, '10 caractères minimum.');
    }
    
    if (!ok) {
      e.preventDefault();
      console.log('❌ Formulaire invalide');
    } else {
      console.log('✅ Formulaire valide');
    }
  });
  
  // Validation live sur input
  [form.querySelector('#nom'), form.querySelector('#email'), form.querySelector('#message')].forEach(el => {
    if (!el) return;
    
    el.addEventListener('input', function() {
      if (el.getAttribute('aria-invalid') === 'true') {
        const nextAlert = el.nextElementSibling;
        if (nextAlert && nextAlert.getAttribute('role') === 'alert') {
          nextAlert.remove();
          el.setAttribute('aria-invalid', 'false');
        }
      }
    });
  });
}

// PARTIE D — Compteur de caractères

const msg = document.getElementById('message');
const out = document.getElementById('restant');

if (msg && out) {
  msg.addEventListener('input', function() {
    const max = msg.maxLength || 280;
    out.textContent = max - msg.value.length;
  });
  console.log('✅ Compteur de caractères activé');
}

// PARTIE E — Charger des projets via JSON

async function chargerProjets() {
  const root = document.getElementById('liste-projets');
  if (!root) {
    console.log('ℹ️ Page projets non détectée');
    return;
  }
  
  console.log('📦 Chargement des projets...');
  
  try {
    const res = await fetch('projets.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    
    console.log('✅ Projets chargés:', data);
    
    root.innerHTML = '';
    
    for (const p of data) {
      const card = document.createElement('article');
      card.className = 'carte';
      card.dataset.tag = p.tag;
      card.innerHTML = `
        <img src="${p.img}" alt="${p.titre}">
        <h3>${p.titre}</h3>
        <p>${p.desc}</p>
        <a class="btn" href="#">Voir</a>
      `;
      root.appendChild(card);
    }
    
    console.log('✅ Cartes créées:', root.children.length);
    
  } catch (err) {
    root.textContent = 'Impossible de charger les projets.';
    console.error('❌ Erreur fetch:', err);
  }
}

// Charger les projets si on est sur la page projets
if (document.getElementById('liste-projets')) {
  chargerProjets();
}

// Année dans le footer
const anneeElement = document.getElementById('annee');
if (anneeElement) {
  anneeElement.textContent = new Date().getFullYear();
  console.log('✅ Année mise à jour');
}

console.log('🎉 app.js terminé !');