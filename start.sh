#!/bin/bash

# 🚀 INICIADOR AUTOMÁTICO - Stealth AntiCheat Bot v2.0
# Bot de Discord con funcionalidades anti-cheat avanzadas
# Desarrollado por: xpe.nettt

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Banner
show_banner() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  🤖 STEALTH ANTICHEAT BOT v2.0      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     Iniciador Automático           ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
    echo ""
}

# Verificaciones del sistema
check_system() {
    echo -e "${BLUE}🔍 Verificando sistema...${NC}"
    
    # Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no encontrado${NC}"
        echo -e "${YELLOW}📥 Instala Node.js desde: https://nodejs.org/${NC}"
        exit 1
    fi
    
    # npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm no encontrado${NC}"
        exit 1
    fi
    
    # Dependencias
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}❌ Dependencias no instaladas${NC}"
        echo -e "${YELLOW}💡 Ejecuta: npm install${NC}"
        exit 1
    fi
    
    # Archivo .env
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ Archivo .env no encontrado${NC}"
        echo -e "${YELLOW}💡 Ejecuta: node setup.js${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Sistema verificado${NC}"
    echo ""
}

# Verificar configuración
check_config() {
    echo -e "${BLUE}📋 Verificando configuración...${NC}"
    
    # Cargar .env
    if [ -f .env ]; then
        source .env
    fi
    
    # Verificar tokens críticos
    local errors=0
    
    if [[ -z "$DISCORD_BOT_TOKEN" || "$DISCORD_BOT_TOKEN" == "YOUR_DISCORD_BOT_TOKEN_HERE" ]]; then
        echo -e "${RED}❌ DISCORD_BOT_TOKEN no configurado${NC}"
        errors=$((errors + 1))
    fi
    
    if [[ -z "$BOT_OWNER_ID" || "$BOT_OWNER_ID" == "YOUR_DISCORD_USER_ID_HERE" ]]; then
        echo -e "${RED}❌ BOT_OWNER_ID no configurado${NC}"
        errors=$((errors + 1))
    fi
    
    if [ $errors -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}💡 Configura el archivo .env o ejecuta: node setup.js${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Configuración correcta${NC}"
    echo ""
}

# Crear directorios necesarios
create_dirs() {
    echo -e "${BLUE}📁 Preparando directorios...${NC}"
    mkdir -p logs data backup
    echo -e "${GREEN}✅ Directorios listos${NC}"
    echo ""
}

# Mostrar información de estado
show_status() {
    echo -e "${CYAN}📊 Estado del Bot:${NC}"
    echo -e "   🕐 Inicio: $(date)"
    echo -e "   🤖 Nombre: Stealth AntiCheat Bot"
    echo -e "   🔧 Versión: 2.0.0"
    echo -e "   👤 Propietario: $BOT_OWNER_ID"
    
    if [ ! -z "$MINIMAX_API_KEY" ] && [ "$MINIMAX_API_KEY" != "YOUR_MINIMAX_API_KEY_HERE" ]; then
        echo -e "   🤖 IA: MiniMax AI Activado"
    else
        echo -e "   🤖 IA: MiniMax AI Desactivado"
    fi
    
    echo ""
}

# Función de ayuda
show_help() {
    echo -e "${BLUE}📖 Opciones disponibles:${NC}"
    echo -e "   ${YELLOW}./start.sh${NC}           - Iniciar bot normal"
    echo -e "   ${YELLOW}./start.sh --logs${NC}   - Iniciar con logs en tiempo real"
    echo -e "   ${YELLOW}./start.sh --help${NC}   - Mostrar esta ayuda"
    echo ""
}

# Función para manejar cierre
handle_exit() {
    echo ""
    echo -e "${YELLOW}🛑 Bot detenido${NC}"
    echo -e "${BLUE}📁 Logs guardados en: logs/stealth-bot.log${NC}"
    
    # Guardar log de cierre
    echo "$(date): Bot stopped" >> logs/bot.log
    
    exit 0
}

# Configurar manejadores de señal
trap 'handle_exit' INT TERM EXIT

# Procesar argumentos
case "$1" in
    --help|-h)
        show_banner
        show_help
        exit 0
        ;;
    --logs|-l)
        MODE="logs"
        ;;
    *)
        MODE="normal"
        ;;
esac

# Proceso principal
main() {
    show_banner
    check_system
    check_config
    create_dirs
    show_status
    
    echo -e "${PURPLE}🚀 Iniciando Stealth AntiCheat Bot...${NC}"
    echo -e "${YELLOW}   💡 Presiona Ctrl+C para detener${NC}"
    echo ""
    
    # Crear log de inicio
    echo "$(date): Bot starting..." >> logs/bot.log
    
    # Ejecutar bot
    if [ "$MODE" = "logs" ]; then
        echo -e "${BLUE}📋 Modo logs activado${NC}"
        echo ""
        npm start 2>&1 | tee -a logs/bot.log
    else
        echo -e "${GREEN}🔄 Bot ejecutándose...${NC}"
        echo -e "${BLUE}📁 Logs: logs/bot.log${NC}"
        echo -e "${YELLOW}💡 Para ver logs: ./start.sh --logs${NC}"
        echo ""
        npm start > logs/bot.log 2>&1
    fi
}

# Ejecutar
main "$@"