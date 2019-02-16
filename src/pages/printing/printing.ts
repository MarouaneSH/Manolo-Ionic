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


  ionViewDidLoad() {
    this.printerProvider.articles = this.navParams.get('articles');
    this.printerProvider.paiement = this.navParams.get('paiement');
    console.log(this.printerProvider.articles);
    console.log(this.printerProvider.paiement);
    this.printerProvider.order_id = this.navParams.get('order_id');
    this.authService.displayLoading();
    this.nativeStorage.get('selectedPrinter').then((data)=> {
      this.selectedPrinter=  data;
      this.printerProvider.selectedPrinter = data;
      this.authService.hideLoading();
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
    this.authService.displayLoading();
    this.printerProvider.print().then(()=> {
      this.authService.hideLoading();
    });
  }

  closeModal(){
    this.navCtrl.pop();
  }
}
