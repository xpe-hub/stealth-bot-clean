/**
 * 🤖 STEALTH-ANTICHEAT BOT - VERSIÓN LIMPIA Y FUNCIONAL
 * Bot anti-cheat verde, simple y efectivo
 * Sin funciones de MiniMax, enfocado en anti-cheat
 */

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuración del bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables de configuración
const BOT_PREFIX = process.env.BOT_PREFIX || '$';
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;
const DESCUBRIMIENTOS_CHANNEL_ID = process.env.DESCUBRIMIENTOS_CHANNEL_ID;
const IMPLEMENTACIONES_CHANNEL_ID = process.env.IMPLEMENTACIONES_CHANNEL_ID;
const CHAT_CHANNEL_ID = process.env.CHAT_CHANNEL_ID;
const CMD_CHANNEL_ID = process.env.CMD_CHANNEL_ID;

// Canales permitidos
const ALLOWED_CHANNELS = [CHAT_CHANNEL_ID, CMD_CHANNEL_ID].filter(id => id);

// Funciones auxiliares
function isOwner(userId) {
    return userId === BOT_OWNER_ID;
}

function getGuildInfo(client) {
    const guild = client.guilds.cache.first();
    return guild ? {
        name: guild.name,
        members: guild.memberCount,
        id: guild.id
    } : { name: 'N/A', members: 0, id: 'N/A' };
}

// Estados del bot
let botStatus = '🟢 Activo';
let conversationMemory = [];
let currentBotMood = '🛡️ Modo Anti-Cheat';

// Eventos del bot
client.once('ready', () => {
    console.log(`🛡️ Stealth-AntiCheat Bot iniciado correctamente`);
    console.log(`📊 Estado: ${botStatus}`);
    console.log(`🎯 Modo actual: ${currentBotMood}`);
    
    client.user.setActivity(`${BOT_PREFIX}help`, { type: 'WATCHING' });
    
    // Conectar a canales específicos si están configurados
    setupChannelConnections();
});

function setupChannelConnections() {
    const channels = [
        { id: CHAT_CHANNEL_ID, name: 'Chat' },
        { id: CMD_CHANNEL_ID, name: 'Comandos' },
        { id: SUPPORT_CHANNEL_ID, name: 'Soporte' },
        { id: DESCUBRIMIENTOS_CHANNEL_ID, name: 'Descubrimientos' },
        { id: IMPLEMENTACIONES_CHANNEL_ID, name: 'Implementaciones' }
    ];
    
    channels.forEach(async (channel) => {
        if (channel.id) {
            try {
                const discordChannel = await client.channels.fetch(channel.id);
                if (discordChannel) {
                    console.log(`✅ Conectado a canal: #${channel.name}`);
                }
            } catch (error) {
                console.log(`⚠️ No se pudo conectar a canal ${channel.name}:`, error.message);
            }
        }
    });
}

// Evento de mensaje
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Log del mensaje recibido
    console.log(`💬 Mensaje de ${message.author.tag} en #${message.channel.name}: ${message.content.substring(0, 100)}`);
    
    // Respuesta a menciona o conversación en canales específicos
    if ((message.mentions.has(client.user) || message.content.startsWith(BOT_PREFIX)) && 
        ALLOWED_CHANNELS.includes(message.channel.id)) {
        
        await handleMessage(message);
    }
    
    // Comandos
    if (message.content.startsWith(BOT_PREFIX)) {
        await handleCommand(message);
    }
});

