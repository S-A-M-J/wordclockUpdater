let binFileInput;
var nodeConsole = require('console');
var EspOTA = require('esp-ota');


var console = new nodeConsole.Console(process.stdout, process.stderr);
var binFileData;
var binPath;

function preload() {
  logoImage = loadImage('data/wordclockUpdaterImage.png');
}

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(500, 350);
  noStroke();
  background(255);
  image(logoImage, 100, 5, 924/3, 290/3);

  //console.log('starting app');

  chooseBinFileText = createElement('h4', 'BIN DATEI AUSWÄHLEN');
  chooseBinFileText.position(15, 290/3+10);
  latestBinFileButton = createButton('NEUESTE BIN DATEI HIER');
  latestBinFileButton.position(chooseBinFileText.x + chooseBinFileText.size().width+5, chooseBinFileText.y+chooseBinFileText.size().height+2);
  latestBinFileButton.mousePressed(latestBinFileButtonFunction);

  binFileInput = createFileInput(handleFile);
  binFileInput.position(50, chooseBinFileText.y+chooseBinFileText.size().height+25);
  binFileInput.id('binFileInputID');
  

  chooseIPText = createElement('h4', 'IP ADRESSE EINGEBEN');
  chooseIPText.position(15, binFileInput.y+binFileInput.size().height);
  ipInput = createInput('192.168.0.133');
  ipInput.position(50, chooseIPText.y+chooseIPText.size().height+25); 
  ipInput.size(100);

  startButton = createButton('STARTE OTA UPDATE');
  startButton.position(50, ipInput.y+ipInput.size().height+25);
  startButton.style('color', color(255));
  startButton.style('background-color', color(61, 127, 78));
  startButton.mousePressed(startOTA);
  startButton.hide();

  statusText = createElement('h5', 'dg');
  statusText.position(15, startButton.y+10);
  statusText.id('statusTextID');

  document.getElementById("statusTextID").innerHTML = "Stellen Sie sicher, dass die Uhr mit dem WLAN verbunden ist und<br> OTA im Chrome Browser Konfigurator initialisiert wurde";

}

function draw() {

}

function handleFile(file) {
  console.log(file.name);
  // if(file.subtype != 'macbinary'){
  //   alert("Wrong File Type!  Must be a .bin file");
  //   return;
  // }

  if (match(file.name, ".bin") == null){
    alert("Falscher dateityp!  Muss eine .bin datei sein");
    return;
  }

  binFileData = file;
  binPath = document.getElementById("binFileInputID").files[0].path;
  //document.getElementById("statusTextID").innerHTML = "Loaded " + binPath;
  startButton.show();
}


function startOTA(){

var esp = new EspOTA(); // Optional arguments in this order: (bindAddress, bindPort, chunkSize, secondsTimeout)


  sanitize = checkUserIPaddress(ipInput.value());
  if (sanitize!=null) {
    ipInput.value(sanitize);
    return;
  }else{
    startButton.show();
  }
  sanitizer = checkUserString(ipInput.value(), 50);
  if (sanitize!=null) {
    ipInput.value(sanitize);
    return;

  }else{
    startButton.show();
  }



startButton.hide();

document.getElementById("statusTextID").innerHTML = "Starte OTA";

esp.on('state', function (state) {
  console.log("Aktueller Übertragungsstatus: ", state);
  document.getElementById("statusTextID").innerHTML = "Aktueller Übertragungsstatus:  " + state;
});

esp.on('progress', function (current, total) {
  console.log("Übertragung läuft: " + Math.round(current / total * 100) + "%");
  document.getElementById("statusTextID").innerHTML = "Fortschritt: " + Math.round(current / total * 100) + "%";
});

// If you need to authenticate, uncomment the following and change the password
// esp.setPassword('admin');

var transfer = esp.uploadFile(binPath, ipInput.value(), 3232, EspOTA.FLASH);

transfer
.then(function () {
  console.log("Abgeschlossen");
  document.getElementById("statusTextID").innerHTML = "Abgeschlossen";
  startButton.show();
})
.catch(function (error) {
  console.error("Übertragungsfehler: ", error);
  document.getElementById("statusTextID").innerHTML = "Übertragungsfehler: " + error;
  startButton.show();
});
}

function latestBinFileButtonFunction(){
  //window.open('https://krdarrah.github.io/trigBoardConfigurator/');
  window.open('https://github.com/krdarrah/trigBoardV8_BaseFirmware/releases');
}

function checkUserIPaddress(userIP) {
  let splitNumbers = split(userIP, '.');
  if (splitNumbers.length>4 || splitNumbers.length<4) {
    return 'error not valid';
  }
  for (let i=0; i<4; i++) {
    if (isNaN(splitNumbers[i])) {
      return 'error not valid';
    }
    if (splitNumbers[i]>255 || splitNumbers[i]<0) {
      return 'error not valid';
    }
  }
  return null;
}
function checkUserString(userString, lengthCheck) {
  if (match(userString, "#") != null || match(userString, ",") != null) {
    return 'error no # or comma';
  }
  if (userString.length >=lengthCheck) {
    return 'error too long';
  }
  return null;
}
