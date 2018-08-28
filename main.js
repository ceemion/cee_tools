const {app, Menu, Tray, shell, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const iconPath = path.join(__dirname, '/assets/images/IconTemplate.png')

if (process.env.NODE_ENV === 'development') {
  const electronReload = require('electron-reload')
  electronReload(__dirname)
}

let tray = null
let win = null

const configs = {
  entryPath: function (file) {
    return `${__dirname}/app/${file}`
  },
  frame: function (title, opts={}) {
    return {
      title: title,
      height: opts.height || 620,
      width: opts.width || 344,
      x: opts.x || 0,
      y: opts.y || 0,
      resizable: false,
      backgroundColor: opts.bgColor || '#fff'
    }
  }
}

app.on('ready', () => {
  console.log('CeeTools is ready.')

  tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'TimeTravel',
      click() {
        win = new BrowserWindow(configs.frame('TimeTravel'))
        win.loadFile(configs.entryPath('/time_travel/home/home.html'))
        win.webContents.openDevTools()
        win.on('closed', () => win = null)
      }
    },
    {
      label: 'CeeCrypto',
      click() {
        win = new BrowserWindow(configs.frame('CeeCrypto', {x: 400}))
        win.loadFile(configs.entryPath('/cee_crypto/home/home.html'))
        // win.webContents.openDevTools()
        win.on('closed', () => win = null)
      }
    },
    {type: 'separator'},
    {
      label: 'cryptocompare.com',
      click() { shell.openExternal('https://www.cryptocompare.com/') }
    },
    {type: 'separator'},
    {
      label: 'Quit CeeTools',
      click() { app.quit() }
    }
  ])

  tray.setToolTip('CeeTools')
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
