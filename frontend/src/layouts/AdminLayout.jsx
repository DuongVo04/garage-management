import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const MENU = [
  {
    label: "Dashboard",
    path: "/home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Khách hàng",
    path: "/customers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Xe & Showroom",
    path: "/home/showroom",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Lịch dịch vụ",
    path: "/services",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Kho phụ tùng",
    path: "/inventory",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Hóa đơn",
    path: "/invoices",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    label: "Nhân viên",
    path: "/employees",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
];

const SIDEBAR_W = 248;
const TOPBAR_H = 56;

export default function AdminLayout({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const dark = mode === "dark";

  // ── theme tokens ──────────────────────────────────────────
  const t = {
    // backgrounds
    pageBg:      dark ? "#0f1117" : "#f3f4f6",
    sidebarBg:   dark ? "#141820" : "#ffffff",
    topbarBg:    dark ? "#141820" : "#ffffff",
    cardBg:      dark ? "#1c2230" : "#ffffff",
    // borders
    border:      dark ? "#272d3d" : "#e5e7eb",
    // text
    textPrimary: dark ? "#f1f5f9" : "#111827",
    textMuted:   dark ? "#64748b" : "#9ca3af",
    textSub:     dark ? "#94a3b8" : "#6b7280",
    // sidebar active
    activeText:  "#2563eb",
    activeBg:    dark ? "#1e2d50" : "#eff6ff",
    activeBorder:"#2563eb",
    // hover
    hoverBg:     dark ? "#1a2235" : "#f8fafc",
    // topbar icon hover
    iconHover:   dark ? "#1e2d50" : "#f3f4f6",
  };

  const sidebarW = collapsed ? 64 : SIDEBAR_W;

  return (
    <div style={{ display:"flex", fontFamily:"'Be Vietnam Pro',sans-serif", background:t.pageBg, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${dark?"#2a3347":"#d1d5db"};border-radius:99px}
        .nav-item{transition:background .15s,color .15s}
        .nav-item:hover{background:${t.hoverBg} !important}
        .icon-btn{transition:background .15s}
        .icon-btn:hover{background:${t.iconHover} !important}
        @keyframes fadeIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: "fixed", top:0, left:0, bottom:0,
        width: sidebarW,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.border}`,
        display: "flex", flexDirection: "column",
        transition: "width .25s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{
          height: TOPBAR_H,
          display: "flex", alignItems: "center",
          padding: collapsed ? "0 0 0 18px" : "0 16px",
          borderBottom: `1px solid ${t.border}`,
          flexShrink: 0,
          gap: 10,
          overflow: "hidden",
        }}>
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          {!collapsed && (
            <div style={{animation:"fadeIn .2s ease both", overflow:"hidden"}}>
              <div style={{fontSize:14, fontWeight:800, color:t.textPrimary, whiteSpace:"nowrap"}}>AutoPro Garage</div>
              <div style={{fontSize:11, color:t.textMuted, whiteSpace:"nowrap"}}>Quản lý gara & showroom</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{flex:1, padding:"12px 8px", overflowY:"auto", overflowX:"hidden"}}>
          {MENU.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className="nav-item"
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ""}
                style={{
                  display:"flex", alignItems:"center",
                  gap:10,
                  padding: collapsed ? "10px 0" : "9px 10px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius:8,
                  marginBottom:2,
                  cursor:"pointer",
                  background: active ? t.activeBg : "transparent",
                  color: active ? t.activeText : t.textSub,
                  fontWeight: active ? 700 : 500,
                  fontSize:13,
                  borderLeft: active ? `3px solid ${t.activeBorder}` : "3px solid transparent",
                  transition:"all .15s",
                }}
              >
                <span style={{flexShrink:0, display:"flex"}}>{item.icon}</span>
                {!collapsed && (
                  <span style={{whiteSpace:"nowrap", animation:"fadeIn .18s ease both"}}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div style={{padding:"12px 8px", borderTop:`1px solid ${t.border}`, flexShrink:0}}>
          <div
            className="nav-item"
            onClick={() => navigate("/login")}
            title={collapsed ? "Đăng xuất" : ""}
            style={{
              display:"flex", alignItems:"center",
              gap:10,
              padding: collapsed ? "10px 0" : "9px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius:8,
              cursor:"pointer",
              color: "#ef4444",
              fontWeight:600,
              fontSize:13,
              borderLeft:"3px solid transparent",
            }}
          >
            <span style={{flexShrink:0, display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!collapsed && <span style={{animation:"fadeIn .18s ease both"}}>Đăng xuất</span>}
          </div>
        </div>
      </aside>

      {/* ── TOPBAR ── */}
      <header style={{
        position:"fixed", top:0,
        left: sidebarW,
        right:0,
        height: TOPBAR_H,
        background: t.topbarBg,
        borderBottom:`1px solid ${t.border}`,
        display:"flex", alignItems:"center",
        padding:"0 20px",
        gap:12,
        zIndex:99,
        transition:"left .25s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Collapse toggle */}
        <button
          className="icon-btn"
          onClick={() => setCollapsed(c => !c)}
          style={{
            width:34, height:34, borderRadius:8, border:"none",
            background:"transparent", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:t.textMuted,
          }}
        >
          {collapsed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>

        {/* Breadcrumb / page title */}
        <div style={{flex:1}}>
          <span style={{fontSize:14, fontWeight:600, color:t.textPrimary}}>
            {MENU.find(m => m.path === location.pathname)?.label ?? "AutoPro Garage"}
          </span>
        </div>

        {/* Right actions */}
        <div style={{display:"flex", alignItems:"center", gap:6}}>
          {/* Notification bell */}
          <button
            className="icon-btn"
            style={{
              width:34, height:34, borderRadius:8, border:"none",
              background:"transparent", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:t.textMuted, position:"relative",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{
              position:"absolute", top:6, right:6,
              width:7, height:7, borderRadius:"50%",
              background:"#ef4444",
              border:`2px solid ${t.topbarBg}`,
            }}/>
          </button>

          {/* Dark/light toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            style={{
              width:34, height:34, borderRadius:8, border:"none",
              background:"transparent", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:t.textMuted,
            }}
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Divider */}
          <div style={{width:1, height:22, background:t.border, margin:"0 4px"}}/>

          {/* Avatar */}
          <div style={{
            width:32, height:32, borderRadius:"50%",
            background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer",
          }}>
            A
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        marginLeft: sidebarW,
        marginTop: TOPBAR_H,
        flex:1,
        minHeight: `calc(100vh - ${TOPBAR_H}px)`,
        transition:"margin-left .25s cubic-bezier(.4,0,.2,1)",
        overflow:"auto",
      }}>
        <Outlet context={{ mode }} />
      </main>
    </div>
  );
}