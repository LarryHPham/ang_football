## Installation
* `clone the angular2_universal branch as a completely seperate project from the non SSR version of TDL.`
* `npm install`

## Serve

* `npm start` to build your client app and start a web server
* `npm run build` to prepare a distributable bundle

## Development
* Before building project make sure you have the appropriate SSR core checked out (or a branch of SSR core)
* run `npm start` and `npm run watch` in two separate terminals to build your client app, start a web server, and allow file changes to update in realtime
* if you have issues with PM2, try running PM2 update

## Watch files
* `npm run watch` to build your client app and start a web server

## AoT and Prod
* `npm run build:prod:ngc` to compile the ngfactory files and build prod

## When closing project
* run `pm2 list` to find the pm2 id that your current app is running on
* run `pm2 delete 0` (or whatever your current pm2 id is) to stop pm2 from occupying the local host port

## When committing changes
* Stop `npm start` and `npm run watch`
* Merge with develop branch
* Discard merge conflicts that are in compiled files (files inside the `/dist` folder)
* Merge all other changes
* Rebuild project with npm start or npm run build
* Push with updated `/dist` files
