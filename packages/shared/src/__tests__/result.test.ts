import { describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { Ok, Err, isOk, isErr } from '../util/result.js';
import type { Result } from '../util/result.js';

describe('Ok', () => {
  it('sets ok to true', () => {
    const r = Ok(42);
    assert.equal(r.ok, true);
  });

  it('stores the value', () => {
    const r = Ok('hello');
    assert.equal(r.value, 'hello');
  });
});

describe('Err', () => {
  it('sets ok to false', () => {
    const r = Err('something went wrong');
    assert.equal(r.ok, false);
  });

  it('stores the error', () => {
    const r = Err({ code: 'E_FAIL' });
    assert.deepEqual(r.error, { code: 'E_FAIL' });
  });
});

describe('isOk', () => {
  it('returns true for Ok', () => {
    assert.equal(isOk(Ok(1)), true);
  });

  it('returns false for Err', () => {
    assert.equal(isOk(Err('oops')), false);
  });
});

describe('isErr', () => {
  it('returns true for Err', () => {
    assert.equal(isErr(Err('oops')), true);
  });

  it('returns false for Ok', () => {
    assert.equal(isErr(Ok(1)), false);
  });
});

describe('discriminated union narrowing', () => {
  it('allows accessing .value after isOk guard', () => {
    const r: Result<number, string> = Ok(99);
    if (isOk(r)) {
      // TypeScript narrows r to Ok<number> here — .value must exist
      assert.equal(r.value, 99);
    } else {
      assert.fail('should have been Ok');
    }
  });

  it('allows accessing .error after isErr guard', () => {
    const r: Result<number, string> = Err('boom');
    if (isErr(r)) {
      // TypeScript narrows r to Err<string> here — .error must exist
      assert.equal(r.error, 'boom');
    } else {
      assert.fail('should have been Err');
    }
  });
});
