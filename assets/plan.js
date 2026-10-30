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
        ["0745", "light", "Walk with audio", "45 minutes of B1 audio. Pause, repeat out loud, guess the next sentence. This is listening practice."],
        ["0830", "light", "Breakfast and Anki reviews", "All due cards."],
        ["0900", "deep",  "Grammar: new units", "First passes. Type everything. 50 minutes on, 10 off.", "new"],
        ["1100", "deep",  "Grammar: ladder drill", "30 items from A2 to C1, easiest first, cold and timed (Prompts tab). Log the score per level: your ceiling is the first level under 70%."],
        ["1215", "light", "Vocabulary", "New cards from Words in frequency order: the next 1000 words are what separates B1 from B2 in reading and listening."],
        ["1300", "off",   "Lunch", "A real break."],
        ["1400", "deep",  "Listening", "90 minutes at the edge of your level: one audio you get about 70% of, then one a level higher. Questions first, two plays at most, then the transcript and 10 minutes of shadowing."],
        ["1530", "light", "Walk or gym", "The morning audio again, passively."],
        ["1615", "deep",  "Reading", "Two timed texts, one at your level and one a level higher. Then the post-mortem: why each wrong answer was wrong. Unknown words go to Mine vocab."],
        ["1700", "deep",  "Grammar: repeats", "Due repeats, checks and red flags, then one C-Test.", "due"],
        ["1830", "off",   "Exercise and dinner", ""],
        ["1930", "deep",  "Weak part, second round", "40 minutes more of your weakest exam part, with lighter material."],
        ["2015", "light", "Immersion", "A series with German subtitles, Easy German or podcasts. Listening counts."],
        ["2145", "light", "Shutdown", "Five sentences about your day using today's grammar."]
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
        ["2026-10-27", "bd", "", "<b>Format confirmed: grammar, reading and listening, placed from A1 to C1.</b> Secure every item up to your level, then win the ones just above it (Exam → Strategy). Units + due repeats. Focus: {weak1}."],
        ["2026-10-28", "bd", "Mock", "<b>Ladder mock at 10:00:</b> grammar, reading and listening, each going from A2 to C1, all timed. Note where each part stops scoring. Afternoon: post-mortem in Coach and due repeats only. Gate A."],
        ["2026-10-29", "bd", "", "Units + due repeats. Focus: {weak1}. Listening: read the questions first and predict the answers before every audio."],
        ["2026-10-30", "bd", "", "Units + due repeats. Focus: {weak2}. Reading: questions first, then scan for paraphrases."],
        ["2026-10-31", "sh", "Mock", "<b>Full ladder mock at 10:00:</b> grammar, reading and listening from A2 to C1, timed and in exam conditions. Practise the time rule: hard item, mark, guess, move on. Evening: passive immersion."],
        ["2026-11-01", "sh", "Gate", "<b>Retake the level test</b>; the routine and queue update. From 16:00: passive mode."],
        ["2026-11-02", "sh", "", "<b>Last new units</b> + due repeats. Focus: {weak1}. One extra C-Test on your red-flag topics."],
        ["2026-11-03", "sh", "Mock", "<b>Final ladder mock at 10:00</b>, the same time as the real exam. Count careless errors on items at or below your level: those are the cheapest points left. No new units from now on."],
        ["2026-11-04", "dl", "", "Light day: due checks only, one reading and one listening part, the walk audio. Confirm the room, documents and route."],
        ["2026-11-05", "dl", "", "Exam eve: 2 hours max. A short drill on your careless-error list (endings, verb position) and one easy listening. Pack ID and pens. Screens off at 22:00, sleep by 23:00."],
        ["2026-11-06", "dl", "Exam", "<b>Exam at 10:00.</b> Wake at 7:00, 30-minute walk with German audio to warm up your ear for listening, arrive by 9:30."]
    ]
};

/* Personalise the routine from the latest level test (saved by test.html as "level:profile").
   Without a result the plan stays generic. */
