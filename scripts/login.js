// Elementos HTML
const form = document.getElementById("login");
const userInput = document.getElementById("user");
const passwordInput = document.getElementById("password");
const button = form.querySelector("button");
const inputs = form.querySelectorAll("input");
const checkedInput = document.getElementById("remember");

// Eventos para los inputs
inputs.forEach((input) => {
    input.addEventListener("input", (e) => validateInputs(e));
});

// Evento al hacer submit
form.addEventListener("submit", (e) => onSubmit(e));

// Evento al cargar la web
document.addEventListener("DOMContentLoaded", () => {
    // Si existe isLogin se redirege al CRUD
    if (localStorage.getItem("isLogin")) {
        window.location.href = "./crud.html";
    }
})

// Array de objetos
const users = [
    {
        user: "admin",
        password: "admin"
    },
    {
        user: "lechuga",
        password: "123456"
    }
]


// Funcion para validar inputs
function validateInputs(e) {
    e.preventDefault();
    // Input el cual se está modificando
    const input = e.target;
    // ID para el mensaje de error
    const id = input.getAttribute("aria-describedby");
    const msg = document.getElementById(id);
    // Variable para verificar que pase todos los filtros
    let valid = true;
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
        msg.textContent = "Campo válido";
        msg.classList.replace("invalid-feedback", "valid-feedback");
    }

    // Si ambos inputs tienen datos y pasa la validación
    if (userInput.value.trim() && passwordInput.value.trim() && valid) button.disabled = false;
    else button.disabled = true;
}

function onSubmit(e) {
    e.preventDefault();

    // Buscar el usuario en el array de objetos
    const user = users.find((user) => user.user == userInput.value);

    // Si no se encuentra el usuario
    if (!user) {
        userInput.classList.add("is-invalid");
        document.getElementById("helpUser").classList.add("invalid-feedback")
        document.getElementById("helpUser").textContent = "Usuario no encontrado";
        button.disabled = true;
        return;
    }

    // Si la contraseña no coincide
    if (user.password !== passwordInput.value) {
        passwordInput.classList.add("is-invalid");
        document.getElementById("helpPassword").classList.add("invalid-feedback");
        document.getElementById("helpPassword").textContent = "Contraseña incorrecta";
        button.disabled = true;
        return;
    }

    // Si el checkbox está seleccionado
    if (checkedInput.checked) {
        localStorage.setItem("isLogin", true);
    }

    // Se redirige
    window.location.href = "./crud.html";
}