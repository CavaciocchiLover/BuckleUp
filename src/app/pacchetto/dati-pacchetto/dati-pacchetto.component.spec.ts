import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiPacchettoComponent } from './dati-pacchetto.component';

describe('DatiPacchettoComponent', () => {
  let component: DatiPacchettoComponent;
  let fixture: ComponentFixture<DatiPacchettoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatiPacchettoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatiPacchettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
