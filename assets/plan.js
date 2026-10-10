/* Speedrun OS · calendar shared by the home page and the grammar test.
   Each day: [date, phase, kind, text]. kind: "" | "Mock" | "Gate" | "Exam". */
window.PLAN = {
    examStart: "2026-11-03",
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
    days: [
        ["2026-10-10", "p0", "", "<b>Take the grammar test</b> (Units tab) so it builds your unit queue. Then the baseline diagnostic (Guide → 🩺) and Anki backlog triage. Evening: memorize Skeleton A."],
        ["2026-10-11", "p0", "", "First full-day run: <b>new units from your queue</b>. Draft your Skeleton E answers, get them AI-corrected. From 16:00: passive mode."],
        ["2026-10-12", "s1", "", "<b>Get the exam format</b> (email / visit the office). Grammar: queue + due repeats."],
        ["2026-10-13", "s1", "", "Grammar: queue + due repeats. Memorize Skeleton B."],
        ["2026-10-14", "s1", "", "Grammar: queue + due repeats. Re-weight the day if the format is known."],
        ["2026-10-15", "s1", "", "Grammar: queue + due repeats. Memorize Skeleton E."],
        ["2026-10-16", "s1", "", "Grammar: queue + due repeats. Clear any red flags (failure protocol)."],
        ["2026-10-17", "s1", "Mock", "<b>Mini-mock</b> in the morning (1 reading + 1 listening + 1 text, timed). Afternoon: due repeats only."],
        ["2026-10-18", "s1", "Gate", "<b>Gate 1</b> (Guide → 🚦). <b>Retake the grammar test</b> so the queue re-ranks. Due repeats. From 16:00: passive mode."],
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
        ["2026-11-01", "s3", "Gate", "<b>Gate 3.</b> Type all 5 skeletons from memory. <b>No new units from now on</b>, only due checks. Afternoon: passive mode."],
        ["2026-11-02", "dl", "", "Half day max. Recite skeletons on walks, light listening. Check exam time, place, documents."],
        ["2026-11-03", "dl", "Exam", "Exam window. 2–3 h max: Skeleton E out loud, 1 short text, light listening. Sleep 8 h."],
        ["2026-11-04", "dl", "Exam", "Exam window. Same. No mocks."],
        ["2026-11-05", "dl", "Exam", "Exam window. Same. Trust the system."],
        ["2026-11-06", "dl", "Exam", "Exam window."],
        ["2026-11-07", "dl", "Exam", "Exam window closes."]
    ]
};
