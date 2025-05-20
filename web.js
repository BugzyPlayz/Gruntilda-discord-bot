const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Gruntilda’s Auth Server!');
});

app.get('/callback', (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not found in query.");
  }

  console.log("Spotify Authorization Code:", code);
  res.send(`✅ Authorization successful! Your code is:<br><code>${code}</code>`);
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).send(`404 Not Found: ${req.originalUrl}`);
});
