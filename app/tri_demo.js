const {
  app,
  BrowserWindow
} = require('electron')

let mainWindow = null

const createWindow = () => {
  // Create browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('init')
  })

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('active', () => {
  if (mainWindow == null) {
    createWindow()
  }
})

// mainWindow.webContents.send('update-gps')

// mainWindow.webContents.send('update-link')
