import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoStatusComponent } from './io-status.component';

describe('IoStatusComponent', () => {
  let component: IoStatusComponent;
  let fixture: ComponentFixture<IoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IoStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
