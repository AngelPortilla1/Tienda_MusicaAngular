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
  loading = false; // Loader stat

  listaclientes: any[] =[
  ];
  editarCliente(cliente: any): void {
    console.log('Cliente a editar:', cliente);
    this.id = cliente.idCliente;
    this.accion = 'Editar';
    this.formCliente.setValue({
      idCliente: cliente.idCliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      correoelectronico: cliente.correoElectronico,
      pais: cliente.pais,
    });
  }
  AddCliente(): void {
    if (this.formCliente.invalid) {
      this.formCliente.markAllAsTouched();  // Marca todos los controles como "touched"
        return;
    }

    let cliente: any = {
        nombre: this.formCliente.get('nombre')?.value,
        apellido: this.formCliente.get('apellido')?.value,
        correoelectronico: this.formCliente.get('correoelectronico')?.value,
        pais: this.formCliente.get('pais')?.value,
    };

    if (this.accion === 'Editar') {
        cliente = {
            ...cliente,
            idCliente: this.id // Agrega el idCliente al objeto cliente
        };
    }

    if (this.accion === 'Agregar') {
        this._clienteService.guardarCliente(cliente).subscribe(data => {
            this.formCliente.reset();
            this.ObtenerClientes();
            Swal.fire('Éxito', 'Cliente agregado con éxito', 'success');
        }, error => {
            console.error('Error al agregar cliente', error);
            Swal.fire('Error', 'Hubo un error al agregar el cliente', 'error');
        });
    } else {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar la información del cliente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this._clienteService.actualizarCliente(this.id!, cliente).subscribe(data => {
                    this.formCliente.reset();
                    this.ObtenerClientes();
                    this.accion = 'Agregar';
                    this.id = undefined;
                    Swal.fire('Éxito', 'Cliente actualizado con éxito', 'success');
                }, error => {
                    console.error('Error al actualizar cliente', error);
                    Swal.fire('Error', 'Hubo un error al actualizar el cliente', 'error');
                });
            }
        });
    }
}

  constructor(private _clienteService: ClienteService,private fb:FormBuilder) { 
    this.formCliente = this.fb.group({
      idCliente: [''], // Campo oculto para almacenar el ID del cliente
      nombre: ['', [
        Validators.required, 
        Validators.maxLength(30), 
        Validators.minLength(1),
        Validators.pattern('^[a-zA-ZÀ-ÿ\s]+$') // solo letras y espacios
      ]],
      apellido: ['', [
        Validators.required, 
        Validators.maxLength(30), 
        Validators.minLength(1),
        Validators.pattern('^[a-zA-ZÀ-ÿ\s]+$') // solo letras y espacios
      ]],
      correoelectronico: ['', [
        Validators.required, 
        Validators.email
      ]],
      pais: ['', [
        Validators.required, 
        Validators.maxLength(30), 
        Validators.minLength(3),
        Validators.pattern('^[a-zA-ZÀ-ÿ\s]+$') // solo letras y espacios
      ]]
    });
  }


  ngOnInit(): void {
    this.ObtenerClientes();
  }

  ObtenerClientes()
  {
    this.loading = true; // Start loader
    this._clienteService.getlistClientes().subscribe(data=>{
      console.log("data->",data)
      this.listaclientes = data;
      this.loading = false; // Stop loader
    }, error =>{
      console.log("Error",error);
      this.loading = false; // Stop loader
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
    
    eliminarCliente(idCliente: number): void {
      this._clienteService.deleteCliente(idCliente).subscribe(() => {
        this.listaclientes = this.listaclientes.filter(cliente => cliente.idCliente !== idCliente);
        Swal.fire({
          title: 'Cliente eliminado',
          text: 'El cliente ha sido eliminado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }, error => {
        console.error('Error eliminando cliente', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al intentar eliminar el cliente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    }
  }


