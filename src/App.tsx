import { useState, useEffect, useRef } from "react";

const BANDI = [
  {
    id: 1, nome: "Bando Digitalizzazione PMI 2025", ente: "Regione Lombardia", tipo: "Regionale",
    fondoPerduto: 60, budgetMax: 50000, scadenza: "2025-05-28", compatibilita: 95,
    urgente: true, tags: ["Digitale", "Innovazione"],
    sintesi: {
      obiettivo: "Supportare le PMI lombarde nella trasformazione digitale con tecnologie 4.0, software gestionali, e-commerce e soluzioni cloud per migliorare competitività e produttività aziendale.",
      chi: "PMI con sede operativa in Lombardia, costituite da almeno 2 anni, fatturato annuo tra €50.000 e €10 milioni. Necessaria iscrizione al Registro Imprese e DURC regolare.",
      spese: "Software e licenze, consulenza specialistica IT, formazione del personale, hardware connesso alla digitalizzazione, sviluppo siti web e piattaforme e-commerce, sistemi ERP e CRM.",
      domanda: "Domanda tramite portale Bandi Online di Regione Lombardia (bandi.servizirl.it). Allegare piano di digitalizzazione, preventivi e bilanci ultimi 2 anni. Sportello: 01/06 – 30/06/2025."
    }
  },
  {
    id: 2, nome: "Horizon Europe – Green Deal 2025", ente: "Unione Europea", tipo: "Europeo",
    fondoPerduto: 70, budgetMax: 200000, scadenza: "2025-07-15", compatibilita: 82,
    urgente: false, tags: ["Sostenibilità", "R&D"],
    sintesi: {
      obiettivo: "Finanziare progetti di ricerca e innovazione per la transizione verde, riduzione delle emissioni CO₂ e sviluppo di tecnologie sostenibili nel settore manifatturiero e industriale europeo.",
      chi: "Consorzi di almeno 3 soggetti (PMI, università, enti di ricerca) da almeno 3 paesi UE. Almeno una PMI deve ricoprire il ruolo di partner coordinatore del progetto.",
      spese: "Personale di ricerca, materiali e attrezzature, subappalti certificati, costi indiretti al tasso forfettario del 25%, spese di audit e disseminazione scientifica dei risultati.",
      domanda: "Invio tramite portale Funding & Tenders UE (ec.europa.eu/info/funding-tenders). Registrazione ECAS obbligatoria. Valutazione in 2 step: pre-proposal entro 15/04 e full proposal entro 15/07/2025."
    }
  },
  {
    id: 3, nome: "Nuova Sabatini – Beni Strumentali", ente: "Ministero MIMIT", tipo: "Nazionale",
    fondoPerduto: 35, budgetMax: 100000, scadenza: "2025-06-30", compatibilita: 88,
    urgente: false, tags: ["Macchinari", "Industria 4.0"],
    sintesi: {
      obiettivo: "Sostenere investimenti in nuovi macchinari, impianti e attrezzature ad alto contenuto tecnologico per aumentare la competitività e la produttività delle PMI italiane.",
      chi: "PMI italiane di tutti i settori produttivi con sede in Italia. Requisiti: nessuna procedura concorsuale in atto, DURC regolare, nessun debito scaduto con la Pubblica Amministrazione.",
      spese: "Macchinari e impianti nuovi di fabbrica, hardware e software integrati Piano 4.0, sistemi di monitoraggio e controllo della produzione. Esclusi: beni usati, consulenze, lavori edili.",
      domanda: "Richiesta tramite banche/intermediari aderenti alla convenzione MCC. Compilare il modulo ministeriale e presentarlo alla propria banca. Prenotazione fondi su portale Invitalia."
    }
  },
  {
    id: 4, nome: "PIN – Pacchetto Innovazione Nord-Ovest", ente: "Camera di Commercio Milano", tipo: "Locale",
    fondoPerduto: 50, budgetMax: 30000, scadenza: "2025-06-10", compatibilita: 91,
    urgente: false, tags: ["Innovazione", "Export"],
    sintesi: {
      obiettivo: "Incentivare l'innovazione di prodotto e processo nelle PMI dell'area metropolitana milanese, con focus su mercati internazionali, competitività export e certificazione dei processi.",
      chi: "Imprese con sede o unità locale nella città metropolitana di Milano, iscritte al Registro Imprese da almeno 1 anno, con meno di 50 dipendenti e fatturato inferiore a €10 milioni.",
      spese: "Brevetti e marchi, prototipazione, fiere internazionali, certificazioni di prodotto (CE, ISO), consulenze per l'internazionalizzazione, piattaforme B2B per l'export digitale.",
      domanda: "Accesso tramite sportello digitale CCIAA Milano (mi.camcom.it). Procedura click-day: presentare domanda appena apre la finestra per non esaurire i fondi disponibili."
    }
  },
  {
    id: 5, nome: "FESR Lombardia – Transizione 4.0", ente: "Regione Lombardia / UE", tipo: "Regionale/EU",
    fondoPerduto: 45, budgetMax: 150000, scadenza: "2025-08-31", compatibilita: 79,
    urgente: false, tags: ["Manifatturiero", "4.0"],
    sintesi: {
      obiettivo: "Cofinanziare investimenti in tecnologie Industry 4.0 per PMI manifatturiere lombarde, nell'ambito della programmazione FESR 2021-2027, asse Ricerca, Innovazione e Digitalizzazione.",
      chi: "PMI con codice ATECO manifatturiero (sezione C), sede in Lombardia. Investimento minimo €50.000. Necessaria perizia asseverata da tecnico abilitato e business plan triennale.",
      spese: "Robot collaborativi (cobots), sistemi IoT industriali, AI e big data analytics, cybersecurity OT/IT, digital twin, simulazione virtuale, realtà aumentata per la manutenzione.",
      domanda: "Procedura negoziale tramite portale LombardiaInforma. Richiedere il codice CUP prima della presentazione. Sportello: 15/04 – 31/08/2025. Valutazione entro 60 giorni dalla domanda."
    }
  }
];

