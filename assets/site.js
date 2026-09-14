window.dataLayer = window.dataLayer || [];

document.addEventListener('click', function (event) {
  var link = event.target.closest('a');
  if (!link) return;
  var href = link.getAttribute('href') || '';
  var eventName = href.indexOf('tel:') === 0 ? 'call_click' : href.indexOf('sms:') === 0 ? 'sms_click' : link.classList.contains('js-estimate') ? 'estimate_click' : null;
  if (eventName && typeof gtag === 'function') {
    gtag('event', eventName, { link_text: (link.textContent || '').trim(), link_url: href });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Keep every header-logo link pointed at the canonical homepage URL.
  document.querySelectorAll('a.brand').forEach(function (link) {
    link.setAttribute('href', '/');
  });

  // Remove a service page from its own "Related repair services" module.
  var normalizePath = function (pathname) {
    var path = pathname || '/';
    path = path.replace(/\/index\.html$/i, '/');
    if (path.charAt(path.length - 1) !== '/' && path.indexOf('.') === -1) path += '/';
    return path;
  };
  var currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll('section.section').forEach(function (section) {
    var eyebrow = section.querySelector('.eyebrow');
    if (!eyebrow || eyebrow.textContent.trim().toLowerCase() !== 'related repair services') return;

    section.querySelectorAll('article.card').forEach(function (card) {
      var link = card.querySelector('a[href]');
      if (!link) return;
      try {
        var targetPath = normalizePath(new URL(link.getAttribute('href'), window.location.href).pathname);
        if (targetPath === currentPath) card.remove();
      } catch (error) {
        // Leave an unparseable link untouched.
      }
    });
  });

  // Correct template-generated lowercase city-name headings.
  document.querySelectorAll('h1, h2, h3').forEach(function (heading) {
    heading.innerHTML = heading.innerHTML.replace(/\bphoenix\b/g, 'Phoenix');
  });

  if (!document.querySelector('link[rel="icon"]')) {
    var favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.sizes = '96x96';
    favicon.href = '/favicon.png';
    document.head.appendChild(favicon);
  }

  document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
    try {
      var data = JSON.parse(node.textContent);
      var logoUrl = 'https://desertdreamco.com/images/logo.webp';

      function normalize(value) {
        if (Array.isArray(value)) {
          value.forEach(normalize);
          return;
        }
        if (!value || typeof value !== 'object') return;

        if (value['@type'] === 'LocalBusiness') {
          value['@type'] = 'Organization';
        }

        if (value['@id'] === 'https://fixmyblockfence.com/#business') {
          value['@id'] = 'https://fixmyblockfence.com/#organization';
        }

        Object.keys(value).forEach(function (key) {
          if (typeof value[key] === 'string' && value[key] === 'https://fixmyblockfence.com/#business') {
            value[key] = 'https://fixmyblockfence.com/#organization';
          } else {
            normalize(value[key]);
          }
        });

        if (value['@type'] === 'Organization' && !value.logo) {
          value.logo = logoUrl;
        }
      }

      normalize(data);
      node.textContent = JSON.stringify(data);
    } catch (error) {
      // Leave malformed JSON-LD untouched rather than breaking the page.
    }
  });
});