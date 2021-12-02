import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/categories.service';
import { FindService } from 'src/app/find.service';
import { IconsService } from 'src/app/icons.service';
import { Category } from 'src/app/models/category.model';

type CategoryNode = Category.ITreeNode;

@Component({
  selector: 'app-category-node',
  templateUrl: './category-node.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class CategoryNodeComponent implements OnInit {
  @Input() category: CategoryNode;
  @Input() expand = false;

  get active(): boolean {
    return this.category.id === this._findSrv.category
      ? !this._findSrv.allIcons
      : false;
  }

  constructor(
    private _categoriesSrv: CategoriesService,
    private _findSrv: FindService,
    private _iconsSrv: IconsService
  ) {}

  ngOnInit(): void {
    this._categoriesSrv.list(this.category.id).subscribe((categories) => {
      this.category.children = categories.results.map((category) => {
        return { id: category.id, name: category.name, children: [] };
      });
    });
  }

  onClick($event: Event): void {
    $event.stopPropagation();

    if (this.active) {
      this.expand = false;
      this._findSrv.category = undefined;

      this._findSrv.onClickCategory();
    } else if (this.expand) {
      this._findSrv.category = this.category.id;

      this._findSrv.onClickCategory();
    } else if (this.category.children.length > 0) {
      this.expand = true;
    } else {
      this._findSrv.allIcons = false;
      this._findSrv.category = this.category.id;

      this._findSrv.onClickCategory();
    }
  }
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  categoriesTree: CategoryNode;
  categoriesList: Category.ICategory[];

  constructor(private _categoriesSrv: CategoriesService) {}

  ngOnInit() {
    this.initializeTree();
  }

  ionViewWillEnter(): void {}

  initializeTree(): void {
    this.categoriesTree = { id: 0, name: 'All Icons', children: [] };
    this._categoriesSrv.list().subscribe((categories) => {
      this.categoriesList = categories.results;

      let children = this.categoriesList.filter(
        (category) => category.parent === null
      );

      for (let child of children) {
        this.categoriesTree.children.push(child as CategoryNode);
      }
    });
  }
}
