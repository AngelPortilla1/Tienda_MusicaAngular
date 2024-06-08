import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/service/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
  
})
export class ClienteComponent implements OnInit {
  formCliente: FormGroup;
  accion='Agregar';
  id:number | undefined

  listaclientes: any[] =[
  ];
  editarCliente(cliente : any) //traer la informacion al frm para editar
  {
    this.id = cliente.idCliente;
    this.accion = 'Editar';
    this.formCliente.setValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      correoelectronico: cliente.correoElectronico,
      pais: cliente.pais,
    });

  }
  AddCliente()
  {
    console.log("form -->",this.formCliente);
    const cliente: any ={
      //Id :"6",
      nombre: this.formCliente.get('nombre')?.value,
      apellido: this.formCliente.get('apellido')?.value,
      correoelectronico: this.formCliente.get('correoelectronico')?.value,
      pais : this.formCliente.get('pais')?.value,
      
    }
    // Verifica si el cliente ya existe en la lista
    const clienteExiste = this.listaclientes.some(c => 
      c.nombre.toLowerCase() === cliente.nombre.toLowerCase() && 
      c.apellido.toLowerCase() === cliente.apellido.toLowerCase()
    );

    if (clienteExiste) {
      console.log("El cliente ya existe");
      // Puedes mostrar una notificación o mensaje de error al usuario aquí
      return;
    }

    //add Cliente
    if(this.id == undefined)
    {
     // this.listaclientes(x=>x.nombre==this.nombre)
      //add Cliente
      this._clienteService.guardarCliente(cliente).subscribe(data =>{
        //this.toastr.success('se agrego la tarjeta con exito', 'Correcto');
        this.formCliente.reset(); //limpiar frm
        this.ObtenerClientes(); // refrescar la lista
        this.id = undefined;
        this.accion = 'Agregar';
      }, error =>{ 
        console.log ("Error ->", error);
      });
    }
  }

  constructor(private _clienteService: ClienteService,private fb:FormBuilder) { 
    this.formCliente = this.fb.group({
      nombre: ['',[Validators.required, Validators.maxLength(30), Validators.minLength(1)]],
      apellido:['',[Validators.required, Validators.maxLength(30), Validators.minLength(1)]],
      correoelectronico:['',[Validators.required, Validators.email]],
      pais:['',[Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
    });
  }


  ngOnInit(): void {
    this.ObtenerClientes();
  }

  ObtenerClientes()
  {
    this._clienteService.getlistClientes().subscribe(data=>{
      console.log("data->",data)
      this.listaclientes = data;
    }, error =>{
      console.log("Error",error);
    });

    }

confirmarEliminacion(idCliente: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCliente(idCliente);
      }
    });
  }
  eliminarCliente(idCliente: number): void 
  {
    this._clienteService.deleteCliente(idCliente).subscribe(() => {
      this.listaclientes = this.listaclientes.filter(cliente => cliente.idCliente !== idCliente);
    }, error => {
      console.error('Error eliminando cliente', error);
    });
    }
  }


