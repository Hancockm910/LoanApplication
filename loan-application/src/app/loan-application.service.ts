import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanApplication {
  id: number;
  applicant_name: string;
  loan_amount: number;
  currency: string;
  loan_purpose: string;
  duration_months: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private apiUrl = 'http://localhost:3000/loan-applications';

  constructor(private http: HttpClient) {}

  getLoanApplications(): Observable<{ loanApplications: LoanApplication[] }> {
    return this.http.get<{ loanApplications: LoanApplication[] }>(this.apiUrl);
  }

  saveLoanApplication(application: LoanApplication): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(this.apiUrl, application);
  }
}
