# Jukebox

Jukebox is a server / browser based music player that is intended for use in home touch screen jukeboxes. 

## Overview

The motivation for this project is to create a fast, intuitive, visually appealing touch screen jukebox frontend for home use. 

The Jukebox project is composed of the following three components:
- [Jukebox Service](https://github.com/brian-thornton/jukebox-service): This service is responsible for playing music on a machine that is hooked up to speakers.
- [Jukebox Web](https://github.com/brian-thornton/jukebox-web): This is the web frontend for the Jukebox.  This can run on the same machine that runs the jukebox service.
- [Jukebox Utils](https://github.com/brian-thornton/jukebox-utils): A utility library which does the work of playing music, storing playlists, managing the queue etc.

## Getting Started

Follow these steps to run Jukebox.  At this time, the jukebox service and music player will run only on MacOS.
- Install [NodeJS](https://nodejs.org/en/) version 12.13.1 or higher.
- Open a terminal window.
- Install git.  ```brew install git```.
- Create a new directory for the jukebox.  ```mkdir jukebox```.
- Change into the new directory.  ```cd jukebox```.
- Clone the jukebox utils. ```git clone https://github.com/brian-thornton/jukebox-utils```.
- Clone the jukebox service. ```git clone https://github.com/brian-thornton/jukebox-service```.
- Clone the jukebox frontend. ```git clone https://github.com/brian-thornton/jukebox-web```.
- Change into jukebox service. ```cd jukebox-service```.
- Run ```npm install```.
- Run ```node index.js``` to start the jukebox-service.
- Open a new terminal window. Leave the existing window open.
- If you are in the jukebox-service directory run ```cd ..`` to go back to the jukebox directory.
- From the jukebox directory run ```cd jukebox-web```.
- Run ```npm install```.
- Run ```npm start`` to start the jukebox.  A browser should open to http://localhost:3000.

## Configuration

Once jukebox is running, navigate to Settings to configure your library of music. Jukebox expects your music to exist in one or more parent folders called libraries. These folders might categorize your collection in some way such as 'holiday music', 'oldies' etc. Parent folders are expected to contain subdirectories which represent albums.  For example:

/oldies (library 1)\
&nbsp;&nbsp;&nbsp;&nbsp;oldies/artist - album\
&nbsp;&nbsp;&nbsp;&nbsp;/oldies/artist - album\
/holiday (library 2)\
&nbsp;&nbsp;&nbsp;&nbsp;/holiday/artist - album\
&nbsp;&nbsp;&nbsp;&nbsp;/holiday/artist - album

Once your libraries have been entered press the scan button next to each. The jukebox will scan the albums and tracks and store the information in a JSON file for fast retrieval. If you add or remove content from your library you will need to scan again. Once scanning is complete click 'Albums' to view your music.
