/* Speedrun OS · calendar shared by the home page and the grammar test.
   Each day: [date, phase, kind, text]. kind: "" | "Mock" | "Gate" | "Exam". */
window.PLAN = {
    examStart: "2026-11-06",
    examTime: "10:00",
    // Last day with new units; from the day after only due repeats and checks
    lastNewUnits: "2026-11-02",
    phases: {
        p0: "Re-entry",
        s1: "Sprint 1",
        s2: "Sprint 2",
        s3: "Sprint 3 · Gauntlet",
        rs: "Reset",
        bd: "Build",
        sh: "Sharpen",
        dl: "Deload + exam"
    },
    // New units per day: 2 core + 1 optional extra (your pace). Used by the test and the Units tab.
    pace: {
        p0:     { core: 2, extra: 1 },
        normal: { core: 2, extra: 1 },
        Mock:   { core: 1, extra: 0 },
        Gate:   { core: 1, extra: 1 },
        Test:   { core: 1, extra: 1 },
        dl:     { core: 0, extra: 0 }
    },
    // The day as a checklist: [time, kind, title, detail, grammar slot]
    blocks: [
        ["0730", "off",   "Wake up", "Water, daylight, no phone for 30 minutes."],
        ["0745", "light", "Walk with audio", "45 minutes of German audio at your level. Repeat out loud what you catch."],
        ["0830", "light", "Breakfast and Anki reviews", "All due cards."],
        ["0900", "deep",  "Grammar: new units", "First passes. Type everything. 50 minutes on, 10 off.", "new"],
        ["1130", "out",   "Writing", "One text from a template, graded, saved in Essays."],
        ["1215", "light", "Vocabulary", "New cards from Words and the decoding rules."],
        ["1300", "off",   "Lunch", "A real break."],
        ["1400", "deep",  "Reading and listening", "One practice part of each, timed, then the post-mortem."],
        ["1530", "light", "Walk or gym", "Same audio as the morning, or recite templates."],
        ["1615", "out",   "Speaking", "Voice simulation with the AI, then 10 minutes of shadowing."],
        ["1700", "deep",  "Grammar: repeats", "Due repeats, checks and red flags, then one C-Test.", "due"],
        ["1830", "off",   "Exercise and dinner", ""],
        ["1930", "out",   "Second output", "The other template, or the syntax interrogation."],
        ["2015", "light", "Immersion", "Series with German subtitles, games, Easy German."],
        ["2145", "light", "Shutdown", "Five sentences about your day in German."]
    ],
    days: [
        ["2026-10-10", "p0", "", "<b>Take the grammar test</b> so it builds your unit queue. Then the baseline diagnostic (Guide, Day 0) and Anki backlog triage. Evening: memorize Skeleton A."],
        ["2026-10-11", "p0", "", "First full-day run: <b>new units from your queue</b>. Draft your Skeleton E answers, get them AI-corrected. From 16:00: passive mode."],
        ["2026-10-12", "s1", "", "<b>Get the exam format</b> (email / visit the office). Grammar: queue + due repeats."],
        ["2026-10-13", "s1", "", "Grammar: queue + due repeats. Memorize Skeleton B."],
        ["2026-10-14", "s1", "", "Grammar: queue + due repeats. Re-weight the day if the format is known."],
        ["2026-10-15", "s1", "", "Grammar: queue + due repeats. Memorize Skeleton E."],
        ["2026-10-16", "s1", "", "Grammar: queue + due repeats. Clear any red flags (failure protocol)."],
        ["2026-10-17", "s1", "Mock", "<b>Mini-mock</b> in the morning (1 reading + 1 listening + 1 text, timed). Afternoon: due repeats only."],
        ["2026-10-18", "s1", "Gate", "<b>Gate 1</b> (Guide, Gates). <b>Retake the grammar test</b> so the queue re-ranks. Due repeats. From 16:00: passive mode."],
        ["2026-10-19", "s2", "", "Grammar: queue + due repeats. Switch walk audio to B2 material."],
        ["2026-10-20", "s2", "", "Grammar: queue + due repeats. Memorize Skeleton C."],
        ["2026-10-21", "s2", "", "Grammar: queue + due repeats."],
        ["2026-10-22", "s2", "", "Grammar: queue + due repeats. Memorize Skeleton D."],
        ["2026-10-23", "s2", "", "Grammar: queue + due repeats. Clear any red flags."],
        ["2026-10-24", "rs", "Test", "<b>Full level test</b> (about 45 minutes). Your routine and unit queue rewrite themselves from the result. Then the first unit from the new queue and an interview-template draft in Coach."],
        ["2026-10-25", "rs", "", "Units from the new queue + due repeats. Focus: {weak1}. Write your interview answers and get them corrected in Coach. From 16:00: passive mode."],
        ["2026-10-26", "bd", "", "Units + due repeats. Focus: {weak1}. Speaking: oral simulation in Coach with voice."],
        ["2026-10-27", "bd", "", "Units + due repeats. Focus: {weak2}. Memorise the opinion template."],
        ["2026-10-28", "bd", "Mock", "<b>Mock at 10:00:</b> one reading part, one listening part and one text, timed. Afternoon: post-mortem in Coach and due repeats only. Gate A."],
        ["2026-10-29", "bd", "", "Units + due repeats. Focus: {weak1}. Memorise the email template."],
        ["2026-10-30", "bd", "", "Units + due repeats. Focus: {weak2}. Two speaking simulations in Coach."],
        ["2026-10-31", "sh", "Mock", "<b>Full mock at 10:00</b>, all parts timed, speaking with Coach. Evening: passive immersion."],
        ["2026-11-01", "sh", "Gate", "<b>Retake the level test</b>; the routine and queue update. Type all five templates from memory. From 16:00: passive mode."],
        ["2026-11-02", "sh", "", "<b>Last new units</b> + due repeats. Focus: {weak1}. Two interview simulations in Coach."],
        ["2026-11-03", "sh", "Mock", "<b>Final full mock at 10:00</b>, the same time as the real exam. Post-mortem in the afternoon. No new units from now on."],
        ["2026-11-04", "dl", "", "Light day: due checks only, templates out loud on a walk, light listening. Confirm the room, documents and route."],
        ["2026-11-05", "dl", "", "Exam eve: 2 hours max. Interview template out loud, one short text. Pack ID and pens. Screens off at 22:00, sleep by 23:00."],
        ["2026-11-06", "dl", "Exam", "<b>Exam at 10:00.</b> Wake at 7:00, 30-minute walk with German audio, read the interview template once, arrive by 9:30."]
    ]
};

