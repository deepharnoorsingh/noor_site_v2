function sendMessage(e){
  e.preventDefault();
  const s = document.getElementById('status');
  if(s){ s.textContent = 'Thanks — your message has been recorded (demo).'; }
  e.target.reset();
  return false;
}

// Minimal lightbox: open image links in an overlay
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
