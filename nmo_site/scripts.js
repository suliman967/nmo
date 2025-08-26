// scripts.js - small helpers for the NMO landing
document.addEventListener('DOMContentLoaded', function(){
  // set current year in copyright
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // prevent page from scrolling on desktop (safety - redundant with CSS)
  function preventScroll(e){ if(window.innerWidth>900){ e.preventDefault(); } }
  // not enabling wheel prevention to avoid accessibility issues, CSS handles most cases.

  // small accessibility: focus first input when tabbing into form
  const firstInput = document.querySelector('.formkit-input');
  if(firstInput) firstInput.setAttribute('aria-label','Your email address');
});
