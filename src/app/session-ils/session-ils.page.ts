import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { Countries } from '../providers/countries';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session-ils',
  templateUrl: './session-ils.page.html',
  styleUrls: ['./session-ils.page.scss'],
})
export class SessionIlsPage implements OnInit {

  public userType;
  public datosAgente;
  public paisAgencia;
  public appVersionVar;
  public infUser;
  public paises;

  constructor(public toastController: ToastController,
    public ilsAdminProvider: IlsadminService,
    public countries: Countries,
    public browserTab: BrowserTab,
    public inAppBrowser: InAppBrowser,
    public loadingController: LoadingController,
    public translate: TranslateService) {
    this.paises = this.countries.getCountries();
  }

  arribaRefresh(event) {
    setTimeout(() => {
      event.target.complete(this.ngOnInit());
    }, 1500);
  }

  ngOnInit() {
    this.ilsAdminProvider.getInformIls(this.paramPost())
      .subscribe(
        (data) => {
          this.datosAgente = data;
          console.log(this.datosAgente)
          for (let i = 0; i < this.paises.length; i++) {
            if (this.paises[i].iso_country == this.datosAgente[1].id_country) {
              this.paisAgencia = this.paises[i].description;
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
          console.log(err);
        });

    this.ilsAdminProvider.getInformUserIls(localStorage.getItem('id_user'))
      .subscribe(
        (data: any) => {
          if (data[0].notes) {
            this.infUser = false;
          } else {
            this.infUser = data[0];
            for (let i = 0; i < this.paises.length; i++) {
              if (this.paises[i].iso_country == this.infUser.id_country) {
                this.infUser.id_country = this.paises[i].description;
              }
            }
          }
          console.log(this.infUser);
        },
        (err) => {
          console.log(err);
        })
  }

  paramPost() {
    let datos = new FormData();
    datos.append("prefix", 'C.A');
    return datos
  }

  async borrarAlmacenamiento() {
    await this.loading(15000, this.translate.instant('SESSION_ILS.session_out'));

    this.ilsAdminProvider.logoutApp()
      .subscribe((data) => {
        this.elimLocalStorage();
        this.loadingController.dismiss();
        this.alertaToast(this.translate.instant('SESSION_ILS.session_out_ok'), 1000, true);
        console.log('storage borrado');
      }, (err) => {
        this.loadingController.dismiss();
        this.alertaToast(this.translate.instant('SESSION_ILS.err_session_out'), 2000, false);
      });
  }

  elimLocalStorage() {
    let so = localStorage.getItem("so");
    let v_so = localStorage.getItem("v_so");
    let manuf = localStorage.getItem("manuf");
    let modelo = localStorage.getItem("modelo");
    let uuid = localStorage.getItem("uuid");
    localStorage.clear();
    localStorage.setItem('so', so);
    localStorage.setItem('v_so', v_so);
    localStorage.setItem('manuf', manuf);
    localStorage.setItem('modelo', modelo);
    localStorage.setItem('uuid', uuid);
  }

  async loading(duration, message) {
    const loading = await this.loadingController.create({
      duration: duration,
      message: message,
    });
    return await loading.present();
  }

  async alertaToast(message, duration, login: boolean) {
    let toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    if (login) {
      toast.onDidDismiss()
        .catch(data => document.location.href = 'index.html')
        .then(err => document.location.href = 'index.html');
    }

    toast.present();
  }

  navegadorSitioAgencia(link, event) {

    let options: InAppBrowserOptions = {
      toolbarcolor: '#2b3643',
      navigationbuttoncolor: '#ffffff',
      closebuttoncolor: '#ffffff'
    }

    this.inAppBrowser.create(link, '_self', options);
  }

}
