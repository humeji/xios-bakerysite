# Guia: Configuracion de Correo Personalizado en Shopify

**Version:** 2.0  
**Fecha:** 23 de febrero de 2026  
**Actualizado por:** Hugo Mejia

---

## Proposito

Esta guia te ayudara a configurar un correo personalizado (ejemplo: `info@xiosbakery.com`) para que los correos de tu tienda lleguen a tus clientes desde tu dominio en lugar de un correo generico de Shopify.

**Tiempo estimado:** 5-10 minutos

---

## Informacion de Tu Tienda

| Dato | Valor |
|------|-------|
| Dominio | `xiosbakery.com` |
| Administrado por | Shopify (dominio primario) |
| Correo con reenvio activo | `info@xiosbakery.com` |
| Correo que recibe los mensajes | `xiosbakery@hotmail.com` |

---

## Por Que Es Importante

Si usas un correo publico como `@hotmail.com`, `@gmail.com`, o `@outlook.com` como remitente, Shopify **no puede enviar correos desde esa direccion**. En su lugar, tus clientes veran un correo generico como:

```
store+61899735195@shopifyemail.com
```

Esto no se ve profesional. Usando un correo de tu dominio como `info@xiosbakery.com`, tus clientes veran tu marca.

---

## Paso 1: Verificar Que El Reenvio de Correo Esta Activo

1. Inicia sesion en tu **Panel de Shopify** (`admin.shopify.com`)
2. Ve a **Configuracion** (esquina inferior izquierda)
3. Haz clic en **Dominios**
4. Haz clic en tu dominio `xiosbakery.com`
5. Busca la seccion **"Reenvio de correo electronico"** (Email forwarding)
6. Confirma que aparece esta entrada:

| Correo de reenvio | Correo que recibe |
|-------------------|-------------------|
| `info@xiosbakery.com` | `xiosbakery@hotmail.com` |

**Si ya aparece** --> Ve al Paso 2.

**Si no aparece** --> Haz clic en **"Agregar direccion de reenvio"** (Add forwarding email) y crea la entrada con los datos de la tabla.

---

## Paso 2: Cambiar el Correo del Remitente en Notificaciones

1. Ve a **Configuracion** > **Notificaciones**
2. Arriba veras la seccion **"Correo electronico del remitente"** (Sender email)
3. Si ves el aviso azul que dice que correos publicos no soportan envio personalizado, eso confirma que necesitas cambiarlo
4. Borra el correo actual (ejemplo: `xiosbakery@hotmail.com`)
5. Escribe tu correo de dominio: **`info@xiosbakery.com`**
6. Haz clic en **Guardar**

---

## Paso 3: Verificar El Correo Nuevo

Despues de guardar, Shopify te pedira verificar que eres duena del correo:

1. Shopify enviara un correo de verificacion a `info@xiosbakery.com`
2. Como el reenvio esta activo, este correo llegara a tu Hotmail (`xiosbakery@hotmail.com`)
3. Abre el correo de verificacion en tu Hotmail
4. Haz clic en el **enlace de verificacion**
5. Regresa a Shopify y confirma que el correo esta verificado (el aviso azul debe desaparecer)

---

## Paso 4: Configurar Autenticacion (Opcional pero Recomendado)

Para mejorar la entrega de correos y evitar que lleguen a spam:

1. Ve a **Configuracion** > **Notificaciones**
2. Busca la seccion **"Autenticacion de correo electronico del remitente"**
3. Shopify te mostrara registros DNS que debes agregar

**Como tu dominio esta en Shopify**, esto puede configurarse automaticamente. Si Shopify te pide agregar registros DNS manualmente:

1. Ve a **Configuracion** > **Dominios** > `xiosbakery.com`
2. Haz clic en **"Administrar"** (Manage) junto a **Configuracion DNS** (DNS settings)
3. Agrega los registros que Shopify te indico

---

## Paso 5: Verificar Que Todo Funciona

1. Ve a tu tienda y haz una compra de prueba
2. Revisa que el correo de confirmacion llegue **desde** `info@xiosbakery.com`
3. Verifica que **no** llegue a la carpeta de spam

---

## Si Quieres Agregar Otro Correo en el Futuro

Por ejemplo, si quieres crear `pedidos@xiosbakery.com`:

1. Ve a **Configuracion** > **Dominios** > `xiosbakery.com`
2. En la seccion **"Reenvio de correo electronico"**, haz clic en **"Agregar direccion de reenvio"**
3. Escribe `pedidos` como la direccion (solo la parte antes del @)
4. En correo de destino, escribe `xiosbakery@hotmail.com`
5. Guarda
6. Luego ve a **Configuracion** > **Notificaciones** y cambia el remitente a `pedidos@xiosbakery.com`
7. Verifica el correo nuevo siguiendo el Paso 3

---

## Resumen Rapido

| Paso | Que hacer | Tiempo |
|------|-----------|--------|
| 1 | Confirmar que el reenvio de correo esta activo en Dominios | 1 min |
| 2 | Cambiar el correo del remitente en Notificaciones | 2 min |
| 3 | Verificar el correo nuevo desde tu Hotmail | 2 min |
| 4 | Configurar autenticacion DNS (opcional) | 5-10 min |
| 5 | Hacer una compra de prueba | 3 min |

---

## Necesitas Ayuda?

Si tienes problemas con algun paso, tienes dos opciones:

1. **Enviame un mensaje** describiendo en que paso estas y que error ves
2. **Agenda una llamada** para que te guie paso a paso (se cobra por tiempo)

---

*Guia preparada por Hugo Mejia*
