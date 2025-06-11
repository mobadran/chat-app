import express from 'express';
import { configDotenv } from 'dotenv';

configDotenv();
const PORT = process.env.PORT || 8001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('Response sadasentt');
});

app.listen(PORT, () => {
  console.log(`Port: ${PORT}\nLocal URL: http://localhost:${PORT}`);
});
