// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const btnLogin = document.getElementById('btnLogin');
const spinner = document.getElementById('spinner');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const forgotPasswordLink = document.getElementById('forgotPassword');
const signUpLink = document.getElementById('signUp');

// Verificar si ya hay sesión activa al cargar la página
window.addEventListener('load', () => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        // Ya hay sesión, redirigir a la página principal
        window.location.href = 'LaSillaRoja.html';
    }
});

// Manejar envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validación básica
    if (!username || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    // Mostrar loading
    btnLogin.disabled = true;
    btnLogin.classList.add('loading');
    errorMessage.classList.remove('show');

    try {
        // Hacer petición al servidor
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Guardar información del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify({
                id: data.usuario.id,
                username: data.usuario.username,
                nombre_completo: data.usuario.nombre_completo,
                rol: data.usuario.rol
            }));

            // Mostrar mensaje de éxito
            showSuccess('¡Inicio de sesión exitoso!');

            // Redirigir a la página principal después de 1 segundo
            setTimeout(() => {
                window.location.href = 'LaSillaRoja.html';
            }, 1000);
        } else {
            showError(data.message || 'Usuario o contraseña incorrectos');
            btnLogin.disabled = false;
            btnLogin.classList.remove('loading');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showError('Error de conexión. Verifica que el servidor esté corriendo.');
        btnLogin.disabled = false;
        btnLogin.classList.remove('loading');
    }
});

// Función para mostrar errores
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.background = 'rgba(255, 50, 50, 0.2)';
    errorMessage.style.color = '#ff6b6b';
    errorMessage.style.borderColor = 'rgba(255, 50, 50, 0.4)';
}

// Función para mostrar éxito
function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.background = 'rgba(50, 255, 50, 0.2)';
    errorMessage.style.color = '#4ade80';
    errorMessage.style.borderColor = 'rgba(50, 255, 50, 0.4)';
}

// Link de "Forgot Password"
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Contacta al administrador para recuperar tu contraseña.\n\n📧 Email: admin@lasillaroja.com');
});

// Link de "Sign up"
signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('La función de registro estará disponible próximamente.\n\n👤 Usa los usuarios de prueba:\n• admin / admin123\n• cliente1 / cliente123');
});

// Efecto de focus en los inputs
usernameInput.addEventListener('focus', () => {
    usernameInput.parentElement.style.transform = 'scale(1.02)';
});

usernameInput.addEventListener('blur', () => {
    usernameInput.parentElement.style.transform = 'scale(1)';
});

passwordInput.addEventListener('focus', () => {
    passwordInput.parentElement.style.transform = 'scale(1.02)';
});

passwordInput.addEventListener('blur', () => {
    passwordInput.parentElement.style.transform = 'scale(1)';
});

// Animación de transición para los input groups
const inputGroups = document.querySelectorAll('.input-group');
inputGroups.forEach(group => {
    group.style.transition = 'transform 0.3s ease';
});