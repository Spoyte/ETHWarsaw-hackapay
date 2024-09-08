const { Pool } = require('pg');
const { config } = require('dotenv');

// Load environment variables
config();

// Create a new pool using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const database = {
  async getUnprocessedInvoices() {
    const query = `
      SELECT id, payer_address, amount, reason, due_date
      FROM invoices
      WHERE processed = false
      ORDER BY created_at ASC
      LIMIT 100
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      payerAddress: row.payer_address,
      amount: row.amount,
      reason: row.reason,
      dueDate: row.due_date,
    }));
  },

  async markInvoiceAsProcessed(invoiceId) {
    const query = `
      UPDATE invoices
      SET processed = true, processed_at = NOW()
      WHERE id = $1
    `;
    await pool.query(query, [invoiceId]);
  },

  async close() {
    await pool.end();
  },
};

module.exports = database;