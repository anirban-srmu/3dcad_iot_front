import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineOeeComponent } from './machine-oee.component';

describe('MachineOeeComponent', () => {
  let component: MachineOeeComponent;
  let fixture: ComponentFixture<MachineOeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineOeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineOeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
