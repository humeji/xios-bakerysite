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
| 23 Feb | 30 min | Configuracion del correo personalizado (`info@xiosbakery.com`) y actualizacion de guia en español |

**Costo total de depuracion hasta hoy:** 3.5 horas x $90/hora = **$315 USD**

Este trabajo de depuracion dejo como resultado una base mucho mas solida: el codigo actual (v13.6.7) tiene **86 pruebas automatizadas**, un **sistema de control de calidad automatizado** ([ver explicacion detallada](../ci_cd_pipeline_setup_713a17f2/EXPLICACION_PIPELINE_CICD_ES.md)), y configuracion verificada.

**Sobre el sistema de control de calidad (CI/CD):** Este sistema fue construido por Hugo Mejia como un favor -- **sin costo para ti** -- con una inversion de aproximadamente 1.5 horas de trabajo profesional. Lo hice porque es la base necesaria para garantizar que cada cambio futuro en tu sitio pase por revisiones automaticas antes de llegar a tus clientes. Sin este sistema, cada cambio dependeria unicamente de que una sola persona no cometa errores. Con el, tu sitio cuenta con un equipo automatizado de verificacion que trabaja las 24 horas -- es como tener un equipo de ingenieros revisando la calidad de cada actualizacion. Esto te ahorra tiempo y dinero en cada cambio futuro, porque los problemas se detectan **antes** de que afecten tu tienda, no despues.

La auditoria de seguridad que se propone aqui resolvera las vulnerabilidades pendientes sobre esta base estable.

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

**La auditoria de seguridad ($360) cuesta apenas $45 mas que lo que ya se gasto en depuracion reactiva ($315).** Y a diferencia de la depuracion, la auditoria deja una base estable que previene futuros problemas.

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
| Version base de Dawn desactualizada (13.4.8) | [PENDIENTE] | Shopify solo corrige vulnerabilidades en la version mas reciente de Dawn; las correcciones no se aplican a versiones anteriores. El tema actual puede tener vulnerabilidades ya resueltas en versiones mas nuevas |

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

Revision completa de TODOS los archivos JavaScript del tema actual, incluyendo los cambios de los 29 PRs:

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

### 5. Evaluacion de Version Base de Dawn

El tema actualmente usa Dawn 13.4.8 (`theme_version: "13.4.8-tybo-hard-hide"`). Shopify solo publica correcciones de seguridad en la version mas reciente de Dawn; estas correcciones **no se aplican retroactivamente** a versiones anteriores.

Esta evaluacion incluira:

- **Documentar la brecha de version** entre Dawn 13.4.8 y la version actual de Dawn publicada por Shopify
- **Identificar cambios relevantes de seguridad** en las versiones de Dawn mas nuevas (Shopify publica el historial de cambios de Dawn en GitHub)
- **Evaluar la complejidad de una actualizacion** -- cuantos archivos core se han personalizado y que tan probable es que una actualizacion cause problemas
- **Producir una recomendacion** con cronograma: actualizar ahora, planificar para un hito futuro, o aceptar el riesgo con documentacion

[NOTA] Esto no significa actualizar Dawn durante la auditoria. La actualizacion seria un proyecto separado. El objetivo es tener una evaluacion clara para tomar una decision informada.

### 6. Revision y Consolidacion de Pruebas de Regresion

Actualmente existen **37 pruebas de regresion** en `tests/regression-2026-02-21.test.js` que fueron creadas como proteccion de emergencia despues de los problemas de la semana del 20-21 de febrero. Muchas de estas pruebas no protegen funcionalidad permanente, sino que previenen la repeticion de errores causados por el trabajo de seguridad incompleto.

