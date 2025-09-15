import { TestBed } from '@angular/core/testing';

import { GlobalModal } from './global-modal';

describe('GlobalModal', () => {
  let service: GlobalModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
