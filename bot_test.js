// ========================================================
// BOT DE PRUEBA LIMPIO - 2025-11-28 12:18:17
// Archivo completamente nuevo para forzar Railway a usar versión correcta
// ========================================================

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Bot limpio iniciado exitosamente como ${client.user.tag}!`);
    console.log(`📅 Iniciado: ${new Date().toISOString()}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    const prefix = '$';
    
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        switch (command) {
            case 'ping':
                const pingEmbed = new EmbedBuilder()
                    .setTitle('🏓 Pong!')
                    .setDescription(`Latencia: ${client.ws.ping}ms`)
                    .setColor('#00ff00');
                await message.reply({ embeds: [pingEmbed] });
                break;
                
            case 'help':
                const helpEmbed = new EmbedBuilder()
                    .setTitle('📋 Comandos Disponibles')
                    .addFields(
                        { name: '🏓 Ping', value: '`$ping` - Verificar estado del bot', inline: true },
                        { name: '📊 Info', value: '`$info` - Información del bot', inline: true },
                        { name: '🔧 Test', value: '`$test` - Prueba de funcionamiento', inline: true }
                    )
                    .setFooter({ text: `Prefijo: ${prefix}` })
                    .setColor('#0099ff');
                await message.reply({ embeds: [helpEmbed] });
                break;
                
            case 'info':
                const infoEmbed = new EmbedBuilder()
                    .setTitle('📊 Información del Bot')
                    .setDescription('Bot de prueba funcionando correctamente')
                    .addFields(
                        { name: 'Estado', value: '✅ Online', inline: true },
                        { name: 'Versión', value: '1.0.0-test', inline: true },
                        { name: 'Uptime', value: `${Math.floor(client.uptime / 1000 / 60)} minutos`, inline: true }
                    )
                    .setColor('#0099ff');
                await message.reply({ embeds: [infoEmbed] });
                break;
                
            case 'test':
                await message.reply('✅ Test exitoso - Bot funcionando correctamente!');
                break;
        }
    }
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    console.error('❌ ERROR: No se encontró DISCORD_BOT_TOKEN');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('❌ Error al conectar el bot:', error.message);
    process.exit(1);
});

console.log('🚀 Iniciando bot de prueba limpio...');