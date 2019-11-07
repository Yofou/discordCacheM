const electron = require('electron');
const remote = electron.remote;

CloseBtn = document.getElementById("CloseBtn");

CloseBtn.addEventListener("click",function(){let currentWindow = remote.getCurrentWindow();currentWindow.close();})
