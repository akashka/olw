import { Component } from "@angular/core";
import { 
    NavController, 
    ModalController, 
    AlertController, 
    LoadingController, 
    App,
    MenuController 
} from 'ionic-angular';
import { Students } from '../../providers/students/students';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { ConfirmPage } from '../confirm/confirm';
import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'search-page',
  templateUrl: './search.html'
})

export class SearchPage {

  public students: any;
  public studentsList: any;
  public isAdmin: Boolean = false;
  public isCenterAdmin: Boolean = false;
  public isCounsellor: Boolean = false;
  myInput: string;
  public loader: any;

  constructor(
    public navCtrl: NavController, 
    public studentService: Students, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public authService: Auth, 
    public menu: MenuController,
    public loading: LoadingController,
    public storage: Storage,
    public app: App,
    public CallNumber: CallNumber
  ) {
      this.storage.get('user').then((user) => {
              if(user.role === "counsellor")  this.isCounsellor = true;
         else if(user.role === "admin")  this.isAdmin = true;
         else if(user.role === "centerAdmin")  this.isCenterAdmin = true;
         else this.isCounsellor = true;
      }); 
  }
 
  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.studentService.getStudents().then((data) => {
      data = _.filter(data, function(o) { 
        return (o.status == 'enquiry' && !o.is_Confirmed); 
      });
      this.storage.get('user').then((user) => {
        data = _.filter(data, function(o) { 
          return (o.center == user.center); 
        });
        this.students = (_.sortBy(data, 'enquiry_date')).reverse();
        this.studentsList = (_.sortBy(data, 'enquiry_date')).reverse();
      });
    }, (err) => {
        console.log("not allowed");
    });
  }

  // Function to search for a student dynamically based on an input
  search() {
    var result = [];
    for(var i = 0; i < this.studentsList.length; i++) {
      if (this.studentsList[i].name.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.studentsList[i]); } 
      else if (_.includes(this.studentsList[i].alternate_contact, this.myInput)) { result.push(this.studentsList[i]); } 
      else if (this.studentsList[i].class_group.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.studentsList[i]); } 
      else if (this.studentsList[i].email_id.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.studentsList[i]); } 
      else if (this.studentsList[i].locality.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.studentsList[i]); } 
      else if (this.studentsList[i].parent_name.toUpperCase().indexOf(this.myInput.toUpperCase()) >= 0) { result.push(this.studentsList[i]); } 
      else if (_.includes(this.studentsList[i].phone_number, this.myInput)) { result.push(this.studentsList[i]); } 
    }
    this.students = result;
    if(this.myInput === "") this.students = this.studentsList;
  }
 
  add() {
  	this.navCtrl.setRoot(HomePage);
  }

  callNumber(num) {
      this.CallNumber.callNumber(num, false)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
  }

  update(student) {
    this.storage.set('confirmed_student', student);
    this.navCtrl.setRoot(ConfirmPage);
  }

}