import { Component } from "@angular/core";
import { 
      NavController, 
      ModalController, 
      AlertController, 
      LoadingController,
      ToastController
} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { Students } from '../../providers/students/students';
import { Auth } from '../../providers/auth/auth';
import { Center } from '../../providers/center/center';
import { Indentation } from '../../providers/indentation/indentation';
import { HomePage } from '../home/home';

import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'indent-page',
  templateUrl: './indent.html'
})

export class IndentPage {

  public students: any;
  public studentsList: any;
  public indented_students = [];
  public user_center;
  public confirm_indent: boolean = false;
  public isCash: boolean = false;
  public myInput: string;

  public total_amount: number = 0;
  public payment_mode;
  public payment_date = moment().format("YYYY-MM-DD");
  public bank_name;
  public transaction_no;
  public cheque_no;
  public email;
  public center_code;
  public students_amount = [];
  public loader: any;
  public today_date = moment().format("YYYY-MM-DD");


  constructor(
    public navCtrl: NavController, 
    public studentService: Students, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public authService: Auth, 
    public loading: LoadingController,
    public storage: Storage,
    public centerService: Center,
    public indentationService: Indentation,
    public toastCtrl: ToastController,
    public CallNumber: CallNumber
  ) { }
 
  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.studentService.getStudents().then((data) => {
      this.students = _.filter(data, function(o) { 
        return (o.status == 'confirmed' && !o.is_Indented); 
      });
      this.storage.get('user').then((user) => {
        this.students = _.filter(this.students, function(o) { 
          return (o.center == user.center); 
        });
        this.students = _.sortBy(this.students, 'enquiry_date');
        this.studentsList = _.sortBy(this.students, 'enquiry_date');
      });
    }, (err) => {
        console.log("not allowed");
    });

