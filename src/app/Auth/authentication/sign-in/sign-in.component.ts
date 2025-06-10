import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastMessageComponent } from "src/app/toast-message/toast-message.component";
import { ApiService } from "./api.service";
import { NavigationEnd, Router } from "@angular/router";
import { CommonModule, PlatformLocation } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { AppModule } from "src/app/app.module";
import { filter } from "rxjs";
import { EncryptionService } from "src/app/shared/configuration/EncryptionService";
import { SessionService } from "src/app/shared/configuration/SessionService";



@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [ToastMessageComponent, FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  loginForm: FormGroup;
  spinner: boolean = false;
  loading: boolean = false;
  currentForm: string = 'login';
  errorMessage: string | undefined;
  captcha: string = '';
  captchaError: boolean = false;
  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,

  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.clear();
    // Call the logout method from ApiService
    this.apiService.logout();

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/auth/signin') {
          sessionStorage.clear();
          localStorage.clear();
          this.apiService.logout();
        }
      });
  }
  submitLoginForm(): void {
    if (this.loginForm.invalid) {
      this.triggerToast('Invalid', 'Please fill out all required fields.', 'warning');
      return;
    }
    this.spinner = true;
    const loginData = { ...this.loginForm.value }; 
    delete loginData.captchaInput;
  //  const jsonString = JSON.stringify(loginData);
    const data = {
      Username: this.loginForm.controls['username'].value,
      Password: this.loginForm.controls['password'].value,
      Process:''
    }
    this.apiService.login(data).then(
      (data: any) => this.handleSuccessfulLogin(data),
      (error: any) => this.handleLoginError(error)
    ).finally(() => this.spinner = false);
  }
  triggerToast(header: string, body: string, type: string): void {
    this.toastMessageComponent.showToast(header, body, type);
    
  }

  checkLoginStatus() {

  }
  token: any
  username: any;
  oldPassword: any;
  private async handleSuccessfulLogin(data: any): Promise<void> {
    if (data.token) {
      this.triggerToast('Login', data.message, 'success');
      sessionStorage.setItem('accessToken', data.token);
    }
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for toast to show
    this.router.navigate(['/dashboard']); // Change '/dashboard' to your desired route

  }


  handleLoginError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 429) {
        this.triggerToast('Error', 'Too many login attempts. Please try again later.', 'danger');
      } else if (error.status === 400) {
        const errorMessage = error.error?.msg || 'Invalid credentials. Please check your input.';
        this.triggerToast('Invalid', errorMessage, 'danger');
      } else {
        this.triggerToast('Error', 'An unexpected error occurred. Please try again later.', 'danger');
      }
    } else {
      this.triggerToast('Error', 'A non-HTTP error occurred. Please try again later.', 'danger');
    }
  }

  getSecureFileUrl(filename: string): string {
    return `/assets/secure/${filename}`;
  }
  tokenStatus: boolean | undefined;





}
