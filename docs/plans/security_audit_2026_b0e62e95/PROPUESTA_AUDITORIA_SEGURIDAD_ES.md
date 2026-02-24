# Propuesta de Trabajo -- Auditoria de Seguridad 2026

**Fecha:** 23 de febrero de 2026

**Cliente:** Xiomarly Perez -- Xio's Bakery

**Sitio Web:** xiosbakery.com

**Preparado por:** Hugo Mejia

---

## Resumen Ejecutivo

Desde el 20 de febrero de 2026 se han acumulado **3.5 horas de trabajo de depuracion y pruebas** distribuidas en tres sesiones. Estas sesiones fueron necesarias para estabilizar el tema y asegurar que la funcionalidad existente no se rompa al aplicar cambios futuros.

**Cronologia del trabajo de depuracion:**

| Fecha | Duracion | Que Sucedio |
|-------|----------|-------------|
| 20-21 Feb | 2 horas | La auditoria de seguridad rompio el encabezado, carrito y notificaciones. Se crearon 11 PRs de correccion y 37 pruebas de regresion |
| 23 Feb | 1 hora | La funcionalidad de minimo de pedido no se activo despues de publicar el tema. Causa: las 5 configuraciones del carrito faltaban en `settings_data.json` |
| 23 Feb | 30 min | Configuracion del correo personalizado (`info@xiosbakery.com`) y actualizacion de guia en espanol |

**Costo total de depuracion hasta hoy:** 3.5 horas x $90/hora = **$315 USD**

Este trabajo de depuracion dejo como resultado una base mucho mas solida: el codigo actual (v13.6.7) tiene **86 pruebas automatizadas**, un pipeline CI/CD funcional, y configuracion verificada. La auditoria de seguridad que se propone aqui resolvera las vulnerabilidades pendientes sobre esta base estable.

**Completar la auditoria correctamente ahora evitara futuros ciclos de depuracion, agilizara nuevas funcionalidades y facilitara el mantenimiento del sitio.**

---

## Por Que Es Importante Para Tu Negocio

### [RIESGO] Proteccion de Datos de Tus Clientes

Cada vez que un cliente compra productos de panaderia o un recetario en tu tienda, comparte informacion personal: nombre, correo electronico, direccion y datos de pago. Si el sitio tiene vulnerabilidades de seguridad, esta informacion podria estar en riesgo.

**Lo que esto significa para tu negocio:**
- Un problema de seguridad puede resultar en **perdida de confianza** de tus clientes
- Shopify podria **desactivar tu tienda** temporalmente si detecta vulnerabilidades graves
- Los clientes que se enteran de problemas de seguridad **dejan de comprar**

### [RIESGO] Por Que El Mantenimiento Reactivo Sale Mas Caro

Las 3.5 horas de depuracion de esta semana demuestran un patron: cuando los problemas no se resuelven de forma planificada, cada cambio futuro tiene el riesgo de generar nuevos problemas en cascada.

| Patron | Ejemplo Esta Semana | Costo |
|--------|---------------------|-------|
| Cambio sin pruebas previas | La auditoria rompio el carrito y las notificaciones | 2 hrs ($180) |
| Configuracion incompleta | Las settings del carrito no estaban en `settings_data.json` | 1 hr ($90) |
| Soporte no planificado | Configuracion de correo personalizado | 30 min ($45) |
| **Total reactivo** | | **$315** |

**La auditoria de seguridad ($270) cuesta menos que lo que ya se gasto en depuracion reactiva ($315).** Y a diferencia de la depuracion, la auditoria deja una base estable que previene futuros problemas.

### [RIESGO] Cambios Recientes en Tu Sitio

Desde agosto 2025, se han realizado multiples actualizaciones al codigo de tu tienda:

| Actualizacion | Fecha | Que Cambio |
|---------------|-------|------------|
| Correccion de widgets CSS | Diciembre 2025 | Cambios en como se muestran elementos del sitio |
| Minimo de pedido y productos digitales | Febrero 2026 | Nuevo codigo para el carrito y validacion de pagos |
| Pipeline de calidad (CI/CD) | Febrero 2026 | Herramientas automaticas de pruebas y publicacion |
| Trabajo de seguridad y depuracion | 20-21 Feb 2026 | Correcciones de seguridad, restauracion de funcionalidad (11 PRs), 37 pruebas de regresion |
| Correccion de settings del carrito | 23 Feb 2026 | Configuracion explicita para activar minimo de pedido al publicar |
| Actualizacion automatica de dependencias | 23 Feb 2026 | Paquetes de desarrollo actualizados por Dependabot |
| Configuracion de correo personalizado | 23 Feb 2026 | `info@xiosbakery.com` configurado como remitente en Shopify |

