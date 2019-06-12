//Consts
const ipcRenderer = require("electron").ipcRenderer;
const addBtn = document.getElementById("add");
const navBar = document.getElementById("navBar");

//variables
let searchBtn = document.getElementById("search");
let quitSearchBtn;

//methods
function createPersonTemplate(nombre, apellido, cuit, i) {
  return `
        <li class="collection-item avatar">
            <i class="material-icons circle">person</i>
            <span class="title">${nombre} ${apellido}</span>
            <p>${cuit}</p>
            <a href="#index${i}" class="secondary-content">
                <i class="material-icons">create</i>
            </a>
        </li>
    `;
}

function changeToSearchNavbar(e) {
  navBar.innerHTML = `
    <div class="nav-wrapper container red lighten-3">
      <form>
        <div class="input-field">
          <input id="searchInput" onkeyup="search()" type="search" required>
          <label class="label-icon" for="search"><i class="material-icons">search</i></label>
          <i id="close" class="material-icons">close</i>
        </div>
      </form>
    </div>
    `;
  quitSearchBtn = document.getElementById("close");
  quitSearchBtn.addEventListener("click", changeToNormalNavbar);
  document.getElementById("searchInput").focus();
}

function changeToNormalNavbar(e) {
  let input, filter, ul, li, a, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("personas");
  li = ul.getElementsByTagName("li");
  navBar.innerHTML = `
    <div class="nav-wrapper container">
        <a href="#!" class="brand-logo left">Lista</a>
        <ul class="right">
            <li>
                <a id="search" href="#">
                    <i class="material-icons">search</i>
                </a>
            </li>
            <li>
                <a id="add" href="#add">
                    <i class="material-icons">add</i>
                </a>
            </li>
        </ul>
    </div>
      `;
  for (i = 0; i < li.length; i++) {
    li[i].style.display = "";
  }
  searchBtn = document.getElementById("search");
  searchBtn.addEventListener("click", changeToSearchNavbar);
}

function search() {
  let input, filter, ul, li, a, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("personas");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("span")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function renderPersons(_personas) {
  let list = document.getElementById("personas");
  list.innerHTML = "";
  _personas.forEach((element, index) => {
    let tpl = createPersonTemplate(element[0], element[1], element[2], index);
    list.innerHTML += tpl;
  });
}

//Event Listener
searchBtn.addEventListener("click", changeToSearchNavbar);

//receive data from main.js
ipcRenderer.on("personas-data", function(event, _personas) {
  renderPersons(_personas);
});

ipcRenderer.on("person:add", function(event, _personas) {
  renderPersons(_personas);
});
