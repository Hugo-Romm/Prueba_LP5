import { Component, OnInit } from '@angular/core';
import { collection, addDoc, updateDoc, Firestore, doc, getDoc, deleteDoc } 
from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alumno-edit',
  templateUrl: './alumno-edit.page.html',
  styleUrls: ['./alumno-edit.page.scss'],
})
export class AlumnoEditPage implements OnInit {
  id: any;  //atributo que recibe el id del reg. desde la ruta
  isNew : boolean = false;
  
  constructor(
    private readonly firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  //metodo de la interfaz OnInit
  ngOnInit() {
    //this.incluirAlumno();
    //this.editarAlumno("FcoZmWssJ6p9Oh5oIpBD");
    this.route.params.subscribe((params:any) => {
        console.log("params", params); 
        this.id = params.id;
        if (params.id == 'new') {
          this.isNew = true;
        } else {
          this.obtenerAlumno(this.id);
        }
    });
  }


  editarAlumno = () => {
    console.log("Aqui editar en firebase");
    const document = doc(this.firestore, "alumno", this.id);

    updateDoc(document, {
      codigo : this.alumno.codigo,
      nombre : this.alumno.nombre,
      apellido : this.alumno.apellido
    }).then(doc => {
      console.log("Registro Editado");
      this.router.navigate(['/alumno-list']);
    }).catch(error=>{
      //Informar al usuario
    });
    
  }

  guardarAlumno = () => {
    if (this.isNew) {
      this.incluirAlumno();
    } else {
      this.editarAlumno();
    }
  }

  incluirAlumno = () => {
    console.log("Aqui incluir en firebase");
    let alumnosRef = collection(this.firestore, "alumno");

    addDoc(alumnosRef, {
      codigo : this.alumno.codigo,
      nombre : this.alumno.nombre,
      apellido : this.alumno.apellido
    }).then(doc => {
      console.log("Registro Incluido");
      this.router.navigate(['/alumno-list']);
    }).catch(error => {

    });
  }

  eliminarAlumno = () => {
    console.log("Aqui editar en firebase");
    const document = doc(this.firestore, "alumno", this.id);

    deleteDoc(document).then(doc => {
      console.log("Registro Eliminado");
      this.router.navigate(['/alumno-list']);
    }).catch(error=>{
      //Informar al usuario
    });
    
  }

  alumno : any = {};
  obtenerAlumno = (id: string) => {
    const document = doc(this.firestore, "alumno", id);
    getDoc(document).then(doc => {
      console.log("Registro a editar", doc.data());
      this.alumno = doc.data();
    });
  }

}
