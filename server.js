const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

process.on('uncaughtException', (err) => {
  console.log('Something is not working.Server crashed!!');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('SERVER STARTED');
});