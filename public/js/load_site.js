document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".menu a");

    menuLinks.forEach(link => {
        link.addEventListener("click", function (event) {
        event.preventDefault(); // Evita la navegación predeterminada

        const targetPage = this.getAttribute("href"); // Obtiene la URL del enlace
        window.location.href = `${window.location.origin}/${targetPage}`;
        });
    });
});