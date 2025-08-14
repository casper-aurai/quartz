/* Initialize Mermaid and re-render on SPA navigation if available */
(function () {
  function render() {
    if (window.mermaid) {
      try {
        window.mermaid.initialize({ startOnLoad: false });
        window.mermaid.run({ querySelector: '.mermaid' });
      } catch (e) {
        console.warn('Mermaid init failed:', e);
      }
    }
  }
  document.addEventListener('DOMContentLoaded', render);
  // Some SPA docs frameworks emit window.document$ for navigation events
  if (window && window.document$) {
    window.document$.subscribe(render);
  }
})();
