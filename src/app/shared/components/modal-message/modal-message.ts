import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

type ModalType = 'success' | 'error' | 'warning' | 'info';

export interface ModalMessageData {
  type: ModalType;
  title?: string;
  message: string;
}

@Component({
  selector: 'app-modal-message',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './modal-message.html',
  styleUrls: ['./modal-message.scss']
})
export class ModalMessageComponent {
  constructor(
    @Inject(NZ_MODAL_DATA) public data: ModalMessageData,
    private modalRef: NzModalRef
  ) {}

  // asigna icono según tipo
  get iconName(): string {
    switch (this.data?.type) {
      case 'success': return 'check-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'exclamation-circle';
      default: return 'info-circle';
    }
  }

  // texto por defecto
  get title(): string {
    return this.data?.title ?? (this.data?.type === 'success' ? 'Éxito' :
                                this.data?.type === 'error' ? 'Error' :
                                this.data?.type === 'warning' ? 'Atención' : 'Información');
  }

  // cerrar (si quieres cerrar desde el contenido)
  close(result?: any) {
    this.modalRef.close(result);
  }
}
