# 🚀 Stealth-AntiCheatX v3.0

**Discord bot completo con sistema anti-cheat, IA MiniMax integrada, y configuración automática para Railway**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.14.1-blue.svg)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Características Principales

### 🛡️ Sistema Anti-Cheat Avanzado
- **Detección automática** de patrones sospechosos
- **Análisis comportamental** de usuarios
- **Reportes en tiempo real** al canal de soporte
- **Módulos especializados** para diferentes tipos de cheating

### 🤖 IA MiniMax Integrada
- **Chat inteligente** con comandos `$ai`
- **Texto a voz HD** con `$speak`
- **Análisis conversacional** avanzado
- **Respuestas contextuales** personalizadas

### 🔧 Módulos Técnicos
- **Repository Connector**: Monitoreo de repositorios GitHub
- **Axios Wrapper**: Gestión avanzada de HTTP requests
- **AntiCheat Analyzer**: Motor de análisis anti-cheat
- **Configuración Automática**: Setup completo con un comando

### 📊 Sistema de Canales
- **Canal de Chat IA**: Conversaciones libres con la IA
- **Canal de Comandos**: Ejecución de comandos del bot
- **Canal de Soporte**: Reportes y alertas del sistema
- **Análisis Automático**: Monitorización continua

## 🚀 Despliegue Rápido con Railway

### Opción 1: Railway (RECOMENDADO)

1. **Fork/Clone** este repositorio
2. **Conecta** tu cuenta de GitHub a Railway
3. **Despliega** automáticamente desde este repositorio
4. **Configura variables** de entorno en Railway dashboard

### Opción 2: Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/xpe-hub/stealth-bot-v3-clean.git
cd stealth-bot-v3-clean

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar bot
npm start
```

## ⚙️ Variables de Entorno

### Variables Requeridas en Railway:

```env
# === DISCORD BOT ===
DISCORD_BOT_TOKEN=tu_discord_bot_token
BOT_OWNER_ID=tu_discord_user_id
BOT_PREFIX=$

# === MINIMAX AI ===
MINIMAX_API_KEY=tu_minimax_api_key

# === CANALES DISCORD ===
CHAT_CHANNEL_ID=id_del_canal_chat_ia
CMD_CHANNEL_ID=id_del_canal_comandos
SUPPORT_CHANNEL_ID=id_del_canal_soporte

# === GITHUB (Opcional) ===
GITHUB_TOKEN=tu_github_personal_access_token

# === WEBHOOK ANTI-CHEAT (Opcional) ===
ANTICHEAT_WEBHOOK_URL=webhook_para_reportes
```

## 💬 Comandos Disponibles

### Comandos de IA:
- `$ai [mensaje]` - Chat con IA MiniMax
- `$speak [texto]` - Texto a voz HD
- `$voices` - Lista voces disponibles
- `$clear_chat` - Limpiar historial de chat

### Comandos de Estado:
- `$status` - Estado del bot y sistema
- `$help` - Lista completa de comandos
- `$ping` - Verificar latencia

### Comandos de Voz:
- `$join` - Unirse al canal de voz
- `$leave` - Salir del canal de voz

## 🔧 Configuración de Discord

### 1. Crear Aplicación Discord:
- Ve a [Discord Developer Portal](https://discord.com/developers/applications)
- Crea nueva aplicación → Bot
- Copia el **Bot Token**

### 2. Configurar Permisos:
- **Administrator** (para todos los permisos)
- O permisos específicos para canales

### 3. Invitar Bot:
```
https://discord.com/api/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## 📁 Estructura del Proyecto

```
stealth-bot-v3-clean/
├── bot.js                    # Archivo principal del bot
├── package.json              # Dependencias y configuración
├── .gitignore               # Archivos ignorados por git
├── README.md                # Este archivo
├── install.js               # Script de instalación automática
├── install.sh               # Script de instalación Linux/Mac
├── nixpacks.toml            # Configuración para Railway
├── minimax_advanced_ai.js   # Módulo de IA MiniMax
├── anticheat_analyzer_advanced.js  # Motor anti-cheat
├── axios-wrapper.js         # Gestor de HTTP requests
├── repository_connector.js  # Conector de repositorios
├── RAILWAY_VARIABLES.md     # Documentación de variables
└── INSTALLATION_GUIDE.md    # Guía de instalación completa
```

## 🏗️ Arquitectura del Sistema

### Módulos Principales:
1. **Discord.js Integration**: Base del bot de Discord
2. **MiniMax AI Service**: Servicios de IA integrados
3. **AntiCheat Engine**: Motor de detección anti-cheat
4. **Repository Monitor**: Monitor de cambios en repositorios
5. **Configuration Manager**: Gestión de configuración automática

### Flujo de Datos:
```
Discord User → Commands → Bot Core → MiniMax AI/AntiCheat → Response/Webhook
```

## 🔒 Seguridad

- **Variables de entorno** para todas las credenciales
- **Sin tokens hardcodeados** en el código
- **Token scanning** automático para prevenir leaks
- **Permisos mínimos** necesarios para funcionar
- **Logs seguros** sin información sensible

## 📊 Monitoreo

### Métricas Disponibles:
- **Comandos ejecutados** por tiempo
- **Usuarios activos** en canales específicos
- **Alertas anti-cheat** generadas
- **Respuestas de IA** procesadas
- **Estado de servicios** externos

### Logs:
- **Nivel INFO**: Operaciones normales
- **Nivel WARN**: Alertas y problemas
- **Nivel ERROR**: Errores críticos
- **Nivel DEBUG**: Información detallada

## 🚀 Roadmap v3.1

- [ ] **Dashboard web** para gestión
- [ ] **Métricas avanzadas** en tiempo real
- [ ] **Integración con más plataformas** de gaming
- [ ] **Sistema de plugins** modulares
- [ ] **API REST** para integraciones externas

## 🤝 Contribución

Este es un proyecto personal. Para contribuciones o mejoras, crea un **Issue** o **Pull Request**.

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/xpe-hub/stealth-bot-v3-clean/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/xpe-hub/stealth-bot-v3-clean/wiki)

---

**Desarrollado con ❤️ por MiniMax Agent**

> 🚀 **Stealth-AntiCheatX v3.0** - La nueva generación de bots anti-cheat inteligentes