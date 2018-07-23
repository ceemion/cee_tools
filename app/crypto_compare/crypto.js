const electron = require('electron')
const remote = electron.remote
const BrowserWindow = remote.BrowserWindow

const notifyBtn = document.getElementById('notify-btn')
const closeBtn = document.getElementById('close-btn')

if (notifyBtn) {
  notifyBtn.addEventListener('click', function (event) {
    let win = new BrowserWindow({
      width: 400,
      height: 200,
      frame: false,
      resizable: false,
      transparent: true,
      alwaysOnTop: true
    })

    win.on('close', function () { win = null })
    win.loadURL(`file://${__dirname}/add.html`)
    win.show()
  })
}

if (closeBtn) {
  closeBtn.addEventListener('click', function (event) {
    var win = remote.getCurrentWindow()
    console.log(win)
    win.close()
  })
}
