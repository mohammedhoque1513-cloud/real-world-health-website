document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.main-nav');

  if (header && navToggle && nav) {
    const setMenuState = (isOpen) => {
      header.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
      const nextState = navToggle.getAttribute('aria-expanded') !== 'true';
      setMenuState(nextState);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuState(false);
      }
    });
  }

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const cards = Array.from(group.querySelectorAll('[data-card]'));
    const buttons = Array.from(group.querySelectorAll('[data-filter]'));
    const searchInput = group.querySelector('[data-search-input]');
    const countOutput = group.querySelector('[data-results-count]');

    let activeFilter = 'all';
    let searchTerm = '';

    const applyFilters = () => {
      let visibleCount = 0;

      cards.forEach((card) => {
        const category = (card.dataset.category || '').toLowerCase();
        const text = (card.dataset.search || card.textContent || '').toLowerCase();
        const matchesFilter = activeFilter === 'all' || category.split(' ').includes(activeFilter) || category.includes(activeFilter);
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const isVisible = matchesFilter && matchesSearch;

        card.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (countOutput) {
        countOutput.textContent = `${visibleCount} result${visibleCount === 1 ? '' : 's'}`;
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || 'all';
        buttons.forEach((item) => item.classList.toggle('is-active', item === button));
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        searchTerm = event.target.value.trim().toLowerCase();
        applyFilters();
      });
    }

    applyFilters();
  });

  const contactForm = document.querySelector('[data-contact-form]');

  if (contactForm) {
    const formPanel = contactForm.closest('.contact-form-panel');
    const status = contactForm.querySelector('[data-form-status]');
    const recipient = 'hello@realworldhealth.com';

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const organisation = (formData.get('organisation') || '').toString().trim();
      const jobTitle = (formData.get('job-title') || '').toString().trim();
      const interest = (formData.get('interest') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();
      const subject = `New enquiry from ${name || 'website visitor'}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organisation: ${organisation}`,
        `Job Title: ${jobTitle}`,
        `Area of Interest: ${interest}`,
        '',
        'Message:',
        message
      ].join('\n');

      if (formPanel) {
        formPanel.classList.add('is-submitted');
      }

      if (status) {
        status.textContent = 'Your email app should open with a draft message. If it does not, email hello@realworldhealth.com directly.';
      }

      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});


