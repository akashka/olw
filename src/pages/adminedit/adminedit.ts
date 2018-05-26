import { Component } from "@angular/core";
import { 
    NavController, 
    ModalController, 
    AlertController, 
    LoadingController, 
    App,
    MenuController,
    ToastController
} from 'ionic-angular';
import { Students } from '../../providers/students/students';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { ConfirmPage } from '../confirm/confirm';
import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'adminedit-page',
  templateUrl: './adminedit.html'
})

export class AdmineditPage {

  public students: any;
  public studentsList: any;
  public isAdmin: Boolean = false;
  public isCenterAdmin: Boolean = false;
  public isCounsellor: Boolean = false;
  myInput: string;
  public loader: any;
  public showListing: Boolean = true;
  studentForm: FormGroup;
  public student: any;

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
    public CallNumber: CallNumber,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder
  ) {
      this.storage.get('user').then((user) => {
              if(user.role === "counsellor")  this.isCounsellor = true;
         else if(user.role === "admin")  this.isAdmin = true;
         else if(user.role === "centerAdmin")  this.isCenterAdmin = true;
         else this.isCounsellor = true;
      }); 

      this.studentForm = formBuilder.group({

        name: ['', Validators.compose([Validators.required])],
        
        email_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"), Validators.required])],
        
        phone_number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
        
        gender: ['', Validators.compose([Validators.required])],
        
        dob: ['', Validators.compose([Validators.required])],

        parent_name: ['', Validators.compose([Validators.required])],

        alternate_contact: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')])],

        locality: ['', Validators.compose([Validators.required])],

        study_year: ['', Validators.compose([Validators.required])],

        class_group: ['', Validators.compose([Validators.required])],

        class_type: ['', Validators.compose([Validators.required])],
        
        uniform_size: ['', Validators.compose([Validators.required])],
        
        shoe_size: ['', Validators.compose([Validators.required])]

      });
  }
 
  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.studentService.getStudents().then((data) => {
      this.studentsList = data;
      this.students = data;
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

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  delete(student) {
      let alert = this.alertCtrl.create({
        title: 'Confirm delete',
        message: 'Do you want to delete this student data?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Confirm',
            handler: () => {
                student.is_Active = false;
                student.admin_edit = true;
                this.studentService.updateStudent(student).then((result) => {
                  this.presentToast('student data saved successfully');
                  this.goBack();
                }, (err) => {
                  this.loader.dismiss();
                  this.presentToast('Error! Please try again.');
                });
            }
          }
        ]
      });
      alert.present();
  }

  goBack() {
      this.studentService.getStudents().then((data) => {
        this.studentsList = data;
        this.students = data;
      }, (err) => {
        console.log("not allowed");
      });
      this.showListing = true;
  }

  edit(student) {
      this.showListing = false;
      this.student = student;
      this.studentForm.controls['name'].setValue(student.name);
      this.studentForm.controls['email_id'].setValue(student.email_id);
      this.studentForm.controls['phone_number'].setValue(student.phone_number);
      this.studentForm.controls['gender'].setValue(student.gender);
      this.studentForm.controls['dob'].setValue(student.dob);
      this.studentForm.controls['parent_name'].setValue(student.parent_name);
      this.studentForm.controls['alternate_contact'].setValue(student.alternate_contact);
      this.studentForm.controls['locality'].setValue(student.locality);
      this.studentForm.controls['study_year'].setValue(student.study_year);
      this.studentForm.controls['class_group'].setValue(student.class_group);
      this.studentForm.controls['uniform_size'].setValue(student.uniform_size);
      this.studentForm.controls['class_type'].setValue(student.class_type);
      this.studentForm.controls['shoe_size'].setValue(student.shoe_size);
  }

  onNameChange = () => {
    this.studentForm.value.name = this.studentForm.value.name.toUpperCase();
  }

  onEmailChange = () => {
    this.studentForm.value.email_id = this.studentForm.value.email_id.toLowerCase();
  }

  confirmStudent = () => {
    if(this.studentForm.valid) {
      this.loader.present();
      this.student.name = this.studentForm.value.name;
      this.student.email_id = this.studentForm.value.email_id;
      this.student.phone_number = this.studentForm.value.phone_number;
      this.student.gender = this.studentForm.value.gender;
      this.student.dob = moment(this.studentForm.value.dob,"YYYY-MM-DD").toDate();
      this.student.parent_name = this.studentForm.value.parent_name;
      this.student.alternate_contact = this.studentForm.value.alternate_contact;
      this.student.locality = this.studentForm.value.locality;
      this.student.study_year = this.studentForm.value.study_year;
      this.student.class_group = this.studentForm.value.class_group;
      this.student.uniform_size = this.studentForm.value.uniform_size;
      this.student.class_type = this.studentForm.value.class_type;
      this.student.shoe_size = this.studentForm.value.shoe_size;
      this.student.admin_edit = true;

      this.studentService.updateStudent(this.student).then((result) => {
        this.loader.dismiss();
        this.presentToast('student data saved successfully');
        this.goBack();
      }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
      });
    }
  };

}