    this.centerService.searchCenter().then((centers) => {
        this.storage.get('user').then((user) => {
            this.email = user.email;
            this.center_code = user.center;
            this.user_center = _.find(centers, ['center_code', user.center]);
            this.isCash = this.user_center.cash;
        });
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
 
  add() {
  	this.navCtrl.setRoot(HomePage);
  }

  indent(student) {
  console.log(this.today_date);
  	this.indented_students.push(student);
    for(var i = 0; i < this.students.length; i++) {
      if(this.students[i] === student) this.students[i].indented = true;
    }
    this.addAmount(student);
  }

  unindent(student) {
    var s = -1; 
    for(var i = 0; i < this.indented_students.length; i++){
      if(this.indented_students[i] === student) {
        s = i;
        break;
      }
    }
    this.indented_students.splice(s,1);
    for(var k = 0; k < this.students.length; k++) {
      if(this.students[k] === student) delete this.students[k].indented;
    }
    this.subtractAmount(student);
  }

  addAmount(student: any) {
      if(student.class_group === 'Play Group'){
          if(student.class_type === "Annual") this.total_amount += Number(this.user_center.playgroup.annual);
          if(student.class_type === "Mid-term") this.total_amount += Number(this.user_center.playgroup.mid_term);
          if(student.class_type === "Early start") this.total_amount += Number(this.user_center.playgroup.early_start);
      } 
      else if(student.class_group === 'Nursery'){
          if(student.class_type === "Annual") this.total_amount += Number(this.user_center.nursery.annual);
          if(student.class_type === "Mid-term") this.total_amount += Number(this.user_center.nursery.mid_term);
          if(student.class_type === "Early start") this.total_amount += Number(this.user_center.nursery.early_start);
      }
      else if(student.class_group === 'LKG'){
          if(student.class_type === "Annual") this.total_amount += Number(this.user_center.lkg.annual);
          if(student.class_type === "Mid-term") this.total_amount += Number(this.user_center.lkg.mid_term);
          if(student.class_type === "Early start") this.total_amount += Number(this.user_center.lkg.early_start);
      }
      else if(student.class_group === 'UKG'){
          if(student.class_type === "Annual") this.total_amount += Number(this.user_center.ukg.annual);
          if(student.class_type === "Mid-term") this.total_amount += Number(this.user_center.ukg.mid_term);
          if(student.class_type === "Early start") this.total_amount += Number(this.user_center.ukg.early_start);
      }
  }

  subtractAmount(student: any) {
      if(student.class_group === 'Play Group'){
          if(student.class_type === "Annual") this.total_amount -= this.user_center.playgroup.annual;
          if(student.class_type === "Mid-term") this.total_amount -= this.user_center.playgroup.mid_term;
          if(student.class_type === "Early start") this.total_amount -= this.user_center.playgroup.early_start;
      } 
      else if(student.class_group === 'Nursery'){
          if(student.class_type === "Annual") this.total_amount -= this.user_center.nursery.annual;
          if(student.class_type === "Mid-term") this.total_amount -= this.user_center.nursery.mid_term;
          if(student.class_type === "Early start") this.total_amount -= this.user_center.nursery.early_start;
      }
      else if(student.class_group === 'LKG'){
          if(student.class_type === "Annual") this.total_amount -= this.user_center.lkg.annual;
          if(student.class_type === "Mid-term") this.total_amount -= this.user_center.lkg.mid_term;
          if(student.class_type === "Early start") this.total_amount -= this.user_center.lkg.early_start;
      }
      else if(student.class_group === 'UKG'){
          if(student.class_type === "Annual") this.total_amount -= this.user_center.ukg.annual;
          if(student.class_type === "Mid-term") this.total_amount -= this.user_center.ukg.mid_term;
          if(student.class_type === "Early start") this.total_amount -= this.user_center.ukg.early_start;
      }
  }

  findAmount(cg, ct) {
      if(cg === 'Play Group' && ct === 'Annual') return(this.user_center.playgroup.annual);
      else if(cg === 'Play Group' && ct === 'Mid-term') return(this.user_center.playgroup.mid_term);
      else if(cg === 'Play Group' && ct === 'Early start') return(this.user_center.playgroup.early_start);
      else if(cg === 'Nursery' && ct === 'Annual') return(this.user_center.nursery.annual);
      else if(cg === 'Nursery' && ct === 'Mid-term') return(this.user_center.nursery.mid_term);
      else if(cg === 'Nursery' && ct === 'Early start') return(this.user_center.nursery.early_start);
      else if(cg === 'LKG' && ct === 'Annual') return(this.user_center.lkg.annual);
      else if(cg === 'LKG' && ct === 'Mid-term') return(this.user_center.lkg.mid_term);
      else if(cg === 'LKG' && ct === 'Early start') return(this.user_center.lkg.early_start);
      else if(cg === 'UKG' && ct === 'Annual') return(this.user_center.ukg.annual);
      else if(cg === 'UKG' && ct === 'Mid-term') return(this.user_center.ukg.mid_term);
      else if(cg === 'UKG' && ct === 'Early start') return(this.user_center.ukg.early_start);
      else return 0;
  }

  indentStudents() {
    this.confirm_indent = !this.confirm_indent;
    this.setCheque();
  }

  setCash() {
    this.payment_mode = "cash";
  }

  setCheque() {
    this.payment_mode = "cheque";
  }

  setOnline() {
    this.payment_mode = "online";
  }

  reset() {
      this.indented_students = [];
      this.confirm_indent = false;
      this.total_amount = 0;
      this.payment_mode = "";
      this.payment_date = moment().format("YYYY-MM-DD");
      this.bank_name = "";
      this.transaction_no = "";
      this.cheque_no = "";
      this.students_amount = [];

      this.studentService.getStudents().then((data) => {
        this.students = _.filter(data, function(o) { 
          return (o.status == 'confirmed' && !o.is_Indented); 
        });
        this.storage.get('user').then((user) => {
          this.students = _.filter(this.students, function(o) { 
            return (o.center == user.center); 
          });
          this.students = _.sortBy(this.students, 'enquiry_date');
        });
      }, (err) => {
          console.log("not allowed");
      });
  }

  callNumber(num) {
      this.CallNumber.callNumber(num, false)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
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

  confirmIndent() {
    this.loader.present();
    let indentation = {
      total_amount: this.total_amount,
      payment_mode: this.payment_mode,
      payment_date: moment(this.payment_date,"YYYY-MM-DD").toDate(),
      bank_name: this.bank_name,
      transaction_no: this.transaction_no,
      cheque_no: this.cheque_no,
      email: this.email,
      center_code: this.center_code,
      students_amount: []
    };

    for(var is = 0; is < this.indented_students.length; is++) {
        var tempis = {
            student_id: this.indented_students[is].student_id,
            student_key: this.indented_students[is]._id,
            student_name: this.indented_students[is].name,
            phone_number: this.indented_students[is].phone_number,
            gender: this.indented_students[is].gender,
            class_group: this.indented_students[is].class_group,
            class_type: this.indented_students[is].class_type,
            uniform_size: this.indented_students[is].uniform_size,
            shoe_size: this.indented_students[is].shoe_size,
            amount: this.findAmount(this.indented_students[is].class_group, this.indented_students[is].class_type),
            is_dispatched: false
        };
        indentation.students_amount.push(tempis);
    }

    this.indentationService.createIndentation(indentation).then((result) => {
        this.loader.dismiss();
        this.reset();
        this.presentToast('Indentation successfull');
    }, (err) => {
        this.loader.dismiss();
        this.presentToast('Error! Please try again.');
    });

    for(var ik = 0; ik < this.indented_students.length; ik++) {
      this.indented_students[ik].status = "indented";
      this.indented_students[ik].is_Indented = true;
      this.indented_students[ik].admin_edit = false;
      delete this.indented_students[ik].indented;

      this.studentService.updateStudent(this.indented_students[ik]).then((result) => {
        console.log('student data saved successfully');
      }, (err) => {
        console.log('student data saving failed');
      });
    } 
  }
 
}