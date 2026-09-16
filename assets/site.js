window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, parameters) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, parameters || {});
  }
}

document.addEventListener('click', function (event) {
  var link = event.target.closest('a');
  if (!link) return;

  var href = link.getAttribute('href') || '';
  var eventName = href.indexOf('tel:') === 0
    ? 'call_click'
    : href.indexOf('sms:') === 0
      ? 'sms_click'
      : null;

  if (eventName) {
    trackEvent(eventName, {
      link_text: (link.textContent || '').trim(),
      link_url: href
    });
  }
});

var startedTallyForms = {};

window.addEventListener('message', function (event) {
  if (event.origin !== 'https://tally.so' || typeof event.data !== 'string') return;
  if (event.data.indexOf('Tally.') === -1) return;

  var message;
  try {
    message = JSON.parse(event.data);
  } catch (error) {
    return;
  }

  var eventName = message.event;
  var payload = message.payload || {};
  var formId = payload.formId || 'unknown';

  if (eventName === 'Tally.FormLoaded') {
    trackEvent('estimate_form_view', { form_id: formId });
  }

  if (eventName === 'Tally.FormPageView' && !startedTallyForms[formId]) {
    startedTallyForms[formId] = true;
    trackEvent('estimate_form_start', { form_id: formId });
  }

  if (eventName === 'Tally.FormSubmitted') {
    trackEvent('generate_lead', {
      form_id: formId,
      form_name: payload.formName || 'Block Wall Estimate'
    });
  }
});
