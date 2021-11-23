import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/categories.service';
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

  constructor(private _categoriesSrv: CategoriesService) {}

  ngOnInit() {
    this._categoriesSrv.list(this.category.id).subscribe((categories) => {
      this.category.children = categories.results.map((category) => {
        return { id: category.id, name: category.name, children: [] };
      });
    });
  }

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

  populateTree(parent: CategoryNode) {
    // while (this.categoriesList.length > 0) {
    let children = this.categoriesList.filter(
      (category) => category.parent === null
    );
    console.log(children);
    // }
  }

  _populateTree(
    parent: CategoryNode,
    child: CategoryNode = { id: 0, name: 'All Icons', children: [] }
  ) {
    let branches = this.categoriesList.filter((category) => {
      // debugger;
      return category.parent === parent.id;
    });
    // this.categoriesList = this.categoriesList.filter(
    let children: CategoryNode[] = branches.map((x) => {
      return { id: x.id, name: x.name, children: [] };
    });

    console.log(branches);
    console.log(this.categoriesList);
    console.log(children);

    // activeNode.children = children;
    console.log(parent);
    debugger;

    for (let node of children) {
      console.log('got here');
      parent.children.push(node);
      this.populateTree(node);
    }
  }
}
