import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmMasterComponent } from './alarm-master.component';

describe('AlarmMasterComponent', () => {
  let component: AlarmMasterComponent;
  let fixture: ComponentFixture<AlarmMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlarmMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
