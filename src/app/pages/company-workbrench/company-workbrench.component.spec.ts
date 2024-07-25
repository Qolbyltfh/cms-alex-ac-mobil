import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWorkbrenchComponent } from './company-workbrench.component';

describe('CompanyWorkbrenchComponent', () => {
  let component: CompanyWorkbrenchComponent;
  let fixture: ComponentFixture<CompanyWorkbrenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyWorkbrenchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyWorkbrenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
