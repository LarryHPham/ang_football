import { Component, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";
import { GlobalSettings } from "../../../global/global-settings";

@Component({
  selector: 'deep-dive-block-3',
  templateUrl: './deep-dive-block-3.module.html',
})

export class DeepDiveBlock3{
  @Input() scope: string;
  @Input() geoLocation: string;
  @Input() maxHeight: any;
  @Input() profileName: any;
  articleData: Array<ArticleStackData>;
  articleCallLimit:number = 31;
  batchNum: number = 3;
  routeSubscription: any;
  isLoading: boolean = true;
  stackTop1:any;
  stackRow1:any;
  recData1:any;
  stackTop2:any;
  stackRow2:any;
  articleStack2DataTop:any;
  articleStack2DataBatch:any;
  recData2:any;

  constructor(private _deepDiveData: DeepDiveService){
  }

  ngOnChanges(){
    this.isLoading = true;
    this.callArticle();
  }

  callArticle(){
    if(this.isLoading){
      this.isLoading = false;
      this.routeSubscription = this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum)
      .subscribe(data => {
        if(data != null || data.length != 0){
          this.articleData = this._deepDiveData.transformToArticleStack(data, GlobalSettings._deepDiveLg);
          this.stackTop1 = this.articleData.splice(0, 1);
          this.stackTop1 = this.stackTop1.length > 0 ? this.stackTop1 : null;
          this.stackRow1 = this.articleData.splice(0, 6);
          this.stackRow1 = this.stackRow1.length > 0 ? this.stackRow1 : null;
          if (this.stackRow1 != null) {
            this.stackRow1.forEach(function (val) {
              val['imageConfig'].imageUrl = val['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveSm);
            });
          }
          this.recData1 = this.articleData.splice(0, 6);
          this.recData1 = this.recData1.length > 0 ? this.recData1 : null;
          if (this.recData1 != null) {
            this.recData1.forEach(function (val) {
              val['imageConfig'].imageUrl = val['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveRec);
            });
          }
          this.stackTop2 = this.articleData.splice(0, 1);
          this.stackTop2 = this.stackTop2.length > 0 ? this.stackTop2 : null;
          this.stackRow2 = this.articleData.splice(0, 6);
          this.stackRow2 = this.stackRow2.length > 0 ? this.stackRow2 : null;
          if (this.stackRow2 != null) {
            this.stackRow2.forEach(function (val) {
              val['imageConfig'].imageUrl = val['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveSm);
            });
          }
          this.articleStack2DataTop = this.articleData.splice(0, 1);
          this.articleStack2DataTop = this.articleStack2DataTop.length > 0 ? this.articleStack2DataTop : null;
          if (this.articleStack2DataTop != null) {
            this.articleStack2DataTop[0]['imageConfig'].imageUrl = this.articleStack2DataTop[0]['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveMd);
          }
          this.articleStack2DataBatch = this.articleData.splice(0, 4);
          this.articleStack2DataBatch = this.articleStack2DataBatch.length > 0 ? this.articleStack2DataBatch : null;
          if (this.articleStack2DataBatch != null) {
            this.articleStack2DataBatch.forEach(function (val) {
              val['imageConfig'].imageUrl = val['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveMd);
            });
          }
          this.recData2 = this.articleData.splice(0, 6);
          this.recData2 = this.recData2.length > 0 ? this.recData2 : null;
          if (this.recData2 != null) {
            this.recData2.forEach(function (val) {
              val['imageConfig'].imageUrl = val['imageConfig'].imageUrl.replace('width=935', 'width=' + GlobalSettings._deepDiveRec);
            });
          }
        }
      },
      err => {
        console.log("Error getting article data");
      });
    }
  }

  ngOnDestroy(){
    this.routeSubscription.unsubscribe();
  }
}
