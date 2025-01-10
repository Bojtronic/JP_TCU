const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
            button.addEventListener("click", () => {
            // Eliminar la clase 'active' de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Activar el botón y el contenido correspondientes
            button.classList.add("active");
            const targetTab = document.getElementById(`tab-${button.dataset.tab}`);
            targetTab.classList.add("active");
        });
    });