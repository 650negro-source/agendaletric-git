(function () {
  "use strict";

  const tableBody = document.querySelector("#vehiclesTableBody");
  const tableWrap = document.querySelector("#vehiclesTableWrap");
  const emptyState = document.querySelector("#emptyState");
  const resultsSummary = document.querySelector("#resultsSummary");
  const feedback = document.querySelector("#feedback");
  const searchInput = document.querySelector("#vehicleSearch");
  const typeFilter = document.querySelector("#vehicleTypeFilter");
  const statusFilter = document.querySelector("#vehicleStatusFilter");

  if (!tableBody || !tableWrap || !emptyState || !resultsSummary || !feedback) {
    console.error("No se encontraron los elementos necesarios del listado de vehículos.");
    return;
  }

  if (!window.AgendaLetricStorage) {
    feedback.textContent = "No fue posible cargar el módulo de almacenamiento.";
    feedback.className = "feedback feedback--error";
    feedback.hidden = false;
    console.error("AgendaLetricStorage no está disponible.");
    return;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showFeedback(message, type = "success") {
    feedback.textContent = message;
    feedback.className = `feedback feedback--${type}`;
    feedback.hidden = false;
  }

  function normalizeVehicle(vehicle) {
    return {
      ...vehicle,
      estado: vehicle.estado === "Inactivo" ? "Inactivo" : "Activo",
    };
  }

  function createRow(vehicle) {
    const id = Number(vehicle.id);
    const statusClass = vehicle.estado === "Activo" ? "badge badge-confirmada" : "badge badge-cancelada";
    const statusText = vehicle.estado === "Activo" ? "Activo" : "Inactivo";
    const actionText = vehicle.estado === "Activo" ? "Inactivar" : "Activar";
    const actionClass = vehicle.estado === "Activo" ? "btn-danger" : "btn-secondary";

    return `
      <tr>
        <td><strong>${escapeHtml(vehicle.marca)} ${escapeHtml(vehicle.modelo)}</strong></td>
        <td>${escapeHtml(vehicle.nombreCompleto)}</td>
        <td>${escapeHtml(vehicle.correo)}</td>
        <td>${escapeHtml(vehicle.telefono)}</td>
        <td>${escapeHtml(vehicle.placa)}</td>
        <td>${escapeHtml(vehicle.anio)}</td>
        <td>${escapeHtml(vehicle.tipo)}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
          <div class="cluster">
            <a class="btn btn-secondary btn-sm" href="cliente-registrar-vehiculo.html?id=${id}">Editar</a>
            <button class="btn ${actionClass} btn-sm" type="button" data-action="toggle" data-id="${id}">${actionText}</button>
            <button class="btn btn-danger btn-sm" type="button" data-action="delete" data-id="${id}">Eliminar</button>
          </div>
        </td>
      </tr>`;
  }

  function getFilteredVehicles() {
    const vehicles = window.AgendaLetricStorage.readVehicles().map(normalizeVehicle);
    const search = String(searchInput?.value || "").trim().toLowerCase();
    const selectedType = String(typeFilter?.value || "");
    const selectedStatus = String(statusFilter?.value || "");

    return vehicles.filter((vehicle) => {
      const searchableText = [
        vehicle.nombreCompleto,
        vehicle.correo,
        vehicle.telefono,
        vehicle.marca,
        vehicle.modelo,
        vehicle.placa,
        vehicle.anio,
        vehicle.tipo,
        vehicle.estado,
      ].join(" ").toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);
      const matchesType = !selectedType || vehicle.tipo === selectedType;
      const matchesStatus = !selectedStatus || vehicle.estado === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  function renderVehicles() {
    try {
      const allVehicles = window.AgendaLetricStorage.readVehicles();
      const validVehicles = allVehicles
        .map(normalizeVehicle)
        .filter((vehicle) => vehicle && Number.isInteger(Number(vehicle.id)) && Number(vehicle.id) > 0);
      const filteredVehicles = getFilteredVehicles();

      tableBody.innerHTML = filteredVehicles.map(createRow).join("");
      resultsSummary.textContent = `Mostrando ${filteredVehicles.length} de ${validVehicles.length} vehículo${validVehicles.length === 1 ? "" : "s"}`;

      const hasResults = filteredVehicles.length > 0;
      const hasVehicles = validVehicles.length > 0;
      emptyState.hidden = hasResults;
      tableWrap.hidden = !hasResults;

      if (!hasResults && hasVehicles) {
        emptyState.querySelector("h3").textContent = "No hay vehículos que coincidan";
        emptyState.querySelector("p").textContent = "Prueba con otro texto o cambia los filtros.";
      } else if (!hasVehicles) {
        emptyState.querySelector("h3").textContent = "No hay vehículos registrados";
        emptyState.querySelector("p").textContent = "Registra un vehículo para verlo en este listado.";
      }
    } catch (error) {
      console.error("No fue posible mostrar los vehículos.", error);
      tableBody.innerHTML = "";
      tableWrap.hidden = true;
      emptyState.hidden = false;
      resultsSummary.textContent = "No fue posible cargar los vehículos";
      showFeedback("Ocurrió un error al consultar los vehículos guardados.", "error");
    }
  }

  function deleteVehicle(id) {
    try {
      const vehicles = window.AgendaLetricStorage.readVehicles();
      const vehicle = vehicles.find((item) => Number(item.id) === id);

      if (!vehicle) {
        showFeedback("El vehículo seleccionado ya no existe.", "error");
        renderVehicles();
        return;
      }

      const confirmed = window.confirm(
        `¿Deseas eliminar el vehículo ${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}?`,
      );

      if (!confirmed) return;

      const updatedVehicles = vehicles.filter((item) => Number(item.id) !== id);
      window.AgendaLetricStorage.writeVehicles(updatedVehicles);
      renderVehicles();
      showFeedback("Vehículo eliminado correctamente.", "success");
    } catch (error) {
      console.error("No fue posible eliminar el vehículo.", error);
      showFeedback("Ocurrió un error al eliminar el vehículo.", "error");
    }
  }

  function toggleVehicleStatus(id) {
    try {
      const vehicles = window.AgendaLetricStorage.readVehicles();
      const position = vehicles.findIndex((item) => Number(item.id) === id);

      if (position === -1) {
        showFeedback("El vehículo seleccionado ya no existe.", "error");
        renderVehicles();
        return;
      }

      const vehicle = normalizeVehicle(vehicles[position]);
      const nextStatus = vehicle.estado === "Activo" ? "Inactivo" : "Activo";
      const action = nextStatus === "Activo" ? "activar" : "inactivar";
      const confirmed = window.confirm(
        `¿Deseas ${action} el vehículo ${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}?`,
      );

      if (!confirmed) return;

      vehicles[position] = { ...vehicle, estado: nextStatus };
      window.AgendaLetricStorage.writeVehicles(vehicles);
      renderVehicles();
      showFeedback(`Vehículo ${nextStatus.toLowerCase()} correctamente.`, "success");
    } catch (error) {
      console.error("No fue posible cambiar el estado del vehículo.", error);
      showFeedback("Ocurrió un error al cambiar el estado del vehículo.", "error");
    }
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;

    const id = Number(actionButton.dataset.id);
    if (!Number.isInteger(id) || id <= 0) {
      showFeedback("El identificador del vehículo no es válido.", "error");
      return;
    }

    if (actionButton.dataset.action === "delete") {
      deleteVehicle(id);
    } else if (actionButton.dataset.action === "toggle") {
      toggleVehicleStatus(id);
    }
  });

  searchInput?.addEventListener("input", renderVehicles);
  typeFilter?.addEventListener("change", renderVehicles);
  statusFilter?.addEventListener("change", renderVehicles);

  const result = new URLSearchParams(window.location.search).get("result");

  if (result === "created") {
    showFeedback("Vehículo registrado correctamente.", "success");
  } else if (result === "updated") {
    showFeedback("Vehículo actualizado correctamente.", "success");
  }

  renderVehicles();
})();