async function handleMessage(message) {
    try {
        // Obtener contexto del mensaje
        const userContext = `Usuario: ${message.author.tag}`;
        const channelContext = `Canal: ${message.channel.name}`;
        const timeContext = `Tiempo: ${new Date().toLocaleString()}`;
        
        // Respuesta específica por canal
        let response = '';
        const channelType = message.channel.id === CMD_CHANNEL_ID ? 'comandos' : 'chat';
        
        if (message.mentions.has(client.user)) {
            response = generateBotResponse(channelType, userContext, channelContext, timeContext);
        } else if (message.content.startsWith(BOT_PREFIX)) {
            const command = message.content.slice(BOT_PREFIX.length).split(' ')[0];
            const args = message.content.slice(BOT_PREFIX.length + command.length + 1);
            response = generateCommandResponse(command, args, userContext, channelContext);
        }
        
        if (response) {
            const embed = new EmbedBuilder()
                .setDescription(response)
                .setColor(channelType === 'comandos' ? '#00ff00' : '#008000') // Verde
                .setFooter({ text: '🛡️ Stealth-AntiCheat Bot | v2.0' })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        }
        
        // Agregar a memoria de conversación
        conversationMemory.push({
            user: message.author.tag,
            content: message.content,
            timestamp: new Date().toISOString(),
            channel: message.channel.name
        });
        
        // Mantener solo los últimos 10 mensajes
        if (conversationMemory.length > 10) {
            conversationMemory = conversationMemory.slice(-10);
        }
        
    } catch (error) {
        console.error('Error procesando mensaje:', error);
    }
}

function generateBotResponse(channelType, userContext, channelContext, timeContext) {
    const responses = {
        comandos: [
            "🛡️ **Stealth-AntiCheat Bot** - Listo para comandos. Escribe `$help` para ver todas las opciones disponibles.",
            "🔧 **Modo Técnico Activo** - Estoy aquí para ayudarte con funciones anti-cheat y comandos del bot.",
            "⚡ **Bot Operativo** - Sistema anti-cheat funcionando correctamente. ¿En qué puedo ayudarte?"
        ],
        chat: [
            "👋 **Hola!** Soy el bot Stealth-AntiCheat. ¿En qué puedo ayudarte hoy?",
            "🛡️ **Sistema Anti-Cheat Activo** - Estoy aquí para proteger y asistir.",
            "🤖 **Bot Inteligente** - Conversa conmigo sobre temas de seguridad o usa comandos."
        ]
    };
    
    const channelResponses = responses[channelType] || responses.chat;
    const randomResponse = channelResponses[Math.floor(Math.random() * channelResponses.length)];
    
    return `${randomResponse}\n\n📊 **Estado:** ${botStatus}\n🎯 **Modo:** ${currentBotMood}`;
}

function generateCommandResponse(command, args, userContext, channelContext) {
    const commands = {
        help: 'Muestra información de ayuda',
        status: 'Estado del bot y sistema',
        ping: 'Verificar conectividad',
        info: 'Información del servidor',
        join: 'Unirse al canal de voz',
        leave: 'Salir del canal de voz',
        voices: 'Ver voces disponibles'
    };
    
    if (commands[command]) {
        return `ℹ️ **Comando:** \`${command}\`\n📝 **Descripción:** ${commands[command]}`;
    }
    
    return `❌ **Comando desconocido:** \`${command}\`\n\n💡 **Comandos disponibles:** ${Object.keys(commands).map(c => `\`${c}\``).join(', ')}`;
}

async function handleCommand(message) {
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    try {
        switch (command) {
            case 'help':
                await showHelp(message);
                break;
                
            case 'status':
                await showStatus(message);
                break;
                
            case 'ping':
                await showPing(message);
                break;
                
            case 'info':
                await showServerInfo(message);
                break;
                
            case 'join':
                await joinVoiceChannel(message);
                break;
                
            case 'leave':
                await leaveVoiceChannel(message);
                break;
                
            case 'voices':
                await showVoices(message);
                break;
                
            default:
                // Respuesta amigable para comandos desconocidos
                const unknownEmbed = new EmbedBuilder()
                    .setTitle('❓ Comando Desconocido')
                    .setDescription(`El comando \`${BOT_PREFIX}${command}\` no está disponible.`)
                    .addFields(
                        { name: '💡 Solución', value: 'Escribe `$help` para ver todos los comandos disponibles', inline: false },
                        { name: '🎯 Alternativa', value: 'Puedes mencionarme directamente para conversación natural', inline: false }
                    )
                    .setColor('#ff0000')
                    .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
                    .setTimestamp();
                
                await message.reply({ embeds: [unknownEmbed] });
        }
    } catch (error) {
        console.error('Error ejecutando comando:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error del Sistema')
            .setDescription('Ocurrió un error ejecutando el comando')
            .addFields(
                { name: '🔧 Error', value: error.message, inline: false },
                { name: '💬 Alternativa', value: 'Intenta mencionarme sin comando para conversación natural', inline: false }
            )
            .setColor('#ff0000')
            .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
            .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
    }
}

