const express = require('express');
const bodyParser = require('body-parser');
const expressip = require('express-ip');
const cors = require('cors');
const { router } = require('./routes');

const PORT = process.env.PORT || 80;
const app = express();

app.use(cors());
app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} port...`);
});
