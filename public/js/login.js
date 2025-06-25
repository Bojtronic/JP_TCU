document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.querySelector('.login-container');
    const loginForm = document.querySelector('.login-form');
    
    // Crear elementos para el estado de sesión
    const loggedInSection = document.createElement('div');
    loggedInSection.className = 'logged-in-section';
    loggedInSection.style.display = 'none';
    loggedInSection.style.textAlign = 'center';
    
    const welcomeMessage = document.createElement('h2');
    welcomeMessage.className = 'welcome-message';
    
    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-button';
    logoutButton.textContent = 'Cerrar Sesión';
    logoutButton.style.marginTop = '20px';
    
    loggedInSection.appendChild(welcomeMessage);
    loggedInSection.appendChild(logoutButton);
    loginContainer.appendChild(loggedInSection);

    // Datos de usuarios hardcodeados
    const USUARIOS = [
        { usuario: 'admin', contrasena: 'admin123', nombre: 'Administrador' },
        { usuario: 'invitado', contrasena: 'invitado123', nombre: 'Usuario Invitado' }
    ];

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        
        const usuarioValido = USUARIOS.find(u => 
            u.usuario === usuario && u.contrasena === contrasena
        );

        if (usuarioValido) {
            // Mostrar sección de usuario logueado
            welcomeMessage.textContent = `Usuario logueado: ${usuarioValido.nombre}`;
            loginForm.style.display = 'none';
            loggedInSection.style.display = 'block';
            
            // Guardar estado de sesión
            localStorage.setItem('auth', JSON.stringify({
                isLoggedIn: true,
                username: usuarioValido.usuario,
                name: usuarioValido.nombre
            }));
        } else {
            // Mostrar mensaje de error
            alert('Usuario o contraseña incorrectos');
            document.getElementById('contrasena').value = '';
        }
    });

    // Manejar cierre de sesión
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('auth');
        loginForm.style.display = 'block';
        loggedInSection.style.display = 'none';
        document.getElementById('usuario').value = '';
        document.getElementById('contrasena').value = '';
    });

    // Verificar sesión existente al cargar la página
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.isLoggedIn) {
        const usuarioValido = USUARIOS.find(u => u.usuario === auth.username);
        if (usuarioValido) {
            welcomeMessage.textContent = `Usuario logueado: ${usuarioValido.nombre}`;
            loginForm.style.display = 'none';
            loggedInSection.style.display = 'block';
        }
    }
});
