const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  let person = [
    document.querySelector("#name").value,
    document.querySelector("#lastname").value,
    document.querySelector("#cuit").value
  ];
  ipcRenderer.send("person:add", person);
}
