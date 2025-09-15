

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ItemModalComponent } from '../../components/item-modal/item-modal';
import { CrudService } from '../../services/crud';  // ajusta la ruta al servicio que uses
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from 'c:/Users/almen/Or_crud/src/app/features/auth/services/auth';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzPaginationModule,
    NzPopconfirmModule,
    ItemModalComponent,
     NzIconModule,
     NzAlertModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  items: any[] = [];            // Array con los items que muestra la tabla
  loading = false;

  message: string | null = null;
  messageType: 'success' | 'error' | 'info' | 'warning' = 'success';


  // variables de paginación
  pageIndex = 1;
  pageSize = 10;
  total = 0;                    // total de items, lo provee el backend

  // para manejar el modal
  isModalVisible = false;
  isEditMode = false;
  currentItem: any = null;
  private tokenKey = 'jwt_token';

  private crudService = inject(CrudService) ;
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.ValidadorJWT();
    this.loadItems();
  }
  
  ValidadorJWT(): boolean { 
  if (!this.authService.getToken()) {
    this.router.navigate(['/login']);    
    return false;
  }
  else{
    return true;
  }
  
}
  loadItems(): void {

    
    this.ValidadorJWT()

    this.loading = true;
    // Suponiendo que el servicio tenga un método getItems(page, size)
    this.crudService.getItems(this.pageIndex, this.pageSize).subscribe({
      next: resp => {
        this.items = resp.items;    // ajusta según estructura del API
        this.total = resp.total;    // total de items para paginación
        this.loading = false;
           
      },
      error: err => {
           this.showError();
        console.error('Error al cargar items', err);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadItems();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;  // resetear a primera página
    this.loadItems();
  }

  openModal(): void {
    this.ValidadorJWT()
    this.isEditMode = false;
    this.currentItem = null;
    this.isModalVisible = true;
  }

  editItem(item: any): void {
    this.isEditMode = true;
    this.currentItem = item;
    this.isModalVisible = true;
  }

  confirmDelete(item: any): void {
    // Lógica de confirmar eliminación
    this.ValidadorJWT()
    this.crudService.deleteItem(item.id).subscribe({
      next: () => {
        // después de eliminar, recargar lista
        this.loadItems();
           this.showSuccess();
      },
      error: err => {
           this.showError();
        console.error('Error al eliminar', err);
      }
    });
  }

  handleSave(data: any): void {
    this.ValidadorJWT()
    if (this.isEditMode && this.currentItem) {
      // editar
      this.crudService.updateItem(this.currentItem.id, data).subscribe({
        next: () => {
          this.isModalVisible = false;
          this.loadItems();
             this.showSuccess();
        },
        error: err => {
          this.showError()
          console.error('Error al actualizar', err);
        }
      });
    } else {
      // crear
      data=this.eliminarId(data)
      this.crudService.createItem(data).subscribe({
        next: () => {
          this.isModalVisible = false;
          this.loadItems();
          this.showSuccess();
        },
        error: err => {
          this.showError()
          console.error('Error al crear', err);
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  //caso especial para creación set  id en 0 par mantener integridad de entidad
   eliminarId(objeto: any): any {
  if(objeto.id== null){
    objeto.id=0;
  }
  return objeto;
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  showError() {
    this.message = 'Ocurrió un error';
    this.messageType = 'error';
    setTimeout(() => {
    this.message = null; // oculta el alert después de 4 segundos
  }, 2500);
  }

  showSuccess() {
    this.message = 'Acción realizada con éxito';
     this.messageType = 'success';
     setTimeout(() => {
    this.message = null; // oculta el alert después de 4 segundos
  }, 2500);
  }
}


