import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.email) e.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.password) e.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
    if (!form.confirm) e.confirm = "Vui lòng xác nhận mật khẩu";
    else if (form.confirm !== form.password) e.confirm = "Mật khẩu không khớp";
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  // password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();
  const strengthLabel = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"][strength];

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes floatWrench { 0%,100%{transform:rotate(-8deg) translateY(0)} 50%{transform:rotate(8deg) translateY(-8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .inp:focus { border-color:#2563eb !important; box-shadow:0 0 0 3px rgba(37,99,235,.15) !important; outline:none; }
        .inp:hover:not(:focus) { border-color:#94a3b8 !important; }
        .inp { transition:border .2s,box-shadow .2s; }
        .btn-primary { transition:background .2s,transform .1s,box-shadow .2s; }
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
          <div style={s.logoBadge}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>

          <h1 style={s.leftTitle}>Tạo tài khoản mới</h1>
          <p style={s.leftSub}>Tham gia AutoPro để quản lý gara của bạn hiệu quả hơn mỗi ngày.</p>

          {/* Wrench / tool illustration */}
          <div style={{ margin:"36px 0 32px", display:"flex", justifyContent:"center", animation:"floatWrench 3.5s ease-in-out infinite" }}>
            <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
              {/* Gear big */}
              <circle cx="90" cy="70" r="50" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.15)" strokeWidth="2"/>
              <circle cx="90" cy="70" r="30" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
              <circle cx="90" cy="70" r="12" fill="rgba(255,255,255,.18)"/>
              {/* Gear teeth */}
              {[0,45,90,135,180,225,270,315].map((deg,i)=>{
                const rad = (deg*Math.PI)/180;
                const x1 = 90+48*Math.cos(rad), y1 = 70+48*Math.sin(rad);
                const x2 = 90+58*Math.cos(rad), y2 = 70+58*Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.25)" strokeWidth="6" strokeLinecap="round"/>;
              })}
              {/* Wrench */}
              <path d="M55 30 Q45 20 50 10 Q60 5 65 15 L120 90 Q130 100 125 108 Q115 115 108 106 Z"
                fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
              <circle cx="56" cy="22" r="10" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
              <circle cx="116" cy="105" r="8" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
            </svg>
          </div>

          {/* Steps */}
          <div style={s.steps}>
            {[
              { n:"1", text:"Điền thông tin cơ bản" },
              { n:"2", text:"Xác minh tài khoản qua email" },
              { n:"3", text:"Bắt đầu quản lý gara của bạn" },
            ].map((step) => (
              <div key={step.n} style={s.step}>
                <div style={s.stepNum}>{step.n}</div>
                <span style={s.stepText}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <div style={s.formCard}>
          <div style={{ marginBottom:24, animation:"fadeUp .35s ease both" }}>
            <h2 style={s.formTitle}>Đăng ký tài khoản</h2>
            <p style={s.formSub}>Vui lòng điền đầy đủ thông tin bên dưới.</p>
          </div>

          <div style={{ animation:"fadeUp .4s .04s ease both" }}>
            {/* Name */}
            <div style={s.field}>
              <label style={s.label}>Họ và tên</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input className="inp" type="text" placeholder="Nguyễn Văn A"
                  value={form.name} onChange={set("name")}
                  style={{ ...s.input, borderColor: errors.name ? "#ef4444" : "#e5e7eb" }}/>
              </div>
              {errors.name && <p style={s.errMsg}>{errors.name}</p>}
            </div>

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
                <input className="inp" type="email" placeholder="ten@email.com"
                  value={form.email} onChange={set("email")}
                  style={{ ...s.input, borderColor: errors.email ? "#ef4444" : "#e5e7eb" }}/>
              </div>
              {errors.email && <p style={s.errMsg}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={s.field}>
              <label style={s.label}>Mật khẩu</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={set("password")}
                  style={{ ...s.input, borderColor: errors.password ? "#ef4444" : "#e5e7eb" }}/>
                <button className="eye-btn" onClick={() => setShowPass(v=>!v)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <p style={s.errMsg}>{errors.password}</p>}
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{
                        flex:1, height:3, borderRadius:99,
                        background: n <= strength ? strengthColor : "#e5e7eb",
                        transition:"background .3s",
                      }}/>
                    ))}
                  </div>
                  <p style={{ fontSize:11, color:strengthColor, fontWeight:600 }}>
                    Độ mạnh: {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ ...s.field, marginBottom:20 }}>
              <label style={s.label}>Xác nhận mật khẩu</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </span>
                <input className="inp" type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  value={form.confirm} onChange={set("confirm")}
                  style={{ ...s.input, borderColor: errors.confirm ? "#ef4444" : "#e5e7eb" }}/>
                <button className="eye-btn" onClick={() => setShowConfirm(v=>!v)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
                  {showConfirm
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.confirm && <p style={s.errMsg}>{errors.confirm}</p>}
            </div>

            {/* Submit */}
            <button
              className="btn-primary"
              onClick={handleRegister}
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
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </div>

          <p style={{ marginTop:18, fontSize:13, color:"#6b7280", textAlign:"center", animation:"fadeUp .4s .1s ease both" }}>
            Đã có tài khoản?{" "}
            <Link to="/login" className="link-blue">Đăng nhập</Link>
          </p>

          <p style={{ marginTop:20, fontSize:11, color:"#d1d5db", textAlign:"center" }}>
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
  left: {
    flex:"0 0 46%",
    background:"linear-gradient(145deg,#0a1f3d 0%,#0f3460 50%,#16213e 100%)",
    display:"flex", alignItems:"center", justifyContent:"center",
    padding:"40px 48px",
    position:"relative", overflow:"hidden",
  },
  leftInner: { position:"relative", zIndex:1, maxWidth:380, width:"100%" },
  logoBadge: {
    width:56, height:56, borderRadius:14,
    background:"rgba(255,255,255,.12)", backdropFilter:"blur(8px)",
    border:"1px solid rgba(255,255,255,.18)",
    display:"flex", alignItems:"center", justifyContent:"center",
    marginBottom:20,
  },
  leftTitle: { fontSize:26, fontWeight:800, color:"#fff", marginBottom:8 },
  leftSub: { fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:1.7 },
  steps: { display:"flex", flexDirection:"column", gap:14 },
  step: { display:"flex", alignItems:"center", gap:12 },
  stepNum: {
    width:28, height:28, borderRadius:"50%", flexShrink:0,
    background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:12, fontWeight:700, color:"#93c5fd",
  },
  stepText: { fontSize:13, color:"rgba(255,255,255,.75)" },
  right: {
    flex:1, background:"#f8fafc",
    display:"flex", alignItems:"center", justifyContent:"center",
    padding:32, overflowY:"auto",
  },
  formCard: {
    background:"#fff", border:"1px solid #e5e7eb", borderRadius:16,
    padding:"32px 36px 24px", width:"100%", maxWidth:400,
    boxShadow:"0 4px 24px rgba(0,0,0,.06)",
  },
  formTitle: { fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 },
  formSub: { fontSize:13, color:"#6b7280" },
  field: { marginBottom:14 },
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