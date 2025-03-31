import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Import ViewChild and AfterViewInit
import { LoanApplication, LoanApplicationService } from './loan-application.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Import MatTableDataSource
import { MatSort, MatSortModule } from '@angular/material/sort'; // Import MatSort and MatSortModule
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSortModule // Add MatSortModule here
  ],
  template: `
    <mat-card>
      <mat-form-field appearance="fill" class="search-field">
        <mat-label>Search Loans</mat-label>
        <input matInput [(ngModel)]="searchTerm" (input)="applyFilter($event)" placeholder="Enter applicant name, purpose, etc.">
      </mat-form-field>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8"> <!-- Add matSort directive -->
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.id }}</td>
        </ng-container>

        <!-- Applicant Name Column -->
        <ng-container matColumnDef="applicant_name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.applicant_name }}</td>
        </ng-container>

        <!-- Amount Column -->
        <ng-container matColumnDef="loan_amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.loan_amount | number }}</td> <!-- Optional: Add number pipe for formatting -->
        </ng-container>

        <!-- Currency Column -->
        <ng-container matColumnDef="currency">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Currency</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.currency }}</td>
        </ng-container>

        <!-- Purpose Column -->
        <ng-container matColumnDef="loan_purpose">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Purpose</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.loan_purpose }}</td>
        </ng-container>

        <!-- Duration Column -->
        <ng-container matColumnDef="duration_months">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Duration (months)</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.duration_months }}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th> <!-- Add mat-sort-header -->
          <td mat-cell *matCellDef="let loan">{{ loan.status }}</td>
        </ng-container>

        <!-- Table Header and Rows -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
    <ng-template #noData>
      <p>No loan applications available.</p>
    </ng-template>
  `,
  styles: [`
    .search-field {
      width: 100%;
      margin-bottom: 16px; /* Add some space below the search bar */
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color:rgb(34, 88, 36);
      color: Green; /* Consider changing this to a more readable color like white or light grey */
    }
    th {
      cursor: pointer; /* Add pointer cursor to indicate sortable headers */
    }
  `]
})
export class LoanListComponent implements OnInit, AfterViewInit { // Implement AfterViewInit
  loanApplications: LoanApplication[] = [];
  dataSource = new MatTableDataSource<LoanApplication>([]); // Use MatTableDataSource
  searchTerm: string = '';
  displayedColumns: string[] = [
    'id',
    'applicant_name',
    'loan_amount',
    'currency',
    'loan_purpose',
    'duration_months',
    'status'
  ];

  @ViewChild(MatSort) sort!: MatSort; // Inject MatSort

  constructor(private loanService: LoanApplicationService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort; // Assign the sort instance to the data source
  }

  loadLoans() {
    this.loanService.getLoanApplications().subscribe({
      next: (response) => {
        this.loanApplications = response.loanApplications;
        this.dataSource.data = this.loanApplications; // Assign data to MatTableDataSource
        // No need to call applyFilter here unless searchTerm is pre-filled
      },
      error: (error) => {
        console.error('Error fetching loan applications:', error);
      }
    });
  }

  refresh() {
    this.loadLoans();
  }

  // Update applyFilter to work with MatTableDataSource
  applyFilter(event?: Event) { // Accept optional event
    let filterValue = '';
    if (event) {
      filterValue = (event.target as HTMLInputElement).value;
    } else {
      filterValue = this.searchTerm; // Use existing searchTerm if no event (e.g., initial load)
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) { // If using pagination, reset to first page
      this.dataSource.paginator.firstPage();
    }
  }
}
