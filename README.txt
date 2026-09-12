EMPRESA HOGAR - SISTEMA DE VENTAS
=================================

Inicio rápido:
1. Descomprime el archivo ZIP.
2. Abre "abrir_sistema.bat" o haz doble clic en "index.html".
3. Inicia sesión con:
   Usuario: Limber
   Contraseña: deivi246

Incluye:
- Login funcional.
- Inicio con diseño moderno.
- Categorías: Bebidas, Harinas y otros, Verduras y Frutas.
- 16 productos.
- Buscador.
- Carrito lateral.
- Aumentar/disminuir cantidades.
- Eliminar productos.
- Cálculo automático del total.
- Realizar compra y confirmación.
- Menú lateral y versión móvil.

NOTA:
Es una versión HTML/CSS/JavaScript que funciona directamente en el navegador.
El usuario y contraseña están dentro del JavaScript, por lo que esta versión es
para demostración/prototipo, no para autenticación segura en producción.


NUEVAS FUNCIONES:
- Selección de pago: Efectivo, QR y Tarjeta de débito.
- Registro de ventas guardado en localStorage del navegador.
- Menú "Registro de ventas".
- Número de venta, fecha, usuario, forma de pago, productos y total.
- Botón "PDF / Imprimir": abre el diálogo de impresión del navegador; selecciona
  "Guardar como PDF" para generar el comprobante en PDF.
- El QR está preparado como espacio para colocar la imagen real del QR.

PARA PONER TU QR:
Coloca tu imagen como "mi-qr.png" en la misma carpeta y luego se puede conectar
al diseño. Si me subes tu imagen QR, puedo dejarla integrada en la siguiente versión.


DATOS DEL CLIENTE Y NIT:
- Al realizar la compra se solicita obligatoriamente el nombre del cliente.
- El cliente puede marcar "Desea NIT en su factura".
- Si marca NIT, se solicita el número de NIT.
- Si no desea NIT, la factura/comprobante se genera con "Sin NIT".
- Estos datos quedan guardados en el registro de ventas y aparecen en el comprobante PDF.
