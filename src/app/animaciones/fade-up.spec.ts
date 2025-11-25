import { ElementRef, Renderer2 } from '@angular/core';
import { FadeUp } from './fade-up'; 

describe('FadeUp', () => {
  it('should create an instance', () => {
    
    const mockElementRef = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    const mockRenderer = jasmine.createSpyObj('Renderer2', ['setStyle']);

    const directive = new FadeUp(mockElementRef, mockRenderer);
    
    expect(directive).toBeTruthy();
  });
});