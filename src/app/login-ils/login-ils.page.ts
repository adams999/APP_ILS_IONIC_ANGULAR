import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as particlesjs from 'particlesjs';

@Component({
  selector: 'app-login-ils',
  templateUrl: './login-ils.page.html',
  styleUrls: ['./login-ils.page.scss'],
})

export class LoginIlsPage implements OnInit, OnDestroy {

  public loginUser: FormGroup;
  public pref: string;
  public logueo;
  public huella;
  public dataA = {
    user: "",
    password: ""
  };
  public clientes: any;
  public Aerror: any;
  public colorIls = '#2b3643';


  constructor(public ilsAdminProvider: IlsadminService,
    public loadingCtrl: LoadingController,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toastController: ToastController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public faio: FingerprintAIO,
    public translate: TranslateService) {

    this.loginUser = this.formBuilder.group({
      user: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])]
    });

    window.onload = function () {///para cargar libreria de particulas
      particlesjs.init({
        selector: '.particulas',
        maxParticles: 50,
        color: ['#0e1575', '#EAEAEA', '#000000'],

      });
    };
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('destruye login');
  }

  async enviarDatosAgente(valor) {
    console.log(this.datosAgente());

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('LOGIN.conectando'),
      duration: 600000
    });

    loading.present();

    loading.present().then(() => {
      this.ilsAdminProvider.loginIls(this.datosAgente())
        .subscribe(
          (data) => {
            this.logueo = data;
            console.log(this.logueo.userType);
            // this.router.setRoot(ListOrdersPage,{param:this.pref,type:this.logueo.userType});
            //this.router.navigate(['/list-orders']);
            //console.log(localStorage.getItem('pref'), localStorage.getItem('userType'));
            this.loadingCtrl.dismiss();
            this.loginHuella();//validacion de huella

            //if (data) {
            //document.location.href = 'index.html'; 
            //} 
          },
          (error) => {
            this.logueo = null;
            this.loadingCtrl.dismiss();
            let subtitulo = error;
            console.log(error);
            this.alertaSigErr(subtitulo.error[0].notes);
          }
        );
    });
  }

  datosAgente() {
    let datos = new FormData();
    datos.append("user", this.dataA.user);
    datos.append("password", this.dataA.password);
    return datos
  }

  async alertaSigErr(subtitulo) {
    const alert = await this.alertController.create({
      header: this.translate.instant('LOGIN.err_acceder'),
      subHeader: '' + subtitulo + '!',
      buttons: ['OK']
    });
    alert.present();
  }

  loginHuella() {
    console.log('entra a ciclo');
    this.faio.isAvailable()
      .then(result => {//si hay huella o reconocimiento de rostro me hace la validacion de huella 

        //Fingerprint or Face Auth is available
        this.faio.show({
          //clientId: 'Fingerprint-Demo',
          //clientSecret: 'password', //Only necessary for Android
          disableBackup: true, //Only for Android(optional)
          //localizedFallbackTitle: 'Use Pin', //Only for iOS
          //localizedReason: 'Please Authenticate' //Only for iOS
          title: this.translate.instant('LOGIN.aut_biometrica'),
          cancelButtonTitle: this.translate.instant('LOGIN.cancelar')
        })
          .then((result: any) => {
            localStorage.setItem('pref', this.pref);
            localStorage.setItem('userType', this.logueo.userType);
            localStorage.setItem('id_user', this.logueo.id_user);
            localStorage.setItem('firstname', this.logueo.firstname);
            localStorage.setItem('lastname', this.logueo.lastname);
            localStorage.setItem('lang_app', this.logueo.langApp);
            this.alertaToastLogin();//si la huella es la correcta
          })
          .catch((error: any) => {
            //si se dio cancelar 
            this.huella = error;
          });

      })
      .catch((err) => {
        localStorage.setItem('pref', this.pref);
        localStorage.setItem('userType', this.logueo.userType);
        localStorage.setItem('id_user', this.logueo.id_user);
        localStorage.setItem('firstname', this.logueo.firstname);
        localStorage.setItem('lastname', this.logueo.lastname);
        localStorage.setItem('lang_app', this.logueo.langApp);
        this.alertaToastLogin();
      })

  }

  async alertaToastLogin() {
    const toast = await this.toastController.create({
      message: this.translate.instant('LOGIN.bienvenido'),
      duration: 2000,
      position: 'top'
    });

    toast.present();
    this.ilsAdminProvider.getClients()
      .subscribe(
        (data) => {
          this.clientes = data;
          for (const key in this.clientes) {
            if (this.clientes.hasOwnProperty(key)) {
              let element = this.clientes[key];
              element['logo_agencia'] = 'https://ilsadmin.com/app/upload_files/logo_clientes/' + element.img_cliente;
            }
          }
          if (this.clientes.length > 1) {///aqui creo una variable global para cargar los clientes y leerlos de manera mas rapida para el menu
            localStorage.setItem('clientes', JSON.stringify(this.clientes));
            setTimeout(() => {
              document.location.href = 'index.html'
            }, 1000);
          }
          this.Aerror = null;
          console.log(this.clientes);
        },
        (error) => {
          this.Aerror = error;
          console.log(error);
        }
      );

  }

  async alertHuella(titulo, subtitulo) {
    const alert = await this.alertController.create({
      header: titulo,
      message: subtitulo,
      buttons: ['OK']
    });
    return await alert.present();
  }

}
