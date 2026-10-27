/* Speedrun OS · Coach
   Chat with Claude from the browser (your own API key), streaming replies, with tools that read and
   update the data this site keeps in localStorage. */
import Anthropic from "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.133.0/+esm";

const store = window.SpeedrunStore;
const U = window.Units;
const PLAN = window.PLAN;
const $ = (id) => document.getElementById(id);

const KEY = "coach:key", CHAT = "coach:chat", PREFS = "coach:prefs";
const MODELS = {
    "claude-opus-5-5": { label: "Claude Opus 5.5", inP: 4, outP: 20 },
    "claude-sonnet-5-5": { label: "Claude Sonnet 5.5", inP: 2, outP: 10 },
    "claude-haiku-5-5": { label: "Claude Haiku 5.5", inP: 0.1, outP: 0.5 }
};
// Server-side refusal fallback ("default" routing) is accepted for these models on the Claude API
const FALLBACK_OK = { "claude-opus-5-5": true, "claude-sonnet-5-5": true };

function loadJSON(k, d) { try { return JSON.parse(store(k) || "null") ?? d; } catch (e) { return d; } }
let prefs = Object.assign({ model: "claude-opus-5-5", effort: "medium", speak: false, lang: "de-DE" }, loadJSON(PREFS, {}));
let messages = loadJSON(CHAT, []);       // full API history (append-only: thinking blocks must stay untouched)
let busy = false, current = null;
let spent = loadJSON("coach:spent", 0);

// ---------- Dates ----------
const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const today = () => iso(new Date());
const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0"); };
const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return iso(d); };

// ---------- System prompt (stable, cached) ----------
const SYSTEM = `You are the personal German exam coach inside "Speedrun OS", a study dashboard built by one student for himself.

## The student
- Native Spanish speaker, C2 English. German level around A2 to B1, improving quickly. Studying German full-time.
- Grammar comes easily to him; vocabulary is harder. Explain grammar as rules and compare with Spanish and English.
- Exam: internal university Erasmus German test, Thursday 6 November 2026 at 10:00. It is one placement exam that rates him anywhere from A1 to C1 depending on his score (not a B2 pass/fail), so every point counts. Format (confirmed by the university, no more detail given): Grammar, Reading and Listening. There is no writing and no speaking part, and he doesn't want speaking practice.
- His priorities, in his own words: listening is his weakest part, then reading. Push what raises those scores fastest: exam technique (questions first, paraphrases, traps after aber/eigentlich, numbers and negation), daily timed practice with post-mortems on the transcript, and the vocabulary that decides answers (frequent words, connectors). Grammar is his strongest part: keep the units and exam-style drills (multiple choice, gap fill, C-Test) going.
- Placement strategy: first secure every item up to his level (careless errors on A2-B1 items cost the most), then win items one level above. Practise at his level and one above, never two (material he understands at about 70%). B2 and C1 structures only need recognising, since nothing is written or spoken. When you make drills or texts, grade them from A2 to C1 and report the score per level, so his ceiling is visible.
- His current level per part is in get_status (level_test). The routine on the site is built around listening first, then reading.
- Pace: 2 grammar units a day plus 1 optional extra. Books: Grammatik aktiv A1-B1 (units written "A62") and Grammatik aktiv B2-C1 (units written "B14").

## How the site tracks progress (you can read and change it with tools)
- Each unit moves through: New, Repeat due (first pass done, repeat in 2 days), Check due (repeat done, check in 5 days), Solid. Under 60% makes it a Red flag (failure protocol: freeze the topic, diagnose form/position/choice errors, go to the easier A1-B1 sibling, drill minimal pairs, retry next day; failing twice parks it).
- Result bands: "hi" = 80% or more, "mid" = 60-79%, "lo" = under 60%.
- The day is a checklist of time blocks (call get_status to see them and which are ticked).
- Scores from mocks and practice parts are logged per part (Listening, Reading, Grammar / C-Test, Full mock).
- Anki cards he wants go into a queue that he syncs to Anki from the Anki page.

## Grounded optimism
- Never overestimate his level or what is possible by the exam. Give honest estimates as ranges, based on his results and the hours left; a realistic rule is about 200 focused hours per CEFR band around B1-B2.
- Never be defeatist either. While there is more than an hour of study time left, look for the actions that raise his score the most in that time and say exactly what to do.

## How to work
- Reply in Spanish by default, short and direct, like a coach who respects his time. Switch to German when you practise with him, and keep your German at his level plus a little.
- When he asks what to do, or at the start of a new conversation about his day, call get_status first and base the answer on it. Never invent his results or progress.
- When he reports a result ("A62 85%", "hice el mock de lectura, 14/25"), log it with the right tool straight away and tell him in one line what changed (status and next due date).
- Correct German like this: his sentence → the corrected sentence → the rule in a few words. Group repeated errors. Praise only what is actually good.
- Reading practice: write exam-style texts (about 350 words, at his level or one above) with richtig / falsch / nicht im Text and multiple-choice questions, paraphrases in the right options and word-matching traps in the wrong ones. Wait for his answers, then quote the sentence that holds each answer he missed.
- Listening: you can't play audio, so work on the transcripts he pastes (where each answer was and why he missed it) and point him to real audio (Goethe B1/B2 model tests, DW Langsam gesprochene Nachrichten, Top-Thema, Easy German).
- Grammar drills: exam-style items, his answers first, then the score and every mistake with the rule. If his message starts with [voice], it was dictated, so ignore small transcription glitches.
- Add Anki cards only for words he did not know or asked for, with article and plural for nouns and one example sentence.
- Use plain text with light Markdown (bold, short lists). No tables unless he asks.`;

