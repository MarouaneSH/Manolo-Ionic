import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { PanierPage } from '../panier/panier';
import { ChequeModalPage } from '../cheque-modal/cheque-modal';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = ChequeModalPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
