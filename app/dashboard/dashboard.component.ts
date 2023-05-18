import { Component, DoCheck, OnInit } from '@angular/core';
import { DBService } from '../service/db.service';
import { hospital } from '../model/hospital';
import { Patient } from '../model/patient';
import { delay } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, DoCheck {
  hospitals: hospital[] = [];
  patients: Patient[] = [];
  count: any;
  patientid: any;
  hospitalid: any;
  nearestHospital: any;
  nearestDistance = 100;
  bedNum: any;
  case: string = "Good";
  check = true;
  ab: any = "abnormal";

  ngOnInit() {
    this.printNormal();
  }
  constructor(private db: DBService) {
    this.db.getHospitals().subscribe((data) => {
      this.hospitals = data;
    });
    this.db.getPatients().subscribe((data) => {
      this.patients = data;
    });
  }
  ngDoCheck(): void {
    for (let x in this.patients) {
      if (this.patients[x].Status == this.ab && this.patients[x].Case == "good") {
        this.check = true;
      }
    }
  }
  DeletePatient(id: any) {
    this.db.deletePatient(id);
  }
  printNormal() {
    const intervalId = setInterval(() => {
      for (let patient of this.patients) {
        this.checkcase(patient)
        delay(1000);
      }
    }, 1000); // Repeats every 1 seconds (1000 milliseconds)
  }
  checkcase(p: Patient) {
    this.check = false;
    p.Status = p.Status?.toLowerCase();
    this.patientid = p.id;
    if (p.Status == 'normal' && p.Case == 'in hospital' || p.Status == 'abnormal' && p.Case == 'good') {
      if (p.oldStatus == p.Status) {
        this.count = p.Count;
        this.count++;
        p.Count = this.count;
        console.log(this.count)
        this.db.updatePatientDoc(this.patientid, this.count)
      }
      else {
        this.count = 1;
        p.Count = this.count;
        p.oldStatus = p.Status;
        this.db.updatePatient(this.patientid, p)
      }
      if (this.count == 9 && p.Case == 'good') {
        let location: any;
        console.log("patientLoc" + p.Location)
        p.Case = 'calling ambulance';
        this.db.updatePatientDocCase(this.patientid, p.Case);
        delay(5000);
        this.count = 0;
        p.Count = this.count;
        this.db.updatePatientDoc(this.patientid, this.count)
        location = p.Location;
        console.log("thisloc" + location);
        this.nearestHospital = this.findnearesthosapitl(location);
        console.log("our hos: " + this.nearestHospital.HospitalName)
        p.Case = 'in hospital'
        p.Hospital = this.nearestHospital.HospitalName;
        this.nearestHospital.AvailableBeds--;
        console.log("beds: " + this.nearestHospital.AvailableBeds);
        this.db.updatePatientDocCase(this.patientid, p.Case)
        this.db.updatePatientDocHos(this.patientid, this.nearestHospital.HospitalName)
        this.db.updateHospital(this.nearestHospital.id, this.nearestHospital);
      }
      if (this.count == 10 && p.Case == 'in hospital') {
        console.log(p.Location)
        p.Case = 'good';
        this.count = 0;
        p.Count = this.count;
        this.db.updatePatientDoc(this.patientid, this.count)
        for (let hospital of this.hospitals) {
          if (p.Hospital == hospital.HospitalName) {
            this.bedNum = hospital.AvailableBeds;
            this.bedNum++;
            console.log("beds after leave: " + this.bedNum);
            hospital.AvailableBeds = this.bedNum
            this.hospitalid = hospital.id
            p.Hospital = "";
            this.db.updatePatientDocCase(this.patientid, p.Case)
            this.db.updatePatientDocHos(this.patientid, "")
            this.db.updateHospital(this.hospitalid, hospital)
            break
          }
        }
      }
    }
    else {
      this.count = 0;
      p.Count = this.count;
      this.db.updatePatientDoc(this.patientid,this.count)
    }
    this.patientid = '';
  }
  findnearesthosapitl(targetlocation: string) {
    let targetPrefix = targetlocation.substring(0, 2);
    let targetSuffix = targetlocation.substring(3);
    for (let hospital of this.hospitals) {
      let bedNumber = hospital.AvailableBeds;
      let locationPrefix = hospital.HospitalLocation?.substring(0, 2);
      let locationSuffix = hospital.HospitalLocation?.substring(3);
      if (locationPrefix == targetPrefix && (bedNumber === undefined || bedNumber > 0 && bedNumber <= 10)) {
        if (locationSuffix?.length == 2) {
          let hospitalFirstNumber = parseInt(locationSuffix[0]);
          let hospitalSecondNumber = parseInt(locationSuffix[1]);
          if (targetSuffix?.length == 2) {
            let targetFirstNumber = parseInt(targetSuffix[0]);
            let targetSecondNumber = parseInt(targetSuffix[1]);
            let distance = Math.abs(targetFirstNumber - hospitalFirstNumber) + Math.abs(targetSecondNumber - hospitalSecondNumber);
            let tar = parseInt(targetSuffix);
            if ((distance <= this.nearestDistance) && tar < 10) {
              this.nearestHospital = hospital;
              this.nearestDistance = distance;
            }
            if ((distance >= this.nearestDistance) && tar >= 10) {
              this.nearestHospital = hospital;
              this.nearestDistance = distance;
            }
          }
        }
      }
    }
    return this.nearestHospital;
  }

}
