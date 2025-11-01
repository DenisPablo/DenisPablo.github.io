// Base URL para GitHub Pages (repositorio de usuario/organización)
const BASE_URL = '/';

// Lista de archivos JSON de proyectos con sus rutas
const projectFiles = [
    { path: 'exoplanetas-clasificacion-avanzada/data.json', slug: 'exoplanetas-clasificacion-avanzada' },
    { path: 'sistema-de-gestion-para-academias-de-bjj/data.json', slug: 'sistema-de-gestion-para-academias-de-bjj' },
    { path: 'sistema-de-gestion-de-entradas-y-tickets/data.json', slug: 'sistema-de-gestion-de-entradas-y-tickets' },
    { path: 'portfolio-&-cms-personal/data.json', slug: 'portfolio-&-cms-personal' }
];

let allProjectsData = []; // Para almacenar todos los datos de los proyectos

// Cargar proyectos en la página
async function loadProjects() {
    const projectsContainer = document.querySelector('.projects-grid');
    
    if (!projectsContainer) {
        console.error('No se encontró el contenedor de proyectos');
        return;
    }

    for (const projectInfo of projectFiles) {
        try {
            const response = await fetch(`${BASE_URL}proyectos/${projectInfo.path}`);
            if (!response.ok) throw new Error(`Error al cargar ${projectInfo.path}`);
            
            const project = await response.json();
            project.slug = projectInfo.slug;
            allProjectsData.push(project); // Almacenar el proyecto cargado
        } catch (error) {
            console.error(`Error cargando el proyecto ${projectInfo.path}:`, error);
            // No agregamos un elemento de error aquí, se manejará al renderizar
        }
    }
    displayProjects(allProjectsData); // Mostrar todos los proyectos inicialmente
}

// Mostrar proyectos filtrados
function displayProjects(projectsToDisplay) {
    const projectsContainer = document.querySelector('.projects-grid');
    projectsContainer.innerHTML = ''; // Limpiar contenedor
    
    if (projectsToDisplay.length === 0) {
        projectsContainer.innerHTML = '<p class="text-center text-secondary">No se encontraron proyectos para este filtro.</p>';
        return;
    }

    projectsToDisplay.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsContainer.appendChild(projectCard);
    });
}

