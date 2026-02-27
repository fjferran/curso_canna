#!/bin/bash

# Configuration
VPS_IP="72.60.190.86"
VPS_USER="root"
PROJECT_DIR="/var/www/cannabis-platform"
ENV_FILE=".env.local"

# Display info
echo "🚀 Iniciando proceso de actualización del entorno en el VPS ($VPS_IP)..."

# Step 1: Check if the local .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: No se encontró el archivo $ENV_FILE en el directorio local."
    exit 1
fi

# Step 2: Push the new .env.local via scp
echo "📦 1/3: Copiando .env.local local al VPS..."
scp "$ENV_FILE" "${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/${ENV_FILE}"

if [ $? -ne 0 ]; then
    echo "❌ Error al copiar el archivo al VPS. Comprueba tu conexión."
    exit 1
fi

echo "✅ 1/3: Archivo copiado satisfactoriamente."

# Step 3: Run the rebuild and restart commands via ssh
echo "🔄 2/3: Reconstruyendo y reiniciando contenedores en el VPS..."
ssh "${VPS_USER}@${VPS_IP}" "cd ${PROJECT_DIR} && docker compose down && docker compose up -d --build"

if [ $? -ne 0 ]; then
    echo "❌ Error durante la reconstrucción/reinicio de los contenedores Docker en el VPS."
    exit 1
fi

echo "✅ 2/3: Contenedores reiniciados satisfactoriamente."

echo "🎉 3/3: ¡Actualización completada exitosamente!"
