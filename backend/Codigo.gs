/**
 * Emily · Mis XV Años — registro privado en Google Sheets.
 * v2: confirmaciones individuales (1-2) y familiares (1-6).
 * Conectar desde la hoja: Extensiones > Apps Script.
 */
const EVENTO_EMILY = 'Emily · Mis XV Años';
const NOMBRE_HOJA = 'Confirmaciones';
const ID_HOJA_EMILY = '1qg85FhlRg3wVDGVZaY97y8zGoH5-jQj7WHxDHhhGssE';
const ENCABEZADOS = [
  'Fecha y hora', 'Invitado principal', '¿Asistirá?', 'Modalidad',
  'Total asistentes', 'Acompañantes',
  'Persona 1 - Nombres', 'Persona 1 - Apellidos',
  'Persona 2 - Nombres', 'Persona 2 - Apellidos',
  'Persona 3 - Nombres', 'Persona 3 - Apellidos',
  'Persona 4 - Nombres', 'Persona 4 - Apellidos',
  'Persona 5 - Nombres', 'Persona 5 - Apellidos',
  'Persona 6 - Nombres', 'Persona 6 - Apellidos',
  'Mensaje', 'Código de registro', 'Origen'
];
const COLUMNA_ID = 20; // T

function prepararHoja() {
  const libro = SpreadsheetApp.openById(ID_HOJA_EMILY);
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) hoja = libro.insertSheet(NOMBRE_HOJA);
  // Evita cambiar silenciosamente el significado de columnas con registros antiguos.
  if (hoja.getLastRow() >= 5 &&
      String(hoja.getRange(4, 7).getDisplayValue()) === 'Código de registro') {
    throw new Error('Esta hoja tiene registros del formato anterior. Haz una copia de seguridad y migra los datos antes de instalar la nueva versión.');
  }
  hoja.getRange(4, 1, 1, ENCABEZADOS.length).setValues([ENCABEZADOS]);
  hoja.getRange(4, 1, 1, ENCABEZADOS.length)
    .setFontWeight('bold').setBackground('#C29CA6').setFontColor('#FFFFFF');
  hoja.setFrozenRows(4);
  hoja.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  hoja.getRange('E:F').setNumberFormat('0');
  // Conserva los anchos de columna del diseño original de la plantilla.
  return 'La hoja está preparada para un máximo de seis asistentes por registro.';
}

function doGet() {
  return HtmlService.createHtmlOutput(
    '<html><body style="font-family:system-ui;padding:2rem">' +
    '<h2>Registro de invitados de Emily</h2>' +
    '<p>Confirma tu asistencia desde la invitación.</p></body></html>'
  );
}

function limpiarTexto(valor, limite) {
  const texto = String(valor == null ? '' : valor)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, limite);
  // Evita que una celda de Google Sheets interprete una entrada como fórmula.
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function responder(registro, correcto, mensaje) {
  const datos = {
    type: 'EMILY_XV_RSVP_RESULT',
    requestId: String(registro || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100),
    ok: !!correcto,
    message: String(mensaje || '')
  };
  const payload = JSON.stringify(datos).replace(/</g, '\\u003c');
  const contenido = `<!doctype html><html><head><meta charset="utf-8"></head><body>
    <p>${correcto ? 'Confirmación registrada.' : 'No se pudo registrar la confirmación.'}</p>
    <script>
      (function() {
        var mensaje = ${payload};
        try { window.parent.postMessage(mensaje, '*'); } catch (e) {}
        try { if (window.top !== window.parent) window.top.postMessage(mensaje, '*'); } catch (e) {}
      })();
    </script>
    </body></html>`;
  return HtmlService.createHtmlOutput(contenido)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const id = String(params.registrationId || '');
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(id)) return responder(id, false, 'Código inválido');
  if (String(params.website || '').trim()) return responder(id, false, 'Solicitud inválida');
  if (params.consent !== 'Sí') return responder(id, false, 'Falta consentimiento');

  const asistencia = params.attending === 'Sí' ? 'Sí' : params.attending === 'No' ? 'No' : '';
  if (!asistencia) return responder(id, false, 'Asistencia inválida');
  const asistira = asistencia === 'Sí';
  const modalidad = asistira ? String(params.groupType || '') : 'No aplica';
  if (asistira && modalidad !== 'Individual' && modalidad !== 'Familiar') {
    return responder(id, false, 'Modalidad inválida');
  }
  const maximo = modalidad === 'Familiar' ? 6 : 2;
  const cantidad = asistira ? Number(params.totalGuests) : 0;
  if (asistira && (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > maximo)) {
    return responder(id, false, 'Cantidad de asistentes inválida');
  }

  const nombres = [];
  for (let i = 1; i <= 6; i++) {
    const necesario = i === 1 || (asistira && i <= cantidad);
    const nombre = necesario ? limpiarTexto(params['firstName' + i], 60) : '';
    const apellidos = necesario ? limpiarTexto(params['lastName' + i], 60) : '';
    if (necesario && (nombre.length < 2 || apellidos.length < 2)) {
      return responder(id, false, 'Nombres y apellidos incompletos');
    }
    nombres.push(nombre, apellidos);
  }
  const principal = nombres[0] + ' ' + nombres[1];
  const mensaje = limpiarTexto(params.message, 240);

  const bloqueo = LockService.getScriptLock();
  try {
    bloqueo.waitLock(10000);
    const libro = SpreadsheetApp.openById(ID_HOJA_EMILY);
    if (!libro) throw new Error('No se encontró la hoja vinculada');
    const hoja = libro.getSheetByName(NOMBRE_HOJA);
    if (!hoja) throw new Error('Falta la hoja Confirmaciones. Ejecuta prepararHoja().');
    if (String(hoja.getRange(4, COLUMNA_ID).getDisplayValue()) !== 'Código de registro') {
      throw new Error('Estructura de hoja incompatible. Ejecuta prepararHoja().');
    }
    const ultima = hoja.getLastRow();
    if (ultima >= 5) {
      const encontrado = hoja.getRange(5, COLUMNA_ID, ultima - 4, 1)
        .createTextFinder(id).matchEntireCell(true).findNext();
      if (encontrado) return responder(id, true, 'Esta respuesta ya estaba registrada');
    }
    hoja.appendRow([
      new Date(), principal, asistencia, modalidad, cantidad,
      asistira ? cantidad - 1 : 0,
      ...nombres, mensaje, id, 'Invitación web Emily'
    ]);
    SpreadsheetApp.flush();
    return responder(id, true, 'Confirmación guardada');
  } catch (error) {
    console.error('Error de registro:', String(error));
    return responder(id, false, 'No se pudo guardar');
  } finally {
    if (bloqueo.hasLock()) bloqueo.releaseLock();
  }
}
