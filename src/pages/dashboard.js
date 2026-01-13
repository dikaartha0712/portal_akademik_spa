import { store } from "../store.js";
import { Card } from "../ui/components.js";

export async function DashboardPage() {
  const state = store.getState();
  const student = state.auth.student;

  const ipk = student ? "3.78" : "-";
  const sks = student ? "20" : "-";
  const pv = state.analytics.pageViews;

  return `
    <div class="grid">
      <div class="card" style="grid-column: span 4;">
        ${Card({ title: "IPK", value: ipk, subtitle: "Contoh data ringkas" })}
      </div>
      <div class="card" style="grid-column: span 4;">
        ${Card({ title: "Total SKS", value: sks, subtitle: "Semester berjalan" })}
      </div>
      <div class="card" style="grid-column: span 4;">
        ${Card({ title: "Page Views", value: String(pv), subtitle: "Global state" })}
      </div>

      <div class="card" style="grid-column: span 12;">
        <h3>Profil Mahasiswa</h3>
        ${student ? `
          <div class="row">
            <div><b>Nama:</b> ${student.nama}</div>
            <div><b>NIM:</b> ${student.nim}</div>
            <div><b>Prodi:</b> ${student.prodi}</div>
          </div>
        ` : `<div class="small">Silakan login untuk melihat profil.</div>`}
      </div>
    </div>
  `;
}
