import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherProvider } from '../../providers/weather/weather';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weather:any;
  location:{
    city:string,
    state:string,
    zmw:string,
    useGeoLocation:boolean
  }

  constructor(public navCtrl: NavController, 
    private wheatherProvider:WeatherProvider,
    private storage:Storage) {

  }

  ionViewWillEnter(){
    this.storage.get('location').then((val) => {
      if(val != null){
        this.location = JSON.parse(val);
      } else {
        this.location = {
          city: 'Miami',
          state: 'FL',
          zmw: null,
          useGeoLocation: false
        }
      }
      
      this.wheatherProvider.getWeather(this.location.city, this.location.state, this.location.zmw, this.location.useGeoLocation)
      .then(weather => {
        //console.log(weather);
        this.weather = weather.current_observation;
      });

    });
  }
}
