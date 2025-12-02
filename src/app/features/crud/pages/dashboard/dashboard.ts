import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ItemModalComponent } from '../../components/item-modal/item-modal';
import { CrudService } from '../../services/crud';  
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HexToUrlPipe } from '../../../../shared/pipes/hexpipe';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    HexToUrlPipe,
    NzPaginationModule,
    NzPopconfirmModule,
    ItemModalComponent,
    NzIconModule,
    NzAlertModule,
    FormsModule  
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  items: any[] = [];            // Array con los items que muestra la tabla
  loading = false;

  message: string | null = null;
  messageType: 'success' | 'error' | 'info' | 'warning' = 'success';

  imagenBase64: string = '';
  urlImagen: string = '';
  nombreArchivo: string = '';
  tipoArchivo: string = '';
  tamañoArchivo: number = 0;
  // variables de paginación
  pageIndex = 1;
  pageSize = 10;
  total = 0;          
  
  
  searchTerm = '';
  // para manejar el modal
  isModalVisible = false;
  isEditMode = false;
  currentItem: any = null; 

  menuOpen = false;

  private crudService = inject(CrudService) ;
  
    

  ngOnInit(): void {
   
    this.loadItems();
  }

  jpegHexToBase64Image(hexString: string): string {
    // Validar que sea hexadecimal JPEG

    const cleanHex = this.cleanHexString(hexString);
    if (!this.isValidJpegHex(cleanHex)) {
      console.error('El hexadecimal no corresponde a una imagen JPEG válida');
      // Podrías lanzar un error o retornar una imagen por defecto
      return '';
    }

    const base64 = this.hexToBase64(cleanHex);
    return `data:image/jpeg;base64,${base64}`;
  }

  private cleanHexString(hex: string): string {
    return hex
      .trim()
      .replace(/^0x|^0X/, '')  // Elimina prefijo 0x o 0X
      .replace(/\s/g, '')      // Elimina todos los espacios
      .toUpperCase();          // Convierte a mayúsculas
  }

  private isValidJpegHex(hex: string): boolean {
    const cleanHex = hex.replace(/\s/g, '').toUpperCase();
    // JPEG empieza con FFD8FF
    return cleanHex.startsWith('FFD8FF');
  }

  hexToBase64(hexString: string): string {
    // Limpiar la cadena
    const cleanHex = hexString.replace(/\s/g, '').replace(/^0x/, '');

    // Validar longitud par
    if (cleanHex.length % 2 !== 0) {
      throw new Error('La cadena hexadecimal debe tener longitud par');
    }

    // Convertir hex a bytes
    const byteArray = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      byteArray[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }

    // Convertir bytes a Base64
    return this.bytesToBase64(byteArray);
  }

   private bytesToBase64(byteArray: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
      binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
  }

  ok (hexString: string): string {
  // Eliminar espacios o prefijos '0x'
  hexString = hexString.replace(/\s/g, '');

  // Asegurar longitud par
  if (hexString.length % 2 !== 0) {
    throw new Error('La cadena hexadecimal debe tener longitud par.');
  }

  // Convertir hex a bytes
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  // Convertir bytes a base64
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


  
  
  
  loadItems(): void {

       

    this.loading = true;
    
    this.crudService.getItems(this.pageIndex, this.pageSize).subscribe({
      next: resp => {
        this.items = resp.items;    
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

    const formData = new FormData();

    formData.append('id', data.id);
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('sede', data.sede);
    formData.append('direccion', data.direccion);
    formData.append('foto', data.foto);

   
    if (this.isEditMode && this.currentItem) {
      // editar
      this.crudService.updateItem(this.currentItem.id, formData).subscribe({
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
      this.crudService.createItem(formData).subscribe({
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

    get filteredItems(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.items;
    }

    return this.items.filter(item => {
      const nombre = (item.nombre || '').toString().toLowerCase();
      const descripcion = (item.descripcion || '').toString().toLowerCase();
      const sede = (item.sede || '').toString().toLowerCase();
      const direccion = (item.direccion || '').toString().toLowerCase();

      return (
        nombre.includes(term) ||
        descripcion.includes(term) ||
        sede.includes(term) ||
        direccion.includes(term)
      );
    });
  }

  showError() {
    this.message = 'Ocurrió un error';
    this.messageType = 'error';
    setTimeout(() => {
    this.message = null; 
  }, 2500);
  }

  showSuccess() {
    this.message = 'Acción realizada con éxito';
     this.messageType = 'success';
     setTimeout(() => {
    this.message = null; 
  }, 2500);
  }
}


