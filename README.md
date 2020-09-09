# scoreKeeper2

Keep scores from different games easily.  
Made in Typescript with Vue.js  

[Demo](https://oli8.github.io/scoreKeeper2)

## Custom Configuration

You can use a custom configuration (different game settings) by using the config menu or navigate to /${config name}

### Create your own

Add your configuration file in `src/game-configs/custom/`, it will be available at the url: /${config name} (lowercased)  
You can refer to `src/structs/gameConfig.ts` and/or `src/game-configs/default.ts` to get started.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
