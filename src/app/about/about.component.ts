import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

interface IContent {
  header: string;
  page: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  page = 1;
  contents: IContent[] = [
    { header: 'Title', page: 1 },
    { header: 'About Our Vision', page: 2 },
    { header: 'Executive Summary', page: 3 },
    { header: 'About Syntax', page: 4 },
    { header: 'About Icons', page: 5 },
    { header: 'About Parts of Speech', page: 6 },
    { header: 'About Words', page: 7 },
    { header: 'About Mary Beth', page: 8 },
    { header: 'About Matt & Robert', page: 9 },
    { header: 'History of ILS', page: 10 },
    { header: 'About Demand', page: 11 },
    { header: 'About Us', page: 12 },
    { header: 'Contact Us', page: 13 },
    { header: 'Community Notes', page: 14 },
  ];

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor() {}

  ngOnInit() {}

  updatePage() {
    this.slides.getActiveIndex().then((index) => {
      this.page = index + 1;
    });
  }

  onIonSlideNextEnd() {
    this.updatePage();
  }

  onIonSlidePrevEnd() {
    this.updatePage();
  }

  onNavigate(page: number) {
    this.slides.slideTo(page - 1);
  }

  onMouseEnter($event: Event) {
    ($event.target as HTMLIonTextElement).color = 'warning';
  }

  onMouseLeave($event: Event, page: number) {
    this.slides.getActiveIndex().then((index) => {
      ($event.target as HTMLIonTextElement).color =
        page === index + 1 ? 'warning' : 'medium';
    });
  }
}
