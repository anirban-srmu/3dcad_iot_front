import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmScreenComponent } from './alarm-screen.component';

describe('AlarmScreenComponent', () => {
  let component: AlarmScreenComponent;
  let fixture: ComponentFixture<AlarmScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlarmScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
