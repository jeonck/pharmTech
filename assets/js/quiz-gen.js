/* 계산 문제 생성기 — 풀 때마다 숫자가 바뀐다.
 * 각 생성기는 {t,q,c,a,e,id} 형태의 문항 하나를 만든다.
 * id는 "gen:<이름>" 이라 오답 목록에 남겨두면 다음에 같은 유형이 새 숫자로 다시 나온다.
 */
window.PTQuizGen = (function () {
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // 소수점 정리 + 천 단위 구분
  function n(v, dec) {
    var x = Math.round(v * Math.pow(10, dec === undefined ? 2 : dec)) / Math.pow(10, dec === undefined ? 2 : dec);
    var s = String(x);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return p.join('.');
  }

  /* 보기 조립: 정답 + 오답 후보에서 서로 다른 값 4개를 골라 섞는다.
     오답이 정답과 겹치거나 모자라면 배수/분수로 채운다. */
  function mk(name, q, ans, wrongs, exp, unit) {
    unit = unit === undefined ? '' : unit;
    var seen = {}, opts = [];
    function put(v) {
      if (!isFinite(v) || v <= 0 || Math.round(v * 100) === 0) return;
      var s = n(v) + unit;
      if (seen[s]) return;
      seen[s] = 1; opts.push(s);
    }
    put(ans);
    var correct = n(ans) + unit;
    wrongs.forEach(put);
    var filler = [ans * 2, ans / 2, ans * 10, ans / 10, ans + 1, ans * 1.5];
    for (var i = 0; opts.length < 4 && i < filler.length; i++) put(filler[i]);
    opts = shuffle(opts.slice(0, 4));
    return { t: '계산', q: q, c: opts, a: opts.indexOf(correct), e: exp, id: 'gen:' + name, gen: name };
  }

  /* ── Day 3 : 단위 환산 · 농도 · 비례 ───────────────────────────── */
  var D3 = {
    kg2lb: function () {
      var kg = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80]);
      var lb = kg * 2.2;
      return mk('kg2lb',
        '체중이 ' + kg + ' kg인 환자는 몇 lb인가?',
        lb, [kg / 2.2, kg * 2, kg / 2],
        kg + ' × 2.2 = ' + n(lb) + ' lb. kg에서 lb로 갈 때는 곱하고, 반대로는 나눕니다.', ' lb');
    },
    volConv: function () {
      var ml = pick([60, 90, 120, 240, 480]);
      var oz = ml / 30;
      return mk('volConv',
        n(ml, 0) + ' mL는 몇 fl oz인가? (1 fl oz ≈ 30 mL)',
        oz, [ml / 15, ml / 5, ml * 30],
        n(ml, 0) + ' ÷ 30 = ' + n(oz) + ' fl oz입니다. 1 pint = 480 mL, 1 quart = 960 mL로 함께 외우세요.', ' fl oz');
    },
    gr2mg: function () {
      var gr = pick([1, 2, 3, 5, 10]);
      return mk('gr2mg',
        gr + ' grain(gr)은 몇 mg인가? (1 gr = 65 mg)',
        gr * 65, [gr * 60, gr * 6.5, gr * 650],
        gr + ' × 65 = ' + n(gr * 65) + ' mg. 아스피린 5 gr = 325 mg으로 연결해 외우면 편합니다.', ' mg');
    },
    gToMg: function () {
      var g = pick([0.125, 0.25, 0.5, 1.5, 2, 2.5]);
      return mk('gToMg',
        n(g, 3) + ' g은 몇 mg인가?',
        g * 1000, [g * 100, g * 10000, g / 1000],
        '1 g = 1,000 mg이므로 ' + n(g, 3) + ' × 1,000 = ' + n(g * 1000) + ' mg입니다.', ' mg');
    },
    concToPercent: function () {
      var mgml = pick([5, 10, 20, 25, 50, 100]);
      return mk('concToPercent',
        mgml + ' mg/mL 용액은 몇 %(w/v)인가?',
        mgml / 10, [mgml * 10, mgml / 100, mgml],
        mgml + ' mg/mL = ' + n(mgml / 10) + ' g/100 mL = ' + n(mgml / 10) + '%입니다. mg/mL를 10으로 나누면 %가 됩니다.', '%');
    },
    percentToMg: function () {
      var p2 = pick([0.5, 1, 2, 4]);
      var ml = pick([2, 5, 10, 20]);
      var mg = p2 * 10 * ml;
      return mk('percentToMg',
        p2 + '% 리도카인 ' + ml + ' mL 앰플에 들어 있는 리도카인은 몇 mg인가?',
        mg, [mg / 10, mg * 10, p2 * ml],
        p2 + '% = ' + n(p2 * 10) + ' mg/mL이므로 ' + n(p2 * 10) + ' × ' + ml + ' = ' + n(mg) + ' mg입니다.', ' mg');
    },
    creamActive: function () {
      var p2 = pick([0.5, 1, 2, 2.5, 5]);
      var g = pick([15, 30, 45, 60, 120]);
      var act = p2 / 100 * g;
      return mk('creamActive',
        p2 + '% 연고 ' + g + ' g에 들어 있는 주성분은 몇 g인가?',
        act, [act * 10, act / 10, p2 * g],
        p2 + ' ÷ 100 × ' + g + ' = ' + n(act) + ' g. % w/w는 100 g 중 g 수입니다.', ' g');
    },
    markup: function () {
      var cost = pick([20, 25, 40, 50, 80, 100]);
      var rate = pick([20, 25, 30, 40, 50]);
      var sell = cost * (1 + rate / 100);
      return mk('markup',
        '원가 $' + cost + '인 약을 $' + n(sell, 2) + '에 판매한다. 마크업률은 몇 %인가?',
        rate, [(sell - cost) / sell * 100, sell / cost * 100, rate * 2],
        '마크업 = $' + n(sell - cost) + ', 마크업률 = 마크업 ÷ 원가 × 100 = ' + n(rate) + '%입니다. (이익률은 판매가로 나눕니다)', '%');
    },
    lb2kg: function () {
      var kg = pick([10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80]);
      var lb = Math.round(kg * 2.2 * 10) / 10;
      return mk('lb2kg',
        '환자의 체중이 ' + n(lb, 1) + ' lb이다. 몇 kg인가?',
        kg, [lb * 2.2, lb / 2, lb],
        n(lb, 1) + ' ÷ 2.2 = ' + n(kg) + ' kg. lb를 kg으로 바꿀 때는 2.2로 나눕니다.', ' kg');
    },
    spoon: function () {
      var t = pick([{ k: 'tsp', v: 5 }, { k: 'tbsp', v: 15 }]);
      var q = pick([1, 1.5, 2, 2.5, 3, 4]);
      return mk('spoon',
        '처방에 1회 ' + n(q, 1) + ' ' + t.k + '으로 되어 있다. 몇 mL인가?',
        q * t.v, [q * (t.k === 'tsp' ? 15 : 5), q * 10, q * 30],
        '1 tsp = 5 mL, 1 tbsp = 15 mL. ' + n(q, 1) + ' × ' + t.v + ' = ' + n(q * t.v) + ' mL.', ' mL');
    },
    micro: function () {
      var mg = pick([0.125, 0.25, 0.5, 0.75, 1.5, 2.5, 5]);
      return mk('micro',
        'levothyroxine ' + n(mg, 3) + ' mg은 몇 mcg인가?',
        mg * 1000, [mg * 100, mg * 10000, mg / 1000],
        '1 mg = 1,000 mcg이므로 ' + n(mg, 3) + ' × 1,000 = ' + n(mg * 1000) + ' mcg.', ' mcg');
    },
    percent: function () {
      var p, v, g;
      for (var i = 0; i < 60; i++) {
        p = pick([0.45, 0.9, 3, 5, 10]);
        v = pick([100, 250, 500, 1000]);
        g = p / 100 * v;
        if ((g * 100) % 1 === 0) break;
      }
      return mk('percent',
        p + '% 용액 ' + n(v, 0) + ' mL 안에 들어 있는 약물의 양은 몇 g인가?',
        g, [g * 10, g / 10, p * v],
        '% w/v는 100 mL 중 g 수입니다. ' + p + ' ÷ 100 × ' + n(v, 0) + ' = ' + n(g) + ' g.', ' g');
    },
    ratio: function () {
      var d = pick([1000, 10000, 200, 100]);
      var mgml = 1000 / d;
      return mk('ratio',
        '1:' + n(d, 0) + ' 용액은 mg/mL로 얼마인가?',
        mgml, [mgml * 10, mgml / 10, d / 1000],
        '1:' + n(d, 0) + ' = 1 g / ' + n(d, 0) + ' mL = ' + n(1000 / d) + ' mg/mL입니다.', ' mg/mL');
    },
    prop: function () {
      var per, vol, mult, dose;
      for (var i = 0; i < 60; i++) {
        per = pick([125, 200, 250, 400]);
        vol = pick([5, 5, 10]);
        mult = pick([0.5, 1.5, 2, 2.5, 3]);
        dose = per * mult;
        if (dose % 1 === 0 && (dose / per * vol * 2) % 1 === 0) break;  // 용량은 정수, 답은 0.5 mL 단위
      }
      return mk('prop',
        per + ' mg/' + vol + ' mL 현탁액으로 ' + n(dose, 0) + ' mg을 투여하려면 몇 mL가 필요한가?',
        dose / per * vol, [dose / per, per / dose * vol, dose * vol / 100],
        '비례식: ' + per + '/' + vol + ' = ' + n(dose, 0) + '/x → x = ' + n(dose, 0) + ' × ' + vol + ' ÷ ' + per + ' = ' + n(dose / per * vol) + ' mL.', ' mL');
    },
    tabs: function () {
      var have = pick([5, 10, 20, 25, 50, 100]);
      var mult = pick([0.5, 1.5, 2, 3]);
      var need = have * mult;
      return mk('tabs',
        '처방 용량이 1회 ' + n(need, 1) + ' mg인데 보유 규격은 ' + have + ' mg 정제이다. 1회 몇 정인가?',
        mult, [have / need, mult * 2, mult / 2],
        n(need, 1) + ' ÷ ' + have + ' = ' + n(mult) + '정입니다.', '정');
    },
    total: function () {
      var each = pick([2.5, 5, 7.5, 10, 15]);
      var freq = pick([2, 3, 4]);
      var days = pick([5, 7, 10, 14]);
      return mk('total',
        '1회 ' + n(each, 1) + ' mL를 1일 ' + freq + '회, ' + days + '일간 복용한다. 총 조제량은?',
        each * freq * days, [each * freq, each * days, each * freq * days / 2],
        '1일 사용량 ' + n(each * freq) + ' mL × ' + days + '일 = ' + n(each * freq * days) + ' mL.', ' mL');
    },
    temp: function () {
      var c = pick([2, 8, 15, 20, 25, 30, 37, 40]);
      var f = c * 9 / 5 + 32;
      return mk('temp',
        '냉장고 온도가 ' + n(f, 1) + '°F로 표시되어 있다. 몇 °C인가?',
        c, [(f - 32) * 9 / 5, f / 2, (f + 32) * 5 / 9],
        '°C = (°F − 32) × 5/9 = (' + n(f, 1) + ' − 32) × 5/9 = ' + n(c) + '°C.', '°C');
    },
    price: function () {
      var awp = pick([80, 120, 150, 200, 240, 300]);
      var disc = pick([10, 15, 20, 25]);
      var fee = pick([2, 3, 4, 5]);
      var price = awp * (1 - disc / 100) + fee;
      return mk('price',
        'AWP $' + awp + '인 약을 ' + disc + '% 할인해 구입하고 조제료 $' + fee + '를 더하면 가격은 얼마인가?',
        price, [awp * (1 + disc / 100) + fee, awp * disc / 100 + fee, awp - disc + fee],
        '$' + awp + ' × ' + (1 - disc / 100).toFixed(2) + ' = $' + n(awp * (1 - disc / 100)) + ', 여기에 조제료 $' + fee + '를 더해 $' + n(price) + '입니다.', ' 달러');
    }
  };

  /* ── Day 4 : day supply · 체중 · IV ────────────────────────────── */
  var D4 = {
    inhaler: function () {
      var puffsTotal = pick([120, 200, 200, 60]);
      var perUse = pick([1, 2]);
      var freq = pick([2, 3, 4]);
      var days = Math.floor(puffsTotal / (perUse * freq));
      return mk('inhaler',
        '흡입기 1개에 ' + puffsTotal + ' puffs가 들어 있다. 1회 ' + perUse + ' puff' + (perUse > 1 ? 's' : '') + '를 1일 ' + freq + '회 사용하면 day supply는?',
        days, [Math.floor(puffsTotal / freq), Math.floor(puffsTotal / perUse), days * 2],
        '하루 사용 = ' + perUse + ' × ' + freq + ' = ' + (perUse * freq) + ' puffs. ' + puffsTotal + ' ÷ ' + (perUse * freq) + ' = ' + days + '일분입니다.', '일');
    },
    insulinPen: function () {
      var pens = pick([3, 5]);
      var units = pick([15, 20, 25, 30, 50, 60]);
      var total = pens * 3 * 100;
      var days = Math.floor(total / units);
      return mk('insulinPen',
        '인슐린 펜 3 mL짜리 ' + pens + '개(100 units/mL)를 하루 ' + units + ' units 사용한다. day supply는?',
        days, [Math.floor(total / (units * pens)), Math.floor(3 * 100 / units), days * 2],
        '총 ' + n(total, 0) + ' units(3 mL × 100 × ' + pens + '개) ÷ ' + units + ' = ' + days + '일분입니다.', '일');
    },
    refillDay: function () {
      var combo = pick([[30, 80], [60, 75], [90, 80], [30, 90], [60, 80], [30, 70], [60, 90], [90, 70]]);
      var days = combo[0], pct = combo[1];
      var d2 = days * pct / 100;
      return mk('refillDay',
        days + '일분으로 조제된 약을 보험이 ' + pct + '% 소진 시점부터 재조제해 준다. 조제일로부터 며칠 뒤부터 가능한가?',
        d2, [days - d2, days * pct / 1000, d2 / 2],
        days + ' × ' + (pct / 100).toFixed(2) + ' = ' + n(d2) + '일. 이보다 이르면 Refill Too Soon으로 거절됩니다.', '일');
    },
    reconstitute: function () {
      var conc = pick([125, 200, 250, 500]);
      var mult = pick([1, 1.5, 2, 3]);
      var dose = conc * mult;
      return mk('reconstitute',
        '바이알을 재구성해 ' + conc + ' mg/mL 농도가 되었다. ' + n(dose, 0) + ' mg을 투여하려면 몇 mL를 뽑아야 하는가?',
        dose / conc, [conc / dose, dose / conc * 10, dose / (conc * 2)],
        n(dose, 0) + ' ÷ ' + conc + ' = ' + n(dose / conc) + ' mL입니다.', ' mL');
    },
    mEq: function () {
      var per = pick([2, 4]);
      var need = pick([10, 20, 30, 40, 60]);
      return mk('mEq',
        'KCl ' + per + ' mEq/mL 용액으로 ' + need + ' mEq를 준비하려면 몇 mL가 필요한가?',
        need / per, [need * per, per / need * 100, need / (per * 2)],
        need + ' ÷ ' + per + ' = ' + n(need / per) + ' mL. 농축 KCl은 high-alert 약물이라 이중 확인 대상입니다.', ' mL');
    },
    unitsVol: function () {
      var per = pick([1000, 5000, 10000]);
      var need = pick([0.25, 0.5, 1, 1.5, 2]).valueOf() * per;
      return mk('unitsVol',
        'heparin ' + n(per, 0) + ' units/mL 바이알에서 ' + n(need, 0) + ' units를 뽑으려면 몇 mL인가?',
        need / per, [per / need, need / per * 10, need / (per * 2)],
        n(need, 0) + ' ÷ ' + n(per, 0) + ' = ' + n(need / per) + ' mL. heparin은 high-alert 약물입니다.', ' mL');
    },
    totalTabs: function () {
      var perDose = pick([1, 2]);
      var freq = pick([1, 2, 3]);
      var days = pick([30, 60, 90]);
      return mk('totalTabs',
        '1회 ' + perDose + '정씩 1일 ' + freq + '회, ' + days + '일분을 조제하려면 총 몇 정이 필요한가?',
        perDose * freq * days, [perDose * days, freq * days, perDose * freq * days / 2],
        '1일 ' + (perDose * freq) + '정 × ' + days + '일 = ' + n(perDose * freq * days) + '정입니다.', '정');
    },
    ivRemaining: function () {
      var rate = pick([50, 75, 100, 125]);
      var hrLeft = pick([2, 3, 4, 6]);
      var left = rate * hrLeft;
      var bag = pick([500, 1000]);
      if (left >= bag) bag = 1000;
      return mk('ivRemaining',
        n(bag, 0) + ' mL 백을 ' + rate + ' mL/hr로 투여 중이고 현재 ' + n(left, 0) + ' mL가 남아 있다. 몇 시간 뒤에 끝나는가?',
        hrLeft, [bag / rate, left / (rate * 2), hrLeft * 2],
        '남은 부피 ÷ 유속 = ' + n(left, 0) + ' ÷ ' + rate + ' = ' + hrLeft + '시간입니다.', '시간');
    },
    dsLiquid: function () {
      var each = pick([2.5, 5, 10]);
      var freq = pick([2, 3, 4]);
      var days = pick([7, 10, 14]);
      var total = each * freq * days;
      return mk('dsLiquid',
        '현탁액 ' + n(total, 0) + ' mL를 1회 ' + n(each, 1) + ' mL씩 1일 ' + freq + '회 복용한다. day supply는?',
        days, [total / each, days * freq, total / (each * freq * 2)],
        '1일 사용량 = ' + n(each, 1) + ' × ' + freq + ' = ' + n(each * freq) + ' mL. ' + n(total, 0) + ' ÷ ' + n(each * freq) + ' = ' + days + '일분.', '일');
    },
    dsEye: function () {
      var ml = pick([2.5, 5, 10, 15]);
      var eyes = pick([1, 2]);
      var gtt = pick([1, 1, 2]);
      var freq = pick([2, 3, 4]);
      var perDay = eyes * gtt * freq;
      var days = Math.floor(ml * 20 / perDay);
      return mk('dsEye',
        '점안액 ' + n(ml, 1) + ' mL를 ' + (eyes === 2 ? '양안' : '한쪽 눈') + '에 ' + gtt + '방울씩 1일 ' + freq + '회 점안한다. day supply는? (1 mL = 20방울)',
        days, [Math.floor(ml * 20 / (gtt * freq)), Math.floor(ml * 20 / freq), days * 2],
        n(ml, 1) + ' mL = ' + n(ml * 20, 0) + '방울, 하루 사용 = ' + (eyes === 2 ? '2눈 × ' : '') + gtt + '방울 × ' + freq + '회 = ' + perDay + '방울. ' + n(ml * 20, 0) + ' ÷ ' + perDay + ' = ' + days + '일분(버림).', '일');
    },
    dsInsulin: function () {
      var ml = pick([3, 10]);
      var units = pick([20, 25, 30, 40, 50, 60]);
      var total = ml * 100;
      var days = Math.floor(total / units);
      return mk('dsInsulin',
        '인슐린 ' + ml + ' mL 바이알(100 units/mL)을 하루 ' + units + ' units 사용한다. day supply는?',
        days, [Math.floor(total / (units * 2)), ml * units, Math.floor(ml * units / 10)],
        '총 ' + n(total, 0) + ' units ÷ ' + units + ' units/일 = ' + days + '일분입니다.', '일');
    },
    dsTab: function () {
      var qty = pick([30, 60, 90, 120]);
      var perDose = pick([1, 1, 2]);
      var freq = pick([1, 2, 3]);
      var perDay = perDose * freq;
      var days = Math.floor(qty / perDay);
      return mk('dsTab',
        qty + '정을 1회 ' + perDose + '정씩 1일 ' + freq + '회 복용한다. day supply는?',
        days, [qty / perDose, qty / freq, days * 2],
        '1일 ' + perDay + '정 사용. ' + qty + ' ÷ ' + perDay + ' = ' + days + '일분입니다.', '일');
    },
    pedDose: function () {
      var kg, lb, mgkg, freq, perDose;
      for (var i = 0; i < 60; i++) {
        kg = pick([10, 15, 20, 25, 30]);
        mgkg = pick([10, 15, 20, 30, 40]);
        freq = pick([2, 3]);
        perDose = kg * mgkg / freq;
        if (perDose % 1 === 0) break;
      }
      lb = Math.round(kg * 2.2 * 10) / 10;
      return mk('pedDose',
        lb + ' lb 소아에게 ' + mgkg + ' mg/kg/day를 1일 ' + freq + '회 분할 투여한다. 1회 용량은?',
        perDose, [kg * mgkg, lb * mgkg / freq, perDose / 2],
        lb + ' ÷ 2.2 = ' + kg + ' kg → ' + kg + ' × ' + mgkg + ' = ' + n(kg * mgkg, 0) + ' mg/day → ' + freq + '회 분할이므로 1회 ' + n(perDose) + ' mg.', ' mg');
    },
    pedVolume: function () {
      var kg, lb, mgkg, freq, conc, perDose, ml;
      for (var tries = 0; tries < 60; tries++) {
        kg = pick([10, 20, 25, 30]);
        mgkg = pick([20, 25, 30, 40, 50]);
        freq = pick([2, 3]);
        conc = pick([{ mg: 125, ml: 5 }, { mg: 250, ml: 5 }, { mg: 200, ml: 5 }]);
        perDose = kg * mgkg / freq;
        ml = perDose / conc.mg * conc.ml;
        if (perDose % 1 === 0 && (ml * 2) % 1 === 0) break;   // 0.5 mL 단위로 떨어질 때만
      }
      lb = Math.round(kg * 2.2 * 10) / 10;
      return mk('pedVolume',
        lb + ' lb 소아에게 ' + mgkg + ' mg/kg/day를 1일 ' + freq + '회로 나눠 ' + conc.mg + ' mg/' + conc.ml + ' mL 현탁액으로 투여한다. 1회 몇 mL인가?',
        ml, [ml * freq, perDose / conc.mg, ml / 2],
        kg + ' kg × ' + mgkg + ' = ' + n(kg * mgkg, 0) + ' mg/day → 1회 ' + n(perDose) + ' mg → ' + n(perDose) + ' × ' + conc.ml + ' ÷ ' + conc.mg + ' = ' + n(ml) + ' mL.', ' mL');
    },
    ivRate: function () {
      var combo = pick([[250, 2], [250, 5], [500, 2], [500, 4], [500, 5], [500, 10],
                        [1000, 4], [1000, 5], [1000, 8], [1000, 10]]);
      var vol = combo[0], hr = combo[1];
      return mk('ivRate',
        n(vol, 0) + ' mL를 ' + hr + '시간에 걸쳐 투여한다. 유속은 몇 mL/hr인가?',
        vol / hr, [vol * hr, hr / vol * 1000, vol / (hr * 60)],
        n(vol, 0) + ' ÷ ' + hr + '시간 = ' + n(vol / hr) + ' mL/hr.', ' mL/hr');
    },
    ivDrops: function () {
      var vol = pick([500, 1000]);
      var hr = pick([4, 6, 8, 10, 12]);
      var df = pick([10, 15, 20, 60]);
      var gtt = vol * df / (hr * 60);
      return mk('ivDrops',
        n(vol, 0) + ' mL를 ' + hr + '시간에, drop factor ' + df + ' gtt/mL로 투여한다. 분당 몇 방울인가?',
        Math.round(gtt), [Math.round(gtt * 2), Math.round(vol / hr), Math.round(gtt / 2)],
        '(' + n(vol, 0) + ' × ' + df + ') ÷ ' + (hr * 60) + '분 = ' + n(gtt) + ' → 약 ' + Math.round(gtt) + ' gtt/min.', ' gtt/min');
    },
    ivTime: function () {
      var rate = pick([50, 75, 100, 125, 150]);
      var hr = pick([2, 3, 4, 6, 8]);
      var vol = rate * hr;
      return mk('ivTime',
        n(vol, 0) + ' mL를 ' + rate + ' mL/hr로 투여하면 몇 시간이 걸리는가?',
        hr, [vol / (rate * 2), rate / vol * 100, hr * 2],
        '총 부피 ÷ 유속 = ' + n(vol, 0) + ' ÷ ' + rate + ' = ' + hr + '시간.', '시간');
    },
    dilute: function () {
      var c1 = pick([10, 20, 25, 50]);
      var c2 = pick([1, 2, 5]);
      if (c2 >= c1) c2 = 1;
      var v2 = pick([250, 500, 1000]);
      var v1 = c2 * v2 / c1;
      return mk('dilute',
        c1 + '% 원액으로 ' + c2 + '% 용액 ' + n(v2, 0) + ' mL를 만들려면 원액이 몇 mL 필요한가?',
        v1, [v2 - v1, c1 * v2 / c2, v1 * 2],
        'C1V1 = C2V2 → ' + c1 + ' × V1 = ' + c2 + ' × ' + n(v2, 0) + ' → V1 = ' + n(v1) + ' mL. 나머지 ' + n(v2 - v1) + ' mL는 희석제입니다.', ' mL');
    }
  };

  var BY_DAY = { 3: D3, 4: D4 };
  var ALL = {};
  Object.keys(D3).forEach(function (k) { ALL[k] = D3[k]; });
  Object.keys(D4).forEach(function (k) { ALL[k] = D4[k]; });

  return {
    days: [3, 4],
    // 해당 일차의 계산 문제 10개를 새 숫자로 생성
    forDay: function (d) {
      var g = BY_DAY[d];
      if (!g) return null;
      return shuffle(Object.keys(g)).slice(0, 10).map(function (k) { return g[k](); });
    },
    // 오답 목록의 "gen:<이름>"을 같은 유형의 새 문제로 되살린다
    byName: function (name) {
      return ALL[name] ? ALL[name]() : null;
    },
    // 랜덤 세트에 섞어 넣을 계산 문제
    sample: function (k) {
      return shuffle(Object.keys(ALL)).slice(0, k).map(function (n2) { return ALL[n2](); });
    },
    names: Object.keys(ALL)
  };
})();