// ---------- Tools ----------
const STATUSES = ["todo", "first", "repeat", "solid", "red", "parked"];
const PARTS = ["Listening", "Reading", "Grammar / C-Test", "Full mock"];
const BLOCK_TIMES = PLAN.blocks.map((b) => b[0]);
const tool = (name, description, properties, required) => ({
    name, description, eager_input_streaming: true,
    input_schema: { type: "object", properties, required, additionalProperties: false }
});
const TOOLS = [
    tool("get_status", "Read the student's current state: date and time, days to the exam, today's plan and ticked blocks, today's grammar units (due repeats, new, extra), the unit queue with statuses, recent scores, Anki queue size and known words. Call this before giving advice about his day or progress.", {}, []),
    tool("log_unit_result", "Log the result of working on a grammar unit (first pass, repeat, check or retry, depending on its current status). This schedules the next step.", {
        unit: { type: "string", description: "Unit id: A or B plus number, e.g. A62 (A1-B1 book) or B14 (B2-C1 book)" },
        result: { type: "string", enum: ["hi", "mid", "lo"], description: "hi = 80% or more, mid = 60-79%, lo = under 60%" }
    }, ["unit", "result"]),
    tool("set_unit_status", "Set a unit's status directly, e.g. to correct a mistake or add a unit to the queue. Adds the unit to his queue if it is not there yet.", {
        unit: { type: "string", description: "Unit id, e.g. A62 or B14" },
        status: { type: "string", enum: STATUSES, description: "todo = new, first = repeat due, repeat = check due, solid, red = red flag, parked" }
    }, ["unit", "status"]),
    tool("check_block", "Tick or untick a block of the daily plan.", {
        date: { type: "string", description: "YYYY-MM-DD; use today's date unless he names another day" },
        block: { type: "string", enum: BLOCK_TIMES, description: "Block start time, e.g. 0900 for the morning grammar block" },
        done: { type: "boolean" }
    }, ["date", "block", "done"]),
    tool("log_score", "Log a practice or mock score as a percentage.", {
        part: { type: "string", enum: PARTS },
        score: { type: "integer", minimum: 0, maximum: 100, description: "Percentage 0-100" },
        note: { type: "string", description: "Short note, can be empty" },
        date: { type: "string", description: "YYYY-MM-DD; today unless he says otherwise" }
    }, ["part", "score", "note", "date"]),
    tool("add_anki_cards", "Queue Anki cards for words he wants to learn. He syncs the queue to Anki from the Anki page.", {
        cards: {
            type: "array", minItems: 1, maxItems: 30,
            items: {
                type: "object", additionalProperties: false,
                required: ["german", "article", "plural", "meaning", "example"],
                properties: {
                    german: { type: "string", description: "Word or phrase without the article" },
                    article: { type: "string", enum: ["", "der", "die", "das"] },
                    plural: { type: "string", description: "Plural without article, or empty" },
                    meaning: { type: "string", description: "Spanish and English meaning, e.g. 'solución / solution'" },
                    example: { type: "string", description: "One natural example sentence in German" }
                }
            }
        }
    }, ["cards"])
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isUnit = (s) => typeof s === "string" && /^[AB]\d{1,2}$/.test(s.trim().toUpperCase());

function status() {
    const t = today(), day = PLAN.days.find((d) => d[0] === t);
    const checks = loadJSON("home:checks:" + t, {});
    const now = hhmm();
    let currentBlock = null;
    PLAN.blocks.forEach((b) => { if (b[0] <= now) currentBlock = b[0]; });
    const st = U.loadState(), q = U.loadQueue(), ag = q.length ? U.agenda() : null;
    const unit = (id) => ({ id, title: U.UNITS[id] || "", status: U.stateOf(st, id).s, due: U.stateOf(st, id).due || null });
    const counts = {};
    q.forEach((id) => { const s = U.stateOf(st, id).s; counts[s] = (counts[s] || 0) + 1; });
    const log = loadJSON("perf:log", []);
    const days = Math.round((new Date(PLAN.examStart + "T12:00:00") - new Date(t + "T12:00:00")) / 86400000);
    return {
        now: new Date().toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }),
        today: t,
        exam: PLAN.examStart + " " + (PLAN.examTime || "10:00"), days_to_exam: days,
        plan_today: day ? { phase: PLAN.phases[day[1]], kind: day[2] || null, task: day[3].replace(/<[^>]+>/g, "") } : null,
        blocks_today: PLAN.blocks.map((b) => ({ time: b[0], title: b[2], done: !!checks[b[0]], current: b[0] === currentBlock })),
        grammar_today: ag ? { due: ag.due.map(unit), new: ag.fresh.map(unit), extra: ag.extra.map(unit), logged_today: ag.doneToday.map(unit) } : "no unit queue yet: he should take the level test (test.html)",
        queue: { total: q.length, by_status: counts, red_flags: q.filter((id) => U.stateOf(st, id).s === "red").map(unit) },
        recent_scores: log.slice(-10),
        level_test: (function () { const p = loadJSON("level:profile", null); return p ? { date: p.date, overall: p.overall, skills: Object.fromEntries(Object.entries(p.skills).map(([k, v]) => [k, v.level + (v.pct != null ? " (" + v.pct + "%)" : "")])), weakest: p.weakest, writing_feedback: p.writing ? p.writing.summary : null } : "not taken yet (test.html)"; })(),
        anki_queue: loadJSON("anki:queue", []).length,
        known_words: loadJSON("words:known", []).length
    };
}

