> **VERSIÓN CONECTADA:** ya se configuró la URL `/exec` proporcionada por el organizador. Abre `CONEXION_GOOGLE_SHEETS.md` para probar el registro. No es necesario volver a pegar el enlace.

# Emily · Mis XV Años — Video, nubes y música

Invitación web completa con apertura de sobre floral en malva rosa **#C29CA6**, video de estrellas que escribe el nombre de Emily, transición cinematográfica entre nubes y canción de fondo que empieza al terminar el video.

## Cómo abrir la invitación

**Opción 1 (más sencilla):** abre **`index.html`** con doble clic desde Descargas. Es un archivo autónomo: incluye los estilos, ilustraciones, video, nubes y música dentro del propio HTML. No necesita Internet ni Python.

**Opción 2 (editable en VS Code):** abre la carpeta con Visual Studio Code y usa la extensión Live Server para abrir `src.html`. Este archivo enlaza a `styles.css`, `movie-clouds.css`, `app.js` y los recursos de `assets/`.

## La secuencia

1. Aparece el sobre rosa con sello XV.
2. Toca el sobre. El sobre se abre y se revela el video de estrellas y el nombre de Emily.
3. Cuando el video termina, empieza automáticamente la canción enviada y se eleva gradualmente su volumen.
4. Al mismo tiempo, las nubes producidas con Python entran desde los lados, arriba y abajo.
5. Las nubes cubren el video y se disipan para mostrar la invitación con flores y mariposas.
6. La canción sigue sonando durante el recorrido y puede pausarse o reanudarse con el botón musical.

**Opciones:** «Saltar video» usa una versión breve de la transición. «Entrar directamente» omite el video y abre la invitación. «Volver a abrir el sobre» permite repetir el recorrido desde el inicio.

## Datos de la celebración

- Emily · Mis XV Años.
- Sábado **12 de diciembre de 2026**, a las **7:30 p. m.**
- **Hacienda Meléndez**.
- Google Maps: https://maps.app.goo.gl/pA8FTz4kBPpm9y8m6
- Código de vestimenta: **Formal / Gala**.

El año 2026 se conserva de la edición anterior; es editable en `src.html` y `app.js` si fuera necesario cambiarlo.

## Archivos

- `index.html`: web autónoma descargable.
- `src.html`: HTML editable.
- `styles.css`: diseño general de la invitación.
- `movie-clouds.css`: video y efecto de nubes.
- `app.js`: secuencia, audio, calendario, cuenta regresiva y confirmación.
- `assets/video/emily_estrellas.mp4`: el video que proporcionaste.
- `assets/audio/musica_emily.mp3`: la canción que proporcionaste.
- `assets/clouds/`: texturas de nubes originales producidas con Python.
- `tools/generar_nubes.py`: regenera las nubes (requiere NumPy, Pillow y OpenCV). **No es necesario ejecutarlo para abrir la web.**
- `generar_index.py`: reconstruye el HTML autónomo usando solo Python estándar si editas el proyecto.

Después de editar los archivos, desde VS Code o una terminal en esta carpeta:

```bash
python generar_index.py
```

## Nota sobre reproducción automática

La canción se prepara en silencio desde la interacción inicial con el sobre; comienza a escucharse una vez finaliza el video. Algunos navegadores, especialmente en teléfonos, pueden imponer restricciones adicionales al audio. En ese caso, la página conserva el botón **▶** para activar la canción manualmente. No se puede garantizar sonido automático en todos los navegadores o configuraciones.

## Confirmación de asistencia · versión actualizada

El botón **Confirmar asistencia** permite seleccionar entre:

- **Individual:** una persona, con la posibilidad de añadir una segunda. El total máximo es 2, contando al invitado principal.
- **Familiar:** desde 1 hasta 6 personas en total, contando al invitado principal.

Cada asistente debe escribir sus **nombres y apellidos por separado**. El formulario genera exactamente los campos necesarios y comprueba que estén completos. Si alguien marca «No podré asistir», solo registra los nombres y apellidos de quien responde, y el total de asistentes es 0. También hay un mensaje opcional para Emily.

El proyecto incluye **EMILY_XV_REGISTRO_INVITADOS.xlsx** con las pestañas Resumen, Confirmaciones e Instrucciones; la plantilla ya tiene columnas separadas para los seis asistentes. El archivo **`backend/Codigo.gs`** también está preparado para la nueva estructura y valida los límites desde el servidor, aunque se modificase el formulario.

**Importante:** el Excel de la carpeta es una plantilla. Todavía no se están almacenando confirmaciones reales: falta que el organizador conecte su propio Google Sheets mediante `ACTIVAR_GOOGLE_SHEETS.md`. Hasta ese momento el formulario muestra un aviso en lugar de afirmar que guardó el registro.

Los asistentes no necesitan introducir teléfonos ni documentos de identidad. El registro debe permanecer privado y accesible únicamente a los organizadores.
