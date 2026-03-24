#!/bin/sh
set -eu

if [ -z "${TARGET_ENV:-}" ] || [ -z "${DEPLOY_HOST:-}" ] || [ -z "${SSH_USER:-}" ] || [ -z "${SSH_PRIVATE_KEY:-}" ]; then
  echo "Missing required deployment environment variables."
  exit 1
fi

REMOTE_DIR="/opt/lavendertour/${TARGET_ENV}"
SSH_OPTS="-i ${SSH_PRIVATE_KEY} -o StrictHostKeyChecking=no"

ssh ${SSH_OPTS} "${SSH_USER}@${DEPLOY_HOST}" "mkdir -p ${REMOTE_DIR}"
scp ${SSH_OPTS} docker-compose.prod.yml "${SSH_USER}@${DEPLOY_HOST}:${REMOTE_DIR}/docker-compose.yml"

ssh ${SSH_OPTS} "${SSH_USER}@${DEPLOY_HOST}" "
  cd ${REMOTE_DIR} && \
  export TARGET_ENV='${TARGET_ENV}' IMAGE_TAG='${IMAGE_TAG}' ECR_REGISTRY='${ECR_REGISTRY:-}' && \
  docker compose pull && \
  docker compose up -d
"
