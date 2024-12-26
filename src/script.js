document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el mapa
    const map = L.map('map').setView([9.7489, -83.7534], 7); // Coordenadas de Costa Rica

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Tabs para los filtros
    const tabs = document.querySelectorAll('.tab');
    const tabsContent = document.querySelectorAll('.filters-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabsContent.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Restaurar filtros
    document.querySelector('.reset-filters').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.filters-tab input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
    });
});
