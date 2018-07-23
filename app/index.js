const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow

const configs = {
  entryPath: function (file) {
    return `file://${__dirname}/${file}`
  },
  frame: function (title, opts={}) {
    return {
      title: title,
      height: opts.height || 513,
      width: opts.width || 288,
      x: opts.x || 0,
      y: opts.y || 0,
      resizable: false,
      backgroundColor: opts.bgColor || '#fff'
    }
  },
  closeWindow: function (win) {
    win.on('close', function () { win = null })
  }
}

const timeTravel = document.getElementById('time-travel')
const cryptoCompare = document.getElementById('crypto-compare')

timeTravel.addEventListener('click', function (e) {
  let win = new BrowserWindow(configs.frame('Time Travel'))
  configs.closeWindow(win)
  win.loadURL(configs.entryPath('time_travel/home.html'))
  win.show()
})

cryptoCompare.addEventListener('click', function () {
  let win = new BrowserWindow(configs.frame('Crypto Compare', {x: 388}))
  configs.closeWindow(win)
  win.loadURL(configs.entryPath('crypto_compare/home.html'))
  win.openDevTools()
  win.show()
})
