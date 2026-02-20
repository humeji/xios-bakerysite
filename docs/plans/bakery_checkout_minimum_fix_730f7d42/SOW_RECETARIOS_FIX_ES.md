# Propuesta de Acuerdo de Trabajo - Xio's Bakery

**Fecha:** 20 de diciembre de 2025  
**Cliente:** Xiomarly Perez - Xio's Bakery  
**Sitio Web:** xiosbakery.com

---

## Resumen del Proyecto

### Problema Identificado

Los recetarios digitales (e-books) como "Pan De Jamón By Xio" ($60.00) **no se pueden comprar** en la tienda porque el carrito muestra el mensaje:

> *"Please select at least 4 cookies in order to checkout"*

El botón de "Pagar pedido" aparece deshabilitado (gris) aunque el recetario no es una galleta.

### Causa del Problema

El código personalizado del tema tiene una regla que requiere mínimo 4 galletas para poder realizar el pago. Esta regla está bloqueando incorrectamente la compra de otros productos como los recetarios digitales.

### Solución Propuesta

Modificar el código JavaScript del tema para que:

| Contenido del Carrito | Resultado |
|----------------------|-----------|
| Solo recetario(s) | ✅ Pago habilitado |
| 3 galletas | ❌ Pago deshabilitado (necesita 4) |
| 4 o más galletas | ✅ Pago habilitado |
| Recetario + 3 galletas | ❌ Pago deshabilitado (necesita 4 galletas) |
| Recetario + 4+ galletas | ✅ Pago habilitado |

### Archivos a Modificar

- `themes/current/assets/custom.js`
- `themes/development/assets/custom.js`

### Beneficio Adicional: Fácil Mantenimiento Futuro

La solución que implementaré **no solo corrige el problema actual**, sino que también facilita cambios futuros.

**¿Qué significa esto?**

Si en el futuro deseas vender **otros productos** que tampoco requieran el mínimo de 4 galletas (por ejemplo: tarjetas de regalo, mercancía, accesorios, etc.), el cambio será muy sencillo:

- No será necesario reescribir el código
- Solo se necesitará agregar el nuevo tipo de producto a una lista de configuración
- El cambio tomará menos de 5 minutos

**Ejemplos de productos que podrían agregarse fácilmente en el futuro:**

| Tipo de Producto | Requeriría mínimo de galletas |
|------------------|------------------------------|
| RecipeBook (Recetarios) | ❌ No - ya incluido en esta solución |
| GiftCard (Tarjetas de regalo) | ❌ No - fácil de agregar |
| Merch (Mercancía/Ropa) | ❌ No - fácil de agregar |
| Accessories (Accesorios) | ❌ No - fácil de agregar |
| Cookies (Galletas) | ✅ Sí - siempre requieren mínimo 4 |

**Nota:** Agregar nuevos tipos de productos exentos en el futuro sería un cambio menor con costo reducido.

---

## Detalles Técnicos del Código

### Código Actual (ANTES) - Líneas 15-52 de `custom.js`

Este es el código que dejaron los desarrolladores originales:

```javascript
if (location.pathname === '/cart') { 

  function validateCartItems() {
    $.getJSON('/cart.js', function(cart) {
      var cartHasCookies = false;
      var cookiesCount = 0;
      var selectedCookieType = null;
      var selectedCookieCount = 0; 

      $('.custom-cart-qty-msg').hide(); 

      $(cart.items).each(function() {
        if (this.product_type == 'Cookies') {
          cookiesCount += this.quantity;
          cartHasCookies = true;
          
          if (this.quantity > selectedCookieCount) {
            selectedCookieCount = this.quantity;
            selectedCookieType = this.title;
          }

          if (this.quantity > 4) {
            $('.custom-cart-qty-msg').text('Please select at least 4 cookies in order to checkout ' + selectedCookieType);
            $('.custom-cart-qty-msg').show();
            $('.cart__checkout-button').prop('disabled', true);
            return false; 
          }
        }
      });

      // ❌ PROBLEMA: Esta línea bloquea TODOS los productos si no hay galletas
      if (!cartHasCookies || cookiesCount < 4) {
        $('.cart__checkout-button').prop('disabled', true); 
        $('.custom-cart-qty-msg').show(); 
      } else {
        $('.cart__checkout-button').prop('disabled', false); 
        $('.custom-cart-qty-msg').hide(); 
      }
    });
  }

  validateCartItems();
  setInterval(validateCartItems, 5000);
  // ... resto del código
}
```

**Problema en línea 45:** `if (!cartHasCookies || cookiesCount < 4)` 

Esto significa: "Si NO hay galletas O hay menos de 4 galletas, bloquear el pago"

El problema es que bloquea el pago cuando NO hay galletas, lo cual impide comprar recetarios.

---

## Estimación de Tiempo y Costo

| Tarea | Tiempo Estimado |
|-------|-----------------|
| Modificación del código | 15-20 minutos |
| Pruebas (múltiples escenarios de carrito) | 20-30 minutos |
| Implementación en ambos temas | 10 minutos |
| Documentación | 10 minutos |
| **Total** | **~1 hora** |

### Tarifa

