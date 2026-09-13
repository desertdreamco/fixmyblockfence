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

  document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
    var markup = node.textContent;
    if (markup.indexOf('LocalBusiness') !== -1) {
      markup = markup.split('LocalBusiness').join('Organization');
      markup = markup.split('#business').join('#organization');
      node.textContent = markup;
    }
  });
});