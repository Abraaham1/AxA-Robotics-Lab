/* ==========================================================================
   Contact form — client-side validation.
   This is a static site with no backend, so "submission" here validates
   the fields and shows a success message; it does not send data anywhere.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const statusBox = document.querySelector('.form-status');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = {
    name: {
      el: form.querySelector('#field-name'),
      validate: (v) => v.trim().length >= 2,
      message: 'Enter your name (at least 2 characters).',
    },
    email: {
      el: form.querySelector('#field-email'),
      validate: (v) => emailPattern.test(v.trim()),
      message: 'Enter a valid email address.',
    },
    subject: {
      el: form.querySelector('#field-subject'),
      validate: (v) => v.trim().length >= 3,
      message: 'Enter a short subject line.',
    },
    message: {
      el: form.querySelector('#field-message'),
      validate: (v) => v.trim().length >= 10,
      message: 'Message should be at least 10 characters.',
    },
  };

  const setFieldError = (key, hasError) => {
    const wrapper = fields[key].el.closest('.form-field');
    wrapper.classList.toggle('has-error', hasError);
  };

  const validateField = (key) => {
    const { el, validate } = fields[key];
    const isValid = validate(el.value);
    setFieldError(key, !isValid);
    return isValid;
  };

  // Validate on blur for immediate feedback, not on every keystroke
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    statusBox.classList.remove('is-visible', 'is-success', 'is-error');

    if (allValid) {
      statusBox.textContent = 'Message sent. Thanks for reaching out — expect a reply soon.';
      statusBox.classList.add('is-visible', 'is-success');
      form.reset();
    } else {
      statusBox.textContent = 'Please fix the highlighted fields before sending.';
      statusBox.classList.add('is-visible', 'is-error');
    }

    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
