/* Speedrun OS · Grammatik aktiv units, diagnostic test, recommendation math and unit progress.
   Book A = Grammatik aktiv A1–B1 · Book B = Grammatik aktiv B2–C1 */
(function () {
    var store = window.SpeedrunStore || function () { return null; };

    // ---------- Topics: exam weight (1–3) + the units that train them ----------
    var TOPICS = {
        t1:  { name: "Word order (V2, verb bracket)", w: 3,   units: ["A12", "A13", "A45", "B1", "B4", "B6"] },
        t2:  { name: "Subordinate clauses & connectors", w: 3, units: ["A46", "A77", "A78", "A80", "B2", "B62", "B63", "B65", "B73"] },
        t3:  { name: "Accusative & dative", w: 3,           units: ["A17", "A18", "A21", "A22", "A23", "B3", "B31"] },
        t4:  { name: "Prepositions", w: 2,                   units: ["A33", "A34", "A35", "A36", "A37", "A38", "A39", "B20", "B21", "B23"] },
        t5:  { name: "Perfekt", w: 3,                        units: ["A26", "A27", "A28", "A30", "B36", "B37"] },
        t6:  { name: "Präteritum & Plusquamperfekt", w: 1.5, units: ["A25", "A29", "A54", "A55", "B38"] },
        t7:  { name: "Verbs with prepositions, da-/wo-", w: 2, units: ["A58", "A59", "B33", "B34", "B35", "B80"] },
        t8:  { name: "Adjective endings", w: 2,              units: ["A40", "A41", "A84", "A85", "B55", "B56"] },
        t9:  { name: "Comparison (je … desto)", w: 1,        units: ["A42", "A43", "A81", "B57"] },
        t10: { name: "Konjunktiv II", w: 2.5,                units: ["A60", "A61", "B9", "B10", "B11", "B12"] },
        t11: { name: "Passive & werden", w: 2,               units: ["A62", "A63", "A64", "A65", "B14", "B15", "B16"] },
        t12: { name: "Relative clauses", w: 2.5,             units: ["A75", "A76", "B70", "B71", "B72"] },
        t13: { name: "Infinitive with zu, um … zu", w: 2,    units: ["A73", "A74", "A79", "B67", "B68", "B69"] },
        t14: { name: "Separable & reflexive verbs", w: 1.5,  units: ["A8", "A31", "A56", "A57", "B45"] },
        t15: { name: "Genitive & n-declension", w: 1,        units: ["A68", "A69", "A82", "B49", "B50"] }
    };

    // ---------- Unit catalog (only units used by the topics) ----------
    var UNITS = {
        A8: "Trennbare Verben", A12: "Position 2 im Satz", A13: "Zwei feste Positionen im Satz",
        A17: "Akkusativ", A18: "Dativ", A21: "Personalpronomen: Akkusativ und Dativ", A22: "Verben mit Akkusativ und Dativ", A23: "Verben mit Dativ",
        A25: "Präteritum: sein und haben", A26: "Perfekt mit haben", A27: "Perfekt mit sein", A28: "Partizip Perfekt", A29: "Präteritum: Modalverben", A30: "Zeitengebrauch", A31: "Reflexive Verben",
        A33: "Präpositionen mit Dativ", A34: "Präpositionen mit Akkusativ", A35: "Wechselpräpositionen mit Dativ", A36: "Wechselpräpositionen mit Dativ und Akkusativ",
        A37: "Lokale Präpositionen: Wohin?", A38: "Lokale Präpositionen: Wo?", A39: "Lokale Präpositionen: Woher?",
        A40: "Adjektive: Nominativ und Akkusativ", A41: "Adjektive: Nom., Akk. und Dativ", A42: "Komparativ und Vergleichssätze", A43: "Superlativ",
        A45: "Hauptsätze verbinden (Position 1)", A46: "Nebensätze mit weil, wenn, dass",
        A54: "Präteritum", A55: "Plusquamperfekt", A56: "Reflexivpronomen im Akk. und Dativ", A57: "Trennbare und untrennbare Verben", A58: "Verben mit Präpositionen", A59: "Präpositionaladverbien und -pronomen",
        A60: "Konjunktiv 2: Formen", A61: "Konjunktiv 2: Gebrauch", A62: "Passiv", A63: "Passiv in der Vergangenheit", A64: "Futur 1", A65: "Funktionen von werden",
        A68: "Genitiv", A69: "n-Deklination", A73: "Infinitiv mit zu", A74: "Infinitiv ohne zu", A75: "Relativsätze 1", A76: "Relativsätze 2",
        A77: "Temporale Nebensätze mit wenn und als", A78: "Temporale Nebensätze (bevor, nachdem…)", A79: "Finalsätze (um … zu, damit)", A80: "Doppelkonnektoren", A81: "Vergleichssätze (je … desto)",
        A82: "Präpositionen mit Genitiv", A84: "Adjektivdeklination mit und ohne Artikel", A85: "Partizip 1 als Adjektiv",
        B1: "Verbposition in einfachen Sätzen", B2: "Verbposition in Satzverbindungen", B3: "Position von Dativ- und Akkusativobjekt", B4: "Position der Angaben im Satz", B6: "Position von nicht",
        B9: "Konjunktiv 2 der Gegenwart: Formen", B10: "Konjunktiv 2 der Vergangenheit", B11: "Höflichkeit, Vorschläge, Ratschläge", B12: "Wünsche und irreale Bedingungen",
        B14: "Passiv in allen Zeiten", B15: "Passiv mit Modalverben", B16: "Alternativen zum Passiv",
        B20: "Wechselpräpositionen", B21: "Oft gebrauchte lokale Präpositionen", B23: "Die wichtigsten temporalen Präpositionen",
        B31: "Verben mit Nom., Akk. und Dativ", B33: "Verben, Nomen, Adjektive mit Präpositionen", B34: "Feste Präpositionen mit Akkusativ", B35: "Feste Präpositionen mit Dativ",
        B36: "Bildung der Vergangenheitszeiten", B37: "Besondere Perfektformen", B38: "Gebrauch der Vergangenheitszeiten",
        B45: "Trennbare und untrennbare Verben 1", B49: "Genitiv", B50: "n-Deklination", B55: "Adjektivdeklination", B56: "Artikelwörter und Adjektivdeklination", B57: "Komparation",
        B62: "Temporale Nebensätze", B63: "Kausale und konzessive Nebensätze", B65: "Konditionale und adversative Nebensätze",
        B67: "Infinitiv mit und ohne zu", B68: "Nebensatz mit dass und Infinitiv mit zu", B69: "Finale und modale Infinitiv-/Nebensätze",
        B70: "Relativpronomen im Nom., Akk. und Dativ", B71: "Relativpronomen im Genitiv", B72: "Relativpronomen mit w- und als",
        B73: "Doppelkonnektoren", B80: "Wörter mit da-"
    };
    // Hours for a first pass (2-page unit ≈ 0.75 h in book A, ≈ 1 h in book B; 4-page units longer)
    var LONG = { B14: 1.5, B15: 1.5, B16: 1.5, B34: 1.5, B49: 1.5 };
    function hours(id) { return LONG[id] || (id[0] === "A" ? 0.75 : 1); }

    // Units already done in book A (before the test)
    var DONE_BEFORE = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A10", "A11", "A12", "A13", "A25", "A27", "A32", "A33", "A34", "A35", "A36",
        "A40", "A41", "A44", "A45", "A46", "A73", "A75", "A76", "A79", "A84"];

    // ---------- 30 questions, 2 per topic ----------
    var QUESTIONS = [
        { t: "t1", q: "Which sentence is correct?", o: ["Morgen ich fahre nach Berlin.", "Morgen fahre ich nach Berlin.", "Morgen nach Berlin ich fahre."], a: 1 },
        { t: "t1", q: "Which sentence is correct?", o: ["Ich will gehen heute Abend ins Kino.", "Ich heute Abend will ins Kino gehen.", "Ich will heute Abend ins Kino gehen."], a: 2 },
        { t: "t2", q: "Ich lerne Deutsch, weil ich in Deutschland ___.", o: ["möchte studieren", "studieren möchte", "studiere möchte"], a: 1 },
        { t: "t2", q: "Which sentence is correct?", o: ["Wenn ich ein Kind war, wohnte ich in Madrid.", "Als ich war ein Kind, wohnte ich in Madrid.", "Als ich ein Kind war, wohnte ich in Madrid."], a: 2 },
        { t: "t3", q: "Ich gebe ___ Mann das Buch.", o: ["den", "dem", "der"], a: 1 },
        { t: "t3", q: "Kannst du ___ bitte helfen?", o: ["mich", "mir", "ich"], a: 1 },
        { t: "t4", q: "Seit ___ Jahr lerne ich Deutsch.", o: ["ein", "einen", "einem"], a: 2 },
        { t: "t4", q: "Ich lege das Handy auf ___ Tisch.", o: ["dem", "den", "der"], a: 1 },
        { t: "t5", q: "Gestern ___ ich sehr früh nach Hause gegangen.", o: ["habe", "bin", "war"], a: 1 },
        { t: "t5", q: "Ich habe das Problem endlich ___.", o: ["geverstanden", "verstehen", "verstanden"], a: 2 },
        { t: "t6", q: "Als Kind ___ ich nicht schwimmen.", o: ["konnte", "kannte", "könnte"], a: 0 },
        { t: "t6", q: "Nachdem er gegessen ___, ging er schlafen.", o: ["hat", "hatte", "ist"], a: 1 },
        { t: "t7", q: "Ich freue mich schon ___ die Ferien nächsten Monat.", o: ["über", "auf", "für"], a: 1 },
        { t: "t7", q: "Denkst du an die Prüfung? – Ja, ich denke oft ___.", o: ["an sie", "darauf", "daran"], a: 2 },
        { t: "t8", q: "Ich habe einen ___ Laptop gekauft.", o: ["neue", "neuen", "neuer"], a: 1 },
        { t: "t8", q: "Am Wochenende gehe ich mit ___ ins Kino.", o: ["meinen guten Freunden", "meine guten Freunde", "meinen gute Freunden"], a: 0 },
        { t: "t9", q: "Berlin ist ___ als Madrid.", o: ["mehr groß", "größer", "am größten"], a: 1 },
        { t: "t9", q: "Je mehr ich lerne, ___.", o: ["desto besser ich verstehe", "desto besser verstehe ich", "desto gut verstehe ich"], a: 1 },
        { t: "t10", q: "Wenn ich mehr Zeit ___, würde ich mehr reisen.", o: ["habe", "hatte", "hätte"], a: 2 },
        { t: "t10", q: "Wenn ich das gewusst ___, wäre ich gekommen.", o: ["hätte", "habe", "wäre"], a: 0 },
        { t: "t11", q: "Das Haus ___ 1990 gebaut.", o: ["hat", "wurde", "ist geworden"], a: 1 },
        { t: "t11", q: "Die Aufgabe muss heute noch ___.", o: ["werden gemacht", "gemacht wird", "gemacht werden"], a: 2 },
        { t: "t12", q: "Das ist der Mann, ___ ich gestern gesehen habe.", o: ["der", "den", "dem"], a: 1 },
        { t: "t12", q: "Die Frau, mit ___ ich gesprochen habe, ist Lehrerin.", o: ["die", "der", "dem"], a: 1 },
        { t: "t13", q: "Ich habe heute keine Lust, ___.", o: ["zu arbeiten", "arbeiten", "arbeiten zu"], a: 0 },
        { t: "t13", q: "Ich lerne Deutsch, ___ in Deutschland zu studieren.", o: ["damit", "um", "dass"], a: 1 },
        { t: "t14", q: "Wann ___ der Zug in München ___?", o: ["ankommt … (nothing)", "kommt … an", "kommt … ankommen"], a: 1 },
        { t: "t14", q: "Wir müssen ___ beeilen, der Bus fährt gleich.", o: ["uns", "unser", "sich"], a: 0 },
        { t: "t15", q: "Das ist das Auto ___ Vaters.", o: ["meinem", "mein", "meines"], a: 2 },
        { t: "t15", q: "Ich habe gestern mit ___ gesprochen.", o: ["dem Student", "dem Studenten", "den Student"], a: 1 },
        // Harder items (B1 and B2) for the full level test
        { t: "t12", l: "B2", q: "Der Mann, ___ Auto gestohlen wurde, ist mein Nachbar.", o: ["dessen", "deren", "dem"], a: 0 },
        { t: "t10", l: "B2", q: "An deiner Stelle ___ ich früher losgefahren.", o: ["hätte", "wäre", "würde"], a: 1 },
        { t: "t11", l: "B2", q: "Das Problem ließ sich leicht ___.", o: ["gelöst", "zu lösen", "lösen"], a: 2 },
        { t: "t15", l: "B2", q: "___ des schlechten Wetters sind wir spazieren gegangen.", o: ["Obwohl", "Trotz", "Wegen"], a: 1 },
        { t: "t2",  l: "B2", q: "Ich habe viel gelernt, ___ habe ich die Prüfung nicht bestanden.", o: ["trotzdem", "obwohl", "weil"], a: 0 },
        { t: "t2",  l: "B1", q: "Bevor du gehst, ___ die Fenster schließen.", o: ["du musst", "musst du", "musst"], a: 1 },
        { t: "t13", l: "B2", q: "Er ist gegangen, ohne ein Wort ___.", o: ["sagen", "gesagt", "zu sagen"], a: 2 },
        { t: "t11", l: "B2", q: "Der Brief ist schon gestern ___ worden.", o: ["geschrieben", "schreiben", "geworden"], a: 0 },
        { t: "t7",  l: "B2", q: "Es kommt ___ an, wie viel Zeit wir haben.", o: ["daran", "darauf", "davon"], a: 1 },
        { t: "t8",  l: "B2", q: "Mit ___ Grüßen, Anna", o: ["freundliche", "freundlichem", "freundlichen"], a: 2 },
        { t: "t6",  l: "B2", q: "Er sagte, er ___ krank und komme heute nicht.", o: ["sei", "seid", "sein"], a: 0 },
        { t: "t9",  l: "B2", q: "Das ist das ___ Buch, das ich je gelesen habe.", o: ["interessanter", "interessanteste", "interessantesten"], a: 1 },
        { t: "t3",  l: "B2", q: "Das Buch? Gibst du ___ bitte?", o: ["mir es", "es mir", "mich es"], a: 1 },
        { t: "t14", l: "B1", q: "Ich wasche ___ vor dem Essen die Hände.", o: ["mich", "mir", "sich"], a: 1 },
        { t: "t5",  l: "B2", q: "Leider habe ich gestern nicht kommen ___.", o: ["gekonnt", "konnte", "können"], a: 2 }
    ];
    // CEFR level of the first 30 items, in order
    var CORE_LEVELS = ["A2", "A2", "A2", "B1", "A2", "A2", "A2", "B1", "A2", "B1", "A2", "B1", "B1", "B1", "A2",
        "B1", "A2", "B1", "B1", "B2", "B1", "B2", "B1", "B1", "A2", "B1", "A2", "A2", "B1", "B1"];
    QUESTIONS.forEach(function (q, i) { if (!q.l) q.l = CORE_LEVELS[i]; });

    // What kind of mistake each wrong option reveals (null marks the correct option)
    var ERR = [["vpos", null, "vpos"], ["vpos", "vpos", null], ["vpos", null, "form"], ["conn", "vpos", null], ["case", null, "end"], ["case", null, "case"], ["case", "case", null], ["case", null, "end"], ["part", null, "tense"], ["part", "form", null], [null, "form", "tense"], ["tense", null, "part"], ["prep", null, "prep"], ["prep", "prep", null], ["end", null, "end"], [null, "case", "end"], ["form", null, "form"], ["vpos", null, "form"], ["tense", "tense", null], [null, "tense", "part"], ["tense", null, "tense"], ["vpos", "vpos", null], ["case", null, "case"], ["case", null, "end"], [null, "form", "vpos"], ["conn", null, "conn"], ["vpos", null, "form"], [null, "pron", "pron"], ["case", "case", null], ["end", null, "case"], [null, "pron", "pron"], ["part", null, "tense"], ["form", "form", null], ["conn", null, "conn"], [null, "conn", "conn"], ["vpos", null, "form"], ["form", "form", null], [null, "part", "part"], ["prep", null, "prep"], ["end", "end", null], [null, "form", "form"], ["end", null, "end"], ["vpos", null, "case"], ["pron", null, "pron"], ["part", "tense", null]];
    QUESTIONS.forEach(function (q, i) { q.e = ERR[i]; });
    var ERROR_TYPES = {
        vpos:  { name: "Word order (verb position)", rule: "Main clause: verb in position 2. Subordinate clause (weil, dass, obwohl, als): conjugated verb at the end. Modal or perfect: second verb at the end.", units: ["A12", "A13", "A46", "B1", "B2"] },
        "case": { name: "Case choice (Akk / Dat / Gen)", rule: "Ask what the verb or preposition requires: mit, seit, bei = Dativ; für, durch, ohne = Akkusativ; wohin? = Akk, wo? = Dat; wegen, trotz = Genitiv.", units: ["A17", "A18", "A22", "B3", "B31"] },
        end:   { name: "Endings (articles, adjectives, n-declension)", rule: "The ending shows gender, number and case: dem/den/der, -e/-en/-er after the article type, and der Student → den/dem Studenten.", units: ["A40", "A41", "A84", "B55", "B50"] },
        part:  { name: "Perfekt and passive forms", rule: "sein for movement and change of state, haben for the rest; no ge- with be-/ver-/er- verbs; passive = werden + Partizip II; modal in Perfekt = haben + two infinitives.", units: ["A26", "A27", "A28", "B36", "B37"] },
        tense: { name: "Tense and mood", rule: "Präteritum for sein, haben and modals; Plusquamperfekt (hatte/war + Partizip) for the earlier past; Konjunktiv II (hätte, wäre, würde + Infinitiv) for unreal situations.", units: ["A54", "A55", "A60", "B9", "B10"] },
        conn:  { name: "Connectors and conjunctions", rule: "als for one event in the past, wenn for repeated or present; um … zu with the same subject, damit with a different one; obwohl (verb at end) vs trotzdem (verb right after).", units: ["A77", "A78", "A80", "B63", "B73"] },
        prep:  { name: "Prepositions and da-/wo- words", rule: "Verbs come with fixed prepositions (sich freuen auf, warten auf, denken an); for things replace preposition + noun with da- (daran, darauf).", units: ["A35", "A36", "A58", "A59", "B33"] },
        form:  { name: "Word forms", rule: "zu before the infinitive after Lust haben, versuchen, ohne, statt; comparatives with -er (größer), never mehr + adjective; check irregular forms.", units: ["A42", "A73", "A74", "B67"] },
        pron:  { name: "Pronouns (reflexive, relative)", rule: "Reflexive: mich/mir follow the case (ich wasche mich, ich wasche mir die Hände); relative pronoun = gender of the noun + case in its own clause (dessen for possession).", units: ["A31", "A56", "A75", "B70", "B71"] }
    };

    // ---------- Dates ----------
    function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function today() { return iso(new Date()); }
    function addDays(s, n) { var d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return iso(d); }

    // ---------- Capacity: your pace is 2 core units + 1 optional extra per day ----------
    // A Repeat Pass of a unit you already did counts as half a unit.
    function cost(id, doneSet) { return (doneSet ? doneSet.has(id) : DONE_BEFORE.indexOf(id) !== -1) ? 0.5 : 1; }
    function dayCaps(t) {
        var plan = window.PLAN, d = plan && plan.days.filter(function (x) { return x[0] === t; })[0];
        if (!d || t > (plan.lastNewUnits || "2026-11-02")) return { core: 0, extra: 0 };
        var p = plan.pace, k = d[1] === "dl" ? "dl" : d[1] === "p0" ? "p0" : d[2] === "Mock" ? "Mock" : d[2] === "Gate" ? "Gate" : d[2] === "Test" ? "Test" : "normal";
        return p[k];
    }
    function capacity(from) {
        var core = 0, extra = 0, plan = window.PLAN;
        if (!plan) return { core: 40, extra: 20 };
        plan.days.forEach(function (d) {
            if (d[0] < from) return;
            var c = dayCaps(d[0]);
            core += c.core; extra += c.extra;
        });
        return { core: core, extra: extra };
    }

    /* ---------- Recommendation math ----------
       Evidence per topic, split in two levels:
         basic    = test items at A2/B1  + results logged on A1-B1 units (A..)
         advanced = test items at B2     + results logged on B2-C1 units (B..)
       A logged result counts as two observations: 80%+ = 2/2, 60-79% = 1/2, under 60% = 0/2.
       mastery  m = (correct + 1) / (observations + 2)          (Laplace smoothing)
       A1-B1 unit:  need = weight × (1 − m_basic);    fit = 0.1 if m_basic ≥ 0.7 (you already pass the basics), else 1
                    × 0.6 more when your grammar level is B1+ or higher
       B2-C1 unit:  need = weight × (1 − m_advanced); fit = 1.2 if m_basic ≥ 0.5, else 0.3 (no B2 on a broken base)
       done       = 0.5 if you already did the unit (it becomes a Repeat Pass that costs half a unit)
       score      = need × fit × done ÷ cost
       Solid and parked units are never suggested again. Units fill the core slots (2/day), then the extra slots (1/day). */
    var LOG_KEY = "units:log";
    function loadLog() { try { return JSON.parse(store(LOG_KEY) || "[]") || []; } catch (e) { return []; } }
    var BAND_OBS = { hi: 2, mid: 1, lo: 0 };

    function evidence(answers) {
        var ev = {};
        Object.keys(TOPICS).forEach(function (t) { ev[t] = { bc: 0, bn: 0, ac: 0, an: 0, tc: 0, tn: 0 }; });
        (answers ? QUESTIONS : []).forEach(function (q, i) {
            var x = answers[i];
            if (x === undefined || x === null) return;
            var ok = x === q.a ? 1 : 0, e = ev[q.t];
            e.tn++; e.tc += ok;
            if (q.l === "B2") { e.an++; e.ac += ok; } else { e.bn++; e.bc += ok; }
        });
        // Unit results: the log, or for older data the current status as a stand-in
        var seen = {};
        loadLog().forEach(function (r) { addUnit(ev, r.id, r.band); seen[r.id] = true; });
        var st = loadState();
        Object.keys(st).forEach(function (id) {
            if (seen[id]) return;
            var s = st[id].s, band = s === "solid" || s === "repeat" ? "hi" : s === "first" ? "mid" : s === "red" || s === "parked" ? "lo" : null;
            if (band) addUnit(ev, id, band);
        });
        return ev;
    }
    function topicOfUnit(id) {
        var ks = Object.keys(TOPICS);
        for (var i = 0; i < ks.length; i++) if (TOPICS[ks[i]].units.indexOf(id) !== -1) return ks[i];
        return null;
    }
    function addUnit(ev, id, band) {
        var t = topicOfUnit(id);
        if (!t || !(band in BAND_OBS)) return;
        if (id[0] === "A") { ev[t].bn += 2; ev[t].bc += BAND_OBS[band]; } else { ev[t].an += 2; ev[t].ac += BAND_OBS[band]; }
    }
    function grammarLevelNum() {
        var p = null;
        try { p = JSON.parse(store("level:profile") || "null"); } catch (e) {}
        var NUMS = { A1: 1, A2: 2, "A2+": 2.5, B1: 3, "B1+": 3.5, B2: 4, "B2+": 4.5, C1: 5 };
        return p && p.skills && p.skills.grammar ? NUMS[p.skills.grammar.level] || 0 : 0;
    }

    function recommend(answers, doneSet, from) {
        var ev = evidence(answers), st = loadState(), strongBase = grammarLevelNum() >= 3.5;
        var topics = Object.keys(TOPICS).map(function (t) {
            var e = ev[t];
            var mb = (e.bc + 1) / (e.bn + 2), ma = (e.ac + 1) / (e.an + 2);
            return { id: t, name: TOPICS[t].name, w: TOPICS[t].w, c: e.tc, n: e.tn, m: (e.tc + 1) / (e.tn + 2), mBasic: mb, mAdv: ma, need: TOPICS[t].w * (1 - Math.min(mb, ma)) };
        });

        var cands = [];
        topics.forEach(function (tp) {
            TOPICS[tp.id].units.forEach(function (u) {
                var s = stateOf(st, u).s;
                if (s === "solid" || s === "parked") return;
                var isA = u[0] === "A", need, fit;
                if (isA) {
                    need = tp.w * (1 - tp.mBasic);
                    fit = tp.mBasic >= 0.7 ? 0.1 : 1;
                    if (strongBase) fit *= 0.6;
                } else {
                    need = tp.w * (1 - tp.mAdv);
                    fit = tp.mBasic >= 0.5 ? 1.2 : 0.3;
                }
                var done = doneSet.has(u);
                var c = done ? 0.5 : 1;
                var score = need * fit * (done ? 0.5 : 1) / c;
                cands.push({ id: u, title: UNITS[u], topic: tp.name, topicId: tp.id, cost: c, hours: hours(u) * c, done: done, score: Math.round(score * 100) / 100 });
            });
        });
        cands.sort(function (a, b) { return b.score - a.score; });

        var cap = capacity(from || today()), core = 0, extra = 0;
        cands.forEach(function (c) {
            if (c.score < 0.3) c.tier = "skip";
            else if (core + c.cost <= cap.core) { c.tier = "plan"; core += c.cost; }
            else if (extra + c.cost <= cap.extra) { c.tier = "extra"; extra += c.cost; }
            else c.tier = "skip";
        });
        var correct = 0;
        if (answers) QUESTIONS.forEach(function (q, i) { if (answers[i] === q.a) correct++; });
        return { topics: topics, units: cands, cap: cap, core: core, extra: extra, correct: correct, total: QUESTIONS.length };
    }

    // Re-rank the queue from all the evidence: in-progress units first, then the new ranking.
    function rerank() {
        if (store("war:on")) return null;   // war room: the mini test owns the queue
        var last = null;
        try { last = JSON.parse(store("test:last") || "null"); } catch (e) {}
        var q = loadQueue();
        if (!q.length && !last) return null;
        var st = loadState();
        var res = recommend(last ? last.answers : null, new Set(DONE_BEFORE), today());
        var active = q.filter(function (id) { var s = stateOf(st, id).s; return s === "first" || s === "repeat" || s === "red"; });
        var ranked = res.units.filter(function (u) { return (u.tier === "plan" || u.tier === "extra") && active.indexOf(u.id) === -1; }).map(function (u) { return u.id; });
        var history = q.filter(function (id) { var s = stateOf(st, id).s; return (s === "solid" || s === "parked") && active.indexOf(id) === -1; });
        saveQueue(active.concat(ranked, history));
        return res;
    }

    // ---------- Unit progress state machine ----------
    /* status: todo → first (Repeat Pass due +2 d) → repeat (Check due +5 d) → solid
       First pass ≥80% fast-tracks straight to "repeat". <60% anywhere → red (failure protocol, retry +1 d).
       Red twice → parked (stop spending time; avoid the structure in the exam). */
    var STATE_KEY = "units:state", QUEUE_KEY = "units:queue";
    function loadState() { try { return JSON.parse(store(STATE_KEY) || "{}") || {}; } catch (e) { return {}; } }
    function saveState(s) { store(STATE_KEY, JSON.stringify(s)); }
    function loadQueue() { try { return JSON.parse(store(QUEUE_KEY) || "[]") || []; } catch (e) { return []; } }
    function saveQueue(q) { store(QUEUE_KEY, JSON.stringify(q)); }

    function stateOf(st, id) { return st[id] || { s: "todo" }; }

    // band: "hi" (≥80%), "mid" (60–79%), "lo" (<60%)
    function logResult(id, band) {
        var st = loadState(), u = stateOf(st, id), t = today(), prev = u;
        var tries = u.tries || 0;
        if (band === "lo") {
            tries++;
            u = tries >= 2 && u.s === "red" ? { s: "parked", tries: tries } : { s: "red", due: addDays(t, 1), tries: tries };
        } else if (u.s === "todo" || u.s === "red") {
            u = band === "hi" ? { s: "repeat", due: addDays(t, 5) } : { s: "first", due: addDays(t, 2) };
        } else if (u.s === "first") {
            u = band === "hi" ? { s: "repeat", due: addDays(t, 5) } : { s: "first", due: addDays(t, 2) };
        } else if (u.s === "repeat") {
            u = band === "hi" ? { s: "solid", on: t } : { s: "first", due: addDays(t, 2) };
        }
        u.last = t;
        u.firstOn = prev.firstOn || (prev.s === "todo" || !prev.s ? t : undefined);
        st[id] = u;
        saveState(st);
        var log = loadLog(); log.push({ id: id, band: band, date: t }); store(LOG_KEY, JSON.stringify(log));
        rerank();
        return u;
    }
    function resetUnit(id) { var st = loadState(); delete st[id]; saveState(st); }

    // What to do today: due reviews/fixes + 2 core units + 1 optional extra from the queue
    function agenda() {
        var st = loadState(), q = loadQueue(), t = today(), caps = dayCaps(t), used = 0;
        var due = [], fresh = [], extra = [], doneToday = [];
        q.forEach(function (id) {
            var u = stateOf(st, id);
            if (u.last === t) {
                doneToday.push(id);
                if (u.firstOn === t) used += cost(id);   // first-passed today: uses today's slots
            } else if ((u.s === "first" || u.s === "repeat" || u.s === "red") && u.due && u.due <= t) due.push(id);
        });
        q.forEach(function (id) {
            if (stateOf(st, id).s !== "todo") return;
            var c = cost(id);
            if (used + c <= caps.core) { fresh.push(id); used += c; }
            else if (used + c <= caps.core + caps.extra && !extra.length) { extra.push(id); used += c; }
        });
        return { due: due, fresh: fresh, extra: extra, doneToday: doneToday };
    }

    window.Units = {
        TOPICS: TOPICS, UNITS: UNITS, QUESTIONS: QUESTIONS, DONE_BEFORE: DONE_BEFORE, ERROR_TYPES: ERROR_TYPES,
        hours: hours, capacity: capacity, dayCaps: dayCaps, recommend: recommend, rerank: rerank, evidence: evidence, loadLog: loadLog,
        loadState: loadState, saveState: saveState, loadQueue: loadQueue, saveQueue: saveQueue,
        stateOf: stateOf, logResult: logResult, resetUnit: resetUnit, agenda: agenda, today: today,
        label: function (id) { return (id[0] === "A" ? "A·" : "B·") + id.slice(1); },
        bookName: function (id) { return id[0] === "A" ? "A1–B1 book" : "B2–C1 book"; }
    };
})();
