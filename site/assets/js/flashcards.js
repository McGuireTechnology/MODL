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
      // Remove inline styles - let CSS handle it
      
      const q = document.createElement('div');
      q.className = 'flashcard-question';
      q.textContent = c.q;

      const a = document.createElement('div');
      a.className = 'flashcard-answer';
      a.textContent = c.a;
      a.style.display = 'none';

      const btn = document.createElement('button');
      btn.textContent = 'Show Answer';
      btn.className = 'flashcard-toggle';
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

  // Initialize immediately if DOM is ready, otherwise wait
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function() {
      init();
      // Run again after a short delay for late-loaded content
      setTimeout(init, 100);
      setTimeout(init, 300);
      setTimeout(init, 500);
    });
  } else {
    // DOM already loaded, run immediately and with delays
    init();
    setTimeout(init, 50);
    setTimeout(init, 150);
    setTimeout(init, 300);
  }

  // Handle MkDocs Material instant navigation with MutationObserver
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
      init();
      setTimeout(init, 50);
      setTimeout(init, 150);
    }
  });

  // Start observing once DOM is ready
  function startObserving() {
    var content = document.querySelector('.md-content') || document.querySelector('main') || document.body;
    if (content) {
      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }

  // Location polling for instant navigation
  if (typeof window !== 'undefined') {
    var lastLocation = window.location.href;
    setInterval(function() {
      if (window.location.href !== lastLocation) {
        lastLocation = window.location.href;
        init();
        setTimeout(init, 100);
        setTimeout(init, 300);
      }
    }, 500);
  }
})();
