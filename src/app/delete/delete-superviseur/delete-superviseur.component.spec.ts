import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSuperviseurComponent } from './delete-superviseur.component';

describe('DeleteSuperviseurComponent', () => {
  let component: DeleteSuperviseurComponent;
  let fixture: ComponentFixture<DeleteSuperviseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSuperviseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSuperviseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
