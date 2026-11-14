const PANEL_LABELS = {
  hint: { show: 'Afficher l\'indice', hide: 'Masquer l\'indice' },
  answer: { show: 'Afficher la réponse', hide: 'Masquer la réponse' },
};

function setPanelOpen(section, toggleButton, isOpen) {
  const panelName = toggleButton.dataset.panel;
  section.querySelector(`[data-panel-content="${panelName}"]`).hidden = !isOpen;
  toggleButton.setAttribute('aria-expanded', String(isOpen));
  const label = isOpen ? PANEL_LABELS[panelName].hide : PANEL_LABELS[panelName].show;
  // Icon buttons keep their icon: only their tooltip and accessible name change.
  if (toggleButton.classList.contains('icon-button')) {
    toggleButton.title = label;
    toggleButton.setAttribute('aria-label', label);
  } else {
    toggleButton.textContent = label;
  }
}

// Only one panel open at a time: opening the hint closes the answer, and vice versa.
function togglePanel(section, toggleButton) {
  const isOpen = toggleButton.getAttribute('aria-expanded') !== 'true';
  if (isOpen) {
    for (const otherButton of section.querySelectorAll('[data-panel]')) {
      if (otherButton !== toggleButton) {
        setPanelOpen(section, otherButton, false);
      }
    }
  }
  setPanelOpen(section, toggleButton, isOpen);
}

function setFieldWrong(input, isWrong) {
  input.classList.toggle('is-wrong', isWrong);
  if (isWrong) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

function setFeedback(section, text, stateClass) {
  const feedback = section.querySelector('.feedback');
  feedback.textContent = text;
  feedback.className = `feedback ${stateClass}`;
}
