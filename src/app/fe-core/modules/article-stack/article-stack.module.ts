import { Component, OnInit, Input } from '@angular/core';
import { RectangleImageData } from '../../components/images/image-data';
import { StackRowsComponent } from '../../components/stack-rows/stack-rows.component';
// import { StackRowsInput } from '../../components/stack-rows/stack-rows.component';
// import { StackTopInput } from '../../components/article-stacktop/article-stacktop.component';

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/fe-core/modules/article-stack/article-stack.module.html'
})

export class ArticleStackModule implements OnInit {
  @Input() stackTop: any;
  @Input() stackRow: Array<any>;

  ngOnInit() {}
}
