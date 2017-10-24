import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Geoposition } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherProvider {
  apiKey = 'a82b8a48c590d7a0';
  url;                          //http://api.wunderground.com/api/a82b8a48c590d7a0/conditions/q/fl/miami.json
  loading;

  constructor(public http:Http,
              private geolocation: Geolocation,
              public loadingCtrl: LoadingController) {
      
    console.log('Hello WeatherProvider Provider');
    this.url = 'http://api.wunderground.com/api/' + this.apiKey + '/conditions/q';
  }

  getWeather(city, state, zmw, useGeoLocation) : Promise<any>{

    this.showLoading();

    return new Promise((resolve, reject) => {
      var param: string;
      if(useGeoLocation) {          
        this.getGeoLocation()
        .then( resp => {
          var latitude = resp.coords.latitude;
          var longitude = resp.coords.longitude;
          
          param = '/' + latitude + ',' + longitude;
          
          this.http.get(this.url + param + '.json')
          .subscribe(res => {
            this.dismissLoading();
            resolve(res.json());
          });
        });
      } else {
        if(zmw == null){
          this.getWeatherByCityState(city, state).then(
            res => {
              this.dismissLoading();
              resolve(res);
            }
          );
        } else {
          param = '/zmw:' + zmw;
          this.http.get(this.url + param + '.json')
          .subscribe(res => {
            this.dismissLoading();
            resolve(res.json());
          });
        }
      }
    });
  }

  getWeatherByCityState(city, state, attempt?) : Promise<any>{
    return new Promise((resolve, reject) => {
      var param: string;
      if(!attempt){
        attempt = 0
      }
      attempt++;
      if(attempt == 1){
        param = '/' + state + '/' + city;
      } else {
        param = '//' + city;
      }
      this.http.get(this.url + param + '.json')
      .subscribe(res => {
        if(!res.json().current_observation && !res.json().response.results && attempt == 1) {
          this.getWeatherByCityState(city, state, attempt).then(
            res => {
              resolve(res);
            }
          )
        } else {
          resolve(res.json());
        }
      });
    });
  }
  
  getGeoLocation() : Promise<Geoposition>{
    return this.geolocation.getCurrentPosition()
    .catch((error) => {
      return null;
    });
  }

  showLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Loading Please Wait...'
      });
      this.loading.present();
      setTimeout(() => {
        this.dismissLoading();
      }, 20000);
    }
  }

  dismissLoading(){
      if(this.loading){
        this.loading.dismiss();
        this.loading = null;
      }
  }
}
