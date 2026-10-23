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
        dl: "Deload + exam"
    },
    // New units per day: 2 core + 1 optional extra (your pace). Used by the test and the Units tab.
    pace: {
        p0:     { core: 2, extra: 1 },
        normal: { core: 2, extra: 1 },
        Mock:   { core: 1, extra: 0 },
        Gate:   { core: 1, extra: 1 },
        dl:     { core: 0, extra: 0 }
    },
    // The day as a checklist: [time, kind, title, detail, grammar slot]
    blocks: [
        ["0730", "off",   "Wake up", "Water, daylight, no phone for 30 minutes."],
        ["0745", "light", "Walk with audio", "45 minutes. Sprint 1: Michel Thomas or Language Transfer out loud. Later: B2 listening."],
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
        ["2026-10-24", "s2", "", "Grammar: queue + due repeats. Recite all 5 skeletons from memory."],
        ["2026-10-25", "s2", "Mock", "<b>Checkpoint: full mock</b> (all parts, timed; speaking with AI). <b>Gate 2</b>. Retake the grammar test. From 16:00: passive mode."],
        ["2026-10-26", "s3", "", "<b>Fix-it day:</b> every red-flag unit through the failure protocol, then the queue."],
        ["2026-10-27", "s3", "Mock", "<b>Full mock #2.</b> Post-mortem at 17:00. Due repeats only."],
        ["2026-10-28", "s3", "", "Grammar: queue + due repeats. Speaking sims ×3. Timed writing ×2."],
        ["2026-10-29", "s3", "Mock", "<b>Full mock #3.</b> Post-mortem. Due repeats only."],
        ["2026-10-30", "s3", "", "Last new units from the queue. C-Tests rapid fire. Interview sim ×2."],
        ["2026-10-31", "s3", "Mock", "<b>Full mock #4</b> (last one). Evening: passive immersion."],
        ["2026-11-01", "s3", "Gate", "<b>Gate 3.</b> Type all 5 templates from memory. Retake the grammar test. New units only until tomorrow. Afternoon: passive mode."],
        ["2026-11-02", "s3", "", "<b>Last new units</b> from the queue + due repeats. Interview simulation ×2. Timed writing ×1."],
        ["2026-11-03", "s3", "Mock", "<b>Final full mock at 10:00</b>, the same time as the real exam. Post-mortem in the afternoon. No new units from now on."],
        ["2026-11-04", "dl", "", "Light day: due checks only, templates out loud on a walk, light listening. Confirm the room, documents and route."],
        ["2026-11-05", "dl", "", "Exam eve: 2 h max. Interview template out loud, one short text. Pack ID and pens. Screens off at 22:00, sleep by 23:00."],
        ["2026-11-06", "dl", "Exam", "<b>Exam at 10:00.</b> Wake at 7:00, 30-minute walk with German audio, read the interview template once, arrive by 9:30."]
    ]
};
