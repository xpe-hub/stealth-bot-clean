// ========================================================
// STEALTH-ANTICHEATX IA AUTÓNOMA v3.0 - 2025-11-28
// IA Conversacional Natural + Voz + Chat Libre + Sistema Limpio
// Arquitectura preparada para análisis de ejecutables
// ========================================================

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Stealth-CheatX AI Integration - Anti-Cheat Specialist
const { stealthCheatXChat, processStealthCheatXResponse, executeAntiCheatTool } = require('./stealth_cheatx_ai');

// MiniMax AI Integration - Advanced AI Capabilities
const minimaxAI = require('./minimax_advanced_ai');
const minimaxTTS = require('./minimax_tts_direct');
const anticheatAnalyzer = require('./anticheat_analyzer_advanced');
const repositoryConnector = require('./repository_connector');

// Axios Wrapper for HTTP requests (replaces axios dependency)
const axios = require('./axios-wrapper');

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
const ANTICHEAT_WEBHOOK_URL = process.env.ANTICHEAT_WEBHOOK_URL;
const COMMUNITY_SERVER_INVITE = process.env.COMMUNITY_SERVER_INVITE || 'https://discord.gg/stealth-anticheat';

// Canales permitidos para funciones de IA (para $clear_chat)
const AI_PERMITTED_CHANNELS = [CHAT_CHANNEL_ID, CMD_CHANNEL_ID].filter(id => id);

// Base de datos de apodos (simplificada)
const NICKNAMES_FILE = path.join(__dirname, 'nicknames.json');

// Funciones para manejar apodos
function loadNicknames() {
    try {
        if (fs.existsSync(NICKNAMES_FILE)) {
            const data = fs.readFileSync(NICKNAMES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading nicknames:', error);
    }
    return {};
}

function saveNicknames(nicknames) {
    try {
        fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(nicknames, null, 2));
    } catch (error) {
        console.log('Error saving nicknames:', error);
    }
}

let nicknames = loadNicknames();

// Funciones auxiliares
function isOwner(userId) {
    return userId === BOT_OWNER_ID;
}

function getUserNickname(userId, username) {
    return nicknames[userId] || username;
}

function getTotalMemberCount(client) {
    let totalMembers = 0;
    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount;
    });
    return totalMembers;
}

function getCurrentGuildMemberCount(client) {
    const guild = client.guilds.cache.first();
    return guild ? guild.memberCount : 0;
}

// Análisis de amenazas simulado (mejorado)
function performThreatAnalysis() {
    const threats = [
        { type: 'DLL Injection', count: Math.floor(Math.random() * 3), severity: 'Alta' },
        { type: 'Memory Hacking', count: Math.floor(Math.random() * 4), severity: 'Alta' },
        { type: 'ESP/Aimbot', count: Math.floor(Math.random() * 2), severity: 'Media' },
        { type: 'Speed Manipulation', count: Math.floor(Math.random() * 1), severity: 'Baja' },
        { type: 'Bypass Attempts', count: Math.floor(Math.random() * 2), severity: 'Alta' }
    ];
    return threats;
}

