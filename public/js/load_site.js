document.addEventListener("DOMContentLoaded", function () {
    fetch("../pages/gestion_cultural.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("home").innerHTML = data;
        });
});
