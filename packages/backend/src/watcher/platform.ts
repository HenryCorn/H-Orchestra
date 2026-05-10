import { readFileSync } from 'node:fs';

export type Platform = 'linux' | 'wsl2' | 'macos' | 'unknown';

export function detectPlatform(): Platform {
  try {
    const version = readFileSync('/proc/version', 'utf-8').toLowerCase();
    if (version.includes('microsoft')) return 'wsl2';
    return 'linux';
  } catch {
    // /proc/version only exists on Linux
  }
  if (process.platform === 'darwin') return 'macos';
  return 'unknown';
}

export function getWatchOptions(usePollingEnv: boolean): {
  usePolling: boolean;
  interval: number;
} {
  const platform = detectPlatform();
  // In a Docker container on macOS the volume is over VirtioFS — polling is required.
  // On native Linux the container shares the host kernel so inotify works.
  // We respect the env var override so docker-compose can force polling when needed.
  const usePolling = usePollingEnv || platform === 'macos';
  return { usePolling, interval: usePolling ? 300 : 100 };
}

export function isWsl2WindowsDrive(mountPath: string): boolean {
  return detectPlatform() === 'wsl2' && /^\/mnt\/[a-zA-Z]\//.test(mountPath);
}
