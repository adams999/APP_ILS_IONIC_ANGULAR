import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IlsadminService } from '../providers/ilsadmin.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exporting_ from 'highcharts/modules/offline-exporting';
import HC_exporting_data from 'highcharts/modules/export-data';
import HC_break_data from 'highcharts/modules/broken-axis';
import HC_drilldowns from 'highcharts/modules/drilldown';
import ThemeDark from 'highcharts/themes/dark-unica';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { TranslateService } from '@ngx-translate/core';
Drilldown(Highcharts);
HC_exporting(Highcharts);
HC_exporting_(Highcharts);
HC_exporting_data(Highcharts);
HC_break_data(Highcharts);
HC_drilldowns(Highcharts);


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  @ViewChild('slider', { static: false }) slider;

  slidesOptions = {
    speed: 500
  };
  public COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
  public page = "0";
  public color = '#1B4F72';
  public clientes;
  public colores = {};
  public Aerror;
  public colorsPlatform;
  public logo;
  public cliente;
  public spinnerImg = [];
  public arrGraficas;
  public hGrafDay: Boolean = false;
  public hGrafVentGen: Boolean = false;
  public hGrafVentGenSales: boolean = false;
  public yearActual;
  public hoyFecha;
  public aaaa;/////año para buscar
  public mm;//////mes para buscar
  public btnBuscar: boolean = false;
  public buscador: boolean = false;
  public noResult: boolean = false;
  public hGrafVentVouchAct: boolean = false;
  public hGrafVentVouchActNet: boolean = false;
  public hGrafOrigen: boolean = false;
  public hGrafCantVent: boolean = false;
  public hGrafCantVentNet: boolean = false;
  public hGrafDistEdad: boolean = false;
  public hGrafYears: boolean = false;
  public resultBusq: boolean = false;
  public typeClient;
  public tab2Data: boolean = false;

  constructor(public ilsAdminProvider: IlsadminService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public router: Router,
    public appVersion: AppVersion,
    public translate: TranslateService) {
    let year = new Date();
    this.yearActual = year.getFullYear();
    this.hoyFecha = this.fechaHoyIso('');
    this.typeClient = localStorage.getItem('filtroTypeClient') ? localStorage.getItem('filtroTypeClient') : 'all';
  }

  fechaHoyIso(date) {
    var hoy;
    date ? hoy = new Date(date) : hoy = new Date();
    let dd = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate();
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaHoy = yyyy + '-' + mm + '-' + dd;
    return fechaHoy;
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }

  async moveButton() {
    let index = await this.slider.getActiveIndex();
    this.page = index.toString();
  }

  arribaRefresh(event) {
    this.noResult = false;
    setTimeout(() => {
      this.Aerror = null;
      console.log('Operacion Asincrona');
      event.target.complete(
        this.ngOnInit(),
        this.segmentChanged(this.buscador ? 1 : false, this.buscador ? true : false, (this.buscador && this.aaaa) ? this.aaaa : false)
        , console.log(this.aaaa)
      );
    }, 1500);
  }

  ngOnDestroy() {
    console.log('destuye el componente home');
  }

  funcTypeClient(typeClient) {
    this.tab2Data = false;
    localStorage.setItem('filtroTypeClient', typeClient);
    console.log(typeClient);
    this.ngOnInit();

    let aux: any;
    aux = {
      'detail': {
        'value': 1
      }
    }
    this.segmentChanged(1, this.buscador ? true : false, (this.buscador && this.aaaa) ? this.aaaa : false);

  }

  async ngOnInit() {
    if (localStorage.getItem('themeDark') == 'true') {//aqui aplico el thema dark si esta activo 
      console.log('Thema oscuro');
      ThemeDark(Highcharts);
    }
    console.log('home page');

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('HOME.cargando'),
      duration: 100000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getGrafGenAgen('', '', this.typeClient)
        .subscribe(
          (data) => {
            this.noResult = false;
            console.log(data);
            this.arrGraficas = data;
            let totVentasDia = 0;
            if (data[0][1] != null) {
              data[0][1].forEach(function (valor) {//suma para calcular el total
                valor.data.forEach(function (valor1) {
                  totVentasDia += valor1[1];
                });
              });
            }

            let title = this.translate.instant('HOME.rpt_ventas_diarias');
            let subTitle = this.translate.instant('HOME.total');
            let yAxis = this.translate.instant('HOME.ventas');
            let lang = this.translate.instant('HOME.volver');

            Highcharts.chart('columnDrillDown', {
              chart: {
                type: 'bar',
                height: "150%",
                events: {
                  drilldown: function (e) {
                    let totalDrillCol = 0;
                    for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                      const element = e.seriesOptions['data'][i][1];
                      totalDrillCol += element;
                    }
                    this.setTitle({ text: e.point.name }, { text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totalDrillCol) });
                  },
                  drillup: function (e) {
                    console.log(e);
                    this.setTitle({ text: title }, { text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totVentasDia) });
                  }
                }
              },
              lang: {
                drillUpText: lang
              },
              exporting: {
                buttons: {
                  contextButton: {
                    menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                  }
                }
              },
              title: {
                text: title
              },
              subtitle: {
                text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totVentasDia)
              },
              xAxis: {
                type: 'category',
                labels: {
                  style: {
                    //fontSize: '74%',
                    textOverflow: 'ellipsis'
                  }
                }
              },
              yAxis: {
                title: {
                  text: title,
                }
              },
              plotOptions: {
                series: {
                  borderWidth: 0,
                  dataLabels: {
                    enabled: true
                  }
                }
              },
              legend: {
                enabled: false,
                labelFormat: '<span style="font-size:11px">{xAxis.names[0]}</span><br>',
              },
              tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f} </b>Ventas<br/>'
              },
              series: [
                Object({
                  name: title,
                  colorByPoint: true,
                  style: {
                    "font-style": '20'
                  },
                  data: data[0][0],
                  legend: {
                    showInLegend: false
                  },
                })
              ],
              drilldown: {
                series: data[0][1]
              },
              credits:
              {
                enabled: false
              }
            });
            if (data[0][0] == null) {
              this.noResult = true;
            }

            //Grafico de ventas anuales
            let totVentAnualGen = 0;
            if (data[1][0] != null) {
              data[1][0].forEach(function (valor) {//suma para calcular el total
                valor.data.forEach(function (valor1) {
                  totVentAnualGen += valor1;
                });
              });
            }

            title = this.yearActual + ' ' + this.translate.instant('HOME.vouchers');
            subTitle = this.translate.instant('HOME.total');
            yAxis = this.translate.instant('HOME.activo_expirado');

            Highcharts.chart('cantVentAnual', {
              chart: {
                type: 'column',
                height: "170%"
              },
              exporting: {
                buttons: {
                  contextButton: {
                    menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                  }
                }
              },
              title: {
                text: title
              },
              subtitle: {
                text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totVentAnualGen)
              },
              xAxis: {
                categories: [
                  this.translate.instant('MESES.01'),
                  this.translate.instant('MESES.02'),
                  this.translate.instant('MESES.03'),
                  this.translate.instant('MESES.04'),
                  this.translate.instant('MESES.05'),
                  this.translate.instant('MESES.06'),
                  this.translate.instant('MESES.07'),
                  this.translate.instant('MESES.08'),
                  this.translate.instant('MESES.09'),
                  this.translate.instant('MESES.10'),
                  this.translate.instant('MESES.11'),
                  this.translate.instant('MESES.12')
                ],
                crosshair: true
              },
              yAxis: {
                min: 0,
                title: {
                  text: yAxis
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:100%;padding:0;line-height:normal;text-align:center"><b style="text-align:center">{point.key}</b></span><table>',
                pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="font-size:75%;color:{series.color};line-height: normal;margin:0%;padding:0%"><b>{series.name}</b>: </td>' +
                  '<td style="font-size:75%;line-height: normal;margin:0%;padding:0%"><b>{point.y:,.0f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },
              plotOptions: {
                column: {
                  pointPadding: 0.1,
                  borderWidth: 0
                }
              },
              series: data[1][0],
              credits: {
                enabled: false
              },
            });

            let totalNetoVentas = 0;
            if (data[2][0] != null) {
              data[2][0].forEach(function (valor) {//suma para calcular el total
                valor.data.forEach(function (valor1) {
                  totalNetoVentas += valor1;
                });
              });
            }

            title = this.yearActual + ' ' + this.translate.instant('HOME.neto');
            subTitle = this.translate.instant('HOME.total');
            yAxis = this.translate.instant('HOME.activo_expirado');

            Highcharts.chart('cantVentAnualSalesGen', {
              chart: {
                type: 'column',
                height: "170%"
              },
              exporting: {
                buttons: {
                  contextButton: {
                    menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                  }
                }
              },
              title: {
                text: title
              },
              subtitle: {
                text: subTitle + ' ' + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalNetoVentas)
              },
              xAxis: {
                categories: [
                  this.translate.instant('MESES.01'),
                  this.translate.instant('MESES.02'),
                  this.translate.instant('MESES.03'),
                  this.translate.instant('MESES.04'),
                  this.translate.instant('MESES.05'),
                  this.translate.instant('MESES.06'),
                  this.translate.instant('MESES.07'),
                  this.translate.instant('MESES.08'),
                  this.translate.instant('MESES.09'),
                  this.translate.instant('MESES.10'),
                  this.translate.instant('MESES.11'),
                  this.translate.instant('MESES.12')
                ],
                crosshair: true
              },
              yAxis: {
                min: 0,
                title: {
                  text: yAxis
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:100%;padding:0;line-height:normal;text-align:center"><b style="text-align:center">{point.key}</b></span><table>',
                pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="font-size:75%;color:{series.color};line-height: normal;margin:0%;padding:0%"><b>{series.name}</b>: </td>' +
                  '<td style="font-size:75%;line-height: normal;margin:0%;padding:0%"><b>{point.y:,.2f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },
              plotOptions: {
                column: {
                  pointPadding: 0.1,
                  borderWidth: 0
                }
              },
              series: data[2][0],
              credits: {
                enabled: false
              },
            })
            loader.dismiss();
          },
          (err) => {
            loader.dismiss();
          });

    });

    //Highcharts.setOptions();

  }

  cargaDeImg(load, i) {
    this.spinnerImg[i] = true;
  }

  hiddenGraficaDay(h: Boolean) {
    if (this.hGrafDay != true) {
      this.hGrafDay = h;
    } else {
      this.hGrafDay = false;
    }
  }

  hiddenGraficaVentGen(h: Boolean) {
    if (this.hGrafVentGen != true) {
      this.hGrafVentGen = h;
    } else {
      this.hGrafVentGen = false;
    }
  }

  hiddenGraficaVentGenSales(h: Boolean) {
    if (this.hGrafVentGenSales != true) {
      this.hGrafVentGenSales = true;
    } else {
      this.hGrafVentGenSales = false;
    }
  }


  ////////////pestaña 2 total/general

  async meses() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('HOME.selecciona'),
      inputs: [
        {
          name: this.translate.instant('HOME.todo_el_year'),
          type: 'radio',
          label: this.translate.instant('HOME.todo_el_year'),
          value: 'ALL',
          //checked: true
        },
        {
          name: this.translate.instant('MESES.01'),
          type: 'radio',
          label: this.translate.instant('MESES.01'),
          value: '01'
        },
        {
          name: this.translate.instant('MESES.02'),
          type: 'radio',
          label: this.translate.instant('MESES.02'),
          value: '02'
        },
        {
          name: this.translate.instant('MESES.03'),
          type: 'radio',
          label: this.translate.instant('MESES.03'),
          value: '03'
        },
        {
          name: this.translate.instant('MESES.04'),
          type: 'radio',
          label: this.translate.instant('MESES.04'),
          value: '04'
        },
        {
          name: this.translate.instant('MESES.05'),
          type: 'radio',
          label: this.translate.instant('MESES.05'),
          value: '05'
        },
        {
          name: this.translate.instant('MESES.06'),
          type: 'radio',
          label: this.translate.instant('MESES.06'),
          value: '06'
        },
        {
          name: this.translate.instant('MESES.07'),
          type: 'radio',
          label: this.translate.instant('MESES.07'),
          value: '07'
        },
        {
          name: this.translate.instant('MESES.08'),
          type: 'radio',
          label: this.translate.instant('MESES.08'),
          value: '08'
        },
        {
          name: this.translate.instant('MESES.09'),
          type: 'radio',
          label: this.translate.instant('MESES.09'),
          value: '09'
        },
        {
          name: this.translate.instant('MESES.10'),
          type: 'radio',
          label: this.translate.instant('MESES.10'),
          value: '10'
        },
        {
          name: this.translate.instant('MESES.11'),
          type: 'radio',
          label: this.translate.instant('MESES.11'),
          value: '11'
        },
        {
          name: this.translate.instant('MESES.12'),
          type: 'radio',
          label: this.translate.instant('MESES.12'),
          value: '12'
        },
      ],
      buttons: [
        {
          text: this.translate.instant('HOME.btn_cancelar'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translate.instant('HOME.siguiente'),
          handler: (data) => {
            if (!data) {
              return false
            }
            this.mm = data;
            console.log('Confirm Ok', data);
          }
        }
      ]
    });

    await alert.present();
  }

  buscar(ev: any, busqueda: boolean, aaaa) {
    this.btnBuscar = true;
    this.segmentChanged(ev, busqueda, aaaa);
  }

  async segmentChanged(ev: any, busqueda: boolean, aaaa) {
    console.log('TEST', ev, busqueda, this.tab2Data, this.resultBusq, aaaa);
    if (aaaa) {
      let aaExtr = new Date(aaaa);
      var aaaaBuscar = aaExtr.getFullYear();
    }

    if ((ev == 1 && this.tab2Data != false && this.resultBusq == false) || (busqueda == true) || (ev == 1 && this.resultBusq == true) || (ev.detail.value == 1 && this.resultBusq == false)) {
      console.log("cambio a 1");
      this.buscador = true;
      let loader = await this.loadingCtrl.create({
        message: this.translate.instant('HOME.cargando'),
        duration: 100000
      });

      loader.present().then(() => {//////////////////aqui consulta la data para las graficas de general/total de ils
        this.ilsAdminProvider.getGrafGenAgenGeneral((this.btnBuscar == true && this.aaaa) ? aaaaBuscar : this.yearActual, (this.btnBuscar == true && this.mm) ? this.mm : 'ALL', this.typeClient)
          .subscribe(
            (datas) => {
              console.log(datas);
              if (datas[5][0].length > 0) {
                this.resultBusq = true;////si hay data se mostrara el div donde contiene todas las graficas
                this.tab2Data = true;
                let title1 = this.translate.instant('HOME.status_ordenes');
                let subTitle = this.translate.instant('HOME.total');
                let yAxis;
                let lang = this.translate.instant('HOME.volver');

                //////grafico de vouchers activos
                let totalVouchAct = 0;
                Highcharts.chart('VouchAct', {
                  chart: {
                    type: 'pie',
                    //width: 383,
                    height: '130%',
                    events: {
                      load: function (event) {
                        var total: any;
                        total = this.series[0].data[0].total;
                        totalVouchAct = total;
                        this.setTitle({ text: title1 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                      },
                      drilldown: function (e) {
                        let totalDrill = 0;
                        for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                          const element = e.seriesOptions['data'][i][1];
                          totalDrill += element;
                        }
                        this.setTitle({ text: e.point.name }, { text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totalDrill) });
                      },
                      drillup: function (e) {
                        this.setTitle({ text: title1 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(totalVouchAct) + "</ b > " });
                      }
                    },
                  },
                  lang: {
                    drillUpText: lang
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true,
                        format: '<span style="font-size:80%">{point.name}: {point.y:,.0f} / {point.percentage:.1f}%</span>',
                        style: {
                          //textOverflow: "ellipsis"
                        }
                      }
                    },
                    pie: {
                      showInLegend: true
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span><b> ' + subTitle + ' {point.y:,.0f} / {point.percentage:.1f}%</b><br/>'
                  },
                  series: [
                    Object({
                      name: title1,
                      colorByPoint: true,
                      style: {
                        "font-style": '20'
                      },
                      data: datas[0][0],
                      legend: {
                        showInLegend: true
                      },
                    })
                  ],
                  drilldown: {
                    series: datas[0][1]
                  },
                  credits:
                  {
                    enabled: false
                  },
                  legend: {
                    accessibility: {
                      enabled: true
                    }
                  }
                });

                let title2 = this.translate.instant('HOME.ord_act_net_vent');
                let subTitle2 = this.translate.instant('HOME.total');
                lang = this.translate.instant('HOME.volver');

                //grafica vouchers activos de netos de ventas 
                let totalVouchActNet = 0;
                Highcharts.chart('VouchActNet', {
                  chart: {
                    type: 'pie',
                    //width: 383,
                    height: '130%',
                    events: {
                      load: function (event) {
                        let total: any;
                        total = this.series[0].data[0].total;
                        totalVouchActNet = total;
                        this.setTitle({ text: title2 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(total) + "</b>" }, true);
                      },
                      drilldown: function (e) {
                        let totalDrill = 0;
                        for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                          const element = e.seriesOptions['data'][i][1];
                          totalDrill += element;
                        }
                        this.setTitle({ text: e.point.name }, { text: subTitle2 + " " + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalDrill) });
                      },
                      drillup: function (e) {
                        this.setTitle({ text: title2 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalVouchActNet) + "</b>" });
                      }
                    },
                  },
                  lang: {
                    drillUpText: lang
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true,
                        format: '<span style="font-size:80%">{point.name}: {point.y:,.2f} / {point.percentage:.2f}%</span>',
                        style: {
                          //textOverflow: "ellipsis"
                        }
                      }
                    },
                    pie: {
                      showInLegend: true
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span><b> ' + subTitle + ' {point.y:,.2f} / {point.percentage:.2f}%</b><br/>'
                  },
                  series: [
                    Object({
                      name: title2,
                      colorByPoint: true,
                      style: {
                        "font-style": '20'
                      },
                      data: datas[1][0],
                      legend: {
                        showInLegend: true
                      },
                    })
                  ],
                  drilldown: {
                    series: datas[1][1]
                  },
                  credits:
                  {
                    enabled: false
                  },
                  legend: {
                    accessibility: {
                      enabled: true
                    }
                  }
                });

                let title3 = this.translate.instant('HOME.orig_viaje');
                subTitle = this.translate.instant('HOME.total');
                yAxis;
                lang = this.translate.instant('HOME.volver');

                //grafica origen del viaje 
                let totalOrigen;
                Highcharts.chart('origen', {
                  chart: {
                    type: 'pie',
                    //width: 383,
                    height: '120%',
                    events: {
                      load: function (event) {
                        let total: any;
                        total = this.series[0].data[0].total;
                        totalOrigen = total;
                        this.setTitle({ text: title3 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                      },
                      drilldown: function (e) {
                        let totalDrill = 0;
                        for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                          const element = e.seriesOptions['data'][i][1];
                          totalDrill += element;
                        }
                        this.setTitle({ text: e.point.name }, { text: subTitle + new Intl.NumberFormat("de-DE").format(totalDrill) });
                      },
                      drillup: function (e) {
                        this.setTitle({ text: title3 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(totalOrigen) + "</b>" });
                      }
                    },
                  },
                  lang: {
                    drillUpText: lang
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true,
                        format: '<span style="font-size:80%">{point.name}: {point.y:,.0f} / {point.percentage:.1f}%</span>',
                        style: {
                          //textOverflow: "ellipsis"
                        }
                      }
                    },
                    pie: {
                      showInLegend: true
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span><b> ' + subTitle + ' {point.y:,.0f} / {point.percentage:.1f}%</b><br/>'
                  },
                  series: [
                    Object({
                      name: title3,
                      colorByPoint: true,
                      style: {
                        "font-style": '20'
                      },
                      data: datas[2][0],
                      legend: {
                        showInLegend: true
                      },
                    })
                  ],
                  drilldown: {
                    series: datas[2][1]
                  },
                  credits:
                  {
                    enabled: false
                  },
                  legend: {
                    accessibility: {
                      enabled: true
                    }
                  }
                });

                let title4 = this.translate.instant('HOME.cant_ventas');
                subTitle = this.translate.instant('HOME.total');
                yAxis;
                lang = this.translate.instant('HOME.volver');

                /////////////grafica de cantidad de ventas por mes y por agencia
                let totVentCantVent = 0;
                if (datas[3][0] != null) {
                  datas[3][0].forEach(function (valor) {//suma para calcular el total
                    valor.data.forEach(function (valor1) {
                      totVentCantVent += valor1;
                    });
                  });
                }

                Highcharts.chart('cantVent', {
                  chart: {
                    type: 'column',
                    height: "150%"
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  title: {
                    text: title4 + " " + datas['YEAR']
                  },
                  subtitle: {
                    text: subTitle + ' ' + new Intl.NumberFormat("de-DE").format(totVentCantVent)
                  },
                  xAxis: {
                    categories: datas[3][1],
                    crosshair: true
                  },
                  yAxis: {
                    min: 0,
                    title: {
                      text: datas['YEAR']
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:100%;padding:0;line-height:normal;text-align:center"><b style="text-align:center">{point.key}</b></span><table>',
                    pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="font-size:75%;color:{series.color};line-height: normal;margin:0%;padding:0%"><b>{series.name}</b>: </td>' +
                      '<td style="font-size:75%;line-height: normal;margin:0%;padding:0%"><b>{point.y:,.0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                  },
                  plotOptions: {
                    column: {
                      pointPadding: 0.1,
                      borderWidth: 0
                    }
                  },
                  series: datas[3][0],
                  credits: {
                    enabled: false
                  },
                });

                let title5 = this.translate.instant('HOME.neto_ventas');
                subTitle = this.translate.instant('HOME.total');
                yAxis;
                lang = this.translate.instant('HOME.volver');

                /////////////grafica de cantidad de ventas NETAS por mes y por agencia
                let totVentCantVentNet = 0;
                if (datas[4][0] != null) {
                  datas[4][0].forEach(function (valor) {//suma para calcular el total
                    valor.data.forEach(function (valor1) {
                      totVentCantVentNet += valor1;
                    });
                  });
                }

                Highcharts.chart('cantVentNet', {
                  chart: {
                    type: 'column',
                    height: "150%"
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  title: {
                    text: title5 + ' ' + datas['YEAR']
                  },
                  subtitle: {
                    text: subTitle + ' ' + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totVentCantVentNet)
                  },
                  xAxis: {
                    categories: datas[4][1],
                    crosshair: true
                  },
                  yAxis: {
                    min: 0,
                    title: {
                      text: datas['YEAR']
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:100%;padding:0;line-height:normal;text-align:center"><b style="text-align:center">{point.key}</b></span><table>',
                    pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="font-size:75%;color:{series.color};line-height: normal;margin:0%;padding:0%"><b>{series.name}</b>: </td>' +
                      '<td style="font-size:75%;line-height: normal;margin:0%;padding:0%"><b>{point.y:,.2f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                  },
                  plotOptions: {
                    column: {
                      pointPadding: 0.1,
                      borderWidth: 0
                    }
                  },
                  series: datas[4][0],
                  credits: {
                    enabled: false
                  },
                });

                let title6 = this.translate.instant('HOME.distr_edad');
                subTitle = this.translate.instant('HOME.total');
                let rangEdad = this.translate.instant('HOME.rango_edad');
                lang = this.translate.instant('HOME.volver');
                let totalPasaj = this.translate.instant('HOME.total_pasaj');
                let numPasaj = this.translate.instant('HOME.numero_pasajeros');
                let tot = this.translate.instant('HOME.tot');

                ////////////grafica drildowm columna de edades
                let totEdadAgen = 0;
                if (datas[5][1] != null) {
                  datas[5][1].forEach(function (valor) {//suma para calcular el total
                    valor.data.forEach(function (valor1) {
                      totEdadAgen += valor1[1];
                    });
                  });
                }

                //Distribución por la edad
                Highcharts.chart('distEdad', {
                  chart: {
                    type: 'column',
                    height: '140%',
                    events: {
                      drilldown: function (e) {
                        // this.setTitle({ text: 'Rango de edad: ' + e.seriesOptions.id ? e.seriesOptions.id : e.point.name }, { text: '' });
                        this.setTitle({ text: rangEdad + ' ' + e.point.name }, { text: '' });
                      },
                      drillup: function (e) {
                        this.setTitle({ text: title6 }, { text: rangEdad + ' ' + new Intl.NumberFormat("de-DE").format(totEdadAgen) });
                      }
                    }
                  },
                  lang: {
                    drillUpText: lang,
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  title: {
                    text: title6
                  },
                  subtitle: {
                    text: totalPasaj + ' ' + new Intl.NumberFormat("de-DE").format(totEdadAgen)
                  },
                  xAxis: {
                    type: 'category',
                    labels: {
                      style: {
                        textOverflow: 'ellipsis'
                      }
                    }
                  },
                  yAxis: {
                    title: {
                      text: numPasaj
                    }
                  },
                  legend: {
                    enabled: true,
                    //labelFormat: '<span style="font-size:11px">{point.name}</span><br>',
                  },
                  plotOptions: {
                    series: {
                      borderWidth: 0,
                      label: {
                      },
                      dataLabels: {
                        enabled: true,
                      }
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> ' + tot + '<br/>'
                  },
                  series: datas[5][0],
                  drilldown: {
                    series: datas[5][1]
                  },
                  credits: {
                    enabled: false,
                  }
                });


                ////////////GRAFICA DE BARRAS POR AÑOS DE VENTAS
                Highcharts.wrap(Highcharts.Axis.prototype, 'getLinePath', function (proceed, lineWidth) {
                  var axis = this,
                    brokenAxis = axis.brokenAxis,
                    path = proceed.call(this, lineWidth),
                    start = path[0],
                    x = start[1],
                    y = start[2];

                  (brokenAxis.breakArray || []).forEach(function (brk) {
                    if (axis.horiz) {
                      x = axis.toPixels(brk.from);
                      path.splice(1, 0,
                        ['L', x - 4, y], // stop
                        ['M', x - 9, y + 5],
                        ['L', x + 1, y - 5], // left slanted line
                        ['M', x - 1, y + 5],
                        ['L', x + 9, y - 5], // higher slanted line
                        ['M', x + 4, y]
                      );
                    } else {
                      y = axis.toPixels(brk.from);
                      path.splice(1, 0,
                        ['L', x, y - 4], // stop
                        ['M', x + 5, y - 9],
                        ['L', x - 5, y + 1], // lower slanted line
                        ['M', x + 5, y - 1],
                        ['L', x - 5, y + 9], // higher slanted line
                        ['M', x, y + 4]
                      );
                    }
                  });
                  return path;
                });

                /**
                * Aqui hace la division en blanco para la grafica 
                */
                var pointBreakColumn = function (e) {
                  var point = e.point,
                    brk = e.brk,
                    shapeArgs = point.shapeArgs,
                    x = shapeArgs.x,
                    y = this.translate(brk.from, 0, 1, 0, 1),
                    w = shapeArgs.width,
                    key: any = ['brk', brk.from, brk.to],
                    path = ['M', x, y, 'L', x + w * 0.25, y + 4, 'L', x + w * 0.75, y - 4, 'L', x + w, y];

                  if (!point[key]) {
                    point[key] = this.chart.renderer.path(path)
                      .attr({
                        'stroke-width': 2,
                        stroke: point.series.options.borderColor
                      })
                      .add(point.graphic.parentGroup);
                  } else {
                    point[key].attr({
                      d: path
                    });
                  }
                }

                let totEdadesYears = 0;
                if (datas[6][0] != null) {
                  datas[6][0].forEach(function (valor) {//suma para calcular el total
                    valor.data.forEach(function (valor1) {
                      totEdadesYears += valor1;
                    });
                  });
                }

                let title7 = this.translate.instant('HOME.year_ant_act');
                subTitle = this.translate.instant('HOME.total');
                lang = this.translate.instant('HOME.volver');
                let totalVentas = this.translate.instant('HOME.total_ventas');

                Highcharts.chart('years', {
                  chart: {
                    type: 'bar',
                    height: '280%'
                  },
                  title: {
                    text: title7
                  },
                  subtitle: {
                    text: totalVentas + ' ' + new Intl.NumberFormat("de-DE").format(totEdadesYears)
                  },
                  exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                      }
                    }
                  },
                  xAxis: {
                    categories: datas[6][1],
                    crosshair: true,
                    tickInterval: 1,
                    accessibility: {
                      rangeDescription: "",
                      enabled: true
                    },
                    title: {
                      text: null,
                    },
                    labels: {
                      padding: -3,

                      style: {
                        fontSize: '75%',
                        lineWidth: 0,
                        padding: '0%',
                        height: 0,
                        pointPadding: 0,
                        groupPadding: 0,
                        textOverflow: 'ellipsis'
                      }
                    }
                  },
                  yAxis: {
                    lineColor: 'blue',
                    lineWidth: 2,
                    endOnTick: false,//para que el limite max no se redonde 
                    max: 90000,
                    tickInterval: 20000, // rango de lectura 
                    breaks: [{
                      from: 5000,//punto de corte inicio
                      to: 60000,//punto de corte final
                    }],
                    events: {
                      pointBreak: pointBreakColumn
                    },
                    labels: {
                      overflow: 'justify'
                    },
                    title: {
                      text: ''
                    }
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:12px;padding:0;line-height:normal; word-wrap: break-word;color:{point.color};">{point.key}</span><table>',
                    pointFormat: '<tr><td style="font-size:11px;color:{series.color};padding:0;line-height: normal;"><b>{series.name}</b>: </td>' +
                      '<td style="font-size:11px;padding:0;line-height: normal;"><b> {point.y:,.0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                  },
                  plotOptions: {
                    column: {
                      pointPadding: 0,
                      borderWidth: 0
                    }
                  },
                  legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -20,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    shadow: true
                  },
                  series: datas[6][0],
                  credits: {
                    enabled: false
                  },
                });
                loader.dismiss();
              } else {
                this.resultBusq = false;////si NO hay data se ocultara el div donde contiene todas las graficas
                this.tab2Data = false;
                loader.dismiss();
              }

              loader.dismiss();
            },
            (err) => {
              loader.dismiss();
            });
      });
    }
  }

  hiddenGraficaVouchAct(h: Boolean) {
    if (this.hGrafVentVouchAct != true) {
      this.hGrafVentVouchAct = true;
    } else {
      this.hGrafVentVouchAct = false;
    }
  }

  hiddenGraficaVouchActNet(h: Boolean) {
    if (this.hGrafVentVouchActNet != true) {
      this.hGrafVentVouchActNet = true;
    } else {
      this.hGrafVentVouchActNet = false;
    }
  }

  hiddenGraficaOrigen(h: Boolean) {
    if (this.hGrafOrigen != true) {
      this.hGrafOrigen = true;
    } else {
      this.hGrafOrigen = false;
    }
  }

  hiddenGraficaCantVent(h: Boolean) {
    if (this.hGrafCantVent != true) {
      this.hGrafCantVent = true;
    } else {
      this.hGrafCantVent = false;
    }
  }

  hiddenGraficaCantVentNet(h: Boolean) {
    if (this.hGrafCantVentNet != true) {
      this.hGrafCantVentNet = true;
    } else {
      this.hGrafCantVentNet = false;
    }
  }

  hiddenGraficaDistEdad(h: Boolean) {
    if (this.hGrafDistEdad != true) {
      this.hGrafDistEdad = true;
    } else {
      this.hGrafDistEdad = false;
    }
  }

  hiddenGraficaYears(h: Boolean) {
    if (this.hGrafYears != true) {
      this.hGrafYears = true;
    } else {
      this.hGrafYears = false;
    }
  }

  scrollAGrafica(time, elemento) {

    setTimeout(() => {
      let top = document.getElementById(elemento);
      if (top !== null) {
        top.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        top = null;
      }
    }, time ? time : 500);
  }

}
