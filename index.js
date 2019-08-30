const api = require('./build/index');

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

(async function(){

  async function testCreate(){
    const createUser = {
      'customfield10': "test",
      // 'entity': "person",
      'person.country_of_birth.id': 15,
      'person.date_of_birth': "28/04/1980",
      'person.email': "mro@uniandes.edu.co",
      'person.fax': "1234567",
      // 'person.first_name': "Mariana",
      'person.gender.id': 2,
      'person.groups': "1,2,3,4",
      'person.iddoc_expired_on': "10/06/1979",
      'person.iddoc_issued_by': "fabian wulf",
      'person.iddoc_issued_on': "10/06/1978",
      'person.iddoc_number': "1234567",
      'person.iddoc_type': "1",
      'person.matriculation_id': "123456",
      'person.mobile': "1234567",
      'person.national.id': "123456",
      'person.nationality.id': 1,
      'person.phone': "12345",
      'person.phone_2': "123467",
      'person.place_of_birth': "Pasto, NA",
      'person.preferred_language.id': 2,
      'person.privacy_consent': "1",
      'person.remarks': "Person remarks",
      'person.second_nationality.id': 2,
      'person.surname': "Rodriguez",
      'person.title': "Ms"
    };
    const r = await api.create("person", createUser);
    console.log(r);
  }

  async function testGet(){
    const fields = ["person.first_name", "person.surname", "person.date_of_birth", "person.matriculation_id"];
    console.log(await api.getAll('person', fields, 2));
  }

  await testGet();
})();
