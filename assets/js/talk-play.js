/* 회화 문장 플레이
 * 1) 상황 → 영어 문장 고르기
 * 2) 영어 문장 → 상황 고르기
 * 3) 롤플레이 — 대화를 따라가며 다음에 할 말을 고른다
 */
window.PTTalkPlay = (function () {
  var LINES = [], DIALOGS = [], BY_TAG = {};

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function init(data) {
    LINES = data.lines || [];
    DIALOGS = data.dialogs || [];
    BY_TAG = {};
    LINES.forEach(function (l) { (BY_TAG[l.tag] = BY_TAG[l.tag] || []).push(l); });
  }

  /* 오답은 같은 태그에서 2개, 다른 태그에서 1개 — 비슷한 상황끼리 헷갈리게 */
  function othersFor(line, field) {
    var same = shuffle((BY_TAG[line.tag] || []).filter(function (l) { return l.id !== line.id; }));
    var other = shuffle(LINES.filter(function (l) { return l.tag !== line.tag; }));
    var out = [], seen = {};
    seen[line[field]] = 1;
    same.slice(0, 2).concat(other).forEach(function (l) {
      if (out.length >= 3 || seen[l[field]]) return;
      seen[l[field]] = 1; out.push(l[field]);
    });
    return out;
  }

  function lineRound(kind, line) {
    line = line || pick(LINES);
    var field = kind === 'sit2en' ? 'en' : 'sit';
    var ans = line[field];
    var opts = shuffle([ans].concat(othersFor(line, field)));
    return {
      mode: kind,
      tag: line.tag,
      prompt: kind === 'sit2en' ? line.sit : line.en,
      promptKo: kind === 'sit2en' ? '' : '',
      opts: opts,
      ans: opts.indexOf(ans),
      pair: kind === 'sit2en' ? line.sit : line.en,
      other: kind === 'sit2en' ? line.en : line.sit,
      note: line.note || '',
      id: 'line:' + line.id
    };
  }

  function set(kind, n) {
    n = n || 10;
    var pool = shuffle(LINES).slice(0, n);
    return pool.map(function (l) { return lineRound(kind, l); });
  }

  function mixedSet(n) {
    n = n || 10;
    return shuffle(LINES).slice(0, n).map(function (l) {
      return lineRound(Math.random() < 0.5 ? 'sit2en' : 'en2sit', l);
    });
  }

  function dialog(i) { return DIALOGS[i % DIALOGS.length]; }

  return {
    init: init,
    set: set,
    mixedSet: mixedSet,
    lineRound: lineRound,
    dialog: dialog,
    dialogs: function () { return DIALOGS; },
    lineCount: function () { return LINES.length; },
    tags: function () { return Object.keys(BY_TAG); },
    byId: function (id) {
      var n = +String(id).replace('line:', '');
      var f = null;
      LINES.forEach(function (l) { if (l.id === n) f = l; });
      return f;
    }
  };
})();
