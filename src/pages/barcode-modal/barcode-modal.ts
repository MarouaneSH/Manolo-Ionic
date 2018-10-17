import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';



@Component({
  selector: 'page-barcode-modal',
  templateUrl: 'barcode-modal.html',
})
export class BarcodeModalPage {

  constructor(public navCtrl: NavController,
              public barcodeScanner : BarcodeScanner,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

    this.barcodeScanner.scan().then(barcodeData => {
        barcodeData.text = "2";
        this.viewCtrl.dismiss(barcodeData);
    }).catch(err => {
        console.log('Error', err);
    });
  }

}
