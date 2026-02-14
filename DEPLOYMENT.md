# Guía de Despliegue en Hostinger VPS (Docker + Git)

Esta guía explica la mejor forma de desplegar tu aplicación `cannabis-platform` en un VPS de Hostinger y mantenerla sincronizada con tus cambios locales de forma sencilla.

## 1. Preparación Local

Asegúrate de que tu proyecto tiene los archivos `Dockerfile` y `docker-compose.yml` (ya creados).

1.  **Sube tu código a un repositorio Git (GitHub/GitLab/Bitbucket)**:
    Si aún no lo has hecho:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    # Crea un repo en GitHub y sigue las instrucciones para `git remote add origin ...`
    git push -u origin main
    ```

## 2. Preparación del VPS (Hostinger)

Accede a tu VPS vía SSH:
```bash
ssh root@tu-ip-del-vps
```

### Instalar Docker (si no lo tienes)
Si ya tienes otras apps con Docker, salta este paso.
```bash
# Actualizar paquetes
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose (si es necesario verificar versión)
docker compose version
```

### Configurar el Proyecto

1.  **Clonar el repositorio**:
    Navega a la carpeta donde guardas tus webs (ej: `/var/www` o `/home`):
    ```bash
    cd /var/www
    git clone https://github.com/tu-usuario/cannabis-platform.git
    cd cannabis-platform
    ```

2.  **Configurar Variables de Entorno**:
    Crea el archivo `.env.local` con tus claves reales de producción:
    ```bash
    nano .env.local
    ```
    Pega el contenido (API Keys, IDs, etc.) y guarda (`Ctrl+X`, `Y`, `Enter`).

3.  **Primer Despliegue**:
    Construye y levanta el contenedor:
    ```bash
    docker compose up -d --build
    ```
    Tu app estará corriendo en `http://tu-ip-del-vps:3000`.

    *Nota: Si necesitas usar otro puerto (ej: 80), edita `docker-compose.yml` y cambia `"3000:3000"` por `"80:3000"` (o usa Nginx como proxy inverso).*

## 3. Flujo de Trabajo para Actualizaciones

Para cumplir tu requisito de "modificar de forma sencilla en la nube":

### Paso A: En tu Ordenador (Local)
1.  Haz tus cambios en el código.
2.  Prueba que todo funciona: `npm run dev`.
3.  Sube los cambios a Git:
    ```bash
    git add .
    git commit -m "Nuevas funcionalidades o correcciones"
    git push origin main
    ```

### Paso B: En el VPS (Nube)
1.  Entra por SSH y ve a la carpeta:
    ```bash
    cd /var/www/cannabis-platform
    ```
2.  **Comando Mágico para Actualizar**:
    Ejecuta este comando combinado para bajar cambios y reconstruir solo lo necesario:
    ```bash
    git pull && docker compose up -d --build
    ```

¡Listo! Docker detectará los cambios, reconstruirá la imagen y reiniciará el contenedor con la nueva versión automáticamente.

## Resumen de Comandos

| Acción | Dónde | Comando |
| :--- | :--- | :--- |
| **Guardar cambios** | Local | `git push` |
| **Actualizar Web** | VPS | `git pull && docker compose up -d --build` |

---
**Tip Extra:** Puedes crear un alias en tu VPS para actualizar aún más rápido.
Edita `~/.bashrc` y añade:
`alias update-cannabis="cd /var/www/cannabis-platform && git pull && docker compose up -d --build"`
Luego solo tendrás que escribir `update-cannabis` al entrar al servidor.