**El codigo actual (v13.6.7) tiene la funcionalidad intacta, 86 pruebas automatizadas, y las correcciones de seguridad siguen pendientes.**

---

## Estado Actual de Seguridad

### Protecciones Ya Activas en Tu Sitio

| Componente | Estado | Detalle |
|------------|--------|---------|
| `security-utils.js` | [ACTIVO] | Utilidad de seguridad cargada pero no utilizada por archivos Dawn |
| `security-test.js` | [ACTIVO] | Pruebas de seguridad en el navegador |
| `third-party-security.js` | [ACTIVO] | Protecciones para scripts de terceros |
| Cambios de `textContent` en `global.js` | [ACTIVO] | Reemplazos seguros que no afectan funcionalidad |
| `_stripDangerousAttrs` en archivos no-core | [ACTIVO] | En facets.js, predictive-search.js, etc. |
| `npm audit` en CI/CD | [ACTIVO] | Escaneo automatico de dependencias |
| `dependabot.yml` | [ACTIVO] | Actualizaciones automaticas de paquetes |
| 86 pruebas automatizadas | [ACTIVO] | 49 originales + 37 de regresion |
| Settings explicitas en `settings_data.json` | [ACTIVO] | Las 5 settings del carrito ahora estan en el archivo de datos |

### Vulnerabilidades Que Siguen Sin Resolver

| Vulnerabilidad | Estado | Impacto de No Corregirla |
|----------------|--------|--------------------------|
| `innerHTML` sin sanitizar en Dawn core JS | [PENDIENTE] | Riesgo de inyeccion de codigo (XSS) en carrito y notificaciones |
| Politica CSP debil en `theme.liquid` | [PENDIENTE] | Proteccion del navegador incompleta contra scripts maliciosos |
| Configuracion de version del tema | [PENDIENTE] | Incompatibilidad al actualizar que rompe el encabezado |

---

## Lo Que Se Hara en la Nueva Auditoria

### Lecciones Aprendidas del Trabajo de Depuracion

Las 3.5 horas de depuracion de esta semana dejaron lecciones claras que guiaran el enfoque de la auditoria:

1. **Los archivos core de Dawn no se deben modificar directamente** -- El sistema de renderizado de secciones de Dawn depende internamente de `innerHTML`. Las correcciones deben ser compatibles con esta arquitectura
2. **`settings_data.json` debe estar sincronizado con `settings_schema.json`** -- Los defaults del schema no siempre se aplican al subir un ZIP. Las settings deben estar explicitas en ambos archivos
3. **Los cambios de CSP deben aplicarse uno por uno** -- Aplicar todos los cambios de CSP juntos hizo imposible identificar cual rompio la carga de fuentes y el encabezado
4. **Las pruebas de regresion son la red de seguridad** -- Las 86 pruebas actuales atrapan errores antes de que lleguen a produccion. Cada correccion nueva de seguridad necesita sus propias pruebas

**La auditoria aplicara estas lecciones desde el inicio.**

### 1. Auditoria Fresca del Codigo Actual (v13.6.7)

Revision completa de TODOS los archivos JavaScript del tema actual, incluyendo los cambios de los 27 PRs:

- Verificar que los archivos core de Dawn no tengan modificaciones que rompan funcionalidad
- Verificar que los archivos custom (`custom.js`, `security-utils.js`, etc.) esten correctamente protegidos
- Validar que no se hayan introducido nuevas vulnerabilidades en los PRs recientes
- Verificar integridad de configuracion (`settings_schema.json` vs `settings_data.json`)

### 2. Enfoque de Seguridad Alternativo para Dawn Core

En lugar de modificar los archivos core de Dawn directamente:

- **Politica CSP incremental:** Aplicar cambios de CSP uno a uno, probando cada cambio en Shopify antes de avanzar
- **Monitoreo sin modificacion:** Usar `security-utils.js` como observador/monitor, no como reemplazo de funciones Dawn
- **Sanitizacion en la entrada:** Proteger donde los datos del usuario ENTRAN al sistema, no donde Dawn renderiza secciones internamente

### 3. Revision de Politica de Seguridad del Navegador (CSP)

- Aplicar cambios de CSP **incrementalmente** con verificacion en Shopify entre cada cambio
- Documentar exactamente que directivas pueden y no pueden modificarse sin romper el tema
- Mantener compatibilidad con las fuentes de Google y CDNs requeridos

### 4. Verificacion de Dependencias y CI/CD

