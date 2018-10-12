import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  articles = [];
  paiement = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService : AuthServiceProvider) {
  }

  ionViewDidLoad() {
   let order_id = this.navParams.get('order_id');
   this.authService.post_request("orders/"+order_id).then((data: any)=>{
     this.articles = data.articles;
     this.paiement = (data.paiement) ? data.paiement[0] : null;
   }).then(()=>{
     this.authService.hideLoading();
   })
  }

  closeModal() {
      this.navCtrl.pop();
  }
}
