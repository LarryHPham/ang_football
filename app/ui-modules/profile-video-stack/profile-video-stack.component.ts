import { Component,OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SanitizeHtml } from "../../fe-core/pipes/safe.pipe";



@Component({
  selector: 'profile-video-stack-component',
  templateUrl: './app/ui-modules/profile-video-stack/profile-video-stack.component.html'
})

export class ProfileVideoStackComponent implements OnInit{
  public articleData: any;
  @Input() state: any;
  @Input() page: number;
  @Input() videoData: any;
  @Input() isProfilePage:boolean;

  ngOnInit() {}
}
