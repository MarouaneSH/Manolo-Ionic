import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { PrintingPage } from '../printing/printing';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private loginForm : FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public app: App,
              public modalCtrl: ModalController,
              private formBuilder: FormBuilder,
              public authService:AuthServiceProvider,
              private storage:Storage) {

      this.loginForm = this.formBuilder.group({
        'password' : ['', Validators.required],
        'password_confirm' : ['', Validators.required],
      } ,{validator : this.checkPasswords});
    
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.password_confirm.value;

    return pass === confirmPass ? null : { notSame: true }     
  }

  changePassword() {
    this.authService.post_request("password/change", JSON.stringify({newPassword : this.loginForm.get('password').value}))
    .then((response) => {
         this.authService.displayMessage("votre mot de passe a été changé avec succès");
    }).then(()=> {
          this.authService.hideLoading();
    });
  }

  logout() {
    this.authService.post_request("logout", JSON.stringify({newPassword : this.loginForm.get('password').value}))
    .then((response) => {
      this.storage.remove("token").then(()=> {
        //  this.navCtrl.setRoot(LoginPage);
         this.app.getRootNav().setRoot(LoginPage);
      })
    }).then(()=> {
          this.authService.hideLoading();
    });
  }

  openImpression(){
    //1. Open printer select modal
    let modal=this.modalCtrl.create(PrintingPage , { isEdit: true});
    //0. Present Modal
    modal.present();
  }

}
