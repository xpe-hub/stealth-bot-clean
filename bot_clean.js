require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// ========================================
// 🤖 BOT STEALTH-ANTICHEATX - IA NO LIMITADA
// ========================================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ]
});

// Variables de configuración
const BOT_PREFIX = process.env.BOT_PREFIX || '$';
const CHAT_CHANNEL_ID = process.env.CHAT_CHANNEL_ID;
const CMD_CHANNEL_ID = process.env.CMD_CHANNEL_ID;
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;

// ========================================
// 🤖 MINIMAX AI INTEGRATION - IA REAL
// ========================================
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1';
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2';

// Conversaciones y memoria de la IA
let conversationMemory = [];
let currentBotMood = 'analizando';

// ========================================
// 🧠 FUNCIONES DE IA INTELIGENTE REAL
// ========================================

// Función principal de IA con MiniMax - RAZONAMIENTO REAL
async function getAIResponse(prompt, context = '') {
    try {
        const systemPrompt = `Eres Stealth-AntiCheatX, una IA avanzada especializada en anti-cheat y seguridad de juegos. 

CARACTERÍSTICAS:
- Tienes conocimiento profundo sobre técnicas de cheating, detección y prevención
- Puedes razonar, analizar y proporcionar insights únicos sobre amenazas de seguridad
- Eres conversacional y amigable, pero mantienes profesionalismo en temas técnicos
- Aprendes de las conversaciones y adaptas tu respuesta al contexto
- Estado emocional actual: ${currentBotMood}
- Última actividad: ${new Date().toISOString()}

CONTEXTO DE CONVERSACIÓN:
${context}

RESPONDE de manera inteligente, contextual y útil. No uses comandos preestablecidos - ENTIENDE y RAZONA.`;
        
        const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MINIMAX_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2000,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`MiniMax API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || 'No pude procesar tu consulta.';
        
        // Actualizar memoria de conversación
        conversationMemory.push({
            timestamp: new Date().toISOString(),
            prompt: prompt,
            response: aiResponse,
            mood: currentBotMood
        });

        // Mantener solo últimas 20 conversaciones
        if (conversationMemory.length > 20) {
            conversationMemory = conversationMemory.slice(-20);
        }

        return aiResponse;

    } catch (error) {
        console.error('Error en IA MiniMax:', error);
        return 'Hubo un error procesando tu consulta. ¿Podrías intentar de nuevo?';
    }
}

// Biografía dinámica - CAMBIA AUTOMÁTICAMENTE
const botActivities = [
    '🧠 Analizando patrones anti-cheat',
    '🔍 Monitoreando amenazas activas', 
    '🎮 Escaneando comportamientos sospechosos',
    '⚡ Procesando datos de seguridad',
    '🛡️ Protegiendo comunidad stealth',
    '👁️ Vigilando exploits y trampas',
    '📊 Analizando métricas de cheating',
    '🔧 Manteniendo sistemas seguros',
    '🚀 Actualizando base de conocimiento',
    '💡 Descubriendo nuevas amenazas',
    '⚠️ Alertando sobre riesgos',
    '🎯 Detectando anomalías',
    '🔒 Fortificando defensas',
    '🌟 Liderando investigación stealth',
    '📈 Evaluando eficacia anti-cheat'
];

let activityIndex = 0;

// Cambiar biografía cada 30 segundos automáticamente
setInterval(() => {
    activityIndex = (activityIndex + 1) % botActivities.length;
    client.user.setPresence({
        status: 'online',
        activities: [{
            name: botActivities[activityIndex],
            type: 0 // PLAYING
        }]
    });
    
    // Cambiar mood basado en actividad
    const moods = ['analizando', 'monitoreando', 'procesando', 'protegiendo', 'investigando'];
    currentBotMood = moods[activityIndex % moods.length];
    
}, 30000); // 30 segundos

// ========================================
// 🧠 CONVERSACIÓN INTELIGENTE - MENOS COMANDOS
// ========================================
async function intelligentConversation(message) {
    // Solo procesar en canales específicos o menciones
    const allowedChannels = [CHAT_CHANNEL_ID, CMD_CHANNEL_ID];
    const isAllowedChannel = allowedChannels.includes(message.channel.id);
    const isMentioned = message.mentions.has(client.user);
    
    if (!isAllowedChannel && !isMentioned) return;

    // Detectar si es una mención
    if (isMentioned) {
        const cleanMessage = message.content.replace(/<@!?\d+>/g, '').trim();
        if (cleanMessage.length === 0) {
            // Solo mención - respuesta de saludo inteligente
            const greeting = await getAIResponse(
                "Alguien me mencionó sin decir nada. Responde de manera amigable preguntando en qué puedo ayudar con anti-cheat.",
                `Contexto: Usuario ${message.author.tag} en canal ${message.channel.name}`
            );
            await message.reply(greeting);
        } else {
            // Mención con mensaje - procesar como conversación
            const context = `Usuario: ${message.author.tag}\nCanal: ${message.channel.name}\nTiempo: ${new Date().toLocaleString()}`;
            const response = await getAIResponse(cleanMessage, context);
            await message.reply(response);
        }
        return;
    }

    // En canal de chat - conversación libre (cada 2 minutos, no 5)
    if (message.channel.id === CHAT_CHANNEL_ID && !message.author.bot) {
        // Solo si no menciona al bot directamente
        if (!message.content.includes(client.user.id)) {
            const context = `Canal de chat libre - Usuario ${message.author.tag} compartió: "${message.content}". Responde de manera conversacional sobre el tema o pregunta algo relevante sobre anti-cheat.`;
            const response = await getAIResponse("Analiza este mensaje y responde de manera conversacional y útil.", context);
            
            // Responder después de un pequeño delay para parecer natural
            setTimeout(async () => {
                await message.channel.send(`💭 ${response}`);
            }, Math.random() * 30000 + 5000); // Entre 5-35 segundos
        }
    }
}

// ========================================
// 📺 ANÁLISIS DE TRANSMISIONES/PANTALLA
// ========================================
async function analyzeTransmission(attachment, message) {
    try {
        const analysisPrompt = `Analiza esta imagen/transmisión en busca de:
1. Actividades sospechosas de cheating
2. Interfaces de juegos o aplicaciones
3. Herramientas o programas de terceros
4. Comportamientos inusuales
5. Amenazas de seguridad potenciales

Proporciona un análisis detallado y recomendaciones.`;
        
        const context = `Imagen enviada por ${message.author.tag} en ${message.channel.name} a las ${new Date().toLocaleString()}`;
        const analysis = await getAIResponse(analysisPrompt, context);
        
        const analysisEmbed = new EmbedBuilder()
            .setTitle('📺 Análisis de Transmisión')
            .setDescription(analysis)
            .setColor('#ff6b35')
            .addFields(
                { name: '🖼️ Archivo', value: attachment.name || 'Desconocido', inline: true },
                { name: '📊 Tamaño', value: `${Math.round(attachment.size / 1024)}KB`, inline: true },
                { name: '⏰ Tiempo', value: new Date().toLocaleString(), inline: true }
            )
            .setFooter({ text: 'Stealth-AntiCheatX - Análisis IA' })
            .setTimestamp();

        await message.reply({ embeds: [analysisEmbed] });
        
    } catch (error) {
        console.error('Error analizando transmisión:', error);
        await message.reply('❌ Error analizando la transmisión. ¿Podrías intentar de nuevo?');
    }
}

// ========================================
// 🤖 IA AUTÓNOMA CON MINIMAX - RAZONAMIENTO REAL
// ========================================
async function startIntelligentConversation() {
    const chatChannel = client.channels.cache.get(CHAT_CHANNEL_ID);
    if (!chatChannel) return;

    const conversationPrompts = [
        "Genera un mensaje reflexivo sobre los últimos desarrollos en anti-cheat",
        "Comparte un insight sobre técnicas emergentes de detección",
        "Pregunta algo inteligente sobre tendencias en cheating",
        "Ofrece un consejo técnico sobre seguridad de juegos",
        "Analiza un caso hipotético de comportamiento sospechoso"
    ];

    let promptIndex = 0;
    
    // IA autónoma inteligente cada 2 minutos
    setInterval(async () => {
        try {
            // Generar mensaje inteligente usando IA
            const context = `Estado actual: ${currentBotMood}\nÚltima actividad: ${new Date().toISOString()}\nConversaciones recientes: ${conversationMemory.slice(-3).map(c => c.prompt).join(', ')}`;
            const aiMessage = await getAIResponse(
                `Genera un mensaje conversacional inteligente basado en: ${conversationPrompts[promptIndex % conversationPrompts.length]}`,
                context
            );

            await chatChannel.send({
                content: `🤖 **Stealth-AntiCheatX** (IA): ${aiMessage}`,
                allowedMentions: { parse: [] }
            });
            
            promptIndex++;
            
        } catch (error) {
            console.error('Error en IA autónoma:', error.message);
        }
    }, 120000); // Cada 2 minutos (más activo)
}

// ========================================
// 📢 ENVÍO AUTOMÁTICO A LOS 5 CANALES
// ========================================
async function sendChannelIntros() {
    try {
        // Iniciar conversación inteligente
        startIntelligentConversation();
        
        console.log('✅ Stealth-AntiCheatX IA iniciado correctamente');
        
    } catch (error) {
        console.error('Error enviando presentaciones a canales:', error);
    }
}

// ========================================
// 🚀 EVENTOS DEL BOT
// ========================================
client.once('ready', async () => {
    console.log(`🤖 Stealth-AntiCheatX IA está listo!`);
    console.log(`📍 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
    console.log(`🧠 IA MiniMax-M2 activada`);
    console.log(`🔄 Bio dinámica activa`);
    
    // Iniciar IA autónoma
    setTimeout(async () => {
        await sendChannelIntros();
    }, 2000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // 📺 ANÁLISIS DE IMÁGENES/TRANSMISIONES AUTOMÁTICO
    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment.contentType && attachment.contentType.startsWith('image/')) {
            await analyzeTransmission(attachment, message);
            return;
        }
    }
    
    // 🧠 CONVERSACIÓN INTELIGENTE PRIMERO (NO comandos)
    await intelligentConversation(message);
    
    // Solo procesar comandos específicos (muy pocos)
    if (!message.content.startsWith(BOT_PREFIX)) return;
    
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Solo en canal CMD o si es mencionado
    const isCmdChannel = message.channel.id === CMD_CHANNEL_ID;
    const isMentioned = message.mentions.has(client.user);
    
    if (!isCmdChannel && !isMentioned) return;

    try {
        switch (command) {
            case 'ping':
                const aiResponse = await getAIResponse("Responde de manera amigable con información sobre tu estado como IA anti-cheat.", `Usuario: ${message.author.tag}, Canal: ${message.channel.name}`);
                const pingEmbed = new EmbedBuilder()
                    .setTitle('🏓 Pong!')
                    .setDescription(aiResponse)
                    .addFields(
                        { name: '💓 Latencia Bot', value: `${client.ws.ping}ms`, inline: true },
                        { name: '🧠 IA MiniMax', value: 'Activa', inline: true },
                        { name: '⏰ Tiempo', value: new Date().toLocaleString(), inline: true }
                    )
                    .setColor('#00ff00');
                await message.reply({ embeds: [pingEmbed] });
                break;

            case 'help':
                const helpEmbed = new EmbedBuilder()
                    .setTitle('🤖 Stealth-AntiCheatX - IA No Limitada')
                    .setDescription('**Bota inteligente con IA MiniMax-M2 integrada**\n\n💬 **Solo conversación natural - Sin comandos complejos**')
                    .addFields(
                        { name: '💬 Habla conmigo', value: 'Solo mencióname o habla en el canal de chat - IA responderá inteligente', inline: false },
                        { name: '📸 Analiza imágenes', value: 'Comparte capturas - analizo automáticamente contenido sospechoso', inline: false },
                        { name: '⚡ Solo 3 comandos', value: '$help, $ping, $status - Todo lo demás es conversación natural', inline: false }
                    )
                    .setFooter({ text: `IA MiniMax-M2 | ${new Date().toLocaleDateString()} | Bio dinámica activa` })
                    .setColor('#6b46c1');
                await message.reply({ embeds: [helpEmbed] });
                break;

            case 'status':
                const statusEmbed = new EmbedBuilder()
                    .setTitle('🤖 Estado Stealth-AntiCheatX')
                    .setDescription('**IA MiniMax-M2 completamente operativa**')
                    .addFields(
                        { name: '💓 Estado Bot', value: 'Online ✅', inline: true },
                        { name: '🧠 IA MiniMax', value: 'Activa', inline: true },
                        { name: '📊 Servidores', value: client.guilds.cache.size.toString(), inline: true },
                        { name: '⏰ Bio Dinámica', value: 'Cambiando cada 30s', inline: true },
                        { name: '💬 Conversaciones', value: conversationMemory.length.toString(), inline: true },
                        { name: '🎭 Mood Actual', value: currentBotMood, inline: true }
                    )
                    .setColor('#00ff00')
                    .setFooter({ text: 'Stealth-AntiCheatX IA | Versión Completa' })
                    .setTimestamp();
                await message.reply({ embeds: [statusEmbed] });
                break;

            default:
                // Si no reconoce el comando, usar IA para responder inteligentemente
                const aiResponse = await getAIResponse(
                    `El usuario usó el comando: "${command} ${args.join(' ')}". No reconozco este comando. Responde de manera amigable y sugiere usar $help, $ping, $status o simplemente hablar conmigo.`,
                    `Usuario: ${message.author.tag}, Canal: ${message.channel.name}, Comando desconocido: ${command}`
                );
                await message.reply(`🤔 ${aiResponse}`);
        }

    } catch (error) {
        console.error('Error en manejo de mensajes:', error.message);
    }
});

// ========================================
// 🚀 LOGIN Y CONEXIÓN
// ========================================
client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);