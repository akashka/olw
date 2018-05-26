import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Auth {
 
  public token: any;
  url = "https://spark-olw.herokuapp.com/";
  // url = "http://localhost:8080/";

  public static userChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(public http: Http, public storage: Storage) {
 
  }
 
  checkAuthentication(){
    return new Promise((resolve, reject) => {
        //Load token if exists
        this.storage.get('token').then((value) => {
            this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            this.storage.get('user').then((user) => {
              Auth.userChanged.next(user);
            });
            this.http.get(this.url + 'api/auth/protected', {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                }); 
        });         
    });
  }
 
  createAccount(details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateAccount(details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/update', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }
 
  login(credentials){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            if(data.user){
              this.storage.set('token', data.token);
              this.storage.set('user', data.user).then((res) => {
                Auth.userChanged.next(data.user);
              });
            }
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  forgotPassword(credentials){
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/forgotPassword', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            resolve(data);
          }, (err) => {
            reject(err);
          });
      });
  }

  searchUser(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.url+'api/auth', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  logout(){
    this.storage.set('token', '');
    this.storage.set('user', {});
    Auth.userChanged.next(true);
  }

  deleteAccount(details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/delete', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }
 
}