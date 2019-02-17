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


  clients = [];
  quartiers = [];
  types = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthServiceProvider, public barcodeScanner : BarcodeScanner, public alertCtrl :AlertController) {
  }

  ionViewWillEnter() {
   this.authService.post_request("clients").then((response:any)=> {
       this.clients = response.clients;
       if(this.clients.length) {
         this.clients = this.clients.reverse();
       }
       this.quartiers = response.quartier; 
       this.types = response.types;
    }).then(()=>{
      this.authService.hideLoading();
    });
  }

  
  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
        // barcodeData.text = String(Math.random() * 100);
        // console.log(barcodeData);
        if(barcodeData) {
          const prompt = this.alertCtrl.create({
            title: 'Ajouter un client',
            message: "QR CODE : " + barcodeData.text,
            inputs: [
              {
                name: 'Nom',
                placeholder: 'Nom',
              },
              {
                name: 'phone',
                placeholder: 'Téléphone',
                type : "number",
              },
              {
                name: 'Adresse',
                placeholder: 'Adresse'
              },
            ],
            buttons: [
              {
                text: 'Annuler',
                handler: data => {
                    return true;
                }
              },
              {
                text: 'Suivant',
                handler: data => {
                  if(!data.phone || !data.Adresse  || !data.Nom) {
                    return false;
                  }
               
                  let alert = this.alertCtrl.create();
                  alert.setTitle('Sélectionnez le quartier');

                  this.quartiers.forEach((e)=> {
                      alert.addInput({
                        type: 'radio',
                        label: e.libelle,
                        value: e.id_quartier,
                      });
                  });
                 

                  alert.addButton('Annuler');
                  alert.addButton({
                    text: 'Suivant',
                    handler: dataRadio => {
                      if(!dataRadio) {
                        return false;
                      }

                      data.qrCode = barcodeData.text;
                      data.quartier = dataRadio;

                      let alert_types = this.alertCtrl.create();
                      alert_types.setTitle('Sélectionnez un Type');
    
                      this.types.forEach((e)=> {
                          alert_types.addInput({
                            type: 'radio',
                            label: e.libelle,
                            value: e.id_type_client,
                          });
                      });
                     
    
                      alert_types.addButton('Annuler');
                      alert_types.addButton({
                        text: 'Ajouter',
                        handler: dataType => {
                          if(!dataType) {
                            return false;
                          }
                          
                          data.type = dataType;
                          this.addClient(data);
                        }
                      });
                      alert_types.present();
                    }
                  });
                  alert.present();
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
      this.clients = response.clients.reverse();
   }).then(()=>{
     this.authService.hideLoading();
   });
  }
}
