const { app, BrowserWindow,ipcMain, Menu} = require('electron');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

let mainWindow; // Declare mainWindow here
let timerWindow;

// Set up Express
const expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true })
  .then(() => console.log('Database is connected'))
  .catch((error) => console.log(error));

// Define the schema for registration data
const Schema = mongoose.Schema;
const dataSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    username: String,
    password: String,
});

const Data = mongoose.model('Data', dataSchema);

// Handle form submission
expressApp.post('/submit', (req, res) => {
    const { name, email, phone, username, password } = req.body;
    const newData = new Data({
        name: name,
        email: email,
        phone: phone,
        username: username,
        password: password,
    });
    newData.save()
        .then(() => {
            console.log('New data has been saved');
            res.send('Data saved successfully');
        })
        .catch((error) => {
            console.log('Error occurred while inserting the data');
            res.status(500).send('Error occurred while saving data');
        });
});

// Start the Express server
const server = expressApp.listen(3000, () => {
    console.log('Express server running on port 3000');
}); 

function createWindow() {
    mainWindow = new BrowserWindow({ // Change const to let to make mainWindow accessible outside this function
      width: 800,
      height: 600,
      webPreferences: {
        devTools: true,
        nodeIntegration: true
      }
    });
    //CREATING SHORTCUT FOR DEVELOPERS TOOL
    mainWindow.webContents.openDevTools({ accelerator: 'Ctrl+Shift+I' });
    // Load the main HTML file
    mainWindow.loadFile(path.join(__dirname,'public/index.html'));
    const menuTemplate = [
        {
          label: 'Home', 
          submenu: [
            {
              role: 'undo'
            },
            {
              role: 'cut'
            },
            {
              role: 'close'
            }
          ]
        },
        {
          label: 'Task', 
          click() { // Remove mainWindow parameter since it's not needed
            mainWindow.loadFile('./public/task.html'); // Now it should work fine
          }
        },
        {
            label: 'Registration',
            click(){
                mainWindow.loadFile('./public/index.html');
            }
        }
      ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    
};

//Timer window in order to show my timer if there is an error just remove it
function createTimerWindow(timerData){
  timerWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  },
});
timerWindow.loadFile(path.join(__dirname, 'public/timer.html'));


timerWindow.webContents.on('did-finish-load', () => {
  timerWindow.webContents.send('start-timer', timerData);
});

timerWindow.on('closed', () => {
  timerWindow = null;
});
}
//itna tak first part kiya tha problem aaye to delete kar dena
// Event listener for when the app is ready
app.whenReady().then(createWindow);

//idhar se timerwindow ke liye second part shuru

ipcMain.on('open-timer-window', (event, timerData) => {
  console.log(timerData);
  if (!timerWindow) {
      createTimerWindow(timerData);
  } else {
      timerWindow.webContents.send('start-timer', timerData);
  }
});
//2nd part idhar samapt hua 
// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Activate when the app is launched, except on macOS
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
