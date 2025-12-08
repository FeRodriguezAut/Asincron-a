// EJERCICIO 4: Procesamiento de pedidos con pasos obligatorios y opcionales
// Controla el flujo: stock → costos → factura (obligatorios)
// Recomendaciones (opcional, en paralelo)

const prompt = require('prompt-sync')();

// 1. Validar stock (obligatorio)
function validarStock(idPedido, tiempo, debefallar = false) {
    return new Promise((resolve, reject) => {
        console.log(` Validando stock del pedido ${idPedido}...`);
        
        setTimeout(() => {
            if (debefallar) {
                reject({
                    paso: 'Validación de Stock',
                    estado: 'FALLIDO',
                    error: 'Stock insuficiente'
                });
            } else {
                console.log(` Stock validado correctamente`);
                resolve({
                    paso: 'Validación de Stock',
                    estado: 'EXITOSO',
                    stockDisponible: true
                });
            }
        }, tiempo * 1000);
    });
}

// 2. Calcular costos (obligatorio)
function calcularCostos(idPedido, tiempo) {
    return new Promise((resolve) => {
        console.log(` Calculando costos del pedido ${idPedido}...`);
        
        setTimeout(() => {
            console.log(` Costos calculados`);
            resolve({
                paso: 'Cálculo de Costos',
                estado: 'EXITOSO',
                subtotal: 100000,
                impuestos: 19000,
                total: 119000
            });
        }, tiempo * 1000);
    });
}

// 3. Generar recomendaciones (opcional - en paralelo)
function generarRecomendaciones(idPedido, tiempo) {
    return new Promise((resolve) => {
        console.log(` Generando recomendaciones...`);
        
        setTimeout(() => {
            console.log(` Recomendaciones generadas`);
            resolve({
                paso: 'Recomendaciones',
                estado: 'EXITOSO',
                productos: ['Producto A', 'Producto B', 'Producto C']
            });
        }, tiempo * 1000);
    });
}

// 4. Enviar factura (obligatorio - depende de paso 1 y 2)
function enviarFactura(idPedido, tiempo, costos) {
    return new Promise((resolve) => {
        console.log(` Generando y enviando factura...`);
        
        setTimeout(() => {
            console.log(` Factura enviada`);
            resolve({
                paso: 'Envío de Factura',
                estado: 'EXITOSO',
                numeroFactura: `FAC-${Date.now()}`,
                total: costos.total
            });
        }, tiempo * 1000);
    });
}

// Función principal
async function procesarPedido() {

    
    // Solicitar datos
    const idPedido = prompt('ID del pedido: ');
    
    console.log('\n  Tiempos estimados por proceso:');
    const tiempoStock = parseFloat(prompt('Validación de stock (segundos): '));
    const tiempoCostos = parseFloat(prompt('Cálculo de costos (segundos): '));
    const tiempoRecom = parseFloat(prompt('Recomendaciones (segundos): '));
    const tiempoFactura = parseFloat(prompt('Envío de factura (segundos): '));
    
    const fallaStock = prompt('\n¿Falla validación de stock? (si/no): ').toLowerCase() === 'si';
    
    console.log('\n Iniciando procesamiento del pedido...\n');
    const tiempoInicio = Date.now();
    const resultados = [];
    let procesoExitoso = true;
    
    try {
        // PASO 1: Validar stock (obligatorio)
        const stock = await validarStock(idPedido, tiempoStock, fallaStock);
        resultados.push(stock);
        
        // PASO 2: Calcular costos (obligatorio)
        const costos = await calcularCostos(idPedido, tiempoCostos);
        resultados.push(costos);
        
        // Iniciar recomendaciones en paralelo (no bloqueante)
        const promesaRecomendaciones = generarRecomendaciones(idPedido, tiempoRecom);
        
        // PASO 3: Enviar factura (obligatorio - depende de pasos anteriores)
        const factura = await enviarFactura(idPedido, tiempoFactura, costos);
        resultados.push(factura);
        
        // Esperar recomendaciones (opcional)
        const recomendaciones = await promesaRecomendaciones;
        resultados.push(recomendaciones);
        
    } catch (error) {
        procesoExitoso = false;
        resultados.push(error);
        console.log(`\n ERROR: ${error.error}`);
    }
    
    const tiempoFin = Date.now();
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000;
    
    // Mostrar informe

    console.log(` Pedido: ${idPedido}\n`);
    
    console.log(' FLUJO DE EJECUCIÓN:');
    resultados.forEach((r, index) => {
        const icono = r.estado === 'EXITOSO' ? '' : 
        console.log(`${index + 1}. ${icono} ${r.paso} - ${r.estado}`);
        
        if (r.paso === 'Cálculo de Costos' && r.estado === 'EXITOSO') {
            console.log(`   Subtotal: $${r.subtotal}`);
            console.log(`   Impuestos: $${r.impuestos}`);
            console.log(`   Total: $${r.total}`);
        }
        
        if (r.paso === 'Envío de Factura' && r.estado === 'EXITOSO') {
            console.log(`   Número: ${r.numeroFactura}`);
        }
        
        if (r.paso === 'Recomendaciones' && r.estado === 'EXITOSO') {
            console.log(`   Productos sugeridos: ${r.productos.join(', ')}`);
        }
    });
    
  
    if (procesoExitoso) {
        console.log(' PEDIDO PROCESADO EXITOSAMENTE');
        const factura = resultados.find(r => r.paso === 'Envío de Factura');
        if (factura) {
            console.log(` Factura generada: ${factura.numeroFactura}`);
        }
    } else {
        console.log(' ERROR EN EL PROCESAMIENTO DEL PEDIDO');
    }
    console.log(`  Tiempo total: ${tiempoTotal} segundos`);

}

// Ejecutar el programa
procesarPedido();