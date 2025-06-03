// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  window.exitApplication = false;

  // ==========================================
  // COMPONENTES Y EVENTOS GENERALES
  // ==========================================
  setupUIComponents();
  setupThemeSelector();
  setupPasswordToggles(); // Agregar aquí
  switchTab('dashboard');
});

function setupUIComponents() {
  setupSidebarNavigation();
  setupSubTabs();
  setupModals();
  initializeTooltips();
}

// ==========================================
// Handler para el evento beforeunload
// ==========================================
function handleBeforeUnload(e) {
  if (window.exitApplication) {
    delete e.returnValue;
    return;
  }

  e.preventDefault();
  e.returnValue = '¿Está seguro que desea salir?';
}

// ==========================================
// Configuración de navegación en sidebar
// ==========================================
function setupSidebarNavigation() {
  const menuItems = document.querySelectorAll('.menu li');
  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

// ==========================================
// Configuración de subtabs
// ==========================================
function setupSubTabs() {
  const subTabs = document.querySelectorAll('.tabs .tab');
  subTabs.forEach(tab => {
    tab.addEventListener('click', function (event) {
      const tabId = this.getAttribute('data-subtab');
      switchSubTab(event, tabId);
    });
  });
}

// ==========================================
// Configuración de modales
// ==========================================
function setupModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  const modals = document.querySelectorAll('.modal');

  // Abrir modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      openModal(modal);
      
      // Re-inicializar toggles cuando se abre el modal
      setTimeout(() => {
        setupPasswordToggles();
      }, 100);
    });
  });

  // Cerrar modal con botón
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function () {
      closeModal(this.closest('.modal'));
    });
  });

  // Cerrar modal al hacer clic fuera
  modals.forEach(modal => {
    modal.addEventListener('click', function (event) {
      if (event.target === this) {
        closeModal(this);
      }
    });
  });

  // Cerrar modal con Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });
}

// ==========================================
// Funciones para navegación entre tabs
// ==========================================
function switchTab(tabId) {
  const menuItems = document.querySelectorAll('.menu li');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  menuItems.forEach(item => {
    item.classList.remove('active');
  });

  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  const selectedMenuItem = document.querySelector(`.menu li[data-tab="${tabId}"]`);
  const selectedContent = document.getElementById(tabId);

  if (selectedMenuItem) {
    selectedMenuItem.classList.add('active');
  }

  if (selectedContent) {
    selectedContent.classList.add('active');
  }

  if (pageTitle && selectedMenuItem) {
    pageTitle.textContent = selectedMenuItem.textContent.trim();
  }
}

function switchSubTab(event, tabId) {
  const parentTabs = event.currentTarget.closest('.tabs');
  const relatedSubTabs = parentTabs.querySelectorAll('.tab');
  const tabPanel = event.currentTarget.closest('section');
  const relatedContents = tabPanel.querySelectorAll('.subtab-content');

  relatedSubTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  relatedContents.forEach(content => {
    content.classList.remove('active');
  });

  event.currentTarget.classList.add('active');
  event.currentTarget.setAttribute('aria-selected', 'true');

  const selectedContent = document.getElementById(tabId);
  if (selectedContent) {
    selectedContent.classList.add('active');
  }
}

// ==========================================
// Funciones para manejo de modales
// ==========================================
function openModal(modal) {
  if (!modal) return;

  modal.style.display = 'flex';

  setTimeout(() => {
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      firstInput.focus();
    }
  }, 100);
}

function closeModal(modal) {
  if (!modal) return;
  modal.style.display = 'none';
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

// ==========================================
// Modal Universal
// ==========================================
function showUniversalModal(title, message, buttons = []) {
  const modal = document.getElementById('universalModal');
  const titleElement = document.getElementById('universalModalTitle');
  const messageElement = document.getElementById('universalModalMessage');
  const footerElement = document.getElementById('universalModalFooter');

  if (!modal || !titleElement || !messageElement || !footerElement) return;

  titleElement.textContent = title || 'Mensaje';
  messageElement.textContent = message || '';
  footerElement.innerHTML = '';
  modal.style.zIndex = '9999';

  if (!buttons || buttons.length === 0) {
    buttons = [{ text: 'Aceptar', class: 'btn-primary' }];
  }

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.text || 'Aceptar';
    button.className = `btn ${btn.class || 'btn-primary'}`;
    button.addEventListener('click', () => {
      if (typeof btn.onClick === 'function') btn.onClick();
      closeModal(modal);
    });
    footerElement.appendChild(button);
  });

  openModal(modal);
}

function initializeTooltips() {
  const buttons = document.querySelectorAll('button[aria-label]');

  buttons.forEach(button => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = button.getAttribute('aria-label');
    button.appendChild(tooltip);

    button.addEventListener('mouseenter', () => {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    });

    button.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    });
  });
}

// Utilidad para capitalizar textos
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ==========================================
// Funciones de utilidad
// ==========================================
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  let isValid = true;

  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });

  const numericFields = form.querySelectorAll('[type="number"]');
  numericFields.forEach(field => {
    const value = parseFloat(field.value);
    if (isNaN(value) || value < 0) {
      isValid = false;
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  });

  return isValid;
}

// ==========================================
// Función para cambiar los temas
// ==========================================
function setupThemeSelector() {
  const themeSelector = document.getElementById('themeSelector');
  if (!themeSelector) return;

  const body = document.body;
  const savedTheme = localStorage.getItem('selectedTheme') || 'ThemeDark';

  body.className = savedTheme;
  themeSelector.value = savedTheme;

  themeSelector.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    body.className = selectedTheme;
    localStorage.setItem('selectedTheme', selectedTheme);
  });
}

// ==========================================
// Función para mostrar/ocultar contraseña
// ==========================================
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = inputId === 'userPassword' ? 
        document.getElementById('eyeIcon') : 
        document.getElementById('eyeIcon2');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
        eyeIcon.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
        eyeIcon.setAttribute('aria-label', 'Mostrar contraseña');
    }
}