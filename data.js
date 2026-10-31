// Data access boundary: replace this repository with Supabase queries later.
const SAMPLE_KPIS = [
  { id: 'oct-growth', month: '2026-10', department: 'Growth', metric: '신규 고객 수', target: 120, actual: 138 },
  { id: 'oct-product', month: '2026-10', department: 'Product', metric: '기능 출시 수', target: 14, actual: 12 },
  { id: 'oct-sales', month: '2026-10', department: 'Sales', metric: '계약 체결 수', target: 82, actual: 91 },
  { id: 'oct-cs', month: '2026-10', department: 'Customer Success', metric: '고객 만족도', target: 90, actual: 94 },
  { id: 'sep-growth', month: '2026-09', department: 'Growth', metric: '신규 고객 수', target: 110, actual: 106 },
  { id: 'sep-product', month: '2026-09', department: 'Product', metric: '기능 출시 수', target: 12, actual: 13 },
  { id: 'sep-sales', month: '2026-09', department: 'Sales', metric: '계약 체결 수', target: 75, actual: 79 },
  { id: 'sep-cs', month: '2026-09', department: 'Customer Success', metric: '고객 만족도', target: 90, actual: 88 },
  { id: 'aug-growth', month: '2026-08', department: 'Growth', metric: '신규 고객 수', target: 100, actual: 0 },
  { id: 'aug-ops', month: '2026-08', department: 'Operations', metric: '운영 이슈 처리', target: 0, actual: 0 },
];

let inMemoryEntries = [...SAMPLE_KPIS];

export const kpiRepository = {
  mode: 'sample',
  async list() { return structuredClone(inMemoryEntries); },
  async add(entry) { inMemoryEntries = [...inMemoryEntries, { ...entry, id: `sample-${Date.now()}` }]; return entry; },
  async reset() { inMemoryEntries = [...SAMPLE_KPIS]; },
};
