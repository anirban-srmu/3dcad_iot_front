import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPolicyComponent } from './access-policy.component';

describe('AccessPolicyComponent', () => {
  let component: AccessPolicyComponent;
  let fixture: ComponentFixture<AccessPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
