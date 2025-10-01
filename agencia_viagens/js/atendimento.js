// JavaScript específico da página de atendimento

// Dados das perguntas frequentes
const faqData = [
    {
        id: 1,
        category: 'reservas',
        question: 'Como faço para fazer uma reserva?',
        answer: 'Você pode fazer uma reserva através do nosso site na seção "Reservas", pelo telefone (11) 4000-0000 ou através do nosso chat online. Basta escolher seu destino, datas e seguir o processo de reserva.'
    },
    {
        id: 2,
        category: 'reservas',
        question: 'Posso alterar minha reserva depois de confirmada?',
        answer: 'Sim, alterações são possíveis dependendo das regras da companhia aérea e hotel. Entre em contato conosco com até 24 horas de antecedência. Podem ser aplicadas taxas de alteração.'
    },
    {
        id: 3,
        category: 'pagamento',
        question: 'Quais formas de pagamento vocês aceitam?',
        answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Elo), cartões de débito, PIX e transferência bancária. Para pacotes, oferecemos parcelamento em até 12x sem juros.'
    },
    {
        id: 4,
        category: 'pagamento',
        question: 'É seguro fazer pagamentos online?',
        answer: 'Sim, nosso site utiliza certificado SSL e criptografia de dados. Não armazenamos informações de cartão de crédito. Todos os pagamentos são processados através de gateways seguros.'
    },
    {
        id: 5,
        category: 'cancelamento',
        question: 'Como cancelar minha reserva?',
        answer: 'Para cancelar, entre em contato conosco pelo telefone, chat ou e-mail informando o código da reserva. As políticas de cancelamento variam conforme o tipo de tarifa escolhida.'
    },
    {
        id: 6,
        category: 'cancelamento',
        question: 'Quando recebo o reembolso?',
        answer: 'O prazo de reembolso varia conforme a forma de pagamento: cartão de crédito (até 2 faturas), PIX/débito (até 5 dias úteis). O valor pode sofrer descontos conforme as políticas de cancelamento.'
    },
    {
        id: 7,
        category: 'documentos',
        question: 'Quais documentos preciso para viajar?',
        answer: 'Para voos nacionais: RG ou CNH dentro da validade. Para voos internacionais: passaporte válido e, dependendo do destino, visto. Consulte sempre os requisitos específicos do país de destino.'
    },
    {
        id: 8,
        category: 'documentos',
        question: 'Preciso de visto para meu destino?',
        answer: 'Depende do país de destino e sua nacionalidade. Oferecemos consultoria gratuita sobre documentação. Entre em contato conosco para verificar os requisitos específicos.'
    },
    {
        id: 9,
        category: 'bagagem',
        question: 'Qual o limite de bagagem?',
        answer: 'Os limites variam conforme a companhia aérea e tipo de tarifa. Geralmente: bagagem de mão (10kg) e bagagem despachada (23kg). Consulte os detalhes na sua reserva.'
    },
    {
        id: 10,
        category: 'bagagem',
        question: 'Posso levar equipamentos eletrônicos?',
        answer: 'Sim, equipamentos eletrônicos devem ser transportados na bagagem de mão. Baterias de lítio têm restrições específicas. Consulte as regras da ANAC para mais detalhes.'
    }
];

let currentChat = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeSupport();
    loadFAQ();
    setupEventListeners();
});

function initializeSupport() {
    // Configurações iniciais da página de atendimento
    console.log('Sistema de atendimento inicializado');
}

