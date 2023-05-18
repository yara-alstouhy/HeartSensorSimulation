import { Injectable } from '@angular/core';
import { Patient } from '../model/patient';
import { hospital } from '../model/hospital';
import { Firestore, addDoc, collection, collectionData, deleteDoc, deleteField, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DBService {
  showhospitals() {
    throw new Error('Method not implemented.');
  }
  showPatients() {
    throw new Error('Method not implemented.');
  }

	constructor(private firestore:Firestore)   {

	}
	addPatient(patient : Patient)
	{
		let $patientRef=collection(this.firestore,"patients");
		return addDoc($patientRef,patient);
	}
	getPatients(){
		let $patientRef=collection(this.firestore,"patients");
		return collectionData($patientRef,{idField:"id"}) as Observable<Patient[]>;
	}
	deletePatient(id:string)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		return deleteDoc($patientRef);
	}
	getPatient(id:string)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		return docData($patientRef,{idField:"id"}) as Observable<Patient>;
	}
	updatePatient(id:string,patient:Patient)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		return setDoc($patientRef,patient);
	}
	updatePatientDoc(id:string,count:number)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		const data = {
			Count:count,
		}
		updateDoc($patientRef,data)
	}
	updatePatientDocHos(id:string,hospital:string)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		const data = {
			Hospital:hospital,
		}
		updateDoc($patientRef,data)
	}
	updatePatientDocCase(id:string,c:string)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		const data = {
			Case:c,
		}
		updateDoc($patientRef,data)
	}
	deletePatientDoc(id:string)
	{
		let $patientRef=doc(this.firestore,"patients/"+id);
		const data = {
			Location:deleteField()
		}
		updateDoc($patientRef,data)
	}
	addHospital(hospital : hospital)
	{
		let $hospitalRef=collection(this.firestore,"hospitals");
		return addDoc($hospitalRef,hospital);
	}
	getHospitals(){
		let $hospitalRef=collection(this.firestore,"hospitals");
		return collectionData($hospitalRef,{idField:"id"}) as Observable<hospital[]>;
	}
	deleteHospital(id:string)
	{
		let $hospitalRef=doc(this.firestore,"hospitals/"+id);
		return deleteDoc($hospitalRef);
	}
	getHospital(id:string)
	{
		let $hospitalRef=doc(this.firestore,"hospitals/"+id);
		return docData($hospitalRef,{idField:"id"}) as Observable<hospital>;
	}
	updateHospital(id:string,hospital:hospital)
	{
		let $hospitalRef=doc(this.firestore,"hospitals/"+id);
		return setDoc($hospitalRef,hospital);
	}
}

