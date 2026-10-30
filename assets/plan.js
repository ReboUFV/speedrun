/* Speedrun · the war-room schedule until the exam. Zero rest: every break runs in German.
   Each block: [start, title, what to do, prompt ids]. Prompts live in index.html. */
window.PLAN = {
    examStart: "2026-11-06",
    examTime: "10:00",
    // Day type and the one line that matters that day
    days: {
        "2026-10-30": ["normal", "Day 1: take the mini test first (Test tab, 25 minutes). It picks your grammar units."],
        "2026-10-31": ["mock", "Mock at 10:00, the same time as the exam."],
        "2026-11-01": ["normal", "Full day. From 16:00, German without a desk: series, podcasts, Anki reviews."],
        "2026-11-02": ["normal", "Last day with a new grammar unit."],
        "2026-11-03": ["mock", "Final mock at 10:00. After it: no new units and no new Anki cards."],
        "2026-11-04": ["light", "Lighter day, still all in German. Confirm the room, your documents and the route."],
        "2026-11-05": ["light", "Exam eve: two hours of real work at most, the rest easy German. Pack ID and pens. Screens off at 22:00."],
        "2026-11-06": ["exam", "Exam at 10:00. Floor first, the 60-second rule, no blanks."]
    },
    blocks: {
        normal: [
            ["0800", "Anki with breakfast", "All reviews first. New cards only from Paráfrasis, Sustantivos, Verben mit Präpositionen, Verbos frecuentes and New words.", []],
            ["0900", "Grammar: your unit", "The next unit from your test list. Only the exercises for the rule you got wrong, then the 10-item check.", ["unitcheck"]],
            ["1030", "Grammar: ladder drill", "30 items from A2 to C1 in 20 minutes. Mistakes at or below your level go on your careless list.", ["ladder"]],
            ["1200", "Listening loop", "30–60 second clips at B1: blind, with the transcript, blind again, then shadow it.", ["transcript", "whymiss"]],
            ["1330", "Lunch with a podcast", "Easy German or a slow news podcast while you eat. Repeat a sentence now and then.", []],
            ["1430", "Reading", "Two texts: your level and one above. Questions first, hunt the paraphrases, post-mortem every miss.", ["reading", "paraphrase"]],
            ["1600", "Walk with the clips", "The morning's listening clips again. Shadow them under your breath.", []],
            ["1645", "Listening: exam format", "One part of a model test, played as in the exam, questions first. Then the loop on what you missed.", ["postmortem"]],
            ["1800", "Error review", "Read the careless list out loud, drill the repeated errors, words that cost you an answer go to Anki.", ["minimal"]],
            ["1900", "Exercise and dinner in German", "A German podcast at the gym, German audio while you cook and eat.", []],
            ["2030", "Immersion", "A series with German subtitles. Pause on any sentence you'd want in an exam option.", []],
            ["2200", "Careless list, then sleep", "Read the careless list once in bed. Lights out by 22:30: sleep is when today's work sticks.", []]
        ],
        mock: [
            ["0800", "Anki with breakfast", "Reviews only.", []],
            ["0930", "Warm-up", "15 minutes of easy German audio, out loud.", []],
            ["1000", "Mock", "Back to back, phone in another room: the ladder drill (20 min), one reading part and one listening part from a model test. Over 60 seconds on an item: mark, guess, move on.", ["ladder"]],
            ["1230", "Lunch with a podcast", "Easy German while you eat.", []],
            ["1400", "Post-mortem", "Every miss: the exact words that held the answer and the trap you fell for.", ["postmortem", "minimal"]],
            ["1600", "Walk with the mock audio", "The mock's listening part again, now with the answers in mind.", []],
            ["1700", "Listening loop", "The parts of the mock you missed, clip by clip.", ["transcript", "whymiss"]],
            ["1900", "Exercise and dinner in German", "Podcast at the gym, audio while you eat.", []],
            ["2030", "Immersion", "A series with German subtitles.", []],
            ["2200", "Careless list, then sleep", "Once in bed, lights out by 22:30.", []]
        ],
        light: [
            ["0800", "Anki with breakfast", "Reviews only. No new cards from today.", []],
            ["1000", "One reading part", "Timed, at your level.", ["reading"]],
            ["1130", "One listening part", "Questions first, as in the exam.", ["postmortem"]],
            ["1300", "Lunch with a podcast", "Easy German.", []],
            ["1500", "Careless list", "Out loud, correct versions only.", ["minimal"]],
            ["1600", "Easy German, no desk", "Walk with audio, a German series, pack for the exam. Keep it easy: no new material.", []],
            ["2200", "Sleep", "Lights out by 23:00.", []]
        ],
        exam: [
            ["0700", "Wake up", "Breakfast with easy German audio.", []],
            ["0800", "Walk", "Easy German audio to warm up your ear for listening.", []],
            ["0930", "Arrive", "ID, pens, a watch. Read the careless list once, then put it away.", []],
            ["1000", "Exam", "Floor first: secure every item at your level. Over 60 seconds: mark, guess, move on. No blanks unless wrong answers subtract.", []]
        ]
    }
};
