# Guia de Despliegue y Pruebas - Minimo de Pedido v13.4.9

**Version del Tema:** v13.4.9-checkout-minimum-fix  
**Fecha:** 20 de febrero de 2026  
**Preparado por:** Hugo Mejia  
**Sitio:** xiosbakery.com

---

## Resumen de Cambios Incluidos

Este paquete ZIP contiene las siguientes modificaciones:

| Archivo | Cambio |
|---------|--------|
| `config/settings_schema.json` | Seccion "Cart & Checkout Rules" con monto minimo, mensajes en ingles y espanol |
| `assets/custom.js` | Validacion por total del carrito, mensaje localizado, proteccion contra valores invalidos |
| `sections/main-cart-items.liquid` | Atributos de datos, mensajes localizados, advertencia del editor si minimo < $20 |
| `snippets/cart-drawer.liquid` | Mismos cambios reflejados en el cajon del carrito |
| `assets/custom.css` | Estilos para los mensajes de validacion y aviso de productos digitales |

Ademas se incluyen los cambios previamente completados:

- Politica de Privacidad automatica (Shopify)
- Banner de Cookies automatico
- Pagina de Exclusion de Datos (CCPA)

---

## Paso 1: Despliegue del Tema (10 minutos)

### 1.1 Subir el ZIP a Shopify

1. Ir a: **Panel de Shopify > Tienda en linea > Temas**
2. Hacer clic en **"Agregar tema" > "Subir archivo ZIP"**
3. Seleccionar: `xios-bakery-theme-v13.4.9-checkout-minimum-fix-20260219-132434.zip`
4. Esperar a que se complete la subida

### 1.2 Publicar el Tema

1. Una vez subido, el tema aparecera en la seccion **"Biblioteca de temas"**
2. Hacer clic en los **tres puntos (...)** junto al tema nuevo
3. Seleccionar **"Publicar"**
4. Confirmar la publicacion

**[IMPORTANTE]** Antes de publicar, Shopify mantiene el tema anterior disponible para revertir si es necesario.

---

## Paso 2: Verificar Configuracion del Tema (5 minutos)

### 2.1 Acceder a la Configuracion

1. Ir a: **Panel de Shopify > Tienda en linea > Temas**
2. En el tema activo, hacer clic en **"Personalizar"**
3. Hacer clic en el **icono de engranaje** (Configuracion del tema) en la barra lateral izquierda

### 2.2 Verificar "Cart & Checkout Rules"

Buscar la seccion **"Cart & Checkout Rules"** y confirmar que los siguientes campos existen con sus valores por defecto:

| Campo | Valor Esperado |
|-------|---------------|
| Enable minimum order amount | Activado (checked) |
| Minimum order amount (USD) | 40 |
| Show non-refundable notice for digital products | Activado (checked) |
| Digital product refund message (English) | "Digital products are non-refundable. By purchasing, you agree to this policy." |
| Digital product refund message (Spanish) | "Los productos digitales no son reembolsables. Al realizar la compra, usted acepta esta politica." |

**[RESULTADO ESPERADO]** Los cinco campos deben ser visibles y editables.

### 2.3 Verificar que se Puede Modificar el Monto Minimo

1. Cambiar temporalmente el valor de "Minimum order amount" a **50**
2. Hacer clic en **"Guardar"**
3. Verificar que el valor se guardo correctamente
4. **Restaurar el valor a 40** y guardar de nuevo

---

## Paso 3: Pruebas Interactivas del Carrito (20-30 minutos)

Abrir la tienda en una **ventana de incognito/privada** del navegador para evitar cache. Realizar un hard refresh (`Cmd+Shift+R` en Mac o `Ctrl+Shift+R` en Windows) en cada prueba.

### Escenario 1: Carrito Vacio

**Pasos:**
1. Ir a `xiosbakery.com/cart`
2. Asegurarse de que el carrito este vacio

**Verificar:**
- [ ] El boton de checkout esta **deshabilitado** (gris, no se puede hacer clic)
- [ ] Se muestra el mensaje de carrito vacio

---

### Escenario 2: Solo Producto Digital - Total Menor a $40

