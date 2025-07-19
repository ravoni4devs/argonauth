import sl from "@ravoni4devs/libcryptus";
import ll from "axios";
import { effectScope as Kt, ref as U, markRaw as Be, toRaw as ot, watch as K, unref as Ce, hasInjectionContext as ul, inject as se, getCurrentInstance as Do, reactive as rt, isRef as Me, isReactive as Ro, toRef as $, nextTick as be, computed as x, getCurrentScope as cl, onScopeDispose as ge, toRefs as io, capitalize as si, watchEffect as lt, shallowRef as Q, Fragment as Ae, warn as Bo, provide as ut, defineComponent as dl, h as Sn, camelize as li, toValue as Ue, createVNode as m, useId as wn, onBeforeUnmount as ct, onMounted as kn, onUpdated as fl, mergeProps as ee, Text as vl, readonly as ui, Transition as Gt, resolveDynamicComponent as ml, withDirectives as je, toDisplayString as ae, TransitionGroup as No, Teleport as gl, vShow as An, resolveDirective as On, createBlock as Rt, openBlock as Ye, withCtx as le, createTextVNode as ke, onBeforeMount as ci, cloneVNode as hl, createCommentVNode as Wn, withModifiers as sr, createElementBlock as lr, createElementVNode as dt, useAttrs as yl, toHandlers as _l, renderSlot as pl } from "vue";
class bl {
  set(t, n) {
    localStorage.setItem(t, n);
  }
  get(t) {
    return localStorage.getItem(t);
  }
}
function El() {
  return new bl();
}
const so = (e, t) => t.some((n) => e instanceof n);
let ur, cr;
function Cl() {
  return ur || (ur = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Sl() {
  return cr || (cr = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const lo = /* @__PURE__ */ new WeakMap(), Kn = /* @__PURE__ */ new WeakMap(), In = /* @__PURE__ */ new WeakMap();
function wl(e) {
  const t = new Promise((n, o) => {
    const r = () => {
      e.removeEventListener("success", a), e.removeEventListener("error", i);
    }, a = () => {
      n(Je(e.result)), r();
    }, i = () => {
      o(e.error), r();
    };
    e.addEventListener("success", a), e.addEventListener("error", i);
  });
  return In.set(t, e), t;
}
function kl(e) {
  if (lo.has(e))
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
  lo.set(e, t);
}
let uo = {
  get(e, t, n) {
    if (e instanceof IDBTransaction) {
      if (t === "done")
        return lo.get(e);
      if (t === "store")
        return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
    }
    return Je(e[t]);
  },
  set(e, t, n) {
    return e[t] = n, !0;
  },
  has(e, t) {
    return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e;
  }
};
function di(e) {
  uo = e(uo);
}
function Al(e) {
  return Sl().includes(e) ? function(...t) {
    return e.apply(co(this), t), Je(this.request);
  } : function(...t) {
    return Je(e.apply(co(this), t));
  };
}
function Ol(e) {
  return typeof e == "function" ? Al(e) : (e instanceof IDBTransaction && kl(e), so(e, Cl()) ? new Proxy(e, uo) : e);
}
function Je(e) {
  if (e instanceof IDBRequest)
    return wl(e);
  if (Kn.has(e))
    return Kn.get(e);
  const t = Ol(e);
  return t !== e && (Kn.set(e, t), In.set(t, e)), t;
}
const co = (e) => In.get(e);
function Il(e, t, { blocked: n, upgrade: o, blocking: r, terminated: a } = {}) {
  const i = indexedDB.open(e, t), s = Je(i);
  return o && i.addEventListener("upgradeneeded", (l) => {
    o(Je(i.result), l.oldVersion, l.newVersion, Je(i.transaction), l);
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
const xl = ["get", "getKey", "getAll", "getAllKeys", "count"], Tl = ["put", "add", "delete", "clear"], Gn = /* @__PURE__ */ new Map();
function dr(e, t) {
  if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string"))
    return;
  if (Gn.get(t))
    return Gn.get(t);
  const n = t.replace(/FromIndex$/, ""), o = t !== n, r = Tl.includes(n);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(n in (o ? IDBIndex : IDBObjectStore).prototype) || !(r || xl.includes(n))
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
  return Gn.set(t, a), a;
}
di((e) => ({
  ...e,
  get: (t, n, o) => dr(t, n) || e.get(t, n, o),
  has: (t, n) => !!dr(t, n) || e.has(t, n)
}));
const Pl = ["continue", "continuePrimaryKey", "advance"], fr = {}, fo = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakMap(), Vl = {
  get(e, t) {
    if (!Pl.includes(t))
      return e[t];
    let n = fr[t];
    return n || (n = fr[t] = function(...o) {
      fo.set(this, fi.get(this)[t](...o));
    }), n;
  }
};
async function* Dl(...e) {
  let t = this;
  if (t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)
    return;
  t = t;
  const n = new Proxy(t, Vl);
  for (fi.set(n, t), In.set(n, co(t)); t; )
    yield n, t = await (fo.get(n) || t.continue()), fo.delete(n);
}
function vr(e, t) {
  return t === Symbol.asyncIterator && so(e, [IDBIndex, IDBObjectStore, IDBCursor]) || t === "iterate" && so(e, [IDBIndex, IDBObjectStore]);
}
di((e) => ({
  ...e,
  get(t, n, o) {
    return vr(t, n) ? Dl : e.get(t, n, o);
  },
  has(t, n) {
    return vr(t, n) || e.has(t, n);
  }
}));
const It = {
  ReadOnly: "readonly",
  Write: "readwrite"
};
class Rl {
  constructor(t) {
    this._params = t, this._table = t.table, this._db = null;
  }
  setTable(t) {
    this._table = t;
  }
  async set(t) {
    const n = await this.tx(It.Write);
    t.id = t.id || t.user.id, await n.objectStore(this._table).put(t);
  }
  async getById(t) {
    return await (await this.tx(It.ReadOnly)).objectStore(this._table).get(t);
  }
  async get({ index: t, key: n }) {
    return await this.tx(It.ReadOnly).getFromIndex(this._table, t, n);
  }
  async removeById(t) {
    return await (await this.tx(It.Write)).objectStore(this._table).delete(t);
  }
  async tx(t) {
    const n = t || It.Write;
    return (await this.db()).transaction(this._table, n);
  }
  async db() {
    return this._db || await this._createdb(this._params), this._db;
  }
  async _createdb({ name: t = "", table: n = "", keyPath: o = "id", indexes: r = [] }) {
    const a = await Il(t, 1, {
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
function Bl(e) {
  return new Rl(e);
}
function mr(e) {
  const t = ll.create(e);
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
class Nl {
  constructor(t = {}) {
    this.params = t, this.$axios = mr(t);
  }
  withToken(t) {
    return t ? this.withHeaders({ Authorization: `Bearer ${t}` }) : this.$axios;
  }
  withHeaders(t) {
    const n = mr(this.params), { common: o } = n.defaults.headers;
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
function Ll(e) {
  return new Nl(e);
}
const gr = "user_id";
class Fl {
  constructor({ httpClient: t, indexdb: n, storage: o, endpoints: r }) {
    this.$db = n, this.$httpClient = t, this.$storage = o, this.$cryptus = new sl(), this.$endpoints = r;
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
    return await this.$db.set(a), await this.$storage.set(gr, a.id), a;
  }
  async getCurrentAccount() {
    const t = await this.$storage.get(gr);
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
function $l({ dbName: e = "argonauth", baseURL: t = "", endpoints: n = {} } = {}) {
  const o = El(), r = Bl({ name: e, table: "argonauth" }), a = Ll({ baseURL: t, withCredentials: !0 });
  return new Fl({ storage: o, indexdb: r, httpClient: a, endpoints: n });
}
var Ml = Object.create, vi = Object.defineProperty, Ul = Object.getOwnPropertyDescriptor, Lo = Object.getOwnPropertyNames, jl = Object.getPrototypeOf, Hl = Object.prototype.hasOwnProperty, zl = (e, t) => function() {
  return e && (t = (0, e[Lo(e)[0]])(e = 0)), t;
}, Wl = (e, t) => function() {
  return t || (0, e[Lo(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, Kl = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of Lo(t))
      !Hl.call(e, r) && r !== n && vi(e, r, { get: () => t[r], enumerable: !(o = Ul(t, r)) || o.enumerable });
  return e;
}, Gl = (e, t, n) => (n = e != null ? Ml(jl(e)) : {}, Kl(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  vi(n, "default", { value: e, enumerable: !0 }),
  e
)), qt = zl({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), ql = Wl({
  "../../node_modules/.pnpm/rfdc@1.4.1/node_modules/rfdc/index.js"(e, t) {
    qt(), t.exports = o;
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
        const f = Object.keys(d), g = new Array(f.length);
        for (let y = 0; y < f.length; y++) {
          const _ = f[y], h = d[_];
          typeof h != "object" || h === null ? g[_] = h : h.constructor !== Object && (s = i.get(h.constructor)) ? g[_] = s(h, v) : ArrayBuffer.isView(h) ? g[_] = n(h) : g[_] = v(h);
        }
        return g;
      }
      function u(d) {
        if (typeof d != "object" || d === null) return d;
        if (Array.isArray(d)) return l(d, u);
        if (d.constructor !== Object && (s = i.get(d.constructor)))
          return s(d, u);
        const v = {};
        for (const f in d) {
          if (Object.hasOwnProperty.call(d, f) === !1) continue;
          const g = d[f];
          typeof g != "object" || g === null ? v[f] = g : g.constructor !== Object && (s = i.get(g.constructor)) ? v[f] = s(g, u) : ArrayBuffer.isView(g) ? v[f] = n(g) : v[f] = u(g);
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
          const g = d[f];
          typeof g != "object" || g === null ? v[f] = g : g.constructor !== Object && (s = i.get(g.constructor)) ? v[f] = s(g, c) : ArrayBuffer.isView(g) ? v[f] = n(g) : v[f] = c(g);
        }
        return v;
      }
    }
    function r(a) {
      const i = [], s = [], l = /* @__PURE__ */ new Map();
      if (l.set(Date, (f) => new Date(f)), l.set(Map, (f, g) => new Map(c(Array.from(f), g))), l.set(Set, (f, g) => new Set(c(Array.from(f), g))), a.constructorHandlers)
        for (const f of a.constructorHandlers)
          l.set(f[0], f[1]);
      let u = null;
      return a.proto ? v : d;
      function c(f, g) {
        const y = Object.keys(f), _ = new Array(y.length);
        for (let h = 0; h < y.length; h++) {
          const C = y[h], b = f[C];
          if (typeof b != "object" || b === null)
            _[C] = b;
          else if (b.constructor !== Object && (u = l.get(b.constructor)))
            _[C] = u(b, g);
          else if (ArrayBuffer.isView(b))
            _[C] = n(b);
          else {
            const A = i.indexOf(b);
            A !== -1 ? _[C] = s[A] : _[C] = g(b);
          }
        }
        return _;
      }
      function d(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return c(f, d);
        if (f.constructor !== Object && (u = l.get(f.constructor)))
          return u(f, d);
        const g = {};
        i.push(f), s.push(g);
        for (const y in f) {
          if (Object.hasOwnProperty.call(f, y) === !1) continue;
          const _ = f[y];
          if (typeof _ != "object" || _ === null)
            g[y] = _;
          else if (_.constructor !== Object && (u = l.get(_.constructor)))
            g[y] = u(_, d);
          else if (ArrayBuffer.isView(_))
            g[y] = n(_);
          else {
            const h = i.indexOf(_);
            h !== -1 ? g[y] = s[h] : g[y] = d(_);
          }
        }
        return i.pop(), s.pop(), g;
      }
      function v(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return c(f, v);
        if (f.constructor !== Object && (u = l.get(f.constructor)))
          return u(f, v);
        const g = {};
        i.push(f), s.push(g);
        for (const y in f) {
          const _ = f[y];
          if (typeof _ != "object" || _ === null)
            g[y] = _;
          else if (_.constructor !== Object && (u = l.get(_.constructor)))
            g[y] = u(_, v);
          else if (ArrayBuffer.isView(_))
            g[y] = n(_);
          else {
            const h = i.indexOf(_);
            h !== -1 ? g[y] = s[h] : g[y] = v(_);
          }
        }
        return i.pop(), s.pop(), g;
      }
    }
  }
});
qt();
qt();
qt();
var mi = typeof navigator < "u", T = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {};
typeof T.chrome < "u" && T.chrome.devtools;
mi && (T.self, T.top);
var hr;
typeof navigator < "u" && ((hr = navigator.userAgent) == null || hr.toLowerCase().includes("electron"));
qt();
var Yl = Gl(ql()), Xl = /(?:^|[-_/])(\w)/g;
function Zl(e, t) {
  return t ? t.toUpperCase() : "";
}
function Jl(e) {
  return e && `${e}`.replace(Xl, Zl);
}
function Ql(e, t) {
  let n = e.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  n.endsWith(`index${t}`) && (n = n.replace(`/index${t}`, t));
  const o = n.lastIndexOf("/"), r = n.substring(o + 1);
  {
    const a = r.lastIndexOf(t);
    return r.substring(0, a);
  }
}
var yr = (0, Yl.default)({ circles: !0 });
const eu = {
  trailing: !0
};
function _t(e, t = 25, n = {}) {
  if (n = { ...eu, ...n }, !Number.isFinite(t))
    throw new TypeError("Expected `wait` to be a finite number");
  let o, r, a = [], i, s;
  const l = (u, c) => (i = tu(e, u, c), i.finally(() => {
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
async function tu(e, t, n) {
  return await e.apply(t, n);
}
function vo(e, t = {}, n) {
  for (const o in e) {
    const r = e[o], a = n ? `${n}:${o}` : o;
    typeof r == "object" && r !== null ? vo(r, t, a) : typeof r == "function" && (t[a] = r);
  }
  return t;
}
const nu = { run: (e) => e() }, ou = () => nu, gi = typeof console.createTask < "u" ? console.createTask : ou;
function ru(e, t) {
  const n = t.shift(), o = gi(n);
  return e.reduce(
    (r, a) => r.then(() => o.run(() => a(...t))),
    Promise.resolve()
  );
}
function au(e, t) {
  const n = t.shift(), o = gi(n);
  return Promise.all(e.map((r) => o.run(() => r(...t))));
}
function qn(e, t) {
  for (const n of [...e])
    n(t);
}
class iu {
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
    const n = vo(t), o = Object.keys(n).map(
      (r) => this.hook(r, n[r])
    );
    return () => {
      for (const r of o.splice(0, o.length))
        r();
    };
  }
  removeHooks(t) {
    const n = vo(t);
    for (const o in n)
      this.removeHook(o, n[o]);
  }
  removeAllHooks() {
    for (const t in this._hooks)
      delete this._hooks[t];
  }
  callHook(t, ...n) {
    return n.unshift(t), this.callHookWith(ru, t, ...n);
  }
  callHookParallel(t, ...n) {
    return n.unshift(t), this.callHookWith(au, t, ...n);
  }
  callHookWith(t, n, ...o) {
    const r = this._before || this._after ? { name: n, args: o, context: {} } : void 0;
    this._before && qn(this._before, r);
    const a = t(
      n in this._hooks ? [...this._hooks[n]] : [],
      o
    );
    return a instanceof Promise ? a.finally(() => {
      this._after && r && qn(this._after, r);
    }) : (this._after && r && qn(this._after, r), a);
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
function hi() {
  return new iu();
}
var su = Object.create, yi = Object.defineProperty, lu = Object.getOwnPropertyDescriptor, Fo = Object.getOwnPropertyNames, uu = Object.getPrototypeOf, cu = Object.prototype.hasOwnProperty, du = (e, t) => function() {
  return e && (t = (0, e[Fo(e)[0]])(e = 0)), t;
}, _i = (e, t) => function() {
  return t || (0, e[Fo(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, fu = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of Fo(t))
      !cu.call(e, r) && r !== n && yi(e, r, { get: () => t[r], enumerable: !(o = lu(t, r)) || o.enumerable });
  return e;
}, vu = (e, t, n) => (n = e != null ? su(uu(e)) : {}, fu(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  yi(n, "default", { value: e, enumerable: !0 }),
  e
)), E = du({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), mu = _i({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/lib/speakingurl.js"(e, t) {
    E(), function(n) {
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
      }, l = [";", "?", ":", "@", "&", "=", "+", "$", ",", "/"].join(""), u = [";", "?", ":", "@", "&", "=", "+", "$", ","].join(""), c = [".", "!", "~", "*", "'", "(", ")"].join(""), d = function(_, h) {
        var C = "-", b = "", A = "", R = !0, P = {}, S, k, B, O, p, w, I, V, F, N, D, H, M, j, X = "";
        if (typeof _ != "string")
          return "";
        if (typeof h == "string" && (C = h), I = s.en, V = i.en, typeof h == "object") {
          S = h.maintainCase || !1, P = h.custom && typeof h.custom == "object" ? h.custom : P, B = +h.truncate > 1 && h.truncate || !1, O = h.uric || !1, p = h.uricNoSlash || !1, w = h.mark || !1, R = !(h.symbols === !1 || h.lang === !1), C = h.separator || C, O && (X += l), p && (X += u), w && (X += c), I = h.lang && s[h.lang] && R ? s[h.lang] : R ? s.en : {}, V = h.lang && i[h.lang] ? i[h.lang] : h.lang === !1 || h.lang === !0 ? {} : i.en, h.titleCase && typeof h.titleCase.length == "number" && Array.prototype.toString.call(h.titleCase) ? (h.titleCase.forEach(function(Z) {
            P[Z + ""] = Z + "";
          }), k = !0) : k = !!h.titleCase, h.custom && typeof h.custom.length == "number" && Array.prototype.toString.call(h.custom) && h.custom.forEach(function(Z) {
            P[Z + ""] = Z + "";
          }), Object.keys(P).forEach(function(Z) {
            var te;
            Z.length > 1 ? te = new RegExp("\\b" + f(Z) + "\\b", "gi") : te = new RegExp(f(Z), "gi"), _ = _.replace(te, P[Z]);
          });
          for (D in P)
            X += D;
        }
        for (X += C, X = f(X), _ = _.replace(/(^\s+|\s+$)/g, ""), M = !1, j = !1, N = 0, H = _.length; N < H; N++)
          D = _[N], g(D, P) ? M = !1 : V[D] ? (D = M && V[D].match(/[A-Za-z0-9]/) ? " " + V[D] : V[D], M = !1) : D in o ? (N + 1 < H && r.indexOf(_[N + 1]) >= 0 ? (A += D, D = "") : j === !0 ? (D = a[A] + o[D], A = "") : D = M && o[D].match(/[A-Za-z0-9]/) ? " " + o[D] : o[D], M = !1, j = !1) : D in a ? (A += D, D = "", N === H - 1 && (D = a[A]), j = !0) : /* process symbol chars */ I[D] && !(O && l.indexOf(D) !== -1) && !(p && u.indexOf(D) !== -1) ? (D = M || b.substr(-1).match(/[A-Za-z0-9]/) ? C + I[D] : I[D], D += _[N + 1] !== void 0 && _[N + 1].match(/[A-Za-z0-9]/) ? C : "", M = !0) : (j === !0 ? (D = a[A] + D, A = "", j = !1) : M && (/[A-Za-z0-9]/.test(D) || b.substr(-1).match(/A-Za-z0-9]/)) && (D = " " + D), M = !1), b += D.replace(new RegExp("[^\\w\\s" + X + "_-]", "g"), C);
        return k && (b = b.replace(/(\w)(\S*)/g, function(Z, te, _e) {
          var We = te.toUpperCase() + (_e !== null ? _e : "");
          return Object.keys(P).indexOf(We.toLowerCase()) < 0 ? We : We.toLowerCase();
        })), b = b.replace(/\s+/g, C).replace(new RegExp("\\" + C + "+", "g"), C).replace(new RegExp("(^\\" + C + "+|\\" + C + "+$)", "g"), ""), B && b.length > B && (F = b.charAt(B) === C, b = b.slice(0, B), F || (b = b.slice(0, b.lastIndexOf(C)))), !S && !k && (b = b.toLowerCase()), b;
      }, v = function(_) {
        return function(C) {
          return d(C, _);
        };
      }, f = function(_) {
        return _.replace(/[-\\^$*+?.()|[\]{}\/]/g, "\\$&");
      }, g = function(y, _) {
        for (var h in _)
          if (_[h] === y)
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
}), gu = _i({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js"(e, t) {
    E(), t.exports = mu();
  }
});
E();
E();
E();
E();
E();
E();
E();
E();
function hu(e) {
  var t;
  const n = e.name || e._componentTag || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || e.__name;
  return n === "index" && ((t = e.__file) != null && t.endsWith("index.vue")) ? "" : n;
}
function yu(e) {
  const t = e.__file;
  if (t)
    return Jl(Ql(t, ".vue"));
}
function _r(e, t) {
  return e.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = t, t;
}
function $o(e) {
  if (e.__VUE_DEVTOOLS_NEXT_APP_RECORD__)
    return e.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  if (e.root)
    return e.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
function pi(e) {
  var t, n;
  const o = (t = e.subTree) == null ? void 0 : t.type, r = $o(e);
  return r ? ((n = r == null ? void 0 : r.types) == null ? void 0 : n.Fragment) === o : !1;
}
function xn(e) {
  var t, n, o;
  const r = hu((e == null ? void 0 : e.type) || {});
  if (r)
    return r;
  if ((e == null ? void 0 : e.root) === e)
    return "Root";
  for (const i in (n = (t = e.parent) == null ? void 0 : t.type) == null ? void 0 : n.components)
    if (e.parent.type.components[i] === (e == null ? void 0 : e.type))
      return _r(e, i);
  for (const i in (o = e.appContext) == null ? void 0 : o.components)
    if (e.appContext.components[i] === (e == null ? void 0 : e.type))
      return _r(e, i);
  const a = yu((e == null ? void 0 : e.type) || {});
  return a || "Anonymous Component";
}
function _u(e) {
  var t, n, o;
  const r = (o = (n = (t = e == null ? void 0 : e.appContext) == null ? void 0 : t.app) == null ? void 0 : n.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__) != null ? o : 0, a = e === (e == null ? void 0 : e.root) ? "root" : e.uid;
  return `${r}:${a}`;
}
function mo(e, t) {
  return t = t || `${e.id}:root`, e.instanceMap.get(t) || e.instanceMap.get(":root");
}
function pu() {
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
var nn;
function bu(e) {
  return nn || (nn = document.createRange()), nn.selectNode(e), nn.getBoundingClientRect();
}
function Eu(e) {
  const t = pu();
  if (!e.children)
    return t;
  for (let n = 0, o = e.children.length; n < o; n++) {
    const r = e.children[n];
    let a;
    if (r.component)
      a = at(r.component);
    else if (r.el) {
      const i = r.el;
      i.nodeType === 1 || i.getBoundingClientRect ? a = i.getBoundingClientRect() : i.nodeType === 3 && i.data.trim() && (a = bu(i));
    }
    a && Cu(t, a);
  }
  return t;
}
function Cu(e, t) {
  return (!e.top || t.top < e.top) && (e.top = t.top), (!e.bottom || t.bottom > e.bottom) && (e.bottom = t.bottom), (!e.left || t.left < e.left) && (e.left = t.left), (!e.right || t.right > e.right) && (e.right = t.right), e;
}
var pr = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function at(e) {
  const t = e.subTree.el;
  return typeof window > "u" ? pr : pi(e) ? Eu(e.subTree) : (t == null ? void 0 : t.nodeType) === 1 ? t == null ? void 0 : t.getBoundingClientRect() : e.subTree.component ? at(e.subTree.component) : pr;
}
E();
function Mo(e) {
  return pi(e) ? Su(e.subTree) : e.subTree ? [e.subTree.el] : [];
}
function Su(e) {
  if (!e.children)
    return [];
  const t = [];
  return e.children.forEach((n) => {
    n.component ? t.push(...Mo(n.component)) : n != null && n.el && t.push(n.el);
  }), t;
}
var bi = "__vue-devtools-component-inspector__", Ei = "__vue-devtools-component-inspector__card__", Ci = "__vue-devtools-component-inspector__name__", Si = "__vue-devtools-component-inspector__indicator__", wi = {
  display: "block",
  zIndex: 2147483640,
  position: "fixed",
  backgroundColor: "#42b88325",
  border: "1px solid #42b88350",
  borderRadius: "5px",
  transition: "all 0.1s ease-in",
  pointerEvents: "none"
}, wu = {
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
}, ku = {
  display: "inline-block",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  opacity: 0.7
};
function Ct() {
  return document.getElementById(bi);
}
function Au() {
  return document.getElementById(Ei);
}
function Ou() {
  return document.getElementById(Si);
}
function Iu() {
  return document.getElementById(Ci);
}
function Uo(e) {
  return {
    left: `${Math.round(e.left * 100) / 100}px`,
    top: `${Math.round(e.top * 100) / 100}px`,
    width: `${Math.round(e.width * 100) / 100}px`,
    height: `${Math.round(e.height * 100) / 100}px`
  };
}
function jo(e) {
  var t;
  const n = document.createElement("div");
  n.id = (t = e.elementId) != null ? t : bi, Object.assign(n.style, {
    ...wi,
    ...Uo(e.bounds),
    ...e.style
  });
  const o = document.createElement("span");
  o.id = Ei, Object.assign(o.style, {
    ...wu,
    top: e.bounds.top < 35 ? 0 : "-35px"
  });
  const r = document.createElement("span");
  r.id = Ci, r.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`;
  const a = document.createElement("i");
  return a.id = Si, a.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`, Object.assign(a.style, ku), o.appendChild(r), o.appendChild(a), n.appendChild(o), document.body.appendChild(n), n;
}
function Ho(e) {
  const t = Ct(), n = Au(), o = Iu(), r = Ou();
  t && (Object.assign(t.style, {
    ...wi,
    ...Uo(e.bounds)
  }), Object.assign(n.style, {
    top: e.bounds.top < 35 ? 0 : "-35px"
  }), o.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`, r.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`);
}
function xu(e) {
  const t = at(e);
  if (!t.width && !t.height)
    return;
  const n = xn(e);
  Ct() ? Ho({ bounds: t, name: n }) : jo({ bounds: t, name: n });
}
function ki() {
  const e = Ct();
  e && (e.style.display = "none");
}
var go = null;
function ho(e) {
  const t = e.target;
  if (t) {
    const n = t.__vueParentComponent;
    if (n && (go = n, n.vnode.el)) {
      const r = at(n), a = xn(n);
      Ct() ? Ho({ bounds: r, name: a }) : jo({ bounds: r, name: a });
    }
  }
}
function Tu(e, t) {
  if (e.preventDefault(), e.stopPropagation(), go) {
    const n = _u(go);
    t(n);
  }
}
var gn = null;
function Pu() {
  ki(), window.removeEventListener("mouseover", ho), window.removeEventListener("click", gn, !0), gn = null;
}
function Vu() {
  return window.addEventListener("mouseover", ho), new Promise((e) => {
    function t(n) {
      n.preventDefault(), n.stopPropagation(), Tu(n, (o) => {
        window.removeEventListener("click", t, !0), gn = null, window.removeEventListener("mouseover", ho);
        const r = Ct();
        r && (r.style.display = "none"), e(JSON.stringify({ id: o }));
      });
    }
    gn = t, window.addEventListener("click", t, !0);
  });
}
function Du(e) {
  const t = mo(ue.value, e.id);
  if (t) {
    const [n] = Mo(t);
    if (typeof n.scrollIntoView == "function")
      n.scrollIntoView({
        behavior: "smooth"
      });
    else {
      const o = at(t), r = document.createElement("div"), a = {
        ...Uo(o),
        position: "absolute"
      };
      Object.assign(r.style, a), document.body.appendChild(r), r.scrollIntoView({
        behavior: "smooth"
      }), setTimeout(() => {
        document.body.removeChild(r);
      }, 2e3);
    }
    setTimeout(() => {
      const o = at(t);
      if (o.width || o.height) {
        const r = xn(t), a = Ct();
        a ? Ho({ ...e, name: r, bounds: o }) : jo({ ...e, name: r, bounds: o }), setTimeout(() => {
          a && (a.style.display = "none");
        }, 1500);
      }
    }, 1200);
  }
}
E();
var br, Er;
(Er = (br = T).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__) != null || (br.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = !0);
function Ru(e) {
  let t = 0;
  const n = setInterval(() => {
    T.__VUE_INSPECTOR__ && (clearInterval(n), t += 30, e()), t >= /* 5s */
    5e3 && clearInterval(n);
  }, 30);
}
function Bu() {
  const e = T.__VUE_INSPECTOR__, t = e.openInEditor;
  e.openInEditor = async (...n) => {
    e.disable(), t(...n);
  };
}
function Nu() {
  return new Promise((e) => {
    function t() {
      Bu(), e(T.__VUE_INSPECTOR__);
    }
    T.__VUE_INSPECTOR__ ? t() : Ru(() => {
      t();
    });
  });
}
E();
E();
function Lu(e) {
  return !!(e && e.__v_isReadonly);
}
function Ai(e) {
  return Lu(e) ? Ai(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Yn(e) {
  return !!(e && e.__v_isRef === !0);
}
function Tt(e) {
  const t = e && e.__v_raw;
  return t ? Tt(t) : e;
}
var Fu = class {
  constructor() {
    this.refEditor = new $u();
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
      if ((e.remove || e.newKey) && (Array.isArray(t) ? t.splice(n, 1) : Tt(t) instanceof Map ? t.delete(n) : Tt(t) instanceof Set ? t.delete(Array.from(t.values())[n]) : Reflect.deleteProperty(t, n)), !e.remove) {
        const r = t[e.newKey || n];
        this.refEditor.isRef(r) ? this.refEditor.set(r, o) : Tt(t) instanceof Map ? t.set(e.newKey || n, o) : Tt(t) instanceof Set ? t.add(o) : t[e.newKey || n] = o;
      }
    };
  }
}, $u = class {
  set(e, t) {
    if (Yn(e))
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
    return Yn(e) ? e.value : e;
  }
  isRef(e) {
    return Yn(e) || Ai(e);
  }
};
E();
E();
E();
var Mu = "__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS_STATE__";
function Uu() {
  if (!mi || typeof localStorage > "u" || localStorage === null)
    return {
      recordingState: !1,
      mouseEventEnabled: !1,
      keyboardEventEnabled: !1,
      componentEventEnabled: !1,
      performanceEventEnabled: !1,
      selected: ""
    };
  const e = localStorage.getItem(Mu);
  return e ? JSON.parse(e) : {
    recordingState: !1,
    mouseEventEnabled: !1,
    keyboardEventEnabled: !1,
    componentEventEnabled: !1,
    performanceEventEnabled: !1,
    selected: ""
  };
}
E();
E();
E();
var Cr, Sr;
(Sr = (Cr = T).__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS) != null || (Cr.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS = []);
var ju = new Proxy(T.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Hu(e, t) {
  ne.timelineLayersState[t.id] = !1, ju.push({
    ...e,
    descriptorId: t.id,
    appRecord: $o(t.app)
  });
}
var wr, kr;
(kr = (wr = T).__VUE_DEVTOOLS_KIT_INSPECTOR__) != null || (wr.__VUE_DEVTOOLS_KIT_INSPECTOR__ = []);
var zo = new Proxy(T.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
}), Oi = _t(() => {
  St.hooks.callHook("sendInspectorToClient", Ii());
});
function zu(e, t) {
  var n, o;
  zo.push({
    options: e,
    descriptor: t,
    treeFilterPlaceholder: (n = e.treeFilterPlaceholder) != null ? n : "Search tree...",
    stateFilterPlaceholder: (o = e.stateFilterPlaceholder) != null ? o : "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: $o(t.app)
  }), Oi();
}
function Ii() {
  return zo.filter((e) => e.descriptor.app === ue.value.app).filter((e) => e.descriptor.id !== "components").map((e) => {
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
function sn(e, t) {
  return zo.find((n) => n.options.id === e && (t ? n.descriptor.app === t : !0));
}
function Wu() {
  const e = hi();
  e.hook("addInspector", ({ inspector: o, plugin: r }) => {
    zu(o, r.descriptor);
  });
  const t = _t(async ({ inspectorId: o, plugin: r }) => {
    var a;
    if (!o || !((a = r == null ? void 0 : r.descriptor) != null && a.app) || ne.highPerfModeEnabled)
      return;
    const i = sn(o, r.descriptor.app), s = {
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
  const n = _t(async ({ inspectorId: o, plugin: r }) => {
    var a;
    if (!o || !((a = r == null ? void 0 : r.descriptor) != null && a.app) || ne.highPerfModeEnabled)
      return;
    const i = sn(o, r.descriptor.app), s = {
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
    const i = sn(o, a.descriptor.app);
    i && (i.selectedNodeId = r);
  }), e.hook("timelineLayerAdded", ({ options: o, plugin: r }) => {
    Hu(o, r.descriptor);
  }), e.hook("timelineEventAdded", ({ options: o, plugin: r }) => {
    var a;
    const i = ["performance", "component-event", "keyboard", "mouse"];
    ne.highPerfModeEnabled || !((a = ne.timelineLayersState) != null && a[r.descriptor.id]) && !i.includes(o.layerId) || e.callHookWith(
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
  }), e.hook("getComponentBounds", async ({ instance: o }) => at(o)), e.hook("getComponentName", ({ instance: o }) => xn(o)), e.hook("componentHighlight", ({ uid: o }) => {
    const r = ue.value.instanceMap.get(o);
    r && xu(r);
  }), e.hook("componentUnhighlight", () => {
    ki();
  }), e;
}
var Ar, Or;
(Or = (Ar = T).__VUE_DEVTOOLS_KIT_APP_RECORDS__) != null || (Ar.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = []);
var Ir, xr;
(xr = (Ir = T).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__) != null || (Ir.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = {});
var Tr, Pr;
(Pr = (Tr = T).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__) != null || (Tr.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = "");
var Vr, Dr;
(Dr = (Vr = T).__VUE_DEVTOOLS_KIT_CUSTOM_TABS__) != null || (Vr.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ = []);
var Rr, Br;
(Br = (Rr = T).__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__) != null || (Rr.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ = []);
var Xe = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function Ku() {
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
    timelineLayersState: Uu()
  };
}
var Nr, Lr;
(Lr = (Nr = T)[Xe]) != null || (Nr[Xe] = Ku());
var Gu = _t((e) => {
  St.hooks.callHook("devtoolsStateUpdated", { state: e });
});
_t((e, t) => {
  St.hooks.callHook("devtoolsConnectedUpdated", { state: e, oldState: t });
});
var Tn = new Proxy(T.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(e, t, n) {
    return t === "value" ? T.__VUE_DEVTOOLS_KIT_APP_RECORDS__ : T.__VUE_DEVTOOLS_KIT_APP_RECORDS__[t];
  }
}), ue = new Proxy(T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(e, t, n) {
    return t === "value" ? T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ : t === "id" ? T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ : T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[t];
  }
});
function xi() {
  Gu({
    ...T[Xe],
    appRecords: Tn.value,
    activeAppRecordId: ue.id,
    tabs: T.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: T.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function qu(e) {
  T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = e, xi();
}
function Yu(e) {
  T.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = e, xi();
}
var ne = new Proxy(T[Xe], {
  get(e, t) {
    return t === "appRecords" ? Tn : t === "activeAppRecordId" ? ue.id : t === "tabs" ? T.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ : t === "commands" ? T.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ : T[Xe][t];
  },
  deleteProperty(e, t) {
    return delete e[t], !0;
  },
  set(e, t, n) {
    return { ...T[Xe] }, e[t] = n, T[Xe][t] = n, !0;
  }
});
function Xu(e = {}) {
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
    } else if (ne.vitePluginDetected) {
      const u = (o = T.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__) != null ? o : i;
      T.__VUE_INSPECTOR__.openInEditor(u, r, s, l);
    }
  }
}
E();
E();
E();
E();
E();
var Fr, $r;
($r = (Fr = T).__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__) != null || (Fr.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ = []);
var Wo = new Proxy(T.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function yo(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    t[n] = e[n].defaultValue;
  }), t;
}
function Ko(e) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${e}__`;
}
function Zu(e) {
  var t, n, o;
  const r = (n = (t = Wo.find((a) => {
    var i;
    return a[0].id === e && !!((i = a[0]) != null && i.settings);
  })) == null ? void 0 : t[0]) != null ? n : null;
  return (o = r == null ? void 0 : r.settings) != null ? o : null;
}
function Ti(e, t) {
  var n, o, r;
  const a = Ko(e);
  if (a) {
    const i = localStorage.getItem(a);
    if (i)
      return JSON.parse(i);
  }
  if (e) {
    const i = (o = (n = Wo.find((s) => s[0].id === e)) == null ? void 0 : n[0]) != null ? o : null;
    return yo((r = i == null ? void 0 : i.settings) != null ? r : {});
  }
  return yo(t);
}
function Ju(e, t) {
  const n = Ko(e);
  localStorage.getItem(n) || localStorage.setItem(n, JSON.stringify(yo(t)));
}
function Qu(e, t, n) {
  const o = Ko(e), r = localStorage.getItem(o), a = JSON.parse(r || "{}"), i = {
    ...a,
    [t]: n
  };
  localStorage.setItem(o, JSON.stringify(i)), St.hooks.callHookWith(
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
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
var Mr, Ur, fe = (Ur = (Mr = T).__VUE_DEVTOOLS_HOOK) != null ? Ur : Mr.__VUE_DEVTOOLS_HOOK = hi(), ec = {
  vueAppInit(e) {
    fe.hook("app:init", e);
  },
  vueAppUnmount(e) {
    fe.hook("app:unmount", e);
  },
  vueAppConnected(e) {
    fe.hook("app:connected", e);
  },
  componentAdded(e) {
    return fe.hook("component:added", e);
  },
  componentEmit(e) {
    return fe.hook("component:emit", e);
  },
  componentUpdated(e) {
    return fe.hook("component:updated", e);
  },
  componentRemoved(e) {
    return fe.hook("component:removed", e);
  },
  setupDevtoolsPlugin(e) {
    fe.hook("devtools-plugin:setup", e);
  },
  perfStart(e) {
    return fe.hook("perf:start", e);
  },
  perfEnd(e) {
    return fe.hook("perf:end", e);
  }
}, Pi = {
  on: ec,
  setupDevToolsPlugin(e, t) {
    return fe.callHook("devtools-plugin:setup", e, t);
  }
}, tc = class {
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
    if (ne.highPerfModeEnabled)
      return;
    const n = Ii().find((o) => o.packageName === this.plugin.descriptor.packageName);
    if (n != null && n.id) {
      if (e) {
        const o = [
          e.appContext.app,
          e.uid,
          (t = e.parent) == null ? void 0 : t.uid,
          e
        ];
        fe.callHook("component:updated", ...o);
      } else
        fe.callHook(
          "component:updated"
          /* COMPONENT_UPDATED */
        );
      this.hooks.callHook("sendInspectorState", { inspectorId: n.id, plugin: this.plugin });
    }
  }
  // custom inspector
  addInspector(e) {
    this.hooks.callHook("addInspector", { inspector: e, plugin: this.plugin }), this.plugin.descriptor.settings && Ju(e.id, this.plugin.descriptor.settings);
  }
  sendInspectorTree(e) {
    ne.highPerfModeEnabled || this.hooks.callHook("sendInspectorTree", { inspectorId: e, plugin: this.plugin });
  }
  sendInspectorState(e) {
    ne.highPerfModeEnabled || this.hooks.callHook("sendInspectorState", { inspectorId: e, plugin: this.plugin });
  }
  selectInspectorNode(e, t) {
    this.hooks.callHook("customInspectorSelectNode", { inspectorId: e, nodeId: t, plugin: this.plugin });
  }
  visitComponentTree(e) {
    return this.hooks.callHook("visitComponentTree", e);
  }
  // timeline
  now() {
    return ne.highPerfModeEnabled ? 0 : Date.now();
  }
  addTimelineLayer(e) {
    this.hooks.callHook("timelineLayerAdded", { options: e, plugin: this.plugin });
  }
  addTimelineEvent(e) {
    ne.highPerfModeEnabled || this.hooks.callHook("timelineEventAdded", { options: e, plugin: this.plugin });
  }
  // settings
  getSettings(e) {
    return Ti(e ?? this.plugin.descriptor.id, this.plugin.descriptor.settings);
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
}, nc = tc;
E();
E();
E();
E();
var oc = "__vue_devtool_undefined__", rc = "__vue_devtool_infinity__", ac = "__vue_devtool_negative_infinity__", ic = "__vue_devtool_nan__";
E();
E();
var sc = {
  [oc]: "undefined",
  [ic]: "NaN",
  [rc]: "Infinity",
  [ac]: "-Infinity"
};
Object.entries(sc).reduce((e, [t, n]) => (e[n] = t, e), {});
E();
E();
E();
E();
E();
var jr, Hr;
(Hr = (jr = T).__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__) != null || (jr.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ = /* @__PURE__ */ new Set());
function Vi(e, t) {
  return Pi.setupDevToolsPlugin(e, t);
}
function lc(e, t) {
  const [n, o] = e;
  if (n.app !== t)
    return;
  const r = new nc({
    plugin: {
      setupFn: o,
      descriptor: n
    },
    ctx: St
  });
  n.packageName === "vuex" && r.on.editInspectorState((a) => {
    r.sendInspectorState(a.inspectorId);
  }), o(r);
}
function Di(e, t) {
  T.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(e) || ne.highPerfModeEnabled && !(t != null && t.inspectingComponent) || (T.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(e), Wo.forEach((n) => {
    lc(n, e);
  }));
}
E();
E();
var Ft = "__VUE_DEVTOOLS_ROUTER__", pt = "__VUE_DEVTOOLS_ROUTER_INFO__", zr, Wr;
(Wr = (zr = T)[pt]) != null || (zr[pt] = {
  currentRoute: null,
  routes: []
});
var Kr, Gr;
(Gr = (Kr = T)[Ft]) != null || (Kr[Ft] = {});
new Proxy(T[pt], {
  get(e, t) {
    return T[pt][t];
  }
});
new Proxy(T[Ft], {
  get(e, t) {
    if (t === "value")
      return T[Ft];
  }
});
function uc(e) {
  const t = /* @__PURE__ */ new Map();
  return ((e == null ? void 0 : e.getRoutes()) || []).filter((n) => !t.has(n.path) && t.set(n.path, 1));
}
function Go(e) {
  return e.map((t) => {
    let { path: n, name: o, children: r, meta: a } = t;
    return r != null && r.length && (r = Go(r)), {
      path: n,
      name: o,
      children: r,
      meta: a
    };
  });
}
function cc(e) {
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
      matched: Go(i)
    };
  }
  return e;
}
function dc(e, t) {
  function n() {
    var o;
    const r = (o = e.app) == null ? void 0 : o.config.globalProperties.$router, a = cc(r == null ? void 0 : r.currentRoute.value), i = Go(uc(r)), s = console.warn;
    console.warn = () => {
    }, T[pt] = {
      currentRoute: a ? yr(a) : {},
      routes: yr(i)
    }, T[Ft] = r, console.warn = s;
  }
  n(), Pi.on.componentUpdated(_t(() => {
    var o;
    ((o = t.value) == null ? void 0 : o.app) === e.app && (n(), !ne.highPerfModeEnabled && St.hooks.callHook("routerInfoUpdated", { state: T[pt] }));
  }, 200));
}
function fc(e) {
  return {
    // get inspector tree
    async getInspectorTree(t) {
      const n = {
        ...t,
        app: ue.value.app,
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
        app: ue.value.app,
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
      const n = new Fu(), o = {
        ...t,
        app: ue.value.app,
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
      const n = sn(t);
      e.callHook("sendInspectorState", { inspectorId: t, plugin: {
        descriptor: n.descriptor,
        setupFn: () => ({})
      } });
    },
    // inspect component inspector
    inspectComponentInspector() {
      return Vu();
    },
    // cancel inspect component inspector
    cancelInspectComponentInspector() {
      return Pu();
    },
    // get component render code
    getComponentRenderCode(t) {
      const n = mo(ue.value, t);
      if (n)
        return typeof (n == null ? void 0 : n.type) != "function" ? n.render.toString() : n.type.toString();
    },
    // scroll to component
    scrollToComponent(t) {
      return Du({ id: t });
    },
    // open in editor
    openInEditor: Xu,
    // get vue inspector
    getVueInspector: Nu,
    // toggle app
    toggleApp(t, n) {
      const o = Tn.value.find((r) => r.id === t);
      o && (Yu(t), qu(o), dc(o, ue), Oi(), Di(o.app, n));
    },
    // inspect dom
    inspectDOM(t) {
      const n = mo(ue.value, t);
      if (n) {
        const [o] = Mo(n);
        o && (T.__VUE_DEVTOOLS_INSPECT_DOM_TARGET__ = o);
      }
    },
    updatePluginSettings(t, n, o) {
      Qu(t, n, o);
    },
    getPluginSettings(t) {
      return {
        options: Zu(t),
        values: Ti(t)
      };
    }
  };
}
E();
var qr, Yr;
(Yr = (qr = T).__VUE_DEVTOOLS_ENV__) != null || (qr.__VUE_DEVTOOLS_ENV__ = {
  vitePluginDetected: !1
});
var Xr = Wu(), Zr, Jr;
(Jr = (Zr = T).__VUE_DEVTOOLS_KIT_CONTEXT__) != null || (Zr.__VUE_DEVTOOLS_KIT_CONTEXT__ = {
  hooks: Xr,
  get state() {
    return {
      ...ne,
      activeAppRecordId: ue.id,
      activeAppRecord: ue.value,
      appRecords: Tn.value
    };
  },
  api: fc(Xr)
});
var St = T.__VUE_DEVTOOLS_KIT_CONTEXT__;
E();
vu(gu());
var Qr, ea;
(ea = (Qr = T).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__) != null || (Qr.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
});
E();
function vc(e) {
  ne.highPerfModeEnabled = e ?? !ne.highPerfModeEnabled, !e && ue.value && Di(ue.value.app);
}
E();
E();
E();
function mc(e) {
  ne.devtoolsClientDetected = {
    ...ne.devtoolsClientDetected,
    ...e
  };
  const t = Object.values(ne.devtoolsClientDetected).some(Boolean);
  vc(!t);
}
var ta, na;
(na = (ta = T).__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__) != null || (ta.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ = mc);
E();
E();
E();
E();
E();
E();
E();
var gc = class {
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
}, Ri = class {
  constructor(e) {
    this.generateIdentifier = e, this.kv = new gc();
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
}, hc = class extends Ri {
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
E();
E();
function yc(e) {
  if ("values" in Object)
    return Object.values(e);
  const t = [];
  for (const n in e)
    e.hasOwnProperty(n) && t.push(e[n]);
  return t;
}
function _c(e, t) {
  const n = yc(e);
  if ("find" in n)
    return n.find(t);
  const o = n;
  for (let r = 0; r < o.length; r++) {
    const a = o[r];
    if (t(a))
      return a;
  }
}
function bt(e, t) {
  Object.entries(e).forEach(([n, o]) => t(o, n));
}
function ln(e, t) {
  return e.indexOf(t) !== -1;
}
function oa(e, t) {
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (t(o))
      return o;
  }
}
var pc = class {
  constructor() {
    this.transfomers = {};
  }
  register(e) {
    this.transfomers[e.name] = e;
  }
  findApplicable(e) {
    return _c(this.transfomers, (t) => t.isApplicable(e));
  }
  findByName(e) {
    return this.transfomers[e];
  }
};
E();
E();
var bc = (e) => Object.prototype.toString.call(e).slice(8, -1), Bi = (e) => typeof e > "u", Ec = (e) => e === null, $t = (e) => typeof e != "object" || e === null || e === Object.prototype ? !1 : Object.getPrototypeOf(e) === null ? !0 : Object.getPrototypeOf(e) === Object.prototype, _o = (e) => $t(e) && Object.keys(e).length === 0, He = (e) => Array.isArray(e), Cc = (e) => typeof e == "string", Sc = (e) => typeof e == "number" && !isNaN(e), wc = (e) => typeof e == "boolean", kc = (e) => e instanceof RegExp, Mt = (e) => e instanceof Map, Ut = (e) => e instanceof Set, Ni = (e) => bc(e) === "Symbol", Ac = (e) => e instanceof Date && !isNaN(e.valueOf()), Oc = (e) => e instanceof Error, ra = (e) => typeof e == "number" && isNaN(e), Ic = (e) => wc(e) || Ec(e) || Bi(e) || Sc(e) || Cc(e) || Ni(e), xc = (e) => typeof e == "bigint", Tc = (e) => e === 1 / 0 || e === -1 / 0, Pc = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), Vc = (e) => e instanceof URL;
E();
var Li = (e) => e.replace(/\./g, "\\."), Xn = (e) => e.map(String).map(Li).join("."), Bt = (e) => {
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
E();
function we(e, t, n, o) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: o
  };
}
var Fi = [
  we(Bi, "undefined", () => null, () => {
  }),
  we(xc, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  we(Ac, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  we(Oc, "Error", (e, t) => {
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
  we(kc, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), n = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, n);
  }),
  we(
    Ut,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  we(Mt, "map", (e) => [...e.entries()], (e) => new Map(e)),
  we((e) => ra(e) || Tc(e), "number", (e) => ra(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  we((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  we(Vc, "URL", (e) => e.toString(), (e) => new URL(e))
];
function Pn(e, t, n, o) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: o
  };
}
var $i = Pn((e, t) => Ni(e) ? !!t.symbolRegistry.getIdentifier(e) : !1, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, n) => {
  const o = n.symbolRegistry.getValue(t[1]);
  if (!o)
    throw new Error("Trying to deserialize unknown symbol");
  return o;
}), Dc = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), Mi = Pn(Pc, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const n = Dc[t[1]];
  if (!n)
    throw new Error("Trying to deserialize unknown typed array");
  return new n(e);
});
function Ui(e, t) {
  return e != null && e.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : !1;
}
var ji = Pn(Ui, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
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
}), Hi = Pn((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, n) => {
  const o = n.customTransformerRegistry.findByName(t[1]);
  if (!o)
    throw new Error("Trying to deserialize unknown custom value");
  return o.deserialize(e);
}), Rc = [ji, $i, Hi, Mi], aa = (e, t) => {
  const n = oa(Rc, (r) => r.isApplicable(e, t));
  if (n)
    return {
      value: n.transform(e, t),
      type: n.annotation(e, t)
    };
  const o = oa(Fi, (r) => r.isApplicable(e, t));
  if (o)
    return {
      value: o.transform(e, t),
      type: o.annotation
    };
}, zi = {};
Fi.forEach((e) => {
  zi[e.annotation] = e;
});
var Bc = (e, t, n) => {
  if (He(t))
    switch (t[0]) {
      case "symbol":
        return $i.untransform(e, t, n);
      case "class":
        return ji.untransform(e, t, n);
      case "custom":
        return Hi.untransform(e, t, n);
      case "typed-array":
        return Mi.untransform(e, t, n);
      default:
        throw new Error("Unknown transformation: " + t);
    }
  else {
    const o = zi[t];
    if (!o)
      throw new Error("Unknown transformation: " + t);
    return o.untransform(e, n);
  }
};
E();
var gt = (e, t) => {
  if (t > e.size)
    throw new Error("index out of bounds");
  const n = e.keys();
  for (; t > 0; )
    n.next(), t--;
  return n.next().value;
};
function Wi(e) {
  if (ln(e, "__proto__"))
    throw new Error("__proto__ is not allowed as a property");
  if (ln(e, "prototype"))
    throw new Error("prototype is not allowed as a property");
  if (ln(e, "constructor"))
    throw new Error("constructor is not allowed as a property");
}
var Nc = (e, t) => {
  Wi(t);
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (Ut(e))
      e = gt(e, +o);
    else if (Mt(e)) {
      const r = +o, a = +t[++n] == 0 ? "key" : "value", i = gt(e, r);
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
}, po = (e, t, n) => {
  if (Wi(t), t.length === 0)
    return n(e);
  let o = e;
  for (let a = 0; a < t.length - 1; a++) {
    const i = t[a];
    if (He(o)) {
      const s = +i;
      o = o[s];
    } else if ($t(o))
      o = o[i];
    else if (Ut(o)) {
      const s = +i;
      o = gt(o, s);
    } else if (Mt(o)) {
      if (a === t.length - 2)
        break;
      const l = +i, u = +t[++a] == 0 ? "key" : "value", c = gt(o, l);
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
  if (He(o) ? o[+r] = n(o[+r]) : $t(o) && (o[r] = n(o[r])), Ut(o)) {
    const a = gt(o, +r), i = n(a);
    a !== i && (o.delete(a), o.add(i));
  }
  if (Mt(o)) {
    const a = +t[t.length - 2], i = gt(o, a);
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
function bo(e, t, n = []) {
  if (!e)
    return;
  if (!He(e)) {
    bt(e, (a, i) => bo(a, t, [...n, ...Bt(i)]));
    return;
  }
  const [o, r] = e;
  r && bt(r, (a, i) => {
    bo(a, t, [...n, ...Bt(i)]);
  }), t(o, n);
}
function Lc(e, t, n) {
  return bo(t, (o, r) => {
    e = po(e, r, (a) => Bc(a, o, n));
  }), e;
}
function Fc(e, t) {
  function n(o, r) {
    const a = Nc(e, Bt(r));
    o.map(Bt).forEach((i) => {
      e = po(e, i, () => a);
    });
  }
  if (He(t)) {
    const [o, r] = t;
    o.forEach((a) => {
      e = po(e, Bt(a), () => e);
    }), r && bt(r, n);
  } else
    bt(t, n);
  return e;
}
var $c = (e, t) => $t(e) || He(e) || Mt(e) || Ut(e) || Ui(e, t);
function Mc(e, t, n) {
  const o = n.get(e);
  o ? o.push(t) : n.set(e, [t]);
}
function Uc(e, t) {
  const n = {};
  let o;
  return e.forEach((r) => {
    if (r.length <= 1)
      return;
    t || (r = r.map((s) => s.map(String)).sort((s, l) => s.length - l.length));
    const [a, ...i] = r;
    a.length === 0 ? o = i.map(Xn) : n[Xn(a)] = i.map(Xn);
  }), o ? _o(n) ? [o] : [o, n] : _o(n) ? void 0 : n;
}
var Ki = (e, t, n, o, r = [], a = [], i = /* @__PURE__ */ new Map()) => {
  var s;
  const l = Ic(e);
  if (!l) {
    Mc(e, r, t);
    const g = i.get(e);
    if (g)
      return o ? {
        transformedValue: null
      } : g;
  }
  if (!$c(e, n)) {
    const g = aa(e, n), y = g ? {
      transformedValue: g.value,
      annotations: [g.type]
    } : {
      transformedValue: e
    };
    return l || i.set(e, y), y;
  }
  if (ln(a, e))
    return {
      transformedValue: null
    };
  const u = aa(e, n), c = (s = u == null ? void 0 : u.value) != null ? s : e, d = He(c) ? [] : {}, v = {};
  bt(c, (g, y) => {
    if (y === "__proto__" || y === "constructor" || y === "prototype")
      throw new Error(`Detected property ${y}. This is a prototype pollution risk, please remove it from your object.`);
    const _ = Ki(g, t, n, o, [...r, y], [...a, e], i);
    d[y] = _.transformedValue, He(_.annotations) ? v[y] = _.annotations : $t(_.annotations) && bt(_.annotations, (h, C) => {
      v[Li(y) + "." + C] = h;
    });
  });
  const f = _o(v) ? {
    transformedValue: d,
    annotations: u ? [u.type] : void 0
  } : {
    transformedValue: d,
    annotations: u ? [u.type, v] : v
  };
  return l || i.set(e, f), f;
};
E();
E();
function Gi(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function ia(e) {
  return Gi(e) === "Array";
}
function jc(e) {
  if (Gi(e) !== "Object")
    return !1;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function Hc(e, t, n, o, r) {
  const a = {}.propertyIsEnumerable.call(o, t) ? "enumerable" : "nonenumerable";
  a === "enumerable" && (e[t] = n), r && a === "nonenumerable" && Object.defineProperty(e, t, {
    value: n,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
}
function Eo(e, t = {}) {
  if (ia(e))
    return e.map((r) => Eo(r, t));
  if (!jc(e))
    return e;
  const n = Object.getOwnPropertyNames(e), o = Object.getOwnPropertySymbols(e);
  return [...n, ...o].reduce((r, a) => {
    if (ia(t.props) && !t.props.includes(a))
      return r;
    const i = e[a], s = Eo(i, t);
    return Hc(r, a, s, e, t.nonenumerable), r;
  }, {});
}
var q = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: e = !1 } = {}) {
    this.classRegistry = new hc(), this.symbolRegistry = new Ri((t) => {
      var n;
      return (n = t.description) != null ? n : "";
    }), this.customTransformerRegistry = new pc(), this.allowedErrorProps = [], this.dedupe = e;
  }
  serialize(e) {
    const t = /* @__PURE__ */ new Map(), n = Ki(e, t, this, this.dedupe), o = {
      json: n.transformedValue
    };
    n.annotations && (o.meta = {
      ...o.meta,
      values: n.annotations
    });
    const r = Uc(t, this.dedupe);
    return r && (o.meta = {
      ...o.meta,
      referentialEqualities: r
    }), o;
  }
  deserialize(e) {
    const { json: t, meta: n } = e;
    let o = Eo(t);
    return n != null && n.values && (o = Lc(o, n.values, this)), n != null && n.referentialEqualities && (o = Fc(o, n.referentialEqualities)), o;
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
q.defaultInstance = new q();
q.serialize = q.defaultInstance.serialize.bind(q.defaultInstance);
q.deserialize = q.defaultInstance.deserialize.bind(q.defaultInstance);
q.stringify = q.defaultInstance.stringify.bind(q.defaultInstance);
q.parse = q.defaultInstance.parse.bind(q.defaultInstance);
q.registerClass = q.defaultInstance.registerClass.bind(q.defaultInstance);
q.registerSymbol = q.defaultInstance.registerSymbol.bind(q.defaultInstance);
q.registerCustom = q.defaultInstance.registerCustom.bind(q.defaultInstance);
q.allowErrorProps = q.defaultInstance.allowErrorProps.bind(q.defaultInstance);
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
E();
var sa, la;
(la = (sa = T).__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__) != null || (sa.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ = []);
var ua, ca;
(ca = (ua = T).__VUE_DEVTOOLS_KIT_RPC_CLIENT__) != null || (ua.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = null);
var da, fa;
(fa = (da = T).__VUE_DEVTOOLS_KIT_RPC_SERVER__) != null || (da.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = null);
var va, ma;
(ma = (va = T).__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__) != null || (va.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = null);
var ga, ha;
(ha = (ga = T).__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__) != null || (ga.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = null);
var ya, _a;
(_a = (ya = T).__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__) != null || (ya.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ = null);
E();
E();
E();
E();
E();
E();
E();
/*!
 * pinia v3.0.2
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let Pt;
const jt = (e) => Pt = e, qi = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function it(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Oe;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Oe || (Oe = {}));
const Ne = typeof window < "u", pa = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function zc(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], { type: e.type }) : e;
}
function qo(e, t, n) {
  const o = new XMLHttpRequest();
  o.open("GET", e), o.responseType = "blob", o.onload = function() {
    Zi(o.response, t, n);
  }, o.onerror = function() {
    console.error("could not download file");
  }, o.send();
}
function Yi(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function un(e) {
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
const cn = typeof navigator == "object" ? navigator : { userAgent: "" }, Xi = /Macintosh/.test(cn.userAgent) && /AppleWebKit/.test(cn.userAgent) && !/Safari/.test(cn.userAgent), Zi = Ne ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Xi ? Wc : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in cn ? Kc : (
      // Fallback to using FileReader and a popup
      Gc
    )
  )
) : () => {
};
function Wc(e, t = "download", n) {
  const o = document.createElement("a");
  o.download = t, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? Yi(o.href) ? qo(e, t, n) : (o.target = "_blank", un(o)) : un(o)) : (o.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    un(o);
  }, 0));
}
function Kc(e, t = "download", n) {
  if (typeof e == "string")
    if (Yi(e))
      qo(e, t, n);
    else {
      const o = document.createElement("a");
      o.href = e, o.target = "_blank", setTimeout(function() {
        un(o);
      });
    }
  else
    navigator.msSaveOrOpenBlob(zc(e, n), t);
}
function Gc(e, t, n, o) {
  if (o = o || open("", "_blank"), o && (o.document.title = o.document.body.innerText = "downloading..."), typeof e == "string")
    return qo(e, t, n);
  const r = e.type === "application/octet-stream", a = /constructor/i.test(String(pa.HTMLElement)) || "safari" in pa, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || r && a || Xi) && typeof FileReader < "u") {
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
function oe(e, t) {
  const n = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(n, t) : t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.log(n);
}
function Yo(e) {
  return "_a" in e && "install" in e;
}
function Ji() {
  if (!("clipboard" in navigator))
    return oe("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Qi(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (oe('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function qc(e) {
  if (!Ji())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), oe("Global state copied to clipboard.");
    } catch (t) {
      if (Qi(t))
        return;
      oe("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function Yc(e) {
  if (!Ji())
    try {
      es(e, JSON.parse(await navigator.clipboard.readText())), oe("Global state pasted from clipboard.");
    } catch (t) {
      if (Qi(t))
        return;
      oe("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function Xc(e) {
  try {
    Zi(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    oe("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let Te;
function Zc() {
  Te || (Te = document.createElement("input"), Te.type = "file", Te.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      Te.onchange = async () => {
        const o = Te.files;
        if (!o)
          return t(null);
        const r = o.item(0);
        return t(r ? { text: await r.text(), file: r } : null);
      }, Te.oncancel = () => t(null), Te.onerror = n, Te.click();
    });
  }
  return e;
}
async function Jc(e) {
  try {
    const n = await Zc()();
    if (!n)
      return;
    const { text: o, file: r } = n;
    es(e, JSON.parse(o)), oe(`Global state imported from "${r.name}".`);
  } catch (t) {
    oe("Failed to import the state from JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function es(e, t) {
  for (const n in t) {
    const o = e.state.value[n];
    o ? Object.assign(o, t[n]) : e.state.value[n] = t[n];
  }
}
function Ee(e) {
  return {
    _custom: {
      display: e
    }
  };
}
const ts = "🍍 Pinia (root)", dn = "_root";
function Qc(e) {
  return Yo(e) ? {
    id: dn,
    label: ts
  } : {
    id: e.$id,
    label: e.$id
  };
}
function ed(e) {
  if (Yo(e)) {
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
function td(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: Ee(e.type),
    key: Ee(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function nd(e) {
  switch (e) {
    case Oe.direct:
      return "mutation";
    case Oe.patchFunction:
      return "$patch";
    case Oe.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let ht = !0;
const fn = [], qe = "pinia:mutations", ie = "pinia", { assign: od } = Object, hn = (e) => "🍍 " + e;
function rd(e, t) {
  Vi({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: fn,
    app: e
  }, (n) => {
    typeof n.now != "function" && oe("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: qe,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: ie,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            qc(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await Yc(t), n.sendInspectorTree(ie), n.sendInspectorState(ie);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            Xc(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await Jc(t), n.sendInspectorTree(ie), n.sendInspectorState(ie);
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
            r ? typeof r.$reset != "function" ? oe(`Cannot reset "${o}" store because it doesn't have a "$reset" method implemented.`, "warn") : (r.$reset(), oe(`Store "${o}" reset.`)) : oe(`Cannot reset "${o}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), n.on.inspectComponent((o) => {
      const r = o.componentInstance && o.componentInstance.proxy;
      if (r && r._pStores) {
        const a = o.componentInstance.proxy._pStores;
        Object.values(a).forEach((i) => {
          o.instanceData.state.push({
            type: hn(i.$id),
            key: "state",
            editable: !0,
            value: i._isOptionsAPI ? {
              _custom: {
                value: ot(i.$state),
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
            type: hn(i.$id),
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
      if (o.app === e && o.inspectorId === ie) {
        let r = [t];
        r = r.concat(Array.from(t._s.values())), o.rootNodes = (o.filter ? r.filter((a) => "$id" in a ? a.$id.toLowerCase().includes(o.filter.toLowerCase()) : ts.toLowerCase().includes(o.filter.toLowerCase())) : r).map(Qc);
      }
    }), globalThis.$pinia = t, n.on.getInspectorState((o) => {
      if (o.app === e && o.inspectorId === ie) {
        const r = o.nodeId === dn ? t : t._s.get(o.nodeId);
        if (!r)
          return;
        r && (o.nodeId !== dn && (globalThis.$store = ot(r)), o.state = ed(r));
      }
    }), n.on.editInspectorState((o) => {
      if (o.app === e && o.inspectorId === ie) {
        const r = o.nodeId === dn ? t : t._s.get(o.nodeId);
        if (!r)
          return oe(`store "${o.nodeId}" not found`, "error");
        const { path: a } = o;
        Yo(r) ? a.unshift("state") : (a.length !== 1 || !r._customProperties.has(a[0]) || a[0] in r.$state) && a.unshift("$state"), ht = !1, o.set(r, a, o.state.value), ht = !0;
      }
    }), n.on.editComponentState((o) => {
      if (o.type.startsWith("🍍")) {
        const r = o.type.replace(/^🍍\s*/, ""), a = t._s.get(r);
        if (!a)
          return oe(`store "${r}" not found`, "error");
        const { path: i } = o;
        if (i[0] !== "state")
          return oe(`Invalid path for store "${r}":
${i}
Only state can be modified.`);
        i[0] = "$state", ht = !1, o.set(a, i, o.state.value), ht = !0;
      }
    });
  });
}
function ad(e, t) {
  fn.includes(hn(t.$id)) || fn.push(hn(t.$id)), Vi({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: fn,
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
      const c = ns++;
      n.addTimelineEvent({
        layerId: qe,
        event: {
          time: o(),
          title: "🛫 " + l,
          subtitle: "start",
          data: {
            store: Ee(t.$id),
            action: Ee(l),
            args: u
          },
          groupId: c
        }
      }), i((d) => {
        Le = void 0, n.addTimelineEvent({
          layerId: qe,
          event: {
            time: o(),
            title: "🛬 " + l,
            subtitle: "end",
            data: {
              store: Ee(t.$id),
              action: Ee(l),
              args: u,
              result: d
            },
            groupId: c
          }
        });
      }), s((d) => {
        Le = void 0, n.addTimelineEvent({
          layerId: qe,
          event: {
            time: o(),
            logType: "error",
            title: "💥 " + l,
            subtitle: "end",
            data: {
              store: Ee(t.$id),
              action: Ee(l),
              args: u,
              error: d
            },
            groupId: c
          }
        });
      });
    }, !0), t._customProperties.forEach((i) => {
      K(() => Ce(t[i]), (s, l) => {
        n.notifyComponentUpdate(), n.sendInspectorState(ie), ht && n.addTimelineEvent({
          layerId: qe,
          event: {
            time: o(),
            title: "Change",
            subtitle: i,
            data: {
              newValue: s,
              oldValue: l
            },
            groupId: Le
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: i, type: s }, l) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(ie), !ht)
        return;
      const u = {
        time: o(),
        title: nd(s),
        data: od({ store: Ee(t.$id) }, td(i)),
        groupId: Le
      };
      s === Oe.patchFunction ? u.subtitle = "⤵️" : s === Oe.patchObject ? u.subtitle = "🧩" : i && !Array.isArray(i) && (u.subtitle = i.type), i && (u.data["rawEvent(s)"] = {
        _custom: {
          display: "DebuggerEvent",
          type: "object",
          tooltip: "raw DebuggerEvent[]",
          value: i
        }
      }), n.addTimelineEvent({
        layerId: qe,
        event: u
      });
    }, { detached: !0, flush: "sync" });
    const r = t._hotUpdate;
    t._hotUpdate = Be((i) => {
      r(i), n.addTimelineEvent({
        layerId: qe,
        event: {
          time: o(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: Ee(t.$id),
            info: Ee("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie);
    });
    const { $dispose: a } = t;
    t.$dispose = () => {
      a(), n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie), n.getSettings().logStoreChanges && oe(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(ie), n.sendInspectorState(ie), n.getSettings().logStoreChanges && oe(`"${t.$id}" store installed 🆕`);
  });
}
let ns = 0, Le;
function ba(e, t, n) {
  const o = t.reduce((r, a) => (r[a] = ot(e)[a], r), {});
  for (const r in o)
    e[r] = function() {
      const a = ns, i = n ? new Proxy(e, {
        get(...l) {
          return Le = a, Reflect.get(...l);
        },
        set(...l) {
          return Le = a, Reflect.set(...l);
        }
      }) : e;
      Le = a;
      const s = o[r].apply(i, arguments);
      return Le = void 0, s;
    };
}
function id({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (t._isOptionsAPI = !!n.state, !t._p._testing) {
      ba(t, Object.keys(n.actions), t._isOptionsAPI);
      const o = t._hotUpdate;
      ot(t)._hotUpdate = function(r) {
        o.apply(this, arguments), ba(t, Object.keys(r._hmrPayload.actions), !!t._isOptionsAPI);
      };
    }
    ad(
      e,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      t
    );
  }
}
function sd() {
  const e = Kt(!0), t = e.run(() => U({}));
  let n = [], o = [];
  const r = Be({
    install(a) {
      jt(r), r._a = a, a.provide(qi, r), a.config.globalProperties.$pinia = r, process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Ne && rd(a, r), o.forEach((i) => n.push(i)), o = [];
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
  return process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Ne && typeof Proxy < "u" && r.use(id), r;
}
function os(e, t) {
  for (const n in t) {
    const o = t[n];
    if (!(n in e))
      continue;
    const r = e[n];
    it(r) && it(o) && !Me(o) && !Ro(o) ? e[n] = os(r, o) : e[n] = o;
  }
  return e;
}
const rs = () => {
};
function Ea(e, t, n, o = rs) {
  e.push(t);
  const r = () => {
    const a = e.indexOf(t);
    a > -1 && (e.splice(a, 1), o());
  };
  return !n && cl() && ge(r), r;
}
function ft(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
const ld = (e) => e(), Ca = Symbol(), Zn = Symbol();
function Co(e, t) {
  e instanceof Map && t instanceof Map ? t.forEach((n, o) => e.set(o, n)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], r = e[n];
    it(r) && it(o) && e.hasOwnProperty(n) && !Me(o) && !Ro(o) ? e[n] = Co(r, o) : e[n] = o;
  }
  return e;
}
const ud = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function cd(e) {
  return !it(e) || !Object.prototype.hasOwnProperty.call(e, ud);
}
const { assign: pe } = Object;
function Sa(e) {
  return !!(Me(e) && e.effect);
}
function wa(e, t, n, o) {
  const { state: r, actions: a, getters: i } = t, s = n.state.value[e];
  let l;
  function u() {
    !s && (process.env.NODE_ENV === "production" || !o) && (n.state.value[e] = r ? r() : {});
    const c = process.env.NODE_ENV !== "production" && o ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      io(U(r ? r() : {}).value)
    ) : io(n.state.value[e]);
    return pe(c, a, Object.keys(i || {}).reduce((d, v) => (process.env.NODE_ENV !== "production" && v in c && console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${v}" in store "${e}".`), d[v] = Be(x(() => {
      jt(n);
      const f = n._s.get(e);
      return i[v].call(f, f);
    })), d), {}));
  }
  return l = So(e, u, t, n, o, !0), l;
}
function So(e, t, n = {}, o, r, a) {
  let i;
  const s = pe({ actions: {} }, n);
  if (process.env.NODE_ENV !== "production" && !o._e.active)
    throw new Error("Pinia destroyed");
  const l = { deep: !0 };
  process.env.NODE_ENV !== "production" && (l.onTrigger = (O) => {
    u ? f = O : u == !1 && !S._hotUpdating && (Array.isArray(f) ? f.push(O) : console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug."));
  });
  let u, c, d = [], v = [], f;
  const g = o.state.value[e];
  !a && !g && (process.env.NODE_ENV === "production" || !r) && (o.state.value[e] = {});
  const y = U({});
  let _;
  function h(O) {
    let p;
    u = c = !1, process.env.NODE_ENV !== "production" && (f = []), typeof O == "function" ? (O(o.state.value[e]), p = {
      type: Oe.patchFunction,
      storeId: e,
      events: f
    }) : (Co(o.state.value[e], O), p = {
      type: Oe.patchObject,
      payload: O,
      storeId: e,
      events: f
    });
    const w = _ = Symbol();
    be().then(() => {
      _ === w && (u = !0);
    }), c = !0, ft(d, p, o.state.value[e]);
  }
  const C = a ? function() {
    const { state: p } = n, w = p ? p() : {};
    this.$patch((I) => {
      pe(I, w);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${e}" is built using the setup syntax and does not implement $reset().`);
    } : rs
  );
  function b() {
    i.stop(), d = [], v = [], o._s.delete(e);
  }
  const A = (O, p = "") => {
    if (Ca in O)
      return O[Zn] = p, O;
    const w = function() {
      jt(o);
      const I = Array.from(arguments), V = [], F = [];
      function N(M) {
        V.push(M);
      }
      function D(M) {
        F.push(M);
      }
      ft(v, {
        args: I,
        name: w[Zn],
        store: S,
        after: N,
        onError: D
      });
      let H;
      try {
        H = O.apply(this && this.$id === e ? this : S, I);
      } catch (M) {
        throw ft(F, M), M;
      }
      return H instanceof Promise ? H.then((M) => (ft(V, M), M)).catch((M) => (ft(F, M), Promise.reject(M))) : (ft(V, H), H);
    };
    return w[Ca] = !0, w[Zn] = p, w;
  }, R = /* @__PURE__ */ Be({
    actions: {},
    getters: {},
    state: [],
    hotState: y
  }), P = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: Ea.bind(null, v),
    $patch: h,
    $reset: C,
    $subscribe(O, p = {}) {
      const w = Ea(d, O, p.detached, () => I()), I = i.run(() => K(() => o.state.value[e], (V) => {
        (p.flush === "sync" ? c : u) && O({
          storeId: e,
          type: Oe.direct,
          events: f
        }, V);
      }, pe({}, l, p)));
      return w;
    },
    $dispose: b
  }, S = rt(process.env.NODE_ENV !== "production" || process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Ne ? pe(
    {
      _hmrPayload: R,
      _customProperties: Be(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    P
    // must be added later
    // setupStore
  ) : P);
  o._s.set(e, S);
  const B = (o._a && o._a.runWithContext || ld)(() => o._e.run(() => (i = Kt()).run(() => t({ action: A }))));
  for (const O in B) {
    const p = B[O];
    if (Me(p) && !Sa(p) || Ro(p))
      process.env.NODE_ENV !== "production" && r ? y.value[O] = $(B, O) : a || (g && cd(p) && (Me(p) ? p.value = g[O] : Co(p, g[O])), o.state.value[e][O] = p), process.env.NODE_ENV !== "production" && R.state.push(O);
    else if (typeof p == "function") {
      const w = process.env.NODE_ENV !== "production" && r ? p : A(p, O);
      B[O] = w, process.env.NODE_ENV !== "production" && (R.actions[O] = p), s.actions[O] = p;
    } else process.env.NODE_ENV !== "production" && Sa(p) && (R.getters[O] = a ? (
      // @ts-expect-error
      n.getters[O]
    ) : p, Ne && (B._getters || // @ts-expect-error: same
    (B._getters = Be([]))).push(O));
  }
  if (pe(S, B), pe(ot(S), B), Object.defineProperty(S, "$state", {
    get: () => process.env.NODE_ENV !== "production" && r ? y.value : o.state.value[e],
    set: (O) => {
      if (process.env.NODE_ENV !== "production" && r)
        throw new Error("cannot set hotState");
      h((p) => {
        pe(p, O);
      });
    }
  }), process.env.NODE_ENV !== "production" && (S._hotUpdate = Be((O) => {
    S._hotUpdating = !0, O._hmrPayload.state.forEach((p) => {
      if (p in S.$state) {
        const w = O.$state[p], I = S.$state[p];
        typeof w == "object" && it(w) && it(I) ? os(w, I) : O.$state[p] = I;
      }
      S[p] = $(O.$state, p);
    }), Object.keys(S.$state).forEach((p) => {
      p in O.$state || delete S[p];
    }), u = !1, c = !1, o.state.value[e] = $(O._hmrPayload, "hotState"), c = !0, be().then(() => {
      u = !0;
    });
    for (const p in O._hmrPayload.actions) {
      const w = O[p];
      S[p] = //
      A(w, p);
    }
    for (const p in O._hmrPayload.getters) {
      const w = O._hmrPayload.getters[p], I = a ? (
        // special handling of options api
        x(() => (jt(o), w.call(S, S)))
      ) : w;
      S[p] = //
      I;
    }
    Object.keys(S._hmrPayload.getters).forEach((p) => {
      p in O._hmrPayload.getters || delete S[p];
    }), Object.keys(S._hmrPayload.actions).forEach((p) => {
      p in O._hmrPayload.actions || delete S[p];
    }), S._hmrPayload = O._hmrPayload, S._getters = O._getters, S._hotUpdating = !1;
  })), process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Ne) {
    const O = {
      writable: !0,
      configurable: !0,
      // avoid warning on devtools trying to display this property
      enumerable: !1
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(S, p, pe({ value: S[p] }, O));
    });
  }
  return o._p.forEach((O) => {
    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Ne) {
      const p = i.run(() => O({
        store: S,
        app: o._a,
        pinia: o,
        options: s
      }));
      Object.keys(p || {}).forEach((w) => S._customProperties.add(w)), pe(S, p);
    } else
      pe(S, i.run(() => O({
        store: S,
        app: o._a,
        pinia: o,
        options: s
      })));
  }), process.env.NODE_ENV !== "production" && S.$state && typeof S.$state == "object" && typeof S.$state.constructor == "function" && !S.$state.constructor.toString().includes("[native code]") && console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${S.$id}".`), g && a && n.hydrate && n.hydrate(S.$state, g), u = !0, c = !0, S;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function dd(e, t, n) {
  let o;
  const r = typeof t == "function";
  o = r ? n : t;
  function a(i, s) {
    const l = ul();
    if (i = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && Pt && Pt._testing ? null : i) || (l ? se(qi, null) : null), i && jt(i), process.env.NODE_ENV !== "production" && !Pt)
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    i = Pt, i._s.has(e) || (r ? So(e, t, o, i) : wa(e, o, i), process.env.NODE_ENV !== "production" && (a._pinia = i));
    const u = i._s.get(e);
    if (process.env.NODE_ENV !== "production" && s) {
      const c = "__hot:" + e, d = r ? So(c, t, o, i, !0) : wa(c, pe({}, o), i, !0);
      s._hotUpdate(d), delete i.state.value[c], i._s.delete(c);
    }
    if (process.env.NODE_ENV !== "production" && Ne) {
      const c = Do();
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
const Xo = /* @__PURE__ */ dd("user", {
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
}), me = typeof window < "u", Zo = me && "IntersectionObserver" in window;
function ka(e, t, n) {
  fd(e, t), t.set(e, n);
}
function fd(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Aa(e, t, n) {
  return e.set(as(e, t), n), n;
}
function Pe(e, t) {
  return e.get(as(e, t));
}
function as(e, t, n) {
  if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function Vn(e, t) {
  if (e === t) return !0;
  if (e instanceof Date && t instanceof Date && e.getTime() !== t.getTime() || e !== Object(e) || t !== Object(t))
    return !1;
  const n = Object.keys(e);
  return n.length !== Object.keys(t).length ? !1 : n.every((o) => Vn(e[o], t[o]));
}
function z(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (e == null || e === "")
    return;
  const n = Number(e);
  return isNaN(n) ? String(e) : isFinite(n) ? `${n}${t}` : void 0;
}
function vd(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Oa(e) {
  let t;
  return e !== null && typeof e == "object" && ((t = Object.getPrototypeOf(e)) === Object.prototype || t === null);
}
function is(e) {
  if (e && "$el" in e) {
    const t = e.$el;
    return (t == null ? void 0 : t.nodeType) === Node.TEXT_NODE ? t.nextElementSibling : t;
  }
  return e;
}
const Ia = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
  shift: 16
});
function Jn(e, t) {
  return t.every((n) => e.hasOwnProperty(n));
}
function ss(e, t) {
  const n = {};
  for (const o of t)
    Object.prototype.hasOwnProperty.call(e, o) && (n[o] = e[o]);
  return n;
}
function xa(e, t, n) {
  const o = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (const a in e)
    t.some((i) => i instanceof RegExp ? i.test(a) : i === a) ? o[a] = e[a] : r[a] = e[a];
  return [o, r];
}
function ls(e, t) {
  const n = {
    ...e
  };
  return t.forEach((o) => delete n[o]), n;
}
const us = /^on[^a-z]/, cs = (e) => us.test(e), md = ["onAfterscriptexecute", "onAnimationcancel", "onAnimationend", "onAnimationiteration", "onAnimationstart", "onAuxclick", "onBeforeinput", "onBeforescriptexecute", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate", "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onFullscreenchange", "onFullscreenerror", "onGesturechange", "onGestureend", "onGesturestart", "onGotpointercapture", "onInput", "onKeydown", "onKeypress", "onKeyup", "onLostpointercapture", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onMousewheel", "onPaste", "onPointercancel", "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup", "onReset", "onSelect", "onSubmit", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onTransitioncancel", "onTransitionend", "onTransitionrun", "onTransitionstart", "onWheel"];
function gd(e) {
  const [t, n] = xa(e, [us]), o = ls(t, md), [r, a] = xa(n, ["class", "style", "id", /^data-/]);
  return Object.assign(r, t), Object.assign(a, o), [r, a];
}
function Nt(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function yn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(t, Math.min(n, e));
}
function Ta(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return e + n.repeat(Math.max(0, t - e.length));
}
function hd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  const n = [];
  let o = 0;
  for (; o < e.length; )
    n.push(e.substr(o, t)), o += t;
  return n;
}
function yt() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0;
  const o = {};
  for (const r in e)
    o[r] = e[r];
  for (const r in t) {
    const a = e[r], i = t[r];
    if (Oa(a) && Oa(i)) {
      o[r] = yt(a, i, n);
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
function ds(e) {
  return e.map((t) => t.type === Ae ? ds(t.children) : t).flat();
}
function Qe() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (Qe.cache.has(e)) return Qe.cache.get(e);
  const t = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  return Qe.cache.set(e, t), t;
}
Qe.cache = /* @__PURE__ */ new Map();
function Vt(e, t) {
  if (!t || typeof t != "object") return [];
  if (Array.isArray(t))
    return t.map((n) => Vt(e, n)).flat(1);
  if (t.suspense)
    return Vt(e, t.ssContent);
  if (Array.isArray(t.children))
    return t.children.map((n) => Vt(e, n)).flat(1);
  if (t.component) {
    if (Object.getOwnPropertySymbols(t.component.provides).includes(e))
      return [t.component];
    if (t.component.subTree)
      return Vt(e, t.component.subTree).flat(1);
  }
  return [];
}
var vt = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap();
class yd {
  constructor(t) {
    ka(this, vt, []), ka(this, Ge, 0), this.size = t;
  }
  get isFull() {
    return Pe(vt, this).length === this.size;
  }
  push(t) {
    Pe(vt, this)[Pe(Ge, this)] = t, Aa(Ge, this, (Pe(Ge, this) + 1) % this.size);
  }
  values() {
    return Pe(vt, this).slice(Pe(Ge, this)).concat(Pe(vt, this).slice(0, Pe(Ge, this)));
  }
  clear() {
    Pe(vt, this).length = 0, Aa(Ge, this, 0);
  }
}
function Jo(e) {
  const t = rt({});
  lt(() => {
    const o = e();
    for (const r in o)
      t[r] = o[r];
  }, {
    flush: "sync"
  });
  const n = {};
  for (const o in t)
    n[o] = $(() => t[o]);
  return n;
}
function _n(e, t) {
  return e.includes(t);
}
function fs(e) {
  return e[2].toLowerCase() + e.slice(3);
}
const et = () => [Function, Array];
function Pa(e, t) {
  return t = "on" + si(t), !!(e[t] || e[`${t}Once`] || e[`${t}Capture`] || e[`${t}OnceCapture`] || e[`${t}CaptureOnce`]);
}
function vs(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
    n[o - 1] = arguments[o];
  if (Array.isArray(e))
    for (const r of e)
      r(...n);
  else typeof e == "function" && e(...n);
}
function _d(e, t) {
  if (!(me && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports(`selector(${t})`))) return null;
  try {
    return !!e && e.matches(t);
  } catch {
    return null;
  }
}
function pd(e, t) {
  if (!me || e === 0)
    return t(), () => {
    };
  const n = window.setTimeout(t, e);
  return () => window.clearTimeout(n);
}
function wo() {
  const e = Q(), t = (n) => {
    e.value = n;
  };
  return Object.defineProperty(t, "value", {
    enumerable: !0,
    get: () => e.value,
    set: (n) => e.value = n
  }), Object.defineProperty(t, "el", {
    enumerable: !0,
    get: () => is(e.value)
  }), t;
}
const ms = ["top", "bottom"], bd = ["start", "end", "left", "right"];
function ko(e, t) {
  let [n, o] = e.split(" ");
  return o || (o = _n(ms, n) ? "start" : _n(bd, n) ? "top" : "center"), {
    side: Va(n, t),
    align: Va(o, t)
  };
}
function Va(e, t) {
  return e === "start" ? t ? "right" : "left" : e === "end" ? t ? "left" : "right" : e;
}
function Qn(e) {
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
function eo(e) {
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
function Da(e) {
  return {
    side: e.align,
    align: e.side
  };
}
function Ra(e) {
  return _n(ms, e.side) ? "y" : "x";
}
class Fe {
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
function Ba(e, t) {
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
function Ed(e) {
  return Array.isArray(e) ? new Fe({
    x: e[0],
    y: e[1],
    width: 0,
    height: 0
  }) : e.getBoundingClientRect();
}
function gs(e) {
  const t = e.getBoundingClientRect(), n = getComputedStyle(e), o = n.transform;
  if (o) {
    let r, a, i, s, l;
    if (o.startsWith("matrix3d("))
      r = o.slice(9, -1).split(/, /), a = Number(r[0]), i = Number(r[5]), s = Number(r[12]), l = Number(r[13]);
    else if (o.startsWith("matrix("))
      r = o.slice(7, -1).split(/, /), a = Number(r[0]), i = Number(r[3]), s = Number(r[4]), l = Number(r[5]);
    else
      return new Fe(t);
    const u = n.transformOrigin, c = t.x - s - (1 - a) * parseFloat(u), d = t.y - l - (1 - i) * parseFloat(u.slice(u.indexOf(" ") + 1)), v = a ? t.width / a : e.offsetWidth + 1, f = i ? t.height / i : e.offsetHeight + 1;
    return new Fe({
      x: c,
      y: d,
      width: v,
      height: f
    });
  } else
    return new Fe(t);
}
function hs(e, t, n) {
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
const vn = /* @__PURE__ */ new WeakMap();
function Cd(e, t) {
  Object.keys(t).forEach((n) => {
    if (cs(n)) {
      const o = fs(n), r = vn.get(e);
      if (t[n] == null)
        r == null || r.forEach((a) => {
          const [i, s] = a;
          i === o && (e.removeEventListener(o, s), r.delete(a));
        });
      else if (!r || ![...r].some((a) => a[0] === o && a[1] === t[n])) {
        e.addEventListener(o, t[n]);
        const a = r || /* @__PURE__ */ new Set();
        a.add([o, t[n]]), vn.has(e) || vn.set(e, a);
      }
    } else
      t[n] == null ? e.removeAttribute(n) : e.setAttribute(n, t[n]);
  });
}
function Sd(e, t) {
  Object.keys(t).forEach((n) => {
    if (cs(n)) {
      const o = fs(n), r = vn.get(e);
      r == null || r.forEach((a) => {
        const [i, s] = a;
        i === o && (e.removeEventListener(o, s), r.delete(a));
      });
    } else
      e.removeAttribute(n);
  });
}
const mt = 2.4, Na = 0.2126729, La = 0.7151522, Fa = 0.072175, wd = 0.55, kd = 0.58, Ad = 0.57, Od = 0.62, on = 0.03, $a = 1.45, Id = 5e-4, xd = 1.25, Td = 1.25, Pd = 0.078, Ma = 12.82051282051282, rn = 0.06, Vd = 1e-3;
function Ua(e, t) {
  const n = (e.r / 255) ** mt, o = (e.g / 255) ** mt, r = (e.b / 255) ** mt, a = (t.r / 255) ** mt, i = (t.g / 255) ** mt, s = (t.b / 255) ** mt;
  let l = n * Na + o * La + r * Fa, u = a * Na + i * La + s * Fa;
  if (l <= on && (l += (on - l) ** $a), u <= on && (u += (on - u) ** $a), Math.abs(u - l) < Id) return 0;
  let c;
  if (u > l) {
    const d = (u ** wd - l ** kd) * xd;
    c = d < Vd ? 0 : d < Pd ? d - d * Ma * rn : d - rn;
  } else {
    const d = (u ** Od - l ** Ad) * Td;
    c = d > -1e-3 ? 0 : d > -0.078 ? d - d * Ma * rn : d + rn;
  }
  return c * 100;
}
function tt(e) {
  Bo(`Vuetify: ${e}`);
}
function Dd(e) {
  Bo(`Vuetify error: ${e}`);
}
function Ao(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
}
function Rd(e) {
  return Ao(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e);
}
const ja = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/, Bd = {
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
  hsl: (e, t, n, o) => Ha({
    h: e,
    s: t,
    l: n,
    a: o
  }),
  hsla: (e, t, n, o) => Ha({
    h: e,
    s: t,
    l: n,
    a: o
  }),
  hsv: (e, t, n, o) => Ht({
    h: e,
    s: t,
    v: n,
    a: o
  }),
  hsva: (e, t, n, o) => Ht({
    h: e,
    s: t,
    v: n,
    a: o
  })
};
function Dt(e) {
  if (typeof e == "number")
    return (isNaN(e) || e < 0 || e > 16777215) && tt(`'${e}' is not a valid hex color`), {
      r: (e & 16711680) >> 16,
      g: (e & 65280) >> 8,
      b: e & 255
    };
  if (typeof e == "string" && ja.test(e)) {
    const {
      groups: t
    } = e.match(ja), {
      fn: n,
      values: o
    } = t, r = o.split(/,\s*|\s*\/\s*|\s+/).map((a, i) => a.endsWith("%") || // unitless slv are %
    i > 0 && i < 3 && ["hsl", "hsla", "hsv", "hsva"].includes(n) ? parseFloat(a) / 100 : parseFloat(a));
    return Bd[n](...r);
  } else if (typeof e == "string") {
    let t = e.startsWith("#") ? e.slice(1) : e;
    [3, 4].includes(t.length) ? t = t.split("").map((o) => o + o).join("") : [6, 8].includes(t.length) || tt(`'${e}' is not a valid hex(a) color`);
    const n = parseInt(t, 16);
    return (isNaN(n) || n < 0 || n > 4294967295) && tt(`'${e}' is not a valid hex(a) color`), Nd(t);
  } else if (typeof e == "object") {
    if (Jn(e, ["r", "g", "b"]))
      return e;
    if (Jn(e, ["h", "s", "l"]))
      return Ht(ys(e));
    if (Jn(e, ["h", "s", "v"]))
      return Ht(e);
  }
  throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
function Ht(e) {
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
function Ha(e) {
  return Ht(ys(e));
}
function ys(e) {
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
function Nd(e) {
  e = Ld(e);
  let [t, n, o, r] = hd(e, 2).map((a) => parseInt(a, 16));
  return r = r === void 0 ? r : r / 255, {
    r: t,
    g: n,
    b: o,
    a: r
  };
}
function Ld(e) {
  return e.startsWith("#") && (e = e.slice(1)), e = e.replace(/([^0-9a-f])/gi, "F"), (e.length === 3 || e.length === 4) && (e = e.split("").map((t) => t + t).join("")), e.length !== 6 && (e = Ta(Ta(e, 6), 8, "F")), e;
}
function Fd(e) {
  const t = Math.abs(Ua(Dt(0), Dt(e)));
  return Math.abs(Ua(Dt(16777215), Dt(e))) > Math.min(t, 50) ? "#fff" : "#000";
}
function L(e, t) {
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
const J = L({
  class: [String, Array, Object],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
function re(e, t) {
  const n = Do();
  if (!n)
    throw new Error(`[Vuetify] ${e} must be called from inside a setup function`);
  return n;
}
function Ie() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const t = re(e).type;
  return Qe((t == null ? void 0 : t.aliasName) || (t == null ? void 0 : t.name));
}
function $d(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : re("injectSelf");
  const {
    provides: n
  } = t;
  if (n && e in n)
    return n[e];
}
const pn = Symbol.for("vuetify:defaults");
function Qo() {
  const e = se(pn);
  if (!e) throw new Error("[Vuetify] Could not find defaults instance");
  return e;
}
function er(e, t) {
  const n = Qo(), o = U(e), r = x(() => {
    if (Ce(t == null ? void 0 : t.disabled)) return n.value;
    const i = Ce(t == null ? void 0 : t.scoped), s = Ce(t == null ? void 0 : t.reset), l = Ce(t == null ? void 0 : t.root);
    if (o.value == null && !(i || s || l)) return n.value;
    let u = yt(o.value, {
      prev: n.value
    });
    if (i) return u;
    if (s || l) {
      const c = Number(s || 1 / 0);
      for (let d = 0; d <= c && !(!u || !("prev" in u)); d++)
        u = u.prev;
      return u && typeof l == "string" && l in u && (u = yt(yt(u, {
        prev: u
      }), u[l])), u;
    }
    return u.prev ? yt(u.prev, u) : u;
  });
  return ut(pn, r), r;
}
function Md(e, t) {
  return e.props && (typeof e.props[t] < "u" || typeof e.props[Qe(t)] < "u");
}
function Ud() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Qo();
  const o = re("useDefaults");
  if (t = t ?? o.type.name ?? o.type.__name, !t)
    throw new Error("[Vuetify] Could not determine component name");
  const r = x(() => {
    var l;
    return (l = n.value) == null ? void 0 : l[e._as ?? t];
  }), a = new Proxy(e, {
    get(l, u) {
      var f, g, y, _;
      const c = Reflect.get(l, u);
      if (u === "class" || u === "style")
        return [(f = r.value) == null ? void 0 : f[u], c].filter((h) => h != null);
      if (Md(o.vnode, u)) return c;
      const d = (g = r.value) == null ? void 0 : g[u];
      if (d !== void 0) return d;
      const v = (_ = (y = n.value) == null ? void 0 : y.global) == null ? void 0 : _[u];
      return v !== void 0 ? v : c;
    }
  }), i = Q();
  lt(() => {
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
    const l = $d(pn, o);
    ut(pn, x(() => i.value ? yt((l == null ? void 0 : l.value) ?? {}, i.value) : l == null ? void 0 : l.value));
  }
  return {
    props: a,
    provideSubDefaults: s
  };
}
function Dn(e) {
  if (e._setup = e._setup ?? e.setup, !e.name)
    return tt("The component is missing an explicit name, unable to generate default prop value"), e;
  if (e._setup) {
    e.props = L(e.props ?? {}, e.name)();
    const t = Object.keys(e.props).filter((n) => n !== "class" && n !== "style");
    e.filterProps = function(o) {
      return ss(o, t);
    }, e.props._as = String, e.setup = function(o, r) {
      const a = Qo();
      if (!a.value) return e._setup(o, r);
      const {
        props: i,
        provideSubDefaults: s
      } = Ud(o, o._as ?? e.name, a), l = e._setup(i, r);
      return s(), l;
    };
  }
  return e;
}
function G() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
  return (t) => (e ? Dn : dl)(t);
}
function jd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", n = arguments.length > 2 ? arguments[2] : void 0;
  return G()({
    name: n ?? si(li(e.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: t
      },
      ...J()
    },
    setup(o, r) {
      let {
        slots: a
      } = r;
      return () => {
        var i;
        return Sn(o.tag, {
          class: [e, o.class],
          style: o.style
        }, (i = a.default) == null ? void 0 : i.call(a));
      };
    }
  });
}
function _s(e) {
  if (typeof e.getRootNode != "function") {
    for (; e.parentNode; ) e = e.parentNode;
    return e !== document ? null : document;
  }
  const t = e.getRootNode();
  return t !== document && t.getRootNode({
    composed: !0
  }) !== document ? null : t;
}
const ps = "cubic-bezier(0.4, 0, 0.2, 1)";
function Hd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  for (; e; ) {
    if (t ? zd(e) : tr(e)) return e;
    e = e.parentElement;
  }
  return document.scrollingElement;
}
function bn(e, t) {
  const n = [];
  if (t && e && !t.contains(e)) return n;
  for (; e && (tr(e) && n.push(e), e !== t); )
    e = e.parentElement;
  return n;
}
function tr(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return t.overflowY === "scroll" || t.overflowY === "auto" && e.scrollHeight > e.clientHeight;
}
function zd(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return ["scroll", "auto"].includes(t.overflowY);
}
function Wd(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === "fixed")
      return !0;
    e = e.offsetParent;
  }
  return !1;
}
function Y(e) {
  const t = re("useRender");
  t.render = e;
}
const Yt = L({
  border: [Boolean, Number, String]
}, "border");
function Xt(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return {
    borderClasses: x(() => {
      const o = e.border;
      return o === !0 || o === "" ? `${t}--border` : typeof o == "string" || o === 0 ? String(o).split(" ").map((r) => `border-${r}`) : [];
    })
  };
}
const Kd = [null, "default", "comfortable", "compact"], wt = L({
  density: {
    type: String,
    default: "default",
    validator: (e) => Kd.includes(e)
  }
}, "density");
function Zt(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return {
    densityClasses: $(() => `${t}--density-${e.density}`)
  };
}
const Rn = L({
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
function Bn(e) {
  return {
    elevationClasses: $(() => {
      const n = Me(e) ? e.value : e.elevation;
      return n == null ? [] : [`elevation-${n}`];
    })
  };
}
const De = L({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  },
  tile: Boolean
}, "rounded");
function Re(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return {
    roundedClasses: x(() => {
      const o = Me(e) ? e.value : e.rounded, r = Me(e) ? e.value : e.tile, a = [];
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
const xe = L({
  tag: {
    type: [String, Object, Function],
    default: "div"
  }
}, "tag"), Oo = Symbol.for("vuetify:theme"), he = L({
  theme: String
}, "theme");
function Se(e) {
  re("provideTheme");
  const t = se(Oo, null);
  if (!t) throw new Error("Could not find Vuetify theme injection");
  const n = $(() => e.theme ?? t.name.value), o = $(() => t.themes.value[n.value]), r = $(() => t.isDisabled ? void 0 : `v-theme--${n.value}`), a = {
    ...t,
    name: n,
    current: o,
    themeClasses: r
  };
  return ut(Oo, a), a;
}
function Gd() {
  re("useTheme");
  const e = se(Oo, null);
  if (!e) throw new Error("Could not find Vuetify theme injection");
  return e;
}
function nr(e) {
  return Jo(() => {
    const t = Ue(e), n = [], o = {};
    if (t.background)
      if (Ao(t.background)) {
        if (o.backgroundColor = t.background, !t.text && Rd(t.background)) {
          const r = Dt(t.background);
          if (r.a == null || r.a === 1) {
            const a = Fd(r);
            o.color = a, o.caretColor = a;
          }
        }
      } else
        n.push(`bg-${t.background}`);
    return t.text && (Ao(t.text) ? (o.color = t.text, o.caretColor = t.text) : n.push(`text-${t.text}`)), {
      colorClasses: n,
      colorStyles: o
    };
  });
}
function Et(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = nr(() => ({
    text: Ue(e)
  }));
  return {
    textColorClasses: t,
    textColorStyles: n
  };
}
function nt(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = nr(() => ({
    background: Ue(e)
  }));
  return {
    backgroundColorClasses: t,
    backgroundColorStyles: n
  };
}
const qd = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function Nn(e, t) {
  return m(Ae, null, [e && m("span", {
    key: "overlay",
    class: `${t}__overlay`
  }, null), m("span", {
    key: "underlay",
    class: `${t}__underlay`
  }, null)]);
}
const Jt = L({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (e) => qd.includes(e)
  }
}, "variant");
function Ln(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  const n = $(() => {
    const {
      variant: a
    } = Ue(e);
    return `${t}--variant-${a}`;
  }), {
    colorClasses: o,
    colorStyles: r
  } = nr(() => {
    const {
      variant: a,
      color: i
    } = Ue(e);
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
const bs = L({
  baseColor: String,
  divided: Boolean,
  ...Yt(),
  ...J(),
  ...wt(),
  ...Rn(),
  ...De(),
  ...xe(),
  ...he(),
  ...Jt()
}, "VBtnGroup"), za = G()({
  name: "VBtnGroup",
  props: bs(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = Se(e), {
      densityClasses: r
    } = Zt(e), {
      borderClasses: a
    } = Xt(e), {
      elevationClasses: i
    } = Bn(e), {
      roundedClasses: s
    } = Re(e);
    er({
      VBtn: {
        height: "auto",
        baseColor: $(() => e.baseColor),
        color: $(() => e.color),
        density: $(() => e.density),
        flat: !0,
        variant: $(() => e.variant)
      }
    }), Y(() => m(e.tag, {
      class: ["v-btn-group", {
        "v-btn-group--divided": e.divided
      }, o.value, a.value, r.value, i.value, s.value, e.class],
      style: e.style
    }, n));
  }
});
function st(e, t) {
  let n;
  function o() {
    n = Kt(), n.run(() => t.length ? t(() => {
      n == null || n.stop(), o();
    }) : t());
  }
  K(e, (r) => {
    r && !n ? o() : r || (n == null || n.stop(), n = void 0);
  }, {
    immediate: !0
  }), ge(() => {
    n == null || n.stop();
  });
}
function ze(e, t, n) {
  let o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (d) => d, r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (d) => d;
  const a = re("useProxiedModel"), i = U(e[t] !== void 0 ? e[t] : n), s = Qe(t), u = s !== t ? x(() => {
    var d, v, f, g;
    return e[t], !!(((d = a.vnode.props) != null && d.hasOwnProperty(t) || (v = a.vnode.props) != null && v.hasOwnProperty(s)) && ((f = a.vnode.props) != null && f.hasOwnProperty(`onUpdate:${t}`) || (g = a.vnode.props) != null && g.hasOwnProperty(`onUpdate:${s}`)));
  }) : x(() => {
    var d, v;
    return e[t], !!((d = a.vnode.props) != null && d.hasOwnProperty(t) && ((v = a.vnode.props) != null && v.hasOwnProperty(`onUpdate:${t}`)));
  });
  st(() => !u.value, () => {
    K(() => e[t], (d) => {
      i.value = d;
    });
  });
  const c = x({
    get() {
      const d = e[t];
      return o(u.value ? d : i.value);
    },
    set(d) {
      const v = r(d), f = ot(u.value ? e[t] : i.value);
      f === v || o(f) === d || (i.value = v, a == null || a.emit(`update:${t}`, v));
    }
  });
  return Object.defineProperty(c, "externalValue", {
    get: () => u.value ? e[t] : i.value
  }), c;
}
const Yd = L({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group"), Xd = L({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function Zd(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  const o = re("useGroupItem");
  if (!o)
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  const r = wn();
  ut(Symbol.for(`${t.description}:id`), r);
  const a = se(t, null);
  if (!a) {
    if (!n) return a;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t.description}`);
  }
  const i = $(() => e.value), s = x(() => !!(a.disabled.value || e.disabled));
  a.register({
    id: r,
    value: i,
    disabled: s
  }, o), ct(() => {
    a.unregister(r);
  });
  const l = x(() => a.isSelected(r)), u = x(() => a.items.value[0].id === r), c = x(() => a.items.value[a.items.value.length - 1].id === r), d = x(() => l.value && [a.selectedClass.value, e.selectedClass]);
  return K(l, (v) => {
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
function Jd(e, t) {
  let n = !1;
  const o = rt([]), r = ze(e, "modelValue", [], (v) => v == null ? [] : Es(o, Nt(v)), (v) => {
    const f = ef(o, v);
    return e.multiple ? f : f[0];
  }), a = re("useGroup");
  function i(v, f) {
    const g = v, y = Symbol.for(`${t.description}:id`), h = Vt(y, a == null ? void 0 : a.vnode).indexOf(f);
    Ce(g.value) == null && (g.value = h, g.useIndexAsValue = !0), h > -1 ? o.splice(h, 0, g) : o.push(g);
  }
  function s(v) {
    if (n) return;
    l();
    const f = o.findIndex((g) => g.id === v);
    o.splice(f, 1);
  }
  function l() {
    const v = o.find((f) => !f.disabled);
    v && e.mandatory === "force" && !r.value.length && (r.value = [v.id]);
  }
  kn(() => {
    l();
  }), ct(() => {
    n = !0;
  }), fl(() => {
    for (let v = 0; v < o.length; v++)
      o[v].useIndexAsValue && (o[v].value = v);
  });
  function u(v, f) {
    const g = o.find((y) => y.id === v);
    if (!(f && (g != null && g.disabled)))
      if (e.multiple) {
        const y = r.value.slice(), _ = y.findIndex((C) => C === v), h = ~_;
        if (f = f ?? !h, h && e.mandatory && y.length <= 1 || !h && e.max != null && y.length + 1 > e.max) return;
        _ < 0 && f ? y.push(v) : _ >= 0 && !f && y.splice(_, 1), r.value = y;
      } else {
        const y = r.value.includes(v);
        if (e.mandatory && y) return;
        r.value = f ?? !y ? [v] : [];
      }
  }
  function c(v) {
    if (e.multiple && tt('This method is not supported when using "multiple" prop'), r.value.length) {
      const f = r.value[0], g = o.findIndex((h) => h.id === f);
      let y = (g + v) % o.length, _ = o[y];
      for (; _.disabled && y !== g; )
        y = (y + v) % o.length, _ = o[y];
      if (_.disabled) return;
      r.value = [o[y].id];
    } else {
      const f = o.find((g) => !g.disabled);
      f && (r.value = [f.id]);
    }
  }
  const d = {
    register: i,
    unregister: s,
    selected: r,
    select: u,
    disabled: $(() => e.disabled),
    prev: () => c(o.length - 1),
    next: () => c(1),
    isSelected: (v) => r.value.includes(v),
    selectedClass: $(() => e.selectedClass),
    items: $(() => o),
    getItemIndex: (v) => Qd(o, v)
  };
  return ut(t, d), d;
}
function Qd(e, t) {
  const n = Es(e, [t]);
  return n.length ? e.findIndex((o) => o.id === n[0]) : -1;
}
function Es(e, t) {
  const n = [];
  return t.forEach((o) => {
    const r = e.find((i) => Vn(o, i.value)), a = e[o];
    (r == null ? void 0 : r.value) != null ? n.push(r.id) : a != null && n.push(a.id);
  }), n;
}
function ef(e, t) {
  const n = [];
  return t.forEach((o) => {
    const r = e.findIndex((a) => a.id === o);
    if (~r) {
      const a = e[r];
      n.push(a.value != null ? a.value : r);
    }
  }), n;
}
const Cs = Symbol.for("vuetify:v-btn-toggle"), tf = L({
  ...bs(),
  ...Yd()
}, "VBtnToggle");
G()({
  name: "VBtnToggle",
  props: tf(),
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
    } = Jd(e, Cs);
    return Y(() => {
      const l = za.filterProps(e);
      return m(za, ee({
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
const nf = L({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider"), Ve = G(!1)({
  name: "VDefaultsProvider",
  props: nf(),
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
    } = io(e);
    return er(o, {
      reset: a,
      root: i,
      scoped: s,
      disabled: r
    }), () => {
      var l;
      return (l = n.default) == null ? void 0 : l.call(n);
    };
  }
}), de = [String, Function, Object, Array], of = Symbol.for("vuetify:icons"), Fn = L({
  icon: {
    type: de
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: [String, Object, Function],
    required: !0
  }
}, "icon"), Wa = G()({
  name: "VComponentIcon",
  props: Fn(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return () => {
      const o = e.icon;
      return m(e.tag, null, {
        default: () => {
          var r;
          return [e.icon ? m(o, null, null) : (r = n.default) == null ? void 0 : r.call(n)];
        }
      });
    };
  }
}), rf = Dn({
  name: "VSvgIcon",
  inheritAttrs: !1,
  props: Fn(),
  setup(e, t) {
    let {
      attrs: n
    } = t;
    return () => m(e.tag, ee(n, {
      style: null
    }), {
      default: () => [m("svg", {
        class: "v-icon__svg",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true"
      }, [Array.isArray(e.icon) ? e.icon.map((o) => Array.isArray(o) ? m("path", {
        d: o[0],
        "fill-opacity": o[1]
      }, null) : m("path", {
        d: o
      }, null)) : m("path", {
        d: e.icon
      }, null)])]
    });
  }
});
Dn({
  name: "VLigatureIcon",
  props: Fn(),
  setup(e) {
    return () => m(e.tag, null, {
      default: () => [e.icon]
    });
  }
});
Dn({
  name: "VClassIcon",
  props: Fn(),
  setup(e) {
    return () => m(e.tag, {
      class: e.icon
    }, null);
  }
});
const af = (e) => {
  const t = se(of);
  if (!t) throw new Error("Missing Vuetify Icons provide!");
  return {
    iconData: x(() => {
      var l;
      const o = Ue(e);
      if (!o) return {
        component: Wa
      };
      let r = o;
      if (typeof r == "string" && (r = r.trim(), r.startsWith("$") && (r = (l = t.aliases) == null ? void 0 : l[r.slice(1)])), r || tt(`Could not find aliased icon "${o}"`), Array.isArray(r))
        return {
          component: rf,
          icon: r
        };
      if (typeof r != "string")
        return {
          component: Wa,
          icon: r
        };
      const a = Object.keys(t.sets).find((u) => typeof r == "string" && r.startsWith(`${u}:`)), i = a ? r.slice(a.length + 1) : r;
      return {
        component: t.sets[a ?? t.defaultSet].component,
        icon: i
      };
    })
  };
}, sf = ["x-small", "small", "default", "large", "x-large"], $n = L({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function Mn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return Jo(() => {
    const n = e.size;
    let o, r;
    return _n(sf, n) ? o = `${t}--size-${n}` : n && (r = {
      width: z(n),
      height: z(n)
    }), {
      sizeClasses: o,
      sizeStyles: r
    };
  });
}
const lf = L({
  color: String,
  disabled: Boolean,
  start: Boolean,
  end: Boolean,
  icon: de,
  opacity: [String, Number],
  ...J(),
  ...$n(),
  ...xe({
    tag: "i"
  }),
  ...he()
}, "VIcon"), $e = G()({
  name: "VIcon",
  props: lf(),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const r = Q(), {
      themeClasses: a
    } = Gd(), {
      iconData: i
    } = af(() => r.value || e.icon), {
      sizeClasses: s
    } = Mn(e), {
      textColorClasses: l,
      textColorStyles: u
    } = Et(() => e.color);
    return Y(() => {
      var v, f;
      const c = (v = o.default) == null ? void 0 : v.call(o);
      c && (r.value = (f = ds(c).filter((g) => g.type === vl && g.children && typeof g.children == "string")[0]) == null ? void 0 : f.children);
      const d = !!(n.onClick || n.onClickOnce);
      return m(i.value.component, {
        tag: e.tag,
        icon: i.value.icon,
        class: ["v-icon", "notranslate", a.value, s.value, l.value, {
          "v-icon--clickable": d,
          "v-icon--disabled": e.disabled,
          "v-icon--start": e.start,
          "v-icon--end": e.end
        }, e.class],
        style: [{
          "--v-icon-opacity": e.opacity
        }, s.value ? void 0 : {
          fontSize: z(e.size),
          height: z(e.size),
          width: z(e.size)
        }, u.value, e.style],
        role: d ? "button" : void 0,
        "aria-hidden": !d,
        tabindex: d ? e.disabled ? -1 : 0 : void 0
      }, {
        default: () => [c]
      });
    }), {};
  }
});
function Ss(e, t) {
  const n = U(), o = Q(!1);
  if (Zo) {
    const r = new IntersectionObserver((a) => {
      o.value = !!a.find((i) => i.isIntersecting);
    }, t);
    ct(() => {
      r.disconnect();
    }), K(n, (a, i) => {
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
function uf(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const n = wo(), o = U();
  if (me) {
    const r = new ResizeObserver((a) => {
      a.length && (t === "content" ? o.value = a[0].contentRect : o.value = a[0].target.getBoundingClientRect());
    });
    ct(() => {
      r.disconnect();
    }), K(() => n.el, (a, i) => {
      i && (r.unobserve(i), o.value = void 0), a && r.observe(a);
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef: n,
    contentRect: ui(o)
  };
}
const cf = L({
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
  ...J(),
  ...$n(),
  ...xe({
    tag: "div"
  }),
  ...he()
}, "VProgressCircular"), df = G()({
  name: "VProgressCircular",
  props: cf(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = 20, r = 2 * Math.PI * o, a = U(), {
      themeClasses: i
    } = Se(e), {
      sizeClasses: s,
      sizeStyles: l
    } = Mn(e), {
      textColorClasses: u,
      textColorStyles: c
    } = Et(() => e.color), {
      textColorClasses: d,
      textColorStyles: v
    } = Et(() => e.bgColor), {
      intersectionRef: f,
      isIntersecting: g
    } = Ss(), {
      resizeRef: y,
      contentRect: _
    } = uf(), h = $(() => Math.max(0, Math.min(100, parseFloat(e.modelValue)))), C = $(() => Number(e.width)), b = $(() => l.value ? Number(e.size) : _.value ? _.value.width : Math.max(C.value, 32)), A = $(() => o / (1 - C.value / b.value) * 2), R = $(() => C.value / b.value * A.value), P = $(() => z((100 - h.value) / 100 * r));
    return lt(() => {
      f.value = a.value, y.value = a.value;
    }), Y(() => m(e.tag, {
      ref: a,
      class: ["v-progress-circular", {
        "v-progress-circular--indeterminate": !!e.indeterminate,
        "v-progress-circular--visible": g.value,
        "v-progress-circular--disable-shrink": e.indeterminate === "disable-shrink"
      }, i.value, s.value, u.value, e.class],
      style: [l.value, c.value, e.style],
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": e.indeterminate ? void 0 : h.value
    }, {
      default: () => [m("svg", {
        style: {
          transform: `rotate(calc(-90deg + ${Number(e.rotate)}deg))`
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${A.value} ${A.value}`
      }, [m("circle", {
        class: ["v-progress-circular__underlay", d.value],
        style: v.value,
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: o,
        "stroke-width": R.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": 0
      }, null), m("circle", {
        class: "v-progress-circular__overlay",
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: o,
        "stroke-width": R.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": P.value
      }, null)]), n.default && m("div", {
        class: "v-progress-circular__content"
      }, [n.default({
        value: h.value
      })])]
    })), {};
  }
}), kt = L({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function At(e) {
  return {
    dimensionStyles: x(() => {
      const n = {}, o = z(e.height), r = z(e.maxHeight), a = z(e.maxWidth), i = z(e.minHeight), s = z(e.minWidth), l = z(e.width);
      return o != null && (n.height = o), r != null && (n.maxHeight = r), a != null && (n.maxWidth = a), i != null && (n.minHeight = i), s != null && (n.minWidth = s), l != null && (n.width = l), n;
    })
  };
}
const ws = Symbol.for("vuetify:locale");
function ff() {
  const e = se(ws);
  if (!e) throw new Error("[Vuetify] Could not find injected locale instance");
  return e;
}
function Qt() {
  const e = se(ws);
  if (!e) throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: e.isRtl,
    rtlClasses: e.rtlClasses
  };
}
const Ka = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, en = L({
  location: String
}, "location");
function Un(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl: o
  } = Qt();
  return {
    locationStyles: x(() => {
      if (!e.location) return {};
      const {
        side: a,
        align: i
      } = ko(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, o.value);
      function s(u) {
        return n ? n(u) : 0;
      }
      const l = {};
      return a !== "center" && (t ? l[Ka[a]] = `calc(100% - ${s(a)}px)` : l[a] = 0), i !== "center" ? t ? l[Ka[i]] = `calc(100% - ${s(i)}px)` : l[i] = 0 : (a === "center" ? l.top = l.left = "50%" : l[{
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
const vf = L({
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
  ...J(),
  ...en({
    location: "top"
  }),
  ...De(),
  ...xe(),
  ...he()
}, "VProgressLinear"), ks = G()({
  name: "VProgressLinear",
  props: vf(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    var p;
    let {
      slots: n
    } = t;
    const o = ze(e, "modelValue"), {
      isRtl: r,
      rtlClasses: a
    } = Qt(), {
      themeClasses: i
    } = Se(e), {
      locationStyles: s
    } = Un(e), {
      textColorClasses: l,
      textColorStyles: u
    } = Et(() => e.color), {
      backgroundColorClasses: c,
      backgroundColorStyles: d
    } = nt(() => e.bgColor || e.color), {
      backgroundColorClasses: v,
      backgroundColorStyles: f
    } = nt(() => e.bufferColor || e.bgColor || e.color), {
      backgroundColorClasses: g,
      backgroundColorStyles: y
    } = nt(() => e.color), {
      roundedClasses: _
    } = Re(e), {
      intersectionRef: h,
      isIntersecting: C
    } = Ss(), b = x(() => parseFloat(e.max)), A = x(() => parseFloat(e.height)), R = x(() => yn(parseFloat(e.bufferValue) / b.value * 100, 0, 100)), P = x(() => yn(parseFloat(o.value) / b.value * 100, 0, 100)), S = x(() => r.value !== e.reverse), k = x(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), B = me && ((p = window.matchMedia) == null ? void 0 : p.call(window, "(forced-colors: active)").matches);
    function O(w) {
      if (!h.value) return;
      const {
        left: I,
        right: V,
        width: F
      } = h.value.getBoundingClientRect(), N = S.value ? F - w.clientX + (V - F) : w.clientX - I;
      o.value = Math.round(N / F * b.value);
    }
    return Y(() => m(e.tag, {
      ref: h,
      class: ["v-progress-linear", {
        "v-progress-linear--absolute": e.absolute,
        "v-progress-linear--active": e.active && C.value,
        "v-progress-linear--reverse": S.value,
        "v-progress-linear--rounded": e.rounded,
        "v-progress-linear--rounded-bar": e.roundedBar,
        "v-progress-linear--striped": e.striped
      }, _.value, i.value, a.value, e.class],
      style: [{
        bottom: e.location === "bottom" ? 0 : void 0,
        top: e.location === "top" ? 0 : void 0,
        height: e.active ? z(A.value) : 0,
        "--v-progress-linear-height": z(A.value),
        ...e.absolute ? s.value : {}
      }, e.style],
      role: "progressbar",
      "aria-hidden": e.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": e.max,
      "aria-valuenow": e.indeterminate ? void 0 : Math.min(parseFloat(o.value), b.value),
      onClick: e.clickable && O
    }, {
      default: () => [e.stream && m("div", {
        key: "stream",
        class: ["v-progress-linear__stream", l.value],
        style: {
          ...u.value,
          [S.value ? "left" : "right"]: z(-A.value),
          borderTop: `${z(A.value / 2)} dotted`,
          opacity: parseFloat(e.bufferOpacity),
          top: `calc(50% - ${z(A.value / 4)})`,
          width: z(100 - R.value, "%"),
          "--v-progress-linear-stream-to": z(A.value * (S.value ? 1 : -1))
        }
      }, null), m("div", {
        class: ["v-progress-linear__background", B ? void 0 : c.value],
        style: [d.value, {
          opacity: parseFloat(e.bgOpacity),
          width: e.stream ? 0 : void 0
        }]
      }, null), m("div", {
        class: ["v-progress-linear__buffer", B ? void 0 : v.value],
        style: [f.value, {
          opacity: parseFloat(e.bufferOpacity),
          width: z(R.value, "%")
        }]
      }, null), m(Gt, {
        name: k.value
      }, {
        default: () => [e.indeterminate ? m("div", {
          class: "v-progress-linear__indeterminate"
        }, [["long", "short"].map((w) => m("div", {
          key: w,
          class: ["v-progress-linear__indeterminate", w, B ? void 0 : g.value],
          style: y.value
        }, null))]) : m("div", {
          class: ["v-progress-linear__determinate", B ? void 0 : g.value],
          style: [y.value, {
            width: z(P.value, "%")
          }]
        }, null)]
      }), n.default && m("div", {
        class: "v-progress-linear__content"
      }, [n.default({
        value: P.value,
        buffer: R.value
      })])]
    })), {};
  }
}), or = L({
  loading: [Boolean, String]
}, "loader");
function rr(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return {
    loaderClasses: $(() => ({
      [`${t}--loading`]: e.loading
    }))
  };
}
function As(e, t) {
  var o;
  let {
    slots: n
  } = t;
  return m("div", {
    class: `${e.name}__loader`
  }, [((o = n.default) == null ? void 0 : o.call(n, {
    color: e.color,
    isActive: e.active
  })) || m(ks, {
    absolute: e.absolute,
    active: e.active,
    color: e.color,
    height: "2",
    indeterminate: !0
  }, null)]);
}
const mf = ["static", "relative", "fixed", "absolute", "sticky"], jn = L({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (e) => mf.includes(e)
    )
  }
}, "position");
function Hn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  return {
    positionClasses: $(() => e.position ? `${t}--${e.position}` : void 0)
  };
}
function gf() {
  const e = re("useRoute");
  return x(() => {
    var t;
    return (t = e == null ? void 0 : e.proxy) == null ? void 0 : t.$route;
  });
}
function hf() {
  var e, t;
  return (t = (e = re("useRouter")) == null ? void 0 : e.proxy) == null ? void 0 : t.$router;
}
function Os(e, t) {
  var c, d;
  const n = ml("RouterLink"), o = $(() => !!(e.href || e.to)), r = x(() => (o == null ? void 0 : o.value) || Pa(t, "click") || Pa(e, "click"));
  if (typeof n == "string" || !("useLink" in n)) {
    const v = $(() => e.href);
    return {
      isLink: o,
      isClickable: r,
      href: v,
      linkProps: rt({
        href: v
      })
    };
  }
  const a = n.useLink({
    to: $(() => e.to || ""),
    replace: $(() => e.replace)
  }), i = x(() => e.to ? a : void 0), s = gf(), l = x(() => {
    var v, f, g;
    return i.value ? e.exact ? s.value ? ((g = i.value.isExactActive) == null ? void 0 : g.value) && Vn(i.value.route.value.query, s.value.query) : ((f = i.value.isExactActive) == null ? void 0 : f.value) ?? !1 : ((v = i.value.isActive) == null ? void 0 : v.value) ?? !1 : !1;
  }), u = x(() => {
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
    linkProps: rt({
      href: u,
      "aria-current": $(() => l.value ? "page" : void 0)
    })
  };
}
const Is = L({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let to = !1;
function yf(e, t) {
  let n = !1, o, r;
  me && (e != null && e.beforeEach) && (be(() => {
    window.addEventListener("popstate", a), o = e.beforeEach((i, s, l) => {
      to ? n ? t(l) : l() : setTimeout(() => n ? t(l) : l()), to = !0;
    }), r = e == null ? void 0 : e.afterEach(() => {
      to = !1;
    });
  }), ge(() => {
    window.removeEventListener("popstate", a), o == null || o(), r == null || r();
  }));
  function a(i) {
    var s;
    (s = i.state) != null && s.replaced || (n = !0, setTimeout(() => n = !1));
  }
}
function _f(e, t) {
  K(() => {
    var n;
    return (n = e.isActive) == null ? void 0 : n.value;
  }, (n) => {
    e.isLink.value && n && t && be(() => {
      t(!0);
    });
  }, {
    immediate: !0
  });
}
const Io = Symbol("rippleStop"), pf = 80;
function Ga(e, t) {
  e.style.transform = t, e.style.webkitTransform = t;
}
function xo(e) {
  return e.constructor.name === "TouchEvent";
}
function xs(e) {
  return e.constructor.name === "KeyboardEvent";
}
const bf = function(e, t) {
  var d;
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = 0, r = 0;
  if (!xs(e)) {
    const v = t.getBoundingClientRect(), f = xo(e) ? e.touches[e.touches.length - 1] : e;
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
}, En = {
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
    } = bf(e, t, n), d = `${a * 2}px`;
    r.className = "v-ripple__animation", r.style.width = d, r.style.height = d, t.appendChild(o);
    const v = window.getComputedStyle(t);
    v && v.position === "static" && (t.style.position = "relative", t.dataset.previousPosition = "static"), r.classList.add("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--visible"), Ga(r, `translate(${s}, ${l}) scale3d(${i},${i},${i})`), r.dataset.activated = String(performance.now()), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        r.classList.remove("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--in"), Ga(r, `translate(${u}, ${c}) scale3d(1,1,1)`);
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
function Ts(e) {
  return typeof e > "u" || !!e;
}
function zt(e) {
  const t = {}, n = e.currentTarget;
  if (!(!(n != null && n._ripple) || n._ripple.touched || e[Io])) {
    if (e[Io] = !0, xo(e))
      n._ripple.touched = !0, n._ripple.isTouch = !0;
    else if (n._ripple.isTouch) return;
    if (t.center = n._ripple.centered || xs(e), n._ripple.class && (t.class = n._ripple.class), xo(e)) {
      if (n._ripple.showTimerCommit) return;
      n._ripple.showTimerCommit = () => {
        En.show(e, n, t);
      }, n._ripple.showTimer = window.setTimeout(() => {
        var o;
        (o = n == null ? void 0 : n._ripple) != null && o.showTimerCommit && (n._ripple.showTimerCommit(), n._ripple.showTimerCommit = null);
      }, pf);
    } else
      En.show(e, n, t);
  }
}
function qa(e) {
  e[Io] = !0;
}
function ve(e) {
  const t = e.currentTarget;
  if (t != null && t._ripple) {
    if (window.clearTimeout(t._ripple.showTimer), e.type === "touchend" && t._ripple.showTimerCommit) {
      t._ripple.showTimerCommit(), t._ripple.showTimerCommit = null, t._ripple.showTimer = window.setTimeout(() => {
        ve(e);
      });
      return;
    }
    window.setTimeout(() => {
      t._ripple && (t._ripple.touched = !1);
    }), En.hide(t);
  }
}
function Ps(e) {
  const t = e.currentTarget;
  t != null && t._ripple && (t._ripple.showTimerCommit && (t._ripple.showTimerCommit = null), window.clearTimeout(t._ripple.showTimer));
}
let Wt = !1;
function Vs(e) {
  !Wt && (e.keyCode === Ia.enter || e.keyCode === Ia.space) && (Wt = !0, zt(e));
}
function Ds(e) {
  Wt = !1, ve(e);
}
function Rs(e) {
  Wt && (Wt = !1, ve(e));
}
function Bs(e, t, n) {
  const {
    value: o,
    modifiers: r
  } = t, a = Ts(o);
  if (a || En.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = a, e._ripple.centered = r.center, e._ripple.circle = r.circle, vd(o) && o.class && (e._ripple.class = o.class), a && !n) {
    if (r.stop) {
      e.addEventListener("touchstart", qa, {
        passive: !0
      }), e.addEventListener("mousedown", qa);
      return;
    }
    e.addEventListener("touchstart", zt, {
      passive: !0
    }), e.addEventListener("touchend", ve, {
      passive: !0
    }), e.addEventListener("touchmove", Ps, {
      passive: !0
    }), e.addEventListener("touchcancel", ve), e.addEventListener("mousedown", zt), e.addEventListener("mouseup", ve), e.addEventListener("mouseleave", ve), e.addEventListener("keydown", Vs), e.addEventListener("keyup", Ds), e.addEventListener("blur", Rs), e.addEventListener("dragstart", ve, {
      passive: !0
    });
  } else !a && n && Ns(e);
}
function Ns(e) {
  e.removeEventListener("mousedown", zt), e.removeEventListener("touchstart", zt), e.removeEventListener("touchend", ve), e.removeEventListener("touchmove", Ps), e.removeEventListener("touchcancel", ve), e.removeEventListener("mouseup", ve), e.removeEventListener("mouseleave", ve), e.removeEventListener("keydown", Vs), e.removeEventListener("keyup", Ds), e.removeEventListener("dragstart", ve), e.removeEventListener("blur", Rs);
}
function Ef(e, t) {
  Bs(e, t, !1);
}
function Cf(e) {
  delete e._ripple, Ns(e);
}
function Sf(e, t) {
  if (t.value === t.oldValue)
    return;
  const n = Ts(t.oldValue);
  Bs(e, t, n);
}
const Ls = {
  mounted: Ef,
  unmounted: Cf,
  updated: Sf
}, wf = L({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: Cs
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: de,
  appendIcon: de,
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
  ...Yt(),
  ...J(),
  ...wt(),
  ...kt(),
  ...Rn(),
  ...Xd(),
  ...or(),
  ...en(),
  ...jn(),
  ...De(),
  ...Is(),
  ...$n(),
  ...xe({
    tag: "button"
  }),
  ...he(),
  ...Jt({
    variant: "elevated"
  })
}, "VBtn"), Lt = G()({
  name: "VBtn",
  props: wf(),
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
    } = Se(e), {
      borderClasses: a
    } = Xt(e), {
      densityClasses: i
    } = Zt(e), {
      dimensionStyles: s
    } = At(e), {
      elevationClasses: l
    } = Bn(e), {
      loaderClasses: u
    } = rr(e), {
      locationStyles: c
    } = Un(e), {
      positionClasses: d
    } = Hn(e), {
      roundedClasses: v
    } = Re(e), {
      sizeClasses: f,
      sizeStyles: g
    } = Mn(e), y = Zd(e, e.symbol, !1), _ = Os(e, n), h = x(() => {
      var p;
      return e.active !== void 0 ? e.active : _.isLink.value ? (p = _.isActive) == null ? void 0 : p.value : y == null ? void 0 : y.isSelected.value;
    }), C = $(() => h.value ? e.activeColor ?? e.color : e.color), b = x(() => {
      var w, I;
      return {
        color: (y == null ? void 0 : y.isSelected.value) && (!_.isLink.value || ((w = _.isActive) == null ? void 0 : w.value)) || !y || ((I = _.isActive) == null ? void 0 : I.value) ? C.value ?? e.baseColor : e.baseColor,
        variant: e.variant
      };
    }), {
      colorClasses: A,
      colorStyles: R,
      variantClasses: P
    } = Ln(b), S = x(() => (y == null ? void 0 : y.disabled.value) || e.disabled), k = $(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), B = x(() => {
      if (!(e.value === void 0 || typeof e.value == "symbol"))
        return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function O(p) {
      var w;
      S.value || _.isLink.value && (p.metaKey || p.ctrlKey || p.shiftKey || p.button !== 0 || n.target === "_blank") || ((w = _.navigate) == null || w.call(_, p), y == null || y.toggle());
    }
    return _f(_, y == null ? void 0 : y.select), Y(() => {
      const p = _.isLink.value ? "a" : e.tag, w = !!(e.prependIcon || o.prepend), I = !!(e.appendIcon || o.append), V = !!(e.icon && e.icon !== !0);
      return je(m(p, ee({
        type: p === "a" ? void 0 : "button",
        class: ["v-btn", y == null ? void 0 : y.selectedClass.value, {
          "v-btn--active": h.value,
          "v-btn--block": e.block,
          "v-btn--disabled": S.value,
          "v-btn--elevated": k.value,
          "v-btn--flat": e.flat,
          "v-btn--icon": !!e.icon,
          "v-btn--loading": e.loading,
          "v-btn--readonly": e.readonly,
          "v-btn--slim": e.slim,
          "v-btn--stacked": e.stacked
        }, r.value, a.value, A.value, i.value, l.value, u.value, d.value, v.value, f.value, P.value, e.class],
        style: [R.value, s.value, c.value, g.value, e.style],
        "aria-busy": e.loading ? !0 : void 0,
        disabled: S.value || void 0,
        tabindex: e.loading || e.readonly ? -1 : void 0,
        onClick: O,
        value: B.value
      }, _.linkProps), {
        default: () => {
          var F;
          return [Nn(!0, "v-btn"), !e.icon && w && m("span", {
            key: "prepend",
            class: "v-btn__prepend"
          }, [o.prepend ? m(Ve, {
            key: "prepend-defaults",
            disabled: !e.prependIcon,
            defaults: {
              VIcon: {
                icon: e.prependIcon
              }
            }
          }, o.prepend) : m($e, {
            key: "prepend-icon",
            icon: e.prependIcon
          }, null)]), m("span", {
            class: "v-btn__content",
            "data-no-activator": ""
          }, [!o.default && V ? m($e, {
            key: "content-icon",
            icon: e.icon
          }, null) : m(Ve, {
            key: "content-defaults",
            disabled: !V,
            defaults: {
              VIcon: {
                icon: e.icon
              }
            }
          }, {
            default: () => {
              var N;
              return [((N = o.default) == null ? void 0 : N.call(o)) ?? ae(e.text)];
            }
          })]), !e.icon && I && m("span", {
            key: "append",
            class: "v-btn__append"
          }, [o.append ? m(Ve, {
            key: "append-defaults",
            disabled: !e.appendIcon,
            defaults: {
              VIcon: {
                icon: e.appendIcon
              }
            }
          }, o.append) : m($e, {
            key: "append-icon",
            icon: e.appendIcon
          }, null)]), !!e.loading && m("span", {
            key: "loader",
            class: "v-btn__loader"
          }, [((F = o.loader) == null ? void 0 : F.call(o)) ?? m(df, {
            color: typeof e.loading == "boolean" ? void 0 : e.loading,
            indeterminate: !0,
            width: "2"
          }, null)])];
        }
      }), [[Ls, !S.value && e.ripple, "", {
        center: !!e.icon
      }]]);
    }), {
      group: y
    };
  }
});
function no(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}
function kf(e, t) {
  return {
    x: e.x - t.x,
    y: e.y - t.y
  };
}
function Ya(e, t) {
  if (e.side === "top" || e.side === "bottom") {
    const {
      side: n,
      align: o
    } = e, r = o === "left" ? 0 : o === "center" ? t.width / 2 : o === "right" ? t.width : o, a = n === "top" ? 0 : n === "bottom" ? t.height : n;
    return no({
      x: r,
      y: a
    }, t);
  } else if (e.side === "left" || e.side === "right") {
    const {
      side: n,
      align: o
    } = e, r = n === "left" ? 0 : n === "right" ? t.width : n, a = o === "top" ? 0 : o === "center" ? t.height / 2 : o === "bottom" ? t.height : o;
    return no({
      x: r,
      y: a
    }, t);
  }
  return no({
    x: t.width / 2,
    y: t.height / 2
  }, t);
}
const Fs = {
  static: If,
  // specific viewport position, usually centered
  connected: Tf
  // connected to a certain element
}, Af = L({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (e) => typeof e == "function" || e in Fs
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
function Of(e, t) {
  const n = U({}), o = U();
  me && st(() => !!(t.isActive.value && e.locationStrategy), (a) => {
    var i, s;
    K(() => e.locationStrategy, a), ge(() => {
      window.removeEventListener("resize", r), o.value = void 0;
    }), window.addEventListener("resize", r, {
      passive: !0
    }), typeof e.locationStrategy == "function" ? o.value = (i = e.locationStrategy(t, e, n)) == null ? void 0 : i.updateLocation : o.value = (s = Fs[e.locationStrategy](t, e, n)) == null ? void 0 : s.updateLocation;
  });
  function r(a) {
    var i;
    (i = o.value) == null || i.call(o, a);
  }
  return {
    contentStyles: n,
    updateLocation: o
  };
}
function If() {
}
function xf(e, t) {
  const n = gs(e);
  return t ? n.x += parseFloat(e.style.right || 0) : n.x -= parseFloat(e.style.left || 0), n.y -= parseFloat(e.style.top || 0), n;
}
function Tf(e, t, n) {
  (Array.isArray(e.target.value) || Wd(e.target.value)) && Object.assign(n.value, {
    position: "fixed",
    top: 0,
    [e.isRtl.value ? "right" : "left"]: 0
  });
  const {
    preferredAnchor: r,
    preferredOrigin: a
  } = Jo(() => {
    const h = ko(t.location, e.isRtl.value), C = t.origin === "overlap" ? h : t.origin === "auto" ? Qn(h) : ko(t.origin, e.isRtl.value);
    return h.side === C.side && h.align === eo(C).align ? {
      preferredAnchor: Da(h),
      preferredOrigin: Da(C)
    } : {
      preferredAnchor: h,
      preferredOrigin: C
    };
  }), [i, s, l, u] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((h) => x(() => {
    const C = parseFloat(t[h]);
    return isNaN(C) ? 1 / 0 : C;
  })), c = x(() => {
    if (Array.isArray(t.offset))
      return t.offset;
    if (typeof t.offset == "string") {
      const h = t.offset.split(" ").map(parseFloat);
      return h.length < 2 && h.push(0), h;
    }
    return typeof t.offset == "number" ? [t.offset, 0] : [0, 0];
  });
  let d = !1, v = -1;
  const f = new yd(4), g = new ResizeObserver(() => {
    if (!d) return;
    if (requestAnimationFrame((C) => {
      C !== v && f.clear(), requestAnimationFrame((b) => {
        v = b;
      });
    }), f.isFull) {
      const C = f.values();
      if (Vn(C.at(-1), C.at(-3)))
        return;
    }
    const h = _();
    h && f.push(h.flipped);
  });
  K([e.target, e.contentEl], (h, C) => {
    let [b, A] = h, [R, P] = C;
    R && !Array.isArray(R) && g.unobserve(R), b && !Array.isArray(b) && g.observe(b), P && g.unobserve(P), A && g.observe(A);
  }, {
    immediate: !0
  }), ge(() => {
    g.disconnect();
  });
  let y = new Fe({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  function _() {
    if (d = !1, requestAnimationFrame(() => d = !0), !e.target.value || !e.contentEl.value) return;
    (Array.isArray(e.target.value) || e.target.value.offsetParent) && (y = Ed(e.target.value));
    const h = xf(e.contentEl.value, e.isRtl.value), C = bn(e.contentEl.value), b = 12;
    C.length || (C.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (h.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), h.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
    const A = C.reduce((I, V) => {
      const F = V.getBoundingClientRect(), N = new Fe({
        x: V === document.documentElement ? 0 : F.x,
        y: V === document.documentElement ? 0 : F.y,
        width: V.clientWidth,
        height: V.clientHeight
      });
      return I ? new Fe({
        x: Math.max(I.left, N.left),
        y: Math.max(I.top, N.top),
        width: Math.min(I.right, N.right) - Math.max(I.left, N.left),
        height: Math.min(I.bottom, N.bottom) - Math.max(I.top, N.top)
      }) : N;
    }, void 0);
    A.x += b, A.y += b, A.width -= b * 2, A.height -= b * 2;
    let R = {
      anchor: r.value,
      origin: a.value
    };
    function P(I) {
      const V = new Fe(h), F = Ya(I.anchor, y), N = Ya(I.origin, V);
      let {
        x: D,
        y: H
      } = kf(F, N);
      switch (I.anchor.side) {
        case "top":
          H -= c.value[0];
          break;
        case "bottom":
          H += c.value[0];
          break;
        case "left":
          D -= c.value[0];
          break;
        case "right":
          D += c.value[0];
          break;
      }
      switch (I.anchor.align) {
        case "top":
          H -= c.value[1];
          break;
        case "bottom":
          H += c.value[1];
          break;
        case "left":
          D -= c.value[1];
          break;
        case "right":
          D += c.value[1];
          break;
      }
      return V.x += D, V.y += H, V.width = Math.min(V.width, l.value), V.height = Math.min(V.height, u.value), {
        overflows: Ba(V, A),
        x: D,
        y: H
      };
    }
    let S = 0, k = 0;
    const B = {
      x: 0,
      y: 0
    }, O = {
      x: !1,
      y: !1
    };
    let p = -1;
    for (; ; ) {
      if (p++ > 10) {
        Dd("Infinite loop detected in connectedLocationStrategy");
        break;
      }
      const {
        x: I,
        y: V,
        overflows: F
      } = P(R);
      S += I, k += V, h.x += I, h.y += V;
      {
        const N = Ra(R.anchor), D = F.x.before || F.x.after, H = F.y.before || F.y.after;
        let M = !1;
        if (["x", "y"].forEach((j) => {
          if (j === "x" && D && !O.x || j === "y" && H && !O.y) {
            const X = {
              anchor: {
                ...R.anchor
              },
              origin: {
                ...R.origin
              }
            }, Z = j === "x" ? N === "y" ? eo : Qn : N === "y" ? Qn : eo;
            X.anchor = Z(X.anchor), X.origin = Z(X.origin);
            const {
              overflows: te
            } = P(X);
            (te[j].before <= F[j].before && te[j].after <= F[j].after || te[j].before + te[j].after < (F[j].before + F[j].after) / 2) && (R = X, M = O[j] = !0);
          }
        }), M) continue;
      }
      F.x.before && (S += F.x.before, h.x += F.x.before), F.x.after && (S -= F.x.after, h.x -= F.x.after), F.y.before && (k += F.y.before, h.y += F.y.before), F.y.after && (k -= F.y.after, h.y -= F.y.after);
      {
        const N = Ba(h, A);
        B.x = A.width - N.x.before - N.x.after, B.y = A.height - N.y.before - N.y.after, S += N.x.before, h.x += N.x.before, k += N.y.before, h.y += N.y.before;
      }
      break;
    }
    const w = Ra(R.anchor);
    return Object.assign(n.value, {
      "--v-overlay-anchor-origin": `${R.anchor.side} ${R.anchor.align}`,
      transformOrigin: `${R.origin.side} ${R.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: z(oo(k)),
      left: e.isRtl.value ? void 0 : z(oo(S)),
      right: e.isRtl.value ? z(oo(-S)) : void 0,
      minWidth: z(w === "y" ? Math.min(i.value, y.width) : i.value),
      maxWidth: z(Xa(yn(B.x, i.value === 1 / 0 ? 0 : i.value, l.value))),
      maxHeight: z(Xa(yn(B.y, s.value === 1 / 0 ? 0 : s.value, u.value)))
    }), {
      available: B,
      contentBox: h,
      flipped: O
    };
  }
  return K(() => [r.value, a.value, t.offset, t.minWidth, t.minHeight, t.maxWidth, t.maxHeight], () => _()), be(() => {
    const h = _();
    if (!h) return;
    const {
      available: C,
      contentBox: b
    } = h;
    b.height > C.y && requestAnimationFrame(() => {
      _(), requestAnimationFrame(() => {
        _();
      });
    });
  }), {
    updateLocation: _
  };
}
function oo(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio;
}
function Xa(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
}
let To = !0;
const Cn = [];
function Pf(e) {
  !To || Cn.length ? (Cn.push(e), Po()) : (To = !1, e(), Po());
}
let Za = -1;
function Po() {
  cancelAnimationFrame(Za), Za = requestAnimationFrame(() => {
    const e = Cn.shift();
    e && e(), Cn.length ? Po() : To = !0;
  });
}
const mn = {
  none: null,
  close: Rf,
  block: Bf,
  reposition: Nf
}, Vf = L({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (e) => typeof e == "function" || e in mn
  }
}, "VOverlay-scroll-strategies");
function Df(e, t) {
  if (!me) return;
  let n;
  lt(async () => {
    n == null || n.stop(), t.isActive.value && e.scrollStrategy && (n = Kt(), await new Promise((o) => setTimeout(o)), n.active && n.run(() => {
      var o;
      typeof e.scrollStrategy == "function" ? e.scrollStrategy(t, e, n) : (o = mn[e.scrollStrategy]) == null || o.call(mn, t, e, n);
    }));
  }), ge(() => {
    n == null || n.stop();
  });
}
function Rf(e) {
  function t(n) {
    e.isActive.value = !1;
  }
  $s(e.targetEl.value ?? e.contentEl.value, t);
}
function Bf(e, t) {
  var i;
  const n = (i = e.root.value) == null ? void 0 : i.offsetParent, o = [.../* @__PURE__ */ new Set([...bn(e.targetEl.value, t.contained ? n : void 0), ...bn(e.contentEl.value, t.contained ? n : void 0)])].filter((s) => !s.classList.contains("v-overlay-scroll-blocked")), r = window.innerWidth - document.documentElement.offsetWidth, a = ((s) => tr(s) && s)(n || document.documentElement);
  a && e.root.value.classList.add("v-overlay--scroll-blocked"), o.forEach((s, l) => {
    s.style.setProperty("--v-body-scroll-x", z(-s.scrollLeft)), s.style.setProperty("--v-body-scroll-y", z(-s.scrollTop)), s !== document.documentElement && s.style.setProperty("--v-scrollbar-offset", z(r)), s.classList.add("v-overlay-scroll-blocked");
  }), ge(() => {
    o.forEach((s, l) => {
      const u = parseFloat(s.style.getPropertyValue("--v-body-scroll-x")), c = parseFloat(s.style.getPropertyValue("--v-body-scroll-y")), d = s.style.scrollBehavior;
      s.style.scrollBehavior = "auto", s.style.removeProperty("--v-body-scroll-x"), s.style.removeProperty("--v-body-scroll-y"), s.style.removeProperty("--v-scrollbar-offset"), s.classList.remove("v-overlay-scroll-blocked"), s.scrollLeft = -u, s.scrollTop = -c, s.style.scrollBehavior = d;
    }), a && e.root.value.classList.remove("v-overlay--scroll-blocked");
  });
}
function Nf(e, t, n) {
  let o = !1, r = -1, a = -1;
  function i(s) {
    Pf(() => {
      var c, d;
      const l = performance.now();
      (d = (c = e.updateLocation).value) == null || d.call(c, s), o = (performance.now() - l) / (1e3 / 60) > 2;
    });
  }
  a = (typeof requestIdleCallback > "u" ? (s) => s() : requestIdleCallback)(() => {
    n.run(() => {
      $s(e.targetEl.value ?? e.contentEl.value, (s) => {
        o ? (cancelAnimationFrame(r), r = requestAnimationFrame(() => {
          r = requestAnimationFrame(() => {
            i(s);
          });
        })) : i(s);
      });
    });
  }), ge(() => {
    typeof cancelIdleCallback < "u" && cancelIdleCallback(a), cancelAnimationFrame(r);
  });
}
function $s(e, t) {
  const n = [document, ...bn(e)];
  n.forEach((o) => {
    o.addEventListener("scroll", t, {
      passive: !0
    });
  }), ge(() => {
    n.forEach((o) => {
      o.removeEventListener("scroll", t);
    });
  });
}
const Lf = Symbol.for("vuetify:v-menu"), Ff = L({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function $f(e, t) {
  let n = () => {
  };
  function o(i) {
    n == null || n();
    const s = Number(i ? e.openDelay : e.closeDelay);
    return new Promise((l) => {
      n = pd(s, () => {
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
const Mf = L({
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
  ...Ff()
}, "VOverlay-activator");
function Uf(e, t) {
  let {
    isActive: n,
    isTop: o,
    contentEl: r
  } = t;
  const a = re("useActivator"), i = U();
  let s = !1, l = !1, u = !0;
  const c = x(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), d = x(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !c.value), {
    runOpenDelay: v,
    runCloseDelay: f
  } = $f(e, (k) => {
    k === (e.openOnHover && s || c.value && l) && !(e.openOnHover && n.value && !o.value) && (n.value !== k && (u = !0), n.value = k);
  }), g = U(), y = {
    onClick: (k) => {
      k.stopPropagation(), i.value = k.currentTarget || k.target, n.value || (g.value = [k.clientX, k.clientY]), n.value = !n.value;
    },
    onMouseenter: (k) => {
      var B;
      (B = k.sourceCapabilities) != null && B.firesTouchEvents || (s = !0, i.value = k.currentTarget || k.target, v());
    },
    onMouseleave: (k) => {
      s = !1, f();
    },
    onFocus: (k) => {
      _d(k.target, ":focus-visible") !== !1 && (l = !0, k.stopPropagation(), i.value = k.currentTarget || k.target, v());
    },
    onBlur: (k) => {
      l = !1, k.stopPropagation(), f();
    }
  }, _ = x(() => {
    const k = {};
    return d.value && (k.onClick = y.onClick), e.openOnHover && (k.onMouseenter = y.onMouseenter, k.onMouseleave = y.onMouseleave), c.value && (k.onFocus = y.onFocus, k.onBlur = y.onBlur), k;
  }), h = x(() => {
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
      const B = se(Lf, null);
      k.onClick = () => {
        n.value = !1, B == null || B.closeParents();
      };
    }
    return k;
  }), C = x(() => {
    const k = {};
    return e.openOnHover && (k.onMouseenter = () => {
      u && (s = !0, u = !1, v());
    }, k.onMouseleave = () => {
      s = !1, f();
    }), k;
  });
  K(o, (k) => {
    var B;
    k && (e.openOnHover && !s && (!c.value || !l) || c.value && !l && (!e.openOnHover || !s)) && !((B = r.value) != null && B.contains(document.activeElement)) && (n.value = !1);
  }), K(n, (k) => {
    k || setTimeout(() => {
      g.value = void 0;
    });
  }, {
    flush: "post"
  });
  const b = wo();
  lt(() => {
    b.value && be(() => {
      i.value = b.el;
    });
  });
  const A = wo(), R = x(() => e.target === "cursor" && g.value ? g.value : A.value ? A.el : Ms(e.target, a) || i.value), P = x(() => Array.isArray(R.value) ? void 0 : R.value);
  let S;
  return K(() => !!e.activator, (k) => {
    k && me ? (S = Kt(), S.run(() => {
      jf(e, a, {
        activatorEl: i,
        activatorEvents: _
      });
    })) : S && S.stop();
  }, {
    flush: "post",
    immediate: !0
  }), ge(() => {
    S == null || S.stop();
  }), {
    activatorEl: i,
    activatorRef: b,
    target: R,
    targetEl: P,
    targetRef: A,
    activatorEvents: _,
    contentEvents: h,
    scrimEvents: C
  };
}
function jf(e, t, n) {
  let {
    activatorEl: o,
    activatorEvents: r
  } = n;
  K(() => e.activator, (l, u) => {
    if (u && l !== u) {
      const c = s(u);
      c && i(c);
    }
    l && be(() => a());
  }, {
    immediate: !0
  }), K(() => e.activatorProps, () => {
    a();
  }), ge(() => {
    i();
  });
  function a() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    l && Cd(l, ee(r.value, u));
  }
  function i() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s(), u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    l && Sd(l, ee(r.value, u));
  }
  function s() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator;
    const u = Ms(l, t);
    return o.value = (u == null ? void 0 : u.nodeType) === Node.ELEMENT_NODE ? u : void 0, o.value;
  }
}
function Ms(e, t) {
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
const Hf = Symbol.for("vuetify:display");
function zf() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    mobile: null
  }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  const n = se(Hf);
  if (!n) throw new Error("Could not find Vuetify display injection");
  const o = x(() => e.mobile ? !0 : typeof e.mobileBreakpoint == "number" ? n.width.value < e.mobileBreakpoint : e.mobileBreakpoint ? n.width.value < n.thresholds.value[e.mobileBreakpoint] : e.mobile === null ? n.mobile.value : !1), r = $(() => t ? {
    [`${t}--mobile`]: o.value
  } : {});
  return {
    ...n,
    displayClasses: r,
    mobile: o
  };
}
function Wf() {
  if (!me) return Q(!1);
  const {
    ssr: e
  } = zf();
  if (e) {
    const t = Q(!1);
    return kn(() => {
      t.value = !0;
    }), t;
  } else
    return Q(!0);
}
const Kf = L({
  eager: Boolean
}, "lazy");
function Gf(e, t) {
  const n = Q(!1), o = $(() => n.value || e.eager || t.value);
  K(t, () => n.value = !0);
  function r() {
    e.eager || (n.value = !1);
  }
  return {
    isBooted: n,
    hasContent: o,
    onAfterLeave: r
  };
}
function Us() {
  const t = re("useScopeId").vnode.scopeId;
  return {
    scopeId: t ? {
      [t]: ""
    } : void 0
  };
}
const Ja = Symbol.for("vuetify:stack"), xt = rt([]);
function qf(e, t, n) {
  const o = re("useStack"), r = !n, a = se(Ja, void 0), i = rt({
    activeChildren: /* @__PURE__ */ new Set()
  });
  ut(Ja, i);
  const s = Q(Number(Ue(t)));
  st(e, () => {
    var d;
    const c = (d = xt.at(-1)) == null ? void 0 : d[1];
    s.value = c ? c + 10 : Number(Ue(t)), r && xt.push([o.uid, s.value]), a == null || a.activeChildren.add(o.uid), ge(() => {
      if (r) {
        const v = ot(xt).findIndex((f) => f[0] === o.uid);
        xt.splice(v, 1);
      }
      a == null || a.activeChildren.delete(o.uid);
    });
  });
  const l = Q(!0);
  r && lt(() => {
    var d;
    const c = ((d = xt.at(-1)) == null ? void 0 : d[0]) === o.uid;
    setTimeout(() => l.value = c);
  });
  const u = $(() => !i.activeChildren.size);
  return {
    globalTop: ui(l),
    localTop: u,
    stackStyles: $(() => ({
      zIndex: s.value
    }))
  };
}
function Yf(e) {
  return {
    teleportTarget: x(() => {
      const n = e();
      if (n === !0 || !me) return;
      const o = n === !1 ? document.body : typeof n == "string" ? document.querySelector(n) : n;
      if (o == null) {
        Bo(`Unable to locate target ${n}`);
        return;
      }
      let r = [...o.children].find((a) => a.matches(".v-overlay-container"));
      return r || (r = document.createElement("div"), r.className = "v-overlay-container", o.appendChild(r)), r;
    })
  };
}
const zn = L({
  transition: {
    type: [Boolean, String, Object],
    default: "fade-transition",
    validator: (e) => e !== !0
  }
}, "transition"), Ze = (e, t) => {
  let {
    slots: n
  } = t;
  const {
    transition: o,
    disabled: r,
    group: a,
    ...i
  } = e, {
    component: s = a ? No : Gt,
    ...l
  } = typeof o == "object" ? o : {};
  return Sn(s, ee(typeof o == "string" ? {
    name: r ? "" : o
  } : l, typeof o == "string" ? {} : Object.fromEntries(Object.entries({
    disabled: r,
    group: a
  }).filter((u) => {
    let [c, d] = u;
    return d !== void 0;
  })), i), n);
};
function Xf() {
  return !0;
}
function js(e, t, n) {
  if (!e || Hs(e, n) === !1) return !1;
  const o = _s(t);
  if (typeof ShadowRoot < "u" && o instanceof ShadowRoot && o.host === e.target) return !1;
  const r = (typeof n.value == "object" && n.value.include || (() => []))();
  return r.push(t), !r.some((a) => a == null ? void 0 : a.contains(e.target));
}
function Hs(e, t) {
  return (typeof t.value == "object" && t.value.closeConditional || Xf)(e);
}
function Zf(e, t, n) {
  const o = typeof n.value == "function" ? n.value : n.value.handler;
  e.shadowTarget = e.target, t._clickOutside.lastMousedownWasOutside && js(e, t, n) && setTimeout(() => {
    Hs(e, n) && o && o(e);
  }, 0);
}
function Qa(e, t) {
  const n = _s(e);
  t(document), typeof ShadowRoot < "u" && n instanceof ShadowRoot && t(n);
}
const Jf = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(e, t) {
    const n = (r) => Zf(r, e, t), o = (r) => {
      e._clickOutside.lastMousedownWasOutside = js(r, e, t);
    };
    Qa(e, (r) => {
      r.addEventListener("click", n, !0), r.addEventListener("mousedown", o, !0);
    }), e._clickOutside || (e._clickOutside = {
      lastMousedownWasOutside: !1
    }), e._clickOutside[t.instance.$.uid] = {
      onClick: n,
      onMousedown: o
    };
  },
  beforeUnmount(e, t) {
    e._clickOutside && (Qa(e, (n) => {
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
function Qf(e) {
  const {
    modelValue: t,
    color: n,
    ...o
  } = e;
  return m(Gt, {
    name: "fade-transition",
    appear: !0
  }, {
    default: () => [e.modelValue && m("div", ee({
      class: ["v-overlay__scrim", e.color.backgroundColorClasses.value],
      style: e.color.backgroundColorStyles.value
    }, o), null)]
  });
}
const zs = L({
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
  ...Mf(),
  ...J(),
  ...kt(),
  ...Kf(),
  ...Af(),
  ...Vf(),
  ...he(),
  ...zn()
}, "VOverlay"), ei = G()({
  name: "VOverlay",
  directives: {
    ClickOutside: Jf
  },
  inheritAttrs: !1,
  props: {
    _disableGlobalStack: Boolean,
    ...zs()
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
    const a = re("VOverlay"), i = U(), s = U(), l = U(), u = ze(e, "modelValue"), c = x({
      get: () => u.value,
      set: (W) => {
        W && e.disabled || (u.value = W);
      }
    }), {
      themeClasses: d
    } = Se(e), {
      rtlClasses: v,
      isRtl: f
    } = Qt(), {
      hasContent: g,
      onAfterLeave: y
    } = Gf(e, c), _ = nt(() => typeof e.scrim == "string" ? e.scrim : null), {
      globalTop: h,
      localTop: C,
      stackStyles: b
    } = qf(c, () => e.zIndex, e._disableGlobalStack), {
      activatorEl: A,
      activatorRef: R,
      target: P,
      targetEl: S,
      targetRef: k,
      activatorEvents: B,
      contentEvents: O,
      scrimEvents: p
    } = Uf(e, {
      isActive: c,
      isTop: C,
      contentEl: l
    }), {
      teleportTarget: w
    } = Yf(() => {
      var Ke, Ot, ir;
      const W = e.attach || e.contained;
      if (W) return W;
      const ce = ((Ke = A == null ? void 0 : A.value) == null ? void 0 : Ke.getRootNode()) || ((ir = (Ot = a.proxy) == null ? void 0 : Ot.$el) == null ? void 0 : ir.getRootNode());
      return ce instanceof ShadowRoot ? ce : !1;
    }), {
      dimensionStyles: I
    } = At(e), V = Wf(), {
      scopeId: F
    } = Us();
    K(() => e.disabled, (W) => {
      W && (c.value = !1);
    });
    const {
      contentStyles: N,
      updateLocation: D
    } = Of(e, {
      isRtl: f,
      contentEl: l,
      target: P,
      isActive: c
    });
    Df(e, {
      root: i,
      contentEl: l,
      targetEl: S,
      isActive: c,
      updateLocation: D
    });
    function H(W) {
      r("click:outside", W), e.persistent ? _e() : c.value = !1;
    }
    function M(W) {
      return c.value && h.value && // If using scrim, only close if clicking on it rather than anything opened on top
      (!e.scrim || W.target === s.value || W instanceof MouseEvent && W.shadowTarget === s.value);
    }
    me && K(c, (W) => {
      W ? window.addEventListener("keydown", j) : window.removeEventListener("keydown", j);
    }, {
      immediate: !0
    }), ct(() => {
      me && window.removeEventListener("keydown", j);
    });
    function j(W) {
      var ce, Ke, Ot;
      W.key === "Escape" && h.value && ((ce = l.value) != null && ce.contains(document.activeElement) || r("keydown", W), e.persistent ? _e() : (c.value = !1, (Ke = l.value) != null && Ke.contains(document.activeElement) && ((Ot = A.value) == null || Ot.focus())));
    }
    function X(W) {
      W.key === "Escape" && !h.value || r("keydown", W);
    }
    const Z = hf();
    st(() => e.closeOnBack, () => {
      yf(Z, (W) => {
        h.value && c.value ? (W(!1), e.persistent ? _e() : c.value = !1) : W();
      });
    });
    const te = U();
    K(() => c.value && (e.absolute || e.contained) && w.value == null, (W) => {
      if (W) {
        const ce = Hd(i.value);
        ce && ce !== document.scrollingElement && (te.value = ce.scrollTop);
      }
    });
    function _e() {
      e.noClickAnimation || l.value && hs(l.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: ps
      });
    }
    function We() {
      r("afterEnter");
    }
    function tn() {
      y(), r("afterLeave");
    }
    return Y(() => {
      var W;
      return m(Ae, null, [(W = n.activator) == null ? void 0 : W.call(n, {
        isActive: c.value,
        targetRef: k,
        props: ee({
          ref: R
        }, B.value, e.activatorProps)
      }), V.value && g.value && m(gl, {
        disabled: !w.value,
        to: w.value
      }, {
        default: () => [m("div", ee({
          class: ["v-overlay", {
            "v-overlay--absolute": e.absolute || e.contained,
            "v-overlay--active": c.value,
            "v-overlay--contained": e.contained
          }, d.value, v.value, e.class],
          style: [b.value, {
            "--v-overlay-opacity": e.opacity,
            top: z(te.value)
          }, e.style],
          ref: i,
          onKeydown: X
        }, F, o), [m(Qf, ee({
          color: _,
          modelValue: c.value && !!e.scrim,
          ref: s
        }, p.value), null), m(Ze, {
          appear: !0,
          persisted: !0,
          transition: e.transition,
          target: P.value,
          onAfterEnter: We,
          onAfterLeave: tn
        }, {
          default: () => {
            var ce;
            return [je(m("div", ee({
              ref: l,
              class: ["v-overlay__content", e.contentClass],
              style: [I.value, N.value]
            }, O.value, e.contentProps), [(ce = n.default) == null ? void 0 : ce.call(n, {
              isActive: c
            })]), [[An, c.value], [On("click-outside"), {
              handler: H,
              closeConditional: M,
              include: () => [A.value]
            }]])];
          }
        })])]
      })]);
    }), {
      activatorEl: A,
      scrimEl: s,
      target: P,
      animateClick: _e,
      contentEl: l,
      globalTop: h,
      localTop: C,
      updateLocation: D
    };
  }
}), Ws = Symbol.for("vuetify:layout");
function ev() {
  const e = se(Ws);
  if (!e) throw new Error("[Vuetify] Could not find injected layout");
  return {
    getLayoutItem: e.getLayoutItem,
    mainRect: e.mainRect,
    mainStyles: e.mainStyles
  };
}
const ro = Symbol("Forwarded refs");
function ao(e, t) {
  let n = e;
  for (; n; ) {
    const o = Reflect.getOwnPropertyDescriptor(n, t);
    if (o) return o;
    n = Object.getPrototypeOf(n);
  }
}
function ar(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)
    n[o - 1] = arguments[o];
  return e[ro] = n, new Proxy(e, {
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
          const u = ao(l.value, a) ?? ("_" in l.value ? ao((s = l.value._) == null ? void 0 : s.setupState, a) : void 0);
          if (u) return u;
        }
        for (const l of n) {
          const u = l.value && l.value[ro];
          if (!u) continue;
          const c = u.slice();
          for (; c.length; ) {
            const d = c.shift(), v = ao(d.value, a);
            if (v) return v;
            const f = d.value && d.value[ro];
            f && c.push(...f);
          }
        }
      }
    }
  });
}
function tv(e) {
  const t = Q(e());
  let n = -1;
  function o() {
    clearInterval(n);
  }
  function r() {
    o(), be(() => t.value = e());
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
  return ge(o), {
    clear: o,
    time: t,
    start: a,
    reset: r
  };
}
const nv = L({
  multiLine: Boolean,
  text: String,
  timer: [Boolean, String],
  timeout: {
    type: [Number, String],
    default: 5e3
  },
  vertical: Boolean,
  ...en({
    location: "bottom"
  }),
  ...jn(),
  ...De(),
  ...Jt(),
  ...he(),
  ...ls(zs({
    transition: "v-snackbar-transition"
  }), ["persistent", "noClickAnimation", "scrim", "scrollStrategy"])
}, "VSnackbar"), ov = G()({
  name: "VSnackbar",
  props: nv(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = ze(e, "modelValue"), {
      positionClasses: r
    } = Hn(e), {
      scopeId: a
    } = Us(), {
      themeClasses: i
    } = Se(e), {
      colorClasses: s,
      colorStyles: l,
      variantClasses: u
    } = Ln(e), {
      roundedClasses: c
    } = Re(e), d = tv(() => Number(e.timeout)), v = U(), f = U(), g = Q(!1), y = Q(0), _ = U(), h = se(Ws, void 0);
    st(() => !!h, () => {
      const p = ev();
      lt(() => {
        _.value = p.mainStyles.value;
      });
    }), K(o, b), K(() => e.timeout, b), kn(() => {
      o.value && b();
    });
    let C = -1;
    function b() {
      d.reset(), window.clearTimeout(C);
      const p = Number(e.timeout);
      if (!o.value || p === -1) return;
      const w = is(f.value);
      d.start(w), C = window.setTimeout(() => {
        o.value = !1;
      }, p);
    }
    function A() {
      d.reset(), window.clearTimeout(C);
    }
    function R() {
      g.value = !0, A();
    }
    function P() {
      g.value = !1, b();
    }
    function S(p) {
      y.value = p.touches[0].clientY;
    }
    function k(p) {
      Math.abs(y.value - p.changedTouches[0].clientY) > 50 && (o.value = !1);
    }
    function B() {
      g.value && P();
    }
    const O = x(() => e.location.split(" ").reduce((p, w) => (p[`v-snackbar--${w}`] = !0, p), {}));
    return Y(() => {
      const p = ei.filterProps(e), w = !!(n.default || n.text || e.text);
      return m(ei, ee({
        ref: v,
        class: ["v-snackbar", {
          "v-snackbar--active": o.value,
          "v-snackbar--multi-line": e.multiLine && !e.vertical,
          "v-snackbar--timer": !!e.timer,
          "v-snackbar--vertical": e.vertical
        }, O.value, r.value, e.class],
        style: [_.value, e.style]
      }, p, {
        modelValue: o.value,
        "onUpdate:modelValue": (I) => o.value = I,
        contentProps: ee({
          class: ["v-snackbar__wrapper", i.value, s.value, c.value, u.value],
          style: [l.value],
          onPointerenter: R,
          onPointerleave: P
        }, p.contentProps),
        persistent: !0,
        noClickAnimation: !0,
        scrim: !1,
        scrollStrategy: "none",
        _disableGlobalStack: !0,
        onTouchstartPassive: S,
        onTouchend: k,
        onAfterLeave: B
      }, a), {
        default: () => {
          var I, V;
          return [Nn(!1, "v-snackbar"), e.timer && !g.value && m("div", {
            key: "timer",
            class: "v-snackbar__timer"
          }, [m(ks, {
            ref: f,
            color: typeof e.timer == "string" ? e.timer : "info",
            max: e.timeout,
            "model-value": d.time.value
          }, null)]), w && m("div", {
            key: "content",
            class: "v-snackbar__content",
            role: "status",
            "aria-live": "polite"
          }, [((I = n.text) == null ? void 0 : I.call(n)) ?? e.text, (V = n.default) == null ? void 0 : V.call(n)]), n.actions && m(Ve, {
            defaults: {
              VBtn: {
                variant: "text",
                ripple: !1,
                slim: !0
              }
            }
          }, {
            default: () => [m("div", {
              class: "v-snackbar__actions"
            }, [n.actions({
              isActive: o
            })])]
          })];
        },
        activator: n.activator
      });
    }), ar({}, v);
  }
}), rv = {
  __name: "SystemMessage",
  setup(e, { expose: t }) {
    const n = U(!1), o = U(""), r = U(2e3), a = U("success");
    function i(l, u = {}) {
      o.value = typeof l == "string" ? l : l.message, r.value = u.timeout && u.timeout > 0 ? u.timeout : 5e3, a.value = u.color && u.color !== "" ? u.color : "error", n.value = !0;
    }
    function s(l, u = {}) {
      o.value = l, r.value = u.timeout && u.timeout > 0 ? u.timeout : 5e3, a.value = u.color && u.color !== "" ? u.color : "success", n.value = !0;
    }
    return t({ showError: i, showSuccess: s }), (l, u) => (Ye(), Rt(ov, {
      modelValue: n.value,
      "onUpdate:modelValue": u[1] || (u[1] = (c) => n.value = c),
      timeout: r.value,
      color: a.value,
      "multi-line": ""
    }, {
      actions: le(() => [
        m(Lt, {
          variant: "text",
          onClick: u[0] || (u[0] = (c) => n.value = !1),
          icon: "mdi-close-circle"
        })
      ]),
      default: le(() => [
        ke(ae(o.value) + " ", 1)
      ]),
      _: 1
    }, 8, ["modelValue", "timeout", "color"]));
  }
}, av = G()({
  name: "VCardActions",
  props: J(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return er({
      VBtn: {
        slim: !0,
        variant: "text"
      }
    }), Y(() => {
      var o;
      return m("div", {
        class: ["v-card-actions", e.class],
        style: e.style
      }, [(o = n.default) == null ? void 0 : o.call(n)]);
    }), {};
  }
}), iv = L({
  opacity: [Number, String],
  ...J(),
  ...xe()
}, "VCardSubtitle"), Vo = G()({
  name: "VCardSubtitle",
  props: iv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Y(() => m(e.tag, {
      class: ["v-card-subtitle", e.class],
      style: [{
        "--v-card-subtitle-opacity": e.opacity
      }, e.style]
    }, n)), {};
  }
}), Ks = jd("v-card-title");
function sv(e) {
  return {
    aspectStyles: x(() => {
      const t = Number(e.aspectRatio);
      return t ? {
        paddingBottom: String(1 / t * 100) + "%"
      } : void 0;
    })
  };
}
const Gs = L({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...J(),
  ...kt()
}, "VResponsive"), ti = G()({
  name: "VResponsive",
  props: Gs(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      aspectStyles: o
    } = sv(e), {
      dimensionStyles: r
    } = At(e);
    return Y(() => {
      var a;
      return m("div", {
        class: ["v-responsive", {
          "v-responsive--inline": e.inline
        }, e.class],
        style: [r.value, e.style]
      }, [m("div", {
        class: "v-responsive__sizer",
        style: o.value
      }, null), (a = n.additional) == null ? void 0 : a.call(n), n.default && m("div", {
        class: ["v-responsive__content", e.contentClass]
      }, [n.default()])]);
    }), {};
  }
});
function lv(e, t) {
  if (!Zo) return;
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
    r && (!n.quiet || u.init) && (!n.once || c || u.init) && r(c, s, l), c && n.once ? qs(e, t) : u.init = !0;
  }, a);
  e._observe = Object(e._observe), e._observe[t.instance.$.uid] = {
    init: !1,
    observer: i
  }, i.observe(e);
}
function qs(e, t) {
  var o;
  const n = (o = e._observe) == null ? void 0 : o[t.instance.$.uid];
  n && (n.observer.unobserve(e), delete e._observe[t.instance.$.uid]);
}
const Ys = {
  mounted: lv,
  unmounted: qs
}, uv = L({
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
  ...Gs(),
  ...J(),
  ...De(),
  ...zn()
}, "VImg"), Xs = G()({
  name: "VImg",
  directives: {
    intersect: Ys
  },
  props: uv(),
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
    } = nt(() => e.color), {
      roundedClasses: i
    } = Re(e), s = re("VImg"), l = Q(""), u = U(), c = Q(e.eager ? "loading" : "idle"), d = Q(), v = Q(), f = x(() => e.src && typeof e.src == "object" ? {
      src: e.src.src,
      srcset: e.srcset || e.src.srcset,
      lazySrc: e.lazySrc || e.src.lazySrc,
      aspect: Number(e.aspectRatio || e.src.aspect || 0)
    } : {
      src: e.src,
      srcset: e.srcset,
      lazySrc: e.lazySrc,
      aspect: Number(e.aspectRatio || 0)
    }), g = x(() => f.value.aspect || d.value / v.value || 0);
    K(() => e.src, () => {
      y(c.value !== "idle");
    }), K(g, (w, I) => {
      !w && I && u.value && A(u.value);
    }), ci(() => y());
    function y(w) {
      if (!(e.eager && w) && !(Zo && !w && !e.eager)) {
        if (c.value = "loading", f.value.lazySrc) {
          const I = new Image();
          I.src = f.value.lazySrc, A(I, null);
        }
        f.value.src && be(() => {
          var I;
          n("loadstart", ((I = u.value) == null ? void 0 : I.currentSrc) || f.value.src), setTimeout(() => {
            var V;
            if (!s.isUnmounted)
              if ((V = u.value) != null && V.complete) {
                if (u.value.naturalWidth || h(), c.value === "error") return;
                g.value || A(u.value, null), c.value === "loading" && _();
              } else
                g.value || A(u.value), C();
          });
        });
      }
    }
    function _() {
      var w;
      s.isUnmounted || (C(), A(u.value), c.value = "loaded", n("load", ((w = u.value) == null ? void 0 : w.currentSrc) || f.value.src));
    }
    function h() {
      var w;
      s.isUnmounted || (c.value = "error", n("error", ((w = u.value) == null ? void 0 : w.currentSrc) || f.value.src));
    }
    function C() {
      const w = u.value;
      w && (l.value = w.currentSrc || w.src);
    }
    let b = -1;
    ct(() => {
      clearTimeout(b);
    });
    function A(w) {
      let I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const V = () => {
        if (clearTimeout(b), s.isUnmounted) return;
        const {
          naturalHeight: F,
          naturalWidth: N
        } = w;
        F || N ? (d.value = N, v.value = F) : !w.complete && c.value === "loading" && I != null ? b = window.setTimeout(V, I) : (w.currentSrc.endsWith(".svg") || w.currentSrc.startsWith("data:image/svg+xml")) && (d.value = 1, v.value = 1);
      };
      V();
    }
    const R = $(() => ({
      "v-img__img--cover": e.cover,
      "v-img__img--contain": !e.cover
    })), P = () => {
      var V;
      if (!f.value.src || c.value === "idle") return null;
      const w = m("img", {
        class: ["v-img__img", R.value],
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
        onLoad: _,
        onError: h
      }, null), I = (V = o.sources) == null ? void 0 : V.call(o);
      return m(Ze, {
        transition: e.transition,
        appear: !0
      }, {
        default: () => [je(I ? m("picture", {
          class: "v-img__picture"
        }, [I, w]) : w, [[An, c.value === "loaded"]])]
      });
    }, S = () => m(Ze, {
      transition: e.transition
    }, {
      default: () => [f.value.lazySrc && c.value !== "loaded" && m("img", {
        class: ["v-img__img", "v-img__img--preload", R.value],
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: f.value.lazySrc,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable
      }, null)]
    }), k = () => o.placeholder ? m(Ze, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [(c.value === "loading" || c.value === "error" && !o.error) && m("div", {
        class: "v-img__placeholder"
      }, [o.placeholder()])]
    }) : null, B = () => o.error ? m(Ze, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [c.value === "error" && m("div", {
        class: "v-img__error"
      }, [o.error()])]
    }) : null, O = () => e.gradient ? m("div", {
      class: "v-img__gradient",
      style: {
        backgroundImage: `linear-gradient(${e.gradient})`
      }
    }, null) : null, p = Q(!1);
    {
      const w = K(g, (I) => {
        I && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            p.value = !0;
          });
        }), w());
      });
    }
    return Y(() => {
      const w = ti.filterProps(e);
      return je(m(ti, ee({
        class: ["v-img", {
          "v-img--absolute": e.absolute,
          "v-img--booting": !p.value
        }, r.value, i.value, e.class],
        style: [{
          width: z(e.width === "auto" ? d.value : e.width)
        }, a.value, e.style]
      }, w, {
        aspectRatio: g.value,
        "aria-label": e.alt,
        role: e.alt ? "img" : void 0
      }), {
        additional: () => m(Ae, null, [m(P, null, null), m(S, null, null), m(O, null, null), m(k, null, null), m(B, null, null)]),
        default: o.default
      }), [[On("intersect"), {
        handler: y,
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
}), cv = L({
  start: Boolean,
  end: Boolean,
  icon: de,
  image: String,
  text: String,
  ...Yt(),
  ...J(),
  ...wt(),
  ...De(),
  ...$n(),
  ...xe(),
  ...he(),
  ...Jt({
    variant: "flat"
  })
}, "VAvatar"), ni = G()({
  name: "VAvatar",
  props: cv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = Se(e), {
      borderClasses: r
    } = Xt(e), {
      colorClasses: a,
      colorStyles: i,
      variantClasses: s
    } = Ln(e), {
      densityClasses: l
    } = Zt(e), {
      roundedClasses: u
    } = Re(e), {
      sizeClasses: c,
      sizeStyles: d
    } = Mn(e);
    return Y(() => m(e.tag, {
      class: ["v-avatar", {
        "v-avatar--start": e.start,
        "v-avatar--end": e.end
      }, o.value, r.value, a.value, l.value, u.value, c.value, s.value, e.class],
      style: [i.value, d.value, e.style]
    }, {
      default: () => [n.default ? m(Ve, {
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
      }) : e.image ? m(Xs, {
        key: "image",
        src: e.image,
        alt: "",
        cover: !0
      }, null) : e.icon ? m($e, {
        key: "icon",
        icon: e.icon
      }, null) : e.text, Nn(!1, "v-avatar")]
    })), {};
  }
}), dv = L({
  appendAvatar: String,
  appendIcon: de,
  prependAvatar: String,
  prependIcon: de,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...J(),
  ...wt()
}, "VCardItem"), Zs = G()({
  name: "VCardItem",
  props: dv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Y(() => {
      var u;
      const o = !!(e.prependAvatar || e.prependIcon), r = !!(o || n.prepend), a = !!(e.appendAvatar || e.appendIcon), i = !!(a || n.append), s = !!(e.title != null || n.title), l = !!(e.subtitle != null || n.subtitle);
      return m("div", {
        class: ["v-card-item", e.class],
        style: e.style
      }, [r && m("div", {
        key: "prepend",
        class: "v-card-item__prepend"
      }, [n.prepend ? m(Ve, {
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
      }, n.prepend) : m(Ae, null, [e.prependAvatar && m(ni, {
        key: "prepend-avatar",
        density: e.density,
        image: e.prependAvatar
      }, null), e.prependIcon && m($e, {
        key: "prepend-icon",
        density: e.density,
        icon: e.prependIcon
      }, null)])]), m("div", {
        class: "v-card-item__content"
      }, [s && m(Ks, {
        key: "title"
      }, {
        default: () => {
          var c;
          return [((c = n.title) == null ? void 0 : c.call(n)) ?? ae(e.title)];
        }
      }), l && m(Vo, {
        key: "subtitle"
      }, {
        default: () => {
          var c;
          return [((c = n.subtitle) == null ? void 0 : c.call(n)) ?? ae(e.subtitle)];
        }
      }), (u = n.default) == null ? void 0 : u.call(n)]), i && m("div", {
        key: "append",
        class: "v-card-item__append"
      }, [n.append ? m(Ve, {
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
      }, n.append) : m(Ae, null, [e.appendIcon && m($e, {
        key: "append-icon",
        density: e.density,
        icon: e.appendIcon
      }, null), e.appendAvatar && m(ni, {
        key: "append-avatar",
        density: e.density,
        image: e.appendAvatar
      }, null)])])]);
    }), {};
  }
}), fv = L({
  opacity: [Number, String],
  ...J(),
  ...xe()
}, "VCardText"), vv = G()({
  name: "VCardText",
  props: fv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Y(() => m(e.tag, {
      class: ["v-card-text", e.class],
      style: [{
        "--v-card-text-opacity": e.opacity
      }, e.style]
    }, n)), {};
  }
}), mv = L({
  appendAvatar: String,
  appendIcon: de,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: de,
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
  ...Yt(),
  ...J(),
  ...wt(),
  ...kt(),
  ...Rn(),
  ...or(),
  ...en(),
  ...jn(),
  ...De(),
  ...Is(),
  ...xe(),
  ...he(),
  ...Jt({
    variant: "elevated"
  })
}, "VCard"), gv = G()({
  name: "VCard",
  directives: {
    Ripple: Ls
  },
  props: mv(),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const {
      themeClasses: r
    } = Se(e), {
      borderClasses: a
    } = Xt(e), {
      colorClasses: i,
      colorStyles: s,
      variantClasses: l
    } = Ln(e), {
      densityClasses: u
    } = Zt(e), {
      dimensionStyles: c
    } = At(e), {
      elevationClasses: d
    } = Bn(e), {
      loaderClasses: v
    } = rr(e), {
      locationStyles: f
    } = Un(e), {
      positionClasses: g
    } = Hn(e), {
      roundedClasses: y
    } = Re(e), _ = Os(e, n);
    return Y(() => {
      const h = e.link !== !1 && _.isLink.value, C = !e.disabled && e.link !== !1 && (e.link || _.isClickable.value), b = h ? "a" : e.tag, A = !!(o.title || e.title != null), R = !!(o.subtitle || e.subtitle != null), P = A || R, S = !!(o.append || e.appendAvatar || e.appendIcon), k = !!(o.prepend || e.prependAvatar || e.prependIcon), B = !!(o.image || e.image), O = P || k || S, p = !!(o.text || e.text != null);
      return je(m(b, ee({
        class: ["v-card", {
          "v-card--disabled": e.disabled,
          "v-card--flat": e.flat,
          "v-card--hover": e.hover && !(e.disabled || e.flat),
          "v-card--link": C
        }, r.value, a.value, i.value, u.value, d.value, v.value, g.value, y.value, l.value, e.class],
        style: [s.value, c.value, f.value, e.style],
        onClick: C && _.navigate,
        tabindex: e.disabled ? -1 : void 0
      }, _.linkProps), {
        default: () => {
          var w;
          return [B && m("div", {
            key: "image",
            class: "v-card__image"
          }, [o.image ? m(Ve, {
            key: "image-defaults",
            disabled: !e.image,
            defaults: {
              VImg: {
                cover: !0,
                src: e.image
              }
            }
          }, o.image) : m(Xs, {
            key: "image-img",
            cover: !0,
            src: e.image
          }, null)]), m(As, {
            name: "v-card",
            active: !!e.loading,
            color: typeof e.loading == "boolean" ? void 0 : e.loading
          }, {
            default: o.loader
          }), O && m(Zs, {
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
          }), p && m(vv, {
            key: "text"
          }, {
            default: () => {
              var I;
              return [((I = o.text) == null ? void 0 : I.call(o)) ?? e.text];
            }
          }), (w = o.default) == null ? void 0 : w.call(o), o.actions && m(av, null, {
            default: o.actions
          }), Nn(C, "v-card")];
        }
      }), [[On("ripple"), C && e.ripple]]);
    }), {};
  }
}), Js = Symbol.for("vuetify:form"), hv = L({
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
function yv(e) {
  const t = ze(e, "modelValue"), n = $(() => e.disabled), o = $(() => e.readonly), r = Q(!1), a = U([]), i = U([]);
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
  return K(a, () => {
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
  }), ut(Js, {
    register: (c) => {
      let {
        id: d,
        vm: v,
        validate: f,
        reset: g,
        resetValidation: y
      } = c;
      a.value.some((_) => _.id === d) && tt(`Duplicate input name "${d}"`), a.value.push({
        id: d,
        validate: f,
        reset: g,
        resetValidation: y,
        vm: Be(v),
        isValid: null,
        errorMessages: []
      });
    },
    unregister: (c) => {
      a.value = a.value.filter((d) => d.id !== c);
    },
    update: (c, d, v) => {
      const f = a.value.find((g) => g.id === c);
      f && (f.isValid = d, f.errorMessages = v);
    },
    isDisabled: n,
    isReadonly: o,
    isValidating: r,
    isValid: t,
    items: a,
    validateOn: $(() => e.validateOn)
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
function _v(e) {
  const t = se(Js, null);
  return {
    ...t,
    isReadonly: x(() => !!((e == null ? void 0 : e.readonly) ?? (t == null ? void 0 : t.isReadonly.value))),
    isDisabled: x(() => !!((e == null ? void 0 : e.disabled) ?? (t == null ? void 0 : t.isDisabled.value)))
  };
}
const pv = L({
  ...J(),
  ...hv()
}, "VForm"), oi = G()({
  name: "VForm",
  props: pv(),
  emits: {
    "update:modelValue": (e) => !0,
    submit: (e) => !0
  },
  setup(e, t) {
    let {
      slots: n,
      emit: o
    } = t;
    const r = yv(e), a = U();
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
    return Y(() => {
      var l;
      return m("form", {
        ref: a,
        class: ["v-form", e.class],
        style: e.style,
        novalidate: !0,
        onReset: i,
        onSubmit: s
      }, [(l = n.default) == null ? void 0 : l.call(n, r)]);
    }), ar(r, a);
  }
}), bv = L({
  color: String,
  ...Yt(),
  ...J(),
  ...kt(),
  ...Rn(),
  ...en(),
  ...jn(),
  ...De(),
  ...xe(),
  ...he()
}, "VSheet"), Ev = G()({
  name: "VSheet",
  props: bv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: o
    } = Se(e), {
      backgroundColorClasses: r,
      backgroundColorStyles: a
    } = nt(() => e.color), {
      borderClasses: i
    } = Xt(e), {
      dimensionStyles: s
    } = At(e), {
      elevationClasses: l
    } = Bn(e), {
      locationStyles: u
    } = Un(e), {
      positionClasses: c
    } = Hn(e), {
      roundedClasses: d
    } = Re(e);
    return Y(() => m(e.tag, {
      class: ["v-sheet", o.value, r.value, i.value, l.value, c.value, d.value, e.class],
      style: [a.value, s.value, u.value, e.style]
    }, n)), {};
  }
}), Cv = L({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function ye(e, t, n) {
  return G()({
    name: e,
    props: Cv({
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
        const s = o.group ? No : Gt;
        return Sn(s, {
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
function Qs(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return G()({
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
      const i = o.group ? No : Gt;
      return () => Sn(i, {
        name: o.disabled ? "" : e,
        css: !o.disabled,
        // mode: props.mode, // TODO: vuejs/vue-next#3104
        ...o.disabled ? {} : t
      }, a.default);
    }
  });
}
function el() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const n = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1) ? "width" : "height", o = li(`offset-${n}`);
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
ye("fab-transition", "center center", "out-in");
ye("dialog-bottom-transition");
ye("dialog-top-transition");
ye("fade-transition");
ye("scale-transition");
ye("scroll-x-transition");
ye("scroll-x-reverse-transition");
ye("scroll-y-transition");
ye("scroll-y-reverse-transition");
ye("slide-x-transition");
ye("slide-x-reverse-transition");
const tl = ye("slide-y-transition");
ye("slide-y-reverse-transition");
Qs("expand-transition", el());
const Sv = Qs("expand-x-transition", el("", !0)), wv = L({
  active: Boolean,
  disabled: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...J(),
  ...zn({
    transition: {
      component: tl
    }
  })
}, "VCounter"), kv = G()({
  name: "VCounter",
  functional: !0,
  props: wv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = $(() => e.max ? `${e.value} / ${e.max}` : String(e.value));
    return Y(() => m(Ze, {
      transition: e.transition
    }, {
      default: () => [je(m("div", {
        class: ["v-counter", {
          "text-error": e.max && !e.disabled && parseFloat(e.value) > parseFloat(e.max)
        }, e.class],
        style: e.style
      }, [n.default ? n.default({
        counter: o.value,
        max: e.max,
        value: e.value
      }) : o.value]), [[An, e.active]])]
    })), {};
  }
}), Av = L({
  text: String,
  onClick: et(),
  ...J(),
  ...he()
}, "VLabel"), Ov = G()({
  name: "VLabel",
  props: Av(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Y(() => {
      var o;
      return m("label", {
        class: ["v-label", {
          "v-label--clickable": !!e.onClick
        }, e.class],
        style: e.style,
        onClick: e.onClick
      }, [e.text, (o = n.default) == null ? void 0 : o.call(n)]);
    }), {};
  }
}), Iv = L({
  floating: Boolean,
  ...J()
}, "VFieldLabel"), an = G()({
  name: "VFieldLabel",
  props: Iv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Y(() => m(Ov, {
      class: ["v-field-label", {
        "v-field-label--floating": e.floating
      }, e.class],
      style: e.style,
      "aria-hidden": e.floating || void 0
    }, n)), {};
  }
});
function nl(e) {
  const {
    t
  } = ff();
  function n(o) {
    let {
      name: r,
      color: a
    } = o;
    const i = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[r], s = e[`onClick:${r}`];
    function l(c) {
      c.key !== "Enter" && c.key !== " " || (c.preventDefault(), c.stopPropagation(), vs(s, new PointerEvent("click", c)));
    }
    const u = s && i ? t(`$vuetify.input.${i}`, e.label ?? "") : void 0;
    return m($e, {
      icon: e[`${r}Icon`],
      "aria-label": u,
      onClick: s,
      onKeydown: l,
      color: a
    }, null);
  }
  return {
    InputIcon: n
  };
}
const ol = L({
  focused: Boolean,
  "onUpdate:focused": et()
}, "focus");
function rl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie();
  const n = ze(e, "focused"), o = $(() => ({
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
const xv = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"], al = L({
  appendInnerIcon: de,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: de,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
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
  prependInnerIcon: de,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (e) => xv.includes(e)
  },
  "onClick:clear": et(),
  "onClick:appendInner": et(),
  "onClick:prependInner": et(),
  ...J(),
  ...or(),
  ...De(),
  ...he()
}, "VField"), ri = G()({
  name: "VField",
  inheritAttrs: !1,
  props: {
    id: String,
    ...ol(),
    ...al()
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
    } = Se(e), {
      loaderClasses: i
    } = rr(e), {
      focusClasses: s,
      isFocused: l,
      focus: u,
      blur: c
    } = rl(e), {
      InputIcon: d
    } = nl(e), {
      roundedClasses: v
    } = Re(e), {
      rtlClasses: f
    } = Qt(), g = $(() => e.dirty || e.active), y = $(() => !!(e.label || r.label)), _ = $(() => !e.singleLine && y.value), h = wn(), C = x(() => e.id || `input-${h}`), b = $(() => `${C.value}-messages`), A = U(), R = U(), P = U(), S = x(() => ["plain", "underlined"].includes(e.variant)), k = x(() => e.error || e.disabled ? void 0 : g.value && l.value ? e.color : e.baseColor), B = x(() => {
      if (!(!e.iconColor || e.glow && !l.value))
        return e.iconColor === !0 ? k.value : e.iconColor;
    }), {
      backgroundColorClasses: O,
      backgroundColorStyles: p
    } = nt(() => e.bgColor), {
      textColorClasses: w,
      textColorStyles: I
    } = Et(k);
    K(g, (N) => {
      if (_.value) {
        const D = A.value.$el, H = R.value.$el;
        requestAnimationFrame(() => {
          const M = gs(D), j = H.getBoundingClientRect(), X = j.x - M.x, Z = j.y - M.y - (M.height / 2 - j.height / 2), te = j.width / 0.75, _e = Math.abs(te - M.width) > 1 ? {
            maxWidth: z(te)
          } : void 0, We = getComputedStyle(D), tn = getComputedStyle(H), W = parseFloat(We.transitionDuration) * 1e3 || 150, ce = parseFloat(tn.getPropertyValue("--v-field-label-scale")), Ke = tn.getPropertyValue("color");
          D.style.visibility = "visible", H.style.visibility = "hidden", hs(D, {
            transform: `translate(${X}px, ${Z}px) scale(${ce})`,
            color: Ke,
            ..._e
          }, {
            duration: W,
            easing: ps,
            direction: N ? "normal" : "reverse"
          }).finished.then(() => {
            D.style.removeProperty("visibility"), H.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const V = x(() => ({
      isActive: g,
      isFocused: l,
      controlRef: P,
      blur: c,
      focus: u
    }));
    function F(N) {
      N.target !== document.activeElement && N.preventDefault();
    }
    return Y(() => {
      var X, Z, te;
      const N = e.variant === "outlined", D = !!(r["prepend-inner"] || e.prependInnerIcon), H = !!(e.clearable || r.clear) && !e.disabled, M = !!(r["append-inner"] || e.appendInnerIcon || H), j = () => r.label ? r.label({
        ...V.value,
        label: e.label,
        props: {
          for: C.value
        }
      }) : e.label;
      return m("div", ee({
        class: ["v-field", {
          "v-field--active": g.value,
          "v-field--appended": M,
          "v-field--center-affix": e.centerAffix ?? !S.value,
          "v-field--disabled": e.disabled,
          "v-field--dirty": e.dirty,
          "v-field--error": e.error,
          "v-field--glow": e.glow,
          "v-field--flat": e.flat,
          "v-field--has-background": !!e.bgColor,
          "v-field--persistent-clear": e.persistentClear,
          "v-field--prepended": D,
          "v-field--reverse": e.reverse,
          "v-field--single-line": e.singleLine,
          "v-field--no-label": !j(),
          [`v-field--variant-${e.variant}`]: !0
        }, a.value, O.value, s.value, i.value, v.value, f.value, e.class],
        style: [p.value, e.style],
        onClick: F
      }, n), [m("div", {
        class: "v-field__overlay"
      }, null), m(As, {
        name: "v-field",
        active: !!e.loading,
        color: e.error ? "error" : typeof e.loading == "string" ? e.loading : e.color
      }, {
        default: r.loader
      }), D && m("div", {
        key: "prepend",
        class: "v-field__prepend-inner"
      }, [e.prependInnerIcon && m(d, {
        key: "prepend-icon",
        name: "prependInner",
        color: B.value
      }, null), (X = r["prepend-inner"]) == null ? void 0 : X.call(r, V.value)]), m("div", {
        class: "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(e.variant) && _.value && m(an, {
        key: "floating-label",
        ref: R,
        class: [w.value],
        floating: !0,
        for: C.value,
        style: I.value
      }, {
        default: () => [j()]
      }), y.value && m(an, {
        key: "label",
        ref: A,
        for: C.value
      }, {
        default: () => [j()]
      }), ((Z = r.default) == null ? void 0 : Z.call(r, {
        ...V.value,
        props: {
          id: C.value,
          class: "v-field__input",
          "aria-describedby": b.value
        },
        focus: u,
        blur: c
      })) ?? m("div", {
        id: C.value,
        class: "v-field__input",
        "aria-describedby": b.value
      }, null)]), H && m(Sv, {
        key: "clear"
      }, {
        default: () => [je(m("div", {
          class: "v-field__clearable",
          onMousedown: (_e) => {
            _e.preventDefault(), _e.stopPropagation();
          }
        }, [m(Ve, {
          defaults: {
            VIcon: {
              icon: e.clearIcon
            }
          }
        }, {
          default: () => [r.clear ? r.clear({
            ...V.value,
            props: {
              onFocus: u,
              onBlur: c,
              onClick: e["onClick:clear"]
            }
          }) : m(d, {
            name: "clear",
            onFocus: u,
            onBlur: c
          }, null)]
        })]), [[An, e.dirty]])]
      }), M && m("div", {
        key: "append",
        class: "v-field__append-inner"
      }, [(te = r["append-inner"]) == null ? void 0 : te.call(r, V.value), e.appendInnerIcon && m(d, {
        key: "append-icon",
        name: "appendInner",
        color: B.value
      }, null)]), m("div", {
        class: ["v-field__outline", w.value],
        style: I.value
      }, [N && m(Ae, null, [m("div", {
        class: "v-field__outline__start"
      }, null), _.value && m("div", {
        class: "v-field__outline__notch"
      }, [m(an, {
        ref: R,
        floating: !0,
        for: C.value
      }, {
        default: () => [j()]
      })]), m("div", {
        class: "v-field__outline__end"
      }, null)]), S.value && _.value && m(an, {
        ref: R,
        floating: !0,
        for: C.value
      }, {
        default: () => [j()]
      })])]);
    }), {
      controlRef: P,
      fieldIconColor: B
    };
  }
}), Tv = L({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...J(),
  ...zn({
    transition: {
      component: tl,
      leaveAbsolute: !0,
      group: !0
    }
  })
}, "VMessages"), Pv = G()({
  name: "VMessages",
  props: Tv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = x(() => Nt(e.messages)), {
      textColorClasses: r,
      textColorStyles: a
    } = Et(() => e.color);
    return Y(() => m(Ze, {
      transition: e.transition,
      tag: "div",
      class: ["v-messages", r.value, e.class],
      style: [a.value, e.style]
    }, {
      default: () => [e.active && o.value.map((i, s) => m("div", {
        class: "v-messages__message",
        key: `${s}-${o.value}`
      }, [n.message ? n.message({
        message: i
      }) : i]))]
    })), {};
  }
}), Vv = L({
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
    // type: Array as PropType<readonly (ValidationRule | ValidationAlias)[]>,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...ol()
}, "validation");
function Dv(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ie(), n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : wn();
  const o = ze(e, "modelValue"), r = x(() => e.validationValue === void 0 ? o.value : e.validationValue), a = _v(e), i = U([]), s = Q(!0), l = x(() => !!(Nt(o.value === "" ? null : o.value).length || Nt(r.value === "" ? null : r.value).length)), u = x(() => {
    var b;
    return (b = e.errorMessages) != null && b.length ? Nt(e.errorMessages).concat(i.value).slice(0, Math.max(0, Number(e.maxErrors))) : i.value;
  }), c = x(() => {
    var R;
    let b = (e.validateOn ?? ((R = a.validateOn) == null ? void 0 : R.value)) || "input";
    b === "lazy" && (b = "input lazy"), b === "eager" && (b = "input eager");
    const A = new Set((b == null ? void 0 : b.split(" ")) ?? []);
    return {
      input: A.has("input"),
      blur: A.has("blur") || A.has("input") || A.has("invalid-input"),
      invalidInput: A.has("invalid-input"),
      lazy: A.has("lazy"),
      eager: A.has("eager")
    };
  }), d = x(() => {
    var b;
    return e.error || (b = e.errorMessages) != null && b.length ? !1 : e.rules.length ? s.value ? i.value.length || c.value.lazy ? null : !0 : !i.value.length : !0;
  }), v = Q(!1), f = x(() => ({
    [`${t}--error`]: d.value === !1,
    [`${t}--dirty`]: l.value,
    [`${t}--disabled`]: a.isDisabled.value,
    [`${t}--readonly`]: a.isReadonly.value
  })), g = re("validation"), y = x(() => e.name ?? Ce(n));
  ci(() => {
    var b;
    (b = a.register) == null || b.call(a, {
      id: y.value,
      vm: g,
      validate: C,
      reset: _,
      resetValidation: h
    });
  }), ct(() => {
    var b;
    (b = a.unregister) == null || b.call(a, y.value);
  }), kn(async () => {
    var b;
    c.value.lazy || await C(!c.value.eager), (b = a.update) == null || b.call(a, y.value, d.value, u.value);
  }), st(() => c.value.input || c.value.invalidInput && d.value === !1, () => {
    K(r, () => {
      if (r.value != null)
        C();
      else if (e.focused) {
        const b = K(() => e.focused, (A) => {
          A || C(), b();
        });
      }
    });
  }), st(() => c.value.blur, () => {
    K(() => e.focused, (b) => {
      b || C();
    });
  }), K([d, u], () => {
    var b;
    (b = a.update) == null || b.call(a, y.value, d.value, u.value);
  });
  async function _() {
    o.value = null, await be(), await h();
  }
  async function h() {
    s.value = !0, c.value.lazy ? i.value = [] : await C(!c.value.eager);
  }
  async function C() {
    let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    const A = [];
    v.value = !0;
    for (const R of e.rules) {
      if (A.length >= Number(e.maxErrors ?? 1))
        break;
      const S = await (typeof R == "function" ? R : () => R)(r.value);
      if (S !== !0) {
        if (S !== !1 && typeof S != "string") {
          console.warn(`${S} is not a valid value. Rule functions must return boolean true or a string.`);
          continue;
        }
        A.push(S || "");
      }
    }
    return i.value = A, v.value = !1, s.value = b, i.value;
  }
  return {
    errorMessages: u,
    isDirty: l,
    isDisabled: a.isDisabled,
    isReadonly: a.isReadonly,
    isPristine: s,
    isValid: d,
    isValidating: v,
    reset: _,
    resetValidation: h,
    validate: C,
    validationClasses: f
  };
}
const il = L({
  id: String,
  appendIcon: de,
  baseColor: String,
  centerAffix: {
    type: Boolean,
    default: !0
  },
  color: String,
  glow: Boolean,
  iconColor: [Boolean, String],
  prependIcon: de,
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
  "onClick:prepend": et(),
  "onClick:append": et(),
  ...J(),
  ...wt(),
  ...ss(kt(), ["maxWidth", "minWidth", "width"]),
  ...he(),
  ...Vv()
}, "VInput"), ai = G()({
  name: "VInput",
  props: {
    ...il()
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
    } = Zt(e), {
      dimensionStyles: i
    } = At(e), {
      themeClasses: s
    } = Se(e), {
      rtlClasses: l
    } = Qt(), {
      InputIcon: u
    } = nl(e), c = wn(), d = x(() => e.id || `input-${c}`), v = x(() => `${d.value}-messages`), {
      errorMessages: f,
      isDirty: g,
      isDisabled: y,
      isReadonly: _,
      isPristine: h,
      isValid: C,
      isValidating: b,
      reset: A,
      resetValidation: R,
      validate: P,
      validationClasses: S
    } = Dv(e, "v-input", d), k = x(() => ({
      id: d,
      messagesId: v,
      isDirty: g,
      isDisabled: y,
      isReadonly: _,
      isPristine: h,
      isValid: C,
      isValidating: b,
      reset: A,
      resetValidation: R,
      validate: P
    })), B = $(() => e.error || e.disabled ? void 0 : e.focused ? e.color : e.baseColor), O = $(() => {
      if (e.iconColor)
        return e.iconColor === !0 ? B.value : e.iconColor;
    }), p = x(() => {
      var w;
      return (w = e.errorMessages) != null && w.length || !h.value && f.value.length ? f.value : e.hint && (e.persistentHint || e.focused) ? e.hint : e.messages;
    });
    return Y(() => {
      var N, D, H, M;
      const w = !!(o.prepend || e.prependIcon), I = !!(o.append || e.appendIcon), V = p.value.length > 0, F = !e.hideDetails || e.hideDetails === "auto" && (V || !!o.details);
      return m("div", {
        class: ["v-input", `v-input--${e.direction}`, {
          "v-input--center-affix": e.centerAffix,
          "v-input--focused": e.focused,
          "v-input--glow": e.glow,
          "v-input--hide-spin-buttons": e.hideSpinButtons
        }, a.value, s.value, l.value, S.value, e.class],
        style: [i.value, e.style]
      }, [w && m("div", {
        key: "prepend",
        class: "v-input__prepend"
      }, [(N = o.prepend) == null ? void 0 : N.call(o, k.value), e.prependIcon && m(u, {
        key: "prepend-icon",
        name: "prepend",
        color: O.value
      }, null)]), o.default && m("div", {
        class: "v-input__control"
      }, [(D = o.default) == null ? void 0 : D.call(o, k.value)]), I && m("div", {
        key: "append",
        class: "v-input__append"
      }, [e.appendIcon && m(u, {
        key: "append-icon",
        name: "append",
        color: O.value
      }, null), (H = o.append) == null ? void 0 : H.call(o, k.value)]), F && m("div", {
        id: v.value,
        class: "v-input__details",
        role: "alert",
        "aria-live": "polite"
      }, [m(Pv, {
        active: V,
        messages: p.value
      }, {
        message: o.message
      }), (M = o.details) == null ? void 0 : M.call(o, k.value)])]);
    }), {
      reset: A,
      resetValidation: R,
      validate: P,
      isValid: C,
      errorMessages: f
    };
  }
}), Rv = ["color", "file", "time", "date", "datetime-local", "week", "month"], Bv = L({
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
  ...il(),
  ...al()
}, "VTextField"), ii = G()({
  name: "VTextField",
  directives: {
    Intersect: Ys
  },
  inheritAttrs: !1,
  props: Bv(),
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
    const a = ze(e, "modelValue"), {
      isFocused: i,
      focus: s,
      blur: l
    } = rl(e), u = x(() => typeof e.counterValue == "function" ? e.counterValue(a.value) : typeof e.counterValue == "number" ? e.counterValue : (a.value ?? "").toString().length), c = x(() => {
      if (n.maxlength) return n.maxlength;
      if (!(!e.counter || typeof e.counter != "number" && typeof e.counter != "string"))
        return e.counter;
    }), d = x(() => ["plain", "underlined"].includes(e.variant));
    function v(P, S) {
      var k, B;
      !e.autofocus || !P || (B = (k = S[0].target) == null ? void 0 : k.focus) == null || B.call(k);
    }
    const f = U(), g = U(), y = U(), _ = x(() => Rv.includes(e.type) || e.persistentPlaceholder || i.value || e.active);
    function h() {
      var P;
      y.value !== document.activeElement && ((P = y.value) == null || P.focus()), i.value || s();
    }
    function C(P) {
      o("mousedown:control", P), P.target !== y.value && (h(), P.preventDefault());
    }
    function b(P) {
      h(), o("click:control", P);
    }
    function A(P) {
      P.stopPropagation(), h(), be(() => {
        a.value = null, vs(e["onClick:clear"], P);
      });
    }
    function R(P) {
      var k;
      const S = P.target;
      if (a.value = S.value, (k = e.modelModifiers) != null && k.trim && ["text", "search", "password", "tel", "url"].includes(e.type)) {
        const B = [S.selectionStart, S.selectionEnd];
        be(() => {
          S.selectionStart = B[0], S.selectionEnd = B[1];
        });
      }
    }
    return Y(() => {
      const P = !!(r.counter || e.counter !== !1 && e.counter != null), S = !!(P || r.details), [k, B] = gd(n), {
        modelValue: O,
        ...p
      } = ai.filterProps(e), w = ri.filterProps(e);
      return m(ai, ee({
        ref: f,
        modelValue: a.value,
        "onUpdate:modelValue": (I) => a.value = I,
        class: ["v-text-field", {
          "v-text-field--prefixed": e.prefix,
          "v-text-field--suffixed": e.suffix,
          "v-input--plain-underlined": d.value
        }, e.class],
        style: e.style
      }, k, p, {
        centerAffix: !d.value,
        focused: i.value
      }), {
        ...r,
        default: (I) => {
          let {
            id: V,
            isDisabled: F,
            isDirty: N,
            isReadonly: D,
            isValid: H
          } = I;
          return m(ri, ee({
            ref: g,
            onMousedown: C,
            onClick: b,
            "onClick:clear": A,
            "onClick:prependInner": e["onClick:prependInner"],
            "onClick:appendInner": e["onClick:appendInner"],
            role: e.role
          }, w, {
            id: V.value,
            active: _.value || N.value,
            dirty: N.value || e.dirty,
            disabled: F.value,
            focused: i.value,
            error: H.value === !1
          }), {
            ...r,
            default: (M) => {
              let {
                props: {
                  class: j,
                  ...X
                }
              } = M;
              const Z = je(m("input", ee({
                ref: y,
                value: a.value,
                onInput: R,
                autofocus: e.autofocus,
                readonly: D.value,
                disabled: F.value,
                name: e.name,
                placeholder: e.placeholder,
                size: 1,
                type: e.type,
                onFocus: h,
                onBlur: l
              }, X, B), null), [[On("intersect"), {
                handler: v
              }, null, {
                once: !0
              }]]);
              return m(Ae, null, [e.prefix && m("span", {
                class: "v-text-field__prefix"
              }, [m("span", {
                class: "v-text-field__prefix__text"
              }, [e.prefix])]), r.default ? m("div", {
                class: j,
                "data-no-activator": ""
              }, [r.default(), Z]) : hl(Z, {
                class: j
              }), e.suffix && m("span", {
                class: "v-text-field__suffix"
              }, [m("span", {
                class: "v-text-field__suffix__text"
              }, [e.suffix])])]);
            }
          });
        },
        details: S ? (I) => {
          var V;
          return m(Ae, null, [(V = r.details) == null ? void 0 : V.call(r, I), P && m(Ae, null, [m("span", null, null), m(kv, {
            active: e.persistentCounter || i.value,
            value: u.value,
            max: c.value,
            disabled: e.disabled
          }, r.counter)])]);
        } : void 0
      });
    }), ar({}, f, g, y);
  }
}), Nv = {
  key: 0,
  class: "text-center mt-6"
}, Lv = { class: "text-body-2" }, Fv = {
  href: "#",
  class: "text-decoration-none"
}, $v = { class: "d-flex align-center justify-center mb-2" }, Mv = { class: "d-flex flex-column ga-3" }, Uv = {
  key: 0,
  class: "text-center mt-6"
}, jv = {
  href: "#",
  class: "text-decoration-none"
}, Hv = {
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
        submitButtonLabel: "Continue22",
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
    const o = Xo(), r = se("argonauth"), a = n, i = e;
    t({ preLogin: d, login: v });
    const s = x(() => {
      const f = i.step1 || {};
      return f.registerText && f.registerButtonLabel;
    }), l = U(), u = U({
      email: "",
      password: "",
      loading: !1
    }), c = U(!1);
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
        let g = f.error ? f.error.message : f;
        f.code === 404 && (g = "User not found or deactivated"), a("on-step1-failed", new Error(g)), i.noSnackBar || l.value.showError(g);
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
        const g = await r.login(f);
        o.setUser(g), a("on-step2-success", g);
      } catch (f) {
        const g = {
          403: "Wrong email or password",
          423: "Account is locked"
        };
        let y = f.error ? f.error.message : f;
        f && f.code && (y = g[f.code] || y), i.noSnackBar || l.value.showError(y), a("on-step2-failed", new Error(y));
      } finally {
        u.value.loading = !1;
      }
    }
    return (f, g) => (Ye(), Rt(Ev, {
      class: "login-container",
      rounded: "",
      elevation: "4"
    }, {
      default: le(() => [
        m(gv, {
          class: "login-card pa-6",
          variant: "flat",
          width: "500"
        }, {
          default: le(() => [
            m(Zs, null, {
              default: le(() => [
                m(Ks, { class: "text-center text-h4 mb-4" }, {
                  default: le(() => [
                    ke(ae(i.title), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            Ce(o).isPreLoginDone ? Ce(o).isPreLoginDone ? (Ye(), Rt(oi, {
              key: 1,
              onSubmit: sr(v, ["prevent"])
            }, {
              default: le(() => [
                m(Vo, { class: "text-center mb-6" }, {
                  default: le(() => [
                    dt("div", $v, [
                      m($e, {
                        color: "primary",
                        class: "mr-2"
                      }, {
                        default: le(() => [
                          ke(ae(i.step2.accountIcon), 1)
                        ]),
                        _: 1
                      }),
                      dt("span", null, ae(u.value.email), 1)
                    ]),
                    ke(" " + ae(i.step2.subtitle), 1)
                  ]),
                  _: 1
                }),
                m(ii, {
                  modelValue: u.value.password,
                  "onUpdate:modelValue": g[1] || (g[1] = (y) => u.value.password = y),
                  "append-inner-icon": c.value ? i.step2.passwordHiddenIcon : i.step2.passwordVisibleIcon,
                  type: c.value ? "text" : "password",
                  label: "Password",
                  "prepend-inner-icon": i.step2.passwordIcon,
                  variant: "outlined",
                  autofocus: "",
                  required: "",
                  "onClick:appendInner": g[2] || (g[2] = (y) => c.value = !c.value)
                }, null, 8, ["modelValue", "append-inner-icon", "type", "prepend-inner-icon"]),
                dt("div", Mv, [
                  m(Lt, {
                    block: "",
                    color: "primary",
                    size: "large",
                    loading: u.value.loading,
                    type: "submit"
                  }, {
                    default: le(() => [
                      ke(ae(i.step2.submitButtonLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"]),
                  m(Lt, {
                    variant: "text",
                    disabled: u.value.loading,
                    block: ""
                  }, {
                    default: le(() => [
                      ke(ae(i.step2.backButtonLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                i.forgotPassword.text ? (Ye(), lr("div", Uv, [
                  ke(ae(i.forgotPassword.text) + " ", 1),
                  dt("a", jv, ae(i.forgotPassword.buttonLabel), 1)
                ])) : Wn("", !0)
              ]),
              _: 1
            })) : Wn("", !0) : (Ye(), Rt(oi, {
              key: 0,
              onSubmit: sr(d, ["prevent"])
            }, {
              default: le(() => [
                m(Vo, { class: "text-center mb-6" }, {
                  default: le(() => [
                    ke(ae(i.step1.subtitle), 1)
                  ]),
                  _: 1
                }),
                m(ii, {
                  modelValue: u.value.email,
                  "onUpdate:modelValue": g[0] || (g[0] = (y) => u.value.email = y),
                  label: "Email",
                  "prepend-inner-icon": i.step1.emailIcon,
                  variant: "outlined",
                  disabled: u.value.loading,
                  autofocus: "",
                  required: ""
                }, null, 8, ["modelValue", "prepend-inner-icon", "disabled"]),
                m(Lt, {
                  block: "",
                  color: "primary",
                  size: "large",
                  loading: u.value.loading,
                  type: "submit",
                  class: "mt-6"
                }, {
                  default: le(() => [
                    ke(ae(i.step1.submitButtonLabel), 1)
                  ]),
                  _: 1
                }, 8, ["loading"]),
                s.value ? (Ye(), lr("div", Nv, [
                  dt("span", Lv, ae(i.step1.registerText), 1),
                  dt("a", Fv, ae(i.step1.registerButtonLabel), 1)
                ])) : Wn("", !0)
              ]),
              _: 1
            }))
          ]),
          _: 1
        }),
        m(rv, {
          ref_key: "snackbar",
          ref: l
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, zv = {
  __name: "LogoutButton",
  emits: ["on-success", "on-failed"],
  setup(e, { emit: t }) {
    const n = Xo(), o = se("argonauth"), r = t, a = yl(), i = U(null), s = Do(), l = {};
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
    return (c, d) => (Ye(), Rt(Ce(Lt), ee({
      ref_key: "btnRef",
      ref: i
    }, Ce(a), _l(l), { onClick: u }), {
      default: le(() => [
        pl(c.$slots, "default", {}, () => [
          d[0] || (d[0] = ke("Logout"))
        ])
      ]),
      _: 3
    }, 16));
  }
}, Wv = sd();
let Kv = null;
const Xv = {
  install(e, t = {}) {
    e.use(Wv), e.component("ArgonauthForm", Hv), e.component("ArgonauthLogoutButton", zv), e.provide("argonauthStore", Xo());
    const n = $l({
      baseURL: t.baseURL,
      dbName: t.dbName,
      endpoints: t.endpoints
    });
    e.provide("argonauth", n), e.provide("argonauthController", n), Kv = n;
  }
};
export {
  Hv as LoginForm,
  Xv as Plugin,
  Kv as argonauthController,
  Xv as default,
  $l as makeController
};
