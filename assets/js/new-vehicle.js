(function () {
  "use strict";

  const form = document.querySelector("#formVehiculo");
  const feedback = document.querySelector("#formFeedback");
  const pageTitle = document.querySelector("#formPageTitle");
  const submitButton = document.querySelector("#submitButton");

  if (!form || !feedback || !pageTitle || !submitButton) {
    console.error("No se encontraron los elementos necesarios del formulario de vehículos.");
    return;
  }

  if (!window.AgendaLetricStorage) {
    feedback.textContent = "No fue posible cargar el módulo de almacenamiento.";
    feedback.className = "feedback feedback--error";
    feedback.hidden = false;
    console.error("AgendaLetricStorage no está disponible.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const editingId = Number(params.get("id"));
  const isEditing = Number.isInteger(editingId) && editingId > 0;
  const currentYear = new Date().getFullYear();
  const allowedTypes = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];
  const allowedStatuses = ["Activo", "Inactivo"];

  const namePattern = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/;
  const brandPattern = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/;
  const modelPattern = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9]+)*$/;
  const platePattern = /^[A-Z]{3}[0-9]{3}$/;
  const phonePattern = /^3[0-9]{9}$/;
  const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

  function showFeedback(message, type = "error") {
    feedback.textContent = message;
    feedback.className = `feedback feedback--${type}`;
    feedback.hidden = false;
    feedback.focus();
  }

  function clearFeedback() {
    feedback.textContent = "";
    feedback.className = "feedback";
    feedback.hidden = true;
  }

  function normalizeSpaces(value) {
    return String(value).trim().replace(/\s+/g, " ");
  }

  function hasValidWordStructure(value) {
    const words = normalizeSpaces(value).split(" ");
    const vowels = /[AEIOUÁÉÍÓÚÜaeiouáéíóúü]/;

    if (words.some((word) => word.length < 2 || !vowels.test(word))) {
      return false;
    }

    if (/(.)\1\1/i.test(value)) {
      return false;
    }

    if (/[BCDFGHJKLMNPQRSTVWXYZÁÉÍÓÚÜÑ]{5,}/i.test(value)) {
      return false;
    }

    return true;
  }

  function sanitizeName(value) {
    return String(value)
      .replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ '-]/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/-{2,}/g, "-")
      .replace(/'{2,}/g, "'")
      .slice(0, 60);
  }

  function sanitizeBrand(value) {
    return String(value)
      .replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ '-]/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/-{2,}/g, "-")
      .replace(/'{2,}/g, "'")
      .slice(0, 30);
  }

  function sanitizeModel(value) {
    return String(value)
      .replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 '-]/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/-{2,}/g, "-")
      .replace(/'{2,}/g, "'")
      .slice(0, 30);
  }

  function sanitizePlate(value) {
    const source = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
    let result = "";

    for (const character of source) {
      if (result.length < 3) {
        if (/[A-Z]/.test(character)) {
          result += character;
        }
      } else if (result.length < 6 && /[0-9]/.test(character)) {
        result += character;
      }

      if (result.length === 6) {
        break;
      }
    }

    return result;
  }

  function sanitizeYear(value) {
    return String(value).replace(/\D/g, "").slice(0, 4);
  }

  function sanitizePhone(value) {
    return String(value).replace(/\D/g, "").slice(0, 10);
  }

  function sanitizeEmail(value) {
    return String(value).replace(/\s/g, "").slice(0, 100);
  }

  function getField(name) {
    return form.elements.namedItem(name);
  }

  function setFieldError(name, message) {
    const field = getField(name);
    if (!field) return;

    const fieldContainer = field.closest(".field");
    if (!fieldContainer) return;

    fieldContainer.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");

    const errorMessage = fieldContainer.querySelector(".error-msg");
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }

  function clearFieldError(name) {
    const field = getField(name);
    if (!field) return;

    const fieldContainer = field.closest(".field");
    if (!fieldContainer) return;

    fieldContainer.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  }

  function clearAllFieldErrors() {
    ["nombreCompleto", "correo", "telefono", "marca", "modelo", "placa", "anio", "tipo"].forEach(clearFieldError);
  }

  function validateVehicle(data, vehicles) {
    const errors = [];
    const normalizedName = normalizeSpaces(data.nombreCompleto);
    const normalizedBrand = normalizeSpaces(data.marca);
    const normalizedModel = normalizeSpaces(data.modelo);

    if (normalizedName.length < 5 || normalizedName.length > 60 || !namePattern.test(normalizedName) || !hasValidWordStructure(normalizedName)) {
      errors.push({
        field: "nombreCompleto",
        message: "El nombre completo debe contener nombres reales formados solo por letras, con al menos 5 caracteres. No se permiten números, símbolos ni cadenas sin vocales.",
      });
    }

    if (data.correo.length < 6 || data.correo.length > 100 || !emailPattern.test(data.correo)) {
      errors.push({
        field: "correo",
        message: "Ingresa un correo electrónico válido, por ejemplo: nombre@correo.com.",
      });
    }

    if (!phonePattern.test(data.telefono)) {
      errors.push({
        field: "telefono",
        message: "El celular debe tener exactamente 10 números y comenzar por 3. Ejemplo: 3001234567.",
      });
    }

    if (normalizedBrand.length < 2 || normalizedBrand.length > 30 || !brandPattern.test(normalizedBrand) || !hasValidWordStructure(normalizedBrand)) {
      errors.push({
        field: "marca",
        message: "La marca debe contener letras y tener entre 2 y 30 caracteres. No se permiten números ni texto sin estructura válida.",
      });
    }

    if (normalizedModel.length < 1 || normalizedModel.length > 30 || !modelPattern.test(normalizedModel) || !/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/.test(normalizedModel) || /[BCDFGHJKLMNPQRSTVWXYZÁÉÍÓÚÜÑ]{5,}/i.test(normalizedModel)) {
      errors.push({
        field: "modelo",
        message: "El modelo debe comenzar con una letra y tener una estructura válida. Se permiten letras, números, espacios y guiones.",
      });
    }

    if (!platePattern.test(data.placa)) {
      errors.push({
        field: "placa",
        message: "La placa debe tener exactamente 3 letras y 3 números. Ejemplo: ABC123.",
      });
    }

    const numericYear = Number(data.anio);
    if (!/^\d{4}$/.test(data.anio) || numericYear < 1950 || numericYear > currentYear + 1) {
      errors.push({
        field: "anio",
        message: `El año debe tener 4 números y estar entre 1950 y ${currentYear + 1}.`,
      });
    }

    if (!allowedTypes.includes(data.tipo)) {
      errors.push({
        field: "tipo",
        message: "Selecciona Gasolina, Diésel, Eléctrico o Híbrido.",
      });
    }

    const duplicate = vehicles.find(
      (vehicle) =>
        Number(vehicle.id) !== editingId &&
        String(vehicle.placa || "").trim().toUpperCase() === data.placa,
    );

    if (duplicate) {
      errors.push({
        field: "placa",
        message: "Ya existe un vehículo registrado con esa placa.",
      });
    }

    return errors;
  }

  function fillForm(vehicle) {
    getField("nombreCompleto").value = vehicle.nombreCompleto || "";
    getField("correo").value = vehicle.correo || "";
    getField("telefono").value = vehicle.telefono || "";
    getField("marca").value = vehicle.marca || "";
    getField("modelo").value = vehicle.modelo || "";
    getField("placa").value = vehicle.placa || "";
    getField("anio").value = vehicle.anio || "";
    getField("tipo").value = allowedTypes.includes(vehicle.tipo) ? vehicle.tipo : "";
  }

  function disableForm() {
    form.querySelectorAll("input, select, button").forEach((control) => {
      control.disabled = true;
    });
  }

  function prepareInputRestrictions() {
    const nombreCompleto = getField("nombreCompleto");
    const correo = getField("correo");
    const telefono = getField("telefono");
    const marca = getField("marca");
    const modelo = getField("modelo");
    const placa = getField("placa");
    const anio = getField("anio");
    const tipo = getField("tipo");

    nombreCompleto.addEventListener("input", () => {
      nombreCompleto.value = sanitizeName(nombreCompleto.value);
      clearFieldError("nombreCompleto");
      clearFeedback();
    });

    correo.addEventListener("input", () => {
      correo.value = sanitizeEmail(correo.value);
      clearFieldError("correo");
      clearFeedback();
    });

    telefono.addEventListener("input", () => {
      telefono.value = sanitizePhone(telefono.value);
      clearFieldError("telefono");
      clearFeedback();
    });

    marca.addEventListener("input", () => {
      marca.value = sanitizeBrand(marca.value);
      clearFieldError("marca");
      clearFeedback();
    });

    modelo.addEventListener("input", () => {
      modelo.value = sanitizeModel(modelo.value);
      clearFieldError("modelo");
      clearFeedback();
    });

    placa.addEventListener("input", () => {
      placa.value = sanitizePlate(placa.value);
      clearFieldError("placa");
      clearFeedback();
    });

    anio.addEventListener("input", () => {
      anio.value = sanitizeYear(anio.value);
      clearFieldError("anio");
      clearFeedback();
    });

    tipo.addEventListener("change", () => {
      clearFieldError("tipo");
      clearFeedback();
    });
  }

  prepareInputRestrictions();

  if (isEditing) {
    try {
      const vehicle = window.AgendaLetricStorage.getVehicleById(editingId);

      if (!vehicle) {
        showFeedback("El vehículo solicitado no existe o fue eliminado.");
        disableForm();
      } else {
        pageTitle.textContent = "Editar vehículo";
        submitButton.textContent = "Actualizar vehículo";
        fillForm(vehicle);
      }
    } catch (error) {
      console.error("No fue posible cargar el vehículo para editar.", error);
      showFeedback("No fue posible cargar la información del vehículo.");
      disableForm();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFeedback();
    clearAllFieldErrors();

    try {
      const vehicles = window.AgendaLetricStorage.readVehicles();
      const data = new FormData(form);

      const vehicleData = {
        nombreCompleto: normalizeSpaces(data.get("nombreCompleto") || ""),
        correo: sanitizeEmail(data.get("correo") || "").toLowerCase(),
        telefono: sanitizePhone(data.get("telefono") || ""),
        marca: normalizeSpaces(data.get("marca") || ""),
        modelo: normalizeSpaces(data.get("modelo") || ""),
        placa: sanitizePlate(data.get("placa") || ""),
        anio: sanitizeYear(data.get("anio") || ""),
        tipo: String(data.get("tipo") || ""),
        estado: isEditing ? (window.AgendaLetricStorage.getVehicleById(editingId)?.estado || "Activo") : "Activo",
      };

      getField("nombreCompleto").value = vehicleData.nombreCompleto;
      getField("correo").value = vehicleData.correo;
      getField("telefono").value = vehicleData.telefono;
      getField("marca").value = vehicleData.marca;
      getField("modelo").value = vehicleData.modelo;
      getField("placa").value = vehicleData.placa;
      getField("anio").value = vehicleData.anio;

      const errors = validateVehicle(vehicleData, vehicles);

      if (errors.length > 0) {
        errors.forEach((error) => setFieldError(error.field, error.message));
        showFeedback(`No se puede guardar: ${errors[0].message}`);
        getField(errors[0].field)?.focus();
        return;
      }

      const completeVehicle = {
        id: isEditing ? editingId : window.AgendaLetricStorage.getNextId(vehicles),
        ...vehicleData,
      };

      const updatedVehicles = isEditing
        ? vehicles.map((vehicle) =>
            Number(vehicle.id) === editingId ? completeVehicle : vehicle,
          )
        : [...vehicles, completeVehicle];

      window.AgendaLetricStorage.writeVehicles(updatedVehicles);

      const result = isEditing ? "updated" : "created";
      window.location.href = `cliente-vehiculos.html?result=${result}`;
    } catch (error) {
      console.error("No fue posible guardar el vehículo.", error);
      showFeedback("Ocurrió un error al guardar el vehículo. Verifica que LocalStorage esté disponible e inténtalo nuevamente.");
    }
  });
})();
