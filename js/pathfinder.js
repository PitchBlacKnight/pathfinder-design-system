/* ============================================================
   PATHFINDER DESIGN SYSTEM 2.0 — Behaviors
   Declarative, data-attribute driven so HTML injected at runtime
   (live demos, hot-swapped fragments) just works. No build step.
   ============================================================ */
(function () {
  "use strict";

  const Pathfinder = (window.Pathfinder = window.Pathfinder || {});

  /* ---------- Modal ---------- */
  let lastTrigger = null;

  Pathfinder.openModal = function (id, trigger) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    lastTrigger = trigger || document.activeElement;
    overlay.style.display = "flex";
    requestAnimationFrame(() => overlay.classList.add("open"));
    Pathfinder.syncGates();
    const focusable = overlay.querySelector(
      "button, [href], input, select, textarea, [tabindex]"
    );
    if (focusable) focusable.focus();
  };

  Pathfinder.closeModal = function (overlay) {
    if (typeof overlay === "string") overlay = document.getElementById(overlay);
    if (!overlay) overlay = document.querySelector(".pf-modal-overlay.open");
    if (!overlay) return;
    overlay.classList.remove("open");
    setTimeout(() => (overlay.style.display = "none"), 200);
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    lastTrigger = null;
  };

  /* ---------- Toast ---------- */
  Pathfinder.toast = function (title, detail, tone) {
    let region = document.querySelector(".pf-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "pf-toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    const icons = { positive: "✓", negative: "✕", info: "ℹ" };
    const el = document.createElement("div");
    el.className = "pf-toast " + (tone || "info");
    el.innerHTML =
      '<span class="icon">' + (icons[tone] || icons.info) + "</span>" +
      '<div><div class="t"></div><div class="d"></div></div>';
    el.querySelector(".t").textContent = title;
    el.querySelector(".d").textContent = detail || "";
    region.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity .3s";
      setTimeout(() => el.remove(), 320);
    }, 4200);
  };

  /* ---------- Table: sort ---------- */
  function sortTable(th) {
    const table = th.closest("table");
    const tbody = table.querySelector("tbody");
    const idx = Array.from(th.parentNode.children).indexOf(th);
    const current = th.getAttribute("aria-sort");
    const dir = current === "ascending" ? "descending" : "ascending";
    table.querySelectorAll("th[data-sort]").forEach((h) => h.removeAttribute("aria-sort"));
    th.setAttribute("aria-sort", dir);
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const num = (s) => parseFloat(s.replace(/[^0-9.\-]/g, ""));
    rows.sort((a, b) => {
      const av = a.children[idx].textContent.trim();
      const bv = b.children[idx].textContent.trim();
      const an = num(av), bn = num(bv);
      const cmp =
        !isNaN(an) && !isNaN(bn) && av.match(/[0-9]/)
          ? an - bn
          : av.localeCompare(bv);
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

  /* ---------- Global delegated events ---------- */
  document.addEventListener("click", function (e) {
    // data-toast="Title|Detail|tone" — first, so it can share a button with
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
    // sortable header
    const th = e.target.closest("th[data-sort]");
    if (th) { sortTable(th); return; }
    // tabs
    const tab = e.target.closest(".pf-tab");
    if (tab) {
      tab.closest(".pf-tabs").querySelectorAll(".pf-tab")
        .forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
      return;
    }
    // pagination
    const page = e.target.closest(".pf-page");
    if (page) {
      page.closest(".pages").querySelectorAll(".pf-page")
        .forEach((p) => p.removeAttribute("aria-current"));
      page.setAttribute("aria-current", "page");
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
    if (e.key !== "Escape") return;
    // Danger/confirmation dialogs are data-static: they require an explicit
    // button press, so Escape must not dismiss them either.
    const open = document.querySelector(".pf-modal-overlay.open");
    if (open && open.hasAttribute("data-static")) return;
    Pathfinder.closeModal();
  });

  /* ---------- Date picker ----------
     <div class="pf-datepicker"><input class="pf-input" data-datepicker>
       <div class="pf-calendar" data-month="2026-10" data-selected="2026-10-14"></div></div>
     The calendar grid is rendered from the data attributes, so markup stays
     small. Clicking the input opens it; a day sets the input (MM/DD/YYYY). */
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }

  Pathfinder.renderCalendar = function (cal) {
    var ym = (cal.getAttribute("data-month") || new Date().toISOString().slice(0, 7)).split("-");
    var y = +ym[0], m = +ym[1] - 1;
    var sel = cal.getAttribute("data-selected") || "";
    var today = cal.getAttribute("data-today") || new Date().toISOString().slice(0, 10);
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var prevDays = new Date(y, m, 0).getDate();
    var html = '<header><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" data-cal-prev aria-label="Previous month">‹</button>' +
      '<span class="month">' + MONTHS[m] + " " + y + '</span>' +
      '<button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" data-cal-next aria-label="Next month">›</button></header><div class="grid" role="grid">';
    "SMTWTFS".split("").forEach(function (d) { html += '<span class="dow">' + d + "</span>"; });
    var cells = [];
    for (var i = first - 1; i >= 0; i--) cells.push({ d: prevDays - i, muted: true });
    for (var d = 1; d <= days; d++) cells.push({ d: d, date: iso(y, m, d) });
    while (cells.length % 7) cells.push({ d: cells.length - first - days + 1, muted: true });
    cells.forEach(function (c) {
      var cls = "day" + (c.muted ? " muted" : "") + (c.date === today ? " today" : "");
      html += '<button type="button" class="' + cls + '"' + (c.muted ? " disabled" : ' data-date="' + c.date + '"') +
        (c.date && c.date === sel ? ' aria-selected="true"' : "") + ">" + c.d + "</button>";
    });
    cal.innerHTML = html + "</div>";
  };

  function shiftMonth(cal, delta) {
    var ym = cal.getAttribute("data-month").split("-");
    var dt = new Date(+ym[0], +ym[1] - 1 + delta, 1);
    cal.setAttribute("data-month", dt.getFullYear() + "-" + pad(dt.getMonth() + 1));
    Pathfinder.renderCalendar(cal);
  }

  document.addEventListener("click", function (e) {
    var picker = e.target.closest(".pf-datepicker");
    if (!picker) {
      document.querySelectorAll(".pf-datepicker.open").forEach(function (p) { p.classList.remove("open"); });
      return;
    }
    var cal = picker.querySelector(".pf-calendar");
    if (e.target.closest("[data-datepicker]")) {
      if (cal && !cal.children.length) Pathfinder.renderCalendar(cal);
      picker.classList.toggle("open");
      return;
    }
    if (e.target.closest("[data-cal-prev]")) { shiftMonth(cal, -1); return; }
    if (e.target.closest("[data-cal-next]")) { shiftMonth(cal, 1); return; }
    var day = e.target.closest(".day[data-date]");
    if (day) {
      var p = day.getAttribute("data-date").split("-");
      cal.setAttribute("data-selected", day.getAttribute("data-date"));
      var input = picker.querySelector("[data-datepicker]");
      if (input) input.value = p[1] + "/" + p[2] + "/" + p[0];
      Pathfinder.renderCalendar(cal);
      picker.classList.remove("open");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") document.querySelectorAll(".pf-datepicker.open").forEach(function (p) { p.classList.remove("open"); });
  });

  // Calendars written with data-month but no children render on load.
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pf-calendar[data-month]:empty").forEach(Pathfinder.renderCalendar);
  });

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
            Pathfinder.syncGates();
            // data-open on an overlay renders it already open after a swap —
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
      } catch (err) { /* server briefly unavailable — keep polling */ }
      setTimeout(tick, interval || 800);
    }
    tick();
  };
})();
