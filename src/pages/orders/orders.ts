import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { OrderDetailsPage } from '../order-details/order-details';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  orders = [];
  filtredOrders = [];
  filter_status = 'all';
  page = 1;
  maxPage = null;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public authService:AuthServiceProvider,
              public modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    this.orders = [];
    this.filtredOrders = [];
    this.page = 1;
    this.fetch_orders();
  }

  fetch_orders(infiniteScroll?) {
      this.authService.post_request("orders?page="+this.page).then((data:any)=>{
          this.maxPage =  data.orders.last_page;

          for(let i=0; i< data.orders.data.length;i++) {
            this.orders.push(data.orders.data[i]);
          }
          this.filtredOrders = this.orders;

          if (infiniteScroll) {
            infiniteScroll.complete();
          }
      }).then(()=>{
        this.authService.hideLoading();
      });
  }

  filter_orders(filter) {
    this.filter_status = filter;
    if(filter == 'day') {
      this.filtredOrders = this.orders.filter((order)=>  { 
          return Date.parse(new Date().toISOString().slice(0, 10)) == Date.parse(order.date_commande);  
      });
    } else if(filter == 'month') {
      this.filtredOrders = this.orders.filter((order)=>  { 
        return (new Date(order.date_commande).getMonth() + 1) ==  (new Date().getMonth() + 1);
      });
    } else if(filter == 'year') {
      this.filtredOrders = this.orders.filter((order)=>  { 
        return new Date(order.date_commande).getFullYear() ==  new Date().getFullYear();
      });
    } else {
      this.filtredOrders = this.orders;
    }
  }

  openOrderDetails(order_id) {
    let OrderModal = this.modalCtrl.create(OrderDetailsPage, { order_id: order_id });
     OrderModal.present();
  }

  doInfinite(infiniteScroll) {
    this.page ++;
    this.fetch_orders(infiniteScroll);
    if (this.page === this.maxPage) {
      infiniteScroll.enable(false);
    }
  }

}
