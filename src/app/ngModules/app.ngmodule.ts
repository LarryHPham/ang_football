import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { routing } from '../router/app.routing';
import { RouterModule } from '@angular/router';
//Root Component
import { AppDomain }  from '../app-domain/app.domain';

//NgModules
import { GlobalModule } from "./global.ngmodule";
import { DeepDiveNgModule } from "./deep-dive.ngmodule";
import { ProfileNgModule } from "./profile.ngmodule";
// import { SyndicatedArticleNgModule } from "./syndicated-article.ngmodule";
import {HttpModule} from "@angular/http";
// import {SearchPageNgModule} from "./search-page.ngmodule";
// import {SearchService} from "../services/search.service";

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    routing,
    GlobalModule,
    // DeepDiveNgModule,
    ProfileNgModule
  ],
  declarations: [
    AppDomain
  ],
  providers: [HttpModule],
  // bootstrap: [ AppDomain ]
})
export class AppModule { }

export { AppDomain }  from '../app-domain/app.domain';
