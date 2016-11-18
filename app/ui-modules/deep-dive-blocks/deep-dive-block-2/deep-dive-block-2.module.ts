import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData } from "../../../fe-core/interfaces/deep-dive.data";

declare var moment;

@Component({
  selector: 'deep-dive-block-2',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module.html',
})

export class DeepDiveBlock2 implements OnInit {
  @Input() scope: string;
  @Input() geoLocation: string;
  @Input() maxHeight: any;
  @Input() profileName: any;
  firstStackTop: Array<ArticleStackData>;
  firstStackRow: Array<ArticleStackData>;
  recData: Array<ArticleStackData>;
  articleStack2DataTop: Array<ArticleStackData>;
  articleStack2DataBatch: Array<ArticleStackData>;
  articleCallLimit:number = 23;
  batchNum: number = 1;

  constructor(private _deepDiveData: DeepDiveService){}
  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.articleCallLimit, this.batchNum, this.geoLocation)
        .subscribe(data => {
          if(data != null || data.length != 0){
            let stackTop = [data[0]];
            this.firstStackTop = this._deepDiveData.transformToArticleStack(stackTop);

            if(data.length > 0){
              let stackRow = data.splice(1,8);
              this.firstStackRow  = this._deepDiveData.transformToArticleStack(stackRow);

              let recInfo = data.splice(1, 6);//TODO
              this.recData = this._deepDiveData.transformToArticleStack(recInfo);//TODO

              let articleStack2Top = [data[0]];//TODO
              this.articleStack2DataTop = this._deepDiveData.transformToArticleStack(articleStack2Top);//TODO
              let articleStack2 = data.splice(1,4);//TODO
              this.articleStack2DataBatch = this._deepDiveData.transformToArticleStack(articleStack2);//TODO

            }
          }
        },
        err => {
            console.log("Error getting first article stack data");
        });
  }

  callModules(){
    this.getFirstArticleStackData();
  }
  ngOnChanges() {
    this.callModules();
  }
  ngOnInit() {
    this.callModules();
  }
}
