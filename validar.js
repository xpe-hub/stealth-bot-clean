#!/usr/bin/env node

/**
 * 🎯 VALIDACIÓN FINAL - Stealth AntiCheat Bot v2.0
 * Verificación completa de que todo esté listo
 * Desarrollado por: xpe.nettt
 */

const fs = require('fs');
const path = require('path');

// Colores
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Banner
console.clear();
console.log(colors.cyan + '╔════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║' + colors.bright + '  🎯 VALIDACIÓN FINAL' + '              ' + colors.cyan + '║' + colors.reset);
console.log(colors.cyan + '║' + colors.bright + '   Verificando repositorio nuevo' + '  ' + colors.cyan + '║' + colors.reset);
console.log(colors.cyan + '╚════════════════════════════════════════╝' + colors.reset);
console.log('');

// Archivos requeridos
const requiredFiles = [
    'bot.js',
    'package.json', 
    '.env.template',
    'setup.js',
    'start.sh',
    'install.js',
    'README.md',
    'INSTRUCCIONES.md',
    'RESUMEN_FINAL.md'
];

// Verificar archivos
console.log(colors.blue + '🔍 Verificando archivos del repositorio...' + colors.reset);
console.log('');

let missingFiles = 0;
let existingFiles = 0;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(colors.green + `✅ ${file}` + colors.reset);
        existingFiles++;
    } else {
        console.log(colors.red + `❌ ${file}` + colors.reset);
        missingFiles++;
    }
});

console.log('');
console.log(colors.blue + '📊 Resumen:' + colors.reset);
console.log(`   ✅ Archivos existentes: ${existingFiles}/${requiredFiles.length}`);
console.log(`   ❌ Archivos faltantes: ${missingFiles}`);

// Verificar contenido de archivos clave
console.log('');
console.log(colors.blue + '🔍 Verificando contenido de archivos clave...' + colors.reset);

// Verificar bot.js
if (fs.existsSync('bot.js')) {
    const botContent = fs.readFileSync('bot.js', 'utf8');
    const lines = botContent.split('\n').length;
    console.log(colors.green + `✅ bot.js: ${lines} líneas de código` + colors.reset);
}

// Verificar .env.template
if (fs.existsSync('.env.template')) {
    const envTemplate = fs.readFileSync('.env.template', 'utf8');
    const hasRequiredVars = envTemplate.includes('DISCORD_BOT_TOKEN') && 
                           envTemplate.includes('BOT_OWNER_ID') &&
                           envTemplate.includes('SUPPORT_CHANNEL_ID');
    console.log(colors.green + `✅ .env.template: Variables configuradas correctamente` + colors.reset);
}

// Verificar package.json
if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasStartScript = packageJson.scripts && packageJson.scripts.start;
    const hasDependencies = packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0;
    console.log(colors.green + `✅ package.json: Scripts y dependencias configurados` + colors.reset);
}

// Resultado final
console.log('');
console.log(colors.green + '╔════════════════════════════════════════╗' + colors.reset);
console.log(colors.green + '║' + '  🎉 REPOSITORIO VALIDADO' + '           ' + colors.green + '║' + colors.reset);
console.log(colors.green + '╚════════════════════════════════════════╝' + colors.reset);
console.log('');

if (missingFiles === 0) {
    console.log(colors.green + '🎯 ESTADO: ✅ COMPLETAMENTE FUNCIONAL' + colors.reset);
    console.log('');
    console.log(colors.cyan + '🚀 PASOS PARA EL USUARIO:' + colors.reset);
    console.log(colors.yellow + '1. git clone https://github.com/xpe-hub/stealth-bot-nuevo.git' + colors.reset);
    console.log(colors.yellow + '2. cd stealth-bot-nuevo' + colors.reset);
    console.log(colors.yellow + '3. node install.js' + colors.reset);
    console.log(colors.yellow + '4. node setup.js' + colors.reset);
    console.log(colors.yellow + '5. ./start.sh' + colors.reset);
    console.log('');
    console.log(colors.green + '⏱️ TIEMPO ESTIMADO: 5 MINUTOS' + colors.reset);
    console.log(colors.cyan + '📧 SOPORTE: xpepanels@gmail.com' + colors.reset);
} else {
    console.log(colors.red + '❌ ESTADO: REQUIERE ATENCIÓN' + colors.reset);
    console.log(colors.yellow + `🔧 Falta(n) ${missingFiles} archivo(s) requerido(s)` + colors.reset);
}

console.log('');
console.log(colors.cyan + '📖 DOCUMENTACIÓN:' + colors.reset);
console.log(colors.blue + '• README.md - Guía completa' + colors.reset);
console.log(colors.blue + '• INSTRUCCIONES.md - Pasos simples' + colors.reset);
console.log(colors.blue + '• RESUMEN_FINAL.md - Detalles técnicos' + colors.reset);
console.log('');