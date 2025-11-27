


let tiempo = 0;           
let intervalo = null;     
let estaActivo = false;   


const display = document.getElementById('display');
const mensaje = document.getElementById('mensaje');
const btnIniciar = document.getElementById('btnIniciar');
const btnDetener = document.getElementById('btnDetener');
const btnReiniciar = document.getElementById('btnReiniciar');


function iniciarTimer() {
    
    if (!estaActivo) {
        estaActivo = true;
        
        
        btnIniciar.textContent = ' Contando...';
        btnIniciar.disabled = true;
        btnIniciar.style.opacity = '0.6';
        btnIniciar.style.cursor = 'not-allowed';
        
        mensaje.textContent = 'Turno en proceso...';
        mensaje.classList.add('activo');
        
        
        
        intervalo = setInterval(function() {
        
            console.log('Tiempo actual: ' + tiempo);
            tiempo++;  
            display.textContent = tiempo;  
            
        
            if (tiempo < 10) {
                
            } else {
                
                mensaje.textContent = '¡Turno completado! Cliente atendido.';
                console.log('¡Conteo completado! Se ha detenido.');
                
                
                clearInterval(intervalo);
                
                
                tiempo = 0;
                
                
                btnIniciar.textContent = '▶ Iniciar Turno';
                btnIniciar.disabled = false;
                btnIniciar.style.opacity = '1';
                btnIniciar.style.cursor = 'pointer';
                
                
                setTimeout(function() {
                    display.textContent = tiempo;
                    mensaje.classList.remove('activo');
                }, 2000);
                
                estaActivo = false;
            }
        }, 1000); 
        
        console.log('El temporizador ya está en ejecución');
    }
}


function detenerTimer() {
    if (estaActivo) {
        clearInterval(intervalo);
        estaActivo = false;
        

        btnIniciar.textContent = '▶ Iniciar Turno';
        btnIniciar.disabled = false;
        btnIniciar.style.opacity = '1';
        btnIniciar.style.cursor = 'pointer';
        
        mensaje.textContent = 'Turno pausado';
        mensaje.classList.remove('activo');
        console.log('Temporizador detenido manualmente');
    }
}


function reiniciarTimer() {
    clearInterval(intervalo);
    tiempo = 0;
    display.textContent = tiempo;
    estaActivo = false;
    

    btnIniciar.textContent = '▶ Iniciar Turno';
    btnIniciar.disabled = false;
    btnIniciar.style.opacity = '1';
    btnIniciar.style.cursor = 'pointer';
    
    mensaje.textContent = '';
    mensaje.classList.remove('activo');
    console.log('Temporizador reiniciado');
}


btnIniciar.addEventListener('click', iniciarTimer);
btnDetener.addEventListener('click', detenerTimer);
btnReiniciar.addEventListener('click', reiniciarTimer);

