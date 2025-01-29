document.addEventListener("DOMContentLoaded", function () {
    fetch("../pages/encabezado.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        });
});
