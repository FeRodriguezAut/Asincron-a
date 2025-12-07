    const prompt = require('prompt-sync')();


const solicitudes = [
    { usuario: "Juan", tiempoAtencion: 2000 },
    { usuario: "María", tiempoAtencion: 3000 },
    { usuario: "Pedro", tiempoAtencion: 1500 },
    { usuario: "Ana", tiempoAtencion: 2500 }
];

function atenderUsuario(solicitud) {
    return new Promise((resolve) => {
        const inicio = Date.now();
        console.log(`Atendiendo a: ${solicitud.usuario}`);
        
        setTimeout(() => {
            const fin = Date.now();
            const duracion = fin - inicio;
            console.log(`${solicitud.usuario} atendido en ${duracion}ms`);
            resolve(duracion);
        }, solicitud.tiempoAtencion);
    });
}

async function procesarCola() {
    console.log("=== INICIO DEL PROCESO ===\n");
    const tiempoInicioTotal = Date.now();
    
    for (let solicitud of solicitudes) {
        await atenderUsuario(solicitud);
    }
    
    const tiempoTotal = Date.now() - tiempoInicioTotal;
    console.log(`\n=== PROCESO COMPLETO ===`);
    console.log(`Tiempo total: ${tiempoTotal}ms`);
}

procesarCola();