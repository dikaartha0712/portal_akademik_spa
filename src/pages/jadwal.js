import { api } from "../api.js";
import { store } from "../store.js";
import { Table, FormField, Button, Alert, Spinner } from "../ui/components.js";

export async function JadwalPage() {
  const state = store.getState();
  const loading = state.ui.loading;
  const alert = state.ui.alert;

  const semester = "2025/2026 Ganjil";
  const rows = state.data.jadwal;

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
      ${Button({ text: loading ? "Memuat..." : "Muat Jadwal", variant: "primary", id: "btn-load-jadwal", disabled: loading })}
      ${loading ? Spinner() : ""}
    </div>

    ${Table({
      columns: [
        { key: "hari", label: "Hari" },
        { key: "jam", label: "Jam" },
        { key: "matkul", label: "Mata Kuliah" },
        { key: "ruang", label: "Ruang" },
      ],
      rows,
    })}
  `;
}

export function bindJadwalEvents(root) {
  const btnLoad = root.querySelector("#btn-load-jadwal");
  const select = root.querySelector('select[name="semester"]');

  if (!btnLoad) return;

  btnLoad.addEventListener("click", async () => {
    store.clearAlert();
    store.setLoading(true);
    try {
      const semester = select?.value || "2025/2026 Ganjil";
      const data = await api.getJadwal(semester);
      store.setData("jadwal", data);
      store.setAlert("success", "Data jadwal berhasil dimuat.");
    } catch (err) {
      store.setAlert("error", err.message || "Gagal memuat jadwal.");
    } finally {
      store.setLoading(false);
    }
  });
}