| Grupo de Regresion | Pruebas | Tipo | Que Pasa Despues de la Auditoria |
|---------------------|---------|------|----------------------------------|
| #1: Version del tema | 2 | Temporal -- ligado a la evaluacion de version de Dawn | Se reemplaza o actualiza segun la estrategia de version definida por la auditoria |
| #2: No `safeSetHTML` en Dawn core | 12 | Temporal -- ligado a la estrategia de seguridad de Dawn core | Se reemplaza con pruebas que validen el enfoque correcto de seguridad |
| #3: Filtro `default` de Liquid | 4 | Permanente -- protege logica del carrito | Se mantiene sin cambios |
| #4: Botones de checkout dinamico | 3 | Permanente -- protege logica del carrito | Se mantiene sin cambios |
| #5: JSON valido en `settings_data.json` | 2 | Permanente -- proteccion barata contra error de despliegue | Se mantiene sin cambios |
| #6: Aislamiento de `security-utils.js` | 3 | Temporal -- ligado a la definicion del rol de `security-utils.js` | Se reemplaza con pruebas que validen la arquitectura de seguridad correcta |
| #7: Sincronizacion `current/` y `development/` | 7 | Permanente -- protege el flujo de trabajo dual | Se mantiene sin cambios |

**Resultado:** ~18 pruebas temporales seran revisadas y reemplazadas con pruebas que validen las soluciones correctas en lugar de solo prevenir los errores pasados. ~19 pruebas permanentes se mantienen. Esto reduce la deuda tecnica en las pruebas y evita que el equipo de desarrollo trabaje alrededor de restricciones artificiales.

### 7. Reporte Actualizado

- Actualizar los reportes de auditoria (EN/ES) para reflejar el estado real
- Documentar que correcciones se mantuvieron, cuales se revertieron y por que
- Nuevas recomendaciones basadas en las lecciones aprendidas
- Incluir resultados de la evaluacion de version de Dawn con recomendacion
- Incluir resultados de la revision de pruebas de regresion (cuales se mantienen, cuales se reemplazan)

---

## Tu Sitio Ya Cuenta Con Infraestructura Profesional

Antes de esta auditoria, Hugo Mejia construyo un **sistema de control de calidad automatizado** para tu tienda -- **sin costo para ti**, como un favor profesional. Esto represento aproximadamente 1.5 horas de trabajo especializado que normalmente se cobraria a $90/hora ($135 USD de valor).

**Por que lo hice sin costo:** Porque este sistema es la base que permite que cada cambio futuro en tu sitio sea mas rapido, mas seguro y mas economico. Es una inversion en la infraestructura de tu negocio digital que te beneficia en cada actualizacion futura.

**Lo que significa para ti:** Tu sitio ya no depende de que una sola persona revise todo manualmente. Ahora cuenta con un sistema automatico que funciona como un **equipo de ingenieros de calidad** -- revisa cada cambio multiples veces antes de que llegue a tu tienda, las 24 horas del dia, los 7 dias de la semana. Esto es el mismo tipo de infraestructura que usan empresas grandes para proteger sus sitios web.

