// ========== MANEJO DEL FORMULARIO DE RESERVAS ==========

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-contacto');
    
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obtener datos del usuario actual
            const usuarioJSON = localStorage.getItem('usuario');
            let usuario_id = null;
            
            if (usuarioJSON) {
                const usuario = JSON.parse(usuarioJSON);
                usuario_id = usuario.id;
            }
            
            // Obtener datos del formulario
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const direccion = document.getElementById('direccion').value;
            const correo = document.getElementById('correo').value;
            const mensaje = document.getElementById('mensaje').value;
            
            try {
                // Enviar datos al servidor
                const response = await fetch('http://localhost:3000/api/reservas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usuario_id: usuario_id,
                        nombre: nombre,
                        telefono: telefono,
                        direccion: direccion,
                        correo: correo,
                        mensaje: mensaje
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert(' Reserva creada exitosamente');
                    formulario.reset();
                } else {
                    alert(' Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error al crear reserva:', error);
                alert(' Error de conexión. Verifica que el servidor esté corriendo.');
            }
        });
    }
});