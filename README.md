# Phost

Una red social para fotógrafos de astronomía en Argentina, donde pueden compartir sus capturas del cielo nocturno, descubrir ubicaciones de otros fotógrafos, mantenerse informados sobre eventos astronómicos, utilizar calculadoras especializadas y localizar la posición de la Vía Láctea.

## Características Principales

### Para Fotógrafos
- **Feed de Publicaciones**: Visualiza posts de la comunidad con un diseño minimalista e inspirado en redes sociales modernas
- **Mapa Interactivo**: Explora ubicaciones de fotografías astronómicas en todo Argentina con marcadores agrupados
- **Guardado de Lugares**: Marca tus ubicaciones favoritas para volver a visitarlas
- **Subida de Posts**: Comparte tus fotografías con descripción, ubicación en mapa y metadatos
- **Eventos Astronómicos**: Consulta el calendario de eventos como eclipses, lluvias de meteoros y fases lunares
- **Calculadoras especializadas**: Ejecuta cálculos técnicos de gran utilidad para los fotógrafos
- **Localizador de la Vía Láctea**: Devuelve la posición de la Vía Láctea a partir de la ubicación y la fecha ingresada
- **Filtros Avanzados**: Filtra eventos por tipo, rango de fechas y ordénalos según tu preferencia

### Para Administradores
- Gestión de usuarios
- Moderación de contenido
- Acceso a panel administrativo

## Tecnologías

### Frontend
- **Angular 20** (Standalone Components)
- **Google Maps API** para visualización de ubicaciones
- **Directivas Angular** para animaciones de scrolleo
- **RxJS** para programación reactiva
- **TypeScript** para tipado estático

### Backend
- **JavaScript** (backend simulado)
- **JSON Server** para base de datos simulada
- **JWT** para autenticación
- **ImgBB API** para almacenamiento de imágenes
- **Aclaración:** la carpeta del backend tiene instalados los módulos de node ya que es la única forma de asegurar su funcionamiento. 

### APIs Externas
- **Google Maps Geocoding API** para conversión de coordenadas a direcciones
- **Georef API** (datos.gob.ar) para provincias y localidades de Argentina
- **ImgBB**  para el almacenamiento de imágenes
- **SunriseSunset API** para la obtención de las horas mágicas

## Requisitos Previos

- Node.js (v18 o superior)
- npm
- Angular CLI (`npm install -g @angular/cli`)

## Instalación

### 1. Clonar el repositorio
```bash
git clone <URL-del-repositorio>
cd phost
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 5. Iniciar el servidor backend
```bash
npm install
npm run api
```

El servidor se ejecutará en `http://localhost:3000`

### 6. Iniciar la aplicación Angular
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto
```
phost/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── evento-astronomico/
│   │   │   ├── fondo-galaxia/
│   │   │   ├── pop-up-mapa/
│   │   │   ├── pop-up-subir-posteo/
│   │   │   ├── calculadoras/
│   │   │   ├── localizadorViaLactea/
│   │   │   ├── modal-editar-perfil/
│   │   │   ├── menu-general/
│   │   │   └── post-component/
│   │   ├── guards/              # Guards de autenticación y roles
│   │   ├── interceptors/        # Interceptores HTTP
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── pages/               # Páginas principales
│   │   │   ├── auth/
│   │   │   ├── feed/
│   │   │   ├── mapa/
│   │   │   ├── eventos-astronomicos/
│   │   │   └── perfil/
│   │   └── services/            # Servicios de datos
│   ├── assets/                  # Recursos estáticos
│   └── styles.css               # Estilos globales
└── backend/
    ├── server.js                # Servidor Express
    └── db.json                  # Base de datos JSON
```

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Al iniciar sesión o registrarse, el token se guarda en `localStorage` y se incluye automáticamente en las peticiones mediante un interceptor.

### Roles de Usuario

- **Fotógrafo**: Puede publicar, explorar el mapa y ver eventos
- **Admin**: Acceso completo a gestión de usuarios y contenido

## Sistema de Marcadores

Los posts con coordenadas se agrupan automáticamente en marcadores cuando están en la misma ubicación. El servicio `MarcadorService` sincroniza los marcadores con los posts existentes:

- Agrupa posts por coordenadas idénticas
- Crea marcadores nuevos o actualiza los existentes
- Permite marcar ubicaciones como favoritas

## Eventos Astronómicos

La página de eventos muestra un calendario de fenómenos astronómicos con:

- Animaciones CSS personalizadas para cada tipo de evento
- Filtrado por tipo, rango de fechas y ordenamiento
- Integración con Google Calendar para agendar eventos
- Solo muestra eventos futuros por defecto

## Diseño

La aplicación cuenta con:

- Fondo animado de galaxia con partículas que responden al movimiento del mouse
- Paleta de colores minimalista (blanco, negro, grises)
- Diseño responsive para móviles y tablets
- Componentes con glassmorphism y efectos de blur

## Configuración Adicional

### Restricciones del Mapa

El mapa está configurado para mostrar únicamente Argentina:
```typescript
restriction: {
  latLngBounds: {
    north: -21.0, 
    south: -56.0, 
    west: -76.0, 
    east: -53.0, 
  },
  strictBounds: false,
}
```

### Interceptores

- **tokenInterceptor**: Agrega el token JWT a las peticiones (excepto login/register/upload)
- **errorInterceptor**: Maneja errores HTTP globalmente y redirige según el código de estado


## Autores

Proyecto desarrollado como trabajo académico para la materia Programación IV.

## Agradecimientos

- A los profesores que nos acompañaron en este último tramo de la carrera, por su comprensión y paciencia.

---

**Nota**: Este proyecto está en desarrollo activo. Algunas funcionalidades pueden estar incompletas o en fase experimental.