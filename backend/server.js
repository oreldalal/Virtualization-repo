const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// חיבור ל־Postgres
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', // או 'postgres' אם בקונטיינר
  database: process.env.DB_NAME || 'messagesdb',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// יצירת טבלה אם לא קיימת
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT
      )
    `);
    console.log('טבלת messages מוכנה');
  } catch (err) {
    console.error('שגיאה ביצירת הטבלה:', err);
  }
})();

// קבלת ההודעה האחרונה
app.get('/api/message', async (req, res) => {
  try {
    const result = await pool.query('SELECT content FROM messages ORDER BY id DESC LIMIT 1');
    if (result.rows.length > 0) {
      res.json({ message: result.rows[0].content });
    } else {
      res.json({ message: 'אין הודעות' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בטעינת ההודעה' });
  }
});

// שליחת הודעה חדשה
app.post('/api/message', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'אין תוכן להוסיף' });

  try {
    await pool.query('INSERT INTO messages (content) VALUES ($1)', [content]);
    res.json({ message: 'הודעה נוספה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בשמירת ההודעה' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

