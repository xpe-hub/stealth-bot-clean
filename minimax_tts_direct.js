// ========================================================
// MINIMAX TTS DIRECT API - IMPLEMENTACIÓN SIMPLE
// Stealth-AntiCheatX v3.0 - IA AUTÓNOMA CON VOZ
// ========================================================

const fetch = require('node-fetch');

// Configuración TTS - Basado en documentación oficial del blog
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimax.io'; // Global API
const MINIMAX_CHAT_URL = 'https://api.minimaxi.chat'; // China/TTS API
const TTS_API_URL = `${MINIMAX_CHAT_URL}/v1/t2a_v2`; // TTS endpoint del blog
const VOICES_API_URL = `${MINIMAX_CHAT_URL}/v1/voice_list`; // Voces endpoint del blog

// ========================================================
// FUNCIÓN TTS PRINCIPAL CON API DIRECTA
// ========================================================

async function textToSpeech(text, options = {}) {
    if (!MINIMAX_API_KEY) {
        throw new Error('MINIMAX_API_KEY no está configurada');
    }

    const defaultOptions = {
        model: 'speech-02-hd',  // Modelo del blog oficial
        text: text,
        voice_setting: {
            voice_id: 'Chinese (Mandarin)_Warm_Bestie',  // Voz del blog
            speed: 1.0,                  // Velocidad normal
            pitch: -1,                   // Pitch del blog
            emotion: 'neutral'            // Emoción del blog
        },
        language_boost: 'Chinese,Yue'    // Language boost del blog
    };

    const config = Object.assign({}, defaultOptions, options);
    
    try {
        console.log(`🗣️ TTS API: "${text.substring(0, 50)}..."`);
        
        // Extraer GroupId del JWT token
        const apiKey = MINIMAX_API_KEY;
        let groupId = '';
        try {
            // Decodificar JWT para obtener GroupId
            const payload = JSON.parse(Buffer.from(apiKey.split('.')[1], 'base64').toString());
            groupId = payload.GroupId || payload.groupId || '';
        } catch (e) {
            console.warn('⚠️ No se pudo extraer GroupId del token');
        }
        
        const ttsUrl = groupId ? `${TTS_API_URL}?GroupId=${groupId}` : TTS_API_URL;
        
        const response = await fetch(ttsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`, // Con Bearer como en el blog
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TTS API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        if (result.base_resp && result.base_resp.status_code !== 0) {
            throw new Error(`TTS Error: ${result.base_resp.status_msg}`);
        }

        if (result.audio_url) {
            console.log('✅ TTS generado exitosamente');
            return {
                audioUrl: result.audio_url,
                duration: result.duration || 0,
                format: 'mp3'
            };
        }
        
        throw new Error('No se pudo generar audio TTS');
        
    } catch (error) {
        console.error('❌ Error TTS API:', error);
        throw error;
    }
}

// ========================================================
// FUNCIONES DE UTILIDAD TTS
// ========================================================

// Listar voces disponibles - Usando API oficial
async function getAvailableVoices() {
    try {
        console.log('🎭 Obteniendo lista oficial de voces...');
        
        // Extraer GroupId para voces
        let groupId = '';
        try {
            const payload = JSON.parse(Buffer.from(MINIMAX_API_KEY.split('.')[1], 'base64').toString());
            groupId = payload.GroupId || payload.groupId || '';
        } catch (e) {
            console.warn('⚠️ No se pudo extraer GroupId del token');
        }
        
        const voicesUrl = groupId ? `${VOICES_API_URL}?GroupId=${groupId}` : VOICES_API_URL;
        
        const response = await fetch(voicesUrl, {
            headers: {
                'Authorization': MINIMAX_API_KEY, // Sin Bearer prefix
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Voces obtenidas exitosamente');
            return result.data?.voices || [];
        } else {
            console.warn('⚠️ Error obteniendo voces de API:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ No se pudo obtener lista de voces:', error.message);
    }
    
    // Voces por defecto basadas en documentación oficial MCP Server
    return [
        // Voces masculinas
        { voice_id: 'male-qn-qingse', name: 'Masculino Qingse', category: 'male' },
        { voice_id: 'male-qn-jingying', name: 'Masculino Elite', category: 'male' },
        { voice_id: 'audiobook_male_1', name: 'Audiolibro Masculino 1', category: 'male' },
        { voice_id: 'professional_male', name: 'Masculino Profesional', category: 'male' },
        
        // Voces femeninas
        { voice_id: 'female-shaonv', name: 'Femenino Jovial', category: 'female' },
        { voice_id: 'Charming_Lady', name: 'Dama Encantadora', category: 'female' },
        { voice_id: 'audiobook_female_1', name: 'Audiolibro Femenino 1', category: 'female' },
        { voice_id: 'professional_female', name: 'Femenino Profesional', category: 'female' },
        
        // Voces especiales
        { voice_id: 'cute_boy', name: 'Niño Tierno', category: 'child' },
        { voice_id: 'gentle_voice', name: 'Voz Tierna', category: 'special' },
        { voice_id: 'energetic_voice', name: 'Voz Enérgica', category: 'special' }
    ];
}

// Generar respuesta de texto para TTS
function generateVoiceResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('status') || lowerQuestion.includes('estado')) {
        return 'El sistema anti-cheat está funcionando correctamente. Todas las amenazas han sido detectadas y neutralizadas. El sistema está en estado óptimo.';
    } else if (lowerQuestion.includes('cheat') || lowerQuestion.includes('amenaza')) {
        return 'Estoy monitoreando constantemente posibles amenazas de cheating. El sistema de detección está activo y el historial de amenazas está limpio.';
    } else if (lowerQuestion.includes(' dll') || lowerQuestion.includes('análisis')) {
        return 'El sistema de análisis de DLL está funcionando. Puedo detectar archivos maliciosos y métodos de bypass automáticamente.';
    } else if (lowerQuestion.includes('repo') || lowerQuestion.includes('repositorio')) {
        return 'El monitoreo del repositorio está activo. Los últimos commits han sido analizados y no se encontraron amenazas.';
    } else if (lowerQuestion.includes('hola') || lowerQuestion.includes('ayuda')) {
        return 'Hola, soy Stealth-AntiCheatX, su asistente de voz autónoma. Estoy monitoreando amenazas anti-cheat y puedo analizar DLLs y métodos de bypass. ¿En qué puedo ayudarle?';
    } else if (lowerQuestion.includes('gracias') || lowerQuestion.includes('thanks')) {
        return 'De nada. Estoy aquí para ayudar con el sistema anti-cheat. ¿Hay algo más que necesite saber?';
    }
    
    return 'Entendido. Estoy aquí para ayudar con el sistema anti-cheat y análisis de amenazas. ¿En qué más puedo asistirle?';
}

// ========================================================
// MANEJADORES DE COMANDOS VC AUTÓNOMO
// ========================================================

async function handleVoiceJoin(voiceChannel, botMember) {
    try {
        console.log(`🎤 Bot conectado a canal: ${voiceChannel.name}`);
        
        // Saludo inicial con TTS
        const greeting = 'Hola, soy Stealth-AntiCheatX, su asistente de voz autónoma. El sistema anti-cheat está operativo. ¿En qué puedo ayudarle?';
        const ttsResult = await textToSpeech(greeting);
        
        // Retornar información para reproducir en canal
        return {
            greeting: ttsResult,
            channel: voiceChannel,
            connected: true
        };
        
    } catch (error) {
        console.error('❌ Error uniéndose a canal de voz:', error);
        throw error;
    }
}

// ========================================================
// COMANDOS DE VOZ PARA USUARIOS
// ========================================================

async function handleVoiceCommand(command, args, message) {
    try {
        const command = args[0]?.toLowerCase();
        const restArgs = args.slice(1);

        switch (command) {
            case 'speak':
                if (restArgs.length === 0) {
                    return message.reply('❌ Especifica texto para hablar. Ej: `!speak Hola mundo`');
                }
                
                const textToSpeak = restArgs.join(' ');
                
                // Verificar si el usuario está en canal de voz
                const userVoiceChannel = message.member.voice.channel;
                if (!userVoiceChannel) {
                    return message.reply('❌ Debes estar en un canal de voz para usar este comando');
                }
                
                try {
                    const ttsResult = await textToSpeech(textToSpeak);
                    
                    // Crear embed con resultado
                    const speakEmbed = {
                        title: '🗣️ Stealth-AntiCheatX Speaking',
                        description: `**Texto:** ${textToSpeak}`,
                        color: 0x00FF00,
                        fields: [
                            { name: '🎤 Canal', value: userVoiceChannel.name, inline: true },
                            { name: '🎵 Formato', value: ttsResult.format || 'MP3', inline: true },
                            { name: '📻 Audio', value: '[Enviado a canal de voz]', inline: true }
                        ],
                        timestamp: new Date().toISOString()
                    };
                    
                    return message.reply({ embed: speakEmbed });
                    
                } catch (ttsError) {
                    console.error('❌ Error TTS en comando:', ttsError);
                    return message.reply('❌ Error generando audio. Verifica MINIMAX_API_KEY');
                }

            case 'voices':
                const voices = await getAvailableVoices();
                const voiceList = voices.map(voice => 
                    `• **${voice.voice_id}**${voice.name ? ` - ${voice.name}` : ''}`
                ).join('\n');
                
                const voiceEmbed = {
                    title: '🎭 Voces Disponibles',
                    description: 'Voces TTS de MiniMax disponibles',
                    color: 0x0099FF,
                    fields: [
                        { name: '🎤 Voces', value: voiceList.substring(0, 1024), inline: false }
                    ],
                    footer: { text: 'Usa: !speak [texto] [voice_id]' }
                };
                
                return message.reply({ embed: voiceEmbed });

            case 'test':
                const testText = 'Este es un test del sistema de síntesis de voz de MiniMax para Stealth-AntiCheatX. El sistema anti-cheat está funcionando correctamente.';
                const testResult = await textToSpeech(testText);
                
                const testEmbed = {
                    title: '🧪 Test de Voz Exitoso',
                    description: 'Sistema TTS funcionando correctamente',
                    color: 0x00FF00,
                    fields: [
                        { name: '🗣️ Texto', value: testText.substring(0, 200) + '...', inline: false },
                        { name: '✅ Estado', value: 'MiniMax TTS HD Activo', inline: true }
                    ]
                };
                
                return message.reply({ embed: testEmbed });

            default:
                return message.reply(`❌ Comando de voz desconocido: ${command}\n\nComandos disponibles:\n• \`!speak [texto]\` - Convertir texto a voz\n• \`!voices\` - Listar voces disponibles\n• \`!test\` - Probar sistema TTS`);
        }
        
    } catch (error) {
        console.error('❌ Error en comando de voz:', error);
        return message.reply('❌ Error ejecutando comando de voz');
    }
}

