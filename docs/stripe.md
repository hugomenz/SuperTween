# Stripe Payment Integration — SPTween PRO

This guide explains how to integrate Stripe Checkout for one-time payments to unlock SPTween PRO features.

## Overview

- **Payment Type**: One-time payment (no subscription)
- **Mode**: Test mode (sandbox) for development
- **Product**: SPTween PRO License
- **Price**: €19.00 (configurable)
- **Payment Method**: Credit card via Stripe Checkout

## Prerequisites

1. **Stripe Account**: Create at https://stripe.com
2. **Test Mode**: Ensure you're in test mode (toggle in Stripe Dashboard)
3. **Node.js**: Version 18+ installed
4. **Environment Variables**: See setup below

## Setup

### 1. Get Stripe Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment

Navigate to `server/` directory and create `.env` file:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your Stripe keys:

```env
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PRICE_ID=price_your_price_id_here

# URLs
SUCCESS_URL=http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}
CANCEL_URL=http://localhost:3000/cancel

# License Secret (generate random string)
LICENSE_SECRET=change_this_to_random_string

# Server
PORT=3000
NODE_ENV=test
```

### 3. Create Product and Price (Optional)

You can either:

**Option A**: Let the code create an inline price (default)
- Price: €19.00
- No action needed

**Option B**: Create a Price in Stripe Dashboard
1. Go to Products → Create product
2. Name: "SPTween Pro"
3. Price: €19.00 (one-time)
4. Copy the Price ID (starts with `price_`)
5. Add to `.env` as `PRICE_ID`

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Server

```bash
npm start
```

Server will run on http://localhost:3000

## Testing Payments

### Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires authentication |

**Expiry**: Any future date (e.g., 12/34)
**CVC**: Any 3 digits (e.g., 123)
**ZIP**: Any 5 digits (e.g., 12345)

### Test Flow

1. Open http://localhost:3000
2. Enter email address
3. Click "Comprar Ahora"
4. Enter test card: `4242 4242 4242 4242`
5. Complete payment
6. Redirected to success page

## Webhooks

Webhooks notify your server when events occur (e.g., payment completed).

### Local Development

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Other: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret
5. Update production `.env`

## License Generation

When a payment is completed, the server generates a license key:

```javascript
const license = crypto.createHash('sha256')
  .update(email + '|' + sessionId + '|' + LICENSE_SECRET)
  .digest('hex');
```

This produces a 64-character hex string, e.g.:
```
a1b2c3d4e5f6...
```

### Storing Licenses

Currently, licenses are logged to console. In production, you should:

1. **Database**: Store in PostgreSQL, MySQL, or MongoDB
   ```sql
   CREATE TABLE licenses (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     license_key VARCHAR(64) UNIQUE NOT NULL,
     session_id VARCHAR(255),
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Email**: Send license key to customer
   ```javascript
   await sendEmail({
     to: email,
     subject: 'Your SPTween PRO License',
     body: `Your license key: ${license}`
   });
   ```

## License Validation

The extension validates licenses via API:

```javascript
GET /api/license/validate?license=abc123&email=user@example.com

Response:
{
  "valid": true | false
}
```

### Implementation

In `server.js`, implement validation logic:

```javascript
app.get('/api/license/validate', async (req, res) => {
  const { license, email } = req.query;
  
  // Check database
  const result = await db.query(
    'SELECT * FROM licenses WHERE license_key = $1 AND email = $2 AND status = $3',
    [license, email, 'active']
  );
  
  res.json({ valid: result.rows.length > 0 });
});
```

## Extension Integration

### Activate License

In the extension, add a settings UI to enter license:

```javascript
// sidepanel/app.js
async function activateLicense(license, email) {
  const response = await fetch(
    `https://yourserver.com/api/license/validate?license=${license}&email=${email}`
  );
  const data = await response.json();
  
  if (data.valid) {
    config.proActivo = true;
    config.license = license;
    await saveConfig();
    alert('✓ License activated!');
  } else {
    alert('Invalid license');
  }
}
```

### Check License on Startup

```javascript
async function checkLicense() {
  if (config.license && config.email) {
    const response = await fetch(
      `https://yourserver.com/api/license/validate?license=${config.license}&email=${config.email}`
    );
    const data = await response.json();
    config.proActivo = data.valid;
    await saveConfig();
  }
}
```

## Going to Production

### Checklist

- [ ] Switch to **Live mode** in Stripe Dashboard
- [ ] Update `.env` with live keys:
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `PRICE_ID=price_...` (live price)
- [ ] Set production URLs:
  - `SUCCESS_URL=https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}`
  - `CANCEL_URL=https://yourdomain.com/cancel`
