// JavaScript específico da página de pacotes

let allPackages = [];
let filteredPackages = [];
let currentPackage = null;
let packagesPerPage = 6;
let currentPage = 1;

// Dados simulados dos pacotes
const packagesData = [
    {
        id: 1,
        title: "Paris Romântico",
        location: "Paris, França",
        region: "europa",
        type: "romantico",
        duration: 7,
        price: 4999,
        originalPrice: 5999,
        discount: 17,
        rating: 4.8,
        reviews: 156,
        image: "../img/paris-romantico.png",
        description: "Viva o romance na Cidade Luz com este pacote completo que inclui os principais pontos turísticos de Paris.",
        featured: true,
        includes: [
            "Passagem aérea ida e volta",
            "7 noites em hotel 4 estrelas",
            "Café da manhã incluído",
            "Tour pela Torre Eiffel",
            "Passeio de barco no Sena",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Chegada em Paris", description: "Check-in no hotel e tour panorâmico pela cidade" },
            { day: 2, title: "Torre Eiffel e Champs-Élysées", description: "Visita à Torre Eiffel e caminhada pela famosa avenida" },
            { day: 3, title: "Louvre e Île de la Cité", description: "Museu do Louvre e visita à Catedral de Notre-Dame" },
            { day: 4, title: "Montmartre e Sacré-Cœur", description: "Exploração do bairro artístico de Montmartre" },
            { day: 5, title: "Versailles", description: "Excursão ao Palácio de Versailles" },
            { day: 6, title: "Dia livre", description: "Compras e exploração livre da cidade" },
            { day: 7, title: "Partida", description: "Check-out e transfer para o aeroporto" }
        ]
    },
    {
        id: 2,
        title: "Tóquio Moderno",
        location: "Tóquio, Japão",
        region: "asia",
        type: "cultural",
        duration: 10,
        price: 7999,
        originalPrice: 9499,
        discount: 16,
        rating: 4.9,
        reviews: 203,
        image: "../img/tokyo-moderno.png",
        description: "Descubra a fascinante cultura japonesa nesta jornada pela metrópole mais moderna do mundo.",
        featured: true,
        includes: [
            "Passagem aérea ida e volta",
            "10 noites em hotel 4 estrelas",
            "Café da manhã incluído",
            "JR Pass (7 dias)",
            "Tour cultural com guia",
            "Experiência gastronômica",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Chegada em Tóquio", description: "Chegada e acomodação no hotel" },
            { day: 2, title: "Shibuya e Harajuku", description: "Exploração dos bairros mais vibrantes" },
            { day: 3, title: "Templos e Tradição", description: "Visita aos templos Senso-ji e Meiji" },
            { day: 4, title: "Tsukiji e Ginza", description: "Mercado de peixes e distrito de compras" },
            { day: 5, title: "Monte Fuji", description: "Excursão ao icônico Monte Fuji" }
        ]
    },
    {
        id: 3,
        title: "Maldivas Paradisíacas",
        location: "Maldivas",
        region: "asia",
        type: "relaxamento",
        duration: 5,
        price: 8999,
        originalPrice: 10999,
        discount: 18,
        rating: 4.9,
        reviews: 89,
        image: "../img/maldivas-paradise.png",
        description: "Relaxe em águas cristalinas e praias de areia branca neste paraíso tropical exclusivo.",
        featured: true,
        includes: [
            "Passagem aérea ida e volta",
            "5 noites em resort 5 estrelas",
            "Pensão completa",
            "Bangalô sobre a água",
            "Spa e massagens",
            "Atividades aquáticas",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Chegada ao Paraíso", description: "Transfer de hidroavião e check-in no resort" },
            { day: 2, title: "Relaxamento Total", description: "Spa, praia e atividades aquáticas" },
            { day: 3, title: "Mergulho e Snorkel", description: "Exploração da vida marinha" },
            { day: 4, title: "Pôr do Sol Romântico", description: "Jantar especial e passeio de barco" },
            { day: 5, title: "Despedida", description: "Últimos momentos no paraíso" }
        ]
    },
    {
        id: 4,
        title: "Nova York Urbana",
        location: "Nova York, EUA",
        region: "america-norte",
        type: "aventura",
        duration: 7,
        price: 5499,
        originalPrice: 6299,
        discount: 13,
        rating: 4.7,
        reviews: 312,
        image: "../img/newyork-urban.png",
        description: "Explore a cidade que nunca dorme com este pacote completo pelos principais pontos de NYC.",
        featured: false,
        includes: [
            "Passagem aérea ida e volta",
            "7 noites em hotel 4 estrelas",
            "Café da manhã incluído",
            "City Pass (atrações)",
            "Tour pela Estátua da Liberdade",
            "Broadway show",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Chegada em NYC", description: "Check-in e tour panorâmico" },
            { day: 2, title: "Manhattan Sul", description: "Wall Street, 9/11 Memorial e Estátua da Liberdade" },
            { day: 3, title: "Central Park e Museus", description: "Central Park, MET e Guggenheim" },
            { day: 4, title: "Times Square e Broadway", description: "Compras e show da Broadway" },
            { day: 5, title: "Brooklyn e Queens", description: "Exploração dos outros boroughs" }
        ]
    },
    {
        id: 5,
        title: "Patagônia Selvagem",
        location: "Patagônia, Argentina/Chile",
        region: "america-sul",
        type: "aventura",
        duration: 12,
        price: 6999,
        originalPrice: 7999,
        discount: 13,
        rating: 4.8,
        reviews: 67,
        image: "../img/patagonia-selvagem.png",
        description: "Aventure-se pelos cenários mais selvagens da América do Sul nesta expedição única.",
        featured: false,
        includes: [
            "Passagem aérea ida e volta",
            "12 noites (hotéis e camping)",
            "Todas as refeições",
            "Guia especializado",
            "Equipamentos de trekking",
            "Transporte 4x4",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Buenos Aires", description: "Chegada e city tour" },
            { day: 2, title: "El Calafate", description: "Voo para a Patagônia" },
            { day: 3, title: "Glaciar Perito Moreno", description: "Trekking no gelo" },
            { day: 4, title: "Torres del Paine", description: "Entrada no parque nacional" },
            { day: 5, title: "Trekking Base Torres", description: "Caminhada até as torres" }
        ]
    },
    {
        id: 6,
        title: "Família Disney",
        location: "Orlando, EUA",
        region: "america-norte",
        type: "familia",
        duration: 7,
        price: 3999,
        originalPrice: 4599,
        discount: 13,
        rating: 4.6,
        reviews: 445,
        image: "../img/disney-family.png",
        description: "Diversão garantida para toda a família nos parques mais mágicos do mundo.",
        featured: false,
        includes: [
            "Passagem aérea ida e volta",
            "7 noites em resort Disney",
            "Café da manhã incluído",
            "Ingressos para 4 parques",
            "Fast Pass incluído",
            "Transporte Disney",
            "Seguro viagem"
        ],
        itinerary: [
            { day: 1, title: "Chegada Mágica", description: "Check-in no resort Disney" },
            { day: 2, title: "Magic Kingdom", description: "O parque mais clássico da Disney" },
            { day: 3, title: "EPCOT", description: "Tecnologia e culturas do mundo" },
            { day: 4, title: "Hollywood Studios", description: "Cinema e Star Wars" },
            { day: 5, title: "Animal Kingdom", description: "Aventuras selvagens" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializePackagesPage();
    loadPackages();
    setupEventListeners();
    checkUrlFilters();
});

function initializePackagesPage() {
    allPackages = [...packagesData];
    filteredPackages = [...allPackages];
}

function setupEventListeners() {
    // Fechar modal ao clicar fora
    document.getElementById('package-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePackageModal();
        }
    });
}

