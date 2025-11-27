La Silla Roja - Barbería
página web de barbería con sistema de reservas, catálogo de productos dinámico y
base de datos SQLite.

Descripción
Proyecto académico que implementa un sitio web funcional con:

Temporizador de cuenta regresiva
Formulario de reservas con validación TypeScript
Catálogo de productos dinámico (Express + Fetch API)
Base de datos SQLite con CRUD completo
Diseño responsive

Tecnologías
Frontend: HTML5, CSS3, JavaScript, TypeScript
Backend: Node.js, Express.js, SQLite3, Body-Parser

Estructura del Proyecto
 dist/ (carpeta con formulario.js compilado)
 images/ (carpeta con imágenes)
 src/ (carpeta con formulario.ts)
 barberia.db (base de datos con tus datos de prueba)
 database.js
 LaSillaRoja.html
 productos.js
 readme.md 
 server.js
 style.css
 temporizador.js
 tsconfig.json
 package.json
 package-lock.json

Instalación:

 Requisitos
 Node.js v14+ y npm


pasos:
1.Descomprimir el proyecto
2.Instalar dependencias
3.Compilar TypeScript
4.Iniciar servidor
5.Abrir navegador

Uso:
Formulario de Reservas

Ir a la sección "Reserva una Cita"
Completar: nombre, teléfono, correo, dirección y un mensaje o comentario
Enviar → se guarda en base de datos SQLite

Productos

Se cargan automáticamente desde el servidor
6 productos con imágenes, descripciones y precios

API REST
Productos

GET /api/productos - Listar productos

Reservas (CRUD)

POST /api/reservas - Crear reserva
GET /api/reservas - Listar todas
GET /api/reservas/:id - Obtener una
PUT /api/reservas/:id - Actualizar
DELETE /api/reservas/:id - Eliminar

Consultar datos:
node -e "const db = require('./database'); console.log(db.obtenerReservas());"


Actividades Implementadas
 Actividad 1: Temporizador dinámico en JavaScript
 Actividad 2: Formulario con validación TypeScript + Node.js
 Actividad 3: Lista dinámica con Express y Fetch API
 Parcial: CRUD completo con SQLite


Scripts Útiles
npx tsc                 # Compilar TypeScript
npx tsc --watch         # Compilar en modo watch
node server.js          # Iniciar servidor
nodemon server.js       # Iniciar con auto-reinicio

Solución de Problemas
Error: Cannot find module
npm install

Solución de Problemas
Error: Cannot find module
npm install

TypeScript no compila
npm install typescript --save-dev
npx tsc


Tener en cuenta:

La carpeta node_modules no está incluida en el .zip
Ejecutar npm install antes de usar
El archivo barberia.db se crea automáticamente
Puerto por defecto: 3000 (modificable en server.js)