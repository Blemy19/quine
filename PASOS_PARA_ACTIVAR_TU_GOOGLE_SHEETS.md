# Emily XV — Activar las confirmaciones en Google Sheets

**Hoja ya preparada:** https://docs.google.com/spreadsheets/d/1qg85FhlRg3wVDGVZaY97y8zGoH5-jQj7WHxDHhhGssE/edit

La pestaña `Confirmaciones` ya cuenta con **21 columnas (A:U)** que incluyen hasta seis pares de nombres y apellidos. La pestaña `Resumen` cuenta las respuestas. El horario del archivo se configuró como **America/Lima**.

## 1. Vincular el código

1. Abre la hoja del enlace de arriba con la cuenta que administra el evento.
2. Ve a **Extensiones → Apps Script**.
3. Borra el código predeterminado y pega el contenido íntegro de `backend/Codigo.gs` (o `CODIGO_GOOGLE_SHEETS_EMILY_LISTO.gs`). Está configurado para el ID de esta hoja.
4. Guarda el proyecto. Selecciona la función `prepararHoja`, presiona **Ejecutar** y autoriza el acceso para esta cuenta.

## 2. Publicar el receptor

1. Abre **Implementar → Nueva implementación → Aplicación web**.
2. Elige **Ejecutar como: Yo** y **Acceso: Cualquier persona**. Esto no hace pública tu hoja; solamente el receptor de respuestas es accesible desde una invitación.
3. Pulsa **Implementar** y copia el enlace que empiece por `https://script.google.com/macros/s/` y termine en `/exec`.
4. **No compartas contraseñas, tokens ni el enlace de edición de la hoja con invitados**.

## 3. Conectar la invitación

**Forma más fácil:** abre `CONFIGURAR_URL_DE_REGISTRO.html`, selecciona `index.html` y pega el enlace `/exec`. Genera `EMILY_INVITACION_CON_REGISTRO.html`.

**Forma editable:** abre `app.js`, reemplaza `PEGAR_URL_GOOGLE_APPS_SCRIPT_AQUI` por el enlace `/exec`, guarda el archivo y ejecuta `python generar_index.py` para recrear `index.html`.

## 4. Pruebas

1. En la invitación conectada, registra una confirmación **individual de 2** y una **familiar de 6** con datos ficticios de prueba.
2. Comprueba que se guarden en `Confirmaciones` con nombres y apellidos por separado y que `Resumen` cambie sus totales.
3. Borra las filas de prueba de la hoja antes de compartir la invitación real.
4. Enviar una confirmación requiere Internet. Revisa la versión desplegada cada vez que actualices el código Apps Script.

## Protección

El receptor valida los nombres, la modalidad, el total de asistentes, el consentimiento y el código de registro. No facilita lectura pública de confirmaciones. Como cualquier formulario público puede recibir envíos no deseados, mantén la hoja privada y revisa periódicamente los registros.
