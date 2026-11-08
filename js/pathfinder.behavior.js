/* ============================================================
   PATHFINDER DESIGN SYSTEM 2.0 - Widget behaviors
   Loads after pathfinder.js. Everything is delegated on document, plus an
   idempotent enhance pass (Pathfinder.enhanceWidgets) that pathfinder.js
   re-runs when fragments are hot-swapped, so markup added later works.

   Combobox   .pf-combobox          type to filter, arrows, Enter toggles tag
   Cmd palette .pf-cmdk             Cmd/Ctrl+K, filter + highlight, arrows, Enter
   Menu/select [data-menu] trigger  popup .pf-menu, arrows, Home/End, typeahead
   Drawer     .pf-drawer[hidden]    data-drawer-open / data-drawer-close
   Tree       .pf-tree              roving focus, arrows, Enter selects
   Segmented  .pf-segmented         radiogroup, arrows, Home/End
   Tooltip    [data-tooltip]        hover and focus, aria-describedby, Escape
   ============================================================ */
(function () {
  "use strict";

  var Pathfinder = (window.Pathfinder = window.Pathfinder || {});
  var uid = function (p) { return Pathfinder.uid ? Pathfinder.uid(p) : p + "-" + Math.random().toString(36).slice(2, 8); };

  function qsa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function text(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
  function fire(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail || {} }));
  }

  /* ---------- Polite announcements ---------- */
  var liveEl = null, liveTimer = 0;
  function announce(msg) {
    if (!liveEl || !liveEl.isConnected) {
      liveEl = document.createElement("div");
      liveEl.className = "pf-live";
      liveEl.setAttribute("role", "status");
      liveEl.setAttribute("aria-live", "polite");
      liveEl.setAttribute("aria-atomic", "true");
      document.body.appendChild(liveEl);
    }
    clearTimeout(liveTimer);
    liveEl.textContent = "";
    liveTimer = setTimeout(function () { liveEl.textContent = msg; }, 40);
  }
  Pathfinder.announce = announce;

  /* ============================================================
     COMBOBOX
     <div class="pf-combobox"><div class="control">
        <span class="pf-tag">Fiber <button class="remove" aria-label="Remove Fiber">×</button></span>
        <input aria-label="Add technology"></div>
        <div class="pf-menu" role="listbox" hidden><div role="option">Fiber</div>...</div></div>
     ============================================================ */
  function comboInput(cb) { return cb.querySelector(".control input"); }
  function comboMenu(cb) { return cb.querySelector(".pf-menu"); }
  function comboOptions(cb) { var m = comboMenu(cb); return m ? qsa(m, '[role="option"]') : []; }
  function tagLabel(tag) {
    var c = tag.cloneNode(true);
    qsa(c, ".remove").forEach(function (r) { r.remove(); });
    return text(c);
  }
  function optionValue(opt) { return opt.getAttribute("data-value") || text(opt); }
  function comboTags(cb) { return qsa(cb, ".control .pf-tag"); }
  function comboOpen(cb) { var m = comboMenu(cb); return !!m && !m.hidden; }

  function syncCombo(cb) {
    var menu = comboMenu(cb), input = comboInput(cb);
    if (!input) return;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("autocomplete", "off");
    if (!menu) return;
    if (!menu.id) menu.id = uid("pf-combo");
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-multiselectable", "true");
    input.setAttribute("aria-controls", menu.id);
    if (!menu._pfInit) { menu._pfInit = true; menu.hidden = true; }
    input.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
    var chosen = comboTags(cb).map(tagLabel);
    comboOptions(cb).forEach(function (opt) {
      if (!opt.id) opt.id = uid("pf-opt");
      opt.setAttribute("aria-selected", chosen.indexOf(optionValue(opt)) >= 0 ? "true" : "false");
    });
    qsa(cb, ".control .pf-tag .remove").forEach(function (r) { r.setAttribute("type", "button"); });
  }

  function visibleOptions(cb) { return comboOptions(cb).filter(function (o) { return !o.hidden; }); }

  function setComboActive(cb, opt) {
    var input = comboInput(cb);
    comboOptions(cb).forEach(function (o) { o.classList.remove("active"); });
    if (opt) {
      opt.classList.add("active");
      input.setAttribute("aria-activedescendant", opt.id);
      if (opt.scrollIntoView) opt.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function filterCombo(cb) {
    var input = comboInput(cb), menu = comboMenu(cb);
    if (!menu) return 0;
    var q = input.value.trim().toLowerCase();
    var n = 0;
    comboOptions(cb).forEach(function (opt) {
      var match = !q || text(opt).toLowerCase().indexOf(q) >= 0;
      opt.hidden = !match;
      if (match) n++;
    });
    var count = menu.querySelector(".count");
    if (!count) {
      count = document.createElement("div");
      count.className = "count";
      count.setAttribute("aria-hidden", "true");
      menu.appendChild(count);
    }
    var msg = n === 0 ? "No matches" : n + (n === 1 ? " match" : " matches");
    count.textContent = msg;
    announce(msg);
    var active = menu.querySelector(".active");
    if (active && active.hidden) setComboActive(cb, null);
    return n;
  }

  function openCombo(cb) {
    var menu = comboMenu(cb), input = comboInput(cb);
    if (!menu || !menu.hidden) return;
    menu.hidden = false;
    input.setAttribute("aria-expanded", "true");
    filterCombo(cb);
  }

  function closeCombo(cb) {
    var menu = comboMenu(cb), input = comboInput(cb);
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    input.setAttribute("aria-expanded", "false");
    setComboActive(cb, null);
  }

  function makeTag(label) {
    var tag = document.createElement("span");
    tag.className = "pf-tag";
    tag.appendChild(document.createTextNode(label + " "));
    var rm = document.createElement("button");
    rm.type = "button";
    rm.className = "remove";
    rm.setAttribute("aria-label", "Remove " + label);
    rm.textContent = "×";
    tag.appendChild(rm);
    return tag;
  }

  function comboValues(cb) { return comboTags(cb).map(tagLabel); }

  function removeTag(cb, tag) {
    var label = tagLabel(tag);
    tag.remove();
    syncCombo(cb);
    announce(label + " removed");
    fire(cb, "pf:combobox-change", { values: comboValues(cb), removed: label });
  }

  function toggleOption(cb, opt) {
    var label = optionValue(opt);
    var existing = comboTags(cb).filter(function (t) { return tagLabel(t) === label; })[0];
    if (existing) {
      removeTag(cb, existing);
    } else {
      comboInput(cb).parentNode.insertBefore(makeTag(label), comboInput(cb));
      syncCombo(cb);
      announce(label + " added");
      fire(cb, "pf:combobox-change", { values: comboValues(cb), added: label });
    }
    comboInput(cb).value = "";
    filterCombo(cb);
    setComboActive(cb, opt.hidden ? null : opt);
  }

  function comboKey(e, cb) {
    var input = comboInput(cb);
    var opts = visibleOptions(cb);
    var cur = opts.indexOf(cb.querySelector(".pf-menu .active"));
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!comboOpen(cb)) openCombo(cb);
        opts = visibleOptions(cb);
        if (!opts.length) return;
        cur = opts.indexOf(cb.querySelector(".pf-menu .active"));
        var next = e.key === "ArrowDown" ? (cur + 1) % opts.length : (cur - 1 + opts.length) % opts.length;
        if (cur < 0) next = e.key === "ArrowDown" ? 0 : opts.length - 1;
        setComboActive(cb, opts[next]);
        break;
      case "Enter":
        if (comboOpen(cb)) {
          var active = cb.querySelector(".pf-menu .active");
          e.preventDefault();
          if (active && !active.hidden) toggleOption(cb, active);
        }
        break;
      case "Backspace":
        if (!input.value) {
          var tags = comboTags(cb);
          if (tags.length) { e.preventDefault(); removeTag(cb, tags[tags.length - 1]); filterCombo(cb); }
        }
        break;
      case "Tab":
        closeCombo(cb);
        break;
    }
  }

  document.addEventListener("input", function (e) {
    var cb = e.target.closest && e.target.closest(".pf-combobox");
    if (cb && e.target === comboInput(cb)) {
      if (!comboOpen(cb)) openCombo(cb);
      else filterCombo(cb);
      setComboActive(cb, null);
    }
    var cmdk = e.target.closest && e.target.closest(".pf-cmdk");
    if (cmdk && e.target.matches(".query input")) filterCmdk(cmdk);
  });

  /* ============================================================
     COMMAND PALETTE
     .pf-cmdk > .query input + .results[role=listbox] > .group, [role=option]
     Put it inside a .pf-modal-overlay to get a Cmd/Ctrl+K popup; standalone
     it just takes focus.
     ============================================================ */
  function cmdkOptions(c) { return qsa(c, '.results [role="option"]'); }
  function cmdkVisible(c) { return cmdkOptions(c).filter(function (o) { return !o.hidden; }); }
  function cmdkInput(c) { return c.querySelector(".query input"); }

  function initCmdk(c) {
    if (c._pfInit) return;
    c._pfInit = true;
    var input = cmdkInput(c), results = c.querySelector(".results");
    if (!input || !results) return;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("autocomplete", "off");
    if (!results.id) results.id = uid("pf-cmdk");
    input.setAttribute("aria-controls", results.id);
    cmdkOptions(c).forEach(function (opt) {
      if (!opt.id) opt.id = uid("pf-cmd");
      if (!opt.hasAttribute("aria-selected")) opt.setAttribute("aria-selected", "false");
      // Wrap everything except .meta so highlight can rebuild the label alone.
      var lbl = document.createElement("span");
      lbl.className = "lbl";
      Array.prototype.slice.call(opt.childNodes).forEach(function (n) {
        if (!(n.nodeType === 1 && n.classList.contains("meta"))) lbl.appendChild(n);
      });
      opt.insertBefore(lbl, opt.firstChild);
      opt._pfLabel = lbl.textContent.replace(/\s+/g, " ").trim();
      lbl.textContent = opt._pfLabel;
    });
    var empty = document.createElement("div");
    empty.className = "empty";
    empty.setAttribute("role", "status");
    empty.hidden = true;
    empty.textContent = "No results";
    results.appendChild(empty);
    filterCmdk(c, true);
  }

  function highlight(lbl, label, tokens) {
    lbl.textContent = "";
    if (!tokens.length) { lbl.textContent = label; return; }
    var re = new RegExp("(" + tokens.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "ig");
    label.split(re).forEach(function (part, i) {
      if (!part) return;
      if (i % 2 === 1) {
        var m = document.createElement("mark");
        m.textContent = part;
        lbl.appendChild(m);
      } else {
        lbl.appendChild(document.createTextNode(part));
      }
    });
  }

  function setCmdkActive(c, opt) {
    var input = cmdkInput(c);
    cmdkOptions(c).forEach(function (o) { o.setAttribute("aria-selected", o === opt ? "true" : "false"); });
    if (opt) {
      input.setAttribute("aria-activedescendant", opt.id);
      if (opt.scrollIntoView) opt.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function filterCmdk(c, quiet) {
    initCmdk(c);
    var results = c.querySelector(".results");
    var tokens = cmdkInput(c).value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var n = 0, group = null, groupHas = false;
    function closeGroup() { if (group) group.hidden = !groupHas; }
    Array.prototype.forEach.call(results.children, function (child) {
      if (child.classList.contains("group")) {
        closeGroup();
        group = child; groupHas = false;
      } else if (child.getAttribute("role") === "option") {
        var label = child._pfLabel || text(child);
        var low = label.toLowerCase();
        var match = tokens.every(function (t) { return low.indexOf(t) >= 0; });
        child.hidden = !match;
        if (match) {
          n++; groupHas = true;
          highlight(child.querySelector(".lbl"), label, tokens);
        }
      }
    });
    closeGroup();
    var empty = results.querySelector(".empty");
    if (empty) empty.hidden = n > 0;
    var vis = cmdkVisible(c);
    setCmdkActive(c, vis[0] || null);
    if (!quiet) announce(n === 0 ? "No results" : n + (n === 1 ? " result" : " results"));
  }

  function activateCmdk(c, opt) {
    var overlay = c.closest(".pf-modal-overlay");
    fire(opt, "pf:cmdk-select", { label: opt._pfLabel, option: opt });
    if (overlay) Pathfinder.closeModal(overlay);
  }

  function cmdkKey(e, c) {
    var vis = cmdkVisible(c);
    var cur = vis.indexOf(c.querySelector('.results [aria-selected="true"]'));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!vis.length) return;
      var next = e.key === "ArrowDown" ? (cur + 1) % vis.length : (cur - 1 + vis.length) % vis.length;
      setCmdkActive(c, vis[next]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (vis[cur]) activateCmdk(c, vis[cur]);
    }
  }

  var cmdkReturn = null;
  function findCmdk() {
    var all = qsa(document, ".pf-cmdk");
    return all.filter(function (c) { return c.closest(".pf-modal-overlay"); })[0] || all[0] || null;
  }

  document.addEventListener("keydown", function (e) {
    if (!((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k")) return;
    var c = findCmdk();
    if (!c) return;
    e.preventDefault();
    var overlay = c.closest(".pf-modal-overlay");
    if (overlay) {
      if (Pathfinder.hasLayer(overlay)) { Pathfinder.closeModal(overlay); return; }
      // Another dialog is already open: leave it alone.
      if (Pathfinder.topLayer()) return;
      Pathfinder.openModal(overlay);
      var inp = cmdkInput(c);
      if (inp) { inp.focus(); inp.select(); }
    } else {
      if (!c.contains(document.activeElement)) cmdkReturn = document.activeElement;
      var i = cmdkInput(c);
      if (i) { i.focus(); i.select(); }
    }
  });

  // Clear the query when a palette in an overlay closes, so it opens fresh.
  document.addEventListener("pf:modal-close", function (e) {
    var c = e.target.querySelector && e.target.querySelector(".pf-cmdk");
    if (c && cmdkInput(c)) { cmdkInput(c).value = ""; filterCmdk(c, true); }
  });

  /* ============================================================
     MENU AND SELECT POPUPS
     <div class="pf-menu-wrap">
       <button class="pf-btn" data-menu>Actions</button>     (data-menu="menuId" optional)
       <div class="pf-menu" role="menu">
         <button role="menuitem">Edit</button> ...
     role="listbox" with [role=option] makes it a select: choosing sets
     aria-selected and writes the label into [data-menu-value] in the trigger.
     ============================================================ */
  var ITEM_SEL = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"]';

  var TRIGGER_SEL = "[data-menu], [aria-haspopup='menu'], [aria-haspopup='listbox']";
  // Combobox inputs also carry aria-haspopup="listbox"; they are not menu triggers.
  function triggerOf(el) {
    var x = el.closest && el.closest(TRIGGER_SEL);
    return x && !x.closest(".pf-combobox, .pf-cmdk") ? x : null;
  }
  function menuOf(trigger) {
    var id = trigger.getAttribute("data-menu") || trigger.getAttribute("aria-controls");
    var m = id && document.getElementById(id);
    if (m) return m;
    var sib = trigger.nextElementSibling;
    return sib && sib.classList.contains("pf-menu") ? sib : null;
  }
  function menuItems(menu) {
    return qsa(menu, ITEM_SEL).filter(function (i) { return i.getAttribute("aria-disabled") !== "true" && !i.hidden && !i.disabled; });
  }
  function isListbox(menu) { return menu.getAttribute("role") === "listbox"; }

  function syncMenu(trigger) {
    var menu = menuOf(trigger);
    if (!menu) return;
    if (!menu.id) menu.id = uid("pf-menu");
    menu._pfTrigger = trigger;
    trigger.setAttribute("aria-haspopup", isListbox(menu) ? "listbox" : "menu");
    trigger.setAttribute("aria-controls", menu.id);
    if (!menu._pfInit) { menu._pfInit = true; menu.hidden = true; }
    trigger.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
    if (!menu.hasAttribute("role")) menu.setAttribute("role", "menu");
    if (!menu.hasAttribute("aria-labelledby") && !menu.hasAttribute("aria-label")) {
      if (!trigger.id) trigger.id = uid("pf-menu-trigger");
      menu.setAttribute("aria-labelledby", trigger.id);
    }
    qsa(menu, ITEM_SEL).forEach(function (it) {
      if (!it.hasAttribute("role")) it.setAttribute("role", "menuitem");
      it.setAttribute("tabindex", "-1");
    });
  }

  function openMenu(trigger, where) {
    var menu = menuOf(trigger);
    if (!menu) return;
    syncMenu(trigger);
    closeMenus(menu);
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    var items = menuItems(menu);
    var target = where === "last" ? items[items.length - 1]
      : items.filter(function (i) { return i.getAttribute("aria-selected") === "true"; })[0] || items[0];
    if (target) target.focus();
  }

  function closeMenu(menu, returnFocus) {
    if (menu.hidden) return;
    menu.hidden = true;
    var trigger = menu._pfTrigger;
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      if (returnFocus) trigger.focus();
    }
  }

  function closeMenus(except, returnFocus) {
    qsa(document, ".pf-menu").forEach(function (m) {
      if (m._pfTrigger && m !== except) closeMenu(m, returnFocus);
    });
  }

  function activateItem(menu, item) {
    var trigger = menu._pfTrigger;
    var role = item.getAttribute("role");
    if (role === "menuitemcheckbox") {
      item.setAttribute("aria-checked", item.getAttribute("aria-checked") === "true" ? "false" : "true");
    } else if (role === "option") {
      qsa(menu, '[role="option"]').forEach(function (o) { o.setAttribute("aria-selected", o === item ? "true" : "false"); });
      var slot = trigger && trigger.querySelector("[data-menu-value]");
      if (slot) slot.textContent = text(item);
    }
    fire(trigger || menu, "pf:menu-select", { item: item, value: item.getAttribute("data-value") || text(item) });
    if (role !== "menuitemcheckbox") closeMenu(menu, true);
  }

  var typeBuf = "", typeTimer = 0;
  function typeahead(menu, ch) {
    clearTimeout(typeTimer);
    typeBuf += ch.toLowerCase();
    typeTimer = setTimeout(function () { typeBuf = ""; }, 500);
    var items = menuItems(menu);
    var start = items.indexOf(document.activeElement);
    // Repeating one letter cycles through items that start with it.
    var single = typeBuf.split("").every(function (c) { return c === typeBuf[0]; });
    var needle = single ? typeBuf[0] : typeBuf;
    var ordered = items.slice(start + 1).concat(items.slice(0, start + 1));
    var hit = ordered.filter(function (i) { return text(i).toLowerCase().indexOf(needle) === 0; })[0];
    if (hit) hit.focus();
  }

  function menuKey(e, menu) {
    var items = menuItems(menu);
    var i = items.indexOf(document.activeElement);
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); if (items.length) items[(i + 1) % items.length].focus(); break;
      case "ArrowUp": e.preventDefault(); if (items.length) items[(i - 1 + items.length) % items.length].focus(); break;
      case "Home": e.preventDefault(); if (items[0]) items[0].focus(); break;
      case "End": e.preventDefault(); if (items.length) items[items.length - 1].focus(); break;
      case "Enter":
      case " ":
        if (i >= 0) { e.preventDefault(); activateItem(menu, items[i]); }
        break;
      case "Tab":
        closeMenu(menu, true);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ") typeahead(menu, e.key);
    }
  }

  /* ============================================================
     DRAWER
     <aside class="pf-drawer" id="d" hidden> ... <button data-drawer-close>
     <button data-drawer-open="d">. Pathfinder.openDrawer(id) / closeDrawer(el)
     ============================================================ */
  Pathfinder.openDrawer = function (id, trigger) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el || Pathfinder.hasLayer(el)) return;
    if (!el.hasAttribute("role")) el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) {
      var h = el.querySelector("header h1, header h2, header h3, header .title");
      if (h) { if (!h.id) h.id = uid("pf-drawer-title"); el.setAttribute("aria-labelledby", h.id); }
    }
    el.hidden = false;
    Pathfinder.pushLayer(el, {
      trigger: trigger || document.activeElement,
      isStatic: el.hasAttribute("data-static"),
      close: function () { Pathfinder.closeDrawer(el); },
    });
    Pathfinder.initialFocus(el.querySelector(".body") || el, el);
    fire(el, "pf:drawer-open");
  };

  Pathfinder.closeDrawer = function (id) {
    var el = typeof id === "string" ? document.getElementById(id) : id;
    if (!el) {
      var top = Pathfinder.topLayer();
      el = top && top.el.classList.contains("pf-drawer") ? top.el : null;
    }
    if (!el || !Pathfinder.hasLayer(el)) return;
    el.hidden = true;
    Pathfinder.popLayer(el);
    fire(el, "pf:drawer-close");
  };

  /* ============================================================
     TREE
     ============================================================ */
  function treeItems(tree) {
    return qsa(tree, '[role="treeitem"]').filter(function (it) {
      var p = it.parentNode && it.parentNode.closest('[role="treeitem"]');
      while (p && tree.contains(p)) {
        if (p.getAttribute("aria-expanded") === "false") return false;
        p = p.parentNode.closest('[role="treeitem"]');
      }
      return true;
    });
  }
  function treeChildren(it) { return it.querySelector(':scope > [role="group"], :scope > ul'); }
  function treeRow(it) { return it.querySelector(":scope > .row"); }

  function syncTreeGlyph(it) {
    var row = treeRow(it);
    if (!row || !row.firstChild || row.firstChild.nodeType !== 3) return;
    var open = it.getAttribute("aria-expanded") === "true";
    row.firstChild.nodeValue = row.firstChild.nodeValue.replace(/^\s*[▾▸]/, open ? "▾" : "▸");
  }

  function setTreeFocus(tree, it) {
    qsa(tree, '[role="treeitem"]').forEach(function (n) { n.setAttribute("tabindex", n === it ? "0" : "-1"); });
    if (it) it.focus();
  }

  function selectTreeItem(tree, it) {
    qsa(tree, '[role="treeitem"][aria-selected="true"]').forEach(function (n) { n.setAttribute("aria-selected", "false"); });
    it.setAttribute("aria-selected", "true");
    fire(it, "pf:tree-select", { item: it });
  }

  function setExpanded(it, open) {
    if (!treeChildren(it)) return;
    it.setAttribute("aria-expanded", open ? "true" : "false");
    syncTreeGlyph(it);
  }

  function syncTree(tree) {
    if (!tree.hasAttribute("role")) tree.setAttribute("role", "tree");
    qsa(tree, "ul").forEach(function (u) { if (!u.hasAttribute("role")) u.setAttribute("role", "group"); });
    var items = qsa(tree, '[role="treeitem"]');
    var keep = tree.querySelector('[role="treeitem"][tabindex="0"]') ||
      tree.querySelector('[role="treeitem"][aria-selected="true"]') || items[0];
    items.forEach(function (it) {
      it.setAttribute("tabindex", it === keep ? "0" : "-1");
      if (treeChildren(it) && !it.hasAttribute("aria-expanded")) it.setAttribute("aria-expanded", "false");
      syncTreeGlyph(it);
    });
  }

  function treeKey(e, tree, it) {
    var vis = treeItems(tree), i = vis.indexOf(it), to = null;
    switch (e.key) {
      case "ArrowDown": to = vis[i + 1]; break;
      case "ArrowUp": to = vis[i - 1]; break;
      case "Home": to = vis[0]; break;
      case "End": to = vis[vis.length - 1]; break;
      case "ArrowRight":
        if (treeChildren(it)) {
          if (it.getAttribute("aria-expanded") !== "true") { setExpanded(it, true); e.preventDefault(); return; }
          to = treeItems(tree)[i + 1];
        }
        break;
      case "ArrowLeft":
        if (treeChildren(it) && it.getAttribute("aria-expanded") === "true") { setExpanded(it, false); e.preventDefault(); return; }
        to = it.parentNode.closest('[role="treeitem"]');
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectTreeItem(tree, it);
        return;
      default: return;
    }
    e.preventDefault();
    if (to) setTreeFocus(tree, to);
  }

  /* ============================================================
     SEGMENTED CONTROL
     ============================================================ */
  function segButtons(seg) { return qsa(seg, 'button:not([disabled])'); }

  function syncSegmented(seg) {
    if (!seg.hasAttribute("role")) seg.setAttribute("role", "radiogroup");
    var btns = segButtons(seg);
    var checked = btns.filter(function (b) { return b.getAttribute("aria-checked") === "true"; })[0] || btns[0];
    btns.forEach(function (b) {
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", b === checked ? "true" : "false");
      b.setAttribute("tabindex", b === checked ? "0" : "-1");
    });
  }

  function selectSeg(seg, btn, focus) {
    segButtons(seg).forEach(function (b) {
      var on = b === btn;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.setAttribute("tabindex", on ? "0" : "-1");
    });
    if (focus) btn.focus();
    fire(seg, "pf:segmented-change", { value: btn.getAttribute("data-value") || text(btn), button: btn });
  }

  /* ============================================================
     TOOLTIP
     Either [data-tooltip="Text"] on the trigger (a tooltip is created), or
     aria-describedby pointing at <span class="pf-tooltip" role="tooltip" hidden>.
     Shown on hover (short delay) and on focus; Escape hides.
     ============================================================ */
  var tipTimer = 0, tipShown = null;

  function tooltipFor(trigger) {
    var id = trigger.getAttribute("aria-describedby");
    var tip = id && document.getElementById(id);
    return tip && tip.classList.contains("pf-tooltip") && (tip.hidden || tip.classList.contains("floating")) ? tip : null;
  }

  function syncTooltips(root) {
    qsa(root, "[data-tooltip]").forEach(function (t) {
      var tip = tooltipFor(t);
      if (!tip) {
        tip = document.createElement("span");
        tip.className = "pf-tooltip";
        tip.id = uid("pf-tip");
        tip.hidden = true;
        document.body.appendChild(tip);
        t.setAttribute("aria-describedby", tip.id);
      }
      tip.setAttribute("role", "tooltip");
      if (tip.textContent !== t.getAttribute("data-tooltip")) tip.textContent = t.getAttribute("data-tooltip");
      tip._pfOwner = t;
    });
    // Drop generated tooltips whose trigger left the page (hot-swap).
    qsa(document, ".pf-tooltip").forEach(function (tip) {
      if (tip._pfOwner && !tip._pfOwner.isConnected) tip.remove();
    });
    qsa(root, '[aria-describedby]').forEach(function (t) {
      var tip = tooltipFor(t);
      if (tip) { tip.setAttribute("role", "tooltip"); tip._pfOwner = t; }
    });
  }

  function showTip(trigger) {
    var tip = tooltipFor(trigger);
    if (!tip) return;
    if (tipShown && tipShown !== tip) hideTip();
    tip.classList.add("floating");
    tip.hidden = false;
    var r = trigger.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight, gap = 8;
    var top = r.bottom + gap;
    if (top + h > window.innerHeight - 4) top = Math.max(4, r.top - h - gap);
    var left = Math.min(Math.max(4, r.left + r.width / 2 - w / 2), window.innerWidth - w - 4);
    tip.style.top = top + "px";
    tip.style.left = left + "px";
    tipShown = tip;
  }

  function hideTip() {
    clearTimeout(tipTimer);
    if (tipShown) { tipShown.hidden = true; tipShown = null; }
  }

  document.addEventListener("mouseover", function (e) {
    var t = e.target.closest && e.target.closest("[aria-describedby]");
    if (!t || !tooltipFor(t) || (e.relatedTarget && t.contains(e.relatedTarget))) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { showTip(t); }, 250);
  });
  document.addEventListener("mouseout", function (e) {
    var t = e.target.closest && e.target.closest("[aria-describedby]");
    if (!t || !tooltipFor(t) || (e.relatedTarget && t.contains(e.relatedTarget))) return;
    if (!t.contains(document.activeElement)) hideTip();
  });
  document.addEventListener("focusin", function (e) {
    var t = e.target.closest && e.target.closest("[aria-describedby]");
    if (t && tooltipFor(t)) { clearTimeout(tipTimer); showTip(t); }
  });
  document.addEventListener("focusout", function (e) {
    var t = e.target.closest && e.target.closest("[aria-describedby]");
    if (t && tooltipFor(t)) hideTip();
  });
  window.addEventListener("scroll", hideTip, true);
  window.addEventListener("resize", hideTip);

  /* ============================================================
     Delegated clicks
     ============================================================ */
  document.addEventListener("mousedown", function (e) {
    // Keep input focus when picking an option with the pointer.
    if (e.target.closest(".pf-combobox .pf-menu [role='option']") || e.target.closest(".pf-cmdk .results [role='option']")) {
      e.preventDefault();
    }
  });

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t.closest) return;

    // Drawer
    var dOpen = t.closest("[data-drawer-open]");
    if (dOpen) { Pathfinder.openDrawer(dOpen.getAttribute("data-drawer-open"), dOpen); return; }
    if (t.closest("[data-drawer-close]")) { Pathfinder.closeDrawer(t.closest(".pf-drawer")); return; }
    var top = Pathfinder.topLayer();
    if (top && top.el.classList.contains("pf-drawer") && !top.isStatic &&
        !top.el.contains(t) && !t.closest(".pf-toast-region")) {
      Pathfinder.closeDrawer(top.el);
    }

    // Combobox
    var cb = t.closest(".pf-combobox");
    qsa(document, ".pf-combobox").forEach(function (other) { if (other !== cb) closeCombo(other); });
    if (cb) {
      var rm = t.closest(".control .remove");
      if (rm) {
        removeTag(cb, rm.closest(".pf-tag"));
        comboInput(cb).focus();
        return;
      }
      var opt = t.closest('.pf-menu [role="option"]');
      if (opt && comboMenu(cb).contains(opt)) { toggleOption(cb, opt); return; }
      if (t.closest(".control")) {
        comboInput(cb).focus();
        if (comboOpen(cb)) closeCombo(cb); else openCombo(cb);
      }
    }

    // Command palette options
    var copt = t.closest('.pf-cmdk .results [role="option"]');
    if (copt) {
      var c = copt.closest(".pf-cmdk");
      setCmdkActive(c, copt);
      activateCmdk(c, copt);
      return;
    }

    // Menus and select popups
    var trig = triggerOf(t);
    if (trig && menuOf(trig)) {
      var menu = menuOf(trig);
      if (menu.hidden) openMenu(trig); else closeMenu(menu, true);
      return;
    }
    var item = t.closest(ITEM_SEL);
    var imenu = item && item.closest(".pf-menu");
    if (imenu && imenu._pfTrigger) {
      if (item.getAttribute("aria-disabled") !== "true") activateItem(imenu, item);
      return;
    }
    qsa(document, ".pf-menu").forEach(function (m) { if (m._pfTrigger && !m.contains(t)) closeMenu(m, false); });

    // Tree
    var row = t.closest('[role="treeitem"]');
    var tree = row && row.closest(".pf-tree");
    if (tree) {
      var node = t.closest('[role="treeitem"]');
      setTreeFocus(tree, node);
      selectTreeItem(tree, node);
      if (treeChildren(node) && t.closest(".row") && t.closest(".row").parentNode === node) {
        setExpanded(node, node.getAttribute("aria-expanded") !== "true");
      }
      return;
    }

    // Segmented
    var sb = t.closest(".pf-segmented button");
    if (sb) selectSeg(sb.closest(".pf-segmented"), sb, false);
  });

  /* ============================================================
     Delegated keys
     ============================================================ */
  // Escape first (capture), so the innermost open popup closes before any
  // enclosing modal or drawer sees the key.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var t = e.target;
    if (tipShown) { hideTip(); e.stopPropagation(); return; }
    var cb = t.closest && t.closest(".pf-combobox");
    if (cb && comboOpen(cb)) { closeCombo(cb); e.stopPropagation(); return; }
    var open = qsa(document, ".pf-menu").filter(function (m) { return m._pfTrigger && !m.hidden; })[0];
    if (open) { closeMenu(open, true); e.stopPropagation(); return; }
    var c = t.closest && t.closest(".pf-cmdk");
    if (c && !c.closest(".pf-modal-overlay")) {
      e.stopPropagation();
      if (cmdkReturn && cmdkReturn.isConnected) cmdkReturn.focus(); else t.blur();
      cmdkReturn = null;
    }
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.key === "Escape") return;
    var t = e.target;
    if (!t.closest) return;

    var cb = t.closest(".pf-combobox");
    if (cb && t === comboInput(cb)) { comboKey(e, cb); return; }

    var c = t.closest(".pf-cmdk");
    if (c && t.matches(".query input")) { cmdkKey(e, c); return; }

    var trig = triggerOf(t);
    if (trig && menuOf(trig) && t === trig && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      openMenu(trig, e.key === "ArrowUp" ? "last" : "first");
      return;
    }
    var menu = t.closest(".pf-menu");
    if (menu && menu._pfTrigger && !menu.hidden) { menuKey(e, menu); return; }

    var item = t.closest('[role="treeitem"]');
    var tree = item && item.closest(".pf-tree");
    if (tree && t === item) { treeKey(e, tree, item); return; }

    var seg = t.closest(".pf-segmented");
    if (seg && t.matches("button")) {
      var btns = segButtons(seg), i = btns.indexOf(t), to = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % btns.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + btns.length) % btns.length;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = btns.length - 1;
      if (to >= 0) { e.preventDefault(); selectSeg(seg, btns[to], true); }
    }
  });

  /* ============================================================
     Enhance pass (idempotent)
     ============================================================ */
  Pathfinder.enhanceWidgets = function (root) {
    root = root || document;
    qsa(root, ".pf-combobox").forEach(syncCombo);
    qsa(root, ".pf-cmdk").forEach(initCmdk);
    qsa(root, TRIGGER_SEL).forEach(function (t) { if (triggerOf(t) === t) syncMenu(t); });
    qsa(root, ".pf-tree").forEach(syncTree);
    qsa(root, ".pf-segmented").forEach(syncSegmented);
    syncTooltips(root);
  };

  Pathfinder.enhanceWidgets(document);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { Pathfinder.enhanceWidgets(document); });
  }
})();
