import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintingListModalPage } from './printing-list-modal';

@NgModule({
  declarations: [
    PrintingListModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintingListModalPage),
  ],
})
export class PrintingListModalPageModule {}
