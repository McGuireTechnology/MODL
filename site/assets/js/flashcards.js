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
    const flashcardDivs = document.querySelectorAll('div.flashcards');
    if (flashcardDivs.length === 0) return;
    
    flashcardDivs.forEach(node=>{
      // Skip if already initialized
      if(node.hasAttribute('data-flashcards-initialized')) return;
      node.setAttribute('data-flashcards-initialized', 'true');
      
      const cards = parseCards(node);
      if(cards.length){
        renderCards(node, cards);
      }
    });
  }

  // Run init continuously until flashcards are found or max attempts reached
  var initAttempts = 0;
  var maxAttempts = 20;
  function aggressiveInit() {
    init();
    initAttempts++;
    if (initAttempts < maxAttempts) {
      requestAnimationFrame(aggressiveInit);
    }
  }

  // Start aggressive initialization
  function startInit() {
    initAttempts = 0;
    aggressiveInit();
  }

  // Initialize on page load
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startInit);
  } else {
    startInit();
  }

  // Listen for MkDocs Material instant navigation events
  document.addEventListener('DOMContentLoaded', function() {
    // MkDocs Material emits custom navigation events
    var app = document.querySelector("[data-md-component=container]");
    if (app) {
      // Observer for any content changes
      var observer = new MutationObserver(function(mutations) {
        var hasChanges = false;
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
            hasChanges = true;
          }
        });
        if (hasChanges) {
          // Reset and run aggressive init again
          startInit();
        }
      });

      observer.observe(app, {
        childList: true,
        subtree: true
      });
    }
  });

  // Also listen for location.href changes (instant navigation fallback)
  if (typeof window !== 'undefined') {
    var lastLocation = window.location.href;
    
    // Use both setInterval and popstate
    setInterval(function() {
      if (window.location.href !== lastLocation) {
        lastLocation = window.location.href;
        startInit();
      }
    }, 100); // Check more frequently
    
    window.addEventListener('popstate', function() {
      startInit();
    });
    
    // Listen for hash changes too
    window.addEventListener('hashchange', function() {
      startInit();
    });
  }

  // Backup: Re-run init every 2 seconds for the first 10 seconds
  var backupTimer = 0;
  var backupInterval = setInterval(function() {
    init();
    backupTimer += 2000;
    if (backupTimer >= 10000) {
      clearInterval(backupInterval);
    }
  }, 2000);
})();
