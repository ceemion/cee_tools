const electron = require('electron')
const Menubar = require('menubar')
const menubar = Menubar({
  width: 300,
  height: 400,
  showDockIcon: true,
  tooltip: "Cee Tools"
})

menubar.on('ready', function () {
  console.log('Cee Tools is ready.');
})

menubar.on('after-create-window', function () {
  // menubar.window.loadURL(`file://${__dirname}/index.html`);
  // menubar.window.openDevTools()
});
