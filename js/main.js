// Base URL para GitHub Pages (repositorio de usuario/organización)
const BASE_URL = '/';

let allProjectsData = []; // Para almacenar todos los datos de los proyectos

// Cargar proyectos en la página
async function loadProjects() {
    const projectsContainer = document.querySelector('.projects-grid');
    
    if (!projectsContainer) {
        console.error('No se encontró el contenedor de proyectos');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}DB/proyectos.json`);
        if (!response.ok) throw new Error('Error al cargar proyectos.json');
        
        allProjectsData = await response.json(); // Almacenar todos los proyectos cargados
    } catch (error) {
        console.error(`Error cargando los proyectos:`, error);
        // Mostrar un mensaje de error en la interfaz si es necesario
        projectsContainer.innerHTML = '<p class="text-center text-danger">Error al cargar los proyectos. Por favor, intente de nuevo más tarde.</p>';
        return;
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
                <a href="${BASE_URL}plantilla-proyecto.html?id=${project.id}" class="project-link" data-id="${project.id}">
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
            window.location.href = `${BASE_URL}plantilla-proyecto.html?id=${project.id}`;
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

// Llamar a la función para cargar las estadísticas de GitHub al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
});

// Configuración de la API de GitHub
const GITHUB_USERNAME = 'DenisPablo';
// Opcional: Agrega tu token de acceso personal aquí para aumentar el límite de la API
// const GITHUB_TOKEN = 'tu_token_aqui';

// Función para realizar peticiones a la API de GitHub con manejo de errores
async function fetchWithRateLimit(url) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        // Descomenta la siguiente línea si estás usando un token
        // 'Authorization': `token ${GITHUB_TOKEN}`
    };

    try {
        const response = await fetch(url, { headers });
        
        // Verificar si hemos alcanzado el límite de la API
        if (response.status === 403) {
            const rateLimitReset = response.headers.get('X-RateLimit-Reset');
            const resetTime = rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : 'pocos minutos';
            throw new Error(`Límite de la API de GitHub alcanzado. Por favor, inténtalo de nuevo después de ${resetTime}.`);
        }
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en la petición a GitHub:', error);
        throw error;
    }
}

// Lógica para obtener y mostrar estadísticas de GitHub
async function fetchGitHubStats() {
    const username = GITHUB_USERNAME;
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=10`;
    
    // Mostrar estado de carga
    document.getElementById('github-repos-count').textContent = 'Cargando...';
    document.getElementById('github-stars-count').textContent = 'Cargando...';
    document.getElementById('github-commits-count').textContent = 'Cargando...';
    document.querySelector('.language-chart').innerHTML = '<p class="text-muted">Cargando datos de lenguajes...</p>';
    document.querySelector('.activity-list').innerHTML = '<p class="text-muted">Cargando actividad reciente...</p>';

    try {
        // Obtener repositorios
        const repos = await fetchWithRateLimit(reposUrl);

        // Calcular número de repositorios públicos

        // Calcular número de repositorios públicos y commits
        const publicRepos = repos.filter(repo => !repo.fork);
        const publicReposCount = publicRepos.length;
        document.getElementById('github-repos-count').textContent = publicReposCount;
        
        // Contar commits totales
        let totalCommits = 0;
        for (const repo of publicRepos) {
            try {
                const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`;
                const commitsResponse = await fetch(commitsUrl);
                if (commitsResponse.ok) {
                    const linkHeader = commitsResponse.headers.get('Link');
                    if (linkHeader) {
                        const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
                        if (matches && matches[1]) {
                            totalCommits += parseInt(matches[1], 10);
                        }
                    }
                }
            } catch (e) {
                console.error(`Error al obtener commits de ${repo.name}:`, e);
            }
        }
        document.getElementById('github-commits-count').textContent = totalCommits;

        // Obtener estrellas totales (requiere paginación para más de 100 repos)
        const totalStars = await fetchTotalStars(username);
        document.getElementById('github-stars-count').textContent = totalStars;

        // Calcular lenguajes más usados
        const languageBytes = {};
        
        // Obtener los lenguajes de cada repositorio
        for (const repo of publicRepos) {
            try {
                try {
                    const languagesUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;
                    const languages = await fetchWithRateLimit(languagesUrl);
                    
                    // Sumar los bytes por lenguaje
                    Object.entries(languages).forEach(([lang, bytes]) => {
                        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
                    });
                } catch (error) {
                    console.error(`Error al obtener lenguajes para ${repo.name}:`, error);
                    // Continuar con el siguiente repositorio
                }
            } catch (e) {
                console.error(`Error al obtener lenguajes de ${repo.name}:`, e);
            }
        }

        // Ordenar lenguajes por uso (de mayor a menor)
        const sortedLanguages = Object.entries(languageBytes)
            .sort(([, a], [, b]) => b - a);
            
        const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

        const languageChart = document.querySelector('.language-chart');
        const languageLegend = document.querySelector('.language-legend');
        languageChart.innerHTML = '';
        languageLegend.innerHTML = '';

        // Colores para los lenguajes (puedes personalizarlos)
        const colors = [
            '#f1e05a', // JavaScript
            '#3572A5',  // TypeScript
            '#b07219',  // Java
            '#178600',  // CSS
            '#e34c26',  // HTML
            '#563d7c',  // Ruby
            '#f34b7d',  // Python
            '#89e051'   // Go
        ];

        // Mostrar solo los 5 lenguajes principales
        sortedLanguages.slice(0, 5).forEach(([lang, bytes], index) => {
            const percentage = (bytes / totalBytes) * 100;
            const color = colors[index % colors.length];

            // Crear barra de progreso
            const barContainer = document.createElement('div');
            barContainer.className = 'progress mb-2';
            barContainer.style.height = '20px';
            
            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.style.width = `${percentage}%`;
            bar.style.backgroundColor = color;
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuenow', percentage.toFixed(1));
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('data-lang', lang);
            bar.title = `${lang}: ${percentage.toFixed(1)}%`;
            
            barContainer.appendChild(bar);
            languageChart.appendChild(barContainer);

            // Crear ítem de leyenda
            const legendItem = document.createElement('div');
            legendItem.className = 'd-flex align-items-center mb-1';
            legendItem.innerHTML = `
                <span class="d-inline-block me-2" style="width: 12px; height: 12px; background-color: ${color};"></span>
                <span class="me-2">${lang}</span>
                <span class="ms-auto">${percentage.toFixed(1)}%</span>
            `;
            languageLegend.appendChild(legendItem);
        });

        // Obtener actividad reciente (últimos eventos)
        const events = await fetchWithRateLimit(eventsUrl);

        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = '';
        
        // Mapeo de tipos de eventos a íconos y textos
        const eventTypes = {
            'PushEvent': { icon: 'git', class: 'info', text: 'Commit en' },
            'CreateEvent': { icon: 'plus-circle', class: 'success', text: 'Nuevo repositorio' },
            'PullRequestEvent': { icon: 'git-pull-request', class: 'primary', text: 'Pull Request' },
            'IssuesEvent': { icon: 'exclamation-circle', class: 'warning', text: 'Issue' },
            'ForkEvent': { icon: 'git', class: 'secondary', text: 'Hizo fork de' },
            'WatchEvent': { icon: 'star', class: 'warning', text: 'Dio estrella a' },
            'IssueCommentEvent': { icon: 'chat-left-text', class: 'info', text: 'Comentó en issue' },
            'PullRequestReviewCommentEvent': { icon: 'chat-square-text', class: 'primary', text: 'Revisó PR' }
        };

        // Filtrar y mapear eventos
        const filteredEvents = events
            .filter(event => eventTypes[event.type]) // Solo eventos que tenemos mapeados
            .slice(0, 5); // Mostrar máximo 5 eventos

        if (filteredEvents.length === 0) {
            const noActivity = document.createElement('li');
            noActivity.className = 'list-group-item bg-transparent text-light border-secondary';
            noActivity.textContent = 'No hay actividad reciente para mostrar';
            activityList.appendChild(noActivity);
            return;
        }

        filteredEvents.forEach(event => {
            const eventType = eventTypes[event.type];
            const timeAgo = formatTimeAgo(new Date(event.created_at));
            const repoName = event.repo ? event.repo.name.split('/')[1] : '';
            
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item bg-transparent text-light border-secondary d-flex align-items-center';
            
            // Crear ícono del evento
            const icon = document.createElement('i');
            icon.className = `bi bi-${eventType.icon} me-2 text-${eventType.class}`;
            
            // Crear contenedor de texto
            const textContainer = document.createElement('div');
            textContainer.className = 'flex-grow-1';
            
            // Crear mensaje del evento
            const message = document.createElement('span');
            
            // Personalizar mensaje según el tipo de evento
            if (event.type === 'PushEvent' && event.payload.commits) {
                const commit = event.payload.commits[0] || {};
                const commitMessage = commit.message && commit.message.length > 50 
                    ? commit.message.substring(0, 50) + '...' 
                    : commit.message || 'Sin mensaje';
                message.textContent = `${eventType.text} ${repoName}: ${commitMessage}`;
            } else if (event.type === 'CreateEvent') {
                message.textContent = `${eventType.text} ${repoName}`;
            } else if (event.type === 'PullRequestEvent') {
                const action = event.payload.action; // opened, closed, etc.
                const pr = event.payload.pull_request;
                message.textContent = `${eventType.text} #${pr.number}: ${pr.title}`;
            } else if (event.type === 'IssuesEvent') {
                const action = event.payload.action;
                const issue = event.payload.issue;
                message.textContent = `${eventType.text} #${issue.number}: ${issue.title} (${action})`;
            } else {
                message.textContent = `${eventType.text} ${repoName}`;
            }
            
            // Crear contenedor de tiempo
            const timeContainer = document.createElement('span');
            timeContainer.className = 'text-secondary ms-2';
            timeContainer.textContent = timeAgo;
            
            // Construir la estructura del elemento
            textContainer.appendChild(message);
            listItem.appendChild(icon);
            listItem.appendChild(textContainer);
            listItem.appendChild(timeContainer);
            
            // Hacer que el elemento sea clickeable si es un evento con URL
            if (event.repo) {
                listItem.style.cursor = 'pointer';
                listItem.addEventListener('click', () => {
                    window.open(`https://github.com/${event.repo.name}`, '_blank');
                });
                listItem.style.transition = 'background-color 0.2s';
                listItem.addEventListener('mouseover', () => {
                    listItem.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                });
                listItem.addEventListener('mouseout', () => {
                    listItem.style.backgroundColor = 'transparent';
                });
            }
            
            activityList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de GitHub:', error);
        
        // Mostrar mensaje de error en la interfaz
        const errorMessage = error.message || 'Error desconocido al conectar con GitHub';
        const errorHtml = `
            <div class="alert alert-warning" role="alert">
                <h4 class="alert-heading">¡Ups! Algo salió mal</h4>
                <p>${errorMessage}</p>
                <hr>
                <p class="mb-0">
                    <small>
                        Si el problema persiste, puedes ver mis repositorios directamente en 
                        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="alert-link">mi perfil de GitHub</a>.
                    </small>
                </p>
            </div>
        `;
        
        const githubStatsSection = document.getElementById('github-stats');
        if (githubStatsSection) {
            githubStatsSection.innerHTML = `<div class="container">${errorHtml}</div>`;
        }
        
        // Actualizar contadores con valores por defecto
        document.getElementById('github-repos-count').textContent = 'Error';
        document.getElementById('github-stars-count').textContent = 'Error';
        document.getElementById('github-commits-count').textContent = 'Error';
        
        // Mostrar mensaje en la consola para desarrolladores
        console.info('Sugerencia: Para evitar límites de la API, considera crear un token de acceso personal en GitHub y configurarlo en el código.');

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
