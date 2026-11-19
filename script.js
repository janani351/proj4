const KEY = 'janani-student-records-v1';
const form = document.querySelector('#student-form');
const rows = document.querySelector('#rows');
const search = document.querySelector('#search');
const message = document.querySelector('#message');
let students = load();

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(data) ? data.filter(s => s && s.id && s.name && s.roll && s.department) : [];
  } catch { return []; }
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(students));
  render();
}
function addCell(row, value) {
  const cell = document.createElement('td');
  cell.textContent = value;
  row.append(cell);
}
function render() {
  const term = search.value.trim().toLowerCase();
  const visible = students.filter(s => `${s.name} ${s.roll} ${s.department}`.toLowerCase().includes(term));
  rows.replaceChildren();
  visible.forEach(student => {
    const row = document.createElement('tr');
    addCell(row, student.name);
    addCell(row, student.roll);
    addCell(row, student.department);
    const actionCell = document.createElement('td');
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${student.name}`);
    remove.addEventListener('click', () => {
      students = students.filter(s => s.id !== student.id);
      message.textContent = `${student.name} was deleted.`;
      save();
    });
    actionCell.append(remove);
    row.append(actionCell);
    rows.append(row);
  });
  document.querySelector('#record-count').textContent = `${students.length} total record${students.length === 1 ? '' : 's'}`;
  document.querySelector('#empty').hidden = visible.length > 0;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const roll = document.querySelector('#roll').value.trim();
  const department = document.querySelector('#department').value.trim();
  if (!name || !roll || !department) return;
  if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase())) {
    message.textContent = 'That roll number already exists.';
    return;
  }
  students.unshift({ id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()), name, roll, department });
  message.textContent = 'Student added successfully.';
  form.reset();
  save();
});
search.addEventListener('input', render);
render();
