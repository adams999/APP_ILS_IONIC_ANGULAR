import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Countries } from '../providers/countries';
import { IlsadminService } from '../providers/ilsadmin.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit, OnDestroy {

  public session;
  public COLOR_MENU_BACKEND;
  public pref;
  public nomClient;
  public logo;
  public userType;
  public datosAgente;
  public paisAgencia = 'XX';
  public webAgencia;
  public parametroMaster;
  public whatsapp: boolean = false;
  public titulo;
  public subscription;

  constructor(public navCtrl: NavController,
    public toastController: ToastController,
    public ilsAdminProvider: IlsadminService,
    public countries: Countries,
    public inAppBrowser: InAppBrowser,
    public activatedRoute: ActivatedRoute,
    //public events: Events,
    public zone: NgZone,
    public socialSharing: SocialSharing,
    public translate: TranslateService, ) {
    this.titulo = this.activatedRoute.snapshot.paramMap.get('titulo');
    this.parametroMaster = this.activatedRoute.snapshot.paramMap.get('parametro');
    if (this.parametroMaster) {
      this.ngOnInit();
    }
    this.webAgencia = localStorage.getItem('web');
    this.pref = localStorage.getItem('pref');
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.session = localStorage.getItem('pref');
    this.nomClient = localStorage.getItem('nomClient');
    this.logo = localStorage.getItem("logo");
    this.userType = localStorage.getItem('userType');
    console.log(this.userType);
    //console.log(this.COLOR_MENU_BACKEND);
    this.verificaWhatsapp();

    this.subscription = this.ilsAdminProvider.currentData.subscribe((data) => {
      console.log('data pasada', data);
      if (data == 'contacto') {
        this.zone.run(() => {
          this.datosAgente = null;
          this.whatsapp = false;
          this.verificaWhatsapp();
          this.parametroMaster = this.activatedRoute.snapshot.paramMap.get('parametro');
          this.webAgencia = localStorage.getItem('web');
          this.pref = localStorage.getItem('pref');
          this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
          this.session = localStorage.getItem('pref');
          this.nomClient = localStorage.getItem('nomClient');
          this.logo = localStorage.getItem("logo");
          this.userType = localStorage.getItem('userType');
          this.ngOnInit();
        })
      }
    });
  }

  verificaWhatsapp() {
    //verificar si tiene whatsapp instalado
    this.socialSharing.canShareVia('whatsapp')
      .then((a) => {
        this.whatsapp = true;
        console.log('si tiene whatsapp instalado');
      })
      .catch((e) => {
        console.log('no tiene whatsapp instalado');
      });
  }

  arribaRefresh(event) {
    setTimeout(() => {
      event.target.complete(this.ngOnInit());
    }, 1500);
  }

  ngOnInit() {
    //console.log('contacto');
    if (this.userType) {
      this.ilsAdminProvider.postInformAgency(this.paramPost())
        .subscribe(
          (data) => {
            this.datosAgente = data;

            let paises = this.countries.getCountries();
            if (this.datosAgente[2].id_country) {
              for (let i = 0; i < paises.length; i++) {
                if (paises[i].iso_country == this.datosAgente[2].id_country) {
                  this.paisAgencia = paises[i].description;
                  //console.log('pais', this.paisAgencia);
                }
              }
            }

            //valida si no tiene signo + para los numeros de telefono los asignara
            if (this.datosAgente[2].phone1.indexOf('+') < 0) {
              this.datosAgente[2].phone1 = '+' + this.datosAgente[2].phone1;
            } if (this.datosAgente[2].phone2.indexOf('+') < 0) {
              this.datosAgente[2].phone2 = '+' + this.datosAgente[2].phone2;
            } if (this.datosAgente[2].phone3.indexOf('+') < 0) {
              this.datosAgente[2].phone3 = '+' + this.datosAgente[2].phone3;
            } if (this.datosAgente[2].phone4.indexOf('+') < 0) {
              this.datosAgente[2].phone4 = '+' + this.datosAgente[2].phone4;
            } if (this.datosAgente[1].parameter_value.indexOf('+') < 0) {
              this.datosAgente[1].parameter_value = '+' + this.datosAgente[1].parameter_value;
            }

          },
          (err) => {
            //console.log(err);
          }
        );
    } if (this.userType == undefined) {
      this.ilsAdminProvider.getInformIls(this.paramPost())
        .subscribe(
          (data) => {
            this.datosAgente = data;
            console.log(this.datosAgente)
            let paises = this.countries.getCountries();
            for (let i = 0; i < paises.length; i++) {
              if (paises[i].iso_country == this.datosAgente[1].id_country) {
                this.paisAgencia = paises[i].description;
                //console.log('pais', this.paisAgencia);
              }
            }

            //valida si no tiene signo + para los numeros de telefono los asignara
            if (this.datosAgente[1].phone1.indexOf('+') < 0) {
              this.datosAgente[1].phone1 = '+' + this.datosAgente[1].phone1;
            } if (this.datosAgente[1].phone2.indexOf('+') < 0) {
              this.datosAgente[1].phone2 = '+' + this.datosAgente[1].phone2;
            } if (this.datosAgente[1].phone3.indexOf('+') < 0) {
              this.datosAgente[1].phone3 = '+' + this.datosAgente[1].phone3;
            } if (this.datosAgente[1].phone4.indexOf('+') < 0) {
              this.datosAgente[1].phone4 = '+' + this.datosAgente[1].phone4;
            } if (this.datosAgente[1].parameter_value.indexOf('+') < 0) {
              this.datosAgente[1].parameter_value = '+' + this.datosAgente[1].parameter_value;
            }

          },
          (err) => {
            //console.log(err);
          }
        );
    }
  }

  ngOnDestroy() {
    //destruyo la subscripcion al evento para que no me actualice varias veces la misma pagina y evitar multiples solicitudes al servidor
    this.subscription.unsubscribe('contacto');
    console.log('destruye contacto');
  }

  paramPost() {
    let datos = new FormData();
    datos.append("prefix", this.pref);
    return datos
  }

  navegadorSitioAgencia(link, event) {
    let options: InAppBrowserOptions = {
      toolbarcolor: !(!this.COLOR_MENU_BACKEND || !this.pref) ? localStorage.getItem('COLOR_MENU_BACKEND') : '#2b3643',
      navigationbuttoncolor: '#ffffff',
      closebuttoncolor: '#ffffff'
    }

    this.inAppBrowser.create(link, '_self', options);
  }

  async alertaToast() {
    let toast = await this.toastController.create({
      message: this.translate.instant('COMPONENT.session_out_ok'),
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss()
      .catch(data => document.location.href = 'index.html')
      .then(err => document.location.href = 'index.html');

    toast.present();
  }

}
