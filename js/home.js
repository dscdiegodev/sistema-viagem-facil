// JavaScript específico da página inicial

document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade das abas de busca
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchForm = document.getElementById('search-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todas as abas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active na aba clicada
            this.classList.add('active');
            
            // Atualizar o formulário baseado na aba selecionada
            updateSearchForm(this.dataset.tab);
        });
    });

    // Função para atualizar o formulário de busca
    function updateSearchForm(tabType) {
        const formRow = searchForm.querySelector('.form-row');
        
        switch(tabType) {
            case 'voos':
                formRow.innerHTML = `
                    <div class="form-group">
                        <label for="origem">Origem</label>
                        <input type="text" id="origem" placeholder="De onde você sai?" required>
                    </div>
                    <div class="form-group">
                        <label for="destino">Destino</label>
                        <input type="text" id="destino" placeholder="Para onde vai?" required>
                    </div>
                    <div class="form-group">
                        <label for="ida">Data de Ida</label>
                        <input type="date" id="ida" required>
                    </div>
                    <div class="form-group">
                        <label for="volta">Data de Volta</label>
                        <input type="date" id="volta">
                    </div>
                    <div class="form-group">
                        <label for="passageiros">Passageiros</label>
                        <select id="passageiros" required>
                            <option value="1">1 Passageiro</option>
                            <option value="2">2 Passageiros</option>
                            <option value="3">3 Passageiros</option>
                            <option value="4">4+ Passageiros</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'hoteis':
                formRow.innerHTML = `
                    <div class="form-group">
                        <label for="cidade">Cidade</label>
                        <input type="text" id="cidade" placeholder="Onde você quer se hospedar?" required>
                    </div>
                    <div class="form-group">
                        <label for="checkin">Check-in</label>
                        <input type="date" id="checkin" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout">Check-out</label>
                        <input type="date" id="checkout" required>
                    </div>
                    <div class="form-group">
                        <label for="hospedes">Hóspedes</label>
                        <select id="hospedes" required>
                            <option value="1">1 Hóspede</option>
                            <option value="2">2 Hóspedes</option>
                            <option value="3">3 Hóspedes</option>
                            <option value="4">4+ Hóspedes</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quartos">Quartos</label>
                        <select id="quartos" required>
                            <option value="1">1 Quarto</option>
                            <option value="2">2 Quartos</option>
                            <option value="3">3+ Quartos</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'pacotes':
                formRow.innerHTML = `
                    <div class="form-group">
                        <label for="destino-pacote">Destino</label>
                        <input type="text" id="destino-pacote" placeholder="Qual destino você procura?" required>
                    </div>
                    <div class="form-group">
                        <label for="data-viagem">Data da Viagem</label>
                        <input type="date" id="data-viagem" required>
                    </div>
                    <div class="form-group">
                        <label for="duracao">Duração</label>
                        <select id="duracao" required>
                            <option value="3">3 dias</option>
                            <option value="5">5 dias</option>
                            <option value="7">7 dias</option>
                            <option value="10">10 dias</option>
                            <option value="15">15+ dias</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tipo-pacote">Tipo de Pacote</label>
                        <select id="tipo-pacote" required>
                            <option value="aventura">Aventura</option>
                            <option value="relaxamento">Relaxamento</option>
                            <option value="cultural">Cultural</option>
                            <option value="familia">Família</option>
                            <option value="romantico">Romântico</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="orcamento">Orçamento</label>
                        <select id="orcamento" required>
                            <option value="ate-1000">Até R$ 1.000</option>
                            <option value="1000-3000">R$ 1.000 - R$ 3.000</option>
                            <option value="3000-5000">R$ 3.000 - R$ 5.000</option>
                            <option value="acima-5000">Acima de R$ 5.000</option>
                        </select>
                    </div>
                `;
                break;
        }
    }

    // Manipular envio do formulário de busca
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        const formData = new FormData(this);
        const searchData = Object.fromEntries(formData.entries());
        
        // Adicionar dados dos campos atuais do formulário
        const inputs = this.querySelectorAll('input, select');
        inputs.forEach(input => {
            searchData[input.id] = input.value;
        });
        
        handleSearch(activeTab, searchData);
    });

    // Função para lidar com a busca
    async function handleSearch(type, data) {
        const searchBtn = document.querySelector('.search-btn');
        const hideLoading = Utils.showLoading(searchBtn);
        
        try {
            let results;
            
            switch(type) {
                case 'voos':
                    results = await API.searchFlights(data);
                    displayFlightResults(results);
                    break;
                case 'hoteis':
                    results = await API.searchHotels(data);
                    displayHotelResults(results);
                    break;
                case 'pacotes':
                    // Redirecionar para página de pacotes com filtros
                    window.location.href = `pacotes.html?destino=${encodeURIComponent(data['destino-pacote'])}&tipo=${data['tipo-pacote']}&duracao=${data.duracao}&orcamento=${data.orcamento}`;
                    return;
            }
            
            Utils.showNotification(`Encontramos ${results.length} opções para você!`, 'success');
            
        } catch (error) {
            Utils.showNotification('Erro ao realizar a busca. Tente novamente.', 'error');
        } finally {
            hideLoading();
        }
    }

    // Função para exibir resultados de voos
    function displayFlightResults(flights) {
        // Criar modal ou seção para mostrar resultados
        const resultsModal = createResultsModal('Voos Encontrados');
        
        const resultsContent = flights.map(flight => `
            <div class="result-item">
                <div class="result-header">
                    <h4>${flight.airline}</h4>
                    <span class="price">${Utils.formatCurrency(flight.price)}</span>
                </div>
                <div class="result-details">
                    <p><strong>Rota:</strong> ${flight.departure} → ${flight.arrival}</p>
                    <p><strong>Horário:</strong> ${flight.departureTime} - ${flight.arrivalTime}</p>
                    <p><strong>Duração:</strong> ${flight.duration}</p>
                </div>
                <button class="btn btn-primary" onclick="selectFlight(${flight.id})">
                    Selecionar Voo
                </button>
            </div>
        `).join('');
        
        resultsModal.querySelector('.results-content').innerHTML = resultsContent;
        document.body.appendChild(resultsModal);
    }

    // Função para exibir resultados de hotéis
    function displayHotelResults(hotels) {
        const resultsModal = createResultsModal('Hotéis Encontrados');
        
        const resultsContent = hotels.map(hotel => `
            <div class="result-item">
                <div class="result-header">
                    <h4>${hotel.name}</h4>
                    <div class="rating">
                        ${'★'.repeat(hotel.rating)}${'☆'.repeat(5-hotel.rating)}
                    </div>
                    <span class="price">${Utils.formatCurrency(hotel.price)}/noite</span>
                </div>
                <div class="result-details">
                    <p><strong>Localização:</strong> ${hotel.location}</p>
                    <p><strong>Comodidades:</strong> ${hotel.amenities.join(', ')}</p>
                </div>
                <button class="btn btn-primary" onclick="selectHotel(${hotel.id})">
                    Selecionar Hotel
                </button>
            </div>
        `).join('');
        
        resultsModal.querySelector('.results-content').innerHTML = resultsContent;
        document.body.appendChild(resultsModal);
    }

    // Função para criar modal de resultados
    function createResultsModal(title) {
        const modal = document.createElement('div');
        modal.className = 'results-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="results-content"></div>
                </div>
            </div>
        `;

        // Adicionar estilos do modal se não existirem
        if (!document.querySelector('#modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .results-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                }
                .modal-overlay {
                    background: rgba(0, 0, 0, 0.5);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    max-width: 800px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .results-content {
                    padding: 1.5rem;
                }
                .result-item {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .rating {
                    color: #f59e0b;
                }
                .price {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(styles);
        }

        // Fechar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        return modal;
    }

    // Definir datas mínimas para os campos de data
    const today = new Date().toISOString().split('T')[0];
    document.addEventListener('change', function(e) {
        if (e.target.type === 'date') {
            e.target.min = today;
            
            // Se for data de volta, deve ser após a data de ida
            if (e.target.id === 'volta' || e.target.id === 'checkout') {
                const idaField = document.getElementById('ida') || document.getElementById('checkin');
                if (idaField && idaField.value) {
                    e.target.min = idaField.value;
                }
            }
        }
    });
});

// Funções globais para seleção de voos e hotéis
window.selectFlight = function(flightId) {
    Utils.showNotification('Voo selecionado! Redirecionando para finalizar reserva...', 'success');
    setTimeout(() => {
        window.location.href = `reservas.html?flight=${flightId}`;
    }, 1500);
};

window.selectHotel = function(hotelId) {
    Utils.showNotification('Hotel selecionado! Redirecionando para finalizar reserva...', 'success');
    setTimeout(() => {
        window.location.href = `reservas.html?hotel=${hotelId}`;
    }, 1500);
};

