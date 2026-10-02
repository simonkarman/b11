import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('root extract script reads the chosen input and writes to the chosen output', () => {
  const root = path.resolve(__dirname, '../..');
  const output = mkdtempSync(path.join(tmpdir(), 'b11-extract-'));
  try {
    execFileSync('npm', ['run', 'extract'], {
      cwd: root,
      env: {
        ...process.env,
        BASE_DATA_PATH: path.join(root, 'extract/tests/fixtures'),
        OUTPUT_PATH: output,
      },
    });
    assert.equal(readFileSync(path.join(output, 'latest.txt'), 'utf8'),
      '2024-01-02 simon\n2024-01-03 ~simon\n');
  } finally {
    rmSync(output, { recursive: true });
  }
});
