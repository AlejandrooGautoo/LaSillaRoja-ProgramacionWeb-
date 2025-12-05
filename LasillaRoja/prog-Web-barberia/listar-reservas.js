// ========== LISTAR RESERVAS SEGÚN ROL ==========

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener usuario actual
    const usuarioJSON = localStorage.getItem('usuario');
    
    if (!usuarioJSON) {
        return; // No hay usuario logueado
    }
    
    const usuario = JSON.parse(usuarioJSON);
    const contenedor = document.getElementById('contenedor-reservas');
    const mensajeCargando = document.getElementById('mensaje-cargando');
    const mensajeSinReservas = document.getElementById('mensaje-sin-reservas');
    
    try {
        // Construir URL según el rol
        let url = 'http://localhost:3000/api/reservas?';
        
        if (usuario.rol === 'admin') {
            url += 'rol=admin';
        } else {
            url += `usuario_id=${usuario.id}&rol=cliente`;
        }
        
        // Obtener reservas
        const response = await fetch(url);
        const data = await response.json();
        
        mensajeCargando.style.display = 'none';
        
        if (data.reservas && data.reservas.length > 0) {
            contenedor.style.display = 'block';
            mostrarReservas(data.reservas, usuario.rol, usuario.id);
        } else {
            mensajeSinReservas.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        mensajeCargando.textContent = ' Error al cargar reservas';
    }
});

// ========== MOSTRAR RESERVAS ==========

function mostrarReservas(reservas, rol, usuario_id) {
    const contenedor = document.getElementById('contenedor-reservas');
    
    let html = `
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="color: white; font-size: 1.1em; margin-bottom: 10px;">
                ${rol === 'admin' 
                    ? '👑 <strong>Vista de Administrador</strong> - Viendo todas las reservas del sistema' 
                    : '👤 <strong>Mis Reservas</strong> - Solo puedes ver tus propias reservas'}
            </p>
            <p style="color: #888; font-size: 0.9em;">
                Total de reservas: <strong style="color: #DC143C;">${reservas.length}</strong>
            </p>
        </div>
    `;
    
    html += '<div style="display: grid; gap: 20px;">';
    
    reservas.forEach(reserva => {
        const esPropia = reserva.usuario_id === usuario_id;
        const puedeEliminar = rol === 'admin';
        
        html += `
            <div style="
                background: rgba(255,255,255,0.08);
                border: 2px solid ${esPropia ? '#DC143C' : '#333'};
                border-radius: 10px;
                padding: 20px;
                color: white;
                position: relative;
            ">
                ${esPropia ? '<span style="position: absolute; top: 10px; right: 10px; background: #DC143C; color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.8em;">Tu reserva</span>' : ''}
                
                <h3 style="color: #DC143C; margin-bottom: 15px;">
                    ${reserva.nombre}
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
                    <p><strong>📞 Teléfono:</strong> ${reserva.telefono}</p>
                    <p><strong>📧 Correo:</strong> ${reserva.correo}</p>
                    <p><strong>📍 Dirección:</strong> ${reserva.direccion || 'N/A'}</p>
                    <p><strong>📅 Fecha:</strong> ${new Date(reserva.fecha_creacion).toLocaleDateString('es-AR')}</p>
                </div>
                
                ${reserva.mensaje ? `<p style="margin-bottom: 15px;"><strong> Mensaje:</strong> ${reserva.mensaje}</p>` : ''}
                
                ${rol === 'admin' ? `<p style="font-size: 0.85em; color: #888;"><strong>ID Usuario:</strong> ${reserva.usuario_id || 'Sin asignar'}</p>` : ''}
                
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    ${puedeEliminar ? `
                        <button onclick="eliminarReserva(${reserva.id}, '${rol}')" style="
                            background: #DC143C;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                             Eliminar
                        </button>
                    ` : `
                        <span style="color: #888; font-size: 0.9em;">
                            ℹ Solo el administrador puede eliminar reservas
                        </span>
                    `}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

// ========== ELIMINAR RESERVA ==========

async function eliminarReserva(id, rol) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/reservas/${id}?rol=${rol}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(' Reserva eliminada exitosamente');
            location.reload(); // Recargar para actualizar la lista
        } else {
            alert(' Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert(' Error de conexión');
    }
}