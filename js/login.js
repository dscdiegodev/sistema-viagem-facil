// JavaScript específico da página de login

let currentSection = 'login';

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    setupEventListeners();
    setupPasswordValidation();
});

function initializeLoginPage() {
    console.log('Página de login inicializada');
    
    // Aplicar máscara de telefone no cadastro
    const telefoneInput = document.getElementById('register-telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', applyPhoneMask);
    }
    
    // Verificar se há dados salvos no localStorage
    checkRememberedUser();
}

function setupEventListeners() {
    // Formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Formulário de recuperação de senha
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Validação em tempo real
    setupRealTimeValidation();
}

function setupPasswordValidation() {
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
}

function setupRealTimeValidation() {
    // Validação de email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
        input.addEventListener('input', clearFieldError);
    });
    
    // Validação de campos obrigatórios
    const requiredInputs = document.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', validateRequired);
        input.addEventListener('input', clearFieldError);
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

function validateEmail(event) {
    const input = event.target;
    const email = input.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(input, 'Por favor, insira um e-mail válido.');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

function validateRequired(event) {
    const input = event.target;
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Este campo é obrigatório.');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

function validatePasswordStrength(event) {
    const password = event.target.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
    
    // Atualizar indicadores visuais
    updatePasswordRequirement('req-length', requirements.length);
    updatePasswordRequirement('req-uppercase', requirements.uppercase);
    updatePasswordRequirement('req-lowercase', requirements.lowercase);
    updatePasswordRequirement('req-number', requirements.number);
    
    // Validar confirmação de senha se já foi preenchida
    const confirmInput = document.getElementById('register-confirm-password');
    if (confirmInput && confirmInput.value) {
        validatePasswordMatch({ target: confirmInput });
    }
}

function updatePasswordRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
}

function validatePasswordMatch(event) {
    const confirmInput = event.target;
    const passwordInput = document.getElementById('register-password');
    
    if (passwordInput && confirmInput.value !== passwordInput.value) {
        showFieldError(confirmInput, 'As senhas não coincidem.');
        return false;
    }
    
    clearFieldError(confirmInput);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    input.parentNode.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    if (typeof input === 'object' && input.target) {
        input = input.target;
    }
    
    input.classList.remove('error');
    
    const errorElement = input.parentNode.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validação básica
    if (!email || !password) {
        Utils.showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitButton);
    
    try {
        // Simular autenticação
        const loginResult = await simulateLogin(email, password);
        
        if (loginResult.success) {
            // Salvar dados se "lembrar de mim" estiver marcado
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Salvar dados do usuário logado
            localStorage.setItem('currentUser', JSON.stringify(loginResult.user));
            
            // Mostrar sucesso e redirecionar
            showSuccess('Login realizado com sucesso!', 'Redirecionando para a página inicial...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } else {
            Utils.showNotification(loginResult.message || 'E-mail ou senha incorretos.', 'error');
        }
        
    } catch (error) {
        Utils.showNotification('Erro ao fazer login. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validar todos os campos
    if (!validateRegistrationForm(form)) {
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitButton);
    
    try {
        // Simular cadastro
        const registerResult = await simulateRegister(formData);
        
        if (registerResult.success) {
            showSuccess('Conta criada com sucesso!', 'Você já pode fazer login com suas credenciais.');
            
            setTimeout(() => {
                showLogin();
                // Preencher email no formulário de login
                const loginEmailInput = document.getElementById('login-email');
                if (loginEmailInput) {
                    loginEmailInput.value = formData.get('email');
                }
            }, 2000);
            
        } else {
            Utils.showNotification(registerResult.message || 'Erro ao criar conta.', 'error');
        }
        
    } catch (error) {
        Utils.showNotification('Erro ao criar conta. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    
    if (!email || !isValidEmail(email)) {
        Utils.showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitButton);
    
    try {
        // Simular envio de recuperação
        await simulateForgotPassword(email);
        
        showSuccess('E-mail enviado!', 'Verifique sua caixa de entrada para instruções de recuperação.');
        
        setTimeout(() => {
            showLogin();
        }, 3000);
        
    } catch (error) {
        Utils.showNotification('Erro ao enviar e-mail. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

function validateRegistrationForm(form) {
    const formData = new FormData(form);
    let isValid = true;
    
    // Validar campos obrigatórios
    const requiredFields = ['nome', 'sobrenome', 'email', 'telefone', 'password', 'confirmPassword'];
    
    requiredFields.forEach(fieldName => {
        const value = formData.get(fieldName);
        if (!value || !value.trim()) {
            const input = form.querySelector(`[name="${fieldName}"]`);
            showFieldError(input, 'Este campo é obrigatório.');
            isValid = false;
        }
    });
    
    // Validar email
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        const emailInput = form.querySelector('[name="email"]');
        showFieldError(emailInput, 'Por favor, insira um e-mail válido.');
        isValid = false;
    }
    
    // Validar senha
    const password = formData.get('password');
    if (password && password.length < 8) {
        const passwordInput = form.querySelector('[name="password"]');
        showFieldError(passwordInput, 'A senha deve ter pelo menos 8 caracteres.');
        isValid = false;
    }
    
    // Validar confirmação de senha
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
        const confirmInput = form.querySelector('[name="confirmPassword"]');
        showFieldError(confirmInput, 'As senhas não coincidem.');
        isValid = false;
    }
    
    // Validar termos
    const terms = formData.get('terms');
    if (!terms) {
        Utils.showNotification('Você deve concordar com os termos de uso.', 'error');
        isValid = false;
    }
    
    return isValid;
}

async function simulateLogin(email, password) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular validação (aceita qualquer email válido com senha "123456")
    if (isValidEmail(email) && password === '123456') {
        return {
            success: true,
            user: {
                id: 1,
                nome: 'Usuário',
                sobrenome: 'Teste',
                email: email,
                telefone: '(11) 99999-9999'
            }
        };
    }
    
    // Simular erro de login
    return {
        success: false,
        message: 'E-mail ou senha incorretos.'
    };
}

async function simulateRegister(formData) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const email = formData.get('email');
    
    // Simular verificação de email existente
    if (email === 'teste@teste.com') {
        return {
            success: false,
            message: 'Este e-mail já está cadastrado.'
        };
    }
    
    // Simular sucesso
    return {
        success: true,
        user: {
            id: Date.now(),
            nome: formData.get('nome'),
            sobrenome: formData.get('sobrenome'),
            email: email,
            telefone: formData.get('telefone')
        }
    };
}

async function simulateForgotPassword(email) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('E-mail de recuperação enviado para:', email);
    
    // Simular possível erro (5% de chance)
    if (Math.random() < 0.05) {
        throw new Error('Erro simulado de envio');
    }
}

function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('login-email');
        const rememberCheckbox = document.getElementById('remember-me');
        
        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}

function showLogin() {
    switchSection('login');
}

function showRegister() {
    switchSection('register');
}

function showForgotPassword() {
    switchSection('forgot');
}

function showSuccess(title, message) {
    const successTitle = document.getElementById('success-title');
    const successMessage = document.getElementById('success-message');
    
    if (successTitle) successTitle.textContent = title;
    if (successMessage) successMessage.textContent = message;
    
    switchSection('success');
}

function switchSection(sectionName) {
    const sections = ['login', 'register', 'forgot', 'success'];
    
    sections.forEach(section => {
        const element = document.getElementById(`${section}-section`);
        if (element) {
            if (section === sectionName) {
                element.style.display = 'block';
                element.classList.remove('hiding');
            } else {
                element.classList.add('hiding');
                setTimeout(() => {
                    element.style.display = 'none';
                    element.classList.remove('hiding');
                }, 300);
            }
        }
    });
    
    currentSection = sectionName;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function loginWithGoogle() {
    Utils.showNotification('Integração com Google em desenvolvimento.', 'info');
}

function loginWithFacebook() {
    Utils.showNotification('Integração com Facebook em desenvolvimento.', 'info');
}

// Exportar funções globais
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;

