# Creative Technology Portfolio

Portafolio profesional en dark mode para diseño, branding, motion, 3D, AI y tecnología creativa. Está construido como sitio estático con Vite, React, TypeScript, Tailwind CSS, React Three Fiber, Drei y Framer Motion.

La dirección visual usa una estética oscura, editorial e inmersiva: hero con modelo 3D, capas tipográficas, fondos atmosféricos, grano sutil, glow interactivo, secciones con contraste propio, cards con media dominante y modal de proyectos.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Three Fiber + `@react-three/drei`
- Framer Motion
- Google Fonts para titulares con `Syne`
- GitHub Pages con `base` configurable para subpaths
- Sin backend

## Requisitos

Usa Conda para aislar Node y Git dentro de un entorno local.

Si `conda` no aparece en PowerShell, abre Anaconda Prompt o ejecuta `conda init powershell` desde Anaconda Prompt y reinicia la terminal.

## Crear entorno Conda

```powershell
conda env create -f environment.yml
conda activate portfolio-web
node --version
npm --version
```

El archivo `environment.yml` instala Node.js desde `conda-forge`, por lo que no necesitas una instalación global de Node para trabajar en este proyecto.

## Instalar dependencias

```powershell
conda activate portfolio-web
npm install
```

## Correr localmente

```powershell
conda activate portfolio-web
npm run dev
```

Vite mostrará una URL local, normalmente:

```text
http://localhost:5173/
```

## Build de producción

Para revisar el build normal:

```powershell
conda activate portfolio-web
npm run build
npm run preview
```

Para simular GitHub Pages en un subpath `/portfolio/`:

```powershell
conda activate portfolio-web
npm run build:pages
npm run preview
```

## GitHub Pages

El proyecto incluye un workflow en `.github/workflows/deploy.yml`.

Pasos recomendados:

1. Sube el repositorio a GitHub.
2. En GitHub, entra a `Settings > Pages`.
3. En `Build and deployment`, selecciona `GitHub Actions`.
4. Haz push a `main` o `master`.
5. El workflow compilará el sitio y lo publicará en Pages.

El workflow detecta automáticamente si el repositorio es de usuario, por ejemplo `usuario.github.io`, y usa `/` como base. Para repositorios normales usa `/<nombre-del-repo>/`.

También puedes publicar manualmente con `gh-pages`:

```powershell
conda activate portfolio-web
npm run deploy
```

Ese comando usa el subpath `/portfolio/`. Si tu repositorio tiene otro nombre, edita el script `build:pages` en `package.json` o ejecuta:

```powershell
conda activate portfolio-web
npm run build -- --base=/nombre-del-repo/
```

## Cambiar el color de acento

Edita `src/styles/index.css`:

```css
:root {
  --accent: 15 100% 66%;
  --accent-cool: 190 100% 58%;
}
```

Los valores están en formato HSL sin `hsl()`. `--accent` controla el acento principal cálido y `--accent-cool` controla luces secundarias frías para fondos, bordes y profundidad.

Por ejemplo:

```css
--accent: 184 100% 58%;
--accent-cool: 15 100% 66%;
```

## Reemplazar el modelo 3D

Reemplaza el archivo:

```text
src/assets/3d/model.glb
```

La ruta está centralizada en `src/content/assets.ts`.

Si el nuevo modelo necesita ajustes de escala o posición, edita `src/components/HeroScene.tsx`, especialmente los valores de `position` y `scale` del grupo principal.

## Reemplazar el reel

Reemplaza el archivo:

```text
src/assets/video/reel.mp4
```

La sección del video usa la configuración de `src/content/siteContent.ts`:

```ts
export const reel = {
  videoSrc: reelAsset,
};
```

También puedes cambiar el `poster` del video en ese mismo objeto.

## Editar textos, contacto y redes

La mayor parte del contenido está en:

```text
src/content/siteContent.ts
```

Ahí puedes editar:

- Nombre, rol, email y ubicación
- Navegación
- Hero
- Reel
- Sobre mí
- Especialidades
- Proyectos
- Contacto y redes

## Agregar proyectos

Edita el arreglo `projects` en `src/content/siteContent.ts`.

Ejemplo base:

```ts
{
  id: 'nuevo-proyecto',
  title: 'Nuevo Proyecto',
  eyebrow: 'Branding / 3D',
  year: '2026',
  summary: 'Resumen corto para la tarjeta.',
  description: 'Texto completo para el modal.',
  tags: ['Branding', 'Motion', 'AI'],
  media: [
    {
      type: 'image',
      src: 'https://...',
      alt: 'Descripcion accesible de la imagen',
    },
  ],
}
```

Para video:

```ts
{
  type: 'video',
  src: reelAsset,
  poster: 'https://...',
  alt: 'Descripcion accesible del video',
}
```

## Estructura

```text
src/
  components/     Componentes reutilizables
  content/        Textos, proyectos y assets centralizados
  hooks/          Hooks ligeros
  sections/       Secciones principales del landing
  styles/         Tema global, Tailwind y variables
```

## Archivos clave

- `vite.config.ts`: base path para GitHub Pages y configuración de build
- `package.json`: scripts de desarrollo, build y deploy
- `environment.yml`: entorno Conda aislado
- `.github/workflows/deploy.yml`: deploy automático a GitHub Pages
- `src/content/siteContent.ts`: contenido editable
- `src/styles/index.css`: tema visual y color de acento
- `src/components/HeroScene.tsx`: integración del modelo 3D
- `src/hooks/usePointerAura.ts`: halo interactivo que sigue el cursor

## Notas de performance

- El modelo GLB se carga desde Vite y respeta el `base` del deploy.
- La escena 3D se carga como módulo diferido para mantener liviano el bundle inicial.
- El reel usa `preload="metadata"` para no bloquear la carga inicial.
- Las imágenes de proyectos usan lazy loading.
- El canvas 3D limita el DPR para cuidar GPU y batería.
- El sitio respeta `prefers-reduced-motion` para reducir animaciones cuando el sistema lo solicita.
