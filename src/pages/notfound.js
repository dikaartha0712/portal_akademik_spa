export async function NotFoundPage() {
  return `
    <div class="card">
      <h2 style="margin-top:0;">404 - Halaman tidak ditemukan</h2>
      <p class="small">Route yang Anda akses tidak terdaftar.</p>
      <a class="link" data-link href="/">Kembali ke Dashboard</a>
    </div>
  `;
}
