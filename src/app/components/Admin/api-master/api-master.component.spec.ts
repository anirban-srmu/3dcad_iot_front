import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiMasterComponent } from './api-master.component';

describe('ApiMasterComponent', () => {
  let component: ApiMasterComponent;
  let fixture: ComponentFixture<ApiMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
