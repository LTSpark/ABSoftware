import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = environment.artemisURL;

  usuario: UsuarioModel = new UsuarioModel();

  httpOptions: object = {
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get(`${this.url}/user`, this.httpOptions);
  }
}