**Pasos:**
1. Navegar a la tienda y buscar un producto digital (ejemplo: "Pan De Jamon By Xio" a $60)
2. Si no hay un producto digital con precio menor a $40, este escenario se puede omitir, ya que el recetario actual cuesta $60
3. Si se tiene acceso a crear productos de prueba, crear uno digital de prueba con precio de $20

**Verificar (si aplica):**
- [ ] El mensaje de minimo aparece (en ingles: "Minimum order amount is $40.00. Current total: $XX.XX" o en espanol: "El monto minimo de pedido es $40.00. Total actual: $XX.XX")
- [ ] El mensaje se muestra en un **recuadro rojo/rosado** (fondo `#f8d7da`, borde `#f5c6cb`)
- [ ] El boton de checkout esta **deshabilitado**
- [ ] El aviso de no reembolso aparece en un **recuadro amarillo** (fondo `#fff3cd`, borde `#ffc107`)

---

### Escenario 3: Solo Producto Digital - Total Igual o Mayor a $40

**Pasos:**
1. Agregar "Pan De Jamon By Xio" ($60.00) al carrito
2. Ir a la pagina del carrito (`/cart`)

**Verificar:**
- [ ] El boton de checkout esta **habilitado** (se puede hacer clic)
- [ ] **NO** se muestra el mensaje de monto minimo
- [ ] **SI** se muestra el aviso de no reembolso: "Digital products are non-refundable. By purchasing, you agree to this policy."
- [ ] El aviso de no reembolso aparece en un **recuadro amarillo**

---

### Escenario 4: Solo Productos Fisicos (Galletas) - Total Menor a $40

**Pasos:**
1. Vaciar el carrito
2. Agregar galletas con un total menor a $40 (ejemplo: 1 o 2 paquetes de galletas)
3. Ir a la pagina del carrito

**Verificar:**
- [ ] El mensaje de minimo aparece con el total actual
- [ ] El boton de checkout esta **deshabilitado**
- [ ] **NO** se muestra el aviso de no reembolso (no hay productos digitales)

---

### Escenario 5: Solo Productos Fisicos (Galletas) - Total Igual o Mayor a $40

**Pasos:**
1. Agregar suficientes galletas para que el total sea $40 o mas
2. Ir a la pagina del carrito

**Verificar:**
- [ ] El boton de checkout esta **habilitado**
- [ ] **NO** se muestra el mensaje de monto minimo
- [ ] **NO** se muestra el aviso de no reembolso

---

### Escenario 6: Carrito Mixto (Digital + Fisico) - Total Menor a $40

**Pasos:**
1. Agregar un producto digital de bajo precio (si existe) y galletas con total combinado menor a $40
2. Ir a la pagina del carrito

**Verificar (si aplica):**
- [ ] El mensaje de minimo aparece
- [ ] El boton de checkout esta **deshabilitado**
- [ ] El aviso de no reembolso **SI** se muestra (hay producto digital)

---

### Escenario 7: Carrito Mixto (Digital + Fisico) - Total Igual o Mayor a $40

**Pasos:**
1. Agregar "Pan De Jamon By Xio" ($60) + galletas al carrito
2. Ir a la pagina del carrito

**Verificar:**
- [ ] El boton de checkout esta **habilitado**
- [ ] **NO** se muestra el mensaje de monto minimo
- [ ] **SI** se muestra el aviso de no reembolso (porque hay un producto digital)

---

### Escenario 8: Eliminar Producto del Carrito

**Pasos:**
1. Tener un carrito con total mayor a $40 (boton habilitado)
2. Eliminar productos hasta que el total sea menor a $40

**Verificar:**
- [ ] Despues de 2-3 segundos, el boton de checkout se **deshabilita**
- [ ] El mensaje de minimo aparece con el nuevo total
- [ ] La validacion se ejecuta automaticamente sin recargar la pagina

---

## Paso 4: Verificar el Cajon del Carrito (Cart Drawer) (10 minutos)

Si el tema esta configurado para usar el cajon lateral del carrito (cart drawer) en lugar de la pagina completa:

