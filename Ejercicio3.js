// EJERCICIO 3: Validación de formulario con múltiples verificaciones
// Ejecuta 3 validaciones en paralelo

const prompt = require('prompt-sync')();

// Función para validar correo
function validarCorreo(correo, tiempo, debefallar = false) {
    return new Promise((resolve, reject) => {
        console.log(` Validando correo: ${correo}...`);
        
        setTimeout(() => {
            if (debefallar) {
                reject({
                    campo: 'Correo',
                    estado: 'RECHAZADO',
                    mensaje: 'El correo ya está registrado'
                });
            } else {
                resolve({
                    campo: 'Correo',
                    estado: 'VÁLIDO',
                    valor: correo
                });
            }
        }, tiempo * 1000);
    });
}

// Función para validar documento
function validarDocumento(documento, tiempo, debefallar = false) {
    return new Promise((resolve, reject) => {
        console.log(` Validando documento: ${documento}...`);
        
        setTimeout(() => {
            if (debefallar) {
                reject({
                    campo: 'Documento',
                    estado: 'RECHAZADO',
                    mensaje: 'Documento inválido o no encontrado'
                });
            } else {
                resolve({
                    campo: 'Documento',
                    estado: 'VÁLIDO',
                    valor: documento
                });
            }
        }, tiempo * 1000);
    });
}

// Función para validar disponibilidad de usuario
function validarDisponibilidad(nombre, tiempo, debefallar = false) {
    return new Promise((resolve, reject) => {
        console.log(` Validando disponibilidad del usuario: ${nombre}...`);
        
        setTimeout(() => {
            if (debefallar) {
                reject({
                    campo: 'Disponibilidad',
                    estado: 'RECHAZADO',
                    mensaje: 'El nombre de usuario no está disponible'
                });
            } else {
                resolve({
                    campo: 'Disponibilidad',
                    estado: 'VÁLIDO',
                    valor: nombre
                });
            }
        }, tiempo * 1000);
    });
}

// Función principal
async function validarFormulario() {

    
    // Solicitar datos del usuario
    const correo = prompt('Ingrese correo electrónico: ');
    const documento = prompt('Ingrese número de documento: ');
    const nombre = prompt('Ingrese nombre de usuario: ');
    
    console.log('\n  Tiempos de respuesta de cada servicio:');
    const tiempoCorreo = parseFloat(prompt('Tiempo validación correo (segundos): '));
    const tiempoDoc = parseFloat(prompt('Tiempo validación documento (segundos): '));
    const tiempoDisp = parseFloat(prompt('Tiempo validación disponibilidad (segundos): '));
    
    // Preguntar si alguna validación debe fallar
    console.log('\n  Simulación de errores:');
    const fallaCorreo = prompt('¿Falla validación de correo? (si/no): ').toLowerCase() === 'si';
    const fallaDoc = prompt('¿Falla validación de documento? (si/no): ').toLowerCase() === 'si';
    const fallaDisp = prompt('¿Falla validación de disponibilidad? (si/no): ').toLowerCase() === 'si';
    
    console.log('\n Iniciando validaciones en paralelo...\n');
    const tiempoInicio = Date.now();
    
    // Ejecutar las 3 validaciones en paralelo
    const resultados = await Promise.allSettled([
        validarCorreo(correo, tiempoCorreo, fallaCorreo),
        validarDocumento(documento, tiempoDoc, fallaDoc),
        validarDisponibilidad(nombre, tiempoDisp, fallaDisp)
    ]);
    
    const tiempoFin = Date.now();
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000;
    
    // Procesar resultados
    const validaciones = resultados.map(r => {
        if (r.status === 'fulfilled') {
            return r.value;
        } else {
            return r.reason;
        }
    });
    
    // Verificar si todas las validaciones fueron exitosas
    const todasValidas = validaciones.every(v => v.estado === 'VÁLIDO');
    

    validaciones.forEach(v => {
        const icono = v.estado === 'VÁLIDO' ? '✅' : '❌';
        console.log(`${icono} ${v.campo}: ${v.estado}`);
        if (v.mensaje) {
            console.log(`   → ${v.mensaje}`);
        }
    });
    
    
    if (todasValidas) {
        console.log(' FORMULARIO VALIDADO CORRECTAMENTE');
    } else {
        console.log(' VALIDACIÓN FALLIDA - Corrija los errores');
    }
    console.log(`  Tiempo total del proceso: ${tiempoTotal} segundos`);
   
}

// Ejecutar el programa
validarFormulario();