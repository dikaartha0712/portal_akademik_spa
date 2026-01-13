const STATE = {
  auth: { isLoggedIn: false, student: null },
  ui: { loading: false, alert: null }, // { type: "success"|"error", message: string }
  analytics: { pageViews: 0 },
  data: { krs: [], khs: [], jadwal: [], pengumuman: [] },
};

const listeners = new Set();

export const store = {
  getState() {
    return structuredClone(STATE);
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  _emit() {
    window.dispatchEvent(new Event("statechange"));
    listeners.forEach(fn => fn(this.getState()));
  },

  setLoading(isLoading) {
    STATE.ui.loading = isLoading;
    this._emit();
  },
  setAlert(type, message) {
    STATE.ui.alert = { type, message };
    this._emit();
  },
  clearAlert() {
    STATE.ui.alert = null;
    this._emit();
  },

  incrementPageViews() {
    STATE.analytics.pageViews += 1;
    this._emit();
  },

  login(student) {
    STATE.auth.isLoggedIn = true;
    STATE.auth.student = student;
    this._emit();
  },
  logout() {
    STATE.auth.isLoggedIn = false;
    STATE.auth.student = null;
    this._emit();
  },

  setData(key, value) {
    STATE.data[key] = value;
    this._emit();
  },
};