function setupEventListeners() {
    // FAQ search
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
        faqSearch.addEventListener('input', Utils.debounce(searchFAQ, 300));
    }

    // FAQ categories
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterFAQByCategory(this.dataset.category);
            
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Status form
    const statusForm = document.getElementById('status-form');
    if (statusForm) {
        statusForm.addEventListener('submit', handleStatusCheck);
    }

    // Feedback form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    }

    // Chat input
    const chatInput = document.getElementById('chat-message-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Modal close on overlay click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

function loadFAQ() {
    displayFAQ(faqData);
}

function displayFAQ(faqs) {
    const faqList = document.getElementById('faq-list');
    
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item" data-category="${faq.category}">
            <button class="faq-question" onclick="toggleFAQ(this)">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function searchFAQ() {
    const searchTerm = document.getElementById('faq-search').value.toLowerCase();
    
    if (searchTerm === '') {
        displayFAQ(faqData);
        return;
    }
    
    const filteredFAQ = faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm)
    );
    
    displayFAQ(filteredFAQ);
    
    if (filteredFAQ.length === 0) {
        document.getElementById('faq-list').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Nenhuma pergunta encontrada para "${searchTerm}"</p>
                <p>Tente usar termos diferentes ou entre em contato conosco.</p>
            </div>
        `;
    }
}

function filterFAQByCategory(category) {
    if (category === 'all') {
        displayFAQ(faqData);
        return;
    }
    
    const filteredFAQ = faqData.filter(faq => faq.category === category);
    displayFAQ(filteredFAQ);
}

async function handleStatusCheck(e) {
    e.preventDefault();
    
    const bookingCode = document.getElementById('booking-code').value;
    const email = document.getElementById('booking-email').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitBtn);
    
    try {
        // Simular consulta de status
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular dados da reserva
        const bookingData = {
            code: bookingCode,
            status: 'Confirmada',
            passenger: 'João Silva',
            destination: 'Rio de Janeiro',
            departure: '2025-03-15',
            hotel: 'Hotel Copacabana Palace',
            checkin: '2025-03-15',
            checkout: '2025-03-20'
        };
        
        displayBookingStatus(bookingData);
        Utils.showNotification('Status da reserva consultado com sucesso!', 'success');
        
    } catch (error) {
        Utils.showNotification('Erro ao consultar reserva. Verifique os dados informados.', 'error');
    } finally {
        hideLoading();
    }
}

function displayBookingStatus(booking) {
    const statusResult = document.getElementById('status-result');
    
    statusResult.innerHTML = `
        <h3>Status da Reserva ${booking.code}</h3>
        <div class="booking-info">
            <div class="info-item">
                <span class="info-label">Status</span>
                <span class="info-value">${booking.status}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Passageiro</span>
                <span class="info-value">${booking.passenger}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Destino</span>
                <span class="info-value">${booking.destination}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Data de Partida</span>
                <span class="info-value">${Utils.formatDate(booking.departure)}</span>
            </div>
        </div>
        
        <div class="booking-timeline">
            <h4>Timeline da Reserva</h4>
            <div class="timeline-item completed">
                <span>Reserva criada</span>
            </div>
            <div class="timeline-item completed">
                <span>Pagamento confirmado</span>
            </div>
            <div class="timeline-item completed">
                <span>Bilhetes emitidos</span>
            </div>
            <div class="timeline-item current">
                <span>Aguardando viagem</span>
            </div>
            <div class="timeline-item">
                <span>Viagem concluída</span>
            </div>
        </div>
    `;
    
    statusResult.style.display = 'block';
}

async function handleFeedbackSubmission(e) {
    e.preventDefault();
    
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const message = document.getElementById('feedback-message').value;
    
    if (!rating) {
        Utils.showNotification('Por favor, selecione uma avaliação.', 'warning');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const hideLoading = Utils.showLoading(submitBtn);
    
    try {
        // Simular envio de feedback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Utils.showNotification('Obrigado pelo seu feedback! Sua avaliação é muito importante para nós.', 'success');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        Utils.showNotification('Erro ao enviar feedback. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

// Funções do Chat
function openChatBot() {
    const chatWidget = document.getElementById('chat-widget');
    chatWidget.classList.add('active');
    
    // Scroll to bottom
    const chatBody = document.getElementById('chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}

function openLiveChat() {
    openChatBot();
    
    // Simular transferência para atendente humano
    setTimeout(() => {
        addChatMessage('bot', 'Conectando você com um de nossos atendentes...');
        
        setTimeout(() => {
            addChatMessage('bot', 'Olá! Sou Maria, sua atendente. Como posso ajudá-lo hoje?');
        }, 2000);
    }, 1000);
}

function closeChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    chatWidget.classList.remove('active');
}

function sendQuickMessage(message) {
    addChatMessage('user', message);
    
    // Simular resposta do bot
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage('bot', response);
    }, 1000);
}

function sendChatMessage() {
    const input = document.getElementById('chat-message-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addChatMessage('user', message);
    input.value = '';
    
    // Simular resposta do bot
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage('bot', response);
    }, 1000);
}

function addChatMessage(sender, message) {
    const chatBody = document.getElementById('chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatar = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('reserva') || lowerMessage.includes('fazer')) {
        return 'Para fazer uma reserva, você pode acessar nossa página de reservas ou posso ajudá-lo aqui mesmo. Qual destino você tem em mente?';
    }
    
    if (lowerMessage.includes('consultar') || lowerMessage.includes('status')) {
        return 'Para consultar sua reserva, preciso do código da reserva e seu e-mail. Você pode usar nossa ferramenta de consulta na página ou me informar os dados aqui.';
    }
    
    if (lowerMessage.includes('cancelar')) {
        return 'Para cancelamentos, preciso verificar sua reserva. Por favor, me informe o código da reserva. Lembre-se que podem ser aplicadas taxas conforme a política de cancelamento.';
    }
    
    if (lowerMessage.includes('atendente') || lowerMessage.includes('humano')) {
        return 'Vou transferir você para um de nossos atendentes humanos. Por favor, aguarde um momento...';
    }
    
    return 'Entendi sua solicitação. Para melhor atendê-lo, você pode escolher uma das opções rápidas ou me explicar com mais detalhes como posso ajudar.';
}

// Funções do Modal de Ticket
function openTicketForm() {
    const modal = document.getElementById('ticket-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTicketModal() {
    const modal = document.getElementById('ticket-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function submitTicket() {
    const form = document.getElementById('ticket-form');
    const formData = new FormData(form);
    
    // Validar campos obrigatórios
    const requiredFields = ['ticket-category', 'ticket-subject', 'ticket-description', 'ticket-name', 'ticket-email'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        Utils.showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    try {
        // Simular envio do ticket
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const ticketNumber = 'TK' + Date.now().toString().slice(-6);
        
        Utils.showNotification(`Chamado #${ticketNumber} criado com sucesso! Você receberá retorno em até 2 horas.`, 'success');
        
        closeTicketModal();
        form.reset();
        
    } catch (error) {
        Utils.showNotification('Erro ao criar chamado. Tente novamente.', 'error');
    }
}

function callPhone() {
    if (navigator.userAgent.match(/Mobile/)) {
        window.location.href = 'tel:1140000000';
    } else {
        Utils.showNotification('Ligue para (11) 4000-0000 para falar com nossos atendentes.', 'info');
    }
}

// Exportar funções globais
window.toggleFAQ = toggleFAQ;
window.openChatBot = openChatBot;
window.openLiveChat = openLiveChat;
window.openTicketForm = openTicketForm;
window.closeTicketModal = closeTicketModal;
window.closeChatWidget = closeChatWidget;
window.sendQuickMessage = sendQuickMessage;
window.sendChatMessage = sendChatMessage;
window.submitTicket = submitTicket;
window.callPhone = callPhone;

