import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Geoposition } from '@ionic-native/geolocation';
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

  constructor(public http:Http,
    private geolocation: Geolocation) {
      
    console.log('Hello WeatherProvider Provider');
    this.url = 'http://api.wunderground.com/api/' + this.apiKey + '/conditions/q';
  }

  getWeather(city, state, zmw, useGeoLocation) : Promise<any>{
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var param: string;
        if(useGeoLocation) {          
          this.getGeoLocation()
          .then( resp => {
            var latitude = resp.coords.latitude;
            var longitude = resp.coords.longitude;

            param = '/' + latitude + ',' + longitude;

            this.http.get(this.url + param + '.json')
            .subscribe(res => {
              resolve(res.json());
            });
          });
        } else {
          if(zmw == null){
            param = '/' + state + '/' + city
          } else {
            param = '/zmw:' + zmw;
          }
          this.http.get(this.url + param + '.json')
          .subscribe(res => {
            resolve(res.json());
          });
        }
      }, 1000);
    });
  }
  
  getGeoLocation() : Promise<Geoposition>{
    return this.geolocation.getCurrentPosition()
    .catch((error) => {
      console.log('Error getting location', error);
      return null;
    });
  }
}
