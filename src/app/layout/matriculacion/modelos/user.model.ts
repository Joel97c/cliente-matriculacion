import {Rol} from './rol.model';

export class User {
  id: string;
  user_name: string;
  name: string;
  email: string;
  password: string;
  estado: string;
  role: Rol;

  constructor() {
    this.role = new Rol();
  }
}