function runTool(name, input) {
    const i = input || {};
    switch (name) {
        case "get_status":
            return status();
        case "log_unit_result": {
            if (!isUnit(i.unit) || !["hi", "mid", "lo"].includes(i.result)) throw new Error("unit must look like A62 or B14 and result must be hi, mid or lo");
            const id = i.unit.trim().toUpperCase();
            const q = U.loadQueue();
            if (q.indexOf(id) === -1) { q.unshift(id); U.saveQueue(q); }
            const r = U.logResult(id, i.result);
            return { unit: id, title: U.UNITS[id] || null, new_status: r.s, next_due: r.due || null };
        }
        case "set_unit_status": {
            if (!isUnit(i.unit) || !STATUSES.includes(i.status)) throw new Error("invalid unit or status");
            const id = i.unit.trim().toUpperCase(), t = today(), st = U.loadState();
            if (i.status === "todo") delete st[id];
            else st[id] = { first: { s: "first", due: t }, repeat: { s: "repeat", due: addDays(t, 3) }, solid: { s: "solid", on: t }, red: { s: "red", due: t, tries: 1 }, parked: { s: "parked", tries: 2 } }[i.status];
            U.saveState(st);
            U.rerank();
            const q = U.loadQueue();
            if (q.indexOf(id) === -1) { q.unshift(id); U.saveQueue(q); }
            return { unit: id, status: i.status };
        }
        case "check_block": {
            if (!isDate(i.date) || !BLOCK_TIMES.includes(i.block) || typeof i.done !== "boolean") throw new Error("invalid date, block or done");
            const k = "home:checks:" + i.date, c = loadJSON(k, {});
            if (i.done) c[i.block] = 1; else delete c[i.block];
            store(k, JSON.stringify(c));
            const done = loadJSON("reboot-done-v1", {});
            if (PLAN.blocks.every((b) => c[b[0]])) done[i.date] = true; else delete done[i.date];
            store("reboot-done-v1", JSON.stringify(done));
            return { date: i.date, block: i.block, done: i.done, blocks_done: Object.keys(c).length + "/" + PLAN.blocks.length };
        }
        case "log_score": {
            if (!PARTS.includes(i.part) || !Number.isInteger(i.score) || i.score < 0 || i.score > 100 || !isDate(i.date)) throw new Error("invalid part, score or date");
            const log = loadJSON("perf:log", []);
            log.push({ date: i.date, part: i.part, score: i.score, note: String(i.note || "").slice(0, 200) });
            store("perf:log", JSON.stringify(log));
            return { logged: true, entries: log.length };
        }
        case "add_anki_cards": {
            if (!Array.isArray(i.cards) || !i.cards.length) throw new Error("cards must be a non-empty array");
            const prev = loadJSON("anki:queue", []);
            const deck = store("anki:deck") || "German B2 Speedrun", model = store("anki:model") || "Basic (and reversed card)";
            const add = i.cards.filter((c) => c && c.german && c.meaning).map((c) => {
                let front = (["der", "die", "das"].includes(c.article) ? c.article + " " : "") + c.german;
                if (c.plural) front += " · die " + c.plural;
                let back = esc(c.meaning);
                if (c.example) back += "<br><br><i>" + esc(c.example) + "</i>";
                return { front: esc(front), back, deck, model, tags: ["speedrun", "coach"], created: Date.now() };
            });
            store("anki:queue", JSON.stringify(prev.concat(add)));
            return { queued: add.length, queue_size: prev.length + add.length };
        }
    }
    throw new Error("unknown tool " + name);
}

