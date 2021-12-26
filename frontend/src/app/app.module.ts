import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { DisableDirective } from './shared/directives/disable.directive';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';
import { IconModule } from './shared/icon.module';
import { HttpClientModule } from '@angular/common/http';
import { ControlsComponent } from './controls/controls.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './my-rx-stomp.config';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DisableDirective,
    NavBarComponent,
    DisableDirective,
    AboutComponent,
    ControlsComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatTabsModule,
        IconModule,
        HttpClientModule,
        MatSliderModule,
        FormsModule
    ],
  providers: [{
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig,
  },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
