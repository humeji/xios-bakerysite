# Guía: Configuración de Correo Personalizado en Shopify

**Versión:** 1.0  
**Fecha:** 19 de febrero de 2026  
**Preparado por:** Hugo Mejia

---

## Propósito

Esta guía te ayudará a configurar un correo personalizado (ejemplo: `pedidos@xiosbakery.com`) para que los recetarios digitales lleguen a tus clientes desde tu dominio en lugar de un correo genérico de Shopify.

**Tiempo estimado:** 15-30 minutos

---

## Antes de Empezar

Necesitas saber:

1. **¿Dónde compraste tu dominio?**
   - ¿En Shopify?
   - ¿En GoDaddy, Namecheap, Google Domains, u otro?

2. **¿Tienes acceso a tu cuenta de Shopify como administradora?**

---

## Paso 1: Verificar Dónde Está Tu Dominio

1. Inicia sesión en tu **Panel de Shopify**
2. Ve a **Configuración** (esquina inferior izquierda)
3. Haz clic en **Dominios**
4. Busca tu dominio `xiosbakery.com`

**Si dice "Administrado por Shopify"** → Sigue a Paso 2A  
**Si dice "Conectado desde terceros"** → Sigue a Paso 2B

---

## Paso 2A: Crear Correo (Si Tu Dominio Está en Shopify)

### Configurar Reenvío de Correo

1. En **Configuración** > **Dominios**
2. Haz clic en tu dominio `xiosbakery.com`
3. Busca la sección **"Reenvío de correo electrónico"**
4. Haz clic en **"Agregar dirección de reenvío"**
5. Completa los campos:
   - **Dirección de correo de la tienda:** `pedidos` (solo escribe la parte antes del @)
   - **Dirección de reenvío:** tu correo personal (ejemplo: `tu-email@gmail.com`)
6. Haz clic en **Guardar**

**Resultado:** Los correos enviados a `pedidos@xiosbakery.com` llegarán a tu Gmail (o el correo que elegiste).

---

## Paso 2B: Crear Correo (Si Tu Dominio Está en Otro Lugar)

Si tu dominio está en GoDaddy, Namecheap, u otro proveedor:

1. Inicia sesión en tu cuenta del proveedor de dominio
2. Busca la opción de **"Email Forwarding"** o **"Reenvío de correo"**
3. Crea una dirección como `pedidos@xiosbakery.com`
4. Configúrala para reenviar a tu correo personal

**Nota:** Cada proveedor tiene pasos diferentes. Si necesitas ayuda con esto, contáctame.

---

## Paso 3: Configurar el Correo del Remitente en Shopify

Ahora que tienes tu correo personalizado, configura Shopify para usarlo:

1. Ve a **Configuración** > **Notificaciones**
2. Busca la sección **"Correo electrónico del remitente"**
3. En el campo **"Correo electrónico del remitente"**, escribe tu nuevo correo:
   - Ejemplo: `pedidos@xiosbakery.com`
4. Haz clic en **Guardar**

---

## Paso 4: Verificar Tu Correo

Shopify te pedirá verificar que eres dueña del correo:

1. Shopify enviará un correo de verificación a `pedidos@xiosbakery.com`
2. Como configuraste el reenvío, este correo llegará a tu Gmail
3. Abre el correo y haz clic en el **enlace de verificación**
4. Regresa a Shopify y confirma que el correo está verificado

---

## Paso 5: Configurar Autenticación (Opcional pero Recomendado)

Para mejorar la entrega de correos y evitar que lleguen a spam:

1. Ve a **Configuración** > **Notificaciones**
2. Busca la sección **"Autenticación de correo electrónico del remitente"**
3. Shopify te mostrará registros DNS que debes agregar
4. Copia estos registros y agrégalos en tu proveedor de dominio

**Si tu dominio está en Shopify:** Esto puede ser automático.

**Si tu dominio está en otro lugar:** Necesitarás agregar los registros manualmente en tu proveedor.

---

## Verificar Que Todo Funciona

1. Ve a tu tienda y haz una compra de prueba de un recetario
2. Revisa que el correo de confirmación llegue desde `pedidos@xiosbakery.com`
3. Verifica que no llegue a la carpeta de spam

---

## Resumen de Pasos

| Paso | Descripción | Tiempo |
|------|-------------|--------|
| 1 | Verificar dónde está tu dominio | 2 min |
| 2 | Crear dirección de correo con reenvío | 5-10 min |
| 3 | Configurar correo del remitente en Shopify | 3 min |
| 4 | Verificar el correo | 2 min |
| 5 | Configurar autenticación DNS (opcional) | 10-15 min |

---

## ¿Necesitas Ayuda?

Si tienes problemas con algún paso, tienes dos opciones:

1. **Envíame un mensaje** describiendo en qué paso estás y qué error ves
2. **Agenda una llamada** para que te guíe paso a paso (se cobra por tiempo)

---

*Guía preparada por Hugo Mejia*