(function () {
    var PLAN = window.PLAN, p = null;
    try { p = JSON.parse(localStorage.getItem("level:profile") || "null"); } catch (e) {}
    PLAN.profile = p;
    var FOCUS = {
        grammar: "grammar (the 19:30 block is a second exam drill)",
        vocab: "vocabulary (the 12:15 block runs 60 minutes, frequent words and connectors first)",
        reading: "reading (the 16:15 block, two timed texts)",
        listening: "listening (90 minutes at 14:00 and a second round at 19:30)"
    };
    // Only the exam parts, plus vocabulary because it carries reading and listening
    // Your own call (27 Oct): listening is the weakest, then reading. The test result only orders what comes after.
    var weak = ["listening", "reading"].concat(p && p.weakest ? p.weakest.filter(function (k) { return FOCUS[k] && k !== "listening" && k !== "reading"; }) : []);
    var w1 = FOCUS[weak[0]], w2 = FOCUS[weak[1]];
    PLAN.days.forEach(function (d) { d[3] = d[3].replace("{weak1}", w1).replace("{weak2}", w2); });

    var top2 = weak.slice(0, 2);
    // The second round at 19:30 goes to the weakest exam part
    var part = weak.filter(function (k) { return k !== "vocab"; })[0];
    var SECOND = {
        grammar: ["Grammar: second drill", "Another 30 mixed items, this time only your red-flag and error-pattern topics (Diagnosis page)."],
        reading: ["Reading: third text", "One more timed text with questions, then mark every word that cost you an answer."],
        listening: ["Listening: second round", "40 minutes: one harder audio, questions first, played twice, then the transcript read aloud with the audio."]
    };
    PLAN.blocks.forEach(function (b) {
        if (b[0] === "1930" && SECOND[part]) { b[2] = SECOND[part][0]; b[3] = SECOND[part][1]; }
        if (b[0] === "1215" && top2.indexOf("vocab") !== -1) { b[3] = "60 minutes: 20 frequent words and 10 connectors from Words, then Anki reviews."; }
        if (b[0] === "1700" && top2.indexOf("grammar") !== -1) { b[3] = "Due repeats, checks and red flags, then two C-Tests."; }
    });

    // War room (war.html): the last-week routine. Each block has its guide and prompt in War room → Steps.
    var war = null;
    try { war = localStorage.getItem("war:on"); } catch (e) {}
    PLAN.war = war;
    if (war) PLAN.blocks = [
        ["0730", "off",   "Wake up", "Water, daylight, no phone for 30 minutes."],
        ["0800", "light", "Anki", "All reviews first. New cards only from Verben mit Präpositionen, Connectors and New words."],
        ["0900", "deep",  "Grammar: targeted unit", "The next war-room unit: only the exercises for the rule behind your mistake, then the 10-item check.", "new"],
        ["1030", "deep",  "Grammar: ladder drill", "30 items from A2 to C1 in 20 minutes. Score per level; mistakes at or below your level go on the careless list."],
        ["1200", "deep",  "Listening loop", "60 to 90 minutes on 30-60 s clips at B1: blind, with the transcript, blind again, then shadow."],
        ["1330", "off",   "Lunch", "A real break."],
        ["1430", "deep",  "Reading", "Two texts, your level and one above. Questions first, hunt the paraphrases, post-mortem every miss."],
        ["1600", "light", "Walk", "The morning clips again, passively."],
        ["1645", "deep",  "Listening: exam format", "One model-test part, played as in the exam, questions first. Then the loop on what you missed."],
        ["1745", "deep",  "Grammar: repeats", "Due repeats and red flags, then read the careless list out loud.", "due"],
        ["1830", "off",   "Exercise and dinner", ""],
        ["1945", "light", "Error review", "Minimal-pair drill on the 5 most repeated errors; words that cost answers go to New words."],
        ["2030", "light", "Immersion", "A series or podcast with German subtitles."],
        ["2200", "off",   "Shutdown", "Screens off by 22:30. Sleep is part of the plan this week."]
    ];
})();
