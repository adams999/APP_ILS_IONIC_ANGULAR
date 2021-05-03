import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login-ils', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login/:pref', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'list-orders', loadChildren: './list-orders/list-orders.module#ListOrdersPageModule' },
  { path: 'popover-fecha', loadChildren: './popover-fecha/popover-fecha.module#PopoverFechaPageModule' },
  { path: 'detalleorden', loadChildren: './detalleorden/detalleorden.module#DetalleordenPageModule' },
  { path: 'beneficios-plan', loadChildren: './beneficios-plan/beneficios-plan.module#BeneficiosPlanPageModule' },
  { path: 'network-page', loadChildren: './network-page/network-page.module#NetworkPagePageModule' },
  { path: 'contacto/:titulo', loadChildren: './contacto/contacto.module#ContactoPageModule' },
  { path: 'cotizador', loadChildren: './cotizador/cotizador.module#CotizadorPageModule' },
  { path: 'graficas', loadChildren: './graficas/graficas.module#GraficasPageModule' },
  { path: 'login-ils', loadChildren: './login-ils/login-ils.module#LoginIlsPageModule' },
  { path: 'loading', loadChildren: './loading/loading.module#LoadingPageModule' },
  { path: 'session-ils', loadChildren: './session-ils/session-ils.module#SessionIlsPageModule' },
  { path: 'config', loadChildren: './config/config.module#ConfigPageModule' },
  { path: 'info-emision', loadChildren: './info-emision/info-emision.module#InfoEmisionPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor() {
  }

  validadorPag() {
    if (localStorage.getItem('userType')) {
      //console.log('logueado');
      return this.login();
    } else {
      //console.log('sin loguear');
      return this.noLogin();
    }
  }

  login() {
    return [
      { path: 'list-orders', title: 'vouchers', icon: 'card' },
      { path: 'cotizador', title: 'cotizador', icon: 'airplane' },
      { path: 'graficas', title: 'graficas', icon: 'stats-chart' },
      { path: 'contacto', title: 'plataforma', icon: 'finger-print' }
    ];
  }

  noLogin() {
    return [
      { path: 'login-ils', title: 'inicio', icon: 'home' },
      { path: 'contacto', title: 'informacion', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

}
