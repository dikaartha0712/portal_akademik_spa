import { api } from "../api.js";
import { store } from "../store.js";
import { Table, FormField, Button, Alert, Spinner } from "../ui/components.js";

export async function KRSPage() {
  const state = store.getState();
  const loading = state.ui.loading;
  const alert = state.ui.alert;

  const semester = "2025/2026 Ganjil";
  const rows = state.data.krs;

  return `
    ${alert ? Alert(alert) : ""}
    <div class="row" style="margin-bottom:12px;">
      ${FormField({
        label: "Filter Semester",
        name: "semester",
        type: "select",
        value: semester,
        options: [
          { value: "2025/2026 Ganjil", label: "2025/2026 Ganjil" },
          { value: "2024/2025 Genap", label: "2024/2025 Genap" },
        ],
      })}
      ${Button({ text: loading ? "Memuat..." : "Muat KRS", variant: "primary", id: "btn-load-krs", disabled: loading })}
      ${Button({ text: "Ambil Mata Kuliah", id: "btn-go-add" })}
      ${loading ? Spinner() : ""}
      <div class="spacer"></div>
      <div class="small">Tips: Klik Muat KRS untuk mengambil data.</div>
    </div>

    ${Table({
      columns: [
        { key: "kode", label: "Kode" },
        { key: "matkul", label: "Mata Kuliah" },
        { key: "sks", label: "SKS" },
        { key: "kelas", label: "Kelas" },
      ],
      rows,
    })}
  `;
}

export function bindKRSEvents(root) {
  const btnLoad = root.querySelector("#btn-load-krs");
  const btnGoAdd = root.querySelector("#btn-go-add");
  const select = root.querySelector('select[name="semester"]');

  if (btnGoAdd) {
    btnGoAdd.addEventListener("click", () => {
      history.pushState({}, "", "/krs/add");
      window.dispatchEvent(new Event("routechange"));
    });
  }

  if (btnLoad) {
    btnLoad.addEventListener("click", async () => {
      store.clearAlert();
      store.setLoading(true);
      try {
        const semester = select?.value || "2025/2026 Ganjil";
        const data = await api.getKRS(semester);
        store.setData("krs", data);
        store.setAlert("success", "Data KRS berhasil dimuat.");
      } catch (err) {
        store.setAlert("error", err.message || "Gagal memuat KRS.");
      } finally {
        store.setLoading(false);
      }
    });
  }
}
