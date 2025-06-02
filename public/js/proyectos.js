// Array para almacenar los proyectos
let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [
    {
        id: 1,
        titulo: "Proyecto Musical",
        descripcion: "Grabación de música tradicional palmareña",
        tipo: "audio",
        archivo: "../audios/musica_tradicional.mp3"
    },
    {
        id: 2,
        titulo: "Exposición Fotográfica",
        descripcion: "Fotografías históricas de la comunidad",
        tipo: "imagen",
        archivo: "../images/exposicion_fotografica.jpg"
    }
];

// Guardar proyectos en localStorage
function guardarProyectos() {
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
}

// Función para renderizar todos los proyectos
function renderizarProyectos() {
    const contenedor = document.getElementById('contenedor-proyectos');
    contenedor.innerHTML = '';

    if (proyectos.length === 0) {
        contenedor.innerHTML = '<p class="sin-proyectos">No hay proyectos aún. Agrega uno para comenzar.</p>';
        return;
    }

    proyectos.forEach(proyecto => {
        let mediaContent = '';
        
        if (proyecto.tipo === 'imagen') {
            mediaContent = `
                <div class="contenedor-imagen">
                    <img src="${proyecto.archivo}" alt="${proyecto.titulo}">
                </div>
            `;
        } else if (proyecto.tipo === 'audio') {
            mediaContent = `
                <div class="reproductor-audio">
                    <h4>${proyecto.titulo}</h4>
                    <audio id="audio-${proyecto.id}" src="${proyecto.archivo}"></audio>
                    <div class="controles-audio">
                        <button class="boton-reproducir" onclick="toggleReproduccion(${proyecto.id})">▶</button>
                        <div class="barra-progreso" onclick="saltarAudio(event, ${proyecto.id})">
                            <div class="progreso" id="progreso-${proyecto.id}"></div>
                        </div>
                        <span class="tiempo-audio" id="tiempo-${proyecto.id}">0:00 / 0:00</span>
                    </div>
                </div>
            `;
        }

        const proyectoElement = document.createElement('div');
        proyectoElement.className = 'proyecto-container';
        proyectoElement.id = `proyecto-${proyecto.id}`;
        proyectoElement.innerHTML = `
            <div class="proyecto-media">
                ${mediaContent}
            </div>
            <div class="proyecto-explicacion">
                <h3>${proyecto.titulo}</h3>
                <p>${proyecto.descripcion}</p>
                <div class="acciones-proyecto">
                    <button class="boton boton-editar" onclick="editarProyecto(${proyecto.id})">Editar</button>
                    <button class="boton boton-eliminar" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
                </div>
            </div>
        `;

        contenedor.appendChild(proyectoElement);

        if (proyecto.tipo === 'audio') {
            inicializarReproductor(proyecto.id);
        }
    });
}

// Función para agregar un nuevo proyecto
function agregarProyecto() {
    const titulo = document.getElementById('nuevo-titulo').value.trim();
    const descripcion = document.getElementById('nueva-descripcion').value.trim();
    const tipo = document.querySelector('input[name="tipo-archivo"]:checked').value;
    const archivoInput = document.getElementById('nuevo-archivo');

    if (!titulo || !descripcion || !archivoInput.files || !archivoInput.files[0]) {
        alert('Por favor complete todos los campos y seleccione un archivo');
        return;
    }

    const nuevoId = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id)) + 1 : 1;
    const archivo = URL.createObjectURL(archivoInput.files[0]);

    const nuevoProyecto = {
        id: nuevoId,
        titulo,
        descripcion,
        tipo,
        archivo
    };

    proyectos.unshift(nuevoProyecto);
    guardarProyectos();

    // Limpiar formulario
    document.getElementById('nuevo-titulo').value = '';
    document.getElementById('nueva-descripcion').value = '';
    archivoInput.value = '';

    renderizarProyectos();
}

