import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the ClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'client.html',
})
export class ClientPage {


  clients = ["sdds","sdds"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthServiceProvider, public barcodeScanner : BarcodeScanner, public alertCtrl :AlertController) {
  }

  ionViewWillEnter() {
   this.authService.post_request("clients").then((response:any)=> {
       this.clients = response.clients; 
    }).then(()=>{
      this.authService.hideLoading();
    });
  }

  
  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
        barcodeData.text = String(Math.random() * 100);
        console.log(barcodeData);
        if(barcodeData) {
          const prompt = this.alertCtrl.create({
            title: 'Ajouter un client',
            message: "QR CODE : " + barcodeData.text,
            inputs: [
              {
                name: 'Nom',
                placeholder: 'Nom'
              },
              {
                name: 'phone',
                placeholder: 'Téléphone'
              },
              {
                name: 'Adresse',
                placeholder: 'Adresse'
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Save',
                handler: data => {
                  data.qrCode = barcodeData.text;
                  this.addClient(data);
                }
              }
            ]
          });
          prompt.present();
        }
    }).catch(err => {
        console.log('Error', err);
    });
  }


  addClient(data) {
    this.authService.post_request("clients/add",data).then((response:any)=> {
      this.clients = response.clients; 
   }).then(()=>{
     this.authService.hideLoading();
   });
  }
}
