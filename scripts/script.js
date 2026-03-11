// Elementos HTML
const idInput = document.getElementById("id");
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const date = document.getElementById("date");
const submit = document.getElementById("submit");
const inputs = document.querySelectorAll("#formData input");
const form = document.getElementById("formData");
const table = document.getElementById("data");

// Esudiantes del localStorage o array vacío si no hay en el storage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Eventos para los inputs
inputs.forEach((input) => {
    input.addEventListener("input", (e) => validateInputs(e));
});

// Evento para cargar los estudiantes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLogin") !== "true") return window.location.href = "./index.html";

    findAllStudents();
});

// Evento al hacer submit en el formulario
form.addEventListener("submit", (e) => onSubmit(e));

// Validar los inputs
function validateInputs(e) {
    e.preventDefault();
    // Input el cual se está modificando
    const input = e.target;

    // ID para el mensaje de error
    const id = input.getAttribute("aria-describedby");
    const msg = document.getElementById(id);
    // Atributo name
    const nameAtributte = input.getAttribute("name");
    // Variable para verificar que pase todos los filtros
    let valid = true
    // Limpiar mensajes e inicializar las clases
    msg.textContent = "";
    msg.classList.add("valid-feedback");
    input.classList.add("is-valid");

    // Si el input está vacío
    if (!input.value.trim()) {
        input.classList.replace("is-valid", "is-invalid");
        msg.textContent = "Este campo es obligatorio";
        msg.classList.replace("valid-feedback", "invalid-feedback");
        valid = false
    } else {
        input.classList.replace("is-invalid", "is-valid");
        msg.textContent = "Campo valido";
        msg.classList.replace("invalid-feedback", "valid-feedback");
    }

    // Si el input name no contiene letras
    if (nameAtributte === "name" && !/^[A-Za-z\s]+$/.test(input.value)) {
        input.classList.replace("is-valid", "is-invalid");
        msg.classList.replace("valid-feedback", "invalid-feedback");
        msg.textContent = "Solo se permiten letras";
        valid = false

        // Si el input email no tiene el formato de correo
    } else if (nameAtributte === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.replace("is-valid", "is-invalid");
        msg.classList.replace("valid-feedback", "invalid-feedback");
        msg.textContent = "Ingrese un correo electrónico válido";
        valid = false

        // Si el input de fecha es mayor a la actual
    } else if (nameAtributte === "phone" && !/^\d{10}$/.test(input.value)) {
        input.classList.replace("is-valid", "is-invalid");
        msg.classList.replace("valid-feedback", "invalid-feedback");
        msg.textContent = "El teléfono debe tener 10 dígitos";
        valid = false
    } else if (nameAtributte === "date" && new Date(date.value) > new Date()) {
        input.classList.replace("is-valid", "is-invalid");
        msg.classList.replace("valid-feedback", "invalid-feedback");
        msg.textContent = "La fecha no puede ser mayor a la actual";
        valid = false
    }

    // Validamos que cada campo tenga un valor para activar y desactiva el boton
    if (nameInput.value.trim() && email.value.trim() && date.value.trim() && valid) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}

// Vaciar todos los campos y desactiva el botón
function resetForm() {
    inputs.forEach((input) => {
        input.value = "";
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
    });
    submit.disabled = true;
}


// Al hacer submit
function onSubmit(e) {
    // Para evitar que se recargue la web
    e.preventDefault();
    // Si el id en el input no existe
    if (!id.value.trim()) {
        addStudent();
        resetForm();
    } else {
        updateStudent();
        resetForm();
    }
}

// Obtener los estudiantes
function findAllStudents() {
    // Si hay estudiantes registrados mostramos la tabla
    if (students.length > 0) table.classList.remove("d-none");
    else table.classList.add("d-none");

    // Tbody
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    // Recorremos los estudiantes
    students.forEach((student) => {
        // Creamos todos los elementos HTML de la tabla
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const phoneCell = document.createElement("td");
        const dateCell = document.createElement("td");
        const ageCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        // Les ingresamos los datos
        idCell.textContent = student.id;
        nameCell.textContent = student.name;
        emailCell.textContent = student.email;
        phoneCell.textContent = student.phone;
        dateCell.textContent = student.date;
        ageCell.textContent = student.age;
        actionsCell.innerHTML = `<button class="btn btn-warning" " onclick="editStudent(${student.id})">Editar</button>
                                <button class="btn btn-danger" onclick="removeStudent(${student.id})">Eliminar</button>`;

        // Los insertamos a la fila
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(dateCell);
        row.appendChild(ageCell);
        row.appendChild(actionsCell);

        // Se inserta la fila al tbody
        tbody.appendChild(row);
    })
}

function calculateAge(dateBirth) {
    // Fecha de hoy
    const today = new Date()
    // Fecha de nacimiento
    const birthDay = new Date(dateBirth)

    // Restamos el año actual y el de nacimiento
    let age = today.getFullYear() - birthDay.getFullYear()

    // restamos el mes actual y el mes de nacimiento
    const month = today.getMonth() - birthDay.getMonth();

    // Si el mes es menor a 0 o si el mes es igual a 0 y el día actual es menor al día de nacimiento restamos la edad 1 año
    if (month < 0 || (month === 0 && today.getDate() < birthDay.getDate())) age--;

    // Retornamos la fecha
    return age;
}

// Agregar estudiante
function addStudent() {
    // Objeto con todos los estudiantes y un ID aleatorio
    const student = {
        id: Math.floor(Math.random() * 1000),
        name: nameInput.value,
        email: email.value,
        phone: phone.value,
        age: calculateAge(date.value),
        date: date.value,
    }
    // Lo agregamos al arra y al localStorage
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
    // Recargamos la tabla
    findAllStudents();
}

// Elminar estudiante
function removeStudent(id) {
    // Alerta de confirmación
    res = confirm("Deseas eliminar este estudiante?")
    // Si se cancela
    if (!res) return;

    // Obtenemos todos los estudiantes menos el qué se desea eliminar
    const newStudents = students.filter((student) => student.id !== id);
    // Reeescribimos la variable y el localStorage
    localStorage.setItem("students", JSON.stringify(newStudents));
    students = newStudents;
    findAllStudents();
}

// Llenar los inputs con el seleccionado
function editStudent(id) {
    // Obtenemos el estudiante con el ID
    const student = students.find((student) => student.id == id);
    // Se llenan los inputs con toda la info
    idInput.value = student.id;
    nameInput.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    date.value = student.date;
    submit.disabled = false;
}

// Actualizar estudiante
function updateStudent() {
    const student = students.find((student) => student.id == idInput.value);
    // Reescribimos el objeto del estudiante seleccionado
    student.name = nameInput.value;
    student.email = email.value;
    student.phone = phone.value;
    student.date = date.value;
    student.age = calculateAge(date.value)
    // Recargamos la tabla
    findAllStudents();
    // Actualizamos el localStorage
    localStorage.setItem("students", JSON.stringify(students));
}

function logOut() {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("isRemember");

    window.location.href = "./index.html";
}

