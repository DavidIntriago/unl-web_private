#!/usr/bin/env bash
set -euo pipefail

# --- Configuración ---
CONTAINER_DB="drupal11_postgres"
CONTAINER_APP="drupal11_app"
DB_USER="drupal"
DB_NAME="drupaldb"
BACKUP_DIR="./backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

mkdir -p "$BACKUP_DIR"

echo "==> 1/5 Haciendo backup de la base de datos..."
sudo docker exec -t "$CONTAINER_DB" pg_dump -U "$DB_USER" -c "$DB_NAME" > "$BACKUP_FILE"
echo "    Backup guardado en: $BACKUP_FILE"

echo "==> 2/5 composer install..."
sudo docker exec "$CONTAINER_APP" composer install

echo "==> 3/5 drush updb (actualizando base de datos)..."
sudo docker exec "$CONTAINER_APP" vendor/bin/drush updb -y

echo "==> 4/5 drush cim (importando configuración)..."
sudo docker exec "$CONTAINER_APP" vendor/bin/drush cim -y

echo "==> 5/5 drush cr (limpiando caché)..."
sudo docker exec "$CONTAINER_APP" vendor/bin/drush cr

echo "Deploy completado con éxito."
