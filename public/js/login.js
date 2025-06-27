document.addEventListener('DOMContentLoaded', function() {
    localStorage.removeItem('auth');
    
    const loginContainer = document.querySelector('.login-container');
    const loginForm = document.querySelector('.login-form');
    
    // Crear elementos para el estado de sesión
    const loggedInSection = document.createElement('div');
    loggedInSection.className = 'logged-in-section';
    loggedInSection.style.display = 'none';
    
    const welcomeMessage = document.createElement('h2');
    welcomeMessage.className = 'welcome-message';
    
    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-button';
    logoutButton.textContent = 'Cerrar Sesión';
    
    loggedInSection.appendChild(welcomeMessage);
    loggedInSection.appendChild(logoutButton);
    loginContainer.appendChild(loggedInSection);

    // Manejar login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const correo = document.getElementById('correo').value.trim();
        const clave = document.getElementById('contrasena').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: correo,
                    password: clave
                })
            });

            const data = await response.json();

            if (response.ok) {
                handleSuccessfulLogin(data.user);
            } else {
                showLoginError(data.error || 'Credenciales incorrectas');
            }
        } catch (error) {
            showLoginError('Error de conexión con el servidor');
        }
    });

    // Manejar logout
    logoutButton.addEventListener('click', function() {
        handleLogout();
    });

    // Verificar sesión al cargar
    //checkAuthStatus();

    // Funciones auxiliares
    function handleSuccessfulLogin(user) {
        welcomeMessage.textContent = `Usuario logueado: ${user.nombre}`;
        loginForm.style.display = 'none';
        loggedInSection.style.display = 'block';
        
        localStorage.setItem('auth', JSON.stringify({
            isLoggedIn: true,
            username: user.email,
            name: user.nombre,
            id: user.id
        }));
        
        // Redirigir o actualizar UI según necesidad
        // window.location.href = '/dashboard.html';
    }

    function showLoginError(message) {
        alert(message);
        document.getElementById('contrasena').value = '';
        document.getElementById('correo').focus();
    }

    function handleLogout() {
        localStorage.removeItem('auth');
        loginForm.style.display = 'block';
        loggedInSection.style.display = 'none';
        document.getElementById('correo').value = '';
        document.getElementById('contrasena').value = '';
        
        // Opcional: Hacer logout también en el servidor
        //fetch('/api/logout', { method: 'POST' });
    }

    function checkAuthStatus() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth && auth.isLoggedIn) {
            // Verificar con el servidor si la sesión sigue activa
            fetch(`/api/usuarios/${auth.id}`)
                .then(response => response.json())
                .then(user => {
                    if (user) {
                        handleSuccessfulLogin(user);
                    }
                })
                .catch(() => {
                    localStorage.removeItem('auth');
                });
        }
    }
});