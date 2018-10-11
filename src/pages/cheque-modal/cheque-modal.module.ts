import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChequeModalPage } from './cheque-modal';

@NgModule({
  declarations: [
    ChequeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ChequeModalPage),
  ],
})
export class ChequeModalPageModule {}
