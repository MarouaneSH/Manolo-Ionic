import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { BarcodeModalPage } from '../barcode-modal/barcode-modal';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ChequeModalPage } from '../cheque-modal/cheque-modal';
import { ZebraPrinter } from 'ca-cleversolutions-zebraprinter/native';
import { Printer } from '@ionic-native/printer';
import { PrintingPage } from '../printing/printing';


@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  command = null;
  categories = [];
  sous_categories = [];
  articles = [];
  filtredArticles = [];
  selectedArticles = [];
  showSlected = true;
  montant_total = 0;
  promos = [];
  myDate = null;

  
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public authService:AuthServiceProvider,
              private alertCtrl: AlertController,
              protected zebraPrinter:ZebraPrinter,
              private printer: Printer) {
  }

   discover(){
    this.printer.pick().then((data)=>{
      console.log(data);
    })
    // console.log("Now Discover");
    // this.zebraPrinter.discover().then(result => {
    //   console.log(result);
    // }).catch(err => {
    //   console.error(err);
    // });
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
    //  this.openPanierModal();
    //  this.selectedArticles.push(JSON.parse('{"type_mouvement":"charge","id_mouvement_charge":4,"date_mouvement":"2018-10-14 00:00:00","quantite":"10","code_fk_article":1,"code_fk_charge":6,"id_article":1,"designation":"valencia 1l","seuil_alert":50,"code_fk_fournisseur":1,"code_fk_sous_categorie":1,"code_fk_taxe":null,"id_prix_article":1,"libelle":"prix generale","prix_vente":11,"prix":11,"prix_total":110}')) ;
    //  this.articles = this.selectedArticles;
    //  this.promos = JSON.parse('[{"id_promotion":10,"libelle":"promo special","qte_cadeau":2,"qte_min":10,"code_fk_article":1,"code_fk_client":"2"},{"id_promotion":12,"libelle":"promo printemps","qte_cadeau":1,"qte_min":10,"code_fk_article":1,"code_fk_client":null}]');
    //  this.addArticle(this.selectedArticles[0]);
    }


  openPanierModal() {
    let panierModal = this.modalCtrl.create(BarcodeModalPage);
    panierModal.onDidDismiss(data => {
      if(!data) return;
      console.log(data);
      let post_data = {
        "id_client" : data.text
      };  
      this.authService.post_request("article/add",post_data).then((response:any)=> {
        if(response.client != null) {
          this.command =  {
            id : response.command_id,
            client : response.client
          };
          console.log(this.command.id);
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
        this.promos = response.promos;
        this.articles = response.articles ;
        this.filtredArticles = Object.values((this.articles.reduce((acc,cur)=>Object.assign(acc,{[cur.id_article]:cur}),{})));
        if(this.selectedArticles.length) {
          console.log("-----");
          console.log(this.filtredArticles);
          console.log(this.selectedArticles);
          this.filtredArticles = this.filtredArticles.filter((filtred) => {
               return !this.selectedArticles.filter((selected) => selected.id_article == filtred.id_article).length;
          });
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
    //check occurence article
    // let occurence = this.articles.filter((a)=> a.id_article == article.id_article);
    // if(occurence.length == 1) {
    //   inputs.push({
    //       value: article.prix_vente,
    //       label: `${article.prix_vente} DH (${article.libelle})`,
    //       type: "radio",
    //   })
    // } else {
    //   occurence.forEach(element => {
    //       inputs.push({
    //         value: element.prix_vente,
    //         label: `${element.prix_vente} DH (${element.libelle})`,
    //         type: "radio",
    //     })
    //   });
    // }

    let inputs = [];
    // inputs.push({
    //     value: article.prix_vente,
    //     label: ``,
    //     type: "radio",
    //     checked : true,
    // })
    inputs.push({
        type: 'number',
        name:'quantite',
        placeholder: 'Quantité'
    })

    let article_promos = [];
    if(this.promos.length ) {
      article_promos = this.promos.filter((e)=> e.code_fk_article === article.id_article && e.is_special == 0 || e.code_fk_article === article.id_article && e.is_special == 1 &&  e.code_fk_client == this.command.client.cin);
      if(article_promos.length == 2) {
        article_promos = article_promos.filter((e) => e.libelle == "promo special");
      } 
    }

    let subtitle = "", has_promos = false;
    
    //check if this article have a promo
    if(article_promos.length) {
      has_promos = true;
      subtitle = `sur ${article_promos[0].qte_min}  articles en stock, vous recevrez ${article_promos[0].qte_cadeau} articles gratuits `;
    } 



    let alert = this.alertCtrl.create({
      title: article.designation,
      subTitle: `Prix ${article.prix_vente} DH \n <br> ${subtitle}`,
      inputs: inputs,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Suivant',
          handler: data_quantite => {
            console.log(data_quantite);
            if(!data_quantite) {
              return false;
            }

            if(data_quantite.quantite == "") {
              alert.setMessage("Vous devez selectionner une quantité");
              return false;
            }

          

            
          

            if(article.current_quantite < data_quantite.quantite ) {
              alert.setMessage("la quantité sélectionnée est supérieure à la quantité en stock")
              return false;
            }
            if(isNaN(data_quantite.quantite) ) {
              return false;
            }
            article.prix = article.prix_vente;
            article.current_quantite = data_quantite.quantite;
            article.prix_total = article.prix_vente * data_quantite.quantite;
            if(has_promos) {
              //check if article has the min quantite to profit from promotion
              if(data_quantite.quantite >= article_promos[0].qte_min) {
                article.has_promos = true;
                article.qte_cadeau = Math.round((data_quantite.quantite * article_promos[0].qte_cadeau) / article_promos[0].qte_min );
                console.log("has promos");
              }
            }
            this.selectedArticles.push(article);
            this.filtredArticles = this.filtredArticles.filter((e)=> e.id_article !== article.id_article);

            return true;
            
          }
        }
      ]
    });
    alert.present();
  }

  removeArticle(id,sous_category) {
    this.selectedArticles = this.selectedArticles.filter((e)=> e.id_article !== id);
    this.getArticles(sous_category);
    
  }


  showReglementAlert() {
    this.montant_total= this.selectedArticles.map((e) => e.prix_total).reduce((a, b) => a + b, 0);
    console.log(this.montant_total);
    console.log(this.selectedArticles);
    let alert = this.alertCtrl.create({
      title:  "Total: " + this.montant_total.toLocaleString() + " DH",
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
        {
          value: 'cheque',
          label: 'Cheque',
          type: "radio",
        },
      ],
      buttons: [
        {
          text: 'Régler la commande',
          handler: data => {
            if(!data) {
              return false;
            }
            if(data == 'cheque') {
              this.openChequeModal();
            } else if(data == 'credit_avance')  {
              this.displayPromptAvance();
            } else {
              this.reglerCommand(data);
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

  reglerCommand(type,avance?,image?,date_cheque?) {
    let reste = 0, status = 0;
    if(type == 'credit_avance') {
      reste  = this.montant_total - avance;
    } else if(type == 'credit') {
      reste = this.montant_total;
    } else {
      status = 1;
    }
    
    let post_data = {
      type_paiement : type,
      libelle: (type == "credit_avance") ? "Credit avec avance" : type,
      montant : this.montant_total,
      command_id : this.command.id,
      reste : reste,
      selectedArticles : this.selectedArticles,
      avance : avance,
      image : image,
      status : status,
      date_cheque : date_cheque
    }

    this.authService.post_request("command/add",{data : post_data}).then((data:any)=>{
      this.selectedArticles = [];
     
      this.slides.lockSwipes(false);
      this.slides.slideTo(0);
      this.slides.lockSwipes(true);
       //1. Open printer select modal
       let modal=this.modalCtrl.create(PrintingPage , { articles: data.articles, paiement : data.paiement[0], order_id : this.command.id});
       this.command = null;
       //0. Present Modal
       modal.present();
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
          text: "Régler la commande",
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
      if(data) {
        this.reglerCommand("cheque",null,data.base_64,data.date_cheque);
      }

    });
    chequeModal.present();
  }
  
}





