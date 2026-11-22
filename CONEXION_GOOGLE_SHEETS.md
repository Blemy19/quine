# Invitación Emily XV — Google Sheets conectado

**Estado:** La invitación tiene configurada la URL publicada de Apps Script. Falta probar una confirmación real desde el navegador y comprobar que aparezca en Google Sheets. No se han enviado confirmaciones de prueba por este proceso.

- **Hoja privada:** https://docs.google.com/spreadsheets/d/1qg85FhlRg3wVDGVZaY97y8zGoH5-jQj7WHxDHhhGssE/edit
- **Aplicación web:** https://script.google.com/macros/s/AKfycbzssADhO71SkFdGVf2eymUXcgbyU4_Tx_sRwHFf9X6cVTW051gnna8_mHn0ZpE_-aqtfQ/exec
- **Invitación para compartir:** `index.html` (todo incluido, 10 MB aprox.).
- **Versión editable:** `src.html` + `app.js` + `styles.css`, archivos en `assets/`. Para regenerar ejecuta `python generar_index.py`.

## Cómo probar antes de enviar a los invitados

1. Abre `index.html` en Chrome o Edge **con Internet**. Pulsa "Saltar introducción" si deseas.
2. Abre **Confirmar asistencia**.
3. Selecciona **Individual** y **2 personas**. Escribe nombres y apellidos ficticios para ambos; activa el consentimiento y pulsa enviar.
4. Espera el mensaje **«Tu respuesta quedó registrada»** y revisa la pestaña `Confirmaciones` de la hoja privada. Debe aparecer una nueva fila con modalidad Individual, total 2 y los dos pares de nombres y apellidos.
5. Para el segundo control, selecciona **Familiar**, elige 6 y comprueba que aparezcan seis pares de campos. Puedes hacer una segunda prueba y eliminar las filas de prueba después.
6. Comprueba la pestaña `Resumen`. Los totales deberían actualizarse automáticamente.

## Si no llega una confirmación

- Verifica que la implementación siga activa y que ejecute como la cuenta organizadora, con acceso de aplicación web «Cualquier persona».
- Confirma que el código publicado sea el mismo contenido de `backend/Codigo.gs`. Si vuelves a editarlo, crea una **nueva versión de la implementación** para actualizar el enlace `/exec`.
- Ejecuta `prepararHoja` en el editor de Apps Script si aún no lo hiciste.
- Revisa «Ejecuciones» en Apps Script y la pestaña `Confirmaciones` para detectar posibles errores.
- La hoja debe seguir **privada**; el enlace de edición no debe compartirse con invitados.

**Seguridad:** Este es un receptor público de registros de asistencia; cualquier persona que tenga la URL puede intentar enviar respuestas. Revisa los registros y restringe el acceso de edición de la hoja a organizadores.
