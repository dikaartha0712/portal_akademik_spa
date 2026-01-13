import { setActiveNav } from "./helpers.js";

export function AppLayout({ pageTitle, contentHtml, student, currentPath }) {
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/krs", label: "KRS" },
    { href: "/khs", label: "KHS" },
    { href: "/jadwal", label: "Jadwal Kuliah" },
    { href: "/pengumuman", label: "Pengumuman" },
  ];

  const sidebar = `
    <div class="sidebar">
      <div class="nav">
        <h4>Menu</h4>
        ${navItems.map(n => `<a data-link href="${n.href}">${n.label}</a>`).join("")}
        <hr style="border:none;border-top:1px solid var(--border);margin:12px 0;">
        <a data-link href="/login">Login</a>
      </div>
    </div>
  `;

  const header = `
    <div class="header">
      <div class="brand">Portal Akademik Mahasiswa</div>
      <div class="userbox">
        <span>${student ? `${student.nama} (${student.nim})` : "Belum login"}</span>
        <button class="btn" id="btn-logout" ${student ? "" : "disabled"}>Logout</button>
      </div>
    </div>
  `;

  const main = `
    <div class="shell">
      ${sidebar}
      <main class="main">
        <div class="row" style="margin-bottom:12px;">
          <h2 style="margin:0;">${pageTitle}</h2>
        </div>
        ${contentHtml}
      </main>
    </div>
    <div class="footer">© 2025 Portal Akademik - STIKOM Bali</div>
  `;

  setTimeout(() => setActiveNav(currentPath), 0);
  return header + main;
}
