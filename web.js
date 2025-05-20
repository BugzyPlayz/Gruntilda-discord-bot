const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Home page working!');
});

app.get('/callback', (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code found in the query.");
  }
  res.send(`Authorized! Your code: ${code}`);
  console.log("Callback received. Code:", code);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
