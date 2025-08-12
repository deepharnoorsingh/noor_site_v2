// ====== Utility ======
function qs(sel, ctx=document) { return ctx.querySelector(sel); }
function qsa(sel, ctx=document) { return [...ctx.querySelectorAll(sel)]; }

// ====== Contact form (swap to Formspree/Netlify later) ======
async function sendMessage(e){
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');

  // TEMP: send to email service later; for now show success.
  if(status){ status.textContent = 'Thanks — we received your request. We’ll call or email shortly.'; }
  form.reset();
  return false;
}

// live counter if you want it (textarea has oninput="countChars(this)")
function countChars(el, max = 1000){
  let hint = el.closest('form')?.querySelector('.form-hint');
  if(!hint){
    hint = document.createElement('div');
    hint.className = 'form-hint';
    el.closest('form')?.appendChild(hint);
  }
  const len = el.value.length;
  hint.textContent = `${len}/${max}`;
}

// ====== Minimal lightbox ======
document.addEventListener('click', function(e){
  const a = e.target.closest('a[data-lightbox]');
  if(!a) return;
  e.preventDefault();
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
  const img = document.createElement('img');
  img.src = a.getAttribute('href');
  img.style.maxWidth = '95%';
  img.style.maxHeight = '95%';
  img.style.borderRadius = '12px';
  overlay.appendChild(img);
  overlay.addEventListener('click', ()=> document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}, false);

// ====== Header: hamburger toggle ======
(function initHamburger(){
  const btn = qs('.hamburger');
  const panel = qs('.mobile-panel');
  if(!btn || !panel) return;
  const open = (v) => {
    panel.hidden = !v;
    panel.dataset.open = v ? 'true' : 'false';
    panel.setAttribute('aria-hidden', v ? 'false' : 'true');
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
  };
  open(false);
  btn.addEventListener('click', ()=>{
    const isOpen = panel.dataset.open === 'true';
    open(!isOpen);
  });
  // close on escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') open(false);
  });
})();
// ====== Reliable form submit to FormSubmit ======
(function wireForms(){
  const forms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');
  forms.forEach(form=>{
    form.addEventListener('submit', async (e)=>{
      // Let browser block if required fields are empty
      if(!form.checkValidity()){ return; }
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"], .qsubmit');
      const next = form.querySelector('input[name="_next"]')?.value || 'thank-you.html';
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      try{
        // Send the POST without navigating away
        await fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' });

        // UX: inline success state (no page redirect)
        const submitBtn = form.querySelector('button[type="submit"], .qsubmit');
        if (submitBtn) { submitBtn.textContent = 'Sent!'; }

        // Prefer an existing #status element if present
        const status = document.getElementById('status');
        const message = 'Thanks — we received your request. We’ll contact you shortly.\nIf it’s urgent, call (587) 830‑4062.';
        if (status) {
          status.textContent = message;
        } else {
          const confirm = document.createElement('div');
          confirm.className = 'form-confirm';
          confirm.style.cssText = 'margin-top:12px;font-weight:600;color:var(--fg)';
          confirm.textContent = message;
          form.parentNode.insertBefore(confirm, form.nextSibling);
        }
        form.reset();
      } catch(err){
        console.error('Form submit failed:', err);
        alert('Could not send. Please call (587) 830‑4062 or email noorprojectsinc@gmail.com.');
        const submitBtn = form.querySelector('button[type="submit"], .qsubmit');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
      }
    }, { once: false });
  });
})();