document.addEventListener('DOMContentLoaded', function() {
    // Datos de eventos (podría reemplazarse con una conexión a base de datos)
    let eventos = JSON.parse(localStorage.getItem('eventosCulturales')) || [
        {
            id: 1,
            titulo: "Festival de Música Tradicional",
            fecha: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
            descripcion: "Disfruta de lo mejor de nuestra música tradicional con artistas locales e invitados especiales.",
            imagen: "../images/eventos/musica-tradicional.jpg",
            lugar: "Plaza Principal"
        },
        {
            id: 2,
            titulo: "Exposición de Arte Contemporáneo",
            fecha: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
            descripcion: "Exposición de artistas locales emergentes en el centro cultural municipal.",
            imagen: "../images/eventos/arte-contemporaneo.jpg",
            lugar: "Centro Cultural"
        }
    ];

    // Elementos del DOM
    const mesActualElement = document.getElementById('mes-actual');
    const mesSiguienteElement = document.getElementById('mes-siguiente');
    const tituloMesActual = document.getElementById('titulo-mes-actual');
    const tituloMesSiguiente = document.getElementById('titulo-mes-siguiente');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const modal = document.getElementById('modal-evento');
    //const spanCerrar = document.getElementsByClassName('cerrar-modal')[0];
    const spanCerrarModal = document.querySelector('#modal-evento .cerrar-modal');

    const btnAgregarEvento = document.getElementById('btn-agregar-evento');

    const modalGestionEvento = document.getElementById('modal-gestion-evento');
    const formEvento = document.getElementById('form-evento');
    const btnEliminarEvento = document.getElementById('btn-eliminar-evento');
    const btnCancelarEvento = document.getElementById('btn-cancelar-evento');
    //const spanCerrarGestion = modalGestionEvento.querySelector('.cerrar-modal');
    const spanCerrarGestion = document.querySelector('#modal-gestion-evento .cerrar-modal');

    const btnEliminarEventos = document.getElementById('btn-eliminar-eventos');

    const modalEliminarEventos = document.getElementById('modal-eliminar-eventos');
    const listaEventos = document.getElementById('lista-eventos');
    const btnCerrarEliminar = document.getElementById('btn-cerrar-eliminar');

    const spanCerrarEliminarModal = document.querySelector('#modal-eliminar-eventos .cerrar-modal');
    const modalEliminarEvento = document.getElementById('modal-eliminar-eventos');

    // Variables de estado
    let fechaActual = new Date();
    let mesActual = fechaActual.getMonth();
    let añoActual = fechaActual.getFullYear();
    let eventoEditando = null;
    let eventoSeleccionado = null;

    // Nombres de meses
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function verificarAutenticacion() {
        const authData = localStorage.getItem('auth');
        return authData && JSON.parse(authData).isLoggedIn;
    }

    const usuarioAutenticado = verificarAutenticacion();

    if (usuarioAutenticado) {
        btnAgregarEvento.style.display = 'inline-block';
        btnEliminarEventos.style.display = 'inline-block';
    } else {
        btnAgregarEvento.style.display = 'none';
        btnEliminarEventos.style.display = 'none';
        
    }

    


    // Inicializar calendario
    function inicializarCalendario() {
        actualizarCalendario();
    }

    // Actualizar calendario
    function actualizarCalendario() {
        // Limpiar calendarios
        mesActualElement.innerHTML = '';
        mesSiguienteElement.innerHTML = '';
        
        // Actualizar títulos
        tituloMesActual.textContent = nombresMeses[mesActual] + " " + añoActual;
        
        let mesSiguiente = mesActual + 1;
        let añoSiguiente = añoActual;
        
        if (mesSiguiente > 11) {
            mesSiguiente = 0;
            añoSiguiente++;
        }
        
        tituloMesSiguiente.textContent = nombresMeses[mesSiguiente] + " " + añoSiguiente;
        
        // Generar calendarios
        generarCalendario(mesActual, añoActual, mesActualElement);
        generarCalendario(mesSiguiente, añoSiguiente, mesSiguienteElement);
        
        // Guardar en localStorage
        guardarEventosEnLocalStorage();
    }

    // Generar calendario para un mes específico
    function generarCalendario(mes, año, contenedor) {
        // Crear tabla
        const tabla = document.createElement('table');
        tabla.className = 'calendario-mes';
        
        // Crear encabezado con días de la semana
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        diasSemana.forEach(dia => {
            const th = document.createElement('th');
            th.textContent = dia;
            trHead.appendChild(th);
        });
        
        thead.appendChild(trHead);
        tabla.appendChild(thead);
        
        // Crear cuerpo del calendario
        const tbody = document.createElement('tbody');
        
        // Obtener primer día del mes y último día del mes
        const primerDia = new Date(año, mes, 1).getDay();
        const ultimoDia = new Date(año, mes + 1, 0).getDate();
        
        let fecha = 1;
        
        // Crear filas
        for (let i = 0; i < 6; i++) {
            // Si ya pasamos el último día, salir del bucle
            if (fecha > ultimoDia) break;
            
            const tr = document.createElement('tr');
            
            // Crear celdas
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                
                if (i === 0 && j < primerDia) {
                    // Celda vacía antes del primer día del mes
                    td.textContent = '';
                } else if (fecha > ultimoDia) {
                    // Celda vacía después del último día del mes
                    td.textContent = '';
                } else {
                    // Celda con día del mes
                    td.textContent = fecha;
                    
                    // Crear fecha completa para comparación (sin horas/minutos/segundos)
                    const fechaCelda = new Date(año, mes, fecha);
                    fechaCelda.setHours(0, 0, 0, 0);
                    
                    // Marcar día actual
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    if (fechaCelda.getTime() === hoy.getTime()) {
                        td.classList.add('dia-actual');
                    }
                    
                    // Verificar si hay eventos en este día
                    const eventosDia = eventos.filter(evento => {
                        const fechaEvento = new Date(evento.fecha);
                        fechaEvento.setHours(0, 0, 0, 0);
                        return fechaEvento.getTime() === fechaCelda.getTime();
                    });
                    
                    if (eventosDia.length > 0) {
                        td.classList.add('dia-con-evento');
                        td.dataset.eventos = JSON.stringify(eventosDia);
                        
                        // Agregar evento de clic
                        td.addEventListener('click', function() {
                            mostrarEventos(eventosDia);
                        });
                    }
                    
                    fecha++;
                }
                
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        }
        
        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);
    }

    // Mostrar eventos en modal
    function mostrarEventos(eventosMostrar) {
        if (eventosMostrar.length === 0) return;
        
        eventoSeleccionado = eventosMostrar[0];
        
        document.getElementById('modal-titulo').textContent = eventoSeleccionado.titulo;
        document.getElementById('modal-fecha').textContent = 
            `Fecha: ${formatDateForDisplay(eventoSeleccionado.fecha)}`;
        document.getElementById('modal-descripcion').textContent = eventoSeleccionado.descripcion;
        document.getElementById('modal-imagen').src = eventoSeleccionado.imagen;
        document.getElementById('modal-lugar').textContent = `Lugar: ${eventoSeleccionado.lugar}`;
        
        // Limpiar acciones anteriores si existen
        const accionesAnteriores = document.querySelector('.modal-contenido .acciones-evento');
        if (accionesAnteriores) {
            accionesAnteriores.remove();
        }
        
        // Agregar botones de edición y eliminación
        const acciones = document.createElement('div');
        acciones.className = 'acciones-evento';
        acciones.style.marginTop = '20px';
        acciones.style.textAlign = 'right';
        
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar Evento';
        btnEditar.className = 'boton-evento';
        btnEditar.addEventListener('click', function() {
            modal.style.display = 'none';
            abrirModalGestion(eventoSeleccionado);
        });
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar Evento';
        btnEliminar.className = 'boton-evento eliminar';
        btnEliminar.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
                eliminarEvento(eventoSeleccionado.id);
                modal.style.display = 'none';
            }
        });
        
        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);
        document.querySelector('.modal-contenido').appendChild(acciones);
        
        modal.style.display = 'block';
    }

    // Funciones para gestión de eventos
    function abrirModalGestion(evento = null) {
        eventoEditando = evento;
        
        // Resetear el input de imagen
        document.getElementById('evento-imagen').value = '';
        document.getElementById('imagen-preview-container').style.display = 'none';
        
        if (evento) {
            // Modo edición
            document.getElementById('modal-gestion-titulo').textContent = 'Editar Evento';
            document.getElementById('evento-id').value = evento.id;
            document.getElementById('evento-titulo').value = evento.titulo;
            document.getElementById('evento-fecha').value = formatDateForInput(evento.fecha);
            document.getElementById('evento-descripcion').value = evento.descripcion;
            document.getElementById('evento-lugar').value = evento.lugar;
            
            // Mostrar vista previa pequeña de la imagen existente
            if (evento.imagen) {
                document.getElementById('preview').src = evento.imagen;
                document.getElementById('imagen-preview-container').style.display = 'block';
            }
            
            btnEliminarEvento.style.display = 'inline-block';
        } else {
            // Modo nuevo
            document.getElementById('modal-gestion-titulo').textContent = 'Agregar Evento';
            formEvento.reset();
            document.getElementById('evento-id').value = '';
            
            // Establecer fecha por defecto (hoy)
            const hoy = new Date();
            document.getElementById('evento-fecha').value = formatDateForInput(hoy);
            
            btnEliminarEvento.style.display = 'none';
        }
        
        modalGestionEvento.style.display = 'block';
    }

    function formatDateForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    function formatDateForDisplay(date) {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    }

    document.getElementById('evento-imagen').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('preview').src = event.target.result;
                document.getElementById('imagen-preview').style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    async function guardarEvento(e) {
        e.preventDefault();
        
        const id = document.getElementById('evento-id').value;
        const titulo = document.getElementById('evento-titulo').value;
        const fechaStr = document.getElementById('evento-fecha').value;
        const descripcion = document.getElementById('evento-descripcion').value;
        const lugar = document.getElementById('evento-lugar').value;
        const imagenInput = document.getElementById('evento-imagen');
        
        // Validación básica
        if (!titulo || !fechaStr || !descripcion || !lugar) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        // Crear fecha correctamente
        const [year, month, day] = fechaStr.split('-');
        const fecha = new Date(year, month - 1, day);
        
        // Manejo de la imagen
        let imagenBase64 = '';
        if (eventoEditando && !imagenInput.files[0]) {
            // Si estamos editando y no se subió nueva imagen, mantener la existente
            imagenBase64 = eventoEditando.imagen;
        } else if (imagenInput.files[0]) {
            // Convertir imagen a Base64
            const file = imagenInput.files[0];
            imagenBase64 = await convertToBase64(file);
        } else {
            // Imagen por defecto si no se proporciona ninguna
            imagenBase64 = 'data:image/png;base64,...'; // Tu imagen por defecto en base64
        }
        
        const nuevoEvento = {
            id: id || generarNuevoId(),
            titulo,
            fecha,
            descripcion,
            imagen: imagenBase64,
            lugar
        };
        
        if (eventoEditando) {
            // Actualizar evento existente
            const index = eventos.findIndex(e => e.id == eventoEditando.id);
            if (index !== -1) {
                eventos[index] = nuevoEvento;
            }
        } else {
            // Agregar nuevo evento
            eventos.push(nuevoEvento);
        }
        
        actualizarCalendario();
        cerrarModalGestion();
    }

    // Función para convertir archivo a Base64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    function eliminarEvento(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        eventos = eventos.filter(evento => evento.id !== id);
        guardarEventosEnLocalStorage();
        actualizarCalendario();
        
        // Si el modal de eventos está abierto, cerrarlo
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
}

    function generarNuevoId() {
        return eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
    }

    function guardarEventosEnLocalStorage() {
        localStorage.setItem('eventosCulturales', JSON.stringify(eventos));
    }

    function cerrarModalGestion() {
        modalGestionEvento.style.display = 'none';
        eventoEditando = null;
    }

    // Event Listeners
    btnAnterior.addEventListener('click', function() {
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            añoActual--;
        }
        actualizarCalendario();
    });
    
    btnSiguiente.addEventListener('click', function() {
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            añoActual++;
        }
        actualizarCalendario();
    });
    
    /*
    spanCerrar.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    */

    spanCerrarModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    btnAgregarEvento.addEventListener('click', function() {
        abrirModalGestion();
    });

    formEvento.addEventListener('submit', guardarEvento);

    btnEliminarEvento.addEventListener('click', function() {
        if (eventoEditando && confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            eliminarEvento(eventoEditando.id);
            cerrarModalGestion();
        }
    });

    btnEliminarEventos.addEventListener('click', function() {
        cargarListaEventos();
        modalEliminarEventos.style.display = 'block';
    });

    btnCancelarEvento.addEventListener('click', cerrarModalGestion);

    //spanCerrarGestion.addEventListener('click', cerrarModalGestion);

    spanCerrarGestion.addEventListener('click', function() {
        modalGestionEvento.style.display = 'none';
    });

    
    spanCerrarEliminarModal.addEventListener('click', function() {
        modalEliminarEvento.style.display = 'none';
    });


    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === modalGestionEvento) {
            cerrarModalGestion();
        }
    });



    // Cargar lista de eventos en el modal
    function cargarListaEventos() {
        listaEventos.innerHTML = ''; // Limpiar lista
        
        if (eventos.length === 0) {
            listaEventos.innerHTML = '<p>No hay eventos programados.</p>';
            return;
        }
        
        // Ordenar eventos por fecha
        const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        eventosOrdenados.forEach(evento => {
            const eventoItem = document.createElement('div');
            eventoItem.className = 'evento-item';
            
            eventoItem.innerHTML = `
                <div class="evento-info">
                    <div class="evento-titulo">${evento.titulo}</div>
                    <div class="evento-fecha">${formatDateForDisplay(evento.fecha)}</div>
                </div>
                <button class="btn-eliminar-item" data-id="${evento.id}">Eliminar</button>
            `;
            
            listaEventos.appendChild(eventoItem);
        });
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                eliminarEvento(id);
                cargarListaEventos(); // Recargar la lista después de eliminar
            });
        });
    }

    // Cerrar modal de eliminar eventos
    btnCerrarEliminar.addEventListener('click', function() {
        modalEliminarEventos.style.display = 'none';
    });

    // También puedes cerrar haciendo clic fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target === modalEliminarEventos) {
            modalEliminarEventos.style.display = 'none';
        }
    });

    // Inicializar
    inicializarCalendario();
});

function cerrarSesion() {
    localStorage.removeItem('auth');
    // Actualizar visibilidad de botones
    document.getElementById('btn-agregar-evento').style.display = 'none';
    document.getElementById('btn-eliminar-eventos').style.display = 'none';
    // Redirigir o actualizar la página según sea necesario
    window.location.reload();
}