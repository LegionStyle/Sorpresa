// escritos.js - Versión corregida para usar poemas.json

// Variable global para almacenar los poemas
let poemas = [];

// Crear estrellas animadas románticas
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Tamaño aleatorio entre 1 y 4px
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Posición aleatoria
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Duración de animación aleatoria
        star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);

        // Retraso de animación aleatorio
        star.style.animationDelay = `${Math.random() * 8}s`;

        // Color aleatorio (tonos rosados y dorados)
        const hue = Math.random() > 0.5 ?
            Math.random() * 20 + 330 : // Rosados
            Math.random() * 20 + 40;   // Dorados
        star.style.backgroundColor = `hsl(${hue}, 80%, 70%)`;

        starsContainer.appendChild(star);
    }
}

// Crear pétalos flotantes
function createPetals() {
    const petalsContainer = document.getElementById('petals');
    if (!petalsContainer) return;
    
    const petalCount = 15;
    const petalSymbols = ['❀', '✿', '❁', '🌸', '💮', '🏵️'];

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];

        // Posición aleatoria
        petal.style.left = `${Math.random() * 100}%`;

        // Tamaño aleatorio
        const size = Math.random() * 20 + 15;
        petal.style.fontSize = `${size}px`;

        // Duración y retraso de animación
        const duration = Math.random() * 10 + 10;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;

        // Opacidad aleatoria
        petal.style.opacity = Math.random() * 0.5 + 0.3;

        petalsContainer.appendChild(petal);
    }
}

// Cargar poemas desde el archivo JSON
async function cargarPoemas() {
    try {
        // Mostrar indicador de carga
        const container = document.getElementById('poemas-container');
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="heart-spinner"></div>
                    <p>Cargando poemas...</p>
                </div>
            `;
        }

        // Intentar cargar desde la carpeta Scripts primero
        let respuesta;
        try {
            respuesta = await fetch('Scripts/poemas.json');
            if (!respuesta.ok) {
                throw new Error('No encontrado en Scripts/');
            }
        } catch (error) {
            // Si no está en Scripts, intentar en la raíz
            respuesta = await fetch('poemas.json');
        }

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los poemas');
        }
        
        poemas = await respuesta.json();
        renderPoemas();
    } catch (error) {
        console.error('Error al cargar poemas:', error);
        // Mostrar mensaje de error en el contenedor
        const container = document.getElementById('poemas-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>🌸 Lo sentimos, no se pudieron cargar los poemas. 🌸</p>
                    <p>Por favor, intenta más tarde.</p>
                    <button onclick="location.reload()" class="reload-btn">Reintentar</button>
                </div>
            `;
        }
    }
}

// Mostrar los poemas en el grid
function renderPoemas() {
    const container = document.getElementById('poemas-container');
    if (!container) return;

    container.innerHTML = '';

    if (!poemas || poemas.length === 0) {
        container.innerHTML = '<p class="no-poemas">No hay poemas disponibles 💔</p>';
        return;
    }

    poemas.forEach(poema => {
        const card = document.createElement('div');
        card.className = 'poema-card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
            <h3>${poema.titulo}</h3>
            <p class="resumen">${poema.resumen}</p>
            <button class="leer-mas" data-id="${poema.id}">Leer completo 📖</button>
        `;
        container.appendChild(card);
    });
}

// Mostrar el modal con el poema completo
function showPoemaModal(id) {
    const poema = poemas.find(p => p.id === id);
    if (!poema) return;

    const modal = document.getElementById('poema-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalContenido = document.getElementById('modal-contenido');

    if (!modal || !modalTitulo || !modalContenido) return;

    modalTitulo.textContent = poema.titulo;
    // Reemplazar saltos de línea con <br> para formato HTML
    // También manejar espacios y mantener el formato original
    let contenidoFormateado = poema.contenido
        .replace(/\n/g, '<br>')
        .replace(/ {2,}/g, '&nbsp;&nbsp;');
    
    modalContenido.innerHTML = contenidoFormateado;

    // Mostrar modal con animación
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Enfocar el modal para accesibilidad
    setTimeout(() => {
        const modalBox = document.querySelector('.modal-box');
        if (modalBox) modalBox.focus();
    }, 100);
}

// Cerrar el modal
function closePoemaModal() {
    const modal = document.getElementById('poema-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Configurar eventos
function setupEventListeners() {
    // Abrir modal al hacer clic en un poema
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('leer-mas')) {
            e.preventDefault();
            const id = parseInt(e.target.getAttribute('data-id'));
            showPoemaModal(id);
        }
    });

    // Cerrar modal con el botón X
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closePoemaModal();
        });
    }

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('poema-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePoemaModal();
            }
        });
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('poema-modal');
            if (modal && modal.classList.contains('active')) {
                closePoemaModal();
            }
        }
    });

    // Manejar navegación del menú
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                // Permitir la navegación normal
                return true;
            }
        });
    });
}

// Inicializar la página
async function init() {
    // Mostrar la página con fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Crear elementos decorativos
    createStars();
    createPetals();
    
    // Cargar poemas
    await cargarPoemas();
    
    // Configurar eventos
    setupEventListeners();

    // Efecto de carga suave
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM ya está cargado
    init();
}

// Manejar errores de red
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.log('Error cargando recurso:', e.target.src || e.target.href);
    }
});

// Exportar funciones para uso global (opcional)
window.closePoemaModal = closePoemaModal;