/* Personalise the routine from the latest level test (saved by test.html as "level:profile").
   Without a result the plan stays generic. */
(function () {
    var PLAN = window.PLAN, p = null;
    try { p = JSON.parse(localStorage.getItem("level:profile") || "null"); } catch (e) {}
    PLAN.profile = p;
    var FOCUS = {
        grammar: "grammar (an extra C-Test in the 17:00 block)",
        vocab: "vocabulary (the 12:15 block runs 60 minutes)",
        reading: "reading (one timed practice text at 14:00)",
        listening: "listening (one practice audio with transcript at 14:00)",
        writing: "writing (the 19:30 block is a second graded text)"
    };
    var weak = p && p.weakest && p.weakest.length ? p.weakest : [];
    var w1 = weak[0] ? FOCUS[weak[0]] : "your weakest skill (take the level test)";
    var w2 = weak[1] ? FOCUS[weak[1]] : (weak[0] ? FOCUS[weak[0]] : "your second weakest skill");
    PLAN.days.forEach(function (d) { d[3] = d[3].replace("{weak1}", w1).replace("{weak2}", w2); });
    if (!p) return;

    var lvl = function (k) { return p.skills && p.skills[k] && p.skills[k].level ? ({ A1: 1, A2: 2, "A2+": 2.5, B1: 3, "B1+": 3.5, B2: 4, "B2+": 4.5, C1: 5 }[p.skills[k].level] || 0) : 9; };
    var top2 = weak.slice(0, 2);
    PLAN.blocks.forEach(function (b) {
        if (b[0] === "1400") {
            if (lvl("listening") <= lvl("reading")) { b[2] = "Listening and reading"; b[3] = "60 minutes of listening (practice audio, then the transcript), 30 minutes of reading, then the post-mortem."; }
            else { b[2] = "Reading and listening"; b[3] = "60 minutes of reading (timed practice text), 30 minutes of listening, then the post-mortem."; }
        }
        if (b[0] === "1215" && top2.indexOf("vocab") !== -1) { b[3] = "60 minutes: 30 new words from Words, the decoding rules, and Anki reviews."; }
        if (b[0] === "1930") {
            if (top2.indexOf("writing") !== -1) { b[2] = "Second text"; b[3] = "The other template, graded in Coach."; }
            else { b[2] = "Speaking"; b[3] = "Oral simulation in Coach with voice, interview first."; }
        }
        if (b[0] === "1700" && top2.indexOf("grammar") !== -1) { b[3] = "Due repeats, checks and red flags, then two C-Tests."; }
    });
})();
