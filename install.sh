#!/bin/bash

# 🚀 INSTALADOR AUTOMÁTICO - Stealth AntiCheat Bot v2.0
# Bot de Discord con funcionalidades anti-cheat avanzadas
# Desarrollado por: xpe.nettt

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
clear
echo -e "${PURPLE}╔══════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║${NC}  🤖 STEALTH ANTICHEAT BOT v2.0      ${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}     Instalador Automático          ${PURPLE}║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════╝${NC}"
echo ""

# Verificar Node.js
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo -e "${YELLOW}📥 Descarga e instala Node.js desde: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
echo ""

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${BLUE}📋 Creando archivo de configuración...${NC}"
    cp .env.template .env
    echo -e "${YELLOW}⚠️ Archivo .env creado - Debes configurarlo antes de continuar${NC}"
    echo ""
fi

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install --silent

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Crear directorios
mkdir -p logs data backup

echo -e "${GREEN}✅ Directorios creados${NC}"
echo ""

# Resultado
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  🎉 INSTALACIÓN COMPLETADA            ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  🤖 Bot listo para configurar         ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📋 PRÓXIMOS PASOS:${NC}"
echo -e "1. ${YELLOW}Editar .env${NC}: Configura tus tokens"
echo -e "2. ${YELLOW}Ejecutar setup${NC}: node setup.js"
echo -e "3. ${YELLOW}Iniciar bot${NC}: node start.sh"
echo ""

echo -e "${GREEN}⚡ Para inicio rápido: node setup.js${NC}"
echo -e "${BLUE}🌐 Soporte: xpepanels@gmail.com${NC}"
echo ""