function checkUrlFilters() {
    // Verificar se há filtros na URL (vindo da página inicial)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('destino')) {
        document.getElementById('destino-filter').value = urlParams.get('destino');
    }
    
    if (urlParams.has('tipo')) {
        document.getElementById('tipo-filter').value = urlParams.get('tipo');
    }
    
    if (urlParams.has('duracao')) {
        document.getElementById('duracao-filter').value = urlParams.get('duracao');
    }
    
    if (urlParams.has('orcamento')) {
        const budget = urlParams.get('orcamento');
        const priceMap = {
            'ate-1000': '0-1000',
            '1000-3000': '1000-3000',
            '3000-5000': '3000-5000',
            'acima-5000': '5000-10000'
        };
        document.getElementById('preco-filter').value = priceMap[budget] || '';
    }
    
    // Aplicar filtros se houver parâmetros
    if (urlParams.toString()) {
        applyFilters();
    }
}

function loadPackages() {
    loadFeaturedPackages();
    loadAllPackages();
}

function loadFeaturedPackages() {
    const featuredContainer = document.getElementById('featured-packages');
    const featuredPackages = allPackages.filter(pkg => pkg.featured);
    
    featuredContainer.innerHTML = featuredPackages.map(pkg => createPackageCard(pkg)).join('');
}

