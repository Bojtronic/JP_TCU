// Cargar el header dinámicamente
document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("header-container");
  
    fetch('./header.html') 
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el header.");
        return response.text();
      })
      .then((html) => {
        headerContainer.innerHTML = html;
  
        // Actualiza los enlaces para que se mantenga la ruta base
        const links = headerContainer.querySelectorAll("a");
        links.forEach((link) => {
          const originalHref = link.getAttribute("href");
          if (!originalHref.startsWith("http")) {
            link.setAttribute("href", `./${originalHref}`);
          }
        });
      })
      .catch((error) => console.error("Error al cargar el header:", error));
  });
  