// What a tool call did, in a few words, for the chat
function describe(name, input, result) {
    if (result && result.error) return "Couldn't " + name.replace(/_/g, " ") + ": " + result.error;
    switch (name) {
        case "get_status": return "Read your progress";
        case "log_unit_result": return "Logged " + U.label(result.unit) + " · " + ({ first: "repeat due", repeat: "check due", solid: "solid", red: "red flag", parked: "parked" }[result.new_status] || result.new_status) + (result.next_due ? " " + result.next_due.slice(5) : "");
        case "set_unit_status": return U.label(result.unit) + " set to " + result.status;
        case "check_block": return (input.done ? "Ticked " : "Unticked ") + input.block.slice(0, 2) + ":" + input.block.slice(2) + " block";
        case "log_score": return "Logged " + input.part + " " + input.score + "%";
        case "add_anki_cards": return result.queued + " Anki card" + (result.queued === 1 ? "" : "s") + " queued";
    }
    return name;
}

// ---------- Rendering ----------
function md(text) {
    const lines = esc(text).split("\n");
    let html = "", list = null;
    const inline = (s) => s
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<i>$2</i>")
        .replace(/→/g, "<span class=\"arrow\">→</span>");
    const close = () => { if (list) { html += "</" + list + ">"; list = null; } };
    lines.forEach((l) => {
        let m;
        if ((m = l.match(/^\s*[-*•]\s+(.*)$/))) { if (list !== "ul") { close(); html += "<ul>"; list = "ul"; } html += "<li>" + inline(m[1]) + "</li>"; }
        else if ((m = l.match(/^\s*\d+[.)]\s+(.*)$/))) { if (list !== "ol") { close(); html += "<ol>"; list = "ol"; } html += "<li>" + inline(m[1]) + "</li>"; }
        else if ((m = l.match(/^#{1,4}\s+(.*)$/))) { close(); html += "<h4>" + inline(m[1]) + "</h4>"; }
        else if (!l.trim()) { close(); }
        else { close(); html += "<p>" + inline(l) + "</p>"; }
    });
    close();
    return html;
}

const log = () => $("log");
function bubble(role, html, cls) {
    const el = document.createElement("div");
    el.className = "msg msg--" + role + (cls ? " " + cls : "");
    el.innerHTML = html;
    log().appendChild(el);
    return el;
}
function scrollDown() { window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }); }

