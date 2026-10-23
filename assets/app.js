/* Speedrun OS · shared shell
   Theme, navigation, settings sheet (backup / import / delete), segmented tabs with swipe,
   springs, toast with undo, collapsible memory, copy buttons for prompts. */
(function () {
    // Line icons, one stroke weight, used only in the navigation
    function ico(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>"; }
    var NAV = [
        { href: "index.html", label: "Today", icon: ico('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>') },
        { href: "coach.html", label: "Coach", icon: ico('<path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.3A7.5 7.5 0 1 1 20 11.5z"/>') },
        { href: "drill.html", label: "Drill", icon: ico('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>') },
        { href: "words.html", label: "Words", icon: ico('<path d="M4 19 9 5l5 14M5.8 14.5h6.4M15 15.5c0-2 1.4-3 3-3s3 1 3 3v3.5M21 17c-.6 1.5-1.7 2-3 2-1.6 0-3-.6-3-2.2"/>') },
        { href: "anki.html", label: "Anki", icon: ico('<rect x="6" y="3.5" width="13" height="16" rx="2.5"/><path d="M4 7v11.5A2.5 2.5 0 0 0 6.5 21H15"/>') },
        { href: "archive.html", label: "Essays", icon: ico('<path d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v12a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18V8.5z"/><path d="M14 3.5v5h5M8.5 13h7M8.5 16.5h5"/>') },
        { href: "performance.html", label: "Audit", icon: ico('<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>') }
    ];

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
        } catch (e) { return null; }
    }
    window.SpeedrunStore = store;

    var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- Theme ----------
    function applyTheme(t) {
        if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
        else document.documentElement.removeAttribute("data-theme");
    }
    applyTheme(store("theme") || "auto");

    // ---------- Spring (critically damped by default; response in seconds, Apple-style) ----------
    function spring(from, to, velocity, opts, onFrame, onDone) {
        var response = (opts && opts.response) || 0.35, damping = opts && opts.damping != null ? opts.damping : 1;
        var k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * damping / response;
        var x = from, v = velocity || 0, last = performance.now(), raf, stopped = false;
        if (reduceMotion) { onFrame(to); if (onDone) onDone(); return function () {}; }
        function step(now) {
            if (stopped) return;
            var dt = Math.min((now - last) / 1000, 1 / 30); last = now;
            var a = -k * (x - to) - c * v;
            v += a * dt; x += v * dt;
            if (Math.abs(x - to) < 0.4 && Math.abs(v) < 8) { onFrame(to); if (onDone) onDone(); return; }
            onFrame(x);
            raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);
        return function () { stopped = true; cancelAnimationFrame(raf); };
    }
    // Where a flick would come to rest (Apple's projection, d = deceleration rate)
    function project(v, d) { d = d || 0.998; return (v / 1000) * d / (1 - d); }
    function rubberband(over, dim) { var c = 0.55; return (over * dim * c) / (dim + c * Math.abs(over)); }
    window.Motion = { spring: spring, project: project, rubberband: rubberband };

    // ---------- Pages ----------
    function currentPage() {
        var file = location.pathname.split("/").pop() || "index.html";
        if (/^essay-/.test(file)) return "archive.html";
        if (file === "reboot.html" || file === "test.html") return "index.html";
        return file;
    }
    function navLinks() {
        var here = currentPage();
        return NAV.map(function (n) {
            var cur = n.href === here ? ' aria-current="page"' : "";
            return '<a href="' + n.href + '"' + cur + '><span class="tabs__icon" aria-hidden="true">' + n.icon + "</span>" + n.label + "</a>";
        }).join("");
    }

    function buildShell() {
        var skip = document.createElement("a");
        skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Skip to content";

        var header = document.createElement("header");
        header.className = "appbar";
        header.innerHTML =
            '<div class="appbar__inner">' +
                '<a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true">B2</span><span>Speedrun</span></a>' +
                '<span class="appbar__spacer"></span>' +
                '<nav class="tabs" aria-label="Main">' + navLinks() + "</nav>" +
                '<button class="icon-btn" id="open-settings" type="button" aria-label="Settings and data" title="Settings and data" aria-haspopup="dialog">' + ico('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>') + '</button>' +
            "</div>";

        var bottom = document.createElement("nav");
        bottom.className = "bottom-tabs";
        bottom.setAttribute("aria-label", "Main");
        bottom.innerHTML = navLinks();

        var toastEl = document.createElement("div");
        toastEl.className = "toast"; toastEl.id = "toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite");

        document.body.insertBefore(header, document.body.firstChild);
        document.body.insertBefore(skip, document.body.firstChild);
        document.body.appendChild(bottom);
        document.body.appendChild(toastEl);
        document.getElementById("open-settings").addEventListener("click", openSheet);
    }

    // ---------- Toast (optional action, e.g. Undo) ----------
    var toastTimer;
    window.toast = function (msg, action, ms) {
        var el = document.getElementById("toast");
        if (!el) return;
        el.innerHTML = "";
        var span = document.createElement("span"); span.textContent = msg; el.appendChild(span);
        if (action) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "toast__action"; b.textContent = action.label;
            b.addEventListener("click", function () { el.classList.remove("is-visible"); action.run(); });
            el.appendChild(b);
        }
        el.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, ms || (action ? 6000 : 2200));
    };
    function haptic() { try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {} }
    window.haptic = haptic;

    // ---------- Data: backup, import, delete (with undo) ----------
    var KEY_RE = /^(units:|test:|reboot-done|words:|anki:|perf:|speedrunBannedSet|home:|open:|tab:|theme$)/;
    function ownKeys() {
        var keys = [];
        try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (KEY_RE.test(k)) keys.push(k); } } catch (e) {}
        return keys;
    }
    function snapshot(filter) {
        var data = {};
        ownKeys().forEach(function (k) { if (!filter || filter.test(k)) data[k] = store(k); });
        return data;
    }
    function restore(data, filter) {
        ownKeys().forEach(function (k) { if (!filter || filter.test(k)) store(k, null); });
        Object.keys(data).forEach(function (k) { if (KEY_RE.test(k)) store(k, data[k]); });
    }
    // Keep an undo copy across the reload that follows a destructive change
    function withUndo(label, filter, change) {
        var before = snapshot(filter);
        change();
        try { sessionStorage.setItem("speedrun:undo", JSON.stringify({ label: label, at: Date.now(), filter: filter ? filter.source : null, data: before })); } catch (e) {}
        location.reload();
    }
    function offerUndo() {
        var raw; try { raw = sessionStorage.getItem("speedrun:undo"); sessionStorage.removeItem("speedrun:undo"); } catch (e) { return; }
        if (!raw) return;
        var u = JSON.parse(raw);
        if (Date.now() - u.at > 15000) return;
        toast(u.label, { label: "Undo", run: function () { restore(u.data, u.filter ? new RegExp(u.filter) : null); location.reload(); } }, 8000);
    }

    function exportBackup() {
        var payload = { app: "speedrun-os", version: 1, exported: new Date().toISOString(), data: snapshot() };
        var blob = new Blob([JSON.stringify(payload, null, 1)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "speedrun-backup-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        toast("Backup saved · " + Object.keys(payload.data).length + " items");
    }
    function importBackup(file) {
        var reader = new FileReader();
        reader.onload = function () {
            var p;
            try { p = JSON.parse(reader.result); } catch (e) { toast("That file isn't a backup. Choose the .json you exported."); return; }
            if (!p || p.app !== "speedrun-os" || !p.data) { toast("That file isn't a Speedrun backup."); return; }
            withUndo("Backup restored", null, function () { restore(p.data, null); });
        };
        reader.readAsText(file);
    }
    var GRAMMAR_RE = /^(units:|test:)/;

    // ---------- Settings sheet ----------
    var sheet, scrim, lastFocus, sheetY = 0, stopAnim;
    function buildSheet() {
        scrim = document.createElement("div"); scrim.className = "scrim"; scrim.hidden = true;
        sheet = document.createElement("div");
        sheet.className = "sheet"; sheet.hidden = true;
        sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-labelledby", "sheet-title");
        var t = store("theme") || "auto";
        sheet.innerHTML =
            '<div class="sheet__grab" aria-hidden="true"></div>' +
            '<div class="sheet__head"><h2 id="sheet-title">Settings</h2><button class="icon-btn" type="button" data-close aria-label="Close">' + ico('<path d="M6 6l12 12M18 6 6 18"/>') + '</button></div>' +
            '<div class="sheet__label">Appearance</div>' +
            '<div class="segmented" role="radiogroup" aria-label="Theme" style="display:flex;margin:0 0 4px">' +
                ["auto", "light", "dark"].map(function (x) {
                    return '<input type="radio" name="theme" id="th-' + x + '" value="' + x + '"' + (t === x ? " checked" : "") + '><label for="th-' + x + '" style="flex:1;text-align:center">' + x[0].toUpperCase() + x.slice(1) + "</label>";
                }).join("") +
            "</div>" +
            '<div class="sheet__label" style="margin-top:18px">Your data</div>' +
            '<div class="sheet__group">' +
                '<button class="sheet-row" type="button" data-act="export"><span class="sheet-row__icon">' + ico('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>') + '</span><span class="sheet-row__text">Export backup<small>Unit queue, progress, words, Anki queue, scores</small></span></button>' +
                '<label class="sheet-row" style="cursor:pointer"><span class="sheet-row__icon">' + ico('<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>') + '</span><span class="sheet-row__text">Import backup<small>Replaces the data in this browser</small></span><input type="file" accept="application/json,.json" data-act="import" class="sr-only"></label>' +
            "</div>" +
            '<p class="sheet__note">Everything is stored only in this browser. Export a backup to move it to another device.</p>' +
            '<div class="sheet__label" style="margin-top:18px">Reset</div>' +
            '<div class="sheet__group">' +
                '<button class="sheet-row sheet-row--danger" type="button" data-ask="grammar"><span class="sheet-row__icon">' + ico('<path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7M4 4v4.7h4.7"/>') + '</span><span class="sheet-row__text">Reset grammar progress<small>Unit queue, unit results, test results</small></span></button>' +
                '<div class="sheet-confirm" data-confirm="grammar" hidden><p>Delete your unit queue, unit results and test results?</p><div class="row"><button class="btn btn--sm" type="button" data-cancel>Cancel</button><button class="btn btn--sm btn--danger" type="button" data-act="reset-grammar">Reset grammar</button></div></div>' +
                '<button class="sheet-row sheet-row--danger" type="button" data-ask="all"><span class="sheet-row__icon">' + ico('<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>') + '</span><span class="sheet-row__text">Delete all data<small>Everything this site saved in this browser</small></span></button>' +
                '<div class="sheet-confirm" data-confirm="all" hidden><p>Delete all your data on this browser? You can undo for a few seconds; export a backup first to be safe.</p><div class="row"><button class="btn btn--sm" type="button" data-cancel>Cancel</button><button class="btn btn--sm btn--danger" type="button" data-act="delete-all">Delete all data</button></div></div>' +
            "</div>";
        document.body.appendChild(scrim);
        document.body.appendChild(sheet);

        scrim.addEventListener("click", closeSheet);
        sheet.querySelector("[data-close]").addEventListener("click", closeSheet);
        sheet.querySelectorAll("input[name=theme]").forEach(function (r) {
            r.addEventListener("change", function () { store("theme", r.value === "auto" ? null : r.value); applyTheme(r.value); });
        });
        sheet.querySelector('[data-act="export"]').addEventListener("click", exportBackup);
        sheet.querySelector('[data-act="import"]').addEventListener("change", function (e) { if (e.target.files[0]) importBackup(e.target.files[0]); e.target.value = ""; });
        sheet.querySelectorAll("[data-ask]").forEach(function (b) {
            b.addEventListener("click", function () {
                sheet.querySelectorAll("[data-confirm]").forEach(function (c) { c.hidden = c.dataset.confirm !== b.dataset.ask; });
                sheet.querySelector('[data-confirm="' + b.dataset.ask + '"] [data-cancel]').focus();
            });
        });
        sheet.querySelectorAll("[data-cancel]").forEach(function (b) { b.addEventListener("click", function () { b.closest("[data-confirm]").hidden = true; }); });
        sheet.querySelector('[data-act="reset-grammar"]').addEventListener("click", function () {
            withUndo("Grammar progress reset", GRAMMAR_RE, function () { ownKeys().forEach(function (k) { if (GRAMMAR_RE.test(k)) store(k, null); }); });
        });
        sheet.querySelector('[data-act="delete-all"]').addEventListener("click", function () {
            withUndo("All data deleted", null, function () { ownKeys().forEach(function (k) { store(k, null); }); });
        });

        sheet.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { closeSheet(); return; }
            if (e.key !== "Tab") return;
            var f = Array.prototype.filter.call(sheet.querySelectorAll("button, input, [tabindex]"), function (x) { return !x.closest("[hidden]") && !x.disabled; });
            if (!f.length) return;
            if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        });

        // Drag down to dismiss: 1:1 tracking, rubber-band upwards, velocity decides
        var drag = null;
        sheet.addEventListener("pointerdown", function (e) {
            if (e.target.closest("button, input, label, a") && !e.target.closest(".sheet__grab")) return;
            if (sheet.scrollTop > 0) return;
            drag = { y: e.clientY, start: sheetY, hist: [[e.clientY, performance.now()]] };
            if (stopAnim) stopAnim();
            sheet.setPointerCapture(e.pointerId);
        });
        sheet.addEventListener("pointermove", function (e) {
            if (!drag) return;
            var dy = e.clientY - drag.y + drag.start;
            setSheet(dy < 0 ? rubberband(dy, sheet.offsetHeight) : dy);
            drag.hist.push([e.clientY, performance.now()]); if (drag.hist.length > 5) drag.hist.shift();
        });
        function endDrag() {
            if (!drag) return;
            var h = drag.hist, a = h[0], b = h[h.length - 1];
            var v = b[1] > a[1] ? (b[0] - a[0]) / ((b[1] - a[1]) / 1000) : 0;
            drag = null;
            if (sheetY + project(v, 0.99) > sheet.offsetHeight * 0.4) closeSheet(v);
            else stopAnim = spring(sheetY, 0, v, { response: 0.3, damping: 0.8 }, setSheet);
        }
        sheet.addEventListener("pointerup", endDrag);
        sheet.addEventListener("pointercancel", endDrag);
    }
    function setSheet(y) {
        sheetY = y;
        sheet.style.transform = "translateY(" + y + "px)";
        scrim.style.opacity = Math.max(0, Math.min(1, 1 - y / Math.max(sheet.offsetHeight, 1)));
    }
    function openSheet() {
        if (!sheet) buildSheet();
        lastFocus = document.activeElement;
        sheet.querySelectorAll("[data-confirm]").forEach(function (c) { c.hidden = true; });
        scrim.hidden = false; sheet.hidden = false;
        if (stopAnim) stopAnim();
        setSheet(sheet.offsetHeight);
        stopAnim = spring(sheet.offsetHeight, 0, 0, { response: 0.35, damping: 1 }, setSheet);
        sheet.querySelector("[data-close]").focus({ preventScroll: true });
        document.documentElement.style.overflow = "hidden";
    }
    function closeSheet(v) {
        if (!sheet || sheet.hidden) return;
        if (stopAnim) stopAnim();
        stopAnim = spring(sheetY, sheet.offsetHeight, typeof v === "number" ? v : 0, { response: 0.3, damping: 1 }, setSheet, function () {
            sheet.hidden = true; scrim.hidden = true;
            document.documentElement.style.overflow = "";
            if (lastFocus) lastFocus.focus({ preventScroll: true });
        });
    }

    // ---------- Segmented tabs: sliding pill, roving focus, swipe between panels ----------
    function initTabsets() {
        document.querySelectorAll(".tabset").forEach(function (set) {
            var seg = set.querySelector(":scope > .seg"), panelsEl = set.querySelector(":scope > .panels");
            if (!seg || !panelsEl) return;
            var tabs = Array.prototype.slice.call(seg.querySelectorAll(":scope > .seg__btn"));
            var panels = tabs.map(function (t) { return document.getElementById(t.dataset.for); });
            var pill = document.createElement("span"); pill.className = "seg__pill"; pill.setAttribute("aria-hidden", "true");
            seg.insertBefore(pill, seg.firstChild);
            seg.setAttribute("role", "tablist");
            var key = "tab:" + currentPage() + ":" + set.id, index = 0;

            tabs.forEach(function (t, i) {
                t.setAttribute("role", "tab"); t.type = "button";
                if (!t.id) t.id = t.dataset.for + "-tab";
                t.setAttribute("aria-controls", t.dataset.for);
                panels[i].setAttribute("role", "tabpanel");
                panels[i].setAttribute("aria-labelledby", t.id);
                t.addEventListener("click", function () { select(i, true); });
                t.addEventListener("keydown", function (e) {
                    var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                    if (n) { e.preventDefault(); var j = (i + n + tabs.length) % tabs.length; select(j, true); tabs[j].focus(); }
                });
            });

            function placePill(animate) {
                var t = tabs[index];
                if (!animate) pill.style.transition = "none";
                pill.style.width = t.offsetWidth + "px";
                pill.style.transform = "translateX(" + t.offsetLeft + "px)";
                if (!animate) { pill.offsetWidth; pill.style.transition = ""; }
                if (seg.classList.contains("seg--scroll")) {
                    var left = t.offsetLeft - (seg.clientWidth - t.offsetWidth) / 2;
                    seg.scrollTo({ left: left, behavior: animate && !reduceMotion ? "smooth" : "auto" });
                }
            }

            function select(i, animate, fromSwipe) {
                var prev = index; index = i;
                tabs.forEach(function (t, j) {
                    t.setAttribute("aria-selected", j === i ? "true" : "false");
                    t.tabIndex = j === i ? 0 : -1;
                    if (!(fromSwipe && (j === i || j === prev))) panels[j].hidden = j !== i;
                });
                if (animate && !fromSwipe && prev !== i) {
                    var p = panels[i];
                    p.classList.remove("panel-in", "panel-in--left", "panel-in--right");
                    p.offsetWidth;
                    p.classList.add("panel-in", i > prev ? "panel-in--right" : "panel-in--left");
                }
                placePill(animate);
                store(key, tabs[i].dataset.for);
                set.dispatchEvent(new CustomEvent("tabchange", { detail: { panel: tabs[i].dataset.for } }));
            }

            var saved = store(key), start = 0;
            if (set.dataset.hashTab && location.hash === "#" + set.dataset.hashTab) saved = set.dataset.hashTab;
            tabs.forEach(function (t, i) { if (t.dataset.for === saved) start = i; });
            index = start;
            select(start, false);
            window.addEventListener("resize", function () { placePill(false); });
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placePill(false); });

            set.selectPanel = function (id) { tabs.forEach(function (t, i) { if (t.dataset.for === id) select(i, true); }); };

            if (set.hasAttribute("data-swipe") && !reduceMotion) addSwipe(panelsEl, function () { return index; }, panels, function (i) { select(i, true, true); });
        });
    }

    // Horizontal swipe between tab panels: decide direction after 10px, track 1:1,
    // rubber-band at the ends, project the flick, then hand the velocity to a spring.
    function addSwipe(el, getIndex, panels, commit) {
        var g = null, stop;
        el.addEventListener("pointerdown", function (e) {
            if (e.pointerType === "mouse") return;
            if (e.target.closest("input, textarea, select, .seg, .chips, .sched-scroll")) return;
            g = { x: e.clientX, y: e.clientY, dir: 0, hist: [[e.clientX, performance.now()]], id: e.pointerId };
        });
        el.addEventListener("pointermove", function (e) {
            if (!g) return;
            var dx = e.clientX - g.x, dy = e.clientY - g.y;
            if (!g.dir) {
                if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { g = null; return; }
                if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                    g.dir = 1; g.x = e.clientX; dx = 0;
                    if (stop) stop();
                    try { el.setPointerCapture(g.id); } catch (err) {}
                } else return;
            }
            var i = getIndex(), w = el.offsetWidth;
            var atEdge = (dx > 0 && i === 0) || (dx < 0 && i === panels.length - 1);
            var off = atEdge ? rubberband(dx, w) : dx;
            panels[i].style.transform = "translateX(" + off + "px)";
            g.off = off;
            g.hist.push([e.clientX, performance.now()]); if (g.hist.length > 6) g.hist.shift();
        });
        function end() {
            if (!g) return;
            if (!g.dir) { g = null; return; }
            var h = g.hist, a = h[0], b = h[h.length - 1];
            var v = b[1] > a[1] ? (b[0] - a[0]) / ((b[1] - a[1]) / 1000) : 0;
            var i = getIndex(), w = el.offsetWidth, off = g.off || 0;
            var landing = off + project(v, 0.99);
            var target = landing < -w * 0.3 && i < panels.length - 1 ? i + 1 : landing > w * 0.3 && i > 0 ? i - 1 : i;
            g = null;
            var cur = panels[i];
            if (target === i) {
                stop = spring(off, 0, v, { response: 0.3, damping: 1 }, function (x) { cur.style.transform = x ? "translateX(" + x + "px)" : ""; });
                return;
            }
            // New panel enters from the side the finger moves toward; both move together
            var dir = target > i ? 1 : -1, next = panels[target];
            commit(target);
            haptic();
            next.hidden = false;
            cur.style.position = "absolute"; cur.style.top = "0"; cur.style.left = "0"; cur.style.right = "0";
            var from = off + dir * w;
            stop = spring(from, 0, v, { response: 0.32, damping: 1 }, function (x) {
                next.style.transform = "translateX(" + x + "px)";
                cur.style.transform = "translateX(" + (x - dir * w) + "px)";
            }, function () {
                cur.hidden = true;
                cur.style.position = cur.style.top = cur.style.left = cur.style.right = cur.style.transform = "";
                next.style.transform = "";
            });
        }
        el.addEventListener("pointerup", end);
        el.addEventListener("pointercancel", end);
    }

    // ---------- Remember open sections ----------
    function rememberSections() {
        var page = currentPage();
        document.querySelectorAll("details.section[id]").forEach(function (d) {
            var key = "open:" + page + ":" + d.id;
            var saved = store(key);
            if (saved === "1") d.open = true;
            if (saved === "0") d.open = false;
            d.addEventListener("toggle", function () { store(key, d.open ? "1" : "0"); });
        });
    }

    // ---------- Copy buttons for AI prompts ----------
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        return new Promise(function (resolve, reject) {
            var ta = document.createElement("textarea");
            ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
            document.body.removeChild(ta);
        });
    }
    window.copyText = copyText;
    function enhancePrompts() {
        document.querySelectorAll("details.prompt").forEach(function (d) {
            var pre = d.querySelector(".prompt__text");
            if (!pre || d.querySelector(".prompt__actions")) return;
            var wrap = document.createElement("div");
            wrap.className = "prompt__actions";
            var b = document.createElement("button");
            b.type = "button"; b.className = "btn btn--sm btn--primary"; b.textContent = "Copy prompt";
            b.addEventListener("click", function () {
                copyText(pre.textContent.trim()).then(function () { toast("Prompt copied"); haptic(); }, function () { toast("Couldn't copy. Select the text manually."); });
            });
            wrap.appendChild(b);
            var c = document.createElement("a");
            c.className = "btn btn--sm"; c.textContent = "Open in Coach";
            c.href = "coach.html?q=" + encodeURIComponent(pre.textContent.trim());
            wrap.appendChild(c);
            wrap.style.display = "flex"; wrap.style.gap = "8px";
            d.appendChild(wrap);
        });
    }

    function init() {
        if (currentPage() !== "index.html" && document.querySelector("main.page--narrow")) document.body.classList.add("is-narrow");
        buildShell();
        initTabsets();
        rememberSections();
        enhancePrompts();
        offerUndo();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
