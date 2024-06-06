const express = require('express');
const { Pool } = require('pg');

// PostgreSQL configuration
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host', // This should be the private IP of your PostgreSQL instance
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// Create table if not exists
pool.query(
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100)
    );`,
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Table is successfully created');
      }
    }
  );

// Create Express app
const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Engagedly Assignment</h1>
        <h2>Enter your details:</h2>
        <form action="/" method="post">
          <label for="firstName">First Name:</label><br>
          <input type="text" id="firstName" name="firstName"><br>
          <label for="lastName">Last Name:</label><br>
          <input type="text" id="lastName" name="lastName"><br><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `);
});

// Handle form submission
app.post('/', async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    // Insert data into PostgreSQL database
    const query = 'INSERT INTO users (first_name, last_name) VALUES ($1, $2)';
    await pool.query(query, [firstName, lastName]);

    res.send('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
