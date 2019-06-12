const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

let IndexAndpersonToEdit;

function submitForm(e) {
  e.preventDefault();
  let person = [
    document.querySelector("#name").value,
    document.querySelector("#lastname").value,
    document.querySelector("#cuit").value
  ];
  ipcRenderer.send("person:edit", IndexAndpersonToEdit);
}

ipcRenderer.send("did-finish-load", "cargo");

ipcRenderer.on("data", (event, data) => {
  IndexAndpersonToEdit = data;
  document.querySelector("#name").value = data.person[0];
  document.querySelector("#lastname").value = data.person[1];
  document.querySelector("#cuit").value = data.person[2];
});
