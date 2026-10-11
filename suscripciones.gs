/**
 * Trasfondo · recibe correos de suscripción y los guarda en esta hoja de Google.
 * Cómo usarlo:
 * 1) Crea una hoja de cálculo en tu Drive (privada) y ponle "Suscriptores Trasfondo".
 * 2) Extensiones > Apps Script. Borra lo que haya y pega este archivo completo. Guarda.
 * 3) Implementar > Nueva implementación > tipo "Aplicación web".
 *      Ejecutar como: Yo.   Quién tiene acceso: Cualquier persona.
 *    Autoriza los permisos cuando los pida y copia la URL que termina en /exec.
 * 4) Pega esa URL en FORM_ENDPOINT dentro de index.html.
 * Cada vez que cambies este código debes crear una NUEVA versión de la implementación.
 */
const HOJA = 'Suscriptores';

function doPost(e) {
  const p = (e && e.parameter) || {};
  const correo = String(p.correo || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return ContentService.createTextOutput('correo no válido');
  }
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
  if (hoja.getLastRow() === 0) hoja.appendRow(['Fecha', 'Correo', 'Origen', 'Pieza']);
  // evita duplicados
  const existentes = hoja.getLastRow() > 1 ? hoja.getRange(2, 2, hoja.getLastRow() - 1, 1).getValues().flat() : [];
  if (existentes.indexOf(correo) === -1) {
    hoja.appendRow([new Date(), correo, String(p.origen || ''), String(p.pieza || '')]);
  }
  return ContentService.createTextOutput('ok');
}
