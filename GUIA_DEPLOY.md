# Guía de Despliegue: UNL Web Theme

## Requisitos previos: Instalación de Docker

### Desinstalar paquetes conflictivos

Ejecute el siguiente comando para desinstalar todos los paquetes conflictivos con Docker:

```bash
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-doc docker-buildx podman-docker containerd runc | cut -f1)
```

### Instalar usando el repositorio apt

**Configurar el repositorio apt de Docker:**

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

**Instalar los paquetes de Docker (última versión):**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Tras la instalación, verifique que Docker esté funcionando:**

```bash
sudo systemctl status docker
```

**Si Docker no se está ejecutando, inícielo manualmente:**

```bash
sudo systemctl start docker
```

---

## Despliegue del proyecto

### Paso 1: Clonar e iniciar contenedores

Asegúrate de estar en la rama correcta "main".

```bash
git clone <url-del-repo>
cd UNL-Web-Theme-Final
git switch <nombre_de_la_rama>
sudo docker compose -f docker-compose-deploy.yml up -d --build
```

### Paso 2: Instalar dependencias

Descarga el core de Drupal y los módulos contribuidos listados en tu `composer.json`.

```bash
sudo docker exec unl-app-container composer install
```

### Paso 3: Importar la base de datos

> **Nota importante:** Si el archivo `.sql` fue exportado desde una terminal de Windows y arroja el error de codificación `0xff`, primero conviértelo a UTF-8 ejecutando:
> ```bash
> iconv -f UTF-16 -t UTF-8 database/unl.sql > database/unl_utf8.sql
> ```
> y utiliza ese nuevo archivo.

```bash
sudo docker exec -i unl-db-container psql -U drupal drupaldb < database/unl.sql
```

### Paso 4: Configurar permisos de escritura (archivos e imágenes)

Para que Drupal pueda subir imágenes.

```bash
sudo docker exec unl-app-container mkdir -p web/sites/default/files
sudo docker exec unl-app-container chown -R www-data:www-data web/sites/default/files
sudo docker exec unl-app-container chmod -R 775 web/sites/default/files
```

### Paso 5: Sincronizar configuración y base de datos

Actualiza los esquemas de la BD, importa la configuración `.yml` del repositorio a la base de datos activa y limpia la caché.

```bash
sudo docker exec unl-app-container vendor/bin/drush updb -y
sudo docker exec unl-app-container vendor/bin/drush cim -y
sudo docker exec unl-app-container vendor/bin/drush cr
```

---

## Actualizaciones de Seguridad (Drupal Core)

Para cuando Drupal pida actualizar una nueva versión.

### Paso 1: Descargar la actualización del núcleo con Composer

```bash
sudo docker exec unl-app-container composer update "drupal/core-*" --with-all-dependencies
```

### Paso 2: Actualizar la base de datos

Aplica cualquier cambio estructural o de tablas que requiera la nueva versión del núcleo.

```bash
sudo docker exec unl-app-container vendor/bin/drush updb -y
```

### Paso 3: Exportar cambios de configuración

Registra los cambios automáticos en tus archivos `.yml` para mantener el repositorio limpio.

```bash
sudo docker exec unl-app-container vendor/bin/drush cex -y
```

### Paso 4: Limpiar la caché

Aplica los cambios finalmente.

```bash
sudo docker exec unl-app-container vendor/bin/drush cr
```

---

## Actualizaciones de Certificados

### Paso 1: Actualizar certificados en el servidor

Copia los nuevos certificados y pégalos en la ruta `/etc/ssl/unl/` de tu servidor, sobrescribiendo los antiguos.

> **Nota:** con los mismos nombres.

### Paso 2: Recarga de certificados nuevos

Ejecutar recarga en caliente. Como Nginx carga los certificados en la memoria RAM al encender, necesitas decirle que los lea de nuevo sin interrumpir los contenedores.

```bash
sudo docker exec unl-webapp-container nginx -s reload
```