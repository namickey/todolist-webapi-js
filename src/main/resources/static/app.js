const apiBase = '/api/todos';

async function fetchTodos() {
  const res = await fetch(apiBase);
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

async function createTodo(title) {
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

async function updateTodo(id, { title, completed }) {
  const res = await fetch(`${apiBase}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed })
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

async function deleteTodo(id) {
  const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
}

async function deleteAllTodos() {
  const res = await fetch(`${apiBase}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete all');
}

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.substring(2), v);
    else if (v !== undefined && v !== null) e.setAttribute(k, v);
  });
  children.forEach(c => e.append(c instanceof Node ? c : document.createTextNode(c)));
  return e;
}

function renderList(items) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  items.sort((a,b) => Number(a.completed) - Number(b.completed) || a.id - b.id);
  for (const t of items) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!t.completed;
    checkbox.addEventListener('change', async () => {
      const updated = await updateTodo(t.id, { completed: checkbox.checked, title: t.title });
      t.completed = updated.completed; t.title = updated.title; t.updatedAt = updated.updatedAt;
      titleSpan.classList.toggle('completed', t.completed);
    });

    const titleSpan = el('span', { class: 'title' });
    titleSpan.textContent = t.title;
    if (t.completed) titleSpan.classList.add('completed');

    // 簡易編集（タイトルクリックでプロンプト）
    titleSpan.addEventListener('click', async () => {
      const newTitle = prompt('タイトルを編集', t.title);
      if (newTitle == null) return;
      const trimmed = newTitle.trim();
      if (!trimmed) return;
      const updated = await updateTodo(t.id, { title: trimmed, completed: t.completed });
      t.title = updated.title; titleSpan.textContent = t.title;
    });

    const delBtn = el('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', async () => {
      await deleteTodo(t.id);
      await refresh();
    });

    const li = el('li', {}, checkbox, titleSpan, el('span', { class: 'spacer' }), delBtn);
    list.appendChild(li);
  }
}

async function refresh() {
  const items = await fetchTodos();
  renderList(items);
}

async function main() {
  const input = document.getElementById('new-title');
  const add = document.getElementById('add');
  const delAll = document.getElementById('delete-all');
  add.addEventListener('click', async () => {
    const title = input.value.trim();
    if (!title) return;
    await createTodo(title);
    input.value = '';
    await refresh();
  });
  delAll.addEventListener('click', async () => {
    await deleteAllTodos();
    await refresh();
  });
  input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      add.click();
    }
  });
  await refresh();
}

window.addEventListener('DOMContentLoaded', main);