const fmt = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const days = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const fmtDate = (d) => new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });

const TIPO_STYLE = {
  "Regionale":    { bg: "#0c2a3d", color: "#38bdf8", border: "#164e63" },
  "Europeo":      { bg: "#1e1b4b", color: "#a5b4fc", border: "#312e81" },
  "Nazionale":    { bg: "#1c1207", color: "#fbbf24", border: "#78350f" },
  "Locale":       { bg: "#022c22", color: "#34d399", border: "#064e3b" },
  "Regionale/EU": { bg: "#2e1065", color: "#c084fc", border: "#4c1d95" },
};

function TipoBadge({ tipo }) {
  const s = TIPO_STYLE[tipo] || TIPO_STYLE["Locale"];
  return (
    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {tipo}
    </span>
  );
}

function CompatBar({ pct, thin }) {
  const color = pct >= 90 ? "#34d399" : pct >= 80 ? "#38bdf8" : "#fbbf24";
  const textColor = pct >= 90 ? "#34d399" : pct >= 80 ? "#38bdf8" : "#fbbf24";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ flex: 1, height: thin ? 4 : 6, borderRadius: 99,
        background: "rgba(255,255,255,.08)", overflow: "hidden", minWidth: 50 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: textColor, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

function AnimNum({ to, prefix = "", suffix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0; const end = to; const steps = 54; const inc = end / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= end) { setV(end); clearInterval(t); }
      else setV(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [to]);
  return <span>{prefix}{v.toLocaleString("it-IT")}{suffix}</span>;
}

function Toast({ msg, onHide }) {
  useEffect(() => { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: 18, right: 18, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 18px", borderRadius: 12, background: "#059669",
      color: "#fff", fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,.5)",
      animation: "slideIn .3s ease" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {msg}
    </div>
  );
}

const NAV = [
  { label: "Dashboard",      icon: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 3a4 4 0 100-8 4 4 0 000 8z" },
  { label: "Ricerca Bandi",  icon: "M21 21l-4.35-4.35M11 19A8 8 0 103 11a8 8 0 008 8z" },
  { label: "Profilo Azienda",icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label: "Scadenziario",   icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { label: "Impostazioni",   icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
];

function Icon({ d, size = 17, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function BandiSmart() {
  const [activeNav, setActiveNav] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("tutti");
  const [toast, setToast] = useState(null);
  const panelRef = useRef(null);

  const openPanel = (b) => {
    setSelected(b);
    setTimeout(() => setPanelOpen(true), 10);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelected(null), 360);
  };
  const showToast = (msg) => setToast(msg);

  const filtered = activeFilter === "tutti"
    ? BANDI
    : BANDI.filter(b => b.tipo.toLowerCase().includes(activeFilter));

  const urgente = BANDI.find(b => b.urgente);
  const daysUrgente = urgente ? days(urgente.scadenza) : 0;

  // Close panel on ESC
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") closePanel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const S = {
    shell: { display: "flex", height: "100vh", background: "#0a0d14", color: "#f1f5f9",
      fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" },
    sidebar: { width: collapsed ? 60 : 220, minWidth: collapsed ? 60 : 220,
      background: "#0d1117", borderRight: "1px solid rgba(148,163,184,.1)",
      display: "flex", flexDirection: "column", transition: "width .25s, min-width .25s",
      overflow: "hidden", flexShrink: 0 },
    logo: { height: 62, padding: "0 14px", display: "flex", alignItems: "center", gap: 10,
      borderBottom: "1px solid rgba(148,163,184,.1)", flexShrink: 0 },
    logoIcon: { width: 32, height: 32, borderRadius: 10,
      background: "linear-gradient(135deg,#38bdf8,#6366f1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "0 0 16px rgba(56,189,248,.2)" },
    mainWrap: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
    topbar: { height: 62, background: "rgba(13,17,23,.9)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(148,163,184,.1)", display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16, flexShrink: 0 },
    content: { flex: 1, overflowY: "auto", padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 18,
      scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" },
    card: { background: "#111827", border: "1px solid rgba(148,163,184,.1)",
      borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,.3)" },
  };

  return (
    <div style={S.shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes urgBlink { 0%,100%{opacity:1} 50%{opacity:.5} }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:10px;
          font-size:13px; font-weight:500; color:#94a3b8; text-decoration:none; cursor:pointer;
          transition:color .15s,background .15s; white-space:nowrap; overflow:hidden; border:none; background:none; }
        .nav-item:hover { color:#f1f5f9; background:rgba(255,255,255,.04); }
        .nav-item.active { color:#38bdf8; background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.2); }
        .tr-row { border-bottom:1px solid rgba(148,163,184,.06); cursor:pointer; transition:background .15s; }
        .tr-row:hover { background:rgba(255,255,255,.03); }
        .tr-row:last-child { border-bottom:none; }
        .btn-sintesi { display:flex; align-items:center; gap:6px; padding:6px 12px;
          background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.2);
          border-radius:9px; color:#38bdf8; font-size:12px; font-weight:600;
          cursor:pointer; white-space:nowrap; transition:background .15s,border-color .15s; font-family:inherit; }
        .btn-sintesi:hover { background:rgba(56,189,248,.18); border-color:rgba(56,189,248,.4); }
        .filter-pill { padding:4px 12px; border-radius:99px; font-size:11px; font-weight:500;
          border:1px solid rgba(148,163,184,.15); color:#64748b; background:none;
          cursor:pointer; transition:all .15s; font-family:inherit; }
        .filter-pill:hover { border-color:rgba(148,163,184,.3); color:#f1f5f9; }
        .filter-pill.active { background:rgba(56,189,248,.1); border-color:rgba(56,189,248,.3); color:#38bdf8; }
        .summary-card { background:rgba(255,255,255,.03); border:1px solid rgba(148,163,184,.1);
          border-radius:13px; padding:14px; margin-bottom:10px;
          animation: fadeUp .4s ease both; }
        .summary-card:hover { border-color:rgba(148,163,184,.2); }
        .btn-act { display:flex; align-items:center; justifyContent:center; gap:7px;
          padding:10px 14px; border-radius:12px; font-size:12px; font-weight:700;
          color:#fff; cursor:pointer; border:none; transition:filter .15s,transform .1s;
          font-family:inherit; flex:1; justify-content:center; }
        .btn-act:active { transform:scale(.97); }
        .btn-act:hover { filter:brightness(1.1); }
        .btn-cal { background:rgba(255,255,255,.06); border:1px solid rgba(148,163,184,.15);
          color:#94a3b8; width:100%; cursor:pointer; padding:10px 14px; border-radius:12px;
          font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;
          gap:7px; font-family:inherit; transition:background .15s,color .15s; }
        .btn-cal:hover { background:rgba(255,255,255,.1); color:#f1f5f9; }
        .kpi-card { border-radius:16px; padding:20px; border:1px solid rgba(148,163,184,.1);
          background:#111827; transition:border-color .2s; animation: fadeUp .5s ease both; }
        .kpi-card:hover { border-color:rgba(56,189,248,.2); }
      `}</style>

      {toast && <Toast msg={toast} onHide={() => setToast(null)} />}

      {/* ─── SIDEBAR ─── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.3px" }}>
              Bandi<span style={{ color: "#38bdf8" }}>Smart</span>
            </span>
          )}
          <button onClick={() => setCollapsed(v => !v)} style={{ marginLeft: "auto", background: "none", border: "none",
            color: "#475569", cursor: "pointer", padding: 4, borderRadius: 6, flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item, i) => (
            <button key={i} className={`nav-item${activeNav === i ? " active" : ""}`}
              onClick={() => setActiveNav(i)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon}/>
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(148,163,184,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 8px",
            borderRadius: 10, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MA</div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }}>Marco Alberti</div>
                <div style={{ fontSize: 10, color: "#475569" }}>Amministratore</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={S.mainWrap}>
        <header style={S.topbar}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Dashboard</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>Monitoraggio automatico attivo</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 12px",
              borderRadius: 99, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.2)",
              color: "#34d399", fontSize: 11, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399",
                animation: "pulseDot 2s ease-in-out infinite" }} />
              Sincronizzazione attiva
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1e2635",
              border: "1px solid rgba(148,163,184,.1)", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative", cursor: "pointer" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7,
                borderRadius: "50%", background: "#38bdf8", border: "2px solid #0d1117" }} />
            </div>
          </div>
        </header>

        <main style={S.content}>

          {/* PROFILO */}
          <div style={{ ...S.card, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6,
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#475569" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Profilo Monitoraggio Attivo
              </div>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#38bdf8", textDecoration: "none" }}>
                Modifica
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                ["📍", "Regione", "Lombardia"],
                ["⚙️", "Settore", "Digitalizzazione · Manifatturiero"],
                ["🏢", "Dimensione", "PMI (< 50 dip.)"],
                ["💶", "Budget Progetto", "fino a €200.000"],
              ].map(([emoji, label, val], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(148,163,184,.1)", borderRadius: 9, fontSize: 12 }}>
                  <span>{emoji}</span>
                  <span style={{ color: "#64748b" }}>{label}:</span>
                  <span style={{ color: "#f1f5f9", fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {/* Card 1 */}
            <div className="kpi-card" style={{ animationDelay: ".05s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10,
                  background: "rgba(56,189,248,.1)", border: "1px solid rgba(56,189,248,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
                  borderRadius: 99, background: "rgba(52,211,153,.1)", color: "#34d399", fontSize: 11, fontWeight: 700 }}>
                  ↑ +3
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.5px", marginBottom: 5 }}>
                <AnimNum to={12} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>Bandi Attivi Compatibili</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>vs 9 il mese scorso</div>
            </div>

            {/* Card 2 */}
            <div className="kpi-card" style={{ animationDelay: ".12s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10,
                  background: "rgba(129,140,248,.1)", border: "1px solid rgba(129,140,248,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
                  borderRadius: 99, background: "rgba(52,211,153,.1)", color: "#34d399", fontSize: 11, fontWeight: 700 }}>
                  ↑ +12%
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.5px", marginBottom: 5 }}>
                <AnimNum to={145000} prefix="€" />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>Fondi Potenziali Disponibili</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>A fondo perduto stimato</div>
            </div>

            {/* Card 3 – urgente */}
            <div className="kpi-card" style={{
              animationDelay: ".19s",
              background: "linear-gradient(135deg,rgba(136,19,55,.2),rgba(124,45,18,.12))",
              borderColor: "rgba(251,113,133,.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10,
                  background: "rgba(251,113,133,.15)", border: "1px solid rgba(251,113,133,.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fb7185" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div style={{ padding: "3px 8px", borderRadius: 99,
                  background: "rgba(251,113,133,.15)", border: "1px solid rgba(251,113,133,.3)",
                  color: "#fca5a5", fontSize: 11, fontWeight: 700,
                  animation: "urgBlink 1.8s ease-in-out infinite" }}>URGENTE</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.5px", color: "#fca5a5", marginBottom: 5 }}>
                <AnimNum to={daysUrgente} suffix=" gg" />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(252,165,165,.8)" }}>Prossima Scadenza</div>
              <div style={{ fontSize: 10, color: "rgba(251,113,133,.6)", marginTop: 3, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {urgente?.nome}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ ...S.card, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid rgba(148,163,184,.08)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Bandi Compatibili Rilevati</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Ordinati per compatibilità con il tuo profilo</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setFilterOpen(v => !v)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  background: "#1e2635", border: "1px solid rgba(148,163,184,.12)",
                  borderRadius: 9, fontSize: 12, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  Filtri
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: filterOpen ? "rotate(180deg)" : "none", transition: ".2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  background: "#1e2635", border: "1px solid rgba(148,163,184,.12)", borderRadius: 9, fontSize: 12, color: "#94a3b8" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  AI Match attivo
                </div>
              </div>
            </div>

            {filterOpen && (
              <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(148,163,184,.06)",
                background: "rgba(0,0,0,.1)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["tutti","regionale","europeo","nazionale","locale"].map(f => (
                  <button key={f} className={`filter-pill${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)} style={{ textTransform: "capitalize" }}>
                    {f === "tutti" ? "Tutti" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(148,163,184,.08)" }}>
                    {["Nome Bando","Ente Erogatore","Fondo Perduto","Budget Max","Scadenza","Compatibilità",""].map((h, i) => (
                      <th key={i} style={{ padding: "10px 18px", textAlign: "left", fontSize: 10,
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
                        color: "#475569", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const d = days(b.scadenza);
                    return (
                      <tr key={b.id} className="tr-row" onClick={() => openPanel(b)}>
                        <td style={{ padding: "14px 18px", minWidth: 200 }}>
                          <div style={{ fontWeight: 600, color: "#f1f5f9", lineHeight: 1.35 }}>{b.nome}</div>
                          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                            {b.tags.map(t => (
                              <span key={t} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99,
                                background: "rgba(255,255,255,.05)", border: "1px solid rgba(148,163,184,.1)",
                                color: "#64748b" }}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 500, color: "#94a3b8", fontSize: 12 }}>{b.ente}</div>
                          <div style={{ marginTop: 5 }}><TipoBadge tipo={b.tipo} /></div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#34d399" }}>{b.fondoPerduto}%</div>
                          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>a fondo perduto</div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 600, fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
                            {fmt(b.budgetMax)}
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 500, color: d <= 10 ? "#fb7185" : d <= 30 ? "#fbbf24" : "#94a3b8" }}>
                            {fmtDate(b.scadenza)}
                          </div>
                          <div style={{ fontSize: 10, marginTop: 2, color: d <= 10 ? "#f87171" : "#475569" }}>
                            {d <= 10 ? `⚠ ${d} giorni` : `${d} giorni`}
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <CompatBar pct={b.compatibilita} thin />
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <button className="btn-sintesi" onClick={(e) => { e.stopPropagation(); openPanel(b); }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Genera Sintesi
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ─── PANEL OVERLAY ─── */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}
          onClick={closePanel}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)",
            backdropFilter: "blur(4px)", opacity: panelOpen ? 1 : 0, transition: "opacity .3s" }} />
          <div ref={panelRef} onClick={e => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 500, height: "100%",
              background: "#0d1117", borderLeft: "1px solid rgba(148,163,184,.1)",
              display: "flex", flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,.6)",
              transform: panelOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform .35s cubic-bezier(.22,.68,0,1.2)" }}>

            {/* Panel head */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              padding: "20px 20px 16px", borderBottom: "1px solid rgba(148,163,184,.1)", flexShrink: 0 }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <TipoBadge tipo={selected.tipo} />
                  {selected.urgente && (
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700,
                      background: "rgba(251,113,133,.15)", border: "1px solid rgba(251,113,133,.3)", color: "#fca5a5" }}>
                      URGENTE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{selected.nome}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{selected.ente}</div>
              </div>
              <button onClick={closePanel} style={{ width: 32, height: 32, borderRadius: 9,
                background: "#1e2635", border: "1px solid rgba(148,163,184,.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#64748b", cursor: "pointer", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Metrics */}
            {(() => {
              const d = days(selected.scadenza);
              const dColor = d <= 10 ? "#fb7185" : "#fbbf24";
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10,
                  padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,.1)", flexShrink: 0 }}>
                  {[
                    { label: "Fondo Perduto", val: `${selected.fondoPerduto}%`, color: "#34d399" },
                    { label: "Budget Max", val: fmt(selected.budgetMax), color: "#818cf8", mono: true },
                    { label: "Alla scadenza", val: `${d} gg`, color: dColor, red: d <= 10 },
                  ].map((m, i) => (
                    <div key={i} style={{ borderRadius: 10, padding: "12px", textAlign: "center",
                      background: m.red ? "rgba(136,19,55,.12)" : "rgba(255,255,255,.04)",
                      border: m.red ? "1px solid rgba(251,113,133,.2)" : "none" }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: m.color, lineHeight: 1,
                        fontFamily: m.mono ? "'DM Mono',monospace" : "inherit",
                        fontSize: m.mono ? 13 : 17 }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Compat bar */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(148,163,184,.1)", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 }}>
                <span style={{ color: "#475569" }}>Compatibilità con il tuo profilo</span>
              </div>
              <CompatBar pct={selected.compatibilita} />
            </div>

            {/* Summary body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px",
              scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#475569" }}>
                <div style={{ width: 24, height: 24, borderRadius: 7,
                  background: "linear-gradient(135deg,#38bdf8,#6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                Sintesi Generata da AI
              </div>

              {[
                { emoji: "🎯", title: "Obiettivo del Bando",   body: selected.sintesi.obiettivo, delay: ".05s" },
                { emoji: "👥", title: "Chi Può Partecipare",   body: selected.sintesi.chi,       delay: ".13s" },
                { emoji: "💶", title: "Spese Ammissibili",     body: selected.sintesi.spese,     delay: ".21s" },
                { emoji: "📋", title: "Come Fare Domanda",     body: selected.sintesi.domanda,   delay: ".29s" },
              ].map((item, i) => (
                <div key={i} className="summary-card" style={{ animationDelay: item.delay }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 15 }}>{item.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: ".1em", color: "#94a3b8" }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>{item.body}</p>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(148,163,184,.1)",
              flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-act" style={{ background: "#0284c7", boxShadow: "0 4px 14px rgba(2,132,199,.2)" }}
                  onClick={() => showToast("PDF della sintesi scaricato con successo!")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Scarica PDF Sintesi
                </button>
                <button className="btn-act" style={{ background: "#059669", boxShadow: "0 4px 14px rgba(5,150,105,.2)" }}
                  onClick={() => showToast("Link inviato su WhatsApp!")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  Invia via WhatsApp
                </button>
              </div>
              <button className="btn-cal" onClick={() => showToast("Bando aggiunto allo Scadenziario!")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Aggiungi allo Scadenziario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}