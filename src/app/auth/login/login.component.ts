import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public isLoading$: Observable<boolean>;

  get loginFormControls() {
    return this.loginForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ]
       ],

       password: [
         '',
        [
          Validators.required,
          Validators.minLength(6),
        ]
       ],
    });
  }

  public onSubmit(form: NgForm) {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy() {
  //   this.loadingSubs.unsubscribe();
  // }

}
