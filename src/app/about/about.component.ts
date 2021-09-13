import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

interface IContent {
  header: string;
  index: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  index = 0;
  titles: string[] = [
    'Title',
    'Our Vision',
    'Executive Summary',
    'Executive Summary (cont.)',
    'Syntax',
    'Icons',
    'Parts of Speech',
    'Parts of Speech (cont.)',
    'Words by Language',
    'Meet Mary Beth',
    'Meet Mary Beth (cont.)',
    'Meet Matt',
    'Meet Robert',
    'History of ILS',
    'Demand',
    'Our Goals',
  ];
  contents: IContent[];

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor() {}

  ngOnInit() {
    this.contents = this.titles.map((value, index) => {
      return { header: value, index: index };
    });
  }

  ionViewWillEnter() {
    // window.addEventListener('keyup', () => console.log(this.slides));
    window.addEventListener('keyup', this.keyListener);
  }

  ionViewDidLeave() {
    // window.removeEventListener('keyup', () => console.log(this.slides));
    window.removeEventListener('keyup', this.keyListener);
  }

  keyListener = ($event) => {
    switch ($event.key) {
      case 'ArrowRight':
        this.slides.slideNext();
        break;
      case 'ArrowLeft':
        this.slides.slidePrev();
        break;
    }
  };

  updatePage() {
    this.slides.getActiveIndex().then((index) => {
      this.index = index;
    });
  }

  onNavigate(index: number) {
    this.slides.slideTo(index);
  }

  onMouseEnter($event: Event) {
    ($event.target as HTMLIonTextElement).color = 'warning';
  }

  onMouseLeave($event: Event, index: number) {
    this.slides.getActiveIndex().then((activeIndex) => {
      ($event.target as HTMLIonTextElement).color =
        index === activeIndex ? 'warning' : 'medium';
    });
  }
}
