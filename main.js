const electron = require("electron");
const url = require("url");
const path = require("path");
const Papa = require("papaparse");
const { app, BrowserWindow, ipcMain } = electron;
const fs = require("fs");
let mainWindow;
let addWindow;
let editWindow;
let filePath = "l.csv";
let personasArray;
//convert file to a File object
let file = fs.readFileSync(filePath, "utf8");

// Listen for app to be ready
app.on("ready", function() {
  //Create new windows
  mainWindow = new BrowserWindow({});
  //Menu
  //mainWindow.setMenu(null);
  //Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file",
      slashes: true
    })
  );
  //Load csv
  Papa.parse(file, {
    complete: function(results) {
      // main process
      mainWindow.webContents.on("did-finish-load", () => {
        personasArray = results.data;
        mainWindow.webContents.send("personas-data", personasArray);
      });
    }
  });
  //Load add window
  mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
    if (url.includes("#add")) {
      createAddWindow();
    }
  });
  //Load edit window
  mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
    if (url.includes("#index")) {
      createEditWindow(url);
    }
  });

  //Quit app when closed
  mainWindow.on("closed", function() {
    app.quit();
  });
}); //END OF APP.ON

//Handle create add window
function createAddWindow() {
  //Create new window
  addWindow = new BrowserWindow({
    width: 600,
    height: 500,
    title: "Agregar cliente"
  });
  //Load html into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file",
      slashes: true
    })
  );
  //Garbage collection handle
  addWindow.on("close", function() {
    addWindow = null;
  });

  //Catch person:add
  ipcMain.on("person:add", function(e, person) {
    personasArray.push(person);
    saveAndSortArray();
    mainWindow.webContents.send("person:add", personasArray);
    addWindow.close();
  });
} //END OF CREATE ADD WINDOWS

//Handle create edit window
function createEditWindow(_url) {
  //Create new window
  editWindow = new BrowserWindow({
    width: 600,
    height: 500,
    title: "Editar cliente"
  });

  //Load html into window
  editWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "editWindow.html"),
      protocol: "file",
      slashes: true
    })
  );
  //Garbage collection handle
  editWindow.on("close", function() {
    editWindow = null;
  });

  //Catch person:edit
  ipcMain.on("person:edit", function(e, indexandperson) {
    personasArray[parseInt(indexandperson.i)] = indexandperson.person;
    saveAndSortArray();
    //mainWindow.webContents.send("person:edit", person);
    addWindow.close();
  });

  ipcMain.on("did-finish-load", () => {
    let index = _url.substr(_url.length - 1);
    let data = {
      i: index,
      person: personasArray[index]
    };

    editWindow.webContents.send("data", data);
  });

  //Garbage collection handle
  editWindow.on("close", function() {
    editWindow = null;
  });
} //END OF CREATE EDIT WINDOWS

//Auxiliar method, updateArray
function saveAndSortArray() {
  sortArray();
  fs.writeFile(filePath, Papa.unparse(personasArray), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function sortArray() {
  personasArray.sort(function(a, b) {
    if (a[0].toUpperCase() < b[0].toUpperCase()) return -1;
    if (a[0].toUpperCase() > b[0].toUpperCase()) return 1;
    return 0;
  });
}
