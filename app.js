import { kpiRepository } from './data.js';

const state = { entries: [], month: '2026-10', department: 'all' };
const $ = (selector) => document.querySelector(selector);
const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(value);
const rateOf = (target, actual) => target === 0 ? null : (actual / target) * 100;
const monthLabel = (month) => new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(new Date(`${month}-01`));

function populateFilters() {
  const months = [...new Set(state.entries.map((row) => row.month))].sort().reverse();
  const departments = [...new Set(state.entries.map((row) => row.department))].sort();
  $('#monthFilter').innerHTML = months.map((month) => `<option value="${month}">${monthLabel(month)}</option>`).join('');
  $('#departmentFilter').innerHTML = `<option value="all">전체 부서</option>${departments.map((department) => `<option value="${department}">${department}</option>`).join('')}`;
  if (!months.includes(state.month)) state.month = months[0] || '';
  $('#monthFilter').value = state.month;
  $('#departmentFilter').value = state.department;
}

function filteredRows() { return state.entries.filter((row) => row.month === state.month && (state.department === 'all' || row.department === state.department)); }

function render() {
  const rows = filteredRows();
  const target = rows.reduce((sum, row) => sum + Number(row.target), 0);
  const actual = rows.reduce((sum, row) => sum + Number(row.actual), 0);
  const rate = rateOf(target, actual);
  $('#targetTotal').textContent = formatNumber(target);
  $('#actualTotal').textContent = formatNumber(actual);
  $('#achievementRate').textContent = rate === null ? '—' : `${rate.toFixed(1)}%`;
  $('#rateFoot').textContent = rate === null ? '목표 미설정' : '목표 대비 실적';
  $('#filterSummary').textContent = `${monthLabel(state.month)} · ${state.department === 'all' ? '전체 부서' : state.department} · ${rows.length}개 지표`;
  renderTable(rows); renderChart(rows); renderCallout(rows, rate);
}

function renderTable(rows) {
  $('#emptyState').hidden = rows.length > 0;
  $('#evidenceBody').innerHTML = rows.map((row) => { const rate = rateOf(row.target, row.actual); const status = rate === null ? ['none', '목표 미설정'] : rate >= 100 ? ['good', '달성'] : ['warn', '진행 중']; return `<tr><td>${row.department}</td><td>${row.metric}</td><td>${formatNumber(row.target)}</td><td>${formatNumber(row.actual)}</td><td class="rate">${rate === null ? '—' : `${rate.toFixed(1)}%`}</td><td><span class="status ${status[0]}">${status[1]}</span></td></tr>`; }).join('');
}

function renderChart(rows) {
  const max = Math.max(...rows.flatMap((row) => [row.target, row.actual]), 1);
  $('#barChart').innerHTML = rows.length ? rows.map((row) => `<div class="bar-group" title="${row.department}: 목표 ${row.target}, 실적 ${row.actual}"><div class="bar target" style="height:${row.target / max * 100}%"></div><div class="bar actual" style="height:${row.actual / max * 100}%"></div><span class="bar-label">${row.department.slice(0, 3)}</span></div>`).join('') : '<p class="empty-chart">표시할 데이터가 없습니다.</p>';
}

function renderCallout(rows, rate) {
  if (!rows.length) { $('#calloutTitle').textContent = '조건을 바꿔보세요'; $('#calloutText').textContent = '선택한 조건에 해당하는 KPI가 없습니다.'; $('#calloutIcon').textContent = '⌁'; return; }
  const best = [...rows].sort((a, b) => (rateOf(b.target, b.actual) ?? -1) - (rateOf(a.target, a.actual) ?? -1))[0];
  const bestRate = rateOf(best.target, best.actual);
  $('#calloutIcon').textContent = bestRate !== null && bestRate >= 100 ? '✦' : '◌';
  $('#calloutTitle').textContent = best.department;
  $('#calloutText').innerHTML = bestRate === null ? '설정된 목표가 없어 달성률을 계산할 수 없습니다.' : `“${best.metric}” ${bestRate.toFixed(1)}% 달성으로 가장 높은 페이스예요.`;
}

async function init() {
  try { state.entries = await kpiRepository.list(); populateFilters(); render(); $('#updatedAt').textContent = '방금 전'; }
  catch { $('#errorState').hidden = false; }
}

$('#monthFilter').addEventListener('change', (event) => { state.month = event.target.value; render(); });
$('#departmentFilter').addEventListener('change', (event) => { state.department = event.target.value; render(); });
$('#resetFilters').addEventListener('click', () => { state.department = 'all'; populateFilters(); render(); });
$('#retryButton').addEventListener('click', init);
$('#addKpi').addEventListener('click', () => { $('#entryMonth').value = state.month; $('#entryDepartment').innerHTML = [...new Set(state.entries.map((row) => row.department))].sort().map((d) => `<option>${d}</option>`).join(''); $('#entryDialog').showModal(); });
$('#entryForm').addEventListener('submit', async (event) => { event.preventDefault(); await kpiRepository.add({ month: $('#entryMonth').value, department: $('#entryDepartment').value, metric: $('#entryMetric').value.trim(), target: Number($('#entryTarget').value), actual: Number($('#entryActual').value) }); state.entries = await kpiRepository.list(); populateFilters(); state.month = $('#entryMonth').value; $('#monthFilter').value = state.month; render(); $('#entryDialog').close(); $('#entryForm').reset(); });
init();
