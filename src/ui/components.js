export function Card({ title, value, subtitle = "" }) {
  return `
    <div class="card">
      <h3>${title}</h3>
      <div class="value">${value}</div>
      ${subtitle ? `<div class="small">${subtitle}</div>` : ``}
    </div>
  `;
}

export function Alert({ type, message }) {
  return `<div class="alert ${type}">${message}</div>`;
}

export function Spinner() {
  return `<span class="spinner" aria-label="loading"></span>`;
}

export function Button({ text, variant = "", id = "", disabled = false, type = "button" }) {
  const cls = ["btn", variant].filter(Boolean).join(" ");
  return `<button type="${type}" class="${cls}" ${id ? `id="${id}"` : ""} ${disabled ? "disabled" : ""}>${text}</button>`;
}

export function Table({ columns, rows }) {
  const thead = `<tr>${columns.map(c => `<th>${c.label}</th>`).join("")}</tr>`;
  const tbody = rows.length
    ? rows.map(r => `<tr>${columns.map(c => `<td>${r[c.key] ?? ""}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${columns.length}" class="small">Data tidak tersedia.</td></tr>`;
  return `<table class="table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}

export function FormField({ label, name, type = "text", value = "", options = null }) {
  if (type === "select") {
    return `
      <label>
        <div class="small">${label}</div>
        <select name="${name}">
          ${options.map(o => `<option value="${o.value}" ${o.value === value ? "selected" : ""}>${o.label}</option>`).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label>
      <div class="small">${label}</div>
      <input class="input" name="${name}" type="${type}" value="${value}" />
    </label>
  `;
}

export function Modal({ title, body, actionsHtml }) {
  return `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="row">
          <h3 style="margin:0;">${title}</h3>
          <div class="spacer"></div>
          <button class="btn" id="modal-close">Tutup</button>
        </div>
        <div style="margin:12px 0;">${body}</div>
        <div class="row" style="justify-content:flex-end;">${actionsHtml || ""}</div>
      </div>
    </div>
  `;
}