const CONTEXT_RE = /^\[(?:voice|now:[^\]]*)\][^\n]*\n?/i;
function renderHistory() {
    log().innerHTML = "";
    const results = {};
    messages.forEach((m) => {
        if (m.role === "user" && Array.isArray(m.content)) m.content.forEach((b) => { if (b.type === "tool_result") results[b.tool_use_id] = b; });
    });
    messages.forEach((m) => {
        if (m.role === "user") {
            const txt = typeof m.content === "string" ? m.content : m.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
            const clean = txt.replace(/^\[now:[^\]]*\]\s*/i, "").replace(/^\[voice\]\s*/i, "");
            if (clean.trim()) bubble("user", esc(clean).replace(/\n/g, "<br>"));
        } else if (Array.isArray(m.content)) {
            m.content.forEach((b) => {
                if (b.type === "text" && b.text.trim()) bubble("ai", md(b.text));
                if (b.type === "tool_use") {
                    const r = results[b.id];
                    let parsed = null;
                    try { parsed = r && JSON.parse(typeof r.content === "string" ? r.content : r.content[0].text); } catch (e) {}
                    bubble("tool", esc(describe(b.name, b.input, r && r.is_error ? { error: "failed" } : parsed || {})));
                }
            });
        }
    });
    $("empty").hidden = messages.length > 0;
}

// ---------- Conversation ----------
function saveChat() { store(CHAT, JSON.stringify(messages)); }
function client() {
    const key = store(KEY);
    if (!key) return null;
    return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2 });
}

