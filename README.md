# StockSmart

A full-stack stock analysis web application built to explore real-world deployment using Docker and AWS.

---

## Live Demo

Deployed on AWS App Runner (public URL)

---

## Features

* Real-time stock data via APIs
* Interactive charts (candlestick, RSI, MACD, trends)
* Portfolio tracking dashboard
* Basic prediction system (trend-based logic)
* Learning dashboard for students
* Role-based authentication (JWT)

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express

### DevOps and Cloud

* Docker
* AWS ECR (Elastic Container Registry)
* AWS App Runner
* GitHub Actions (basic CI/CD)

---

## Project Structure

```
stocksmart/
├── src/                # Frontend (React)
├── server.ts           # Backend (Express)
├── dist/               # Production build
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .github/workflows/
```

---

## How It Works

### Build Process

```
npm run build
```

* Vite builds frontend into dist/assets
* TypeScript compiles backend into dist/server.js

---

## Docker Setup

### Build Image

```
docker build -t stockmarket .
```

### Tag Image

```
docker tag stockmarket:latest <ECR_URL>/stockmarket:latest
```

### Push to ECR

```
docker push <ECR_URL>/stockmarket:latest
```

---

## AWS Deployment

### ECR

* Stores Docker images

### App Runner

* Pulls image from ECR
* Runs container
* Exposes public URL

---

## CI/CD (GitHub Actions)

Basic workflow:

```
Push → Build Docker → Push to ECR → Deploy
```

---

## What I Learned

* Dockerizing full-stack applications
* Handling build vs runtime issues
* AWS ECR and App Runner setup
* Debugging deployment failures
* Understanding CI/CD basics

---

## Note

This is not a production-level application.

It is a learning project to understand:

* DevOps workflows
* Cloud deployment
* Containerization

---

## Future Improvements

* Improve CI/CD reliability
* Add monitoring (CloudWatch)
* Custom domain setup
* Performance optimization

---

## Author

Built as a learning project for DevOps and Cloud Engineering
