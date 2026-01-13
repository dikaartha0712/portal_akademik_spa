function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export const api = {
  async login({ nim, password }) {
    await wait(400);
    if (!nim || !password) throw new Error("NIM dan password wajib diisi.");
    if (password !== "123456") throw new Error("Login gagal. Password contoh: 123456");
    return { nim, nama: "Mahasiswa STIKOM", prodi: "Teknologi Informasi" };
  },

  async getKRS(semester) {
    await wait(350);
    return [
      { kode: "VA244", matkul: "Pengembangan Web Sisi Klien", sks: 3, kelas: "A", semester },
      { kode: "BB234", matkul: "Probabilitas & Statistika", sks: 3, kelas: "B", semester },
    ];
  },

  async getKHS(semester) {
    await wait(350);
    return [
      { kode: "VA111", matkul: "Algoritma", sks: 3, nilai: "A", semester },
      { kode: "VA112", matkul: "Basis Data", sks: 3, nilai: "AB", semester },
    ];
  },

  async getJadwal(semester) {
    await wait(350);
    return [
      { hari: "Senin", jam: "08:00-10:30", matkul: "Pengembangan Web Sisi Klien", ruang: "Lab 1", semester },
      { hari: "Rabu", jam: "10:30-13:00", matkul: "Probabilitas & Statistika", ruang: "R. 203", semester },
    ];
  },

  async getPengumuman(filterTanggal) {
    await wait(350);
    const all = [
      { id: 1, tanggal: "2025-12-20", judul: "Pengisian KRS Dibuka", isi: "Pengisian KRS dibuka sampai 27 Desember." },
      { id: 2, tanggal: "2025-12-22", judul: "Jadwal UAS", isi: "Silakan cek jadwal UAS pada menu Jadwal." },
    ];
    if (!filterTanggal) return all;
    return all.filter(x => x.tanggal === filterTanggal);
  },
};
