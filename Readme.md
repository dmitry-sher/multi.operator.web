## 7. Front-end build

### 7.1. Dependencies
First make sure node/npm is installed on your computer.<br/>
Then install modules in `source`:
```
npm install
```

Ensure you have gulp in global path:

```
npm install -g gulp
```

### 7.2. How to Use
In the `source` of the project, just simply run the gulp script in your terminal:
```
gulp
```
The watcher should start right away and you can get started on editing your stylesheets and stuff. Watched dirs are: `pages`, `scss`, `scripts`, `img`, `fav`, `fonts`.


### 7.3. How to build
In the `source` of the project, just simply run the gulp script in your terminal:
```
gulp build
```
You will find results in `source/dist` folder.

### 7.4. How to Deploy
In the base of the project, find a `source/dist` folder. Serve the contents somewhere.

### 7.5. Send The Form And Files
Connection settings are saved in `sourece/scripts/settings.js`. Rebuild the project after you change settings.
