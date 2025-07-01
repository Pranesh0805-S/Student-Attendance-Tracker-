const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// In-memory user list
let users = [
  {
    name: 'Default Student',
    email: 'student@example.com',
    password: '123456'
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Register Route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  users.push({ name, email, password });
  console.log('✅ Registered Users:', users);
  return res.status(201).json({ message: 'Registration successful!' });
});

// ✅ Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const matchedUser = users.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (matchedUser) {
    return res.status(200).json({
      message: 'Login successful!',
      name: matchedUser.name
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
