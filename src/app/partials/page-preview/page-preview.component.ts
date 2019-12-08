import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.css'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({opacity: 0.5, width: '30vw'}),
        animate(250, style({opacity: 1, width: '90vw'}))
      ]),
      transition(':leave', [
        style({width: '90vw'}),
        animate(250, style({width: '30vw'}))
      ]),
    ]),
    trigger('open', [
      transition(':enter', [
        style({opacity: 0}),
        animate(250, style({opacity: 1}))
      ]),
    ])
  ]
})

export class PagePreviewComponent implements OnInit, OnChanges {
  @Input() public title: string;
  @Input() public imgUrl: string;
  @Input() public gifUrl: string;
  @Input() public ref: string;
  @Input() public content: string;
  @Input() public state: 'opened' | 'closed' | 'hidden';
  public animationFinished: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state.previousValue === 'opened' && changes.state.currentValue === 'closed') {
      this.animationFinished = false;
      setTimeout(() => this.animationFinished = true, 250);
    }
  }
}
