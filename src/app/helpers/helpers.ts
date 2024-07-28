import { AbstractControl } from '@angular/forms';
import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { Buffer } from 'buffer';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class Helpers {
  constructor(
    private sanitized: DomSanitizer
  ) { }

  // For Base64
  encodeBase64 = (data: string) => Buffer.from(data).toString('base64');
  decodeBase64 = (data: string) => Buffer.from(data, 'base64').toString('ascii');

  copyObject(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }

  public checkErrorFormControl(control: AbstractControl) {
    return (control.dirty || control.touched) && control.errors
  }

  public showErrorFormControl(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched)
  }

}
