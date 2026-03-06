# AutoPulse - Vehicle Intelligence Platform

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to AWS Amplify

1. Create new GitHub repo: `autopulse`
2. Push this code
3. AWS Console -> Amplify -> New App -> GitHub
4. Select repo, branch: main
5. Build settings auto-detected from amplify.yml
6. Deploy

## Architecture

```
[User] -> [Next.js on Amplify]
              |
              +-> [NHTSA API] (free, no key)
              +-> [WMI Offline DB] (130+ manufacturers)
              +-> [DynamoDB Cache] (Phase 2)
```

## Stage 1 (Current)
- Static Next.js 15 app on Amplify
- Client-side NHTSA API calls (no backend needed)
- WMI offline database for instant make/country decode
- VIN validation with check digit

## Stage 2 (Next)
- DynamoDB cache for decoded VINs
- Lambda API for server-side caching
- RDW bulk data import
- Self-learning from SASERP work orders

## Stage 3 (Future)
- OBD-II IoT device integration
- AWS IoT Core telemetry
- SageMaker anomaly detection
- Fleet dashboard