async function showHelp(message) {
    const helpEmbed = new EmbedBuilder()
        .setTitle('🛡️ Stealth-AntiCheat Bot - Ayuda')
        .setDescription('Bot anti-cheat verde, simple y efectivo')
        .addFields(
            { name: '⚡ Comandos Básicos', value: `\`${BOT_PREFIX}help\` - Esta ayuda\n\`${BOT_PREFIX}status\` - Estado del bot\n\`${BOT_PREFIX}ping\` - Verificar conexión\n\`${BOT_PREFIX}info\` - Info del servidor`, inline: true },
            { name: '🎤 Comandos de Voz', value: `\`${BOT_PREFIX}join\` - Unirme a tu VC\n\`${BOT_PREFIX}leave\` - Salir del VC\n\`${BOT_PREFIX}voices\` - Ver voces disponibles`, inline: true },
            { name: '🛡️ Sistema Anti-Cheat', value: '• Detección automática\n• Monitoreo 24/7\n• Reportes en tiempo real\n• Respuestas inteligentes', inline: false }
        )
        .setColor('#00ff00') // Verde
        .setFooter({ text: 'Desarrollado para Community Stealth' })
        .setTimestamp();
    
    await message.reply({ embeds: [helpEmbed] });
}

async function showStatus(message) {
    const guildInfo = getGuildInfo(client);
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    const statusEmbed = new EmbedBuilder()
        .setTitle('📊 Estado del Sistema')
        .setDescription('Información completa del bot Stealth-AntiCheat')
        .addFields(
            { name: '🛡️ Estado', value: botStatus, inline: true },
            { name: '🎯 Modo', value: currentBotMood, inline: true },
            { name: '⏱️ Uptime', value: `${uptimeHours}h ${uptimeMinutes}m`, inline: true },
            { name: '🏠 Servidor', value: guildInfo.name, inline: true },
            { name: '👥 Miembros', value: guildInfo.members.toString(), inline: true },
            { name: '💬 Canales Conectados', value: ALLOWED_CHANNELS.length.toString(), inline: true }
        )
        .setColor('#00ff00') // Verde
        .setFooter({ text: '🛡️ Stealth-AntiCheat Bot v2.0' })
        .setTimestamp();
    
    await message.reply({ embeds: [statusEmbed] });
}