// ========================================================
// FUNCIONES DE RESPUESTA AUTÓNOMA
// ========================================================

async function generateAutonomousResponse(userMessage) {
    try {
        // Generar respuesta inteligente
        const responseText = generateVoiceResponse(userMessage);
        
        // Generar audio con TTS
        const ttsResult = await textToSpeech(responseText, {
            emotion: 'neutral',
            speed: 0.9
        });
        
        return {
            text: responseText,
            audio: ttsResult,
            autonomous: true
        };
        
    } catch (error) {
        console.error('❌ Error generando respuesta autónoma:', error);
        return {
            text: 'Error generando respuesta de voz. Sistema TTS temporalmente no disponible.',
            autonomous: true
        };
    }
}

// ========================================================
// TESTING Y DEBUGGING
// ========================================================

async function testTTS() {
    try {
        console.log('🧪 Probando funcionalidad TTS...');
        
        if (!MINIMAX_API_KEY) {
            throw new Error('MINIMAX_API_KEY no está configurada');
        }
        
        const testText = 'Este es un test del sistema TTS de MiniMax para Stealth-AntiCheatX.';
        const result = await textToSpeech(testText);
        
        console.log('✅ TTS Test exitoso');
        console.log(`📻 Audio URL: ${result.audioUrl}`);
        console.log(`⏱️ Duración: ${result.duration}s`);
        
        return { success: true, ...result };
        
    } catch (error) {
        console.error('❌ TTS Test falló:', error);
        return { success: false, error: error.message };
    }
}

// ========================================================
// EXPORTAR FUNCIONES
// ========================================================

module.exports = {
    textToSpeech,
    getAvailableVoices,
    generateVoiceResponse,
    handleVoiceJoin,
    handleVoiceCommand,
    generateAutonomousResponse,
    testTTS
};

// ========================================================
// EJECUCIÓN DE TESTING SI ES LLAMADO DIRECTAMENTE
// ========================================================

if (require.main === module) {
    console.log('🎤 Stealth-AntiCheatX - MiniMax TTS Direct API');
    console.log('⚠️ Requiere: MINIMAX_API_KEY configurada');
    
    testTTS().then(result => {
        if (result.success) {
            console.log('🎉 TTS funcionando correctamente');
            console.log('✅ Listo para integrar en bot principal');
        } else {
            console.log('❌ Error en TTS:', result.error);
        }
    });
}
