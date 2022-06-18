import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { FindService } from '../find.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-node',
  templateUrl: './category-node.component.html',
  styleUrls: ['./category-node.component.scss']
})
export class CategoryNodeComponent implements OnInit {
  @Input() category: Category.ITreeNode;
  @Input() expand = false;

  get allIcons(): boolean {
    return this._findSrv.allIcons;
  }
  set allIcons(checked: boolean) {
    this._findSrv.allIcons = checked;
  }

  get active(): boolean {
    return this.category.id === this._findSrv.categoryId
      ? !this.allIcons
      : false;
  }

  constructor(
    private _categoriesSrv: CategoriesService,
    private _findSrv: FindService
  ) {}

  ngOnInit(): void {
    this._categoriesSrv.list(this.category.id).subscribe((categories) => {
      this.category.children = categories.data.map((category) => {
        return { id: category.id, name: category.name, children: [] };
      });
    });

    this._findSrv.reset$.subscribe(() => (this.expand = false));
  }

  onClick($event: Event): void {
    $event.stopPropagation();

    if (this.active) {
      this.expand = false;
      this._findSrv.categoryId = undefined;

      this._findSrv.onClickCategory(true);
    } else if (this.expand) {
      this._findSrv.categoryId = this.category.id;

      this._findSrv.onClickCategory();
    } else if (this.category.children.length > 0) {
      this.expand = true;
    } else {
      this.allIcons = false;
      this._findSrv.categoryId = this.category.id;

      this._findSrv.onClickCategory();
    }
  }
}
