#!/bin/sh
set -e

# --- Platform detection ---
detect_platform() {
  if [ -f /proc/version ]; then
    if grep -qi microsoft /proc/version 2>/dev/null; then
      echo "wsl2"
    else
      echo "linux"
    fi
  elif [ "$(uname)" = "Darwin" ]; then
    echo "macos"
  else
    echo "unknown"
  fi
}

PLATFORM=$(detect_platform)

# --- WSL2 /mnt/c/ penalty warning ---
if [ "$PLATFORM" = "wsl2" ]; then
  case "${MOUNT_PATH:-}" in
    /mnt/[a-zA-Z]/*)
      echo "WARNING: H-Orchestra detected the project is mounted from a Windows drive (${MOUNT_PATH})."
      echo "WARNING: File watching across the WSL2/NTFS boundary has high latency and may miss events."
      echo "WARNING: For best performance, clone your project under ~/projects/ in the WSL2 home directory."
      ;;
  esac
fi

# --- Dynamic UID/GID mapping (Linux only, when HOST_UID/HOST_GID are set) ---
if [ "$PLATFORM" = "linux" ] && [ -n "${HOST_UID:-}" ] && [ -n "${HOST_GID:-}" ]; then
  echo "H-Orchestra: mapping container process to UID=${HOST_UID} GID=${HOST_GID}"
  # Create group if it does not already exist
  getent group "${HOST_GID}" > /dev/null 2>&1 || addgroup -g "${HOST_GID}" appgroup
  # Create user if it does not already exist
  id -u appuser > /dev/null 2>&1 || adduser -u "${HOST_UID}" -G appgroup -D -s /bin/sh appuser
  exec su-exec appuser "$@"
fi

exec "$@"
