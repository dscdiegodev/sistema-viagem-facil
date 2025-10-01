// JavaScript principal para funcionalidades globais

// Navegação mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de fade-in para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observar elementos que devem ter animação
    document.querySelectorAll('.feature-card, .destination-card, .section-title').forEach(el => {
        observer.observe(el);
    });
});

// Utilitários globais
const Utils = {
    // Validação de email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validação de telefone brasileiro
    validatePhone: function(phone) {
        const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return re.test(phone);
    },

    // Formatação de moeda
    formatCurrency: function(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de data
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },

    // Mostrar notificação
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    padding: 1rem;
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-warning { border-left: 4px solid #f59e0b; }
                .notification-info { border-left: 4px solid #3b82f6; }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // Loading spinner
    showLoading: function(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        element.disabled = true;
        
        return function hideLoading() {
            element.innerHTML = originalContent;
            element.disabled = false;
        };
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Simulação de API
const API = {
    baseURL: '/api',

    // Simular busca de voos
    searchFlights: async function(searchData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const flights = [
                    {
                        id: 1,
                        airline: 'LATAM',
                        departure: searchData.origem,
                        arrival: searchData.destino,
                        departureTime: '08:00',
                        arrivalTime: '12:00',
                        price: 599.99,
                        duration: '4h'
                    },
                    {
                        id: 2,
                        airline: 'GOL',
                        departure: searchData.origem,
                        arrival: searchData.destino,
                        departureTime: '14:30',
                        arrivalTime: '18:30',
                        price: 549.99,
                        duration: '4h'
                    },
                    {
                        id: 3,
                        airline: 'Azul',
                        departure: searchData.origem,
                        arrival: searchData.destino,
                        departureTime: '19:15',
                        arrivalTime: '23:15',
                        price: 629.99,
                        duration: '4h'
                    }
                ];
                resolve(flights);
            }, 1500);
        });
    },

    // Simular busca de hotéis
    searchHotels: async function(searchData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const hotels = [
                    {
                        id: 1,
                        name: 'Hotel Luxo Premium',
                        location: searchData.destino,
                        rating: 5,
                        price: 299.99,
                        amenities: ['Wi-Fi', 'Piscina', 'Academia', 'Spa']
                    },
                    {
                        id: 2,
                        name: 'Hotel Conforto',
                        location: searchData.destino,
                        rating: 4,
                        price: 199.99,
                        amenities: ['Wi-Fi', 'Café da manhã', 'Academia']
                    },
                    {
                        id: 3,
                        name: 'Hotel Econômico',
                        location: searchData.destino,
                        rating: 3,
                        price: 129.99,
                        amenities: ['Wi-Fi', 'Café da manhã']
                    }
                ];
                resolve(hotels);
            }, 1500);
        });
    },

    // Simular envio de formulário de contato
    sendContact: async function(contactData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (contactData.email && contactData.message) {
                    resolve({ success: true, message: 'Mensagem enviada com sucesso!' });
                } else {
                    reject({ success: false, message: 'Erro ao enviar mensagem. Verifique os dados.' });
                }
            }, 1000);
        });
    }
};

// Exportar para uso global
window.Utils = Utils;
window.API = API;

