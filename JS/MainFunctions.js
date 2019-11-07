const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require("fs");
const electron = require("electron");
const path = require('path');
const remote = electron.remote;
const { BrowserWindow } = require('electron').remote;
var dir = require("../JS/CacheManager.json");

const CopyBTN = document.getElementById("CopyBTN");
const ClearBTN = document.getElementById("ClearBTN");
const QuitBTN = document.getElementById("QuitBTN");
const ChangeDirBTN = document.getElementById("ChangeDirBTN");
const mainWin = remote.getCurrentWindow();

function newWindow(w,h,dir,hideWin){

  if (hideWin){mainWin.hide()}

  let mainWinPos = mainWin.getPosition()

  let child = new BrowserWindow({x : mainWinPos[0],y : mainWinPos[1],width : w,height : h ,frame : false,show: false  })


  child.loadFile(dir)
  child.show();

  if (hideWin){
    child.on("close",function(){
      mainWin.loadFile(".\\HTML\\Main.html")
      mainWin.show()
    });
  }
}

CopyBTN.addEventListener("click",function(){
  var cacheFolder = dir["CacheFolder"]
  var dumpFolder = dir["DumpCacheDir"]

  // Validation
  if (cacheFolder === null) {
    newWindow(420,160,'.\\HTML\\ErrorBox.html',false)
  }

  if (dumpFolder === null){
    newWindow(420,160,'.\\HTML\\ErrorBox.html',false)
  }
  if (cacheFolder != null && dumpFolder != null){
    // This part of the program checks file type and then changes filename with filename + the extention added
    fs.readdir(cacheFolder, function(err, file) {
      for (var i = 0;i < file.length;i++){
        let buffer = readChunk.sync (cacheFolder+file[i], 0, fileType.minimumBytes); // Checks file extenstion

        if (fileType(buffer) != null){
          extention = "." + fileType(buffer)['ext'] // sets file extenstion to . (extensiton)

          fs.copyFile(cacheFolder+file[i],dumpFolder+file[i]+extention, function(err) {
              if ( err ) console.log('ERROR: ' + err);
            });
        }
      }
    });
  }
});

ClearBTN.addEventListener("click",function(){
  let cacheFolder = dir["CacheFolder"]

  if (cacheFolder === null){newWindow(420,160,'.\\HTML\\ErrorBox.html',false);return;}

  fs.readdir(cacheFolder, function(err, file) {
    for (var i = 0;i < file.length;i++){
      fs.unlink(cacheFolder+file[i], (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log(file[i])
        }
      })}
    });
});

QuitBTN.addEventListener("click",function(){
  console.log("ive been clicked")
  var window = remote.getCurrentWindow();
  window.close();
  });

ChangeDirBTN.addEventListener("click",function(){
    newWindow(740,340,'.\\HTML\\ChangeDir.html',true)
    // mainWin.hide();
    //
    // let mainWinPos = mainWin.getPosition()
    //
    // let child = new BrowserWindow({x : mainWinPos[0],y : mainWinPos[1],width : 740,height : 340 ,frame : false,show: false  })
    //
    //
    // child.loadFile('.\\HTML\\ChangeDir.html')
    // child.show();
    //
    // child.on("close",function(){
    //   mainWin.loadFile(".\\HTML\\Main.html")
    //   mainWin.show()
    // });
});
