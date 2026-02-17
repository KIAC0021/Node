// Función para calcular promedio usando el endpoint
async function calculateAverage() {
    // Obtener los valores de los inputs
    const unit1 = document.getElementById('unit1').value;
    const unit2 = document.getElementById('unit2').value;
    const unit3 = document.getElementById('unit3').value;
    
    // Validar campos vacíos
    if (!unit1 || !unit2 || !unit3) {
        alert('Por favor, ingresa todas las calificaciones');
        return;
    }
    
    // Mostrar indicador de carga
    const btn = document.querySelector('.calculate-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Calculando...';
    btn.disabled = true;
    
    try {
        // Hacer la petición al servidor (usando fetch)
        const response = await fetch('/calcular-promedio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                unidad1: unit1,
                unidad2: unit2,
                unidad3: unit3
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Mostrar el resultado
            document.getElementById('averageValue').textContent = data.promedio.toFixed(2);
            
            const statusBadge = document.getElementById('statusBadge');
            statusBadge.classList.remove('aprobado', 'reprobado', 'pendiente');
            
            if (data.estatus === "Aprobado") {
                statusBadge.textContent = 'APROBADO 🎉';
                statusBadge.classList.add('aprobado');
            } else {
                statusBadge.textContent = 'REPROBADO 📚';
                statusBadge.classList.add('reprobado');
            }
            
            // Activar animación
            const resultCard = document.getElementById('resultCard');
            resultCard.classList.add('active');
            setTimeout(() => {
                resultCard.classList.remove('active');
            }, 500);
            
        } else {
            alert(data.error || 'Error en el servidor');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    } finally {
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Validación de inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        // Validar mientras se escribe
        input.addEventListener('input', function() {
            let value = parseFloat(this.value);
            
            if (this.value === '') return;
            
            if (isNaN(value)) {
                this.value = '';
                return;
            }
            
            // Limitar entre 0 y 10
            if (value < 0) this.value = 0;
            if (value > 10) this.value = 10;
        });
        
        // Permitir solo números y punto decimal
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.charCode);
            if (!/[\d.]/.test(char)) {
                e.preventDefault();
            }
            
            // Evitar múltiples puntos decimales
            if (char === '.' && this.value.includes('.')) {
                e.preventDefault();
            }
        });
    });
    
    // Agregar funcionalidad de Enter
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAverage();
            }
        });
    });
});