/* HOMEWORK ANSWER CHECK (Nov 11, 2026, Mr. Allen's request).
   Checks a typed homework answer WITHOUT the answers being on the site: homework/check.js holds only a scrambled
   code (hash) for each clear-cut answer, made from Mr. Allen's private answer key by a script that is not in this repo's
   pages. The key PDF is never published. Problems that are explanations, find-the-mistake, graphs or anything not
   clear-cut have no code: the page says "Mr. Allen checks this one."
   HW_CHECK[hw][num] = [type, hash, type, hash ...]   type: n one number | m numbers in order | l letter(s) | w word(s) | p written form
   HWCheck.check(hw, num, text) -> 'ok' | 'no' | 'form' | 'close' | 'blank' | null (no code for this problem)
   The rules that tidy an answer before it is scrambled must stay the same as the builder's (num, nums, letters, words, form). */
(function () {
  "use strict";
  var UNIT = '(?:\\s*(?:mm|cm|km|m|in|ft|yd|mi|units?|inches|feet|meters|miles|degrees|dollars|cents)\\b\\.?(?:\\s*\\^\\s*[23])?)+';
  var SUPD = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  function pre(s) {
    s = String(s).trim().toLowerCase();
    s = s.replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { var neg = m.charAt(0) === '⁻'; return '^' + (neg ? '-' : '') + m.replace('⁻', '').replace(/./g, function (c) { return SUPD[c]; }); });
    s = s.replace(/[−–—]/g, '-').replace(/[×·•]/g, '*').replace(/÷/g, '/').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/=>/g, '>=').replace(/=</g, '<=');
    return s.replace(/[.;,!]+$/, '').trim();
  }
  function commas(s) { return s.replace(/(\d),(?=\d{3}(?![0-9a-z_]))/g, '$1'); }
  function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = a % b; a = b; b = t; } return a; }
  function fr(n, d) { if (d === 0n) return null; if (d < 0n) { n = -n; d = -d; } var g = gcd(n, d) || 1n; return (n / g) + '/' + (d / g); }
  function dec(t) { var neg = t.charAt(0) === '-'; if (neg) t = t.slice(1); var p = t.split('.'), f = p[1] || ''; var n = BigInt((p[0] || '0') + f), d = 10n ** BigInt(f.length); return fr(neg ? -n : n, d); }
  var TAIL = '(?:\\s+[a-z][a-z ]*|[a-z]{2,}[a-z ]*)?$';
  var RE_MIX = new RegExp('^(-?)\\s*(\\d+)\\s+(\\d+)\\s*/\\s*(\\d+)' + TAIL), RE_FR = new RegExp('^(-?\\d+)\\s*/\\s*(-?\\d+)' + TAIL), RE_DEC = new RegExp('^(-?(?:\\d+\\.?\\d*|\\.\\d+))' + TAIL), RE_UNIT = new RegExp(UNIT + '$');
  function num(s) {
    s = pre(s).replace(/^[a-z]\s*=\s*/, '').replace(/[$%°]/g, ''); s = commas(s).replace(RE_UNIT, '').trim();
    var m = s.match(RE_MIX);
    if (m && BigInt(m[4]) !== 0n) { var d = BigInt(m[4]), n = BigInt(m[2]) * d + BigInt(m[3]); return fr(m[1] ? -n : n, d); }
    m = s.match(RE_FR); if (m && BigInt(m[2]) !== 0n) return fr(BigInt(m[1]), BigInt(m[2]));
    m = s.match(RE_DEC); if (m) return dec(m[1]);
    return null;
  }
  function nums(s) {
    s = commas(pre(s)); var parts = s.match(/-?\d+\s*\/\s*\d+|-?(?:\d+\.?\d*|\.\d+)/g) || [], out = [];
    for (var i = 0; i < parts.length; i++) { var n = num(parts[i]); if (n === null) return null; out.push(n); }
    return out.length >= 2 ? out.join(';') : null;
  }
  var FILL = { it: 1, is: 1, a: 1, an: 1, the: 1, number: 1, numbers: 1, of: 1, to: 1, are: 1, they: 1, and: 1, or: 1 };
  function words(s) {
    s = pre(s).replace(/[^a-z0-9<>=.\-\/ ]/g, ' '); var seen = {}, t = [];
    s.split(/\s+/).forEach(function (w) { if (w && !FILL[w] && !seen[w]) { seen[w] = 1; t.push(w); } });
    return t.length ? t.sort().join(' ') : null;
  }
  function letters(s) {
    s = pre(s).replace(/\b(and|or)\b/g, ' '); var t = s.split(/[\s,;\/&]+/).filter(Boolean);
    if (t.length && t.every(function (w) { return /^[a-e][).:]?$/.test(w); })) { var u = {}; t.forEach(function (w) { u[w.charAt(0)] = 1; }); return Object.keys(u).sort().join(''); }
    var m = s.match(/^([a-e])(?:[).:]|\s+(?!=))/); return m ? m[1] : null;
  }
  var RE_FUNIT = new RegExp('([\\dπ])' + UNIT + '$');
  function form(s) {
    s = commas(pre(s)).replace(/(\d)\s*x\s*(?=10\s*\^)/g, '$1*').replace(/pi/g, 'π').replace(RE_FUNIT, '$1').replace(/\s+/g, '');
    s = s.replace(/(\*10\^-?\d+)[a-z]{2,}$/, '$1').replace(/\*\*/g, '^');
    var m = s.match(/^(-?[\d.\/]+)(<=|>=|<|>)([a-z])$/);
    if (m) s = m[3] + { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }[m[2]] + m[1];
    return s || null;
  }
  function h53(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }
  var CANON = { n: num, m: nums, l: letters, w: words, p: form };
  function entry(hw, n) { var d = window.HW_CHECK || {}; return (d[hw] || {})[n] || null; }
  function check(hw, n, text) {
    var e = entry(hw, n); if (!e) return null;
    if (!String(text || '').trim()) return 'blank';
    var key = 'hw|' + hw + '|' + n + '|';
    for (var i = 0; i < e.length; i += 2) { var c = null; try { c = CANON[e[i]](text); } catch (x) {} if (c && h53(key + c) === e[i + 1]) return 'ok'; }
    var t = e[0], c0 = null; try { c0 = CANON[t](text); } catch (x) {}
    if (t === 'n') return c0 === null ? 'form' : 'no';
    if (t === 'l') {                                   // a letter problem also takes the words of the choice (a number, a word or a written form)
      if (c0 !== null) return 'no';
      var alts = {}; for (var j = 2; j < e.length; j += 2) alts[e[j]] = 1;
      if (alts.n && num(text) !== null) return 'no';
      return (alts.p || alts.w) ? 'close' : 'form';
    }
    if (t === 'w') return 'no';
    return 'close';
  }
  /* tap(hw, n, 'B') or tap(hw, n, 'ABD'): a tapped choice (letters in A-F order). No tidy-up rules: the letters are the code. */
  function tap(hw, n, L) { var e = entry(hw, n); return !!e && e[0] === 'l' && h53('hw|' + hw + '|' + n + '|' + String(L).toLowerCase()) === e[1]; }
  /* HINTS AND "WHAT WENT WRONG" NOTES (homework/help.js; Mr. Allen, Nov 11, 2026): every problem has a hint; a wrong tap gets the
     note for THAT choice (its pointer is scrambled with the same hash as the answer codes, and the right choice has a pointer
     too, so the file does not show which one is right); a wrong number gets "check your sign" when only the sign is off,
     else the common mistakes for that kind of problem. Only call whyTap after the tap was judged wrong. */
  function HP() { return window.HW_HELP || null; }
  function txt(map, hw, n) { var H = HP(), i = H && H[map] && H[map][hw] ? H[map][hw][n] : null; return i == null || !H.T[i] ? '' : H.T[i]; }
  function whyTap(hw, n, L) {
    var H = HP(), a = H && H.w && H.w[hw] && H.w[hw][n], k = 'ABCDEF'.indexOf(String(L).toUpperCase()), fall = txt('m', hw, n);
    if (!a || String(L).length !== 1 || k < 0 || a[k] == null) return fall;
    var M = H.T.length, i = ((a[k] - parseInt(h53('why|' + hw + '|' + n + '|' + 'ABCDEF'.charAt(k)).slice(-7), 16) % M) % M + M) % M;
    return H.T[i] || fall;
  }
  function whyNum(hw, n, text) {
    var e = entry(hw, n), c = null; try { c = num(text); } catch (x) {}
    if (e && e[0] === 'n' && c && !/^-?0(\/1)?$/.test(c)) { var flip = c.charAt(0) === '-' ? c.slice(1) : '-' + c; if (h53('hw|' + hw + '|' + n + '|' + flip) === e[1]) return 'Check your sign. The number is right, but the sign is wrong.'; }
    return txt('m', hw, n);
  }
  window.HWCheck = { hint: function (hw, n) { return txt('h', hw, n); }, whyTap: whyTap, whyNum: whyNum, check: check, tap: tap, has: function (hw, n) { return !!entry(hw, n); }, kind: function (hw, n) { var e = entry(hw, n); return e ? e[0] : null; }, _t: { num: num, nums: nums, words: words, letters: letters, form: form, h53: h53 } };
})();
