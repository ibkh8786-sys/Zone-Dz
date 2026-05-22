const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const contactsFile = path.join(dataDir, 'contactMessages.json');
const supportFile = path.join(dataDir, 'supportMessages.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Read JSON error:', err);
    return [];
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Write JSON error:', err);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/orders', (req, res) => {
  res.json(readJson(ordersFile));
});

app.post('/api/orders', (req, res) => {
  const orders = readJson(ordersFile);
  const order = { id: Date.now(), status: 'قيد الانتظار', ...req.body };
  orders.push(order);
  writeJson(ordersFile, orders);
  res.json({ ok: true, order });
});

app.get('/api/contact-messages', (req, res) => {
  res.json(readJson(contactsFile));
});

app.post('/api/contact-messages', (req, res) => {
  const contacts = readJson(contactsFile);
  const message = { id: Date.now(), ...req.body };
  contacts.push(message);
  writeJson(contactsFile, contacts);
  res.json({ ok: true, message });
});

app.get('/api/support-messages', (req, res) => {
  res.json(readJson(supportFile));
});

app.post('/api/support-messages', (req, res) => {
  const messages = readJson(supportFile);
  const message = { id: Date.now(), ...req.body };
  messages.push(message);
  writeJson(supportFile, messages);
  res.json({ ok: true, message });
});

app.listen(port, () => {
  console.log(`Zone DZ local server running at http://localhost:${port}`);
});
