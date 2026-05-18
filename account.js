/* ============ Mappa Mundi — Account / Auth module ============ */
/*
 * All state lives in localStorage. No backend.
 * Storage layout:
 *   mappaUsers       → { [email]: { name, email, passwordHash, createdAt, avatarColor, preferences, savedMaps[], history[] } }
 *   mappaCurrentEmail → which user is currently signed in (or absent)
 *
 * Passwords are stored hashed via a tiny client hash (not secure — this is a static prototype).
 */

(function () {
  const USERS_KEY = "mappaUsers";
  const CURRENT_KEY = "mappaCurrentEmail";

  // All localStorage access is wrapped — private-browsing modes and some
  // policy-locked browsers throw when you try to write, and we don't want
  // those throws to break the rest of the page.
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
  }
  function saveUsers(u) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {
      console.warn("[Account] localStorage unavailable — changes won't persist this session.", e);
    }
  }
  function currentEmail() {
    try { return localStorage.getItem(CURRENT_KEY); } catch { return null; }
  }
  function setCurrentEmail(email) {
    try {
      if (email) localStorage.setItem(CURRENT_KEY, email);
      else localStorage.removeItem(CURRENT_KEY);
    } catch (e) { console.warn("[Account] localStorage unavailable.", e); }
  }

  // Tiny non-cryptographic hash (good enough for a prototype)
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36) + ":" + s.length;
  }

  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || ""); }

  // Color for avatar background, derived from email
  function avatarColorFor(email) {
    let h = 0;
    for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return `oklch(60% 0.1 ${hue})`;
  }
  function initials(name) {
    const parts = (name || "").split(/\s+/).filter(Boolean);
    if (!parts.length) return "M";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const Account = {
    /* ----- state ----- */
    current() {
      const email = currentEmail();
      if (!email) return null;
      const users = loadUsers();
      return users[email] || null;
    },
    isSignedIn() { return !!this.current(); },

    /* ----- auth flows ----- */
    signUp({ name, email, password, confirm }) {
      const errors = {};
      if (!name || name.trim().length < 2) errors.name = "Please enter your name (at least 2 characters).";
      if (!isEmail(email)) errors.email = "Please enter a valid email address.";
      if (!password || password.length < 6) errors.password = "Password must be at least 6 characters.";
      if (password !== confirm) errors.confirm = "Passwords don't match.";
      const users = loadUsers();
      if (!errors.email && users[email.toLowerCase()]) errors.email = "An account already exists for this email. Try signing in.";
      if (Object.keys(errors).length) return { errors };

      const e = email.toLowerCase();
      const user = {
        name: name.trim(),
        email: e,
        passwordHash: hash(password),
        avatarColor: avatarColorFor(e),
        createdAt: new Date().toISOString(),
        preferences: { density: "comfortable", language: "en", showFallback: true },
        savedMaps: [],
        history: [],
      };
      users[e] = user;
      saveUsers(users);
      setCurrentEmail(e);
      this._emit();
      return { user };
    },

    signIn({ email, password }) {
      const errors = {};
      if (!isEmail(email)) errors.email = "Enter a valid email.";
      if (!password) errors.password = "Enter your password.";
      if (Object.keys(errors).length) return { errors };

      const users = loadUsers();
      const u = users[email.toLowerCase()];
      if (!u) return { errors: { email: "No account found with this email." } };
      if (u.passwordHash !== hash(password)) return { errors: { password: "Incorrect password." } };

      setCurrentEmail(u.email);
      this._emit();
      return { user: u };
    },

    signOut() {
      setCurrentEmail(null);
      this._emit();
    },

    recover({ email }) {
      if (!isEmail(email)) return { errors: { email: "Enter a valid email." } };
      const users = loadUsers();
      const exists = !!users[email.toLowerCase()];
      // Always succeed (don't leak existence of accounts) but log internally for the demo
      return { sent: true, exists };
    },

    /* ----- profile updates ----- */
    update(patch) {
      const u = this.current();
      if (!u) return null;
      const users = loadUsers();
      // If email is changing, re-key
      if (patch.email && patch.email.toLowerCase() !== u.email) {
        const newEmail = patch.email.toLowerCase();
        if (!isEmail(newEmail)) return { errors: { email: "Invalid email." } };
        if (users[newEmail]) return { errors: { email: "Another account already uses this email." } };
        delete users[u.email];
        u.email = newEmail;
        u.avatarColor = avatarColorFor(newEmail);
        setCurrentEmail(newEmail);
      }
      Object.assign(u, { ...patch, email: u.email });
      users[u.email] = u;
      saveUsers(users);
      this._emit();
      return { user: u };
    },

    changePassword({ current, next, confirm }) {
      const u = this.current();
      if (!u) return { errors: { current: "Not signed in." } };
      if (u.passwordHash !== hash(current || "")) return { errors: { current: "Current password is incorrect." } };
      if (!next || next.length < 6) return { errors: { next: "New password must be at least 6 characters." } };
      if (next !== confirm) return { errors: { confirm: "Passwords don't match." } };
      u.passwordHash = hash(next);
      const users = loadUsers();
      users[u.email] = u;
      saveUsers(users);
      return { ok: true };
    },

    deleteAccount() {
      const u = this.current();
      if (!u) return;
      const users = loadUsers();
      delete users[u.email];
      saveUsers(users);
      setCurrentEmail(null);
      this._emit();
    },

    /* ----- saved maps + history ----- */
    saveMap(mapId) {
      const u = this.current();
      if (!u) return false;
      if (!u.savedMaps) u.savedMaps = [];
      if (u.savedMaps.includes(mapId)) return true;
      u.savedMaps.push(mapId);
      this._persist(u);
      return true;
    },
    unsaveMap(mapId) {
      const u = this.current();
      if (!u) return false;
      u.savedMaps = (u.savedMaps || []).filter(id => id !== mapId);
      this._persist(u);
      return true;
    },
    toggleSaveMap(mapId) {
      if (this.isSaved(mapId)) { this.unsaveMap(mapId); return false; }
      this.saveMap(mapId);
      return true;
    },
    isSaved(mapId) {
      const u = this.current();
      return !!u && (u.savedMaps || []).includes(mapId);
    },

    recordView(mapId) {
      const u = this.current();
      if (!u) return;
      if (!u.history) u.history = [];
      // Remove existing entry and add at front
      u.history = u.history.filter(h => h.mapId !== mapId);
      u.history.unshift({ mapId, viewedAt: new Date().toISOString() });
      u.history = u.history.slice(0, 50);
      this._persist(u);
    },

    /* ----- notes ----- */
    addNote(mapId, text) {
      const u = this.current();
      if (!u) return null;
      if (!u.notes) u.notes = [];
      const trimmed = (text || "").trim();
      if (!trimmed) return null;
      const note = { id: "n_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7), mapId, text: trimmed, createdAt: new Date().toISOString() };
      u.notes.unshift(note);
      this._persist(u);
      return note;
    },
    removeNote(noteId) {
      const u = this.current();
      if (!u) return;
      u.notes = (u.notes || []).filter(n => n.id !== noteId);
      this._persist(u);
    },
    getNotes() { return this.current()?.notes || []; },
    getNotesFor(mapId) { return (this.current()?.notes || []).filter(n => n.mapId === mapId); },

    /* ----- preferences ----- */
    setPreference(key, value) {
      const u = this.current();
      if (!u) return;
      if (!u.preferences) u.preferences = {};
      u.preferences[key] = value;
      this._persist(u);
    },

    /* ----- helpers ----- */
    initials(name) { return initials(name || this.current()?.name || ""); },
    colorFor(email) { return avatarColorFor(email); },

    _persist(u) {
      const users = loadUsers();
      users[u.email] = u;
      saveUsers(users);
      this._emit();
    },
    _emit() {
      window.dispatchEvent(new Event("mappa:account-changed"));
    },
  };

  window.Account = Account;
})();