async function send(text, voice) {
    if (busy || !text.trim()) return;
    const c = client();
    if (!c) { showSetup(true); return; }
    busy = true; setBusy(true);
    const stamp = "[now: " + new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "]";
    messages.push({ role: "user", content: stamp + "\n" + (voice ? "[voice] " : "") + text.trim() });
    saveChat();
    $("empty").hidden = true;
    bubble("user", esc(text.trim()).replace(/\n/g, "<br>"));
    scrollDown();

    let turnText = "";
    try {
        for (let round = 0; round < 8; round++) {
            const out = bubble("ai", '<span class="typing">Thinking</span>', "is-streaming");
            let shown = "";
            const params = {
                model: prefs.model,
                max_tokens: 16000,
                system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
                tools: TOOLS,
                messages,
                cache_control: { type: "ephemeral" },
                output_config: { effort: prefs.effort }
            };
            if (FALLBACK_OK[prefs.model]) { params.betas = ["server-side-fallback-2026-07-01"]; params.fallbacks = "default"; }
            const stream = c.beta.messages.stream(params);
            current = stream;
            stream.on("text", (delta) => {
                shown += delta;
                out.innerHTML = md(shown);
                scrollDown();
            });
            const msg = await stream.finalMessage();
            current = null;
            if (!shown.trim()) out.remove(); else out.classList.remove("is-streaming");
            turnText += shown;
            track(msg.usage);

            if (msg.stop_reason === "refusal") {
                messages.push({ role: "assistant", content: msg.content }); saveChat();
                bubble("note", "Claude declined to answer this. Try rephrasing the request.");
                break;
            }
            const uses = msg.content.filter((b) => b.type === "tool_use");
            if (msg.stop_reason === "max_tokens" && uses.length) {
                bubble("note", "The answer was cut off before a tool call finished. Ask again.");
                break; // don't run a truncated tool call; nothing is appended
            }
            messages.push({ role: "assistant", content: msg.content });
            saveChat();
            if (msg.stop_reason === "pause_turn") continue;
            if (!uses.length) break;

            const results = uses.map((u) => {
                let res, isErr = false;
                try { res = runTool(u.name, u.input); } catch (e) { res = { error: e.message }; isErr = true; }
                bubble("tool", esc(describe(u.name, u.input, res)));
                const r = { type: "tool_result", tool_use_id: u.id, content: JSON.stringify(res) };
                if (isErr) r.is_error = true;
                return r;
            });
            messages.push({ role: "user", content: results });
            saveChat();
            window.haptic && window.haptic();
            scrollDown();
        }
        if (prefs.speak && turnText) speak(turnText);
    } catch (err) {
        current = null;
        document.querySelectorAll(".msg.is-streaming").forEach((e) => e.remove());
        if (err instanceof Anthropic.APIUserAbortError) bubble("note", "Stopped.");
        else if (err instanceof Anthropic.AuthenticationError) { bubble("note", "The API key was rejected. Check it in Settings."); showSetup(true); }
        else if (err instanceof Anthropic.PermissionDeniedError) bubble("note", "This key can't use " + MODELS[prefs.model].label + ". Pick another model in Settings.");
        else if (err instanceof Anthropic.RateLimitError) bubble("note", "Rate limit reached. Wait a minute and try again.");
        else if (err instanceof Anthropic.BadRequestError) bubble("note", "The request was rejected: " + esc(err.message).slice(0, 200));
        else if (err instanceof Anthropic.APIError) bubble("note", "Claude's servers returned an error (" + err.status + "). Try again in a moment.");
        else if (err instanceof Anthropic.APIConnectionError) bubble("note", "Couldn't reach Claude. Check your connection and try again.");
        else bubble("note", "Claude's reply came back incomplete. Send your message again.");
    } finally {
        busy = false; setBusy(false);
        scrollDown();
    }
}

function track(u) {
    if (!u) return;
    const m = MODELS[prefs.model];
    const cost = ((u.input_tokens || 0) * m.inP + (u.cache_creation_input_tokens || 0) * m.inP * 1.25 + (u.cache_read_input_tokens || 0) * m.inP * 0.1 + (u.output_tokens || 0) * m.outP) / 1e6;
    spent += cost;
    store("coach:spent", JSON.stringify(spent));
    $("spent").textContent = "≈ $" + spent.toFixed(2) + " spent";
}

function setBusy(b) {
    $("send").hidden = b;
    $("stop").hidden = !b;
    $("input").disabled = false;
}

