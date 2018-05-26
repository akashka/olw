import { Component } from '@angular/core';
import { 
    NavController, 
    ModalController, 
    AlertController, 
    LoadingController,
    ActionSheetController, 
    ToastController, 
    Platform,
    App,
    MenuController
  } from 'ionic-angular';
import * as _ from 'lodash'
import { HomePage } from '../home/home';
import { Center } from '../../providers/center/center';

@Component({
  selector: 'center-page',
  templateUrl: './center.html',
})

export class CenterPage {

  // Variables to be saved in DB for Centers
  center_name: string;
  center_code: string;
  center_phoneno: string;
  center_email: string;
  center_address: string;
  active: Boolean = true;
  cash: Boolean = false;
  centers: any;
  btnText: string = "Save";
  myInput: string;
  center_id: string;
  mySelect: string;
  playgroup = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  nursery = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  lkg = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  ukg = {
    annual: 0,
    mid_term: 0,
    early_start: 0
  };
  public loader: any;

  constructor(
  			public navCtrl: NavController, 
  			public centerService: Center, 
  			public loading: LoadingController,
        public app: App,
        public menu: MenuController,
        public modalCtrl: ModalController, 
        public alertCtrl: AlertController, 
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        public platform: Platform
	) { }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
  	this.getCenters();
  }

  // Function to save new center
  save(){
    this.loader.present();
    let center = {
      center_name: this.center_name,
		  center_code: this.center_code,
		  center_phoneno: this.center_phoneno,
		  center_email: this.center_email,
		  center_address: this.center_address,
      active: this.active,
		  cash: this.cash,
      playgroup: this.playgroup,
      nursery: this.nursery,
      lkg: this.lkg,
      ukg: this.ukg
    };
    this.centerService.createCenter(center).then((result) => {
      this.reset();
      this.getCenters();
      this.loader.dismiss();
      this.presentToast('Center data saved successfully');
    }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
    });
  }

  // Function to update existing center
  update(){
    this.loader.present();
    let center = {
          center_name: this.center_name,
    		  center_code: this.center_code,
    		  center_phoneno: this.center_phoneno,
    		  center_email: this.center_email,
    		  center_address: this.center_address,
          active: this.active,
    		  cash: this.cash,
          playgroup: this.playgroup,
          nursery: this.nursery,
          lkg: this.lkg,
          ukg: this.ukg,
          _id: this.center_id
    };
    this.centerService.updateCenter(center).then((result) => {
      this.reset();
      this.getCenters();
      this.loader.dismiss();
      this.mySelect = null;
      this.presentToast('Center data saved successfully');
    }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
    });
  }

  reset() {
    this.center_name = "";
    this.center_code = "";
    this.center_phoneno = "";
    this.center_email = "";
    this.center_address = "";
    this.active = true;
    this.cash = false;
    this.btnText = "Save";
    this.myInput = "";
    this.center_id = "";
    this.playgroup = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.nursery = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.lkg = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
    this.ukg = {
      annual: 0,
      mid_term: 0,
      early_start: 0
    };
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Function to get list of all the centers
  getCenters() {
  	this.centers = [];
  	this.centerService.searchCenter().then((result) => {
  		this.centers = result;
  	}, (err) => {
    	console.log(err);
    });
  }

  // Function to make email small letters on change
  onEmailChange() {
    this.center_email = this.center_email.toLowerCase();
  }

  // Function to search for a center dynamically based on an input
  search() {
  	var result = [];
  	
    for(var i = 0; i < this.centers.length; i++) {
      if (this.centers[i].center_name.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.centers[i]); } 
      else if (this.centers[i].center_code.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.centers[i]); } 
      else if (_.includes(this.centers[i].center_phoneno, this.myInput)) { result.push(this.centers[i]); } 
      else if (this.centers[i].center_email.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.centers[i]); } 
    }

  	if(result && result.length === 1) {
  	  this.center_name = result[0].center_name;
  	  this.center_code = result[0].center_code;
  	  this.center_phoneno = result[0].center_phoneno;
  	  this.center_email = result[0].center_email;
  	  this.center_address = result[0].center_address;
      this.active = result[0].active;
  	  this.cash = result[0].cash;
      this.playgroup = result[0].playgroup;
      this.nursery = result[0].nursery;
      this.lkg = result[0].lkg;
      this.ukg = result[0].ukg;
      this.center_id = result[0]._id;
      this.btnText = "Update";
    }
    else {
      this.center_name = "";
      this.center_code = "";
      this.center_phoneno = "";
      this.center_email = "";
      this.center_address = "";
      this.active = true;
      this.cash = false;
      this.center_id = "";
      this.playgroup = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.nursery = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.lkg = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.ukg = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
    }
  }

  onSelectChange() {
    var result = [];
    for(var i = 0; i < this.centers.length; i++) {
      if (this.centers[i].center_name == this.mySelect) result.push(this.centers[i]) 
    }

    if(result && result.length === 1) {
      this.center_name = result[0].center_name;
      this.center_code = result[0].center_code;
      this.center_phoneno = result[0].center_phoneno;
      this.center_email = result[0].center_email;
      this.center_address = result[0].center_address;
      this.active = result[0].active;
      this.cash = result[0].cash;
      this.center_id = result[0]._id;
      this.playgroup = result[0].playgroup;
      this.nursery = result[0].nursery;
      this.lkg = result[0].lkg;
      this.ukg = result[0].ukg;
      this.btnText = "Update";
    }
    else {
      this.center_name = "";
      this.center_code = "";
      this.center_phoneno = "";
      this.center_email = "";
      this.center_address = "";
      this.active = true;
      this.cash = false;
      this.center_id = "";
      this.playgroup = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.nursery = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.lkg = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
      this.ukg = {
        annual: 0,
        mid_term: 0,
        early_start: 0
      };
    }
  }

  // Function to generate unique center code
  generateCode() {
    var fields = this.center_name.split(' ');
    var str = "";
    if(fields.length > 1) {
      var temp1 = fields[0];
      var temp2 = fields[1];
      if(temp1.length > 0) str += temp1[0];
      
      if(temp1.length > 1) {
        str += temp1[1];
        if(temp2.length > 0) {
          str += temp2[0];
        } else if(temp.length > 2) str += temp[2];
      } else if(temp2.length > 2) {
        str += temp2[0];
        str += temp2[1];
      }
    }
    else{
      var temp = fields[0];
      if(temp.length > 0) str += temp[0];
      if(temp.length > 1) str += temp[1];
      if(temp.length > 2) str += temp[2];
    }
    this.center_code = str.toUpperCase();
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

}