- [ ] Create production webhook endpoint
- [ ] Update `STRIPE_WEBHOOK_SECRET` with live webhook secret
- [ ] Deploy server to production (Heroku, Vercel, Railway, etc.)
- [ ] Update extension with production API URL
- [ ] Test with real card (small amount)
- [ ] Add legal pages: Terms, Privacy, Refund Policy
- [ ] Enable HTTPS (required for production)

### Legal Requirements

Before accepting real payments:

1. **Terms of Service**: Define what PRO includes
2. **Privacy Policy**: How you handle data
3. **Refund Policy**: Refund timeframe and conditions
4. **Display Price with Tax**: Show VAT/tax if applicable

### Security Best Practices

- ✅ Never expose secret keys in extension code
- ✅ Always validate webhooks with signature
- ✅ Use HTTPS in production
- ✅ Rate-limit API endpoints
- ✅ Log all transactions
- ✅ Implement fraud detection (Stripe Radar)

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint is publicly accessible
2. Verify webhook secret matches `.env`
3. Check Stripe Dashboard → Webhooks → Recent deliveries
4. Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Payment Fails

1. Check Stripe logs in Dashboard
2. Verify test card number is correct
3. Check for JavaScript errors in browser console
4. Ensure server is running

### License Validation Fails

1. Verify API endpoint is accessible
2. Check license format (64-char hex)
3. Verify email matches payment email
4. Check database for license record

## API Reference

### POST /api/checkout

Create a Stripe Checkout session.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

### POST /api/webhook

Receive Stripe webhook events.

**Headers:**
```
stripe-signature: t=...,v1=...
```

**Events:**
- `checkout.session.completed`: Payment successful

### GET /api/license/validate

Validate a license key.

**Query Params:**
- `license`: License key (64-char hex)
- `email`: Customer email

**Response:**
```json
{
  "valid": true | false
}
```

## Cost Estimate

Stripe Fees (Test mode = free, Production):
- **Europe**: 1.4% + €0.25 per transaction
- **US**: 2.9% + $0.30 per transaction

For €19.00 purchase:
- Fee: ~€0.52
- Net: ~€18.48

## Alternative Payment Providers

Instead of Stripe, you could use:
- **Paddle**: Handles VAT/tax for you
- **Gumroad**: Simple setup, higher fees
- **LemonSqueezy**: Merchant of record
- **PayPal**: Widely accepted

## FAQ

**Q: Do I need a business to accept payments?**
A: Depends on your country. Stripe may require business registration.

**Q: Can I offer refunds?**
A: Yes, via Stripe Dashboard or API. Refunds can be full or partial.

**Q: How do I handle VAT/sales tax?**
A: Stripe can calculate tax automatically with Stripe Tax (additional setup).

**Q: What if a customer loses their license?**
A: Store licenses in database and provide recovery via email lookup.

**Q: Can I offer trials?**
A: Not with one-time payment. Consider temporary free tier instead.

**Q: Is subscription better than one-time?**
A: Depends on your business model. Subscriptions provide recurring revenue.

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Test Cards](https://stripe.com/docs/testing)

---

Need help? Open an issue on GitHub or contact support.
