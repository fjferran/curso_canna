# Guía de Configuración: Google Calendar + CannabisEdu Platform

Sigue estos pasos para conectar tu calendario real con la aplicación web.

## Paso 1: Configurar Google Cloud Console

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un **Nuevo Proyecto** (llámalo por ejemplo "CannabisEdu-Calendar").
3.  En el menú lateral, ve a **APIs y Servicios** > **Biblioteca**.
4.  Busca **"Google Calendar API"** y haz clic en **Habilitar**.

## Paso 2: Crear la Credencial (API Key)

1.  Una vez habilitada, ve a **APIs y Servicios** > **Credenciales**.
2.  Haz clic en **+ CREAR CREDENCIALES** y selecciona **Clave de API**.
3.  Copia la clave que aparece (empieza por `AIza...`).
    *   *Recomendación de seguridad:* Haz clic en "Restringir clave" y en restricciones de API selecciona solo "Google Calendar API".

## Paso 3: Obtener el ID de tu Calendario

1.  Abre [Google Calendar](https://calendar.google.com/) en tu navegador.
2.  En la barra lateral izquierda, busca el calendario que quieres usar (o crea uno nuevo específico para el curso).
3.  Haz clic en los 3 puntos verticales del calendario y elige **Configuración y uso compartido**.
4.  Haz scroll hasta la sección **Permisos de acceso a los eventos**.
    *   Marca la casilla: **"Compartir públicamente"**.
    *   Es importante que selecciones **"Ver solo los detalles de los eventos (libre/ocupado)"** o **"Ver todos los detalles de los eventos"** (necesitamos "todos los detalles" para leer el título y descripción).
5.  Sigue bajando hasta la sección **Integrar el calendario**.
6.  Copia el valor que dice **"ID del calendario"** (normalmente parece un email largo o una cadena de letras y números terminada en `@group.calendar.google.com`).

## Paso 4: Conectar con la App

1.  En la carpeta de tu proyecto, crea un archivo llamado `.env.local` (si no existe).
2.  Añade las siguientes líneas con tus datos:

```bash
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=tu_clave_que_empieza_por_AIza...
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=tu_id_de_calendario@group.calendar.google.com
```

## Paso 5: Cómo crear eventos para que la App los entienda

Cuando crees un evento en Google Calendar:
*   **Título:** Será el título de la clase.
*   **Descripción:**
    *   Pon una breve descripción del evento.
    *   Si tienes un video, pega el enlace (YouTube, Vimeo, Drive) en cualquier parte de la descripción. La App lo detectará automáticamente.
    *   *Ejemplo:* "Clase sobre sustratos. Ver video preparatorio: https://youtu.be/xyz123"

---
**¿Listo?**
Avísame cuando tengas las claves y yo actualizaré el código para que deje de usar datos falsos y lea de tu calendario real.
