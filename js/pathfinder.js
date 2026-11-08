/* ============================================================
   PATHFINDER DESIGN SYSTEM 2.0 - Behaviors (core)
   Declarative, data-attribute driven so HTML injected at runtime
   (live demos, hot-swapped fragments) just works. No build step.
   Core: layers (modal, drawer), toast, tabs, table sort, pagination,
   date picker. Widgets (combobox, command palette, menu, tree,
   segmented, tooltip, drawer) live in pathfinder.behavior.js.
   ============================================================ */
(function () {
  "use strict";

  const Pathfinder = (window.Pathfinder = window.Pathfinder || {});

  var reduceMotion = function () {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  Pathfinder.reduceMotion = reduceMotion;

  /* ---------- Focus helpers ---------- */
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
    'textarea:not([disabled]), summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

  Pathfinder.focusables = function (root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      if (el.closest("[inert], [hidden]")) return false;
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    });
  };

  /* ---------- Layer stack (modals and drawers) ----------
     Each open layer records its trigger, marks everything outside it inert,
     and the stack drives Escape, Tab trapping and the body scroll lock, so
     nested layers restore focus to the right place in the right order. */
  var layers = [];

  function inertOthers(layerEl) {
    var list = [];
    var node = layerEl;
    while (node && node !== document.body && node.parentNode) {
      Array.prototype.forEach.call(node.parentNode.children, function (sib) {
        if (sib === node || sib.tagName === "SCRIPT" || sib.classList.contains("pf-toast-region")) return;
        var n = +(sib.getAttribute("data-pf-inert") || 0);
        sib.setAttribute("data-pf-inert", String(n + 1));
        sib.inert = true;
        list.push(sib);
      });
      node = node.parentNode;
    }
    return list;
  }

  function releaseInert(list) {
    list.forEach(function (sib) {
      var n = (+sib.getAttribute("data-pf-inert") || 1) - 1;
      if (n <= 0) {
        sib.removeAttribute("data-pf-inert");
        sib.inert = false;
      } else {
        sib.setAttribute("data-pf-inert", String(n));
      }
    });
  }

  function updateScrollLock() {
    document.documentElement.classList.toggle("pf-scroll-lock", layers.length > 0);
  }

  Pathfinder.pruneLayers = function () {
    layers = layers.filter(function (l) {
      if (l.el.isConnected) return true;
      releaseInert(l.inerted);
      return false;
    });
    updateScrollLock();
  };

  Pathfinder.pushLayer = function (el, opts) {
    Pathfinder.pruneLayers();
    opts = opts || {};
    // A lower layer inerted this element as one of its siblings (stacked
    // overlays sit side by side); free it so the new layer can take focus.
    layers.forEach(function (l) {
      var mine = l.inerted.filter(function (x) { return x === el || x.contains(el); });
      releaseInert(mine);
      l.inerted = l.inerted.filter(function (x) { return mine.indexOf(x) < 0; });
    });
    var entry = {
      el: el,
      trigger: opts.trigger || null,
      close: opts.close || function () {},
      isStatic: !!opts.isStatic,
      inerted: inertOthers(el),
    };
    layers.push(entry);
    updateScrollLock();
    return entry;
  };

  Pathfinder.popLayer = function (el) {
    var i = layers.map(function (l) { return l.el; }).indexOf(el);
    if (i < 0) return null;
    var entry = layers.splice(i, 1)[0];
    releaseInert(entry.inerted);
    updateScrollLock();
    // Only the topmost layer hands focus back; a lower one closing out of order
    // must not steal focus from the layer still on top.
    if (i === layers.length && entry.trigger && entry.trigger.isConnected && entry.trigger.focus) {
      entry.trigger.focus();
    }
    return entry;
  };

  Pathfinder.topLayer = function () {
    Pathfinder.pruneLayers();
    return layers[layers.length - 1] || null;
  };

  Pathfinder.hasLayer = function (el) {
    return layers.some(function (l) { return l.el === el; });
  };

  Pathfinder.trapTab = function (e, container) {
    var items = Pathfinder.focusables(container);
    if (!items.length) {
      e.preventDefault();
      container.setAttribute("tabindex", "-1");
      container.focus();
      return;
    }
    var first = items[0], last = items[items.length - 1];
    var active = document.activeElement;
    var inside = container.contains(active);
    if (e.shiftKey && (!inside || active === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (!inside || active === last)) {
      e.preventDefault();
      first.focus();
    }
  };

  function initialFocus(container, fallback) {
    var all = Pathfinder.focusables(container);
    var target =
      container.querySelector("[data-autofocus]") ||
      all.filter(function (el) { return !el.matches(".pf-modal-close, [data-drawer-close][aria-label]"); })[0] ||
      all[0] ||
      fallback;
    if (!target) return;
    if (!target.matches(FOCUSABLE)) target.setAttribute("tabindex", "-1");
    target.focus();
  }
  Pathfinder.initialFocus = initialFocus;

  /* ---------- Modal ---------- */
  Pathfinder.openModal = function (id, trigger) {
    const overlay = typeof id === "string" ? document.getElementById(id) : id;
    if (!overlay || Pathfinder.hasLayer(overlay)) return;
    if (!overlay.hasAttribute("role")) overlay.setAttribute("role", "dialog");
    if (!overlay.hasAttribute("aria-modal")) overlay.setAttribute("aria-modal", "true");
    overlay.style.display = "flex";
    Pathfinder.pushLayer(overlay, {
      trigger: trigger || document.activeElement,
      isStatic: overlay.hasAttribute("data-static"),
      close: function () { Pathfinder.closeModal(overlay); },
    });
    requestAnimationFrame(() => overlay.classList.add("open"));
    Pathfinder.syncGates();
    initialFocus(overlay.querySelector(".pf-modal, .pf-cmdk") || overlay, overlay);
    overlay.dispatchEvent(new CustomEvent("pf:modal-open", { bubbles: true }));
  };

  Pathfinder.closeModal = function (overlay) {
    if (typeof overlay === "string") overlay = document.getElementById(overlay);
    if (!overlay) {
      var top = Pathfinder.topLayer();
      overlay = top && top.el.classList.contains("pf-modal-overlay") ? top.el : null;
    }
    if (!overlay || !Pathfinder.hasLayer(overlay)) return;
    overlay.classList.remove("open");
    var hide = function () {
      if (!overlay.classList.contains("open")) overlay.style.display = "none";
    };
    if (reduceMotion()) hide();
    else setTimeout(hide, 200);
    Pathfinder.popLayer(overlay);
    overlay.dispatchEvent(new CustomEvent("pf:modal-close", { bubbles: true }));
  };

  /* ---------- Toast ----------
     Pathfinder.toast(title, detail, tone, opts)
       tone: positive | negative | critical | info (error, success and warning
       are accepted aliases). negative persists until dismissed.
       opts: { duration: ms, persist: bool }
     Newest on top, at most three visible, the rest queue. Timers pause on
     hover and focus. */
  var TOAST_MAX = 3;
  var toastQueue = [];
  var TONES = { positive: "positive", success: "positive", negative: "negative", error: "negative",
                critical: "critical", warning: "critical", info: "info" };
  var ICONS = { positive: "✓", negative: "✕", critical: "!", info: "ℹ" };

  function toastRegion() {
    var region = document.querySelector(".pf-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "pf-toast-region";
      region.setAttribute("role", "region");
      region.setAttribute("aria-label", "Notifications");
      document.body.appendChild(region);
    }
    return region;
  }

  function visibleToasts(region) {
    return Array.prototype.filter.call(region.children, function (t) {
      return t.classList.contains("pf-toast") && !t.classList.contains("leaving");
    });
  }

  function dismissToast(el) {
    if (!el.parentNode || el.classList.contains("leaving")) return;
    clearTimeout(el._timer);
    var done = function () {
      el.remove();
      var next = toastQueue.shift();
      if (next) mountToast(next);
    };
    el.classList.add("leaving");
    if (reduceMotion()) done();
    else setTimeout(done, 300);
  }

  function mountToast(spec) {
    var region = toastRegion();
    var live = visibleToasts(region);
    if (live.length >= TOAST_MAX) {
      // Evict the oldest self-dismissing toast; if every slot holds a
      // persistent one, wait in the queue instead of hiding an error.
      var evict = live.slice().reverse().filter(function (t) { return !t._persist; })[0];
      if (!evict) { toastQueue.push(spec); return spec.handle; }
      dismissToast(evict);
    }
    var tone = spec.tone;
    var el = document.createElement("div");
    el.className = "pf-toast " + tone;
    el.setAttribute("role", tone === "negative" ? "alert" : "status");
    el.innerHTML =
      '<span class="icon" aria-hidden="true">' + ICONS[tone] + "</span>" +
      '<div class="msg"><div class="t"></div><div class="d"></div></div>' +
      '<button type="button" class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm close" aria-label="Dismiss notification">×</button>';
    el.querySelector(".t").textContent = spec.title;
    var d = el.querySelector(".d");
    d.textContent = spec.detail || "";
    if (!spec.detail) d.hidden = true;
    el._persist = spec.persist;
    el._remaining = spec.duration;
    el._start = 0;
    function arm() {
      if (el._persist) return;
      clearTimeout(el._timer);
      el._start = Date.now();
      el._timer = setTimeout(function () { dismissToast(el); }, el._remaining);
    }
    function pause() {
      if (el._persist || !el._start) return;
      clearTimeout(el._timer);
      el._remaining = Math.max(1000, el._remaining - (Date.now() - el._start));
      el._start = 0;
    }
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", function () { if (!el.contains(document.activeElement)) arm(); });
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", function (e) {
      if (!el.contains(e.relatedTarget) && !el.matches(":hover")) arm();
    });
    el.querySelector(".close").addEventListener("click", function () { dismissToast(el); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.stopPropagation(); dismissToast(el); }
    });
    region.prepend(el);
    arm();
    spec.handle.el = el;
    return spec.handle;
  }

  Pathfinder.toast = function (title, detail, tone, opts) {
    opts = opts || {};
    tone = TONES[tone] || "info";
    var handle = { el: null, dismiss: function () { if (handle.el) dismissToast(handle.el); } };
    return mountToast({
      title: title,
      detail: detail,
      tone: tone,
      persist: opts.persist != null ? !!opts.persist : tone === "negative",
      duration: opts.duration || 5000,
      handle: handle,
    });
  };

  /* ---------- Table: sort ---------- */
  function sortTable(th) {
    const table = th.closest("table");
    const tbody = table.querySelector("tbody");
    const idx = Array.from(th.parentNode.children).indexOf(th);
    const current = th.getAttribute("aria-sort");
    const dir = current === "ascending" ? "descending" : "ascending";
    table.querySelectorAll("th[data-sort]").forEach((h) => h.setAttribute("aria-sort", "none"));
    th.setAttribute("aria-sort", dir);
    const rows = Array.from(tbody.querySelectorAll("tr"));
    // Compare as money/number or MM/DD/YYYY date when both cells look like one,
    // otherwise as text (so IDs like PF-006 sort as strings, not as -6).
    const NUM = /^[$€£]?\s*-?[\d,]*\.?\d+\s*[%KMB]?$/i, DATE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const num = (s) => parseFloat(s.replace(/[^0-9.\-]/g, ""));
    rows.sort((a, b) => {
      const av = a.children[idx].textContent.trim();
      const bv = b.children[idx].textContent.trim();
      let cmp;
      if (NUM.test(av) && NUM.test(bv)) cmp = num(av) - num(bv);
      else if (DATE.test(av) && DATE.test(bv)) cmp = Date.parse(av) - Date.parse(bv);
      else cmp = av.localeCompare(bv, undefined, { numeric: true });
      return dir === "ascending" ? cmp : -cmp;
    });
    rows.forEach((r) => tbody.appendChild(r));
  }

  /* ---------- Confirmation gate ----------
     data-confirm-gate="checkboxId" on a button keeps it disabled until that
     checkbox is checked. The spec requires this on the most critical deletes. */
  Pathfinder.syncGates = function () {
    document.querySelectorAll("[data-confirm-gate]").forEach(function (btn) {
      const cb = document.getElementById(btn.getAttribute("data-confirm-gate"));
      btn.disabled = !(cb && cb.checked);
    });
  };

  /* ---------- Table: selection ---------- */
  function syncRow(cb) {
    const tr = cb.closest("tr");
    if (tr) tr.setAttribute("aria-selected", cb.checked ? "true" : "false");
  }

  /* ---------- Tabs ----------
     .pf-tabs gets role=tablist; each .pf-tab role=tab. aria-controls on a tab
     points at a role=tabpanel; the other panels are hidden. Roving tabindex,
     ArrowLeft/Right (Up/Down when aria-orientation="vertical"), Home, End. */
  var uid = 0;

  function tabsOf(list) {
    return Array.prototype.slice.call(list.querySelectorAll(".pf-tab"));
  }

  function syncTabs(list) {
    var tabs = tabsOf(list);
    var sel = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    tabs.forEach(function (t) {
      var on = t === sel;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("tabindex", on ? "0" : "-1");
      var panel = t.getAttribute("aria-controls") && document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
  }

  function enhanceTabs(root) {
    root.querySelectorAll(".pf-tabs").forEach(function (list) {
      if (!list.hasAttribute("role")) list.setAttribute("role", "tablist");
      tabsOf(list).forEach(function (t) {
        if (!t.hasAttribute("role")) t.setAttribute("role", "tab");
        if (!t.id) t.id = "pf-tab-" + ++uid;
        var panel = t.getAttribute("aria-controls") && document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          if (!panel.hasAttribute("role")) panel.setAttribute("role", "tabpanel");
          if (!panel.hasAttribute("aria-labelledby")) panel.setAttribute("aria-labelledby", t.id);
        }
      });
      syncTabs(list);
    });
  }

  function selectTab(tab, focus) {
    var list = tab.closest(".pf-tabs");
    tabsOf(list).forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
    syncTabs(list);
    if (focus) tab.focus();
    tab.dispatchEvent(new CustomEvent("pf:tab-change", { bubbles: true }));
  }

  /* ---------- Pagination ----------
     Numbered .pf-page buttons inside .pages. Optional Prev/Next buttons are
     .pf-page with data-page="prev" / data-page="next". aria-current follows,
     and Prev/Next disable at the ends. Fires pf:page with detail.page. */
  function pageButtons(pages) {
    return Array.prototype.filter.call(pages.querySelectorAll(".pf-page"), function (p) { return !p.hasAttribute("data-page"); });
  }

  function syncPages(pages) {
    var nums = pageButtons(pages);
    var idx = nums.findIndex(function (p) { return p.getAttribute("aria-current") === "page"; });
    if (idx < 0 && nums.length) { idx = 0; nums[0].setAttribute("aria-current", "page"); }
    var prev = pages.querySelector('[data-page="prev"]');
    var next = pages.querySelector('[data-page="next"]');
    if (prev) prev.disabled = idx <= 0;
    if (next) next.disabled = idx >= nums.length - 1;
  }

  function goPage(pages, target) {
    var nums = pageButtons(pages);
    var idx = nums.findIndex(function (p) { return p.getAttribute("aria-current") === "page"; });
    var to = target === "prev" ? idx - 1 : target === "next" ? idx + 1 : nums.indexOf(target);
    if (to < 0 || to >= nums.length) return;
    nums.forEach(function (p) { p.removeAttribute("aria-current"); });
    nums[to].setAttribute("aria-current", "page");
    syncPages(pages);
    // Prev or Next just disabled at an end: keep focus on the page that moved.
    if (document.activeElement && document.activeElement.disabled) nums[to].focus();
    pages.dispatchEvent(new CustomEvent("pf:page", { bubbles: true, detail: { page: to + 1 } }));
  }

  /* ---------- Enhance pass ----------
     Adds roles, tabindex and wrapper buttons to markup that lacks them.
     Idempotent; re-run on DOMContentLoaded and whenever nodes are added
     (the stage hot-swaps fragments). */
  Pathfinder.enhanceCore = function (root) {
    root = root || document;
    enhanceTabs(root);
    root.querySelectorAll("th[data-sort]").forEach(function (th) {
      if (!th.querySelector("button")) {
        var b = document.createElement("button");
        b.type = "button";
        while (th.firstChild) b.appendChild(th.firstChild);
        th.appendChild(b);
      }
      if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", "none");
    });
    root.querySelectorAll(".pf-table-footer .pages").forEach(function (pages) {
      if (!pages.hasAttribute("role")) { pages.setAttribute("role", "navigation"); pages.setAttribute("aria-label", "Pagination"); }
      pageButtons(pages).forEach(function (p) {
        if (!p.hasAttribute("aria-label")) p.setAttribute("aria-label", "Page " + p.textContent.trim());
      });
      syncPages(pages);
    });
    root.querySelectorAll("[data-datepicker]").forEach(function (input) {
      var picker = input.closest(".pf-datepicker");
      var cal = picker && picker.querySelector(".pf-calendar");
      input.setAttribute("aria-haspopup", "dialog");
      if (!input.hasAttribute("aria-expanded")) input.setAttribute("aria-expanded", "false");
      if (cal) {
        if (!cal.id) cal.id = "pf-cal-" + ++uid;
        input.setAttribute("aria-controls", cal.id);
        cal.setAttribute("role", "dialog");
        if (!cal.hasAttribute("aria-label")) cal.setAttribute("aria-label", "Choose date");
      }
    });
    if (Pathfinder.enhanceWidgets) Pathfinder.enhanceWidgets(root);
  };
  Pathfinder.uid = function (prefix) { return (prefix || "pf") + "-" + ++uid; };

  /* ---------- Global delegated events ---------- */
  document.addEventListener("click", function (e) {
    // data-toast="Title|Detail|tone" first, so it can share a button with
    // data-modal-close (e.g. "Save" closes the modal AND confirms via toast)
    const toaster = e.target.closest("[data-toast]");
    if (toaster) {
      const parts = toaster.getAttribute("data-toast").split("|");
      Pathfinder.toast(parts[0], parts[1] || "", parts[2] || "info");
    }
    // data-modal-open="modalId"
    const opener = e.target.closest("[data-modal-open]");
    if (opener) {
      Pathfinder.openModal(opener.getAttribute("data-modal-open"), opener);
      return;
    }
    // data-modal-close (inside a modal)
    if (e.target.closest("[data-modal-close]")) {
      Pathfinder.closeModal(e.target.closest(".pf-modal-overlay"));
      return;
    }
    // overlay click dismisses (unless data-static)
    if (
      e.target.classList &&
      e.target.classList.contains("pf-modal-overlay") &&
      !e.target.hasAttribute("data-static")
    ) {
      Pathfinder.closeModal(e.target);
      return;
    }
    // sortable header (the button inside it, or the header itself)
    const th = e.target.closest("th[data-sort]");
    if (th) { sortTable(th); return; }
    // tabs
    const tab = e.target.closest(".pf-tab");
    if (tab) { selectTab(tab, false); return; }
    // pagination
    const page = e.target.closest(".pf-page");
    if (page && page.closest(".pages")) {
      goPage(page.closest(".pages"), page.getAttribute("data-page") || page);
      return;
    }
  });

  document.addEventListener("change", function (e) {
    // select-all checkbox: data-select-all
    if (e.target.matches("[data-select-all]")) {
      const table = e.target.closest("table");
      table.querySelectorAll("tbody [data-select-row]").forEach((cb) => {
        cb.checked = e.target.checked;
        syncRow(cb);
      });
      return;
    }
    if (e.target.matches("[data-select-row]")) syncRow(e.target);
    if (e.target.matches('input[type="checkbox"]')) Pathfinder.syncGates();
    // data-filter-table targets tbody rows by data-status
    if (e.target.matches("[data-filter-table]")) {
      const table = document.querySelector(e.target.getAttribute("data-filter-table"));
      const val = e.target.value;
      table.querySelectorAll("tbody tr").forEach((tr) => {
        tr.style.display = val === "all" || tr.dataset.status === val ? "" : "none";
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    // Tab roving (WAI-ARIA tabs, automatic activation)
    var tab = e.target.closest && e.target.closest(".pf-tab");
    if (tab && !e.altKey && !e.ctrlKey && !e.metaKey) {
      var list = tab.closest(".pf-tabs");
      var vertical = list.getAttribute("aria-orientation") === "vertical";
      var prevKey = vertical ? "ArrowUp" : "ArrowLeft", nextKey = vertical ? "ArrowDown" : "ArrowRight";
      var tabs = tabsOf(list), i = tabs.indexOf(tab), to = -1;
      if (e.key === nextKey) to = (i + 1) % tabs.length;
      else if (e.key === prevKey) to = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = tabs.length - 1;
      if (to >= 0) { e.preventDefault(); selectTab(tabs[to], true); return; }
    }
    // Focus trap for the topmost layer
    if (e.key === "Tab") {
      var top = Pathfinder.topLayer();
      if (top) Pathfinder.trapTab(e, top.el.querySelector(".pf-modal") || top.el);
      return;
    }
    if (e.key !== "Escape" || e.defaultPrevented) return;
    // Danger/confirmation dialogs are data-static: they require an explicit
    // button press, so Escape must not dismiss them either.
    var layer = Pathfinder.topLayer();
    if (!layer || layer.isStatic) return;
    layer.close();
  });

  /* ---------- Date picker ----------
     <div class="pf-datepicker"><input class="pf-input" data-datepicker>
       <div class="pf-calendar" data-month="2026-10" data-selected="2026-10-14"></div></div>
     The calendar grid is rendered from the data attributes, so markup stays
     small. Open with click, Enter, Space or Alt+ArrowDown on the input.
     In the grid: arrows move a day or week, Home/End the week start and end,
     PageUp/PageDown the month (Shift: year), Enter or Space picks, Escape
     closes and returns focus to the input. Dates are local, never UTC. */
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
  function localISO(dt) { return iso(dt.getFullYear(), dt.getMonth(), dt.getDate()); }
  function parseISO(s) {
    var p = (s || "").split("-");
    if (p.length !== 3) return null;
    var dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(dt.getTime()) ? null : dt;
  }
  function addMonths(dt, n) {
    var target = new Date(dt.getFullYear(), dt.getMonth() + n, 1);
    var last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(dt.getDate(), last));
  }
  Pathfinder.localISO = localISO;

  Pathfinder.renderCalendar = function (cal) {
    var todayDate = new Date();
    var ym = (cal.getAttribute("data-month") || localISO(todayDate).slice(0, 7)).split("-");
    var y = +ym[0], m = +ym[1] - 1;
    var sel = cal.getAttribute("data-selected") || "";
    var today = cal.getAttribute("data-today") || localISO(todayDate);
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var prevDays = new Date(y, m, 0).getDate();
    var monthPrefix = iso(y, m, 1).slice(0, 8);
    var focus = cal.getAttribute("data-focus") || "";
    if (focus.indexOf(monthPrefix) !== 0) {
      focus = sel.indexOf(monthPrefix) === 0 ? sel : today.indexOf(monthPrefix) === 0 ? today : iso(y, m, 1);
    }
    var html = '<header><button type="button" class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" data-cal-prev aria-label="Previous month">‹</button>' +
      '<span class="month" aria-live="polite">' + MONTHS[m] + " " + y + '</span>' +
      '<button type="button" class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" data-cal-next aria-label="Next month">›</button></header>' +
      '<div class="grid" role="group" aria-label="' + MONTHS[m] + " " + y + '">';
    "SMTWTFS".split("").forEach(function (d) { html += '<span class="dow" aria-hidden="true">' + d + "</span>"; });
    var cells = [];
    for (var i = first - 1; i >= 0; i--) cells.push({ d: prevDays - i, muted: true });
    for (var d = 1; d <= days; d++) cells.push({ d: d, date: iso(y, m, d) });
    while (cells.length % 7) cells.push({ d: cells.length - first - days + 1, muted: true });
    cells.forEach(function (c) {
      var cls = "day" + (c.muted ? " muted" : "") + (c.date === today ? " today" : "");
      var label = c.date ? MONTHS[m] + " " + c.d + ", " + y : "";
      html += '<button type="button" class="' + cls + '"' +
        (c.muted ? ' disabled tabindex="-1"' :
          ' data-date="' + c.date + '" aria-label="' + label + '" tabindex="' + (c.date === focus ? "0" : "-1") + '"') +
        (c.date && c.date === sel ? ' aria-selected="true"' : "") + ">" + c.d + "</button>";
    });
    cal.innerHTML = html + "</div>";
  };

  function shiftMonth(cal, delta) {
    var ym = cal.getAttribute("data-month").split("-");
    var dt = new Date(+ym[0], +ym[1] - 1 + delta, 1);
    cal.setAttribute("data-month", dt.getFullYear() + "-" + pad(dt.getMonth() + 1));
    cal.removeAttribute("data-focus");
    Pathfinder.renderCalendar(cal);
  }

  function focusDay(cal, dt) {
    cal.setAttribute("data-month", dt.getFullYear() + "-" + pad(dt.getMonth() + 1));
    cal.setAttribute("data-focus", localISO(dt));
    Pathfinder.renderCalendar(cal);
    var btn = cal.querySelector('.day[data-date="' + localISO(dt) + '"]');
    if (btn) btn.focus();
  }

  function pickerInput(picker) { return picker && picker.querySelector("[data-datepicker]"); }

  function setPickerOpen(picker, open, moveFocus) {
    var cal = picker.querySelector(".pf-calendar");
    var input = pickerInput(picker);
    if (!cal) return;
    if (open) {
      // Sync from the typed value so the grid opens on what the field says.
      var m = input && /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input.value.trim());
      if (m) {
        var typed = iso(+m[3], +m[1] - 1, +m[2]);
        if (parseISO(typed)) {
          cal.setAttribute("data-selected", typed);
          cal.setAttribute("data-month", typed.slice(0, 7));
          cal.removeAttribute("data-focus");
        }
      }
      Pathfinder.renderCalendar(cal);
    }
    picker.classList.toggle("open", open);
    if (input) input.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && moveFocus) {
      var target = cal.querySelector('.day[tabindex="0"]');
      if (target) target.focus();
    }
  }

  document.addEventListener("click", function (e) {
    var picker = e.target.closest(".pf-datepicker");
    if (!picker) {
      document.querySelectorAll(".pf-datepicker.open").forEach(function (p) { setPickerOpen(p, false); });
      return;
    }
    // A click inside one picker closes any other open one
    document.querySelectorAll(".pf-datepicker.open").forEach(function (p) { if (p !== picker) setPickerOpen(p, false); });
    var cal = picker.querySelector(".pf-calendar");
    if (e.target.closest("[data-datepicker]")) {
      setPickerOpen(picker, !picker.classList.contains("open"), false);
      return;
    }
    if (!cal) return;
    if (e.target.closest("[data-cal-prev]")) { shiftMonth(cal, -1); return; }
    if (e.target.closest("[data-cal-next]")) { shiftMonth(cal, 1); return; }
    var day = e.target.closest(".day[data-date]");
    if (day) pickDay(cal, day);
  });

  // Standalone calendars (no .pf-datepicker wrapper) get the same day picking and month buttons.
  document.addEventListener("click", function (e) {
    var cal = e.target.closest(".pf-calendar");
    if (!cal || cal.closest(".pf-datepicker")) return;
    if (e.target.closest("[data-cal-prev]")) { shiftMonth(cal, -1); return; }
    if (e.target.closest("[data-cal-next]")) { shiftMonth(cal, 1); return; }
    var day = e.target.closest(".day[data-date]");
    if (day) pickDay(cal, day);
  });

  function pickDay(cal, day) {
    var picker = cal.closest(".pf-datepicker");
    var date = day.getAttribute("data-date");
    var p = date.split("-");
    cal.setAttribute("data-selected", date);
    cal.setAttribute("data-focus", date);
    var input = pickerInput(picker);
    if (input) {
      input.value = p[1] + "/" + p[2] + "/" + p[0];
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    Pathfinder.renderCalendar(cal);
    if (picker) {
      setPickerOpen(picker, false);
      if (input) input.focus();
    } else {
      var again = cal.querySelector('.day[data-date="' + date + '"]');
      if (again) again.focus();
    }
    cal.dispatchEvent(new CustomEvent("pf:date-pick", { bubbles: true, detail: { date: date } }));
  }

  // Capture phase so an open picker takes Escape before an enclosing modal does.
  document.addEventListener("keydown", function (e) {
    var picker = e.target.closest && e.target.closest(".pf-datepicker");
    var input = e.target.matches && e.target.matches("[data-datepicker]") ? e.target : null;

    if (e.key === "Escape") {
      var open = picker && picker.classList.contains("open") ? picker : document.querySelector(".pf-datepicker.open");
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setPickerOpen(open, false);
        var inp = pickerInput(open);
        if (inp) inp.focus();
      }
      return;
    }

    if (input && picker) {
      var isOpen = picker.classList.contains("open");
      if (e.key === "Enter" || e.key === " " || (e.key === "ArrowDown" && e.altKey)) {
        e.preventDefault();
        if (isOpen && e.key !== "ArrowDown") setPickerOpen(picker, false);
        else setPickerOpen(picker, true, true);
      } else if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        var t = picker.querySelector('.day[tabindex="0"]');
        if (t) t.focus();
      }
      return;
    }

    var day = e.target.closest && e.target.closest(".day[data-date]");
    if (!day) return;
    var cal = day.closest(".pf-calendar");
    var dt = parseISO(day.getAttribute("data-date"));
    var to = null;
    switch (e.key) {
      case "ArrowLeft": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1); break;
      case "ArrowRight": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1); break;
      case "ArrowUp": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 7); break;
      case "ArrowDown": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 7); break;
      case "Home": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - dt.getDay()); break;
      case "End": to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + (6 - dt.getDay())); break;
      case "PageUp": to = addMonths(dt, e.shiftKey ? -12 : -1); break;
      case "PageDown": to = addMonths(dt, e.shiftKey ? 12 : 1); break;
      case "Tab":
        // Leave the grid cleanly: close and let Tab continue from the input.
        var pk = cal.closest(".pf-datepicker");
        if (pk) { setPickerOpen(pk, false); var pi = pickerInput(pk); if (pi) pi.focus(); }
        return;
      default: return;
    }
    e.preventDefault();
    focusDay(cal, to);
  }, true);

  // Calendars written with data-month but no children render on load.
  function init() {
    document.querySelectorAll(".pf-calendar[data-month]:empty").forEach(Pathfinder.renderCalendar);
    Pathfinder.enhanceCore(document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // Keep enhanced markup current when fragments are injected later.
  if (window.MutationObserver) {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        Pathfinder.pruneLayers();
        document.querySelectorAll(".pf-calendar[data-month]:empty").forEach(Pathfinder.renderCalendar);
        Pathfinder.enhanceCore(document);
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  /* ---------- Live stage hot-swap ----------
     stage/index.html polls app.html and swaps it in when it changes,
     so components written to disk appear on screen within ~1s. */
  Pathfinder.live = function (target, url, interval) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    let last = null;
    async function tick() {
      try {
        const res = await fetch(url + "?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const html = await res.text();
          if (html !== last) {
            const first = last === null;
            last = html;
            el.innerHTML = html;
            Pathfinder.pruneLayers();
            Pathfinder.enhanceCore(el);
            Pathfinder.syncGates();
            // data-open on an overlay renders it already open after a swap,
            // routed through openModal so focus and gating are set up properly.
            const pre = el.querySelector(".pf-modal-overlay[data-open]");
            if (pre) requestAnimationFrame(() => Pathfinder.openModal(pre.id));
            el.classList.remove("pf-swap");
            void el.offsetWidth;
            el.classList.add("pf-swap");
            if (!first) {
              const chip = document.getElementById("pf-live-chip");
              if (chip) {
                chip.classList.remove("pulse");
                void chip.offsetWidth;
                chip.classList.add("pulse");
              }
            }
          }
        }
      } catch (err) { /* server briefly unavailable, keep polling */ }
      setTimeout(tick, interval || 800);
    }
    tick();
  };
})();