// Función para editar un proyecto
function editarProyecto(id) {
    const proyecto = proyectos.find(p => p.id === id);
    const contenedor = document.getElementById(`proyecto-${id}`);

    let mediaContent = '';
    if (proyecto.tipo === 'imagen') {
        mediaContent = `
            <div class="contenedor-imagen">
                <img class="imagen-editable" src="${proyecto.archivo}" alt="${proyecto.titulo}">
                <input type="file" id="editar-archivo-${id}" accept="image/*" style="margin-top: 10px;">
            </div>
        `;
    } else {
        mediaContent = `
            <audio controls src="${proyecto.archivo}"></audio>
            <input type="file" id="editar-archivo-${id}" accept="audio/*" style="margin-top: 10px;">
        `;
    }

    contenedor.innerHTML = `
        <div class="proyecto-media">
            ${mediaContent}
        </div>
        <div class="proyecto-explicacion">
            <input type="text" id="editar-titulo-${id}" value="${proyecto.titulo}">
            <textarea id="editar-descripcion-${id}">${proyecto.descripcion}</textarea>
            <div class="acciones-proyecto">
                <button class="boton boton-guardar" onclick="guardarEdicion(${id})">Guardar</button>
                <button class="boton boton-cancelar" onclick="renderizarProyectos()">Cancelar</button>
            </div>
        </div>
    `;
}

// Función para guardar los cambios de edición
function guardarEdicion(id) {
    const proyectoIndex = proyectos.findIndex(p => p.id === id);
    const titulo = document.getElementById(`editar-titulo-${id}`).value.trim();
    const descripcion = document.getElementById(`editar-descripcion-${id}`).value.trim();
    const archivoInput = document.getElementById(`editar-archivo-${id}`);

    if (!titulo || !descripcion) {
        alert('Por favor complete todos los campos');
        return;
    }

    proyectos[proyectoIndex].titulo = titulo;
    proyectos[proyectoIndex].descripcion = descripcion;

    // Actualizar archivo si se seleccionó uno nuevo
    if (archivoInput.files && archivoInput.files[0]) {
        // Liberar la URL del objeto anterior para evitar fugas de memoria
        if (proyectos[proyectoIndex].archivo.startsWith('blob:')) {
            URL.revokeObjectURL(proyectos[proyectoIndex].archivo);
        }
        proyectos[proyectoIndex].archivo = URL.createObjectURL(archivoInput.files[0]);
    }

    guardarProyectos();
    renderizarProyectos();
}

// Función para eliminar un proyecto
function eliminarProyecto(id) {
    if (confirm('¿Está seguro que desea eliminar este proyecto?')) {
        // Liberar la URL del objeto si es necesario
        const proyecto = proyectos.find(p => p.id === id);
        if (proyecto.archivo.startsWith('blob:')) {
            URL.revokeObjectURL(proyecto.archivo);
        }
        
        proyectos = proyectos.filter(p => p.id !== id);
        guardarProyectos();
        renderizarProyectos();
    }
}

// Funciones para el reproductor de audio
function inicializarReproductor(id) {
    const audio = document.getElementById(`audio-${id}`);
    const progreso = document.getElementById(`progreso-${id}`);
    const tiempo = document.getElementById(`tiempo-${id}`);

    audio.addEventListener('timeupdate', () => {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        progreso.style.width = `${porcentaje}%`;
        
        const minutosActual = Math.floor(audio.currentTime / 60);
        const segundosActual = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const minutosTotal = Math.floor(audio.duration / 60);
        const segundosTotal = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        
        tiempo.textContent = `${minutosActual}:${segundosActual} / ${minutosTotal}:${segundosTotal}`;
    });

    audio.addEventListener('ended', () => {
        progreso.style.width = '0%';
        tiempo.textContent = `0:00 / ${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60).toString().padStart(2, '0')}`;
    });
}

function toggleReproduccion(id) {
    const audio = document.getElementById(`audio-${id}`);
    const boton = document.querySelector(`#proyecto-${id} .boton-reproducir`);
    
    if (audio.paused) {
        audio.play();
        boton.textContent = '❚❚';
    } else {
        audio.pause();
        boton.textContent = '▶';
    }
}

function saltarAudio(event, id) {
    const audio = document.getElementById(`audio-${id}`);
    const barra = event.currentTarget;
    const posicion = (event.clientX - barra.getBoundingClientRect().left) / barra.offsetWidth;
    
    audio.currentTime = posicion * audio.duration;
}

// Inicializar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProyectos();
    
    // Configurar el formulario para que se pueda enviar con Enter
    document.getElementById('nueva-descripcion').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            agregarProyecto();
        }
    });
});
