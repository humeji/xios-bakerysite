# Ventana Emergente Promocional -- Opciones de Implementacion

**Plan ID:** `promo_popup_section_99da7009`
**Fecha:** 23 de febrero de 2026
**Estado:** [EN ESPERA DE DECISION]
**Cliente:** Xiomarly Perez -- Xio's Bakery
**Sitio Web:** xiosbakery.com
**Preparado por:** Hugo Mejia

---

## Contexto

Se solicito investigar la funcionalidad de ventana emergente (popup) que aparece en el sitio de Azucar Morena Bakery ([azucarmorenabakery.com](https://azucarmorenabakery.com/)) para determinar si es una funcion nativa de Shopify o algo personalizado, y evaluar como implementar algo similar en la tienda de Xio's Bakery.

### Que Se Investigo

Al visitar el sitio de Azucar Morena Bakery, aparece una ventana emergente en la pagina principal con un aviso importante ("Important Notice") informando a los clientes que el menu de galletas esta temporalmente no disponible. La ventana incluye:

- Un titulo personalizado
- Un mensaje descriptivo
- Un boton para cerrar ("Got it")
- Un boton de cerrar con la "X" en la esquina
- Se cierra al hacer clic fuera de la ventana

**Referencia visual:** La captura de pantalla del sitio de Azucar Morena muestra la ventana emergente superpuesta sobre la pagina principal.

---

## Hallazgos de la Investigacion

### Resultado Principal

La ventana emergente de Azucar Morena Bakery **NO es una funcion nativa de Shopify**. Es una **seccion personalizada de Liquid** (`sections/tybo-modal`) incluida en su tema, que es una version modificada del tema Dawn llamada **"TYBO DawnShop - Original (2024)"** (Dawn v14.0.0), creada por la agencia [Tybo](https://tybo.agency).

### Detalles Tecnicos Descubiertos

| Aspecto | Detalle |
|---------|---------|
| Tipo | Seccion personalizada de Liquid (`sections/tybo-modal`) |
| Tema base | Dawn 14.0.0 modificado por Tybo Agency |
| Configuracion | Editable desde el Editor de Temas de Shopify (titulo, mensaje, boton, colores) |
| Memoria | Usa `localStorage` del navegador para recordar si el usuario ya cerro la ventana |
| Duracion | Despues de cerrar, no vuelve a aparecer por 2 dias (configurable) |
| Paginas | Configurado para aparecer solo en la pagina principal |
| Dependencia | Requiere jQuery (que Shopify ya carga por defecto) |
| Cantidad | El sitio tiene 3 espacios para ventanas emergentes; solo 1 esta activo con contenido |

### Estado Actual del Tema de Xio's Bakery

| Aspecto | Estado |
|---------|--------|
| Tema base | Dawn (v13.5.9) |
| Ventana emergente promocional | [NO EXISTE] -- No hay ninguna seccion de popup en el tema actual |
| Modales existentes | Solo hay modales especificos: visor de fotos de producto, buscador, pagina de contrasena -- ninguno reutilizable para promociones |
| jQuery | [DISPONIBLE] -- Ya se carga via el CDN de Shopify |
| Soporte bilingue | [ACTIVO] -- Ingles y espanol ya funcionan en el tema |
| Seguridad | [ACTIVO] -- `security-utils.js`, cabeceras CSP, 86 pruebas automatizadas |

---

## Opciones de Implementacion

### Opcion A: Seccion Personalizada en el Tema [RECOMENDADA]

Crear una nueva seccion de Liquid (`sections/promo-popup.liquid`) directamente en el tema de Xio's Bakery, inspirada en la implementacion de Tybo pero adaptada a la arquitectura y estandares de seguridad del proyecto.

#### Lo Que Recibiras

- **Control total desde el Editor de Temas** -- Podras crear, editar y activar/desactivar promociones sin necesidad de un desarrollador
- **Titulo personalizado** -- Editable desde el Editor de Temas
- **Mensaje en ingles y espanol** -- Campos separados para cada idioma; se muestra el correcto automaticamente segun el idioma del visitante
- **Boton con enlace configurable** -- Texto del boton y URL de destino editables (por ejemplo: "Ver Ofertas" que lleva a una coleccion especifica)
- **Control de frecuencia** -- Configurar cuantos dias esperar antes de mostrar la ventana de nuevo a un visitante que ya la cerro
- **Activar/desactivar con un clic** -- Un interruptor en el Editor de Temas para encender o apagar la ventana sin borrar el contenido
- **Seguro y compatible** -- Construido siguiendo los mismos estandares de seguridad del resto del tema

#### Ejemplos de Uso

| Situacion | Titulo | Mensaje | Boton |
|-----------|--------|---------|-------|
| Promocion temporal | "Oferta Especial" | "20% de descuento en todas las galletas este fin de semana" | "Ver Galletas" -> /collections/cookies |
| Aviso de inventario | "Aviso Importante" | "Estamos tomando un descanso, las galletas no estan disponibles temporalmente" | "Entendido" (sin enlace) |
| Nuevo producto | "Novedad" | "Acaba de llegar nuestra nueva linea de uniformes" | "Comprar Ahora" -> /pages/uniformes |
| Temporada | "Temporada de Fiestas" | "Haz tus pedidos de Navidad antes del 15 de diciembre" | "Ordenar Ahora" -> /collections/navidad |

#### Esfuerzo, Costo y Riesgo

| Aspecto | Detalle |
|---------|---------|
| Esfuerzo | Medio -- una seccion nueva de Liquid + estilos CSS + logica JavaScript + pruebas |
| Costo recurrente | **$0** -- sin costo mensual de aplicaciones |
| Riesgo | Bajo -- sigue patrones probados del tema Tybo y de la arquitectura existente |
| Mantenimiento | Minimo -- las actualizaciones de contenido las hace la duena de la tienda directamente |

---

### Opcion B: Aplicacion de Shopify (App Store)

Instalar una aplicacion de terceros del App Store de Shopify dedicada a ventanas emergentes (ejemplos: Privy, OptiMonk, Justuno, Popup Maker).

#### Ventajas

- **Sin cambios al codigo del tema** -- Solo instalar y configurar la aplicacion
- **Funciones avanzadas incluidas** -- Pruebas A/B, estadisticas, captura de correos, activacion por intencion de salida
- **Editores visuales** -- Arrastrar y soltar para disenar la ventana

#### Desventajas

- **Costo mensual: $15 -- $100+ USD/mes** dependiendo de la aplicacion y el plan
- **Problemas de seguridad (CSP):** Los scripts de terceros requieren agregar nuevos dominios a la Politica de Seguridad de Contenido -- esto ha sido un punto de dolor conocido en este proyecto (ver historial de auditoria de seguridad)
- **Impacto en rendimiento:** Scripts externos adicionales que se cargan en cada pagina, haciendo el sitio mas lento
- **Menos control de diseno:** Dificil hacer que el popup se vea exactamente como la marca de la tienda
- **Dependencia de terceros:** Si la aplicacion tiene problemas, tu popup deja de funcionar

#### Esfuerzo, Costo y Riesgo

| Aspecto | Detalle |
|---------|---------|
| Esfuerzo | Bajo -- instalar y configurar |
| Costo recurrente | **$15 -- $100+ USD/mes** |
| Riesgo | Medio -- conflictos de CSP, rendimiento, dependencia de terceros |
| Mantenimiento | Bajo -- actualizaciones las maneja el proveedor de la app |

---

### Opcion C: Barra de Anuncios Mejorada

El tema Dawn ya incluye una barra de anuncios en la parte superior del sitio. Esta opcion consiste en mejorarla para hacerla mas prominente.

#### Ventajas

- **Ya existe en el tema** -- Trabajo minimo
- **Sin dependencias externas** -- No hay scripts de terceros

#### Desventajas

- **No es una ventana emergente** -- Es solo una linea de texto en la parte superior, mucho menos prominente
- **Formato muy limitado** -- Solo una linea de texto plano, sin imagenes, sin multiples parrafos, sin botones con estilo
- **No es descartable de forma inteligente** -- No tiene la logica de "mostrar una vez y ocultar por X dias"
- **Facil de ignorar** -- Los visitantes la pasan por alto al hacer scroll
- **No adecuada para promociones** que necesitan captar la atencion

#### Esfuerzo, Costo y Riesgo

| Aspecto | Detalle |
|---------|---------|
| Esfuerzo | Muy bajo -- modificaciones menores |
| Costo recurrente | **$0** |
| Riesgo | Bajo, pero impacto limitado -- puede no cumplir el objetivo |
| Mantenimiento | Minimo |

---

## Comparacion de Opciones

| Criterio | Opcion A: Seccion Personalizada | Opcion B: App de Shopify | Opcion C: Barra de Anuncios |
|----------|-------------------------------|------------------------|---------------------------|
| Ventana emergente tipo modal | [SI] | [SI] | [NO] |
| Editable desde Editor de Temas | [SI] | [SI] (desde la app) | [SI] (solo texto) |
| Soporte bilingue (EN/ES) | [SI] -- automatico | Depende de la app | [SI] (solo texto) |
| Titulo + mensaje + boton | [SI] | [SI] | [NO] -- solo texto |
| Control de frecuencia | [SI] -- configurable | [SI] | [NO] |
| Activar/desactivar | [SI] -- un clic | [SI] | [SI] |
| Costo mensual | **$0** | **$15 -- $100+** | **$0** |
| Problemas de CSP | [NO] | [SI] -- riesgo conocido | [NO] |
| Impacto en velocidad | [NINGUNO] | [MEDIO] -- scripts externos | [NINGUNO] |
| Dependencia de terceros | [NO] | [SI] | [NO] |
| Estadisticas avanzadas | [NO] | [SI] | [NO] |
| Captura de correos | [NO] (agregable en el futuro) | [SI] | [NO] |

---

## Nuestra Recomendacion

**Recomendamos la Opcion A (Seccion Personalizada)** por las siguientes razones:

1. **Cero costo recurrente** -- No hay suscripcion mensual de aplicaciones
2. **Compatible con la arquitectura existente** -- Sigue el mismo patron de secciones del tema Dawn que ya usamos
3. **Sin problemas de seguridad** -- No agrega scripts de terceros que compliquen la Politica de Seguridad de Contenido (un problema que ya hemos resuelto multiples veces)
4. **Bilingue desde el inicio** -- Soporte automatico de ingles y espanol, siguiendo el patron que ya funciona en el carrito y los mensajes de pedido minimo
5. **Independencia total** -- Podras crear y cambiar promociones desde el Editor de Temas sin necesidad de contactar a un desarrollador
6. **Referencia probada** -- La implementacion de Tybo en Azucar Morena Bakery nos da un diseno de referencia ya probado en produccion
7. **Calidad garantizada** -- Pasara por las mismas verificaciones automaticas (86+ pruebas, ESLint, SonarQube, CI/CD) que el resto del tema

---

## Siguiente Paso

Por favor selecciona la opcion que prefieres para que podamos proceder con la implementacion:

- [ ] **Opcion A** -- Seccion personalizada en el tema [RECOMENDADA]
- [ ] **Opcion B** -- Aplicacion de Shopify del App Store
- [ ] **Opcion C** -- Barra de anuncios mejorada

Si tienes preguntas sobre alguna opcion o necesitas mas informacion, no dudes en preguntar.

---

*Este documento fue preparado como parte del plan `promo_popup_section_99da7009`. Una vez seleccionada la opcion, se procedera con la implementacion, pruebas y empaquetado del tema.*
