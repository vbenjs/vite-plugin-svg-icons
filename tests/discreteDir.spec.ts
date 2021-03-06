import { discreteDir } from '../src/index';
test('discreteDir Not included /', () => {
  const { fileName, dirName } = discreteDir('file.svg');

  expect(fileName).toBe('file.svg');
  expect(dirName).toBe('');
});

test('discreteDir Not included / and include .', () => {
  const { fileName, dirName } = discreteDir('file.name.svg');

  expect(fileName).toBe('file.name.svg');
  expect(dirName).toBe('');
});

test('discreteDir Included /', () => {
  const { fileName, dirName } = discreteDir('dir/file.svg');

  expect(fileName).toBe('file.svg');
  expect(dirName).toBe('dir');
});

test('discreteDir Included multiple /', () => {
  const { fileName, dirName } = discreteDir('folder/dir/file.svg');

  expect(fileName).toBe('file.svg');
  expect(dirName).toBe('folder-dir');
});
