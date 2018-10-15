import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TabsPage } from '../tabs/tabs';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loginForm : FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: AuthServiceProvider,
              private formBuilder: FormBuilder) {

          this.loginForm = this.formBuilder.group({
            'pseudo' : ['n354235', Validators.required],
            'password' : ['123456', Validators.required],
          });
  }

  ionViewDidLoad() {
    this.authService.checkAuth().then(()=> {
      console.log("Already logged");
      this.navCtrl.setRoot(TabsPage);
    }).catch(()=> {
      console.log("new login");
    })
    .then(()=> {
      this.authService.hideLoading();
    })
  }

  login() {
    this.authService.login(this.loginForm.value).then(()=> {
        this.navCtrl.setRoot(TabsPage);
    }).catch(()=> {
       this.loginForm.setErrors({'invalid': true});
    })
    .then(()=> {
      this.authService.hideLoading();
    })
  }
  

}
