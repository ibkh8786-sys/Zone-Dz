const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const contactsFile = path.join(dataDir, 'contactMessages.json');
const supportFile = path.join(dataDir, 'supportMessages.json');
const notificationsFile = path.join(dataDir, 'notifications.json');

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

app.post('/api/notify', (req, res) => {
  try {
    const notifications = readJson(notificationsFile);
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      order: req.body.order || null,
      contacts: req.body.contacts || null,
      status: 'queued'
    };
    notifications.push(entry);
    writeJson(notificationsFile, notifications);
    console.log('Queued notification:', entry);
    // In a real deployment you'd call WhatsApp/Facebook APIs here
    res.json({ ok: true, entry });
  } catch (err) {
    console.error('Notify error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get('/api/notifications', (req, res) => {
  res.json(readJson(notificationsFile));
});

app.post('/api/notifications/mark', (req, res) => {
  try {
    const notifications = readJson(notificationsFile);
    const { id, status } = req.body || {};
    const idx = notifications.findIndex(n => String(n.id) === String(id));
    if (idx === -1) return res.status(404).json({ ok: false, error: 'not found' });
    notifications[idx].status = status || 'sent';
    notifications[idx].sentAt = new Date().toISOString();
    writeJson(notificationsFile, notifications);
    res.json({ ok: true, notification: notifications[idx] });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Zone DZ local server running at http://localhost:${port}`);
});
