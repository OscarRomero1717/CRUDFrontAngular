import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  hasItems:boolean
}

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7285/'; 

  // Headers comunes
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  /**
   * Obtener items paginados
   * @param page Número de página
   * @param pageSize Tamaño de página
   * @param filters Filtros opcionales
   */
  getItems(page: number = 1, pageSize: number = 10, ): Observable<ApiResponse<any>> {
  
    

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}hoteles?page=${page}&take=${pageSize}`, { 
     
      headers: this.headers 
    });
  }

  

  /**
   * Crear un nuevo item
   * @param item Datos del item a crear
   */
  createItem(formData: FormData): Observable<any> { 
  return this.http.post<any>(`${this.apiUrl}hoteles`, formData);
}

  /**
   * Actualizar un item existente
   * @param id ID del item a actualizar
   * @param item Datos actualizados
   */
  updateItem2(id: string | number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}hoteles/${id}`, item, { 
      headers: this.headers 
    });
  }

  updateItem(id: string | number, formData: FormData): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}hoteles/${id}`, formData);
}
  /**
   * Eliminar un item
   * @param id ID del item a eliminar
   */
  deleteItem(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}hoteles/${id}`, { 
      headers: this.headers 
    });
  }

  
}