import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoriesService } from '../categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { FindService } from '../find.service';
import { IconModalComponent } from '../icon-modal/icon-modal.component';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-create-icon',
  templateUrl: './create-icon.component.html',
  styleUrls: ['./create-icon.component.scss'],
})
export class CreateIconComponent {
  categoriesTree: Category.ITreeNode;
  categoriesList: Category.IModel[];

  activeCategoryId: number = null;

  constructor(
    private _findSrv: FindService,
    private _categoriesSrv: CategoriesService,
    private _modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initializeTree();
    this._findSrv.category$.subscribe((clientData) => {
      if (clientData) this.activeCategoryId = clientData.data.id;
    });
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

  onReset() {
    this.activeCategoryId = null;
    this._findSrv.onReset();
  }

  onAddGroup() {
    if (!this.activeCategoryId) {
      console.error('Category not selected.');

      return;
    }

    this._categoriesSrv.retrieve(this.activeCategoryId).subscribe((parent) => {
      this._modalCtrl
        .create({
          component: CategoryModalComponent,
          componentProps: {
            mode: 'create',
            parent: parent,
          },
        })
        .then((modal) => modal.present());
    });
  }

  onAddIcon() {
    this._categoriesSrv
      .retrieve(this.activeCategoryId)
      .subscribe((clientData) => {
        this._modalCtrl
          .create({
            component: IconModalComponent,
            componentProps: {
              category: clientData,
              mode: 'create',
            },
          })
          .then((modal) => modal.present());
      });
  }
}
