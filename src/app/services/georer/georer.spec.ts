import { TestBed } from '@angular/core/testing';
import { Georer } from './georer';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('Georer', () => {
  let service: Georer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Georer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
