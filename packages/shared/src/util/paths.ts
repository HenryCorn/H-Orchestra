/**
 * Normalize a MOUNT_PATH value from any host OS.
 * - Converts backslashes to forward slashes
 * - Removes trailing slashes (unless the result would be empty)
 * - Removes surrounding whitespace
 */
export function normalizeMountPath(path: string): string {
  const converted = path.trim().replace(/\\/g, '/');
  // Preserve bare "/" root; strip trailing slash from everything else
  if (converted.length > 1 && converted.endsWith('/')) {
    return converted.slice(0, -1);
  }
  return converted;
}

/**
 * Join a root path (already normalized) with a relative harness file path.
 * - relative must not start with .. (throws RangeError if it does)
 * - Always returns a posix-style path
 */
export function resolveHarnessFile(root: string, relative: string): string {
  if (relative.startsWith('..')) {
    throw new RangeError(
      `resolveHarnessFile: relative path must not start with ".." (got ${JSON.stringify(relative)})`,
    );
  }
  const normalRoot = root.endsWith('/') ? root.slice(0, -1) : root;
  return `${normalRoot}/${relative}`;
}
