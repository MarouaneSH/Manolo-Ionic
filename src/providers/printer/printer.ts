import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the PrinterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrinterProvider {


  selectedPrinter = null;
  articles = [];
  paiement = null;
  order_id = null;


  constructor(public http: HttpClient,private btSerial:BluetoothSerial,private nativeStorage: Storage,private alertCtrl:AlertController) {
  }


  savePrinter() {
    this.nativeStorage.set("selectedPrinter",this.selectedPrinter);
  }
  searchBt()
  {
    return this.btSerial.list();
  }



  write() {

  //  let client_name= "Client : Marouane".padEnd(24, " ");
  // let chauffaur_name = "Chauffeur : Mohammed".padStart(24, " ");
  // let quartier = "Quartier : Elhoda".padEnd(24, " ");
  // let date = new Date().toLocaleString().padStart(24, " ");


  let articles_list = "";
  this.articles.forEach(e => {
    articles_list += e.designation.padEnd(15, " ")  + e.quantite.toString().padStart(3, " ").padEnd(6, " ") + (e.prix_vente + "DH").toString().padStart(4, " ").padEnd(8, " ") + ((e.quantite * e.prix_vente) + "DH").toString().padStart(5, " ").padEnd(12, " ") + "0"+`\r`;
  });
  let client_name= this.paiement.nom_client;
  let chauffaur_name = this.paiement.nom_user;
  let quartier_name = ("Quartier : "+ this.paiement.libelle).padEnd(24, " ");
  let date = new Date().toLocaleString().padStart(24, " ");
  let total_net = `Total NET a payer : ${this.paiement.montant} DH`.padStart(45, " ");
  let type_payment = `Type payment : ${this.paiement.type_paiement}`.padStart(45, " ");
let printData =
`
-----------------------------------------------\r
                 Sté DISTRILAY \r
           AV de la meque, Bd mohamed 6.\r
         Manolo N° 345 BP:52, LAAYOUN 70020 \r
           Tél: 0528991322 / 0661283916\r
----------------------------------------------\r
${"Client".padEnd(24, " ")}${"Chauffeur".padStart(18, " ")}\r
${client_name.padEnd(24, " ")}${chauffaur_name.padStart(22, " ")}\r
${quartier_name}${date}\r\r
----------------------------------------------\r
                  FACTURE N ${this.order_id} \r
----------------------------------------------\r
Article       | Qte | Prix | Total | Promotion \r
----------------------------------------------\r
${articles_list}
----------------------------------------------\r
${total_net}\r
${type_payment}\r
\r      
\r
`;

    return new Promise((resolve,reject)=> {
      this.btSerial.write(printData).then(dataz=>{
          console.log("WRITE SUCCESS",dataz);
    
          let mno=this.alertCtrl.create({
            title:"Impression SUCCESS!",
            buttons:['Dismiss']
          });
          mno.present();
          
          // xyz.unsubscribe();
          resolve(true);
        },errx=>{
          console.log("WRITE FAILED",errx);
          let mno=this.alertCtrl.create({
            title:"ERROR "+errx,
            buttons:['Dismiss']
          });
          mno.present();
          resolve(true);
        });
    });
  }

  print()
  {
  
  

    return new Promise((resolve,reject)=> {

        this.btSerial.isConnected().then((value)=> {
            this.write().then(()=> {
              resolve(true);
            }).catch(()=> {
              resolve(true);
            })
        }).catch(()=> {
          let xyz=this.btSerial.connect(this.selectedPrinter.address).subscribe(data=>{
            this.write().then(()=> {
              resolve(true);
            }).catch(()=> {
              resolve(true);
            })
          },err=>{
            console.log("CONNECTION ERROR",err);
            let mno=this.alertCtrl.create({
              title:"ERROR "+err,
              buttons:['Dismiss']
            });
            mno.present();
            resolve(true);
          });
        })
        
    });
   

  }

}
