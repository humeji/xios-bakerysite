# Propuesta de Trabajo -- Auditoría de Seguridad 2026 (Revisada)

**Versión:** 2.0
**Fecha original:** 20 de febrero de 2026
**Fecha de revisión:** 21 de febrero de 2026
**Cliente:** Xiomarly Perez -- Xio's Bakery
**Sitio Web:** xiosbakery.com
**Preparado por:** Hugo Mejia

---

## Resumen Ejecutivo

El 20 de febrero de 2026 se inició la auditoría de seguridad pero **no se completó correctamente**. Las vulnerabilidades identificadas no fueron resueltas de forma adecuada, y el código quedó con los problemas de seguridad sin atender. El resultado directo de dejar estos problemas sin resolver fue **2 horas adicionales de depuración** durante el desarrollo de otras funcionalidades, donde la causa raíz de los errores encontrados fue precisamente la falta de corrección de los hallazgos de la auditoría.

**Problemas causados por no completar la auditoría correctamente:**

- El encabezado del sitio dejó de mostrar el logotipo
- La notificación de "producto agregado al carrito" dejó de funcionar
- El contador del ícono del carrito dejó de actualizarse
- Los botones de pago dinámico (Shop Pay, Apple Pay) no se ocultaban correctamente

Estos problemas se corrigieron de forma reactiva (11 PRs), y durante esas 2 horas adicionales de depuración también se crearon **37 pruebas de validación automatizadas** (pruebas de regresión) que verifican que estos errores específicos no vuelvan a ocurrir. Estas pruebas ahora forman parte del pipeline de calidad de tu tienda y servirán como **red de protección durante la próxima auditoría**, asegurando que al aplicar las correcciones de seguridad no se introduzcan los mismos problemas que vimos hoy.

Sin embargo, **las vulnerabilidades de seguridad originales siguen sin resolver**. Esto demuestra que no completar una auditoría de seguridad tiene un costo real y medible.

**Se necesita completar la auditoría con un enfoque correcto y verificado, ahora respaldado por las pruebas de regresión creadas.**

---

## Por Qué Es Importante Para Tu Negocio

### [RIESGO] Protección de Datos de Tus Clientes

Cada vez que un cliente compra productos de panadería o un recetario en tu tienda, comparte información personal: nombre, correo electrónico, dirección y datos de pago. Si el sitio tiene vulnerabilidades de seguridad, esta información podría estar en riesgo.

**Lo que esto significa para tu negocio:**
- Un problema de seguridad puede resultar en **pérdida de confianza** de tus clientes
- Shopify podría **desactivar tu tienda** temporalmente si detecta vulnerabilidades graves
- Los clientes que se enteran de problemas de seguridad **dejan de comprar**

### [RIESGO] Cambios Desde la Última Revisión

Desde agosto 2025, se han realizado múltiples actualizaciones al código de tu tienda:

