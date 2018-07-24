const {app, Menu, Tray, shell, BrowserWindow, ipcMain} = require('electron')
const electronReload = require('electron-reload')
const path = require('path')
const iconPath = path.join(__dirname, '/assets/images/IconTemplate.png')

electronReload(__dirname)

let tray = null
let win = null

const configs = {
  entryPath: function (file) {
    return `${__dirname}/app/${file}`
  },
  frame: function (title, opts={}) {
    return {
      title: title,
      height: opts.height || 513,
      width: opts.width || 300,
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
      label: 'Time Travel',
      click() {
        win = new BrowserWindow(configs.frame('Time Travel'))
        win.loadFile(configs.entryPath('/time_travel/home/home.html'))
        win.on('closed', () => win = null)
      }
    },
    {
      label: 'Crypto Compare',
      click() {
        win = new BrowserWindow(configs.frame('Crypto Compare', {x: 400, width: 800}))
        win.loadFile(configs.entryPath('/crypto_compare/home/home.html'))
        win.webContents.openDevTools()
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

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('update-crypto-notify-value', function (event, arg) {
  win.webContents.send('targetPriceVal', arg)
})
