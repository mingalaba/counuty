# Backlog de Pendientes — Counity

Este backlog centraliza las tareas de evolución técnica, narrativa y operativa del ecosistema Counity. Se basa en la visión de ser un **laboratorio vivo** y un **sistema en construcción**.

## 🚀 Prioridad Alta (Q3 2026)

| Tarea | Categoría | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **Optimizar versión mobile** | UX/UI | Asegurar que la experiencia sea fluida y responsiva en dispositivos móviles (Core del acceso en territorio). | 🟢 Pendiente |
| **Revisar narrativa de cada página** | Narrativa | Ajustar textos de `index`, `que-es`, `como-funciona`, etc., al modelo v3 (Strategic Narrative). | 🟡 En Revisión |
| **Explicar mejor las Lands** | Producto | Bajar la idea a la realidad: menos "utopía naif", más "sistema operativo regenerativo" con datos concretos. | 🟢 Pendiente |
| **Implementar suscripción newsletter** | Conversión | Crear canal directo para compartir el proceso (Build in Public). | 🟢 Pendiente |

## 🛠️ Evolución Técnica & Performance

| Tarea | Categoría | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **Optimizar SEO** | Marketing | Visibilidad semántica alineada a términos de regeneración y comunidad. | 🟢 Pendiente |
| **Optimizar Performance** | Tech | Mejora de tiempos de carga (Lighthouse) y optimización de assets. | 🟢 Pendiente |
| **Implementar métricas** | Data | Medir interacciones clave para iterar el modelo de laboratorio. | 🟢 Pendiente |
| **Automatizar formularios** | Tech | Conexión de formularios con CRM/Bases de datos para gestión de Co-Units. | 🟢 Pendiente |

## 🌐 Nuevas Secciones & Canales

| Tarea | Categoría | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **Landing Co-Units** | Producto | Sección dedicada a las unidades funcionales y su propuesta de valor. | 🟢 Pendiente |
| **Form general de contacto** | Canal | Punto de entrada simplificado para consultas generales. | 🟢 Pendiente |
| **Agregar Telegram** | Canal | Link a la comunidad abierta para coordinación rápida. | 🟢 Pendiente |
| **Bot para guiarte** | IA / UX | Asistente contextual que ayude a navegar la complejidad del sistema Counity. | 🟢 Pendiente |


Nuevas tareas:
- en la sección que es, falta el box de red de nodos
- En la sección que es, los iconos deben tener coherencia de visual y de colores con los presentados en la home, para crear identidad.
- [BUG] Mobile UI: La red interactiva (Mycelium) en `como-funciona.html` presenta problemas de solapamiento con los textos del Hero al quitar el blur, y la altura del canvas puede cortar la red. Reparar posicionamiento en Y (cy) y legend wraps en pantallas chicas.
- [PERFORMANCE] Convertir imagen `lands-vision.png` (>1MB) a formato WebP para optimizar tiempos de carga, especialmente en móviles.
- [SEGURIDAD/PERFORMANCE] Anclar (lock) versiones específicas de scripts de CDNs externos (ej. Lucide icons) en lugar de usar `@latest` para evitar quiebres y mejorar el caching.
