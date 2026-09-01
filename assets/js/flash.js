/* 약물 플래시카드 — Leitner 간격 반복
 * 상자 1~5, 상자마다 다시 보는 간격이 늘어난다.
 * 맞히면 다음 상자로, 틀리면 1번 상자로 돌아온다.
 */
window.PTFlash = (function () {
  var CARDS = [];
  // 상자별 재등장 간격(일)
  var GAP = [0, 0, 1, 3, 7, 21];
  var MAX_BOX = 5;

  var DIRS = [
    { k: 'g2b', label: '제네릭 → 브랜드', front: 'g', back: 'b' },
    { k: 'b2g', label: '브랜드 → 제네릭', front: 'b', back: 'g' },
    { k: 'g2k', label: '제네릭 → 분류',   front: 'g', back: 'k' }
  ];

  function today() {
    var d = new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function init(data) { CARDS = data || []; }

  /* 오늘 볼 카드: 복습 기한이 된 것 먼저, 모자라면 새 카드로 채운다 */
  function due(state, dir, newLimit, sec) {
    newLimit = newLimit === undefined ? 15 : newLimit;
    var t = today(), rev = [], fresh = [];
    scope(sec).forEach(function (c) {
      var st = state[dir + ':' + c.id];
      if (!st) fresh.push(c);
      else if (st.due <= t) rev.push(c);
    });
    return { review: shuffle(rev), fresh: shuffle(fresh).slice(0, newLimit),
             freshTotal: fresh.length, reviewTotal: rev.length };
  }

  function session(state, dir, newLimit, sec) {
    var d = due(state, dir, newLimit, sec);
    return shuffle(d.review.concat(d.fresh));
  }

  function scope(sec) {
    return (!sec || sec === '전체') ? CARDS
      : CARDS.filter(function (c) { return c.sec === sec; });
  }

  /* 채점: grade 0=모름, 1=애매, 2=알았음 */
  function grade(state, dir, card, g) {
    var key = dir + ':' + card.id;
    var st = state[key] || { box: 1, due: today(), seen: 0 };
    st.seen++;
    if (g === 2) st.box = Math.min(MAX_BOX, st.box + 1);
    else if (g === 1) st.box = Math.max(1, st.box);
    else st.box = 1;
    // 애매는 오늘 안에 한 번 더, 나머지는 상자 간격만큼 뒤에
    st.due = today() + (g === 0 ? 0 : g === 1 ? 0 : GAP[st.box]);
    st.last = g;
    state[key] = st;
    return st;
  }

  function stats(state, dir, sec) {
    var t = today(), box = [0, 0, 0, 0, 0, 0], seen = 0, dueNow = 0;
    var list = scope(sec);
    list.forEach(function (c) {
      var st = state[dir + ':' + c.id];
      if (!st) return;
      seen++; box[st.box]++;
      if (st.due <= t) dueNow++;
    });
    return { total: list.length, seen: seen, box: box, due: dueNow,
             learned: box[4] + box[5] };
  }

  function sections() {
    var s = [], seen = {};
    CARDS.forEach(function (c) { if (!seen[c.sec]) { seen[c.sec] = 1; s.push(c.sec); } });
    return s;
  }

  return {
    init: init, dirs: DIRS, gap: GAP, maxBox: MAX_BOX,
    today: today, due: due, session: session, grade: grade,
    stats: stats, sections: sections, scope: scope,
    all: function () { return CARDS; },
    count: function () { return CARDS.length; }
  };
})();
