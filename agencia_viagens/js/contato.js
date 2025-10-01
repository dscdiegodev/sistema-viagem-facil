// JavaScript específico da página de contato

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
    setupFormValidation();
    setupEventListeners();
});

function initializeContactPage() {
    console.log('Página de contato inicializada');
    
    // Aplicar máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', applyPhoneMask);
    }
}

function setupEventListeners() {
    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }

    // Validação em tempo real
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Checkbox de termos
    const termosCheckbox = document.getElementById('termos');
    if (termosCheckbox) {
        termosCheckbox.addEventListener('change', validateTerms);
    }
}

function setupFormValidation() {
    // Configurar validação personalizada para campos obrigatórios
    const requiredFields = document.querySelectorAll('#contact-form [required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('invalid', function(e) {
            e.preventDefault();
            showFieldError(field, getValidationMessage(field));
        });
    });
}

function applyPhoneMask(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value.replace(/(\d{0,2})/, '($1');
        } else if (value.length <= 7) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    }
    
    event.target.value = value;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório.');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, insira um e-mail válido.');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Por favor, insira um telefone válido.');
            return false;
        }
    }
    
    return true;
}

function validateTerms() {
    const termosCheckbox = document.getElementById('termos');
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    
    if (termosCheckbox.checked) {
        submitButton.disabled = false;
        clearFieldError(termosCheckbox);
    } else {
        submitButton.disabled = true;
        showFieldError(termosCheckbox, 'Você deve concordar com os termos para continuar.');
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function getValidationMessage(field) {
    switch (field.type) {
        case 'email':
            return 'Por favor, insira um e-mail válido.';
        case 'tel':
            return 'Por favor, insira um telefone válido.';
        default:
            return 'Este campo é obrigatório.';
    }
}

async function handleContactSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validar todos os campos
    const isValid = validateAllFields(form);
    
    if (!isValid) {
        Utils.showNotification('Por favor, corrija os erros no formulário.', 'error');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitButton);
    
    try {
        // Simular envio do formulário
        await simulateFormSubmission(formData);
        
        Utils.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Limpar formulário
        form.reset();
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        Utils.showNotification('Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.', 'error');
    } finally {
        hideLoading();
    }
}

function validateAllFields(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validar termos
    const termosCheckbox = document.getElementById('termos');
    if (!termosCheckbox.checked) {
        showFieldError(termosCheckbox, 'Você deve concordar com os termos para continuar.');
        isValid = false;
    }
    
    return isValid;
}

async function simulateFormSubmission(formData) {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular dados enviados
    const contactData = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        assunto: formData.get('assunto'),
        destino: formData.get('destino'),
        mensagem: formData.get('mensagem'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString()
    };
    
    console.log('Dados do contato enviados:', contactData);
    
    // Simular possível erro (5% de chance)
    if (Math.random() < 0.05) {
        throw new Error('Erro simulado de envio');
    }
    
    return contactData;
}

// Funções para mapas
function openGoogleMaps() {
    const address = encodeURIComponent('Rua das Viagens, 123, Centro, São Paulo, SP');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
}

function openWaze() {
    const address = encodeURIComponent('Rua das Viagens, 123, Centro, São Paulo, SP');
    const url = `https://waze.com/ul?q=${address}`;
    window.open(url, '_blank');
}

// Adicionar estilos CSS para campos com erro
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
        font-size: 0.75rem;
    }
    
    .checkbox-group .field-error {
        margin-left: 2rem;
    }
    
    button[type="submit"]:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Exportar funções globais
window.openGoogleMaps = openGoogleMaps;
window.openWaze = openWaze;

