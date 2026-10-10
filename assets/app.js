/* Speedrun OS · shared shell: theme, navigation, collapsibles, copy buttons, toast. */
(function () {
    var NAV = [
        { href: "index.html", icon: "🏠", label: "Home" },
        { href: "reboot.html", icon: "📆", label: "Plan" },
        { href: "drill.html", icon: "⚡", label: "Drill" },
        { href: "words.html", icon: "🔤", label: "Words" },
        { href: "anki.html", icon: "🗂️", label: "Anki" },
        { href: "archive.html", icon: "📑", label: "Essays" },
        { href: "performance.html", icon: "📊", label: "Audit" }
    ];

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
        } catch (e) { return null; }
    }
    window.SpeedrunStore = store;

    // ---------- Theme ----------
    var THEMES = ["auto", "light", "dark"];
    var THEME_ICON = { auto: "🌓", light: "☀️", dark: "🌙" };
    function applyTheme(t) {
        if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
        else document.documentElement.removeAttribute("data-theme");
    }
    var theme = store("theme") || "auto";
    applyTheme(theme);

    // ---------- Shell ----------
    function currentPage() {
        var file = location.pathname.split("/").pop() || "index.html";
        if (/^essay-/.test(file)) return "archive.html";
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
                '<a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true">B2</span><span>Speedrun OS</span></a>' +
                '<span class="appbar__spacer"></span>' +
                '<nav class="tabs" aria-label="Main">' + navLinks() + "</nav>" +
                '<button class="icon-btn" id="theme-toggle" type="button"></button>' +
            "</div>";

        var bottom = document.createElement("nav");
        bottom.className = "bottom-tabs";
        bottom.setAttribute("aria-label", "Main");
        bottom.innerHTML = navLinks();

        var toast = document.createElement("div");
        toast.className = "toast"; toast.id = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");

        document.body.insertBefore(header, document.body.firstChild);
        document.body.insertBefore(skip, document.body.firstChild);
        document.body.appendChild(bottom);
        document.body.appendChild(toast);

        var btn = document.getElementById("theme-toggle");
        function label() {
            btn.textContent = THEME_ICON[theme];
            btn.setAttribute("aria-label", "Theme: " + theme + ". Click to change.");
            btn.title = "Theme: " + theme;
        }
        label();
        btn.addEventListener("click", function () {
            theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
            store("theme", theme === "auto" ? null : theme);
            applyTheme(theme);
            label();
        });
    }

    // ---------- Toast ----------
    var toastTimer;
    window.toast = function (msg) {
        var el = document.getElementById("toast");
        if (!el) return;
        el.textContent = msg;
        el.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2200);
    };

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
                copyText(pre.textContent.trim()).then(function () { toast("Prompt copied"); }, function () { toast("Couldn't copy. Select the text manually."); });
            });
            wrap.appendChild(b);
            d.appendChild(wrap);
        });
    }

    function init() {
        buildShell();
        rememberSections();
        enhancePrompts();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
