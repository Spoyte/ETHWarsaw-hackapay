const createRequest = require('./createRequest');
const db = require('./dbModule'); // Replace with your actual database module

export async function createMultipleRequests() {
  const invoices = await db.getUnprocessedInvoices(); // Fetch invoices from your database

  for (const invoice of invoices) {
    try {
      const requestData = await createRequest(
        invoice.payerAddress,
        invoice.amount,
        invoice.reason,
        invoice.dueDate
      );
      console.log(`Request created for invoice ${invoice.id}:`, JSON.stringify(requestData));
      await db.markInvoiceAsProcessed(invoice.id); // Update the invoice status in your database
    } catch (error) {
      console.error(`Error creating request for invoice ${invoice.id}:`, error);
    }
  }
}

createMultipleRequests();