### 4.1 Abrir el Cajon del Carrito

1. Desde cualquier pagina de producto, hacer clic en **"Agregar al carrito"**
2. El cajon del carrito debe abrirse desde el lado derecho

### 4.2 Verificar los Mismos Comportamientos

- [ ] El mensaje de minimo aparece correctamente en el cajon si el total es menor a $40
- [ ] El aviso de no reembolso aparece si hay productos digitales
- [ ] El boton de checkout se habilita/deshabilita correctamente

---

## Paso 5: Verificar Consola del Navegador (5 minutos)

### 5.1 Abrir las Herramientas de Desarrollo

1. Hacer clic derecho en la pagina > **"Inspeccionar"** (o `F12`)
2. Ir a la pestana **"Console"**

### 5.2 Verificar

- [ ] No hay errores JavaScript criticos (rojos) relacionados con `custom.js`
- [ ] No hay errores de red (Network) al cargar `/cart.js`
- [ ] Advertencias menores de terceros (como Shopify analytics) son normales y se pueden ignorar

### 5.3 Verificar la Llamada a la API del Carrito

1. Ir a la pestana **"Network"**
2. Filtrar por **"cart.js"**
3. Verificar que la solicitud se ejecuta cada 5 segundos y retorna status **200**
4. Hacer clic en una respuesta y verificar que contiene `total_price` y `items` con la propiedad `requires_shipping`

---

## Paso 6: Verificar Estilos CSS (5 minutos)

### 6.1 Mensaje de Monto Minimo (Recuadro Rojo/Rosado)

Cuando el total es menor al minimo, verificar visualmente:

- [ ] Fondo rosado claro
- [ ] Borde rojo suave
- [ ] Texto en rojo oscuro, legible
- [ ] Bordes redondeados

### 6.2 Aviso de No Reembolso (Recuadro Amarillo)

Cuando hay productos digitales en el carrito:

- [ ] Fondo amarillo claro
- [ ] Borde amarillo
- [ ] Texto en color marron/dorado oscuro, legible
- [ ] Bordes redondeados

---

## Paso 7: Prueba de Configurabilidad (5 minutos)

### 7.1 Cambiar el Monto Minimo

1. Ir a: **Personalizar tema > Configuracion del tema > Cart & Checkout Rules**
2. Cambiar "Minimum order amount" de **40** a **100**
3. Guardar
4. Abrir la tienda en incognito con un producto de $60 en el carrito

**Verificar:**
- [ ] El mensaje ahora dice: "Minimum order amount is $100.00. Current total: $60.00"
- [ ] El checkout esta deshabilitado

5. **Restaurar el valor a 40** y guardar

### 7.2 Desactivar el Minimo de Pedido

1. Desmarcar "Enable minimum order amount"
2. Guardar
3. Agregar un producto con total menor a $40

**Verificar:**
- [ ] El checkout esta **habilitado** (no hay restriccion de minimo)

4. **Reactivar la casilla** y guardar

### 7.3 Establecer el Monto Minimo en 0

1. Cambiar "Minimum order amount" a **0**
2. Guardar
3. Agregar cualquier producto al carrito

**Verificar:**
- [ ] El sistema ignora el valor 0 y usa el valor por defecto de **$40**
- [ ] El comportamiento es identico a tener el minimo en $40

4. **Restaurar el valor a 40** y guardar

### 7.4 Establecer el Monto Minimo en un Numero Negativo

1. Cambiar "Minimum order amount" a **-10**
2. Guardar
3. Agregar cualquier producto al carrito

**Verificar:**
- [ ] El sistema ignora el valor negativo y usa el valor por defecto de **$40**
- [ ] **NO** se muestra un mensaje con monto negativo (ejemplo: "$-10.00")
- [ ] El comportamiento es identico a tener el minimo en $40

4. **Restaurar el valor a 40** y guardar

### 7.5 Cambiar el Mensaje de No Reembolso

1. Modificar el texto en "Digital product refund message" a algo de prueba
2. Guardar y verificar que el nuevo texto aparece en el carrito con un producto digital
3. **Restaurar el texto original** y guardar

