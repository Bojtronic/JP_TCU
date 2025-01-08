document.addEventListener("DOMContentLoaded", () => {
    const eventos = [
        { fecha: "lunes 1 de enero", hora: "8:00 a.m.", titulo: "PREMIO CRÍTICA JOVEN AICA 2024", descripcion: "El capítulo costarricense de la Asociación Internacional de Críticos de Arte convoca oficialmente...", imagen: "../../images/eventos_logo.jpg", categoria: "Convocatoria" },
        { fecha: "viernes 24 de enero", hora: "10:00 a.m.", titulo: "Foro de Empleabilidad en Conmemoración al Día Internacional de la Educación", descripcion: "", imagen: "../../images/eventos_logo.jpg", categoria: "" },
        { fecha: "lunes 5 de febrero", hora: "2:00 p.m.", titulo: "Taller de Innovación Empresarial", descripcion: "Aprende las últimas tendencias en innovación para tu empresa.", imagen: "../../images/eventos_logo.jpg", categoria: "Taller" },
        { fecha: "miércoles 14 de febrero", hora: "4:00 p.m.", titulo: "Conferencia: El Futuro de la Inteligencia Artificial", descripcion: "Un análisis de las implicaciones éticas y tecnológicas de la IA.", imagen: "../../images/eventos_logo.jpg", categoria: "Conferencia" },
        { fecha: "sábado 3 de marzo", hora: "9:00 a.m.", titulo: "Festival Cultural 2024", descripcion: "Un día lleno de arte, música y gastronomía para toda la familia.", imagen: "../../images/eventos_logo.jpg", categoria: "Festival" },
        { fecha: "martes 12 de marzo", hora: "6:00 p.m.", titulo: "Mesa Redonda: Economía Sostenible", descripcion: "Expertos discuten sobre el futuro de la sostenibilidad económica.", imagen: "../../images/eventos_logo.jpg", categoria: "Mesa Redonda" },
        { fecha: "viernes 22 de marzo", hora: "7:30 p.m.", titulo: "Concierto de Primavera", descripcion: "Disfruta de un repertorio especial con artistas invitados.", imagen: "../../images/eventos_logo.jpg", categoria: "Concierto" },
        { fecha: "lunes 8 de abril", hora: "11:00 a.m.", titulo: "Feria de Tecnología 2024", descripcion: "Descubre las últimas innovaciones en el mundo tecnológico.", imagen: "../../images/eventos_logo.jpg", categoria: "Feria" }
    ];

    const eventosPorPagina = 4;
    let paginaActual = 1;

    const eventosContainer = document.getElementById("eventos-container");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const eventCount = document.getElementById("event-count");

    function renderEventos() {
        eventosContainer.innerHTML = "";
        const inicio = (paginaActual - 1) * eventosPorPagina;
        const fin = Math.min(inicio + eventosPorPagina, eventos.length);

        for (let i = inicio; i < fin; i++) {
            const evento = eventos[i];
            const eventoHTML = `
                <article class="evento">
                    <img src="${evento.imagen}" alt="${evento.titulo}">
                    <div class="evento-info">
                        <p class="fecha">${evento.fecha} - ${evento.hora}</p>
                        <h2>${evento.titulo}</h2>
                        <button class="btn">Ver evento</button>
                    </div>
                </article>
            `;
            eventosContainer.innerHTML += eventoHTML;
        }

        eventCount.textContent = `Mostrando ${inicio + 1} - ${fin} de ${eventos.length}`;
        prevBtn.disabled = paginaActual === 1;
        nextBtn.disabled = paginaActual === Math.ceil(eventos.length / eventosPorPagina);
    }

    prevBtn.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderEventos();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (paginaActual < Math.ceil(eventos.length / eventosPorPagina)) {
            paginaActual++;
            renderEventos();
        }
    });

    renderEventos();
});
