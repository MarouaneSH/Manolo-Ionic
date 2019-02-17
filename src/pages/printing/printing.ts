import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { PrintingListModalPage } from '../printing-list-modal/printing-list-modal';
import { PrinterProvider } from '../../providers/printer/printer';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PrintingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printing',
  templateUrl: 'printing.html',
})
export class PrintingPage {

  constructor(private nativeStorage: Storage,public authService:AuthServiceProvider,private btSerial:BluetoothSerial,public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, private printerProvider:PrinterProvider) {
  }

  printers = [];
  selectedPrinter = null;
  hidePage = true;
  isEdit = false;

  ionViewDidLoad() {
    if(this.navParams.get('isEdit')) {
      this.isEdit = true;
    } else {
      this.printerProvider.articles = this.navParams.get('articles');
      this.printerProvider.paiement = this.navParams.get('paiement');
      this.printerProvider.order_id = this.navParams.get('order_id');
      this.printerProvider.promos = this.navParams.get('promos');
      this.printerProvider.articles.forEach((article)=> {
          let promos = this.printerProvider.promos.filter((pr) => pr.code_fk_article == article.id_article);
          if(promos.length) {
            article.promos = promos[0].quantite;
          } else {
            article.promos = 0;
          }
          return article;
      });
    }
    
    this.authService.displayLoading();
    this.nativeStorage.get('selectedPrinter').then((data)=> {
      this.selectedPrinter=  data;
      this.printerProvider.selectedPrinter = data;
      this.authService.hideLoading();
      if(data && !this.isEdit) {
        this.print().then(()=> {
          this.closeModal();
        }).catch(()=> {

        });
      }
      
    })
   
  }

  OpenSearchModal() {
    //1. Open printer select modal
    let modal=this.modalCtrl.create(PrintingListModalPage);
      
    //2. Printer selected, save into this.selectedPrinter
    modal.onDidDismiss(data=>{
      if(data) {
        this.selectedPrinter=data;
        this.printerProvider.selectedPrinter = data;
        this.printerProvider.savePrinter();
        this.btSerial.connect(data.address);
      }
      
    });
    
    //0. Present Modal
    modal.present();
  }


  searchBt()
  {
    this.btSerial.list().then((data) => {
      this.printers = data;
      console.log(data);
    });
  }

  print() {
    return new Promise((resolve,reject)=> {
      this.authService.displayLoading();
      this.printerProvider.print().then(()=> {
        this.authService.hideLoading();
        resolve(true);
      }).catch(()=> {
        console.log("rekjecte");
        this.authService.hideLoading();
        reject(true);
      });
    })
  }

  closeModal(){
    this.navCtrl.pop();
  }
}
