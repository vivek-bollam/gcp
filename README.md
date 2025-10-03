
# GCP End-to-End Deployment

## Overview
This repo deploys a simple React frontend and Node.js/Express backend on GKE Autopilot using Terraform (IaC), Cloud Build (CI/CD), Artifact Registry, Secret Manager, and Kubernetes manifests. Setup includes observability (Logging/Monitoring, Uptime check/alert), security (Trivy scans, least-priv SAs, Workload Identity), and cost controls (Autopilot, resource limits).

**Progress**: 
- Infrastructure created (VPC, AR, GKE cluster, secrets, uptime/alert).
- Docker images built/pushed manually.
- K8s manifests applied (deployments, services, ingress).
- Static IP available for HTTP testing.
- CI/CD triggers set (frontend/backend on push to main).
- Cloud Build is failed.

**Project ID**: `my-gke-project-473809`  
**Region**: `us-central1`  
**Cluster**: `app-cluster`  
**Repo**: [github.com/vivek-bollam/gcp](https://github.com/vivek-bollam/gcp)  
**Test IP**: Run `terraform output ingress_ip` (e.g., `http://35.186.247.137` – frontend loads, /api/* routes to backend).

## Prerequisites
- GCP project with billing enabled (free tier credits).
- GitHub account/repo (`vivek-bollam/gcp`).
- Install: Terraform v1.5+, gcloud CLI, kubectl.
- Local clone: `git clone https://github.com/vivek-bollam/gcp.git && cd gcp`.

## Setup Commands (What Was Done)

1. **Set GCP Project**:
   ```
   gcloud config set project my-gke-project-473809
   ```

2. **Terraform IaC (Infra Creation)**:
   ```
   cd infra/terraform
   terraform init
   terraform plan
   terraform apply  # Creates VPC, AR (app-repo), GKE Autopilot cluster, Workload Identity, secrets (project-id, git-commit-sha), uptime check/alert, static IP.
   ```
   - Outputs: `terraform output ingress_ip` (static IP for Ingress).
   - Environments: Use workspaces for dev/prod (e.g., `terraform workspace new dev`).

3. **Connect kubectl**:
   ```
   gcloud container clusters get-credentials app-cluster --region=us-central1
   ```

4. **Apply K8s Manifests**:
   ```
   kubectl apply -f k8s/  # Deployments, Services, Ingress (path / → frontend, /api/* → backend).
   ```
   - Probes/resources defined in YAMLs.

5. **Manual Docker Build/Push (Pre-CI/CD)**:
   ```
   cd frontend
   docker build -t us-central1-docker.pkg.dev/my-gke-project-473809/app-repo/frontend:v1 .
   docker push us-central1-docker.pkg.dev/my-gke-project-473809/app-repo/frontend:v1
   cd ../backend
   docker build -t us-central1-docker.pkg.dev/my-gke-project-473809/app-repo/backend:v1 .
   docker push us-central1-docker.pkg.dev/my-gke-project-473809/app-repo/backend:v1
   ```
   - Multi-stage Dockerfiles in /frontend and /backend.

6. **CI/CD Setup (Cloud Build)**:
   - WIF pool/provider created, SA (cloudbuild-sa) bound with roles (artifactregistry.writer, container.developer, secretmanager.secretAccessor).
   - Secrets: project-id and git-commit-sha created.
   - Connected GitHub repo, linked as gcp-repo.
   - Triggers created (frontend/backend on push to main, using /cloudbuild/*.yaml).
   

7. **Test App (HTTP on IP)**:
   ```
   IP=$(terraform output -raw ingress_ip)
   curl http://$IP/api/health  # {"status": "ok"}
   curl http://$IP/api/time    # {"time": "...", "region": "us-central1"}
   curl http://$IP/api/version # {"version": "sha-from-env"}
   ```
   - Frontend: http://$IP (React page calls backend).

## Current Status & Troubleshooting
- **Success**: Infra up, K8s running, manual deploys work, triggers set.
- **Issue**: Cloud Build is failed.

- **Rollback**: `kubectl rollout undo deployment/frontend` (or backend).
- **Environments**: Dev/prod via Terraform workspaces (`terraform workspace select prod && terraform apply -var-file=prod.tfvars`).



## Troubleshooting Builds
- Logs: Console > Cloud Build > History > Logs (step-by-step).
- No builds: Check triggers `gcloud beta builds triggers list --region=us-central1`.
- Contact: Vivek Bollam (vivekbollam5@gmail.com).

