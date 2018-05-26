import { Component } from '@angular/core';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Students } from '../../providers/students/students';
 import { 
      NavController, 
      NavParams, 
      LoadingController,
      App,
      MenuController,
      ToastController
  } from 'ionic-angular';
import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

@Component({
  selector: 'signup',
  templateUrl: './signup.html'
})
export class SignupPage {
 
  role: string;
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  center: string;
  active: Boolean = true;
  isPasswordMatching: Boolean = true;
  isExisting: Boolean = false;
  centers;
  users;
  _id;
  myInput;
  mySelect;
  btnText: String = "Save";
  existingUser: Boolean = false;
  public loader: any;
  public isUserDeletable: Boolean = false;

  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public centerService: Center, 
        public studentService: Students, 
        public authService: Auth, 
        public loading: LoadingController,
        public app: App,
        public menu: MenuController,
        public storage: Storage,
        public toastCtrl: ToastController,
  ) { }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.getCenters();
    this.getUsers();
  }

  // Function to make email small letters on change
  onEmailChange() {
    this.email = this.email.toLowerCase();
  }

  reset() {
      this.existingUser = false;
      this.role = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.name = "";
      this.center = "";
      this.active = true;
      this.isPasswordMatching = true;
      this.isExisting = false;
      this._id = "";
      this.myInput = "";
      this.mySelect = "";
      this.btnText = "Save";
      this.existingUser = false;
      this.isUserDeletable = false;
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
      result = _.filter(result, function(o) { 
          return (o.active == true); 
      });
      this.centers = result;
      this.storage.get('user').then((user) => {
          if(user.role != "admin") {
              this.centers = _.find(this.centers, ['center_code', user.center]);
              this.center = this.centers;
          }
      });
    }, (err) => {
      console.log(err);
    });
  }

  // Function to get list of all the Users
  getUsers() {
    this.users = [];
    this.authService.searchUser().then((result) => {
      this.users = result;
      for(var i = 0; i < this.users.length; i++){
        this.users[i].password = "";
      }
    }, (err) => {
      console.log(err);
    });
  }
 
  save() {
    if(!this.isExisting && this.isPasswordMatching) {
      this.loader.present();
      let details = {
        email: this.email,
        password: this.password,
        role: this.role,
        name: this.name,
        center: this.center,
        active: this.active
      };
      this.authService.createAccount(details).then((result) => {
          this.loader.dismiss();
          this.reset();
          this.getUsers();
          this.presentToast('User data saved successfully');
      }, (err) => {
          this.loader.dismiss();
          this.presentToast('Error! Please try again.');
      });
    }
  }

  update() {
    this.loader.present();
    let details = {
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
      center: this.center,
      active: this.active
    };
    this.authService.updateAccount(details).then((result) => {
        this.reset();
        this.loader.dismiss();
        this.getUsers();
        this.mySelect = null;
        this.myInput = '';
        this.presentToast('User data saved successfully');
    }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
    });
  }

  // Function to search for a User dynamically based on an input
  search() {
    var result = [];
    
    for(var i = 0; i < this.users.length; i++) {
      if (this.users[i].name.toLowerCase().indexOf(this.myInput.toLowerCase()) >= 0) { result.push(this.users[i]); } 
      else if (this.users[i].email.toLowerCase().indexOf(this.myInput.toLowerCase()) >= 0) { result.push(this.users[i]); } 
    }

    if(result && result.length === 1) {
      this.existingUser = true;
      this.role = result[0].role;
      this.email = result[0].email;
      this.password = result[0].password;
      this.confirm_password = result[0].password;
      this.name = result[0].name;
      this.center = result[0].center;
      this.active = result[0].active;
      this._id = result[0]._id;
      this.btnText = "Update";
      this.isUserDeletable = false;

      this.studentService.getStudents().then((data) => {
          data = _.filter(data, function(o) { 
            return (o.counsellor == this.email); 
          });
          if(!data) this.isUserDeletable = true;
      }, (err) => {
          console.log("not allowed");
      });

    }
    else {
      this.existingUser = false;
      this.role = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.name = "";
      this.center = "";
      this.active = true;
      this.isUserDeletable = false;
    }
  }

  // Function to search for a User dynamically based on select
  onSelectChange() {
    var result = [];

    for(var i = 0; i < this.users.length; i++) {
      if(this.users[i].name == this.mySelect) result.push(this.users[i]);
    }

    if(result && result.length === 1) {
      this.existingUser = true;
      this.role = result[0].role;
      this.email = result[0].email;
      this.password = result[0].password;
      this.confirm_password = result[0].password;
      this.name = result[0].name;
      this.center = result[0].center;
      this.active = result[0].active;
      this._id = result[0]._id;
      this.btnText = "Update";
      this.isUserDeletable = false;

      this.studentService.getStudents().then((data) => {
          var student = [];
          student = _.filter(data, function(o) { 
            return (o.counsellor == result[0].email); 
          });
          if(student.length <= 0) this.isUserDeletable = true;
      }, (err) => {
          console.log("not allowed");
      });

    }
    else {
      this.existingUser = false;
      this.role = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.name = "";
      this.center = "";
      this.active = true;
      this.isUserDeletable = false;
    }
  }

  // Function to check if user exists with same email ID
  checkEmail() {
    this.isExisting = false;
    var result = _.find(this.users, ['email', this.email])
    this.isExisting = (result != null && result != undefined) ? true : false;
  }

  // Function to check if password and confirm password match
  checkPassword() {
    this.isPasswordMatching = false;
    if((this.password == undefined || this.password == null) 
      && (this.confirm_password == undefined || this.confirm_password == null)) {
              this.isPasswordMatching = false;
    } else {
        this.isPasswordMatching = (this.password == this.confirm_password) ? true : false;
    }
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  delete() {
    this.loader.present();
    let details = {
      email: this.email,
    };
    this.authService.deleteAccount(details).then((result) => {
        this.reset();
        this.loader.dismiss();
        this.getUsers();
        this.mySelect = null;
        this.myInput = '';
        this.presentToast('User delete successfully');
    }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
    });
  }
 
}