// polyfills have to be first
import 'angular2-universal-polyfills';
import { createEngine, ExpressEngineConfig } from 'angular2-express-engine';
// import { MainModule } from './app.node.module';  // will change depending on your app
import { AppModule } from './ngModules/app.ngmodule';

// 1. set up Angular Universal to be the rendering engine for Express
app.engine('.html', createEngine({}));

// 2. get the top level NgModule for the app and pass in important values to Angular Universal
app.get('/*', (req, res) => {

  // Our Universal - express configuration object
  const expressConfig : ExpressEngineConfig = {
    req,
    res,
    ngModule: AppModule,
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: 'http://localhost:3000'
  };

  // NOTE: everything passed in here will be set as properties to the top level Zone
  // access these values in your code like this: Zone.current.get('req');
  // this is temporary; we will have a non-Zone way of getting these soon
  res.render('index', expressConfig);
});
