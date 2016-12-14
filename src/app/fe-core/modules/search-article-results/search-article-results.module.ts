import {Component, Input, ElementRef, Renderer, Output, EventEmitter} from "@angular/core";

@Component({
    selector:'search-results',
    templateUrl:'./app/fe-core/modules/search-article-results/search-article-results.module.html'
})
export class SearchArticleResults{
    @Input() searchArticlesData:Array<any>;
    @Input() userInput:string;
    @Input() totalPages:any;
    @Input() articleTotalCount:number;
    @Output() emitPageNum: EventEmitter<any>=new EventEmitter();
    startCount:number=1;
    EndCount:number=this.startCount*10;
    pageNum:number =1;
    constructor(private elementRef:ElementRef, private render:Renderer){
    }
    previousPage(e){
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'opacity','1');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'backgroundColor','#00b9e3');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'border','none');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild.firstElementChild,'color','#fff');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'opacity','1');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'backgroundColor','#00b9e3');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'border','none');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild.firstElementChild,'color','#fff');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'cursor','pointer');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'cursor','pointer');

        if(this.pageNum>1){
            this.pageNum--;
            this.render.setElementStyle(e.target.parentElement,'cursor','pointer');
        }
        if(this.pageNum==1){
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.firstElementChild,'cursor','default');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.firstElementChild,'cursor','default');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.firstElementChild,'opacity','0.2');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.firstElementChild,'opacity','0.2');
        }
        this.emitPageNum.emit(this.pageNum);
        this.startCount=(this.pageNum-1)*10+1;
        this.EndCount=this.startCount+9;

    }
    nextPage(e){
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.firstElementChild,'cursor','pointer');
        this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.firstElementChild,'cursor','pointer');
        if(this.pageNum<this.totalPages){
            this.pageNum++;
        }
        if(this.pageNum>1){
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.firstElementChild,'opacity','1');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.firstElementChild,'opacity','1');
        }
        if(this.pageNum==this.totalPages){
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'opacity','0.2');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'backgroundColor','#fff');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'border','1px solid #444');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild.firstElementChild,'color','#444');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[0].lastElementChild.lastElementChild,'cursor','default');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'opacity','0.2');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'backgroundColor','#fff');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'border','1px solid #444');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild.firstElementChild,'color','#444');
            this.render.setElementStyle(e.target.offsetParent.lastElementChild.children[0].children[2].lastElementChild.lastElementChild,'cursor','default');

        }
        this.emitPageNum.emit(this.pageNum);
        this.startCount=(this.pageNum-1)*10+1;
        this.EndCount=this.startCount+9;
    }
}
