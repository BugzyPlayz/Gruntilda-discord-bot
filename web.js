const express = require('express');
const app = express();

app.get('/callback', (req, res) => {
  const code = req.query.code;
  res.send(`Authorized! Your code: ${code}`);
  console.log("Callback received. Code:", code);
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/callback');
});
