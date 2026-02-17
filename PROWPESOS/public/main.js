// Script para el conversor de moneda - Versión para Express

// Variables globales
let tipoCambio = 20.50; // Valor por defecto

// Elementos del DOM
const pesosInput = document.getElementById('pesos');
const dolaresInput = document.getElementById('dolares');
const pesosDisplay = document.getElementById('pesosDisplay');
const dolaresDisplay = document.getElementById('dolaresDisplay');
const tipoCambioValor = document.getElementById('tipoCambioValor');
const fechaActual = document.getElementById('fechaActual');

// Actualizar fecha actual
function actualizarFecha() {
    const ahora = new Date();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    fechaActual.textContent = ahora.toLocaleDateString('es-MX', opciones);
}

// Función para formatear moneda
function formatMoney(cantidad, moneda) {
    return new Intl.NumberFormat(moneda === 'MXN' ? 'es-MX' : 'en-US', {
        style: 'currency',
        currency: moneda,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(cantidad);
}

// Función para convertir pesos a dólares (usando el endpoint)
async function convertirPesosADolares() {
    const pesos = pesosInput.value;
    
    if (!pesos) {
        alert('Por favor, ingresa una cantidad en pesos');
        return;
    }
    
    // Mostrar loading
    const btn = document.querySelector('.convert-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Convirtiendo...';
    btn.disabled = true;
    
    try {
        // Aquí deberías crear un endpoint similar al de promedios
        // Por ahora haremos la conversión local
        const cantidadPesos = parseFloat(pesos);
        const dolares = cantidadPesos / tipoCambio;
        
        // Simular tiempo de respuesta del servidor
        setTimeout(() => {
            // Actualizar inputs
            dolaresInput.value = dolares.toFixed(2);
            
            // Actualizar displays
            pesosDisplay.textContent = formatMoney(cantidadPesos, 'MXN');
            dolaresDisplay.textContent = formatMoney(dolares, 'USD');
            
            // Animar resultado
            const resultCard = document.getElementById('resultCard');
            resultCard.classList.add('active');
            setTimeout(() => {
                resultCard.classList.remove('active');
            }, 500);
            
            // Restaurar botón
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conversión');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Función para convertir dólares a pesos
function convertirDolaresAPesos() {
    const dolares = dolaresInput.value;
    
    if (!dolares) {
        alert('Por favor, ingresa una cantidad en dólares');
        return;
    }
    
    const cantidadDolares = parseFloat(dolares);
    const pesos = cantidadDolares * tipoCambio;
    
    // Actualizar inputs
    pesosInput.value = pesos.toFixed(2);
    
    // Actualizar displays
    pesosDisplay.textContent = formatMoney(pesos, 'MXN');
    dolaresDisplay.textContent = formatMoney(cantidadDolares, 'USD');
    
    // Animar resultado
    const resultCard = document.getElementById('resultCard');
    resultCard.classList.add('active');
    setTimeout(() => {
        resultCard.classList.remove('active');
    }, 500);
}

// Intercambiar monedas
function intercambiarMonedas() {
    if (dolaresInput.value && dolaresInput.value !== '0.00') {
        convertirDolaresAPesos();
    } else if (pesosInput.value && pesosInput.value !== '0.00') {
        convertirPesosADolares();
    }
    
    // Rotar icono
    const swapIcon = document.querySelector('.swap-icon i');
    swapIcon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        swapIcon.style.transform = 'rotate(0deg)';
    }, 300);
}

// Editar tipo de cambio
function editarTipoCambio() {
    const nuevoCambio = prompt('Ingresa el nuevo tipo de cambio (1 USD = ? MXN):', tipoCambio);
    
    if (nuevoCambio !== null && !isNaN(nuevoCambio) && nuevoCambio > 0) {
        tipoCambio = parseFloat(nuevoCambio);
        tipoCambioValor.textContent = tipoCambio.toFixed(2);
        
        // Recalcular si hay valores
        if (pesosInput.value) {
            convertirPesosADolares();
        }
        
        // Mostrar notificación simple
        alert('✅ Tipo de cambio actualizado correctamente');
    } else if (nuevoCambio !== null) {
        alert('❌ Por favor, ingresa un valor válido mayor a 0');
    }
}

// Conversiones rápidas
function quickConvert(cantidad) {
    pesosInput.value = cantidad;
    convertirPesosADolares();
    
    // Resaltar botón
    const buttons = document.querySelectorAll('.quick-buttons button');
    buttons.forEach(btn => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    actualizarFecha();
    
    // Actualizar fecha cada minuto
    setInterval(actualizarFecha, 60000);
    
    // Conversión en tiempo real con debounce manual
    let timeout;
    pesosInput.addEventListener('input', function() {
        clearTimeout(timeout);
        if (this.value) {
            timeout = setTimeout(() => {
                convertirPesosADolares();
            }, 500);
        } else {
            dolaresInput.value = '';
            pesosDisplay.textContent = formatMoney(0, 'MXN');
            dolaresDisplay.textContent = formatMoney(0, 'USD');
        }
    });
    
    // Validación de entrada
    pesosInput.addEventListener('keypress', function(e) {
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
        }
        
        // Evitar múltiples puntos
        if (e.key === '.' && this.value.includes('.')) {
            e.preventDefault();
        }
    });
    
    // Conversión inicial
    convertirPesosADolares();
});

// Agregar estilos para el spinner (si no existen)
const style = document.createElement('style');
style.textContent = `
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .convert-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);