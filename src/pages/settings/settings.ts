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
  zmw:string;

  protected listCities: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private wheatherProvider:WeatherProvider,
    private storage:Storage) {
      this.resetForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  updateZMW(event){
    console.log(event);
    this.zmw = event;
  }

  updateSettings(){
    this.wheatherProvider.getWeather(this.city, this.state, this.zmw)
    .subscribe(w => {
      if(w.current_observation) {
        this.city = w.current_observation.display_location.city;
        this.state = w.current_observation.display_location.state;
        
        let location = {
          city:this.city,
          state:this.state,
          zmw:this.zmw
        }
        
        this.zmw = null;
        this.listCities = null;
        this.storage.set('location', JSON.stringify(location));
        this.navCtrl.push(HomePage);
      } else {
        this.listCities = w.response.results
      }
    });
  }
  
  onInput(){
    this.zmw = null;
  }

  resetForm(){
    this.zmw = null;
    this.listCities = null;
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
}
