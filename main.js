const electron = require('electron')
const electronReload = require('electron-reload')

electronReload(__dirname)

const Menubar = require('menubar')
const menubar = Menubar({
  width: 300,
  height: 400,
  showDockIcon: true,
  tooltip: "Cee Tools",
  backgroundColor: '#f7f7f7'
})

menubar.on('ready', function () {
  console.log('Cee Tools is ready.');
})

menubar.on('after-create-window', function () {
  menubar.window.loadURL(`file://${__dirname}/app/index.html`);
  // menubar.window.openDevTools()
});
