#!/bin/bash

# Configuration (based on update_env_vps.sh)
VPS_IP="72.60.190.86"
VPS_USER="root"
PROJECT_DIR="/var/www/cannabis-platform"
ARTIFACTS_FILE="lib/artifacts.json"

echo "🚀 Iniciando despliegue de artifacts.json al VPS ($VPS_IP)..."

if [ ! -f "$ARTIFACTS_FILE" ]; then
    echo "❌ Error: No se encontró $ARTIFACTS_FILE localmente."
    exit 1
fi

echo "📦 1/1: Copiando artifacts.json al VPS..."
scp "$ARTIFACTS_FILE" "${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/${ARTIFACTS_FILE}"

if [ $? -ne 0 ]; then
    echo "❌ Error al copiar artifacts.json al VPS."
    exit 1
fi

echo "✅ Despliegue completado satisfactoriamente."
echo "Los usuarios ahora deberían tener acceso a los PDFs locales en el VPS."
