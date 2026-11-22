"""Genera index.html totalmente autónomo (estilos, JS, SVG, video, canción, nubes).
Usa únicamente Python estándar. Abre index.html con doble clic, sin servidor.
"""
from pathlib import Path
import base64
import mimetypes
import re

ROOT=Path(__file__).resolve().parent
html=(ROOT/'src.html').read_text(encoding='utf-8')
css=(ROOT/'styles.css').read_text(encoding='utf-8')+'\n\n'+(ROOT/'movie-clouds.css').read_text(encoding='utf-8')
js=(ROOT/'app.js').read_text(encoding='utf-8')


def uri(filename):
    f=ROOT/filename
    if not f.is_file():
        raise FileNotFoundError(f)
    mime=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
    if f.suffix.lower()=='.svg':mime='image/svg+xml'
    return f'data:{mime};base64,{base64.b64encode(f.read_bytes()).decode("ascii")}'

# CSS may reference SVG / PNG / WebP / video poster JPG.
css=re.sub(r'url\(["\']?(assets/[^)"\']+)["\']?\)',lambda m:f'url("{uri(m.group(1))}")',css)
html=html.replace('  <link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="movie-clouds.css">','  <style>\n'+css+'\n  </style>')
# Embed source files for all matching asset src attrs. Links to Google Maps stay intact.
html=re.sub(r'src="(assets/[^"<>]+)"',lambda m:'src="'+uri(m.group(1))+'"',html)
html=html.replace('<script src="app.js"></script>','<script>\n'+js.replace('</script','<\\/script')+'\n</script>')
assert '<link rel="stylesheet"' not in html
assert 'src="assets/' not in html
assert '<script src="app.js"' not in html
out=ROOT/'index.html'
out.write_text(html,encoding='utf-8')
print('Creado',out,'(',round(out.stat().st_size/1024/1024,2),'MiB )')
