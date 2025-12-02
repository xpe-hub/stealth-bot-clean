#!/usr/bin/env node

/**
 * 🚀 INSTALADOR RÁPIDO - Stealth AntiCheat Bot v2.0
 * Instalación automática y configuración en 1 comando
 * Desarrollado por: xpe.nettt
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Banner
function showBanner() {
    console.clear();
    console.log(colors.cyan + '╔════════════════════════════════════════╗' + colors.reset);
    console.log(colors.cyan + '║' + colors.bright + '  🤖 STEALTH ANTICHEAT BOT v2.0' + '     ' + colors.cyan + '║' + colors.reset);
    console.log(colors.cyan + '║' + colors.bright + '       Instalador Rápido' + '          ' + colors.cyan + '║' + colors.reset);
    console.log(colors.cyan + '╚════════════════════════════════════════╝' + colors.reset);
    console.log('');
}

// Función para ejecutar comandos
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout || stderr);
            }
        });
    });
}

// Función para verificar Node.js
async function checkNodeJS() {
    console.log(colors.blue + '🔍 Verificando Node.js...' + colors.reset);
    
    try {
        const version = await runCommand('node --version');
        const npmVersion = await runCommand('npm --version');
        
        console.log(colors.green + '✅ Node.js: ' + version.trim() + colors.reset);
        console.log(colors.green + '✅ npm: ' + npmVersion.trim() + colors.reset);
        return true;
    } catch (error) {
        console.log(colors.red + '❌ Node.js no encontrado' + colors.reset);
        console.log(colors.yellow + '📥 Descarga Node.js desde: https://nodejs.org/' + colors.reset);
        return false;
    }
}

// Función para crear .env si no existe
function createEnvIfNeeded() {
    if (!fs.existsSync('.env')) {
        console.log(colors.blue + '📋 Creando archivo .env...' + colors.reset);
        fs.copyFileSync('.env.template', '.env');
        console.log(colors.yellow + '⚠️ Configura el archivo .env antes de continuar' + colors.reset);
        return false;
    }
    return true;
}

// Función para instalar dependencias
async function installDependencies() {
    console.log(colors.blue + '📦 Instalando dependencias...' + colors.reset);
    
    try {
        await runCommand('npm install --silent');
        console.log(colors.green + '✅ Dependencias instaladas' + colors.reset);
        return true;
    } catch (error) {
        console.log(colors.red + '❌ Error instalando dependencias' + colors.reset);
        return false;
    }
}

// Función para crear directorios
function createDirectories() {
    console.log(colors.blue + '📁 Creando directorios...' + colors.reset);
    
    const dirs = ['logs', 'data', 'backup'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
    
    console.log(colors.green + '✅ Directorios creados' + colors.reset);
}

// Función para verificar configuración
function checkConfiguration() {
    if (!fs.existsSync('.env')) {
        return false;
    }
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const hasToken = envContent.includes('DISCORD_BOT_TOKEN') && !envContent.includes('YOUR_DISCORD_BOT_TOKEN_HERE');
    const hasUserId = envContent.includes('BOT_OWNER_ID') && !envContent.includes('YOUR_DISCORD_USER_ID_HERE');
    
    return hasToken && hasUserId;
}

// Función principal
async function main() {
    showBanner();
    
    console.log(colors.bright + '🚀 ¡Instalación automática iniciada!' + colors.reset);
    console.log(colors.dim + 'Este proceso puede tardar unos minutos...' + colors.reset);
    console.log('');
    
    // Verificar Node.js
    if (!(await checkNodeJS())) {
        process.exit(1);
    }
    console.log('');
    
    // Crear .env
    createEnvIfNeeded();
    console.log('');
    
    // Instalar dependencias
    if (!(await installDependencies())) {
        process.exit(1);
    }
    console.log('');
    
    // Crear directorios
    createDirectories();
    console.log('');
    
    // Resultado final
    console.log(colors.green + '╔══════════════════════════════════════╗' + colors.reset);
    console.log(colors.green + '║' + '  🎉 INSTALACIÓN COMPLETADA' + '           ' + colors.green + '║' + colors.reset);
    console.log(colors.green + '╚══════════════════════════════════════╝' + colors.reset);
    console.log('');
    
    if (checkConfiguration()) {
        console.log(colors.green + '✅ Configuración detectada' + colors.reset);
        console.log(colors.cyan + '🚀 Listo para iniciar!' + colors.reset);
        console.log('');
        console.log(colors.blue + '💡 Ejecuta uno de estos comandos:' + colors.reset);
        console.log(colors.yellow + '   ./start.sh' + colors.reset);
        console.log(colors.yellow + '   node start.sh' + colors.reset);
        console.log(colors.yellow + '   npm start' + colors.reset);
    } else {
        console.log(colors.yellow + '⚠️ Configuración requerida' + colors.reset);
        console.log(colors.blue + '💡 Ejecuta: node setup.js' + colors.reset);
        console.log(colors.blue + '💡 O edita manualmente el archivo .env' + colors.reset);
    }
    
    console.log('');
    console.log(colors.cyan + '📖 Documentación: README.md' + colors.reset);
    console.log(colors.cyan + '🆘 Soporte: xpepanels@gmail.com' + colors.reset);
    console.log('');
    
    // Preguntar si iniciar configuración
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('¿Quieres configurar el bot ahora? (y/n): ', async (answer) => {
        rl.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            console.log(colors.blue + '🔧 Iniciando configurador...' + colors.reset);
            console.log('');
            
            const { spawn } = require('child_process');
            const setup = spawn('node', ['setup.js'], {
                stdio: 'inherit',
                shell: true
            });
            
            setup.on('close', (code) => {
                if (code === 0) {
                    console.log(colors.green + '🎉 ¡Configuración completada!' + colors.reset);
                    console.log(colors.cyan + '🚀 Inicia el bot con: ./start.sh' + colors.reset);
                }
                process.exit(code);
            });
        } else {
            console.log(colors.yellow + '👋 ¡Instalación terminada!' + colors.reset);
            process.exit(0);
        }
    });
}

// Ejecutar instalador
if (require.main === module) {
    main().catch(error => {
        console.error(colors.red + '❌ Error en la instalación:', error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { main };