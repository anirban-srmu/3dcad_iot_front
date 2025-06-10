import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSettingsComponent } from './machine-settings.component';

describe('MachineSettingsComponent', () => {
  let component: MachineSettingsComponent;
  let fixture: ComponentFixture<MachineSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
