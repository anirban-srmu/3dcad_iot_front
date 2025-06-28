import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastMessageComponent } from "src/app/toast-message/toast-message.component";
import { ApiService } from "./api.service";
import { NavigationEnd, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { filter } from "rxjs";
import { SessionService } from "src/app/shared/configuration/SessionService";

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [ToastMessageComponent, FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  loginForm: FormGroup;
  spinner: boolean = false;
  loading: boolean = false;
  currentForm: string = 'login';
  errorMessage: string | undefined;
  captcha: string = '';
  captchaError: boolean = false;
  rfidInput: string = '';
  rfidScanInProgress: boolean = false;
  private rfidInputTimeout: any;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      role: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.clear();
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

    this.setupRfidListener();
  }

  ngOnDestroy(): void {
    document.removeEventListener('keypress', this.handleKeyPress.bind(this));
    if (this.rfidInputTimeout) {
      clearTimeout(this.rfidInputTimeout);
    }
  }

  setupRfidListener(): void {
    document.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  handleKeyPress(event: KeyboardEvent): void {
    if ((event.target as HTMLElement).tagName.toLowerCase() === 'input') {
      return;
    }


    this.rfidInput += event.key;


    if (this.rfidInputTimeout) {
      clearTimeout(this.rfidInputTimeout);
    }


    this.rfidInputTimeout = setTimeout(() => {
      if (this.rfidInput.length > 5) {
        this.processRfidLogin();
      }
      this.rfidInput = '';
    }, 300);
  }

  processRfidLogin(): void {
    if (this.rfidScanInProgress) return;

    this.rfidScanInProgress = true;
    const rfidTag = this.rfidInput.trim();

    if (!rfidTag) {
      this.rfidScanInProgress = false;
      return;
    }

    this.spinner = true;
    this.apiService.loginWithRfid(rfidTag).then(
      (data: any) => this.handleSuccessfulLogin(data),
      (error: any) => {
        this.handleLoginError(error);
        this.rfidScanInProgress = false;
      }
    ).finally(() => {
      this.spinner = false;
      this.rfidScanInProgress = false;
    });
  }

  submitLoginForm(): void {
    if (this.loginForm.invalid) {
      this.triggerToast('Invalid', 'Please fill out all required fields.', 'warning');
      return;
    }
    this.spinner = true;
    const data = {
      role: this.loginForm.controls['role'].value,
      Username: this.loginForm.controls['username'].value,
      Password: this.loginForm.controls['password'].value,
      Process: ''
    }
    this.apiService.login(data).then(
      (data: any) => this.handleSuccessfulLogin(data),
      (error: any) => this.handleLoginError(error)
    ).finally(() => this.spinner = false);
  }

  triggerToast(header: string, body: string, type: string): void {
    this.toastMessageComponent.showToast(header, body, type);
  }

  private async handleSuccessfulLogin(data: any): Promise<void> {
    if (data) {
      this.triggerToast('Login', data.message, 'success');
      sessionStorage.setItem('data', JSON.stringify(data));
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.router.navigate(['/dashboard']);
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
}