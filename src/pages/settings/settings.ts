import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { HomePage } from '../home/home'
import { WeatherProvider } from '../../providers/weather/weather';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  city:string;
  state:string;

  protected listCities: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private wheatherProvider:WeatherProvider,
    private storage:Storage) {
      
      this.storage.get('location').then((val) => {
        if(val != null){
          let location = JSON.parse(val);
          this.city = location.city;
          this.state = location.state;
        } else {
          this.city = 'Toronto';
          this.state = 'ON';
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  updateSettings(zmw?){
    console.log(event);
    this.wheatherProvider.getWeather(this.city, this.state, zmw)
    .subscribe(w => {
      if(w.response.results) {
        this.listCities = w.response.results
      } else {
        let location = {
          city:this.city,
          state:this.state,
          zmw:zmw
        }
        this.listCities = null;
        this.storage.set('location', JSON.stringify(location));
        this.navCtrl.push(HomePage);
      }
    });
  }
  
}