// Crear tarjeta de proyecto
function createProjectCard(project) {
    const projectElement = document.createElement('div');
    projectElement.className = 'project-card';
    
    // Añadir data-attributes para el filtrado
    const technologiesString = project.technologies.join(' ').toLowerCase();
    const isAITech = project.technologies.some(tech => ['python', 'scikit-learn', 'fastapi'].includes(tech.toLowerCase())) || project.title.toLowerCase().includes('ia'); // Heurística simple para IA
    const isBackend = project.technologies.some(tech => ['python', 'c#', 'fastapi', 'django', 'asp.net core', 'postgresql', 'mysql', 'sql server'].includes(tech.toLowerCase()));
    const isFrontend = project.technologies.some(tech => ['html', 'css', 'javascript', 'bootstrap', 'jquery'].includes(tech.toLowerCase()));

    projectElement.setAttribute('data-technologies', technologiesString);
    if (isAITech) projectElement.setAttribute('data-category-ia', 'true');
    if (isBackend) projectElement.setAttribute('data-category-backend', 'true');
    if (isFrontend) projectElement.setAttribute('data-category-frontend', 'true');
    
    const projectSlug = project.slug || 'proyecto';
    
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
                ${project.technologies.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
            </div>
            
            <div class="project-links">
                <a href="${BASE_URL}proyectos/${projectSlug}/" class="project-link" data-slug="${projectSlug}">
                    <i class="bi bi-eye"></i> Ver detalles
                </a>
                ${project.code && project.code !== '#' ? `
                <a href="${project.code}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-github"></i> Código
                </a>` : ''}
                ${project.demo && project.demo !== '#' ? `
                <a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-box-arrow-up-right"></i> Demo
                </a>` : ''}
            </div>
        </div>
    `;
    
    projectElement.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            window.location.href = `${BASE_URL}proyectos/${projectSlug}/`;
        }
    });
    
    return projectElement;
}

// Lógica de filtrado de proyectos
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const projectsContainer = document.querySelector('.projects-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            let filteredProjects = [];

            if (filter === 'all') {
                filteredProjects = allProjectsData;
            } else if (filter === 'IA') {
                filteredProjects = allProjectsData.filter(project => 
                    project.technologies.some(tech => ['python', 'scikit-learn', 'fastapi'].includes(tech.toLowerCase())) || project.title.toLowerCase().includes('ia')
                );
            } else if (filter === 'Backend') {
                filteredProjects = allProjectsData.filter(project => 
                    project.technologies.some(tech => ['python', 'c#', 'fastapi', 'django', 'asp.net core', 'postgresql', 'mysql', 'sql server'].includes(tech.toLowerCase()))
                );
            } else if (filter === 'Frontend') {
                filteredProjects = allProjectsData.filter(project => 
                    project.technologies.some(tech => ['html', 'css', 'javascript', 'bootstrap', 'jquery'].includes(tech.toLowerCase()))
                );
            } else {
                filteredProjects = allProjectsData.filter(project => 
                    project.technologies.some(tech => tech.toLowerCase() === filter.toLowerCase())
                );
            }
            displayProjects(filteredProjects);
        });
    });
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
    setupProjectFilters();
    setupScrollAnimations();
    fetchGitHubStats(); // Llamar a la función para obtener estadísticas de GitHub
    
    // Añadir clase de animación después de cargar la página
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    typeWriter(); // Llamar a la función de escritura
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

// Lógica para obtener y mostrar estadísticas de GitHub
async function fetchGitHubStats() {
    const username = 'DenisPablo';
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=10`;

    try {
        // Obtener repositorios
        const reposResponse = await fetch(reposUrl);
        if (!reposResponse.ok) throw new Error(`Error al obtener repositorios: ${reposResponse.statusText}`);
        const repos = await reposResponse.json();

        // Calcular número de repositorios públicos

        // Calcular número de repositorios públicos
        const publicReposCount = repos.filter(repo => !repo.fork).length;
        document.getElementById('github-repos-count').textContent = publicReposCount;

        // Obtener estrellas totales (requiere paginación para más de 100 repos)
        const totalStars = await fetchTotalStars(username);
        document.getElementById('github-stars-count').textContent = totalStars;

        // Calcular lenguajes más usados
        const languageCounts = {};
        repos.forEach(repo => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
        });

        const sortedLanguages = Object.entries(languageCounts).sort(([, a], [, b]) => b - a);
        const totalReposWithLanguage = sortedLanguages.reduce((sum, [, count]) => sum + count, 0);

        const languageChart = document.querySelector('.language-chart');
        const languageLegend = document.querySelector('.language-legend');
        languageChart.innerHTML = '';
        languageLegend.innerHTML = '';

        const colors = ['#f1e05a', '#3572A5', '#b07219', '#178600', '#e34c26', '#563d7c', '#dea584', '#f34b7d']; // Colores para lenguajes

        sortedLanguages.slice(0, 5).forEach(([lang, count], index) => {
            const percentage = (count / totalReposWithLanguage) * 100;
            const color = colors[index % colors.length];

            const bar = document.createElement('div');
            bar.className = 'language-bar';
            bar.style.width = `${percentage}%`;
            bar.style.backgroundColor = color;
            bar.setAttribute('data-lang', lang);
            languageChart.appendChild(bar);

            const legendItem = document.createElement('span');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `<span class="legend-color" style="background-color: ${color};"></span> ${lang} (${percentage.toFixed(1)}%)`;
            languageLegend.appendChild(legendItem);
        });

        // Obtener actividad reciente (últimos commits/eventos)
        const eventsResponse = await fetch(eventsUrl);
        if (!eventsResponse.ok) throw new Error(`Error al obtener eventos: ${eventsResponse.statusText}`);
        const events = await eventsResponse.json();

        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = '';
        events.slice(0, 3).forEach(event => {
            if (event.type === 'PushEvent' && event.payload.commits) {
                const commit = event.payload.commits[0];
                const repoName = event.repo.name.split('/')[1];
                const timeAgo = formatTimeAgo(new Date(event.created_at));
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item bg-transparent text-light border-secondary';
                listItem.innerHTML = `<i class="bi bi-git me-2 text-info"></i> Nuevo commit en "${repoName}" - "${commit.message}" <span class="float-end text-secondary">${timeAgo}</span>`;
                activityList.appendChild(listItem);
            } else if (event.type === 'CreateEvent' && event.payload.ref_type === 'repository') {
                const repoName = event.repo.name.split('/')[1];
                const timeAgo = formatTimeAgo(new Date(event.created_at));
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item bg-transparent text-light border-secondary';
                listItem.innerHTML = `<i class="bi bi-folder-plus me-2 text-success"></i> Nuevo repositorio creado: "${repoName}" <span class="float-end text-secondary">${timeAgo}</span>`;
                activityList.appendChild(listItem);
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas de GitHub:', error);
        const githubStatsSection = document.getElementById('github-stats');
        if (githubStatsSection) {
            githubStatsSection.innerHTML = '<div class="container"><p class="text-center text-danger">Error al cargar las estadísticas de GitHub. Por favor, inténtalo de nuevo más tarde.</p></div>';
        }
        // Limpiar los elementos que muestran "Cargando..." si la API falla
        document.getElementById('github-repos-count').textContent = 'N/A';
        document.getElementById('github-stars-count').textContent = 'N/A';
        document.getElementById('github-commits-count').textContent = 'N/A';

        document.querySelector('.language-chart').innerHTML = '<p class="text-center text-secondary">No se pudieron cargar los lenguajes.</p>';
        document.querySelector('.language-legend').innerHTML = '';

        document.querySelector('.activity-list').innerHTML = '<li class="list-group-item bg-transparent text-light border-secondary text-center">No se pudo cargar la actividad reciente.</li>';
    }
}

// Función para obtener el número total de estrellas
async function fetchTotalStars(username) {
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    let allRepos = [];
    let page = 1;
    let response;

    do {
        response = await fetch(`${reposUrl}&page=${page}`);
        const repos = await response.json();
        allRepos = allRepos.concat(repos);
        page++;
    } while (response.headers.get('Link') && response.headers.get('Link').includes('rel="next"'));

    return allRepos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

// Función auxiliar para formatear el tiempo
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
}

// Lógica para animaciones al scroll
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                entry.target.classList.remove('hidden-section');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('hidden-section'); // Ocultar inicialmente
        observer.observe(section);
    });
}
