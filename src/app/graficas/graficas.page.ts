import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exporting_ from 'highcharts/modules/offline-exporting';
import HC_exporting_data from 'highcharts/modules/export-data';
import HC_exporting_data__ from 'highcharts/modules/data';
import HC_drilldowns from 'highcharts/modules/drilldown';
import HC_lines from 'highcharts/modules/series-label';
import ThemeDark from 'highcharts/themes/dark-unica';
import { TranslateService } from '@ngx-translate/core';
Drilldown(Highcharts);
HC_exporting(Highcharts);
HC_exporting_(Highcharts);
HC_exporting_data(Highcharts);
HC_exporting_data__(Highcharts);
HC_drilldowns(Highcharts);
HC_lines(Highcharts);

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.page.html',
  styleUrls: ['./graficas.page.scss'],
})
export class GraficasPage implements OnInit, OnDestroy {

  public COLOR_MENU_BACKEND;
  public color_menu_barra_hover;
  public pref;
  public iniYear: String = new Date().toISOString();
  public fechaHoy: String = new Date().toISOString();
  public startDate;
  public endDate;
  public busqueda;
  public noResult;
  public hGrafCat: Boolean = false;
  public hGrafNet: Boolean = false;
  public hGrafOr: Boolean = false;
  public hGrafEdad: Boolean = false;
  public hGrafStatus: Boolean = false;
  public hGrafEdadStatus: Boolean = false;
  public hGrafRankCant: Boolean = false;
  public hGrafRankMone: Boolean = false;
  public hGrafEdaCant: Boolean = false;
  public hGrafEdaMont: Boolean = false;
  public hGrafTipoAnual: Boolean = false;
  public hGrafTipoFiltro: Boolean = false;
  public logo;
  public subscription;

  constructor(public ilsAdminProvider: IlsadminService,
    public loadingCtrl: LoadingController,
    public zone: NgZone,
    //public events: Events,
    public translate: TranslateService) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.logo = localStorage.getItem('logo');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.pref = localStorage.getItem('pref');
    this.fechaHoy = this.fechaHoyIso('');
    this.iniYear = this.inicioYear('');

    this.subscription = this.ilsAdminProvider.currentData.subscribe((data) => {
      console.log('data pasada', data);
      if (data == 'graficas') {
        this.zone.run(() => {
          this.startDate = null;
          this.endDate = null;
          this.busqueda = null;
          this.noResult = null;
          this.hGrafCat = false;
          this.hGrafNet = false;
          this.hGrafOr = false;
          this.hGrafEdad = false;
          this.hGrafStatus = false;
          this.hGrafEdadStatus = false;
          this.hGrafRankCant = false;
          this.hGrafRankMone = false;
          this.hGrafEdaCant = false;
          this.hGrafEdaMont = false;
          this.hGrafTipoAnual = false;
          this.hGrafTipoFiltro = false;
          this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
          this.logo = localStorage.getItem('logo');
          this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
          this.pref = localStorage.getItem('pref');
          this.fechaHoy = this.fechaHoyIso('');
          this.iniYear = this.inicioYear('');
          this.ngOnInit();
        })
      }
    });
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

  inicioYear(date) {
    var hoy;
    date ? hoy = new Date(date) : hoy = new Date();
    let yyyy = hoy.getFullYear();
    let fechaHoy = yyyy + '-01-01';
    return fechaHoy;
  }

