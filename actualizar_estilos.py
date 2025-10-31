import os
from pathlib import Path

def actualizar_estilos_proyectos():
    # Directorio base de proyectos
    proyectos_dir = Path('proyectos')
    
    # Plantilla de búsqueda y reemplazo
    reemplazos = [
        # Asegurar que el body tenga la clase project-page
        ('<body>', '<body class="project-page">'),
        # Asegurar que los botones tengan las clases correctas
        ('class="btn btn-primary"', 'class="btn btn-primary mb-2"'),
        # Asegurar que los enlaces de GitHub tengan el ícono correcto
        ('<i class="bi bi-github">', '<i class="bi bi-github"></i>'),
        # Asegurar que los enlaces de demo tengan el ícono correcto
        ('<i class="bi bi-box-arrow-up-right">', '<i class="bi bi-box-arrow-up-right"></i>')
    ]
    
    # Recorrer todos los directorios de proyectos
    for proyecto in proyectos_dir.iterdir():
        if proyecto.is_dir():
            index_html = proyecto / 'index.html'
            if index_html.exists():
                print(f"Actualizando {index_html}...")
                
                # Leer el contenido del archivo
                with open(index_html, 'r', encoding='utf-8') as f:
                    contenido = f.read()
                
                # Aplicar reemplazos
                for busqueda, reemplazo in reemplazos:
                    contenido = contenido.replace(busqueda, reemplazo)
                
                # Escribir el contenido actualizado
                with open(index_html, 'w', encoding='utf-8') as f:
                    f.write(contenido)
                
                print(f"✓ {index_html} actualizado")

if __name__ == "__main__":
    actualizar_estilos_proyectos()
    print("\n¡Proceso completado!")
    print("Se han actualizado los estilos de todos los proyectos para que coincidan con el estilo de ExoPlanetas.")
