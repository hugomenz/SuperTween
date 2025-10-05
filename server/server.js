// server.js - Minimal Express server for Stripe payments
import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import 'dotenv/config';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-06-20'
});

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: process.env.NODE_ENV || 'test' });
});

// Create Checkout Session
app.post('/api/checkout', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const sessionConfig = {
      mode: 'payment',
      customer_email: email,
      success_url: process.env.SUCCESS_URL || 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3000/cancel',
    };
    
    // Use PRICE_ID if available, otherwise create inline price
    if (process.env.PRICE_ID) {
      sessionConfig.line_items = [
        { price: process.env.PRICE_ID, quantity: 1 }
      ];
    } else {
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 1900, // €19.00
            product_data: {
              name: 'SPTween Pro — Compra única',
              description: 'Desbloquea todas las funciones PRO'
            }
          },
          quantity: 1
        }
      ];
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Generate license key
    const email = session.customer_details?.email || 'unknown@email.com';
    const license = crypto.createHash('sha256')
      .update(email + '|' + session.id + '|' + process.env.LICENSE_SECRET || 'secret')
      .digest('hex');
    
    console.log('Payment completed:', {
      email,
      license,
      sessionId: session.id,
      amount: session.amount_total
    });
    
    // TODO: Save license to database
    // For now, just log it
    // In production, you would:
    // 1. Save to database
    // 2. Send email with license key
    // 3. Log for analytics
  }
  
  res.json({ received: true });
});

// Validate license endpoint
app.get('/api/license/validate', async (req, res) => {
  const { license, email } = req.query;
  
  if (!license || !email) {
    return res.status(400).json({ valid: false, error: 'License and email required' });
  }
  
  // TODO: Check against database
  // For demo purposes, accept any 64-char hex string
  const isValidFormat = /^[a-f0-9]{64}$/.test(license);
  
  res.json({ valid: isValidFormat });
});

// Success page
app.get('/success', (req, res) => {
  const sessionId = req.query.session_id;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pago Completado - SPTween</title>
      <style>
        body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
        h1 { color: #10b981; }
        .info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>✓ ¡Gracias por tu compra!</h1>
      <div class="info">
        <p>Tu pago se ha completado correctamente.</p>
        <p>Recibirás tu <strong>licencia PRO</strong> por email en los próximos minutos.</p>
        <p style="font-size: 12px; color: #666;">ID de sesión: ${sessionId}</p>
      </div>
      <p><a href="/">Volver al inicio</a></p>
    </body>
    </html>
  `);
});

// Cancel page
app.get('/cancel', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pago Cancelado - SPTween</title>
      <style>
        body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
        h1 { color: #ef4444; }
      </style>
    </head>
    <body>
      <h1>Pago Cancelado</h1>
      <p>Has cancelado el proceso de pago.</p>
      <p><a href="/">Volver al inicio</a></p>
    </body>
    </html>
  `);
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.listen(PORT, () => {
  console.log(`SPTween server running on http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'test'}`);
  console.log('Press Ctrl+C to stop');
});
