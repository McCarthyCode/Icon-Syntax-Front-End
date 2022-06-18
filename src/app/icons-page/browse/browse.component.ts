import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/categories.service';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  categoriesTree: Category.ITreeNode;
  categoriesList: Category.IModel[];

  constructor(private _categoriesSrv: CategoriesService) {}

  ngOnInit(): void {
    this.initializeTree();
  }

  initializeTree(): void {
    this.categoriesTree = { id: 0, name: 'All Icons', children: [] };
    this._categoriesSrv.list().subscribe((categories) => {
      this.categoriesList = categories.data;

      let children = this.categoriesList.filter(
        (category) => category.parent === null
      );

      for (let child of children) {
        this.categoriesTree.children.push(child as Category.ITreeNode);
      }
    });
  }
}