- Re-ejecutar escaneo completo de dependencias
- Verificar que `npm audit` y Dependabot esten funcionando correctamente
- Actualizar dependencias con vulnerabilidades conocidas si es posible

### 5. Reporte Actualizado

- Actualizar los reportes de auditoria (EN/ES) para reflejar el estado real
- Documentar que correcciones se mantuvieron, cuales se revertieron y por que
- Nuevas recomendaciones basadas en las lecciones aprendidas

---

## Tu Sitio Ya Cuenta Con Infraestructura Profesional

Antes de esta auditoria, ya invertimos en construir un **sistema de control de calidad automatizado** (pipeline CI/CD) para tu tienda. Despues del trabajo de esta semana, este sistema ahora incluye **86 pruebas automaticas** y configuracion verificada.

### Como Funciona a Tu Favor

| Nivel | Que Hace | Por Que Importa |
|-------|----------|-----------------|
| 1. Revision al guardar | Analiza el codigo inmediatamente cuando el desarrollador guarda su trabajo | Detecta errores basicos al instante |
| 2. Revision al proponer cambios | Ejecuta **86 pruebas automaticas** + analisis de calidad de codigo | Ningun cambio puede aprobarse si alguna prueba falla |
| 3. Revision al publicar | Vuelve a verificar todo, empaqueta los archivos y crea una version oficial | Solo codigo verificado llega a tu tienda |
| 4. Pruebas de regresion | 37 pruebas especificas que verifican que los errores pasados no se repitan | Red de seguridad contra regresiones |
| 5. Dependabot | Actualizacion automatica de paquetes con vulnerabilidades conocidas | Seguridad proactiva sin intervencion manual |

### Beneficio Para Futuras Funcionalidades

Con la base actual (86 pruebas + CI/CD + configuracion verificada), agregar nuevas funcionalidades a tu tienda sera:

- **Mas rapido** -- Las pruebas automaticas detectan problemas inmediatamente en lugar de despues de publicar
- **Mas seguro** -- Cada cambio pasa por 3 capas de verificacion antes de llegar a produccion
- **Mas economico** -- Menos horas de depuracion reactiva significan menor costo por funcionalidad nueva

---

## Lo Que Recibiras

| Entregable | Descripcion |
|------------|-------------|
| Codigo corregido (enfoque revisado) | Correcciones de seguridad que no rompen funcionalidad del tema |
| Reporte de auditoria actualizado (EN/ES) | Documento detallado reflejando el estado real post-depuracion |
| CSP incremental verificada | Politica de seguridad aplicada y probada paso a paso |
| Pruebas de regresion expandidas | Cobertura de pruebas para cada correccion de seguridad aplicada |
| Documentacion actualizada | Politica de seguridad, changelog y planes actualizados |

---

## Costo

### Tarifa

| Concepto | Detalle |
|----------|---------|
| Tarifa estandar | $150 USD/hora |
| **Tarifa amigos/familia (tu tarifa)** | **$90 USD/hora** |

### Tiempo Estimado para la Auditoria

| Tarea | Tiempo |
|-------|--------|
| Auditoria fresca del codigo actual (v13.6.7, ~20 archivos JS) | 40 min |
| Diseno e implementacion de enfoque alternativo para Dawn core | 45 min |
| Aplicacion incremental de CSP con verificacion en Shopify | 30 min |
| Verificacion de dependencias y CI/CD | 10 min |
| Pruebas y verificacion (86+ tests + lint + SonarQube) | 20 min |
| Actualizacion de reportes y documentacion (EN/ES) | 15 min |
| Creacion de pruebas de regresion para cada correccion nueva | 20 min |
| **Total** | **~3 horas** |

### Resumen de Costos

| Concepto | Costo |
|----------|-------|
| **Trabajo ya facturado: depuracion y pruebas (3.5 hrs)** | **$315 USD** |
| | |
| Sesion 1 (20-21 Feb): Regresiones de auditoria + 37 pruebas + 11 PRs | $180 |
| Sesion 2 (23 Feb): Diagnostico y correccion de `settings_data.json` + release | $90 |
| Sesion 3 (23 Feb): Configuracion de correo + actualizacion de guia | $45 |
| | |
| **Auditoria de seguridad propuesta (3 hrs)** | **$270 USD** |
| Reporte bilingue actualizado (EN/ES) | Incluido |
| Pruebas de regresion adicionales | Incluido |

---

## Comparacion de Costos

