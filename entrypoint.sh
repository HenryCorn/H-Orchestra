#!/usr/bin/env sh
# H-Orchestra container entrypoint.
# Normalizes MOUNT_PATH and prints platform info before exec'ing the main command.

set -e

MOUNT_PATH="${MOUNT_PATH:-/mounted-repo}"

# Strip trailing slash, swap backslashes (handles Windows-style host paths).
MOUNT_PATH="$(printf '%s' "$MOUNT_PATH" | tr '\\' '/' | sed 's:/*$::')"
export MOUNT_PATH

echo "------------------------------------------------------------"
echo "H-Orchestra entrypoint"
echo "  uid:gid     : $(id -u):$(id -g)"
echo "  PORT        : ${PORT:-3001}"
echo "  MOUNT_PATH  : ${MOUNT_PATH}"
echo "  CHOKIDAR_USEPOLLING : ${CHOKIDAR_USEPOLLING:-unset}"
echo "------------------------------------------------------------"

if [ ! -d "${MOUNT_PATH}" ]; then
  echo "[entrypoint] WARNING: ${MOUNT_PATH} is not a directory inside the container."
  echo "             Pass -v <host-path>:${MOUNT_PATH}:ro on docker run, or set REPO_PATH for compose."
fi

exec "$@"
