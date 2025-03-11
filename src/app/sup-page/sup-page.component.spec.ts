import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupPageComponent } from './sup-page.component';

describe('SupPageComponent', () => {
  let component: SupPageComponent;
  let fixture: ComponentFixture<SupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
