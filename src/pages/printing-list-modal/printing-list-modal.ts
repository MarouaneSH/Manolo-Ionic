import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the PrintingListModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printing-list-modal',
  templateUrl: 'printing-list-modal.html',
})
export class PrintingListModalPage {

  constructor(private btSerial:BluetoothSerial,public authService:AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
   this.searchBt();
  }

  printers = [];

  searchBt()
  {
    this.authService.displayLoading();
    this.btSerial.list().then((data) => {
      this.printers = data;
      console.log(data);
      this.authService.hideLoading();
    });
  }
  
  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }

}
