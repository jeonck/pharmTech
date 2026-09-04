/* PTCE 모의고사 엔진
 * 2026 블루프린트 비중대로 문항을 뽑고, 계산 문항 일부는 생성기로 채운다.
 */
window.PTExam = (function () {
  var BANK = [];
  // 2026 출제 비중 — 도메인 1 약물, 2 연방 법규, 3 환자 안전, 4 처방 처리
  var W = { 1: 0.35, 2: 0.1875, 3: 0.2375, 4: 0.225 };
  var NAME = { 1: '약물', 2: '연방 법규', 3: '환자 안전·품질관리', 4: '처방 입력·처리' };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function init(data) { BANK = data || []; }
  function byDomain(d) { return BANK.filter(function (x) { return x.d === d; }); }

  /* 비중대로 문항 수를 배분한다(최대잉여법) */
  function plan(total) {
    var out = {}, used = 0, rem = [];
    [1, 2, 3, 4].forEach(function (d) {
      var exact = total * W[d];
      out[d] = Math.floor(exact);
      used += out[d];
      rem.push({ d: d, r: exact - Math.floor(exact) });
    });
    rem.sort(function (a, b) { return b.r - a.r; });
    for (var i = 0; used < total; i++, used++) out[rem[i % 4].d]++;
    return out;
  }

  /* 시험지 구성. calcRatio 만큼은 계산 생성기 문항으로 채운다(도메인 4). */
  function build(total, opts) {
    opts = opts || {};
    var p = plan(total);
    var set = [];
    [1, 2, 3, 4].forEach(function (d) {
      var need = p[d];
      var pool = shuffle(byDomain(d));
      if (d === 4 && window.PTQuizGen && opts.calc !== false) {
        var nCalc = Math.max(2, Math.round(need * 0.35));   // 처방 처리의 약 1/3은 계산
        var gen = window.PTQuizGen.sample(nCalc).map(function (g) {
          return { id: g.id, d: 4, ka: '4.7', q: g.q, c: g.c, a: g.a, e: g.e, gen: g.gen };
        });
        set = set.concat(gen);
        need -= gen.length;
      }
      set = set.concat(pool.slice(0, Math.max(0, need)));
    });
    return shuffle(set).slice(0, total);
  }

  /* 특정 도메인만 */
  function byDomainSet(d, n) {
    var pool = shuffle(byDomain(d));
    if (d === 4 && window.PTQuizGen) {
      var gen = window.PTQuizGen.sample(Math.max(2, Math.round(n * 0.35))).map(function (g) {
        return { id: g.id, d: 4, ka: '4.7', q: g.q, c: g.c, a: g.a, e: g.e, gen: g.gen };
      });
      pool = shuffle(gen.concat(pool));
    }
    return pool.slice(0, n);
  }

  /* 오답으로 저장해 둔 문항을 되살린다. 생성 문항은 새 숫자로. */
  function reviewSet(ids, n) {
    var byId = {};
    BANK.forEach(function (x) { byId[x.id] = x; });
    var out = [];
    ids.forEach(function (id) {
      if (typeof id === 'string' && id.indexOf('gen:') === 0) {
        if (window.PTQuizGen) {
          var g = window.PTQuizGen.byName(id.slice(4));
          if (g) out.push({ id: g.id, d: 4, ka: '4.7', q: g.q, c: g.c, a: g.a, e: g.e, gen: g.gen });
        }
      } else if (byId[id]) out.push(byId[id]);
    });
    return shuffle(out).slice(0, n || out.length);
  }

  /* 채점 — 도메인별 정답률과 척도 점수 근사 */
  function grade(set, answers) {
    var per = { 1: { ok: 0, n: 0 }, 2: { ok: 0, n: 0 }, 3: { ok: 0, n: 0 }, 4: { ok: 0, n: 0 } };
    var wrong = [], ok = 0;
    set.forEach(function (q, i) {
      per[q.d].n++;
      if (answers[i] === q.a) { ok++; per[q.d].ok++; }
      else wrong.push({ q: q, picked: answers[i] });
    });
    var pct = set.length ? ok / set.length : 0;
    return {
      ok: ok, total: set.length, pct: Math.round(pct * 100),
      scaled: Math.round(1000 + pct * 600),   // 1000~1600 근사
      pass: Math.round(1000 + pct * 600) >= 1400,
      per: per, wrong: wrong
    };
  }

  return {
    init: init, build: build, byDomainSet: byDomainSet, reviewSet: reviewSet,
    grade: grade, plan: plan, name: function (d) { return NAME[d]; },
    weights: W, count: function () { return BANK.length; },
    domainCount: function (d) { return byDomain(d).length; }
  };
})();
