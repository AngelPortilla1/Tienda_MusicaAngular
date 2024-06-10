import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private myAppUrl = 'https://localhost:7299/';
  private myApiUrl = 'api/ClientePedido/';

  constructor(private http: HttpClient) { }
  

  getlistClientes():Observable<any>
  {
    console.log("Ruta->",this.myAppUrl + this.myApiUrl)
    return this.http.get(this.myAppUrl + this.myApiUrl);
    
    //return this.http.get(this.myApiUrl);
  }
  deleteCliente(id:number):Observable<any>
  {
    return this.http.delete(this.myAppUrl + this.myApiUrl +id);
  }
  guardarCliente(cliente : any):Observable<any>
  {
    console.log("Ruta->",this.myAppUrl + this.myApiUrl + cliente);
    return this.http.post(this.myAppUrl+this.myApiUrl, cliente);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}${id}`;
    console.log('URL de actualización:', url);
    console.log('Datos del cliente a actualizar:', cliente);
    return this.http.put(url, cliente);
  }
  

}
