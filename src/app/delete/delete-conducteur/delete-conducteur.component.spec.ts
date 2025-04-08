import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConducteurComponent } from './delete-conducteur.component';

describe('DeleteConducteurComponent', () => {
  let component: DeleteConducteurComponent;
  let fixture: ComponentFixture<DeleteConducteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteConducteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConducteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
