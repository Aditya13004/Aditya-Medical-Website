# Aditya Medical Backend Setup (Windows PowerShell)

1) Create your .env from template

Copy .env.example to .env and set your values:

- MONGODB_URI: e.g. mongodb://localhost:27017/aditya_medical or MongoDB Atlas connection string
- JWT_SECRET: any long random string
- PORT: 3000 (default)
- FRONTEND_URL: leave empty if serving frontend from same server, otherwise set your origin

2) Install dependencies

If node_modules are not installed:

```
# from the project root
npm install
```

3) Start MongoDB

- Local MongoDB: Ensure the MongoDB service is running, or start it with MongoDB Compass/Service Manager.
- Atlas: Make sure your IP is whitelisted and MONGODB_URI is correct.

4) Seed sample medicines

```
npm run seed
```

5) Run the server

```
# Development
npm run dev

# Or production
npm start
```

The server prints:
- API base: http://localhost:3000/api
- Health:    http://localhost:3000/api/health

6) API summary

- POST /api/auth/signup
  Body: { name, email, password, phone, age, gender }
  => { token, user }

- POST /api/auth/login
  Body: { email, password }
  => { token, user }

- GET  /api/medicines
  => { data: [ { name, diseases[], dosage, duration, price, type, prescription, sideEffects[], warnings[] } ] }

- POST /api/consult
  Body: { symptoms: string[] | string, disease?: string }
  => { results: [ { disease, confidence, medicines[], warnings[], disclaimer } ] }

- POST /api/orders  (alias: /api/order)
  Body: { items: [{ name, price, quantity }], customer?, address?, payment? }
  => { orderId, order }

Auth notes:
- Include Authorization: Bearer <token> for endpoints that should be tied to a patient user (orders support optional auth).

7) Frontend integration

- ai-recommendations.html now calls POST /api/consult and renders results.
- When a user clicks Add to Cart, the app also calls POST /api/order to persist the selection; your existing cart UI remains intact.
- A disclaimer is shown: "This is AI-generated advice. Please consult a doctor before using any medicine."

Troubleshooting
- ECONNREFUSED 127.0.0.1:27017 => Start MongoDB locally or set MONGODB_URI to Atlas in .env.
- CORS => If serving frontend from another origin, set FRONTEND_URL in .env.
