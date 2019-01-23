import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';



@Component({
  selector: 'page-barcode-modal',
  templateUrl: 'barcode-modal.html',
})
export class BarcodeModalPage {

  constructor(public navCtrl: NavController,
               public alertCtrl: AlertController,
              public barcodeScanner : BarcodeScanner,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
        // barcodeData.text = "2";
        this.viewCtrl.dismiss(barcodeData);
    }).catch(err => {
        console.log('Error', err);
    });
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Entrer le code de magasin',
      inputs: [
        {
          name: 'code',
          placeholder: 'code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: 'Save',
          handler: data => {
             this.viewCtrl.dismiss(data.code);
          }
        }
      ]
    });
    prompt.present();
  }
}
