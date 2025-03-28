const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./loan_app.db');

const seedData = [
  { applicant_name: "Alice Smith", loan_amount: 8000, currency: "USD", loan_purpose: "Car Purchase", duration_months: 36, status: "Approved" },
  { applicant_name: "Bob Johnson", loan_amount: 15000, currency: "USD", loan_purpose: "Home Improvement", duration_months: 60, status: "Pending" },
  { applicant_name: "Carol White", loan_amount: 12000, currency: "USD", loan_purpose: "Education", duration_months: 48, status: "Approved" },
  { applicant_name: "David Brown", loan_amount: 5000, currency: "USD", loan_purpose: "Medical Expenses", duration_months: 12, status: "Rejected" },
  { applicant_name: "Eva Green", loan_amount: 20000, currency: "USD", loan_purpose: "Business Expansion", duration_months: 72, status: "Approved" },
  { applicant_name: "Frank Black", loan_amount: 3000, currency: "USD", loan_purpose: "Vacation", duration_months: 6, status: "Pending" },
  { applicant_name: "Grace Miller", loan_amount: 9000, currency: "USD", loan_purpose: "Debt Consolidation", duration_months: 24, status: "Approved" },
  { applicant_name: "Henry Wilson", loan_amount: 11000, currency: "USD", loan_purpose: "Home Purchase", duration_months: 60, status: "Pending" },
  { applicant_name: "Ivy Davis", loan_amount: 7000, currency: "USD", loan_purpose: "Wedding", duration_months: 18, status: "Approved" }
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO loan_applications 
    (applicant_name, loan_amount, currency, loan_purpose, duration_months, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  seedData.forEach(loan => {
    stmt.run(
      loan.applicant_name,
      loan.loan_amount,
      loan.currency,
      loan.loan_purpose,
      loan.duration_months,
      loan.status,
      err => {
        if (err) console.error(err);
      }
    );
  });
  
  stmt.finalize(err => {
    if (err) {
      console.error("Error finalizing statement:", err.message);
    } else {
      console.log("Seed data inserted successfully.");
    }
    db.close();
  });
});
