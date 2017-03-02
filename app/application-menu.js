const { app, BrowserWindow, Menu, shell } = require('electron')

const mainProcess = require('./tri_demo')

const template = [
  // Menu template from the last section.
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Video',
        accelerator: 'CommandOrControl+O',
        click(item, focusedWindow) {
          mainProcess.openVideoFromUser(focusedWindow)
        },
      },
    ],
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CommandOrControl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CommandOrControl+W',
        role: 'close',
      },
    ]
  }
]

if (process.platform === 'darwin') {
  const name = 'TRI demo'
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about',
      },
      { type: 'separator' },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: `Quit ${name}`,
        accelerator: 'Command+Q',
        click() { app.quit() },
      },
    ],
  })

  const windowMenu = template.find(item => item.label === 'Window')
  windowMenu.submenu.push(
    { type: 'separator' },
    {
      label: 'Bring All to Front',
      role: 'front',
    }
  )
}

module.exports = Menu.buildFromTemplate(template)
