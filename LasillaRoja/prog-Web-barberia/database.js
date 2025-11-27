const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'barberia.db');
const db = new Database(dbPath);

// TABLA RESERVAS
db.exec(`
    CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT NOT NULL,
        direccion TEXT,
        correo TEXT NOT NULL,
        mensaje TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// TABLA USUARIOS
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre_completo TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('admin', 'cliente')),
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Insertar usuarios de prueba
const insertUsuario = db.prepare(`
    INSERT OR IGNORE INTO usuarios (username, password, nombre_completo, rol) 
    VALUES (?, ?, ?, ?)
`);

insertUsuario.run('admin', 'admin123', 'Administrador', 'admin');
insertUsuario.run('cliente1', 'cliente123', 'Juan Pérez', 'cliente');
insertUsuario.run('cliente2', 'cliente456', 'María González', 'cliente');

console.log(' Base de datos SQLite conectada correctamente');
console.log(` Ubicación: ${dbPath}`);
console.log(' Usuarios de prueba creados:');
console.log('   - admin / admin123 (ROL: admin)');
console.log('   - cliente1 / cliente123 (ROL: cliente)');
console.log('   - cliente2 / cliente456 (ROL: cliente)');

// ========== FUNCIONES CRUD RESERVAS ==========
function crearReserva(datos) {
    const { nombre, telefono, direccion, correo, mensaje } = datos;
    
    const stmt = db.prepare(`
        INSERT INTO reservas (nombre, telefono, direccion, correo, mensaje)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(nombre, telefono, direccion || '', correo, mensaje || '');
    
    return {
        success: true,
        id: result.lastInsertRowid,
        message: 'Reserva creada exitosamente'
    };
}

function obtenerReservas() {
    const stmt = db.prepare('SELECT * FROM reservas ORDER BY fecha_creacion DESC');
    return stmt.all();
}

function obtenerReservaPorId(id) {
    const stmt = db.prepare('SELECT * FROM reservas WHERE id = ?');
    return stmt.get(id);
}

function actualizarReserva(id, datos) {
    const { nombre, telefono, direccion, correo, mensaje } = datos;
    
    const stmt = db.prepare(`
        UPDATE reservas 
        SET nombre = ?, 
            telefono = ?, 
            direccion = ?, 
            correo = ?, 
            mensaje = ?,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = ?
    `);
    
    const result = stmt.run(nombre, telefono, direccion || '', correo, mensaje || '', id);
    
    if (result.changes === 0) {
        return {
            success: false,
            message: 'Reserva no encontrada'
        };
    }
    
    return {
        success: true,
        message: 'Reserva actualizada exitosamente'
    };
}

function eliminarReserva(id) {
    const stmt = db.prepare('DELETE FROM reservas WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
        return {
            success: false,
            message: 'Reserva no encontrada'
        };
    }
    
    return {
        success: true,
        message: 'Reserva eliminada exitosamente'
    };
}

function buscarUsuario(username) {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE username = ?');
    return stmt.get(username);
}

function validarLogin(username, password) {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE username = ? AND password = ?');
    const usuario = stmt.get(username, password);
    
    if (usuario) {
        return {
            success: true,
            usuario: {
                id: usuario.id,
                username: usuario.username,
                nombre_completo: usuario.nombre_completo,
                rol: usuario.rol
            }
        };
    }
    
    return {
        success: false,
        message: 'Usuario o contraseña incorrectos'
    };
}

function crearUsuario(datos) {
    const { username, password, nombre_completo, rol = 'cliente' } = datos;
    
    try {
        const stmt = db.prepare(`
            INSERT INTO usuarios (username, password, nombre_completo, rol)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(username, password, nombre_completo, rol);
        
        return {
            success: true,
            id: result.lastInsertRowid,
            message: 'Usuario registrado exitosamente'
        };
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return {
                success: false,
                message: 'El nombre de usuario ya existe'
            };
        }
        return {
            success: false,
            message: 'Error al crear usuario'
        };
    }
}

module.exports = {
    db,
    crearReserva,
    obtenerReservas,
    obtenerReservaPorId,
    actualizarReserva,
    eliminarReserva,
    buscarUsuario,
    validarLogin,
    crearUsuario
};