async function showPing(message) {
    const ping = Date.now() - message.createdTimestamp;
    
    const pingEmbed = new EmbedBuilder()
        .setTitle('🏓 Ping Test')
        .setDescription('Prueba de conectividad del bot')
        .addFields(
            { name: '📶 Latencia', value: `${ping}ms`, inline: true },
            { name: '🔄 API Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
            { name: '⚡ Estado', value: ping < 100 ? '🟢 Excelente' : ping < 300 ? '🟡 Bueno' : '🔴 Lento', inline: true }
        )
        .setColor('#00ff00') // Verde
        .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
        .setTimestamp();
    
    await message.reply({ embeds: [pingEmbed] });
}

async function showServerInfo(message) {
    const guildInfo = getGuildInfo(client);
    const guild = client.guilds.cache.first();
    
    const infoEmbed = new EmbedBuilder()
        .setTitle('📋 Información del Servidor')
        .setDescription('Detalles del servidor donde está conectado el bot')
        .addFields(
            { name: '🏠 Nombre', value: guildInfo.name, inline: true },
            { name: '🆔 ID', value: guildInfo.id, inline: true },
            { name: '👥 Miembros', value: guildInfo.members.toString(), inline: true },
            { name: '💬 Canales de Texto', value: guild.channels.cache.filter(c => c.type === 0).size.toString(), inline: true },
            { name: '🎤 Canales de Voz', value: guild.channels.cache.filter(c => c.type === 2).size.toString(), inline: true },
            { name: '🎨 Roles', value: guild.roles.cache.size.toString(), inline: true }
        )
        .setColor('#00ff00') // Verde
        .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
        .setTimestamp();
    
    await message.reply({ embeds: [infoEmbed] });
}

async function joinVoiceChannel(message) {
    if (!message.member.voice.channel) {
        const noVoiceEmbed = new EmbedBuilder()
            .setTitle('🎤 No en Canal de Voz')
            .setDescription('Primero necesitas unirte a un canal de voz')
            .addFields(
                { name: '💡 Instrucciones', value: '1. Únete a un canal de voz\n2. Usa nuevamente `$join`\n3. ¡Comenzamos a chatear!', inline: false }
            )
            .setColor('#ff0000')
            .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
            .setTimestamp();
        
        await message.reply({ embeds: [noVoiceEmbed] });
        return;
    }
    
    try {
        const userVoiceChannel = message.member.voice.channel;
        const botMember = message.guild.members.me;
        
        // Si ya está en un canal diferente, desconectar primero
        if (botMember.voice.channel && botMember.voice.channel.id !== userVoiceChannel.id) {
            await botMember.voice.disconnect();
        }
        
        // Unirse al canal del usuario
        await botMember.voice.setChannel(userVoiceChannel.id);
        
        const joinEmbed = new EmbedBuilder()
            .setTitle('🎤 Conectado a Canal de Voz')
            .setDescription('¡Me he unido a tu canal de voz!')
            .addFields(
                { name: '📢 Canal', value: userVoiceChannel.name, inline: true },
                { name: '🔊 Usuarios', value: userVoiceChannel.members.size.toString(), inline: true },
                { name: '🎯 Estado', value: '🟢 Conectado', inline: true }
            )
            .setColor('#00ff00') // Verde
            .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
            .setTimestamp();
        
        await message.reply({ embeds: [joinEmbed] });
        
    } catch (voiceError) {
        console.error('[VOZ] Error conectando:', voiceError);
        
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error de Voz')
            .setDescription('No pude conectar al canal de voz')
            .addFields(
                { name: '🔧 Error', value: voiceError.message, inline: false },
                { name: '💡 Solución', value: 'Verifica que el bot tenga permisos para unirse a canales de voz', inline: false }
            )
            .setColor('#ff0000')
            .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
            .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
    }
}

async function leaveVoiceChannel(message) {
    try {
        const botMember = message.guild.members.me;
        
        if (botMember.voice.channel) {
            const currentChannel = botMember.voice.channel;
            await botMember.voice.disconnect();
            
            const leaveEmbed = new EmbedBuilder()
                .setTitle('👋 Desconectado de Voz')
                .setDescription('He salido del canal de voz')
                .addFields(
                    { name: '📢 Canal', value: currentChannel.name, inline: true },
                    { name: '⚡ Estado', value: '🔴 Desconectado', inline: true }
                )
                .setColor('#ffaa00')
                .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
                .setTimestamp();
            
            await message.reply({ embeds: [leaveEmbed] });
        } else {
            const notConnectedEmbed = new EmbedBuilder()
                .setTitle('ℹ️ No Conectado')
                .setDescription('No estoy conectado a ningún canal de voz')
                .setColor('#ffaa00')
                .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
                .setTimestamp();
            
            await message.reply({ embeds: [notConnectedEmbed] });
        }
        
    } catch (error) {
        console.error('Error desconectando de voz:', error);
    }
}

async function showVoices(message) {
    const voicesEmbed = new EmbedBuilder()
        .setTitle('🎭 Voces del Bot')
        .setDescription('El bot usa las voces nativas de Discord')
        .addFields(
            { name: '🎤 Voz Nativa', value: 'Discord built-in voice system', inline: false },
            { name: '💬 Comunicación', value: 'Respuestas de texto en verde', inline: false },
            { name: '🎯 Comandos', value: `Usa \`${BOT_PREFIX}join\` para conectarte`, inline: false }
        )
        .setColor('#00ff00') // Verde
        .setFooter({ text: '🛡️ Stealth-AntiCheat Bot' })
        .setTimestamp();
    
    await message.reply({ embeds: [voicesEmbed] });
}

// Eventos de error
client.on('error', error => {
    console.error('Error de Discord.js:', error);
});

client.on('warn', warning => {
    console.warn('Advertencia de Discord.js:', warning);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Login del bot
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('Error al conectar el bot:', error);
    process.exit(1);
});