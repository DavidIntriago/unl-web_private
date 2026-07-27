#!/bin/bash

echo "Esperando Drupal..."

sleep 30

echo "Importando configuración..."

docker exec drupal11_app vendor/bin/drush cim -y

echo "Limpiando cache..."

docker exec drupal11_app vendor/bin/drush cr

echo "Configuración lista"