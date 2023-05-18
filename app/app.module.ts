import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormComponent } from './form/form.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {RouterModule} from "@angular/router";
import { FormsModule, NgForm } from '@angular/forms';



const myroot=[
  {path: 'Dashboard', component:DashboardComponent},
  {path: 'AddSensor', component: FormComponent} ,
  {path: 'AboutUs', component:AboutUsComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FormComponent,
    AboutUsComponent,
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(myroot),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