Para una explicacion mas detallada de como funciona este sistema y por que es importante para tu negocio, consulta: [Que es el sistema de control de calidad y por que lo tiene Xio's Bakery](../ci_cd_pipeline_setup_713a17f2/EXPLICACION_PIPELINE_CICD_ES.md)

### Como Protege Tu Negocio

| Nivel | Que Hace | Por Que Te Importa |
|-------|----------|--------------------|
| 1. Revision al guardar | Revisa el codigo inmediatamente cuando el desarrollador guarda su trabajo | Detecta errores basicos al instante -- menos tiempo de correccion |
| 2. Revision al proponer cambios | Ejecuta **86 pruebas automaticas** + analisis de calidad | Ningun cambio puede aprobarse si alguna prueba falla -- protege tu tienda |
| 3. Revision al publicar | Vuelve a verificar todo y crea una version oficial lista para Shopify | Solo codigo verificado llega a tu tienda -- tranquilidad para ti |
| 4. Pruebas de regresion | 37 pruebas que verifican que errores pasados no se repitan | Red de seguridad -- los problemas que ya se resolvieron no vuelven |
| 5. Actualizaciones automaticas | Actualiza paquetes con vulnerabilidades conocidas automaticamente | Seguridad proactiva sin que nadie tenga que intervenir |

### Como Te Ahorra Dinero en Cada Cambio Futuro

Con esta base ya instalada (86 pruebas + sistema de calidad + configuracion verificada), agregar nuevas funcionalidades a tu tienda sera:

- **Mas rapido** -- Los problemas se detectan en segundos, no despues de publicar. Menos horas de trabajo = menor costo
- **Mas seguro** -- Cada cambio pasa por 3 capas de revision antes de llegar a tus clientes
- **Mas economico** -- Sin este sistema, los errores se descubren despues de publicar y requieren horas de depuracion (como los $315 de esta semana). Con el sistema, la mayoria de esos errores se atrapan antes de llegar a tu sitio

---

## Lo Que Recibiras

| Entregable | Descripcion |
|------------|-------------|
| Codigo corregido (enfoque revisado) | Correcciones de seguridad que no rompen funcionalidad del tema |
| Reporte de auditoria actualizado (EN/ES) | Documento detallado reflejando el estado real post-depuracion |
| CSP incremental verificada | Politica de seguridad aplicada y probada paso a paso |
| Pruebas de regresion revisadas y expandidas | Consolidacion de las 37 pruebas existentes (18 temporales reemplazadas con pruebas correctas, 19 permanentes mantenidas) + pruebas nuevas para cada correccion |
| Evaluacion de version de Dawn | Documento con brecha de version, cambios de seguridad relevantes, complejidad de actualizacion y recomendacion |
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
| Evaluacion de version base de Dawn (brecha, cambios de seguridad, complejidad) | 30 min |
| Revision y consolidacion de pruebas de regresion existentes (37 pruebas, 7 grupos) | 30 min |
| Actualizacion de reportes y documentacion (EN/ES) | 15 min |
| Creacion de pruebas de regresion nuevas para cada correccion | 20 min |
| **Total** | **~4 horas** |

### Resumen de Costos

| Concepto | Costo |
|----------|-------|
| **Trabajo ya facturado: depuracion y pruebas (3.5 hrs)** | **$315 USD** |
| | |
| Sesion 1 (20-21 Feb): Regresiones de auditoria + 37 pruebas + 11 PRs | $180 |
| Sesion 2 (23 Feb): Diagnostico y correccion de `settings_data.json` + release | $90 |
| Sesion 3 (23 Feb): Configuracion de correo + actualizacion de guia | $45 |
| | |
| **Auditoria de seguridad propuesta (4 hrs)** | **$360 USD** |
| Reporte bilingue actualizado (EN/ES) | Incluido |
| Evaluacion de version de Dawn | Incluido |
| Revision y consolidacion de pruebas de regresion | Incluido |
| Pruebas de regresion nuevas | Incluido |

---

## Comparacion de Costos

| Escenario | Costo Estimado |
|-----------|---------------|
| **Depuracion reactiva ya incurrida (3.5 hrs)** | **$315 USD** |
| **Auditoria de seguridad propuesta (4 hrs)** | **$360 USD** |
| Auditoria de seguridad por empresa externa (minimo) | $500 -- $2,000 USD |
| Recuperacion despues de un incidente de seguridad | $1,000 -- $10,000+ USD |
| Perdida de ventas por sitio marcado como inseguro | Incalculable |

**La depuracion reactiva ($315) costo casi lo mismo que la auditoria planificada ($360).** Completar la auditoria ahora rompe el ciclo de depuracion y deja una base estable para el futuro.

---

## Alcance del Trabajo

### Incluido en Este Trabajo ($360 USD)

- [SI] Auditoria fresca de seguridad del codigo actual (v13.6.7)
- [SI] Correccion de vulnerabilidades con enfoque que respeta los archivos core de Dawn
- [SI] Aplicacion incremental de CSP con verificacion en Shopify
- [SI] Verificacion de dependencias y herramientas automaticas
- [SI] Actualizacion de reportes de auditoria en ingles y espanol
- [SI] Pruebas de regresion para cada correccion nueva
- [SI] Evaluacion de version base de Dawn (brecha de version, cambios de seguridad, complejidad de actualizacion, recomendacion)
- [SI] Revision y consolidacion de las 37 pruebas de regresion existentes (separar pruebas permanentes de temporales, reemplazar las temporales con pruebas correctas)
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

- [ ] **Apruebo** la auditoria de seguridad por **$360 USD**
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
