import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email không hợp lệ";
    if (!password) e.password = "Vui lòng nhập mật khẩu";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1000);
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        @keyframes floatCar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to { transform:rotate(360deg); } }
        .inp:focus { border-color:#2563eb !important; box-shadow:0 0 0 3px rgba(37,99,235,.15) !important; outline:none; }
        .inp:hover:not(:focus) { border-color:#94a3b8 !important; }
        .inp { transition: border .2s, box-shadow .2s; }
        .btn-primary { transition: background .2s, transform .1s, box-shadow .2s; }
        .btn-primary:hover:not(:disabled) { background:#1d4ed8 !important; box-shadow:0 6px 20px rgba(37,99,235,.35) !important; }
        .btn-primary:active:not(:disabled) { transform:scale(.98); }
        .link-blue { color:#2563eb; font-weight:600; text-decoration:none; }
        .link-blue:hover { text-decoration:underline; }
        .eye-btn { background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; color:#9ca3af; }
        .eye-btn:hover { color:#374151; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={s.left}>
        <div style={s.leftInner}>
          {/* Logo */}
          <div style={s.logoBadge}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>

          <h1 style={s.leftTitle}>AutoPro Garage</h1>
          <p style={s.leftSub}>Hệ thống quản lý gara &amp; showroom chuyên nghiệp</p>

          {/* Animated car illustration */}
          <div style={{ margin:"40px 0 36px", animation:"floatCar 4s ease-in-out infinite" }}>
            <svg width="260" height="120" viewBox="0 0 260 120" fill="none">
              {/* Road */}
              <rect x="0" y="100" width="260" height="20" rx="4" fill="rgba(255,255,255,.08)"/>
              <rect x="20" y="109" width="30" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              <rect x="115" y="109" width="30" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              <rect x="210" y="109" width="30" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              {/* Car body */}
              <rect x="30" y="60" width="200" height="44" rx="8" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
              {/* Cabin */}
              <path d="M70 60 L88 30 L180 30 L200 60Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
              {/* Windows */}
              <rect x="94" y="34" width="42" height="22" rx="3" fill="rgba(255,255,255,.3)"/>
              <rect x="142" y="34" width="42" height="22" rx="3" fill="rgba(255,255,255,.3)"/>
              {/* Wheels */}
              <circle cx="80" cy="104" r="16" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
              <circle cx="80" cy="104" r="8" fill="rgba(255,255,255,.18)"/>
              <circle cx="180" cy="104" r="16" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
              <circle cx="180" cy="104" r="8" fill="rgba(255,255,255,.18)"/>
              {/* Headlight */}
              <ellipse cx="228" cy="76" rx="7" ry="5" fill="rgba(255,235,150,.6)"/>
              <line x1="235" y1="74" x2="255" y2="68" stroke="rgba(255,235,150,.4)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="235" y1="77" x2="258" y2="76" stroke="rgba(255,235,150,.4)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Features */}
          <div style={s.features}>
            {[
              { icon:"✓", text:"Quản lý khách hàng & xe toàn diện" },
              { icon:"✓", text:"Lịch dịch vụ & bảo dưỡng thông minh" },
              { icon:"✓", text:"Báo cáo doanh thu theo thời gian thực" },
            ].map((f, i) => (
              <div key={i} style={s.featureItem}>
                <span style={s.featureCheck}>{f.icon}</span>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <div style={s.formCard}>
          {/* Header */}
          <div style={{ marginBottom:28, animation:"fadeUp .35s ease both" }}>
            <h2 style={s.formTitle}>Đăng nhập</h2>
            <p style={s.formSub}>Chào mừng trở lại! Vui lòng nhập thông tin.</p>
          </div>

          {/* Fields */}
          <div style={{ animation:"fadeUp .4s .05s ease both" }}>
            {/* Email */}
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  className="inp"
                  type="email"
                  placeholder="admin@autopro.vn"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:""})); }}
                  style={{ ...s.input, borderColor: errors.email ? "#ef4444" : "#e5e7eb" }}
                />
              </div>
              {errors.email && <p style={s.errMsg}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ ...s.field, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <label style={s.label}>Mật khẩu</label>
                <a href="#" style={{ fontSize:12, color:"#2563eb", textDecoration:"none", fontWeight:600 }}>Quên mật khẩu?</a>
              </div>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="inp"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:""})); }}
                  style={{ ...s.input, borderColor: errors.password ? "#ef4444" : "#e5e7eb" }}
                />
                <button className="eye-btn" onClick={() => setShowPass(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <p style={s.errMsg}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              className="btn-primary"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width:"100%", height:46, borderRadius:10, border:"none",
                background: loading ? "#93c5fd" : "#2563eb",
                color:"#fff", fontSize:14, fontWeight:700,
                cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
            >
              {loading && (
                <span style={{ width:16, height:16, border:"2px solid #fff", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }}/>
              )}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          {/* Footer */}
          <p style={{ marginTop:20, fontSize:13, color:"#6b7280", textAlign:"center", animation:"fadeUp .4s .1s ease both" }}>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="link-blue">Đăng ký ngay</Link>
          </p>

          <p style={{ marginTop:24, fontSize:11, color:"#d1d5db", textAlign:"center" }}>
            © 2025 AutoPro Garage · Phiên bản 1.0
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    display:"flex", height:"100vh", overflow:"hidden",
    fontFamily:"'Be Vietnam Pro',sans-serif",
  },
  // LEFT
  left: {
    flex:"0 0 46%",
    background:"linear-gradient(145deg,#0c1b40 0%,#1a3a7c 50%,#1e4db7 100%)",
    display:"flex", alignItems:"center", justifyContent:"center",
    padding:"40px 48px",
    position:"relative", overflow:"hidden",
  },
  leftInner: { position:"relative", zIndex:1, maxWidth:380, width:"100%" },
  logoBadge: {
    width:56, height:56, borderRadius:14,
    background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)",
    border:"1px solid rgba(255,255,255,.2)",
    display:"flex", alignItems:"center", justifyContent:"center",
    marginBottom:20,
  },
  leftTitle: { fontSize:28, fontWeight:800, color:"#fff", marginBottom:8 },
  leftSub: { fontSize:14, color:"rgba(255,255,255,.6)", lineHeight:1.6 },
  features: { display:"flex", flexDirection:"column", gap:12 },
  featureItem: { display:"flex", alignItems:"center", gap:10 },
  featureCheck: {
    width:22, height:22, borderRadius:"50%",
    background:"rgba(255,255,255,.15)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:11, color:"#7dd3fc", fontWeight:700, flexShrink:0,
  },
  featureText: { fontSize:13, color:"rgba(255,255,255,.75)" },
  // RIGHT
  right: {
    flex:1,
    background:"#f8fafc",
    display:"flex", alignItems:"center", justifyContent:"center",
    padding:32,
    overflowY:"auto",
  },
  formCard: {
    background:"#fff",
    border:"1px solid #e5e7eb",
    borderRadius:16,
    padding:"36px 36px 28px",
    width:"100%", maxWidth:400,
    boxShadow:"0 4px 24px rgba(0,0,0,.06)",
  },
  formTitle: { fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 },
  formSub: { fontSize:13, color:"#6b7280" },
  field: { marginBottom:16 },
  label: { display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 },
  inputWrap: { position:"relative", display:"flex", alignItems:"center" },
  inputIcon: {
    position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
    display:"flex", pointerEvents:"none",
  },
  input: {
    width:"100%", height:44, paddingLeft:38, paddingRight:40,
    border:"1.5px solid #e5e7eb", borderRadius:9,
    fontSize:13, color:"#111827", background:"#fafafa",
    fontFamily:"'Be Vietnam Pro',sans-serif",
  },
  errMsg: { fontSize:11, color:"#ef4444", marginTop:4, marginLeft:2 },
};