| Concepto | Detalle |
|----------|---------|
| Tarifa estándar | $150.00 USD/hora |
| **Tarifa amigos/familia** | **$90.00 USD/hora** |
| Tiempo estimado | 1 hora |
| **Total estimado** | **$90.00 USD** |

---

## Otros Cambios Realizados (Sin Costo)

Los siguientes cambios ya fueron realizados sin costo adicional:

### ✅ Política de Privacidad - Configurada

Se habilitó la gestión automática de políticas de privacidad por Shopify:

- Política de privacidad - Ahora administrada automáticamente
- Banner de cookies - Administrado automáticamente  
- Página de exclusión de datos - Activa en California, Colorado y 13 otros estados

**Beneficio:** Las políticas de privacidad se mantendrán actualizadas con los requisitos legales sin mantenimiento manual.

### ℹ️ Enlaces de Descarga Digital - Información Importante

Los recetarios digitales se entregan a los clientes mediante enlaces de descarga generados por la aplicación **"Digital Downloads"** instalada en tu cuenta de Shopify.

**Configuración actual:**
- Cada enlace de descarga puede ser usado **máximo 3 veces** (configuración por defecto de Shopify)
- Después de 3 descargas, el enlace expira y el cliente no podrá descargar el recetario nuevamente

**¿Sabías que puedes administrar esto?**
- Puedes ver el historial de descargas de cada cliente
- Puedes reenviar enlaces de descarga si un cliente lo necesita
- Puedes ajustar el límite de descargas si lo deseas

**Ofrecimiento:** Si te gustaría, puedo mostrarte cómo administrar las descargas digitales dentro de la aplicación "Digital Downloads" en tu panel de Shopify. Esto no tiene costo adicional.

---

## Temas Pendientes para Discusión (Sin Costo)

### Shop Pay Está Desactivado

Note que **Shop Pay** está desactivado en la configuración de pagos.

**Estado actual:**
- Shop Pay: DESACTIVADO
- Shop Pay en cuotas: No disponible

**Por qué importa:**
El canal de ventas "Shop" muestra un error porque requiere Shop Pay habilitado. Con Shop Pay activado, los productos serían visibles para millones de usuarios en la aplicación Shop.

**Preguntas para la dueña:**
1. ¿Se desactivó Shop Pay intencionalmente?
2. ¿Cuál fue la razón?
3. ¿Te gustaría habilitarlo para acceder a los beneficios del canal Shop?

**Para habilitar (si se aprueba):**
- Configuración > Pagos > Métodos de pago
- Activar "Shop Pay"

---

## Descargo de Responsabilidad y Alcance del Servicio (SLA)

### ⚠️ Trabajo NO Incluido en Este Acuerdo

Este acuerdo cubre **ÚNICAMENTE** la corrección del código del carrito para permitir la compra de recetarios digitales. Los siguientes problemas **NO están incluidos** y requerirían un acuerdo separado:

#### Correo Electrónico Genérico de la Tienda

Actualmente, los recetarios digitales se envían desde un correo electrónico genérico de Shopify:

> `store+61899735195@t.shopifyemail.com`

**Problema conocido:** Este tipo de correo electrónico genérico tiene alta probabilidad de terminar en la carpeta de **spam/correo no deseado** de los clientes. Esto puede causar:

- Clientes que no reciben sus recetarios digitales
- Quejas de clientes
- Solicitudes de reembolso

**Solución recomendada (no incluida):** Configurar un dominio de correo personalizado (ej: `pedidos@xiosbakery.com`) para mejorar la entrega de correos.

**Este problema NO será corregido como parte de este acuerdo.**

---

### ✅ Protección de Privacidad Automatizada

La configuración de **gestión automática de políticas de privacidad** que habilitamos ayuda a proteger la tienda de:

- Ser marcada como riesgo de seguridad personal
- Incumplimiento de leyes de privacidad de EE.UU. (CCPA, etc.)
- Problemas legales relacionados con el manejo de datos de clientes

Según la documentación de Shopify, esta configuración automática mantiene las políticas actualizadas con los requisitos legales actuales en Estados Unidos, incluyendo California, Colorado, y otros 13 estados con leyes de privacidad.

---

## Aprobación

Por favor confirme su aprobación para proceder con la corrección del código de los recetarios:

- [ ] **Apruebo** el trabajo descrito arriba por un costo estimado de **$90.00 USD**
- [ ] **No apruebo** - Por favor contactarme para discutir

**Nota:** El tiempo real puede variar ligeramente. Se facturará el tiempo real trabajado a la tarifa de $90.00 USD/hora.

---

### Alcance del Trabajo Acordado

Al aprobar este documento, usted entiende y acepta que:

1. ✅ Se corregirá el problema del carrito para permitir la compra de recetarios
2. ❌ NO se corregirá el problema del correo electrónico genérico (spam)
3. ❌ NO se incluyen otros cambios o correcciones no especificados en este documento
4. ℹ️ Cualquier trabajo adicional requerirá un nuevo acuerdo

---

**Para aprobar, por favor responda a este documento o envíe un mensaje confirmando su aprobación.**

---

*Gracias por su confianza de mi servicio.*

