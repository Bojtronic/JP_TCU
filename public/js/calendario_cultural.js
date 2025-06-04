document.addEventListener('DOMContentLoaded', function() {
    // Datos de eventos antes de conectar a la base de datos
    const eventos = [
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
    const spanCerrar = document.getElementsByClassName('cerrar-modal')[0];
    const btnAgregarEvento = document.getElementById('btn-agregar-evento');
    const modalGestionEvento = document.getElementById('modal-gestion-evento');
    const formEvento = document.getElementById('form-evento');
    const btnEliminarEvento = document.getElementById('btn-eliminar-evento');
    const btnCancelarEvento = document.getElementById('btn-cancelar-evento');
    const spanCerrarGestion = modalGestionEvento.querySelector('.cerrar-modal');

    // Variables de estado
    let fechaActual = new Date();
    let mesActual = fechaActual.getMonth();
    let añoActual = fechaActual.getFullYear();
    let eventoEditando = null;

    // Nombres de meses
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

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
                    
                    // Crear fecha completa para comparación
                    const fechaCelda = new Date(año, mes, fecha);
                    
                    // Marcar día actual
                    const hoy = new Date();
                    if (fechaCelda.toDateString() === hoy.toDateString()) {
                        td.classList.add('dia-actual');
                    }
                    
                    // Verificar si hay eventos en este día
                    const eventosDia = eventos.filter(evento => 
                        evento.fecha.toDateString() === fechaCelda.toDateString()
                    );
                    
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
        
        const evento = eventosMostrar[0];
        
        document.getElementById('modal-titulo').textContent = evento.titulo;
        document.getElementById('modal-fecha').textContent = 
            `Fecha: ${evento.fecha.getDate()}/${evento.fecha.getMonth() + 1}/${evento.fecha.getFullYear()}`;
        document.getElementById('modal-descripcion').textContent = evento.descripcion;
        document.getElementById('modal-imagen').src = evento.imagen;
        document.getElementById('modal-lugar').textContent = `Lugar: ${evento.lugar}`;
        
        // Limpiar acciones anteriores si existen
        const accionesAnteriores = document.querySelector('.modal-contenido .acciones-evento');
        if (accionesAnteriores) {
            accionesAnteriores.remove();
        }
        
        // Agregar botón de edición
        const acciones = document.createElement('div');
        acciones.className = 'acciones-evento';
        acciones.style.marginTop = '20px';
        acciones.style.textAlign = 'right';
        
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar Evento';
        btnEditar.className = 'boton-evento';
        btnEditar.addEventListener('click', function() {
            modal.style.display = 'none';
            abrirModalGestion(evento);
        });
        
        acciones.appendChild(btnEditar);
        document.querySelector('.modal-contenido').appendChild(acciones);
        
        modal.style.display = 'block';
    }

    // Funciones para gestión de eventos
    function abrirModalGestion(evento = null) {
        eventoEditando = evento;
        
        if (evento) {
            // Modo edición
            document.getElementById('modal-gestion-titulo').textContent = 'Editar Evento';
            document.getElementById('evento-id').value = evento.id;
            document.getElementById('evento-titulo').value = evento.titulo;
            document.getElementById('evento-fecha').value = formatDateForInput(evento.fecha);
            document.getElementById('evento-descripcion').value = evento.descripcion;
            document.getElementById('evento-imagen').value = evento.imagen;
            document.getElementById('evento-lugar').value = evento.lugar;
            
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
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function guardarEvento(e) {
        e.preventDefault();
        
        const id = document.getElementById('evento-id').value;
        const titulo = document.getElementById('evento-titulo').value;
        const fechaStr = document.getElementById('evento-fecha').value;
        const descripcion = document.getElementById('evento-descripcion').value;
        const imagen = document.getElementById('evento-imagen').value;
        const lugar = document.getElementById('evento-lugar').value;
        
        
        const [year, month, day] = fechaStr.split('-');
        const fecha = new Date(year, month - 1, day);
        
        const nuevoEvento = {
            id: id || generarNuevoId(),
            titulo,
            fecha,
            descripcion,
            imagen: imagen || '../images/eventos/default.jpg',
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

    function generarNuevoId() {
        return eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
    }

    function eliminarEvento() {
        if (!eventoEditando) return;
        
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este evento?');
        if (confirmar) {
            const index = eventos.findIndex(e => e.id == eventoEditando.id);
            if (index !== -1) {
                eventos.splice(index, 1);
                actualizarCalendario();
                cerrarModalGestion();
            }
        }
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
    
    spanCerrar.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    btnAgregarEvento.addEventListener('click', function() {
        abrirModalGestion();
    });

    formEvento.addEventListener('submit', guardarEvento);

    btnEliminarEvento.addEventListener('click', eliminarEvento);

    btnCancelarEvento.addEventListener('click', cerrarModalGestion);

    spanCerrarGestion.addEventListener('click', cerrarModalGestion);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === modalGestionEvento) {
            cerrarModalGestion();
        }
    });

    // Inicializar
    inicializarCalendario();
});

