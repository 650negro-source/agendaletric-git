# AgendaLetric — Prototipo (solo HTML + CSS)

Prototipo navegable del sistema de agendamiento de mantenimiento para
vehículos eléctricos e híbridos **AgendaLetric**. Construido 100% con
HTML y CSS — **sin una sola línea de JavaScript** — pensado para
mostrar el flujo completo de los 3 roles del sistema: Cliente, Técnico
y Administrador.

---

## 🚀 Cómo abrirlo

No necesita instalación ni servidor. Dos formas de verlo:

1. **Doble clic** en `index.html` — se abre directo en tu navegador.
2. O con la extensión **Live Server** de VS Code (clic derecho sobre
   `index.html` → "Open with Live Server") si quieres que se recargue
   solo cada vez que edites un archivo.

---

## 🔑 Cómo entrar a cada rol

Como el prototipo no tiene backend ni base de datos real, no existe
una validación de usuario/contraseña de verdad. En su lugar:

- El botón **"Iniciar sesión"** de `login.html` siempre te lleva al
  **Dashboard Cliente** (`cliente-dashboard.html`), sin importar qué
  escribas en el formulario — así se comporta cualquier prototipo
  clickeable (como los de Figma).
- Para ver los otros dos roles, usa los enlaces que están debajo del
  botón de login, o abre directamente:
  - `tecnico-dashboard.html` → rol **Técnico**
  - `admin-dashboard.html` → rol **Administrador**

---

## 🗺️ Mapa de navegación

```
Inicio (index.html)
   ↓
Iniciar sesión (login.html)
   ↓
┌─────────────────────┬──────────────────────┬───────────────────────────┐
│  Dashboard Cliente   │   Dashboard Técnico   │   Dashboard Administrador │
├─────────────────────┼──────────────────────┼───────────────────────────┤
│ Mis vehículos        │ Mis citas asignadas   │ Clientes                  │
│ Registrar vehículo   │ Iniciar servicio      │ Técnicos                  │
│ Agendar cita          │ Registrar servicio    │ Especialidades            │
│   → Confirmar cita   │ Reportes realizados   │ Horarios                  │
│ Mis citas             │                      │ Servicios                 │
│ Recordatorios         │                      │ Administrar citas         │
│                       │                      │ Vehículos registrados     │
│                       │                      │ Reportes                  │
└─────────────────────┴──────────────────────┴───────────────────────────┘
```

Cada uno de esos nombres es una página `.html` real y enlazada — se
navega haciendo clic, exactamente como en la maqueta de Figma.

---

## 📁 Estructura del proyecto

```
agendaletric-html-css/
├── index.html                       Bienvenida
├── login.html                       Inicio de sesión
├── registro.html                    Registro de usuario
├── recuperar.html                   Recuperar contraseña
├── recuperar-enviado.html           Confirmación de envío de enlace
│
├── cliente-dashboard.html           Dashboard del cliente
├── cliente-vehiculos.html           Listado de vehículos
├── cliente-registrar-vehiculo.html  Formulario de registro de vehículo
├── cliente-agendar.html             Formulario para agendar cita
├── cliente-cita.html                Confirmar cita (estado pendiente)
├── cliente-cita-confirmada.html     Cita ya confirmada
├── cliente-mis-citas.html           Listado de citas con pestañas
├── cliente-recordatorios.html       Recordatorios de servicio
├── cliente-notificaciones.html      Preferencias de correo/WhatsApp del cliente
│
├── tecnico-dashboard.html           Dashboard del técnico
├── tecnico-citas.html               Mis citas asignadas
├── tecnico-iniciar-servicio.html    Iniciar servicio
├── tecnico-registrar-servicio.html  Registrar diagnóstico y trabajo + enviar reporte
├── tecnico-reporte-enviado.html     Confirmación de envío del reporte al cliente
├── tecnico-reportes.html            Reportes realizados (historial)
│
├── admin-dashboard.html             Dashboard del administrador
├── admin-clientes.html              Gestión de clientes
├── admin-tecnicos.html              Gestión de técnicos
├── admin-especialidades.html        Gestión de especialidades
├── admin-horarios.html              Gestión de horarios
├── admin-servicios.html             Catálogo de servicios
├── admin-citas.html                 Administrar citas (reasignar/cancelar)
├── admin-vehiculos.html             Todos los vehículos registrados
├── admin-reportes.html              Reportes generales del taller
├── admin-notificaciones.html        Plantillas y canales de correo/WhatsApp
│
├── assets/
│   ├── logo-icon.png                 Ícono (engranaje + rayo) para sidebar/login
│   └── logo-full.png                 Logo completo para la bienvenida
│
└── css/
    ├── tokens.css                    Variables: colores, tipografía, espaciado
    ├── base.css                      Reset y estilos base
    ├── components.css                Botones, tarjetas, tablas, badges, pestañas...
    └── layout.css                    Estructura de las pantallas (sidebar, topbar, auth)
```

---

## 📲 Recordatorios y reportes por WhatsApp y correo

Este prototipo **ya incluye toda la interfaz** de esta función:

- **Cliente** → `cliente-notificaciones.html`: elige por qué canal
  (correo, WhatsApp o ambos) quiere recibir recordatorios de citas y
  reportes de servicio, y puede registrar su correo y número.
- **Técnico** → dentro de `tecnico-registrar-servicio.html`, al cerrar
  un servicio puede marcar por qué canal se le envía el reporte al
  cliente; `tecnico-reporte-enviado.html` muestra la confirmación con
  una vista previa del mensaje.
