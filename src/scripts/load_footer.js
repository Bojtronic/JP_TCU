document.addEventListener("DOMContentLoaded", function() {
    const footerContainer = document.getElementById("footer-container");
    fetch("./footer.html") // Cambia la ruta según la ubicación del archivo footer.html
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el footer");
        return response.text();
      })
      .then(html => {
        footerContainer.innerHTML = html;
      })
      .catch(error => console.error(error));
  });