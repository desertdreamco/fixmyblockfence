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
  document.querySelectorAll('a.brand').forEach(function (link) {
    link.setAttribute('href', '/');
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