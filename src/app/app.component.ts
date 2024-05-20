import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Alumnos', url: '/alumno-list', icon: 'person' },
    { title: 'Vacio', icon: 'code' },
    { title: 'Vacio', icon: 'code' },
    { title: 'Vacio', icon: 'code' },
    { title: 'Vacio', icon: 'code' },
    { title: 'Vacio', icon: 'code' },
  ];
  public labels = ['Vacio', 'Vacio', 'Vacio', 'Vacio', 'Vacio', 'Vacio'];
  constructor() {}
}