---

## Paso 8: Pruebas de Localizacion - Ingles y Espanol (10 minutos)

La tienda soporta ingles y espanol. Todos los mensajes del carrito ahora se adaptan al idioma seleccionado por el visitante.

### 8.1 Verificar Mensajes en Ingles

1. Abrir la tienda en ingles (idioma por defecto o cambiar via el selector de idioma)
2. Agregar un producto al carrito con total menor a $40

**Verificar:**
- [ ] El mensaje de minimo dice: "Minimum order amount is $40.00. Current total: $XX.XX"
- [ ] El aviso de no reembolso (si hay producto digital) dice: "Digital products are non-refundable. By purchasing, you agree to this policy."

### 8.2 Verificar Mensajes en Espanol

1. Cambiar el idioma de la tienda a **espanol** (via el selector de idioma en el sitio)
2. Agregar un producto al carrito con total menor a $40

**Verificar:**
- [ ] El mensaje de minimo dice: "El monto minimo de pedido es $40.00. Total actual: $XX.XX"
- [ ] El aviso de no reembolso (si hay producto digital) dice: "Los productos digitales no son reembolsables. Al realizar la compra, usted acepta esta politica."

### 8.3 Verificar que los Mensajes son Editables por Idioma

1. Ir a: **Personalizar tema > Configuracion del tema > Cart & Checkout Rules**
2. Verificar que existen **dos campos** de mensaje de no reembolso:
   - "Digital product refund message (English)"
   - "Digital product refund message (Spanish)"
3. Modificar el texto en espanol, guardar, y verificar que aparece el nuevo texto al navegar en espanol
4. **Restaurar el texto original** y guardar

---

## Paso 9: Verificar Advertencia del Editor (Design Mode) (5 minutos)

Esta advertencia solo aparece dentro del **editor de temas** de Shopify (modo "Personalizar"), nunca en la tienda publica.

### 9.1 Activar la Advertencia

1. Ir a: **Personalizar tema > Configuracion del tema > Cart & Checkout Rules**
2. Cambiar "Minimum order amount" a **15**
3. Guardar
4. Navegar a la pagina del carrito dentro del editor

**Verificar:**
- [ ] Aparece un recuadro amarillo con el texto: "[WARNING] Minimum order amount ($15) is below $20. This may not cover delivery costs. Recommended: $40 or higher."
- [ ] La advertencia es **visible solo en el editor** de temas

### 9.2 Confirmar que NO Aparece en la Tienda Publica

1. Con el monto aun en $15, abrir `xiosbakery.com/cart` en una ventana de incognito
2. Verificar que la advertencia **NO** aparece para los visitantes
3. **Restaurar el valor a 40** y guardar

---

## Paso 10: Prueba en Dispositivo Movil (5 minutos)

1. Abrir `xiosbakery.com` en un telefono o usar el modo responsive del navegador (`Cmd+Shift+M` en Mac)
2. Agregar productos al carrito
3. Verificar:
   - [ ] Los mensajes de validacion se ven correctamente en pantalla pequena
   - [ ] El aviso de no reembolso es legible
   - [ ] El boton de checkout se habilita/deshabilita correctamente
   - [ ] Los recuadros de mensajes no se desbordan ni se superponen

---

## Resolucion de Problemas

### El mensaje de minimo no aparece

1. Verificar en **Configuracion del tema** que "Enable minimum order amount" esta activado
2. Hacer hard refresh (`Cmd+Shift+R`)
3. Verificar en la consola que no hay errores en `custom.js`
4. Verificar que el elemento `[data-minimum-order]` existe en el HTML de la pagina (Inspeccionar > Elements > buscar `data-minimum-order`)

### El aviso de no reembolso no aparece con productos digitales

1. Verificar que "Show non-refundable notice for digital products" esta activado en la configuracion del tema
2. Verificar que el producto digital tiene **"This product does not require shipping"** desactivado en la configuracion del producto en Shopify
3. Verificar en la respuesta de `/cart.js` que el item tiene `"requires_shipping": false`

### El boton de checkout no se deshabilita

