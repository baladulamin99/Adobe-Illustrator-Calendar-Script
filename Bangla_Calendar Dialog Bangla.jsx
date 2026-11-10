/*
  Bangla_Calendar.jsx
  Adobe Illustrator script: generates a calendar for ANY year (1000-9999)
  with Bengali (Bangabda) year, month and date added to every day.

  Bengali dates follow the Bangladesh revised national calendar
  (Boishakh 1 = 14 April, every year).

  Run:  File > Scripts > Other Script...  and choose this file.
*/
#target illustrator

(function () {

// ======================================================================
//  USER SETTINGS (safe to edit)
// ======================================================================

// Extra holidays shown in red. Format:
//   [year (0 = every year), month, day, "English label", "Bengali label"]
// Moveable holidays (Eid, Durga Puja, Buddha Purnima ...) change every year,
// so add them here yourself, for example:
//   [2026, 3, 20, "Eid-ul-Fitr", "\u0988\u09a6\u09c1\u09b2 \u09ab\u09bf\u09a4\u09b0"]
var EXTRA_HOLIDAYS = [
];

// Fixed national days (Gregorian): [month, day, "English", "Bengali"]
var HOLIDAYS = [
  [2, 21, "Language Martyrs' Day", "\u09b6\u09b9\u09c0\u09a6 \u09a6\u09bf\u09ac\u09b8"],
  [3, 26, "Independence Day", "\u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8\u09a4\u09be \u09a6\u09bf\u09ac\u09b8"],
  [4, 14, "Pohela Boishakh", "\u09aa\u09b9\u09c7\u09b2\u09be \u09ac\u09c8\u09b6\u09be\u0996"],
  [5, 1,  "May Day", "\u09ae\u09c7 \u09a6\u09bf\u09ac\u09b8"],
  [12, 16, "Victory Day", "\u09ac\u09bf\u099c\u09af\u09bc \u09a6\u09bf\u09ac\u09b8"],
  [12, 25, "Christmas Day", "\u09ac\u09a1\u09bc\u09a6\u09bf\u09a8"]
];

// Font candidates tried automatically (PostScript or family names)
var BN_FONT_CANDIDATES = ["Kalpurush", "SolaimanLipi", "NirmalaUI", "Nirmala UI",
  "SiyamRupali", "Siyam Rupali", "NotoSansBengali-Regular", "Noto Sans Bengali",
  "NotoSerifBengali", "Vrinda", "ShonarBangla", "Mukti", "LohitBengali",
  "KohinoorBangla-Regular", "Kohinoor Bangla", "BanglaSangamMN", "BanglaMN"];
var LAT_FONT_CANDIDATES = ["ArialMT", "Arial", "MyriadPro-Regular", "Helvetica",
  "Calibri", "SegoeUI", "Roboto-Regular"];

// ======================================================================
//  NAMES
// ======================================================================
// ==== CORE BEGIN
var BN_DIGITS = ["\u09e6","\u09e7","\u09e8","\u09e9","\u09ea","\u09eb","\u09ec","\u09ed","\u09ee","\u09ef"];
var BN_ERA = "\u09ac\u0999\u09cd\u0997\u09be\u09ac\u09cd\u09a6";
// Boishakh, Joishtho, Asharh, Srabon, Bhadro, Ashwin, Kartik, Ogrohayon, Poush, Magh, Falgun, Choitro
var BN_MONTHS = ["\u09ac\u09c8\u09b6\u09be\u0996","\u099c\u09cd\u09af\u09c8\u09b7\u09cd\u09a0","\u0986\u09b7\u09be\u09a2\u09bc","\u09b6\u09cd\u09b0\u09be\u09ac\u09a3","\u09ad\u09be\u09a6\u09cd\u09b0","\u0986\u09b6\u09cd\u09ac\u09bf\u09a8","\u0995\u09be\u09b0\u09cd\u09a4\u09bf\u0995","\u0985\u0997\u09cd\u09b0\u09b9\u09be\u09af\u09bc\u09a3","\u09aa\u09cc\u09b7","\u09ae\u09be\u0998","\u09ab\u09be\u09b2\u09cd\u0997\u09c1\u09a8","\u099a\u09c8\u09a4\u09cd\u09b0"];
var GREG_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var GREG_BN = ["\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09bf","\u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09bf","\u09ae\u09be\u09b0\u09cd\u099a","\u098f\u09aa\u09cd\u09b0\u09bf\u09b2","\u09ae\u09c7","\u099c\u09c1\u09a8","\u099c\u09c1\u09b2\u09be\u0987","\u0986\u0997\u09b8\u09cd\u099f","\u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0","\u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0","\u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0","\u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0"];
var WD_EN   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var WD_EN_S = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var WD_BN   = ["\u09b0\u09ac\u09bf\u09ac\u09be\u09b0","\u09b8\u09cb\u09ae\u09ac\u09be\u09b0","\u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0","\u09ac\u09c1\u09a7\u09ac\u09be\u09b0","\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0","\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0","\u09b6\u09a8\u09bf\u09ac\u09be\u09b0"];
var WD_BN_S = ["\u09b0\u09ac\u09bf","\u09b8\u09cb\u09ae","\u09ae\u0999\u09cd\u0997\u09b2","\u09ac\u09c1\u09a7","\u09ac\u09c3\u09b9","\u09b6\u09c1\u0995\u09cd\u09b0","\u09b6\u09a8\u09bf"];

// Gregorian [month, day] on which each Bengali month starts, in Gregorian order.
// Third value = Bengali month index (0 = Boishakh ... 11 = Choitro)
var BN_STARTS = [
  [1, 14, 9], [2, 13, 10], [3, 15, 11], [4, 14, 0], [5, 15, 1], [6, 15, 2],
  [7, 16, 3], [8, 16, 4], [9, 16, 5], [10, 16, 6], [11, 15, 7], [12, 15, 8]
];

function toBn(s) {
  s = String(s);
  var out = "", i, c;
  for (i = 0; i < s.length; i++) {
    c = s.charAt(i);
    if (c >= "0" && c <= "9") out += BN_DIGITS[c.charCodeAt(0) - 48];
    else out += c;
  }
  return out;
}
function numStr(n, bn) { return bn ? toBn(n) : String(n); }
function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function daysInMonth(y, m) {
  var d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m === 2 && isLeap(y)) return 29;
  return d[m - 1];
}
function dayOfWeek(y, m, d) { return new Date(y, m - 1, d).getDay(); } // 0 = Sunday

// Gregorian date -> Bengali date {day, month (0-11), year}
function toBengali(y, m, d) {
  var pick = null, startY = y, i, s;
  for (i = 0; i < BN_STARTS.length; i++) {
    s = BN_STARTS[i];
    if (m > s[0] || (m === s[0] && d >= s[1])) pick = s;
  }
  if (pick === null) { pick = BN_STARTS[11]; startY = y - 1; } // 1-13 Jan = Poush
  var a = new Date(y, m - 1, d);
  var b = new Date(startY, pick[0] - 1, pick[1]);
  var day = Math.round((a.getTime() - b.getTime()) / 86400000) + 1;
  var by = (m > 4 || (m === 4 && d >= 14)) ? y - 593 : y - 594;
  return { day: day, month: pick[2], year: by };
}

function bnMonthsLabel(y, m) {
  var a = toBengali(y, m, 1), b = toBengali(y, m, daysInMonth(y, m));
  var s;
  if (a.month === b.month) s = BN_MONTHS[a.month] + " " + toBn(a.year);
  else if (a.year === b.year) s = BN_MONTHS[a.month] + " \u2013 " + BN_MONTHS[b.month] + " " + toBn(a.year);
  else s = BN_MONTHS[a.month] + " " + toBn(a.year) + " \u2013 " + BN_MONTHS[b.month] + " " + toBn(b.year);
  return s + " " + BN_ERA;
}
function bnYearLabel(y) {
  return BN_ERA + " " + toBn(toBengali(y, 1, 1).year) + " \u2013 " + toBn(toBengali(y, 12, 31).year);
}
// ==== CORE END

// ======================================================================
//  COLORS  (each entry: [ [C,M,Y,K], [R,G,B] ])
// ======================================================================
var PAL = {
  dark:  [[0, 0, 0, 90],  [34, 34, 34]],
  line:  [[0, 0, 0, 22],  [208, 208, 208]],
  soft:  [[0, 0, 0, 6],   [243, 243, 243]],
  white: [[0, 0, 0, 0],   [255, 255, 255]],
  red:   [[5, 100, 95, 0], [215, 38, 38]],
  tint:  [[0, 8, 6, 0],   [254, 238, 236]]
};
var THEMES = [
  [[90, 25, 90, 25], [0, 106, 78]],    // green
  [[100, 70, 10, 10], [26, 86, 160]],  // blue
  [[30, 100, 90, 35], [128, 24, 38]],  // maroon
  [[0, 65, 100, 0],  [236, 116, 30]]   // orange
];
var SIZES = [
  ["A4", 595.276, 841.89],
  ["A3", 841.89, 1190.551],
  ["A2", 1190.551, 1683.78],
  ["A5", 419.528, 595.276],
  ["Letter", 612, 792]
];

function mkColor(entry, rgb) {
  var col, a = rgb ? entry[1] : entry[0];
  if (rgb) { col = new RGBColor(); col.red = a[0]; col.green = a[1]; col.blue = a[2]; }
  else { col = new CMYKColor(); col.cyan = a[0]; col.magenta = a[1]; col.yellow = a[2]; col.black = a[3]; }
  return col;
}

// ======================================================================
//  FONT LOOKUP
// ======================================================================
var fontIndex = null;
function normName(s) { return String(s).toLowerCase().replace(/[\s\-_]/g, ""); }
function buildFontIndex() {
  if (fontIndex) return;
  fontIndex = [];
  var fonts = app.textFonts, i, f;
  for (i = 0; i < fonts.length; i++) {
    f = fonts[i];
    var st = "";
    try { st = normName(f.style); } catch (e1) {}
    fontIndex.push({ f: f, n: normName(f.name), fam: normName(f.family), st: st });
  }
}
function isRegularStyle(st) { return st === "regular" || st === "roman" || st === "book" || st === "normal" || st === ""; }
function findFontByName(name) {
  var key = normName(name), i, e, firstPartial = null, firstFam = null;
  try { return app.textFonts.getByName(name); } catch (e0) {}
  buildFontIndex();
  for (i = 0; i < fontIndex.length; i++) {
    e = fontIndex[i];
    if (e.n === key) return e.f;
  }
  for (i = 0; i < fontIndex.length; i++) {
    e = fontIndex[i];
    if (e.fam === key) {
      if (isRegularStyle(e.st)) return e.f;
      if (!firstFam) firstFam = e.f;
    }
  }
  if (firstFam) return firstFam;
  for (i = 0; i < fontIndex.length; i++) {
    e = fontIndex[i];
    if (e.n.indexOf(key) === 0 || e.fam.indexOf(key) === 0) {
      if (isRegularStyle(e.st)) return e.f;
      if (!firstPartial) firstPartial = e.f;
    }
  }
  return firstPartial;
}
function resolveFont(userText, candidates) {
  var t = String(userText).replace(/^\s+|\s+$/g, ""), i, f;
  if (t !== "" && t.toLowerCase() !== "auto") {
    f = findFontByName(t);
    if (f) return f;
  }
  for (i = 0; i < candidates.length; i++) {
    f = findFontByName(candidates[i]);
    if (f) return f;
  }
  return null;
}

// ======================================================================
//  DRAWING HELPERS
//  Coordinates passed to helpers are artboard-local: origin = top-left of
//  the artboard, x to the right, y DOWN (in points).
// ======================================================================
function Page(ab) {
  var r = ab.artboardRect;
  this.left = r[0];
  this.top = r[1];
  this.yUp = (r[1] > r[3]);
}
Page.prototype.X = function (x) { return this.left + x; };
Page.prototype.Y = function (y) { return this.yUp ? this.top - y : this.top + y; };

function drawRect(ctx, x, y, w, h, fill, stroke, sw) {
  var p = ctx.grp.pathItems.rectangle(ctx.pg.Y(y), ctx.pg.X(x), w, h);
  if (fill) { p.filled = true; p.fillColor = fill; } else { p.filled = false; }
  if (stroke) { p.stroked = true; p.strokeColor = stroke; p.strokeWidth = sw; } else { p.stroked = false; }
  return p;
}

// align: "l" | "c" | "r" ; (x, y) = anchor, y is the text BASELINE
function drawText(ctx, str, x, y, size, color, align, font, maxW) {
  var t = ctx.grp.textFrames.pointText([ctx.pg.X(x), ctx.pg.Y(y)]);
  t.contents = str;
  var ca = t.textRange.characterAttributes;
  if (font) { try { ca.textFont = font; } catch (e) {} }
  ca.size = size;
  ca.fillColor = color;
  if (maxW && t.width > maxW) { ca.size = size * maxW / t.width; }
  var w = t.width;
  if (align === "c") t.left = ctx.pg.X(x) - w / 2;
  else if (align === "r") t.left = ctx.pg.X(x) - w;
  return t;
}

function newGroup(ctx, name) {
  ctx.grp = ctx.layer.groupItems.add();
  ctx.grp.name = name;
}

function holidayFor(o, y, m, d) {
  var i, h;
  if (o.national) {
    for (i = 0; i < HOLIDAYS.length; i++) {
      h = HOLIDAYS[i];
      if (h[0] === m && h[1] === d) return o.bnNames ? h[3] : h[2];
    }
  }
  for (i = 0; i < EXTRA_HOLIDAYS.length; i++) {
    h = EXTRA_HOLIDAYS[i];
    if ((h[0] === 0 || h[0] === y) && h[1] === m && h[2] === d) {
      return o.bnNames ? (h[4] || h[3]) : h[3];
    }
  }
  return null;
}

// ======================================================================
//  ONE MONTH  (box = {x, y, w, h} local coordinates)
// ======================================================================
function drawMonth(ctx, o, box, y, m, mini) {
  var C = ctx.C;
  var rx = box.x, ry = box.y, rw = box.w, rh = box.h;
  var hdrH = rh * 0.15;
  var dowH = rh * (mini ? 0.075 : 0.055);
  var pad = rw * 0.035;
  var dim = daysInMonth(y, m);
  var offset = (dayOfWeek(y, m, 1) - o.weekStart + 7) % 7;
  var rows = mini ? 6 : Math.ceil((offset + dim) / 7);
  var gy = ry + hdrH + dowH;
  var cw = rw / 7;
  var ch = (rh - hdrH - dowH) / rows;
  var sw = Math.max(0.25, rw * 0.0012);
  var i, c;

  // ---- header band
  drawRect(ctx, rx, ry, rw, hdrH, C.accent, null, 0);
  drawText(ctx, o.bnNames ? GREG_BN[m - 1] : GREG_EN[m - 1],
    rx + pad, ry + hdrH * 0.70, hdrH * 0.5, C.white, "l", ctx.fNames, rw * 0.42);
  drawText(ctx, numStr(y, o.bnDigits),
    rx + rw - pad, ry + hdrH * (o.showBn ? 0.45 : 0.68), hdrH * (o.showBn ? 0.3 : 0.45),
    C.white, "r", ctx.fDig, rw * 0.4);
  if (o.showBn) {
    drawText(ctx, bnMonthsLabel(y, m),
      rx + rw - pad, ry + hdrH * 0.84, hdrH * 0.22, C.white, "r", ctx.fBn, rw * 0.5);
  }

  // ---- weekday row
  drawRect(ctx, rx, ry + hdrH, rw, dowH, C.soft, null, 0);
  for (c = 0; c < 7; c++) {
    var wd = (o.weekStart + c) % 7;
    var nm = o.bnNames ? (mini ? WD_BN_S[wd] : WD_BN[wd]) : (mini ? WD_EN_S[wd] : WD_EN[wd]);
    var wred = (wd === 5 && o.friRed) || (wd === 6 && o.satRed);
    drawText(ctx, nm, rx + c * cw + cw / 2, ry + hdrH + dowH * 0.70, dowH * 0.5,
      wred ? C.red : C.dark, "c", ctx.fNames, cw * 0.92);
  }

  // ---- day cells
  for (i = 0; i < rows * 7; i++) {
    var row = Math.floor(i / 7), col = i % 7;
    var cx = rx + col * cw, cy = gy + row * ch;
    var d = i - offset + 1;
    var valid = (d >= 1 && d <= dim);
    var wdc = (o.weekStart + col) % 7;
    var wk = (wdc === 5 && o.friRed) || (wdc === 6 && o.satRed);

    drawRect(ctx, cx, cy, cw, ch, (valid && wk) ? C.tint : C.white, C.line, sw);
    if (!valid) continue;

    var hol = holidayFor(o, y, m, d);
    var isRed = wk || (hol !== null);

    // Gregorian number (top-left)
    var ns = Math.min(cw * 0.36, ch * 0.36);
    drawText(ctx, numStr(d, o.bnDigits), cx + cw * 0.08, cy + ch * 0.07 + ns * 0.82, ns,
      isRed ? C.red : C.dark, "l", ctx.fDig, cw * 0.6);

    // Bengali date (bottom-right)
    if (o.showBn) {
      var b = toBengali(y, m, d);
      var bs = Math.min(cw * 0.24, ch * 0.25);
      var label, lsz;
      if (b.day === 1) { label = toBn(1) + " " + BN_MONTHS[b.month]; lsz = bs * 0.9; }
      else { label = toBn(b.day); lsz = bs; }
      drawText(ctx, label, cx + cw - cw * 0.07, cy + ch - ch * 0.10, lsz,
        C.accent, "r", ctx.fBn, cw * 0.88);
    }

    // Holiday label (only on large cells)
    if (hol !== null && !mini) {
      drawText(ctx, hol, cx + cw * 0.08, cy + ch * 0.60, Math.min(cw * 0.105, ch * 0.13),
        C.red, "l", ctx.fNames, cw * 0.84);
    }
  }
}

// ======================================================================
//  MAIN
// ======================================================================
function showDialog() {
  var now = new Date();
  var win = new Window("dialog", "\u09ac\u09be\u0982\u09b2\u09be \u0995\u09cd\u09af\u09be\u09b2\u09c7\u09a8\u09cd\u09a1\u09be\u09b0 \u099c\u09c7\u09a8\u09be\u09b0\u09c7\u099f\u09b0");
  win.orientation = "column";
  win.alignChildren = "fill";

  function addRow(parent, label) {
    var g = parent.add("group");
    g.orientation = "row";
    g.alignChildren = "center";
    var s = g.add("statictext", undefined, label);
    s.preferredSize.width = 230;
    return g;
  }
  function addDrop(parent, label, items, sel) {
    var g = addRow(parent, label);
    var dd = g.add("dropdownlist", undefined, items);
    dd.selection = sel;
    dd.preferredSize.width = 250;
    return dd;
  }
  function addEdit(parent, label, txt) {
    var g = addRow(parent, label);
    var e = g.add("edittext", undefined, txt);
    e.preferredSize.width = 250;
    return e;
  }

  // --- panel 1
  var p1 = win.add("panel", undefined, "\u09aa\u09be\u09a4\u09be \u0993 \u09b2\u09c7\u0986\u0989\u099f");
  p1.orientation = "column"; p1.alignChildren = "left";
  var eYear = addEdit(p1, "\u09b8\u09be\u09b2 (Year)", String(now.getFullYear()));
  var dLayout = addDrop(p1, "\u09b2\u09c7\u0986\u0989\u099f",
    ["\u09aa\u09cd\u09b0\u09a4\u09bf \u09ae\u09be\u09b8\u09c7 \u098f\u0995\u099f\u09bf \u0986\u09b0\u09cd\u099f\u09ac\u09cb\u09b0\u09cd\u09a1 (\u09e7\u09e8 \u09aa\u09be\u09a4\u09be)", "\u09aa\u09c1\u09b0\u09cb \u09ac\u099b\u09b0 \u098f\u0995\u099f\u09bf \u0986\u09b0\u09cd\u099f\u09ac\u09cb\u09b0\u09cd\u09a1\u09c7 (\u09a6\u09c7\u09af\u09bc\u09be\u09b2 \u0995\u09cd\u09af\u09be\u09b2\u09c7\u09a8\u09cd\u09a1\u09be\u09b0)"], 0);
  var dSize = addDrop(p1, "\u09aa\u09be\u09a4\u09be\u09b0 \u0986\u0995\u09be\u09b0", ["A4", "A3", "A2", "A5", "Letter"], 0);
  var dOrient = addDrop(p1, "\u09a6\u09bf\u0995", ["\u0986\u09a1\u09bc\u09be\u0986\u09a1\u09bc\u09bf (Landscape)", "\u09b2\u09ae\u09cd\u09ac\u09be\u09b2\u09ae\u09cd\u09ac\u09bf (Portrait)"], 0);

  // --- panel 2
  var p2 = win.add("panel", undefined, "\u0995\u09cd\u09af\u09be\u09b2\u09c7\u09a8\u09cd\u09a1\u09be\u09b0 \u09b8\u09c7\u099f\u09bf\u0982\u09b8");
  p2.orientation = "column"; p2.alignChildren = "left";
  var dWeek = addDrop(p2, "\u09b8\u09aa\u09cd\u09a4\u09be\u09b9 \u09b6\u09c1\u09b0\u09c1", ["\u09b0\u09ac\u09bf\u09ac\u09be\u09b0", "\u09b8\u09cb\u09ae\u09ac\u09be\u09b0", "\u09b6\u09a8\u09bf\u09ac\u09be\u09b0"], 0);
  var dNames = addDrop(p2, "\u09ae\u09be\u09b8 \u0993 \u09ac\u09be\u09b0\u09c7\u09b0 \u09a8\u09be\u09ae",
    ["English (January, Sun)", "\u09ac\u09be\u0982\u09b2\u09be (\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09bf, \u09b0\u09ac\u09bf)"], 0);
  var dDigits = addDrop(p2, "\u0987\u0982\u09b0\u09c7\u099c\u09bf \u09a4\u09be\u09b0\u09bf\u0996\u09c7\u09b0 \u0985\u0999\u09cd\u0995",
    ["English (1, 2, 3)", "\u09ac\u09be\u0982\u09b2\u09be (\u09e7, \u09e8, \u09e9)"], 0);
  var cBn = p2.add("checkbox", undefined, "\u09ac\u09be\u0982\u09b2\u09be \u09b8\u09a8 \u0993 \u09a4\u09be\u09b0\u09bf\u0996 \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8"); cBn.value = true;
  var cFri = p2.add("checkbox", undefined, "\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b2\u09be\u09b2 \u09b0\u0999\u09c7 (\u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995 \u099b\u09c1\u099f\u09bf)"); cFri.value = true;
  var cSat = p2.add("checkbox", undefined, "\u09b6\u09a8\u09bf\u09ac\u09be\u09b0 \u09b2\u09be\u09b2 \u09b0\u0999\u09c7 (\u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995 \u099b\u09c1\u099f\u09bf)"); cSat.value = false;
  var cNat = p2.add("checkbox", undefined, "\u099c\u09be\u09a4\u09c0\u09af\u09bc \u09a6\u09bf\u09ac\u09b8 (\u09b8\u09cd\u09a5\u09bf\u09b0 \u09a4\u09be\u09b0\u09bf\u0996) \u09a6\u09c7\u0996\u09be\u09a8"); cNat.value = true;

  // --- panel 3
  var p3 = win.add("panel", undefined, "\u09b0\u0982 \u0993 \u09ab\u09a8\u09cd\u099f");
  p3.orientation = "column"; p3.alignChildren = "left";
  var dTheme = addDrop(p3, "\u09b0\u0999\u09c7\u09b0 \u09a5\u09bf\u09ae", ["\u09b8\u09ac\u09c1\u099c", "\u09a8\u09c0\u09b2", "\u09ae\u09c7\u09b0\u09c1\u09a8", "\u0995\u09ae\u09b2\u09be"], 0);
  var dMode = addDrop(p3, "\u09b0\u0999 \u09ae\u09cb\u09a1", ["CMYK (\u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u099f)", "RGB (\u09b8\u09cd\u0995\u09cd\u09b0\u09bf\u09a8)"], 0);
  var eFontBn = addEdit(p3, "\u09ac\u09be\u0982\u09b2\u09be \u09ab\u09a8\u09cd\u099f (auto \u09ac\u09be PostScript \u09a8\u09be\u09ae)", "auto");
  var eFontLat = addEdit(p3, "\u0987\u0982\u09b0\u09c7\u099c\u09bf \u09ab\u09a8\u09cd\u099f (auto \u09ac\u09be PostScript \u09a8\u09be\u09ae)", "auto");

  var note = win.add("statictext", undefined,
    "\u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6: \u09ac\u09be\u0982\u09b2\u09be \u09af\u09c1\u0995\u09cd\u09a4\u09be\u0995\u09cd\u09b7\u09b0 \u09a0\u09bf\u0995\u09ad\u09be\u09ac\u09c7 \u09a6\u09c7\u0996\u09a4\u09c7 Edit > Preferences > Type > Text Engine Options-\u098f " +
    "\"Middle Eastern and South Asian\" \u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u099a\u09a8 \u0995\u09b0\u09c7 Illustrator \u09b0\u09bf\u09b8\u09cd\u099f\u09be\u09b0\u09cd\u099f \u0995\u09b0\u09c1\u09a8\u0964",
    { multiline: true });
  note.preferredSize = [520, 44];

  var bg = win.add("group");
  bg.alignment = "right";
  var ok = bg.add("button", undefined, "\u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c1\u09a8", { name: "ok" });
  var cancel = bg.add("button", undefined, "\u09ac\u09be\u09a4\u09bf\u09b2", { name: "cancel" });

  var result = null;
  ok.onClick = function () {
    var yr = parseInt(eYear.text, 10);
    if (isNaN(yr) || yr < 1000 || yr > 9999) {
      alert("\u09b8\u09be\u09b2 \u09e7\u09e6\u09e6\u09e6 \u09a5\u09c7\u0995\u09c7 \u09ef\u09ef\u09ef\u09ef-\u098f\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b9\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964");
      return;
    }
    result = {
      year: yr,
      monthPages: (dLayout.selection.index === 0),
      size: SIZES[dSize.selection.index],
      landscape: (dOrient.selection.index === 0),
      weekStart: [0, 1, 6][dWeek.selection.index],
      bnNames: (dNames.selection.index === 1),
      bnDigits: (dDigits.selection.index === 1),
      theme: dTheme.selection.index,
      rgb: (dMode.selection.index === 1),
      showBn: cBn.value,
      friRed: cFri.value,
      satRed: cSat.value,
      national: cNat.value,
      fontBn: eFontBn.text,
      fontLat: eFontLat.text
    };
    win.close(1);
  };
  cancel.onClick = function () { win.close(0); };

  win.show();
  return result;
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }

function main() {
  var o = showDialog();
  if (!o) return;

  var fBn = resolveFont(o.fontBn, BN_FONT_CANDIDATES);
  var fLat = resolveFont(o.fontLat, LAT_FONT_CANDIDATES);
  if (!fBn) {
    alert("\u09ac\u09be\u0982\u09b2\u09be \u09ab\u09a8\u09cd\u099f \u09aa\u09be\u0993\u09af\u09bc\u09be \u09af\u09be\u09af\u09bc\u09a8\u09bf\u0964 Kalpurush / Noto Sans Bengali / Nirmala UI \u0987\u09a8\u09b8\u09cd\u099f\u09b2 \u0995\u09b0\u09c1\u09a8, " +
      "\u0985\u09a5\u09ac\u09be \u09a1\u09be\u09af\u09bc\u09be\u09b2\u0997\u09c7 \u09ab\u09a8\u09cd\u099f\u09c7\u09b0 PostScript \u09a8\u09be\u09ae \u09b2\u09bf\u0996\u09c1\u09a8\u0964\n\nBengali font not found - install one or type its PostScript name.");
  }
  if (!fLat) fLat = fBn;
  if (!fBn) fBn = fLat;

  var W = Math.max(o.size[1], o.size[2]), H = Math.min(o.size[1], o.size[2]);
  if (!o.landscape) { var tmp = W; W = H; H = tmp; }

  var count = o.monthPages ? 12 : 1;
  var doc = app.documents.add(o.rgb ? DocumentColorSpace.RGB : DocumentColorSpace.CMYK,
    W, H, count, DocumentArtboardLayout.GridByRow, 40, 4);

  var layer = doc.layers[0];
  layer.name = "Calendar " + o.year;

  var ctx = {
    layer: layer, grp: null, pg: null,
    fBn: fBn,
    fNames: o.bnNames ? fBn : fLat,
    fDig: o.bnDigits ? fBn : fLat,
    C: {
      dark: mkColor(PAL.dark, o.rgb), line: mkColor(PAL.line, o.rgb),
      soft: mkColor(PAL.soft, o.rgb), white: mkColor(PAL.white, o.rgb),
      red: mkColor(PAL.red, o.rgb), tint: mkColor(PAL.tint, o.rgb),
      accent: mkColor(THEMES[o.theme], o.rgb)
    }
  };

  var footnote = o.bnNames
    ? "\u09ac\u09be\u0982\u09b2\u09be \u09a4\u09be\u09b0\u09bf\u0996: \u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09c7\u09b0 \u09b8\u0982\u09b6\u09cb\u09a7\u09bf\u09a4 \u09ac\u0999\u09cd\u0997\u09be\u09ac\u09cd\u09a6 (\u099c\u09be\u09a4\u09c0\u09af\u09bc \u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be) \u0985\u09a8\u09c1\u09af\u09be\u09af\u09bc\u09c0"
    : "Bengali dates follow the Bangladesh revised national calendar (Bangabda)";

  var m, ab;
  if (o.monthPages) {
    // ---------- 12 artboards, one month each
    var margin = Math.min(W, H) * 0.05;
    var footH = margin * 0.9;
    for (m = 1; m <= 12; m++) {
      ab = doc.artboards[m - 1];
      ab.name = pad2(m) + " " + GREG_EN[m - 1] + " " + o.year;
      ctx.pg = new Page(ab);
      newGroup(ctx, GREG_EN[m - 1] + " " + o.year);
      drawMonth(ctx, o, { x: margin, y: margin, w: W - 2 * margin, h: H - 2 * margin - footH }, o.year, m, false);
      if (o.showBn) {
        drawText(ctx, footnote, W / 2, H - margin * 0.55, Math.max(6, Math.min(W, H) * 0.014),
          mkColor(PAL.dark, o.rgb), "c", o.bnNames ? fBn : fLat, W - 2 * margin);
      }
    }
  } else {
    // ---------- whole year on one artboard
    ab = doc.artboards[0];
    ab.name = "Calendar " + o.year;
    ctx.pg = new Page(ab);

    var mg = Math.min(W, H) * 0.045;
    var titleH = H * 0.10;
    var gap = Math.min(W, H) * 0.02;
    var fH = mg * 0.9;
    var cols = (W >= H) ? 4 : 3;
    var rowsN = 12 / cols;

    newGroup(ctx, "Title");
    drawText(ctx, numStr(o.year, o.bnDigits), mg, mg + titleH * 0.75, titleH * 0.8,
      ctx.C.accent, "l", ctx.fDig, W * 0.4);
    if (o.showBn) {
      drawText(ctx, bnYearLabel(o.year), W - mg, mg + titleH * 0.62, titleH * 0.34,
        ctx.C.accent, "r", fBn, W * 0.5);
      drawText(ctx, footnote, W / 2, H - mg * 0.5, Math.max(6, Math.min(W, H) * 0.012),
        ctx.C.dark, "c", o.bnNames ? fBn : fLat, W - 2 * mg);
    }

    var topY = mg + titleH + gap;
    var cw = (W - 2 * mg - (cols - 1) * gap) / cols;
    var chh = (H - topY - mg - fH - (rowsN - 1) * gap) / rowsN;
    for (m = 1; m <= 12; m++) {
      var r = Math.floor((m - 1) / cols), c = (m - 1) % cols;
      newGroup(ctx, GREG_EN[m - 1] + " " + o.year);
      drawMonth(ctx, o, { x: mg + c * (cw + gap), y: topY + r * (chh + gap), w: cw, h: chh }, o.year, m, true);
    }
  }

  try { doc.selection = null; } catch (e1) {}
  try { app.executeMenuCommand("fitall"); } catch (e2) {}
}

try {
  main();
} catch (err) {
  alert("Error: " + err.message + (err.line ? "  (line " + err.line + ")" : ""));
}

})();