| Actualización | Fecha | Qué Cambió |
|---------------|-------|------------|
| Corrección de widgets CSS | Diciembre 2025 | Cambios en cómo se muestran elementos del sitio |
| Mínimo de pedido y productos digitales | Febrero 2026 | Nuevo código para el carrito y validación de pagos |
| Pipeline de calidad (CI/CD) | Febrero 2026 | Herramientas automáticas de pruebas y publicación |
| Primer intento de auditoría de seguridad | 20 Feb 2026 | Correcciones aplicadas y luego revertidas |
| Corrección de regresiones (PRs #14-#24) | 20-21 Feb 2026 | 11 PRs para restaurar funcionalidad del tema |
| Pruebas de regresión (PR #25) | 21 Feb 2026 | 37 pruebas nuevas para prevenir regresiones futuras |

**El código actual (v13.6.6) tiene la funcionalidad intacta pero las correcciones de seguridad fueron parcialmente revertidas.**

---

## Estado Actual de Seguridad

### Lo Que Sigue Activo del Primer Intento

| Componente | Estado | Detalle |
|------------|--------|---------|
| `security-utils.js` | [ACTIVO] | Utilidad de seguridad cargada pero no utilizada por archivos Dawn |
| `security-test.js` | [ACTIVO] | Pruebas de seguridad en el navegador |
| `third-party-security.js` | [ACTIVO] | Protecciones para scripts de terceros |
| Cambios de `textContent` en `global.js` | [ACTIVO] | Reemplazos seguros que no afectan funcionalidad |
| `_stripDangerousAttrs` en archivos no-core | [ACTIVO] | En facets.js, predictive-search.js, etc. |
| `npm audit` en CI/CD | [ACTIVO] | Escaneo automático de dependencias |
| `dependabot.yml` | [ACTIVO] | Actualizaciones automáticas de paquetes |
| 37 pruebas de regresión | [ACTIVO] | Previenen que se repitan los errores de hoy |

### Vulnerabilidades Que Siguen Sin Resolver

Estos problemas de seguridad fueron identificados pero **no se corrigieron correctamente**, lo que directamente causó 2 horas adicionales de depuración:

| Vulnerabilidad | Estado | Impacto de No Corregirla |
|----------------|--------|--------------------------|
| `innerHTML` sin sanitizar en Dawn core JS | [PENDIENTE] | Riesgo de inyección de código (XSS) en carrito y notificaciones |
| Política CSP débil en `theme.liquid` | [PENDIENTE] | Protección del navegador incompleta contra scripts maliciosos |
| Configuración de versión del tema | [PENDIENTE] | Incompatibilidad al actualizar que rompe el encabezado |

---

## Lo Que Se Hará en la Nueva Auditoría

### Lecciones Aprendidas del Primer Intento

El primer intento falló porque las vulnerabilidades no se corrigieron de forma compatible con la plataforma. Específicamente:

1. **Las vulnerabilidades de seguridad son reales** -- los hallazgos de la auditoría (uso inseguro de `innerHTML`, CSP débil, falta de escaneo de dependencias) son problemas legítimos que necesitan corrección
2. **No corregirlas tiene un costo directo** -- dejar el código con estos problemas sin resolver causó 2 horas adicionales de depuración ($180 USD a tu tarifa). Sin embargo, durante esas 2 horas se crearon 37 pruebas de regresión que ahora protegen contra los mismos errores en la próxima auditoría
3. **El enfoque de corrección importa** -- Dawn (el tema base de Shopify) depende internamente de `innerHTML` para su sistema de renderizado de secciones, por lo que las correcciones deben respetar esa arquitectura

**La nueva auditoría corregirá las mismas vulnerabilidades pero con un enfoque compatible con Dawn.**

### 1. Auditoría Fresca del Código Actual (v13.6.6)

Revisión completa de TODOS los archivos JavaScript del tema actual, incluyendo los cambios de las 11 PRs recientes:

- Verificar que los archivos core de Dawn no tengan modificaciones de seguridad que rompan funcionalidad
- Verificar que los archivos custom (`custom.js`, `security-utils.js`, etc.) estén correctamente protegidos
- Validar que no se hayan introducido nuevas vulnerabilidades en los 11 PRs recientes

### 2. Enfoque de Seguridad Alternativo para Dawn Core

En lugar de modificar los archivos core de Dawn directamente:

- **Política CSP incremental:** Aplicar cambios de CSP uno a uno, probando cada cambio en Shopify antes de avanzar
- **Monitoreo sin modificación:** Usar `security-utils.js` como observador/monitor, no como reemplazo de funciones Dawn
- **Sanitización en la entrada:** Proteger donde los datos del usuario ENTRAN al sistema, no donde Dawn renderiza secciones internamente

### 3. Revisión de Política de Seguridad del Navegador (CSP)

- Aplicar cambios de CSP **incrementalmente** con verificación en Shopify entre cada cambio
- Documentar exactamente qué directivas pueden y no pueden modificarse sin romper el tema
- Mantener compatibilidad con las fuentes de Google y CDNs requeridos

### 4. Verificación de Dependencias y CI/CD

- Re-ejecutar escaneo completo de dependencias
- Verificar que `npm audit` y Dependabot estén funcionando correctamente
- Actualizar dependencias con vulnerabilidades conocidas si es posible

### 5. Reporte Actualizado

- Actualizar los reportes de auditoría (EN/ES) para reflejar el estado real
- Documentar qué correcciones se mantuvieron, cuáles se revertieron y por qué
- Nuevas recomendaciones basadas en las lecciones aprendidas

---

## Tu Sitio Ya Cuenta Con Infraestructura Profesional

Antes de esta auditoría, ya invertimos en construir un **sistema de control de calidad automatizado** (pipeline CI/CD) para tu tienda. Después del trabajo de hoy, este sistema ahora incluye **86 pruebas automáticas** (49 originales + 37 de regresión).

### Cómo Funciona a Tu Favor

| Nivel | Qué Hace | Por Qué Importa |
|-------|----------|-----------------|
| 1. Revisión al guardar | Analiza el código inmediatamente cuando el desarrollador guarda su trabajo | Detecta errores básicos al instante |
| 2. Revisión al proponer cambios | Ejecuta **86 pruebas automáticas** + análisis de calidad de código | Ningún cambio puede aprobarse si alguna prueba falla |
| 3. Revisión al publicar | Vuelve a verificar todo, empaqueta los archivos y crea una versión oficial | Solo código verificado llega a tu tienda |
| 4. **Pruebas de regresión** | **37 pruebas específicas que verifican que los errores de hoy no se repitan** | **Red de seguridad contra regresiones** |

---

## Lo Que Recibirás

| Entregable | Descripción |
|------------|-------------|
| Código corregido (enfoque revisado) | Correcciones de seguridad que no rompen funcionalidad del tema |
| Reporte de auditoría actualizado (EN/ES) | Documento detallado reflejando el estado real post-regresiones |
| CSP incremental verificada | Política de seguridad aplicada y probada paso a paso |
| Pruebas de regresión expandidas | Cobertura de pruebas para cada corrección de seguridad aplicada |
| Documentación actualizada | Política de seguridad, changelog y planes actualizados |

---

## Costo

### Tarifa

| Concepto | Detalle |
|----------|---------|
| Tarifa estándar | $150.00 USD/hora |
| **Tarifa amigos/familia (tu tarifa)** | **$90.00 USD/hora** |

### Tiempo Estimado

| Tarea | Tiempo |
|-------|--------|
| Auditoría fresca del código actual (v13.6.6, ~20 archivos JS) | 40 min |
| Diseño e implementación de enfoque alternativo para Dawn core | 45 min |
| Aplicación incremental de CSP con verificación en Shopify | 30 min |
| Verificación de dependencias y CI/CD | 10 min |
| Pruebas y verificación (86+ tests + lint + SonarQube) | 20 min |
| Actualización de reportes y documentación (EN/ES) | 15 min |
| Creación de pruebas de regresión para cada corrección nueva | 20 min |
| **Total** | **~3 horas** |

### Resumen de Costos

| Concepto | Costo |
|----------|-------|
| 3 horas x $90.00 USD/hora (tarifa amigos/familia) | **$270.00 USD** |
| Reporte bilingue actualizado (EN/ES) | Incluido |
| Pruebas de regresión adicionales | Incluido |
| **Total** | **$270.00 USD** |

---

## Comparación de Costos

| Escenario | Costo Estimado |
|-----------|---------------|
| **Esta auditoría de seguridad (revisada)** | **$270 USD** |
| **Costo ya incurrido por no completar la auditoría (2 hrs)** | **$180 USD (a tu tarifa) -- incluye 37 pruebas de regresión que protegen la próxima auditoría** |
| Auditoría de seguridad por empresa externa (mínimo) | $500 -- $2,000 USD |
| Recuperación después de un incidente de seguridad | $1,000 -- $10,000+ USD |
| Pérdida de ventas por sitio marcado como inseguro | Incalculable |

---

## Alcance del Trabajo

### Incluido en Este Trabajo ($270 USD)

- [SI] Auditoría fresca de seguridad del código actual (v13.6.6)
- [SI] Corrección de vulnerabilidades con enfoque que respeta los archivos core de Dawn
- [SI] Aplicación incremental de CSP con verificación en Shopify
- [SI] Verificación de dependencias y herramientas automáticas
- [SI] Actualización de reportes de auditoría en inglés y español
- [SI] Pruebas de regresión para cada corrección nueva
- [SI] Actualización de toda la documentación de seguridad del proyecto

### NO Incluido

- Cambios de diseño o funcionalidad del sitio
- Creación de nuevos productos o páginas
- Cambios al sistema de pagos o envíos
- Soporte continuo de seguridad (requeriría un acuerdo separado)

---

## Diferencias Con la Propuesta Original (v1.0)

| Aspecto | Propuesta v1.0 | Propuesta v2.0 (esta) |
|---------|---------------|----------------------|
| Enfoque | Reemplazar `innerHTML` con `safeSetHTML` en archivos Dawn | No modificar archivos core de Dawn |
| Tiempo estimado | ~2 horas | ~3 horas |
| Costo | $180 USD | $270 USD |
| CSP | Aplicar todos los cambios de una vez | Aplicar incrementalmente con pruebas |
| Pruebas de regresión | 49 pruebas | 86+ pruebas (49 originales + 37 creadas durante las 2 hrs de depuración) |
| Protección contra regresiones | Ninguna | 37 pruebas específicas que evitan repetir los errores del primer intento |
| Razón del cambio | -- | La auditoría v1.0 no se completó; los bugs sin resolver causaron 2 horas extra de depuración, pero ese tiempo produjo las pruebas que protegen v2.0 |

---

## Frecuencia Recomendada

| Frecuencia | Nivel de Riesgo | Recomendación |
|------------|----------------|---------------|
| Cada 3 meses | Bajo | Recomendado para comercio electrónico |
| **Cada 6 meses (situación actual)** | **Moderado** | **Mínimo aceptable** |
| Más de 6 meses | Alto | No recomendado |

**Próxima auditoría recomendada:** Mayo 2026 (Q2)

---

## Aprobación

Por favor confirma tu aprobación para proceder:

- [ ] **Apruebo** la auditoría de seguridad revisada por **$270.00 USD**
- [ ] **No apruebo** -- Por favor contactarme para discutir

### Al aprobar este documento, entiendes y aceptas que:

1. Se realizará una auditoría fresca de seguridad del código actual del tema (v13.6.6)
2. Las correcciones de seguridad seguirán un enfoque que NO modifica archivos core de Dawn
3. Los cambios de CSP se aplicarán incrementalmente con verificación en Shopify
4. Recibirás un reporte actualizado en inglés y español
5. Se agregarán pruebas de regresión para cada corrección nueva
6. Cualquier trabajo adicional no especificado aquí requerirá un nuevo acuerdo

---

**Para aprobar, por favor responde a este documento indicando tu aprobación, o envía un mensaje confirmando.**

---

*Gracias por tu confianza en mi servicio.*

**Hugo Mejia**
