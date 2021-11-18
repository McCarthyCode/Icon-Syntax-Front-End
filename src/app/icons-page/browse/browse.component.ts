import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/categories.service';
import { Category } from 'src/app/models/category.model';

type CategoryNode = Category.ITreeNode;

@Component({
  selector: 'app-category-node',
  templateUrl: './category-node.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class CategoryNodeComponent {
  @Input() category: CategoryNode;
  @Input() expand = false;

  constructor() {}

  toggleChildren() {
    this.expand = !this.expand;
  }

  viewResults(id: number) {
    console.log(id);
  }
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  categories: CategoryNode;

  constructor(private _categoriesSrv: CategoriesService) {}

  ngOnInit() {
    this.populateTree();
  }

  populateTree() {
    this.categories = {
      id: 0,
      name: 'Parent',
      children: [
        {
          id: 1,
          name: 'Child',
          children: [
            {
              id: 3,
              name: 'Grandchild',
              children: [],
            },
          ],
        },
        {
          id: 2,
          name: 'Child',
          children: [],
        },
      ],
    };
  }
}
