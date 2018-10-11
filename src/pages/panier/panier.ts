import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { BarcodeModalPage } from '../barcode-modal/barcode-modal';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ChequeModalPage } from '../cheque-modal/cheque-modal';

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  command = null;
  categories = [];
  sous_categories = [];
  articles = [];
  selectedArticles = [];
  showSlected = true;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public authService:AuthServiceProvider,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    //fetch categories
    this.authService.post_request("categories").then((response:any)=>{
      this.categories = response.categories;
    }).then(()=>{
      this.authService.hideLoading();
    })
    //test
    this.selectedArticles = JSON.parse('[{"id_article":5,"designation":"pepsi 33cl","quantite":"32","seuil_alert":100,"code_fk_fournisseur":1,"code_fk_sous_categorie":3,"code_fk_taxe":null,"prix":"32","prix_total":1024},{"id_article":6,"designation":"pepsi 0.5cl","quantite":918,"seuil_alert":100,"code_fk_fournisseur":1,"code_fk_sous_categorie":3,"code_fk_taxe":null,"prix_total":1024},{"id_article":7,"designation":"pepsi 1L","quantite":1000,"seuil_alert":100,"code_fk_fournisseur":1,"code_fk_sous_categorie":3,"code_fk_taxe":null,"prix_total":1024}]');
  }


  openPanierModal() {
    let panierModal = this.modalCtrl.create(BarcodeModalPage);
    panierModal.onDidDismiss(data => {
      let post_data = {
        "id_client" : data.text
      };  
      this.authService.post_request("article/add",post_data).then((response:any)=> {
        if(response.client != null) {
          this.command =  {
            id : response.command_id,
            client : response.client
          };
        } else {
          this.presentAlert("Client non trouvé");
        }
        
      }).then(()=>{
        this.authService.hideLoading();
      });
      

    });
    panierModal.present();
  }


  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Réessayer']
    });
    alert.present();
  }

  cancelCommand() {
    const confirm = this.alertCtrl.create({
      title: 'êtes-vous sûr de vouloir annuler votre commande?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.command = null;
            this.selectedArticles = [];
            this.slides.lockSwipes(false);
            this.slides.slideTo(0);
            this.slides.lockSwipes(true);
          }
        }
      ]
    });
    confirm.present();
  }

  slideNext(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }
  slideBack(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  getCategory() {
    this.slideNext();
  }

  getSubCategory(category) {
    this.authService.post_request("sous_categories", {category : category}).then((response:any)=> {
      if(response.sous_categories != null) {
        this.sous_categories = response.sous_categories ;
        this.slideNext();
      } else {
        this.presentAlert("Aucun produit trouvé");
      }
      
    }).then(()=>{
      this.authService.hideLoading();
    });
  }

  getArticles(sous_category) {
    this.authService.post_request("articles", {sous_category : sous_category}).then((response:any)=> {
      if(response.articles != null) {
        this.articles = response.articles ;
        console.log(this.articles);
        if(this.selectedArticles.length) {
          this.articles =  this.articles.filter(value => {
            return !this.selectedArticles.map((e)=> e.id_article ).includes(value.id_article);
          });
        }
        this.slideNext();
      } else {
        this.presentAlert("Aucun produit trouvé");
      }
      
    }).then(()=>{
      this.authService.hideLoading();
    });
  }

  addArticle(article) {
    let alert = this.alertCtrl.create({
      title: article.designation,
      inputs: [
        {
          name: 'prix',
          placeholder: 'Prix',
          type: "number",
        },
        {
          name: 'quantite',
          placeholder: 'Quantité',
          type: "number",
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            if(article.quantite < data.quantite) {
              alert.setMessage("la quantité sélectionnée est supérieure à la quantité en stock")
              return false;
            }
            article.prix = data.prix;
            article.quantite = data.quantite;
            article.prix_total = data.prix * data.quantite;
            this.selectedArticles.push(article);
            this.articles = this.articles.filter((e)=> e.id_article !== article.id_article);
          }
        }
      ]
    });
    alert.present();
  }

  removeArticle(id) {
    this.selectedArticles = this.selectedArticles.filter((e)=> e.id_article !== id);
  }


  showReglementAlert() {
    let alert = this.alertCtrl.create({
      title: "Régler la commande",
      inputs: [
        {
          value: 'espece',
          label: 'Espece',
          type: "radio",
        },
        {
          value: 'credit',
          label: 'Credit',
          type: "radio",
        },
        {
          value: 'credit_avance',
          label: 'Credit avec avance',
          type: "radio",
        },
      ],
      buttons: [
        {
          text: 'Régler la commande',
          handler: data => {
            if(data == 'espece') {
              this.reglerCommand(data);
            } else if(data == 'credit_avance')  {
              this.displayPromptAvance();
            }
            
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  reglerCommand(type,avance?) {

    let montant_total = this.selectedArticles.map((e) => e.prix_total).reduce((a, b) => a + b, 0);
    let post_data = {
      type_paiement : type,
      libelle: (type == "credit_avance") ? "Credit avec avance" : type,
      montant : montant_total,
      command_id : this.command.id,
      reste : 0,
      selectedArticles : this.selectedArticles,
      avance : avance,
    }

    this.authService.post_request("command/add",{data : post_data}).then(()=>{
      console.log("dsds");
    }).then(()=>{
      this.authService.hideLoading();
    })
  }

  displayPromptAvance(){
    let alert = this.alertCtrl.create({
      title: "Crédit avec avance",
      inputs: [
        {
          name: "avance",
          placeholder: "Montant d'avance",
          type: "number",
        },
      ],
      buttons: [
        {
          text: 'Régler la commande',
          handler: data => {
            if(!data.avance) {
              return false;
            }
            this.reglerCommand("credit_avance",data.avance);
          }
        },
        {
          text: 'retour',
          role : 'cancel',
          handler: data => {
            this.showReglementAlert();
          }
        }
      ]
    });
    alert.present();
  }

  openChequeModal(){
    let chequeModal = this.modalCtrl.create(ChequeModalPage);
    chequeModal.onDidDismiss(data => {
      if(data.base_64) {
          let post_data = {
            "base_64" : data.base_64
          };  
          this.authService.post_request("upload",post_data).then((response:any)=> {
           
              
          }).then(()=>{
            this.authService.hideLoading();
          });
      }

    });
    chequeModal.present();
  }
  
}





