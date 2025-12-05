// ========== VERIFICACIÓN DE SESIÓN ==========

// Verificar si hay usuario logueado
function verificarSesion() {
    const usuarioJSON = localStorage.getItem('usuario');
    
    if (!usuarioJSON) {
        // No hay sesión, redirigir al login
        window.location.href = 'login.html';
        return null;
    }
    
    try {
        const usuario = JSON.parse(usuarioJSON);
        return usuario;
    } catch (error) {
        console.error('Error al leer datos del usuario:', error);
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
        return null;
    }
}

// Cerrar sesión
function cerrarSesion() {
    // Confirmar antes de cerrar sesión
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

// ========== INICIALIZACIÓN AL CARGAR LA PÁGINA ==========

document.addEventListener('DOMContentLoaded', () => {
    const usuario = verificarSesion();
    
    if (usuario) {
        console.log(' Usuario autenticado:', usuario.username, '- Rol:', usuario.rol);
        
        // Crear barra de usuario si no existe
        crearBarraUsuario(usuario);
        
        // Aplicar permisos según el rol
        aplicarPermisosPorRol(usuario.rol);
    }
});

// ========== CREAR BARRA DE USUARIO ==========

function crearBarraUsuario(usuario) {
    // Verificar si ya existe la barra
    if (document.getElementById('barra-usuario')) {
        return;
    }
    
    // Crear contenedor de la barra de usuario
    const barraUsuario = document.createElement('div');
    barraUsuario.id = 'barra-usuario';
    barraUsuario.style.cssText = `
        position: absolute;
        top: 15px;
        left: 300px;
        background: linear-gradient(135deg, rgba(220, 20, 60, 0.95), rgba(139, 0, 0, 0.95));
        color: white;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        backdrop-filter: blur(10px);
        font-family: Arial, sans-serif;
    `;
    
    // Información del usuario
    const infoUsuario = document.createElement('div');
    infoUsuario.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    `;
    
    const nombreUsuario = document.createElement('span');
    nombreUsuario.textContent = usuario.nombre_completo;
    nombreUsuario.style.cssText = `
        font-weight: bold;
        font-size: 13px;
    `;
    
    const rolUsuario = document.createElement('span');
    rolUsuario.textContent = usuario.rol === 'admin' ? ' Administrador' : ' Cliente';
    rolUsuario.style.cssText = `
        font-size: 11px;
        opacity: 0.9;
    `;
    
    infoUsuario.appendChild(nombreUsuario);
    infoUsuario.appendChild(rolUsuario);
    
    // Botón de cerrar sesión
    const btnCerrarSesion = document.createElement('button');
    btnCerrarSesion.textContent = 'Cerrar Sesión';
    btnCerrarSesion.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
        color: white;
        padding: 6px 14px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-size: 11px;
        transition: all 0.3s ease;
    `;
    
    btnCerrarSesion.onmouseover = () => {
        btnCerrarSesion.style.background = 'white';
        btnCerrarSesion.style.color = '#DC143C';
    };
    
    btnCerrarSesion.onmouseout = () => {
        btnCerrarSesion.style.background = 'rgba(255, 255, 255, 0.2)';
        btnCerrarSesion.style.color = 'white';
    };
    
    btnCerrarSesion.onclick = cerrarSesion;
    
    // Agregar elementos a la barra
    barraUsuario.appendChild(infoUsuario);
    barraUsuario.appendChild(btnCerrarSesion);
    
    // Agregar la barra al body
    document.body.appendChild(barraUsuario);
}

// ========== APLICAR PERMISOS POR ROL ==========

function aplicarPermisosPorRol(rol) {
    if (rol === 'admin') {
        console.log(' Permisos de ADMINISTRADOR activados');
        // El admin puede hacer todo, no hay restricciones
    } else if (rol === 'cliente') {
        console.log(' Permisos de CLIENTE activados (vista limitada)');
        // Ocultar opciones de administrador
        ocultarOpcionesAdmin();
    }
}

// ========== OCULTAR OPCIONES DE ADMIN PARA CLIENTES ==========

function ocultarOpcionesAdmin() {
    // Esta función se puede expandir para ocultar botones específicos
    // Por ejemplo, ocultar el botón de "Eliminar" en las reservas
    
    // Ejemplo: Buscar todos los botones de eliminar y ocultarlos
    setTimeout(() => {
        const botonesEliminar = document.querySelectorAll('[data-action="eliminar"]');
        botonesEliminar.forEach(boton => {
            boton.style.display = 'none';
        });
        
        // Agregar mensaje informativo
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            background: rgba(255, 193, 7, 0.2);
            border: 1px solid rgba(255, 193, 7, 0.5);
            color: #856404;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            text-align: center;
        `;
        mensaje.textContent = 'Como cliente, tienes permisos limitados. Contacta al administrador para más opciones.';
        
        // Buscar un contenedor apropiado y agregar el mensaje
        const main = document.querySelector('main') || document.body;
        if (main && !document.getElementById('mensaje-cliente')) {
            mensaje.id = 'mensaje-cliente';
            main.insertBefore(mensaje, main.firstChild);
        }
    }, 500);
}

// ========== OBTENER USUARIO ACTUAL ==========

function obtenerUsuarioActual() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
        return JSON.parse(usuarioJSON);
    }
    return null;
}

// ========== VERIFICAR SI ES ADMIN ==========

function esAdmin() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'admin';
}

// ========== VERIFICAR SI ES CLIENTE ==========

function esCliente() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'cliente';
}

// Exportar funciones para uso en otros archivos
window.authFunctions = {
    verificarSesion,
    cerrarSesion,
    obtenerUsuarioActual,
    esAdmin,
    esCliente
};