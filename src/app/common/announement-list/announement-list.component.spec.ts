import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounementListComponent } from './announement-list.component';

describe('AnnounementListComponent', () => {
  let component: AnnounementListComponent;
  let fixture: ComponentFixture<AnnounementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnounementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnounementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
