// EJERCICIO 2: Entrega de paquetes con tiempos variables
// Procesa todas las entregas en paralelo (simultáneas)

const prompt = require('prompt-sync')();

// Función que simula la entrega de un paquete
function entregarPaquete(id, tiempoEntrega, debefallar = false) {
    return new Promise((resolve, reject) => {
        console.log(` Iniciando entrega del paquete ${id}...`);
        const inicio = Date.now();
        
        setTimeout(() => {
            const fin = Date.now();
            const duracion = (fin - inicio) / 1000;
            
            // Simular fallo si se indica
            if (debefallar) {
                console.log(` Paquete ${id} - ERROR en la entrega`);
                reject({
                    id: id,
                    estado: 'FALLIDO',
                    error: 'Dirección no encontrada',
                    tiempo: duracion
                });
            } else {
                console.log(` Paquete ${id} entregado en ${duracion} segundos`);
                resolve({
                    id: id,
                    estado: 'ENTREGADO',
                    tiempoEntrega: duracion,
                    horaEntrega: new Date(fin).toLocaleTimeString()
                });
            }
        }, tiempoEntrega * 1000);
    });
}

// Función principal
async function gestionarEntregas() {
    console.log('═══════════════════════════════════════════');
    console.log('   SISTEMA DE ENTREGA DE PAQUETES          ');
    console.log('═══════════════════════════════════════════\n');
    
    // Solicitar cantidad de paquetes
    const cantidad = parseInt(prompt('¿Cuántos paquetes hay para entregar? '));
    const paquetes = [];
    
    // Capturar datos de cada paquete
    for (let i = 0; i < cantidad; i++) {
        const id = prompt(`ID del paquete ${i + 1}: `);
        const tiempo = parseFloat(prompt(`Tiempo estimado de entrega (segundos): `));
        const falla = prompt('¿Debe fallar esta entrega? (si/no): ').toLowerCase() === 'si';
        paquetes.push({ id, tiempo, falla });
    }
    
    console.log('\n Iniciando entregas simultáneas...\n');
    const tiempoInicio = Date.now();
    
    // Crear promesas para todas las entregas (en paralelo)
    const promesas = paquetes.map(p => 
        entregarPaquete(p.id, p.tiempo, p.falla)
            .catch(error => error) // Capturar errores individualmente
    );
    
    // Esperar a que todas terminen
    const resultados = await Promise.all(promesas);
    
    const tiempoFin = Date.now();
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000;
    
    // Ordenar por tiempo de entrega
    const ordenados = resultados
        .map((r, index) => ({ ...r, orden: index + 1 }))
        .sort((a, b) => (a.tiempoEntrega || a.tiempo) - (b.tiempoEntrega || b.tiempo));
    
    // Mostrar informe final
   
    
    console.log(' ORDEN DE FINALIZACIÓN:');
    ordenados.forEach((r, index) => {
        if (r.estado === 'ENTREGADO') {
            console.log(`${index + 1}° - Paquete ${r.id} - ${r.tiempoEntrega}s - ${r.horaEntrega}`);
        } else {
            console.log(`${index + 1}° - Paquete ${r.id} - FALLIDO - ${r.error}`);
        }
    });
    
    const exitosos = resultados.filter(r => r.estado === 'ENTREGADO').length;
    const fallidos = resultados.filter(r => r.estado === 'FALLIDO').length;
    
 
    console.log(`    Entregas exitosas: ${exitosos}`);
    console.log(`    Entregas fallidas: ${fallidos}`);
    console.log(`    Tiempo total: ${tiempoTotal} segundos`);
    console.log('═══════════════════════════════════════════\n');
}

// Ejecutar el programa
gestionarEntregas();