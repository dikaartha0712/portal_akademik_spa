import { store } from "./store.js";
import { getPath, matchRoute } from "./router.js";
import { AppLayout } from "./ui/layout.js";
import { onLinkClick } from "./ui/helpers.js";

import { DashboardPage } from "./pages/dashboard.js";
import { KRSPage, bindKRSEvents } from "./pages/krs.js";
import { AddKRSPage, bindAddKRSEvents } from "./pages/krs_add.js";
import { KHSPage, bindKHSEvents } from "./pages/khs.js";
import { JadwalPage, bindJadwalEvents } from "./pages/jadwal.js";
import { PengumumanPage, bindPengumumanEvents } from "./pages/pengumuman.js";
import { LoginPage, bindLoginEvents } from "./pages/login.js";
import { NotFoundPage } from "./pages/notfound.js";

const root = document.getElementById("root");

// Route table (Routing dan Komponen SPA)
const routes = [
  { path: "/", title: "Dashboard", render: DashboardPage, bind: null, auth: true },
  { path: "/krs", title: "KRS", render: KRSPage, bind: bindKRSEvents, auth: true },
  { path: "/krs/add", title: "Ambil Mata Kuliah", render: AddKRSPage, bind: bindAddKRSEvents, auth: true },
  { path: "/khs", title: "KHS", render: KHSPage, bind: bindKHSEvents, auth: true },
  { path: "/jadwal", title: "Jadwal Kuliah", render: JadwalPage, bind: bindJadwalEvents, auth: true },
  { path: "/pengumuman", title: "Pengumuman", render: PengumumanPage, bind: bindPengumumanEvents, auth: true },
  { path: "/login", title: "Login", render: LoginPage, bind: bindLoginEvents, auth: false },
  { path: "*", title: "Not Found", render: NotFoundPage, bind: null, auth: false },
];

let lastPath = null;

async function render() {
  const path = getPath();
  const route = matchRoute(routes, path);

  // Hitung page views hanya saat route/path benar-benar berubah
  if (path !== lastPath) {
    store.incrementPageViews();
    lastPath = path;
  }

  const state = store.getState();
  const isLoggedIn = state.auth.isLoggedIn;

  // Route guard
  if (route.auth && !isLoggedIn) {
    history.replaceState({}, "", "/login");
    // update lastPath agar tidak double count
    lastPath = "/login";
    return render();
  }

  const contentHtml = await route.render();

  // Login page: layout minimal
  if (route.path === "/login") {
    root.innerHTML = `
      <div class="header">
        <div class="brand">Portal Akademik Mahasiswa</div>
        <div class="userbox"><span>Autentikasi</span></div>
      </div>
      ${contentHtml}
      <div class="footer">© 2025 Portal Akademik - STIKOM Bali</div>
    `;
    onLinkClick(root);
    route.bind?.(root);
    return;
  }

  // Layout utama SPA
  root.innerHTML = AppLayout({
    pageTitle: route.title,
    contentHtml,
    student: state.auth.student,
    currentPath: path,
  });

  // Intercept link (navigasi SPA)
  onLinkClick(root);

  // Logout
  const btnLogout = root.querySelector("#btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      store.logout();
      store.setAlert("success", "Logout berhasil.");
      history.pushState({}, "", "/login");
      window.dispatchEvent(new Event("routechange"));
    });
  }

  // Bind event khusus halaman
  route.bind?.(root);
}

// Route events
window.addEventListener("popstate", render);
window.addEventListener("routechange", render);

// State change tetap boleh render,
// tapi page views TIDAK akan loop karena dihitung hanya saat path berubah
window.addEventListener("statechange", render);

render();
