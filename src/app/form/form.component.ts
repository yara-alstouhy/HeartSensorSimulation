import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import {DBService} from "../service/db.service";
import {ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../model/patient';
import { DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  constructor(private db:DBService,rt:ActivatedRoute,private router:Router) {
  }
  onSubmite(content:Patient){
  content.Case="good";
  content.Status="normal";
  this.db.addPatient(content).then((data:DocumentReference)=>{
          console.log(data.id);
          this.router.navigate(['/Dashboard']);
        })
        .catch((err)=>{
          console.log(err);
        });
  }
  // constructor,private db:DBService) { }
 
  // onSubmite(form:NgForm)
  // {
  //     this.db.addPatient(form.value)
  //     .then((data:DocumentReference)=>{
  //       console.log(data.id);
  //       this.router.navigate(['/']);
  //     })
  //     .catch((err)=>{
  //       console.log(err);
  //     });
  // }


}