function loadAllPackages() {
    const allContainer = document.getElementById('all-packages');
    const startIndex = 0;
    const endIndex = packagesPerPage;
    const packagesToShow = filteredPackages.slice(startIndex, endIndex);
    
    allContainer.innerHTML = packagesToShow.map(pkg => createPackageCard(pkg)).join('');
    
    // Mostrar/ocultar botão "Carregar Mais"
    const loadMoreBtn = document.querySelector('.load-more');
    if (filteredPackages.length <= packagesPerPage) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function createPackageCard(pkg) {
    const installments = Math.ceil(pkg.price / 12);
    
    return `
        <div class="package-card" onclick="openPackageModal(${pkg.id})">
            <div class="package-image">
                <img src="${pkg.image}" alt="${pkg.title}" onerror="this.src='../img/placeholder.jpg'">
                ${pkg.featured ? '<div class="package-badge">Destaque</div>' : ''}
                ${pkg.discount ? `<div class="package-discount">-${pkg.discount}%</div>` : ''}
            </div>
            <div class="package-content">
                <div class="package-header">
                    <h3 class="package-title">${pkg.title}</h3>
                    <div class="package-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${pkg.location}
                    </div>
                </div>
                
                <div class="package-details">
                    <div class="package-detail">
                        <i class="fas fa-calendar"></i>
                        ${pkg.duration} dias
                    </div>
                    <div class="package-detail">
                        <i class="fas fa-tag"></i>
                        ${getTypeLabel(pkg.type)}
                    </div>
                    <div class="package-detail">
                        <i class="fas fa-plane"></i>
                        Voo incluído
                    </div>
                    <div class="package-detail">
                        <i class="fas fa-bed"></i>
                        Hotel incluído
                    </div>
                </div>
                
                <p class="package-description">${pkg.description}</p>
                
                <div class="package-footer">
                    <div class="package-price">
                        ${pkg.originalPrice ? `<div class="price-original">De ${Utils.formatCurrency(pkg.originalPrice)}</div>` : ''}
                        <div class="price-current">${Utils.formatCurrency(pkg.price)}</div>
                        <div class="price-installments">ou 12x de ${Utils.formatCurrency(installments)}</div>
                    </div>
                    <div class="package-rating">
                        <div class="stars">${'★'.repeat(Math.floor(pkg.rating))}${'☆'.repeat(5-Math.floor(pkg.rating))}</div>
                        <div class="rating-text">${pkg.rating} (${pkg.reviews})</div>
                    </div>
                </div>
                
                <div class="package-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); bookPackage(${pkg.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Reservar
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); openPackageModal(${pkg.id})">
                        <i class="fas fa-info-circle"></i>
                        Detalhes
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getTypeLabel(type) {
    const types = {
        'aventura': 'Aventura',
        'relaxamento': 'Relaxamento',
        'cultural': 'Cultural',
        'familia': 'Família',
        'romantico': 'Romântico',
        'negocios': 'Negócios'
    };
    return types[type] || type;
}

function applyFilters() {
    const destino = document.getElementById('destino-filter').value;
    const tipo = document.getElementById('tipo-filter').value;
    const duracao = document.getElementById('duracao-filter').value;
    const preco = document.getElementById('preco-filter').value;
    
    filteredPackages = allPackages.filter(pkg => {
        let matches = true;
        
        if (destino && pkg.region !== destino) {
            matches = false;
        }
        
        if (tipo && pkg.type !== tipo) {
            matches = false;
        }
        
        if (duracao) {
            const durationNum = parseInt(duracao);
            if (durationNum === 15) {
                if (pkg.duration < 15) matches = false;
            } else {
                if (pkg.duration !== durationNum) matches = false;
            }
        }
        
        if (preco) {
            const [min, max] = preco.split('-').map(p => parseInt(p.replace('+', '')));
            if (max) {
                if (pkg.price < min || pkg.price > max) matches = false;
            } else {
                if (pkg.price < min) matches = false;
            }
        }
        
        return matches;
    });
    
    currentPage = 1;
    loadAllPackages();
    
    // Mostrar mensagem se não houver resultados
    if (filteredPackages.length === 0) {
        document.getElementById('all-packages').innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Nenhum pacote encontrado</h3>
                <p>Tente ajustar os filtros para encontrar mais opções.</p>
            </div>
        `;
    }
    
    Utils.showNotification(`${filteredPackages.length} pacote(s) encontrado(s)`, 'info');
}

function clearFilters() {
    document.getElementById('destino-filter').value = '';
    document.getElementById('tipo-filter').value = '';
    document.getElementById('duracao-filter').value = '';
    document.getElementById('preco-filter').value = '';
    
    filteredPackages = [...allPackages];
    currentPage = 1;
    loadAllPackages();
    
    Utils.showNotification('Filtros removidos', 'info');
}

