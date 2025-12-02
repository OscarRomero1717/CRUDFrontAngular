import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzUploadModule, NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';  // 



@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzUploadModule,
    
  ],
  templateUrl: './item-modal.html'
})
export class ItemModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isEditMode = false;
  @Input() itemData: any;



  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

//   // archivo seleccionado (imagen)
   selectedFile: File | null = null;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null, []], 
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      sede: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      foto: [null],   
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemData'] && this.itemData) {
      this.form.patchValue(this.itemData);
    } else if (changes['itemData'] && !this.itemData) {
      this.form.reset();
    }


  }


  
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    this.selectedFile = null;
    this.form.patchValue({ foto: null });
    return;
  }

  const file = input.files[0];

  // validaciones de tipo
  const validTypes = ['image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    alert('Solo se permiten imágenes JPEG (.jpg, .jpeg)');
    input.value = ''; // limpiar input
    this.selectedFile = null;
    this.form.patchValue({ foto: null });
    return;
  }

  // validación de tamaño (ej. 2MB)
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert('La imagen debe ser menor de 2MB.');
    input.value = '';
    this.selectedFile = null;
    this.form.patchValue({ foto: null });
    return;
  }

  // guardar el archivo y el nombre en el form
  this.selectedFile = file;
  this.form.patchValue({
    foto: file.name
  });
}
  disabledDate = (current: Date): boolean => {
    return current < new Date(new Date().setHours(0, 0, 0, 0));
  };

  onCancel(): void {
    this.cancel.emit();
  }

  // onOk(): void {
  //   if (this.form.valid) {
  //     this.save.emit(this.form.value);
  //   } else {
  //     Object.values(this.form.controls).forEach(control => {
  //       if (control.invalid) {
  //         control.markAsDirty();
  //         control.updateValueAndValidity();
  //       }
  //     });
  //   }
    
  // }


  onOk(): void {
  if (this.form.invalid) {
    Object.values(this.form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    });
    return;
  }

  // si es creación y no hay imagen:
  if (!this.isEditMode && !this.selectedFile) {
    alert('Debe seleccionar una imagen JPG');
    return;
  }

  const raw = this.form.value;
  const formData = new FormData();

  if (raw.id != null) {
    formData.append('id', raw.id);
  }



  if (this.selectedFile) {
     raw.foto=this.selectedFile;
  }

  this.save.emit(raw);
}

  resetForm(): void {
    this.form.reset();
  }


  
}


// import {
//   Component,
//   Input,
//   Output,
//   EventEmitter,
//   OnChanges,
//   SimpleChanges
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule
// } from '@angular/forms';

// import { NzModalModule } from 'ng-zorro-antd/modal';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
// import { NzIconModule } from 'ng-zorro-antd/icon';

// @Component({
//   selector: 'app-item-modal',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     NzModalModule,
//     NzFormModule,
//     NzInputModule,
//     NzSelectModule,
//     NzButtonModule,
//     NzUploadModule,
//     NzIconModule
//   ],
//   templateUrl: './item-modal.html'
// })
// export class ItemModalComponent implements OnChanges {
//   @Input() visible = false;
//   @Input() isEditMode = false;
//   @Input() itemData: any;

//   @Output() save = new EventEmitter<any>(); // emitiremos FormData
//   @Output() cancel = new EventEmitter<void>();

//   form!: FormGroup;

//   // archivo seleccionado (imagen)
//   selectedFile: File | null = null;

//   constructor(private fb: FormBuilder) {
//     this.form = this.fb.group({
//       id: [null, []],
//       nombre: ['', [Validators.required, Validators.maxLength(100)]],
//       descripcion: ['', [Validators.required, Validators.maxLength(255)]],
//       sede: ['', [Validators.required, Validators.maxLength(100)]],
//       direccion: ['', [Validators.required, Validators.maxLength(255)]],
//       // campo lógico, no es necesario que lo uses en el template
//       foto: [null, []]
//     });
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['itemData'] && this.itemData) {
//       // Rellenar el formulario con datos existentes (para editar)
//       this.form.patchValue({
//         id: this.itemData.id,
//         nombre: this.itemData.nombre,
//         descripcion: this.itemData.descripcion,
//         sede: this.itemData.sede,
//         direccion: this.itemData.direccion
//         // la foto no se puede repoblar porque no podemos reconstruir un File desde bytes
//       });
//       this.selectedFile = null; // al editar, si no se selecciona otra imagen, podrías decidir no enviarla
//     } else if (changes['itemData'] && !this.itemData) {
//       this.form.reset();
//       this.selectedFile = null;
//     }
//   }

//   // ----------------------------------------------------------------
//   // Manejo del upload (para usar con <nz-upload>)
//   // ----------------------------------------------------------------

//   beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): boolean => {
//   const rawFile = file.originFileObj as File; // aquí tienes el File real

//   if (!rawFile) {
//     return false;
//   }

//   const isJpg =
//     rawFile.type === 'image/jpeg' ||
//     rawFile.type === 'image/jpg';

//   if (!isJpg) {
//     alert('Solo se permiten imágenes JPEG (.jpg/.jpeg).');
//     return false;
//   }

//   const isLt2M = rawFile.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     alert('La imagen debe ser menor de 2MB.');
//     return false;
//   }

//   this.selectedFile = rawFile;

//   // IMPORTANTE: devolver false para evitar upload automático
//   return false;
// };

// handleFileChange(info: NzUploadChangeParam): void {
//   const rawFile = info.file.originFileObj as File;
//   if (rawFile) {
//     this.selectedFile = rawFile;
//   }
// }

//   // ----------------------------------------------------------------
//   // Botones del modal
//   // ----------------------------------------------------------------
//   onCancel(): void {
//     this.cancel.emit();
//     this.resetForm();
//   }

//   onOk(): void {
//     if (this.form.invalid) {
//       Object.values(this.form.controls).forEach(control => {
//         if (control.invalid) {
//           control.markAsDirty();
//           control.updateValueAndValidity();
//         }
//       });
//       return;
//     }

//     // Para crear, normalmente exigiríamos imagen; para editar, podrías permitir que sea opcional
//     if (!this.isEditMode && !this.selectedFile) {
//       alert('Debe seleccionar una imagen JPG para el hotel.');
//       return;
//     }

//     // Construimos FormData para enviar al backend como multipart/form-data
//     const formData = new FormData();
//     const raw = this.form.value;

//     // id (puede ser null o 0)
//     if (raw.id != null) {
//       formData.append('id', raw.id);
//     }

//     formData.append('nombre', raw.nombre);
//     formData.append('descripcion', raw.descripcion);
//     formData.append('sede', raw.sede);
//     formData.append('direccion', raw.direccion);

//     if (this.selectedFile) {
//       formData.append('foto', this.selectedFile);
//     }

//     this.save.emit(formData);
//   }

//   resetForm(): void {
//     this.form.reset();
//     this.selectedFile = null;
//   }
// }
