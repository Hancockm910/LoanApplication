const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the SQLite database (creates the file if it doesn't exist)
const db = new sqlite3.Database('./loan_app.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create the loan_applications table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS loan_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_name TEXT NOT NULL,
    loan_amount REAL,
    currency TEXT,
    loan_purpose TEXT,
    duration_months INTEGER,
    status TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Loan applications table is ready.');
  }
});

// GET endpoint to retrieve all loan applications
app.get('/loan-applications', (req, res) => {
  db.all('SELECT * FROM loan_applications', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ loanApplications: rows });
    }
  });
});

// POST endpoint to create a new loan application
app.post('/loan-applications', (req, res) => {
  const { applicant_name, loan_amount, currency, loan_purpose, duration_months, status } = req.body;
  db.run(
    `INSERT INTO loan_applications (applicant_name, loan_amount, currency, loan_purpose, duration_months, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [applicant_name, loan_amount, currency, loan_purpose, duration_months, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
