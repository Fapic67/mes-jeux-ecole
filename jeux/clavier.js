// Clavier virtuel simplifié pour enfants (AZERTY, minuscules, accents).
// Usage : Clavier({onKey:function(lettre){}, onDel:function(){}, onOk:function(){}})
// Renvoie {el, show(), hide()}. Le clavier physique fonctionne aussi.
(function () {
  var CSS =
    ".kb{position:fixed;left:0;right:0;bottom:0;z-index:20;background:var(--kb-bg,#e9edf2);padding:8px 5px calc(8px + env(safe-area-inset-bottom,0px));" +
    "display:grid;grid-template-columns:repeat(10,1fr);gap:7px 4px;box-shadow:0 -4px 14px rgba(0,0,0,.12);user-select:none;-webkit-user-select:none;touch-action:manipulation}" +
    ".kb button{height:58px;min-width:0;padding:0;border:0;border-radius:12px;background:#fff;color:#1d2b24;font:600 27px 'Fredoka',system-ui,sans-serif;" +
    "box-shadow:0 3px 0 #b9c2cc;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
    ".kb button.down{transform:translateY(3px);box-shadow:0 0 0 #b9c2cc;background:#dfe6ee}" +
    ".kb .acc{background:#f3ecff}" +
    ".kb .del{grid-column:span 4;background:#cfd6de;font-size:22px}" +
    ".kb .ok{grid-column:span 5;background:#22a861;color:#fff;box-shadow:0 3px 0 #17804a;font-size:24px}" +
    ".kb .ok.down{background:#1c9455}" +
    "@media (prefers-color-scheme:dark){.kb{--kb-bg:#1b2420}.kb button{background:#2c3a33;color:#eef6f1;box-shadow:0 3px 0 #111}.kb .acc{background:#3a3150}.kb .del{background:#46524c}}";
  var ROWS = ["azertyuiop", "qsdfghjklm", "wxcvbn"], ACC = "éèêàç", LETTERS = ROWS.join("") + ACC;
  var ac = null;
  function click() {
    try {
      if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return; ac = new C(); }
      if (ac.state === "suspended") ac.resume();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = "triangle"; o.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.07);
    } catch (e) {}
  }
  window.Clavier = function (opt) {
    if (!document.getElementById("kb-css")) { var st = document.createElement("style"); st.id = "kb-css"; st.textContent = CSS; document.head.appendChild(st); }
    var el = document.createElement("div"), h = "";
    el.className = "kb";
    ROWS.forEach(function (r) { for (var i = 0; i < r.length; i++) h += '<button type="button" data-k="' + r[i] + '">' + r[i] + "</button>"; });
    h += '<button type="button" class="del" data-a="del" aria-label="Effacer">⌫</button>';
    for (var i = 0; i < ACC.length; i++) h += '<button type="button" class="acc" data-k="' + ACC[i] + '">' + ACC[i] + "</button>";
    h += '<button type="button" class="ok" data-a="ok" aria-label="Valider">✓</button>';
    el.innerHTML = h;
    var enabled = true;
    function fire(k, a) {
      if (!enabled) return;
      click();
      if (k) opt.onKey && opt.onKey(k);
      else if (a === "del") opt.onDel && opt.onDel();
      else if (a === "ok") opt.onOk && opt.onOk();
    }
    function flash(b) { b.classList.add("down"); setTimeout(function () { b.classList.remove("down"); }, 120); }
    // pointerdown : réaction immédiate, sans délai ni double déclenchement
    el.addEventListener("pointerdown", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      e.preventDefault(); flash(b); fire(b.dataset.k, b.dataset.a);
    });
    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    function onKeydown(e) {
      if (!el.isConnected || el.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === "Backspace") { e.preventDefault(); fire(null, "del"); }
      else if (k === "Enter") { e.preventDefault(); fire(null, "ok"); }
      else if (k && k.length === 1 && LETTERS.indexOf(k.toLowerCase()) >= 0) { e.preventDefault(); fire(k.toLowerCase()); }
    }
    document.addEventListener("keydown", onKeydown);
    document.body.appendChild(el);
    return {
      el: el,
      enable: function (v) { enabled = v !== false; },
      show: function () { el.hidden = false; },
      hide: function () { el.hidden = true; },
      destroy: function () { document.removeEventListener("keydown", onKeydown); el.remove(); }
    };
  };
})();
