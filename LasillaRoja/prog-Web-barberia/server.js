const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// ========== IMPORTAR FUNCIONES DE DATABASE (MODIFICADO) ==========
const {
    crearReserva,
    obtenerReservas,
    obtenerReservaPorId,
    actualizarReserva,
    eliminarReserva,
    validarLogin,
    crearUsuario
} = require('./database');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========== RUTAS DE AUTENTICACIÓN (NUEVAS) ==========

// Ruta de Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Validación de campos
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Usuario y contraseña son requeridos'
        });
    }

    // Validar credenciales
    const resultado = validarLogin(username, password);

    if (resultado.success) {
        return res.json({
            success: true,
            usuario: resultado.usuario
        });
    } else {
        return res.status(401).json({
            success: false,
            message: resultado.message
        });
    }
});

// Ruta de Registro (Opcional)
app.post('/api/register', (req, res) => {
    const { username, password, nombre_completo } = req.body;

    // Validación de campos
    if (!username || !password || !nombre_completo) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    // Crear usuario
    const resultado = crearUsuario({
        username,
        password,
        nombre_completo,
        rol: 'cliente' // Por defecto los nuevos usuarios son clientes
    });

    if (resultado.success) {
        return res.status(201).json(resultado);
    } else {
        return res.status(400).json(resultado);
    }
});

// ========== RUTAS DE PRODUCTOS ==========

const productos = [
    {
        id: 1,
        nombre: 'Pomada Matt Clay',
        descripcion: 'Pomada de acabado mate para un look natural y texturizado. Fijación fuerte y larga duración.',
        precio: 8500,
        imagen: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        nombre: 'Aceite para Barba',
        descripcion: 'Aceite nutritivo con aroma a madera de cedro. Suaviza, hidrata y da brillo a tu barba.',
        precio: 6000,
        imagen: 'https://lasmargaritas.vtexassets.com/arquivos/ids/2322173/BEARD-OIL-X100-LEVEL3.jpg?v=638550896089930000'
    },
    {
        id: 3,
        nombre: 'Cera para Bigote',
        descripcion: 'Cera de fijación extra fuerte para moldear y mantener tu bigote con estilo todo el día.',
        precio: 4500,
        imagen: 'https://acdn-us.mitiendanube.com/stores/001/705/739/products/1000370874-f00c8330968c24ce5517405838429597-480-0.jpg'
    },
    {
        id: 4,
        nombre: 'Shampoo de Barba',
        descripcion: 'Limpieza profunda especialmente formulada para barba. Elimina impurezas sin resecar.',
        precio: 5500,
        imagen: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
    },
    {
        id: 5,
        nombre: 'Gel Fijador Ultra Hold',
        descripcion: 'Gel de fijación extrema para peinados que duran todo el día. Acabado brillante.',
        precio: 4000,
        imagen: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop'
    },
    {
        id: 6,
        nombre: 'Navaja de Afeitar Clásica',
        descripcion: 'Navaja profesional de acero inoxidable con mango de madera. Afeitado preciso y suave.',
        precio: 15000,
        imagen: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop'
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'LaSillaRoja.html'));
});

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// ========== RUTAS DE RESERVAS (CRUD) ==========

app.post('/api/reservas', (req, res) => {
    try {
        const { nombre, telefono, direccion, correo, mensaje } = req.body;

        if (!nombre || !telefono || !correo) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, teléfono y correo son obligatorios'
            });
        }

        const resultado = crearReserva({ nombre, telefono, direccion, correo, mensaje });
        
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la reserva'
        });
    }
});

app.get('/api/reservas', (req, res) => {
    try {
        const reservas = obtenerReservas();
        res.json({
            success: true,
            total: reservas.length,
            reservas: reservas
        });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las reservas'
        });
    }
});

app.get('/api/reservas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const reserva = obtenerReservaPorId(id);
        
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        res.json({
            success: true,
            reserva: reserva
        });
    } catch (error) {
        console.error('Error al obtener reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la reserva'
        });
    }
});

app.put('/api/reservas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, telefono, direccion, correo, mensaje } = req.body;

        if (!nombre || !telefono || !correo) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, teléfono y correo son obligatorios'
            });
        }

        const resultado = actualizarReserva(id, { nombre, telefono, direccion, correo, mensaje });
        
        if (!resultado.success) {
            return res.status(404).json(resultado);
        }
        
        res.json(resultado);
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la reserva'
        });
    }
});

app.delete('/api/reservas/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = eliminarReserva(id);
        
        if (!resultado.success) {
            return res.status(404).json(resultado);
        }
        
        res.json(resultado);
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la reserva'
        });
    }
});

// ========== INICIAR SERVIDOR ==========

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(`${'='.repeat(60)}\n`);
    
    console.log(' Rutas de autenticación:');
    console.log(`   POST   /api/login          - Iniciar sesión`);
    console.log(`   POST   /api/register       - Registrar usuario\n`);
    
    console.log('  Rutas de productos:');
    console.log(`   GET    /api/productos      - Listar productos\n`);
    
    console.log(' Rutas de reservas (CRUD):');
    console.log(`   POST   /api/reservas       - Crear reserva`);
    console.log(`   GET    /api/reservas       - Listar todas`);
    console.log(`   GET    /api/reservas/:id   - Obtener una`);
    console.log(`   PUT    /api/reservas/:id   - Actualizar`);
    console.log(`   DELETE /api/reservas/:id   - Eliminar\n`);
    
    console.log(`${'='.repeat(60)}`);
    console.log(` Páginas disponibles:`);
    console.log(`   http://localhost:${PORT}/login.html`);
    console.log(`   http://localhost:${PORT}/LaSillaRoja.html`);
    console.log(`${'='.repeat(60)}\n`);
});