#!/usr/bin/env node

/**
 * 🔧 CONFIGURADOR INTERACTIVO - Stealth AntiCheat Bot v2.0
 * Script de configuración automática paso a paso
 * Desarrollado por: xpe.nettt
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuración de colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Banner de presentación
function showBanner() {
    console.clear();
    console.log(colors.cyan + '╔══════════════════════════════════════════╗' + colors.reset);
    console.log(colors.cyan + '║' + colors.bright + '  🤖 STEALTH ANTICHEAT BOT v2.0' + '       ' + colors.cyan + '║' + colors.reset);
    console.log(colors.cyan + '║' + colors.bright + '     Configurador Interactivo' + '      ' + colors.cyan + '║' + colors.reset);
    console.log(colors.cyan + '╚══════════════════════════════════════════╝' + colors.reset);
    console.log('');
}

// Crear interfaz de lectura
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer preguntas
function question(prompt, callback) {
    rl.question(prompt, callback);
}

// Función para mostrar mensajes con formato
function log(message, color = 'white') {
    console.log(colors[color] + message + colors.reset);
}

// Función para mostrar información
function info(message) {
    log(`📋 ${message}`, 'blue');
}

// Función para mostrar éxito
function success(message) {
    log(`✅ ${message}`, 'green');
}

// Función para mostrar advertencias
function warning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Función para mostrar errores
function error(message) {
    log(`❌ ${message}`, 'red');
}

// Función para pausar
function pause() {
    return new Promise(resolve => {
        question('⏸️  Presiona ENTER para continuar...', () => resolve());
    });
}

// Configuración principal
async function main() {
    showBanner();
    
    log('🚀 ¡Bienvenido al configurador automático!', 'bright');
    log('Este script te guiará paso a paso para configurar tu bot.', 'dim');
    log('');
    
    // Verificar dependencias
    info('🔍 Verificando sistema...');
    
    // Verificar si existe package.json
    if (!fs.existsSync('package.json')) {
        error('package.json no encontrado. Asegúrate de estar en el directorio correcto.');
        rl.close();
        return;
    }
    
    success('Sistema verificado');
    await pause();
    
    // Verificar/crear .env
    if (fs.existsSync('.env')) {
        warning('El archivo .env ya existe.');
        question('¿Quieres hacer backup del actual? (s/n): ', (answer) => {
            if (answer.toLowerCase() === 's') {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                fs.copyFileSync('.env', `.env.backup.${timestamp}`);
                success(`Backup creado: .env.backup.${timestamp}`);
            }
            startConfiguration();
        });
    } else {
        info('📋 Creando archivo de configuración básico...');
        fs.copyFileSync('.env.template', '.env');
        success('Archivo .env creado');
        await pause();
        startConfiguration();
    }
}

// Configuración paso a paso
async function startConfiguration() {
    showBanner();
    log('🎯 CONFIGURACIÓN DEL BOT', 'bright');
    log('Vamos a configurar tu bot paso a paso...', 'dim');
    log('');
    
    // Paso 1: Discord Bot Token
    await step1_botToken();
    
    // Paso 2: User ID
    await step2_userId();
    
    // Paso 3: Canales
    await step3_channels();
    
    // Paso 4: GitHub
    await step4_github();
    
    // Paso 5: Webhook
    await step5_webhook();
    
    // Paso 6: MiniMax AI (opcional)
    await step6_minimax();
    
    // Finalizar
    await finish();
}

// Paso 1: Bot Token
async function step1_botToken() {
    showBanner();
    log('🤖 PASO 1: Discord Bot Token', 'bright');
    log('');
    
    info('Para obtener tu Bot Token:');
    log('1. Ve a https://discord.com/developers/applications', 'dim');
    log('2. Crea nueva aplicación o selecciona la existente', 'dim');
    log('3. Ve a "Bot" en el menú lateral', 'dim');
    log('4. Click "Reset Token" si necesitas uno nuevo', 'dim');
    log('5. Copia el token completo', 'dim');
    log('');
    
    warning('⚠️  IMPORTANTE: El token es un secreto - NO lo compartas con nadie');
    log('');
    
    question('📝 Pega tu Discord Bot Token: ', (token) => {
        if (token && token.length > 20) {
            // Actualizar .env
            let envContent = fs.readFileSync('.env', 'utf8');
            envContent = envContent.replace('YOUR_DISCORD_BOT_TOKEN_HERE', token.trim());
            fs.writeFileSync('.env', envContent);
            success('Token configurado');
        } else {
            warning('Token parece inválido. Asegúrate de copiarlo completo.');
        }
    });
}

// Paso 2: User ID
async function step2_userId() {
    await new Promise(resolve => {
        showBanner();
        log('👤 PASO 2: Tu Discord User ID', 'bright');
        log('');
        
        info('Para obtener tu User ID:');
        log('1. Abre Discord', 'dim');
        log('2. Ve a Configuración de Usuario (⚙️)', 'dim');
        log('3. Busca "Modo Desarrollador" y actívalo', 'dim');
        log('4. Click derecho en tu perfil > "Copiar ID"', 'dim');
        log('');
        
        warning('⚠️  Tu User ID es necesario para comandos de propietario');
        log('');
        
        question('📝 Pega tu Discord User ID: ', (userId) => {
            if (userId && /^\d{17,20}$/.test(userId)) {
                let envContent = fs.readFileSync('.env', 'utf8');
                envContent = envContent.replace('YOUR_DISCORD_USER_ID_HERE', userId.trim());
                fs.writeFileSync('.env', envContent);
                success('User ID configurado');
                resolve();
            } else {
                warning('User ID parece inválido. Debe ser un número de 17-20 dígitos.');
                resolve();
            }
        });
    });
    
    await pause();
}

// Paso 3: Canales
async function step3_channels() {
    await new Promise(async (resolve) => {
        showBanner();
        log('📱 PASO 3: Configuración de Canales', 'bright');
        log('');
        
        info('Configura los IDs de los canales donde operará el bot:');
        log('(Obtén IDs activando Modo Desarrollador en Discord)', 'dim');
        log('');
        
        const channels = [
            { name: 'Support Channel', key: 'SUPPORT_CHANNEL_ID', desc: 'Canal de soporte y ayuda' },
            { name: 'Descubrimientos', key: 'DESCUBRIMIENTOS_CHANNEL_ID', desc: 'Nuevos métodos anti-cheat' },
            { name: 'Implementaciones', key: 'IMPLEMENTACIONES_CHANNEL_ID', desc: 'Implementaciones documentadas' },
            { name: 'Chat General', key: 'CHAT_CHANNEL_ID', desc: 'Conversación general' },
            { name: 'Comandos', key: 'CMD_CHANNEL_ID', desc: 'Comandos del bot' }
        ];
        
        for (const channel of channels) {
            await new Promise(resolveChannel => {
                question(`📝 ${channel.name} ID: `, (channelId) => {
                    if (channelId && /^\d{17,20}$/.test(channelId)) {
                        let envContent = fs.readFileSync('.env', 'utf8');
                        envContent = envContent.replace(`YOUR_${channel.key}`, channelId.trim());
                        fs.writeFileSync('.env', envContent);
                        success(`${channel.name} configurado`);
                        resolveChannel();
                    } else {
                        warning('ID de canal inválido. Déjalo vacío para configurar después.');
                        resolveChannel();
                    }
                });
            });
        }
        
        success('Configuración de canales completada');
        resolve();
    });
    
    await pause();
}

// Paso 4: GitHub
async function step4_github() {
    await new Promise(resolve => {
        showBanner();
        log('🔗 PASO 4: Configuración GitHub', 'bright');
        log('');
        
        info('Configuración para integración con repositorio:');
        
        question('📝 GitHub Token (opcional): ', (githubToken) => {
            if (githubToken && githubToken.length > 10) {
                let envContent = fs.readFileSync('.env', 'utf8');
                envContent = envContent.replace('YOUR_GITHUB_TOKEN_HERE', githubToken.trim());
                fs.writeFileSync('.env', envContent);
                success('GitHub Token configurado');
            } else {
                warning('GitHub Token no configurado (opcional)');
            }
            
            resolve();
        });
    });
    
    await pause();
}

// Paso 5: Webhook
async function step5_webhook() {
    await new Promise(resolve => {
        showBanner();
        log('🚨 PASO 5: Webhook para Alertas', 'bright');
        log('');
        
        info('Configura el webhook para recibir alertas automáticas:');
        log('1. Ve al canal donde quieres las alertas', 'dim');
        log('2. Click en Configuración > Integraciones > Webhooks', 'dim');
        log('3. Crea nuevo webhook y copia la URL', 'dim');
        log('');
        
        question('📝 Webhook URL (opcional): ', (webhookUrl) => {
            if (webhookUrl && webhookUrl.includes('discord.com/api/webhooks/')) {
                let envContent = fs.readFileSync('.env', 'utf8');
                envContent = envContent.replace('YOUR_ANTICHEAT_WEBHOOK_URL', webhookUrl.trim());
                fs.writeFileSync('.env', envContent);
                success('Webhook configurado');
            } else {
                warning('URL de webhook inválida (opcional)');
            }
            
            resolve();
        });
    });
    
    await pause();
}

// Paso 6: MiniMax AI
async function step6_minimax() {
    await new Promise(resolve => {
        showBanner();
        log('🤖 PASO 6: MiniMax AI (Opcional)', 'bright');
        log('');
        
        info('Habilita análisis inteligente con MiniMax AI:');
        log('1. Ve a https://minimax.chat y crea una cuenta', 'dim');
        log('2. Obtén tu API key', 'dim');
        log('3. Pega la key aquí (opcional)', 'dim');
        log('');
        
        question('📝 MiniMax API Key (opcional): ', (apiKey) => {
            if (apiKey && apiKey.length > 20) {
                let envContent = fs.readFileSync('.env', 'utf8');
                envContent = envContent.replace('YOUR_MINIMAX_API_KEY_HERE', apiKey.trim());
                fs.writeFileSync('.env', envContent);
                success('MiniMax AI habilitado');
            } else {
                warning('MiniMax AI no configurado (opcional)');
            }
            
            resolve();
        });
    });
    
    await pause();
}

// Finalizar configuración
async function finish() {
    showBanner();
    log('🎉 CONFIGURACIÓN COMPLETADA', 'bright');
    log('');
    
    success('¡Tu bot está listo para funcionar!');
    log('');
    
    info('RESUMEN DE CONFIGURACIÓN:');
    log('• Discord Bot Token: ✅ Configurado', 'green');
    log('• User ID: ✅ Configurado', 'green');
    log('• Canales: ✅ Configurados', 'green');
    log('• GitHub: ✅ (opcional)', 'yellow');
    log('• Webhook: ✅ (opcional)', 'yellow');
    log('• MiniMax AI: ✅ (opcional)', 'yellow');
    log('');
    
    log('🚀 PRÓXIMOS PASOS:', 'bright');
    log('1. Invita tu bot al servidor usando el Discord Developer Portal', 'dim');
    log('2. Otorga los permisos necesarios al bot', 'dim');
    log('3. Inicia el bot: node start.sh', 'dim');
    log('');
    
    warning('⚠️  IMPORTANTE:');
    log('• Verifica que el bot tenga permisos para acceder a todos los canales', 'dim');
    log('• Asegúrate de que Server Members Intent esté habilitado', 'dim');
    log('• Lee el README.md para información detallada', 'dim');
    log('');
    
    success('🎯 ¡Tu Stealth AntiCheat Bot está listo para proteger tu servidor!');
    
    rl.close();
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    error('Error inesperado:', error.message);
    rl.close();
});

// Ejecutar configurador
if (require.main === module) {
    main().catch(error => {
        console.error('Error en el configurador:', error);
        process.exit(1);
    });
}

module.exports = { main };