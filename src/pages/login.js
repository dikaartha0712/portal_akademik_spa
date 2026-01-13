import { api } from "../api.js";
import { store } from "../store.js";
import { Alert, Button, Spinner, FormField } from "../ui/components.js";

export async function LoginPage() {
  const state = store.getState();
  const loading = state.ui.loading;
  const alert = state.ui.alert;

  return `
    <div class="center">
      <div class="card authbox">
        <h2 style="margin-top:0;">Login</h2>
        <p class="small">Gunakan password contoh: 123456</p>
        ${alert ? Alert(alert) : ""}
        <form id="login-form" class="row" style="flex-direction:column; align-items:stretch;">
          ${FormField({ label: "NIM", name: "nim", type: "text" })}
          ${FormField({ label: "Password", name: "password", type: "password" })}
          <div class="row" style="margin-top:6px;">
            ${Button({ text: loading ? "Memproses..." : "Login", variant: "primary", type: "submit", disabled: loading })}
            ${loading ? Spinner() : ""}
          </div>
        </form>
      </div>
    </div>
  `;
}

export function bindLoginEvents(root) {
  const form = root.querySelector("#login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    store.clearAlert();
    store.setLoading(true);

    const fd = new FormData(form);
    const nim = String(fd.get("nim") || "").trim();
    const password = String(fd.get("password") || "").trim();

    try {
      const student = await api.login({ nim, password });
      store.login(student);
      store.setAlert("success", "Login berhasil.");
      history.pushState({}, "", "/");
      window.dispatchEvent(new Event("routechange"));
    } catch (err) {
      store.setAlert("error", err.message || "Login gagal.");
    } finally {
      store.setLoading(false);
    }
  });
}
