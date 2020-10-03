import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Profile } from '../../models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  URI = environment.URI_ROOT;
  URI_SERVICE_USERS = `${this.URI}/user/api`;
  profiles: Profile[] = [];
  roles: Role[] = [];

  constructor(private http: HttpClient) {

  }


  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.URI_SERVICE_USERS}/profiles`)
      .pipe(map((resp: Profile[]) => {
        // Para mas adelante guardar en el localStorage
        this.profiles = resp;
        return this.profiles;
      }));
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.URI_SERVICE_USERS}/roles`)
      .pipe(map((resp: Role[]) => {
        // Para mas adelante guardar en el localStorage
        this.roles = resp;
        return this.roles;
      }));
  }

  saveUserProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(`${this.URI_SERVICE_USERS}/users/save-user-profile`, profile);
  }

  updateUserProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.URI_SERVICE_USERS}/users/update-user-profile/${profile.id}/${profile.user.id}`, profile);
  }

  deleteUserProfile (id: number) {
    return this.http.delete(`${this.URI_SERVICE_USERS}/users/${id}`);
  }

  enabledOrDisable(id: number, enableOrDisable: boolean): Observable<User> {
    return this.http.put<User>(`${this.URI_SERVICE_USERS}/users/enable-or-disable/${id}?enable=${enableOrDisable}`, {});
  }
}
