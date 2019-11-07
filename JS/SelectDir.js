const fs = require("fs");
const electron = require("electron");
const path = require('path');
const remote = electron.remote;
var fileName = "..\\JS\\CacheManager.json";
var file = require(fileName);

const OpenCacheFile = document.getElementById("OpenCacheFile");
const CacheButton = document.getElementById("CacheButton");
const CacheP = document.getElementById("CacheP");
const OpenDumpFile = document.getElementById("OpenDumpFile");
const DumpButton = document.getElementById("DumpButton");
const DumpP = document.getElementById("DumpP");
const BackBtn = document.getElementById("backBTN");

// Function to make the window size change smoother
function WindowChange(){
  const windowConfig = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds()
  const minWidth = windowConfig["width"]
  const minHeight = windowConfig["height"]
  const maxWidth = 313
  const maxHeight = 285
  let {ipcRenderer} = electron;
  ipcRenderer.send('resize', maxWidth, maxHeight);
}

// Update Json
function loadDirUrl(){
  var cacheFolder = file["CacheFolder"]
  var dumpFolder = file["DumpCacheDir"]

  console.log(cacheFolder,dumpFolder)

  // Validation
  if (cacheFolder === null) {cacheFolder = "None Select.";}
  if (dumpFolder === null) {dumpFolder = "None Select.";}

  // Change Text to Dir
  CacheP.innerHTML = cacheFolder;
  DumpP.innerHTML = dumpFolder;
}

function UpdateJsonValue(key,value){

  // Update Json
  console.log(value);
  //change the value in the in-memory object
  if (key == "CacheFolder") {
    file.CacheFolder = value+"\\";
  } else {
    file.DumpCacheDir = value+"\\";
  }

  //Serialize as JSON and Write it to a file
  fs.writeFile("..\\Cache Manager\\JS\\CacheManager.json", JSON.stringify(file),function(err){
    if (err){console.log(err);}
  });
}


loadDirUrl();


// Select Directory

CacheButton.addEventListener("click",function(){
  OpenCacheFile.click();
});

OpenCacheFile.addEventListener("change",function(){
  if (OpenCacheFile.value) {
    if (OpenDumpFile.value){
      if (OpenCacheFile.value != OpenDumpFile.value){
        UpdateJsonValue("CacheFolder",OpenCacheFile.files[0].path);
        loadDirUrl();
      }
    } else{
      UpdateJsonValue("CacheFolder",OpenCacheFile.files[0].path);
      loadDirUrl();
    }
  }
});

DumpButton.addEventListener("click",function(){
  OpenDumpFile.click();
});

OpenDumpFile.addEventListener("change",function(){
  if (OpenDumpFile.value) {
    if (OpenCacheFile.value){
      if (OpenCacheFile.value != OpenDumpFile.value){
        // Update Json
        UpdateJsonValue("DumpCacheDir",OpenDumpFile.files[0].path);
        loadDirUrl();
      } else {
        // Error Message
      }
    } else{
      // Update Json
      UpdateJsonValue("DumpCacheDir",OpenDumpFile.files[0].path);
      loadDirUrl();
    }
  }
});

BackBtn.addEventListener("click",function(){
  let currentWindow = remote.getCurrentWindow();

  currentWindow.close()
})
