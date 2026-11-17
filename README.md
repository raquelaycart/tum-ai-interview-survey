# TUM · AI in Asset Management — Interview web

Dos versiones del mismo cuestionario (mismo motor, mismas preguntas, EN/DE):

- `index.html` — versión elegida (Fintech, oscura). La alternativa Editorial queda archivada en `_alt-editorial/` (no hace falta subirla).


Enviad a los gestores la URL raíz.

## Probar en local
```bash
cd tum-ai-survey && python3 -m http.server 8765
# abrir http://localhost:8765/index.html
```
Sin `ENDPOINT` configurado funciona en **modo vista previa** (aparece una etiqueta; no se envía nada, las respuestas salen por consola).

## Conectar con Google Sheets (5 min)
1. Crea un Google Sheet nuevo (p. ej. "TUM AI interviews").
2. `Extensiones → Apps Script`. Borra el contenido y pega `apps-script/Code.gs`.
3. (Opcional) pon un `TOKEN` y/o `NOTIFY_EMAIL` en `CONFIG` (arriba del script).
4. `Implementar → Nueva implementación → Tipo: Aplicación web` · *Ejecutar como:* **Yo** · *Quién tiene acceso:* **Cualquier persona** → Implementar → autoriza permisos.
5. Copia la URL que termina en `/exec` a `config.js` → `ENDPOINT` (y el mismo `TOKEN` si lo usaste). Rellena también `CONTACT_NAME` / `CONTACT_EMAIL` (aviso de privacidad).
6. Haz una respuesta de prueba: debe aparecer una fila en la pestaña `Responses`.

Si cambias el código del script, hay que hacer `Implementar → Gestionar implementaciones → Editar → Nueva versión`.

## Qué recibís en el Sheet
- `Applications`: **una fila por aplicación de IA** (etapa, cadena de valor, rol y descripción; se rellena sola).
- `Responses`: **una fila por entrevistado**. Se guarda tras cada sección (Status = `Partial`) y se actualiza hasta `Complete`, así no perdéis datos si alguien abandona. Las columnas siempre salen en inglés aunque respondan en alemán.
- `Follow-ups`: email y preferencias (resumen de resultados / llamada) del final.

## Publicar (gratis)
Arrastra la carpeta `tum-ai-survey` a **Netlify Drop** (app.netlify.com/drop) o súbela a GitHub Pages. También vale el hosting de TUM. Edita textos en `survey-data.js`.

## Antes de enviarlo
- Pasad el aviso de privacidad (`survey-data.js` → `ui.privacy`) por vuestro supervisor/TUM (GDPR).
- Haced una prueba completa en móvil y en alemán.

## Google Sheet
- **Summary**: una única página con el resumen de todos (KPIs, índice de entrevistados con enlace, tablas de frecuencia, rankings, aplicaciones de IA, respuestas abiertas).
- **Una pestaña por entrevistado**, con el nombre de su empresa: preguntas y respuestas en orden.
- Pestañas grises al final: Follow-ups, Applications, Raw data.
- Ya no hay grabación de audio.
