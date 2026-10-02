/* Korean stays in the HTML. translations.js contains [English, Japanese] copy. */
(() => {
  'use strict';
  const dictionary = window.CAPITAL_TRANSLATIONS;
  const masthead = document.querySelector('.masthead');
  if (!dictionary || !masthead) return;

  const languages = ['ko', 'en', 'ja'];
  const storageKey = 'capital-dispatch-language';
  const normalize = (text) => text.replace(/\s+/g, ' ').trim();
  const records = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, noscript')) continue;
    const source = normalize(node.nodeValue);
    if (Object.hasOwn(dictionary, source)) {
      records.push({ node, original: node.nodeValue, source });
    }
  }
  document.querySelectorAll('[alt], [aria-label], meta[name="description"]').forEach((node) => {
    for (const attribute of ['alt', 'aria-label', 'content']) {
      if (!node.hasAttribute(attribute)) continue;
      const original = node.getAttribute(attribute);
      const source = normalize(original);
      if (Object.hasOwn(dictionary, source)) records.push({ node, attribute, original, source });
    }
  });

  const toolbar = document.createElement('nav');
  toolbar.className = 'language-switch';
  const buttons = languages.map((language, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.lang = language;
    button.textContent = ['한국어', 'English', '日本語'][index];
    button.addEventListener('click', () => applyLanguage(language));
    toolbar.append(button);
    return button;
  });
  masthead.prepend(toolbar);

  const links = [...document.querySelectorAll('.bottom-nav a')].map((node) => ({
    node, original: node.getAttribute('href'),
  }));
  const restrictedLink = document.querySelector('.bottom-nav a[href="unsafe.html"]');
  const galleryFooter = document.querySelector('.gallery-lead') && document.querySelector('.page-footer p:last-child');
  const footerOriginal = galleryFooter?.textContent;

  function readLanguage() {
    const requested = new URL(location.href).searchParams.get('lang');
    if (languages.includes(requested)) return requested;
    try {
      const saved = localStorage.getItem(storageKey);
      if (languages.includes(saved)) return saved;
    } catch { /* Language links still work when browser storage is unavailable. */ }
    return 'ko';
  }

  function applyLanguage(language) {
    if (!languages.includes(language)) language = 'ko';
    const index = language === 'ja' ? 1 : 0;
    for (const record of records) {
      const translated = language === 'ko' ? record.original : dictionary[record.source][index];
      if (record.attribute) record.node.setAttribute(record.attribute, translated);
      else {
        // Keep whitespace around inline elements (badges, labels, and headings).
        const leading = record.original.match(/^\s*/)[0];
        const trailing = record.original.match(/\s*$/)[0];
        record.node.nodeValue = language === 'ko' ? record.original : leading + translated + trailing;
      }
    }
    document.documentElement.lang = language;
    toolbar.setAttribute('aria-label', { ko: '언어 선택', en: 'Select language', ja: '言語を選択' }[language]);
    buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(languages[position] === language)));
    if (restrictedLink) restrictedLink.hidden = language !== 'ko';
    document.querySelector('.bottom-nav')?.classList.toggle('bottom-nav--public', language !== 'ko');
    if (galleryFooter) galleryFooter.textContent = language === 'ko' ? footerOriginal : 'END OF PUBLIC RECORD';
    for (const { node, original } of links) {
      if (original === 'unsafe.html') continue;
      const url = new URL(original, location.href);
      url.searchParams.set('lang', language);
      node.setAttribute('href', `${original.split('?')[0]}${url.search}${url.hash}`);
    }
    try { localStorage.setItem(storageKey, language); } catch { /* Private browsing fallback. */ }
    try {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    } catch { /* Some file:// viewers do not support history.replaceState. */ }
  }
  window.addEventListener('popstate', () => applyLanguage(readLanguage()));
  applyLanguage(readLanguage());
})();
