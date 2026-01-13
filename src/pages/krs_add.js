import { store } from "../store.js";
import { Modal, Button, FormField, Alert } from "../ui/components.js";

export async function AddKRSPage() {
  const state = store.getState();
  const alert = state.ui.alert;

  return `
    ${alert ? Alert(alert) : ""}
    <div class="card">
      <h3>Form Ambil Mata Kuliah</h3>
      <form id="form-add-krs" class="row" style="align-items:flex-end;">
        ${FormField({ label: "Kode MK", name: "kode", type: "text" })}
        ${FormField({ label: "Nama MK", name: "matkul", type: "text" })}
        ${FormField({ label: "SKS", name: "sks", type: "text" })}
        ${FormField({ label: "Kelas", name: "kelas", type: "text" })}
        ${Button({ text: "Simpan", variant: "primary", type: "submit" })}
        ${Button({ text: "Kembali", id: "btn-back" })}
      </form>
      <p class="small">Penyimpanan menggunakan state global (store) sebagai simulasi.</p>
    </div>

    <div id="modal-slot"></div>
  `;
}

export function bindAddKRSEvents(root) {
  const form = root.querySelector("#form-add-krs");
  const btnBack = root.querySelector("#btn-back");
  const modalSlot = root.querySelector("#modal-slot");

  if (btnBack) {
    btnBack.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState({}, "", "/krs");
      window.dispatchEvent(new Event("routechange"));
    });
  }

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    store.clearAlert();

    const fd = new FormData(form);
    const payload = {
      kode: String(fd.get("kode") || "").trim(),
      matkul: String(fd.get("matkul") || "").trim(),
      sks: String(fd.get("sks") || "").trim(),
      kelas: String(fd.get("kelas") || "").trim(),
    };

    if (!payload.kode || !payload.matkul) {
      store.setAlert("error", "Kode MK dan Nama MK wajib diisi.");
      return;
    }

    modalSlot.innerHTML = Modal({
      title: "Konfirmasi",
      body: `
        Anda yakin ingin menambahkan mata kuliah berikut?
        <ul>
          <li><b>${payload.kode}</b> - ${payload.matkul}</li>
          <li>SKS: ${payload.sks || "-"}</li>
          <li>Kelas: ${payload.kelas || "-"}</li>
        </ul>
      `,
      actionsHtml: `
        <button class="btn" id="modal-cancel">Batal</button>
        <button class="btn primary" id="modal-confirm">Setuju</button>
      `,
    });

    const close = () => { modalSlot.innerHTML = ""; };
    const backdrop = modalSlot.querySelector("#modal-backdrop");

    modalSlot.querySelector("#modal-close")?.addEventListener("click", close);
    modalSlot.querySelector("#modal-cancel")?.addEventListener("click", close);
    backdrop?.addEventListener("click", (ev) => {
      if (ev.target === backdrop) close();
    });

    modalSlot.querySelector("#modal-confirm")?.addEventListener("click", () => {
      const state = store.getState();
      const next = [...state.data.krs, payload];
      store.setData("krs", next);
      store.setAlert("success", "Mata kuliah berhasil ditambahkan.");
      close();
      history.pushState({}, "", "/krs");
      window.dispatchEvent(new Event("routechange"));
    });
  });
}
