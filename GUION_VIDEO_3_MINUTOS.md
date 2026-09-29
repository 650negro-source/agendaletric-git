# Guion video - Evidencia CRUD módulo de vehículos AgendaLetric

## 0:00 - 0:20 | Presentación

**Pantalla:** `cliente-registrar-vehiculo.html`

Hola, mi nombre es Jorge y voy a presentar el módulo de gestión de vehículos de mi proyecto AgendaLetric.

La funcionalidad implementa las cuatro operaciones CRUD: crear, consultar, actualizar y eliminar. También incluye búsqueda, filtros, cambio de estado, validaciones y persistencia mediante LocalStorage.

## 0:20 - 0:45 | Formulario y validaciones

**Pantalla:** formulario de registro.

Aquí registro los datos del dueño y del vehículo: nombre completo, correo, celular, marca, modelo, placa, año y tipo de vehículo.

El formulario tiene restricciones para evitar datos incorrectos. Por ejemplo, el nombre, la marca y el modelo tienen reglas para evitar cadenas sin una estructura válida; el celular solamente acepta 10 números; la placa debe tener tres letras y tres números; y el año solamente acepta cuatro números válidos.

En tipo de vehículo puedo seleccionar Gasolina, Diésel, Eléctrico o Híbrido.

**Demostración:** intenta escribir `jfhskjfhsflk` en nombre o marca y después coloca datos válidos.

## 0:45 - 1:05 | CREATE - Crear

**Pantalla:** formulario completo.

Puedes usar:

- Nombre: Carlos Pérez
- Correo: carlos@correo.com
- Celular: 3001234567
- Marca: Toyota
- Modelo: Corolla
- Placa: ABC123
- Año: 2023
- Tipo: Gasolina

Al presionar Guardar vehículo, JavaScript valida los datos, crea el registro y lo almacena en LocalStorage.

## 1:05 - 1:30 | READ - Consultar, buscar y filtrar

**Pantalla:** `cliente-vehiculos.html`

El vehículo aparece dinámicamente en la tabla. La información se recupera desde LocalStorage y JavaScript genera las filas de la tabla.

También puedo buscar por datos como dueño, marca, modelo, placa o correo, y puedo filtrar por tipo de vehículo y por estado.

**Demostración:** escribe `Toyota` en la búsqueda y luego selecciona `Gasolina`.

## 1:30 - 1:50 | Persistencia

**Pantalla:** F12 → Application o Aplicación → Local Storage.

Busco la clave `agendaletric_vehiculos`. Aquí puedo comprobar que los datos del dueño y del vehículo quedaron almacenados en el navegador.

## 1:50 - 2:15 | UPDATE - Actualizar

**Pantalla:** `cliente-vehiculos.html` y luego `cliente-registrar-vehiculo.html`

Selecciono Editar. El sistema busca el vehículo por su identificador y carga sus datos en el formulario.

Cambio, por ejemplo, el año de 2023 a 2024 y presiono Actualizar vehículo.

El registro modificado se guarda nuevamente en LocalStorage y aparece actualizado en la tabla.

## 2:15 - 2:35 | Activar e inactivar

**Pantalla:** `cliente-vehiculos.html`

Cada vehículo tiene un estado. Al seleccionar Inactivar, el sistema solicita confirmación y cambia el estado a Inactivo. Si vuelvo a seleccionarlo, puedo activarlo nuevamente.

Este cambio también queda guardado en LocalStorage y puedo utilizar el filtro de estado para consultar los vehículos activos o inactivos.

## 2:35 - 2:50 | DELETE - Eliminar

**Pantalla:** `cliente-vehiculos.html`

Finalmente selecciono Eliminar. El sistema solicita confirmación antes de retirar el vehículo. Después de confirmar, el registro se elimina de la lista y de LocalStorage.

## 2:50 - 3:00 | Conclusión

**Pantalla:** listado de vehículos y, si alcanza el tiempo, LocalStorage.

Con este módulo implementé el CRUD completo: crear, consultar, actualizar y eliminar. Además incorporé búsqueda, filtros, activación e inactivación, validaciones, reglas básicas de negocio, persistencia local y actualización dinámica de la interfaz en AgendaLetric.