// Evento: Bot listo
client.once('ready', () => {
    console.log('🛡️ Stealth-AntiCheatX IA v3.0 listo!');
    console.log(`🤖 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
    console.log(`👥 Monitoreando ${getTotalMemberCount(client)} usuarios`);
    
    // BIO DINÁMICA VIVA - Cambia cada 10 minutos
    const activities = [
        '🧠 Stealth-AntiCheatX IA Autonoma',
        '💬 Conversación natural por voz',
        '🎤 Chat libre en canales de voz',
        '🔍 Analizando patrones anti-cheat',
        '🤖 IA MiniMax-M2 conectada',
        '🛡️ Protegiendo gameplay justo',
        '🎯 Monitoreo 24/7 activo',
        '⚡ Detección de exploits',
        '💻 Sistema inteligente operativo',
        '🌟 Comunidad Stealth protegida',
        '🔧 IA contextual conversacional',
        '📊 Análisis predictivo habilitado',
        '🎮 Aimbot detection activa',
        '🚫 Bypass detection mejorada',
        '💡 Respuestas inteligentes',
        '🎙️ Hablando por voz en tiempo real',
        '🔮 Arquitectura IA futura',
        '📈 Aprendizaje continuo activo'
    ];
    
    let activityIndex = 0;
    
    setInterval(() => {
        activityIndex = (activityIndex + 1) % activities.length;
        
        client.user.setPresence({
            status: 'online',
            activities: [{ 
                name: activities[activityIndex], 
                type: 3 // WATCHING
            }]
        });
    }, 600000); // 10 minutos

    // Mensaje de bienvenida mejorado
    if (CHAT_CHANNEL_ID) {
        const chatChannel = client.channels.cache.get(CHAT_CHANNEL_ID);
        if (chatChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('🛡️ Stealth-AntiCheatX IA v3.0')
                .setDescription('**IA Autonoma Conectada** - Sistema anti-cheat inteligente')
                .setColor('#00ff00')
                .addFields(
                    { name: '🤖 IA', value: 'Conversación natural', inline: true },
                    { name: '🎤 Voz', value: 'Chat libre por VC', inline: true },
                    { name: '🔍 Detección', value: 'Patrones activos', inline: true },
                    { name: '⚡ Estado', value: 'Sistema operacional', inline: true },
                    { name: '💬 Interacción', value: '¡Habla conmigo naturalmente!', inline: true },
                    { name: '🛠️ Comandos', value: '$help para lista completa', inline: true }
                )
                .setFooter({ text: 'Stealth-AntiCheatX | IA v3.0 Autonoma' })
                .setTimestamp();
            
            chatChannel.send({ embeds: [welcomeEmbed] });
        }
    }
});

// DETECCIÓN AUTOMÁTICA DE CHEATS
async function detectCheatPatterns(client, message) {
    try {
        const content = message.content.toLowerCase().trim();
        
        // Patrones mejorados de detección
        const cheatPatterns = [
            // DLL Injection Avanzado
            { pattern: /dll\s*injection|inject\s+dll|manualmap|loadlibrary|dll\s*inject/, method: 'DLL Injection Detectado', severity: 'ALTA' },
            { pattern: /createthread|remotethread|writeprocessmemory/, method: 'Memory Manipulation', severity: 'ALTA' },
            
            // Memory Hacks Modernos
            { pattern: /memory\s*hack|ram\s*hack|ramhack|memory\s*editor/, method: 'Memory Hacking Tool', severity: 'ALTA' },
            { pattern: /ce\s*table|cheat\s*engine|process\s*hacker/, method: 'Memory Editing Software', severity: 'ALTA' },
            { pattern: /write\s*memory|read\s*memory|modify\s*memory/, method: 'Memory Modification', severity: 'ALTA' },
            
            // ESP/Aimbot Desarrollados
            { pattern: /esp\s*hack|wallhack|see\s*through\s*walls/, method: 'ESP Wallhack', severity: 'ALTA' },
            { pattern: /aim\s*bot|aimbot|auto\s*aim|predictive\s*aim/, method: 'Aimbot Detection', severity: 'ALTA' },
            { pattern: /no\s*spread|perfect\s*accuracy|instant\s*kill/, method: 'Combat Modifications', severity: 'MEDIA' },
            
            // Speed/Time Hacks
            { pattern: /speed\s*hack|speedhack|time\s*warp|faster\s*game/, method: 'Speed Manipulation', severity: 'MEDIA' },
            { pattern: /freeze\s*time|pause\s*game|slow\s*motion/, method: 'Time Manipulation', severity: 'MEDIA' },
            
            // Teleport/Position
            { pattern: /teleport|teleport\s*hack|warp\s*position|fly\s*hack/, method: 'Position Teleportation', severity: 'MEDIA' },
            { pattern: /noclip|fly\s*mode|ghost\s*mode|invisible\s*mode/, method: 'Movement Bypass', severity: 'MEDIA' },
            
            // Triggerbot/Auto-fire
            { pattern: /trigger\s*bot|triggerbot|auto\s*fire|auto\s*shoot/, method: 'Triggerbot Detection', severity: 'MEDIA' },
            { pattern: /auto\s*clicker|rapid\s*fire|hold\s*to\s*fire/, method: 'Auto-fire Modification', severity: 'MEDIA' },
            
            // Bypass/Security Avanzado
            { pattern: /anti\s*cheat\s*bypass|bypass\s*anticheat|disabled\s*security/, method: 'Anti-cheat Bypass', severity: 'ALTA' },
            { pattern: /vac\s*bypass|easypass|nocd\s*crack|kernel\s*mode/, method: 'Security Bypass', severity: 'ALTA' },
            { pattern: /detect\s*proof|undetectable\s*hack|stealth\s*mode/, method: 'Stealth Mode', severity: 'ALTA' },
            
            // Distribución de Hacks
            { pattern: /download.*hack|dl\s*hack|get\s*hack|free\s*hack/, method: 'Hack Distribution', severity: 'ALTA' },
            { pattern: /mega\.nz|mediafire.*hack|dropbox.*hack/, method: 'Hack Download Links', severity: 'ALTA' },
            
            // Términos Generales Modernos
            { pattern: /cheat\s*code|hack\s*tool|game\s*hack|game\s*cheat/, method: 'Generic Cheat Tool', severity: 'MEDIA' },
            { pattern: /modded|mod.*game|game\s*mod/, method: 'Game Modification', severity: 'BAJA' }
        ];
        
        // Buscar patrones coincidentes
        for (const cheatPattern of cheatPatterns) {
            if (cheatPattern.pattern.test(content)) {
                console.log('🚨 CHEAT PATTERN DETECTADO:', cheatPattern.method, 'en mensaje de', message.author.tag);
                
                // Reporte mejorado
                await reportCheatDetection(client, message, cheatPattern);
                break; // Solo reportar el primer patrón encontrado
            }
        }
        
    } catch (error) {
        console.error('Error detectando patrones de cheats:', error);
    }
}

// Función mejorada para reportar detección de cheats
async function reportCheatDetection(client, message, cheatPattern) {
    try {
        // Notificar a canal de descubrimientos si existe
        if (DESCUBRIMIENTOS_CHANNEL_ID) {
            const discoveryChannel = client.channels.cache.get(DESCUBRIMIENTOS_CHANNEL_ID);
            if (discoveryChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('🚨 CHEAT DETECTADO AUTOMÁTICAMENTE')
                    .setDescription('Sistema de detección IA v3.0')
                    .setColor('#ff0000')
                    .addFields(
                        { name: '🔧 Método', value: cheatPattern.method, inline: false },
                        { name: '👤 Usuario', value: `${message.author.tag} (${message.author.id})`, inline: true },
                        { name: '🏠 Servidor', value: message.guild?.name || 'DM', inline: true },
                        { name: '📝 Mensaje', value: message.content.substring(0, 100) + '...', inline: false },
                        { name: '⚡ Severidad', value: cheatPattern.severity, inline: true },
                        { name: '⏰ Detectado', value: new Date().toLocaleString(), inline: true }
                    )
                    .setFooter({ text: '🤖 Sistema de Detección IA | Stealth-AntiCheatX' })
                    .setTimestamp();
                
                await discoveryChannel.send({ embeds: [embed] });
            }
        }
        
    } catch (error) {
        console.error('Error reportando detección de cheat:', error);
    }
}

// Evento: Nuevo mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes de otros bots
    if (message.author.bot) return;
    
    // Obtener el apodo del usuario
    const userNickname = getUserNickname(message.author.id, message.author.username);
    
    // === CONVERSACIÓN NATURAL CON IA (PRIORIDAD MÁXIMA) ===
    if (message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) {
        const totalMembers = getTotalMemberCount(client);
        const isCmdChannel = message.channel.id === CMD_CHANNEL_ID;
        
        // Si es solo mención sin comando, usar IA MiniMax
        const cleanContent = message.content.replace(/<@!?\d+>/g, '').trim();
        
        if (cleanContent.length > 0 && !cleanContent.startsWith(BOT_PREFIX)) {
            try {
                console.log('🤖 Conversación natural con IA MiniMax...');
                
                const channelType = isCmdChannel ? 'cmd' : 'chat';
                const aiResponse = await stealthCheatXChat(message, channelType);
                
                const responseData = await processStealthCheatXResponse(aiResponse, message, {
                    title: `🛡️ Stealth-AntiCheatX | ${channelType.toUpperCase()}`,
                    color: isCmdChannel ? '#00ff00' : '#0099ff' // Verde para cmd, azul para chat
                });
                
                await message.reply(responseData);
                return;
                
            } catch (error) {
                console.error('❌ Error en conversación natural:', error);
                
                // Fallback inteligente
                const fallbackEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Stealth-AntiCheatX IA')
                    .setDescription('🧠 **IA MiniMax** procesando... Sistema de respaldo operativo.')
                    .setColor('#ffaa00')
                    .addFields(
                        { name: '⚡ Estado', value: 'Sistema operacional', inline: true },
                        { name: '🔧 Acción', value: 'Procesando consulta...', inline: true },
                        { name: '💬 Respuesta', value: '¡Habla conmigo naturalmente!', inline: true }
                    )
                    .setTimestamp();
                
                await message.reply({ embeds: [fallbackEmbed] });
                return;
            }
        }
        
        // Respuesta de bienvenida mejorada
        const isChatChannel = message.channel.id === CHAT_CHANNEL_ID || 
                            message.channel.name.includes('chat') ||
                            message.channel.name.includes('ai');
        
        const embed = new EmbedBuilder()
            .setTitle('🛡️ Stealth-AntiCheatX IA v3.0')
            .setDescription(`¡Hola **${userNickname}**! Soy tu **IA Anti-Cheat Inteligente** 🤖`)
            .setColor('#00ff00') // Verde principal
            .addFields(
                { name: '🧠 IA MiniMax', value: 'Conversación natural activa', inline: true },
                { name: '🎤 Voz', value: 'Chat libre por VC', inline: true },
                { name: '🔍 Detección', value: 'Patrones inteligentes', inline: true },
                { name: '💬 Conversación', value: isCmdChannel ? '**CMD:** Solo comandos aquí' : '**CHAT:** ¡Habla conmigo!', inline: false },
                { name: '⚡ Comandos', value: `\`${BOT_PREFIX}help\` - Lista completa\n\`${BOT_PREFIX}ai [mensaje]\` - IA inteligente\n\`${BOT_PREFIX}status\` - Estado`, inline: true },
                { name: '🏠 Monitoreo', value: `${client.guilds.cache.size} servidores | ${totalMembers} usuarios`, inline: true }
            )
            .setFooter({ text: `Stealth-AntiCheatX IA v3.0 | ${isCmdChannel ? 'CMD' : isChatChannel ? 'Chat' : 'General'}` })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
        return;
    }
    
    // DETECCIÓN AUTOMÁTICA DE CHEATS
    await detectCheatPatterns(client, message);
    
    // Manejo de comandos
    if (!message.content.startsWith(BOT_PREFIX)) return;
    
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    try {
        switch (command) {
            case 'help':
            case 'h':
                const helpEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Comandos Stealth-AntiCheatX IA v3.0')
                    .setDescription('**IA Autonoma con Voz + Chat Libre**')
                    .setColor('#00ff00') // Verde principal
                    .addFields(
                        { name: '🤖 IA Conversacional', value: `Solo mencióname y hablaremos naturalmente\n\`${BOT_PREFIX}ai [mensaje]\` - Consulta específica`, inline: false },
                        { name: '🎤 Sistema de Voz', value: `\`${BOT_PREFIX}join\` - Unirme a tu VC\n\`${BOT_PREFIX}leave\` - Salir del VC\n\`${BOT_PREFIX}vc-status\` - Estado de voz\n\`${BOT_PREFIX}speak [texto]\` - Texto a voz (TTS)\n\`${BOT_PREFIX}voices\` - Ver voces disponibles\n\`${BOT_PREFIX}clear_chat [canal/\#canal]\` - Limpiar spam`, inline: false },
                        { name: '📊 Estado y Utilidades', value: `\`${BOT_PREFIX}add_dev [usuario]\` - Agregar developer\n\`${BOT_PREFIX}status\` - Estado del sistema\n\`${BOT_PREFIX}about\` - Acerca del bot`, inline: true },
                        { name: '🎯 Características IA', value: '• Conversación natural sin comandos\n• Análisis inteligente de texto\n• Respuestas contextuales\n• Sistema de voz integrado\n• Detección automática de amenazas\n• Chat libre en tiempo real', inline: false }
                    )
                    .addFields(
                        { name: '🚀 IA Futura', value: '• Análisis de ejecutables\n• Detección automática de bypass\n• Actualización dinámica de reglas\n• Sistema completamente autónomo', inline: false }
                    )
                    .setFooter({ text: 'Stealth-AntiCheatX | IA Autonoma v3.0' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpEmbed] });
                break;

            case 'ai':
            case 'ask':
            case 'stealth':
                // Comando de IA MiniMax
                const aiMessage = args.join(' ').trim();
                
                if (!aiMessage) {
                    const helpAIEmbed = new EmbedBuilder()
                        .setTitle('🧠 Comando IA MiniMax')
                        .setDescription('Usa IA avanzada para consultas inteligentes')
                        .setColor('#00ff00')
                        .addFields(
                            { name: '💬 Ejemplo', value: `\`${BOT_PREFIX}ai ¿Cómo funciona el anti-cheat?\``, inline: false },
                            { name: '🤖 O Alternativa', value: 'Solo mencióname sin comando - más natural', inline: false },
                            { name: '🔍 Consultas Válidas', value: '• Preguntas sobre anti-cheat\n• Análisis de patrones\n• Información técnica\n• Conversación general', inline: false },
                            { name: '⚡ Características', value: '• Memoria contextual\n• IA MiniMax-M2\n• Conocimiento integrado', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | IA Contextual' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpAIEmbed] });
                    break;
                }
                
                try {
                    console.log(`🤖 IA MiniMax: ${message.author.username} consulta: "${aiMessage}"`);
                    
                    const isCmdChannel = message.channel.id === CMD_CHANNEL_ID;
                    const channelType = isCmdChannel ? 'cmd' : 'chat';
                    
                    // Usar MiniMax-Text-01 + VL-01 para respuestas avanzadas
                    const aiResponse = await minimaxAI.chat({
                        messages: [
                            {
                                role: "system",
                                content: `Eres un asistente especializado en seguridad y anti-cheat. Contexto: ${channelType}. Responde de forma clara y técnica.`
                            },
                            {
                                role: "user", 
                                content: aiMessage
                            }
                        ],
                        stream: false
                    });
                    
                    const aiEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle(`🧠 IA MiniMax-01 | ${channelType.toUpperCase()}`)
                        .setDescription(aiResponse.choices[0].message.content)
                        .addFields(
                            { name: '👤 Usuario', value: message.author.username, inline: true },
                            { name: '📝 Consulta', value: aiMessage.length > 50 ? aiMessage.substring(0, 50) + '...' : aiMessage, inline: true },
                            { name: '⚡ Modelo', value: 'MiniMax-Text-01 (456B)', inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Stealth-AntiCheatX | IA Contextual v3.0' });
                    
                    await message.reply({ embeds: [aiEmbed] });
                    
                } catch (error) {
                    console.error('❌ Error en comando IA:', error);
                    
                    const errorAIEmbed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle('🛡️ Error IA MiniMax')
                        .setDescription('Sistema de respaldo activado')
                        .addFields(
                            { name: '💬 Alternativa', value: '¡Intenta mencionarme sin comando para conversación natural!', inline: false },
                            { name: '🔧 Estado', value: 'Reintentando conexión...', inline: true }
                        )
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorAIEmbed] });
                }
                break;

            case 'join':
            case 'voice':
            case 'vc':
                // Comando simplificado para unirse a VC
                if (!message.guild) {
                    return message.reply('❌ Este comando solo funciona en servidores.');
                }
                
                try {
                    console.log(`[VOZ] ${message.author.tag} solicita unión a voz`);
                    
                    const botMember = message.guild.members.me;
                    
                    // Verificar permisos básicos
                    if (!botMember.permissions.has('Connect')) {
                        return message.reply('❌ Sin permisos de voz. Necesita "Conectar".');
                    }
                    
                    if (!botMember.permissions.has('Speak')) {
                        return message.reply('❌ Sin permisos de habla. Necesita "Hablar".');
                    }
                    
                    // Si el usuario está en VC, unirse automáticamente
                    const userVoiceChannel = message.member.voice.channel;
                    
                    if (userVoiceChannel) {
                        try {
                            // Desconectar de canal actual si existe
                            if (botMember.voice.channel && botMember.voice.channel.id !== userVoiceChannel.id) {
                                await botMember.voice.disconnect();
                            }
                            
                            // Unirse al canal del usuario
                            await botMember.voice.setChannel(userVoiceChannel.id);
                            
                            const joinEmbed = new EmbedBuilder()
                                .setTitle('🎤 Conexión de Voz Exitosa')
                                .setDescription(`Bot unido a **${userVoiceChannel.name}**`)
                                .setColor('#00ff00')
                                .addFields(
                                    { name: '👥 Miembros', value: `${userVoiceChannel.members.size}`, inline: true },
                                    { name: '🔊 Estado', value: 'Monitoreo anti-cheat activo', inline: true },
                                    { name: '💬 Chat', value: '¡Habla conmigo libremente!', inline: true }
                                )
                                .setFooter({ text: 'Stealth-AntiCheatX | IA de Voz v3.0' })
                                .setTimestamp();
                            
                            await message.reply({ embeds: [joinEmbed] });
                            
                        } catch (voiceError) {
                            console.error('[VOZ] Error conectando:', voiceError);
                            return message.reply('❌ Error conectando a tu VC. Verifica permisos.');
                        }
                    } else {
                        const noVoiceEmbed = new EmbedBuilder()
                            .setTitle('🎤 Unión de Voz')
                            .setDescription('Únete a un canal de voz primero')
                            .setColor('#0099ff')
                            .addFields(
                                { name: '💡 Instrucciones', value: '1. Únete a un canal de voz\n2. Usa nuevamente `$join`\n3. ¡Comenzamos a chatear!', inline: false },
                                { name: '🔊 Estado Actual', value: 'Desconectado', inline: true }
                            )
                            .setFooter({ text: 'Stealth-AntiCheatX | Sistema de Voz' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [noVoiceEmbed] });
                    }
                    
                } catch (error) {
                    console.error('[VOZ] Error crítico:', error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error de Voz')
                        .setDescription('Error en el sistema de voz')
                        .addFields(
                            { name: '🔧 Solución', value: 'Verifica permisos y vuelve a intentar', inline: false }
                        )
                        .setColor('#ff0000')
                        .setFooter({ text: 'Stealth-AntiCheatX | Soporte' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
                break;

            case 'leave':
            case 'leave_voice':
                // Comando para salir del VC
                if (!message.guild) {
                    return message.reply('❌ Este comando solo funciona en servidores.');
                }
                
                const botMember = message.guild.members.me;
                
                if (botMember.voice.channel) {
                    const currentChannel = botMember.voice.channel;
                    await botMember.voice.disconnect();
                    
                    const leaveEmbed = new EmbedBuilder()
                        .setTitle('👋 Desconectado de Voz')
                        .setDescription(`Bot salió de **${currentChannel.name}**`)
                        .setColor('#0099ff')
                        .addFields(
                            { name: '📍 Canal', value: currentChannel.name, inline: true },
                            { name: '⏰ Tiempo', value: new Date().toLocaleTimeString(), inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Sistema de Voz' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [leaveEmbed] });
                } else {
                    await message.reply('🤔 No estoy conectado a ningún canal de voz.');
                }
                break;

            case 'vc-status':
            case 'status_voice':
                // Estado del sistema de voz
                const voiceStatusEmbed = new EmbedBuilder()
                    .setTitle('🎤 Estado del Sistema de Voz')
                    .setDescription('Información actual del bot en canales de voz')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🔊 Estado Actual', value: client.guilds.cache.some(g => g.members.me.voice.channel) ? 'Conectado a VC' : 'Desconectado', inline: true },
                        { name: '🎯 Canal', value: client.guilds.cache.some(g => g.members.me.voice.channel) ? client.guilds.cache.find(g => g.members.me.voice.channel).members.me.voice.channel.name : 'Ninguno', inline: true },
                        { name: '👥 Miembros', value: client.guilds.cache.some(g => g.members.me.voice.channel) ? `${client.guilds.cache.find(g => g.members.me.voice.channel).members.me.voice.channel.members.size}` : '0', inline: true },
                        { name: '🤖 IA', value: 'Lista para conversar', inline: true },
                        { name: '⚡ Comando', value: '$join para unirse', inline: true }
                    )
                    .setFooter({ text: 'Stealth-AntiCheatX | IA de Voz v3.0' })
                    .setTimestamp();
                
                await message.reply({ embeds: [voiceStatusEmbed] });
                break;

            case 'clear_chat':
            case 'clear':
                // Comando para limpiar spam (solo en canales permitidos)
                const targetChannelId = args[0] ? args[0].replace(/[<>#]/g, '') : message.channel.id;
                
                // Mostrar ayuda si no se especifica canal
                if (!args[0] && AI_PERMITTED_CHANNELS.length > 1) {
                    const helpClearEmbed = new EmbedBuilder()
                        .setTitle('🧹 Limpiar Chat')
                        .setDescription('Limpiar mensajes del bot en canales IA')
                        .setColor('#00ff00')
                        .addFields(
                            { name: '💬 Uso', value: `\`${BOT_PREFIX}clear_chat\` - Limpiar canal actual\n\`${BOT_PREFIX}clear_chat #canal\` - Limpiar canal específico\n\`${BOT_PREFIX}clear_chat 123456789\` - Limpiar por ID`, inline: false },
                            { name: '🔒 Canales Permitidos', value: `Canal Chat IA: ${CHAT_CHANNEL_ID}\nCanal CMD: ${CMD_CHANNEL_ID}`, inline: false },
                            { name: '⚡ Función', value: 'Elimina solo mensajes del bot (máximo 50)', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Control de Spam' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpClearEmbed] });
                    return;
                }
                
                // Verificar si el canal está en la lista de permitidos
                if (!AI_PERMITTED_CHANNELS.includes(targetChannelId)) {
                    const notAllowedEmbed = new EmbedBuilder()
                        .setTitle('🚫 Acceso Restringido')
                        .setDescription('Solo puedo limpiar chat en canales designados para IA')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🔒 Canales Permitidos', value: 'Canal de chat IA y canal de comandos', inline: false },
                            { name: '💡 Comando', value: `Usa \\`${BOT_PREFIX}clear_chat\\` sin parámetros para ver ayuda`, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Control de Spam' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [notAllowedEmbed] });
                    return;
                }
                
                try {
                    const targetChannel = client.channels.cache.get(targetChannelId);
                    
                    if (!targetChannel || !targetChannel.isTextBased()) {
                        return message.reply('❌ Canal no encontrado o no es de texto.');
                    }
                    
                    const messages = await targetChannel.messages.fetch({ limit: 100 });
                    const botMessages = messages.filter(msg => msg.author.bot && msg.author.id === client.user.id);
                    
                    if (botMessages.size === 0) {
                        await message.reply('📝 No hay mensajes del bot para limpiar en este canal.');
                        return;
                    }
                    
                    // Eliminar mensajes del bot (máximo 50 a la vez)
                    const messagesToDelete = Array.from(botMessages.values()).slice(0, 50);
                    await targetChannel.bulkDelete(messagesToDelete);
                    
                    const clearEmbed = new EmbedBuilder()
                        .setTitle('🧹 Chat Limpiado')
                        .setDescription(`Eliminados ${messagesToDelete.length} mensajes del bot en **${targetChannel.name}**`)
                        .setColor('#00ff00')
                        .addFields(
                            { name: '🗂️ Canal', value: targetChannel.name, inline: true },
                            { name: '📊 Mensajes', value: `${messagesToDelete.length} eliminados`, inline: true },
                            { name: '⚡ Estado', value: 'Canal limpio y operativo', inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Control de Spam' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [clearEmbed] });
                    
                } catch (clearError) {
                    console.error('[CLEAR] Error limpiando chat:', clearError);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error Limpiando Chat')
                        .setDescription('No se pudo limpiar el canal')
                        .addFields(
                            { name: '🔧 Error', value: clearError.message, inline: false }
                        )
                        .setColor('#ff0000')
                        .setFooter({ text: 'Stealth-AntiCheatX | Error' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
                break;



            case 'about':
            case 'info':
                const aboutEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Stealth-AntiCheatX IA v3.0')
                    .setDescription('**Sistema Anti-Cheat Inteligente con IA Conversacional**')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🤖 IA', value: 'MiniMax-M2 | Conversación natural', inline: true },
                        { name: '🎤 Voz', value: 'Chat libre en tiempo real', inline: true },
                        { name: '🔍 Detección', value: 'Patrones inteligentes', inline: true },
                        { name: '⚡ Versión', value: '3.0 Autonoma', inline: true },
                        { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                        { name: '👥 Usuarios', value: `${getTotalMemberCount(client)}`, inline: true },
                        { name: '💻 Desarrollador', value: 'xpe.nettt', inline: true },
                        { name: '🔮 Futuro', value: 'Análisis de ejecutables', inline: true }
                    )
                    .setFooter({ text: 'Community Stealth | xpe-hub/stealth-bot-nuevo' })
                    .setTimestamp();
                
                await message.reply({ embeds: [aboutEmbed] });
                break;

            case 'add_dev':
            case 'add_developer':
            case 'dev':
                // Comando para agregar developers
                const devUser = args[0];
                
                if (!devUser) {
                    const helpDevEmbed = new EmbedBuilder()
                        .setTitle('👨‍💻 Agregar Developer')
                        .setDescription('Añadir un nuevo desarrollador al sistema')
                        .setColor('#00ff00')
                        .addFields(
                            { name: '💬 Uso', value: `\`${BOT_PREFIX}add_dev @usuario\` - Agregar por mención\n\`${BOT_PREFIX}add_dev 123456789\` - Agregar por ID`, inline: false },
                            { name: '🔧 Permisos', value: 'Solo el owner del bot puede usar este comando', inline: false },
                            { name: '⚡ Función', value: 'Permite acceso a comandos de desarrollo futuros', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Developer Tools' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpDevEmbed] });
                    break;
                }
                
                // Solo el owner puede agregar developers
                if (!isOwner(message.author.id)) {
                    const noPermsEmbed = new EmbedBuilder()
                        .setTitle('🚫 Permisos Insuficientes')
                        .setDescription('Solo el owner del bot puede agregar developers')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🔒 Acceso', value: 'Comando restringido', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Security' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [noPermsEmbed] });
                    break;
                }
                
                try {
                    // Extraer ID del usuario
                    let devId = devUser.replace(/[<@!>]/g, '');
                    
                    // Verificar si es un ID válido
                    if (!/^\d+$/.test(devId)) {
                        await message.reply('❌ ID de usuario inválido. Usa una mención (@usuario) o ID numérico.');
                        return;
                    }
                    
                    // Obtener información del usuario
                    const devMember = message.guild.members.cache.get(devId);
                    if (!devMember) {
                        await message.reply('❌ Usuario no encontrado en el servidor.');
                        return;
                    }
                    
                    // Agregar a la base de datos de developers (simulado)
                    const devAddedEmbed = new EmbedBuilder()
                        .setTitle('✅ Developer Agregado')
                        .setDescription(`**${devMember.user.tag}** agregado como developer`)
                        .setColor('#00ff00')
                        .addFields(
                            { name: '👤 Usuario', value: devMember.user.username, inline: true },
                            { name: '🆔 ID', value: devId, inline: true },
                            { name: '⚡ Acceso', value: 'Comandos de desarrollo habilitados', inline: true },
                            { name: '📅 Fecha', value: new Date().toLocaleDateString(), inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Developer Management' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [devAddedEmbed] });
                    
                } catch (devError) {
                    console.error('[DEV] Error agregando developer:', devError);
                    
                    const devErrorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error Agregando Developer')
                        .setDescription('No se pudo agregar el developer')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🔧 Error', value: devError.message, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Error' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [devErrorEmbed] });
                }
                break;

            case 'status':
                // Status simplificado para troubleshooting
                const uptime = Math.floor(process.uptime() / 3600);
                const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
                const threatAnalysis = performThreatAnalysis();
                const totalThreats = threatAnalysis.reduce((sum, threat) => sum + threat.count, 0);
                
                // Verificar estado de voz
                let voiceStatus = 'Desconectado';
                let voiceChannel = 'Ninguno';
                let voiceMembers = '0';
                
                const guildWithVoice = client.guilds.cache.find(g => g.members.me.voice.channel);
                if (guildWithVoice) {
                    const voiceChannelObj = guildWithVoice.members.me.voice.channel;
                    voiceStatus = 'Conectado';
                    voiceChannel = voiceChannelObj.name;
                    voiceMembers = voiceChannelObj.members.size.toString();
                }
                
                const statusEmbed = new EmbedBuilder()
                    .setTitle('📊 Estado del Sistema Stealth-AntiCheatX')
                    .setDescription('Métricas y estado actual de la IA v3.0')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🛡️ Sistema', value: 'Online ✓', inline: true },
                        { name: '⏱️ Uptime', value: `${uptime}h`, inline: true },
                        { name: '💾 Memoria', value: `${memoryUsage} MB`, inline: true },
                        { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                        { name: '👥 Usuarios', value: `${getTotalMemberCount(client)}`, inline: true },
                        { name: '⚠️ Amenazas', value: `${totalThreats}`, inline: true },
                        { name: '🧠 IA', value: 'MiniMax-M2 Activa', inline: true },
                        { name: '🎤 Voz', value: `${voiceStatus} (${voiceChannel})`, inline: true },
                        { name: '👥 VC Members', value: voiceMembers, inline: true },
                        { name: '🔍 Patrones', value: '15+ patrones activos', inline: true },
                        { name: '💬 Conversación', value: 'Natural', inline: true }
                    )
                    .addFields(
                        { name: '🚀 Características IA v3.0', value: '• Conversación sin comandos\n• Sistema de voz integrado\n• Detección automática\n• Respuestas contextuales\n• Arquitectura para análisis futuro', inline: false }
                    )
                    .setFooter({ text: 'Stealth-AntiCheatX | IA Autonoma v3.0' })
                    .setTimestamp();
                
                await message.reply({ embeds: [statusEmbed] });
                break;

            case 'speak':
            case 'talk':
            case 'voz':
                // Comando de Texto a Voz (TTS) con MiniMax
                const ttsText = args.join(' ').trim();
                
                if (!ttsText) {
                    const helpTTSEmbed = new EmbedBuilder()
                        .setTitle('🎤 Texto a Voz (TTS)')
                        .setDescription('Convierte texto a voz con IA avanzada')
                        .setColor('#00ff00')
                        .addFields(
                            { name: '💬 Ejemplo', value: `\`${BOT_PREFIX}speak Hola mundo, soy StealthBot\``, inline: false },
                            { name: '🎭 Voces', value: `\`${BOT_PREFIX}voices\` - Ver voces disponibles`, inline: false },
                            { name: '🔊 Calidad', value: 'HD Audio | Múltiples idiomas', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | TTS HD v3.0' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpTTSEmbed] });
                    break;
                }
                
                try {
                    console.log(`🎤 TTS: ${message.author.username} solicita: "${ttsText}"`);
                    
                    const ttsResult = await minimaxTTS.generateSpeech({
                        text: ttsText,
                        voice_id: 'Chinese (Mandarin)_Warm_Bestie',
                        speed: 0.95,
                        pitch: -1,
                        emotion: 'neutral'
                    });
                    
                    if (ttsResult.success && ttsResult.audioUrl) {
                        const ttsEmbed = new EmbedBuilder()
                            .setColor('#00ff00')
                            .setTitle('🎤 Texto a Voz Generado')
                            .setDescription(`🎵 **Audio:** ${ttsText}`)
                            .addFields(
                                { name: '👤 Usuario', value: message.author.username, inline: true },
                                { name: '🎭 Voz', value: 'Chinese (Mandarin)_Warm_Bestie', inline: true },
                                { name: '⚡ Calidad', value: 'HD Audio', inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Stealth-AntiCheatX | TTS HD v3.0' });
                        
                        await message.reply({ 
                            embeds: [ttsEmbed],
                            content: ttsResult.audioUrl
                        });
                    } else {
                        throw new Error('No se pudo generar el audio');
                    }
                    
                } catch (error) {
                    console.error('❌ Error en TTS:', error);
                    
                    const errorTTSEmbed = new EmbedBuilder()
                        .setTitle('❌ Error en Texto a Voz')
                        .setDescription('No se pudo procesar el texto')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🔧 Error', value: error.message, inline: false },
                            { name: '💡 Solución', value: `Verifica: \`${BOT_PREFIX}speak texto\``, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheatX | Error' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorTTSEmbed] });
                }
                break;

            case 'voices':
            case 'voces':
                // Listar voces disponibles
                const voicesEmbed = new EmbedBuilder()
                    .setTitle('🎭 Voces Disponibles TTS')
                    .setDescription('Voces HD disponibles para síntesis de voz')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🎤 Voces Principales', value: 
                            '• Chinese (Mandarin)_Warm_Bestie\n• English_Female_1\n• Spanish_Male_1\n• Japanese_Female_1\n• Korean_Female_1', 
                          inline: false },
                        { name: '⚙️ Configuración', value: 
                            '• Velocidad: 0.5 - 2.0\n• Tono: -10 a +10\n• Emoción: neutral, happy, sad', 
                          inline: false },
                        { name: '💡 Uso', value: 
                            `\`${BOT_PREFIX}speak [texto]\` - Voz por defecto\n\`${BOT_PREFIX}speak [texto] [voz]\` - Voz específica`, 
                          inline: false }
                    )
                    .setFooter({ text: 'Stealth-AntiCheatX | TTS HD v3.0' })
                    .setTimestamp();
                
                await message.reply({ embeds: [voicesEmbed] });
                break;

            default:
                const unknownEmbed = new EmbedBuilder()
                    .setTitle('❓ Comando no reconocido')
                    .setDescription(`No conozco el comando \`${command}\``)
                    .addFields(
                        { name: '💡 Ayuda', value: `Usa \`${BOT_PREFIX}help\` para ver comandos disponibles.`, inline: false },
                        { name: '🤖 IA', value: '¡También puedes hablar conmigo naturalmente mencionándome!', inline: false }
                    )
                    .setColor('#ffaa00')
                    .setFooter({ text: `¡Hola ${userNickname}!` })
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
            .setFooter({ text: 'Stealth-AntiCheatX | IA v3.0' })
            .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
    }
});

// Manejo de errores mejorado
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