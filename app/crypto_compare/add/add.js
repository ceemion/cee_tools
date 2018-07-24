const { ipcRenderer, remote } = require('electron')

const updateBtn = document.getElementById('update-btn')
const closeBtn = document.getElementById('close-btn')

updateBtn.addEventListener('click', function () {
  ipcRenderer.send('update-crypto-notify-value', document.getElementById('notify-val').value)
  remote.getCurrentWindow().close()
})

closeBtn.addEventListener('click', function (event) {
  remote.getCurrentWindow().close()
})
