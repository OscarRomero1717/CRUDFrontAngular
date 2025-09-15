import { Injectable } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { ModalMessageComponent } from '../components/modal-message/modal-message';

@Injectable({ providedIn: 'root' })
export class GlobalModalService {
  constructor(private modal: NzModalService) {}

  private create(type: 'success'|'error'|'warning'|'info', message: string, title?: string): NzModalRef {
    const ref = this.modal.create({
      nzTitle: title ?? undefined,
      nzContent: ModalMessageComponent,
     
      nzData: { type, title, message },
      nzOkText: 'Aceptar',
      nzCancelText: null,       
      nzMaskClosable: false,
      nzClosable: true,
      
    });
    return ref;
  }

  success(message: string, title?: string) {
    return this.create('success', message, title);
  }

  error(message: string, title?: string) {
    return this.create('error', message, title);
  }

  warning(message: string, title?: string) {
    return this.create('warning', message, title);
  }

  info(message: string, title?: string) {
    return this.create('info', message, title);
  }

  // confirm simple con callbacks
  confirm(
    title: string,
    content: string,
    onOk: () => void,
    onCancel?: () => void,
    okType: 'primary'|'danger' = 'primary'
  ) {
    this.modal.confirm({
      nzTitle: title,
      nzContent: content,
      nzOnOk: onOk,
      nzOnCancel: onCancel,
  
    });
  }
}
