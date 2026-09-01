/* 처방 조립 플레이
 * sig 한 줄을 동사 → 수량 → 경로 → 빈도 → 기간 → 조건 순서로 조립하며 읽는 법을 익힌다.
 * - 항목 플레이: 처방을 무작위로 만들어 필요한 항목을 전부 돌린다
 * - 예시 플레이: 실전에서 자주 보는 처방으로 같은 흐름을 연습한다
 */
window.PTSigPlay = (function () {
  var SLOTS = [
    { k: 'verb',  label: '동사',  hint: '제형이 동사를 결정합니다' },
    { k: 'qty',   label: '수량',  hint: '숫자는 영어 단어로, 제형은 단수·복수를 맞춥니다' },
    { k: 'route', label: '경로',  hint: 'o는 눈, a는 귀' },
    { k: 'freq',  label: '빈도',  hint: '약어를 글자대로 읽지 않고 말로 풉니다' },
    { k: 'dur',   label: '기간',  hint: 'x 10d = for ten days' },
    { k: 'cond',  label: '조건',  hint: 'prn = as needed for ~' }
  ];

  var NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
             'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
             'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  var TENS = { 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty' };
  function word(n) {
    if (n % 1 !== 0) return String(n);
    if (n <= 20) return NUM[n];
    if (TENS[n]) return TENS[n];
    return String(n);
  }

  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* 제형별 처방 만들기 — 동사·경로·수량 단위가 서로 맞물린다 */
  var RECIPES = [
    { id: 'tab', build: function () {
        var n = pick([1, 1, 2]);
        return { verb: 'Take', qty: word(n) + ' tablet' + (n > 1 ? 's' : ''),
                 route: 'by mouth', sigQty: n + ' tab', sigRoute: 'po',
                 koQty: n + '정', koRoute: '경구' };
      } },
    { id: 'cap', build: function () {
        var n = pick([1, 1, 2]);
        return { verb: 'Take', qty: word(n) + ' capsule' + (n > 1 ? 's' : ''),
                 route: 'by mouth', sigQty: n + ' cap', sigRoute: 'po',
                 koQty: n + '캡슐', koRoute: '경구' };
      } },
    { id: 'liquid', build: function () {
        var n = pick([2.5, 5, 10, 15]);
        return { verb: 'Take', qty: (n === 2.5 ? 'two and a half' : word(n)) + ' milliliters',
                 route: 'by mouth', sigQty: n + ' mL', sigRoute: 'po',
                 koQty: n + ' mL', koRoute: '경구' };
      } },
    { id: 'eye', build: function () {
        var n = pick([1, 1, 2]);
        var r = pick([{ e: 'in both eyes', s: 'ou', k: '양안' },
                      { e: 'in the right eye', s: 'od', k: '우안' },
                      { e: 'in the left eye', s: 'os', k: '좌안' }]);
        return { verb: 'Instill', qty: word(n) + ' drop' + (n > 1 ? 's' : ''),
                 route: r.e, sigQty: n + ' gtt', sigRoute: r.s,
                 koQty: n + '방울', koRoute: r.k };
      } },
    { id: 'ear', build: function () {
        var n = pick([2, 3]);
        var r = pick([{ e: 'in both ears', s: 'au', k: '양이' },
                      { e: 'in the right ear', s: 'ad', k: '우이' },
                      { e: 'in the left ear', s: 'as', k: '좌이' }]);
        return { verb: 'Instill', qty: word(n) + ' drops',
                 route: r.e, sigQty: n + ' gtt', sigRoute: r.s,
                 koQty: n + '방울', koRoute: r.k };
      } },
    { id: 'top', build: function () {
        return { verb: 'Apply', qty: 'a thin layer', route: 'to the affected area',
                 sigQty: 'thin layer', sigRoute: 'top', koQty: '얇게', koRoute: '환부' };
      } },
    { id: 'inhaler', build: function () {
        var n = pick([1, 2, 2]);
        return { verb: 'Inhale', qty: word(n) + ' puff' + (n > 1 ? 's' : ''),
                 route: 'by mouth', sigQty: n + ' puff' + (n > 1 ? 's' : ''), sigRoute: 'inh',
                 koQty: n + '회 흡입', koRoute: '흡입' };
      } },
    { id: 'supp', build: function () {
        return { verb: 'Insert', qty: 'one suppository', route: 'rectally',
                 sigQty: '1 supp', sigRoute: 'pr', koQty: '좌제 1개', koRoute: '직장' };
      } },
    { id: 'inject', build: function () {
        var n = pick([5, 10, 15, 20, 30]);
        return { verb: 'Inject', qty: word(n) + ' units', route: 'under the skin',
                 sigQty: n + ' units', sigRoute: 'subq', koQty: n + ' units', koRoute: '피하' };
      } },
    { id: 'sl', build: function () {
        return { verb: 'Place', qty: 'one tablet', route: 'under the tongue',
                 sigQty: '1 tab', sigRoute: 'sl', koQty: '1정', koRoute: '설하' };
      } },
    { id: 'nasal', build: function () {
        var n = pick([1, 2]);
        return { verb: 'Instill', qty: word(n) + ' spray' + (n > 1 ? 's' : ''),
                 route: 'in each nostril', sigQty: n + ' spray' + (n > 1 ? 's' : ''),
                 sigRoute: 'each nostril', koQty: n + '회 분무', koRoute: '양쪽 콧구멍' };
      } }
  ];

  var FREQ = [
    { e: 'every five minutes', s: 'q5min', k: '5분마다' },
    { e: 'once daily', s: 'daily', k: '1일 1회' },
    { e: 'twice daily', s: 'bid', k: '1일 2회' },
    { e: 'three times daily', s: 'tid', k: '1일 3회' },
    { e: 'four times daily', s: 'qid', k: '1일 4회' },
    { e: 'every four hours', s: 'q4h', k: '4시간마다' },
    { e: 'every six hours', s: 'q6h', k: '6시간마다' },
    { e: 'every eight hours', s: 'q8h', k: '8시간마다' },
    { e: 'every twelve hours', s: 'q12h', k: '12시간마다' },
    { e: 'every other day', s: 'qod', k: '격일' },
    { e: 'at bedtime', s: 'hs', k: '취침 시' }
  ];
  var DUR = [
    { e: '', s: '', k: '' },
    { e: 'for three days', s: 'x 3d', k: '3일간' },
    { e: 'for five days', s: 'x 5d', k: '5일간' },
    { e: 'for seven days', s: 'x 7d', k: '7일간' },
    { e: 'for ten days', s: 'x 10d', k: '10일간' },
    { e: 'for fourteen days', s: 'x 14d', k: '14일간' }
  ];
  var COND = {
    none:   { e: '', s: '', k: '' },
    pain:   { e: 'as needed for pain', s: 'prn pain', k: '통증 시' },
    cough:  { e: 'as needed for cough', s: 'prn cough', k: '기침 시' },
    nausea: { e: 'as needed for nausea', s: 'prn nausea', k: '구역 시' },
    anx:    { e: 'as needed for anxiety', s: 'prn anxiety', k: '불안 시' },
    sob:    { e: 'as needed for shortness of breath', s: 'prn SOB', k: '숨참 시' },
    cp:     { e: 'as needed for chest pain', s: 'prn CP', k: '흉통 시' },
    food:   { e: 'with food', s: 'with food', k: '음식과 함께' },
    ac:     { e: 'before meals', s: 'ac', k: '식전' },
    pc:     { e: 'after meals', s: 'pc', k: '식후' },
    itch:   { e: 'as needed for itching', s: 'prn itching', k: '가려움 시' }
  };
  var COND_LIST = Object.keys(COND).map(function (k) { return COND[k]; });

  /* 제형마다 어울리는 조건만 붙인다 — 설하정에 "with food"가 붙는 일이 없도록 */
  var COND_BY_FORM = {
    tab:     ['none', 'none', 'pain', 'nausea', 'anx', 'food', 'ac', 'pc'],
    cap:     ['none', 'none', 'food', 'ac', 'pc'],
    liquid:  ['none', 'cough', 'nausea', 'pain', 'food'],
    eye:     ['none', 'none', 'none'],
    ear:     ['none', 'none', 'pain'],
    top:     ['none', 'none', 'itch'],
    inhaler: ['none', 'sob', 'sob', 'cough'],
    supp:    ['none', 'nausea', 'pain'],
    inject:  ['none', 'none'],
    sl:      ['cp'],
    nasal:   ['none', 'none']
  };

  var POOLS = null;   // data/sig.json 의 pools
  var EXAMPLES = [];

  function init(data) {
    POOLS = data.pools;
    EXAMPLES = data.examples || [];
  }

  /* 각 항목의 오답 보기: 같은 종류의 다른 표현에서 뽑는다 */
  function distractors(k, answer, extra) {
    var pool = [];
    if (POOLS && POOLS[k]) pool = POOLS[k].map(function (x) { return x.v; });
    if (k === 'qty' && POOLS) pool = POOLS.unit.map(function (x) { return x.v; });
    (extra || []).forEach(function (x) { pool.push(x); });
    pool = pool.filter(function (v) { return v && v !== answer; });
    return shuffle(pool);
  }

  function optionsFor(k, answer, extra) {
    var opts = [answer], seen = {}, d = distractors(k, answer, extra);
    seen[answer] = 1;
    for (var i = 0; i < d.length && opts.length < 4; i++) {
      if (!seen[d[i]]) { seen[d[i]] = 1; opts.push(d[i]); }
    }
    return shuffle(opts);
  }

  var WHY = {
    verb: function (a) {
      var m = { Take: '정제·캡슐·액상은 Take입니다.',
                Apply: '연고·크림은 Apply — 바르는 동작입니다.',
                Instill: '점안·점이·비강액은 Instill입니다. Take라고 쓰면 안 됩니다.',
                Inhale: '흡입기는 Inhale입니다.',
                Insert: '좌제는 Insert입니다.',
                Inject: '주사제는 Inject입니다.',
                Place: '설하정은 Place ... under the tongue로 씁니다.',
                Chew: '저작정은 Chew입니다.' };
      return m[a] || '';
    },
    qty: function (a) {
      if (/thin layer/.test(a)) return '연고는 수량 자리에 a thin layer가 들어갑니다.';
      if (/units/.test(a)) return 'units는 U로 줄이지 않습니다 — 4나 0으로 오독됩니다.';
      if (/milliliters/.test(a)) return '액상은 부피가 곧 수량입니다. 제형 단어를 따로 쓰지 않습니다.';
      return /s$/.test(a.split(' ').pop()) ? '수량이 2 이상이면 복수형입니다.' : '수량이 1이면 단수형입니다.';
    },
    route: function (a) {
      if (/eye/.test(a)) return 'o로 시작하는 약어(od·os·ou)는 눈입니다.';
      if (/ear/.test(a)) return 'a로 시작하는 약어(ad·as·au)는 귀입니다.';
      if (/tongue/.test(a)) return 'sl은 설하 — 삼키지 말고 혀 밑에 둡니다.';
      if (/affected/.test(a)) return 'top은 환부에 바르는 국소 도포입니다.';
      if (/skin/.test(a)) return 'subq는 피하 주사입니다.';
      return '경로는 라벨에서 풀어 씁니다.';
    },
    freq: function (a, s) { return '약어 ' + (s || '') + '는 글자대로 읽지 않고 "' + a + '"로 말합니다.'; },
    dur: function (a) { return a ? 'x 표기는 기간입니다. ' + a + '.' : '기간 표기가 없으면 이 자리는 비워 둡니다.'; },
    cond: function (a) { return a ? (/as needed/.test(a) ? 'prn은 as needed for ~ 입니다.' : '조건은 문장 끝에 붙습니다.')
                                  : '조건 표기가 없으면 이 자리는 비워 둡니다.'; }
  };

  function makeRound(base) {
    var steps = [];
    SLOTS.forEach(function (s) {
      var ans = base.steps[s.k];
      if (ans === undefined) return;
      if (ans === '' && (s.k === 'dur' || s.k === 'cond')) ans = '(없음)';
      var extra = s.k === 'dur' ? DUR.map(function (x) { return x.e || '(없음)'; })
                : s.k === 'cond' ? COND_LIST.map(function (x) { return x.e || '(없음)'; })
                : s.k === 'qty' ? [] : null;
      var opts = optionsFor(s.k, ans, extra);
      steps.push({
        k: s.k, label: s.label, hint: s.hint, ans: ans, opts: opts,
        why: (WHY[s.k] ? WHY[s.k](ans, base.sigParts && base.sigParts[s.k]) : '')
      });
    });
    var en = steps.map(function (s) { return s.ans === '(없음)' ? '' : s.ans; })
                  .filter(Boolean).join(' ') + '.';
    return { sig: base.sig, ko: base.ko, steps: steps, en: en, note: base.note || '' };
  }

  var NO_DURATION = { inhaler: 1, inject: 1, sl: 1, nasal: 1 };

  /* 제형마다 실제로 쓰이는 빈도만 — 비강 스프레이가 1일 4회로 나오지 않도록 */
  var FREQ_BY_FORM = {
    tab:     ['daily', 'bid', 'tid', 'qid', 'q4h', 'q6h', 'q8h', 'q12h', 'qod', 'hs'],
    cap:     ['daily', 'bid', 'tid', 'q12h', 'hs'],
    liquid:  ['bid', 'tid', 'qid', 'q4h', 'q6h', 'q8h', 'q12h'],
    eye:     ['daily', 'bid', 'tid', 'qid', 'q4h', 'q6h', 'hs'],
    ear:     ['bid', 'tid', 'qid'],
    top:     ['daily', 'bid', 'tid', 'hs'],
    inhaler: ['daily', 'bid', 'q4h', 'q6h'],
    supp:    ['daily', 'bid', 'q6h', 'q8h'],
    inject:  ['daily', 'bid', 'tid', 'hs'],
    sl:      ['q5min'],
    nasal:   ['daily', 'bid']
  };
  function freqFor(id) {
    var allow = FREQ_BY_FORM[id];
    var list = allow ? FREQ.filter(function (f) { return allow.indexOf(f.s) !== -1; }) : FREQ;
    return pick(list.length ? list : FREQ);
  }

  function randomRound() {
    var recipe = pick(RECIPES);
    var r = recipe.build();
    var f = freqFor(recipe.id);
    var d = NO_DURATION[recipe.id] ? DUR[0] : pick(DUR);
    var c = COND[pick(COND_BY_FORM[recipe.id] || ['none'])];
    // 조건과 기간이 동시에 붙으면 문장이 길어지므로 하나만 남긴다
    if (d.e && c.e && Math.random() < 0.6) c = COND.none;
    var sig = [r.sigQty, r.sigRoute, f.s, d.s, c.s].filter(Boolean).join(' ');
    var ko = [r.koQty, r.koRoute, f.k, d.k, c.k].filter(Boolean).join(', ');
    return makeRound({
      sig: sig, ko: ko,
      sigParts: { freq: f.s, dur: d.s, cond: c.s },
      steps: { verb: r.verb, qty: r.qty, route: r.route, freq: f.e, dur: d.e, cond: c.e }
    });
  }

  function exampleRound(i) {
    var ex = EXAMPLES[i % EXAMPLES.length];
    return makeRound({ sig: ex.sig, ko: ex.ko, steps: ex.steps, note: ex.note });
  }

  return {
    init: init,
    slots: SLOTS,
    randomRound: randomRound,
    exampleRound: exampleRound,
    exampleCount: function () { return EXAMPLES.length; },
    _pick: pick
  };
})();
