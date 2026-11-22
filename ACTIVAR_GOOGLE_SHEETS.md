# Conectar el registro de los XV de Emily con Google Sheets

Ya está preparada la **plantilla Excel** y el **código de conexión**. **Todavía no existe una conexión real con tu cuenta:** la debes autorizar y publicar tú desde Google para proteger tus datos. No compartas tu contraseña.

## 1. Crear tu Google Sheets (2 minutos)

1. Entra a [Google Drive](https://drive.google.com) con tu cuenta.
2. Sube `EMILY_XV_REGISTRO_INVITADOS.xlsx`.
3. Ábrelo con **Hojas de cálculo de Google**. Si aparece como archivo de Excel en lugar de hoja nativa, selecciona **Archivo → Guardar como Hojas de cálculo de Google**.
4. Ponle un nombre como **Confirmaciones XV Emily**. Comprueba que existan las pestañas **Resumen**, **Confirmaciones** y **Instrucciones**.
5. Mantén la hoja como **Privada**, compartida solo con los organizadores que tú decidas. **No la publiques ni compartas la hoja con los invitados.**

## 2. Crear la conexión (Google Apps Script)

1. Desde tu hoja de Google abierta, selecciona **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` que aparezca por defecto.
3. Copia y pega el contenido completo del archivo `backend/Codigo.gs` incluido en el ZIP.
4. Guarda el proyecto. En el selector de funciones, elige `prepararHoja` y pulsa **Ejecutar** una sola vez. Acepta los permisos solicitados por Google para tu propia hoja.
5. Abre **Implementar → Nueva implementación → Tipo: Aplicación web**.
6. En **Ejecutar como**, selecciona **Yo**. En **Quién tiene acceso**, selecciona **Cualquier persona** para permitir que los invitados respondan sin una cuenta de Google.
7. Pulsa **Implementar** y copia la **URL de la aplicación web** que termina en `/exec`.

**Privacidad:** “Cualquier persona” se aplica **solo al formulario que recibe respuestas**, no a tu archivo de Google Sheets. El registro sigue privado. Este tipo de enlace público puede recibir intentos de spam, por lo que el proyecto incluye validación, un campo antirrobots y prevención de reintentos duplicados, pero no protección total contra abusos. No publiques el enlace de la hoja.

## 3. Pegar el enlace en tu invitación

**Método sencillo, sin programación:** abre `CONFIGURAR_URL_DE_REGISTRO.html`, selecciona el `index.html` de Emily y pega la URL `/exec`. Pulsa **Generar invitación conectada**. Recibirás el archivo `EMILY_INVITACION_CON_REGISTRO.html`, listo para compartir. Haz una prueba antes de enviarlo.

**Método para editar desde VS Code:**

1. Abre `app.js` en Visual Studio Code.
2. Busca el texto **`PEGAR_URL_GOOGLE_APPS_SCRIPT_AQUI`**.
3. Sustitúyelo por la URL completa que copiaste, manteniendo las comillas simples. Por ejemplo:

   ```js
   const EMILY_RSVP_WEBAPP_URL = 'https://script.google.com/macros/s/TU_IDENTIFICADOR/exec';
   ```

4. Guarda `app.js`.
5. Ejecuta **`python generar_index.py`** dentro de la carpeta de la invitación para actualizar el `index.html` autónomo.
6. Comparte el `index.html` actualizado o publica la carpeta con tu hosting. La invitación necesita Internet **solo al enviar las respuestas al Google Sheets**.

## 4. Prueba antes de compartir

1. Abre la invitación, reproduce o salta el video y entra en **Confirmar asistencia**.
2. Marca **Sí**, elige **Individual** y selecciona **2 personas**. Escribe los nombres y apellidos de ambas.
3. Pulsa **Enviar confirmación**. La web debe indicar **“Tu respuesta quedó registrada”**.
4. Abre la pestaña **Confirmaciones** de Google Sheets y verifica que aparezca una nueva fila. En **Resumen**, los indicadores deben actualizarse.
5. Borra esa fila de prueba antes de enviar la invitación real.

Si la web dice que **no pudo comprobar** el envío, no des por registrado al invitado hasta revisar la hoja. Comprueba que la implementación sea **Aplicación web → Ejecutar como: Yo → Cualquier persona** y que la URL copiada termine en `/exec`. Después prueba también la modalidad **Familiar** con 6 personas, y comprueba que se guarden los seis pares de nombres y apellidos.

## Datos recogidos (versión 2)

- Fecha y hora automática.
- Nombre completo del invitado principal.
- Si asistirá o no.
- Modalidad **Individual** o **Familiar** (si responde que no asistirá, «No aplica»).
- Total de asistentes: 1-2 para Individual; 1-6 para Familiar; 0 para «No asistiré».
- Número de acompañantes, calculado automáticamente (total menos 1).
- Columnas para **nombres** y **apellidos** de cada una de las seis personas, por separado.
- Mensaje opcional para Emily.
- Código de registro para evitar duplicaciones accidentales al reintentar.

La pestaña **Confirmaciones** contiene 21 columnas (A:U); `backend/Codigo.gs` debe ser la versión incluida en este ZIP. **No uses el backend antiguo**, porque no guarda los nombres de los acompañantes ni controla los nuevos límites. Si ya tienes registros en una hoja creada con la versión anterior, haz una copia de seguridad y migra su estructura antes de sustituir los encabezados: el programa no realizará una migración automática.

No se pide número de teléfono, dirección ni documento de identidad. Limita el acceso a la hoja y elimina los datos cuando ya no sean necesarios.

## Enlaces útiles
- Google Drive: https://drive.google.com
- Ayuda de Apps Script: https://developers.google.com/apps-script/guides/web
