import { Component, OnInit } from '@angular/core';
import { collection, addDoc, updateDoc, getDoc, doc, Firestore, deleteDoc } from '@angular/fire/firestore';
import { Storage, StorageError, UploadTaskSnapshot, getDownloadURL, ref, uploadBytesResumable, deleteObject } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alumno-edit',
  templateUrl: './alumno-edit.page.html',
  styleUrls: ['./alumno-edit.page.scss'],
})
export class AlumnoEditPage implements OnInit {
  id: any;  //atributo que recibe el id del reg. desde la ruta
  alumno: any = {};
  isNew: boolean = false;
  avatar: string = '';

  constructor(
    private readonly firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) { }

  //metodo de la interfaz OnInit
  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = params.id;
      if (params.id == 'new') {
        this.isNew = true;
      } else {
        this.obtenerAlumno(this.id);
      }
    });
  }

  incluirAlumno = () => {
    let alumnosRef = collection(this.firestore, "alumno");

    addDoc(alumnosRef, {
      codigo: Number(this.alumno.codigo),
      nombre: this.alumno.nombre,
      apellido: this.alumno.apellido,
      fecha: new Date(this.alumno.fecha),
    }).then(doc => {
      console.log("Registro Incluido");
      this.router.navigate(['/alumno-list']);
    }).catch(error => {

    });
  }

  editarAlumno = () => {
    console.log("Aqui editar en firebase");
    const document = doc(this.firestore, "alumno", this.id);

    updateDoc(document, {
      codigo: Number(this.alumno.codigo),
      nombre: this.alumno.nombre,
      apellido: this.alumno.apellido,
      fecha: new Date(this.alumno.fecha),
    }).then(doc => {
      console.log("Registro Editado");
      this.router.navigate(['/alumno-list']);
    }).catch(error => {
      //Informar al usuario
    });

  }

  obtenerAlumno = (id: string) => {
    const document = doc(this.firestore, "alumno", id);
    getDoc(document).then(doc => {

      console.log("Registro a editar", doc.data());

      if(doc.data()){
        this.alumno = doc.data();
        this.alumno.fecha = this.alumno.fecha.toDate().toISOString().substring(0,10)+"";

        if(this.alumno.avatar){
          this.obtenerAvatarAlumno();
        }
      }else{
        this.alumno = {};
      }
    });
  }

  guardarAlumno = () => {
    if (this.isNew) {
      this.incluirAlumno();
    } else {
      this.editarAlumno();
    }
  }

  eliminarAlumno = () => {
    console.log("Aqui editar en firebase");
    const document = doc(this.firestore, "alumno", this.id);

    deleteDoc(document).then(doc => {
      console.log("Registro Eliminado");
      this.router.navigate(['/alumno-list']);
    }).catch(error => {
      //Informar al usuario
    });

  }

  uploadFile = (input: HTMLInputElement) => {
    if (!input.files) return
    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        console.log(file, file.name);
        const storageRef = ref(this.storage, `avatars/alumno/${this.id}`);
        uploadBytesResumable(storageRef, file).on(
          'state_changed',
          this.onUploadChange,
          this.onUploadError,
          this.onUploadComplete,
        );
      }
    }
  }

  onUploadChange = (response: UploadTaskSnapshot) => {
    console.log('onUploadChange', response);
  }

  onUploadError = (error: StorageError) => {
    console.log('onUploadError', error);
  }

  onUploadComplete = () => {
    console.log('upload completo');
    this.editarAvatar();
    this.obtenerAvatarAlumno();
  }

  editarAvatar = () => {
    const document = doc(this.firestore, "alumno", this.id);
    updateDoc(document, {
      avatar: 'avatars/alumno/' + this.id
    }).then(doc => {
      console.log("Avatar Editado");
    });
  }

  obtenerAvatarAlumno = () => {
    const storageRef = ref(this.storage, `avatars/alumno/${this.id}`);
    getDownloadURL(storageRef).then(doc => {
      this.avatar = doc;
    });
  }

  eliminarAvatar = () => {
    const storageRef = ref(this.storage, `avatars/alumno/${this.id}`);
    deleteObject(storageRef).then(() => {
      console.log('Avatar eliminado del almacenamiento');

      const document = doc(this.firestore, "alumno", this.id);
      updateDoc(document, {
        avatar: ''
      }).then(() => {
        console.log('Avatar eliminado del documento');
        this.avatar = '';
      }).catch(error => {
        console.error('Error al actualizar el documento: ', error);
      });
    }).catch(error => {
      console.error('Error al eliminar el avatar del almacenamiento: ', error);
    });
  }
  



}
