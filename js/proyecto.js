document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        console.error('No se encontró el ID del proyecto en la URL.');
        // Redirigir a una página de error o al index
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('/DB/proyectos.json');
        if (!response.ok) throw new Error('Error al cargar proyectos.json');
        const allProjects = await response.json();

        const projectData = allProjects.find(p => p.id === parseInt(projectId));

        if (!projectData) {
            console.error(`No se encontró el proyecto con ID: ${projectId}`);
            // Redirigir a una página de error o al index
            window.location.href = '/index.html';
            return;
        }

        // Actualizar contenido con los datos del proyecto
        document.title = `${projectData.title} | Mi Portfolio`;
        document.getElementById('project-title').textContent = projectData.title;
        document.getElementById('project-subtitle').textContent = projectData.shortDescription;
        document.getElementById('project-description').innerHTML = `<p>${projectData.longDescription}</p>`;
        document.getElementById('project-year').textContent = projectData.year;
        document.getElementById('project-status').textContent = projectData.status || 'Completado';
        
        // Añadir características
        const featuresList = document.getElementById('project-features');
        if (projectData.features && projectData.features.length > 0) {
            featuresList.innerHTML = ''; // Limpiar por si acaso
            projectData.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        } else {
            // Ocultar el título de características si no hay
            const featuresTitle = featuresList.previousElementSibling;
            if (featuresTitle && featuresTitle.tagName === 'H3') {
                featuresTitle.style.display = 'none';
            }
            featuresList.style.display = 'none';
        }
        
        // Añadir tecnologías
        const techContainer = document.getElementById('project-technologies');
        if (projectData.technologies && projectData.technologies.length > 0) {
            techContainer.innerHTML = ''; // Limpiar por si acaso
            projectData.technologies.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tech;
                techContainer.appendChild(span);
            });
        }
        
        // Añadir enlaces
        const linksContainer = document.getElementById('project-links');
        linksContainer.innerHTML = ''; // Limpiar por si acaso

        if (projectData.code && projectData.code !== '#') {
            const codeLink = document.createElement('a');
            codeLink.href = projectData.code;
            codeLink.className = 'btn btn-primary mb-2';
            codeLink.target = '_blank';
            codeLink.rel = 'noopener noreferrer';
            codeLink.innerHTML = '<i class="bi bi-github"></i> Ver en GitHub';
            linksContainer.appendChild(codeLink);
        }
        
        if (projectData.demo && projectData.demo !== '#') {
            const demoLink = document.createElement('a');
            demoLink.href = projectData.demo;
            demoLink.className = 'btn btn-outline-primary';
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> Ver Demo';
            linksContainer.appendChild(demoLink);
        }

        // Actualizar año en el footer
        document.getElementById('current-year').textContent = new Date().getFullYear();

    } catch (error) {
        console.error('Error al cargar los datos del proyecto:', error);
        // Mostrar un mensaje de error en la página o redirigir
        document.getElementById('project-title').textContent = 'Error al cargar el proyecto';
        document.getElementById('project-subtitle').textContent = 'Por favor, intente de nuevo más tarde.';
        document.getElementById('project-description').innerHTML = '<p>Hubo un problema al obtener los detalles del proyecto.</p>';
    }
});
