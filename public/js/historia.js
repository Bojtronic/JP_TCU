// Array para almacenar los proyectos
let proyectos = [
    {
        id: 1,
        titulo: "Proyecto Cultural 1",
        descripcion: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        imagen: "../images/proyecto_cultural.gif"
    },
    {
        id: 2,
        titulo: "Proyecto Cultural 2",
        descripcion: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        imagen: "../images/proyecto_cultural.gif"
    },
    // ... más proyectos ...
];

// Función para renderizar todos los proyectos
function renderizarProyectos() {
    const contenedor = document.getElementById('contenedor-proyectos');
    contenedor.innerHTML = '';

    proyectos.forEach(proyecto => {
        contenedor.innerHTML += `
                    <div class="proyecto-container" id="proyecto-${proyecto.id}">
                        <div class="proyecto-imagen">
                            <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                        </div>
                        <div class="proyecto-explicacion">
                            <h3>${proyecto.titulo}</h3>
                            <p>${proyecto.descripcion}</p>
                            <div class="acciones-proyecto">
                                <button class="boton boton-editar" onclick="editarProyecto(${proyecto.id})">Editar</button>
                                <button class="boton boton-eliminar" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
    });
}

// Función para agregar un nuevo proyecto
function agregarProyecto() {
    const titulo = document.getElementById('nuevo-titulo').value;
    const descripcion = document.getElementById('nueva-descripcion').value;
    const imagenInput = document.getElementById('nueva-imagen');

    // Obtener la imagen (se necesita manejar la subida)
    let imagen = "../images/proyecto_cultural.gif"; // Valor por defecto
    if (imagenInput.files && imagenInput.files[0]) {
        imagen = URL.createObjectURL(imagenInput.files[0]);
    }

    if (titulo && descripcion) {
        const nuevoId = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id)) + 1 : 1;

        // Agregar al inicio del array
        proyectos.unshift({
            id: nuevoId,
            titulo,
            descripcion,
            imagen
        });

        // Limpiar formulario
        document.getElementById('nuevo-titulo').value = '';
        document.getElementById('nueva-descripcion').value = '';
        imagenInput.value = '';

        // Volver a renderizar
        renderizarProyectos();
    } else {
        alert('Por favor complete todos los campos');
    }
}

// Función para editar un proyecto
function editarProyecto(id) {
    const proyecto = proyectos.find(p => p.id === id);
    const contenedor = document.getElementById(`proyecto-${id}`);

    contenedor.innerHTML = `
                <div class="proyecto-imagen">
                    <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                    <input type="file" id="editar-imagen-${id}" accept="image/*">
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
    const titulo = document.getElementById(`editar-titulo-${id}`).value;
    const descripcion = document.getElementById(`editar-descripcion-${id}`).value;
    const imagenInput = document.getElementById(`editar-imagen-${id}`);

    if (titulo && descripcion) {
        proyectos[proyectoIndex].titulo = titulo;
        proyectos[proyectoIndex].descripcion = descripcion;

        // Actualizar imagen si se seleccionó una nueva
        if (imagenInput.files && imagenInput.files[0]) {
            proyectos[proyectoIndex].imagen = URL.createObjectURL(imagenInput.files[0]);
        }

        renderizarProyectos();
    } else {
        alert('Por favor complete todos los campos');
    }
}

// Función para eliminar un proyecto
function eliminarProyecto(id) {
    if (confirm('¿Está seguro que desea eliminar este proyecto?')) {
        proyectos = proyectos.filter(p => p.id !== id);
        renderizarProyectos();
    }
}

// Inicializar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', renderizarProyectos);