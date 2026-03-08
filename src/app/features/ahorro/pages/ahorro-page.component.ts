//Reactive Forms para el formulario de ahorro, con validaciones y métodos para acceder a los controles del formulario.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ahorro-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ahorro-page.component.html',
  styleUrl: './ahorro-page.component.css',
})
export class AhorroPageComponent {
  ahorroForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ahorroForm = this.fb.group({
      nombreAhorro: ['', [Validators.required, Validators.minLength(3)]],
      descripcionAhorro: ['', [Validators.required, Validators.minLength(5)]],
      ahorroMensual: [null, [Validators.required, Validators.min(1)]],
      meses: [null, [Validators.required, Validators.min(1)]],
      meta: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.ahorroForm.invalid) {
      this.ahorroForm.markAllAsTouched();
      return;
    }

    console.log('Formulario válido:', this.ahorroForm.value);
  }

  get nombreAhorroControl() {
    return this.ahorroForm.get('nombreAhorro');
  }

  get descripcionAhorroControl() {
    return this.ahorroForm.get('descripcionAhorro');
  }

  get ahorroMensualControl() {
    return this.ahorroForm.get('ahorroMensual');
  }

  get mesesControl() {
    return this.ahorroForm.get('meses');
  }

  get metaControl() {
    return this.ahorroForm.get('meta');
  }
}
