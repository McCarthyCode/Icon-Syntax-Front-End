import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  text = '';

  ngOnInit(): void {
    this.cycleBrand();
  }

  cycleBrand(): void {
    const brand = 'iconSyntax';

    setTimeout(() => {
      this.text =
        this.text === brand ? '' : brand.slice(0, this.text.length + 1);
      this.cycleBrand();
    }, this.text === brand ? 2000 : 200);
  }
}
