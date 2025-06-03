# front-hotel

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

 🔐 Login con Mocks:

  1. Página de Login Mejorada (/guest/login):
    - Diseño moderno con glassmorphism
    - Lista de usuarios de prueba disponibles
    - Botón "Usar" para auto-completar credenciales
    - Cualquier contraseña es válida en modo mock
  2. Usuarios de Prueba Disponibles:
    - mailto:carlos@inroom.com - Administrador (acceso total)
    - mailto:ana@inroom.com - Supervisor (gestión de usuarios y habitaciones)
    - mailto:luis@inroom.com - Operador (inventario y pedidos)
    - mailto:maria@inroom.com - Recepcionista (pedidos y habitaciones)
  3. Formato de Respuesta Compatible:
    - El mock devuelve exactamente el mismo formato que espera el store de auth
    - Incluye token, usuario, rol, e instituciones
    - Compatible con el sistema de permisos existente

  🎛️ Control Global de Mocks:

  1. Toggle Flotante (solo en desarrollo):
    - Botón en la esquina inferior derecha
    - Panel expandible con todas las opciones
    - Control por módulo individual
    - Configuración de delays y errores
  2. Persistencia:
    - La configuración se guarda en localStorage
    - Los tokens y sesiones mock también persisten
    - Puedes recargar la página sin perder la sesión

  🚀 Cómo Usar:

  1. Para hacer login con mocks:
    - Ve a /guest/login
    - Haz clic en "Usar" junto a cualquier usuario
    - O ingresa manualmente el email y cualquier contraseña
  2. Para cambiar entre usuarios:
    - Una vez logueado, usa el menú de perfil
    - Haz clic en "Cambiar Usuario" (solo visible con mocks activos)
  3. Para desactivar mocks:
    - Haz clic en el botón flotante (llave inglesa)
    - Desactiva el toggle principal
    - Recarga la página

  📋 Características del Sistema:

  - Sin dependencia del backend: Puedes desarrollar completamente offline
  - Datos coherentes: Los mocks están relacionados entre sí
  - Permisos funcionales: El menú se filtra según el rol del usuario
  - Cambio rápido de contexto: Cambia entre roles sin hacer logout
  - Modo mixto: Puedes activar mocks solo para ciertos módulos
