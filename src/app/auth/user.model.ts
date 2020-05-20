import { OnInit } from '@angular/core';

export interface Roles {
  reader: boolean;
  author?: boolean;
  admin?: boolean;
}


export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private roles: Roles = { reader: true}
  ) {}



  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
