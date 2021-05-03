import { Component, NgZone, ViewChild } from '@angular/core';
import { Platform, AlertController, NavController, MenuController, IonContent, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { IlsadminService } from './providers/ilsadmin.service';
//import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.scss']
})

export class AppComponent {
  @ViewChild(Router, { static: false }) router: Router;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  public disconnect: boolean;
  public color;
  public userType;
  public logo;
  public loadLogo = false;
  public versionsHttpGet;
  public versionApp;
  public versionAppA;
  public fechaHttp: String = new Date().toISOString();
  public fechaActual: String = new Date().toISOString();
  public pages;
  public prefijoApp: any = 'ILS';
  public plataforma: any;
  public clientes: any;
  public spinnerImg = [];
  public Aerror: any;
  public menuHidden = [];
  public respVersion: any;
  public versionCode: any;
  public langPredef = 'eng';
  public backButtonApp: any;
  //rootPage:any = this.paginaSession();

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public ilsAdminProvider: IlsadminService,
    //private backgroundMode: BackgroundMode,
    public appVersion: AppVersion,
    public network: Network,
    public ngZone: NgZone,
    public appRoutingModule: AppRoutingModule,
    public navCtrl: NavController,
    public route: Router,
    public menuCtrl: MenuController,
    public appUpdate: AppUpdate,
    public translate: TranslateService,
    public modalCtrl: ModalController) {

    this.clientes = JSON.parse(localStorage.getItem('clientes'));
    localStorage.setItem('prefixApp', this.prefijoApp);
    if (localStorage.getItem('themeDark') == 'true') {//aqui aplico el thema dark si esta activo 
      document.body.classList.toggle('dark', true);
    }

    this.initializeApp('');
    this.paramTranslate();

    if (localStorage.getItem('userType')) {
      this.ilsAdminProvider.getClients()/////funcion para que una vez adentro el usuario le carguen los clientes actuales y que siempre cargue todos los clientes actuales disponibles
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
              this.clientes = JSON.parse(localStorage.getItem('clientes'));
            }
            this.Aerror = null;
            //console.log(this.clientes);
          },
          (error) => {
            this.clientes = JSON.parse(localStorage.getItem('clientes'));
            this.Aerror = error;
            console.log(error);
          }
        );
    }
    //console.log(this.clientes)
    for (const key in this.clientes) {///ciclo para habilitar o deshabilitar el spinner del menu
      if (this.clientes.hasOwnProperty(key)) {
        let element = this.clientes[key];
        element['logo_agencia'] = 'https://ilsadmin.com/app/upload_files/logo_clientes/' + element.img_cliente;
        this.spinnerImg.push(false);
      }
    }

    for (const key in this.clientes) {//ciclo para crear array con las posiciones de los hidden para poder mostrar o ocultar informacion del menu de cada agencia
      if (this.clientes.hasOwnProperty(key)) {
        this.menuHidden.push(false);
      }
    }
    //console.log(this.menuHidden);
    this.pages = this.appRoutingModule.validadorPag();

    if (localStorage.getItem('userType')) {
      navCtrl.navigateRoot('/home');
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#2b3643');
      }
    }

    this.userType = localStorage.getItem('userType');
    this.logo = localStorage.getItem('logo');
    // if (this.userType) {
    //   this.color = localStorage.getItem('COLOR_MENU_BACKEND');
    // } else {
    this.color = '#2b3643';
    //}

    network.onDisconnect().subscribe(() => {
      //aqui si el menu esta activo lo cierro y lo desactivo
      this.menuCtrl.close();
      this.menuCtrl.swipeGesture(false);
      this.modalCtrl.dismiss();
      // Aqui se detecta si no hay conexion de internet se mostrara la pagina de network como root
      navCtrl.navigateRoot('/network-page');
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#2b3643');
      }
      ngZone.run(() => { this.disconnect = true; });
    });

    network.onConnect().subscribe(() => {
      //aqui vuelvo a activar el menu cuando exista conexion internet
      this.menuCtrl.swipeGesture(true);
      // Si se detecta que hay internet vuelve a mostrarse la navegacion normal 
      this.userType ? this.navCtrl.navigateRoot('/home') : navCtrl.navigateRoot('/login-ils');
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#2b3643');
      }
      ngZone.run(() => { this.disconnect = false; });
    });

    this.funcSalirApp();
  }

  funcSalirApp() {
    this.backButtonApp = this.platform.backButton.subscribeWithPriority(666666, async () => {
      const alertExit = await this.alertCtrl.create({
        header: this.translate.instant('SALIR_APP.salir_app'),
        buttons: [
          {
            text: this.translate.instant('SALIR_APP.si'),
            handler: ((salir) => {
              navigator['app'].exitApp();
            })
          },
          {
            text: this.translate.instant('SALIR_APP.no'),
          }
        ]
      });

      alertExit.present();
    });
  }

  paramTranslate() {
    this.translate.addLangs(['eng', 'spa']);
    this.translate.setDefaultLang(this.langPredef);
    const browserLang = localStorage.getItem('lang_app') ? localStorage.getItem('lang_app') : this.langPredef;
    this.translate.use(browserLang.match(/eng|spa|por|fra|deu/) ? browserLang : this.langPredef);
  }

  initializeApp(color) {
    //this.backgroundMode.enable();
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.statusBar.styleLightContent();
      if (this.platform.is('ios') || this.platform.is('iphone') || this.platform.is('ipad')) {
        this.plataforma = 'IOS';
        localStorage.setItem('platfApp', 'IOS');
        //PARA COLOCAR COLOR DE BARRA DE ESTADO EN UN COLOR ESPECIFICO EN IOS overlaysWebView DEBE IR EN FALSO Y backgroundColorByHexString EN HEXADECIMAL DEL COLOR
        this.statusBar.styleLightContent();
        //this.statusBar.overlaysWebView(false);
        this.splashScreen.hide();
      }
      if (this.platform.is('android')) {
        this.plataforma = 'AND';
        localStorage.setItem('platfApp', 'AND');
        this.statusBar.backgroundColorByHexString(color ? color : '#2b3643');
        this.splashScreen.hide();
        if (!color) {
          this.statusBar.backgroundColorByHexString(this.color ? this.color : '#2b3643');
          this.splashScreen.hide();
        }
      }

      //comparar la version de la app si mostrar aviso para que se actualize a la version mas nueva
      this.appVersion.getVersionNumber()
        .then(value => {
          this.versionAppA = value;
          this.versionApp = this.reemplazarTodo(value, '.', '');
          localStorage.setItem('versionAppApi', value);
          localStorage.setItem('versionApp', this.versionApp);
        }).catch(err => {
          localStorage.setItem('versionAppApi', 'DEV');
        });

      this.upgradeNativo();
      this.versionCode = this.appVersion.getVersionCode() + '.' + this.appVersion.getVersionNumber();
      console.log(this.versionCode)
    }).catch(() => {
      localStorage.setItem('platfApp', 'DEV');
    });

  }

  openPage(page, title) {
    // aqui paso el nombre de la pagina al navegador de ionic desde el menu
    if (page == 'contacto') { //paso el parametro del titulo traducido
      this.navCtrl.navigateRoot([page + '/' + this.translate.instant('ROUTING.' + title)]);
    } else {
      this.navCtrl.navigateRoot([page]);
    }
    this.menuCtrl.close();
  }

  reemplazarTodo(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca, reemplaza);
    return text;
  }

  hoyFecha() {
    var hoy = new Date();
    let dd = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate();
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  loadlogo($event) {
    this.loadLogo = true;
    //console.log(this.loadLogo)
  }

  cargaDeImg(load, i) {
    this.spinnerImg[i] = true;
  }

  hiddenMenuToggleMostrar(cliente, indice) {
    for (let i = 0; i < this.menuHidden.length; i++) {
      this.menuHidden[i] = false;
    }
    if (this.menuHidden[indice] != true) {
      this.menuHidden[indice] = true;
    } else {
      this.menuHidden[indice] = false;
    }
  }

  hiddenMenuToggleocultar(cliente, indice) {
    if (this.menuHidden[indice] != true) {
      this.menuHidden[indice] = true;
    } else {
      this.menuHidden[indice] = false;
    }
  }

  paginaMaster(pagina: string, session: boolean) {
    if (session == true) {
      //console.log('se pasa parametro');
      this.navCtrl.navigateRoot('/' + pagina);
      //this.route.navigate(['/' + pagina]);
    } else {
      //console.log('no pasa parametro')
      this.navCtrl.navigateRoot('/' + pagina);
      //this.route.navigate(['/' + pagina]);
    }
    this.menuCtrl.close();
    this.initializeApp('#2b3643');
  }

  openCliente(cliente, pagina, session) {
    console.log(pagina, cliente, session);
    if (session == true) {
      //console.log('se pasa parametro');
      this.route.navigate(['../' + pagina]);
    } else {
      //console.log('no pasa parametro')
      this.route.navigate(['/' + pagina]);
    }
    this.menuCtrl.close();
    //console.log(cliente, pagina);
    localStorage.setItem('pref', cliente.prefix);
    localStorage.setItem('nomClient', cliente.client);
    localStorage.setItem('web', cliente.web);
    localStorage.setItem('logo', cliente.logo_agencia);
    let colores = JSON.parse(cliente.colors_platform);
    localStorage.setItem('COLOR_MENU_BACKEND', colores.COLOR_MENU_BACKEND);
    localStorage.setItem('color_email_font', colores.color_email_font);
    localStorage.setItem('color_font_tab', colores.color_font_tab);
    localStorage.setItem('color_font_tr', colores.color_font_tr);
    localStorage.setItem('color_login', colores.color_login);
    localStorage.setItem('color_menu', colores.color_menu);
    localStorage.setItem('color_menu_barra', colores.color_menu_barra);
    localStorage.setItem('color_menu_barra_hover', colores.color_menu_barra_hover);
    localStorage.setItem('color_tr_table', colores.color_tr_table);
    localStorage.setItem('email_shadow_table', colores.email_shadow_table);

    ////aqui envio evento del padre al hijo para poder renderizar el componente hijo completamente
    this.ilsAdminProvider.eventGeneral(pagina);
    this.route.navigateByUrl(pagina);

    this.menuCtrl.close();
    this.initializeApp(colores.COLOR_MENU_BACKEND);
  }

  scrollAMenu(time, elemento) {
    setTimeout(() => {
      let top = document.getElementById(elemento);
      if (top !== null) {
        top.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        top = null;
      }
    }, time ? time : 200);
  }

  upgradeNativo() {// Funcion que captura la version de la app nativa y,luego consulta a la api y si hay resultado mayor en la api se descargara la nueva app
    setTimeout(() => {
      this.appVersion.getVersionNumber().then((value) => {
        this.versionAppA = value;
        this.versionApp = this.reemplazarTodo(value, '.', '');
        localStorage.setItem('versionAppApi', value);
        localStorage.setItem('versionApp', this.versionApp);
        this.platform.ready().then(() => {
          if (this.platform.is('android')) {
            this.ilsAdminProvider.checkVersionAppA(localStorage.getItem('prefixApp'), localStorage.getItem('platfApp'))
              .subscribe((data) => {
                console.log(data);
                if (data[0].version) {
                  let versionBD = this.reemplazarTodo(data[0].version, '.', '');
                  if (parseInt(versionBD) > parseInt(this.versionApp)) {
                    this.alertaActualizacion(data[0].version, data[0].descripcion);
                  }
                }
              });
          }
        });
      }).catch((err) => {
        localStorage.setItem('versionAppApi', 'DEV');
      });
    }, 15000);
  }

  async alertaActualizacion(version, desc) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('COMPONENT.alert_header') + version,
      subHeader: this.translate.instant('COMPONENT.alert_subHeader'),
      message: '<b>' + this.translate.instant('COMPONENT.alert_message') + '</b><br> ' + desc,
      buttons: [
        {
          text: this.translate.instant('COMPONENT.alert_bOk'),
          handler: ((ok) => {
            const updateUrl = 'https://ilsadmin.com/app/app_agentes/versions/android/xml/' + localStorage.getItem('prefixApp') + '.xml';
            this.appUpdate.checkAppUpdate(updateUrl)
              .then((data) => {
                console.log('Version Nueva Instalando')
              });
          })
        },
        {
          text: this.translate.instant('COMPONENT.alert_bNot')
        }
      ]
    });
    await alert.present();
  }

}
