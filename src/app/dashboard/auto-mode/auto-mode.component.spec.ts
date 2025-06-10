import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoModeComponent } from './auto-mode.component';

describe('AutoModeComponent', () => {
  let component: AutoModeComponent;
  let fixture: ComponentFixture<AutoModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
