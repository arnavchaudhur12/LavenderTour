# Jenkins SCM and Deployment Setup

This repository is designed for a Jenkins multibranch pipeline.

## Branch mapping

- `dev` deploys to `https://dev.lavendertour.in`
- `stage` deploys to `https://stage.lavendertour.in`
- `prod` deploys to `https://lavendertour.in`
- `main` is treated as production by the `Jenkinsfile`, but day-to-day deployments should use `prod`

## Required Jenkins plugins

- Git
- GitHub
- Pipeline
- Multibranch Pipeline
- SSH Agent

## Required tools on the Jenkins node

- Git
- Python 3
- Node.js 20 with `npm`
- SSH client

## Required credentials

### 1. GitHub repository access

- Kind: `SSH Username with private key`
- Scope: Global
- Username: `git`
- Private key: GitHub deploy key or user SSH key with repo access

### 2. VPS deployment access

- Kind: `SSH Username with private key`
- Scope: Global
- ID: `lavendertour-vps-ssh`
- Username: `root`
- Private key: key that can SSH to `31.97.202.218`

## Multibranch pipeline configuration

Create one Jenkins `Multibranch Pipeline` job with:

- Repository: `git@github.com:arnavchaudhur12/LavenderTour.git`
- Script path: `Jenkinsfile`
- Branch discovery: enabled for `dev`, `stage`, and `prod`

This creates separate branch jobs automatically.

## Deployment flow

Each branch build does this:

1. Check out the matching branch from GitHub
2. Verify the backend by compiling the FastAPI app
3. Verify the frontend by running a production build
4. SSH to the VPS
5. Run `/opt/lavendertour/deploy-by-branch.sh <branch>`

## VPS deployment script

Install the repo version of the deployment script on the VPS:

```bash
install -m 755 /opt/lavendertour/repo/deploy/vps-deploy-by-branch.sh /opt/lavendertour/deploy-by-branch.sh
```

## GitHub webhook

If Jenkins is reachable from GitHub, add this webhook in the GitHub repository:

- Payload URL: `http://<jenkins-host>:8080/github-webhook/`
- Content type: `application/json`
- Events: `Just the push event`

If Jenkins is only local on your Mac and not publicly reachable, use manual scans or expose Jenkins through a secure tunnel before enabling webhooks.

## First-run checklist

1. Confirm the VPS has:
   - `/opt/lavendertour/repo`
   - `/opt/lavendertour/dev`
   - `/opt/lavendertour/stage`
   - `/opt/lavendertour/prod`
2. Install the deployment script on the VPS
3. Add both SSH credentials in Jenkins
4. Create the multibranch pipeline job
5. Run `Scan Multibranch Pipeline Now`
6. Trigger a test commit on `dev`
