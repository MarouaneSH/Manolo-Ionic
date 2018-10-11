import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ProfilePage } from '../pages/profile/profile';
import { PanierPage } from '../pages/panier/panier';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BarcodeScannerMock } from '@ionic-native-mocks/barcode-scanner';

import { Camera } from '@ionic-native/camera';
import { CameraMock } from '@ionic-native-mocks/camera';

import { BarcodeModalPage } from '../pages/barcode-modal/barcode-modal';
import { HttpClientModule } from '@angular/common/http';
import { ChequeModalPage } from '../pages/cheque-modal/cheque-modal';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ProfilePage,
    PanierPage,
    BarcodeModalPage,
    ChequeModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {mode: 'ios'}),
    HttpClientModule,
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ProfilePage,
    PanierPage,
    BarcodeModalPage,
    ChequeModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    BarcodeScanner,
    { provide: BarcodeScanner, useClass: BarcodeScannerMock },
    Camera,
    { provide: Camera, useClass: CameraMock },
    

  ]
})
export class AppModule {}
