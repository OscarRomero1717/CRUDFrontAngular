import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    NzButtonModule
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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null, []], 
      codigo: [null, [Validators.required, Validators.min(1)]], 
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      refInterna: ['', [Validators.required, Validators.maxLength(100)]],
      precioUnitario: [null, [Validators.required, Validators.min(0.01)]],
      estado: [null, Validators.required],
      unidadMedida: ['', [Validators.required, Validators.maxLength(50)]],
      fechaCreacion: [null, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemData'] && this.itemData) {
      this.form.patchValue(this.itemData);
    } else if (changes['itemData'] && !this.itemData) {
      this.form.reset();
    }
  }

  disabledDate = (current: Date): boolean => {
    return current < new Date(new Date().setHours(0, 0, 0, 0));
  };

  onCancel(): void {
    this.cancel.emit();
  }

  onOk(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
    
  }

  resetForm(): void {
    this.form.reset();
  }
}
