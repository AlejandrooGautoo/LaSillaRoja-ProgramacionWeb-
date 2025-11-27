"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-contacto');
    const inputNombre = document.getElementById('nombre');
    const inputTelefono = document.getElementById('telefono');
    const inputDireccion = document.getElementById('direccion');
    const inputCorreo = document.getElementById('correo');
    const inputMensaje = document.getElementById('mensaje');
    let contenedorErrores = document.getElementById('errores-validacion');
    if (!contenedorErrores) {
        contenedorErrores = document.createElement('div');
        contenedorErrores.id = 'errores-validacion';
        contenedorErrores.style.cssText = `
            background-color: #ff4444;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            display: none;
        `;
        formulario.insertBefore(contenedorErrores, formulario.firstChild);
    }
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    function validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        return regex.test(nombre.trim());
    }
    function validarFormulario(datos) {
        const errores = {};
        if (!datos.nombre.trim()) {
            errores.nombre = 'El nombre es obligatorio';
        }
        else if (!validarNombre(datos.nombre)) {
            errores.nombre = 'El nombre debe tener al menos 3 caracteres y solo letras';
        }
        if (!datos.correo.trim()) {
            errores.correo = 'El correo electrónico es obligatorio';
        }
        else if (!validarEmail(datos.correo)) {
            errores.correo = 'El formato del correo electrónico no es válido';
        }
        return errores;
    }
    function mostrarErrores(errores) {
        if (!contenedorErrores)
            return;
        const cantidadErrores = Object.keys(errores).length;
        if (cantidadErrores > 0) {
            let html = '<strong> Errores de validación:</strong><ul style="margin: 10px 0 0 20px;">';
            if (errores.nombre) {
                html += `<li>${errores.nombre}</li>`;
            }
            if (errores.correo) {
                html += `<li>${errores.correo}</li>`;
            }
            html += '</ul>';
            contenedorErrores.innerHTML = html;
            contenedorErrores.style.display = 'block';
        }
        else {
            contenedorErrores.style.display = 'none';
        }
    }
    async function enviarDatos(datos) {
        try {
            const respuesta = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            const resultado = await respuesta.json();
            if (respuesta.ok) {
                alert('¡Reserva enviada exitosamente! Nos pondremos en contacto pronto.');
                formulario.reset();
                if (contenedorErrores) {
                    contenedorErrores.style.display = 'none';
                }
            }
            else {
                alert('Error al enviar la reserva: ' + resultado.message);
            }
        }
        catch (error) {
            console.error('Error al enviar datos:', error);
            alert('Error de conexión. Por favor, intenta de nuevo más tarde.');
        }
    }
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            nombre: inputNombre.value,
            telefono: inputTelefono.value,
            direccion: inputDireccion.value,
            correo: inputCorreo.value,
            mensaje: inputMensaje.value
        };
        const errores = validarFormulario(datos);
        if (Object.keys(errores).length > 0) {
            mostrarErrores(errores);
            return;
        }
        await enviarDatos(datos);
    });
    inputNombre.addEventListener('blur', () => {
        if (inputNombre.value.trim() && !validarNombre(inputNombre.value)) {
            inputNombre.style.borderColor = '#ff4444';
        }
        else {
            inputNombre.style.borderColor = '';
        }
    });
    inputCorreo.addEventListener('blur', () => {
        if (inputCorreo.value.trim() && !validarEmail(inputCorreo.value)) {
            inputCorreo.style.borderColor = '#ff4444';
        }
        else {
            inputCorreo.style.borderColor = '';
        }
    });
    console.log('Formulario TypeScript cargado correctamente');
});
