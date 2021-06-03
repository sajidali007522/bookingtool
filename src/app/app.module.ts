import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
//import {AuthenticationModule} from "./authentication/authentication.module";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HeaderComponent } from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {ConfigService} from "./config.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "./_helpers/jwt.interceptor";
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import {fakeBackendProvider} from "./_helpers/fake-backend";
import {HomeComponent} from "./components/home/home.component";
import {SideNavComponent} from "./shared/side-nav/side-nav.component";
import {MainComponent} from "./components/main/main.component";
import {ListViewComponent} from "./shared/side-nav/list-view/list-view.component";
import {SingleColumnLayoutComponent} from "./layouts/single-column-layout/single-column-layout.component";
import {SharedModuleModule} from "./shared-module/shared-module.module";
import {AuthenticationModule} from "./authentication/authentication.module";
import {HouseKeepingModule} from "./house-keeping/house-keeping.module";
import {ReservationModule} from "./reservation/reservation.module";
import {HomeLayoutComponent} from "./components/home-layout/home-layout.component";
import {LoginLayoutComponent} from "./layouts/login/login-layout.component";
import {DateParser} from "./_helpers/dateParser";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { CallbackComponent } from './callback/callback.component';
import { ServerLoginTestComponent } from './server-login-test/server-login-test.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    ListViewComponent,
    SingleColumnLayoutComponent,
    LoginLayoutComponent,
    MainComponent,
    HomeComponent,
    HomeLayoutComponent,
    CallbackComponent,
    ServerLoginTestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationModule,
    SharedModuleModule,
    HammerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: true,
      maxOpened:1
    }),
//    AuthenticationModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (appConfigService: ConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      },
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
    //{ provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider,
    DateParser,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
