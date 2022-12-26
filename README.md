# espOTAUpdater

A simple cross platform app to load firmware wirelessly to ESP32's, specifically for the wordclock:  

Used this library for the esp-ota functionality: https://github.com/bitfocus/esp-ota

Was able to use p5.js within the Electron app thanks to this template: https://github.com/garciadelcastillo/p5js-electron-templates

To use with the wordclock: 

- From google chrome, launch configurator and connect to board: 
  //add configurator website
- Fill in WiFi settings and Connect - be sure to see the connection was successful and **write down the IP address**
- Click the Init OTA button

The wordclock is now ready for an OTA update, so launch the espOTAUpdater app
- First select the new BIN file.  Latest release can be found here: 
    //add bin file link
- Type in the IP address for the board as noted above
- Click Start and wait for a Done message! 


