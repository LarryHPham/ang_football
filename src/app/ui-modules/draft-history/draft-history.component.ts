import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

//interfaces
import { IProfileData} from '../../fe-core/modules/profile-header/profile-header.module';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { DraftHistoryTab } from '../../services/draft-history.service';

@Component({
    selector: 'draft-history',
    templateUrl: './draft-history.component.html'
})

export class DraftHistoryComponent {
    @Output() tabSelectedListener = new EventEmitter();
    @Output() dropdownSelectedListener = new EventEmitter();

    @Input() profileData: IProfileData;
    @Input() type: string;
    @Input() data: Array<DraftHistoryTab>;
    @Input() carouselDataArray: Array<Array<SliderCarouselInput>>;
    @Input() sortOptions: Array<any>;
    @Input() dropdownKey1: string;
    @Input() selectedTabName: string;
    @Input() isError: boolean;

    constructor() {} //constructor



    selectedTab(tabTitle) {
        this.tabSelectedListener.emit(tabTitle);
    } //selectedTab



    dropdownChanged(event) {
        this.dropdownSelectedListener.emit(event);
    } //dropdownChanged
}
