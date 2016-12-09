import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";

declare var moment;

@Component({
    selector: 'deep-dive-block-2',
    templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module.html',
})

export class DeepDiveBlock2 {
    @Input() scope: string;
    @Input() geoLocation: string;
    @Input() maxHeight: any;
    @Input() profileName: any;
    routeSubscription: any;
    articleData: Array<ArticleStackData>;

    firstStackTop: Array<ArticleStackData>;
    firstStackRow: Array<ArticleStackData>;
    recData: Array<ArticleStackData>;
    articleStack2DataTop: Array<ArticleStackData>;
    articleStack2DataBatch: Array<ArticleStackData>;
    recData2: Array<ArticleStackData>;

    articleCallLimit: number = 25;
    batchNum: number = 2;
    isLoading: boolean = true;

    constructor(private _deepDiveData: DeepDiveService) { }

    ngOnChanges() {
        this.isLoading = true;
        this.getFirstArticleStackData();
    }

    getFirstArticleStackData() {
        if (this.isLoading) {
            this.isLoading = false;
            this.routeSubscription = this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum, this.geoLocation)
                .subscribe(data => {
                    if (data != null || data.length != 0) {
                        this.articleData = this._deepDiveData.transformToArticleStack(data);


                        this.firstStackTop = this.articleData.splice(0, 1);
                        this.firstStackTop = this.firstStackTop.length > 0 ? this.firstStackTop : null;

                        this.firstStackRow = this.articleData.splice(0, 7);
                        this.firstStackRow = this.firstStackRow.length > 0 ? this.firstStackRow : null;

                        this.recData = this.articleData.splice(0, 6);
                        this.recData = this.recData.length > 0 ? this.recData : null;

                        this.articleStack2DataTop = this.articleData.splice(0, 1);
                        this.articleStack2DataTop = this.articleStack2DataTop.length > 0 ? this.articleStack2DataTop : null;

                        this.articleStack2DataBatch = this.articleData.splice(0, 4);
                        this.articleStack2DataBatch = this.articleStack2DataBatch.length > 0 ? this.articleStack2DataBatch : null;

                        this.recData2 = this.articleData.splice(0, 6);
                        this.recData2 = this.recData2.length > 0 ? this.recData2 : null;

                        // if(data.length > 0){
                        //   let stackRow = data.splice(1,8);
                        //   this.firstStackRow  = this._deepDiveData.transformToArticleStack(stackRow);
                        //
                        //   let recInfo = data.splice(1, 6);//TODO
                        //   this.recData = this._deepDiveData.transformToArticleStack(recInfo);//TODO
                        //
                        //   let articleStack2Top = [data[0]];//TODO
                        //   this.articleStack2DataTop = this._deepDiveData.transformToArticleStack(articleStack2Top);//TODO
                        //   let articleStack2 = data.splice(1,4);//TODO
                        //   this.articleStack2DataBatch = this._deepDiveData.transformToArticleStack(articleStack2);//TODO
                        //
                        // }
                    }
                },
                err => {
                    console.log("Error getting first article stack data");
                });
        }
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
