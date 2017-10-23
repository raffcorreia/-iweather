import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { HomePage } from '../home/home'
import { WeatherProvider } from '../../providers/weather/weather';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
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
  useGeoLocation:boolean;

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
    this.zmw = event;
  }

  updateSettings(){
    this.wheatherProvider.getWeather(this.city, this.state, this.zmw, this.useGeoLocation)
    .then(w => { 
      if(w.current_observation) {
        this.city = w.current_observation.display_location.city;
        this.state = w.current_observation.display_location.state;
        
        let location = {
          city:this.city,
          state:this.state,
          zmw:this.zmw,
          useGeoLocation:this.useGeoLocation
        }
        this.clearList();
        this.storage.set('location', JSON.stringify(location));
        this.navCtrl.setRoot(HomePage, w);
      } else {
        this.listCities = w.response.results.sort((a, b) =>{
          if (a.country_name < b.country_name) {
            return -1;
          } else if (a.country_name > b.country_name) {
            return 1;
          } else {
            if (a.state < b.state) {
              return -1;
            } else if (a.state > b.state) {
              return 1;
            } else {
              return 0;
            }  
          }
        });
      }
    });
  }
  
  clearList(){
    this.zmw = null;
    this.listCities = null;
  }

  resetForm(){
    this.clearList();
    this.storage.get('location').then((val) => {
      if(val != null){
        let location = JSON.parse(val);
        this.city = location.city;
        this.state = location.state;
        this.useGeoLocation = location.useGeoLocation;
      } else {
        this.city = 'Toronto';
        this.state = 'ON';
        this.useGeoLocation=false;
      }
    });
  }
}
