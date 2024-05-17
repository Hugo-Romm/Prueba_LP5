import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() =>
    initializeApp({
      apiKey: "AIzaSyBqvRzkn0dL1rA9es4OLaCoIZCc7n73Rr8",
      authDomain: "fir-lp5-5afe7.firebaseapp.com",
      projectId: "fir-lp5-5afe7",
      storageBucket: "fir-lp5-5afe7.appspot.com",
      messagingSenderId: "26318044210",
      appId: "1:26318044210:web:8b53e98f6e553d936c102b"
    })),
  provideAuth(() => getAuth()),
  provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService,
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase()),
  provideFunctions(() => getFunctions()),
  provideMessaging(() => getMessaging()),
  providePerformance(() => getPerformance()),
  provideStorage(() => getStorage()),
  provideRemoteConfig(() => getRemoteConfig()),
  provideVertexAI(() => getVertexAI())],
  bootstrap: [AppComponent],
})
export class AppModule { }
