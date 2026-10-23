/* Speedrun OS · full level test: content and scoring.
   Grammar comes from assets/units.js (45 items). Each item is tagged A2, B1 or B2. */
(function () {
    // Vocabulary: a word in context, pick the Spanish meaning
    var VOCAB = [
        { l: "A2", s: "Ich muss heute noch <b>einkaufen</b>.", o: ["hacer la compra", "vender", "ahorrar"], a: 0 },
        { l: "A2", s: "Das Wetter ist heute <b>schrecklich</b>.", o: ["precioso", "horrible", "raro"], a: 1 },
        { l: "A2", s: "Können Sie mir bitte die <b>Rechnung</b> bringen?", o: ["la receta", "la respuesta", "la cuenta"], a: 2 },
        { l: "A2", s: "Wir treffen uns morgen am <b>Bahnhof</b>.", o: ["estación de tren", "aeropuerto", "ayuntamiento"], a: 0 },
        { l: "A2", s: "Ich habe heute keine <b>Lust</b>.", o: ["prisa", "ganas", "suerte"], a: 1 },
        { l: "A2", s: "Der neue Kollege ist sehr <b>freundlich</b>.", o: ["tímido", "enfadado", "amable"], a: 2 },
        { l: "B1", s: "Die <b>Miete</b> in München ist sehr hoch.", o: ["el alquiler", "la multa", "la comida"], a: 0 },
        { l: "B1", s: "Ich habe mich für den Kurs <b>angemeldet</b>.", o: ["quejado", "inscrito", "olvidado"], a: 1 },
        { l: "B1", s: "Das <b>hängt</b> vom Wetter <b>ab</b>.", o: ["cuelga", "empeora", "depende"], a: 2 },
        { l: "B1", s: "Sie hat die Prüfung <b>bestanden</b>.", o: ["aprobado", "suspendido", "aplazado"], a: 0 },
        { l: "B1", s: "Wir müssen eine <b>Entscheidung</b> treffen.", o: ["reunión", "decisión", "diferencia"], a: 1 },
        { l: "B1", s: "Er ist für das Projekt <b>verantwortlich</b>.", o: ["contento", "cansado", "responsable"], a: 2 },
        { l: "B1", s: "Ich bin mit dem Ergebnis <b>zufrieden</b>.", o: ["satisfecho", "sorprendido", "preocupado"], a: 0 },
        { l: "B2", s: "Die Regierung hat neue <b>Maßnahmen</b> ergriffen.", o: ["máquinas", "medidas", "mensajes"], a: 1 },
        { l: "B2", s: "Das Angebot ist zeitlich <b>begrenzt</b>.", o: ["gratuito", "ampliado", "limitado"], a: 2 },
        { l: "B2", s: "Er hat seine Meinung deutlich <b>geäußert</b>.", o: ["expresado", "cambiado", "ocultado"], a: 0 },
        { l: "B2", s: "Die Kosten haben sich <b>verdoppelt</b>.", o: ["reducido a la mitad", "duplicado", "mantenido"], a: 1 },
        { l: "B2", s: "Wir sollten die Vor- und Nachteile <b>abwägen</b>.", o: ["eliminar", "copiar", "sopesar"], a: 2 },
        { l: "B2", s: "Die Ergebnisse sind nicht <b>aussagekräftig</b>.", o: ["concluyentes", "publicados", "correctos"], a: 0 },
        { l: "B2", s: "Trotz aller Bemühungen ist das Projekt <b>gescheitert</b>.", o: ["terminado a tiempo", "fracasado", "retrasado"], a: 1 }
    ];

    var RF = ["Richtig", "Falsch", "Steht nicht im Text"];
    var READING = [
        {
            l: "B1", title: "Lenas Erasmus-Pläne",
            text: "Lena studiert Wirtschaft in Köln. Im nächsten Semester möchte sie ein Erasmus-Semester in Valencia machen. Sie hat schon einen Spanischkurs an der Uni besucht, aber sie spricht noch nicht fließend. Deshalb will sie im Sommer einen Intensivkurs in Spanien machen. Ein Zimmer hat sie noch nicht gefunden. Ihre Freundin Mara, die letztes Jahr in Valencia war, hat ihr geraten, zuerst in einem Hostel zu wohnen und vor Ort eine Wohnung zu suchen. Lena findet das stressig, aber sie glaubt, dass es die beste Lösung ist. Am meisten freut sie sich darauf, neue Leute aus vielen Ländern kennenzulernen.",
            qs: [
                { q: "Lena spricht schon sehr gut Spanisch.", o: RF, a: 1 },
                { q: "Lena will im Sommer einen Sprachkurs in Spanien machen.", o: RF, a: 0 },
                { q: "Mara hat in Valencia Wirtschaft studiert.", o: RF, a: 2 },
                { q: "Lena hat schon eine Wohnung in Valencia.", o: RF, a: 1 },
                { q: "Lena freut sich besonders auf Kontakte mit Menschen aus anderen Ländern.", o: RF, a: 0 }
            ]
        },
        {
            l: "B2", title: "Studieren online",
            text: "Immer mehr Universitäten bieten Kurse komplett online an. Befürworter betonen, dass Studierende dadurch flexibler sind: Wer neben dem Studium arbeitet oder Kinder hat, kann die Vorlesungen dann ansehen, wenn es zeitlich passt. Außerdem sparen Universitäten Kosten für Räume. Kritiker halten dagegen, dass gerade der persönliche Austausch einen wesentlichen Teil des Studiums ausmache. Eine Studie der Universität Hamburg zeigt, dass Studierende in reinen Online-Kursen häufiger abbrechen als in Präsenzkursen. Allerdings betonen die Forscher, dass der Unterschied deutlich kleiner wird, wenn die Kurse regelmäßige Videotreffen in kleinen Gruppen enthalten. Viele Hochschulen setzen deshalb inzwischen auf ein gemischtes Modell: Die Theorie wird online vermittelt, während Diskussionen und praktische Übungen vor Ort stattfinden. Ob sich dieses Modell langfristig durchsetzt, hängt laut Experten vor allem davon ab, wie gut die Lehrenden darauf vorbereitet werden.",
            qs: [
                { q: "Was ist laut den Befürwortern ein Vorteil von Online-Kursen?", o: ["Studierende können ihre Zeit selbst einteilen.", "Die Noten werden besser.", "Es gibt mehr Kontakt zu den Lehrenden."], a: 0 },
                { q: "Was zeigt die Studie aus Hamburg?", o: ["Online-Kurse sind teurer.", "In reinen Online-Kursen brechen mehr Studierende ab.", "Präsenzkurse werden seltener besucht."], a: 1 },
                { q: "Wann wird der Unterschied kleiner?", o: ["Wenn die Kurse kürzer sind.", "Wenn die Studierenden nebenbei arbeiten.", "Wenn es regelmäßige Treffen in kleinen Gruppen gibt."], a: 2 },
                { q: "Was ist das „gemischte Modell“?", o: ["Theorie online, Diskussionen und Übungen vor Ort.", "Ein Semester online, ein Semester vor Ort.", "Online-Kurse nur für berufstätige Studierende."], a: 0 },
                { q: "Wovon hängt der Erfolg des Modells laut Experten ab?", o: ["Von den Kosten für Räume.", "Davon, wie gut die Lehrenden vorbereitet werden.", "Von der Technik der Studierenden."], a: 1 }
            ]
        }
    ];

    var LISTENING = [
        {
            l: "B1", title: "Eine Durchsage",
            text: "Liebe Studierende, eine kurze Information zum Erasmus-Treffen. Das Treffen findet nicht wie geplant am Dienstag statt, sondern am Donnerstag um vierzehn Uhr. Wir treffen uns im Raum zweihundertvier im zweiten Stock, nicht in der Bibliothek. Bitte bringt euren Personalausweis und eine Kopie eurer Immatrikulationsbescheinigung mit. Wer am Donnerstag keine Zeit hat, kann uns bis Mittwoch eine E-Mail schreiben.",
            qs: [
                { q: "Wann ist das Treffen?", o: ["Am Dienstag um 14 Uhr", "Am Donnerstag um 14 Uhr", "Am Mittwoch um 14 Uhr"], a: 1 },
                { q: "Wo ist das Treffen?", o: ["In der Bibliothek", "Im Erdgeschoss", "In Raum 204"], a: 2 },
                { q: "Was soll man mitbringen?", o: ["Den Ausweis und eine Kopie der Immatrikulationsbescheinigung", "Nur den Ausweis", "Ein Foto und den Ausweis"], a: 0 },
                { q: "Was macht man, wenn man am Donnerstag keine Zeit hat?", o: ["Man kommt am Dienstag.", "Man schreibt bis Mittwoch eine E-Mail.", "Man ruft im Büro an."], a: 1 }
            ]
        },
        {
            l: "B2", title: "Sprache lernen im Ausland",
            text: "Viele glauben, dass man eine Sprache am besten im Ausland lernt. Das stimmt zum Teil, aber nur, wenn man die Gelegenheit auch nutzt. Während meines Erasmus-Jahres in Leipzig habe ich erlebt, dass viele internationale Studierende fast nur Englisch miteinander gesprochen haben. Das ist bequem, aber man lernt dabei kaum Deutsch. Ich habe mich deshalb bewusst für eine Wohngemeinschaft mit deutschen Mitbewohnern entschieden. Am Anfang war das anstrengend, weil ich vieles nicht verstanden habe. Nach etwa drei Monaten konnte ich aber den Gesprächen am Küchentisch problemlos folgen. Mein Tipp: Sucht euch ein Hobby, bei dem ihr Deutsch sprechen müsst, zum Beispiel in einem Sportverein.",
            qs: [
                { q: "Was sagt die Person über das Lernen im Ausland?", o: ["Es ist der einzige Weg, eine Sprache zu lernen.", "Es hilft nur, wenn man die Chance aktiv nutzt.", "Es wird überschätzt."], a: 1 },
                { q: "Was hat die Person in Leipzig beobachtet?", o: ["Viele internationale Studierende sprachen untereinander Englisch.", "Die Kurse waren zu schwer.", "Es gab zu wenige Wohnungen."], a: 0 },
                { q: "Warum war der Anfang in der WG anstrengend?", o: ["Die Mitbewohner waren unfreundlich.", "Die WG war zu laut.", "Die Person hat vieles nicht verstanden."], a: 2 },
                { q: "Was empfiehlt die Person?", o: ["Mehr Grammatik zu lernen.", "Ein Hobby, bei dem man Deutsch sprechen muss.", "In eine größere Stadt zu ziehen."], a: 1 }
            ]
        }
    ];

    var WRITING = {
        task: "In einem Online-Forum wird diskutiert: „Sollten alle Studierenden ein Auslandssemester machen?“ Schreiben Sie Ihre Meinung (ca. 120 bis 150 Wörter). Nennen Sie Vorteile und Nachteile und schreiben Sie über Ihre eigenen Pläne.",
        minutes: 25
    };

    // ---------- Scoring ----------
    var LEVELS = ["A1", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1"];
    var NUM = { A1: 1, A2: 2, "A2+": 2.5, B1: 3, "B1+": 3.5, B2: 4, "B2+": 4.5, C1: 5 };

    // items: [{l: "A2"|"B1"|"B2", ok: bool}]
    function bandLevel(items) {
        var acc = {};
        ["A2", "B1", "B2"].forEach(function (b) {
            var xs = items.filter(function (i) { return i.l === b; });
            acc[b] = xs.length ? xs.filter(function (i) { return i.ok; }).length / xs.length : null;
        });
        var a2 = acc.A2, b1 = acc.B1, b2 = acc.B2;
        var b1ok = b1 === null || b1 >= 0.7;
        if (b2 !== null && b2 >= 0.6 && b1ok) return { level: b2 >= 0.85 ? "B2+" : "B2", acc: acc };
        if (b2 !== null && b2 >= 0.4 && b1 !== null && b1 >= 0.7) return { level: "B1+", acc: acc };
        if (b1 !== null && b1 >= 0.6) return { level: "B1", acc: acc };
        if ((b1 !== null && b1 >= 0.4) || (a2 !== null && a2 >= 0.8)) return { level: "A2+", acc: acc };
        if (a2 === null || a2 >= 0.5) return { level: "A2", acc: acc };
        return { level: "A1", acc: acc };
    }
    function nearestLabel(n) {
        var best = "A1";
        LEVELS.forEach(function (l) { if (Math.abs(NUM[l] - n) < Math.abs(NUM[best] - n)) best = l; });
        return best;
    }
    // skills: {grammar: {level}, ...}; writing optional
    var WEIGHTS = { grammar: 0.3, vocab: 0.2, reading: 0.2, listening: 0.15, writing: 0.15 };
    function overall(skills) {
        var sum = 0, w = 0;
        Object.keys(WEIGHTS).forEach(function (k) {
            if (skills[k] && skills[k].level) { sum += NUM[skills[k].level] * WEIGHTS[k]; w += WEIGHTS[k]; }
        });
        return w ? nearestLabel(sum / w) : null;
    }

    // ---------- Grounded projection to exam day ----------
    // Rule of thumb: ~200 focused hours move one CEFR band around B1-B2. The low end assumes half that
    // progress, the high end all of it; the low end is rounded down, the high end to the nearest half step.
    var DAY_HOURS = { normal: 7, Mock: 6, Gate: 6, Test: 5, dl: 2 };
    function hoursLeft(from) {
        var plan = window.PLAN, h = 0;
        if (!plan) return 0;
        plan.days.forEach(function (d) {
            if (d[0] < from || d[0] >= plan.examStart) return;
            h += d[1] === "dl" ? DAY_HOURS.dl : (DAY_HOURS[d[2]] || DAY_HOURS.normal);
        });
        return h;
    }
    function floorHalf(n) { return Math.floor(n * 2) / 2; }
    function project(level, from) {
        if (!level || !NUM[level]) return null;
        var h = hoursLeft(from), gain = Math.min(h / 200, 1), cur = NUM[level];
        var low = nearestLabel(Math.min(5, floorHalf(cur + gain * 0.5))), high = nearestLabel(Math.min(5, cur + gain));
        return { hours: h, low: low, high: high };
    }

    window.LevelTest = {
        project: project, hoursLeft: hoursLeft,
        VOCAB: VOCAB, READING: READING, LISTENING: LISTENING, WRITING: WRITING,
        LEVELS: LEVELS, NUM: NUM, bandLevel: bandLevel, overall: overall,
        SKILL_NAMES: { grammar: "Grammar", vocab: "Vocabulary", reading: "Reading", listening: "Listening", writing: "Writing" }
    };
})();
