(function(){
  // Simple flashcards scaffold: look for <div class="flashcards" data-cards='[{"q":"...","a":"..."}]'>
  // Renders a basic flip UI. You can add such a div in any page to enable cards.
  function parseCards(node){
    try {
      const raw = node.getAttribute('data-cards');
      if(!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(c=>c && c.q && c.a) : [];
    } catch { return []; }
  }

  function renderCards(node, cards){
    node.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
    wrap.style.gap = '12px';

    cards.forEach((c, idx)=>{
  const card = document.createElement('div');
  card.className = 'flashcard';
  card.style.border = '1px solid #e0e0e0';
  card.style.borderRadius = '8px';
  card.style.padding = '12px';
  card.style.background = 'white';
  card.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';

      const q = document.createElement('div');
      q.textContent = c.q;
      q.style.fontWeight = '600';
      q.style.marginBottom = '8px';

      const a = document.createElement('div');
      a.textContent = c.a;
      a.style.display = 'none';
      a.style.marginTop = '8px';

  const btn = document.createElement('button');
  btn.textContent = 'Show Answer';
  btn.className = 'flashcard-toggle';
  btn.style.fontSize = '0.9rem';
  btn.style.padding = '6px 10px';
  btn.style.borderRadius = '6px';
  btn.style.border = '1px solid var(--md-default-fg-color--lighter, #d0d0d0)';
  // Do not set background or color inline; allow CSS theme to provide accessible contrast.
      btn.addEventListener('click', ()=>{
        const showing = a.style.display !== 'none';
        a.style.display = showing ? 'none' : 'block';
        btn.textContent = showing ? 'Show Answer' : 'Hide Answer';
      });

      card.appendChild(q);
      card.appendChild(btn);
      card.appendChild(a);
      wrap.appendChild(card);
    });

    node.appendChild(wrap);
  }

  function init(){
    document.querySelectorAll('div.flashcards').forEach(node=>{
      // Skip if already initialized
      if(node.hasAttribute('data-flashcards-initialized')) return;
      node.setAttribute('data-flashcards-initialized', 'true');
      
      const cards = parseCards(node);
      if(cards.length){
        renderCards(node, cards);
      }
    });
  }

  // Handle initial page load
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle MkDocs Material instant navigation
  // Re-initialize flashcards when content changes
  document.addEventListener('DOMContentLoaded', function() {
    // MkDocs Material uses 'instant' navigation which fires custom events
    var observer = new MutationObserver(function(mutations) {
      var hasNewFlashcards = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.classList && node.classList.contains('flashcards')) {
              hasNewFlashcards = true;
            } else if (node.querySelector && node.querySelector('.flashcards')) {
              hasNewFlashcards = true;
            }
          }
        });
      });
      if (hasNewFlashcards) {
        setTimeout(init, 100);
      }
    });

    // Observe the main content area for changes
    var content = document.querySelector('.md-content');
    if (content) {
      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }
  });

  // Also listen for location changes (works with instant navigation)
  if (typeof window !== 'undefined') {
    var lastLocation = window.location.href;
    setInterval(function() {
      if (window.location.href !== lastLocation) {
        lastLocation = window.location.href;
        setTimeout(init, 200);
      }
    }, 500);
  }
})();
