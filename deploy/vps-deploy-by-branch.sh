#!/bin/bash
set -euo pipefail

BRANCH="${1:-}"
REPO_DIR="${REPO_DIR:-/opt/lavendertour/repo}"
BASE_DIR="${BASE_DIR:-/opt/lavendertour}"

if [ -z "${BRANCH}" ]; then
  echo "Usage: $0 <dev|stage|prod>"
  exit 1
fi

case "${BRANCH}" in
  dev)
    TARGET_DIR="${BASE_DIR}/dev"
    ;;
  stage)
    TARGET_DIR="${BASE_DIR}/stage"
    ;;
  prod|main)
    TARGET_DIR="${BASE_DIR}/prod"
    BRANCH="prod"
    ;;
  *)
    echo "Invalid branch '${BRANCH}'. Use dev, stage, or prod."
    exit 1
    ;;
esac

if [ ! -d "${REPO_DIR}/.git" ]; then
  echo "Repository not found at ${REPO_DIR}"
  exit 1
fi

if [ ! -f "${TARGET_DIR}/docker-compose.yml" ]; then
  echo "Compose file not found at ${TARGET_DIR}/docker-compose.yml"
  exit 1
fi

cd "${REPO_DIR}"
git fetch origin
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"

cd "${TARGET_DIR}"
docker compose up --build -d
docker image prune -f
