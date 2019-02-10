import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';



// const API_URL = "http://cif.laraxio.com/manolo-api/api";
const API_URL = "http://localhost:8000/api";

@Injectable()
export class AuthServiceProvider {

  public token : any;
  public loading: any;

  
  constructor(public http:HttpClient, 
              private storage: Storage,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

    this.loading = this.loadingCtrl.create({
        content: 'Chargement ...'
    });
  }

  login (credentials) {
    let headers = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
      
    this.loading.present();

    return new Promise((resolve,reject) => { 
      this.http.post(`${API_URL}/login`,{
              email: credentials.pseudo,
              password : credentials.password,
        }, 
        {headers:headers})
        .subscribe((data:any)=> {
          this.token = data.token;
          this.storage.set("token", data.token).then(()=> {
            resolve(true);
          })
        },(err) => {
          reject(true);
        });
   });
  }

  checkAuth() {
    this.loading.present();
    return new Promise((resolve,reject) => {
      this.storage.get('token').then((token)=> {
        if(token) {
          this.token = token;
          console.log(token);
          let headers = { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          };
           this.http.get(`${API_URL}/checkAuth`,{headers : headers}).subscribe(()=>{
             resolve(true);
           }, (err) => {
             reject(true);
           })
        } else {
          reject(true);
        }
      })
    })
  }

  hideLoading() {
    this.loading.dismiss();
    this.loading = this.loadingCtrl.create({
        content: 'Chargement ...'
    });
  }

  displayMessage(message) {
    let toast =this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }


  post_request(route,data?) {
    
    this.loading.present();
    return new Promise((resolve,reject) => {
        let headers = { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.token
        };
        this.http.post(`${API_URL}/${route}`,data,{headers : headers})
        .subscribe(
          res =>{
              resolve(res);
          },
          err => {
              reject(true);
        })
    })
  }


}
