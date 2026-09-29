(function () {
  "use strict";

  const STORAGE_KEY = "agendaletric_vehiculos";

  function isStorageAvailable() {
    try {
      const testKey = "__agendaletric_test__";
      localStorage.setItem(testKey, "ok");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error("LocalStorage no está disponible en este navegador.", error);
      return false;
    }
  }

  function readVehicles() {
    if (!isStorageAvailable()) {
      return [];
    }

    try {
      const savedVehicles = localStorage.getItem(STORAGE_KEY);

      if (!savedVehicles) {
        return [];
      }

      const vehicles = JSON.parse(savedVehicles);

      if (!Array.isArray(vehicles)) {
        console.error("Los datos guardados de vehículos no tienen un formato válido.");
        return [];
      }

      return vehicles;
    } catch (error) {
      console.error("No fue posible leer los vehículos guardados.", error);
      return [];
    }
  }

  function writeVehicles(vehicles) {
    if (!Array.isArray(vehicles)) {
      throw new TypeError("La información de vehículos debe ser una lista válida.");
    }

    if (!isStorageAvailable()) {
      throw new Error("El almacenamiento local del navegador no está disponible.");
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (error) {
      console.error("No fue posible guardar los vehículos.", error);
      throw new Error("No se pudo guardar la información en LocalStorage.");
    }
  }

  function getVehicleById(id) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return undefined;
    }

    return readVehicles().find((vehicle) => Number(vehicle.id) === numericId);
  }

  function getNextId(vehicles) {
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return 1;
    }

    const validIds = vehicles
      .map((vehicle) => Number(vehicle.id))
      .filter((id) => Number.isInteger(id) && id > 0);

    return validIds.length === 0 ? 1 : Math.max(...validIds) + 1;
  }

  window.AgendaLetricStorage = {
    STORAGE_KEY,
    readVehicles,
    writeVehicles,
    getVehicleById,
    getNextId,
  };
})();
