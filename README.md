# Microservice Architecture Project

## Project Overview
This project demonstrates a microservice architecture implementation consisting of three distinct services:

1. **API Gateway**: Acts as the central entry point for clients, routing requests to the appropriate microservices.
2. **Users Service**: Manages user-related operations such as creating, updating, and deleting user information.
3. **Books Service**: Handles book-related operations including creation, updates, retrieval, and deletion.

The application is containerized using Docker, deployed in a local Kubernetes cluster with Minikube, and employs CI/CD pipelines with Jenkins.

---

## Key Features

- **Containerization**: Each service is packaged as a Docker image, allowing portability and consistency.
- **GraphQL Integration**: API Gateway utilizes GraphQL for flexible and efficient data queries.
- **gRPC Communication**: Microservices interact via gRPC for high-performance communication.
- **MongoDB**: All services use MongoDB as the database backend.
- **CI/CD Pipeline**: Automated build, vulnerability scanning, and deployment workflows are managed with Jenkins.
- **Kubernetes Deployment**: Services are deployed on a local Minikube cluster with Helm charts.
- **GitOps**: ArgoCD is used for continuous delivery and deployment.

---

## Architecture

### Overview
The architecture comprises:

- **Frontend**: API Gateway exposing REST and GraphQL endpoints.
- **Backend**:
  - Users Service
  - Books Service
- **Database**: MongoDB instance shared by both services.
- **Orchestration**: Kubernetes manages the containerized services.
- **CI/CD**: Jenkins pipeline for automated builds and deployments.

### Communication
- **API Gateway to Services**: Uses gRPC and REST calls.
- **Services to MongoDB**: Direct database access for data persistence.

---

## Prerequisites

1. **Tools**:
   - Docker
   - Docker Compose
   - Minikube
   - Helm
   - Jenkins
   - Node.js

2. **Environment**:
   - Local development machine with Docker and Kubernetes configured.

3. **Access**:
   - Docker Hub account for storing images.

---

## Setup

### Clone the Repository
```bash
git clone https://github.com/MoamenTlili/project-microservices.git
cd project-microservices
