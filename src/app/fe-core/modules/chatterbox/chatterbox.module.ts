import {Component, Input, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'chatterbox-module',
    templateUrl: './app/fe-core/modules/chatterbox/chatterbox.module.html',
})

export class ChatterboxModule implements OnInit {
    ngOnInit() {
        window.addEventListener("message", this.receiveSize, false);
    }

    receiveSize(e) {
        document.getElementById("chatterbox-section").style.height = e.data;
    }
}