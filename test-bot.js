/**
 * 🤖 STEALTH ANTICHEAT BOT - VERSIÓN SIMPLIFICADA PARA DEBUG
 * Esta es una versión simplificada para verificar que el bot funciona correctamente
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { config } = require('dotenv');

// Load environment variables
config();

// Verificar variables de entorno
console.log('🔧 Configuración del Bot:');
console.log('Token presente:', !!process.env.DISCORD_BOT_TOKEN);
console.log('Owner ID:', process.env.BOT_OWNER_ID);
console.log('Prefix:', process.env.BOT_PREFIX);

// Client initialization
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Evento Ready
client.once('ready', async () => {
    console.log(`✅ Bot está online como ${client.user.tag}!`);
    
    // Establecer actividad del bot
    await client.user.setPresence({
        status: 'online',
        activities: [{ name: '🛡️ AntiCheat Community Stealth', type: 'WATCHING' }]
    });
});

// Evento Message
client.on('messageCreate', async (message) => {
    // Ignorar bots
    if (message.author.bot) {
        console.log('🛑 Mensaje de bot ignorado:', message.author.tag);
        return;
    }

    console.log(`💬 Mensaje recibido de ${message.author.tag} en ${message.channel.name}: ${message.content}`);

    try {
        const content = message.content;
        const prefix = process.env.BOT_PREFIX || '$';

        // Manejar menciones
        if (content.includes(`<@${client.user.id}>`) || content.includes(`<@!${client.user.id}>`)) {
            console.log('🎯 Mención detectada, enviando respuesta...');
            
            const mentionEmbed = new EmbedBuilder()
                .setTitle('🤖 ¡Stealth-AntiCheat-bot está aquí!')
                .setDescription(`¡Hola ${message.author.username}! Soy el bot de **anti-cheat avanzado** para Community Stealth.`)
                .addFields(
                    { name: '🛡️ Comandos Disponibles', value: `\`${prefix}help\` - Lista de comandos\n\`${prefix}ping\` - Verificar estado`, inline: true },
                    { name: '🔍 Escaneo', value: `Usa \`${prefix}scan\` para escanear el servidor`, inline: true },
                    { name: '🌐 Comunidad', value: `¡Únete a Community Stealth!`, inline: true },
                    { name: '📊 Estado', value: `Bot conectado: ✅\nServidores: ${client.guilds.cache.size}\nUsuarios: ${client.users.cache.size}`, inline: true }
                )
                .setColor('#0099ff')
                .setFooter({ text: 'Stealth-AntiCheat-bot v2.0 | xpe.nettt' })
                .setTimestamp();

            await message.reply({ embeds: [mentionEmbed] });
            console.log('✅ Respuesta enviada exitosamente');
            return;
        }

        // Manejar comandos
        if (content.startsWith(prefix)) {
            console.log('⚡ Comando detectado:', content);
            
            const args = content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            switch (command) {
                case 'help':
                case 'h':
                    console.log('📋 Ejecutando comando help...');
                    const helpEmbed = new EmbedBuilder()
                        .setTitle('🛡️ Comandos del Bot')
                        .setDescription('Lista de comandos disponibles para Stealth-AntiCheat-bot')
                        .addFields(
                            { name: `${prefix}help`, value: 'Muestra esta lista de comandos', inline: true },
                            { name: `${prefix}ping`, value: 'Verifica la latencia del bot', inline: true },
                            { name: `${prefix}scan`, value: 'Escanea el servidor en busca de amenazas', inline: true },
                            { name: `${prefix}info`, value: 'Información del bot', inline: true },
                            { name: 'Menciones', value: `@${client.user.username} - Información rápida`, inline: true }
                        )
                        .setColor('#00ff00')
                        .setFooter({ text: 'Desarrollado por xpe.nettt' });

                    await message.reply({ embeds: [helpEmbed] });
                    break;

                case 'ping':
                    console.log('🏓 Ejecutando comando ping...');
                    const ping = Date.now() - message.createdTimestamp;
                    const latency = client.ws.ping;
                    
                    const pingEmbed = new EmbedBuilder()
                        .setTitle('🏓 Pong!')
                        .addFields(
                            { name: 'Latencia del Bot', value: `${ping}ms`, inline: true },
                            { name: 'Latencia del WebSocket', value: `${latency}ms`, inline: true },
                            { name: 'Estado', value: latency < 100 ? '🟢 Excelente' : latency < 300 ? '🟡 Buena' : '🔴 Lenta', inline: true }
                        )
                        .setColor('#ffaa00');

                    await message.reply({ embeds: [pingEmbed] });
                    break;

                case 'info':
                    console.log('ℹ️ Ejecutando comando info...');
                    const infoEmbed = new EmbedBuilder()
                        .setTitle('🤖 Información del Bot')
                        .setDescription('Bot de Discord para Community Stealth con funcionalidades anti-cheat')
                        .addFields(
                            { name: 'Nombre', value: client.user.username, inline: true },
                            { name: 'ID', value: client.user.id, inline: true },
                            { name: 'Versión', value: '2.0.0-Advanced', inline: true },
                            { name: 'Desarrollador', value: 'xpe.nettt', inline: true },
                            { name: 'Servidores', value: `${client.guilds.cache.size}`, inline: true },
                            { name: 'Usuarios Totales', value: `${client.users.cache.size}`, inline: true }
                        )
                        .setColor('#0099ff');

                    await message.reply({ embeds: [infoEmbed] });
                    break;

                default:
                    console.log('❌ Comando no reconocido:', command);
                    const unknownEmbed = new EmbedBuilder()
                        .setTitle('❌ Comando no reconocido')
                        .setDescription(`El comando \`${command}\` no existe. Usa \`${prefix}help\` para ver comandos disponibles.`)
                        .setColor('#ff0000');

                    await message.reply({ embeds: [unknownEmbed] });
                    break;
            }
            return;
        }

        // Si llega aquí, no es comando ni mención
        console.log('📝 Mensaje normal ignorado');

    } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
        await message.reply('❌ Ocurrió un error procesando el mensaje.');
    }
});

// Evento de Error
client.on('error', (error) => {
    console.error('❌ Error de Discord.js:', error);
});

// Evento de Warning
client.on('warn', (warning) => {
    console.warn('⚠️ Warning de Discord.js:', warning);
});

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Conectar el bot
console.log('🚀 Iniciando conexión a Discord...');
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log('✅ Login exitoso!');
}).catch(error => {
    console.error('❌ Error de login:', error);
    console.error('🔍 Detalles del error:', {
        message: error.message,
        code: error.code,
        type: error.type
    });
    process.exit(1);
});