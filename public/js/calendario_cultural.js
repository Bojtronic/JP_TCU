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
        },
        // Se pueden agregar más eventos aquí
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

    // Variables de estado
    let fechaActual = new Date();
    let mesActual = fechaActual.getMonth();
    let añoActual = fechaActual.getFullYear();

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
    function mostrarEventos(eventos) {
        if (eventos.length === 0) return;
        
        // De momento, se muestra solo el primer evento si hay varios
        const evento = eventos[0]; //indice 0 = primer evento
        
        document.getElementById('modal-titulo').textContent = evento.titulo;
        document.getElementById('modal-fecha').textContent = 
            `Fecha: ${evento.fecha.getDate()}/${evento.fecha.getMonth() + 1}/${evento.fecha.getFullYear()}`;
        document.getElementById('modal-descripcion').textContent = evento.descripcion;
        document.getElementById('modal-imagen').src = evento.imagen;
        document.getElementById('modal-lugar').textContent = `Lugar: ${evento.lugar}`;
        
        modal.style.display = 'block';
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
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inicializar
    inicializarCalendario();
});
