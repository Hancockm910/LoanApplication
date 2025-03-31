import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanApplicationService } from './loan-application.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="overlay">
      <div class="modal">
        <h2>New Loan Application</h2>
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
          <label>
            Applicant Name:
            <input formControlName="applicant_name" required>
          </label>
          <label>
            Loan Amount:
            <input type="number" formControlName="loan_amount" required>
          </label>
          <label>
            Currency:
            <input formControlName="currency" required>
          </label>
          <label>
            Loan Purpose:
            <input formControlName="loan_purpose" required>
          </label>
          <label>
            Duration (months):
            <input type="number" formControlName="duration_months" required>
          </label>
          <label>
            Status:
            <select formControlName="status" required>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          <div class="buttons">
            <button type="submit" [disabled]="loanForm.invalid">Submit</button>
            <button type="button" (click)="closeForm()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      padding: 2rem;
      border-radius: 5px;
      max-width: 500px;
      width: 100%;
    }
    label {
      display: block;
      margin-bottom: 1rem;
    }
    input, select {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.25rem;
    }
    .buttons {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class LoanFormComponent {
  @Output() formClosed = new EventEmitter<boolean>();
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanApplicationService) {
    this.loanForm = this.fb.group({
      applicant_name: ['', Validators.required],
      loan_amount: [null, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      loan_purpose: ['', Validators.required],
      duration_months: [null, [Validators.required, Validators.min(1)]],
      status: ['Pending', Validators.required]
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.loanService.saveLoanApplication(this.loanForm.value).subscribe({
        next: (result) => {
          console.log('Loan application added:', result);
          // Emit true to signal successful submission (so parent can refresh the list if desired)
          this.formClosed.emit(true);
        },
        error: (error) => {
          console.error('Error adding loan application:', error);
        }
      });
    }
  }

  closeForm() {
    this.formClosed.emit(true);
  }
}
