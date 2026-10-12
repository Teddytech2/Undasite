"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowUpRight, Bot, Braces, CheckCircle2, ChevronDown,
  CircleHelp, CloudUpload, Code2, Compass, ExternalLink, Globe, LayoutDashboard,
  Link2, Loader2, MessageSquareText, Plus, Rocket, Search, Settings2, ShieldCheck,
  Sparkles, WandSparkles, X
} from "lucide-react";

type BotItem = { name: string; kind: string; version: string; description: string };
const starterBots: BotItem[] = [
  { name: "Deriv Strategy Starter", kind: "Trading template", version: "0.1.0", description: "A starting point for a demo-tested strategy. Not financial advice." },
  { name: "Telegram Assistant", kind: "Automation", version: "1.0.0", description: "A basic bot project template for authorized Telegram integrations." },
  { name: "Website Support Bot", kind: "AI chatbot", version: "1.0.0", description: "A simple customer-support chatbot starter." }
];

export default function Home() {
  const [prompt, setPrompt] = useState("Create a modern landing page for a Deriv analysis community, with a dark navy background, lime accents, responsive layout, features, and a clear disclaimer.");
  const [html, setHtml] = useState(`<main style="font-family:Inter,system-ui,sans-serif;background:#0b1020;color:#f5f7ff;min-height:100vh;padding:64px 8%;"><p style="color:#b7f36b;font-weight:700;letter-spacing:.16em;">TEDDY AI STUDIO</p><h1 style="font-size:clamp(2.5rem,7vw,5rem);max-width:850px;line-height:1.02;">Your next website starts with one prompt.</h1><p style="color:#a9b1c9;font-size:1.15rem;max-width:620px;line-height:1.7;">Generate a responsive first draft, refine the code, and prepare it for deployment.</p><a href="#features" style="display:inline-block;background:#b7f36b;color:#10150c;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:800;">Explore the tools ↗</a><section id="features" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-top:60px;"><article style="padding:22px;border:1px solid #303952;border-radius:18px;"><h2>AI builder</h2><p>Prompt-to-page drafts.</p></article><article style="padding:22px;border:1px solid #303952;border-radius:18px;"><h2>Bot workshop</h2><p>Organize and inspect project files.</p></article><article style="padding:22px;border:1px solid #303952;border-radius:18px;"><h2>Publish-ready</h2><p>Prepare your project for Vercel.</p></article></section></main>`);
  const [active, setActive] = useState("Overview");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [projectName, setProjectName] = useState("my-first-site");
  const [appId, setAppId] = useState("");
  const [affiliate, setAffiliate] = useState("");
  const [domain, setDomain] = useState("");
  const [repo, setRepo] = useState("");
  const [botName, setBotName] = useState("");
  const [bots, setBots] = useState<BotItem[]>(starterBots);
  const [files, setFiles] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredBots = useMemo(() => bots.filter(b => `${b.name} ${b.kind} ${b.description}`.toLowerCase().includes(search.toLowerCase())), [bots, search]);

  async function generate() {
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setHtml(data.html);
      setTab("preview");
      setNotice("Draft generated. Review the preview and source before publishing.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not generate. Check your environment variables.");
    } finally { setBusy(false); }
  }

  function uploadBot(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const allowed = selected.filter(f => /\.(zip|js|ts|py|json|xml|md|txt)$/i.test(f.name));
    if (allowed.length !== selected.length) setNotice("Some files were skipped. Allowed: ZIP, JS, TS, PY, JSON, XML, MD and TXT.");
    if (allowed.length) {
      setFiles(prev => [...prev, ...allowed.map(f => f.name)]);
      setBots(prev => [{ name: botName.trim() || allowed[0].name.replace(/\.[^.]+$/, ""), kind: "Uploaded project (metadata only)", version: "draft", description: `Selected ${allowed.map(f => f.name).join(", ")}. This demo does not persist file contents.` }, ...prev]);
      setNotice("Files selected in this browser. Configure private object storage before accepting real public uploads.");
      setBotName("");
    }
    event.target.value = "";
  }

  async function importRepo() {
    try {
      const res = await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: repo }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import validation failed");
      setNotice(`Repository URL accepted for review: ${data.repository}. This demo does not clone or execute code.`);
      setRepo("");
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not validate repository."); }
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${projectName || "website"}.html`; a.click();
    URL.revokeObjectURL(url);
    setNotice("HTML downloaded. For a full app, export the complete source project and test before deployment.");
  }

  async function deploy() {
    setBusy(true);
    try {
      const res = await fetch("/api/deploy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectName, domain }) });
      const data = await res.json();
      setNotice(data.message || data.error || "Deployment setup checked.");
    } catch { setNotice("Deployment check failed. Verify configuration."); }
    finally { setBusy(false); }
  }

  const nav = [
    { label: "Overview", icon: LayoutDashboard }, { label: "AI Website Builder", icon: WandSparkles },
    { label: "Bot Workshop", icon: Bot }, { label: "Deriv Settings", icon: Activity },
    { label: "Domains & Deploy", icon: Globe }
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={20}/></div><div><strong>TEDDY<span> AI</span></strong><small>STUDIO</small></div></div>
      <div className="workspace"><div className="workspace-avatar">T</div><div className="workspace-text"><b>My workspace</b><small>Starter plan</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => setActive(item.label)}><item.icon size={17}/><span>{item.label}</span>{item.label === "Bot Workshop" && <span className="nav-count">{bots.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="usage-card"><div className="usage-icon"><Sparkles size={16}/></div><b>Make something great</b><p>Describe an idea and turn it into a website draft.</p><button onClick={() => setActive("AI Website Builder")}>Start creating <ArrowUpRight size={14}/></button></div><button className="nav-item" onClick={() => setNotice("Help: configure .env.local and read README.md before enabling production features.")}><CircleHelp size={17}/> Help & docs</button><div className="profile"><div className="avatar">TT</div><div><b>Teddy Tech</b><small>Local workspace</small></div><Settings2 size={17}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="status-dot"></span><span className="status-text">All systems ready</span><button className="icon-button" title="Help" onClick={() => setNotice("Starter mode: AI generation requires OPENAI_API_KEY. Deployment and storage need production integrations.")}><CircleHelp size={18}/></button><div className="avatar small">TT</div></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow"><span className="pulse"></span> YOUR CREATIVE WORKSPACE</div><h1>{active === "Overview" ? "Build something brilliant." : active}</h1><p className="subtitle">Create with AI, shape your code, and get your project ready for the web.</p></div><button className="button primary" onClick={() => { setActive("AI Website Builder"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Plus size={17}/> New project</button></div>

        {notice && <div className="notice"><CheckCircle2 size={17}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16}/></button></div>}

        {active === "Overview" && <><section className="hero-card"><div className="hero-copy"><div className="hero-tag"><Sparkles size={13}/> AI POWERED WORKSPACE</div><h2>From idea to <span>internet-ready.</span></h2><p>Start with a sentence. Generate a page, edit the source, and prepare your next launch.</p><button className="button light" onClick={() => setActive("AI Website Builder")}>Create a website <ArrowUpRight size={16}/></button></div><div className="hero-art"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="code-window"><div className="window-top"><i></i><i></i><i></i><span>your-next-idea.tsx</span></div><div className="code-lines"><b>const</b> <em>website</em> = {'{' }<br/><span> &nbsp; idea: <strong>"yours"</strong>,</span><br/><span> &nbsp; style: <strong>"bold"</strong>,</span><br/><span> &nbsp; status: <strong>"building"</strong></span><br/>{'}'}<br/><div className="code-ready"><CheckCircle2 size={13}/> ready to preview</div></div></div></div></section>
          <div className="section-heading"><div><h2>Quick start</h2><p>Jump straight into your next task.</p></div></div>
          <div className="quick-grid"><button className="quick-card" onClick={() => setActive("AI Website Builder")}><div className="quick-icon violet"><WandSparkles size={20}/></div><div><b>Generate a website</b><p>Turn a prompt into a responsive draft.</p></div><ArrowUpRight size={17}/></button><button className="quick-card" onClick={() => setActive("Bot Workshop")}><div className="quick-icon green"><Bot size={20}/></div><div><b>Upload or import a bot</b><p>Organize a bot project or template.</p></div><ArrowUpRight size={17}/></button><button className="quick-card" onClick={() => setActive("Domains & Deploy")}><div className="quick-icon orange"><Rocket size={20}/></div><div><b>Publish a project</b><p>Set deployment and domain details.</p></div><ArrowUpRight size={17}/></button></div>
          <div className="section-heading"><div><h2>Included in your studio</h2><p>A workspace designed to grow with your projects.</p></div></div>
          <div className="feature-grid"><div className="feature-card"><Braces size={19}/><b>Code stays editable</b><p>Review and download generated HTML source.</p></div><div className="feature-card"><ShieldCheck size={19}/><b>Safer project workflow</b><p>Imported code is not executed by this demo.</p></div><div className="feature-card"><Link2 size={19}/><b>Creator link settings</b><p>Configure Deriv app and referral settings.</p></div><div className="feature-card"><Globe size={19}/><b>Custom domain setup</b><p>Collect a domain and prepare DNS steps.</p></div></div>
        </>}

        {active === "AI Website Builder" && <section className="builder-layout">
          <div className="builder-panel panel"><div className="panel-title"><div className="title-icon violet"><WandSparkles size={17}/></div><div><h2>AI Website Builder</h2><p>Tell the AI what to create.</p></div></div><label className="field-label">PROJECT NAME</label><input className="field" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="my-awesome-site"/><label className="field-label">DESCRIBE YOUR WEBSITE</label><textarea className="prompt-field" value={prompt} onChange={e => setPrompt(e.target.value)} rows={7} placeholder="Create a landing page for..."/><div className="prompt-hint"><Sparkles size={14}/> Be specific about layout, style, and sections.</div><button className="button primary full" disabled={busy || !prompt.trim()} onClick={generate}>{busy ? <Loader2 className="spin" size={17}/> : <Sparkles size={17}/>} {busy ? "Generating..." : "Generate website"}</button><div className="panel-divider"/><div className="mini-heading">QUICK PROMPTS</div>{["Portfolio for a developer","SaaS product landing page","Modern agency website"].map(p => <button className="prompt-chip" key={p} onClick={() => setPrompt(`Create a polished, responsive ${p.toLowerCase()} with a dark theme, strong typography, clear call to action, and mobile-friendly layout.`)}>{p}<ArrowUpRight size={13}/></button>)}</div>
          <div className="preview-panel panel"><div className="preview-toolbar"><div className="traffic"><i></i><i></i><i></i></div><div className="preview-url"><ShieldCheck size={13}/> local-preview / {projectName || "untitled"}</div><div className="segmented"><button className={tab === "preview" ? "selected" : ""} onClick={() => setTab("preview")}><Compass size={14}/> Preview</button><button className={tab === "code" ? "selected" : ""} onClick={() => setTab("code")}><Code2 size={14}/> Code</button></div></div>{tab === "preview" ? <iframe className="live-preview" title="Generated website preview" sandbox="" srcDoc={html}/> : <textarea className="code-editor" aria-label="HTML source editor" spellCheck={false} value={html} onChange={e => setHtml(e.target.value)}/>}<div className="preview-footer"><span><span className="status-dot"></span> Draft preview</span><button className="button secondary small" onClick={downloadHtml}><ArrowDownToLine size={15}/> Export HTML</button></div></div>
        </section>}

        {active === "Bot Workshop" && <section className="panel workspace-panel"><div className="panel-title"><div className="title-icon green"><Bot size={18}/></div><div><h2>Bot Workshop</h2><p>Upload project files or validate a public GitHub repository URL.</p></div></div><div className="upload-grid"><div className="upload-box"><CloudUpload size={27}/><h3>Upload bot files</h3><p>ZIP, JavaScript, TypeScript, Python, JSON, XML or docs. Demo selection only.</p><input id="bot-upload" type="file" multiple accept=".zip,.js,.ts,.py,.json,.xml,.md,.txt" onChange={uploadBot}/><label className="button secondary" htmlFor="bot-upload">Choose files</label><div className="file-list">{files.slice(-4).map((f,i)=><span key={`${f}-${i}`}><Code2 size={13}/>{f}</span>)}</div></div><div className="import-box"><div className="title-icon violet"><Link2 size={17}/></div><h3>Import public repository</h3><p>Enter a repository you own or are licensed to reuse.</p><label className="field-label">GITHUB REPOSITORY URL</label><input className="field" value={repo} onChange={e => setRepo(e.target.value)} placeholder="https://github.com/owner/repo"/><button className="button primary full" onClick={importRepo} disabled={!repo.trim()}>Validate repository <ArrowUpRight size={15}/></button><p className="microcopy">This validates the URL only; it does not clone or run code.</p></div></div><div className="list-toolbar"><div><h3>Bot library</h3><p>{bots.length} sample or local metadata entries</p></div><div className="searchbox"><Search size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bots"/></div></div><div className="bot-list">{filteredBots.map((bot,i)=><div className="bot-row" key={`${bot.name}-${i}`}><div className="bot-symbol"><Bot size={18}/></div><div className="bot-info"><b>{bot.name}</b><p>{bot.description}</p><span>{bot.kind} · v{bot.version}</span></div><button className="icon-button" title="Bot details" onClick={() => setNotice(`${bot.name}: inspect licence, dependencies and source before running or publishing.`)}><ExternalLink size={16}/></button></div>)}</div><div className="notice warning"><ShieldCheck size={17}/><span>Uploaded code is untrusted. This demo never executes it. Add private storage, malware scanning, and isolated build workers before public launch.</span></div></section>}

        {active === "Deriv Settings" && <section className="panel workspace-panel narrow"><div className="panel-title"><div className="title-icon green"><Activity size={18}/></div><div><h2>Creator Deriv settings</h2><p>Configure values used in your own generated project.</p></div></div><div className="form-section"><label className="field-label">DERIV APP ID</label><input className="field" value={appId} onChange={e => setAppId(e.target.value)} placeholder="Your registered Deriv app ID"/><label className="field-label">AFFILIATE / REFERRAL URL</label><input className="field" value={affiliate} onChange={e => setAffiliate(e.target.value)} placeholder="https://..."/><p className="microcopy">Only use a valid app ID and referral URL you are authorized to use. Redirect/callback URLs must be registered with the provider. These values are kept in this browser session only in this starter.</p><div className="link-preview"><div><b>Referral link preview</b><small>{affiliate || "No affiliate link configured"}</small></div><button className="button secondary small" onClick={() => { try { const u = new URL(affiliate); if (u.protocol !== "https:") throw new Error(); window.open(u.toString(), "_blank", "noopener,noreferrer"); } catch { setNotice("Enter a valid HTTPS referral URL first."); } }}>Test link <ArrowUpRight size={14}/></button></div><button className="button primary" onClick={() => setNotice("Settings are active in this browser session only. Add authentication and a database to persist per creator.")}>Save session settings <CheckCircle2 size={16}/></button></div></section>}

        {active === "Domains & Deploy" && <section className="panel workspace-panel narrow"><div className="panel-title"><div className="title-icon orange"><Rocket size={18}/></div><div><h2>Domains & Deploy</h2><p>Prepare your project for publishing.</p></div></div><div className="form-section"><label className="field-label">VERCEL PROJECT NAME</label><input className="field" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="my-project"/><label className="field-label">CUSTOM DOMAIN</label><input className="field" value={domain} onChange={e => setDomain(e.target.value)} placeholder="www.example.com"/><button className="button primary full" disabled={busy} onClick={deploy}>{busy ? <Loader2 className="spin" size={16}/> : <Rocket size={16}/>} Check deployment setup</button><div className="dns-card"><div className="dns-heading"><Globe size={17}/><b>Custom domain checklist</b></div><ol><li>Deploy the project to Vercel.</li><li>Add the domain in the Vercel project settings.</li><li>Copy the exact DNS records Vercel provides to your registrar.</li><li>Verify ownership and wait for DNS propagation.</li></ol><a href="https://vercel.com/docs/domains" target="_blank" rel="noreferrer">Read Vercel domain docs <ExternalLink size={13}/></a></div><div className="notice warning"><ShieldCheck size={17}/><span>Live deployment is not enabled in this starter. Add authenticated project packaging and Vercel API integration on the server before publishing users' projects.</span></div></div></section>}
        <footer className="footer"><span>© 2026 TEDDY AI Studio · Powered by Teddy Tech</span><span><span className="status-dot"></span> Starter workspace</span></footer>
      </div>
    </main>
  </div>;
}
