#target illustrator
/*
  Calendar Generator for Adobe Illustrator
  - Any year (1000-9999)
  - English or Bangla (months, weekdays, digits)
  - Week start: Sunday / Monday / Saturday
  - Weekend highlight: Sun / Sat+Sun / Fri / Fri+Sat
  - Layout: one page (12 months) OR 12 artboards (one per month)
  Usage: File > Scripts > Other Script... > select this file
*/
(function () {

    var MONTHS = {
        en: ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"],
        bn: ["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09bf", "\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09bf", "\u09ae\u09be\u09b0\u09cd\u099a", "\u098f\u09aa\u09cd\u09b0\u09bf\u09b2", "\u09ae\u09c7", "\u099c\u09c1\u09a8",
             "\u099c\u09c1\u09b2\u09be\u0987", "\u0986\u0997\u09b8\u09cd\u099f", "\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0", "\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0", "\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0", "\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"]
    };
    var WEEK = {
        en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        bn: ["\u09b0\u09ac\u09bf", "\u09b8\u09cb\u09ae", "\u09ae\u0999\u09cd\u0997\u09b2", "\u09ac\u09c1\u09a7", "\u09ac\u09c3\u09b9", "\u09b6\u09c1\u0995\u09cd\u09b0", "\u09b6\u09a8\u09bf"]
    };
    var BN_DIGITS = ["\u09e6", "\u09e7", "\u09e8", "\u09e9", "\u09ea", "\u09eb", "\u09ec", "\u09ed", "\u09ee", "\u09ef"];

    // Bangladesh revised Bangla calendar (Bangabda): Pohela Boishakh = 14 April
    var BN_MONTHS = ["\u09ac\u09c8\u09b6\u09be\u0996", "\u099c\u09cd\u09af\u09c8\u09b7\u09cd\u09a0", "\u0986\u09b7\u09be\u09a2\u09bc", "\u09b6\u09cd\u09b0\u09be\u09ac\u09a3", "\u09ad\u09be\u09a6\u09cd\u09b0", "\u0986\u09b6\u09cd\u09ac\u09bf\u09a8",
                     "\u0995\u09be\u09b0\u09cd\u09a4\u09bf\u0995", "\u0985\u0997\u09cd\u09b0\u09b9\u09be\u09af\u09bc\u09a3", "\u09aa\u09cc\u09b7", "\u09ae\u09be\u0998", "\u09ab\u09be\u09b2\u09cd\u0997\u09c1\u09a8", "\u099a\u09c8\u09a4\u09cd\u09b0"];
    // [gregorian month (0-11), gregorian day, bangla month index] in calendar order
    var BN_STARTS = [[0, 14, 9], [1, 13, 10], [2, 15, 11], [3, 14, 0], [4, 15, 1], [5, 15, 2],
                     [6, 16, 3], [7, 16, 4], [8, 16, 5], [9, 16, 6], [10, 15, 7], [11, 15, 8]];

    // Fixed-date holidays / special days (every year)
    // [month(0-11), day, English, Bangla, type H=public holiday S=special day, from year]
    var FIXED_HOLIDAYS = [
        [1, 21, "Language Martyrs' Day", "\u09b6\u09b9\u09c0\u09a6 \u0993 \u09ae\u09be\u09a4\u09c3\u09ad\u09be\u09b7\u09be \u09a6\u09bf\u09ac\u09b8", "H", 1952],
        [2, 8,  "Intl. Women's Day", "\u0986\u09a8\u09cd\u09a4\u09b0\u09cd\u099c\u09be\u09a4\u09bf\u0995 \u09a8\u09be\u09b0\u09c0 \u09a6\u09bf\u09ac\u09b8", "S", 1900],
        [2, 25, "Genocide Day", "\u0997\u09a3\u09b9\u09a4\u09cd\u09af\u09be \u09a6\u09bf\u09ac\u09b8", "S", 2017],
        [2, 26, "Independence Day", "\u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8\u09a4\u09be \u09a6\u09bf\u09ac\u09b8", "H", 1972],
        [3, 14, "Pohela Boishakh", "\u09aa\u09b9\u09c7\u09b2\u09be \u09ac\u09c8\u09b6\u09be\u0996", "H", 1900],
        [4, 1,  "May Day", "\u09ae\u09c7 \u09a6\u09bf\u09ac\u09b8", "H", 1900],
        [7, 5,  "July Uprising Day", "\u099c\u09c1\u09b2\u09be\u0987 \u0997\u09a3\u0985\u09ad\u09cd\u09af\u09c1\u09a4\u09cd\u09a5\u09be\u09a8 \u09a6\u09bf\u09ac\u09b8", "H", 2025],
        [11, 14, "Martyred Intellectuals Day", "\u09b6\u09b9\u09c0\u09a6 \u09ac\u09c1\u09a6\u09cd\u09a7\u09bf\u099c\u09c0\u09ac\u09c0 \u09a6\u09bf\u09ac\u09b8", "S", 1972],
        [11, 16, "Victory Day", "\u09ac\u09bf\u099c\u09af\u09bc \u09a6\u09bf\u09ac\u09b8", "H", 1972],
        [11, 25, "Christmas Day", "\u09ac\u09a1\u09bc\u09a6\u09bf\u09a8", "H", 1900]
    ];

    // Moon-dependent / year-specific holidays. Add more years here (same format, no "from year").
    var YEAR_HOLIDAYS = {
        2026: [
            [1, 4,   "Shab-e-Barat", "\u09b6\u09ac\u09c7 \u09ac\u09b0\u09be\u09a4", "H"],
            [2, 20,  "Jumatul Bida", "\u099c\u09c1\u09ae\u09be\u09a4\u09c1\u09b2 \u09ac\u09bf\u09a6\u09be", "H"],
            [2, 21,  "Eid-ul-Fitr", "\u0988\u09a6\u09c1\u09b2 \u09ab\u09bf\u09a4\u09b0", "H"],
            [4, 1,   "Buddha Purnima", "\u09ac\u09c1\u09a6\u09cd\u09a7 \u09aa\u09c2\u09b0\u09cd\u09a3\u09bf\u09ae\u09be", "H"],
            [4, 28,  "Eid-ul-Adha", "\u0988\u09a6\u09c1\u09b2 \u0986\u09af\u09b9\u09be", "H"],
            [5, 26,  "Ashura", "\u0986\u09b6\u09c1\u09b0\u09be", "H"],
            [7, 26,  "Eid-e-Miladunnabi", "\u0988\u09a6\u09c7 \u09ae\u09bf\u09b2\u09be\u09a6\u09c1\u09a8\u09cd\u09a8\u09ac\u09c0", "H"],
            [8, 4,   "Janmashtami", "\u099c\u09a8\u09cd\u09ae\u09be\u09b7\u09cd\u099f\u09ae\u09c0", "H"],
            [9, 20,  "Durga Puja (Navami)", "\u09a6\u09c1\u09b0\u09cd\u0997\u09be\u09aa\u09c2\u099c\u09be (\u09a8\u09ac\u09ae\u09c0)", "H"],
            [9, 21,  "Durga Puja (Dashami)", "\u09a6\u09c1\u09b0\u09cd\u0997\u09be\u09aa\u09c2\u099c\u09be (\u09a6\u09b6\u09ae\u09c0)", "H"]
        ]
    };

    var PAGE_W = 1190.55;   // A3 landscape (points)
    var PAGE_H = 841.89;

    // ---------- helpers ----------
    function rgb(r, g, b) {
        var c = new RGBColor();
        c.red = r; c.green = g; c.blue = b;
        return c;
    }
    var C = {
        dark:    rgb(33, 37, 41),
        accent:  rgb(27, 94, 140),
        weekend: rgb(214, 40, 40),
        headBg:  rgb(232, 238, 244),
        white:   rgb(255, 255, 255),
        line:    rgb(200, 208, 216),
        bnMuted: rgb(70, 110, 150),
        bnWknd:  rgb(200, 90, 90),
        holBg:   rgb(253, 226, 226),
        special: rgb(30, 140, 90)
    };

    function num(n, bn) {
        var s = String(n);
        if (!bn) return s;
        var out = "";
        for (var i = 0; i < s.length; i++) {
            out += BN_DIGITS[parseInt(s.charAt(i), 10)];
        }
        return out;
    }

    function isLeap(y) {
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }

    function daysIn(y, m) {
        var d = [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return d[m];
    }

    function firstWeekday(y, m) {      // 0 = Sunday
        var d = new Date(2000, 0, 1);
        d.setFullYear(y);
        d.setMonth(m);
        d.setDate(1);
        return d.getDay();
    }

    function doy(y, m, d) {
        var s = d;
        for (var i = 0; i < m; i++) s += daysIn(y, i);
        return s;
    }

    // Gregorian -> Bangla date  {y, m, d}
    function bnDate(y, m, d) {
        var yr = (m > 3 || (m === 3 && d >= 14)) ? y - 593 : y - 594;
        var cur = doy(y, m, d);
        var found = -1;
        for (var i = 0; i < 12; i++) {
            var st = BN_STARTS[i];
            if (m > st[0] || (m === st[0] && d >= st[1])) found = i;
        }
        if (found < 0) {                       // 1 Jan - 13 Jan = Poush (from 15 Dec)
            return { y: yr, m: 8, d: cur + 17 };
        }
        var st2 = BN_STARTS[found];
        return { y: yr, m: st2[2], d: cur - doy(y, st2[0], st2[1]) + 1 };
    }

    function bnMonthLabel(y, m) {
        var a = bnDate(y, m, 1);
        var b = bnDate(y, m, daysIn(y, m));
        if (a.m === b.m) return BN_MONTHS[a.m] + " " + num(a.y, true);
        if (a.y === b.y) return BN_MONTHS[a.m] + " - " + BN_MONTHS[b.m] + " " + num(a.y, true);
        return BN_MONTHS[a.m] + " " + num(a.y, true) + " - " + BN_MONTHS[b.m] + " " + num(b.y, true);
    }

    function bnYearLabel(y) {
        return "\u09ac\u0999\u09cd\u0997\u09be\u09ac\u09cd\u09a6 " + num(y - 594, true) + "\u2013" + num(y - 593, true);
    }

    function trim(t) { return t.replace(/^\s+|\s+$/g, ""); }

    // Returns map "month-day" -> [ {en, bn, type} ]
    function buildHolidays(year, extraText) {
        var map = {};
        function add(m, d, en, bn, type) {
            var k = m + "-" + d;
            if (!map[k]) map[k] = [];
            map[k].push({ en: en, bn: bn, type: type });
        }
        var i, h;
        for (i = 0; i < FIXED_HOLIDAYS.length; i++) {
            h = FIXED_HOLIDAYS[i];
            if (year >= h[5]) add(h[0], h[1], h[2], h[3], h[4]);
        }
        var yl = YEAR_HOLIDAYS[year];
        if (yl) {
            for (i = 0; i < yl.length; i++) {
                h = yl[i];
                add(h[0], h[1], h[2], h[3], h[4]);
            }
        }
        // custom lines:  YYYY-MM-DD, Name | Bangla name, H/S     (or MM-DD, ...)
        var lines = (extraText || "").split(/\r\n|\r|\n/);
        for (i = 0; i < lines.length; i++) {
            var ln = trim(lines[i]);
            if (ln === "" || ln.charAt(0) === "#") continue;
            var parts = ln.split(",");
            if (parts.length < 2) continue;
            var mt = trim(parts[0]).match(/^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/);
            if (!mt) continue;
            if (mt[1] && parseInt(mt[1], 10) !== year) continue;
            var mo = parseInt(mt[2], 10) - 1, dy = parseInt(mt[3], 10);
            if (mo < 0 || mo > 11 || dy < 1 || dy > daysIn(year, mo)) continue;
            var np = trim(parts[1]).split("|");
            var en = trim(np[0]);
            var bn = np.length > 1 ? trim(np[1]) : en;
            var tp = parts.length > 2 ? trim(parts[2]).toUpperCase() : "H";
            add(mo, dy, en, bn, tp === "S" ? "S" : "H");
        }
        return map;
    }

    function drawLegend(layer, o, cx, y) {
        if (!o.showHol) return;
        var g = layer.groupItems.add();
        g.name = "Legend";
        var s = 10;
        var r = g.pathItems.rectangle(y + s * 0.8, cx - 150, s, s);
        r.filled = true; r.fillColor = C.holBg;
        r.stroked = true; r.strokeColor = C.weekend; r.strokeWidth = 0.75;
        addText(g, o.bn ? "\u09b8\u09b0\u0995\u09be\u09b0\u09bf \u099b\u09c1\u099f\u09bf" : "Public holiday", cx - 134, y, s + 1,
                C.dark, o.fontReg, Justification.LEFT);
        var dot = g.pathItems.ellipse(y + s * 0.8, cx + 30, s * 0.8, s * 0.8);
        dot.stroked = false; dot.filled = true; dot.fillColor = C.special;
        addText(g, o.bn ? "\u09ac\u09bf\u09b6\u09c7\u09b7 \u09a6\u09bf\u09ac\u09b8" : "Special day", cx + 46, y, s + 1,
                C.dark, o.fontReg, Justification.LEFT);
    }

    function findFont(names) {
        for (var i = 0; i < names.length; i++) {
            try { return app.textFonts.getByName(names[i]); } catch (e) {}
        }
        return null;
    }

    function addText(group, str, x, y, size, color, font, just) {
        var tf = group.textFrames.pointText([x, y]);
        tf.contents = str;
        var ca = tf.textRange.characterAttributes;
        ca.size = size;
        ca.fillColor = color;
        if (font) { try { ca.textFont = font; } catch (e) {} }
        tf.textRange.paragraphAttributes.justification = just;
        return tf;
    }

    function addRect(group, left, top, w, h, fill) {
        var r = group.pathItems.rectangle(top, left, w, h);
        r.stroked = false;
        r.filled = true;
        r.fillColor = fill;
        return r;
    }

    // ---------- dialog ----------
    function showDialog() {
        var dlg = new Window("dialog", "Calendar Generator");
        dlg.orientation = "column";
        dlg.alignChildren = "fill";

        var p = dlg.add("panel", undefined, "Settings");
        p.orientation = "column";
        p.alignChildren = "left";

        function row(label) {
            var g = p.add("group");
            g.orientation = "row";
            var t = g.add("statictext", undefined, label);
            t.preferredSize.width = 120;
            return g;
        }

        var yearIn = row("Year:").add("edittext", undefined, String(new Date().getFullYear()));
        yearIn.preferredSize.width = 160;

        var langDD = row("Language:").add("dropdownlist", undefined, ["English", "Bangla"]);
        langDD.preferredSize.width = 160; langDD.selection = 0;

        var startDD = row("Week starts on:").add("dropdownlist", undefined, ["Sunday", "Monday", "Saturday"]);
        startDD.preferredSize.width = 160; startDD.selection = 0;

        var wkndDD = row("Weekend color:").add("dropdownlist", undefined,
            ["Sunday", "Saturday + Sunday", "Friday", "Friday + Saturday"]);
        wkndDD.preferredSize.width = 160; wkndDD.selection = 0;

        var layoutDD = row("Layout:").add("dropdownlist", undefined,
            ["One page (12 months)", "12 artboards (1 per month)"]);
        layoutDD.preferredSize.width = 160; layoutDD.selection = 0;

        var bnChk = p.add("checkbox", undefined, "Show Bangla date (Bangladesh revised calendar)");
        bnChk.value = true;

        var holChk = p.add("checkbox", undefined, "Show public holidays & special days");
        holChk.value = true;
        p.add("statictext", undefined,
              "Extra days, one per line: YYYY-MM-DD, Name | Bangla name, H (holiday) or S (special)");
        var extraIn = p.add("edittext", undefined, "", { multiline: true, scrolling: true });
        extraIn.preferredSize = [380, 60];

        var fontIn = row("Font (optional):").add("edittext", undefined, "");
        fontIn.preferredSize.width = 160;

        var note = p.add("statictext", undefined,
            "Font = PostScript name (e.g. NirmalaUI). Leave blank for auto.", { multiline: false });

        var bg = dlg.add("group");
        bg.alignment = "right";
        bg.add("button", undefined, "Create", { name: "ok" });
        bg.add("button", undefined, "Cancel", { name: "cancel" });

        if (dlg.show() !== 1) return null;

        var y = parseInt(yearIn.text, 10);
        if (isNaN(y) || y < 1000 || y > 9999) {
            alert("Please enter a valid year (1000 - 9999).");
            return null;
        }

        var weekendSets = [[0], [6, 0], [5], [5, 6]];
        var weekend = [false, false, false, false, false, false, false];
        var ws = weekendSets[wkndDD.selection.index];
        for (var i = 0; i < ws.length; i++) weekend[ws[i]] = true;

        return {
            year: y,
            bn: langDD.selection.index === 1,
            start: [0, 1, 6][startDD.selection.index],
            weekend: weekend,
            multi: layoutDD.selection.index === 1,
            showBn: bnChk.value,
            showHol: holChk.value,
            extra: extraIn.text,
            fontName: fontIn.text.replace(/^\s+|\s+$/g, "")
        };
    }

    // ---------- draw one month ----------
    function drawMonth(layer, o, m, left, top, w, h) {
        var g = layer.groupItems.add();
        g.name = o.months[m];

        var dim = daysIn(o.year, m);
        var th = h * (o.showBn ? 0.17 : 0.14);   // title band
        var hh = h * 0.09;                       // weekday header
        var nh = o.showHol ? h * 0.15 : 0;       // notes area (holiday list)
        var rowH = (h - th - hh - nh) / 6;       // 6 week rows
        var cw = w / 7;

        // holidays of this month
        var items = [], d, j, list;
        if (o.showHol) {
            for (d = 1; d <= dim; d++) {
                list = o.hol[m + "-" + d];
                if (list) for (j = 0; j < list.length; j++) items.push({ d: d, h: list[j] });
            }
        }

        // title band
        addRect(g, left, top, w, th, C.accent);
        var tSize = th * (o.showBn ? 0.40 : 0.5);
        var tBase = o.showBn ? top - th * 0.42 : top - th / 2 - tSize * 0.35;
        addText(g, o.months[m], left + w / 2, tBase, tSize, C.white, o.fontBold, Justification.CENTER);
        if (o.showBn) {
            addText(g, bnMonthLabel(o.year, m), left + w / 2, top - th * 0.83, th * 0.20,
                    C.white, o.fontBnReg, Justification.CENTER);
        }

        // weekday header
        addRect(g, left, top - th, w, hh, C.headBg);
        var hSize = hh * 0.42, i, wd;
        for (i = 0; i < 7; i++) {
            wd = (o.start + i) % 7;
            addText(g, o.wk[wd], left + cw * i + cw / 2, top - th - hh / 2 - hSize * 0.35,
                    hSize, o.weekend[wd] ? C.weekend : C.dark, o.fontBold, Justification.CENTER);
        }

        // days
        var offset = (firstWeekday(o.year, m) - o.start + 7) % 7;
        var gSize = Math.min(rowH, cw) * (o.showBn ? 0.38 : 0.42);
        var bSize = gSize * 0.6;
        for (d = 1; d <= dim; d++) {
            var idx = offset + d - 1;
            var r = Math.floor(idx / 7);
            var c = idx % 7;
            wd = (o.start + c) % 7;
            var cellTop = top - th - hh - rowH * r;
            var cx = left + cw * c + cw / 2;
            var cy = cellTop - rowH / 2;

            var isHol = false, isSp = false;
            list = o.showHol ? o.hol[m + "-" + d] : null;
            if (list) {
                for (j = 0; j < list.length; j++) {
                    if (list[j].type === "H") isHol = true; else isSp = true;
                }
            }
            var red = o.weekend[wd] || isHol;

            if (isHol) addRect(g, left + cw * c + 1, cellTop - 1, cw - 2, rowH - 2, C.holBg);
            if (isSp) {
                var dd = Math.min(rowH, cw) * 0.14;
                var dot = g.pathItems.ellipse(cellTop - 2, left + cw * (c + 1) - dd - 3, dd, dd);
                dot.stroked = false; dot.filled = true; dot.fillColor = C.special;
            }

            var gy = o.showBn ? cy + rowH * 0.12 : cy;
            addText(g, num(d, o.bn), cx, gy - gSize * 0.35, gSize,
                    red ? C.weekend : C.dark, isHol ? o.fontBold : o.fontReg, Justification.CENTER);

            if (o.showBn) {
                var bd = bnDate(o.year, m, d);
                addText(g, num(bd.d, true), cx, cy - rowH * 0.27 - bSize * 0.35, bSize,
                        red ? C.bnWknd : C.bnMuted, o.fontBnReg, Justification.CENTER);
            }
        }

        // holiday list under the grid
        if (items.length > 0) {
            var lines = Math.ceil(items.length / 2);
            var texts = [], maxLen = 1;
            for (i = 0; i < items.length; i++) {
                var str = num(items[i].d, o.bn) + " - " + (o.bn ? items[i].h.bn : items[i].h.en);
                texts.push(str);
                if (str.length > maxLen) maxLen = str.length;
            }
            var regionTop = top - th - hh - rowH * 6;
            var lh = nh / lines;
            var fs = Math.min(lh * 0.78, (w / 2 - 8) / (maxLen * 0.6), Math.max(9, w * 0.016));
            for (i = 0; i < items.length; i++) {
                var col = Math.floor(i / lines), rw = i % lines;
                addText(g, texts[i], left + col * (w / 2) + 4,
                        regionTop - lh * (rw + 0.5) - fs * 0.35, fs,
                        items[i].h.type === "H" ? C.weekend : C.special, o.fontReg, Justification.LEFT);
            }
        }

        // bottom line
        addRect(g, left, top - h + 1, w, 1, C.line);
    }

    // ---------- main ----------
    var o = showDialog();
    if (!o) return;

    var lang = o.bn ? "bn" : "en";
    o.months = MONTHS[lang];
    o.wk = WEEK[lang];

    // fonts
    var regNames = o.fontName ? [o.fontName] : [];
    var boldNames = o.fontName ? [o.fontName] : [];
    if (o.bn) {
        regNames = regNames.concat(["NirmalaUI", "KohinoorBangla-Regular", "Vrinda", "Shonar-Bangla", "SolaimanLipi"]);
        boldNames = boldNames.concat(["NirmalaUI-Bold", "KohinoorBangla-Semibold"]);
    } else {
        regNames = regNames.concat(["ArialMT", "Helvetica", "MyriadPro-Regular"]);
        boldNames = boldNames.concat(["Arial-BoldMT", "Helvetica-Bold", "MyriadPro-Bold"]);
    }
    o.fontReg = findFont(regNames);
    o.fontBold = findFont(boldNames) || o.fontReg;

    // Bangla fonts (always needed for the Bangla date)
    var bnRegNames = (o.bn && o.fontName ? [o.fontName] : []).concat(
        ["NirmalaUI", "KohinoorBangla-Regular", "Vrinda", "Shonar-Bangla", "SolaimanLipi"]);
    o.fontBnReg = findFont(bnRegNames);
    o.fontBnBold = findFont(["NirmalaUI-Bold", "KohinoorBangla-Semibold", "Vrinda-Bold"]) || o.fontBnReg;

    o.hol = o.showHol ? buildHolidays(o.year, o.extra) : {};

    var doc = app.documents.add(DocumentColorSpace.RGB, PAGE_W, PAGE_H);
    var layer = doc.layers[0];
    layer.name = "Calendar " + o.year;

    var ab = doc.artboards[0].artboardRect;   // [left, top, right, bottom]
    var L = ab[0], T = ab[1];
    var yearStr = num(o.year, o.bn);
    var m;

    if (!o.multi) {
        // ---- one page, 4 x 3 grid ----
        var margin = 40, gap = 24, headerH = o.showBn ? 105 : 80;
        var bw = (PAGE_W - 2 * margin - 3 * gap) / 4;
        var bh = (PAGE_H - 2 * margin - headerH - 2 * gap) / 3;

        var yg = layer.groupItems.add();
        yg.name = "Year";
        addText(yg, yearStr, L + PAGE_W / 2, T - margin - 52, 56, C.accent,
                o.fontBold, Justification.CENTER);
        if (o.showBn) {
            addText(yg, bnYearLabel(o.year), L + PAGE_W / 2, T - margin - 84, 20, C.dark,
                    o.fontBnBold, Justification.CENTER);
        }

        var top0 = T - margin - headerH;
        for (m = 0; m < 12; m++) {
            var col = m % 4, rw = Math.floor(m / 4);
            drawMonth(layer, o, m,
                      L + margin + col * (bw + gap),
                      top0 - rw * (bh + gap), bw, bh);
        }
        drawLegend(layer, o, L + PAGE_W / 2, T - PAGE_H + margin * 0.45);
        doc.artboards[0].name = String(o.year);
    } else {
        // ---- 12 artboards ----
        var spacing = 60;
        for (m = 0; m < 12; m++) {
            var left = L + m * (PAGE_W + spacing);
            if (m > 0) {
                doc.artboards.add([left, T, left + PAGE_W, T - PAGE_H]);
            }
            doc.artboards[m].name = o.months[m] + " " + o.year;

            var mg = 60, hdr = o.showBn ? 95 : 70;
            var yg2 = layer.groupItems.add();
            yg2.name = "Year " + (m + 1);
            addText(yg2, yearStr, left + PAGE_W / 2, T - mg - 38, 44, C.accent,
                    o.fontBold, Justification.CENTER);
            if (o.showBn) {
                addText(yg2, bnYearLabel(o.year), left + PAGE_W / 2, T - mg - 68, 18, C.dark,
                        o.fontBnBold, Justification.CENTER);
            }

            drawMonth(layer, o, m, left + mg, T - mg - hdr,
                      PAGE_W - 2 * mg, PAGE_H - 2 * mg - hdr);
            drawLegend(layer, o, left + PAGE_W / 2, T - PAGE_H + mg * 0.45);
        }
    }

    try { app.executeMenuCommand("fitall"); } catch (e) {}
    app.redraw();
    alert("Calendar " + o.year + " created.");

})();
