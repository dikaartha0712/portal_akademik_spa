import { api } from "../api.js";
import { store } from "../store.js";
import { Table, FormField, Button, Alert, Spinner, Modal } from "../ui/components.js";

export async function PengumumanPage() {
  const state = store.getState();
  const loading = state.ui.loading;
  const alert = state.ui.alert;
  const rows = state.data.pengumuman;

  return `
    ${alert ? Alert(alert) : ""}
    <div class="row" style="margin-bottom:12px;">
      ${FormField({ label: "Filter Tanggal", name: "tanggal", type: "date" })}
      ${Button({ text: loading ? "Memuat..." : "Muat Pengumuman", variant: "primary", id: "btn-load-pengumuman", disabled: loading })}
      ${loading ? Spinner() : ""}
      <div class="spacer"></div>
      <div class="small">Klik baris pengumuman untuk lihat detail (modal).</div>
    </div>

    ${Table({
      columns: [
        { key: "tanggal", label: "Tanggal" },
        { key: "judul", label: "Judul" },
      ],
      rows: rows.map(x => ({ tanggal: x.tanggal, judul: x.judul })),
    })}

    <div id="modal-slot"></div>
  `;
}

export function bindPengumumanEvents(root) {
  const btnLoad = root.querySelector("#btn-load-pengumuman");
  const inputTanggal = root.querySelector('input[name="tanggal"]');
  const modalSlot = root.querySelector("#modal-slot");

  const table = root.querySelector(".table");
  if (table) {
    table.addEventListener("click", (e) => {
      const tr = e.target.closest("tbody tr");
      if (!tr) return;
      const titleCell = tr.querySelector("td:nth-child(2)");
      const title = titleCell?.textContent?.trim();
      if (!title) return;

      const state = store.getState();
      const item = state.data.pengumuman.find(x => x.judul === title);
      if (!item) return;

      modalSlot.innerHTML = Modal({
        title: "Detail Pengumuman",
        body: `
          <div><b>Tanggal:</b> ${item.tanggal}</div>
          <div><b>Judul:</b> ${item.judul}</div>
          <div style="margin-top:10px;">${item.isi}</div>
        `,
        actionsHtml: `<button class="btn" id="modal-ok">OK</button>`,
      });

      const close = () => { modalSlot.innerHTML = ""; };
      const backdrop = modalSlot.querySelector("#modal-backdrop");

      modalSlot.querySelector("#modal-close")?.addEventListener("click", close);
      modalSlot.querySelector("#modal-ok")?.addEventListener("click", close);
      backdrop?.addEventListener("click", (ev) => {
        if (ev.target === backdrop) close();
      });
    });
  }

  if (!btnLoad) return;

  btnLoad.addEventListener("click", async () => {
    store.clearAlert();
    store.setLoading(true);
    try {
      const tanggal = inputTanggal?.value || "";
      const data = await api.getPengumuman(tanggal);
      store.setData("pengumuman", data);
      store.setAlert("success", "Pengumuman berhasil dimuat.");
    } catch (err) {
      store.setAlert("error", err.message || "Gagal memuat pengumuman.");
    } finally {
      store.setLoading(false);
    }
  });
}
