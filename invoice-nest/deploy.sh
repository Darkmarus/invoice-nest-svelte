#!/bin/bash

# Script para desplegar Invoice-Backend en servidor remoto
# Uso: ./deploy-backend.sh
# Requiere: Docker local, acceso SSH a 192.168.1.124 como 'omar'

set -e  # Salir si hay error

echo "Construyendo imagen Docker..."
docker build -t invoice-backend .

echo "Exportando imagen a tar..."
docker save invoice-backend > invoice-backend.tar

echo "Transfiriendo imagen al servidor (ingresa contraseña si se pide)..."
scp invoice-backend.tar omar@192.168.1.124:/home/omar/

echo "Conectando al servidor y desplegando (ingresa contraseña si se pide)..."
ssh omar@192.168.1.124 << 'EOF'
    echo "Deteniendo contenedor existente si está corriendo..."
    cd ~/compose/invoice
    docker compose down invoice-backend || true  # Ignora errores si no hay contenedor

    echo "Cargando nueva imagen..."
    docker load < /home/omar/invoice-backend.tar

    echo "Ejecutando Compose con la nueva imagen..."
    docker compose up -d invoice-backend
EOF

echo "Limpieza: borrando archivo temporal..."
rm invoice-backend.tar

echo "Despliegue completado."
