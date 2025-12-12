#!/bin/bash
set -e

# Configuration
HOST="185.211.100.231"
USER="root"
PASS="talha4181."
REMOTE_DIR="/opt/doesta-backend"
SERVICE_NAME="doesta.service"

echo "1. Building Project (Self-Contained)..."
dotnet publish -c Release -o ./publish -r linux-x64 --self-contained true

echo "2. Configuring for SQLite Production..."
# We replace the remote connection string with SQLite one to use our local DB
# Use sed to replace content in the published file
sed -i '' 's/"DefaultConnection": ".*"/"DefaultConnection": "Data Source=doesta.db"/g' ./publish/appsettings.Production.json

echo "3. Preparing Remote Directory..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "mkdir -p $REMOTE_DIR"

echo "4. Stopping Service (if running)..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "systemctl stop doesta || true"

echo "5. Uploading Files..."
sshpass -p "$PASS" scp -o StrictHostKeyChecking=no -r ./publish/* $USER@$HOST:$REMOTE_DIR
echo "   Uploading Local Database..."
sshpass -p "$PASS" scp -o StrictHostKeyChecking=no ./doesta.db $USER@$HOST:$REMOTE_DIR/doesta.db

echo "   Setting Permissions..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "chmod +x $REMOTE_DIR/Doesta.WebApi"

echo "6. Configuring Systemd..."
sshpass -p "$PASS" scp -o StrictHostKeyChecking=no ./doesta.service $USER@$HOST:/etc/systemd/system/$SERVICE_NAME
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "systemctl daemon-reload && systemctl enable $SERVICE_NAME && systemctl restart $SERVICE_NAME"

echo "7. Verification..."
sleep 5
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$HOST "systemctl status $SERVICE_NAME --no-pager"

echo "Deployment Complete!"
