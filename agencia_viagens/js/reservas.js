// JavaScript específico da página de reservas

let currentStep = 1;
let reservationData = {
    search: {},
    selected: {},
    passengers: [],
    payment: {}
};

document.addEventListener('DOMContentLoaded', function() {
    initializeReservationPage();
    setupEventListeners();
    setMinDates();
});

function initializeReservationPage() {
    // Verificar se há parâmetros na URL (vindo de outras páginas)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('flight')) {
        // Pré-selecionar voo específico
        const flightId = urlParams.get('flight');
        // Implementar lógica para pré-selecionar voo
    }
    
    if (urlParams.has('hotel')) {
        // Pré-selecionar hotel específico
        const hotelId = urlParams.get('hotel');
        // Implementar lógica para pré-selecionar hotel
    }
}

function setupEventListeners() {
    // Tabs de busca
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Formulário de busca
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);

    // Formulário de passageiros
    const passengerForm = document.getElementById('passenger-form');
    if (passengerForm) {
        passengerForm.addEventListener('submit', handlePassengerData);
    }

    // Formulário de pagamento
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Métodos de pagamento
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', togglePaymentDetails);
    });

    // Formatação de campos
    setupFieldFormatting();
}

function switchTab(tabType) {
    // Atualizar botões das abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');

    // Mostrar/ocultar seções do formulário
    const flightSection = document.getElementById('flight-section');
    const hotelSection = document.getElementById('hotel-section');

    switch(tabType) {
        case 'voos':
            flightSection.style.display = 'block';
            hotelSection.style.display = 'none';
            break;
        case 'hoteis':
            flightSection.style.display = 'none';
            hotelSection.style.display = 'block';
            break;
        case 'completo':
            flightSection.style.display = 'block';
            hotelSection.style.display = 'block';
            break;
    }
}