| Escenario | Costo Estimado |
|-----------|---------------|
| **Depuracion reactiva ya incurrida (3.5 hrs)** | **$315 USD** |
| **Auditoria de seguridad propuesta (3 hrs)** | **$270 USD** |
| Auditoria de seguridad por empresa externa (minimo) | $500 -- $2,000 USD |
| Recuperacion despues de un incidente de seguridad | $1,000 -- $10,000+ USD |
| Perdida de ventas por sitio marcado como inseguro | Incalculable |

**La depuracion reactiva ($315) ya costo mas que la auditoria planificada ($270).** Completar la auditoria ahora rompe el ciclo de depuracion y deja una base estable para el futuro.

---

## Alcance del Trabajo

### Incluido en Este Trabajo ($270 USD)

- [SI] Auditoria fresca de seguridad del codigo actual (v13.6.7)
- [SI] Correccion de vulnerabilidades con enfoque que respeta los archivos core de Dawn
- [SI] Aplicacion incremental de CSP con verificacion en Shopify
- [SI] Verificacion de dependencias y herramientas automaticas
- [SI] Actualizacion de reportes de auditoria en ingles y espanol
- [SI] Pruebas de regresion para cada correccion nueva
- [SI] Actualizacion de toda la documentacion de seguridad del proyecto

### NO Incluido

- Cambios de diseno o funcionalidad del sitio
- Creacion de nuevos productos o paginas
- Cambios al sistema de pagos o envios
- Soporte continuo de seguridad (requeriria un acuerdo separado)
- Trabajo adicional de depuracion si surgen problemas no relacionados con la auditoria

---

## Por Que Completar La Auditoria Ahora

### Evitar Mas Ciclos de Depuracion

Cada sesion de depuracion de esta semana tuvo una causa raiz que una auditoria completa detectaria:

| Sesion | Causa Raiz | La Auditoria Lo Detecta? |
|--------|------------|--------------------------|
| 20-21 Feb: Regresiones | Cambios de seguridad incompatibles con Dawn core | Si -- revision de compatibilidad es parte del alcance |
| 23 Feb: Settings no activas | `settings_data.json` desincronizado | Si -- verificacion de integridad de configuracion es parte del alcance |
| 23 Feb: Correo generico | Correo publico como remitente en Shopify | No -- soporte operativo, fuera del alcance de seguridad |

**2 de las 3 sesiones de depuracion se evitan** con una auditoria completa de seguridad.

### Agilizar Nuevas Funcionalidades

Con la auditoria completada, agregar nuevas funcionalidades sera mas sencillo porque:

1. **No habra deuda tecnica de seguridad** -- Cualquier funcionalidad nueva no tendra que trabajar alrededor de vulnerabilidades conocidas
2. **La configuracion estara verificada** -- No habra sorpresas al publicar nuevos ZIPs
3. **Las pruebas de regresion cubriran seguridad** -- Nuevas funcionalidades no romperan las correcciones de seguridad

### Facilitar Mantenimiento Futuro

1. **Documentacion completa** -- Cada correccion estara documentada con su razon y sus pruebas
2. **CSP documentada** -- Exactamente que directivas se pueden y no se pueden modificar
3. **Dependencias actualizadas** -- Menos vulnerabilidades conocidas en paquetes
4. **Pipeline probado** -- 86+ pruebas que validan automaticamente cualquier cambio

---

## Frecuencia Recomendada

| Frecuencia | Nivel de Riesgo | Recomendacion |
|------------|----------------|---------------|
| Cada 3 meses | Bajo | Recomendado para comercio electronico |
| **Cada 6 meses (situacion actual)** | **Moderado** | **Minimo aceptable** |
| Mas de 6 meses | Alto | No recomendado |

**Proxima auditoria recomendada:** Mayo 2026 (Q2)

---

## Aprobacion

Por favor confirma tu aprobacion para proceder:

- [ ] **Apruebo** la auditoria de seguridad por **$270 USD**
- [ ] **No apruebo** -- Por favor contactarme para discutir

### Al aprobar este documento, entiendes y aceptas que:

1. Se realizara una auditoria fresca de seguridad del codigo actual del tema (v13.6.7)
2. Las correcciones de seguridad seguiran un enfoque que NO modifica archivos core de Dawn
3. Los cambios de CSP se aplicaran incrementalmente con verificacion en Shopify
4. Recibiras un reporte actualizado en ingles y espanol
5. Se agregaran pruebas de regresion para cada correccion nueva
6. Cualquier trabajo adicional no especificado aqui requerira un nuevo acuerdo
7. El trabajo de depuracion previo ($315 USD) se factura por separado de esta propuesta

---

**Para aprobar, por favor responde a este documento indicando tu aprobacion, o envia un mensaje confirmando.**

---

*Gracias por tu confianza en mi servicio.*

**Hugo Mejia**
