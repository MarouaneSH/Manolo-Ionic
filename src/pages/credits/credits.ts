import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {

  credits = [];
  filtredCredits = [];
  searchClient = 'all';
  listClient = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthServiceProvider) {
  }

  ionViewWillEnter() {
    this.fetch_credits();
  }
  fetch_credits() {
      this.authService.post_request("credits").then((data:any)=>{
          this.credits = data.credits;
          this.filtredCredits = data.credits;
          this.listClient = this.credits.map((e) =>  { return {cin: e.cin, nom : e.nom}; } );
          this.listClient = Object.values(this.listClient.reduce((acc,cur)=>Object.assign(acc,{[cur.cin]:cur}),{}));
      }).then(()=>{
        this.authService.hideLoading();
      });
  }

  filterCredits() {
    if(this.searchClient == 'all') {
      this.filtredCredits = this.credits;
    } else {
      this.filtredCredits = this.credits.filter((cr) => cr.cin == this.searchClient);
    }
  }

}
