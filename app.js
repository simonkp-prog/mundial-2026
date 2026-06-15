/* Mundial 2026 — render & UI logic */
(function () {
  const D = window.MUNDIAL_DATA;
  const $ = (s, el = document) => el.querySelector(s);

  // ---- state ----
  const state = { group: "ALL", conf: "ALL", q: "", onlyComplete: false };

  // ---- color helpers (verde/amarillo/rojo) ----
  // Devuelve "green" | "yellow" | "red" según umbrales; higherBetter define el sentido.
  function colorByThreshold(v, goodAt, midAt, higherBetter = true) {
    if (v == null) return "";
    if (higherBetter) {
      if (v >= goodAt) return "green";
      if (v >= midAt) return "yellow";
      return "red";
    } else {
      if (v <= goodAt) return "green";
      if (v <= midAt) return "yellow";
      return "red";
    }
  }
  const cdot = (c) => c ? `<span class="cdot ${c}"></span>` : "";

  // ---- formatters ----
  const fmt1 = (v) => (v == null ? null : v.toFixed(2).replace(/0$/, "").replace(/\.$/, ""));
  const nodata = `<span>sin datos suficientes</span>`;

  function metric(key, label, valueHtml, colorClass, starKey, highlight) {
    const star = (starKey && starKey === highlight) ? `<span class="star" title="Dato más fuerte">⭐</span>` : "";
    if (valueHtml == null) {
      return `<div class="metric nodata" data-k="${key}"><span class="k">${label}</span><span class="v">${nodata}</span></div>`;
    }
    return `<div class="metric" data-k="${key}">${star}<span class="k">${label}</span>` +
           `<span class="v">${cdot(colorClass)}${valueHtml}</span></div>`;
  }

  // ---- team card ----
  function teamCard(t) {
    if (t.status === "pending") {
      return `<article class="team pending">
        <div class="head">
          <span class="flag">${t.flag}</span>
          <div class="id">
            <h3>${t.name}</h3>
            <div class="chips"><span class="chip grp">Grupo ${t.group}</span><span class="chip">${t.conf}</span></div>
          </div>
          <span class="badge-pending">Pendiente</span>
        </div>
        <div class="body"><div class="empty-card">Por completar — agrega datos en <code>data.js</code></div></div>
      </article>`;
    }

    const h = t.highlight;

    // prob bar
    let probHtml = `<div class="metric nodata full"><span class="k">Prob. V/E/D (estimada)</span><span class="v">${nodata}</span></div>`;
    if (t.prob) {
      probHtml = `<div class="prob">
        <div class="plabel"><span>Prob. <span class="est">ESTIMADA</span> V / E / D</span><span>${t.prob.w}% · ${t.prob.d}% · ${t.prob.l}%</span></div>
        <div class="pbar">
          <div class="seg w" style="width:${t.prob.w}%">${t.prob.w}%</div>
          <div class="seg d" style="width:${t.prob.d}%">${t.prob.d}%</div>
          <div class="seg l" style="width:${t.prob.l}%">${t.prob.l}%</div>
        </div></div>`;
    }

    // metrics
    const gfHtml = t.gf == null ? null : `${fmt1(t.gf)} <small>${t.sample || ""}</small>`;
    const gaHtml = t.ga == null ? null : `${fmt1(t.ga)} <small>${t.sample || ""}</small>`;
    const recHtml = t.record == null ? null : `${t.record.w}G·${t.record.d}E·${t.record.l}P`;
    const ouHtml = t.over25 == null ? null :
      `${t.over25.pct}% ${t.over25.pct >= 50 ? "OVER" : "UNDER"} <small>n=${t.over25.n}</small>`;
    const bttsHtml = t.btts == null ? null : `${t.btts.pct}% <small>n=${t.btts.n}</small>`;

    const recColor = t.record == null ? "" :
      colorByThreshold(t.record.w - t.record.l, 8, 2, true);

    const metrics = [
      metric("gf", "Goles a favor / pp", gfHtml, colorByThreshold(t.gf, 2, 1.3, true), "gf", h),
      metric("ga", "Goles contra / pp", gaHtml, colorByThreshold(t.ga, 0.8, 1.3, false), "ga", h),
      metric("record", "Récord (muestra)", recHtml, recColor, "record", h),
      metric("over25", "Over/Under 2.5", ouHtml, colorByThreshold(t.over25 ? t.over25.pct : null, 55, 45, true), "over25", h),
      metric("btts", "BTTS (ambos marcan)", bttsHtml, colorByThreshold(t.btts ? t.btts.pct : null, 55, 40, true), "btts", h),
      metric("corners", "Corners (f/c)", t.corners, "", "corners", h),
      metric("cards", "Tarjetas", t.cards, "", "cards", h),
      metric("possession", "Posesión %", t.possession, "", "possession", h),
      metric("shots", "Remates al arco", t.shots, "", "shots", h)
    ].join("");

    // form
    let formHtml = "";
    if (t.form && t.form.length) {
      const badges = t.form.map(r => `<span class="fbadge ${r}">${r}</span>`).join("");
      formHtml = `<div class="form-row"><span class="lab">Forma (últ. 5, reciente →)</span>${badges}</div>`;
    } else {
      formHtml = `<div class="form-row"><span class="lab">Forma</span><span class="metric nodata" style="border:0;padding:0"><span class="v">${nodata}</span></span></div>`;
    }

    // hot
    const hotHtml = t.hot ? `<div class="hot"><div class="lab">🔥 DATO CALIENTE</div><div class="txt">${t.hot}</div></div>` : "";
    const notesHtml = t.notes ? `<div class="notes">${t.notes}</div>` : "";

    return `<article class="team">
      <div class="head">
        <span class="flag">${t.flag}</span>
        <div class="id">
          <h3>${t.name}</h3>
          <div class="chips"><span class="chip grp">Grupo ${t.group}</span><span class="chip">${t.conf}</span></div>
        </div>
      </div>
      <div class="body">
        ${probHtml}
        <div class="metrics">${metrics}</div>
        ${formHtml}
        ${hotHtml}
        ${notesHtml}
      </div>
    </article>`;
  }

  // ---- filtering ----
  function visibleTeams() {
    return D.teams.filter(t => {
      if (state.group !== "ALL" && t.group !== state.group) return false;
      if (state.conf !== "ALL" && t.conf !== state.conf) return false;
      if (state.onlyComplete && t.status !== "complete") return false;
      if (state.q) {
        const q = state.q.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.conf.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  // ---- render ----
  function render() {
    const teams = visibleTeams();
    const grid = $("#grid");
    grid.innerHTML = teams.length
      ? teams.map(teamCard).join("")
      : `<div class="empty-card">No hay equipos para este filtro.</div>`;

    // counters on tabs
    document.querySelectorAll(".tab").forEach(tab => {
      const g = tab.dataset.group;
      const n = g === "ALL"
        ? D.teams.filter(t => t.status === "complete").length
        : D.teams.filter(t => t.group === g && t.status === "complete").length;
      const c = tab.querySelector(".count");
      if (c) c.textContent = g === "ALL" ? `${n}/48` : `${n}/4`;
    });
  }

  // ---- compare (VS) ----
  function teamOptions(selectedName) {
    let html = "";
    D.groups.forEach(g => {
      const teams = D.teams.filter(t => t.group === g && t.status === "complete");
      if (!teams.length) return;
      html += `<optgroup label="Grupo ${g}">`;
      teams.forEach(t => {
        html += `<option value="${t.name}"${t.name === selectedName ? " selected" : ""}>${t.flag} ${t.name}</option>`;
      });
      html += `</optgroup>`;
    });
    return html;
  }

  const recDisp = (t) => t.record ? `${t.record.w}G·${t.record.d}E·${t.record.l}P` : null;

  function cmpRow(label, va, vb, better, da, db) {
    let winner = null;
    if (va != null && vb != null) {
      if (va === vb) winner = "tie";
      else winner = ((better === "high") ? va > vb : va < vb) ? "a" : "b";
    }
    const ca = da == null ? "nd" : (winner === "a" ? "win" : winner === "tie" ? "tie" : winner === "b" ? "lose" : "");
    const cb = db == null ? "nd" : (winner === "b" ? "win" : winner === "tie" ? "tie" : winner === "a" ? "lose" : "");
    const html = `<div class="cmp-row">
      <div class="cmp-val left ${ca}">${da == null ? "sin datos" : da}</div>
      <div class="cmp-lab">${label}</div>
      <div class="cmp-val right ${cb}">${db == null ? "sin datos" : db}</div>
    </div>`;
    return { html, winner };
  }

  function probMini(t) {
    if (!t.prob) return `<div class="cmp-prob nd">prob. sin datos</div>`;
    return `<div class="cmp-prob">
      <div class="pbar">
        <div class="seg w" style="width:${t.prob.w}%">${t.prob.w}</div>
        <div class="seg d" style="width:${t.prob.d}%">${t.prob.d}</div>
        <div class="seg l" style="width:${t.prob.l}%">${t.prob.l}</div>
      </div>
      <div class="cmp-prob-cap">V/E/D estimada</div>
    </div>`;
  }

  function cmpHead(t) {
    return `<div class="cmp-head">
      <span class="cmp-flag">${t.flag}</span>
      <div class="cmp-name">${t.name}</div>
      <div class="cmp-chips"><span class="chip grp">Grupo ${t.group}</span><span class="chip">${t.conf}</span></div>
      ${probMini(t)}
    </div>`;
  }

  function cmpForm(t) {
    return (t.form && t.form.length)
      ? t.form.map(r => `<span class="fbadge ${r}">${r}</span>`).join("")
      : `<span class="cmp-nd">sin datos</span>`;
  }

  function compareHtml(a, b) {
    const pct = (o) => o ? `${o.pct}%` : null;
    const rows = [
      cmpRow("Goles a favor / pp", a.gf, b.gf, "high", fmt1(a.gf), fmt1(b.gf)),
      cmpRow("Goles en contra / pp", a.ga, b.ga, "low", fmt1(a.ga), fmt1(b.ga)),
      cmpRow("Victorias (muestra)", a.record ? a.record.w : null, b.record ? b.record.w : null, "high", recDisp(a), recDisp(b)),
      cmpRow("Over 2.5", a.over25 ? a.over25.pct : null, b.over25 ? b.over25.pct : null, "high", pct(a.over25), pct(b.over25)),
      cmpRow("BTTS (ambos marcan)", a.btts ? a.btts.pct : null, b.btts ? b.btts.pct : null, "high", pct(a.btts), pct(b.btts))
    ];
    let aw = 0, bw = 0, tw = 0;
    rows.forEach(r => { if (r.winner === "a") aw++; else if (r.winner === "b") bw++; else if (r.winner === "tie") tw++; });
    const verdict = aw > bw ? `Ventaja estadística para ${a.name}`
      : bw > aw ? `Ventaja estadística para ${b.name}`
      : "Muy parejo en las métricas comparables";
    const comparables = aw + bw + tw;

    const formsRow = `<div class="cmp-row cmp-forms">
      <div class="cmp-val left">${cmpForm(a)}</div>
      <div class="cmp-lab">Forma (últ. 5)</div>
      <div class="cmp-val right">${cmpForm(b)}</div>
    </div>`;

    const hots = `<div class="cmp-hots">
      <div class="cmp-hot"><div class="lab">🔥 ${a.name}</div><div>${a.hot || "—"}</div></div>
      <div class="cmp-hot"><div class="lab">🔥 ${b.name}</div><div>${b.hot || "—"}</div></div>
    </div>`;

    const same = a.name === b.name
      ? `<div class="cmp-samenote">Estás comparando el mismo equipo. Elegí dos distintos para el cara a cara.</div>` : "";

    return `${same}<div class="cmp">
      <div class="cmp-heads">${cmpHead(a)}<div class="cmp-vsmid">VS</div>${cmpHead(b)}</div>
      <div class="cmp-tally">
        <div>${a.flag} <b>${aw}</b> &nbsp;·&nbsp; ${tw} ${tw === 1 ? "empate" : "empates"} &nbsp;·&nbsp; <b>${bw}</b> ${b.flag}</div>
        <span class="cmp-verdict">${verdict} — sobre ${comparables} métrica(s) con datos en ambos (excluye la probabilidad estimada).</span>
      </div>
      <div class="cmp-rows">${rows.map(r => r.html).join("")}${formsRow}</div>
      ${hots}
    </div>`;
  }

  function renderCompare() {
    const a = D.teams.find(t => t.name === $("#cmpA").value);
    const b = D.teams.find(t => t.name === $("#cmpB").value);
    if (a && b) $("#cmpOut").innerHTML = compareHtml(a, b);
  }

  // ---- build static UI ----
  function build() {
    // meta
    $("#title").textContent = D.meta.title;
    $("#subtitle").textContent = D.meta.subtitle;
    $("#date").textContent = "Consulta: " + D.meta.consultDate;
    $("#disclaimer").textContent = "⚠️ " + D.meta.disclaimer;

    // tabs
    const tabs = ['<button class="tab active" data-group="ALL">Todos <span class="count"></span></button>']
      .concat(D.groups.map(g => `<button class="tab" data-group="${g}">Grupo ${g} <span class="count"></span></button>`));
    $("#tabs").innerHTML = tabs.join("");
    $("#tabs").addEventListener("click", e => {
      const b = e.target.closest(".tab"); if (!b) return;
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      state.group = b.dataset.group;
      render();
    });

    // conf filter
    const confs = ["ALL", ...new Set(D.teams.map(t => t.conf))];
    $("#confFilter").innerHTML = confs.map(c =>
      `<option value="${c}">${c === "ALL" ? "Todas las confederaciones" : c}</option>`).join("");
    $("#confFilter").addEventListener("change", e => { state.conf = e.target.value; render(); });

    $("#search").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
    $("#onlyComplete").addEventListener("change", e => { state.onlyComplete = e.target.checked; render(); });

    // top picks
    if (D.topPicks && D.topPicks.length) {
      const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];
      $("#picks").innerHTML = D.topPicks.map((p, i) => {
        const t = D.teams.find(x => x.name === p.name);
        const flag = t ? t.flag : "";
        return `<div class="pick"><span class="rank">${medals[i] || "•"}</span>
          <div><div class="pname">${flag} ${p.name}</div><div class="pnote">${p.note}</div></div></div>`;
      }).join("");
    }

    // legend
    $("#legend").innerHTML = D.meta.legend.map(l =>
      `<span><span class="dot ${l.color}"></span>${l.label}</span>`).join("");

    // footer sources
    $("#sources").innerHTML = D.meta.sources.map(s =>
      `<div class="src">• <a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></div>`).join("");
    $("#missing").textContent = D.meta.missingNote;

    // compare view: pickers + default matchup
    $("#cmpA").innerHTML = teamOptions("Argentina");
    $("#cmpB").innerHTML = teamOptions("Brasil");
    $("#cmpA").addEventListener("change", renderCompare);
    $("#cmpB").addEventListener("change", renderCompare);
    renderCompare();

    // view switch (Equipos / Comparar)
    document.querySelectorAll(".vbtn").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll(".vbtn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      const compare = btn.dataset.view === "compare";
      $("#compareView").hidden = !compare;
      $("#teamsView").hidden = compare;
      const ctrls = document.querySelector(".controls");
      if (ctrls) ctrls.hidden = compare;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));

    render();
  }

  document.addEventListener("DOMContentLoaded", build);
})();
