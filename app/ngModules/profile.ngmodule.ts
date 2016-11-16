import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../router/app.routing';
import { FormsModule } from '@angular/forms';

import { GlobalModule } from './global.ngmodule';

//services
import {ProfileHeaderService} from '../services/profile-header.service';

//pages
import { LeaguePage } from "../webpages/league-page/league.page";

//modules
import { ProfileHeaderModule } from "../fe-core/modules/profile-header/profile-header.module";

//components


@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    GlobalModule
  ],

  declarations: [
    //pages
    LeaguePage,

    //modules
    ProfileHeaderModule
  ],

  exports: [
    //pages
    LeaguePage,

    //modules
    ProfileHeaderModule,
  ],

  providers: [
    ProfileHeaderService
  ]
})

export class ProfileNgModule {}
