import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDocuments,
  generateDefaultDocTitle,
  sanitizeDocTitle,
  formatBytes,
  formatDocDate,
  ScannedDoc,
} from './documentLogic';

test('filterDocuments filters by title correctly', () => {
  const docs: ScannedDoc[] = [
    { id: '1', title: 'Contrato de Aluguel', createdAt: 1700000000000, pageCount: 2, pages: [], fileSizeBytes: 1024 },
    { id: '2', title: 'Comprovante Bancário', createdAt: 1700000000000, pageCount: 1, pages: [], fileSizeBytes: 2048 },
    { id: '3', title: 'Receita Médica', createdAt: 1700000000000, pageCount: 1, pages: [], fileSizeBytes: 512 },
  ];

  const result = filterDocuments(docs, 'contrato');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '1');

  const emptySearch = filterDocuments(docs, '');
  assert.equal(emptySearch.length, 3);
});

test('sanitizeDocTitle strips invalid filesystem characters', () => {
  assert.equal(sanitizeDocTitle('Contrato/2026:Versão*1?'), 'Contrato_2026_Versão_1_');
  assert.equal(sanitizeDocTitle('   '), 'Documento_Sem_Titulo');
  assert.equal(sanitizeDocTitle('Nota Fiscal 4580'), 'Nota Fiscal 4580');
});

test('generateDefaultDocTitle produces formatted timestamped string', () => {
  const fixedDate = new Date(2026, 10, 12, 14, 30); // 12 Nov 2026 14:30
  const title = generateDefaultDocTitle(0, fixedDate);
  assert.equal(title, 'Digitalização_12-11-2026_14h30');
});

test('formatBytes handles zero, KB and MB properly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1.0 KB');
  assert.equal(formatBytes(1024 * 1024 * 2.5), '2.5 MB');
});
