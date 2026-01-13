import { api } from "../api.js";
import { store } from "../store.js";
import { Table, FormField, Button, Alert, Spinner } from "../ui/components.js";

export async function KHSPage() {
  const state = store.getState();
  const loading = state.ui.loading;
  const alert = state.ui.alert;

  const semester = "2025/2026 Ganjil";
  const rows = state.data.khs;

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
      ${Button({ text: loading ? "Memuat..." : "Muat KHS", variant: "primary", id: "btn-load-khs", disabled: loading })}
      ${loading ? Spinner() : ""}
    </div>

    ${Table({
      columns: [
        { key: "kode", label: "Kode" },
        { key: "matkul", label: "Mata Kuliah" },
        { key: "sks", label: "SKS" },
        { key: "nilai", label: "Nilai" },
      ],
      rows,
    })}
  `;
}

export function bindKHSEvents(root) {
  const btnLoad = root.querySelector("#btn-load-khs");
  const select = root.querySelector('select[name="semester"]');

  if (!btnLoad) return;

  btnLoad.addEventListener("click", async () => {
    store.clearAlert();
    store.setLoading(true);
    try {
      const semester = select?.value || "2025/2026 Ganjil";
      const data = await api.getKHS(semester);
      store.setData("khs", data);
      store.setAlert("success", "Data KHS berhasil dimuat.");
    } catch (err) {
      store.setAlert("error", err.message || "Gagal memuat KHS.");
    } finally {
      store.setLoading(false);
    }
  });
}
