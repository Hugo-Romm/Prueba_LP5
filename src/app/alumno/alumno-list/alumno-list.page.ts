import { Component, OnInit } from '@angular/core';
import { collection, Firestore, doc, deleteDoc, query, limit, getDocs, startAfter, orderBy, where }
  from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-alumno-list',
  templateUrl: './alumno-list.page.html',
  styleUrls: ['./alumno-list.page.scss'],
})
export class AlumnoListPage implements OnInit {

  isSearch: boolean = false; //para la barra de busqueda
  query = ""; //va contener la búsqueda que el cliente realiza mediante el buscador
  lastVisible: any = null;
  li = 30;
  isDarkMode: boolean = false;

  constructor(private readonly firestore: Firestore, private router: Router) { }


  listaAlumnos: any[] = [];

  ngOnInit() {
    this.listarAlumnos();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  listarAlumnosSinFiltro = () => {
    const alumnosRef = collection(this.firestore, 'alumno');

    let q = undefined;
    if (this.lastVisible) {
      q = query(alumnosRef, 
        orderBy('codigo'), 
        limit(this.li), 
        startAfter(this.lastVisible));
    } else {
      q = query(alumnosRef, 
        orderBy('codigo'), 
        limit(this.li));
    }
    const querySnapshot = getDocs(q).then(re => {
      if (!re.empty) {
        this.lastVisible = re.docs[re.docs.length - 1];

        re.forEach(doc => {
          //console.log("queryyyy", doc.id, "data", doc.data());
          let alumno: any = doc.data();
          alumno.id = doc.id;
          this.listaAlumnos.push(alumno);
        });
      }
    });
  }

  listarAlumnos = () => {
    const alumnosRef = collection(this.firestore, 'alumno');

    if ((this.query + "").length > 0) {
      let q = undefined;
      if (this.lastVisible) {
        q = query(alumnosRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'), 
          orderBy('codigo'),
          limit(this.li),
          startAfter(this.lastVisible));

      } else {
        q = query(alumnosRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'), 
          orderBy('codigo'),
          limit(this.li));
      }
      getDocs(q).then(re => {

        if (!re.empty) {
          let nuevoArray = new Array();
          //retirar lo que no corresonde
          for (let i = 0; i < re.docs.length; i++) {
            const doc: any = re.docs[i].data();
            if (doc.nombre.toUpperCase().
              startsWith(
                this.query.toUpperCase().charAt(0)
              )) {
              nuevoArray.push(re.docs[i]);

            }
          }
          this.lastVisible = re.docs[nuevoArray.length - 1];
          for (let i = 0; i < nuevoArray.length; i++) {
            const doc: any = nuevoArray[i];
            let alumno: any = doc.data();
            alumno.id = doc.id;
            this.listaAlumnos.push(alumno);
          }

        }
      });
    } else {
      this.listarAlumnosSinFiltro();
    }
  }

  eliminarAlumno = (id: string) => {
    console.log('Eliminando alumno con ID:', id);
    const documentRef = doc(this.firestore, 'alumno', id);
 
 
    deleteDoc(documentRef)
      .then(() => {
        console.log('Alumno eliminado correctamente');
        this.router.navigate(['/alumno-list']); // Asegúrate de redirigir a la ruta correcta
      })
      .catch((error) => {
        console.error('Error al eliminar el alumno:', error);
      });
  };

  onIonInfinite(ev: any) {
    this.listarAlumnos();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  clickSearch = () => { //Este metodo lo unico que hace es cambiar el valor del atributo isSearch a verdadero
    this.isSearch = true;
  }

  clearSearch = () => {
    this.isSearch = false;
    this.query = "";

    this.listaAlumnos = new Array();
    this.lastVisible = null;
    this.listarAlumnos();
  }

  buscarSearch = (e: any) => { // Define una función llamada buscarSearch que toma un argumento (evento) de cualquier tipo
    this.isSearch = false; // Establece la propiedad isSearch del objeto actual (this) a false
    this.query = e.target.value; // Asigna el valor del campo de entrada (input) del evento a la propiedad query del objeto actual

    this.listaAlumnos = new Array(); // Inicializa la propiedad listaAlumnos del objeto actual como un nuevo arreglo vacío
    this.lastVisible = null; // Establece la propiedad lastVisible del objeto actual a null
    this.listarAlumnos(); // Llama al método listarAlumnos del objeto actual
  }
  
  formatFecha = (fecha: any) => {
    // Verifica si la fecha es válida
    if (fecha && fecha.toDate) {
      const date = fecha.toDate(); // Convertir objeto de fecha de Firestore a objeto de fecha de JavaScript
      const day = date.getDate();
      const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
      const year = date.getFullYear();
      return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    }
    return ""; // Si la fecha no es válida, devuelve una cadena vacía
  }
}
