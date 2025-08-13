/* Initialize Mermaid and re-render on MkDocs Material page changes */
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
  // MkDocs Material emits window.document$ for SPA navigation
  if (window && window.document$) {
    window.document$.subscribe(render);
  }
})();
