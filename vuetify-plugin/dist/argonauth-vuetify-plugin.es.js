import dl from "@ravoni4devs/libcryptus";
import fl from "axios";
import { effectScope as Xt, ref as j, markRaw as $e, toRaw as it, watch as q, unref as Ae, hasInjectionContext as vl, inject as se, getCurrentInstance as Lo, reactive as st, isRef as ze, isReactive as Fo, toRef as F, nextTick as ge, computed as T, getCurrentScope as ml, onScopeDispose as ye, toRefs as lo, capitalize as mi, watchEffect as dt, shallowRef as re, Fragment as xe, warn as $o, provide as ft, defineComponent as gl, h as On, camelize as gi, toValue as He, createElementVNode as O, normalizeClass as K, createVNode as S, normalizeStyle as J, useId as In, onBeforeUnmount as St, onMounted as xn, onUpdated as hl, mergeProps as ne, Text as yl, readonly as hi, Transition as Zt, resolveDynamicComponent as _l, withDirectives as We, toDisplayString as ue, TransitionGroup as Mo, Teleport as pl, vShow as Tn, createBlock as Nt, openBlock as Je, withCtx as fe, createTextVNode as Ie, onBeforeMount as yi, cloneVNode as bl, createCommentVNode as Gn, withModifiers as dr, createElementBlock as fr, useAttrs as El, toHandlers as Cl, renderSlot as Sl } from "vue";
class wl {
  set(t, n) {
    localStorage.setItem(t, n);
  }
  get(t) {
    return localStorage.getItem(t);
  }
}
function Al() {
  return new wl();
}
const uo = (e, t) => t.some((n) => e instanceof n);
let vr, mr;
function kl() {
  return vr || (vr = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Ol() {
  return mr || (mr = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const co = /* @__PURE__ */ new WeakMap(), qn = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ new WeakMap();
function Il(e) {
  const t = new Promise((n, o) => {
    const r = () => {
      e.removeEventListener("success", a), e.removeEventListener("error", i);
    }, a = () => {
      n(tt(e.result)), r();
    }, i = () => {
      o(e.error), r();
    };
    e.addEventListener("success", a), e.addEventListener("error", i);
  });
  return Pn.set(t, e), t;
}
function xl(e) {
  if (co.has(e))
    return;
  const t = new Promise((n, o) => {
    const r = () => {
      e.removeEventListener("complete", a), e.removeEventListener("error", i), e.removeEventListener("abort", i);
    }, a = () => {
      n(), r();
    }, i = () => {
      o(e.error || new DOMException("AbortError", "AbortError")), r();
    };
    e.addEventListener("complete", a), e.addEventListener("error", i), e.addEventListener("abort", i);
  });
  co.set(e, t);
}
let fo = {
  get(e, t, n) {
    if (e instanceof IDBTransaction) {
      if (t === "done")
        return co.get(e);
      if (t === "store")
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return tt(e[t]);
  },
  set(e, t, n) {
    return e[t] = n, !0;
  },
  has(e, t) {
    return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e;
  }
};
function _i(e) {
  fo = e(fo);
}
function Tl(e) {
  return Ol().includes(e) ? function(...t) {
    return e.apply(vo(this), t), tt(this.request);
  } : function(...t) {
    return tt(e.apply(vo(this), t));
  };
}
function Pl(e) {
  return typeof e == "function" ? Tl(e) : (e instanceof IDBTransaction && xl(e), uo(e, kl()) ? new Proxy(e, fo) : e);
}
function tt(e) {
  if (e instanceof IDBRequest)
    return Il(e);
  if (qn.has(e))
    return qn.get(e);
  const t = Pl(e);
  return t !== e && (qn.set(e, t), Pn.set(t, e)), t;
}
const vo = (e) => Pn.get(e);
function Vl(e, t, { blocked: n, upgrade: o, blocking: r, terminated: a } = {}) {
  const i = indexedDB.open(e, t), s = tt(i);
  return o && i.addEventListener("upgradeneeded", (l) => {
    o(tt(i.result), l.oldVersion, l.newVersion, tt(i.transaction), l);
  }), n && i.addEventListener("blocked", (l) => n(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    l.oldVersion,
    l.newVersion,
    l
  )), s.then((l) => {
    a && l.addEventListener("close", () => a()), r && l.addEventListener("versionchange", (u) => r(u.oldVersion, u.newVersion, u));
  }).catch(() => {
  }), s;
}
const Dl = ["get", "getKey", "getAll", "getAllKeys", "count"], Rl = ["put", "add", "delete", "clear"], Yn = /* @__PURE__ */ new Map();
function gr(e, t) {
  if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string"))
    return;
  if (Yn.get(t))
    return Yn.get(t);
  const n = t.replace(/FromIndex$/, ""), o = t !== n, r = Rl.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (o ? IDBIndex : IDBObjectStore).prototype) || !(r || Dl.includes(n))
  )
    return;
  const a = async function(i, ...s) {
    const l = this.transaction(i, r ? "readwrite" : "readonly");
    let u = l.store;
    return o && (u = u.index(s.shift())), (await Promise.all([
      u[n](...s),
      r && l.done
    ]))[0];
  };
  return Yn.set(t, a), a;
}
_i((e) => ({
  ...e,
  get: (t, n, o) => gr(t, n) || e.get(t, n, o),
  has: (t, n) => !!gr(t, n) || e.has(t, n)
}));
const Bl = ["continue", "continuePrimaryKey", "advance"], hr = {}, mo = /* @__PURE__ */ new WeakMap(), pi = /* @__PURE__ */ new WeakMap(), Nl = {
  get(e, t) {
    if (!Bl.includes(t))
      return e[t];
    let n = hr[t];
    return n || (n = hr[t] = function(...o) {
      mo.set(this, pi.get(this)[t](...o));
    }), n;
  }
};
async function* Ll(...e) {
  let t = this;
  if (t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)
    return;
  t = t;
  const n = new Proxy(t, Nl);
  for (pi.set(n, t), Pn.set(n, vo(t)); t; )
    yield n, t = await (mo.get(n) || t.continue()), mo.delete(n);
}
function yr(e, t) {
  return t === Symbol.asyncIterator && uo(e, [IDBIndex, IDBObjectStore, IDBCursor]) || t === "iterate" && uo(e, [IDBIndex, IDBObjectStore]);
}
_i((e) => ({
  ...e,
  get(t, n, o) {
    return yr(t, n) ? Ll : e.get(t, n, o);
  },
  has(t, n) {
    return yr(t, n) || e.has(t, n);
  }
}));
const Tt = {
  ReadOnly: "readonly",
  Write: "readwrite"
};
class Fl {
  constructor(t) {
    this._params = t, this._table = t.table, this._db = null;
  }
  setTable(t) {
    this._table = t;
  }
  async set(t) {
    const n = await this.tx(Tt.Write);
    t.id = t.id || t.user.id, await n.objectStore(this._table).put(t);
  }
  async getById(t) {
    return await (await this.tx(Tt.ReadOnly)).objectStore(this._table).get(t);
  }
  async get({ index: t, key: n }) {
    return await this.tx(Tt.ReadOnly).getFromIndex(this._table, t, n);
  }
  async removeById(t) {
    return await (await this.tx(Tt.Write)).objectStore(this._table).delete(t);
  }
  async tx(t) {
    const n = t || Tt.Write;
    return (await this.db()).transaction(this._table, n);
  }
  async db() {
    return this._db || await this._createdb(this._params), this._db;
  }
  async _createdb({ name: t = "", table: n = "", keyPath: o = "id", indexes: r = [] }) {
    const a = await Vl(t, 1, {
      upgrade(i) {
        const s = i.createObjectStore(n, {
          keyPath: o,
          autoIncrement: !1
        });
        r.forEach((l) => s.createIndex(l, l));
      }
    });
    this._db = a;
  }
}
function $l(e) {
  return new Fl(e);
}
function _r(e) {
  const t = fl.create(e);
  t.defaults.headers.common["Content-Type"] = "application/json";
  const n = e.baseURL || process.env.API_BASE_URL;
  return n && (t.defaults.baseURL = n), t.interceptors.response.use(
    (o) => o.data && o.data.data ? o.data.data : o.data,
    (o) => o.response ? o.response.status === 401 ? Promise.reject({
      status: 401,
      error: new Error("401")
    }) : o.response.data && o.response.data.error ? Promise.reject({
      code: o.response.status,
      error: o.response.data.error
    }) : Promise.reject({
      status: 666,
      error: o
    }) : Promise.reject({
      status: 0,
      error: o
    })
  ), t;
}
class Ml {
  constructor(t = {}) {
    this.params = t, this.$axios = _r(t);
  }
  withToken(t) {
    return t ? this.withHeaders({ Authorization: `Bearer ${t}` }) : this.$axios;
  }
  withHeaders(t) {
    const n = _r(this.params), { common: o } = n.defaults.headers;
    return n.defaults.headers.common = {
      ...o,
      ...t
    }, n;
  }
  post(t, n, o) {
    return this.$axios.post(t, n, o);
  }
  put(t, n, o) {
    return this.$axios.put(t, n, o);
  }
  patch(t, n, o) {
    return this.$axios.patch(t, n, o);
  }
  get(t, n) {
    return this.$axios.get(t, n);
  }
  delete(t, n) {
    return this.$axios.delete(t, n);
  }
  options(t, n) {
    return this.$axios.options(t, n);
  }
  head(t, n) {
    return this.$axios.head(t, n);
  }
}
function Ul(e) {
  return new Ml(e);
}
const pr = "user_id";
class jl {
  constructor({ httpClient: t, indexdb: n, storage: o, endpoints: r }) {
    this.$db = n, this.$httpClient = t, this.$storage = o, this.$cryptus = new dl(), this.$endpoints = r;
  }
  async preLogin(t) {
    const n = this.$endpoints.preLogin;
    return await this.$httpClient.post(n, { email: t });
  }
  async login(t) {
    const n = await this.$cryptus.pbkdf2({
      plainText: t.rawPassword,
      salt: t.salt,
      length: 256
    }), o = {
      id: t.id,
      email: t.email,
      password: n
    }, r = this.$endpoints.login, a = await this.$httpClient.post(r, o);
    return await this.$db.set(a), await this.$storage.set(pr, a.id), a;
  }
  async getCurrentAccount() {
    const t = await this.$storage.get(pr);
    return await this.$db.getById(t);
  }
  async getToken() {
    return (await this.getCurrentAccount()).token || "";
  }
  async whoami() {
    const t = this.$endpoints.whoami;
    return await this.$httpClient.withToken().get(t);
  }
  async logout() {
    const t = await this.getCurrentAccount(), n = this.$endpoints.logout;
    await this.$httpClient.withToken(t.token).delete(n), await this.$db.removeById(t.id);
  }
}
function zl({ dbName: e = "argonauth", baseURL: t = "", endpoints: n = {} } = {}) {
  const o = Al(), r = $l({ name: e, table: "argonauth" }), a = Ul({ baseURL: t, withCredentials: !0 });
  return new jl({ storage: o, indexdb: r, httpClient: a, endpoints: n });
}
var Hl = Object.create, bi = Object.defineProperty, Wl = Object.getOwnPropertyDescriptor, Uo = Object.getOwnPropertyNames, Kl = Object.getPrototypeOf, Gl = Object.prototype.hasOwnProperty, ql = (e, t) => function() {
  return e && (t = (0, e[Uo(e)[0]])(e = 0)), t;
}, Yl = (e, t) => function() {
  return t || (0, e[Uo(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, Xl = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of Uo(t))
      !Gl.call(e, r) && r !== n && bi(e, r, { get: () => t[r], enumerable: !(o = Wl(t, r)) || o.enumerable });
  return e;
}, Zl = (e, t, n) => (n = e != null ? Hl(Kl(e)) : {}, Xl(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  bi(n, "default", { value: e, enumerable: !0 }),
  e
)), Jt = ql({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), Jl = Yl({
  "../../node_modules/.pnpm/rfdc@1.4.1/node_modules/rfdc/index.js"(e, t) {
    Jt(), t.exports = o;
    function n(a) {
      return a instanceof Buffer ? Buffer.from(a) : new a.constructor(a.buffer.slice(), a.byteOffset, a.length);
    }
    function o(a) {
      if (a = a || {}, a.circles) return r(a);
      const i = /* @__PURE__ */ new Map();
      if (i.set(Date, (d) => new Date(d)), i.set(Map, (d, v) => new Map(l(Array.from(d), v))), i.set(Set, (d, v) => new Set(l(Array.from(d), v))), a.constructorHandlers)
        for (const d of a.constructorHandlers)
          i.set(d[0], d[1]);
      let s = null;
      return a.proto ? c : u;
      function l(d, v) {
        const f = Object.keys(d), m = new Array(f.length);
        for (let h = 0; h < f.length; h++) {
          const y = f[h], g = d[y];
          typeof g != "object" || g === null ? m[y] = g : g.constructor !== Object && (s = i.get(g.constructor)) ? m[y] = s(g, v) : ArrayBuffer.isView(g) ? m[y] = n(g) : m[y] = v(g);
        }
        return m;
      }
      function u(d) {
        if (typeof d != "object" || d === null) return d;
        if (Array.isArray(d)) return l(d, u);
        if (d.constructor !== Object && (s = i.get(d.constructor)))
          return s(d, u);
        const v = {};
        for (const f in d) {
          if (Object.hasOwnProperty.call(d, f) === !1) continue;
          const m = d[f];
          typeof m != "object" || m === null ? v[f] = m : m.constructor !== Object && (s = i.get(m.constructor)) ? v[f] = s(m, u) : ArrayBuffer.isView(m) ? v[f] = n(m) : v[f] = u(m);
        }
        return v;
      }
      function c(d) {
        if (typeof d != "object" || d === null) return d;
        if (Array.isArray(d)) return l(d, c);
        if (d.constructor !== Object && (s = i.get(d.constructor)))
          return s(d, c);
        const v = {};
        for (const f in d) {
          const m = d[f];
          typeof m != "object" || m === null ? v[f] = m : m.constructor !== Object && (s = i.get(m.constructor)) ? v[f] = s(m, c) : ArrayBuffer.isView(m) ? v[f] = n(m) : v[f] = c(m);
        }
        return v;
      }
    }
    function r(a) {
      const i = [], s = [], l = /* @__PURE__ */ new Map();
      if (l.set(Date, (f) => new Date(f)), l.set(Map, (f, m) => new Map(c(Array.from(f), m))), l.set(Set, (f, m) => new Set(c(Array.from(f), m))), a.constructorHandlers)
        for (const f of a.constructorHandlers)
          l.set(f[0], f[1]);
      let u = null;
      return a.proto ? v : d;
      function c(f, m) {
        const h = Object.keys(f), y = new Array(h.length);
        for (let g = 0; g < h.length; g++) {
          const E = h[g], A = f[E];
          if (typeof A != "object" || A === null)
            y[E] = A;
          else if (A.constructor !== Object && (u = l.get(A.constructor)))
            y[E] = u(A, m);
          else if (ArrayBuffer.isView(A))
            y[E] = n(A);
          else {
            const b = i.indexOf(A);
            b !== -1 ? y[E] = s[b] : y[E] = m(A);
          }
        }
        return y;
      }
      function d(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return c(f, d);
        if (f.constructor !== Object && (u = l.get(f.constructor)))
          return u(f, d);
        const m = {};
        i.push(f), s.push(m);
        for (const h in f) {
          if (Object.hasOwnProperty.call(f, h) === !1) continue;
          const y = f[h];
          if (typeof y != "object" || y === null)
            m[h] = y;
          else if (y.constructor !== Object && (u = l.get(y.constructor)))
            m[h] = u(y, d);
          else if (ArrayBuffer.isView(y))
            m[h] = n(y);
          else {
            const g = i.indexOf(y);
            g !== -1 ? m[h] = s[g] : m[h] = d(y);
          }
        }
        return i.pop(), s.pop(), m;
      }
      function v(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return c(f, v);
        if (f.constructor !== Object && (u = l.get(f.constructor)))
          return u(f, v);
        const m = {};
        i.push(f), s.push(m);
        for (const h in f) {
          const y = f[h];
          if (typeof y != "object" || y === null)
            m[h] = y;
          else if (y.constructor !== Object && (u = l.get(y.constructor)))
            m[h] = u(y, v);
          else if (ArrayBuffer.isView(y))
            m[h] = n(y);
          else {
            const g = i.indexOf(y);
            g !== -1 ? m[h] = s[g] : m[h] = v(y);
          }
        }
        return i.pop(), s.pop(), m;
      }
    }
  }
});
Jt();
Jt();
Jt();
var Ei = typeof navigator < "u", D = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {};
typeof D.chrome < "u" && D.chrome.devtools;
Ei && (D.self, D.top);
var br;
typeof navigator < "u" && ((br = navigator.userAgent) == null || br.toLowerCase().includes("electron"));
Jt();
var Ql = Zl(Jl()), eu = /(?:^|[-_/])(\w)/g;
function tu(e, t) {
  return t ? t.toUpperCase() : "";
}
function nu(e) {
  return e && `${e}`.replace(eu, tu);
}
function ou(e, t) {
  let n = e.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  n.endsWith(`index${t}`) && (n = n.replace(`/index${t}`, t));
  const o = n.lastIndexOf("/"), r = n.substring(o + 1);
  {
    const a = r.lastIndexOf(t);
    return r.substring(0, a);
  }
}
var Er = (0, Ql.default)({ circles: !0 });
const ru = {
  trailing: !0
};
function pt(e, t = 25, n = {}) {
  if (n = { ...ru, ...n }, !Number.isFinite(t))
    throw new TypeError("Expected `wait` to be a finite number");
  let o, r, a = [], i, s;
  const l = (u, c) => (i = au(e, u, c), i.finally(() => {
    if (i = null, n.trailing && s && !r) {
      const d = l(u, s);
      return s = null, d;
    }
  }), i);
  return function(...u) {
    return i ? (n.trailing && (s = u), i) : new Promise((c) => {
      const d = !r && n.leading;
      clearTimeout(r), r = setTimeout(() => {
        r = null;
        const v = n.leading ? o : l(this, u);
        for (const f of a)
          f(v);
        a = [];
      }, t), d ? (o = l(this, u), c(o)) : a.push(c);
    });
  };
}
async function au(e, t, n) {
  return await e.apply(t, n);
}
function go(e, t = {}, n) {
  for (const o in e) {
    const r = e[o], a = n ? `${n}:${o}` : o;
    typeof r == "object" && r !== null ? go(r, t, a) : typeof r == "function" && (t[a] = r);
  }
  return t;
}
const iu = { run: (e) => e() }, su = () => iu, Ci = typeof console.createTask < "u" ? console.createTask : su;
function lu(e, t) {
  const n = t.shift(), o = Ci(n);
  return e.reduce(
    (r, a) => r.then(() => o.run(() => a(...t))),
    Promise.resolve()
  );
}
function uu(e, t) {
  const n = t.shift(), o = Ci(n);
  return Promise.all(e.map((r) => o.run(() => r(...t))));
}
function Xn(e, t) {
  for (const n of [...e])
    n(t);
}
class cu {
  constructor() {
    this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
  }
  hook(t, n, o = {}) {
    if (!t || typeof n != "function")
      return () => {
      };
    const r = t;
    let a;
    for (; this._deprecatedHooks[t]; )
      a = this._deprecatedHooks[t], t = a.to;
    if (a && !o.allowDeprecated) {
      let i = a.message;
      i || (i = `${r} hook has been deprecated` + (a.to ? `, please use ${a.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(i) || (console.warn(i), this._deprecatedMessages.add(i));
    }
    if (!n.name)
      try {
        Object.defineProperty(n, "name", {
          get: () => "_" + t.replace(/\W+/g, "_") + "_hook_cb",
          configurable: !0
        });
      } catch {
      }
    return this._hooks[t] = this._hooks[t] || [], this._hooks[t].push(n), () => {
      n && (this.removeHook(t, n), n = void 0);
    };
  }
  hookOnce(t, n) {
    let o, r = (...a) => (typeof o == "function" && o(), o = void 0, r = void 0, n(...a));
    return o = this.hook(t, r), o;
  }
  removeHook(t, n) {
    if (this._hooks[t]) {
      const o = this._hooks[t].indexOf(n);
      o !== -1 && this._hooks[t].splice(o, 1), this._hooks[t].length === 0 && delete this._hooks[t];
    }
  }
  deprecateHook(t, n) {
    this._deprecatedHooks[t] = typeof n == "string" ? { to: n } : n;
    const o = this._hooks[t] || [];
    delete this._hooks[t];
    for (const r of o)
      this.hook(t, r);
  }
  deprecateHooks(t) {
    Object.assign(this._deprecatedHooks, t);
    for (const n in t)
      this.deprecateHook(n, t[n]);
  }
  addHooks(t) {
    const n = go(t), o = Object.keys(n).map(
      (r) => this.hook(r, n[r])
    );
    return () => {
      for (const r of o.splice(0, o.length))
        r();
    };
  }
  removeHooks(t) {
    const n = go(t);
    for (const o in n)
      this.removeHook(o, n[o]);
  }
  removeAllHooks() {
    for (const t in this._hooks)
      delete this._hooks[t];
  }
  callHook(t, ...n) {
    return n.unshift(t), this.callHookWith(lu, t, ...n);
  }
  callHookParallel(t, ...n) {
    return n.unshift(t), this.callHookWith(uu, t, ...n);
  }
  callHookWith(t, n, ...o) {
    const r = this._before || this._after ? { name: n, args: o, context: {} } : void 0;
    this._before && Xn(this._before, r);
    const a = t(
      n in this._hooks ? [...this._hooks[n]] : [],
      o
    );
    return a instanceof Promise ? a.finally(() => {
      this._after && r && Xn(this._after, r);
    }) : (this._after && r && Xn(this._after, r), a);
  }
  beforeEach(t) {
    return this._before = this._before || [], this._before.push(t), () => {
      if (this._before !== void 0) {
        const n = this._before.indexOf(t);
        n !== -1 && this._before.splice(n, 1);
      }
    };
  }
  afterEach(t) {
    return this._after = this._after || [], this._after.push(t), () => {
      if (this._after !== void 0) {
        const n = this._after.indexOf(t);
        n !== -1 && this._after.splice(n, 1);
      }
    };
  }
}
function Si() {
  return new cu();
}
var du = Object.create, wi = Object.defineProperty, fu = Object.getOwnPropertyDescriptor, jo = Object.getOwnPropertyNames, vu = Object.getPrototypeOf, mu = Object.prototype.hasOwnProperty, gu = (e, t) => function() {
  return e && (t = (0, e[jo(e)[0]])(e = 0)), t;
}, Ai = (e, t) => function() {
  return t || (0, e[jo(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, hu = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of jo(t))
      !mu.call(e, r) && r !== n && wi(e, r, { get: () => t[r], enumerable: !(o = fu(t, r)) || o.enumerable });
  return e;
}, yu = (e, t, n) => (n = e != null ? du(vu(e)) : {}, hu(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  wi(n, "default", { value: e, enumerable: !0 }),
  e
)), p = gu({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), _u = Ai({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/lib/speakingurl.js"(e, t) {
    p(), function(n) {
      var o = {
        // latin
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "Ae",
        Å: "A",
        Æ: "AE",
        Ç: "C",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        Ð: "D",
        Ñ: "N",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "Oe",
        Ő: "O",
        Ø: "O",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "Ue",
        Ű: "U",
        Ý: "Y",
        Þ: "TH",
        ß: "ss",
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "ae",
        å: "a",
        æ: "ae",
        ç: "c",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        ð: "d",
        ñ: "n",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "oe",
        ő: "o",
        ø: "o",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "ue",
        ű: "u",
        ý: "y",
        þ: "th",
        ÿ: "y",
        "ẞ": "SS",
        // language specific
        // Arabic
        ا: "a",
        أ: "a",
        إ: "i",
        آ: "aa",
        ؤ: "u",
        ئ: "e",
        ء: "a",
        ب: "b",
        ت: "t",
        ث: "th",
        ج: "j",
        ح: "h",
        خ: "kh",
        د: "d",
        ذ: "th",
        ر: "r",
        ز: "z",
        س: "s",
        ش: "sh",
        ص: "s",
        ض: "dh",
        ط: "t",
        ظ: "z",
        ع: "a",
        غ: "gh",
        ف: "f",
        ق: "q",
        ك: "k",
        ل: "l",
        م: "m",
        ن: "n",
        ه: "h",
        و: "w",
        ي: "y",
        ى: "a",
        ة: "h",
        ﻻ: "la",
        ﻷ: "laa",
        ﻹ: "lai",
        ﻵ: "laa",
        // Persian additional characters than Arabic
        گ: "g",
        چ: "ch",
        پ: "p",
        ژ: "zh",
        ک: "k",
        ی: "y",
        // Arabic diactrics
        "َ": "a",
        "ً": "an",
        "ِ": "e",
        "ٍ": "en",
        "ُ": "u",
        "ٌ": "on",
        "ْ": "",
        // Arabic numbers
        "٠": "0",
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        // Persian numbers
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        // Burmese consonants
        က: "k",
        ခ: "kh",
        ဂ: "g",
        ဃ: "ga",
        င: "ng",
        စ: "s",
        ဆ: "sa",
        ဇ: "z",
        "စျ": "za",
        ည: "ny",
        ဋ: "t",
        ဌ: "ta",
        ဍ: "d",
        ဎ: "da",
        ဏ: "na",
        တ: "t",
        ထ: "ta",
        ဒ: "d",
        ဓ: "da",
        န: "n",
        ပ: "p",
        ဖ: "pa",
        ဗ: "b",
        ဘ: "ba",
        မ: "m",
        ယ: "y",
        ရ: "ya",
        လ: "l",
        ဝ: "w",
        သ: "th",
        ဟ: "h",
        ဠ: "la",
        အ: "a",
        // consonant character combos
        "ြ": "y",
        "ျ": "ya",
        "ွ": "w",
        "ြွ": "yw",
        "ျွ": "ywa",
        "ှ": "h",
        // independent vowels
        ဧ: "e",
        "၏": "-e",
        ဣ: "i",
        ဤ: "-i",
        ဉ: "u",
        ဦ: "-u",
        ဩ: "aw",
        "သြော": "aw",
        ဪ: "aw",
        // numbers
        "၀": "0",
        "၁": "1",
        "၂": "2",
        "၃": "3",
        "၄": "4",
        "၅": "5",
        "၆": "6",
        "၇": "7",
        "၈": "8",
        "၉": "9",
        // virama and tone marks which are silent in transliteration
        "္": "",
        "့": "",
        "း": "",
        // Czech
        č: "c",
        ď: "d",
        ě: "e",
        ň: "n",
        ř: "r",
        š: "s",
        ť: "t",
        ů: "u",
        ž: "z",
        Č: "C",
        Ď: "D",
        Ě: "E",
        Ň: "N",
        Ř: "R",
        Š: "S",
        Ť: "T",
        Ů: "U",
        Ž: "Z",
        // Dhivehi
        ހ: "h",
        ށ: "sh",
        ނ: "n",
        ރ: "r",
        ބ: "b",
        ޅ: "lh",
        ކ: "k",
        އ: "a",
        ވ: "v",
        މ: "m",
        ފ: "f",
        ދ: "dh",
        ތ: "th",
        ލ: "l",
        ގ: "g",
        ޏ: "gn",
        ސ: "s",
        ޑ: "d",
        ޒ: "z",
        ޓ: "t",
        ޔ: "y",
        ޕ: "p",
        ޖ: "j",
        ޗ: "ch",
        ޘ: "tt",
        ޙ: "hh",
        ޚ: "kh",
        ޛ: "th",
        ޜ: "z",
        ޝ: "sh",
        ޞ: "s",
        ޟ: "d",
        ޠ: "t",
        ޡ: "z",
        ޢ: "a",
        ޣ: "gh",
        ޤ: "q",
        ޥ: "w",
        "ަ": "a",
        "ާ": "aa",
        "ި": "i",
        "ީ": "ee",
        "ު": "u",
        "ޫ": "oo",
        "ެ": "e",
        "ޭ": "ey",
        "ޮ": "o",
        "ޯ": "oa",
        "ް": "",
        // Georgian https://en.wikipedia.org/wiki/Romanization_of_Georgian
        // National system (2002)
        ა: "a",
        ბ: "b",
        გ: "g",
        დ: "d",
        ე: "e",
        ვ: "v",
        ზ: "z",
        თ: "t",
        ი: "i",
        კ: "k",
        ლ: "l",
        მ: "m",
        ნ: "n",
        ო: "o",
        პ: "p",
        ჟ: "zh",
        რ: "r",
        ს: "s",
        ტ: "t",
        უ: "u",
        ფ: "p",
        ქ: "k",
        ღ: "gh",
        ყ: "q",
        შ: "sh",
        ჩ: "ch",
        ც: "ts",
        ძ: "dz",
        წ: "ts",
        ჭ: "ch",
        ხ: "kh",
        ჯ: "j",
        ჰ: "h",
        // Greek
        α: "a",
        β: "v",
        γ: "g",
        δ: "d",
        ε: "e",
        ζ: "z",
        η: "i",
        θ: "th",
        ι: "i",
        κ: "k",
        λ: "l",
        μ: "m",
        ν: "n",
        ξ: "ks",
        ο: "o",
        π: "p",
        ρ: "r",
        σ: "s",
        τ: "t",
        υ: "y",
        φ: "f",
        χ: "x",
        ψ: "ps",
        ω: "o",
        ά: "a",
        έ: "e",
        ί: "i",
        ό: "o",
        ύ: "y",
        ή: "i",
        ώ: "o",
        ς: "s",
        ϊ: "i",
        ΰ: "y",
        ϋ: "y",
        ΐ: "i",
        Α: "A",
        Β: "B",
        Γ: "G",
        Δ: "D",
        Ε: "E",
        Ζ: "Z",
        Η: "I",
        Θ: "TH",
        Ι: "I",
        Κ: "K",
        Λ: "L",
        Μ: "M",
        Ν: "N",
        Ξ: "KS",
        Ο: "O",
        Π: "P",
        Ρ: "R",
        Σ: "S",
        Τ: "T",
        Υ: "Y",
        Φ: "F",
        Χ: "X",
        Ψ: "PS",
        Ω: "O",
        Ά: "A",
        Έ: "E",
        Ί: "I",
        Ό: "O",
        Ύ: "Y",
        Ή: "I",
        Ώ: "O",
        Ϊ: "I",
        Ϋ: "Y",
        // Latvian
        ā: "a",
        // 'č': 'c', // duplicate
        ē: "e",
        ģ: "g",
        ī: "i",
        ķ: "k",
        ļ: "l",
        ņ: "n",
        // 'š': 's', // duplicate
        ū: "u",
        // 'ž': 'z', // duplicate
        Ā: "A",
        // 'Č': 'C', // duplicate
        Ē: "E",
        Ģ: "G",
        Ī: "I",
        Ķ: "k",
        Ļ: "L",
        Ņ: "N",
        // 'Š': 'S', // duplicate
        Ū: "U",
        // 'Ž': 'Z', // duplicate
        // Macedonian
        Ќ: "Kj",
        ќ: "kj",
        Љ: "Lj",
        љ: "lj",
        Њ: "Nj",
        њ: "nj",
        Тс: "Ts",
        тс: "ts",
        // Polish
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        // 'ó': 'o', // duplicate
        ś: "s",
        ź: "z",
        ż: "z",
        Ą: "A",
        Ć: "C",
        Ę: "E",
        Ł: "L",
        Ń: "N",
        Ś: "S",
        Ź: "Z",
        Ż: "Z",
        // Ukranian
        Є: "Ye",
        І: "I",
        Ї: "Yi",
        Ґ: "G",
        є: "ye",
        і: "i",
        ї: "yi",
        ґ: "g",
        // Romanian
        ă: "a",
        Ă: "A",
        ș: "s",
        Ș: "S",
        // 'ş': 's', // duplicate
        // 'Ş': 'S', // duplicate
        ț: "t",
        Ț: "T",
        ţ: "t",
        Ţ: "T",
        // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
        // ICAO
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "i",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "c",
        ч: "ch",
        ш: "sh",
        щ: "sh",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
        А: "A",
        Б: "B",
        В: "V",
        Г: "G",
        Д: "D",
        Е: "E",
        Ё: "Yo",
        Ж: "Zh",
        З: "Z",
        И: "I",
        Й: "I",
        К: "K",
        Л: "L",
        М: "M",
        Н: "N",
        О: "O",
        П: "P",
        Р: "R",
        С: "S",
        Т: "T",
        У: "U",
        Ф: "F",
        Х: "Kh",
        Ц: "C",
        Ч: "Ch",
        Ш: "Sh",
        Щ: "Sh",
        Ъ: "",
        Ы: "Y",
        Ь: "",
        Э: "E",
        Ю: "Yu",
        Я: "Ya",
        // Serbian
        ђ: "dj",
        ј: "j",
        // 'љ': 'lj',  // duplicate
        // 'њ': 'nj', // duplicate
        ћ: "c",
        џ: "dz",
        Ђ: "Dj",
        Ј: "j",
        // 'Љ': 'Lj', // duplicate
        // 'Њ': 'Nj', // duplicate
        Ћ: "C",
        Џ: "Dz",
        // Slovak
        ľ: "l",
        ĺ: "l",
        ŕ: "r",
        Ľ: "L",
        Ĺ: "L",
        Ŕ: "R",
        // Turkish
        ş: "s",
        Ş: "S",
        ı: "i",
        İ: "I",
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'u', // duplicate, see langCharMap
        // 'Ü': 'U', // duplicate, see langCharMap
        // 'ö': 'o', // duplicate, see langCharMap
        // 'Ö': 'O', // duplicate, see langCharMap
        ğ: "g",
        Ğ: "G",
        // Vietnamese
        ả: "a",
        Ả: "A",
        ẳ: "a",
        Ẳ: "A",
        ẩ: "a",
        Ẩ: "A",
        đ: "d",
        Đ: "D",
        ẹ: "e",
        Ẹ: "E",
        ẽ: "e",
        Ẽ: "E",
        ẻ: "e",
        Ẻ: "E",
        ế: "e",
        Ế: "E",
        ề: "e",
        Ề: "E",
        ệ: "e",
        Ệ: "E",
        ễ: "e",
        Ễ: "E",
        ể: "e",
        Ể: "E",
        ỏ: "o",
        ọ: "o",
        Ọ: "o",
        ố: "o",
        Ố: "O",
        ồ: "o",
        Ồ: "O",
        ổ: "o",
        Ổ: "O",
        ộ: "o",
        Ộ: "O",
        ỗ: "o",
        Ỗ: "O",
        ơ: "o",
        Ơ: "O",
        ớ: "o",
        Ớ: "O",
        ờ: "o",
        Ờ: "O",
        ợ: "o",
        Ợ: "O",
        ỡ: "o",
        Ỡ: "O",
        Ở: "o",
        ở: "o",
        ị: "i",
        Ị: "I",
        ĩ: "i",
        Ĩ: "I",
        ỉ: "i",
        Ỉ: "i",
        ủ: "u",
        Ủ: "U",
        ụ: "u",
        Ụ: "U",
        ũ: "u",
        Ũ: "U",
        ư: "u",
        Ư: "U",
        ứ: "u",
        Ứ: "U",
        ừ: "u",
        Ừ: "U",
        ự: "u",
        Ự: "U",
        ữ: "u",
        Ữ: "U",
        ử: "u",
        Ử: "ư",
        ỷ: "y",
        Ỷ: "y",
        ỳ: "y",
        Ỳ: "Y",
        ỵ: "y",
        Ỵ: "Y",
        ỹ: "y",
        Ỹ: "Y",
        ạ: "a",
        Ạ: "A",
        ấ: "a",
        Ấ: "A",
        ầ: "a",
        Ầ: "A",
        ậ: "a",
        Ậ: "A",
        ẫ: "a",
        Ẫ: "A",
        // 'ă': 'a', // duplicate
        // 'Ă': 'A', // duplicate
        ắ: "a",
        Ắ: "A",
        ằ: "a",
        Ằ: "A",
        ặ: "a",
        Ặ: "A",
        ẵ: "a",
        Ẵ: "A",
        "⓪": "0",
        "①": "1",
        "②": "2",
        "③": "3",
        "④": "4",
        "⑤": "5",
        "⑥": "6",
        "⑦": "7",
        "⑧": "8",
        "⑨": "9",
        "⑩": "10",
        "⑪": "11",
        "⑫": "12",
        "⑬": "13",
        "⑭": "14",
        "⑮": "15",
        "⑯": "16",
        "⑰": "17",
        "⑱": "18",
        "⑲": "18",
        "⑳": "18",
        "⓵": "1",
        "⓶": "2",
        "⓷": "3",
        "⓸": "4",
        "⓹": "5",
        "⓺": "6",
        "⓻": "7",
        "⓼": "8",
        "⓽": "9",
        "⓾": "10",
        "⓿": "0",
        "⓫": "11",
        "⓬": "12",
        "⓭": "13",
        "⓮": "14",
        "⓯": "15",
        "⓰": "16",
        "⓱": "17",
        "⓲": "18",
        "⓳": "19",
        "⓴": "20",
        "Ⓐ": "A",
        "Ⓑ": "B",
        "Ⓒ": "C",
        "Ⓓ": "D",
        "Ⓔ": "E",
        "Ⓕ": "F",
        "Ⓖ": "G",
        "Ⓗ": "H",
        "Ⓘ": "I",
        "Ⓙ": "J",
        "Ⓚ": "K",
        "Ⓛ": "L",
        "Ⓜ": "M",
        "Ⓝ": "N",
        "Ⓞ": "O",
        "Ⓟ": "P",
        "Ⓠ": "Q",
        "Ⓡ": "R",
        "Ⓢ": "S",
        "Ⓣ": "T",
        "Ⓤ": "U",
        "Ⓥ": "V",
        "Ⓦ": "W",
        "Ⓧ": "X",
        "Ⓨ": "Y",
        "Ⓩ": "Z",
        "ⓐ": "a",
        "ⓑ": "b",
        "ⓒ": "c",
        "ⓓ": "d",
        "ⓔ": "e",
        "ⓕ": "f",
        "ⓖ": "g",
        "ⓗ": "h",
        "ⓘ": "i",
        "ⓙ": "j",
        "ⓚ": "k",
        "ⓛ": "l",
        "ⓜ": "m",
        "ⓝ": "n",
        "ⓞ": "o",
        "ⓟ": "p",
        "ⓠ": "q",
        "ⓡ": "r",
        "ⓢ": "s",
        "ⓣ": "t",
        "ⓤ": "u",
        "ⓦ": "v",
        "ⓥ": "w",
        "ⓧ": "x",
        "ⓨ": "y",
        "ⓩ": "z",
        // symbols
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "∂": "d",
        ƒ: "f",
        "™": "(TM)",
        "©": "(C)",
        œ: "oe",
        Œ: "OE",
        "®": "(R)",
        "†": "+",
        "℠": "(SM)",
        "…": "...",
        "˚": "o",
        º: "o",
        ª: "a",
        "•": "*",
        "၊": ",",
        "။": ".",
        // currency
        $: "USD",
        "€": "EUR",
        "₢": "BRN",
        "₣": "FRF",
        "£": "GBP",
        "₤": "ITL",
        "₦": "NGN",
        "₧": "ESP",
        "₩": "KRW",
        "₪": "ILS",
        "₫": "VND",
        "₭": "LAK",
        "₮": "MNT",
        "₯": "GRD",
        "₱": "ARS",
        "₲": "PYG",
        "₳": "ARA",
        "₴": "UAH",
        "₵": "GHS",
        "¢": "cent",
        "¥": "CNY",
        元: "CNY",
        円: "YEN",
        "﷼": "IRR",
        "₠": "EWE",
        "฿": "THB",
        "₨": "INR",
        "₹": "INR",
        "₰": "PF",
        "₺": "TRY",
        "؋": "AFN",
        "₼": "AZN",
        лв: "BGN",
        "៛": "KHR",
        "₡": "CRC",
        "₸": "KZT",
        ден: "MKD",
        zł: "PLN",
        "₽": "RUB",
        "₾": "GEL"
      }, r = [
        // burmese
        "်",
        // Dhivehi
        "ް"
      ], a = {
        // Burmese
        // dependent vowels
        "ာ": "a",
        "ါ": "a",
        "ေ": "e",
        "ဲ": "e",
        "ိ": "i",
        "ီ": "i",
        "ို": "o",
        "ု": "u",
        "ူ": "u",
        "ေါင်": "aung",
        "ော": "aw",
        "ော်": "aw",
        "ေါ": "aw",
        "ေါ်": "aw",
        "်": "်",
        // this is special case but the character will be converted to latin in the code
        "က်": "et",
        "ိုက်": "aik",
        "ောက်": "auk",
        "င်": "in",
        "ိုင်": "aing",
        "ောင်": "aung",
        "စ်": "it",
        "ည်": "i",
        "တ်": "at",
        "ိတ်": "eik",
        "ုတ်": "ok",
        "ွတ်": "ut",
        "ေတ်": "it",
        "ဒ်": "d",
        "ိုဒ်": "ok",
        "ုဒ်": "ait",
        "န်": "an",
        "ာန်": "an",
        "ိန်": "ein",
        "ုန်": "on",
        "ွန်": "un",
        "ပ်": "at",
        "ိပ်": "eik",
        "ုပ်": "ok",
        "ွပ်": "ut",
        "န်ုပ်": "nub",
        "မ်": "an",
        "ိမ်": "ein",
        "ုမ်": "on",
        "ွမ်": "un",
        "ယ်": "e",
        "ိုလ်": "ol",
        "ဉ်": "in",
        "ံ": "an",
        "ိံ": "ein",
        "ုံ": "on",
        // Dhivehi
        "ައް": "ah",
        "ަށް": "ah"
      }, i = {
        en: {},
        // default language
        az: {
          // Azerbaijani
          ç: "c",
          ə: "e",
          ğ: "g",
          ı: "i",
          ö: "o",
          ş: "s",
          ü: "u",
          Ç: "C",
          Ə: "E",
          Ğ: "G",
          İ: "I",
          Ö: "O",
          Ş: "S",
          Ü: "U"
        },
        cs: {
          // Czech
          č: "c",
          ď: "d",
          ě: "e",
          ň: "n",
          ř: "r",
          š: "s",
          ť: "t",
          ů: "u",
          ž: "z",
          Č: "C",
          Ď: "D",
          Ě: "E",
          Ň: "N",
          Ř: "R",
          Š: "S",
          Ť: "T",
          Ů: "U",
          Ž: "Z"
        },
        fi: {
          // Finnish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: "a",
          // ok
          Ä: "A",
          // ok
          ö: "o",
          // ok
          Ö: "O"
          // ok
        },
        hu: {
          // Hungarian
          ä: "a",
          // ok
          Ä: "A",
          // ok
          // 'á': 'a', duplicate see charMap/latin
          // 'Á': 'A', duplicate see charMap/latin
          ö: "o",
          // ok
          Ö: "O",
          // ok
          // 'ő': 'o', duplicate see charMap/latin
          // 'Ő': 'O', duplicate see charMap/latin
          ü: "u",
          Ü: "U",
          ű: "u",
          Ű: "U"
        },
        lt: {
          // Lithuanian
          ą: "a",
          č: "c",
          ę: "e",
          ė: "e",
          į: "i",
          š: "s",
          ų: "u",
          ū: "u",
          ž: "z",
          Ą: "A",
          Č: "C",
          Ę: "E",
          Ė: "E",
          Į: "I",
          Š: "S",
          Ų: "U",
          Ū: "U"
        },
        lv: {
          // Latvian
          ā: "a",
          č: "c",
          ē: "e",
          ģ: "g",
          ī: "i",
          ķ: "k",
          ļ: "l",
          ņ: "n",
          š: "s",
          ū: "u",
          ž: "z",
          Ā: "A",
          Č: "C",
          Ē: "E",
          Ģ: "G",
          Ī: "i",
          Ķ: "k",
          Ļ: "L",
          Ņ: "N",
          Š: "S",
          Ū: "u",
          Ž: "Z"
        },
        pl: {
          // Polish
          ą: "a",
          ć: "c",
          ę: "e",
          ł: "l",
          ń: "n",
          ó: "o",
          ś: "s",
          ź: "z",
          ż: "z",
          Ą: "A",
          Ć: "C",
          Ę: "e",
          Ł: "L",
          Ń: "N",
          Ó: "O",
          Ś: "S",
          Ź: "Z",
          Ż: "Z"
        },
        sv: {
          // Swedish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: "a",
          // ok
          Ä: "A",
          // ok
          ö: "o",
          // ok
          Ö: "O"
          // ok
        },
        sk: {
          // Slovak
          ä: "a",
          Ä: "A"
        },
        sr: {
          // Serbian
          љ: "lj",
          њ: "nj",
          Љ: "Lj",
          Њ: "Nj",
          đ: "dj",
          Đ: "Dj"
        },
        tr: {
          // Turkish
          Ü: "U",
          Ö: "O",
          ü: "u",
          ö: "o"
        }
      }, s = {
        ar: {
          "∆": "delta",
          "∞": "la-nihaya",
          "♥": "hob",
          "&": "wa",
          "|": "aw",
          "<": "aqal-men",
          ">": "akbar-men",
          "∑": "majmou",
          "¤": "omla"
        },
        az: {},
        ca: {
          "∆": "delta",
          "∞": "infinit",
          "♥": "amor",
          "&": "i",
          "|": "o",
          "<": "menys que",
          ">": "mes que",
          "∑": "suma dels",
          "¤": "moneda"
        },
        cs: {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "nebo",
          "<": "mensi nez",
          ">": "vetsi nez",
          "∑": "soucet",
          "¤": "mena"
        },
        de: {
          "∆": "delta",
          "∞": "unendlich",
          "♥": "Liebe",
          "&": "und",
          "|": "oder",
          "<": "kleiner als",
          ">": "groesser als",
          "∑": "Summe von",
          "¤": "Waehrung"
        },
        dv: {
          "∆": "delta",
          "∞": "kolunulaa",
          "♥": "loabi",
          "&": "aai",
          "|": "noonee",
          "<": "ah vure kuda",
          ">": "ah vure bodu",
          "∑": "jumula",
          "¤": "faisaa"
        },
        en: {
          "∆": "delta",
          "∞": "infinity",
          "♥": "love",
          "&": "and",
          "|": "or",
          "<": "less than",
          ">": "greater than",
          "∑": "sum",
          "¤": "currency"
        },
        es: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "y",
          "|": "u",
          "<": "menos que",
          ">": "mas que",
          "∑": "suma de los",
          "¤": "moneda"
        },
        fa: {
          "∆": "delta",
          "∞": "bi-nahayat",
          "♥": "eshgh",
          "&": "va",
          "|": "ya",
          "<": "kamtar-az",
          ">": "bishtar-az",
          "∑": "majmooe",
          "¤": "vahed"
        },
        fi: {
          "∆": "delta",
          "∞": "aarettomyys",
          "♥": "rakkaus",
          "&": "ja",
          "|": "tai",
          "<": "pienempi kuin",
          ">": "suurempi kuin",
          "∑": "summa",
          "¤": "valuutta"
        },
        fr: {
          "∆": "delta",
          "∞": "infiniment",
          "♥": "Amour",
          "&": "et",
          "|": "ou",
          "<": "moins que",
          ">": "superieure a",
          "∑": "somme des",
          "¤": "monnaie"
        },
        ge: {
          "∆": "delta",
          "∞": "usasruloba",
          "♥": "siqvaruli",
          "&": "da",
          "|": "an",
          "<": "naklebi",
          ">": "meti",
          "∑": "jami",
          "¤": "valuta"
        },
        gr: {},
        hu: {
          "∆": "delta",
          "∞": "vegtelen",
          "♥": "szerelem",
          "&": "es",
          "|": "vagy",
          "<": "kisebb mint",
          ">": "nagyobb mint",
          "∑": "szumma",
          "¤": "penznem"
        },
        it: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amore",
          "&": "e",
          "|": "o",
          "<": "minore di",
          ">": "maggiore di",
          "∑": "somma",
          "¤": "moneta"
        },
        lt: {
          "∆": "delta",
          "∞": "begalybe",
          "♥": "meile",
          "&": "ir",
          "|": "ar",
          "<": "maziau nei",
          ">": "daugiau nei",
          "∑": "suma",
          "¤": "valiuta"
        },
        lv: {
          "∆": "delta",
          "∞": "bezgaliba",
          "♥": "milestiba",
          "&": "un",
          "|": "vai",
          "<": "mazak neka",
          ">": "lielaks neka",
          "∑": "summa",
          "¤": "valuta"
        },
        my: {
          "∆": "kwahkhyaet",
          "∞": "asaonasme",
          "♥": "akhyait",
          "&": "nhin",
          "|": "tho",
          "<": "ngethaw",
          ">": "kyithaw",
          "∑": "paungld",
          "¤": "ngwekye"
        },
        mk: {},
        nl: {
          "∆": "delta",
          "∞": "oneindig",
          "♥": "liefde",
          "&": "en",
          "|": "of",
          "<": "kleiner dan",
          ">": "groter dan",
          "∑": "som",
          "¤": "valuta"
        },
        pl: {
          "∆": "delta",
          "∞": "nieskonczonosc",
          "♥": "milosc",
          "&": "i",
          "|": "lub",
          "<": "mniejsze niz",
          ">": "wieksze niz",
          "∑": "suma",
          "¤": "waluta"
        },
        pt: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "e",
          "|": "ou",
          "<": "menor que",
          ">": "maior que",
          "∑": "soma",
          "¤": "moeda"
        },
        ro: {
          "∆": "delta",
          "∞": "infinit",
          "♥": "dragoste",
          "&": "si",
          "|": "sau",
          "<": "mai mic ca",
          ">": "mai mare ca",
          "∑": "suma",
          "¤": "valuta"
        },
        ru: {
          "∆": "delta",
          "∞": "beskonechno",
          "♥": "lubov",
          "&": "i",
          "|": "ili",
          "<": "menshe",
          ">": "bolshe",
          "∑": "summa",
          "¤": "valjuta"
        },
        sk: {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "alebo",
          "<": "menej ako",
          ">": "viac ako",
          "∑": "sucet",
          "¤": "mena"
        },
        sr: {},
        tr: {
          "∆": "delta",
          "∞": "sonsuzluk",
          "♥": "ask",
          "&": "ve",
          "|": "veya",
          "<": "kucuktur",
          ">": "buyuktur",
          "∑": "toplam",
          "¤": "para birimi"
        },
        uk: {
          "∆": "delta",
          "∞": "bezkinechnist",
          "♥": "lubov",
          "&": "i",
          "|": "abo",
          "<": "menshe",
          ">": "bilshe",
          "∑": "suma",
          "¤": "valjuta"
        },
        vn: {
          "∆": "delta",
          "∞": "vo cuc",
          "♥": "yeu",
          "&": "va",
          "|": "hoac",
          "<": "nho hon",
          ">": "lon hon",
          "∑": "tong",
          "¤": "tien te"
        }
      }, l = [";", "?", ":", "@", "&", "=", "+", "$", ",", "/"].join(""), u = [";", "?", ":", "@", "&", "=", "+", "$", ","].join(""), c = [".", "!", "~", "*", "'", "(", ")"].join(""), d = function(y, g) {
        var E = "-", A = "", b = "", P = !0, V = {}, C, k, N, I, _, w, x, B, L, M, R, H, U, z, X = "";
        if (typeof y != "string")
          return "";
        if (typeof g == "string" && (E = g), x = s.en, B = i.en, typeof g == "object") {
          C = g.maintainCase || !1, V = g.custom && typeof g.custom == "object" ? g.custom : V, N = +g.truncate > 1 && g.truncate || !1, I = g.uric || !1, _ = g.uricNoSlash || !1, w = g.mark || !1, P = !(g.symbols === !1 || g.lang === !1), E = g.separator || E, I && (X += l), _ && (X += u), w && (X += c), x = g.lang && s[g.lang] && P ? s[g.lang] : P ? s.en : {}, B = g.lang && i[g.lang] ? i[g.lang] : g.lang === !1 || g.lang === !0 ? {} : i.en, g.titleCase && typeof g.titleCase.length == "number" && Array.prototype.toString.call(g.titleCase) ? (g.titleCase.forEach(function(ee) {
            V[ee + ""] = ee + "";
          }), k = !0) : k = !!g.titleCase, g.custom && typeof g.custom.length == "number" && Array.prototype.toString.call(g.custom) && g.custom.forEach(function(ee) {
            V[ee + ""] = ee + "";
          }), Object.keys(V).forEach(function(ee) {
            var oe;
            ee.length > 1 ? oe = new RegExp("\\b" + f(ee) + "\\b", "gi") : oe = new RegExp(f(ee), "gi"), y = y.replace(oe, V[ee]);
          });
          for (R in V)
            X += R;
        }
        for (X += E, X = f(X), y = y.replace(/(^\s+|\s+$)/g, ""), U = !1, z = !1, M = 0, H = y.length; M < H; M++)
          R = y[M], m(R, V) ? U = !1 : B[R] ? (R = U && B[R].match(/[A-Za-z0-9]/) ? " " + B[R] : B[R], U = !1) : R in o ? (M + 1 < H && r.indexOf(y[M + 1]) >= 0 ? (b += R, R = "") : z === !0 ? (R = a[b] + o[R], b = "") : R = U && o[R].match(/[A-Za-z0-9]/) ? " " + o[R] : o[R], U = !1, z = !1) : R in a ? (b += R, R = "", M === H - 1 && (R = a[b]), z = !0) : /* process symbol chars */ x[R] && !(I && l.indexOf(R) !== -1) && !(_ && u.indexOf(R) !== -1) ? (R = U || A.substr(-1).match(/[A-Za-z0-9]/) ? E + x[R] : x[R], R += y[M + 1] !== void 0 && y[M + 1].match(/[A-Za-z0-9]/) ? E : "", U = !0) : (z === !0 ? (R = a[b] + R, b = "", z = !1) : U && (/[A-Za-z0-9]/.test(R) || A.substr(-1).match(/A-Za-z0-9]/)) && (R = " " + R), U = !1), A += R.replace(new RegExp("[^\\w\\s" + X + "_-]", "g"), E);
        return k && (A = A.replace(/(\w)(\S*)/g, function(ee, oe, de) {
          var qe = oe.toUpperCase() + (de !== null ? de : "");
          return Object.keys(V).indexOf(qe.toLowerCase()) < 0 ? qe : qe.toLowerCase();
        })), A = A.replace(/\s+/g, E).replace(new RegExp("\\" + E + "+", "g"), E).replace(new RegExp("(^\\" + E + "+|\\" + E + "+$)", "g"), ""), N && A.length > N && (L = A.charAt(N) === E, A = A.slice(0, N), L || (A = A.slice(0, A.lastIndexOf(E)))), !C && !k && (A = A.toLowerCase()), A;
      }, v = function(y) {
        return function(E) {
          return d(E, y);
        };
      }, f = function(y) {
        return y.replace(/[-\\^$*+?.()|[\]{}\/]/g, "\\$&");
      }, m = function(h, y) {
        for (var g in y)
          if (y[g] === h)
            return !0;
      };
      if (typeof t < "u" && t.exports)
        t.exports = d, t.exports.createSlug = v;
      else if (typeof define < "u" && define.amd)
        define([], function() {
          return d;
        });
      else
        try {
          if (n.getSlug || n.createSlug)
            throw "speakingurl: globals exists /(getSlug|createSlug)/";
          n.getSlug = d, n.createSlug = v;
        } catch {
        }
    }(e);
  }
}), pu = Ai({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js"(e, t) {
    p(), t.exports = _u();
  }
});
p();
p();
p();
p();
p();
p();
p();
p();
function bu(e) {
  var t;
  const n = e.name || e._componentTag || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || e.__name;
  return n === "index" && ((t = e.__file) != null && t.endsWith("index.vue")) ? "" : n;
}
function Eu(e) {
  const t = e.__file;
  if (t)
    return nu(ou(t, ".vue"));
}
function Cr(e, t) {
  return e.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = t, t;
}
function zo(e) {
  if (e.__VUE_DEVTOOLS_NEXT_APP_RECORD__)
    return e.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  if (e.root)
    return e.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
function ki(e) {
  var t, n;
  const o = (t = e.subTree) == null ? void 0 : t.type, r = zo(e);
  return r ? ((n = r == null ? void 0 : r.types) == null ? void 0 : n.Fragment) === o : !1;
}
function Vn(e) {
  var t, n, o;
  const r = bu((e == null ? void 0 : e.type) || {});
  if (r)
    return r;
  if ((e == null ? void 0 : e.root) === e)
    return "Root";
  for (const i in (n = (t = e.parent) == null ? void 0 : t.type) == null ? void 0 : n.components)
    if (e.parent.type.components[i] === (e == null ? void 0 : e.type))
      return Cr(e, i);
  for (const i in (o = e.appContext) == null ? void 0 : o.components)
    if (e.appContext.components[i] === (e == null ? void 0 : e.type))
      return Cr(e, i);
  const a = Eu((e == null ? void 0 : e.type) || {});
  return a || "Anonymous Component";
}
function Cu(e) {
  var t, n, o;
  const r = (o = (n = (t = e == null ? void 0 : e.appContext) == null ? void 0 : t.app) == null ? void 0 : n.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__) != null ? o : 0, a = e === (e == null ? void 0 : e.root) ? "root" : e.uid;
  return `${r}:${a}`;
}
function ho(e, t) {
  return t = t || `${e.id}:root`, e.instanceMap.get(t) || e.instanceMap.get(":root");
}
function Su() {
  const e = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    get width() {
      return e.right - e.left;
    },
    get height() {
      return e.bottom - e.top;
    }
  };
  return e;
}
var sn;
function wu(e) {
  return sn || (sn = document.createRange()), sn.selectNode(e), sn.getBoundingClientRect();
}
function Au(e) {
  const t = Su();
  if (!e.children)
    return t;
  for (let n = 0, o = e.children.length; n < o; n++) {
    const r = e.children[n];
    let a;
    if (r.component)
      a = lt(r.component);
    else if (r.el) {
      const i = r.el;
      i.nodeType === 1 || i.getBoundingClientRect ? a = i.getBoundingClientRect() : i.nodeType === 3 && i.data.trim() && (a = wu(i));
    }
    a && ku(t, a);
  }
  return t;
}
function ku(e, t) {
  return (!e.top || t.top < e.top) && (e.top = t.top), (!e.bottom || t.bottom > e.bottom) && (e.bottom = t.bottom), (!e.left || t.left < e.left) && (e.left = t.left), (!e.right || t.right > e.right) && (e.right = t.right), e;
}
var Sr = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function lt(e) {
  const t = e.subTree.el;
  return typeof window > "u" ? Sr : ki(e) ? Au(e.subTree) : (t == null ? void 0 : t.nodeType) === 1 ? t == null ? void 0 : t.getBoundingClientRect() : e.subTree.component ? lt(e.subTree.component) : Sr;
}
p();
function Ho(e) {
  return ki(e) ? Ou(e.subTree) : e.subTree ? [e.subTree.el] : [];
}
function Ou(e) {
  if (!e.children)
    return [];
  const t = [];
  return e.children.forEach((n) => {
    n.component ? t.push(...Ho(n.component)) : n != null && n.el && t.push(n.el);
  }), t;
}
var Oi = "__vue-devtools-component-inspector__", Ii = "__vue-devtools-component-inspector__card__", xi = "__vue-devtools-component-inspector__name__", Ti = "__vue-devtools-component-inspector__indicator__", Pi = {
  display: "block",
  zIndex: 2147483640,
  position: "fixed",
  backgroundColor: "#42b88325",
  border: "1px solid #42b88350",
  borderRadius: "5px",
  transition: "all 0.1s ease-in",
  pointerEvents: "none"
}, Iu = {
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "5px 8px",
  borderRadius: "4px",
  textAlign: "left",
  position: "absolute",
  left: 0,
  color: "#e9e9e9",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "24px",
  backgroundColor: "#42b883",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
}, xu = {
  display: "inline-block",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  opacity: 0.7
};
function wt() {
  return document.getElementById(Oi);
}
function Tu() {
  return document.getElementById(Ii);
}
function Pu() {
  return document.getElementById(Ti);
}
function Vu() {
  return document.getElementById(xi);
}
function Wo(e) {
  return {
    left: `${Math.round(e.left * 100) / 100}px`,
    top: `${Math.round(e.top * 100) / 100}px`,
    width: `${Math.round(e.width * 100) / 100}px`,
    height: `${Math.round(e.height * 100) / 100}px`
  };
}
function Ko(e) {
  var t;
  const n = document.createElement("div");
  n.id = (t = e.elementId) != null ? t : Oi, Object.assign(n.style, {
    ...Pi,
    ...Wo(e.bounds),
    ...e.style
  });
  const o = document.createElement("span");
  o.id = Ii, Object.assign(o.style, {
    ...Iu,
    top: e.bounds.top < 35 ? 0 : "-35px"
  });
  const r = document.createElement("span");
  r.id = xi, r.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`;
  const a = document.createElement("i");
  return a.id = Ti, a.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`, Object.assign(a.style, xu), o.appendChild(r), o.appendChild(a), n.appendChild(o), document.body.appendChild(n), n;
}
function Go(e) {
  const t = wt(), n = Tu(), o = Vu(), r = Pu();
  t && (Object.assign(t.style, {
    ...Pi,
    ...Wo(e.bounds)
  }), Object.assign(n.style, {
    top: e.bounds.top < 35 ? 0 : "-35px"
  }), o.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`, r.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`);
}
function Du(e) {
  const t = lt(e);
  if (!t.width && !t.height)
    return;
  const n = Vn(e);
  wt() ? Go({ bounds: t, name: n }) : Ko({ bounds: t, name: n });
}
function Vi() {
  const e = wt();
  e && (e.style.display = "none");
}
var yo = null;
function _o(e) {
  const t = e.target;
  if (t) {
    const n = t.__vueParentComponent;
    if (n && (yo = n, n.vnode.el)) {
      const r = lt(n), a = Vn(n);
      wt() ? Go({ bounds: r, name: a }) : Ko({ bounds: r, name: a });
    }
  }
}
function Ru(e, t) {
  if (e.preventDefault(), e.stopPropagation(), yo) {
    const n = Cu(yo);
    t(n);
  }
}
var pn = null;
function Bu() {
  Vi(), window.removeEventListener("mouseover", _o), window.removeEventListener("click", pn, !0), pn = null;
}
function Nu() {
  return window.addEventListener("mouseover", _o), new Promise((e) => {
    function t(n) {
      n.preventDefault(), n.stopPropagation(), Ru(n, (o) => {
        window.removeEventListener("click", t, !0), pn = null, window.removeEventListener("mouseover", _o);
        const r = wt();
        r && (r.style.display = "none"), e(JSON.stringify({ id: o }));
      });
    }
    pn = t, window.addEventListener("click", t, !0);
  });
}
function Lu(e) {
  const t = ho(ve.value, e.id);
  if (t) {
    const [n] = Ho(t);
    if (typeof n.scrollIntoView == "function")
      n.scrollIntoView({
        behavior: "smooth"
      });
    else {
      const o = lt(t), r = document.createElement("div"), a = {
        ...Wo(o),
        position: "absolute"
      };
      Object.assign(r.style, a), document.body.appendChild(r), r.scrollIntoView({
        behavior: "smooth"
      }), setTimeout(() => {
        document.body.removeChild(r);
      }, 2e3);
    }
    setTimeout(() => {
      const o = lt(t);
      if (o.width || o.height) {
        const r = Vn(t), a = wt();
        a ? Go({ ...e, name: r, bounds: o }) : Ko({ ...e, name: r, bounds: o }), setTimeout(() => {
          a && (a.style.display = "none");
        }, 1500);
      }
    }, 1200);
  }
}
p();
var wr, Ar;
(Ar = (wr = D).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__) != null || (wr.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = !0);
function Fu(e) {
  let t = 0;
  const n = setInterval(() => {
    D.__VUE_INSPECTOR__ && (clearInterval(n), t += 30, e()), t >= /* 5s */
    5e3 && clearInterval(n);
  }, 30);
}
function $u() {
  const e = D.__VUE_INSPECTOR__, t = e.openInEditor;
  e.openInEditor = async (...n) => {
    e.disable(), t(...n);
  };
}
function Mu() {
  return new Promise((e) => {
    function t() {
      $u(), e(D.__VUE_INSPECTOR__);
    }
    D.__VUE_INSPECTOR__ ? t() : Fu(() => {
      t();
    });
  });
}
p();
p();
function Uu(e) {
  return !!(e && e.__v_isReadonly);
}
function Di(e) {
  return Uu(e) ? Di(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Zn(e) {
  return !!(e && e.__v_isRef === !0);
}
function Vt(e) {
  const t = e && e.__v_raw;
  return t ? Vt(t) : e;
}
var ju = class {
  constructor() {
    this.refEditor = new zu();
  }
  set(e, t, n, o) {
    const r = Array.isArray(t) ? t : t.split(".");
    for (; r.length > 1; ) {
      const s = r.shift();
      e instanceof Map ? e = e.get(s) : e instanceof Set ? e = Array.from(e.values())[s] : e = e[s], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    const a = r[0], i = this.refEditor.get(e)[a];
    o ? o(e, a, n) : this.refEditor.isRef(i) ? this.refEditor.set(i, n) : e[a] = n;
  }
  get(e, t) {
    const n = Array.isArray(t) ? t : t.split(".");
    for (let o = 0; o < n.length; o++)
      if (e instanceof Map ? e = e.get(n[o]) : e = e[n[o]], this.refEditor.isRef(e) && (e = this.refEditor.get(e)), !e)
        return;
    return e;
  }
  has(e, t, n = !1) {
    if (typeof e > "u")
      return !1;
    const o = Array.isArray(t) ? t.slice() : t.split("."), r = n ? 2 : 1;
    for (; e && o.length > r; ) {
      const a = o.shift();
      e = e[a], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    return e != null && Object.prototype.hasOwnProperty.call(e, o[0]);
  }
  createDefaultSetCallback(e) {
    return (t, n, o) => {
      if ((e.remove || e.newKey) && (Array.isArray(t) ? t.splice(n, 1) : Vt(t) instanceof Map ? t.delete(n) : Vt(t) instanceof Set ? t.delete(Array.from(t.values())[n]) : Reflect.deleteProperty(t, n)), !e.remove) {
        const r = t[e.newKey || n];
        this.refEditor.isRef(r) ? this.refEditor.set(r, o) : Vt(t) instanceof Map ? t.set(e.newKey || n, o) : Vt(t) instanceof Set ? t.add(o) : t[e.newKey || n] = o;
      }
    };
  }
}, zu = class {
  set(e, t) {
    if (Zn(e))
      e.value = t;
    else {
      if (e instanceof Set && Array.isArray(t)) {
        e.clear(), t.forEach((r) => e.add(r));
        return;
      }
      const n = Object.keys(t);
      if (e instanceof Map) {
        const r = new Set(e.keys());
        n.forEach((a) => {
          e.set(a, Reflect.get(t, a)), r.delete(a);
        }), r.forEach((a) => e.delete(a));
        return;
      }
      const o = new Set(Object.keys(e));
      n.forEach((r) => {
        Reflect.set(e, r, Reflect.get(t, r)), o.delete(r);
      }), o.forEach((r) => Reflect.deleteProperty(e, r));
    }
  }
  get(e) {
    return Zn(e) ? e.value : e;
  }
  isRef(e) {
    return Zn(e) || Di(e);
  }
};
p();
p();
p();
var Hu = "__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS_STATE__";
function Wu() {
  if (!Ei || typeof localStorage > "u" || localStorage === null)
    return {
      recordingState: !1,
      mouseEventEnabled: !1,
      keyboardEventEnabled: !1,
      componentEventEnabled: !1,
      performanceEventEnabled: !1,
      selected: ""
    };
  const e = localStorage.getItem(Hu);
  return e ? JSON.parse(e) : {
    recordingState: !1,
    mouseEventEnabled: !1,
    keyboardEventEnabled: !1,
    componentEventEnabled: !1,
    performanceEventEnabled: !1,
    selected: ""
  };
}
p();
p();
p();
var kr, Or;
(Or = (kr = D).__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS) != null || (kr.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS = []);
var Ku = new Proxy(D.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Gu(e, t) {
  ae.timelineLayersState[t.id] = !1, Ku.push({
    ...e,
    descriptorId: t.id,
    appRecord: zo(t.app)
  });
}
var Ir, xr;
(xr = (Ir = D).__VUE_DEVTOOLS_KIT_INSPECTOR__) != null || (Ir.__VUE_DEVTOOLS_KIT_INSPECTOR__ = []);
var qo = new Proxy(D.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
}), Ri = pt(() => {
  At.hooks.callHook("sendInspectorToClient", Bi());
});
function qu(e, t) {
  var n, o;
  qo.push({
    options: e,
    descriptor: t,
    treeFilterPlaceholder: (n = e.treeFilterPlaceholder) != null ? n : "Search tree...",
    stateFilterPlaceholder: (o = e.stateFilterPlaceholder) != null ? o : "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: zo(t.app)
  }), Ri();
}
function Bi() {
  return qo.filter((e) => e.descriptor.app === ve.value.app).filter((e) => e.descriptor.id !== "components").map((e) => {
    var t;
    const n = e.descriptor, o = e.options;
    return {
      id: o.id,
      label: o.label,
      logo: n.logo,
      icon: `custom-ic-baseline-${(t = o == null ? void 0 : o.icon) == null ? void 0 : t.replace(/_/g, "-")}`,
      packageName: n.packageName,
      homepage: n.homepage,
      pluginId: n.id
    };
  });
}
function dn(e, t) {
  return qo.find((n) => n.options.id === e && (t ? n.descriptor.app === t : !0));
}
function Yu() {
  const e = Si();
  e.hook("addInspector", ({ inspector: o, plugin: r }) => {
    qu(o, r.descriptor);
  });
  const t = pt(async ({ inspectorId: o, plugin: r }) => {
    var a;
    if (!o || !((a = r == null ? void 0 : r.descriptor) != null && a.app) || ae.highPerfModeEnabled)
      return;
    const i = dn(o, r.descriptor.app), s = {
      app: r.descriptor.app,
      inspectorId: o,
      filter: (i == null ? void 0 : i.treeFilter) || "",
      rootNodes: []
    };
    await new Promise((l) => {
      e.callHookWith(
        async (u) => {
          await Promise.all(u.map((c) => c(s))), l();
        },
        "getInspectorTree"
        /* GET_INSPECTOR_TREE */
      );
    }), e.callHookWith(
      async (l) => {
        await Promise.all(l.map((u) => u({
          inspectorId: o,
          rootNodes: s.rootNodes
        })));
      },
      "sendInspectorTreeToClient"
      /* SEND_INSPECTOR_TREE_TO_CLIENT */
    );
  }, 120);
  e.hook("sendInspectorTree", t);
  const n = pt(async ({ inspectorId: o, plugin: r }) => {
    var a;
    if (!o || !((a = r == null ? void 0 : r.descriptor) != null && a.app) || ae.highPerfModeEnabled)
      return;
    const i = dn(o, r.descriptor.app), s = {
      app: r.descriptor.app,
      inspectorId: o,
      nodeId: (i == null ? void 0 : i.selectedNodeId) || "",
      state: null
    }, l = {
      currentTab: `custom-inspector:${o}`
    };
    s.nodeId && await new Promise((u) => {
      e.callHookWith(
        async (c) => {
          await Promise.all(c.map((d) => d(s, l))), u();
        },
        "getInspectorState"
        /* GET_INSPECTOR_STATE */
      );
    }), e.callHookWith(
      async (u) => {
        await Promise.all(u.map((c) => c({
          inspectorId: o,
          nodeId: s.nodeId,
          state: s.state
        })));
      },
      "sendInspectorStateToClient"
      /* SEND_INSPECTOR_STATE_TO_CLIENT */
    );
  }, 120);
  return e.hook("sendInspectorState", n), e.hook("customInspectorSelectNode", ({ inspectorId: o, nodeId: r, plugin: a }) => {
    const i = dn(o, a.descriptor.app);
    i && (i.selectedNodeId = r);
  }), e.hook("timelineLayerAdded", ({ options: o, plugin: r }) => {
    Gu(o, r.descriptor);
  }), e.hook("timelineEventAdded", ({ options: o, plugin: r }) => {
    var a;
    const i = ["performance", "component-event", "keyboard", "mouse"];
    ae.highPerfModeEnabled || !((a = ae.timelineLayersState) != null && a[r.descriptor.id]) && !i.includes(o.layerId) || e.callHookWith(
      async (s) => {
        await Promise.all(s.map((l) => l(o)));
      },
      "sendTimelineEventToClient"
      /* SEND_TIMELINE_EVENT_TO_CLIENT */
    );
  }), e.hook("getComponentInstances", async ({ app: o }) => {
    const r = o.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
    if (!r)
      return null;
    const a = r.id.toString();
    return [...r.instanceMap].filter(([s]) => s.split(":")[0] === a).map(([, s]) => s);
  }), e.hook("getComponentBounds", async ({ instance: o }) => lt(o)), e.hook("getComponentName", ({ instance: o }) => Vn(o)), e.hook("componentHighlight", ({ uid: o }) => {
    const r = ve.value.instanceMap.get(o);
    r && Du(r);
  }), e.hook("componentUnhighlight", () => {
    Vi();
  }), e;
}
var Tr, Pr;
(Pr = (Tr = D).__VUE_DEVTOOLS_KIT_APP_RECORDS__) != null || (Tr.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = []);
var Vr, Dr;
(Dr = (Vr = D).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__) != null || (Vr.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = {});
var Rr, Br;
(Br = (Rr = D).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__) != null || (Rr.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = "");
var Nr, Lr;
(Lr = (Nr = D).__VUE_DEVTOOLS_KIT_CUSTOM_TABS__) != null || (Nr.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ = []);
var Fr, $r;
($r = (Fr = D).__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__) != null || (Fr.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ = []);
var Qe = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function Xu() {
  return {
    connected: !1,
    clientConnected: !1,
    vitePluginDetected: !0,
    appRecords: [],
    activeAppRecordId: "",
    tabs: [],
    commands: [],
    highPerfModeEnabled: !0,
    devtoolsClientDetected: {},
    perfUniqueGroupId: 0,
    timelineLayersState: Wu()
  };
}
var Mr, Ur;
(Ur = (Mr = D)[Qe]) != null || (Mr[Qe] = Xu());
var Zu = pt((e) => {
  At.hooks.callHook("devtoolsStateUpdated", { state: e });
});
pt((e, t) => {
  At.hooks.callHook("devtoolsConnectedUpdated", { state: e, oldState: t });
});
var Dn = new Proxy(D.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(e, t, n) {
    return t === "value" ? D.__VUE_DEVTOOLS_KIT_APP_RECORDS__ : D.__VUE_DEVTOOLS_KIT_APP_RECORDS__[t];
  }
}), ve = new Proxy(D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(e, t, n) {
    return t === "value" ? D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ : t === "id" ? D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ : D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[t];
  }
});
function Ni() {
  Zu({
    ...D[Qe],
    appRecords: Dn.value,
    activeAppRecordId: ve.id,
    tabs: D.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: D.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function Ju(e) {
  D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = e, Ni();
}
function Qu(e) {
  D.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = e, Ni();
}
var ae = new Proxy(D[Qe], {
  get(e, t) {
    return t === "appRecords" ? Dn : t === "activeAppRecordId" ? ve.id : t === "tabs" ? D.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ : t === "commands" ? D.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ : D[Qe][t];
  },
  deleteProperty(e, t) {
    return delete e[t], !0;
  },
  set(e, t, n) {
    return { ...D[Qe] }, e[t] = n, D[Qe][t] = n, !0;
  }
});
function ec(e = {}) {
  var t, n, o;
  const { file: r, host: a, baseUrl: i = window.location.origin, line: s = 0, column: l = 0 } = e;
  if (r) {
    if (a === "chrome-extension") {
      const u = r.replace(/\\/g, "\\\\"), c = (n = (t = window.VUE_DEVTOOLS_CONFIG) == null ? void 0 : t.openInEditorHost) != null ? n : "/";
      fetch(`${c}__open-in-editor?file=${encodeURI(r)}`).then((d) => {
        if (!d.ok) {
          const v = `Opening component ${u} failed`;
          console.log(`%c${v}`, "color:red");
        }
      });
    } else if (ae.vitePluginDetected) {
      const u = (o = D.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__) != null ? o : i;
      D.__VUE_INSPECTOR__.openInEditor(u, r, s, l);
    }
  }
}
p();
p();
p();
p();
p();
var jr, zr;
(zr = (jr = D).__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__) != null || (jr.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ = []);
var Yo = new Proxy(D.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function po(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    t[n] = e[n].defaultValue;
  }), t;
}
function Xo(e) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${e}__`;
}
function tc(e) {
  var t, n, o;
  const r = (n = (t = Yo.find((a) => {
    var i;
    return a[0].id === e && !!((i = a[0]) != null && i.settings);
  })) == null ? void 0 : t[0]) != null ? n : null;
  return (o = r == null ? void 0 : r.settings) != null ? o : null;
}
function Li(e, t) {
  var n, o, r;
  const a = Xo(e);
  if (a) {
    const i = localStorage.getItem(a);
    if (i)
      return JSON.parse(i);
  }
  if (e) {
    const i = (o = (n = Yo.find((s) => s[0].id === e)) == null ? void 0 : n[0]) != null ? o : null;
    return po((r = i == null ? void 0 : i.settings) != null ? r : {});
  }
  return po(t);
}
function nc(e, t) {
  const n = Xo(e);
  localStorage.getItem(n) || localStorage.setItem(n, JSON.stringify(po(t)));
}
function oc(e, t, n) {
  const o = Xo(e), r = localStorage.getItem(o), a = JSON.parse(r || "{}"), i = {
    ...a,
    [t]: n
  };
  localStorage.setItem(o, JSON.stringify(i)), At.hooks.callHookWith(
    (s) => {
      s.forEach((l) => l({
        pluginId: e,
        key: t,
        oldValue: a[t],
        newValue: n,
        settings: i
      }));
    },
    "setPluginSettings"
    /* SET_PLUGIN_SETTINGS */
  );
}
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
var Hr, Wr, _e = (Wr = (Hr = D).__VUE_DEVTOOLS_HOOK) != null ? Wr : Hr.__VUE_DEVTOOLS_HOOK = Si(), rc = {
  vueAppInit(e) {
    _e.hook("app:init", e);
  },
  vueAppUnmount(e) {
    _e.hook("app:unmount", e);
  },
  vueAppConnected(e) {
    _e.hook("app:connected", e);
  },
  componentAdded(e) {
    return _e.hook("component:added", e);
  },
  componentEmit(e) {
    return _e.hook("component:emit", e);
  },
  componentUpdated(e) {
    return _e.hook("component:updated", e);
  },
  componentRemoved(e) {
    return _e.hook("component:removed", e);
  },
  setupDevtoolsPlugin(e) {
    _e.hook("devtools-plugin:setup", e);
  },
  perfStart(e) {
    return _e.hook("perf:start", e);
  },
  perfEnd(e) {
    return _e.hook("perf:end", e);
  }
}, Fi = {
  on: rc,
  setupDevToolsPlugin(e, t) {
    return _e.callHook("devtools-plugin:setup", e, t);
  }
}, ac = class {
  constructor({ plugin: e, ctx: t }) {
    this.hooks = t.hooks, this.plugin = e;
  }
  get on() {
    return {
      // component inspector
      visitComponentTree: (e) => {
        this.hooks.hook("visitComponentTree", e);
      },
      inspectComponent: (e) => {
        this.hooks.hook("inspectComponent", e);
      },
      editComponentState: (e) => {
        this.hooks.hook("editComponentState", e);
      },
      // custom inspector
      getInspectorTree: (e) => {
        this.hooks.hook("getInspectorTree", e);
      },
      getInspectorState: (e) => {
        this.hooks.hook("getInspectorState", e);
      },
      editInspectorState: (e) => {
        this.hooks.hook("editInspectorState", e);
      },
      // timeline
      inspectTimelineEvent: (e) => {
        this.hooks.hook("inspectTimelineEvent", e);
      },
      timelineCleared: (e) => {
        this.hooks.hook("timelineCleared", e);
      },
      // settings
      setPluginSettings: (e) => {
        this.hooks.hook("setPluginSettings", e);
      }
    };
  }
  // component inspector
  notifyComponentUpdate(e) {
    var t;
    if (ae.highPerfModeEnabled)
      return;
    const n = Bi().find((o) => o.packageName === this.plugin.descriptor.packageName);
    if (n != null && n.id) {
      if (e) {
        const o = [
          e.appContext.app,
          e.uid,
          (t = e.parent) == null ? void 0 : t.uid,
          e
        ];
        _e.callHook("component:updated", ...o);
      } else
        _e.callHook(
          "component:updated"
          /* COMPONENT_UPDATED */
        );
      this.hooks.callHook("sendInspectorState", { inspectorId: n.id, plugin: this.plugin });
    }
  }
  // custom inspector
  addInspector(e) {
    this.hooks.callHook("addInspector", { inspector: e, plugin: this.plugin }), this.plugin.descriptor.settings && nc(e.id, this.plugin.descriptor.settings);
  }
  sendInspectorTree(e) {
    ae.highPerfModeEnabled || this.hooks.callHook("sendInspectorTree", { inspectorId: e, plugin: this.plugin });
  }
  sendInspectorState(e) {
    ae.highPerfModeEnabled || this.hooks.callHook("sendInspectorState", { inspectorId: e, plugin: this.plugin });
  }
  selectInspectorNode(e, t) {
    this.hooks.callHook("customInspectorSelectNode", { inspectorId: e, nodeId: t, plugin: this.plugin });
  }
  visitComponentTree(e) {
    return this.hooks.callHook("visitComponentTree", e);
  }
  // timeline
  now() {
    return ae.highPerfModeEnabled ? 0 : Date.now();
  }
  addTimelineLayer(e) {
    this.hooks.callHook("timelineLayerAdded", { options: e, plugin: this.plugin });
  }
  addTimelineEvent(e) {
    ae.highPerfModeEnabled || this.hooks.callHook("timelineEventAdded", { options: e, plugin: this.plugin });
  }
  // settings
  getSettings(e) {
    return Li(e ?? this.plugin.descriptor.id, this.plugin.descriptor.settings);
  }
  // utilities
  getComponentInstances(e) {
    return this.hooks.callHook("getComponentInstances", { app: e });
  }
  getComponentBounds(e) {
    return this.hooks.callHook("getComponentBounds", { instance: e });
  }
  getComponentName(e) {
    return this.hooks.callHook("getComponentName", { instance: e });
  }
  highlightElement(e) {
    const t = e.__VUE_DEVTOOLS_NEXT_UID__;
    return this.hooks.callHook("componentHighlight", { uid: t });
  }
  unhighlightElement() {
    return this.hooks.callHook(
      "componentUnhighlight"
      /* COMPONENT_UNHIGHLIGHT */
    );
  }
}, ic = ac;
p();
p();
p();
p();
var sc = "__vue_devtool_undefined__", lc = "__vue_devtool_infinity__", uc = "__vue_devtool_negative_infinity__", cc = "__vue_devtool_nan__";
p();
p();
var dc = {
  [sc]: "undefined",
  [cc]: "NaN",
  [lc]: "Infinity",
  [uc]: "-Infinity"
};
Object.entries(dc).reduce((e, [t, n]) => (e[n] = t, e), {});
p();
p();
p();
p();
p();
var Kr, Gr;
(Gr = (Kr = D).__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__) != null || (Kr.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ = /* @__PURE__ */ new Set());
function $i(e, t) {
  return Fi.setupDevToolsPlugin(e, t);
}
function fc(e, t) {
  const [n, o] = e;
  if (n.app !== t)
    return;
  const r = new ic({
    plugin: {
      setupFn: o,
      descriptor: n
    },
    ctx: At
  });
  n.packageName === "vuex" && r.on.editInspectorState((a) => {
    r.sendInspectorState(a.inspectorId);
  }), o(r);
}
function Mi(e, t) {
  D.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(e) || ae.highPerfModeEnabled && !(t != null && t.inspectingComponent) || (D.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(e), Yo.forEach((n) => {
    fc(n, e);
  }));
}
p();
p();
var Mt = "__VUE_DEVTOOLS_ROUTER__", bt = "__VUE_DEVTOOLS_ROUTER_INFO__", qr, Yr;
(Yr = (qr = D)[bt]) != null || (qr[bt] = {
  currentRoute: null,
  routes: []
});
var Xr, Zr;
(Zr = (Xr = D)[Mt]) != null || (Xr[Mt] = {});
new Proxy(D[bt], {
  get(e, t) {
    return D[bt][t];
  }
});
new Proxy(D[Mt], {
  get(e, t) {
    if (t === "value")
      return D[Mt];
  }
});
function vc(e) {
  const t = /* @__PURE__ */ new Map();
  return ((e == null ? void 0 : e.getRoutes()) || []).filter((n) => !t.has(n.path) && t.set(n.path, 1));
}
function Zo(e) {
  return e.map((t) => {
    let { path: n, name: o, children: r, meta: a } = t;
    return r != null && r.length && (r = Zo(r)), {
      path: n,
      name: o,
      children: r,
      meta: a
    };
  });
}
function mc(e) {
  if (e) {
    const { fullPath: t, hash: n, href: o, path: r, name: a, matched: i, params: s, query: l } = e;
    return {
      fullPath: t,
      hash: n,
      href: o,
      path: r,
      name: a,
      params: s,
      query: l,
      matched: Zo(i)
    };
  }
  return e;
}
function gc(e, t) {
  function n() {
    var o;
    const r = (o = e.app) == null ? void 0 : o.config.globalProperties.$router, a = mc(r == null ? void 0 : r.currentRoute.value), i = Zo(vc(r)), s = console.warn;
    console.warn = () => {
    }, D[bt] = {
      currentRoute: a ? Er(a) : {},
      routes: Er(i)
    }, D[Mt] = r, console.warn = s;
  }
  n(), Fi.on.componentUpdated(pt(() => {
    var o;
    ((o = t.value) == null ? void 0 : o.app) === e.app && (n(), !ae.highPerfModeEnabled && At.hooks.callHook("routerInfoUpdated", { state: D[bt] }));
  }, 200));
}
function hc(e) {
  return {
    // get inspector tree
    async getInspectorTree(t) {
      const n = {
        ...t,
        app: ve.value.app,
        rootNodes: []
      };
      return await new Promise((o) => {
        e.callHookWith(
          async (r) => {
            await Promise.all(r.map((a) => a(n))), o();
          },
          "getInspectorTree"
          /* GET_INSPECTOR_TREE */
        );
      }), n.rootNodes;
    },
    // get inspector state
    async getInspectorState(t) {
      const n = {
        ...t,
        app: ve.value.app,
        state: null
      }, o = {
        currentTab: `custom-inspector:${t.inspectorId}`
      };
      return await new Promise((r) => {
        e.callHookWith(
          async (a) => {
            await Promise.all(a.map((i) => i(n, o))), r();
          },
          "getInspectorState"
          /* GET_INSPECTOR_STATE */
        );
      }), n.state;
    },
    // edit inspector state
    editInspectorState(t) {
      const n = new ju(), o = {
        ...t,
        app: ve.value.app,
        set: (r, a = t.path, i = t.state.value, s) => {
          n.set(r, a, i, s || n.createDefaultSetCallback(t.state));
        }
      };
      e.callHookWith(
        (r) => {
          r.forEach((a) => a(o));
        },
        "editInspectorState"
        /* EDIT_INSPECTOR_STATE */
      );
    },
    // send inspector state
    sendInspectorState(t) {
      const n = dn(t);
      e.callHook("sendInspectorState", { inspectorId: t, plugin: {
        descriptor: n.descriptor,
        setupFn: () => ({})
      } });
    },
    // inspect component inspector
    inspectComponentInspector() {
      return Nu();
    },
    // cancel inspect component inspector
    cancelInspectComponentInspector() {
      return Bu();
    },
    // get component render code
    getComponentRenderCode(t) {
      const n = ho(ve.value, t);
      if (n)
        return typeof (n == null ? void 0 : n.type) != "function" ? n.render.toString() : n.type.toString();
    },
    // scroll to component
    scrollToComponent(t) {
      return Lu({ id: t });
    },
    // open in editor
    openInEditor: ec,
    // get vue inspector
    getVueInspector: Mu,
    // toggle app
    toggleApp(t, n) {
      const o = Dn.value.find((r) => r.id === t);
      o && (Qu(t), Ju(o), gc(o, ve), Ri(), Mi(o.app, n));
    },
    // inspect dom
    inspectDOM(t) {
      const n = ho(ve.value, t);
      if (n) {
        const [o] = Ho(n);
        o && (D.__VUE_DEVTOOLS_INSPECT_DOM_TARGET__ = o);
      }
    },
    updatePluginSettings(t, n, o) {
      oc(t, n, o);
    },
    getPluginSettings(t) {
      return {
        options: tc(t),
        values: Li(t)
      };
    }
  };
}
p();
var Jr, Qr;
(Qr = (Jr = D).__VUE_DEVTOOLS_ENV__) != null || (Jr.__VUE_DEVTOOLS_ENV__ = {
  vitePluginDetected: !1
});
var ea = Yu(), ta, na;
(na = (ta = D).__VUE_DEVTOOLS_KIT_CONTEXT__) != null || (ta.__VUE_DEVTOOLS_KIT_CONTEXT__ = {
  hooks: ea,
  get state() {
    return {
      ...ae,
      activeAppRecordId: ve.id,
      activeAppRecord: ve.value,
      appRecords: Dn.value
    };
  },
  api: hc(ea)
});
var At = D.__VUE_DEVTOOLS_KIT_CONTEXT__;
p();
yu(pu());
var oa, ra;
(ra = (oa = D).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__) != null || (oa.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
});
p();
p();
function yc(e) {
  ae.highPerfModeEnabled = e ?? !ae.highPerfModeEnabled, !e && ve.value && Mi(ve.value.app);
}
p();
p();
p();
function _c(e) {
  ae.devtoolsClientDetected = {
    ...ae.devtoolsClientDetected,
    ...e
  };
  const t = Object.values(ae.devtoolsClientDetected).some(Boolean);
  yc(!t);
}
var aa, ia;
(ia = (aa = D).__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__) != null || (aa.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ = _c);
p();
p();
p();
p();
p();
p();
p();
var pc = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map(), this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    this.keyToValue.set(e, t), this.valueToKey.set(t, e);
  }
  getByKey(e) {
    return this.keyToValue.get(e);
  }
  getByValue(e) {
    return this.valueToKey.get(e);
  }
  clear() {
    this.keyToValue.clear(), this.valueToKey.clear();
  }
}, Ui = class {
  constructor(e) {
    this.generateIdentifier = e, this.kv = new pc();
  }
  register(e, t) {
    this.kv.getByValue(e) || (t || (t = this.generateIdentifier(e)), this.kv.set(t, e));
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(e) {
    return this.kv.getByValue(e);
  }
  getValue(e) {
    return this.kv.getByKey(e);
  }
}, bc = class extends Ui {
  constructor() {
    super((e) => e.name), this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(e, t) {
    typeof t == "object" ? (t.allowProps && this.classToAllowedProps.set(e, t.allowProps), super.register(e, t.identifier)) : super.register(e, t);
  }
  getAllowedProps(e) {
    return this.classToAllowedProps.get(e);
  }
};
p();
p();
function Ec(e) {
  if ("values" in Object)
    return Object.values(e);
  const t = [];
  for (const n in e)
    e.hasOwnProperty(n) && t.push(e[n]);
  return t;
}
function Cc(e, t) {
  const n = Ec(e);
  if ("find" in n)
    return n.find(t);
  const o = n;
  for (let r = 0; r < o.length; r++) {
    const a = o[r];
    if (t(a))
      return a;
  }
}
function Et(e, t) {
  Object.entries(e).forEach(([n, o]) => t(o, n));
}
function fn(e, t) {
  return e.indexOf(t) !== -1;
}
function sa(e, t) {
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (t(o))
      return o;
  }
}
var Sc = class {
  constructor() {
    this.transfomers = {};
  }
  register(e) {
    this.transfomers[e.name] = e;
  }
  findApplicable(e) {
    return Cc(this.transfomers, (t) => t.isApplicable(e));
  }
  findByName(e) {
    return this.transfomers[e];
  }
};
p();
p();
var wc = (e) => Object.prototype.toString.call(e).slice(8, -1), ji = (e) => typeof e > "u", Ac = (e) => e === null, Ut = (e) => typeof e != "object" || e === null || e === Object.prototype ? !1 : Object.getPrototypeOf(e) === null ? !0 : Object.getPrototypeOf(e) === Object.prototype, bo = (e) => Ut(e) && Object.keys(e).length === 0, Ke = (e) => Array.isArray(e), kc = (e) => typeof e == "string", Oc = (e) => typeof e == "number" && !isNaN(e), Ic = (e) => typeof e == "boolean", xc = (e) => e instanceof RegExp, jt = (e) => e instanceof Map, zt = (e) => e instanceof Set, zi = (e) => wc(e) === "Symbol", Tc = (e) => e instanceof Date && !isNaN(e.valueOf()), Pc = (e) => e instanceof Error, la = (e) => typeof e == "number" && isNaN(e), Vc = (e) => Ic(e) || Ac(e) || ji(e) || Oc(e) || kc(e) || zi(e), Dc = (e) => typeof e == "bigint", Rc = (e) => e === 1 / 0 || e === -1 / 0, Bc = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), Nc = (e) => e instanceof URL;
p();
var Hi = (e) => e.replace(/\./g, "\\."), Jn = (e) => e.map(String).map(Hi).join("."), Lt = (e) => {
  const t = [];
  let n = "";
  for (let r = 0; r < e.length; r++) {
    let a = e.charAt(r);
    if (a === "\\" && e.charAt(r + 1) === ".") {
      n += ".", r++;
      continue;
    }
    if (a === ".") {
      t.push(n), n = "";
      continue;
    }
    n += a;
  }
  const o = n;
  return t.push(o), t;
};
p();
function Oe(e, t, n, o) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: o
  };
}
var Wi = [
  Oe(ji, "undefined", () => null, () => {
  }),
  Oe(Dc, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  Oe(Tc, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  Oe(Pc, "Error", (e, t) => {
    const n = {
      name: e.name,
      message: e.message
    };
    return t.allowedErrorProps.forEach((o) => {
      n[o] = e[o];
    }), n;
  }, (e, t) => {
    const n = new Error(e.message);
    return n.name = e.name, n.stack = e.stack, t.allowedErrorProps.forEach((o) => {
      n[o] = e[o];
    }), n;
  }),
  Oe(xc, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), n = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, n);
  }),
  Oe(
    zt,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  Oe(jt, "map", (e) => [...e.entries()], (e) => new Map(e)),
  Oe((e) => la(e) || Rc(e), "number", (e) => la(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  Oe((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  Oe(Nc, "URL", (e) => e.toString(), (e) => new URL(e))
];
function Rn(e, t, n, o) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: o
  };
}
var Ki = Rn((e, t) => zi(e) ? !!t.symbolRegistry.getIdentifier(e) : !1, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, n) => {
  const o = n.symbolRegistry.getValue(t[1]);
  if (!o)
    throw new Error("Trying to deserialize unknown symbol");
  return o;
}), Lc = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), Gi = Rn(Bc, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const n = Lc[t[1]];
  if (!n)
    throw new Error("Trying to deserialize unknown typed array");
  return new n(e);
});
function qi(e, t) {
  return e != null && e.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : !1;
}
var Yi = Rn(qi, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
  const n = t.classRegistry.getAllowedProps(e.constructor);
  if (!n)
    return { ...e };
  const o = {};
  return n.forEach((r) => {
    o[r] = e[r];
  }), o;
}, (e, t, n) => {
  const o = n.classRegistry.getValue(t[1]);
  if (!o)
    throw new Error(`Trying to deserialize unknown class '${t[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  return Object.assign(Object.create(o.prototype), e);
}), Xi = Rn((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, n) => {
  const o = n.customTransformerRegistry.findByName(t[1]);
  if (!o)
    throw new Error("Trying to deserialize unknown custom value");
  return o.deserialize(e);
}), Fc = [Yi, Ki, Xi, Gi], ua = (e, t) => {
  const n = sa(Fc, (r) => r.isApplicable(e, t));
  if (n)
    return {
      value: n.transform(e, t),
      type: n.annotation(e, t)
    };
  const o = sa(Wi, (r) => r.isApplicable(e, t));
  if (o)
    return {
      value: o.transform(e, t),
      type: o.annotation
    };
}, Zi = {};
Wi.forEach((e) => {
  Zi[e.annotation] = e;
});
var $c = (e, t, n) => {
  if (Ke(t))
    switch (t[0]) {
      case "symbol":
        return Ki.untransform(e, t, n);
      case "class":
        return Yi.untransform(e, t, n);
      case "custom":
        return Xi.untransform(e, t, n);
      case "typed-array":
        return Gi.untransform(e, t, n);
      default:
        throw new Error("Unknown transformation: " + t);
    }
  else {
    const o = Zi[t];
    if (!o)
      throw new Error("Unknown transformation: " + t);
    return o.untransform(e, n);
  }
};
p();
var ht = (e, t) => {
  if (t > e.size)
    throw new Error("index out of bounds");
  const n = e.keys();
  for (; t > 0; )
    n.next(), t--;
  return n.next().value;
};
function Ji(e) {
  if (fn(e, "__proto__"))
    throw new Error("__proto__ is not allowed as a property");
  if (fn(e, "prototype"))
    throw new Error("prototype is not allowed as a property");
  if (fn(e, "constructor"))
    throw new Error("constructor is not allowed as a property");
}
var Mc = (e, t) => {
  Ji(t);
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (zt(e))
      e = ht(e, +o);
    else if (jt(e)) {
      const r = +o, a = +t[++n] == 0 ? "key" : "value", i = ht(e, r);
      switch (a) {
        case "key":
          e = i;
          break;
        case "value":
          e = e.get(i);
          break;
      }
    } else
      e = e[o];
  }
  return e;
}, Eo = (e, t, n) => {
  if (Ji(t), t.length === 0)
    return n(e);
  let o = e;
  for (let a = 0; a < t.length - 1; a++) {
    const i = t[a];
    if (Ke(o)) {
      const s = +i;
      o = o[s];
    } else if (Ut(o))
      o = o[i];
    else if (zt(o)) {
      const s = +i;
      o = ht(o, s);
    } else if (jt(o)) {
      if (a === t.length - 2)
        break;
      const l = +i, u = +t[++a] == 0 ? "key" : "value", c = ht(o, l);
      switch (u) {
        case "key":
          o = c;
          break;
        case "value":
          o = o.get(c);
          break;
      }
    }
  }
  const r = t[t.length - 1];
  if (Ke(o) ? o[+r] = n(o[+r]) : Ut(o) && (o[r] = n(o[r])), zt(o)) {
    const a = ht(o, +r), i = n(a);
    a !== i && (o.delete(a), o.add(i));
  }
  if (jt(o)) {
    const a = +t[t.length - 2], i = ht(o, a);
    switch (+r == 0 ? "key" : "value") {
      case "key": {
        const l = n(i);
        o.set(l, o.get(i)), l !== i && o.delete(i);
        break;
      }
      case "value": {
        o.set(i, n(o.get(i)));
        break;
      }
    }
  }
  return e;
};
function Co(e, t, n = []) {
  if (!e)
    return;
  if (!Ke(e)) {
    Et(e, (a, i) => Co(a, t, [...n, ...Lt(i)]));
    return;
  }
  const [o, r] = e;
  r && Et(r, (a, i) => {
    Co(a, t, [...n, ...Lt(i)]);
  }), t(o, n);
}
function Uc(e, t, n) {
  return Co(t, (o, r) => {
    e = Eo(e, r, (a) => $c(a, o, n));
  }), e;
}
function jc(e, t) {
  function n(o, r) {
    const a = Mc(e, Lt(r));
    o.map(Lt).forEach((i) => {
      e = Eo(e, i, () => a);
    });
  }
  if (Ke(t)) {
    const [o, r] = t;
    o.forEach((a) => {
      e = Eo(e, Lt(a), () => e);
    }), r && Et(r, n);
  } else
    Et(t, n);
  return e;
}
var zc = (e, t) => Ut(e) || Ke(e) || jt(e) || zt(e) || qi(e, t);
function Hc(e, t, n) {
  const o = n.get(e);
  o ? o.push(t) : n.set(e, [t]);
}
function Wc(e, t) {
  const n = {};
  let o;
  return e.forEach((r) => {
    if (r.length <= 1)
      return;
    t || (r = r.map((s) => s.map(String)).sort((s, l) => s.length - l.length));
    const [a, ...i] = r;
    a.length === 0 ? o = i.map(Jn) : n[Jn(a)] = i.map(Jn);
  }), o ? bo(n) ? [o] : [o, n] : bo(n) ? void 0 : n;
}
var Qi = (e, t, n, o, r = [], a = [], i = /* @__PURE__ */ new Map()) => {
  var s;
  const l = Vc(e);
  if (!l) {
    Hc(e, r, t);
    const m = i.get(e);
    if (m)
      return o ? {
        transformedValue: null
      } : m;
  }
  if (!zc(e, n)) {
    const m = ua(e, n), h = m ? {
      transformedValue: m.value,
      annotations: [m.type]
    } : {
      transformedValue: e
    };
    return l || i.set(e, h), h;
  }
  if (fn(a, e))
    return {
      transformedValue: null
    };
  const u = ua(e, n), c = (s = u == null ? void 0 : u.value) != null ? s : e, d = Ke(c) ? [] : {}, v = {};
  Et(c, (m, h) => {
    if (h === "__proto__" || h === "constructor" || h === "prototype")
      throw new Error(`Detected property ${h}. This is a prototype pollution risk, please remove it from your object.`);
    const y = Qi(m, t, n, o, [...r, h], [...a, e], i);
    d[h] = y.transformedValue, Ke(y.annotations) ? v[h] = y.annotations : Ut(y.annotations) && Et(y.annotations, (g, E) => {
      v[Hi(h) + "." + E] = g;
    });
  });
  const f = bo(v) ? {
    transformedValue: d,
    annotations: u ? [u.type] : void 0
  } : {
    transformedValue: d,
    annotations: u ? [u.type, v] : v
  };
  return l || i.set(e, f), f;
};
p();
p();
function es(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function ca(e) {
  return es(e) === "Array";
}
function Kc(e) {
  if (es(e) !== "Object")
    return !1;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function Gc(e, t, n, o, r) {
  const a = {}.propertyIsEnumerable.call(o, t) ? "enumerable" : "nonenumerable";
  a === "enumerable" && (e[t] = n), r && a === "nonenumerable" && Object.defineProperty(e, t, {
    value: n,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
}
function So(e, t = {}) {
  if (ca(e))
    return e.map((r) => So(r, t));
  if (!Kc(e))
    return e;
  const n = Object.getOwnPropertyNames(e), o = Object.getOwnPropertySymbols(e);
  return [...n, ...o].reduce((r, a) => {
    if (ca(t.props) && !t.props.includes(a))
      return r;
    const i = e[a], s = So(i, t);
    return Gc(r, a, s, e, t.nonenumerable), r;
  }, {});
}
var Z = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: e = !1 } = {}) {
    this.classRegistry = new bc(), this.symbolRegistry = new Ui((t) => {
      var n;
      return (n = t.description) != null ? n : "";
    }), this.customTransformerRegistry = new Sc(), this.allowedErrorProps = [], this.dedupe = e;
  }
  serialize(e) {
    const t = /* @__PURE__ */ new Map(), n = Qi(e, t, this, this.dedupe), o = {
      json: n.transformedValue
    };
    n.annotations && (o.meta = {
      ...o.meta,
      values: n.annotations
    });
    const r = Wc(t, this.dedupe);
    return r && (o.meta = {
      ...o.meta,
      referentialEqualities: r
    }), o;
  }
  deserialize(e) {
    const { json: t, meta: n } = e;
    let o = So(t);
    return n != null && n.values && (o = Uc(o, n.values, this)), n != null && n.referentialEqualities && (o = jc(o, n.referentialEqualities)), o;
  }
  stringify(e) {
    return JSON.stringify(this.serialize(e));
  }
  parse(e) {
    return this.deserialize(JSON.parse(e));
  }
  registerClass(e, t) {
    this.classRegistry.register(e, t);
  }
  registerSymbol(e, t) {
    this.symbolRegistry.register(e, t);
  }
  registerCustom(e, t) {
    this.customTransformerRegistry.register({
      name: t,
      ...e
    });
  }
  allowErrorProps(...e) {
    this.allowedErrorProps.push(...e);
  }
};
Z.defaultInstance = new Z();
Z.serialize = Z.defaultInstance.serialize.bind(Z.defaultInstance);
Z.deserialize = Z.defaultInstance.deserialize.bind(Z.defaultInstance);
Z.stringify = Z.defaultInstance.stringify.bind(Z.defaultInstance);
Z.parse = Z.defaultInstance.parse.bind(Z.defaultInstance);
Z.registerClass = Z.defaultInstance.registerClass.bind(Z.defaultInstance);
Z.registerSymbol = Z.defaultInstance.registerSymbol.bind(Z.defaultInstance);
Z.registerCustom = Z.defaultInstance.registerCustom.bind(Z.defaultInstance);
Z.allowErrorProps = Z.defaultInstance.allowErrorProps.bind(Z.defaultInstance);
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
p();
var da, fa;
(fa = (da = D).__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__) != null || (da.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ = []);
var va, ma;
(ma = (va = D).__VUE_DEVTOOLS_KIT_RPC_CLIENT__) != null || (va.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = null);
var ga, ha;
(ha = (ga = D).__VUE_DEVTOOLS_KIT_RPC_SERVER__) != null || (ga.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = null);
var ya, _a;
(_a = (ya = D).__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__) != null || (ya.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = null);
var pa, ba;
(ba = (pa = D).__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__) != null || (pa.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = null);
var Ea, Ca;
(Ca = (Ea = D).__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__) != null || (Ea.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ = null);
p();
p();
p();
p();
p();
p();
p();
/*!
 * pinia v3.0.3
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let Dt;
const Ht = (e) => Dt = e, ts = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function ut(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Te;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Te || (Te = {}));
const Me = typeof window < "u", Sa = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function qc(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], { type: e.type }) : e;
}
function Jo(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    rs(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function ns(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function vn(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const n = new MouseEvent("click", {
      bubbles: !0,
      cancelable: !0,
      view: window,
      detail: 0,
      screenX: 80,
      screenY: 20,
      clientX: 80,
      clientY: 20,
      ctrlKey: !1,
      altKey: !1,
      shiftKey: !1,
      metaKey: !1,
      button: 0,
      relatedTarget: null
    });
    e.dispatchEvent(n);
  }
}
const mn = typeof navigator == "object" ? navigator : { userAgent: "" }, os = /Macintosh/.test(mn.userAgent) && /AppleWebKit/.test(mn.userAgent) && !/Safari/.test(mn.userAgent), rs = Me ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !os ? Yc : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in mn ? Xc : (
      // Fallback to using FileReader and a popup
      Zc
    )
  )
) : () => {
};
function Yc(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? ns(o.href) ? Jo(e, t, n) : (o.target = "_blank", vn(o)) : vn(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    vn(o);
  }, 0));
}
function Xc(e, t = "download", n) {
  if (typeof e == "string")
    if (ns(e))
      Jo(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        vn(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(qc(e, n), t);
}
function Zc(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return Jo(e, t, n);
  const r = e.type === "application/octet-stream", a = /constructor/i.test(String(Sa.HTMLElement)) || "safari" in Sa, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || r && a || os) && typeof FileReader < "u") {
    const s = new FileReader();
    s.onloadend = function() {
      let l = s.result;
      if (typeof l != "string")
        throw o = null, new Error("Wrong reader.result type");
      l = i ? l : l.replace(/^data:[^;]*;/, "data:attachment/file;"), o ? o.location.href = l : location.assign(l), o = null;
    }, s.readAsDataURL(e);
  } else {
    const s = URL.createObjectURL(e);
    o ? o.location.assign(s) : location.href = s, o = null, setTimeout(function() {
      URL.revokeObjectURL(s);
    }, 4e4);
  }
}
function ie(e, t) {
  const n = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(n, t) : t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.log(n);
}
function Qo(e) {
  return "_a" in e && "install" in e;
}
function as() {
  if (!("clipboard" in navigator))
    return ie("Your browser doesn't support the Clipboard API", "error"), !0;
}
function is(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (ie('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function Jc(e) {
  if (!as())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), ie("Global state copied to clipboard.");
    } catch (t) {
      if (is(t))
        return;
      ie("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function Qc(e) {
  if (!as())
    try {
      ss(e, JSON.parse(await navigator.clipboard.readText())), ie("Global state pasted from clipboard.");
    } catch (t) {
      if (is(t))
        return;
      ie("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ed(e) {
  try {
    rs(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    ie("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let Re;
function td() {
  Re || (Re = document.createElement("input"), Re.type = "file", Re.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      Re.onchange = async () => {
        const o = Re.files;
        if (!o)
          return t(null);
        const r = o.item(0);
        return t(r ? { text: await r.text(), file: r } : null);
      }, Re.oncancel = () => t(null), Re.onerror = n, Re.click();
    });
  }
  return e;
}
async function nd(e) {
  try {
    const n = await td()();
    if (!n)
      return;
    const { text: o, file: r } = n;
    ss(e, JSON.parse(o)), ie(`Global state imported from "${r.name}".`);
  } catch (t) {
    ie("Failed to import the state from JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function ss(e, t) {
  for (const n in t) {
    const o = e.state.value[n];
    o ? Object.assign(o, t[n]) : e.state.value[n] = t[n];
  }
}
function we(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const ls = "🍍 Pinia (root)", gn = "_root";
function od(e) {
  return Qo(e) ? {
    id: gn,
    label: ls
  } : {
    id: e.$id,
    label: e.$id
  };
}
function rd(e) {
  if (Qo(e)) {
    const n = Array.from(e._s.keys()), o = e._s;
    return {
      state: n.map((a) => ({
        editable: !0,
        key: a,
        value: e.state.value[a]
      })),
      getters: n.filter((a) => o.get(a)._getters).map((a) => {
        const i = o.get(a);
        return {
          editable: !1,
          key: a,
          value: i._getters.reduce((s, l) => (s[l] = i[l], s), {})
        };
      })
    };
  }
  const t = {
    state: Object.keys(e.$state).map((n) => ({
      editable: !0,
      key: n,
      value: e.$state[n]
    }))
  };
  return e._getters && e._getters.length && (t.getters = e._getters.map((n) => ({
    editable: !1,
    key: n,
    value: e[n]
  }))), e._customProperties.size && (t.customProperties = Array.from(e._customProperties).map((n) => ({
    editable: !0,
    key: n,
    value: e[n]
  }))), t;
}
function ad(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: we(e.type),
    key: we(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function id(e) {
  switch (e) {
    case Te.direct:
      return "mutation";
    case Te.patchFunction:
      return "$patch";
    case Te.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let yt = !0;
const hn = [], Ze = "pinia:mutations", ce = "pinia", { assign: sd } = Object, bn = (e) => "🍍 " + e;
function ld(e, t) {
  $i({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: hn,
    app: e
  }, (n) => {
    typeof n.now != "function" && ie("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: Ze,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: ce,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            Jc(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await Qc(t), n.sendInspectorTree(ce), n.sendInspectorState(ce);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ed(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await nd(t), n.sendInspectorTree(ce), n.sendInspectorState(ce);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (o) => {
            const r = t._s.get(o);
            r ? typeof r.$reset != "function" ? ie(`Cannot reset "${o}" store because it doesn't have a "$reset" method implemented.`, "warn") : (r.$reset(), ie(`Store "${o}" reset.`)) : ie(`Cannot reset "${o}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), n.on.inspectComponent((o) => {
      const r = o.componentInstance && o.componentInstance.proxy;
      if (r && r._pStores) {
        const a = o.componentInstance.proxy._pStores;
        Object.values(a).forEach((i) => {
          o.instanceData.state.push({
            type: bn(i.$id),
            key: "state",
            editable: !0,
            value: i._isOptionsAPI ? {
              _custom: {
                value: it(i.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => i.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(i.$state).reduce((s, l) => (s[l] = i.$state[l], s), {})
            )
          }), i._getters && i._getters.length && o.instanceData.state.push({
            type: bn(i.$id),
            key: "getters",
            editable: !1,
            value: i._getters.reduce((s, l) => {
              try {
                s[l] = i[l];
              } catch (u) {
                s[l] = u;
              }
              return s;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((o) => {
      if (o.app === e && o.inspectorId === ce) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((a) => "$id" in a ? a.$id.toLowerCase().includes(o.filter.toLowerCase()) : ls.toLowerCase().includes(o.filter.toLowerCase())) : r).map(od);
      }
    }), globalThis.$pinia = t, n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === ce) {
        const r = o.nodeId === gn ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.nodeId !== gn && (globalThis.$store = it(r)), o.state = rd(r));
      }
    }), n.on.editInspectorState((o) => {
      if (o.app === e && o.inspectorId === ce) {
        const r = o.nodeId === gn ? t : t._s.get(o.nodeId);
        if (!r)
          return ie(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        Qo(r) ? a.unshift("state") : (a.length !== 1 || !r._customProperties.has(a[0]) || a[0] in r.$state) && a.unshift("$state"), yt = !1, o.set(r, a, o.state.value), yt = !0;
      }
    }), n.on.editComponentState((o) => {
      if (o.type.startsWith("🍍")) {
        const r = o.type.replace(/^🍍\s*/, ""), a = t._s.get(r);
        if (!a)
          return ie(`store "${r}" not found`, "error");
        const { path: i } = o;
        if (i[0] !== "state")
          return ie(`Invalid path for store "${r}":
${i}
Only state can be modified.`);
        i[0] = "$state", yt = !1, o.set(a, i, o.state.value), yt = !0;
      }
    });
  });
}
function ud(e, t) {
  hn.includes(bn(t.$id)) || hn.push(bn(t.$id)), $i({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: hn,
    app: e,
    settings: {
      logStoreChanges: {
        label: "Notify about new/deleted stores",
        type: "boolean",
        defaultValue: !0
      }
      // useEmojis: {
      //   label: 'Use emojis in messages ⚡️',
      //   type: 'boolean',
      //   defaultValue: true,
      // },
    }
  }, (n) => {
    const o = typeof n.now == "function" ? n.now.bind(n) : Date.now;
    t.$onAction(({ after: i, onError: s, name: l, args: u }) => {
      const c = us++;
      n.addTimelineEvent({
        layerId: Ze,
        event: {
          time: o(),
          title: "🛫 " + l,
          subtitle: "start",
          data: {
            store: we(t.$id),
            action: we(l),
            args: u
          },
          groupId: c
        }
      }), i((d) => {
        Ue = void 0, n.addTimelineEvent({
          layerId: Ze,
          event: {
            time: o(),
            title: "🛬 " + l,
            subtitle: "end",
            data: {
              store: we(t.$id),
              action: we(l),
              args: u,
              result: d
            },
            groupId: c
          }
        });
      }), s((d) => {
        Ue = void 0, n.addTimelineEvent({
          layerId: Ze,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + l,
            subtitle: "end",
            data: {
              store: we(t.$id),
              action: we(l),
              args: u,
              error: d
            },
            groupId: c
          }
        });
      });
    }, !0), t._customProperties.forEach((i) => {
      q(() => Ae(t[i]), (s, l) => {
        n.notifyComponentUpdate(), n.sendInspectorState(ce), yt && n.addTimelineEvent({
          layerId: Ze,
          event: {
            time: o(),
            title: "Change",
            subtitle: i,
            data: {
              newValue: s,
              oldValue: l
            },
            groupId: Ue
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: i, type: s }, l) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(ce), !yt)
        return;
      const u = {
        time: o(),
        title: id(s),
        data: sd({ store: we(t.$id) }, ad(i)),
        groupId: Ue
      };
      s === Te.patchFunction ? u.subtitle = "⤵️" : s === Te.patchObject ? u.subtitle = "🧩" : i && !Array.isArray(i) && (u.subtitle = i.type), i && (u.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: i
        }
      }), n.addTimelineEvent({
        layerId: Ze,
        event: u
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = $e((i) => {
      r(i), n.addTimelineEvent({
        layerId: Ze,
        event: {
          time: o(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: we(t.$id),
            info: we("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(ce), n.sendInspectorState(ce);
    });
    const { $dispose: a } = t;
    t.$dispose = () => {
      a(), n.notifyComponentUpdate(), n.sendInspectorTree(ce), n.sendInspectorState(ce), n.getSettings().logStoreChanges && ie(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(ce), n.sendInspectorState(ce), n.getSettings().logStoreChanges && ie(`"${t.$id}" store installed 🆕`);
  });
}
let us = 0, Ue;
function wa(e, t, n) {
  const o = t.reduce((r, a) => (r[a] = it(e)[a], r), {});
  for (const r in o)
    e[r] = function() {
      const a = us, i = n ? new Proxy(e, {
        get(...l) {
          return Ue = a, Reflect.get(...l);
        },
        set(...l) {
          return Ue = a, Reflect.set(...l);
        }
      }) : e;
      Ue = a;
      const s = o[r].apply(i, arguments);
      return Ue = void 0, s;
    };
}
function cd({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (t._isOptionsAPI = !!n.state, !t._p._testing) {
      wa(t, Object.keys(n.actions), t._isOptionsAPI);
      const o = t._hotUpdate;
      it(t)._hotUpdate = function(r) {
        o.apply(this, arguments), wa(t, Object.keys(r._hmrPayload.actions), !!t._isOptionsAPI);
      };
    }
    ud(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function dd() {
  const e = Xt(!0), t = e.run(() => j({}));
  let n = [], o = [];
  const r = $e({
    install(a) {
      Ht(r), r._a = a, a.provide(ts, r), a.config.globalProperties.$pinia = r, process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Me && ld(a, r), o.forEach((i) => n.push(i)), o = [];
    },
    use(a) {
      return this._a ? n.push(a) : o.push(a), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Me && typeof Proxy < "u" && r.use(cd), r;
}
function cs(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    ut(r) && ut(o) && !ze(o) && !Fo(o) ? e[n] = cs(r, o) : e[n] = o;
  }
  return e;
}
const ds = () => {
};
function Aa(e, t, n, o = ds) {
  e.push(t);
  const r = () => {
    const a = e.indexOf(t);
    a > -1 && (e.splice(a, 1), o());
  };
  return !n && ml() && ye(r), r;
}
function vt(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
const fd = (e) => e(), ka = Symbol(), Qn = Symbol();
function wo(e, t) {
  e instanceof Map && t instanceof Map ? t.forEach((n, o) => e.set(o, n)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    ut(r) && ut(o) && e.hasOwnProperty(n) && !ze(o) && !Fo(o) ? e[n] = wo(r, o) : e[n] = o;
  }
  return e;
}
const vd = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function md(e) {
  return !ut(e) || !Object.prototype.hasOwnProperty.call(e, vd);
}
const { assign: Se } = Object;
function Oa(e) {
  return !!(ze(e) && e.effect);
}
function Ia(e, t, n, o) {
  const { state: r, actions: a, getters: i } = t, s = n.state.value[e];
  let l;
  function u() {
    !s && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const c = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      lo(j(r ? r() : {}).value)
    ) : lo(n.state.value[e]);
    return Se(c, a, Object.keys(i || {}).reduce((d, v) => (process.env.NODE_ENV !== "production" && v in c && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${v}" in store "${e}".`), d[v] = $e(T(() => {
      Ht(n);
      const f = n._s.get(e);
      return i[v].call(f, f);
    })), d), {}));
  }
  return l = Ao(e, u, t, n, o, !0), l;
}
function Ao(e, t, n = {}, o, r, a) {
  let i;
  const s = Se({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const l = { deep: !0 };
  process.env.NODE_ENV !== "production" && (l.onTrigger = (I) => {
    u ? f = I : u == !1 && !C._hotUpdating && (Array.isArray(f) ? f.push(I) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let u, c, d = [], v = [], f;
  const m = o.state.value[e];
  !a && !m && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const h = j({});
  let y;
  function g(I) {
    let _;
    u = c = !1, process.env.NODE_ENV !== "production" && (f = []), typeof I == "function" ? (I(o.state.value[e]), _ = {
      type: Te.patchFunction,
      storeId: e,
      events: f
    }) : (wo(o.state.value[e], I), _ = {
      type: Te.patchObject,
      payload: I,
      storeId: e,
      events: f
    });
    const w = y = Symbol();
    ge().then(() => {
      y === w && (u = !0);
    }), c = !0, vt(d, _, o.state.value[e]);
  }
  const E = a ? function() {
    const { state: _ } = n, w = _ ? _() : {};
    this.$patch((x) => {
      Se(x, w);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : ds
  );
  function A() {
    i.stop(), d = [], v = [], o._s.delete(e);
  }
  const b = (I, _ = "") => {
    if (ka in I)
      return I[Qn] = _, I;
    const w = function() {
      Ht(o);
      const x = Array.from(arguments), B = [], L = [];
      function M(U) {
        B.push(U);
      }
      function R(U) {
        L.push(U);
      }
      vt(v, {
        args: x,
        name: w[Qn],
        store: C,
        after: M,
        onError: R
      });
      let H;
      try {
        H = I.apply(this && this.$id === e ? this : C, x);
      } catch (U) {
        throw vt(L, U), U;
      }
      return H instanceof Promise ? H.then((U) => (vt(B, U), U)).catch((U) => (vt(L, U), Promise.reject(U))) : (vt(B, H), H);
    };
    return w[ka] = !0, w[Qn] = _, w;
  }, P = /* @__PURE__ */ $e({
    actions: {},
    getters: {},
    state: [],
    hotState: h
  }), V = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: Aa.bind(null, v),
    $patch: g,
    $reset: E,
    $subscribe(I, _ = {}) {
      const w = Aa(d, I, _.detached, () => x()), x = i.run(() => q(() => o.state.value[e], (B) => {
        (_.flush === "sync" ? c : u) && I({
          storeId: e,
          type: Te.direct,
          events: f
        }, B);
      }, Se({}, l, _)));
      return w;
    },
    $dispose: A
  }, C = st(process.env.NODE_ENV !== "production" || process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Me ? Se(
    {
      _hmrPayload: P,
      _customProperties: $e(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    V
    // must be added later
    // setupStore
  ) : V);
  o._s.set(e, C);
  const N = (o._a && o._a.runWithContext || fd)(() => o._e.run(() => (i = Xt()).run(() => t({ action: b }))));
  for (const I in N) {
    const _ = N[I];
    if (ze(_) && !Oa(_) || Fo(_))
      process.env.NODE_ENV !== "production" && r ? h.value[I] = F(N, I) : a || (m && md(_) && (ze(_) ? _.value = m[I] : wo(_, m[I])), o.state.value[e][I] = _), process.env.NODE_ENV !== "production" && P.state.push(I);
    else if (typeof _ == "function") {
      const w = process.env.NODE_ENV !== "production" && r ? _ : b(_, I);
      N[I] = w, process.env.NODE_ENV !== "production" && (P.actions[I] = _), s.actions[I] = _;
    } else process.env.NODE_ENV !== "production" && Oa(_) && (P.getters[I] = a ? (
      // @ts-expect-error
      n.getters[I]
    ) : _, Me && (N._getters || // @ts-expect-error: same
    (N._getters = $e([]))).push(I));
  }
  if (Se(C, N), Se(it(C), N), Object.defineProperty(C, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? h.value : o.state.value[e],
    set: (I) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      g((_) => {
        Se(_, I);
      });
    }
  }), process.env.NODE_ENV !== "production" && (C._hotUpdate = $e((I) => {
    C._hotUpdating = !0, I._hmrPayload.state.forEach((_) => {
      if (_ in C.$state) {
        const w = I.$state[_], x = C.$state[_];
        typeof w == "object" && ut(w) && ut(x) ? cs(w, x) : I.$state[_] = x;
      }
      C[_] = F(I.$state, _);
    }), Object.keys(C.$state).forEach((_) => {
      _ in I.$state || delete C[_];
    }), u = !1, c = !1, o.state.value[e] = F(I._hmrPayload, "hotState"), c = !0, ge().then(() => {
      u = !0;
    });
    for (const _ in I._hmrPayload.actions) {
      const w = I[_];
      C[_] = //
      b(w, _);
    }
    for (const _ in I._hmrPayload.getters) {
      const w = I._hmrPayload.getters[_], x = a ? (
        // special handling of options api
        T(() => (Ht(o), w.call(C, C)))
      ) : w;
      C[_] = //
      x;
    }
    Object.keys(C._hmrPayload.getters).forEach((_) => {
      _ in I._hmrPayload.getters || delete C[_];
    }), Object.keys(C._hmrPayload.actions).forEach((_) => {
      _ in I._hmrPayload.actions || delete C[_];
    }), C._hmrPayload = I._hmrPayload, C._getters = I._getters, C._hotUpdating = !1;
  })), process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Me) {
    const I = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((_) => {
      Object.defineProperty(C, _, Se({ value: C[_] }, I));
    });
  }
  return o._p.forEach((I) => {
    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Me) {
      const _ = i.run(() => I({
        store: C,
        app: o._a,
        pinia: o,
        options: s
      }));
      Object.keys(_ || {}).forEach((w) => C._customProperties.add(w)), Se(C, _);
    } else
      Se(C, i.run(() => I({
        store: C,
        app: o._a,
        pinia: o,
        options: s
      })));
  }), process.env.NODE_ENV !== "production" && C.$state && typeof C.$state == "object" && typeof C.$state.constructor == "function" && !C.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${C.$id}".`), m && a && n.hydrate && n.hydrate(C.$state, m), u = !0, c = !0, C;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function gd(e, t, n) {
  let o;
  const r = typeof t == "function";
  o = r ? n : t;
  function a(i, s) {
    const l = vl();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Dt && Dt._testing ? null : i) || (l ? se(ts, null) : null), i && Ht(i), process.env.NODE_ENV !== "production" && !Dt)
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    i = Dt, i._s.has(e) || (r ? Ao(e, t, o, i) : Ia(e, o, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const u = i._s.get(e);
    if (process.env.NODE_ENV !== "production" && s) {
      const c = "__hot:" + e, d = r ? Ao(c, t, o, i, !0) : Ia(c, Se({}, o), i, !0);
      s._hotUpdate(d), delete i.state.value[c], i._s.delete(c);
    }
    if (process.env.NODE_ENV !== "production" && Me) {
      const c = Lo();
      if (c && c.proxy && // avoid adding stores that are just built for hot module replacement
      !s) {
        const d = c.proxy, v = "_pStores" in d ? d._pStores : d._pStores = {};
        v[e] = u;
      }
    }
    return u;
  }
  return a.$id = e, a;
}
const er = /* @__PURE__ */ gd("user", {
  state: () => ({
    id: "",
    email: "",
    salt: "",
    avatar: "",
    name: ""
  }),
  actions: {
    setPreLoginInfo(e) {
      this.id = e.id, this.email = e.email, this.salt = e.salt;
    },
    setUser(e) {
      this.id = e.id, this.email = e.email, this.name = e.name, this.avatar = e.avatar;
    },
    clear() {
      this.id = "", this.email = "", this.name = "", this.avatar = "", this.salt = "";
    }
  },
  getters: {
    preLoginInfo: (e) => ({
      id: e.id,
      email: e.email,
      salt: e.salt
    }),
    isPreLoginDone: (e) => e.id && e.id.length > 0 && e.salt && `${e.salt}`.length > 0,
    user(e) {
      return {
        id: e.id,
        name: e.name,
        email: e.email,
        avatar: e.avatar
      };
    }
  }
}), be = typeof window < "u", tr = be && "IntersectionObserver" in window;
function xa(e, t, n) {
  hd(e, t), t.set(e, n);
}
function hd(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Ta(e, t, n) {
  return e.set(fs(e, t), n), n;
}
function Be(e, t) {
  return e.get(fs(e, t));
}
function fs(e, t, n) {
  if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function Wt(e, t) {
  if (e === t) return !0;
  if (e instanceof Date && t instanceof Date && e.getTime() !== t.getTime() || e !== Object(e) || t !== Object(t))
    return !1;
  const n = Object.keys(e);
  return n.length !== Object.keys(t).length ? !1 : n.every((o) => Wt(e[o], t[o]));
}
function W(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (e == null || e === "")
    return;
  const n = Number(e);
  return isNaN(n) ? String(e) : isFinite(n) ? `${n}${t}` : void 0;
}
function ko(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Pa(e) {
  let t;
  return e !== null && typeof e == "object" && ((t = Object.getPrototypeOf(e)) === Object.prototype || t === null);
}
function vs(e) {
  if (e && "$el" in e) {
    const t = e.$el;
    return (t == null ? void 0 : t.nodeType) === Node.TEXT_NODE ? t.nextElementSibling : t;
  }
  return e;
}
function eo(e, t) {
  return t.every((n) => e.hasOwnProperty(n));
}
function ms(e, t) {
  const n = {};
  for (const o of t)
    Object.prototype.hasOwnProperty.call(e, o) && (n[o] = e[o]);
  return n;
}
function Va(e, t, n) {
  const o = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (const a in e)
    t.some((i) => i instanceof RegExp ? i.test(a) : i === a) ? o[a] = e[a] : r[a] = e[a];
  return [o, r];
}
function gs(e, t) {
  const n = {
    ...e
  };
  return t.forEach((o) => delete n[o]), n;
}
const hs = /^on[^a-z]/, ys = (e) => hs.test(e), yd = ["onAfterscriptexecute", "onAnimationcancel", "onAnimationend", "onAnimationiteration", "onAnimationstart", "onAuxclick", "onBeforeinput", "onBeforescriptexecute", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate", "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onFullscreenchange", "onFullscreenerror", "onGesturechange", "onGestureend", "onGesturestart", "onGotpointercapture", "onInput", "onKeydown", "onKeypress", "onKeyup", "onLostpointercapture", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onMousewheel", "onPaste", "onPointercancel", "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup", "onReset", "onSelect", "onSubmit", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onTransitioncancel", "onTransitionend", "onTransitionrun", "onTransitionstart", "onWheel"];
function _d(e) {
  const [t, n] = Va(e, [hs]), o = gs(t, yd), [r, a] = Va(n, ["class", "style", "id", /^data-/]);
  return Object.assign(r, t), Object.assign(a, o), [r, a];
}
function Ft(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function Kt(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(t, Math.min(n, e));
}
function Da(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return e + n.repeat(Math.max(0, t - e.length));
}
function pd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  const n = [];
  let o = 0;
  for (; o < e.length; )
    n.push(e.substr(o, t)), o += t;
  return n;
}
function _t() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0;
  const o = {};
  for (const r in e)
    o[r] = e[r];
  for (const r in t) {
    const a = e[r], i = t[r];
    if (Pa(a) && Pa(i)) {
      o[r] = _t(a, i, n);
      continue;
    }
    if (n && Array.isArray(a) && Array.isArray(i)) {
      o[r] = n(a, i);
      continue;
    }
    o[r] = i;
  }
  return o;
}
function _s(e) {
  return e.map((t) => t.type === xe ? _s(t.children) : t).flat();
}
function nt() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (nt.cache.has(e)) return nt.cache.get(e);
  const t = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  return nt.cache.set(e, t), t;
}
nt.cache = /* @__PURE__ */ new Map();
function Rt(e, t) {
  if (!t || typeof t != "object") return [];
  if (Array.isArray(t))
    return t.map((n) => Rt(e, n)).flat(1);
  if (t.suspense)
    return Rt(e, t.ssContent);
  if (Array.isArray(t.children))
    return t.children.map((n) => Rt(e, n)).flat(1);
  if (t.component) {
    if (Object.getOwnPropertySymbols(t.component.provides).includes(e))
      return [t.component];
    if (t.component.subTree)
      return Rt(e, t.component.subTree).flat(1);
  }
  return [];
}
var mt = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap();
class bd {
  constructor(t) {
    xa(this, mt, []), xa(this, Xe, 0), this.size = t;
  }
  get isFull() {
    return Be(mt, this).length === this.size;
  }
  push(t) {
    Be(mt, this)[Be(Xe, this)] = t, Ta(Xe, this, (Be(Xe, this) + 1) % this.size);
  }
  values() {
    return Be(mt, this).slice(Be(Xe, this)).concat(Be(mt, this).slice(0, Be(Xe, this)));
  }
  clear() {
    Be(mt, this).length = 0, Ta(Xe, this, 0);
  }
}
function nr(e) {
  const t = st({});
  dt(() => {
    const o = e();
    for (const r in o)
      t[r] = o[r];
  }, {
    flush: "sync"
  });
  const n = {};
  for (const o in t)
    n[o] = F(() => t[o]);
  return n;
}
function En(e, t) {
  return e.includes(t);
}
function ps(e) {
  return e[2].toLowerCase() + e.slice(3);
}
const ot = () => [Function, Array];
function Ra(e, t) {
  return t = "on" + mi(t), !!(e[t] || e[`${t}Once`] || e[`${t}Capture`] || e[`${t}OnceCapture`] || e[`${t}CaptureOnce`]);
}
function bs(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
    n[o - 1] = arguments[o];
  if (Array.isArray(e))
    for (const r of e)
      r(...n);
  else typeof e == "function" && e(...n);
}
function Ed(e, t) {
  if (!(be && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports(`selector(${t})`))) return null;
  try {
    return !!e && e.matches(t);
  } catch {
    return null;
  }
}
function Cd(e, t) {
  if (!be || e === 0)
    return t(), () => {
    };
  const n = window.setTimeout(t, e);
  return () => window.clearTimeout(n);
}
function Oo() {
  const e = re(), t = (n) => {
    e.value = n;
  };
  return Object.defineProperty(t, "value", {
    enumerable: !0,
    get: () => e.value,
    set: (n) => e.value = n
  }), Object.defineProperty(t, "el", {
    enumerable: !0,
    get: () => vs(e.value)
  }), t;
}
function Sd(e) {
  const t = ["checked", "disabled"];
  return Object.fromEntries(Object.entries(e).filter((n) => {
    let [o, r] = n;
    return t.includes(o) ? !!r : r !== void 0;
  }));
}
const Es = ["top", "bottom"], wd = ["start", "end", "left", "right"];
function Io(e, t) {
  let [n, o] = e.split(" ");
  return o || (o = En(Es, n) ? "start" : En(wd, n) ? "top" : "center"), {
    side: Ba(n, t),
    align: Ba(o, t)
  };
}
function Ba(e, t) {
  return e === "start" ? t ? "right" : "left" : e === "end" ? t ? "left" : "right" : e;
}
function to(e) {
  return {
    side: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.side],
    align: e.align
  };
}
function no(e) {
  return {
    side: e.side,
    align: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.align]
  };
}
function Na(e) {
  return {
    side: e.align,
    align: e.side
  };
}
function La(e) {
  return En(Es, e.side) ? "y" : "x";
}
class Pe {
  constructor(t) {
    let {
      x: n,
      y: o,
      width: r,
      height: a
    } = t;
    this.x = n, this.y = o, this.width = r, this.height = a;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
function Fa(e, t) {
  return {
    x: {
      before: Math.max(0, t.left - e.left),
      after: Math.max(0, e.right - t.right)
    },
    y: {
      before: Math.max(0, t.top - e.top),
      after: Math.max(0, e.bottom - t.bottom)
    }
  };
}
function Ad(e) {
  return Array.isArray(e) ? new Pe({
    x: e[0],
    y: e[1],
    width: 0,
    height: 0
  }) : e.getBoundingClientRect();
}
function kd(e) {
  if (e === document.documentElement)
    return visualViewport ? new Pe({
      x: visualViewport.scale > 1 ? 0 : visualViewport.offsetLeft,
      y: visualViewport.scale > 1 ? 0 : visualViewport.offsetTop,
      width: visualViewport.width * visualViewport.scale,
      height: visualViewport.height * visualViewport.scale
    }) : new Pe({
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  {
    const t = e.getBoundingClientRect();
    return new Pe({
      x: t.x,
      y: t.y,
      width: e.clientWidth,
      height: e.clientHeight
    });
  }
}
function Cs(e) {
  const t = e.getBoundingClientRect(), n = getComputedStyle(e), o = n.transform;
  if (o) {
    let r, a, i, s, l;
    if (o.startsWith("matrix3d("))
      r = o.slice(9, -1).split(/, /), a = Number(r[0]), i = Number(r[5]), s = Number(r[12]), l = Number(r[13]);
    else if (o.startsWith("matrix("))
      r = o.slice(7, -1).split(/, /), a = Number(r[0]), i = Number(r[3]), s = Number(r[4]), l = Number(r[5]);
    else
      return new Pe(t);
    const u = n.transformOrigin, c = t.x - s - (1 - a) * parseFloat(u), d = t.y - l - (1 - i) * parseFloat(u.slice(u.indexOf(" ") + 1)), v = a ? t.width / a : e.offsetWidth + 1, f = i ? t.height / i : e.offsetHeight + 1;
    return new Pe({
      x: c,
      y: d,
      width: v,
      height: f
    });
  } else
    return new Pe(t);
}
function Ss(e, t, n) {
  if (typeof e.animate > "u") return {
    finished: Promise.resolve()
  };
  let o;
  try {
    o = e.animate(t, n);
  } catch {
    return {
      finished: Promise.resolve()
    };
  }
  return typeof o.finished > "u" && (o.finished = new Promise((r) => {
    o.onfinish = () => {
      r(o);
    };
  })), o;
}
const yn = /* @__PURE__ */ new WeakMap();
function Od(e, t) {
  Object.keys(t).forEach((n) => {
    if (ys(n)) {
      const o = ps(n), r = yn.get(e);
      if (t[n] == null)
        r == null || r.forEach((a) => {
          const [i, s] = a;
          i === o && (e.removeEventListener(o, s), r.delete(a));
        });
      else if (!r || ![...r].some((a) => a[0] === o && a[1] === t[n])) {
        e.addEventListener(o, t[n]);
        const a = r || /* @__PURE__ */ new Set();
        a.add([o, t[n]]), yn.has(e) || yn.set(e, a);
      }
    } else
      t[n] == null ? e.removeAttribute(n) : e.setAttribute(n, t[n]);
  });
}
function Id(e, t) {
  Object.keys(t).forEach((n) => {
    if (ys(n)) {
      const o = ps(n), r = yn.get(e);
      r == null || r.forEach((a) => {
        const [i, s] = a;
        i === o && (e.removeEventListener(o, s), r.delete(a));
      });
    } else
      e.removeAttribute(n);
  });
}
const gt = 2.4, $a = 0.2126729, Ma = 0.7151522, Ua = 0.072175, xd = 0.55, Td = 0.58, Pd = 0.57, Vd = 0.62, ln = 0.03, ja = 1.45, Dd = 5e-4, Rd = 1.25, Bd = 1.25, za = 0.078, Ha = 12.82051282051282, un = 0.06, Wa = 1e-3;
function Ka(e, t) {
  const n = (e.r / 255) ** gt, o = (e.g / 255) ** gt, r = (e.b / 255) ** gt, a = (t.r / 255) ** gt, i = (t.g / 255) ** gt, s = (t.b / 255) ** gt;
  let l = n * $a + o * Ma + r * Ua, u = a * $a + i * Ma + s * Ua;
  if (l <= ln && (l += (ln - l) ** ja), u <= ln && (u += (ln - u) ** ja), Math.abs(u - l) < Dd) return 0;
  let c;
  if (u > l) {
    const d = (u ** xd - l ** Td) * Rd;
    c = d < Wa ? 0 : d < za ? d - d * Ha * un : d - un;
  } else {
    const d = (u ** Vd - l ** Pd) * Bd;
    c = d > -Wa ? 0 : d > -za ? d - d * Ha * un : d + un;
  }
  return c * 100;
}
function rt(e) {
  $o(`Vuetify: ${e}`);
}
function Nd(e) {
  $o(`Vuetify error: ${e}`);
}
function xo(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
}
function Ld(e) {
  return xo(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e);
}
const Ga = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/, Fd = {
  rgb: (e, t, n, o) => ({
    r: e,
    g: t,
    b: n,
    a: o
  }),
  rgba: (e, t, n, o) => ({
    r: e,
    g: t,
    b: n,
    a: o
  }),
  hsl: (e, t, n, o) => qa({
    h: e,
    s: t,
    l: n,
    a: o
  }),
  hsla: (e, t, n, o) => qa({
    h: e,
    s: t,
    l: n,
    a: o
  }),
  hsv: (e, t, n, o) => Gt({
    h: e,
    s: t,
    v: n,
    a: o
  }),
  hsva: (e, t, n, o) => Gt({
    h: e,
    s: t,
    v: n,
    a: o
  })
};
function Bt(e) {
  if (typeof e == "number")
    return (isNaN(e) || e < 0 || e > 16777215) && rt(`'${e}' is not a valid hex color`), {
      r: (e & 16711680) >> 16,
      g: (e & 65280) >> 8,
      b: e & 255
    };
  if (typeof e == "string" && Ga.test(e)) {
    const {
      groups: t
    } = e.match(Ga), {
      fn: n,
      values: o
    } = t, r = o.split(/,\s*|\s*\/\s*|\s+/).map((a, i) => a.endsWith("%") || // unitless slv are %
    i > 0 && i < 3 && ["hsl", "hsla", "hsv", "hsva"].includes(n) ? parseFloat(a) / 100 : parseFloat(a));
    return Fd[n](...r);
  } else if (typeof e == "string") {
    let t = e.startsWith("#") ? e.slice(1) : e;
    [3, 4].includes(t.length) ? t = t.split("").map((o) => o + o).join("") : [6, 8].includes(t.length) || rt(`'${e}' is not a valid hex(a) color`);
    const n = parseInt(t, 16);
    return (isNaN(n) || n < 0 || n > 4294967295) && rt(`'${e}' is not a valid hex(a) color`), $d(t);
  } else if (typeof e == "object") {
    if (eo(e, ["r", "g", "b"]))
      return e;
    if (eo(e, ["h", "s", "l"]))
      return Gt(ws(e));
    if (eo(e, ["h", "s", "v"]))
      return Gt(e);
  }
  throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
function Gt(e) {
  const {
    h: t,
    s: n,
    v: o,
    a: r
  } = e, a = (s) => {
    const l = (s + t / 60) % 6;
    return o - o * n * Math.max(Math.min(l, 4 - l, 1), 0);
  }, i = [a(5), a(3), a(1)].map((s) => Math.round(s * 255));
  return {
    r: i[0],
    g: i[1],
    b: i[2],
    a: r
  };
}
function qa(e) {
  return Gt(ws(e));
}
function ws(e) {
  const {
    h: t,
    s: n,
    l: o,
    a: r
  } = e, a = o + n * Math.min(o, 1 - o), i = a === 0 ? 0 : 2 - 2 * o / a;
  return {
    h: t,
    s: i,
    v: a,
    a: r
  };
}
function $d(e) {
  e = Md(e);
  let [t, n, o, r] = pd(e, 2).map((a) => parseInt(a, 16));
  return r = r === void 0 ? r : r / 255, {
    r: t,
    g: n,
    b: o,
    a: r
  };
}
function Md(e) {
  return e.startsWith("#") && (e = e.slice(1)), e = e.replace(/([^0-9a-f])/gi, "F"), (e.length === 3 || e.length === 4) && (e = e.split("").map((t) => t + t).join("")), e.length !== 6 && (e = Da(Da(e, 6), 8, "F")), e;
}
function Ud(e) {
  const t = Math.abs(Ka(Bt(0), Bt(e)));
  return Math.abs(Ka(Bt(16777215), Bt(e))) > Math.min(t, 50) ? "#fff" : "#000";
}
function $(e, t) {
  return (n) => Object.keys(e).reduce((o, r) => {
    const i = typeof e[r] == "object" && e[r] != null && !Array.isArray(e[r]) ? e[r] : {
      type: e[r]
    };
    return n && r in n ? o[r] = {
      ...i,
      default: n[r]
    } : o[r] = i, t && !o[r].source && (o[r].source = t), o;
  }, {});
}
const te = $({
  class: [String, Array, Object],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
function le(e, t) {
  const n = Lo();
  if (!n)
    throw new Error(`[Vuetify] ${e} must be called from inside a setup function`);
  return n;
}
function Ve() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const t = le(e).type;
  return nt((t == null ? void 0 : t.aliasName) || (t == null ? void 0 : t.name));
}
function jd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : le("injectSelf");
  const {
    provides: n
  } = t;
  if (n && e in n)
    return n[e];
}
const Cn = Symbol.for("vuetify:defaults");
function or() {
  const e = se(Cn);
  if (!e) throw new Error("[Vuetify] Could not find defaults instance");
  return e;
}
function rr(e, t) {
  const n = or(), o = j(e), r = T(() => {
    if (Ae(t == null ? void 0 : t.disabled)) return n.value;
    const i = Ae(t == null ? void 0 : t.scoped), s = Ae(t == null ? void 0 : t.reset), l = Ae(t == null ? void 0 : t.root);
    if (o.value == null && !(i || s || l)) return n.value;
    let u = _t(o.value, {
      prev: n.value
    });
    if (i) return u;
    if (s || l) {
      const c = Number(s || 1 / 0);
      for (let d = 0; d <= c && !(!u || !("prev" in u)); d++)
        u = u.prev;
      return u && typeof l == "string" && l in u && (u = _t(_t(u, {
        prev: u
      }), u[l])), u;
    }
    return u.prev ? _t(u.prev, u) : u;
  });
  return ft(Cn, r), r;
}
function zd(e, t) {
  return e.props && (typeof e.props[t] < "u" || typeof e.props[nt(t)] < "u");
}
function Hd() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : or();
  const o = le("useDefaults");
  if (t = t ?? o.type.name ?? o.type.__name, !t)
    throw new Error("[Vuetify] Could not determine component name");
  const r = T(() => {
    var l;
    return (l = n.value) == null ? void 0 : l[e._as ?? t];
  }), a = new Proxy(e, {
    get(l, u) {
      var f, m, h, y;
      const c = Reflect.get(l, u);
      if (u === "class" || u === "style")
        return [(f = r.value) == null ? void 0 : f[u], c].filter((g) => g != null);
      if (zd(o.vnode, u)) return c;
      const d = (m = r.value) == null ? void 0 : m[u];
      if (d !== void 0) return d;
      const v = (y = (h = n.value) == null ? void 0 : h.global) == null ? void 0 : y[u];
      return v !== void 0 ? v : c;
    }
  }), i = re();
  dt(() => {
    if (r.value) {
      const l = Object.entries(r.value).filter((u) => {
        let [c] = u;
        return c.startsWith(c[0].toUpperCase());
      });
      i.value = l.length ? Object.fromEntries(l) : void 0;
    } else
      i.value = void 0;
  });
  function s() {
    const l = jd(Cn, o);
    ft(Cn, T(() => i.value ? _t((l == null ? void 0 : l.value) ?? {}, i.value) : l == null ? void 0 : l.value));
  }
  return {
    props: a,
    provideSubDefaults: s
  };
}
function Bn(e) {
  if (e._setup = e._setup ?? e.setup, !e.name)
    return rt("The component is missing an explicit name, unable to generate default prop value"), e;
  if (e._setup) {
    e.props = $(e.props ?? {}, e.name)();
    const t = Object.keys(e.props).filter((n) => n !== "class" && n !== "style");
    e.filterProps = function(o) {
      return ms(o, t);
    }, e.props._as = String, e.setup = function(o, r) {
      const a = or();
      if (!a.value) return e._setup(o, r);
      const {
        props: i,
        provideSubDefaults: s
      } = Hd(o, o._as ?? e.name, a), l = e._setup(i, r);
      return s(), l;
    };
  }
  return e;
}
function Y() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
  return (t) => (e ? Bn : gl)(t);
}
function Wd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", n = arguments.length > 2 ? arguments[2] : void 0;
  return Y()({
    name: n ?? mi(gi(e.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: t
      },
      ...te()
    },
    setup(o, r) {
      let {
        slots: a
      } = r;
      return () => {
        var i;
        return On(o.tag, {
          class: [e, o.class],
          style: o.style
        }, (i = a.default) == null ? void 0 : i.call(a));
      };
    }
  });
}
function As(e) {
  if (typeof e.getRootNode != "function") {
    for (; e.parentNode; ) e = e.parentNode;
    return e !== document ? null : document;
  }
  const t = e.getRootNode();
  return t !== document && t.getRootNode({
    composed: !0
  }) !== document ? null : t;
}
const ks = "cubic-bezier(0.4, 0, 0.2, 1)";
function Kd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  for (; e; ) {
    if (t ? Gd(e) : ar(e)) return e;
    e = e.parentElement;
  }
  return document.scrollingElement;
}
function Sn(e, t) {
  const n = [];
  if (t && e && !t.contains(e)) return n;
  for (; e && (ar(e) && n.push(e), e !== t); )
    e = e.parentElement;
  return n;
}
function ar(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return t.overflowY === "scroll" || t.overflowY === "auto" && e.scrollHeight > e.clientHeight;
}
function Gd(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return ["scroll", "auto"].includes(t.overflowY);
}
function qd(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === "fixed")
      return !0;
    e = e.offsetParent;
  }
  return !1;
}
function Q(e) {
  const t = le("useRender");
  t.render = e;
}
const Qt = $({
  border: [Boolean, Number, String]
}, "border");
function en(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return {
    borderClasses: T(() => {
      const o = e.border;
      return o === !0 || o === "" ? `${t}--border` : typeof o == "string" || o === 0 ? String(o).split(" ").map((r) => `border-${r}`) : [];
    })
  };
}
const Yd = [null, "default", "comfortable", "compact"], kt = $({
  density: {
    type: String,
    default: "default",
    validator: (e) => Yd.includes(e)
  }
}, "density");
function tn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return {
    densityClasses: F(() => `${t}--density-${e.density}`)
  };
}
const Nn = $({
  elevation: {
    type: [Number, String],
    validator(e) {
      const t = parseInt(e);
      return !isNaN(t) && t >= 0 && // Material Design has a maximum elevation of 24
      // https://material.io/design/environment/elevation.html#default-elevations
      t <= 24;
    }
  }
}, "elevation");
function Ln(e) {
  return {
    elevationClasses: F(() => {
      const n = ze(e) ? e.value : e.elevation;
      return n == null ? [] : [`elevation-${n}`];
    })
  };
}
const Le = $({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  },
  tile: Boolean
}, "rounded");
function Fe(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return {
    roundedClasses: T(() => {
      const o = ze(e) ? e.value : e.rounded, r = ze(e) ? e.value : e.tile, a = [];
      if (o === !0 || o === "")
        a.push(`${t}--rounded`);
      else if (typeof o == "string" || o === 0)
        for (const i of String(o).split(" "))
          a.push(`rounded-${i}`);
      else (r || o === !1) && a.push("rounded-0");
      return a;
    })
  };
}
const De = $({
  tag: {
    type: [String, Object, Function],
    default: "div"
  }
}, "tag"), To = Symbol.for("vuetify:theme"), Ee = $({
  theme: String
}, "theme");
function ke(e) {
  le("provideTheme");
  const t = se(To, null);
  if (!t) throw new Error("Could not find Vuetify theme injection");
  const n = F(() => e.theme ?? t.name.value), o = F(() => t.themes.value[n.value]), r = F(() => t.isDisabled ? void 0 : `${t.prefix}theme--${n.value}`), a = {
    ...t,
    name: n,
    current: o,
    themeClasses: r
  };
  return ft(To, a), a;
}
function Xd() {
  le("useTheme");
  const e = se(To, null);
  if (!e) throw new Error("Could not find Vuetify theme injection");
  return e;
}
function ir(e) {
  return nr(() => {
    const t = He(e), n = [], o = {};
    if (t.background)
      if (xo(t.background)) {
        if (o.backgroundColor = t.background, !t.text && Ld(t.background)) {
          const r = Bt(t.background);
          if (r.a == null || r.a === 1) {
            const a = Ud(r);
            o.color = a, o.caretColor = a;
          }
        }
      } else
        n.push(`bg-${t.background}`);
    return t.text && (xo(t.text) ? (o.color = t.text, o.caretColor = t.text) : n.push(`text-${t.text}`)), {
      colorClasses: n,
      colorStyles: o
    };
  });
}
function Ct(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = ir(() => ({
    text: He(e)
  }));
  return {
    textColorClasses: t,
    textColorStyles: n
  };
}
function at(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = ir(() => ({
    background: He(e)
  }));
  return {
    backgroundColorClasses: t,
    backgroundColorStyles: n
  };
}
const Zd = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function Fn(e, t) {
  return O(xe, null, [e && O("span", {
    key: "overlay",
    class: K(`${t}__overlay`)
  }, null), O("span", {
    key: "underlay",
    class: K(`${t}__underlay`)
  }, null)]);
}
const nn = $({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (e) => Zd.includes(e)
  }
}, "variant");
function $n(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  const n = F(() => {
    const {
      variant: a
    } = He(e);
    return `${t}--variant-${a}`;
  }), {
    colorClasses: o,
    colorStyles: r
  } = ir(() => {
    const {
      variant: a,
      color: i
    } = He(e);
    return {
      [["elevated", "flat"].includes(a) ? "background" : "text"]: i
    };
  });
  return {
    colorClasses: o,
    colorStyles: r,
    variantClasses: n
  };
}
const Os = $({
  baseColor: String,
  divided: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...Qt(),
  ...te(),
  ...kt(),
  ...Nn(),
  ...Le(),
  ...De(),
  ...Ee(),
  ...nn()
}, "VBtnGroup"), Ya = Y()({
  name: "VBtnGroup",
  props: Os(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = ke(e), {
      densityClasses: r
    } = tn(e), {
      borderClasses: a
    } = en(e), {
      elevationClasses: i
    } = Ln(e), {
      roundedClasses: s
    } = Fe(e);
    rr({
      VBtn: {
        height: F(() => e.direction === "horizontal" ? "auto" : null),
        baseColor: F(() => e.baseColor),
        color: F(() => e.color),
        density: F(() => e.density),
        flat: !0,
        variant: F(() => e.variant)
      }
    }), Q(() => S(e.tag, {
      class: K(["v-btn-group", `v-btn-group--${e.direction}`, {
        "v-btn-group--divided": e.divided
      }, o.value, a.value, r.value, i.value, s.value, e.class]),
      style: J(e.style)
    }, n));
  }
});
function ct(e, t) {
  let n;
  function o() {
    n = Xt(), n.run(() => t.length ? t(() => {
      n == null || n.stop(), o();
    }) : t());
  }
  q(e, (r) => {
    r && !n ? o() : r || (n == null || n.stop(), n = void 0);
  }, {
    immediate: !0
  }), ye(() => {
    n == null || n.stop();
  });
}
function Ge(e, t, n) {
  let o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (d) => d, r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (d) => d;
  const a = le("useProxiedModel"), i = j(e[t] !== void 0 ? e[t] : n), s = nt(t), u = s !== t ? T(() => {
    var d, v, f, m;
    return e[t], !!(((d = a.vnode.props) != null && d.hasOwnProperty(t) || (v = a.vnode.props) != null && v.hasOwnProperty(s)) && ((f = a.vnode.props) != null && f.hasOwnProperty(`onUpdate:${t}`) || (m = a.vnode.props) != null && m.hasOwnProperty(`onUpdate:${s}`)));
  }) : T(() => {
    var d, v;
    return e[t], !!((d = a.vnode.props) != null && d.hasOwnProperty(t) && ((v = a.vnode.props) != null && v.hasOwnProperty(`onUpdate:${t}`)));
  });
  ct(() => !u.value, () => {
    q(() => e[t], (d) => {
      i.value = d;
    });
  });
  const c = T({
    get() {
      const d = e[t];
      return o(u.value ? d : i.value);
    },
    set(d) {
      const v = r(d), f = it(u.value ? e[t] : i.value);
      f === v || o(f) === d || (i.value = v, a == null || a.emit(`update:${t}`, v));
    }
  });
  return Object.defineProperty(c, "externalValue", {
    get: () => u.value ? e[t] : i.value
  }), c;
}
const Jd = $({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group"), Qd = $({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function ef(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  const o = le("useGroupItem");
  if (!o)
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  const r = In();
  ft(Symbol.for(`${t.description}:id`), r);
  const a = se(t, null);
  if (!a) {
    if (!n) return a;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t.description}`);
  }
  const i = F(() => e.value), s = T(() => !!(a.disabled.value || e.disabled));
  a.register({
    id: r,
    value: i,
    disabled: s
  }, o), St(() => {
    a.unregister(r);
  });
  const l = T(() => a.isSelected(r)), u = T(() => a.items.value[0].id === r), c = T(() => a.items.value[a.items.value.length - 1].id === r), d = T(() => l.value && [a.selectedClass.value, e.selectedClass]);
  return q(l, (v) => {
    o.emit("group:selected", {
      value: v
    });
  }, {
    flush: "sync"
  }), {
    id: r,
    isSelected: l,
    isFirst: u,
    isLast: c,
    toggle: () => a.select(r, !l.value),
    select: (v) => a.select(r, v),
    selectedClass: d,
    value: i,
    disabled: s,
    group: a
  };
}
function tf(e, t) {
  let n = !1;
  const o = st([]), r = Ge(e, "modelValue", [], (v) => v == null ? [] : Is(o, Ft(v)), (v) => {
    const f = of(o, v);
    return e.multiple ? f : f[0];
  }), a = le("useGroup");
  function i(v, f) {
    const m = v, h = Symbol.for(`${t.description}:id`), g = Rt(h, a == null ? void 0 : a.vnode).indexOf(f);
    Ae(m.value) == null && (m.value = g, m.useIndexAsValue = !0), g > -1 ? o.splice(g, 0, m) : o.push(m);
  }
  function s(v) {
    if (n) return;
    l();
    const f = o.findIndex((m) => m.id === v);
    o.splice(f, 1);
  }
  function l() {
    const v = o.find((f) => !f.disabled);
    v && e.mandatory === "force" && !r.value.length && (r.value = [v.id]);
  }
  xn(() => {
    l();
  }), St(() => {
    n = !0;
  }), hl(() => {
    for (let v = 0; v < o.length; v++)
      o[v].useIndexAsValue && (o[v].value = v);
  });
  function u(v, f) {
    const m = o.find((h) => h.id === v);
    if (!(f && (m != null && m.disabled)))
      if (e.multiple) {
        const h = r.value.slice(), y = h.findIndex((E) => E === v), g = ~y;
        if (f = f ?? !g, g && e.mandatory && h.length <= 1 || !g && e.max != null && h.length + 1 > e.max) return;
        y < 0 && f ? h.push(v) : y >= 0 && !f && h.splice(y, 1), r.value = h;
      } else {
        const h = r.value.includes(v);
        if (e.mandatory && h || !h && !f) return;
        r.value = f ?? !h ? [v] : [];
      }
  }
  function c(v) {
    if (e.multiple && rt('This method is not supported when using "multiple" prop'), r.value.length) {
      const f = r.value[0], m = o.findIndex((g) => g.id === f);
      let h = (m + v) % o.length, y = o[h];
      for (; y.disabled && h !== m; )
        h = (h + v) % o.length, y = o[h];
      if (y.disabled) return;
      r.value = [o[h].id];
    } else {
      const f = o.find((m) => !m.disabled);
      f && (r.value = [f.id]);
    }
  }
  const d = {
    register: i,
    unregister: s,
    selected: r,
    select: u,
    disabled: F(() => e.disabled),
    prev: () => c(o.length - 1),
    next: () => c(1),
    isSelected: (v) => r.value.includes(v),
    selectedClass: F(() => e.selectedClass),
    items: F(() => o),
    getItemIndex: (v) => nf(o, v)
  };
  return ft(t, d), d;
}
function nf(e, t) {
  const n = Is(e, [t]);
  return n.length ? e.findIndex((o) => o.id === n[0]) : -1;
}
function Is(e, t) {
  const n = [];
  return t.forEach((o) => {
    const r = e.find((i) => Wt(o, i.value)), a = e[o];
    (r == null ? void 0 : r.value) != null ? n.push(r.id) : a != null && a.useIndexAsValue && n.push(a.id);
  }), n;
}
function of(e, t) {
  const n = [];
  return t.forEach((o) => {
    const r = e.findIndex((a) => a.id === o);
    if (~r) {
      const a = e[r];
      n.push(a.value != null ? a.value : r);
    }
  }), n;
}
const xs = Symbol.for("vuetify:v-btn-toggle"), rf = $({
  ...Os(),
  ...Jd()
}, "VBtnToggle");
Y()({
  name: "VBtnToggle",
  props: rf(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isSelected: o,
      next: r,
      prev: a,
      select: i,
      selected: s
    } = tf(e, xs);
    return Q(() => {
      const l = Ya.filterProps(e);
      return S(Ya, ne({
        class: ["v-btn-toggle", e.class]
      }, l, {
        style: e.style
      }), {
        default: () => {
          var u;
          return [(u = n.default) == null ? void 0 : u.call(n, {
            isSelected: o,
            next: r,
            prev: a,
            select: i,
            selected: s
          })];
        }
      });
    }), {
      next: r,
      prev: a,
      select: i
    };
  }
});
const af = $({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider"), Ne = Y(!1)({
  name: "VDefaultsProvider",
  props: af(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      defaults: o,
      disabled: r,
      reset: a,
      root: i,
      scoped: s
    } = lo(e);
    return rr(o, {
      reset: a,
      root: i,
      scoped: s,
      disabled: r
    }), () => {
      var l;
      return (l = n.default) == null ? void 0 : l.call(n);
    };
  }
}), he = [String, Function, Object, Array], sf = Symbol.for("vuetify:icons"), Mn = $({
  icon: {
    type: he
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: [String, Object, Function],
    required: !0
  }
}, "icon"), Xa = Y()({
  name: "VComponentIcon",
  props: Mn(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return () => {
      const o = e.icon;
      return S(e.tag, null, {
        default: () => {
          var r;
          return [e.icon ? S(o, null, null) : (r = n.default) == null ? void 0 : r.call(n)];
        }
      });
    };
  }
}), lf = Bn({
  name: "VSvgIcon",
  inheritAttrs: !1,
  props: Mn(),
  setup(e, t) {
    let {
      attrs: n
    } = t;
    return () => S(e.tag, ne(n, {
      style: null
    }), {
      default: () => [O("svg", {
        class: "v-icon__svg",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true"
      }, [Array.isArray(e.icon) ? e.icon.map((o) => Array.isArray(o) ? O("path", {
        d: o[0],
        "fill-opacity": o[1]
      }, null) : O("path", {
        d: o
      }, null)) : O("path", {
        d: e.icon
      }, null)])]
    });
  }
});
Bn({
  name: "VLigatureIcon",
  props: Mn(),
  setup(e) {
    return () => S(e.tag, null, {
      default: () => [e.icon]
    });
  }
});
Bn({
  name: "VClassIcon",
  props: Mn(),
  setup(e) {
    return () => S(e.tag, {
      class: K(e.icon)
    }, null);
  }
});
const uf = (e) => {
  const t = se(sf);
  if (!t) throw new Error("Missing Vuetify Icons provide!");
  return {
    iconData: T(() => {
      var l;
      const o = He(e);
      if (!o) return {
        component: Xa
      };
      let r = o;
      if (typeof r == "string" && (r = r.trim(), r.startsWith("$") && (r = (l = t.aliases) == null ? void 0 : l[r.slice(1)])), r || rt(`Could not find aliased icon "${o}"`), Array.isArray(r))
        return {
          component: lf,
          icon: r
        };
      if (typeof r != "string")
        return {
          component: Xa,
          icon: r
        };
      const a = Object.keys(t.sets).find((u) => typeof r == "string" && r.startsWith(`${u}:`)), i = a ? r.slice(a.length + 1) : r;
      return {
        component: t.sets[a ?? t.defaultSet].component,
        icon: i
      };
    })
  };
}, cf = ["x-small", "small", "default", "large", "x-large"], Un = $({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function jn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return nr(() => {
    const n = e.size;
    let o, r;
    return En(cf, n) ? o = `${t}--size-${n}` : n && (r = {
      width: W(n),
      height: W(n)
    }), {
      sizeClasses: o,
      sizeStyles: r
    };
  });
}
const df = $({
  color: String,
  disabled: Boolean,
  start: Boolean,
  end: Boolean,
  icon: he,
  opacity: [String, Number],
  ...te(),
  ...Un(),
  ...De({
    tag: "i"
  }),
  ...Ee()
}, "VIcon"), je = Y()({
  name: "VIcon",
  props: df(),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const r = re(), {
      themeClasses: a
    } = Xd(), {
      iconData: i
    } = uf(() => r.value || e.icon), {
      sizeClasses: s
    } = jn(e), {
      textColorClasses: l,
      textColorStyles: u
    } = Ct(() => e.color);
    return Q(() => {
      var v, f;
      const c = (v = o.default) == null ? void 0 : v.call(o);
      c && (r.value = (f = _s(c).filter((m) => m.type === yl && m.children && typeof m.children == "string")[0]) == null ? void 0 : f.children);
      const d = !!(n.onClick || n.onClickOnce);
      return S(i.value.component, {
        tag: e.tag,
        icon: i.value.icon,
        class: K(["v-icon", "notranslate", a.value, s.value, l.value, {
          "v-icon--clickable": d,
          "v-icon--disabled": e.disabled,
          "v-icon--start": e.start,
          "v-icon--end": e.end
        }, e.class]),
        style: J([{
          "--v-icon-opacity": e.opacity
        }, s.value ? void 0 : {
          fontSize: W(e.size),
          height: W(e.size),
          width: W(e.size)
        }, u.value, e.style]),
        role: d ? "button" : void 0,
        "aria-hidden": !d,
        tabindex: d ? e.disabled ? -1 : 0 : void 0
      }, {
        default: () => [c]
      });
    }), {};
  }
});
function Ts(e, t) {
  const n = j(), o = re(!1);
  if (tr) {
    const r = new IntersectionObserver((a) => {
      o.value = !!a.find((i) => i.isIntersecting);
    }, t);
    ye(() => {
      r.disconnect();
    }), q(n, (a, i) => {
      i && (r.unobserve(i), o.value = !1), a && r.observe(a);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef: n,
    isIntersecting: o
  };
}
function ff(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const n = Oo(), o = j();
  if (be) {
    const r = new ResizeObserver((a) => {
      a.length && (t === "content" ? o.value = a[0].contentRect : o.value = a[0].target.getBoundingClientRect());
    });
    St(() => {
      r.disconnect();
    }), q(() => n.el, (a, i) => {
      i && (r.unobserve(i), o.value = void 0), a && r.observe(a);
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef: n,
    contentRect: hi(o)
  };
}
const vf = $({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...te(),
  ...Un(),
  ...De({
    tag: "div"
  }),
  ...Ee()
}, "VProgressCircular"), mf = Y()({
  name: "VProgressCircular",
  props: vf(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = 20, r = 2 * Math.PI * o, a = j(), {
      themeClasses: i
    } = ke(e), {
      sizeClasses: s,
      sizeStyles: l
    } = jn(e), {
      textColorClasses: u,
      textColorStyles: c
    } = Ct(() => e.color), {
      textColorClasses: d,
      textColorStyles: v
    } = Ct(() => e.bgColor), {
      intersectionRef: f,
      isIntersecting: m
    } = Ts(), {
      resizeRef: h,
      contentRect: y
    } = ff(), g = F(() => Kt(parseFloat(e.modelValue), 0, 100)), E = F(() => Number(e.width)), A = F(() => l.value ? Number(e.size) : y.value ? y.value.width : Math.max(E.value, 32)), b = F(() => o / (1 - E.value / A.value) * 2), P = F(() => E.value / A.value * b.value), V = F(() => W((100 - g.value) / 100 * r));
    return dt(() => {
      f.value = a.value, h.value = a.value;
    }), Q(() => S(e.tag, {
      ref: a,
      class: K(["v-progress-circular", {
        "v-progress-circular--indeterminate": !!e.indeterminate,
        "v-progress-circular--visible": m.value,
        "v-progress-circular--disable-shrink": e.indeterminate === "disable-shrink"
      }, i.value, s.value, u.value, e.class]),
      style: J([l.value, c.value, e.style]),
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": e.indeterminate ? void 0 : g.value
    }, {
      default: () => [O("svg", {
        style: {
          transform: `rotate(calc(-90deg + ${Number(e.rotate)}deg))`
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${b.value} ${b.value}`
      }, [O("circle", {
        class: K(["v-progress-circular__underlay", d.value]),
        style: J(v.value),
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: o,
        "stroke-width": P.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": 0
      }, null), O("circle", {
        class: "v-progress-circular__overlay",
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: o,
        "stroke-width": P.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": V.value
      }, null)]), n.default && O("div", {
        class: "v-progress-circular__content"
      }, [n.default({
        value: g.value
      })])]
    })), {};
  }
}), Ot = $({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function It(e) {
  return {
    dimensionStyles: T(() => {
      const n = {}, o = W(e.height), r = W(e.maxHeight), a = W(e.maxWidth), i = W(e.minHeight), s = W(e.minWidth), l = W(e.width);
      return o != null && (n.height = o), r != null && (n.maxHeight = r), a != null && (n.maxWidth = a), i != null && (n.minHeight = i), s != null && (n.minWidth = s), l != null && (n.width = l), n;
    })
  };
}
const Ps = Symbol.for("vuetify:locale");
function gf() {
  const e = se(Ps);
  if (!e) throw new Error("[Vuetify] Could not find injected locale instance");
  return e;
}
function on() {
  const e = se(Ps);
  if (!e) throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: e.isRtl,
    rtlClasses: e.rtlClasses
  };
}
const Za = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, rn = $({
  location: String
}, "location");
function zn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl: o
  } = on();
  return {
    locationStyles: T(() => {
      if (!e.location) return {};
      const {
        side: a,
        align: i
      } = Io(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, o.value);
      function s(u) {
        return n ? n(u) : 0;
      }
      const l = {};
      return a !== "center" && (t ? l[Za[a]] = `calc(100% - ${s(a)}px)` : l[a] = 0), i !== "center" ? t ? l[Za[i]] = `calc(100% - ${s(i)}px)` : l[i] = 0 : (a === "center" ? l.top = l.left = "50%" : l[{
        top: "left",
        bottom: "left",
        left: "top",
        right: "top"
      }[a]] = "50%", l.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[a]), l;
    })
  };
}
const hf = $({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: !0
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  bufferColor: String,
  bufferOpacity: [Number, String],
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  opacity: [Number, String],
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...te(),
  ...rn({
    location: "top"
  }),
  ...Le(),
  ...De(),
  ...Ee()
}, "VProgressLinear"), Vs = Y()({
  name: "VProgressLinear",
  props: hf(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    var _;
    let {
      slots: n
    } = t;
    const o = Ge(e, "modelValue"), {
      isRtl: r,
      rtlClasses: a
    } = on(), {
      themeClasses: i
    } = ke(e), {
      locationStyles: s
    } = zn(e), {
      textColorClasses: l,
      textColorStyles: u
    } = Ct(() => e.color), {
      backgroundColorClasses: c,
      backgroundColorStyles: d
    } = at(() => e.bgColor || e.color), {
      backgroundColorClasses: v,
      backgroundColorStyles: f
    } = at(() => e.bufferColor || e.bgColor || e.color), {
      backgroundColorClasses: m,
      backgroundColorStyles: h
    } = at(() => e.color), {
      roundedClasses: y
    } = Fe(e), {
      intersectionRef: g,
      isIntersecting: E
    } = Ts(), A = T(() => parseFloat(e.max)), b = T(() => parseFloat(e.height)), P = T(() => Kt(parseFloat(e.bufferValue) / A.value * 100, 0, 100)), V = T(() => Kt(parseFloat(o.value) / A.value * 100, 0, 100)), C = T(() => r.value !== e.reverse), k = T(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), N = be && ((_ = window.matchMedia) == null ? void 0 : _.call(window, "(forced-colors: active)").matches);
    function I(w) {
      if (!g.value) return;
      const {
        left: x,
        right: B,
        width: L
      } = g.value.getBoundingClientRect(), M = C.value ? L - w.clientX + (B - L) : w.clientX - x;
      o.value = Math.round(M / L * A.value);
    }
    return Q(() => S(e.tag, {
      ref: g,
      class: K(["v-progress-linear", {
        "v-progress-linear--absolute": e.absolute,
        "v-progress-linear--active": e.active && E.value,
        "v-progress-linear--reverse": C.value,
        "v-progress-linear--rounded": e.rounded,
        "v-progress-linear--rounded-bar": e.roundedBar,
        "v-progress-linear--striped": e.striped
      }, y.value, i.value, a.value, e.class]),
      style: J([{
        bottom: e.location === "bottom" ? 0 : void 0,
        top: e.location === "top" ? 0 : void 0,
        height: e.active ? W(b.value) : 0,
        "--v-progress-linear-height": W(b.value),
        ...e.absolute ? s.value : {}
      }, e.style]),
      role: "progressbar",
      "aria-hidden": e.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": e.max,
      "aria-valuenow": e.indeterminate ? void 0 : Math.min(parseFloat(o.value), A.value),
      onClick: e.clickable && I
    }, {
      default: () => [e.stream && O("div", {
        key: "stream",
        class: K(["v-progress-linear__stream", l.value]),
        style: {
          ...u.value,
          [C.value ? "left" : "right"]: W(-b.value),
          borderTop: `${W(b.value / 2)} dotted`,
          opacity: parseFloat(e.bufferOpacity),
          top: `calc(50% - ${W(b.value / 4)})`,
          width: W(100 - P.value, "%"),
          "--v-progress-linear-stream-to": W(b.value * (C.value ? 1 : -1))
        }
      }, null), O("div", {
        class: K(["v-progress-linear__background", N ? void 0 : c.value]),
        style: J([d.value, {
          opacity: parseFloat(e.bgOpacity),
          width: e.stream ? 0 : void 0
        }])
      }, null), O("div", {
        class: K(["v-progress-linear__buffer", N ? void 0 : v.value]),
        style: J([f.value, {
          opacity: parseFloat(e.bufferOpacity),
          width: W(P.value, "%")
        }])
      }, null), S(Zt, {
        name: k.value
      }, {
        default: () => [e.indeterminate ? O("div", {
          class: "v-progress-linear__indeterminate"
        }, [["long", "short"].map((w) => O("div", {
          key: w,
          class: K(["v-progress-linear__indeterminate", w, N ? void 0 : m.value]),
          style: J(h.value)
        }, null))]) : O("div", {
          class: K(["v-progress-linear__determinate", N ? void 0 : m.value]),
          style: J([h.value, {
            width: W(V.value, "%")
          }])
        }, null)]
      }), n.default && O("div", {
        class: "v-progress-linear__content"
      }, [n.default({
        value: V.value,
        buffer: P.value
      })])]
    })), {};
  }
}), sr = $({
  loading: [Boolean, String]
}, "loader");
function lr(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return {
    loaderClasses: F(() => ({
      [`${t}--loading`]: e.loading
    }))
  };
}
function Ds(e, t) {
  var o;
  let {
    slots: n
  } = t;
  return O("div", {
    class: K(`${e.name}__loader`)
  }, [((o = n.default) == null ? void 0 : o.call(n, {
    color: e.color,
    isActive: e.active
  })) || S(Vs, {
    absolute: e.absolute,
    active: e.active,
    color: e.color,
    height: "2",
    indeterminate: !0
  }, null)]);
}
const yf = ["static", "relative", "fixed", "absolute", "sticky"], Hn = $({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (e) => yf.includes(e)
    )
  }
}, "position");
function Wn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  return {
    positionClasses: F(() => e.position ? `${t}--${e.position}` : void 0)
  };
}
function _f() {
  const e = le("useRoute");
  return T(() => {
    var t;
    return (t = e == null ? void 0 : e.proxy) == null ? void 0 : t.$route;
  });
}
function pf() {
  var e, t;
  return (t = (e = le("useRouter")) == null ? void 0 : e.proxy) == null ? void 0 : t.$router;
}
function Rs(e, t) {
  var c, d;
  const n = _l("RouterLink"), o = F(() => !!(e.href || e.to)), r = T(() => (o == null ? void 0 : o.value) || Ra(t, "click") || Ra(e, "click"));
  if (typeof n == "string" || !("useLink" in n)) {
    const v = F(() => e.href);
    return {
      isLink: o,
      isClickable: r,
      href: v,
      linkProps: st({
        href: v
      })
    };
  }
  const a = n.useLink({
    to: F(() => e.to || ""),
    replace: F(() => e.replace)
  }), i = T(() => e.to ? a : void 0), s = _f(), l = T(() => {
    var v, f, m;
    return i.value ? e.exact ? s.value ? ((m = i.value.isExactActive) == null ? void 0 : m.value) && Wt(i.value.route.value.query, s.value.query) : ((f = i.value.isExactActive) == null ? void 0 : f.value) ?? !1 : ((v = i.value.isActive) == null ? void 0 : v.value) ?? !1 : !1;
  }), u = T(() => {
    var v;
    return e.to ? (v = i.value) == null ? void 0 : v.route.value.href : e.href;
  });
  return {
    isLink: o,
    isClickable: r,
    isActive: l,
    route: (c = i.value) == null ? void 0 : c.route,
    navigate: (d = i.value) == null ? void 0 : d.navigate,
    href: u,
    linkProps: st({
      href: u,
      "aria-current": F(() => l.value ? "page" : void 0)
    })
  };
}
const Bs = $({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let oo = !1;
function bf(e, t) {
  let n = !1, o, r;
  be && (e != null && e.beforeEach) && (ge(() => {
    window.addEventListener("popstate", a), o = e.beforeEach((i, s, l) => {
      oo ? n ? t(l) : l() : setTimeout(() => n ? t(l) : l()), oo = !0;
    }), r = e == null ? void 0 : e.afterEach(() => {
      oo = !1;
    });
  }), ye(() => {
    window.removeEventListener("popstate", a), o == null || o(), r == null || r();
  }));
  function a(i) {
    var s;
    (s = i.state) != null && s.replaced || (n = !0, setTimeout(() => n = !1));
  }
}
function Ef(e, t) {
  q(() => {
    var n;
    return (n = e.isActive) == null ? void 0 : n.value;
  }, (n) => {
    e.isLink.value && n != null && t && ge(() => {
      t(n);
    });
  }, {
    immediate: !0
  });
}
const Po = Symbol("rippleStop"), Cf = 80;
function Ja(e, t) {
  e.style.transform = t, e.style.webkitTransform = t;
}
function Vo(e) {
  return e.constructor.name === "TouchEvent";
}
function Ns(e) {
  return e.constructor.name === "KeyboardEvent";
}
const Sf = function(e, t) {
  var d;
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = 0, r = 0;
  if (!Ns(e)) {
    const v = t.getBoundingClientRect(), f = Vo(e) ? e.touches[e.touches.length - 1] : e;
    o = f.clientX - v.left, r = f.clientY - v.top;
  }
  let a = 0, i = 0.3;
  (d = t._ripple) != null && d.circle ? (i = 0.15, a = t.clientWidth / 2, a = n.center ? a : a + Math.sqrt((o - a) ** 2 + (r - a) ** 2) / 4) : a = Math.sqrt(t.clientWidth ** 2 + t.clientHeight ** 2) / 2;
  const s = `${(t.clientWidth - a * 2) / 2}px`, l = `${(t.clientHeight - a * 2) / 2}px`, u = n.center ? s : `${o - a}px`, c = n.center ? l : `${r - a}px`;
  return {
    radius: a,
    scale: i,
    x: u,
    y: c,
    centerX: s,
    centerY: l
  };
}, wn = {
  /* eslint-disable max-statements */
  show(e, t) {
    var f;
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!((f = t == null ? void 0 : t._ripple) != null && f.enabled))
      return;
    const o = document.createElement("span"), r = document.createElement("span");
    o.appendChild(r), o.className = "v-ripple__container", n.class && (o.className += ` ${n.class}`);
    const {
      radius: a,
      scale: i,
      x: s,
      y: l,
      centerX: u,
      centerY: c
    } = Sf(e, t, n), d = `${a * 2}px`;
    r.className = "v-ripple__animation", r.style.width = d, r.style.height = d, t.appendChild(o);
    const v = window.getComputedStyle(t);
    v && v.position === "static" && (t.style.position = "relative", t.dataset.previousPosition = "static"), r.classList.add("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--visible"), Ja(r, `translate(${s}, ${l}) scale3d(${i},${i},${i})`), r.dataset.activated = String(performance.now()), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        r.classList.remove("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--in"), Ja(r, `translate(${u}, ${c}) scale3d(1,1,1)`);
      });
    });
  },
  hide(e) {
    var a;
    if (!((a = e == null ? void 0 : e._ripple) != null && a.enabled)) return;
    const t = e.getElementsByClassName("v-ripple__animation");
    if (t.length === 0) return;
    const n = t[t.length - 1];
    if (n.dataset.isHiding) return;
    n.dataset.isHiding = "true";
    const o = performance.now() - Number(n.dataset.activated), r = Math.max(250 - o, 0);
    setTimeout(() => {
      n.classList.remove("v-ripple__animation--in"), n.classList.add("v-ripple__animation--out"), setTimeout(() => {
        var s;
        e.getElementsByClassName("v-ripple__animation").length === 1 && e.dataset.previousPosition && (e.style.position = e.dataset.previousPosition, delete e.dataset.previousPosition), ((s = n.parentNode) == null ? void 0 : s.parentNode) === e && e.removeChild(n.parentNode);
      }, 300);
    }, r);
  }
};
function Ls(e) {
  return typeof e > "u" || !!e;
}
function qt(e) {
  const t = {}, n = e.currentTarget;
  if (!(!(n != null && n._ripple) || n._ripple.touched || e[Po])) {
    if (e[Po] = !0, Vo(e))
      n._ripple.touched = !0, n._ripple.isTouch = !0;
    else if (n._ripple.isTouch) return;
    if (t.center = n._ripple.centered || Ns(e), n._ripple.class && (t.class = n._ripple.class), Vo(e)) {
      if (n._ripple.showTimerCommit) return;
      n._ripple.showTimerCommit = () => {
        wn.show(e, n, t);
      }, n._ripple.showTimer = window.setTimeout(() => {
        var o;
        (o = n == null ? void 0 : n._ripple) != null && o.showTimerCommit && (n._ripple.showTimerCommit(), n._ripple.showTimerCommit = null);
      }, Cf);
    } else
      wn.show(e, n, t);
  }
}
function Qa(e) {
  e[Po] = !0;
}
function pe(e) {
  const t = e.currentTarget;
  if (t != null && t._ripple) {
    if (window.clearTimeout(t._ripple.showTimer), e.type === "touchend" && t._ripple.showTimerCommit) {
      t._ripple.showTimerCommit(), t._ripple.showTimerCommit = null, t._ripple.showTimer = window.setTimeout(() => {
        pe(e);
      });
      return;
    }
    window.setTimeout(() => {
      t._ripple && (t._ripple.touched = !1);
    }), wn.hide(t);
  }
}
function Fs(e) {
  const t = e.currentTarget;
  t != null && t._ripple && (t._ripple.showTimerCommit && (t._ripple.showTimerCommit = null), window.clearTimeout(t._ripple.showTimer));
}
let Yt = !1;
function ei(e, t) {
  !Yt && t.includes(e.key) && (Yt = !0, qt(e));
}
function $s(e) {
  Yt = !1, pe(e);
}
function Ms(e) {
  Yt && (Yt = !1, pe(e));
}
function Us(e, t, n) {
  const {
    value: o,
    modifiers: r
  } = t, a = Ls(o);
  a || wn.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = a, e._ripple.centered = r.center, e._ripple.circle = r.circle;
  const i = ko(o) ? o : {};
  i.class && (e._ripple.class = i.class);
  const s = i.keys ?? ["Enter", "Space"];
  if (e._ripple.keyDownHandler = (l) => ei(l, s), a && !n) {
    if (r.stop) {
      e.addEventListener("touchstart", Qa, {
        passive: !0
      }), e.addEventListener("mousedown", Qa);
      return;
    }
    e.addEventListener("touchstart", qt, {
      passive: !0
    }), e.addEventListener("touchend", pe, {
      passive: !0
    }), e.addEventListener("touchmove", Fs, {
      passive: !0
    }), e.addEventListener("touchcancel", pe), e.addEventListener("mousedown", qt), e.addEventListener("mouseup", pe), e.addEventListener("mouseleave", pe), e.addEventListener("keydown", (l) => ei(l, s)), e.addEventListener("keyup", $s), e.addEventListener("blur", Ms), e.addEventListener("dragstart", pe, {
      passive: !0
    });
  } else !a && n && js(e);
}
function js(e) {
  var t;
  e.removeEventListener("mousedown", qt), e.removeEventListener("touchstart", qt), e.removeEventListener("touchend", pe), e.removeEventListener("touchmove", Fs), e.removeEventListener("touchcancel", pe), e.removeEventListener("mouseup", pe), e.removeEventListener("mouseleave", pe), (t = e._ripple) != null && t.keyDownHandler && e.removeEventListener("keydown", e._ripple.keyDownHandler), e.removeEventListener("keyup", $s), e.removeEventListener("dragstart", pe), e.removeEventListener("blur", Ms);
}
function wf(e, t) {
  Us(e, t, !1);
}
function Af(e) {
  js(e), delete e._ripple;
}
function kf(e, t) {
  if (t.value === t.oldValue)
    return;
  const n = Ls(t.oldValue);
  Us(e, t, n);
}
const Do = {
  mounted: wf,
  unmounted: Af,
  updated: kf
}, Of = $({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: xs
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: he,
  appendIcon: he,
  block: Boolean,
  readonly: Boolean,
  slim: Boolean,
  stacked: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...Qt(),
  ...te(),
  ...kt(),
  ...Ot(),
  ...Nn(),
  ...Qd(),
  ...sr(),
  ...rn(),
  ...Hn(),
  ...Le(),
  ...Bs(),
  ...Un(),
  ...De({
    tag: "button"
  }),
  ...Ee(),
  ...nn({
    variant: "elevated"
  })
}, "VBtn"), $t = Y()({
  name: "VBtn",
  props: Of(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const {
      themeClasses: r
    } = ke(e), {
      borderClasses: a
    } = en(e), {
      densityClasses: i
    } = tn(e), {
      dimensionStyles: s
    } = It(e), {
      elevationClasses: l
    } = Ln(e), {
      loaderClasses: u
    } = lr(e), {
      locationStyles: c
    } = zn(e), {
      positionClasses: d
    } = Wn(e), {
      roundedClasses: v
    } = Fe(e), {
      sizeClasses: f,
      sizeStyles: m
    } = jn(e), h = ef(e, e.symbol, !1), y = Rs(e, n), g = T(() => {
      var _;
      return e.active !== void 0 ? e.active : y.isLink.value ? (_ = y.isActive) == null ? void 0 : _.value : h == null ? void 0 : h.isSelected.value;
    }), E = F(() => g.value ? e.activeColor ?? e.color : e.color), A = T(() => {
      var w, x;
      return {
        color: (h == null ? void 0 : h.isSelected.value) && (!y.isLink.value || ((w = y.isActive) == null ? void 0 : w.value)) || !h || ((x = y.isActive) == null ? void 0 : x.value) ? E.value ?? e.baseColor : e.baseColor,
        variant: e.variant
      };
    }), {
      colorClasses: b,
      colorStyles: P,
      variantClasses: V
    } = $n(A), C = T(() => (h == null ? void 0 : h.disabled.value) || e.disabled), k = F(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), N = T(() => {
      if (!(e.value === void 0 || typeof e.value == "symbol"))
        return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function I(_) {
      var w;
      C.value || y.isLink.value && (_.metaKey || _.ctrlKey || _.shiftKey || _.button !== 0 || n.target === "_blank") || ((w = y.navigate) == null || w.call(y, _), h == null || h.toggle());
    }
    return Ef(y, h == null ? void 0 : h.select), Q(() => {
      const _ = y.isLink.value ? "a" : e.tag, w = !!(e.prependIcon || o.prepend), x = !!(e.appendIcon || o.append), B = !!(e.icon && e.icon !== !0);
      return We(S(_, ne({
        type: _ === "a" ? void 0 : "button",
        class: ["v-btn", h == null ? void 0 : h.selectedClass.value, {
          "v-btn--active": g.value,
          "v-btn--block": e.block,
          "v-btn--disabled": C.value,
          "v-btn--elevated": k.value,
          "v-btn--flat": e.flat,
          "v-btn--icon": !!e.icon,
          "v-btn--loading": e.loading,
          "v-btn--readonly": e.readonly,
          "v-btn--slim": e.slim,
          "v-btn--stacked": e.stacked
        }, r.value, a.value, b.value, i.value, l.value, u.value, d.value, v.value, f.value, V.value, e.class],
        style: [P.value, s.value, c.value, m.value, e.style],
        "aria-busy": e.loading ? !0 : void 0,
        disabled: C.value || void 0,
        tabindex: e.loading || e.readonly ? -1 : void 0,
        onClick: I,
        value: N.value
      }, y.linkProps), {
        default: () => {
          var L;
          return [Fn(!0, "v-btn"), !e.icon && w && O("span", {
            key: "prepend",
            class: "v-btn__prepend"
          }, [o.prepend ? S(Ne, {
            key: "prepend-defaults",
            disabled: !e.prependIcon,
            defaults: {
              VIcon: {
                icon: e.prependIcon
              }
            }
          }, o.prepend) : S(je, {
            key: "prepend-icon",
            icon: e.prependIcon
          }, null)]), O("span", {
            class: "v-btn__content",
            "data-no-activator": ""
          }, [!o.default && B ? S(je, {
            key: "content-icon",
            icon: e.icon
          }, null) : S(Ne, {
            key: "content-defaults",
            disabled: !B,
            defaults: {
              VIcon: {
                icon: e.icon
              }
            }
          }, {
            default: () => {
              var M;
              return [((M = o.default) == null ? void 0 : M.call(o)) ?? ue(e.text)];
            }
          })]), !e.icon && x && O("span", {
            key: "append",
            class: "v-btn__append"
          }, [o.append ? S(Ne, {
            key: "append-defaults",
            disabled: !e.appendIcon,
            defaults: {
              VIcon: {
                icon: e.appendIcon
              }
            }
          }, o.append) : S(je, {
            key: "append-icon",
            icon: e.appendIcon
          }, null)]), !!e.loading && O("span", {
            key: "loader",
            class: "v-btn__loader"
          }, [((L = o.loader) == null ? void 0 : L.call(o)) ?? S(mf, {
            color: typeof e.loading == "boolean" ? void 0 : e.loading,
            indeterminate: !0,
            width: "2"
          }, null)])];
        }
      }), [[Do, !C.value && e.ripple, "", {
        center: !!e.icon
      }]]);
    }), {
      group: h
    };
  }
});
function ro(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}
function If(e, t) {
  return {
    x: e.x - t.x,
    y: e.y - t.y
  };
}
function ti(e, t) {
  if (e.side === "top" || e.side === "bottom") {
    const {
      side: n,
      align: o
    } = e, r = o === "left" ? 0 : o === "center" ? t.width / 2 : o === "right" ? t.width : o, a = n === "top" ? 0 : n === "bottom" ? t.height : n;
    return ro({
      x: r,
      y: a
    }, t);
  } else if (e.side === "left" || e.side === "right") {
    const {
      side: n,
      align: o
    } = e, r = n === "left" ? 0 : n === "right" ? t.width : n, a = o === "top" ? 0 : o === "center" ? t.height / 2 : o === "bottom" ? t.height : o;
    return ro({
      x: r,
      y: a
    }, t);
  }
  return ro({
    x: t.width / 2,
    y: t.height / 2
  }, t);
}
const zs = {
  static: Pf,
  // specific viewport position, usually centered
  connected: Df
  // connected to a certain element
}, xf = $({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (e) => typeof e == "function" || e in zs
  },
  location: {
    type: String,
    default: "bottom"
  },
  origin: {
    type: String,
    default: "auto"
  },
  offset: [Number, String, Array]
}, "VOverlay-location-strategies");
function Tf(e, t) {
  const n = j({}), o = j();
  be && ct(() => !!(t.isActive.value && e.locationStrategy), (s) => {
    var l, u;
    q(() => e.locationStrategy, s), ye(() => {
      window.removeEventListener("resize", r), visualViewport == null || visualViewport.removeEventListener("resize", a), visualViewport == null || visualViewport.removeEventListener("scroll", i), o.value = void 0;
    }), window.addEventListener("resize", r, {
      passive: !0
    }), visualViewport == null || visualViewport.addEventListener("resize", a, {
      passive: !0
    }), visualViewport == null || visualViewport.addEventListener("scroll", i, {
      passive: !0
    }), typeof e.locationStrategy == "function" ? o.value = (l = e.locationStrategy(t, e, n)) == null ? void 0 : l.updateLocation : o.value = (u = zs[e.locationStrategy](t, e, n)) == null ? void 0 : u.updateLocation;
  });
  function r(s) {
    var l;
    (l = o.value) == null || l.call(o, s);
  }
  function a(s) {
    var l;
    (l = o.value) == null || l.call(o, s);
  }
  function i(s) {
    var l;
    (l = o.value) == null || l.call(o, s);
  }
  return {
    contentStyles: n,
    updateLocation: o
  };
}
function Pf() {
}
function Vf(e, t) {
  const n = Cs(e);
  return t ? n.x += parseFloat(e.style.right || 0) : n.x -= parseFloat(e.style.left || 0), n.y -= parseFloat(e.style.top || 0), n;
}
function Df(e, t, n) {
  (Array.isArray(e.target.value) || qd(e.target.value)) && Object.assign(n.value, {
    position: "fixed",
    top: 0,
    [e.isRtl.value ? "right" : "left"]: 0
  });
  const {
    preferredAnchor: r,
    preferredOrigin: a
  } = nr(() => {
    const g = Io(t.location, e.isRtl.value), E = t.origin === "overlap" ? g : t.origin === "auto" ? to(g) : Io(t.origin, e.isRtl.value);
    return g.side === E.side && g.align === no(E).align ? {
      preferredAnchor: Na(g),
      preferredOrigin: Na(E)
    } : {
      preferredAnchor: g,
      preferredOrigin: E
    };
  }), [i, s, l, u] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((g) => T(() => {
    const E = parseFloat(t[g]);
    return isNaN(E) ? 1 / 0 : E;
  })), c = T(() => {
    if (Array.isArray(t.offset))
      return t.offset;
    if (typeof t.offset == "string") {
      const g = t.offset.split(" ").map(parseFloat);
      return g.length < 2 && g.push(0), g;
    }
    return typeof t.offset == "number" ? [t.offset, 0] : [0, 0];
  });
  let d = !1, v = -1;
  const f = new bd(4), m = new ResizeObserver(() => {
    if (!d) return;
    if (requestAnimationFrame((E) => {
      E !== v && f.clear(), requestAnimationFrame((A) => {
        v = A;
      });
    }), f.isFull) {
      const E = f.values();
      if (Wt(E.at(-1), E.at(-3)) && !Wt(E.at(-1), E.at(-2)))
        return;
    }
    const g = y();
    g && f.push(g.flipped);
  });
  q([e.target, e.contentEl], (g, E) => {
    let [A, b] = g, [P, V] = E;
    P && !Array.isArray(P) && m.unobserve(P), A && !Array.isArray(A) && m.observe(A), V && m.unobserve(V), b && m.observe(b);
  }, {
    immediate: !0
  }), ye(() => {
    m.disconnect();
  });
  let h = new Pe({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  function y() {
    if (d = !1, requestAnimationFrame(() => d = !0), !e.target.value || !e.contentEl.value) return;
    (Array.isArray(e.target.value) || e.target.value.offsetParent || e.target.value.getClientRects().length) && (h = Ad(e.target.value));
    const g = Vf(e.contentEl.value, e.isRtl.value), E = Sn(e.contentEl.value), A = 12;
    E.length || (E.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (g.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), g.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
    const b = E.reduce((x, B) => {
      const L = kd(B);
      return x ? new Pe({
        x: Math.max(x.left, L.left),
        y: Math.max(x.top, L.top),
        width: Math.min(x.right, L.right) - Math.max(x.left, L.left),
        height: Math.min(x.bottom, L.bottom) - Math.max(x.top, L.top)
      }) : L;
    }, void 0);
    b.x += A, b.y += A, b.width -= A * 2, b.height -= A * 2;
    let P = {
      anchor: r.value,
      origin: a.value
    };
    function V(x) {
      const B = new Pe(g), L = ti(x.anchor, h), M = ti(x.origin, B);
      let {
        x: R,
        y: H
      } = If(L, M);
      switch (x.anchor.side) {
        case "top":
          H -= c.value[0];
          break;
        case "bottom":
          H += c.value[0];
          break;
        case "left":
          R -= c.value[0];
          break;
        case "right":
          R += c.value[0];
          break;
      }
      switch (x.anchor.align) {
        case "top":
          H -= c.value[1];
          break;
        case "bottom":
          H += c.value[1];
          break;
        case "left":
          R -= c.value[1];
          break;
        case "right":
          R += c.value[1];
          break;
      }
      return B.x += R, B.y += H, B.width = Math.min(B.width, l.value), B.height = Math.min(B.height, u.value), {
        overflows: Fa(B, b),
        x: R,
        y: H
      };
    }
    let C = 0, k = 0;
    const N = {
      x: 0,
      y: 0
    }, I = {
      x: !1,
      y: !1
    };
    let _ = -1;
    for (; ; ) {
      if (_++ > 10) {
        Nd("Infinite loop detected in connectedLocationStrategy");
        break;
      }
      const {
        x,
        y: B,
        overflows: L
      } = V(P);
      C += x, k += B, g.x += x, g.y += B;
      {
        const M = La(P.anchor), R = L.x.before || L.x.after, H = L.y.before || L.y.after;
        let U = !1;
        if (["x", "y"].forEach((z) => {
          if (z === "x" && R && !I.x || z === "y" && H && !I.y) {
            const X = {
              anchor: {
                ...P.anchor
              },
              origin: {
                ...P.origin
              }
            }, ee = z === "x" ? M === "y" ? no : to : M === "y" ? to : no;
            X.anchor = ee(X.anchor), X.origin = ee(X.origin);
            const {
              overflows: oe
            } = V(X);
            (oe[z].before <= L[z].before && oe[z].after <= L[z].after || oe[z].before + oe[z].after < (L[z].before + L[z].after) / 2) && (P = X, U = I[z] = !0);
          }
        }), U) continue;
      }
      L.x.before && (C += L.x.before, g.x += L.x.before), L.x.after && (C -= L.x.after, g.x -= L.x.after), L.y.before && (k += L.y.before, g.y += L.y.before), L.y.after && (k -= L.y.after, g.y -= L.y.after);
      {
        const M = Fa(g, b);
        N.x = b.width - M.x.before - M.x.after, N.y = b.height - M.y.before - M.y.after, C += M.x.before, g.x += M.x.before, k += M.y.before, g.y += M.y.before;
      }
      break;
    }
    const w = La(P.anchor);
    return Object.assign(n.value, {
      "--v-overlay-anchor-origin": `${P.anchor.side} ${P.anchor.align}`,
      transformOrigin: `${P.origin.side} ${P.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: W(ao(k)),
      left: e.isRtl.value ? void 0 : W(ao(C)),
      right: e.isRtl.value ? W(ao(-C)) : void 0,
      minWidth: W(w === "y" ? Math.min(i.value, h.width) : i.value),
      maxWidth: W(ni(Kt(N.x, i.value === 1 / 0 ? 0 : i.value, l.value))),
      maxHeight: W(ni(Kt(N.y, s.value === 1 / 0 ? 0 : s.value, u.value)))
    }), {
      available: N,
      contentBox: g,
      flipped: I
    };
  }
  return q(() => [r.value, a.value, t.offset, t.minWidth, t.minHeight, t.maxWidth, t.maxHeight], () => y()), ge(() => {
    const g = y();
    if (!g) return;
    const {
      available: E,
      contentBox: A
    } = g;
    A.height > E.y && requestAnimationFrame(() => {
      y(), requestAnimationFrame(() => {
        y();
      });
    });
  }), {
    updateLocation: y
  };
}
function ao(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio;
}
function ni(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
}
let Ro = !0;
const An = [];
function Rf(e) {
  !Ro || An.length ? (An.push(e), Bo()) : (Ro = !1, e(), Bo());
}
let oi = -1;
function Bo() {
  cancelAnimationFrame(oi), oi = requestAnimationFrame(() => {
    const e = An.shift();
    e && e(), An.length ? Bo() : Ro = !0;
  });
}
const _n = {
  none: null,
  close: Lf,
  block: Ff,
  reposition: $f
}, Bf = $({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (e) => typeof e == "function" || e in _n
  }
}, "VOverlay-scroll-strategies");
function Nf(e, t) {
  if (!be) return;
  let n;
  dt(async () => {
    n == null || n.stop(), t.isActive.value && e.scrollStrategy && (n = Xt(), await new Promise((o) => setTimeout(o)), n.active && n.run(() => {
      var o;
      typeof e.scrollStrategy == "function" ? e.scrollStrategy(t, e, n) : (o = _n[e.scrollStrategy]) == null || o.call(_n, t, e, n);
    }));
  }), ye(() => {
    n == null || n.stop();
  });
}
function Lf(e) {
  function t(n) {
    e.isActive.value = !1;
  }
  Hs(e.targetEl.value ?? e.contentEl.value, t);
}
function Ff(e, t) {
  var i;
  const n = (i = e.root.value) == null ? void 0 : i.offsetParent, o = [.../* @__PURE__ */ new Set([...Sn(e.targetEl.value, t.contained ? n : void 0), ...Sn(e.contentEl.value, t.contained ? n : void 0)])].filter((s) => !s.classList.contains("v-overlay-scroll-blocked")), r = window.innerWidth - document.documentElement.offsetWidth, a = ((s) => ar(s) && s)(n || document.documentElement);
  a && e.root.value.classList.add("v-overlay--scroll-blocked"), o.forEach((s, l) => {
    s.style.setProperty("--v-body-scroll-x", W(-s.scrollLeft)), s.style.setProperty("--v-body-scroll-y", W(-s.scrollTop)), s !== document.documentElement && s.style.setProperty("--v-scrollbar-offset", W(r)), s.classList.add("v-overlay-scroll-blocked");
  }), ye(() => {
    o.forEach((s, l) => {
      const u = parseFloat(s.style.getPropertyValue("--v-body-scroll-x")), c = parseFloat(s.style.getPropertyValue("--v-body-scroll-y")), d = s.style.scrollBehavior;
      s.style.scrollBehavior = "auto", s.style.removeProperty("--v-body-scroll-x"), s.style.removeProperty("--v-body-scroll-y"), s.style.removeProperty("--v-scrollbar-offset"), s.classList.remove("v-overlay-scroll-blocked"), s.scrollLeft = -u, s.scrollTop = -c, s.style.scrollBehavior = d;
    }), a && e.root.value.classList.remove("v-overlay--scroll-blocked");
  });
}
function $f(e, t, n) {
  let o = !1, r = -1, a = -1;
  function i(s) {
    Rf(() => {
      var c, d;
      const l = performance.now();
      (d = (c = e.updateLocation).value) == null || d.call(c, s), o = (performance.now() - l) / (1e3 / 60) > 2;
    });
  }
  a = (typeof requestIdleCallback > "u" ? (s) => s() : requestIdleCallback)(() => {
    n.run(() => {
      Hs(e.targetEl.value ?? e.contentEl.value, (s) => {
        o ? (cancelAnimationFrame(r), r = requestAnimationFrame(() => {
          r = requestAnimationFrame(() => {
            i(s);
          });
        })) : i(s);
      });
    });
  }), ye(() => {
    typeof cancelIdleCallback < "u" && cancelIdleCallback(a), cancelAnimationFrame(r);
  });
}
function Hs(e, t) {
  const n = [document, ...Sn(e)];
  n.forEach((o) => {
    o.addEventListener("scroll", t, {
      passive: !0
    });
  }), ye(() => {
    n.forEach((o) => {
      o.removeEventListener("scroll", t);
    });
  });
}
const Mf = Symbol.for("vuetify:v-menu"), Uf = $({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function jf(e, t) {
  let n = () => {
  };
  function o(i) {
    n == null || n();
    const s = Number(i ? e.openDelay : e.closeDelay);
    return new Promise((l) => {
      n = Cd(s, () => {
        t == null || t(i), l(i);
      });
    });
  }
  function r() {
    return o(!0);
  }
  function a() {
    return o(!1);
  }
  return {
    clearDelay: n,
    runOpenDelay: r,
    runCloseDelay: a
  };
}
const zf = $({
  target: [String, Object],
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: void 0
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: void 0
  },
  closeOnContentClick: Boolean,
  ...Uf()
}, "VOverlay-activator");
function Hf(e, t) {
  let {
    isActive: n,
    isTop: o,
    contentEl: r
  } = t;
  const a = le("useActivator"), i = j();
  let s = !1, l = !1, u = !0;
  const c = T(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), d = T(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !c.value), {
    runOpenDelay: v,
    runCloseDelay: f
  } = jf(e, (k) => {
    k === (e.openOnHover && s || c.value && l) && !(e.openOnHover && n.value && !o.value) && (n.value !== k && (u = !0), n.value = k);
  }), m = j(), h = {
    onClick: (k) => {
      k.stopPropagation(), i.value = k.currentTarget || k.target, n.value || (m.value = [k.clientX, k.clientY]), n.value = !n.value;
    },
    onMouseenter: (k) => {
      var N;
      (N = k.sourceCapabilities) != null && N.firesTouchEvents || (s = !0, i.value = k.currentTarget || k.target, v());
    },
    onMouseleave: (k) => {
      s = !1, f();
    },
    onFocus: (k) => {
      Ed(k.target, ":focus-visible") !== !1 && (l = !0, k.stopPropagation(), i.value = k.currentTarget || k.target, v());
    },
    onBlur: (k) => {
      l = !1, k.stopPropagation(), f();
    }
  }, y = T(() => {
    const k = {};
    return d.value && (k.onClick = h.onClick), e.openOnHover && (k.onMouseenter = h.onMouseenter, k.onMouseleave = h.onMouseleave), c.value && (k.onFocus = h.onFocus, k.onBlur = h.onBlur), k;
  }), g = T(() => {
    const k = {};
    if (e.openOnHover && (k.onMouseenter = () => {
      s = !0, v();
    }, k.onMouseleave = () => {
      s = !1, f();
    }), c.value && (k.onFocusin = () => {
      l = !0, v();
    }, k.onFocusout = () => {
      l = !1, f();
    }), e.closeOnContentClick) {
      const N = se(Mf, null);
      k.onClick = () => {
        n.value = !1, N == null || N.closeParents();
      };
    }
    return k;
  }), E = T(() => {
    const k = {};
    return e.openOnHover && (k.onMouseenter = () => {
      u && (s = !0, u = !1, v());
    }, k.onMouseleave = () => {
      s = !1, f();
    }), k;
  });
  q(o, (k) => {
    var N;
    k && (e.openOnHover && !s && (!c.value || !l) || c.value && !l && (!e.openOnHover || !s)) && !((N = r.value) != null && N.contains(document.activeElement)) && (n.value = !1);
  }), q(n, (k) => {
    k || setTimeout(() => {
      m.value = void 0;
    });
  }, {
    flush: "post"
  });
  const A = Oo();
  dt(() => {
    A.value && ge(() => {
      i.value = A.el;
    });
  });
  const b = Oo(), P = T(() => e.target === "cursor" && m.value ? m.value : b.value ? b.el : Ws(e.target, a) || i.value), V = T(() => Array.isArray(P.value) ? void 0 : P.value);
  let C;
  return q(() => !!e.activator, (k) => {
    k && be ? (C = Xt(), C.run(() => {
      Wf(e, a, {
        activatorEl: i,
        activatorEvents: y
      });
    })) : C && C.stop();
  }, {
    flush: "post",
    immediate: !0
  }), ye(() => {
    C == null || C.stop();
  }), {
    activatorEl: i,
    activatorRef: A,
    target: P,
    targetEl: V,
    targetRef: b,
    activatorEvents: y,
    contentEvents: g,
    scrimEvents: E
  };
}
function Wf(e, t, n) {
  let {
    activatorEl: o,
    activatorEvents: r
  } = n;
  q(() => e.activator, (l, u) => {
    if (u && l !== u) {
      const c = s(u);
      c && i(c);
    }
    l && ge(() => a());
  }, {
    immediate: !0
  }), q(() => e.activatorProps, () => {
    a();
  }), ye(() => {
    i();
  });
  function a() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    l && Od(l, ne(r.value, u));
  }
  function i() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    l && Id(l, ne(r.value, u));
  }
  function s() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator;
    const u = Ws(l, t);
    return o.value = (u == null ? void 0 : u.nodeType) === Node.ELEMENT_NODE ? u : void 0, o.value;
  }
}
function Ws(e, t) {
  var o, r;
  if (!e) return;
  let n;
  if (e === "parent") {
    let a = (r = (o = t == null ? void 0 : t.proxy) == null ? void 0 : o.$el) == null ? void 0 : r.parentNode;
    for (; a != null && a.hasAttribute("data-no-activator"); )
      a = a.parentNode;
    n = a;
  } else typeof e == "string" ? n = document.querySelector(e) : "$el" in e ? n = e.$el : n = e;
  return n;
}
const Kf = Symbol.for("vuetify:display");
function Gf() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    mobile: null
  }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  const n = se(Kf);
  if (!n) throw new Error("Could not find Vuetify display injection");
  const o = T(() => e.mobile ? !0 : typeof e.mobileBreakpoint == "number" ? n.width.value < e.mobileBreakpoint : e.mobileBreakpoint ? n.width.value < n.thresholds.value[e.mobileBreakpoint] : e.mobile === null ? n.mobile.value : !1), r = F(() => t ? {
    [`${t}--mobile`]: o.value
  } : {});
  return {
    ...n,
    displayClasses: r,
    mobile: o
  };
}
function qf() {
  if (!be) return re(!1);
  const {
    ssr: e
  } = Gf();
  if (e) {
    const t = re(!1);
    return xn(() => {
      t.value = !0;
    }), t;
  } else
    return re(!0);
}
const Yf = $({
  eager: Boolean
}, "lazy");
function Xf(e, t) {
  const n = re(!1), o = F(() => n.value || e.eager || t.value);
  q(t, () => n.value = !0);
  function r() {
    e.eager || (n.value = !1);
  }
  return {
    isBooted: n,
    hasContent: o,
    onAfterLeave: r
  };
}
function Ks() {
  const t = le("useScopeId").vnode.scopeId;
  return {
    scopeId: t ? {
      [t]: ""
    } : void 0
  };
}
const ri = Symbol.for("vuetify:stack"), Pt = st([]);
function Zf(e, t, n) {
  const o = le("useStack"), r = !n, a = se(ri, void 0), i = st({
    activeChildren: /* @__PURE__ */ new Set()
  });
  ft(ri, i);
  const s = re(Number(He(t)));
  ct(e, () => {
    var d;
    const c = (d = Pt.at(-1)) == null ? void 0 : d[1];
    s.value = c ? c + 10 : Number(He(t)), r && Pt.push([o.uid, s.value]), a == null || a.activeChildren.add(o.uid), ye(() => {
      if (r) {
        const v = it(Pt).findIndex((f) => f[0] === o.uid);
        Pt.splice(v, 1);
      }
      a == null || a.activeChildren.delete(o.uid);
    });
  });
  const l = re(!0);
  r && dt(() => {
    var d;
    const c = ((d = Pt.at(-1)) == null ? void 0 : d[0]) === o.uid;
    setTimeout(() => l.value = c);
  });
  const u = F(() => !i.activeChildren.size);
  return {
    globalTop: hi(l),
    localTop: u,
    stackStyles: F(() => ({
      zIndex: s.value
    }))
  };
}
function Jf(e) {
  return {
    teleportTarget: T(() => {
      const n = e();
      if (n === !0 || !be) return;
      const o = n === !1 ? document.body : typeof n == "string" ? document.querySelector(n) : n;
      if (o == null) {
        $o(`Unable to locate target ${n}`);
        return;
      }
      let r = [...o.children].find((a) => a.matches(".v-overlay-container"));
      return r || (r = document.createElement("div"), r.className = "v-overlay-container", o.appendChild(r)), r;
    })
  };
}
const Kn = $({
  transition: {
    type: null,
    default: "fade-transition",
    validator: (e) => e !== !0
  }
}, "transition"), et = (e, t) => {
  let {
    slots: n
  } = t;
  const {
    transition: o,
    disabled: r,
    group: a,
    ...i
  } = e, {
    component: s = a ? Mo : Zt,
    ...l
  } = ko(o) ? o : {};
  let u;
  return ko(o) ? u = ne(l, Sd({
    disabled: r,
    group: a
  }), i) : u = ne({
    name: r || !o ? "" : o
  }, i), On(s, u, n);
};
function Qf() {
  return !0;
}
function Gs(e, t, n) {
  if (!e || qs(e, n) === !1) return !1;
  const o = As(t);
  if (typeof ShadowRoot < "u" && o instanceof ShadowRoot && o.host === e.target) return !1;
  const r = (typeof n.value == "object" && n.value.include || (() => []))();
  return r.push(t), !r.some((a) => a == null ? void 0 : a.contains(e.target));
}
function qs(e, t) {
  return (typeof t.value == "object" && t.value.closeConditional || Qf)(e);
}
function ev(e, t, n) {
  const o = typeof n.value == "function" ? n.value : n.value.handler;
  e.shadowTarget = e.target, t._clickOutside.lastMousedownWasOutside && Gs(e, t, n) && setTimeout(() => {
    qs(e, n) && o && o(e);
  }, 0);
}
function ai(e, t) {
  const n = As(e);
  t(document), typeof ShadowRoot < "u" && n instanceof ShadowRoot && t(n);
}
const ii = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(e, t) {
    const n = (r) => ev(r, e, t), o = (r) => {
      e._clickOutside.lastMousedownWasOutside = Gs(r, e, t);
    };
    ai(e, (r) => {
      r.addEventListener("click", n, !0), r.addEventListener("mousedown", o, !0);
    }), e._clickOutside || (e._clickOutside = {
      lastMousedownWasOutside: !1
    }), e._clickOutside[t.instance.$.uid] = {
      onClick: n,
      onMousedown: o
    };
  },
  beforeUnmount(e, t) {
    e._clickOutside && (ai(e, (n) => {
      var a;
      if (!n || !((a = e._clickOutside) != null && a[t.instance.$.uid])) return;
      const {
        onClick: o,
        onMousedown: r
      } = e._clickOutside[t.instance.$.uid];
      n.removeEventListener("click", o, !0), n.removeEventListener("mousedown", r, !0);
    }), delete e._clickOutside[t.instance.$.uid]);
  }
};
function tv(e) {
  const {
    modelValue: t,
    color: n,
    ...o
  } = e;
  return S(Zt, {
    name: "fade-transition",
    appear: !0
  }, {
    default: () => [e.modelValue && O("div", ne({
      class: ["v-overlay__scrim", e.color.backgroundColorClasses.value],
      style: e.color.backgroundColorStyles.value
    }, o), null)]
  });
}
const Ys = $({
  absolute: Boolean,
  attach: [Boolean, String, Object],
  closeOnBack: {
    type: Boolean,
    default: !0
  },
  contained: Boolean,
  contentClass: null,
  contentProps: null,
  disabled: Boolean,
  opacity: [Number, String],
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [Boolean, String],
    default: !0
  },
  zIndex: {
    type: [Number, String],
    default: 2e3
  },
  ...zf(),
  ...te(),
  ...Ot(),
  ...Yf(),
  ...xf(),
  ...Bf(),
  ...Ee(),
  ...Kn()
}, "VOverlay"), si = Y()({
  name: "VOverlay",
  directives: {
    vClickOutside: ii
  },
  inheritAttrs: !1,
  props: {
    _disableGlobalStack: Boolean,
    ...Ys()
  },
  emits: {
    "click:outside": (e) => !0,
    "update:modelValue": (e) => !0,
    keydown: (e) => !0,
    afterEnter: () => !0,
    afterLeave: () => !0
  },
  setup(e, t) {
    let {
      slots: n,
      attrs: o,
      emit: r
    } = t;
    const a = le("VOverlay"), i = j(), s = j(), l = j(), u = Ge(e, "modelValue"), c = T({
      get: () => u.value,
      set: (G) => {
        G && e.disabled || (u.value = G);
      }
    }), {
      themeClasses: d
    } = ke(e), {
      rtlClasses: v,
      isRtl: f
    } = on(), {
      hasContent: m,
      onAfterLeave: h
    } = Xf(e, c), y = at(() => typeof e.scrim == "string" ? e.scrim : null), {
      globalTop: g,
      localTop: E,
      stackStyles: A
    } = Zf(c, () => e.zIndex, e._disableGlobalStack), {
      activatorEl: b,
      activatorRef: P,
      target: V,
      targetEl: C,
      targetRef: k,
      activatorEvents: N,
      contentEvents: I,
      scrimEvents: _
    } = Hf(e, {
      isActive: c,
      isTop: E,
      contentEl: l
    }), {
      teleportTarget: w
    } = Jf(() => {
      var Ye, xt, cr;
      const G = e.attach || e.contained;
      if (G) return G;
      const me = ((Ye = b == null ? void 0 : b.value) == null ? void 0 : Ye.getRootNode()) || ((cr = (xt = a.proxy) == null ? void 0 : xt.$el) == null ? void 0 : cr.getRootNode());
      return me instanceof ShadowRoot ? me : !1;
    }), {
      dimensionStyles: x
    } = It(e), B = qf(), {
      scopeId: L
    } = Ks();
    q(() => e.disabled, (G) => {
      G && (c.value = !1);
    });
    const {
      contentStyles: M,
      updateLocation: R
    } = Tf(e, {
      isRtl: f,
      contentEl: l,
      target: V,
      isActive: c
    });
    Nf(e, {
      root: i,
      contentEl: l,
      targetEl: C,
      isActive: c,
      updateLocation: R
    });
    function H(G) {
      r("click:outside", G), e.persistent ? de() : c.value = !1;
    }
    function U(G) {
      return c.value && g.value && // If using scrim, only close if clicking on it rather than anything opened on top
      (!e.scrim || G.target === s.value || G instanceof MouseEvent && G.shadowTarget === s.value);
    }
    be && q(c, (G) => {
      G ? window.addEventListener("keydown", z) : window.removeEventListener("keydown", z);
    }, {
      immediate: !0
    }), St(() => {
      be && window.removeEventListener("keydown", z);
    });
    function z(G) {
      var me, Ye, xt;
      G.key === "Escape" && g.value && ((me = l.value) != null && me.contains(document.activeElement) || r("keydown", G), e.persistent ? de() : (c.value = !1, (Ye = l.value) != null && Ye.contains(document.activeElement) && ((xt = b.value) == null || xt.focus())));
    }
    function X(G) {
      G.key === "Escape" && !g.value || r("keydown", G);
    }
    const ee = pf();
    ct(() => e.closeOnBack, () => {
      bf(ee, (G) => {
        g.value && c.value ? (G(!1), e.persistent ? de() : c.value = !1) : G();
      });
    });
    const oe = j();
    q(() => c.value && (e.absolute || e.contained) && w.value == null, (G) => {
      if (G) {
        const me = Kd(i.value);
        me && me !== document.scrollingElement && (oe.value = me.scrollTop);
      }
    });
    function de() {
      e.noClickAnimation || l.value && Ss(l.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: ks
      });
    }
    function qe() {
      r("afterEnter");
    }
    function an() {
      h(), r("afterLeave");
    }
    return Q(() => {
      var G;
      return O(xe, null, [(G = n.activator) == null ? void 0 : G.call(n, {
        isActive: c.value,
        targetRef: k,
        props: ne({
          ref: P
        }, N.value, e.activatorProps)
      }), B.value && m.value && S(pl, {
        disabled: !w.value,
        to: w.value
      }, {
        default: () => [O("div", ne({
          class: ["v-overlay", {
            "v-overlay--absolute": e.absolute || e.contained,
            "v-overlay--active": c.value,
            "v-overlay--contained": e.contained
          }, d.value, v.value, e.class],
          style: [A.value, {
            "--v-overlay-opacity": e.opacity,
            top: W(oe.value)
          }, e.style],
          ref: i,
          onKeydown: X
        }, L, o), [S(tv, ne({
          color: y,
          modelValue: c.value && !!e.scrim,
          ref: s
        }, _.value), null), S(et, {
          appear: !0,
          persisted: !0,
          transition: e.transition,
          target: V.value,
          onAfterEnter: qe,
          onAfterLeave: an
        }, {
          default: () => {
            var me;
            return [We(O("div", ne({
              ref: l,
              class: ["v-overlay__content", e.contentClass],
              style: [x.value, M.value]
            }, I.value, e.contentProps), [(me = n.default) == null ? void 0 : me.call(n, {
              isActive: c
            })]), [[Tn, c.value], [ii, {
              handler: H,
              closeConditional: U,
              include: () => [b.value]
            }]])];
          }
        })])]
      })]);
    }), {
      activatorEl: b,
      scrimEl: s,
      target: V,
      animateClick: de,
      contentEl: l,
      globalTop: g,
      localTop: E,
      updateLocation: R
    };
  }
}), Xs = Symbol.for("vuetify:layout");
function nv() {
  const e = se(Xs);
  if (!e) throw new Error("[Vuetify] Could not find injected layout");
  return {
    getLayoutItem: e.getLayoutItem,
    mainRect: e.mainRect,
    mainStyles: e.mainStyles
  };
}
const io = Symbol("Forwarded refs");
function so(e, t) {
  let n = e;
  for (; n; ) {
    const o = Reflect.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
function ur(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
    n[o - 1] = arguments[o];
  return e[io] = n, new Proxy(e, {
    get(r, a) {
      if (Reflect.has(r, a))
        return Reflect.get(r, a);
      if (!(typeof a == "symbol" || a.startsWith("$") || a.startsWith("__"))) {
        for (const i of n)
          if (i.value && Reflect.has(i.value, a)) {
            const s = Reflect.get(i.value, a);
            return typeof s == "function" ? s.bind(i.value) : s;
          }
      }
    },
    has(r, a) {
      if (Reflect.has(r, a))
        return !0;
      if (typeof a == "symbol" || a.startsWith("$") || a.startsWith("__")) return !1;
      for (const i of n)
        if (i.value && Reflect.has(i.value, a))
          return !0;
      return !1;
    },
    set(r, a, i) {
      if (Reflect.has(r, a))
        return Reflect.set(r, a, i);
      if (typeof a == "symbol" || a.startsWith("$") || a.startsWith("__")) return !1;
      for (const s of n)
        if (s.value && Reflect.has(s.value, a))
          return Reflect.set(s.value, a, i);
      return !1;
    },
    getOwnPropertyDescriptor(r, a) {
      var s;
      const i = Reflect.getOwnPropertyDescriptor(r, a);
      if (i) return i;
      if (!(typeof a == "symbol" || a.startsWith("$") || a.startsWith("__"))) {
        for (const l of n) {
          if (!l.value) continue;
          const u = so(l.value, a) ?? ("_" in l.value ? so((s = l.value._) == null ? void 0 : s.setupState, a) : void 0);
          if (u) return u;
        }
        for (const l of n) {
          const u = l.value && l.value[io];
          if (!u) continue;
          const c = u.slice();
          for (; c.length; ) {
            const d = c.shift(), v = so(d.value, a);
            if (v) return v;
            const f = d.value && d.value[io];
            f && c.push(...f);
          }
        }
      }
    }
  });
}
function ov(e) {
  const t = re(e());
  let n = -1;
  function o() {
    clearInterval(n);
  }
  function r() {
    o(), ge(() => t.value = e());
  }
  function a(i) {
    const s = i ? getComputedStyle(i) : {
      transitionDuration: 0.2
    }, l = parseFloat(s.transitionDuration) * 1e3 || 200;
    if (o(), t.value <= 0) return;
    const u = performance.now();
    n = window.setInterval(() => {
      const c = performance.now() - u + l;
      t.value = Math.max(e() - c, 0), t.value <= 0 && o();
    }, l);
  }
  return ye(o), {
    clear: o,
    time: t,
    start: a,
    reset: r
  };
}
const rv = $({
  multiLine: Boolean,
  text: String,
  timer: [Boolean, String],
  timeout: {
    type: [Number, String],
    default: 5e3
  },
  vertical: Boolean,
  ...rn({
    location: "bottom"
  }),
  ...Hn(),
  ...Le(),
  ...nn(),
  ...Ee(),
  ...gs(Ys({
    transition: "v-snackbar-transition"
  }), ["persistent", "noClickAnimation", "scrim", "scrollStrategy"])
}, "VSnackbar"), av = Y()({
  name: "VSnackbar",
  props: rv(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Ge(e, "modelValue"), {
      positionClasses: r
    } = Wn(e), {
      scopeId: a
    } = Ks(), {
      themeClasses: i
    } = ke(e), {
      colorClasses: s,
      colorStyles: l,
      variantClasses: u
    } = $n(e), {
      roundedClasses: c
    } = Fe(e), d = ov(() => Number(e.timeout)), v = j(), f = j(), m = re(!1), h = re(0), y = j(), g = se(Xs, void 0);
    ct(() => !!g, () => {
      const _ = nv();
      dt(() => {
        y.value = _.mainStyles.value;
      });
    }), q(o, A), q(() => e.timeout, A), xn(() => {
      o.value && A();
    });
    let E = -1;
    function A() {
      d.reset(), window.clearTimeout(E);
      const _ = Number(e.timeout);
      if (!o.value || _ === -1) return;
      const w = vs(f.value);
      d.start(w), E = window.setTimeout(() => {
        o.value = !1;
      }, _);
    }
    function b() {
      d.reset(), window.clearTimeout(E);
    }
    function P() {
      m.value = !0, b();
    }
    function V() {
      m.value = !1, A();
    }
    function C(_) {
      h.value = _.touches[0].clientY;
    }
    function k(_) {
      Math.abs(h.value - _.changedTouches[0].clientY) > 50 && (o.value = !1);
    }
    function N() {
      m.value && V();
    }
    const I = T(() => e.location.split(" ").reduce((_, w) => (_[`v-snackbar--${w}`] = !0, _), {}));
    return Q(() => {
      const _ = si.filterProps(e), w = !!(n.default || n.text || e.text);
      return S(si, ne({
        ref: v,
        class: ["v-snackbar", {
          "v-snackbar--active": o.value,
          "v-snackbar--multi-line": e.multiLine && !e.vertical,
          "v-snackbar--timer": !!e.timer,
          "v-snackbar--vertical": e.vertical
        }, I.value, r.value, e.class],
        style: [y.value, e.style]
      }, _, {
        modelValue: o.value,
        "onUpdate:modelValue": (x) => o.value = x,
        contentProps: ne({
          class: ["v-snackbar__wrapper", i.value, s.value, c.value, u.value],
          style: [l.value],
          onPointerenter: P,
          onPointerleave: V
        }, _.contentProps),
        persistent: !0,
        noClickAnimation: !0,
        scrim: !1,
        scrollStrategy: "none",
        _disableGlobalStack: !0,
        onTouchstartPassive: C,
        onTouchend: k,
        onAfterLeave: N
      }, a), {
        default: () => {
          var x, B;
          return [Fn(!1, "v-snackbar"), e.timer && !m.value && O("div", {
            key: "timer",
            class: "v-snackbar__timer"
          }, [S(Vs, {
            ref: f,
            color: typeof e.timer == "string" ? e.timer : "info",
            max: e.timeout,
            modelValue: d.time.value
          }, null)]), w && O("div", {
            key: "content",
            class: "v-snackbar__content",
            role: "status",
            "aria-live": "polite"
          }, [((x = n.text) == null ? void 0 : x.call(n)) ?? e.text, (B = n.default) == null ? void 0 : B.call(n)]), n.actions && S(Ne, {
            defaults: {
              VBtn: {
                variant: "text",
                ripple: !1,
                slim: !0
              }
            }
          }, {
            default: () => [O("div", {
              class: "v-snackbar__actions"
            }, [n.actions({
              isActive: o
            })])]
          })];
        },
        activator: n.activator
      });
    }), ur({}, v);
  }
}), iv = {
  __name: "SystemMessage",
  setup(e, { expose: t }) {
    const n = j(!1), o = j(""), r = j(2e3), a = j("success");
    function i(l, u = {}) {
      o.value = typeof l == "string" ? l : l.message, r.value = u.timeout && u.timeout > 0 ? u.timeout : 5e3, a.value = u.color && u.color !== "" ? u.color : "error", n.value = !0;
    }
    function s(l, u = {}) {
      o.value = l, r.value = u.timeout && u.timeout > 0 ? u.timeout : 5e3, a.value = u.color && u.color !== "" ? u.color : "success", n.value = !0;
    }
    return t({ showError: i, showSuccess: s }), (l, u) => (Je(), Nt(av, {
      modelValue: n.value,
      "onUpdate:modelValue": u[1] || (u[1] = (c) => n.value = c),
      timeout: r.value,
      color: a.value,
      "multi-line": ""
    }, {
      actions: fe(() => [
        S($t, {
          variant: "text",
          onClick: u[0] || (u[0] = (c) => n.value = !1),
          icon: "mdi-close-circle"
        })
      ]),
      default: fe(() => [
        Ie(ue(o.value) + " ", 1)
      ]),
      _: 1
    }, 8, ["modelValue", "timeout", "color"]));
  }
}, sv = Y()({
  name: "VCardActions",
  props: te(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return rr({
      VBtn: {
        slim: !0,
        variant: "text"
      }
    }), Q(() => {
      var o;
      return O("div", {
        class: K(["v-card-actions", e.class]),
        style: J(e.style)
      }, [(o = n.default) == null ? void 0 : o.call(n)]);
    }), {};
  }
}), lv = $({
  opacity: [Number, String],
  ...te(),
  ...De()
}, "VCardSubtitle"), No = Y()({
  name: "VCardSubtitle",
  props: lv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Q(() => S(e.tag, {
      class: K(["v-card-subtitle", e.class]),
      style: J([{
        "--v-card-subtitle-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), Zs = Wd("v-card-title");
function uv(e) {
  return {
    aspectStyles: T(() => {
      const t = Number(e.aspectRatio);
      return t ? {
        paddingBottom: String(1 / t * 100) + "%"
      } : void 0;
    })
  };
}
const Js = $({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...te(),
  ...Ot()
}, "VResponsive"), li = Y()({
  name: "VResponsive",
  props: Js(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      aspectStyles: o
    } = uv(e), {
      dimensionStyles: r
    } = It(e);
    return Q(() => {
      var a;
      return O("div", {
        class: K(["v-responsive", {
          "v-responsive--inline": e.inline
        }, e.class]),
        style: J([r.value, e.style])
      }, [O("div", {
        class: "v-responsive__sizer",
        style: J(o.value)
      }, null), (a = n.additional) == null ? void 0 : a.call(n), n.default && O("div", {
        class: K(["v-responsive__content", e.contentClass])
      }, [n.default()])]);
    }), {};
  }
});
function cv(e, t) {
  if (!tr) return;
  const n = t.modifiers || {}, o = t.value, {
    handler: r,
    options: a
  } = typeof o == "object" ? o : {
    handler: o,
    options: {}
  }, i = new IntersectionObserver(function() {
    var d;
    let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], l = arguments.length > 1 ? arguments[1] : void 0;
    const u = (d = e._observe) == null ? void 0 : d[t.instance.$.uid];
    if (!u) return;
    const c = s.some((v) => v.isIntersecting);
    r && (!n.quiet || u.init) && (!n.once || c || u.init) && r(c, s, l), c && n.once ? Qs(e, t) : u.init = !0;
  }, a);
  e._observe = Object(e._observe), e._observe[t.instance.$.uid] = {
    init: !1,
    observer: i
  }, i.observe(e);
}
function Qs(e, t) {
  var o;
  const n = (o = e._observe) == null ? void 0 : o[t.instance.$.uid];
  n && (n.observer.unobserve(e), delete e._observe[t.instance.$.uid]);
}
const kn = {
  mounted: cv,
  unmounted: Qs
}, dv = $({
  absolute: Boolean,
  alt: String,
  cover: Boolean,
  color: String,
  draggable: {
    type: [Boolean, String],
    default: void 0
  },
  eager: Boolean,
  gradient: String,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  crossorigin: String,
  referrerpolicy: String,
  srcset: String,
  position: String,
  ...Js(),
  ...te(),
  ...Le(),
  ...Kn()
}, "VImg"), el = Y()({
  name: "VImg",
  directives: {
    vIntersect: kn
  },
  props: dv(),
  emits: {
    loadstart: (e) => !0,
    load: (e) => !0,
    error: (e) => !0
  },
  setup(e, t) {
    let {
      emit: n,
      slots: o
    } = t;
    const {
      backgroundColorClasses: r,
      backgroundColorStyles: a
    } = at(() => e.color), {
      roundedClasses: i
    } = Fe(e), s = le("VImg"), l = re(""), u = j(), c = re(e.eager ? "loading" : "idle"), d = re(), v = re(), f = T(() => e.src && typeof e.src == "object" ? {
      src: e.src.src,
      srcset: e.srcset || e.src.srcset,
      lazySrc: e.lazySrc || e.src.lazySrc,
      aspect: Number(e.aspectRatio || e.src.aspect || 0)
    } : {
      src: e.src,
      srcset: e.srcset,
      lazySrc: e.lazySrc,
      aspect: Number(e.aspectRatio || 0)
    }), m = T(() => f.value.aspect || d.value / v.value || 0);
    q(() => e.src, () => {
      h(c.value !== "idle");
    }), q(m, (w, x) => {
      !w && x && u.value && b(u.value);
    }), yi(() => h());
    function h(w) {
      if (!(e.eager && w) && !(tr && !w && !e.eager)) {
        if (c.value = "loading", f.value.lazySrc) {
          const x = new Image();
          x.src = f.value.lazySrc, b(x, null);
        }
        f.value.src && ge(() => {
          var x;
          n("loadstart", ((x = u.value) == null ? void 0 : x.currentSrc) || f.value.src), setTimeout(() => {
            var B;
            if (!s.isUnmounted)
              if ((B = u.value) != null && B.complete) {
                if (u.value.naturalWidth || g(), c.value === "error") return;
                m.value || b(u.value, null), c.value === "loading" && y();
              } else
                m.value || b(u.value), E();
          });
        });
      }
    }
    function y() {
      var w;
      s.isUnmounted || (E(), b(u.value), c.value = "loaded", n("load", ((w = u.value) == null ? void 0 : w.currentSrc) || f.value.src));
    }
    function g() {
      var w;
      s.isUnmounted || (c.value = "error", n("error", ((w = u.value) == null ? void 0 : w.currentSrc) || f.value.src));
    }
    function E() {
      const w = u.value;
      w && (l.value = w.currentSrc || w.src);
    }
    let A = -1;
    St(() => {
      clearTimeout(A);
    });
    function b(w) {
      let x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const B = () => {
        if (clearTimeout(A), s.isUnmounted) return;
        const {
          naturalHeight: L,
          naturalWidth: M
        } = w;
        L || M ? (d.value = M, v.value = L) : !w.complete && c.value === "loading" && x != null ? A = window.setTimeout(B, x) : (w.currentSrc.endsWith(".svg") || w.currentSrc.startsWith("data:image/svg+xml")) && (d.value = 1, v.value = 1);
      };
      B();
    }
    const P = F(() => ({
      "v-img__img--cover": e.cover,
      "v-img__img--contain": !e.cover
    })), V = () => {
      var B;
      if (!f.value.src || c.value === "idle") return null;
      const w = O("img", {
        class: K(["v-img__img", P.value]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: f.value.src,
        srcset: f.value.srcset,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable,
        sizes: e.sizes,
        ref: u,
        onLoad: y,
        onError: g
      }, null), x = (B = o.sources) == null ? void 0 : B.call(o);
      return S(et, {
        transition: e.transition,
        appear: !0
      }, {
        default: () => [We(x ? O("picture", {
          class: "v-img__picture"
        }, [x, w]) : w, [[Tn, c.value === "loaded"]])]
      });
    }, C = () => S(et, {
      transition: e.transition
    }, {
      default: () => [f.value.lazySrc && c.value !== "loaded" && O("img", {
        class: K(["v-img__img", "v-img__img--preload", P.value]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: f.value.lazySrc,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable
      }, null)]
    }), k = () => o.placeholder ? S(et, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [(c.value === "loading" || c.value === "error" && !o.error) && O("div", {
        class: "v-img__placeholder"
      }, [o.placeholder()])]
    }) : null, N = () => o.error ? S(et, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [c.value === "error" && O("div", {
        class: "v-img__error"
      }, [o.error()])]
    }) : null, I = () => e.gradient ? O("div", {
      class: "v-img__gradient",
      style: {
        backgroundImage: `linear-gradient(${e.gradient})`
      }
    }, null) : null, _ = re(!1);
    {
      const w = q(m, (x) => {
        x && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            _.value = !0;
          });
        }), w());
      });
    }
    return Q(() => {
      const w = li.filterProps(e);
      return We(S(li, ne({
        class: ["v-img", {
          "v-img--absolute": e.absolute,
          "v-img--booting": !_.value
        }, r.value, i.value, e.class],
        style: [{
          width: W(e.width === "auto" ? d.value : e.width)
        }, a.value, e.style]
      }, w, {
        aspectRatio: m.value,
        "aria-label": e.alt,
        role: e.alt ? "img" : void 0
      }), {
        additional: () => O(xe, null, [S(V, null, null), S(C, null, null), S(I, null, null), S(k, null, null), S(N, null, null)]),
        default: o.default
      }), [[kn, {
        handler: h,
        options: e.options
      }, null, {
        once: !0
      }]]);
    }), {
      currentSrc: l,
      image: u,
      state: c,
      naturalWidth: d,
      naturalHeight: v
    };
  }
}), fv = $({
  start: Boolean,
  end: Boolean,
  icon: he,
  image: String,
  text: String,
  ...Qt(),
  ...te(),
  ...kt(),
  ...Le(),
  ...Un(),
  ...De(),
  ...Ee(),
  ...nn({
    variant: "flat"
  })
}, "VAvatar"), ui = Y()({
  name: "VAvatar",
  props: fv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = ke(e), {
      borderClasses: r
    } = en(e), {
      colorClasses: a,
      colorStyles: i,
      variantClasses: s
    } = $n(e), {
      densityClasses: l
    } = tn(e), {
      roundedClasses: u
    } = Fe(e), {
      sizeClasses: c,
      sizeStyles: d
    } = jn(e);
    return Q(() => S(e.tag, {
      class: K(["v-avatar", {
        "v-avatar--start": e.start,
        "v-avatar--end": e.end
      }, o.value, r.value, a.value, l.value, u.value, c.value, s.value, e.class]),
      style: J([i.value, d.value, e.style])
    }, {
      default: () => [n.default ? S(Ne, {
        key: "content-defaults",
        defaults: {
          VImg: {
            cover: !0,
            src: e.image
          },
          VIcon: {
            icon: e.icon
          }
        }
      }, {
        default: () => [n.default()]
      }) : e.image ? S(el, {
        key: "image",
        src: e.image,
        alt: "",
        cover: !0
      }, null) : e.icon ? S(je, {
        key: "icon",
        icon: e.icon
      }, null) : e.text, Fn(!1, "v-avatar")]
    })), {};
  }
}), vv = $({
  appendAvatar: String,
  appendIcon: he,
  prependAvatar: String,
  prependIcon: he,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...te(),
  ...kt()
}, "VCardItem"), tl = Y()({
  name: "VCardItem",
  props: vv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Q(() => {
      var u;
      const o = !!(e.prependAvatar || e.prependIcon), r = !!(o || n.prepend), a = !!(e.appendAvatar || e.appendIcon), i = !!(a || n.append), s = !!(e.title != null || n.title), l = !!(e.subtitle != null || n.subtitle);
      return O("div", {
        class: K(["v-card-item", e.class]),
        style: J(e.style)
      }, [r && O("div", {
        key: "prepend",
        class: "v-card-item__prepend"
      }, [n.prepend ? S(Ne, {
        key: "prepend-defaults",
        disabled: !o,
        defaults: {
          VAvatar: {
            density: e.density,
            image: e.prependAvatar
          },
          VIcon: {
            density: e.density,
            icon: e.prependIcon
          }
        }
      }, n.prepend) : O(xe, null, [e.prependAvatar && S(ui, {
        key: "prepend-avatar",
        density: e.density,
        image: e.prependAvatar
      }, null), e.prependIcon && S(je, {
        key: "prepend-icon",
        density: e.density,
        icon: e.prependIcon
      }, null)])]), O("div", {
        class: "v-card-item__content"
      }, [s && S(Zs, {
        key: "title"
      }, {
        default: () => {
          var c;
          return [((c = n.title) == null ? void 0 : c.call(n)) ?? ue(e.title)];
        }
      }), l && S(No, {
        key: "subtitle"
      }, {
        default: () => {
          var c;
          return [((c = n.subtitle) == null ? void 0 : c.call(n)) ?? ue(e.subtitle)];
        }
      }), (u = n.default) == null ? void 0 : u.call(n)]), i && O("div", {
        key: "append",
        class: "v-card-item__append"
      }, [n.append ? S(Ne, {
        key: "append-defaults",
        disabled: !a,
        defaults: {
          VAvatar: {
            density: e.density,
            image: e.appendAvatar
          },
          VIcon: {
            density: e.density,
            icon: e.appendIcon
          }
        }
      }, n.append) : O(xe, null, [e.appendIcon && S(je, {
        key: "append-icon",
        density: e.density,
        icon: e.appendIcon
      }, null), e.appendAvatar && S(ui, {
        key: "append-avatar",
        density: e.density,
        image: e.appendAvatar
      }, null)])])]);
    }), {};
  }
}), mv = $({
  opacity: [Number, String],
  ...te(),
  ...De()
}, "VCardText"), gv = Y()({
  name: "VCardText",
  props: mv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Q(() => S(e.tag, {
      class: K(["v-card-text", e.class]),
      style: J([{
        "--v-card-text-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), hv = $({
  appendAvatar: String,
  appendIcon: he,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: he,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...Qt(),
  ...te(),
  ...kt(),
  ...Ot(),
  ...Nn(),
  ...sr(),
  ...rn(),
  ...Hn(),
  ...Le(),
  ...Bs(),
  ...De(),
  ...Ee(),
  ...nn({
    variant: "elevated"
  })
}, "VCard"), yv = Y()({
  name: "VCard",
  directives: {
    vRipple: Do
  },
  props: hv(),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const {
      themeClasses: r
    } = ke(e), {
      borderClasses: a
    } = en(e), {
      colorClasses: i,
      colorStyles: s,
      variantClasses: l
    } = $n(e), {
      densityClasses: u
    } = tn(e), {
      dimensionStyles: c
    } = It(e), {
      elevationClasses: d
    } = Ln(e), {
      loaderClasses: v
    } = lr(e), {
      locationStyles: f
    } = zn(e), {
      positionClasses: m
    } = Wn(e), {
      roundedClasses: h
    } = Fe(e), y = Rs(e, n);
    return Q(() => {
      const g = e.link !== !1 && y.isLink.value, E = !e.disabled && e.link !== !1 && (e.link || y.isClickable.value), A = g ? "a" : e.tag, b = !!(o.title || e.title != null), P = !!(o.subtitle || e.subtitle != null), V = b || P, C = !!(o.append || e.appendAvatar || e.appendIcon), k = !!(o.prepend || e.prependAvatar || e.prependIcon), N = !!(o.image || e.image), I = V || k || C, _ = !!(o.text || e.text != null);
      return We(S(A, ne({
        class: ["v-card", {
          "v-card--disabled": e.disabled,
          "v-card--flat": e.flat,
          "v-card--hover": e.hover && !(e.disabled || e.flat),
          "v-card--link": E
        }, r.value, a.value, i.value, u.value, d.value, v.value, m.value, h.value, l.value, e.class],
        style: [s.value, c.value, f.value, e.style],
        onClick: E && y.navigate,
        tabindex: e.disabled ? -1 : void 0
      }, y.linkProps), {
        default: () => {
          var w;
          return [N && O("div", {
            key: "image",
            class: "v-card__image"
          }, [o.image ? S(Ne, {
            key: "image-defaults",
            disabled: !e.image,
            defaults: {
              VImg: {
                cover: !0,
                src: e.image
              }
            }
          }, o.image) : S(el, {
            key: "image-img",
            cover: !0,
            src: e.image
          }, null)]), S(Ds, {
            name: "v-card",
            active: !!e.loading,
            color: typeof e.loading == "boolean" ? void 0 : e.loading
          }, {
            default: o.loader
          }), I && S(tl, {
            key: "item",
            prependAvatar: e.prependAvatar,
            prependIcon: e.prependIcon,
            title: e.title,
            subtitle: e.subtitle,
            appendAvatar: e.appendAvatar,
            appendIcon: e.appendIcon
          }, {
            default: o.item,
            prepend: o.prepend,
            title: o.title,
            subtitle: o.subtitle,
            append: o.append
          }), _ && S(gv, {
            key: "text"
          }, {
            default: () => {
              var x;
              return [((x = o.text) == null ? void 0 : x.call(o)) ?? e.text];
            }
          }), (w = o.default) == null ? void 0 : w.call(o), o.actions && S(sv, null, {
            default: o.actions
          }), Fn(E, "v-card")];
        }
      }), [[Do, E && e.ripple]]);
    }), {};
  }
}), nl = Symbol.for("vuetify:form"), _v = $({
  disabled: Boolean,
  fastFail: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  validateOn: {
    type: String,
    default: "input"
  }
}, "form");
function pv(e) {
  const t = Ge(e, "modelValue"), n = F(() => e.disabled), o = F(() => e.readonly), r = re(!1), a = j([]), i = j([]);
  async function s() {
    const c = [];
    let d = !0;
    i.value = [], r.value = !0;
    for (const v of a.value) {
      const f = await v.validate();
      if (f.length > 0 && (d = !1, c.push({
        id: v.id,
        errorMessages: f
      })), !d && e.fastFail) break;
    }
    return i.value = c, r.value = !1, {
      valid: d,
      errors: i.value
    };
  }
  function l() {
    a.value.forEach((c) => c.reset());
  }
  function u() {
    a.value.forEach((c) => c.resetValidation());
  }
  return q(a, () => {
    let c = 0, d = 0;
    const v = [];
    for (const f of a.value)
      f.isValid === !1 ? (d++, v.push({
        id: f.id,
        errorMessages: f.errorMessages
      })) : f.isValid === !0 && c++;
    i.value = v, t.value = d > 0 ? !1 : c === a.value.length ? !0 : null;
  }, {
    deep: !0,
    flush: "post"
  }), ft(nl, {
    register: (c) => {
      let {
        id: d,
        vm: v,
        validate: f,
        reset: m,
        resetValidation: h
      } = c;
      a.value.some((y) => y.id === d) && rt(`Duplicate input name "${d}"`), a.value.push({
        id: d,
        validate: f,
        reset: m,
        resetValidation: h,
        vm: $e(v),
        isValid: null,
        errorMessages: []
      });
    },
    unregister: (c) => {
      a.value = a.value.filter((d) => d.id !== c);
    },
    update: (c, d, v) => {
      const f = a.value.find((m) => m.id === c);
      f && (f.isValid = d, f.errorMessages = v);
    },
    isDisabled: n,
    isReadonly: o,
    isValidating: r,
    isValid: t,
    items: a,
    validateOn: F(() => e.validateOn)
  }), {
    errors: i,
    isDisabled: n,
    isReadonly: o,
    isValidating: r,
    isValid: t,
    items: a,
    validate: s,
    reset: l,
    resetValidation: u
  };
}
function bv(e) {
  const t = se(nl, null);
  return {
    ...t,
    isReadonly: T(() => !!((e == null ? void 0 : e.readonly) ?? (t == null ? void 0 : t.isReadonly.value))),
    isDisabled: T(() => !!((e == null ? void 0 : e.disabled) ?? (t == null ? void 0 : t.isDisabled.value)))
  };
}
const Ev = $({
  ...te(),
  ..._v()
}, "VForm"), ci = Y()({
  name: "VForm",
  props: Ev(),
  emits: {
    "update:modelValue": (e) => !0,
    submit: (e) => !0
  },
  setup(e, t) {
    let {
      slots: n,
      emit: o
    } = t;
    const r = pv(e), a = j();
    function i(l) {
      l.preventDefault(), r.reset();
    }
    function s(l) {
      const u = l, c = r.validate();
      u.then = c.then.bind(c), u.catch = c.catch.bind(c), u.finally = c.finally.bind(c), o("submit", u), u.defaultPrevented || c.then((d) => {
        var f;
        let {
          valid: v
        } = d;
        v && ((f = a.value) == null || f.submit());
      }), u.preventDefault();
    }
    return Q(() => {
      var l;
      return O("form", {
        ref: a,
        class: K(["v-form", e.class]),
        style: J(e.style),
        novalidate: !0,
        onReset: i,
        onSubmit: s
      }, [(l = n.default) == null ? void 0 : l.call(n, r)]);
    }), ur(r, a);
  }
}), Cv = $({
  color: String,
  ...Qt(),
  ...te(),
  ...Ot(),
  ...Nn(),
  ...rn(),
  ...Hn(),
  ...Le(),
  ...De(),
  ...Ee()
}, "VSheet"), Sv = Y()({
  name: "VSheet",
  props: Cv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = ke(e), {
      backgroundColorClasses: r,
      backgroundColorStyles: a
    } = at(() => e.color), {
      borderClasses: i
    } = en(e), {
      dimensionStyles: s
    } = It(e), {
      elevationClasses: l
    } = Ln(e), {
      locationStyles: u
    } = zn(e), {
      positionClasses: c
    } = Wn(e), {
      roundedClasses: d
    } = Fe(e);
    return Q(() => S(e.tag, {
      class: K(["v-sheet", o.value, r.value, i.value, l.value, c.value, d.value, e.class]),
      style: J([a.value, s.value, u.value, e.style])
    }, n)), {};
  }
}), wv = $({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function Ce(e, t, n) {
  return Y()({
    name: e,
    props: wv({
      mode: n,
      origin: t
    }),
    setup(o, r) {
      let {
        slots: a
      } = r;
      const i = {
        onBeforeEnter(s) {
          o.origin && (s.style.transformOrigin = o.origin);
        },
        onLeave(s) {
          if (o.leaveAbsolute) {
            const {
              offsetTop: l,
              offsetLeft: u,
              offsetWidth: c,
              offsetHeight: d
            } = s;
            s._transitionInitialStyles = {
              position: s.style.position,
              top: s.style.top,
              left: s.style.left,
              width: s.style.width,
              height: s.style.height
            }, s.style.position = "absolute", s.style.top = `${l}px`, s.style.left = `${u}px`, s.style.width = `${c}px`, s.style.height = `${d}px`;
          }
          o.hideOnLeave && s.style.setProperty("display", "none", "important");
        },
        onAfterLeave(s) {
          if (o.leaveAbsolute && (s != null && s._transitionInitialStyles)) {
            const {
              position: l,
              top: u,
              left: c,
              width: d,
              height: v
            } = s._transitionInitialStyles;
            delete s._transitionInitialStyles, s.style.position = l || "", s.style.top = u || "", s.style.left = c || "", s.style.width = d || "", s.style.height = v || "";
          }
        }
      };
      return () => {
        const s = o.group ? Mo : Zt;
        return On(s, {
          name: o.disabled ? "" : e,
          css: !o.disabled,
          ...o.group ? void 0 : {
            mode: o.mode
          },
          ...o.disabled ? {} : i
        }, a.default);
      };
    }
  });
}
function ol(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return Y()({
    name: e,
    props: {
      mode: {
        type: String,
        default: n
      },
      disabled: Boolean,
      group: Boolean
    },
    setup(o, r) {
      let {
        slots: a
      } = r;
      const i = o.group ? Mo : Zt;
      return () => On(i, {
        name: o.disabled ? "" : e,
        css: !o.disabled,
        // mode: props.mode, // TODO: vuejs/vue-next#3104
        ...o.disabled ? {} : t
      }, a.default);
    }
  });
}
function rl() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const n = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1) ? "width" : "height", o = gi(`offset-${n}`);
  return {
    onBeforeEnter(i) {
      i._parent = i.parentNode, i._initialStyle = {
        transition: i.style.transition,
        overflow: i.style.overflow,
        [n]: i.style[n]
      };
    },
    onEnter(i) {
      const s = i._initialStyle;
      if (!s) return;
      i.style.setProperty("transition", "none", "important"), i.style.overflow = "hidden";
      const l = `${i[o]}px`;
      i.style[n] = "0", i.offsetHeight, i.style.transition = s.transition, e && i._parent && i._parent.classList.add(e), requestAnimationFrame(() => {
        i.style[n] = l;
      });
    },
    onAfterEnter: a,
    onEnterCancelled: a,
    onLeave(i) {
      i._initialStyle = {
        transition: "",
        overflow: i.style.overflow,
        [n]: i.style[n]
      }, i.style.overflow = "hidden", i.style[n] = `${i[o]}px`, i.offsetHeight, requestAnimationFrame(() => i.style[n] = "0");
    },
    onAfterLeave: r,
    onLeaveCancelled: r
  };
  function r(i) {
    e && i._parent && i._parent.classList.remove(e), a(i);
  }
  function a(i) {
    if (!i._initialStyle) return;
    const s = i._initialStyle[n];
    i.style.overflow = i._initialStyle.overflow, s != null && (i.style[n] = s), delete i._initialStyle;
  }
}
Ce("fab-transition", "center center", "out-in");
Ce("dialog-bottom-transition");
Ce("dialog-top-transition");
Ce("fade-transition");
Ce("scale-transition");
Ce("scroll-x-transition");
Ce("scroll-x-reverse-transition");
Ce("scroll-y-transition");
Ce("scroll-y-reverse-transition");
Ce("slide-x-transition");
Ce("slide-x-reverse-transition");
const al = Ce("slide-y-transition");
Ce("slide-y-reverse-transition");
ol("expand-transition", rl());
const Av = ol("expand-x-transition", rl("", !0)), kv = $({
  active: Boolean,
  disabled: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...te(),
  ...Kn({
    transition: {
      component: al
    }
  })
}, "VCounter"), Ov = Y()({
  name: "VCounter",
  functional: !0,
  props: kv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = F(() => e.max ? `${e.value} / ${e.max}` : String(e.value));
    return Q(() => S(et, {
      transition: e.transition
    }, {
      default: () => [We(O("div", {
        class: K(["v-counter", {
          "text-error": e.max && !e.disabled && parseFloat(e.value) > parseFloat(e.max)
        }, e.class]),
        style: J(e.style)
      }, [n.default ? n.default({
        counter: o.value,
        max: e.max,
        value: e.value
      }) : o.value]), [[Tn, e.active]])]
    })), {};
  }
}), Iv = $({
  text: String,
  onClick: ot(),
  ...te(),
  ...Ee()
}, "VLabel"), xv = Y()({
  name: "VLabel",
  props: Iv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Q(() => {
      var o;
      return O("label", {
        class: K(["v-label", {
          "v-label--clickable": !!e.onClick
        }, e.class]),
        style: J(e.style),
        onClick: e.onClick
      }, [e.text, (o = n.default) == null ? void 0 : o.call(n)]);
    }), {};
  }
}), Tv = $({
  floating: Boolean,
  ...te()
}, "VFieldLabel"), cn = Y()({
  name: "VFieldLabel",
  props: Tv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Q(() => S(xv, {
      class: K(["v-field-label", {
        "v-field-label--floating": e.floating
      }, e.class]),
      style: J(e.style)
    }, n)), {};
  }
});
function il(e) {
  const {
    t
  } = gf();
  function n(o) {
    let {
      name: r,
      color: a,
      ...i
    } = o;
    const s = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[r], l = e[`onClick:${r}`];
    function u(d) {
      d.key !== "Enter" && d.key !== " " || (d.preventDefault(), d.stopPropagation(), bs(l, new PointerEvent("click", d)));
    }
    const c = l && s ? t(`$vuetify.input.${s}`, e.label ?? "") : void 0;
    return S(je, ne({
      icon: e[`${r}Icon`],
      "aria-label": c,
      onClick: l,
      onKeydown: u,
      color: a
    }, i), null);
  }
  return {
    InputIcon: n
  };
}
const sl = $({
  focused: Boolean,
  "onUpdate:focused": ot()
}, "focus");
function ll(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve();
  const n = Ge(e, "focused"), o = F(() => ({
    [`${t}--focused`]: n.value
  }));
  function r() {
    n.value = !0;
  }
  function a() {
    n.value = !1;
  }
  return {
    focusClasses: o,
    isFocused: n,
    focus: r,
    blur: a
  };
}
const Pv = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"], ul = $({
  appendInnerIcon: he,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: he,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
  details: Boolean,
  dirty: Boolean,
  disabled: {
    type: Boolean,
    default: null
  },
  glow: Boolean,
  error: Boolean,
  flat: Boolean,
  iconColor: [Boolean, String],
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: he,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (e) => Pv.includes(e)
  },
  "onClick:clear": ot(),
  "onClick:appendInner": ot(),
  "onClick:prependInner": ot(),
  ...te(),
  ...sr(),
  ...Le(),
  ...Ee()
}, "VField"), di = Y()({
  name: "VField",
  inheritAttrs: !1,
  props: {
    id: String,
    ...sl(),
    ...ul()
  },
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: o,
      slots: r
    } = t;
    const {
      themeClasses: a
    } = ke(e), {
      loaderClasses: i
    } = lr(e), {
      focusClasses: s,
      isFocused: l,
      focus: u,
      blur: c
    } = ll(e), {
      InputIcon: d
    } = il(e), {
      roundedClasses: v
    } = Fe(e), {
      rtlClasses: f
    } = on(), m = F(() => e.dirty || e.active), h = F(() => !!(e.label || r.label)), y = F(() => !e.singleLine && h.value), g = In(), E = T(() => e.id || `input-${g}`), A = F(() => e.details ? `${E.value}-messages` : void 0), b = j(), P = j(), V = j(), C = T(() => ["plain", "underlined"].includes(e.variant)), k = T(() => e.error || e.disabled ? void 0 : m.value && l.value ? e.color : e.baseColor), N = T(() => {
      if (!(!e.iconColor || e.glow && !l.value))
        return e.iconColor === !0 ? k.value : e.iconColor;
    }), {
      backgroundColorClasses: I,
      backgroundColorStyles: _
    } = at(() => e.bgColor), {
      textColorClasses: w,
      textColorStyles: x
    } = Ct(k);
    q(m, (M) => {
      if (y.value) {
        const R = b.value.$el, H = P.value.$el;
        requestAnimationFrame(() => {
          const U = Cs(R), z = H.getBoundingClientRect(), X = z.x - U.x, ee = z.y - U.y - (U.height / 2 - z.height / 2), oe = z.width / 0.75, de = Math.abs(oe - U.width) > 1 ? {
            maxWidth: W(oe)
          } : void 0, qe = getComputedStyle(R), an = getComputedStyle(H), G = parseFloat(qe.transitionDuration) * 1e3 || 150, me = parseFloat(an.getPropertyValue("--v-field-label-scale")), Ye = an.getPropertyValue("color");
          R.style.visibility = "visible", H.style.visibility = "hidden", Ss(R, {
            transform: `translate(${X}px, ${ee}px) scale(${me})`,
            color: Ye,
            ...de
          }, {
            duration: G,
            easing: ks,
            direction: M ? "normal" : "reverse"
          }).finished.then(() => {
            R.style.removeProperty("visibility"), H.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const B = T(() => ({
      isActive: m,
      isFocused: l,
      controlRef: V,
      blur: c,
      focus: u
    }));
    function L(M) {
      M.target !== document.activeElement && M.preventDefault();
    }
    return Q(() => {
      var X, ee, oe;
      const M = e.variant === "outlined", R = !!(r["prepend-inner"] || e.prependInnerIcon), H = !!(e.clearable || r.clear) && !e.disabled, U = !!(r["append-inner"] || e.appendInnerIcon || H), z = () => r.label ? r.label({
        ...B.value,
        label: e.label,
        props: {
          for: E.value
        }
      }) : e.label;
      return O("div", ne({
        class: ["v-field", {
          "v-field--active": m.value,
          "v-field--appended": U,
          "v-field--center-affix": e.centerAffix ?? !C.value,
          "v-field--disabled": e.disabled,
          "v-field--dirty": e.dirty,
          "v-field--error": e.error,
          "v-field--glow": e.glow,
          "v-field--flat": e.flat,
          "v-field--has-background": !!e.bgColor,
          "v-field--persistent-clear": e.persistentClear,
          "v-field--prepended": R,
          "v-field--reverse": e.reverse,
          "v-field--single-line": e.singleLine,
          "v-field--no-label": !z(),
          [`v-field--variant-${e.variant}`]: !0
        }, a.value, I.value, s.value, i.value, v.value, f.value, e.class],
        style: [_.value, e.style],
        onClick: L
      }, n), [O("div", {
        class: "v-field__overlay"
      }, null), S(Ds, {
        name: "v-field",
        active: !!e.loading,
        color: e.error ? "error" : typeof e.loading == "string" ? e.loading : e.color
      }, {
        default: r.loader
      }), R && O("div", {
        key: "prepend",
        class: "v-field__prepend-inner"
      }, [e.prependInnerIcon && S(d, {
        key: "prepend-icon",
        name: "prependInner",
        color: N.value
      }, null), (X = r["prepend-inner"]) == null ? void 0 : X.call(r, B.value)]), O("div", {
        class: "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(e.variant) && y.value && S(cn, {
        key: "floating-label",
        ref: P,
        class: K([w.value]),
        floating: !0,
        for: E.value,
        "aria-hidden": !m.value,
        style: J(x.value)
      }, {
        default: () => [z()]
      }), h.value && S(cn, {
        key: "label",
        ref: b,
        for: E.value
      }, {
        default: () => [z()]
      }), ((ee = r.default) == null ? void 0 : ee.call(r, {
        ...B.value,
        props: {
          id: E.value,
          class: "v-field__input",
          "aria-describedby": A.value
        },
        focus: u,
        blur: c
      })) ?? O("div", {
        id: E.value,
        class: "v-field__input",
        "aria-describedby": A.value
      }, null)]), H && S(Av, {
        key: "clear"
      }, {
        default: () => [We(O("div", {
          class: "v-field__clearable",
          onMousedown: (de) => {
            de.preventDefault(), de.stopPropagation();
          }
        }, [S(Ne, {
          defaults: {
            VIcon: {
              icon: e.clearIcon
            }
          }
        }, {
          default: () => [r.clear ? r.clear({
            ...B.value,
            props: {
              onFocus: u,
              onBlur: c,
              onClick: e["onClick:clear"],
              tabindex: -1
            }
          }) : S(d, {
            name: "clear",
            onFocus: u,
            onBlur: c,
            tabindex: -1
          }, null)]
        })]), [[Tn, e.dirty]])]
      }), U && O("div", {
        key: "append",
        class: "v-field__append-inner"
      }, [(oe = r["append-inner"]) == null ? void 0 : oe.call(r, B.value), e.appendInnerIcon && S(d, {
        key: "append-icon",
        name: "appendInner",
        color: N.value
      }, null)]), O("div", {
        class: K(["v-field__outline", w.value]),
        style: J(x.value)
      }, [M && O(xe, null, [O("div", {
        class: "v-field__outline__start"
      }, null), y.value && O("div", {
        class: "v-field__outline__notch"
      }, [S(cn, {
        ref: P,
        floating: !0,
        for: E.value,
        "aria-hidden": !m.value
      }, {
        default: () => [z()]
      })]), O("div", {
        class: "v-field__outline__end"
      }, null)]), C.value && y.value && S(cn, {
        ref: P,
        floating: !0,
        for: E.value,
        "aria-hidden": !m.value
      }, {
        default: () => [z()]
      })])]);
    }), {
      controlRef: V,
      fieldIconColor: N
    };
  }
}), Vv = $({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...te(),
  ...Kn({
    transition: {
      component: al,
      leaveAbsolute: !0,
      group: !0
    }
  })
}, "VMessages"), Dv = Y()({
  name: "VMessages",
  props: Vv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = T(() => Ft(e.messages)), {
      textColorClasses: r,
      textColorStyles: a
    } = Ct(() => e.color);
    return Q(() => S(et, {
      transition: e.transition,
      tag: "div",
      class: K(["v-messages", r.value, e.class]),
      style: J([a.value, e.style])
    }, {
      default: () => [e.active && o.value.map((i, s) => O("div", {
        class: "v-messages__message",
        key: `${s}-${o.value}`
      }, [n.message ? n.message({
        message: i
      }) : i]))]
    })), {};
  }
}), Rv = Symbol.for("vuetify:rules");
function Bv(e) {
  const t = se(Rv, null);
  return t ? t(e) : F(e);
}
const Nv = $({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  errorMessages: {
    type: [Array, String],
    default: () => []
  },
  maxErrors: {
    type: [Number, String],
    default: 1
  },
  name: String,
  label: String,
  readonly: {
    type: Boolean,
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...sl()
}, "validation");
function Lv(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ve(), n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : In();
  const o = Ge(e, "modelValue"), r = T(() => e.validationValue === void 0 ? o.value : e.validationValue), a = bv(e), i = Bv(() => e.rules), s = j([]), l = re(!0), u = T(() => !!(Ft(o.value === "" ? null : o.value).length || Ft(r.value === "" ? null : r.value).length)), c = T(() => {
    var b;
    return (b = e.errorMessages) != null && b.length ? Ft(e.errorMessages).concat(s.value).slice(0, Math.max(0, Number(e.maxErrors))) : s.value;
  }), d = T(() => {
    var V;
    let b = (e.validateOn ?? ((V = a.validateOn) == null ? void 0 : V.value)) || "input";
    b === "lazy" && (b = "input lazy"), b === "eager" && (b = "input eager");
    const P = new Set((b == null ? void 0 : b.split(" ")) ?? []);
    return {
      input: P.has("input"),
      blur: P.has("blur") || P.has("input") || P.has("invalid-input"),
      invalidInput: P.has("invalid-input"),
      lazy: P.has("lazy"),
      eager: P.has("eager")
    };
  }), v = T(() => {
    var b;
    return e.error || (b = e.errorMessages) != null && b.length ? !1 : e.rules.length ? l.value ? s.value.length || d.value.lazy ? null : !0 : !s.value.length : !0;
  }), f = re(!1), m = T(() => ({
    [`${t}--error`]: v.value === !1,
    [`${t}--dirty`]: u.value,
    [`${t}--disabled`]: a.isDisabled.value,
    [`${t}--readonly`]: a.isReadonly.value
  })), h = le("validation"), y = T(() => e.name ?? Ae(n));
  yi(() => {
    var b;
    (b = a.register) == null || b.call(a, {
      id: y.value,
      vm: h,
      validate: A,
      reset: g,
      resetValidation: E
    });
  }), St(() => {
    var b;
    (b = a.unregister) == null || b.call(a, y.value);
  }), xn(async () => {
    var b;
    d.value.lazy || await A(!d.value.eager), (b = a.update) == null || b.call(a, y.value, v.value, c.value);
  }), ct(() => d.value.input || d.value.invalidInput && v.value === !1, () => {
    q(r, () => {
      if (r.value != null)
        A();
      else if (e.focused) {
        const b = q(() => e.focused, (P) => {
          P || A(), b();
        });
      }
    });
  }), ct(() => d.value.blur, () => {
    q(() => e.focused, (b) => {
      b || A();
    });
  }), q([v, c], () => {
    var b;
    (b = a.update) == null || b.call(a, y.value, v.value, c.value);
  });
  async function g() {
    o.value = null, await ge(), await E();
  }
  async function E() {
    l.value = !0, d.value.lazy ? s.value = [] : await A(!d.value.eager);
  }
  async function A() {
    let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    const P = [];
    f.value = !0;
    for (const V of i.value) {
      if (P.length >= Number(e.maxErrors ?? 1))
        break;
      const k = await (typeof V == "function" ? V : () => V)(r.value);
      if (k !== !0) {
        if (k !== !1 && typeof k != "string") {
          console.warn(`${k} is not a valid value. Rule functions must return boolean true or a string.`);
          continue;
        }
        P.push(k || "");
      }
    }
    return s.value = P, f.value = !1, l.value = b, s.value;
  }
  return {
    errorMessages: c,
    isDirty: u,
    isDisabled: a.isDisabled,
    isReadonly: a.isReadonly,
    isPristine: l,
    isValid: v,
    isValidating: f,
    reset: g,
    resetValidation: E,
    validate: A,
    validationClasses: m
  };
}
const cl = $({
  id: String,
  appendIcon: he,
  baseColor: String,
  centerAffix: {
    type: Boolean,
    default: !0
  },
  color: String,
  glow: Boolean,
  iconColor: [Boolean, String],
  prependIcon: he,
  hideDetails: [Boolean, String],
  hideSpinButtons: Boolean,
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (e) => ["horizontal", "vertical"].includes(e)
  },
  "onClick:prepend": ot(),
  "onClick:append": ot(),
  ...te(),
  ...kt(),
  ...ms(Ot(), ["maxWidth", "minWidth", "width"]),
  ...Ee(),
  ...Nv()
}, "VInput"), fi = Y()({
  name: "VInput",
  props: {
    ...cl()
  },
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      emit: r
    } = t;
    const {
      densityClasses: a
    } = tn(e), {
      dimensionStyles: i
    } = It(e), {
      themeClasses: s
    } = ke(e), {
      rtlClasses: l
    } = on(), {
      InputIcon: u
    } = il(e), c = In(), d = T(() => e.id || `input-${c}`), {
      errorMessages: v,
      isDirty: f,
      isDisabled: m,
      isReadonly: h,
      isPristine: y,
      isValid: g,
      isValidating: E,
      reset: A,
      resetValidation: b,
      validate: P,
      validationClasses: V
    } = Lv(e, "v-input", d), C = T(() => {
      var B;
      return (B = e.errorMessages) != null && B.length || !y.value && v.value.length ? v.value : e.hint && (e.persistentHint || e.focused) ? e.hint : e.messages;
    }), k = F(() => C.value.length > 0), N = F(() => !e.hideDetails || e.hideDetails === "auto" && (k.value || !!o.details)), I = T(() => N.value ? `${d.value}-messages` : void 0), _ = T(() => ({
      id: d,
      messagesId: I,
      isDirty: f,
      isDisabled: m,
      isReadonly: h,
      isPristine: y,
      isValid: g,
      isValidating: E,
      hasDetails: N,
      reset: A,
      resetValidation: b,
      validate: P
    })), w = F(() => e.error || e.disabled ? void 0 : e.focused ? e.color : e.baseColor), x = F(() => {
      if (e.iconColor)
        return e.iconColor === !0 ? w.value : e.iconColor;
    });
    return Q(() => {
      var M, R, H, U;
      const B = !!(o.prepend || e.prependIcon), L = !!(o.append || e.appendIcon);
      return O("div", {
        class: K(["v-input", `v-input--${e.direction}`, {
          "v-input--center-affix": e.centerAffix,
          "v-input--focused": e.focused,
          "v-input--glow": e.glow,
          "v-input--hide-spin-buttons": e.hideSpinButtons
        }, a.value, s.value, l.value, V.value, e.class]),
        style: J([i.value, e.style])
      }, [B && O("div", {
        key: "prepend",
        class: "v-input__prepend"
      }, [(M = o.prepend) == null ? void 0 : M.call(o, _.value), e.prependIcon && S(u, {
        key: "prepend-icon",
        name: "prepend",
        color: x.value
      }, null)]), o.default && O("div", {
        class: "v-input__control"
      }, [(R = o.default) == null ? void 0 : R.call(o, _.value)]), L && O("div", {
        key: "append",
        class: "v-input__append"
      }, [e.appendIcon && S(u, {
        key: "append-icon",
        name: "append",
        color: x.value
      }, null), (H = o.append) == null ? void 0 : H.call(o, _.value)]), N.value && O("div", {
        id: I.value,
        class: "v-input__details",
        role: "alert",
        "aria-live": "polite"
      }, [S(Dv, {
        active: k.value,
        messages: C.value
      }, {
        message: o.message
      }), (U = o.details) == null ? void 0 : U.call(o, _.value)])]);
    }), {
      reset: A,
      resetValidation: b,
      validate: P,
      isValid: g,
      errorMessages: v
    };
  }
});
function Fv(e) {
  function t(n, o) {
    var r, a;
    !e.autofocus || !n || (a = (r = o[0].target) == null ? void 0 : r.focus) == null || a.call(r);
  }
  return {
    onIntersect: t
  };
}
const $v = ["color", "file", "time", "date", "datetime-local", "week", "month"], Mv = $({
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: [Number, Function],
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  role: String,
  type: {
    type: String,
    default: "text"
  },
  modelModifiers: Object,
  ...cl(),
  ...ul()
}, "VTextField"), vi = Y()({
  name: "VTextField",
  directives: {
    vIntersect: kn
  },
  inheritAttrs: !1,
  props: Mv(),
  emits: {
    "click:control": (e) => !0,
    "mousedown:control": (e) => !0,
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: o,
      slots: r
    } = t;
    const a = Ge(e, "modelValue"), {
      isFocused: i,
      focus: s,
      blur: l
    } = ll(e), {
      onIntersect: u
    } = Fv(e), c = T(() => typeof e.counterValue == "function" ? e.counterValue(a.value) : typeof e.counterValue == "number" ? e.counterValue : (a.value ?? "").toString().length), d = T(() => {
      if (n.maxlength) return n.maxlength;
      if (!(!e.counter || typeof e.counter != "number" && typeof e.counter != "string"))
        return e.counter;
    }), v = T(() => ["plain", "underlined"].includes(e.variant)), f = j(), m = j(), h = j(), y = T(() => $v.includes(e.type) || e.persistentPlaceholder || i.value || e.active);
    function g() {
      i.value || s(), ge(() => {
        h.value !== document.activeElement && ge(() => {
          var V;
          return (V = h.value) == null ? void 0 : V.focus();
        });
      });
    }
    function E(V) {
      o("mousedown:control", V), V.target !== h.value && (g(), V.preventDefault());
    }
    function A(V) {
      o("click:control", V);
    }
    function b(V, C) {
      V.stopPropagation(), g(), ge(() => {
        a.value = null, C(), bs(e["onClick:clear"], V);
      });
    }
    function P(V) {
      var k;
      const C = V.target;
      if (a.value = C.value, (k = e.modelModifiers) != null && k.trim && ["text", "search", "password", "tel", "url"].includes(e.type)) {
        const N = [C.selectionStart, C.selectionEnd];
        ge(() => {
          C.selectionStart = N[0], C.selectionEnd = N[1];
        });
      }
    }
    return Q(() => {
      const V = !!(r.counter || e.counter !== !1 && e.counter != null), C = !!(V || r.details), [k, N] = _d(n), {
        modelValue: I,
        ..._
      } = fi.filterProps(e), w = di.filterProps(e);
      return S(fi, ne({
        ref: f,
        modelValue: a.value,
        "onUpdate:modelValue": (x) => a.value = x,
        class: ["v-text-field", {
          "v-text-field--prefixed": e.prefix,
          "v-text-field--suffixed": e.suffix,
          "v-input--plain-underlined": v.value
        }, e.class],
        style: e.style
      }, k, _, {
        centerAffix: !v.value,
        focused: i.value
      }), {
        ...r,
        default: (x) => {
          let {
            id: B,
            isDisabled: L,
            isDirty: M,
            isReadonly: R,
            isValid: H,
            hasDetails: U,
            reset: z
          } = x;
          return S(di, ne({
            ref: m,
            onMousedown: E,
            onClick: A,
            "onClick:clear": (X) => b(X, z),
            "onClick:prependInner": e["onClick:prependInner"],
            "onClick:appendInner": e["onClick:appendInner"],
            role: e.role
          }, w, {
            id: B.value,
            active: y.value || M.value,
            dirty: M.value || e.dirty,
            disabled: L.value,
            focused: i.value,
            details: U.value,
            error: H.value === !1
          }), {
            ...r,
            default: (X) => {
              let {
                props: {
                  class: ee,
                  ...oe
                }
              } = X;
              const de = We(O("input", ne({
                ref: h,
                value: a.value,
                onInput: P,
                autofocus: e.autofocus,
                readonly: R.value,
                disabled: L.value,
                name: e.name,
                placeholder: e.placeholder,
                size: 1,
                type: e.type,
                onFocus: g,
                onBlur: l
              }, oe, N), null), [[kn, {
                handler: u
              }, null, {
                once: !0
              }]]);
              return O(xe, null, [e.prefix && O("span", {
                class: "v-text-field__prefix"
              }, [O("span", {
                class: "v-text-field__prefix__text"
              }, [e.prefix])]), r.default ? O("div", {
                class: K(ee),
                "data-no-activator": ""
              }, [r.default(), de]) : bl(de, {
                class: ee
              }), e.suffix && O("span", {
                class: "v-text-field__suffix"
              }, [O("span", {
                class: "v-text-field__suffix__text"
              }, [e.suffix])])]);
            }
          });
        },
        details: C ? (x) => {
          var B;
          return O(xe, null, [(B = r.details) == null ? void 0 : B.call(r, x), V && O(xe, null, [O("span", null, null), S(Ov, {
            active: e.persistentCounter || i.value,
            value: c.value,
            max: d.value,
            disabled: e.disabled
          }, r.counter)])]);
        } : void 0
      });
    }), ur({}, f, m, h);
  }
}), Uv = {
  key: 0,
  class: "text-center mt-6"
}, jv = { class: "text-body-2" }, zv = {
  href: "#",
  class: "text-decoration-none"
}, Hv = { class: "d-flex align-center justify-center mb-2" }, Wv = { class: "d-flex flex-column ga-3" }, Kv = {
  key: 0,
  class: "text-center mt-6"
}, Gv = {
  href: "#",
  class: "text-decoration-none"
}, qv = {
  __name: "LoginForm",
  props: {
    title: {
      type: String,
      default: ""
    },
    step1: {
      type: Object,
      required: !1,
      default: {
        subtitle: "",
        submitButtonLabel: "Continue",
        registerText: "",
        registerButtonLabel: "",
        emailIcon: "mdi-email-outline"
      }
    },
    step2: {
      type: Object,
      required: !1,
      default: {
        subtitle: "",
        submitButtonLabel: "Login",
        backButtonLabel: "Back",
        loginText: "",
        loginButtonLabel: "",
        accountIcon: "mdi-account-circle",
        passwordVisibleIcon: "mdi-eye",
        passwordHiddenIcon: "mdi-eye-off",
        passwordIcon: "mdi-lock-outline"
      }
    },
    forgotPassword: {
      type: Object,
      required: !1,
      default: {
        text: "",
        buttonLabel: ""
      }
    },
    noSnackBar: {
      type: Boolean,
      required: !1,
      default: !1
    },
    actions: {
      type: Object,
      required: !1,
      default: {}
    }
  },
  emits: ["on-step1-success", "on-step1-failed", "on-step2-success", "on-step2-failed"],
  setup(e, { expose: t, emit: n }) {
    const o = er(), r = se("argonAuthService"), a = n, i = e;
    t({ preLogin: d, login: v });
    const s = T(() => {
      const f = i.step1 || {};
      return f.registerText && f.registerButtonLabel;
    }), l = j(), u = j({
      email: "",
      password: "",
      loading: !1
    }), c = j(!1);
    async function d() {
      if (i.actions.preLogin) {
        i.actions.preLogin(o, u.value.email);
        return;
      }
      try {
        u.value.loading = !0;
        const f = await r.preLogin(u.value.email);
        o.setPreLoginInfo(f), a("on-step1-success", f);
      } catch (f) {
        o.setPreLoginInfo({ id: "", salt: "" });
        let m = f.error ? f.error.message : f;
        f.code === 404 && (m = "User not found or deactivated"), a("on-step1-failed", new Error(m)), i.noSnackBar || l.value.showError(m);
      } finally {
        u.value.loading = !1;
      }
    }
    async function v() {
      if (i.actions.login) {
        i.actions.login(o, u.value.password);
        return;
      }
      try {
        u.value.loading = !0;
        const f = o.preLoginInfo;
        f.rawPassword = u.value.password;
        const m = await r.login(f);
        o.setUser(m), a("on-step2-success", m);
      } catch (f) {
        const m = {
          403: "Wrong email or password",
          423: "Account is locked"
        };
        let h = f.error ? f.error.message : f;
        f && f.code && (h = m[f.code] || h), i.noSnackBar || l.value.showError(h), a("on-step2-failed", new Error(h));
      } finally {
        u.value.loading = !1;
      }
    }
    return (f, m) => (Je(), Nt(Sv, {
      class: "login-container",
      rounded: "",
      elevation: "4"
    }, {
      default: fe(() => [
        S(yv, {
          class: "login-card pa-6",
          variant: "flat",
          width: "500"
        }, {
          default: fe(() => [
            S(tl, null, {
              default: fe(() => [
                S(Zs, { class: "text-center text-h4 mb-4" }, {
                  default: fe(() => [
                    Ie(ue(i.title), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            Ae(o).isPreLoginDone ? Ae(o).isPreLoginDone ? (Je(), Nt(ci, {
              key: 1,
              onSubmit: dr(v, ["prevent"])
            }, {
              default: fe(() => [
                S(No, { class: "text-center mb-6" }, {
                  default: fe(() => [
                    O("div", Hv, [
                      S(je, {
                        color: "primary",
                        class: "mr-2"
                      }, {
                        default: fe(() => [
                          Ie(ue(i.step2.accountIcon), 1)
                        ]),
                        _: 1
                      }),
                      O("span", null, ue(u.value.email), 1)
                    ]),
                    Ie(" " + ue(i.step2.subtitle), 1)
                  ]),
                  _: 1
                }),
                S(vi, {
                  modelValue: u.value.password,
                  "onUpdate:modelValue": m[1] || (m[1] = (h) => u.value.password = h),
                  "append-inner-icon": c.value ? i.step2.passwordHiddenIcon : i.step2.passwordVisibleIcon,
                  type: c.value ? "text" : "password",
                  label: "Password",
                  "prepend-inner-icon": i.step2.passwordIcon,
                  variant: "outlined",
                  autofocus: "",
                  required: "",
                  "onClick:appendInner": m[2] || (m[2] = (h) => c.value = !c.value)
                }, null, 8, ["modelValue", "append-inner-icon", "type", "prepend-inner-icon"]),
                O("div", Wv, [
                  S($t, {
                    block: "",
                    color: "primary",
                    size: "large",
                    loading: u.value.loading,
                    type: "submit"
                  }, {
                    default: fe(() => [
                      Ie(ue(i.step2.submitButtonLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"]),
                  S($t, {
                    variant: "text",
                    disabled: u.value.loading,
                    block: ""
                  }, {
                    default: fe(() => [
                      Ie(ue(i.step2.backButtonLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                i.forgotPassword.text ? (Je(), fr("div", Kv, [
                  Ie(ue(i.forgotPassword.text) + " ", 1),
                  O("a", Gv, ue(i.forgotPassword.buttonLabel), 1)
                ])) : Gn("", !0)
              ]),
              _: 1
            })) : Gn("", !0) : (Je(), Nt(ci, {
              key: 0,
              onSubmit: dr(d, ["prevent"])
            }, {
              default: fe(() => [
                S(No, { class: "text-center mb-6" }, {
                  default: fe(() => [
                    Ie(ue(i.step1.subtitle), 1)
                  ]),
                  _: 1
                }),
                S(vi, {
                  modelValue: u.value.email,
                  "onUpdate:modelValue": m[0] || (m[0] = (h) => u.value.email = h),
                  label: "Email",
                  "prepend-inner-icon": i.step1.emailIcon,
                  variant: "outlined",
                  disabled: u.value.loading,
                  autofocus: "",
                  required: ""
                }, null, 8, ["modelValue", "prepend-inner-icon", "disabled"]),
                S($t, {
                  block: "",
                  color: "primary",
                  size: "large",
                  loading: u.value.loading,
                  type: "submit",
                  class: "mt-6"
                }, {
                  default: fe(() => [
                    Ie(ue(i.step1.submitButtonLabel), 1)
                  ]),
                  _: 1
                }, 8, ["loading"]),
                s.value ? (Je(), fr("div", Uv, [
                  O("span", jv, ue(i.step1.registerText), 1),
                  O("a", zv, ue(i.step1.registerButtonLabel), 1)
                ])) : Gn("", !0)
              ]),
              _: 1
            }))
          ]),
          _: 1
        }),
        S(iv, {
          ref_key: "snackbar",
          ref: l
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, Yv = {
  __name: "LogoutButton",
  emits: ["on-success", "on-failed"],
  setup(e, { emit: t }) {
    const n = er(), o = se("argonAuthService"), r = t, a = El(), i = j(null), s = Lo(), l = {};
    Object.entries(s.vnode.props || {}).forEach(([c, d]) => {
      c.startsWith("on") && c.toLowerCase() !== "onclick" && (l[c] = d);
    });
    const u = async (c) => {
      a.onClick && a.onClick(c);
      try {
        await o.logout(), n.clear(), r("on-success");
      } catch (d) {
        r("on-failed", d);
      }
    };
    return (c, d) => (Je(), Nt(Ae($t), ne({
      ref_key: "btnRef",
      ref: i
    }, Ae(a), Cl(l), { onClick: u }), {
      default: fe(() => [
        Sl(c.$slots, "default", {}, () => [
          d[0] || (d[0] = Ie("Logout"))
        ])
      ]),
      _: 3
    }, 16));
  }
}, Xv = dd(), em = {
  install(e, t = {}) {
    e.use(Xv), e.component("ArgonAuthForm", qv), e.component("ArgonAuthLogoutButton", Yv), e.provide("argonAuthStore", er());
    const n = t.service || zl({
      baseURL: t.baseURL,
      dbName: t.dbName,
      endpoints: t.endpoints
    });
    e.provide("argonAuthService", n);
  }
};
export {
  qv as LoginForm,
  em as Plugin,
  em as default,
  zl as makeService
};