  changeFecha() {
    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.endDate = null;
    }
  }

  buscar(texto) {
    this.ngOnInit();
    this.busqueda = true;
  }

  arribaRefresh(event) {
    setTimeout(() => {
      event.target.complete(this.ngOnInit());
    }, 1500);
  }

  hiddenGraficaCat(h: Boolean) {
    if (this.hGrafCat != true) {
      this.hGrafCat = h;
    } else {
      this.hGrafCat = false;
    }
  }

  hiddenGraficaNet(h: Boolean) {
    if (this.hGrafNet != true) {
      this.hGrafNet = h;
    } else {
      this.hGrafNet = false;
    }
  }

  hiddenGraficaOr(h: Boolean) {
    if (this.hGrafOr != true) {
      this.hGrafOr = h;
    } else {
      this.hGrafOr = false;
    }
  }

  hiddenGraficaEdad(h: Boolean) {
    if (this.hGrafEdad != true) {
      this.hGrafEdad = h;
    } else {
      this.hGrafEdad = false;
    }
  }

  hiddenGraficaStatus(h: Boolean) {
    if (this.hGrafStatus != true) {
      this.hGrafStatus = h;
    } else {
      this.hGrafStatus = false;
    }
  }

  hiddenGraficaRankCant(h: Boolean) {
    if (this.hGrafRankCant != true) {
      this.hGrafRankCant = h;
    } else {
      this.hGrafRankCant = false;
    }
  }

  hiddenGraficaEdadStatus(h: Boolean) {
    if (this.hGrafEdadStatus != true) {
      this.hGrafEdadStatus = h;
    } else {
      this.hGrafEdadStatus = false;
    }
  }

  hiddenGraficaRankMone(h: Boolean) {
    if (this.hGrafRankMone != true) {
      this.hGrafRankMone = h;
    } else {
      this.hGrafRankMone = false;
    }
  }

  hiddenGraficaEdadCant(h: Boolean) {
    if (this.hGrafEdaCant != true) {
      this.hGrafEdaCant = h;
    } else {
      this.hGrafEdaCant = false;
    }
  }

  hiddenGraficaEdadMont(h: Boolean) {
    if (this.hGrafEdaMont != true) {
      this.hGrafEdaMont = h;
    } else {
      this.hGrafEdaMont = false;
    }
  }

  hiddenGraficaTipoFiltro(h: Boolean) {
    if (this.hGrafTipoFiltro != true) {
      this.hGrafTipoFiltro = h;
    } else {
      this.hGrafTipoFiltro = false;
    }
  }

  hiddenGraficaTipoAnual(h: Boolean) {
    if (this.hGrafTipoAnual != true) {
      this.hGrafTipoAnual = h;
    } else {
      this.hGrafTipoAnual = false;
    }
  }

  ngOnDestroy() {
    console.log('destruyo graficas');
    this.subscription.unsubscribe('graficas');
  }

  async ngOnInit() {

    if (localStorage.getItem('themeDark') == 'true') {//aqui aplico el thema dark si esta activo 
      console.log('Thema oscuro');
      ThemeDark(Highcharts);
    }

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('GRAFICAS.cargando'),
      duration: 100000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getChartVouchersStatus(this.pref, this.startDate ? this.startDate.substring(10, -1) : this.inicioYear(''), this.endDate ? this.endDate.substring(10, -1) : this.fechaHoy)
        .subscribe(
          (data) => {
            this.noResult = null;
            console.log(data);

            if (data[0][0] != undefined && data[0][0].length > 0) {

              let title1 = this.translate.instant('GRAFICAS.categ_plan');
              let subTitle = this.translate.instant('GRAFICAS.total');
              let yAxis;
              let lang = this.translate.instant('GRAFICAS.volver');
              let totalVouch = 0;

              //grafica 1 categorias de vouchers
              Highcharts.chart('grafica1', {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  height: '130%',
                  events: {
                    load: function (event) {
                      var total: any;
                      total = this.series[0].data[0].total;
                      totalVouch = total;
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
                      this.setTitle({ text: title1 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(totalVouch) + "</ b > " });
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
                    data: data[0][0],
                    legend: {
                      showInLegend: true
                    },
                  })
                ],
                drilldown: {
                  series: data[0][1]
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

              let title2 = this.translate.instant('GRAFICAS.netos');
              let totalVouchNet = 0;
              //grafica 2 netos de vouchers
              Highcharts.chart('grafica2', {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  height: '130%',
                  events: {
                    load: function (event) {
                      var total: any;
                      total = this.series[0].data[0].total;
                      totalVouchNet = total;
                      this.setTitle({ text: title2 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(total) + "</b>" }, true);
                    },
                    drilldown: function (e) {
                      let totalDrill = 0;
                      for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                        const element = e.seriesOptions['data'][i][1];
                        totalDrill += element;
                      }
                      this.setTitle({ text: e.point.name }, { text: subTitle + ' ' + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalDrill) });
                    },
                    drillup: function (e) {
                      this.setTitle({ text: title2 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalVouchNet) + "</ b > " });
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
                    name: title2,
                    colorByPoint: true,
                    style: {
                      "font-style": '20'
                    },
                    data: data[1][0],
                    legend: {
                      showInLegend: true
                    },
                  })
                ],
                drilldown: {
                  series: data[1][1]
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

              let title3 = this.translate.instant('GRAFICAS.orig_viaje');
              let totalOrig = 0;
              //grafica 3 paises de vouchers
              Highcharts.chart('grafica3', {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  height: '130%',
                  events: {
                    load: function (event) {
                      var total: any;
                      total = this.series[0].data[0].total;
                      totalOrig = total;
                      this.setTitle({ text: title3 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
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
                      this.setTitle({ text: title3 }, { text: "<b>" + subTitle + " " + new Intl.NumberFormat("de-DE").format(totalVouch) + "</ b > " });
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
                    data: data[2][0],
                    legend: {
                      showInLegend: true
                    },
                  })
                ],
                drilldown: {
                  series: data[2][1]
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


              //////GRAFICA BASICA DE STATUS DE LAS ORDENES
              let title4 = this.translate.instant('HOME.status_ordenes');

              Highcharts.chart('grafica4', {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  events: {
                    load: function (event) {
                      var total = this.series[0].data[0].total;
                      this.setTitle({ text: title4 }, { text: "<b>" + subTitle + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                    },
                  },
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                    }
                  }
                },
                tooltip: {
                  headerFormat: '<b>{point.name}</b><br/>',
                  pointFormat: '<b>{point.name}<br>' + subTitle + '</b> {point.y:,.0f} / {point.percentage:.1f}%'
                },
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<p>{point.name}</p>: {point.y:,.0f} / {point.percentage:.1f}%',
                      style: {
                        color: 'black'
                      },
                    },
                    showInLegend: true
                  }
                },
                series: [Object({
                  colorByPoint: true,
                  data: data[3],
                })],
                credits: {
                  enabled: false,
                },
              });


              ////GRAFICA DE EDADES POR STATUS
              let title5 = this.translate.instant('GRAFICAS.dist_edad_status');
              let rangEdad = this.translate.instant('HOME.rango_edad');
              let totalPasaj = this.translate.instant('HOME.total_pasaj');
              let numPasaj = this.translate.instant('HOME.numero_pasajeros');
              let tot = this.translate.instant('HOME.tot');
              let totEdadAgen = 0;
              if (data[4][1] != null) {
                data[4][1].forEach(function (valor) {//suma para calcular el total
                  valor.data.forEach(function (valor1) {
                    totEdadAgen += valor1[1];
                  });
                });
              }

              Highcharts.chart('grafica5', {
                chart: {
                  type: 'column',
                  height: '140%',
                  events: {
                    drilldown: function (e) {
                      // this.setTitle({ text: 'Rango de edad: ' + e.seriesOptions.id ? e.seriesOptions.id : e.point.name }, { text: '' });
                      this.setTitle({ text: title5 }, { text: e.point.name });
                    },
                    drillup: function (e) {
                      this.setTitle({ text: title5 }, { text: totalPasaj + ' ' + new Intl.NumberFormat("de-DE").format(totEdadAgen) });
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
                  text: title5
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
                series: data[4][0],
                drilldown: {
                  series: data[4][1]
                },
                credits: {
                  enabled: false,
                }
              });




              /////GRAFICAS DE RANK DE AGENCIAS CANTIDAD DESDE LA PLATFAORMA 
              if (data[5][0].arrDataCnt) {
                //grafica de plataforma ranking agencias
                let totVentasDia = 0;
                (data[5][0].arrDataCnt) ? data[5][0].arrDataCnt.forEach(function (valor) {//suma para calcular el total
                  (valor.data != null) ? valor.data.forEach(function (valor1) {
                    totVentasDia += valor1[1];
                  }) : '';
                }) : '';

                let title6 = this.translate.instant('GRAFICAS.rank_agen_cant');
                let cantidad = this.translate.instant('GRAFICAS.cantidad');

                Highcharts.chart('grafica6', {
                  chart: {
                    type: 'bar',
                    height: "170%",
                    events: {
                      drilldown: function (e) {
                        let totalDrillCol = 0;
                        for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                          const element = e.seriesOptions['data'][i][1];
                          totalDrillCol += element;
                        }
                        this.setTitle({ text: e.point.name }, { text: subTitle + new Intl.NumberFormat("de-DE").format(totalDrillCol) });
                      },
                      drillup: function (e) {
                        console.log(e);
                        this.setTitle({ text: title6 }, { text: '<b>' + subTitle + new Intl.NumberFormat("de-DE").format(totVentasDia) + '</b>' });
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
                    text: title6
                  },
                  subtitle: {
                    text: '<b>' + subTitle + new Intl.NumberFormat("de-DE").format(totVentasDia) + '</b>'
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
                      text: cantidad,
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
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f} </b><br/>'
                  },
                  series: [
                    Object({
                      name: cantidad,
                      colorByPoint: true,
                      style: {
                        "font-style": '20'
                      },
                      data: data[5][0].seriesCnt,
                      legend: {
                        showInLegend: false
                      },
                    })
                  ],
                  drilldown: {
                    series: data[5][0].arrDataCnt
                  },
                  credits:
                  {
                    enabled: false
                  }
                });


                ////////////////////grafica de agencias moneda (desde la plataforma)
                let totVentasDia2 = 0;
                (data[5][0].arrDataAmn) ? data[5][0].arrDataAmn.forEach(function (valor) {//suma para calcular el total
                  (valor.data != null) ? valor.data.forEach(function (valor1) {
                    totVentasDia2 += valor1[1];
                  }) : '';
                }) : '';

                let title7 = this.translate.instant('GRAFICAS.rank_agen_mon');
                let monto = this.translate.instant('GRAFICAS.monto');
                let moneda = this.translate.instant('GRAFICAS.moneda');

                Highcharts.chart('grafica7', {
                  chart: {
                    type: 'bar',
                    height: "170%",
                    events: {
                      drilldown: function (e) {
                        let totalDrillCol2 = 0;
                        for (let i = 0; i < e.seriesOptions['data'].length; i++) {
                          const element = e.seriesOptions['data'][i][1];
                          totalDrillCol2 += element;
                        }
                        this.setTitle({ text: e.point.name }, { text: subTitle + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totalDrillCol2) });
                      },
                      drillup: function (e) {
                        console.log(e);
                        this.setTitle({ text: title7 }, { text: '<b>' + subTitle + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totVentasDia2) + '</b>' });
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
                    text: title7
                  },
                  subtitle: {
                    text: '<b>' + subTitle + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(totVentasDia2) + '</b>'
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
                      text: monto,
                    }
                  },
                  plotOptions: {
                    series: {
                      borderWidth: 0,
                      dataLabels: {
                        enabled: true,
                        format: '{point.y:,.2f} $'
                      }
                    }
                  },
                  legend: {
                    enabled: false,
                    labelFormat: '<span style="font-size:11px">{xAxis.names[0]}$</span><br>',
                  },
                  tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f} $ </b><br/>'
                  },
                  series: [
                    Object({
                      name: moneda,
                      colorByPoint: true,
                      style: {
                        "font-style": '20'
                      },
                      data: data[5][0].seriesAmn,
                      legend: {
                        showInLegend: false
                      },
                    })
                  ],
                  drilldown: {
                    series: data[5][0].arrDataAmn
                  },
                  credits:
                  {
                    enabled: false
                  }
                });
              }


              ////////grafica de edades cantidad vouchers activos 
              let title8 = this.translate.instant('GRAFICAS.dist_edad_cant');
              let num_pasaj = this.translate.instant('GRAFICAS.num_pasaj')

              Highcharts.chart('grafica8', {
                chart: {
                  type: 'column',
                  events: {
                    load: function (event) {
                      let total: number = 0;
                      for (let i = 0; i < this.series.length; i++) {
                        for (let a = 0; a < this.series[i]['yData'].length; a++) {
                          total += this.series[i]['yData'][a];
                        }
                      }
                      this.setTitle({}, { text: "<b>" + num_pasaj + ': ' + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                    },
                  },
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                    }
                  }
                },
                title: {
                  text: title8
                },
                xAxis: {
                  categories: [
                    'S-E',
                    '0-10',
                    '11-20',
                    '21-30',
                    '31-40',
                    '41-50',
                    '51-60',
                    '61-70',
                    '71-75',
                    '76-84',
                    '85+'
                  ],
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: num_pasaj
                  }
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0;"><b>{point.y:,.f}</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                  }
                },
                series: data[6],
                credits: {
                  enabled: false,
                },
              });

              let title9 = this.translate.instant('GRAFICAS.dist_edad_mon');
              let venta_pasaj = this.translate.instant('GRAFICAS.venta_pasaj');

              /////grafica edades / ventas monto 
              Highcharts.chart('grafica9', {
                chart: {
                  type: 'column',
                  events: {
                    load: function (event) {
                      let total: number = 0;
                      for (let i = 0; i < this.series.length; i++) {
                        for (let a = 0; a < this.series[i]['yData'].length; a++) {
                          total += this.series[i]['yData'][a];
                        }
                      }
                      this.setTitle({}, { text: "<b>" + venta_pasaj + ': ' + new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(total) + "</b>" }, true);
                    },
                  },
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                    }
                  }
                },
                title: {
                  text: title9
                },
                xAxis: {
                  categories: [
                    'S-E',
                    '0-10',
                    '11-20',
                    '21-30',
                    '31-40',
                    '41-50',
                    '51-60',
                    '61-70',
                    '71-75',
                    '76-84',
                    '85+'
                  ],
                  crosshair: true
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: venta_pasaj
                  }
                },
                tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr style="border-bottom: 0.5px dotted grey;"><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0;"><b>{point.y:,.f}$</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                  }
                },
                series: data[7],
                credits: {
                  enabled: false,
                },
              });

              let titulo10 = this.translate.instant('GRAFICAS.tipo_ventas');

              ////GRAFICA DE TIPO DE EMISION POR MES 
              Highcharts.chart('grafica10', {
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie',
                  events: {
                    load: function (event) {
                      var total = this.series[0].data[0].total;
                      this.setTitle({ text: titulo10 }, { text: "<b>" + subTitle + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                    },
                  },
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                    }
                  }
                },
                tooltip: {
                  headerFormat: '<b>{point.name}</b><br/>',
                  pointFormat: '<b>{point.name}<br>' + subTitle + '</b> {point.y:,.0f} / {point.percentage:.1f}%'
                },
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      format: '<p>{point.name}</p>: {point.y:,.0f} / {point.percentage:.1f}%',
                      style: {
                        color: 'black'
                      },
                    },
                    showInLegend: true
                  }
                },
                series: [Object({
                  colorByPoint: true,
                  data: data[8],
                })],
                credits: {
                  enabled: false,
                },
              });

              let title11 = this.translate.instant('GRAFICAS.tipo_vent_anual')
              let ventas = this.translate.instant('GRAFICAS.ventas');

              //grafica de tipo de emision desde la plataforma
              Highcharts.chart('grafica11', {
                chart: {
                  height: "120%",
                  events: {
                    load: function (event) {
                      let total: number = 0;
                      for (let i = 0; i < this.series.length; i++) {
                        for (let a = 0; a < this.series[i]['yData'].length; a++) {
                          total += this.series[i]['yData'][a];
                        }
                      }
                      this.setTitle({}, { text: "<b>" + subTitle + new Intl.NumberFormat("de-DE").format(total) + "</b>" }, true);
                    },
                  },
                },
                title: {
                  text: title11
                },
                exporting: {
                  buttons: {
                    contextButton: {
                      menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(item => item == 'openInCloud')
                    }
                  }
                },
                yAxis: {
                  title: {
                    text: ventas
                  }
                },
                xAxis: {
                  labels: {
                    style: {
                      fontSize: '90%'
                    }
                  },
                  categories: [
                    this.translate.instant("MESES.01"),
                    this.translate.instant("MESES.02"),
                    this.translate.instant("MESES.03"),
                    this.translate.instant("MESES.04"),
                    this.translate.instant("MESES.05"),
                    this.translate.instant("MESES.06"),
                    this.translate.instant("MESES.07"),
                    this.translate.instant("MESES.08"),
                    this.translate.instant("MESES.09"),
                    this.translate.instant("MESES.10"),
                    this.translate.instant("MESES.11"),
                    this.translate.instant("MESES.12")
                  ],
                },
                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
                },
                series: data[9],
                responsive: {
                  rules: [{
                    condition: {
                      maxWidth: 1000
                    },
                    chartOptions: {
                      legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                      }
                    }
                  }]
                },
                credits: {
                  enabled: false,
                },
              });

            } else {
              this.noResult = true;
              console.log(this.noResult);
            }

            loader.dismiss();
          },
          (err) => {
            loader.dismiss();
          }
        )
    });
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
    }, time ? time : 200);
  }
}
