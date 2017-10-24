import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherProvider } from '../../providers/weather/weather';
import { Storage } from '@ionic/storage';
import { NavParams } from 'ionic-angular';

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
              public navParams: NavParams,
              private wheatherProvider:WeatherProvider,
              private storage:Storage) {

    var wetherParam = navParams.get('current_observation');
    if(wetherParam){
      this.weather = wetherParam;
    }
  }

  ionViewWillEnter(){
    this.storage.get('location').then((val) => {
      if(val != null){
        this.location = JSON.parse(val);
      }
      if (!this.weather){
        this.refreshWeather();
      }
    });
  }
  
  refreshWeather(refresher?){
    if(this.location){
      this.wheatherProvider.getWeather(this.location.city, this.location.state, this.location.zmw, this.location.useGeoLocation)
      .then(weather => {
        this.weather = weather.current_observation;
      });
    }
    if(refresher){
      refresher.complete();
    }
  }
}
