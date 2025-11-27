
document.addEventListener('DOMContentLoaded', function() {
    
    
    const productosContainer = document.getElementById('productos-container');
    
    
    function cargarProductos() {
            
        
        fetch('/api/productos')
            .then(response => {
                
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                
                return response.json();
            })
            .then(productos => {
                
                productosContainer.innerHTML = '';
                
                
                if (productos.length === 0) {
                    productosContainer.innerHTML = `
                        <div class="error-productos">
                            <p>No hay productos disponibles en este momento.</p>
                        </div>
                    `;
                    return;
                }
                
                
                productos.forEach(producto => {
                    
                    const productoCard = document.createElement('div');
                    productoCard.className = 'producto-card';
                    
                    productoCard.innerHTML = `
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <div class="producto-info">
                            <h3>${producto.nombre}</h3>
                            <p>${producto.descripcion}</p>
                            <div class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</div>
                        </div>
                    `;
                    
                    productosContainer.appendChild(productoCard);
                });
                
                console.log(' Productos cargados exitosamente:', productos.length);
            })
            .catch(error => {
                
                console.error(' Error al cargar productos:', error);
                productosContainer.innerHTML = `
                    <div class="error-productos">
                        <p>Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>
                    </div>
                `;
            });
    }
    
    
    cargarProductos();
    
    
});