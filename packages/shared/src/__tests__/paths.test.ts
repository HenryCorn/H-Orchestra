import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { normalizeMountPath, resolveHarnessFile } from '../util/paths.js';

describe('normalizeMountPath', () => {
  it('passes a clean POSIX path through unchanged', () => {
    assert.strictEqual(normalizeMountPath('/mounted-repo'), '/mounted-repo');
  });

  it('removes a trailing slash', () => {
    assert.strictEqual(normalizeMountPath('/mounted-repo/'), '/mounted-repo');
  });

  it('converts Windows backslashes to forward slashes', () => {
    assert.strictEqual(normalizeMountPath('C:\\Users\\foo\\repo'), 'C:/Users/foo/repo');
  });

  it('passes a WSL2-style path through unchanged', () => {
    assert.strictEqual(normalizeMountPath('/mnt/c/Users/foo/repo'), '/mnt/c/Users/foo/repo');
  });

  it('strips surrounding whitespace', () => {
    assert.strictEqual(normalizeMountPath('  /mounted-repo  '), '/mounted-repo');
  });

  it('preserves bare root slash', () => {
    assert.strictEqual(normalizeMountPath('/'), '/');
  });
});

describe('resolveHarnessFile', () => {
  it('joins root with a top-level filename', () => {
    assert.strictEqual(resolveHarnessFile('/repo', 'feature_list.json'), '/repo/feature_list.json');
  });

  it('joins root with a nested relative path', () => {
    assert.strictEqual(
      resolveHarnessFile('/repo', 'progress/current.md'),
      '/repo/progress/current.md',
    );
  });

  it('throws RangeError when relative starts with ..', () => {
    assert.throws(() => resolveHarnessFile('/repo', '../etc/passwd'), RangeError);
  });
});
