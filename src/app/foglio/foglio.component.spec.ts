import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoglioComponent } from './foglio.component';

describe('FoglioComponent', () => {
  let component: FoglioComponent;
  let fixture: ComponentFixture<FoglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoglioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
