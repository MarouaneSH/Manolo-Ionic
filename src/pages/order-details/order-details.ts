import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PrintingPage } from '../printing/printing';



@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  articles = [];
  promos = [];
  paiement = null;
  order_id = null;
  constructor(public navCtrl: NavController,public modalCtrl:ModalController, public navParams: NavParams, public authService : AuthServiceProvider) {
  }

  ionViewDidLoad() {
   this.order_id = this.navParams.get('order_id');
   this.authService.post_request("orders/"+this.order_id).then((data: any)=>{
     this.articles = data.articles;
     this.paiement = (data.paiement) ? data.paiement[0] : null;
     this.promos = data.promos;
   }).then(()=>{
     this.authService.hideLoading();
   })
  }

  print() {
      //1. Open printer select modal
      let modal=this.modalCtrl.create(PrintingPage , { articles: this.articles, paiement : this.paiement, order_id : this.order_id, promos : this.promos });
      
      //0. Present Modal
      modal.present();
  }
  closeModal() {
      this.navCtrl.pop();
  }
}
