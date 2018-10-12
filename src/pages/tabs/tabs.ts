import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { PanierPage } from '../panier/panier';
import { OrdersPage } from '../orders/orders';
import { CreditsPage } from '../credits/credits';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = PanierPage;
  tab3Root = OrdersPage;
  tab4Root = CreditsPage;

  constructor() {

  }
}
