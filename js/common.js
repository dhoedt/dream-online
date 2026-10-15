const PANEL_LABELS = {
  hint: { show: 'Afficher l\'indice', hide: 'Masquer l\'indice' },
  answer: { show: 'Afficher la réponse', hide: 'Masquer la réponse' },
};

function togglePanel(section, toggleButton) {
  const panelName = toggleButton.dataset.panel;
  const panel = section.querySelector(`[data-panel-content="${panelName}"]`);
  panel.hidden = !panel.hidden;
  toggleButton.setAttribute('aria-expanded', String(!panel.hidden));
  toggleButton.textContent = panel.hidden ? PANEL_LABELS[panelName].show : PANEL_LABELS[panelName].hide;
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
