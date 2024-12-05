import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { debounceTime, Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { SignupDataModel } from '../auth.model';

const savedForm = localStorage.getItem('saved-signup-info');
let initialUsername = '';
let initialEmail = '';
if (savedForm) {
  const signupInfo = JSON.parse(savedForm);
  initialUsername = signupInfo.username;
  initialEmail = signupInfo.email;
}

function emailIsUnique(
  control: AbstractControl
): Observable<null | { notUnique: boolean }> {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({ notUnique: true });
}

function mustContainQuestionMark(
  control: AbstractControl
): null | { doesNotContainQuestionMark: boolean } {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {}

  signupObj: SignupDataModel = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  form = new FormGroup({
    username: new FormControl(initialUsername, {
      validators: [Validators.required],
      updateOn: 'change',
    }),
    email: new FormControl(initialEmail, {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get usernameIsInvalid(): boolean {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }

  get emailIsInvalid(): boolean {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid(): boolean {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  get confirmPasswordIsInvalid(): boolean {
    return (
      this.form.controls.confirmPassword.touched &&
      this.form.controls.confirmPassword.dirty &&
      this.form.controls.confirmPassword.invalid
    );
  }

  ngOnInit(): void {
    // const savedForm = localStorage.getItem('saved-signup-info');
    // if (savedForm) {
    //   const signupInfo = JSON.parse(savedForm);
    //   this.form.patchValue({
    //     username: signupInfo.username,
    //     email: signupInfo.email
    //   });
    // }
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) =>
          localStorage.setItem(
            'saved-signup-info',
            JSON.stringify({
              username: value.username,
              email: value.email,
            })
          ),
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSignup(): void {
    debugger;
    console.log(this.form);
    this.signupObj = this.form.value as SignupDataModel;
    console.log(this.signupObj);

    // if (this.authService.signup()) {
    //   // this.router.navigateByUrl('/dashboard');
    // }
  }
}
