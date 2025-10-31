// Base URL para GitHub Pages (repositorio de usuario/organización)
const BASE_URL = '/';

// Lista de archivos JSON de proyectos con sus rutas
const projects = [
    { path: 'exoplanetas-clasificacion-avanzada/data.json', slug: 'exoplanetas-clasificacion-avanzada' },
    { path: 'sistema-de-gestion-para-academias-de-bjj/data.json', slug: 'sistema-de-gestion-para-academias-de-bjj' },
    { path: 'sistema-de-gestion-de-entradas-y-tickets/data.json', slug: 'sistema-de-gestion-de-entradas-y-tickets' },
    { path: 'portfolio-&-cms-personal/data.json', slug: 'portfolio-&-cms-personal' }
];

// Cargar proyectos en la página
async function loadProjects() {
    const projectsContainer = document.querySelector('.projects-grid');
    
    if (!projectsContainer) {
        console.error('No se encontró el contenedor de proyectos');
        return;
    }
    
    for (const projectInfo of projects) {
        try {
            // Cargar el archivo JSON
            const response = await fetch(`${BASE_URL}proyectos/${projectInfo.path}`);
            if (!response.ok) throw new Error(`Error al cargar ${projectInfo.path}`);
            
            const project = await response.json();
            // Agregar el slug al objeto del proyecto para usarlo en los enlaces
            project.slug = projectInfo.slug;
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        } catch (error) {
            console.error(`Error cargando el proyecto ${file}:`, error);
            // Mostrar un mensaje de error o un proyecto vacío
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = `Error al cargar el proyecto: ${file}`;
            projectsContainer.appendChild(errorElement);
        }
    }
}

// Crear tarjeta de proyecto
function createProjectCard(project) {
    const projectElement = document.createElement('div');
    projectElement.className = 'project-card';
    
    // Usar el slug que ya está en el objeto del proyecto
    const projectSlug = project.slug || 'proyecto';
    
    // Limitar la descripción a 120 caracteres
    const shortDesc = project.shortDescription.length > 120 
        ? project.shortDescription.substring(0, 117) + '...' 
        : project.shortDescription;
    
    projectElement.innerHTML = `
        <div class="project-info">
            <h3 class="project-title">
                ${project.title}
                ${project.status ? `<span class="status" data-status="${project.status}">${project.status}</span>` : ''}
            </h3>
            <p class="project-short-description">${shortDesc}</p>
            
            <div class="technologies">
                ${project.technologies.slice(0, 3).map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
                ${project.technologies.length > 3 ? '<span class="tech-tag">+' + (project.technologies.length - 3) + '</span>' : ''}
            </div>
            
            <div class="project-links">
                <a href="${BASE_URL}proyectos/${projectSlug}/" class="project-link" data-slug="${projectSlug}">
                    <i class="bi bi-eye"></i> Ver detalles
                </a>
                ${project.code !== '#' ? `
                <a href="${project.code}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-github"></i> Código
                </a>` : ''}
                ${project.demo !== '#' ? `
                <a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-box-arrow-up-right"></i> Demo
                </a>` : ''}
            </div>
        </div>
    `;
    
    // Agregar evento de clic a la tarjeta
    projectElement.addEventListener('click', (e) => {
        // Solo navegar si el clic no fue en un enlace
        if (!e.target.closest('a')) {
            window.location.href = `${BASE_URL}proyectos/${projectSlug}/`;
        }
    });
    
    return projectElement;
}

// Menú móvil
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Cerrar menú al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Header con scroll
function setupHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('header-scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll hacia abajo
            header.classList.add('scroll-down');
            header.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll hacia arriba
            header.classList.remove('scroll-down');
            header.style.transform = 'translateY(0)';
            header.classList.add('header-scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Actualizar año en el footer
function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupMobileMenu();
    setupHeaderScroll();
    updateYear();
    
    // Añadir clase de animación después de cargar la página
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Efecto de escritura en el título
function typeWriter() {
    const titleElement = document.querySelector('.hero h1');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    
    let i = 0;
    const speed = 100; // Velocidad de escritura en milisegundos
    
    function type() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Llamar a la función de escritura cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', typeWriter);