// ---------- Voice ----------
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, listening = false, dictated = false;
function setupMic() {
    if (!Rec) { $("mic").hidden = true; return; }
    $("mic").addEventListener("click", () => {
        if (listening) { rec.stop(); return; }
        rec = new Rec();
        rec.lang = prefs.lang; rec.interimResults = true; rec.continuous = false;
        const base = $("input").value ? $("input").value + " " : "";
        rec.onresult = (e) => {
            let s = "";
            for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
            $("input").value = base + s; autosize();
        };
        rec.onstart = () => { listening = true; dictated = true; $("mic").classList.add("is-on"); $("mic").setAttribute("aria-pressed", "true"); };
        rec.onend = () => {
            listening = false; $("mic").classList.remove("is-on"); $("mic").setAttribute("aria-pressed", "false");
            if (prefs.speak && $("input").value.trim()) submit(); // hands-free: speak, it sends, it answers aloud
        };
        rec.onerror = (e) => { if (e.error === "not-allowed") toast("Allow microphone access to dictate."); };
        rec.start();
    });
}
function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const plain = text.replace(/[*_`#>]/g, "").replace(/→/g, ",");
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = prefs.lang;
    const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith(prefs.lang.slice(0, 2).toLowerCase()));
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}

// ---------- UI ----------
function autosize() { const t = $("input"); t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 180) + "px"; }
function submit() {
    const v = $("input").value;
    if (!v.trim() || busy) return;
    $("input").value = ""; autosize();
    send(v, dictated);
    dictated = false;
}
function showSetup(open) {
    const hasKey = !!store(KEY);
    $("setup").hidden = hasKey && !open;
    $("chat-ui").hidden = !hasKey;
    $("composer-wrap").hidden = !hasKey;
    if (open) $("setup").scrollIntoView({ block: "start" });
}

function init() {
    // Settings
    $("model").innerHTML = Object.keys(MODELS).map((k) => '<option value="' + k + '">' + MODELS[k].label + "</option>").join("");
    $("model").value = prefs.model;
    $("effort").value = prefs.effort;
    $("speak").checked = !!prefs.speak;
    $("lang").value = prefs.lang;
    const savePrefs = () => { store(PREFS, JSON.stringify(prefs)); };
    $("model").addEventListener("change", (e) => { prefs.model = e.target.value; savePrefs(); toast("Next replies use " + MODELS[prefs.model].label); });
    $("effort").addEventListener("change", (e) => { prefs.effort = e.target.value; savePrefs(); });
    $("speak").addEventListener("change", (e) => { prefs.speak = e.target.checked; savePrefs(); });
    $("lang").addEventListener("change", (e) => { prefs.lang = e.target.value; savePrefs(); });
    $("spent").textContent = "≈ $" + spent.toFixed(2) + " spent";

    $("key-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const k = $("key").value.trim();
        if (!/^sk-ant-/.test(k)) { $("key-error").textContent = "That doesn't look like an Anthropic API key (it starts with sk-ant-)."; return; }
        store(KEY, k); $("key").value = ""; $("key-error").textContent = "";
        showSetup(false); toast("Key saved in this browser"); $("input").focus();
    });
    $("forget-key").addEventListener("click", () => { store(KEY, null); showSetup(true); toast("Key removed from this browser"); });
    $("open-setup").addEventListener("click", () => { $("settings").open = true; showSetup(true); });

    $("new-chat").addEventListener("click", () => {
        if (!messages.length) return;
        const old = messages;
        messages = []; saveChat(); renderHistory();
        toast("New conversation", { label: "Undo", run: () => { messages = old; saveChat(); renderHistory(); } });
    });

    $("composer").addEventListener("submit", (e) => { e.preventDefault(); submit(); });
    $("input").addEventListener("input", autosize);
    $("input").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); } });
    $("stop").addEventListener("click", () => { if (current) current.abort(); speechSynthesis && speechSynthesis.cancel(); });
    document.querySelectorAll("[data-suggest]").forEach((b) => b.addEventListener("click", () => {
        $("input").value = b.dataset.suggest; autosize();
        if (b.dataset.send === "1") submit(); else $("input").focus();
    }));
    setupMic();

    // Prefill from "Open in Coach" links
    const q = new URLSearchParams(location.search).get("q");
    if (q) { $("input").value = q; autosize(); history.replaceState(null, "", location.pathname); }

    showSetup(false);
    renderHistory();
    scrollDown();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