async function handleSearch(e) {
    e.preventDefault();
    
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const formData = new FormData(e.target);
    const searchData = Object.fromEntries(formData.entries());
    
    // Coletar dados dos campos visíveis
    const inputs = e.target.querySelectorAll('input:not([style*="display: none"]), select:not([style*="display: none"])');
    inputs.forEach(input => {
        if (input.offsetParent !== null) { // Verificar se o elemento está visível
            searchData[input.id] = input.value;
        }
    });
    
    reservationData.search = { type: activeTab, ...searchData };
    
    const searchBtn = document.querySelector('.search-btn');
    const hideLoading = Utils.showLoading(searchBtn);
    
    try {
        let results = [];
        
        if (activeTab === 'voos' || activeTab === 'completo') {
            const flights = await API.searchFlights(searchData);
            results.push({ type: 'flights', data: flights });
        }
        
        if (activeTab === 'hoteis' || activeTab === 'completo') {
            const hotels = await API.searchHotels(searchData);
            results.push({ type: 'hotels', data: hotels });
        }
        
        displaySearchResults(results);
        goToStep(2);
        
    } catch (error) {
        Utils.showNotification('Erro ao buscar opções. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    let html = '';
    
    results.forEach(resultGroup => {
        if (resultGroup.type === 'flights') {
            html += '<div class="results-section"><h3><i class="fas fa-plane"></i> Voos Disponíveis</h3>';
            html += '<div class="results-container">';
            
            resultGroup.data.forEach(flight => {
                html += `
                    <div class="result-card" data-type="flight" data-id="${flight.id}" onclick="selectOption('flight', ${flight.id}, this)">
                        <div class="result-header">
                            <div class="result-title">${flight.airline}</div>
                            <div class="result-price">${Utils.formatCurrency(flight.price)}</div>
                        </div>
                        <div class="result-details">
                            <div class="detail-item">
                                <i class="fas fa-plane-departure"></i>
                                <span>${flight.departure} - ${flight.departureTime}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-plane-arrival"></i>
                                <span>${flight.arrival} - ${flight.arrivalTime}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>Duração: ${flight.duration}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        if (resultGroup.type === 'hotels') {
            html += '<div class="results-section"><h3><i class="fas fa-bed"></i> Hotéis Disponíveis</h3>';
            html += '<div class="results-container">';
            
            resultGroup.data.forEach(hotel => {
                html += `
                    <div class="result-card" data-type="hotel" data-id="${hotel.id}" onclick="selectOption('hotel', ${hotel.id}, this)">
                        <div class="result-header">
                            <div class="result-title">${hotel.name}</div>
                            <div class="result-price">${Utils.formatCurrency(hotel.price)}/noite</div>
                        </div>
                        <div class="result-details">
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${hotel.location}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-star"></i>
                                <span>${'★'.repeat(hotel.rating)}${'☆'.repeat(5-hotel.rating)}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-wifi"></i>
                                <span>${hotel.amenities.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
    });
    
    html += `
        <div class="selection-actions">
            <button class="btn btn-secondary" onclick="goToStep(1)">Voltar à Busca</button>
            <button class="btn btn-primary" onclick="proceedToPassengerData()" disabled id="proceed-btn">
                Continuar
            </button>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
}

function selectOption(type, id, element) {
    // Remover seleção anterior do mesmo tipo
    document.querySelectorAll(`[data-type="${type}"]`).forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    element.classList.add('selected');
    
    // Salvar seleção
    reservationData.selected[type] = id;
    
    // Verificar se pode prosseguir
    checkCanProceed();
}

function checkCanProceed() {
    const searchType = reservationData.search.type;
    const proceedBtn = document.getElementById('proceed-btn');
    
    let canProceed = false;
    
    if (searchType === 'voos' && reservationData.selected.flight) {
        canProceed = true;
    } else if (searchType === 'hoteis' && reservationData.selected.hotel) {
        canProceed = true;
    } else if (searchType === 'completo' && reservationData.selected.flight && reservationData.selected.hotel) {
        canProceed = true;
    }
    
    proceedBtn.disabled = !canProceed;
}

function proceedToPassengerData() {
    generatePassengerForms();
    goToStep(3);
}

function generatePassengerForms() {
    const passengersContainer = document.getElementById('passengers-container');
    const numPassengers = parseInt(reservationData.search.passageiros || 1);
    
    let html = '';
    
    for (let i = 1; i <= numPassengers; i++) {
        html += `
            <div class="passenger-form">
                <h4><i class="fas fa-user"></i> Passageiro ${i}</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="nome-${i}">Nome Completo</label>
                        <input type="text" id="nome-${i}" name="nome-${i}" required>
                    </div>
                    <div class="form-group">
                        <label for="documento-${i}">CPF</label>
                        <input type="text" id="documento-${i}" name="documento-${i}" placeholder="000.000.000-00" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="nascimento-${i}">Data de Nascimento</label>
                        <input type="date" id="nascimento-${i}" name="nascimento-${i}" required>
                    </div>
                    <div class="form-group">
                        <label for="email-${i}">E-mail</label>
                        <input type="email" id="email-${i}" name="email-${i}" required>
                    </div>
                    <div class="form-group">
                        <label for="telefone-${i}">Telefone</label>
                        <input type="tel" id="telefone-${i}" name="telefone-${i}" placeholder="(11) 99999-9999" required>
                    </div>
                </div>
            </div>
        `;
    }
    
    passengersContainer.innerHTML = html;
    
    // Aplicar formatação aos novos campos
    setupFieldFormatting();
}

function handlePassengerData(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const passengers = [];
    const numPassengers = parseInt(reservationData.search.passageiros || 1);
    
    for (let i = 1; i <= numPassengers; i++) {
        passengers.push({
            nome: formData.get(`nome-${i}`),
            documento: formData.get(`documento-${i}`),
            nascimento: formData.get(`nascimento-${i}`),
            email: formData.get(`email-${i}`),
            telefone: formData.get(`telefone-${i}`)
        });
    }
    
    reservationData.passengers = passengers;
    generatePaymentSummary();
    goToStep(4);
}

function generatePaymentSummary() {
    const summaryContainer = document.getElementById('booking-summary');
    let total = 0;
    let html = '';
    
    // Adicionar voo se selecionado
    if (reservationData.selected.flight) {
        const flightPrice = 599.99; // Buscar preço real baseado no ID
        const numPassengers = parseInt(reservationData.search.passageiros || 1);
        const flightTotal = flightPrice * numPassengers;
        total += flightTotal;
        
        html += `
            <div class="summary-item">
                <span>Voo (${numPassengers} passageiro${numPassengers > 1 ? 's' : ''})</span>
                <span>${Utils.formatCurrency(flightTotal)}</span>
            </div>
        `;
    }
    
    // Adicionar hotel se selecionado
    if (reservationData.selected.hotel) {
        const hotelPrice = 199.99; // Buscar preço real baseado no ID
        const nights = 3; // Calcular baseado nas datas
        const hotelTotal = hotelPrice * nights;
        total += hotelTotal;
        
        html += `
            <div class="summary-item">
                <span>Hotel (${nights} noite${nights > 1 ? 's' : ''})</span>
                <span>${Utils.formatCurrency(hotelTotal)}</span>
            </div>
        `;
    }
    
    // Taxas
    const taxes = total * 0.1;
    total += taxes;
    
    html += `
        <div class="summary-item">
            <span>Taxas e impostos</span>
            <span>${Utils.formatCurrency(taxes)}</span>
        </div>
        <div class="summary-item summary-total">
            <span>Total</span>
            <span>${Utils.formatCurrency(total)}</span>
        </div>
    `;
    
    summaryContainer.innerHTML = html;
    reservationData.total = total;
}

function togglePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const cardDetails = document.getElementById('card-details');
    
    if (selectedMethod === 'pix') {
        cardDetails.style.display = 'none';
    } else {
        cardDetails.style.display = 'block';
    }
}

async function handlePayment(e) {
    e.preventDefault();
    
    const paymentBtn = document.querySelector('.payment-btn');
    const hideLoading = Utils.showLoading(paymentBtn);
    
    try {
        // Simular processamento de pagamento
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Salvar dados de pagamento
        const formData = new FormData(e.target);
        reservationData.payment = Object.fromEntries(formData.entries());
        
        // Gerar número de reserva
        reservationData.bookingNumber = 'VF' + Date.now().toString().slice(-8);
        
        generateFinalBookingDetails();
        goToStep(5);
        
        Utils.showNotification('Pagamento processado com sucesso!', 'success');
        
    } catch (error) {
        Utils.showNotification('Erro no processamento do pagamento. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

function generateFinalBookingDetails() {
    const detailsContainer = document.getElementById('final-booking-details');
    
    let html = `
        <div class="booking-info">
            <h4>Número da Reserva: ${reservationData.bookingNumber}</h4>
            <p><strong>Data da Reserva:</strong> ${Utils.formatDate(new Date())}</p>
        </div>
    `;
    
    if (reservationData.selected.flight) {
        html += `
            <div class="booking-section">
                <h4><i class="fas fa-plane"></i> Detalhes do Voo</h4>
                <p><strong>Companhia:</strong> LATAM</p>
                <p><strong>Rota:</strong> ${reservationData.search.origem} → ${reservationData.search.destino}</p>
                <p><strong>Data:</strong> ${Utils.formatDate(reservationData.search['data-ida'])}</p>
            </div>
        `;
    }
    
    if (reservationData.selected.hotel) {
        html += `
            <div class="booking-section">
                <h4><i class="fas fa-bed"></i> Detalhes do Hotel</h4>
                <p><strong>Hotel:</strong> Hotel Luxo Premium</p>
                <p><strong>Localização:</strong> ${reservationData.search['cidade-hotel'] || reservationData.search.destino}</p>
                <p><strong>Check-in:</strong> ${Utils.formatDate(reservationData.search.checkin || reservationData.search['data-ida'])}</p>
            </div>
        `;
    }
    
    html += `
        <div class="booking-section">
            <h4><i class="fas fa-users"></i> Passageiros</h4>
            ${reservationData.passengers.map((p, i) => `
                <p><strong>Passageiro ${i + 1}:</strong> ${p.nome}</p>
            `).join('')}
        </div>
        
        <div class="booking-section">
            <h4><i class="fas fa-credit-card"></i> Pagamento</h4>
            <p><strong>Total Pago:</strong> ${Utils.formatCurrency(reservationData.total)}</p>
            <p><strong>Método:</strong> ${getPaymentMethodName(reservationData.payment['payment-method'])}</p>
        </div>
    `;
    
    detailsContainer.innerHTML = html;
}

function getPaymentMethodName(method) {
    const methods = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX'
    };
    return methods[method] || method;
}

function goToStep(stepNumber) {
    // Ocultar todos os conteúdos de step
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Mostrar o step atual
    document.getElementById(`step-${stepNumber}`).style.display = 'block';
    
    // Atualizar indicadores de progresso
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    currentStep = stepNumber;
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        input.min = today;
    });
}

function setupFieldFormatting() {
    // Formatação de CPF
    document.addEventListener('input', function(e) {
        if (e.target.id.includes('documento')) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        }
        
        // Formatação de telefone
        if (e.target.id.includes('telefone')) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
            e.target.value = value;
        }
        
        // Formatação de cartão
        if (e.target.id === 'card-number') {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        }
        
        // Formatação de validade
        if (e.target.id === 'card-expiry') {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
            e.target.value = value;
        }
    });
}

// Funções para a confirmação
function downloadTicket() {
    Utils.showNotification('Comprovante baixado com sucesso!', 'success');
}

function sendEmail() {
    Utils.showNotification('E-mail enviado com sucesso!', 'success');
}

// Exportar funções globais
window.goToStep = goToStep;
window.selectOption = selectOption;
window.proceedToPassengerData = proceedToPassengerData;
window.downloadTicket = downloadTicket;
window.sendEmail = sendEmail;