1. Verificar que `custom.js` se esta cargando (consola > Network > buscar `custom.js`)
2. Verificar que jQuery esta disponible en la pagina (escribir `$` o `jQuery` en la consola)
3. Verificar que el boton tiene la clase `cart__checkout-button`

### Los estilos no se aplican correctamente

1. Verificar que `custom.css` se esta cargando (Network > buscar `custom.css`)
2. Inspeccionar el elemento y verificar que las clases `custom-cart-qty-msg` y `digital-no-refund-msg` estan presentes
3. Verificar que no hay estilos de otro tema o extension que sobrescriban los estilos personalizados

---

## Plan de Reversion (Rollback)

Si se detecta un problema critico despues de publicar el tema:

1. Ir a: **Panel de Shopify > Tienda en linea > Temas**
2. En la seccion **"Biblioteca de temas"**, el tema anterior aparecera disponible
3. Hacer clic en los **tres puntos (...)** junto al tema anterior
4. Seleccionar **"Publicar"** para revertir al tema previo
5. Confirmar la publicacion

**[IMPORTANTE]** Shopify mantiene los temas anteriores en la biblioteca. La reversion es inmediata y no se pierde ningun dato.

---

## Lista de Verificacion Final

### Despliegue

- [ ] ZIP subido exitosamente a Shopify
- [ ] Tema publicado como tema activo
- [ ] Seccion "Cart & Checkout Rules" visible en configuracion del tema
- [ ] Valores por defecto correctos (minimo $40, avisos activados)

### Funcionalidad del Carrito

- [ ] Carrito vacio: checkout deshabilitado
- [ ] Producto digital >= $40: checkout habilitado + aviso de no reembolso
- [ ] Productos fisicos < $40: checkout deshabilitado + mensaje de minimo
- [ ] Productos fisicos >= $40: checkout habilitado, sin avisos
- [ ] Carrito mixto >= $40: checkout habilitado + aviso de no reembolso
- [ ] Eliminar productos actualiza la validacion automaticamente

### Visual y UX

- [ ] Mensaje de minimo: recuadro rojo/rosado legible
- [ ] Aviso de no reembolso: recuadro amarillo legible
- [ ] Responsive: mensajes se ven bien en movil
- [ ] Sin errores JavaScript en la consola

### Localizacion (Ingles/Espanol)

- [ ] Mensaje de minimo aparece en ingles cuando la tienda esta en ingles
- [ ] Mensaje de minimo aparece en espanol cuando la tienda esta en espanol
- [ ] Aviso de no reembolso aparece en el idioma correcto
- [ ] Campos de mensaje separados para ingles y espanol en configuracion del tema

### Configurabilidad

- [ ] Se puede cambiar el monto minimo desde el panel
- [ ] Se puede desactivar el minimo de pedido
- [ ] Se puede modificar el texto de no reembolso (ingles y espanol por separado)
- [ ] Monto en 0 usa el valor por defecto ($40)
- [ ] Monto negativo usa el valor por defecto ($40)
- [ ] Monto menor a $20 muestra advertencia en el editor de temas (no en la tienda publica)
- [ ] Los cambios se reflejan inmediatamente en la tienda

---

## Elementos Adicionales Incluidos en Este Despliegue

Los siguientes elementos fueron completados previamente y se activan con este tema:

| Elemento | Estado |
|----------|--------|
| Politica de Privacidad (Shopify automatico) | [LISTO] Se activa con el despliegue |
| Banner de Cookies (Shopify automatico) | [LISTO] Se activa con el despliegue |
| Pagina de Exclusion de Datos (CCPA) | [LISTO] Se activa con el despliegue |
| Shop Pay | [YA ACTIVO] Habilitado previamente |

### Verificacion Rapida Post-Despliegue

- [ ] Verificar que el banner de cookies aparece al visitar el sitio por primera vez
- [ ] Verificar que la politica de privacidad es accesible desde el pie de pagina
- [ ] Verificar que Shop Pay sigue disponible como opcion de pago

---

*Documento preparado para uso interno del desarrollador durante el despliegue del tema v13.4.9 en xiosbakery.com.*