function sortPackages() {
    const sortBy = document.getElementById('sort-by').value;
    
    switch(sortBy) {
        case 'preco-menor':
            filteredPackages.sort((a, b) => a.price - b.price);
            break;
        case 'preco-maior':
            filteredPackages.sort((a, b) => b.price - a.price);
            break;
        case 'duracao':
            filteredPackages.sort((a, b) => a.duration - b.duration);
            break;
        case 'avaliacao':
            filteredPackages.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Relevância (ordem original)
            filteredPackages = allPackages.filter(pkg => 
                filteredPackages.some(filtered => filtered.id === pkg.id)
            );
    }
    
    currentPage = 1;
    loadAllPackages();
}

function loadMorePackages() {
    const allContainer = document.getElementById('all-packages');
    const startIndex = currentPage * packagesPerPage;
    const endIndex = startIndex + packagesPerPage;
    const packagesToShow = filteredPackages.slice(startIndex, endIndex);
    
    if (packagesToShow.length > 0) {
        allContainer.innerHTML += packagesToShow.map(pkg => createPackageCard(pkg)).join('');
        currentPage++;
        
        // Ocultar botão se não houver mais pacotes
        if (endIndex >= filteredPackages.length) {
            document.querySelector('.load-more').style.display = 'none';
        }
    }
}

function openPackageModal(packageId) {
    currentPackage = allPackages.find(pkg => pkg.id === packageId);
    if (!currentPackage) return;
    
    const modal = document.getElementById('package-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = currentPackage.title;
    
    modalBody.innerHTML = `
        <img src="${currentPackage.image}" alt="${currentPackage.title}" class="modal-package-image" onerror="this.src='../img/placeholder.jpg'">
        
        <div class="modal-package-header">
            <h3 class="modal-package-title">${currentPackage.title}</h3>
            <div class="modal-package-location">
                <i class="fas fa-map-marker-alt"></i>
                ${currentPackage.location}
            </div>
        </div>
        
        <div class="modal-package-details">
            <div class="modal-detail-item">
                <i class="fas fa-calendar"></i>
                <span>${currentPackage.duration} dias</span>
            </div>
            <div class="modal-detail-item">
                <i class="fas fa-tag"></i>
                <span>${getTypeLabel(currentPackage.type)}</span>
            </div>
            <div class="modal-detail-item">
                <i class="fas fa-star"></i>
                <span>${currentPackage.rating} (${currentPackage.reviews} avaliações)</span>
            </div>
            <div class="modal-detail-item">
                <i class="fas fa-users"></i>
                <span>Ideal para ${getTypeLabel(currentPackage.type).toLowerCase()}</span>
            </div>
        </div>
        
        <div class="modal-package-description">
            <p>${currentPackage.description}</p>
        </div>
        
        <div class="modal-package-itinerary">
            <h4><i class="fas fa-route"></i> Itinerário</h4>
            ${currentPackage.itinerary.map(day => `
                <div class="itinerary-day">
                    <h5>Dia ${day.day}: ${day.title}</h5>
                    <p>${day.description}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="modal-package-includes">
            <h4><i class="fas fa-check-circle"></i> O que está incluído</h4>
            <div class="includes-grid">
                ${currentPackage.includes.map(item => `
                    <div class="include-item">
                        <i class="fas fa-check"></i>
                        <span>${item}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="modal-package-price">
            ${currentPackage.originalPrice ? `<div class="price-original">De ${Utils.formatCurrency(currentPackage.originalPrice)}</div>` : ''}
            <div class="modal-price-current">${Utils.formatCurrency(currentPackage.price)}</div>
            <div class="modal-price-installments">ou 12x de ${Utils.formatCurrency(Math.ceil(currentPackage.price / 12))} sem juros</div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePackageModal() {
    const modal = document.getElementById('package-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentPackage = null;
}

function bookPackage(packageId = null) {
    const pkg = packageId ? allPackages.find(p => p.id === packageId) : currentPackage;
    if (!pkg) return;
    
    Utils.showNotification(`Redirecionando para reserva do pacote "${pkg.title}"...`, 'success');
    
    setTimeout(() => {
        window.location.href = `reservas.html?package=${pkg.id}`;
    }, 1500);
}

// Exportar funções globais
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.sortPackages = sortPackages;
window.loadMorePackages = loadMorePackages;
window.openPackageModal = openPackageModal;
window.closePackageModal = closePackageModal;
window.bookPackage = bookPackage;

