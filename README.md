# Jukebox

Jukebox is a server / browser based music player that is intended for use in home touch screen jukeboxes. 

## Overview

The motivation for this project is to create a fast, intuitive, visually appealing touch screen jukebox frontend for home use. This frontend is intended for use in DIY jukebox cabinets.

## Architecture

The Jukebox project is composed of the following three components:
- [Jukebox Web](https://github.com/brian-thornton/jukebox-web): This is the React JS based web frontend for the Jukebox.
- [Jukebox Service](https://github.com/brian-thornton/jukebox-service): This service is responsible for playing music on a machine that is hooked up to speakers.
- [Jukebox Utils](https://github.com/brian-thornton/jukebox-utils): A utility library which does the work of playing music, storing playlists, managing the queue etc.

## Getting Started

Follow these steps to run Jukebox.  At this time, the jukebox service and music player have only been tested on on MacOS. 
- Install [NodeJS](https://nodejs.org/en/) version 14.19.1 or higher.
- Open a terminal window.
- Install git.  ```brew install git```.
- Create a new directory for the jukebox.  ```mkdir jukebox```.
- Change into the new directory.  ```cd jukebox```.
- Clone the jukebox utils. ```git clone https://github.com/brian-thornton/jukebox-utils```.
- Clone the jukebox service. ```git clone https://github.com/brian-thornton/jukebox-service```.
- Clone the jukebox frontend. ```git clone https://github.com/brian-thornton/jukebox-web```.
- From the jukebox directory run ```cd jukebox-web```.
- Run ```npm install```.
- Run ```npm start`` to start the jukebox.  A browser should open to http://localhost:3000.

## Configuration

### Music

Once jukebox is running, navigate to Settings to configure your library of music. Jukebox expects your music to exist in one or more parent folders called libraries. These folders might categorize your collection in some way such as 'holiday music', 'oldies' etc. Parent folders are expected to contain subdirectories which represent albums.  For example:

/oldies (library 1)\
&nbsp;&nbsp;&nbsp;&nbsp;oldies/artist - album\
&nbsp;&nbsp;&nbsp;&nbsp;/oldies/artist - album\
/holiday (library 2)\
&nbsp;&nbsp;&nbsp;&nbsp;/holiday/artist - album\
&nbsp;&nbsp;&nbsp;&nbsp;/holiday/artist - album

Once your libraries have been entered press the scan button next to each. The jukebox will scan the albums and tracks and store the information in a JSON file for fast retrieval. If you add or remove content from your library you will need to scan again. Once scanning is complete click 'Albums' to view your music.

### Skins
Jukebox is fully skinnable. You can control colors and fonts to give your Jukebox a custom look and feel. You can find skins under Settings > Skins. Jukebox ships with a few built in skins 'out of the box'. You can copy these skins as a starting point for your own customizations.

### Lighting
Jukebox supports the control of WS2812B individually addressable LED strips to enhance the look of DIY jukebox cabinets. LED strip control is managed through [WLED](https://kno.wled.ge/). Jukebox can control any WLED controller on the local network meaning that your LED strips can be installed in your jukebox cabinet but also may be remote to the physical cabinet. Jukebox can manage 1..n WLED controllers. 

Jukebox creates lighting effects by assigning effects (e.g. solid colors, chase patterns etc) to segments of lights. A segment is some section of LEDs on the strip. Jukebox is designed to control 1..n segments of lights each having a unique color or effect per navigation event in the Jukebox UI. For example, Jukebox can be configured to turn LEDs green when a user clicks 'Albums', blue when a user clicks 'Tracks' and so on. These lighting configurations are associated to skins so that colors and effects compliment screen colors. In order to configure this behavior follow these steps.

- LED configuration starts with hardware. In order to set up LED management with Jukebox you must have a WLED enabled controller connected to a WS2812B LED strip, plugged in and connected to your local network.
- Once the LED strip is powered on and connected to the network navigate to Jukebox > Settings > Cabinet.
- In the Cabinet menu you will configure segments representing the LEDs on the strip that will be controlled during various navigation events. Use the controls to add as many segments as are needed for your setup. These segments will be available for configuration in skin menus. To begin click 'Discover' to find WLED controllers on your network.
- Click 'Configure' on the WLED controller that is associated to your Jukebox.
- Add segments which represent the positions on the LED strip that you wish to control. Give the segments meaningful names so that you can easily identify them later.
- Once segement definition is complete navigate to Settings > Skins.
- Find the skin for which you want to configure lighting and click 'Edit'.
- Navigate to the 'Skin Lighting' tab.
- Select configure for the controller where you wish to define Jukebox controlled lights.
- Click configure for the Jukebox event for which you wish to define lights.
- Configure each segment to show an effect, solid color or no lights for the event.
- When finished enable the skin and lighting events will fire as users navigate around the Jukebox UI.