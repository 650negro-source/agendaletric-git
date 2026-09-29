# AgendaLetric — Evidencia JavaScript, CRUD y LocalStorage

## Funcionalidad seleccionada
Gestión de vehículos del cliente.

## Archivos principales
- `cliente-registrar-vehiculo.html`: formulario para crear y actualizar vehículos.
- `cliente-vehiculos.html`: listado dinámico de vehículos registrados.
- `assets/js/storage.js`: lectura, escritura, búsqueda e identificación en LocalStorage.
- `assets/js/new-vehicle.js`: validaciones, restricciones, creación y actualización.
- `assets/js/vehicles.js`: consulta dinámica y eliminación.

## CRUD implementado
- Create: registrar vehículo.
- Read: mostrar los vehículos almacenados.
- Update: editar un vehículo existente.
- Delete: eliminar un vehículo con confirmación.

## Persistencia local
La clave utilizada es:

`agendaletric_vehiculos`

Para comprobarla:
1. Ejecutar el proyecto con Live Server.
2. Abrir F12.
3. Ir a `Application / Aplicación`.
4. Abrir `Local Storage`.
5. Seleccionar la dirección de Live Server.
6. Buscar la clave `agendaletric_vehiculos`.

## Validaciones y reglas
- Marca: 2 a 30 caracteres; solo letras, espacios y guiones.
- Modelo: 1 a 30 caracteres; letras, números, espacios y guiones.
- Placa: exactamente 3 letras y 3 números, por ejemplo `ABC123`.
- Año: exactamente 4 números; desde 1950 hasta el año actual + 1.
- Tipo de vehículo permitido: Gasolina, Diésel, Eléctrico o Híbrido.
- No se permiten placas duplicadas.
- Los campos bloquean caracteres no permitidos mientras el usuario escribe.
- Antes de guardar, JavaScript vuelve a validar todos los datos.
- Los datos dinámicos se escapan antes de mostrarse en la tabla.
- Los accesos a LocalStorage incluyen control de errores.

## Prueba recomendada
Registrar:
- Marca: Toyota
- Modelo: Corolla
- Placa: ABC123
- Año: 2023
- Tipo: Gasolina

Después comprobar el registro en `cliente-vehiculos.html` y en LocalStorage. Editar el año a 2024, comprobar nuevamente y finalmente eliminar el vehículo.

## Actualización integral del formulario

El formulario de vehículos ahora registra también los datos del dueño:
- Nombre completo
- Correo electrónico
- Celular

Las validaciones controlan los datos mientras se escriben y nuevamente antes de guardar. El nombre completo no permite números, símbolos ni cadenas sin vocales o con secuencias excesivas de consonantes; el celular debe tener 10 números y comenzar por 3; el correo debe tener una estructura válida; la marca y el modelo tienen reglas de caracteres y estructura; la placa debe cumplir el formato ABC123; el año debe tener cuatro números dentro del rango permitido; y el tipo debe ser Gasolina, Diésel, Eléctrico o Híbrido.

Los datos del dueño se almacenan junto con cada vehículo y también se muestran en el listado para poder comprobar la información durante la demostración.
