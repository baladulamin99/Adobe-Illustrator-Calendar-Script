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
        line:    rgb(200, 208, 216)
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
            fontName: fontIn.text.replace(/^\s+|\s+$/g, "")
        };
    }

    // ---------- draw one month ----------
    function drawMonth(layer, o, m, left, top, w, h) {
        var g = layer.groupItems.add();
        g.name = o.months[m];

        var th = h * 0.14;               // title band
        var hh = h * 0.09;               // weekday header
        var rowH = (h - th - hh) / 6;    // 6 week rows
        var cw = w / 7;

        // title band
        addRect(g, left, top, w, th, C.accent);
        var tSize = th * 0.5;
        addText(g, o.months[m], left + w / 2, top - th / 2 - tSize * 0.35,
                tSize, C.white, o.fontBold, Justification.CENTER);

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
        var dim = daysIn(o.year, m);
        var dSize = Math.min(rowH, cw) * 0.42;
        for (var d = 1; d <= dim; d++) {
            var idx = offset + d - 1;
            var r = Math.floor(idx / 7);
            var c = idx % 7;
            wd = (o.start + c) % 7;
            var cx = left + cw * c + cw / 2;
            var cy = top - th - hh - rowH * r - rowH / 2;
            addText(g, num(d, o.bn), cx, cy - dSize * 0.35, dSize,
                    o.weekend[wd] ? C.weekend : C.dark, o.fontReg, Justification.CENTER);
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

    var doc = app.documents.add(DocumentColorSpace.RGB, PAGE_W, PAGE_H);
    var layer = doc.layers[0];
    layer.name = "Calendar " + o.year;

    var ab = doc.artboards[0].artboardRect;   // [left, top, right, bottom]
    var L = ab[0], T = ab[1];
    var yearStr = num(o.year, o.bn);
    var m;

    if (!o.multi) {
        // ---- one page, 4 x 3 grid ----
        var margin = 40, gap = 24, headerH = 80;
        var bw = (PAGE_W - 2 * margin - 3 * gap) / 4;
        var bh = (PAGE_H - 2 * margin - headerH - 2 * gap) / 3;

        var yg = layer.groupItems.add();
        yg.name = "Year";
        addText(yg, yearStr, L + PAGE_W / 2, T - margin - 52, 56, C.accent,
                o.fontBold, Justification.CENTER);

        var top0 = T - margin - headerH;
        for (m = 0; m < 12; m++) {
            var col = m % 4, rw = Math.floor(m / 4);
            drawMonth(layer, o, m,
                      L + margin + col * (bw + gap),
                      top0 - rw * (bh + gap), bw, bh);
        }
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

            var mg = 60, hdr = 70;
            var yg2 = layer.groupItems.add();
            yg2.name = "Year " + (m + 1);
            addText(yg2, yearStr, left + PAGE_W / 2, T - mg - 38, 44, C.accent,
                    o.fontBold, Justification.CENTER);

            drawMonth(layer, o, m, left + mg, T - mg - hdr,
                      PAGE_W - 2 * mg, PAGE_H - 2 * mg - hdr);
        }
    }

    try { app.executeMenuCommand("fitall"); } catch (e) {}
    app.redraw();
    alert("Calendar " + o.year + " created.");

})();
