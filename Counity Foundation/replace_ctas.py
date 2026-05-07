import os
import re

file_path = r'c:\Users\sgcco\Desktop\IA SAAS\Counity\Counity Foundation\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the "que-es.html" CTA text
content = re.sub(
    r'<a href="que-es.html" class="btn btn-secondary">Conocé más sobre nuestra identidad <span class="arrow">→</span></a>',
    r'<a href="que-es.html" class="btn btn-secondary">Entender qué es Counity <span class="arrow">→</span></a>',
    content
)

# Replace the lands-cta-box content
old_lands_cta = r'<div class="lands-cta-box reveal">\s*<h3>¿Querés vivir en una <span class="text-gradient">Counity Land</span>\?</h3>\s*<p style="max-width: 600px; margin: 0 auto var\(--space-lg\);">Si te interesa el proyecto desde un lugar de habitante y estás listo para aplicar a una vivienda en las primeras comunidades activas, dirígete a nuestro portal de habitantes\.</p>\s*<a href="https://counity\.land" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">Ver visión en práctica <span class="arrow">→</span></a>\s*</div>'

new_lands_cta = r'''<div class="lands-cta-box reveal">
        <h3>El laboratorio de lo <span class="text-gradient">concreto</span></h3>
        <p style="max-width: 600px; margin: 0 auto var(--space-lg);">Las Lands son las infraestructuras físicas donde la visión de la Foundation se materializa y se testea de forma abierta.</p>
        <a href="las-lands.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">Explorar las Lands <span class="arrow">→</span></a>
      </div>'''

content = re.sub(old_lands_cta, new_lands_cta, content, flags=re.MULTILINE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