- **Administrador** → `admin-notificaciones.html`: configura los
  canales activos por defecto para todo el sistema y edita las
  plantillas de los dos tipos de mensaje (recordatorio y reporte),
  con variables como `{{cliente}}`, `{{fecha}}`, `{{diagnostico}}`.

### ⚠️ Importante: esto es la interfaz, no el envío real

Enviar un WhatsApp o un correo de verdad **no se puede hacer con
HTML y CSS** — ni tampoco con JavaScript que corra solo en el
navegador. Se necesita, sí o sí, un **servidor (backend)** porque:

- WhatsApp solo se envía a través de la **API de WhatsApp Business**
  (o un intermediario como Twilio), y esa API exige credenciales
  secretas que nunca deben estar visibles en el navegador.
- El correo se envía con un **servidor SMTP** o un servicio como
  SendGrid / Amazon SES — mismo problema: requiere una clave secreta
  del lado del servidor.
- Además, alguien (un servidor, no el navegador de tu cliente) tiene
  que "despertarse" 24 horas antes de cada cita para disparar el
  recordatorio — eso se llama una **tarea programada (cron job)** y
  solo existe en un backend, nunca en una página estática.

**Lo que se necesitaría para que esto funcione de verdad**, en orden:

1. Una base de datos real (hoy no existe: todo en este prototipo es
   HTML fijo).
2. Un backend (Node.js, Python/Django, PHP... cualquiera) con una
   tarea programada que revise cada cierto tiempo qué citas están
   por vencer.
3. Cuentas y credenciales en un proveedor de WhatsApp (Twilio o
   Meta/WhatsApp Business API) y uno de correo (SendGrid, Amazon SES,
   etc.).
4. El backend rellena la plantilla (la que ves en
   `admin-notificaciones.html`) con los datos reales de la cita y la
   envía a través de esas APIs.

Es un paso grande, pero no es casualidad que ya tengas lista toda la
pantalla — cuando llegues a la parte de backend en tu aprendizaje,
la interfaz ya estará esperando para conectarse.

---

## 🧠 Cómo funciona la interactividad SIN JavaScript

Todo lo que "reacciona" en esta interfaz usa trucos puros de CSS.
Aquí el porqué y el cómo, por si quieres reutilizarlos:

### 1. Menú lateral en móvil (☰)
Un `<input type="checkbox">` oculto, más un `<label>` que actúa de
botón. Como un `<label for="id">` marca/desmarca el checkbox al
hacer clic, y CSS puede "ver" ese estado con `:checked`, podemos
mostrar u ocultar el menú sin ninguna línea de JS:

```css
#menuToggle:checked ~ .app-shell .sidebar { transform: translateX(0); }
```

### 2. Pestañas (Mis citas, etc.)
Igual, pero con `<input type="radio">` (para que solo una pestaña
esté activa a la vez) en vez de checkbox:

```css
#tabPendientes:checked ~ #panelPendientes { display: block; }
```

### 3. Selector maestro-detalle (Administrar citas, Registrar servicio)
Mismo truco de radio, aplicado a una lista: cada fila es un
`<label>` que apunta a un radio distinto, y el panel de la derecha
se muestra según cuál radio esté marcado.

### 4. Formularios "funcionales"
Cada `<form>` tiene un atributo `action="siguiente-pagina.html"
method="get"`. Al enviarlos, el navegador de verdad te lleva a la
siguiente pantalla — y si algún campo `required` está vacío, el
propio navegador bloquea el envío y muestra su aviso nativo. Cero
JavaScript, validación real.

---

## ⚠️ Limitaciones (léelas para no llevarte una sorpresa)

Esto es un **prototipo de navegación**, no una aplicación con base de
datos real. Eso significa:

- Los datos que escribas en un formulario (agendar cita, registrar
  vehículo, crear cliente, etc.) **no se guardan**. Cada pantalla
  siguiente muestra información de ejemplo ya preparada.
- El botón **"Generar PDF"** es solo visual — para exportar de verdad
  cualquier pantalla, usa el atajo del navegador `Ctrl/Cmd + P` →
  "Guardar como PDF".
- El login no valida usuario/contraseña reales.

Si en algún momento quieres que estos datos persistan de verdad
(que un vehículo que registras aparezca luego en la lista, por
ejemplo), el siguiente paso natural es agregar JavaScript
(guardando en `localStorage`) o un backend real. Ese es justamente
el "Proyecto final" al que estamos apuntando en las lecciones de
HTML/CSS — primero se domina la estructura y el estilo, después se
le da memoria con lógica.

---

## ✅ Checklist de verificación

Este prototipo fue probado automáticamente (Playwright) verificando:

- [x] Cero `<script>`, cero `onclick`, cero `href="javascript:"` en
      las 30 páginas.
- [x] Las 30 páginas cargan sin errores de consola.
- [x] Cero enlaces internos rotos (incluidos los `action` de los
      formularios).
- [x] El menú móvil abre y cierra correctamente en 390px de ancho.
- [x] Las pestañas de "Mis citas" cambian de panel sin JS.
- [x] El selector maestro-detalle de "Administrar citas" resalta la
      fila y cambia el panel sin JS.
- [x] Los formularios con campos vacíos activan la validación nativa
      del navegador antes de dejar avanzar a la siguiente pantalla.
