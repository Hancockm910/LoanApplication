import { Component, OnInit } from '@angular/core';
import { LoanApplication, LoanApplicationService } from './loan-application.service';
import { CommonModule } from '@angular/common'; // Import CommonModule to access NgIf, NgFor, etc.

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Loan Applications</h2>
    <table *ngIf="loanApplications?.length; else noData">
      <thead>
        <tr>
          <th>ID</th>
          <th>Applicant Name</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Purpose</th>
          <th>Duration (months)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let loan of loanApplications">
          <td>{{ loan.id }}</td>
          <td>{{ loan.applicant_name }}</td>
          <td>{{ loan.loan_amount }}</td>
          <td>{{ loan.currency }}</td>
          <td>{{ loan.loan_purpose }}</td>
          <td>{{ loan.duration_months }}</td>
          <td>{{ loan.status }}</td>
        </tr>
      </tbody>
    </table>
    <ng-template #noData>
      <p>No loan applications available.</p>
    </ng-template>
  `,
  styles: [`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
  `]
})
export class LoanListComponent implements OnInit {
  loanApplications: LoanApplication[] = [];

  constructor(private loanService: LoanApplicationService) {}

  ngOnInit(): void {
    this.loanService.getLoanApplications().subscribe({
      next: (response) => {
        this.loanApplications = response.loanApplications;
      },
      error: (error) => {
        console.error('Error fetching loan applications:', error);
      }
    });
  }
}
