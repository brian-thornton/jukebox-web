#!/bin/bash/

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
brew install git
brew install nvm
brew install vlc

. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc

nvm install 14
nvm ls

mkdir flow_state
cd flow_state
git clone https://github.com/brian-thornton/jukebox-service.git
git clone https://github.com/brian-thornton/jukebox-utils.git
git clone https://github.com/brian-thornton/jukebox-web.git

cd jukebox-utils
npm install
cd ..
cd jukebox-service
npm install
cd ..
cd jukebox-web
nvm use 14
npm install
npm start

