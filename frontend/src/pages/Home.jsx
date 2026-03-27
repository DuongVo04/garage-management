import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

// ── data ─────────────────────────────────────────────────────
const stats = [
  {
    title: "Khách hàng", value: 120, change: "+12%",
    color: "#2563eb", bg: { light:"#eff6ff", dark:"#1e2d50" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Xe trong hệ thống", value: 80, change: "+5%",
    color: "#059669", bg: { light:"#ecfdf5", dark:"#0a2e22" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    title: "Dịch vụ hôm nay", value: 45, change: "+8%",
    color: "#d97706", bg: { light:"#fffbeb", dark:"#3b1c03" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.41 1.41M5.34 18.66L3.93 20.07M12 2v2M12 20v2M4.93 4.93l1.41 1.41M18.66 18.66l1.41 1.41M2 12h2M20 12h2"/>
      </svg>
    ),
  },
  {
    title: "Doanh thu", value: "12.500.000đ", change: "+18%",
    color: "#7c3aed", bg: { light:"#f5f3ff", dark:"#240e4a" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
];

const modules = [
  { name:"Khách hàng",     desc:"Hồ sơ, lịch sử & liên hệ",        color:"#2563eb", bg:{light:"#eff6ff",dark:"#1e2d50"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { name:"Xe & Showroom",  desc:"Quản lý kho xe & trưng bày",        color:"#059669", bg:{light:"#ecfdf5",dark:"#0a2e22"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, path: "/home/showroom" },
  { name:"Lịch dịch vụ",  desc:"Đặt lịch, bảo dưỡng, sửa chữa",   color:"#d97706", bg:{light:"#fffbeb",dark:"#3b1c03"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { name:"Kho phụ tùng",  desc:"Nhập xuất, tồn kho linh kiện",      color:"#dc2626", bg:{light:"#fef2f2",dark:"#3d1005"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { name:"Hóa đơn",       desc:"Lập bill, theo dõi công nợ",         color:"#7c3aed", bg:{light:"#f5f3ff",dark:"#240e4a"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { name:"Nhân viên",     desc:"Quản lý ca, lương, phân quyền",      color:"#0891b2", bg:{light:"#ecfeff",dark:"#0a2830"}, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
];

const recentServices = [
  { name:"Nguyễn Văn An",  car:"Toyota Camry 2022",   service:"Thay dầu máy",         status:"Hoàn thành",    sc:"#059669", sb:{light:"#ecfdf5",dark:"#0a2e22"} },
  { name:"Trần Thị Bình",  car:"Honda CR-V 2021",     service:"Bảo dưỡng định kỳ",    status:"Đang làm",      sc:"#d97706", sb:{light:"#fffbeb",dark:"#3b1c03"} },
  { name:"Lê Minh Tuấn",   car:"Mazda CX-5 2023",    service:"Kiểm tra phanh",        status:"Chờ tiếp nhận", sc:"#2563eb", sb:{light:"#eff6ff",dark:"#1e2d50"} },
  { name:"Phạm Thu Hà",    car:"VinFast Lux A2.0",   service:"Sửa điều hòa",          status:"Đang làm",      sc:"#d97706", sb:{light:"#fffbeb",dark:"#3b1c03"} },
];

const avatarPairs = [
  ["#dbeafe","#1d4ed8"], ["#dcfce7","#15803d"],
  ["#fef3c7","#b45309"], ["#ede9fe","#6d28d9"],
];

// ── animated counter ─────────────────────────────────────────
function Counter({ target }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{n.toLocaleString("vi-VN")}</>;
}

// ── component ────────────────────────────────────────────────
export default function Home() {
  const { mode } = useOutletContext();
  const navigate = useNavigate();
  const dark = mode === "dark";
  const [hov, setHov] = useState(null);

  // theme tokens
  const t = {
    pageBg:      dark ? "#0f1117" : "#f3f4f6",
    cardBg:      dark ? "#1c2230" : "#ffffff",
    border:      dark ? "#272d3d" : "#e5e7eb",
    textPrimary: dark ? "#f1f5f9" : "#111827",
    textMuted:   dark ? "#64748b" : "#9ca3af",
    textSub:     dark ? "#94a3b8" : "#6b7280",
    rowHover:    dark ? "#1a2235" : "#f9fafb",
    divider:     dark ? "#1e2535" : "#f3f4f6",
    trackBg:     dark ? "#273044" : "#f0f0f0",
    secTitle:    dark ? "#94a3b8" : "#374151",
    progressLbl: dark ? "#cbd5e1" : "#374151",
  };

  const dateStr = new Date().toLocaleDateString("vi-VN", {
    weekday:"long", day:"2-digit", month:"2-digit", year:"numeric",
  });

  return (
    <div style={{ background:t.pageBg, minHeight:"100%", fontFamily:"'Be Vietnam Pro',sans-serif", transition:"background .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes barIn{from{width:0}}
        .ri:hover{background:${t.rowHover} !important}
        .mc{transition:transform .2s,box-shadow .2s,border-color .2s}
        .mc:hover{transform:translateY(-3px) !important}
      `}</style>

      <div style={{ maxWidth:1180, margin:"0 auto", padding:"28px 24px 52px" }}>

        {/* ── GREETING ── */}
        <div style={{ marginBottom:24, animation:"fadeUp .3s ease both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, color:t.textPrimary, marginBottom:4 }}>
                Tổng quan hoạt động
              </h1>
              <p style={{ fontSize:13, color:t.textSub }}>
                Chào buổi sáng! Hôm nay có{" "}
                <strong style={{ color:"#2563eb" }}>3 xe</strong> đang chờ tiếp nhận.
              </p>
            </div>
            <div style={{
              display:"flex", alignItems:"center", gap:6,
              fontSize:12, color:t.textMuted,
              background:t.cardBg, border:`1px solid ${t.border}`,
              borderRadius:8, padding:"6px 12px",
              transition:"background .3s,border .3s",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {dateStr}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:14, marginBottom:24,
        }}>
          {stats.map((st, i) => (
            <div key={st.title} style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderTop: `3px solid ${st.color}`,
              borderRadius:12,
              padding:"18px 18px 16px",
              animation:`fadeUp .4s ease ${i*55}ms both`,
              transition:"background .3s,border .3s",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div style={{
                  width:40, height:40, borderRadius:10,
                  background: st.bg[mode] ?? st.bg.light,
                  color: st.color,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background .3s",
                }}>
                  {st.icon}
                </div>
                <span style={{
                  fontSize:11, fontWeight:700,
                  color:"#059669", background: dark?"#0a2e22":"#ecfdf5",
                  padding:"3px 8px", borderRadius:20,
                }}>
                  {st.change} ↑
                </span>
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:t.textPrimary, marginBottom:2 }}>
                {typeof st.value === "number"
                  ? <Counter target={st.value}/>
                  : st.value}
              </div>
              <div style={{ fontSize:12, color:t.textMuted }}>{st.title}</div>
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* LEFT: modules */}
          <div style={{ flex:"1 1 520px", minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.secTitle, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Phân hệ quản lý
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
              {modules.map((m, i) => (
                <div
                  key={m.name}
                  className="mc"
                  onMouseEnter={()=>setHov(i)}
                  onMouseLeave={()=>setHov(null)}
                  onClick={() => m.path && navigate(m.path)}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${hov===i ? m.color+"88" : t.border}`,
                    borderLeft: `4px solid ${m.color}`,
                    borderRadius:10,
                    padding:"16px 14px",
                    cursor:"pointer",
                    animation:`fadeUp .4s ease ${180+i*45}ms both`,
                    boxShadow: hov===i ? `0 8px 24px ${m.color}22` : "none",
                    transition:"background .3s",
                  }}
                >
                  <div style={{
                    width:38, height:38, borderRadius:9,
                    background: m.bg[mode] ?? m.bg.light,
                    color: m.color,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:10,
                    transition:"background .3s",
                  }}>
                    {m.icon}
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.textPrimary, marginBottom:3 }}>{m.name}</div>
                  <div style={{ fontSize:12, color:t.textMuted }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT col */}
          <div style={{ flex:"0 0 320px", minWidth:280 }}>

            {/* Recent services */}
            <div style={{ fontSize:12, fontWeight:700, color:t.secTitle, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Dịch vụ gần đây
            </div>
            <div style={{
              background:t.cardBg, border:`1px solid ${t.border}`,
              borderRadius:12, overflow:"hidden",
              transition:"background .3s,border .3s", marginBottom:20,
            }}>
              {recentServices.map((r, i) => {
                const [abg, afc] = avatarPairs[i % avatarPairs.length];
                return (
                  <div key={i} className="ri" style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"11px 14px", cursor:"pointer",
                    borderBottom: i < recentServices.length-1 ? `1px solid ${t.divider}` : "none",
                    transition:"background .15s",
                  }}>
                    <div style={{
                      width:32, height:32, borderRadius:"50%",
                      background:abg, color:afc,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, fontWeight:700, flexShrink:0,
                    }}>
                      {r.name.charAt(0)}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{ fontSize:13, fontWeight:600, color:t.textPrimary, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize:11, color:t.textMuted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {r.car} · {r.service}
                      </div>
                    </div>
                    <span style={{
                      fontSize:10, fontWeight:700,
                      color:r.sc,
                      background: r.sb[mode] ?? r.sb.light,
                      padding:"3px 8px", borderRadius:20, flexShrink:0,
                      transition:"background .3s",
                    }}>
                      {r.status}
                    </span>
                  </div>
                );
              })}
              <div style={{
                fontSize:13, fontWeight:600, color:"#2563eb",
                textAlign:"center", padding:"10px",
                borderTop:`1px solid ${t.divider}`, cursor:"pointer",
              }}>
                Xem tất cả →
              </div>
            </div>

            {/* Progress */}
            <div style={{ fontSize:12, fontWeight:700, color:t.secTitle, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Tiến độ hôm nay
            </div>
            <div style={{
              background:t.cardBg, border:`1px solid ${t.border}`,
              borderRadius:12, padding:"18px 18px 6px",
              transition:"background .3s,border .3s",
            }}>
              {[
                { label:"Hoàn thành",    val:12, total:20, color:"#059669" },
                { label:"Đang xử lý",    val:6,  total:20, color:"#d97706" },
                { label:"Chờ tiếp nhận", val:2,  total:20, color:"#2563eb" },
              ].map(p => (
                <div key={p.label} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:t.progressLbl }}>{p.label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.val}/{p.total}</span>
                  </div>
                  <div style={{ height:7, background:t.trackBg, borderRadius:99, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:99, background:p.color,
                      width:`${(p.val/p.total)*100}%`,
                      animation:"barIn .9s ease both",
                    }}/>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}