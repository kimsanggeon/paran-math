import { useState } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const T = { primary:"#7C3AED", primaryDark:"#6D28D9", primaryLight:"#EDE9FE", bg:"#FAF5FF", sidebar:"#1A0A2E" };
const C = { success:"#10B981", danger:"#EF4444", warning:"#F59E0B", info:"#3B82F6", text:"#0F172A", muted:"#64748B", border:"#E2E8F0", white:"#FFF" };

// ─── MICRO UI ───────────────────────────────────────────────────
const Av  = ({ char, color=T.primary, size=36 }) => <div style={{ width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:size*.38,flexShrink:0 }}>{char}</div>;
const Bdg = ({ text, color, bg }) => <span style={{ fontSize:11,padding:"3px 9px",borderRadius:20,background:bg,color,fontWeight:700,whiteSpace:"nowrap" }}>{text}</span>;
const Card= ({ children, style={} }) => <div style={{ background:C.white,borderRadius:14,border:`1px solid ${C.border}`,...style }}>{children}</div>;
const Stat= ({ icon, label, value, sub, color=T.primary, bg=T.primaryLight }) => (
  <Card style={{ padding:"16px 18px" }}><div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
    <div><div style={{ fontSize:11,color:C.muted,marginBottom:6 }}>{label}</div><div style={{ fontSize:20,fontWeight:800,color:C.text }}>{value}</div>{sub&&<div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{sub}</div>}</div>
    <div style={{ width:38,height:38,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{icon}</div>
  </div></Card>
);
const Bar = ({ value, color=T.primary, height=8 }) => <div style={{ height,background:C.border,borderRadius:4,overflow:"hidden" }}><div style={{ height:"100%",width:`${Math.min(Math.max(value,0),100)}%`,background:color,borderRadius:4,transition:"width .5s" }}/></div>;
const H   = ({ children, style={} }) => <div style={{ fontSize:14,fontWeight:800,marginBottom:14,color:C.text,...style }}>{children}</div>;
const Lbl = ({ children }) => <label style={{ fontSize:12,fontWeight:600,color:C.muted,display:"block",marginBottom:5 }}>{children}</label>;
const inp = { width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,boxSizing:"border-box",fontFamily:"inherit" };
const sel = { width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,background:"#fff",fontFamily:"inherit" };
const Btn = ({ children, onClick, color="#fff", bg=T.primary, style={}, disabled=false }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding:"9px 16px",background:disabled?"#CBD5E1":bg,color,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",...style }}>{children}</button>
);
const Stars = ({ v, max=5 }) => <span>{[...Array(max)].map((_,i)=><span key={i} style={{ color:i<v?C.warning:C.border,fontSize:13 }}>★</span>)}</span>;

function Modal({ title, onClose, children, width=480 }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200 }} onClick={onClose}>
      <div style={{ background:"#fff",borderRadius:16,padding:28,width,maxWidth:"94vw",maxHeight:"91vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div style={{ fontSize:16,fontWeight:800 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION PLANS ─────────────────────────────────────────
const INSTRUCTOR_PLANS = {
  basic:      { id:"basic",      name:"베이직",      price:15000,  color:"#059669", bg:"#D1FAE5", classes:3,  students:10,  emoji:"🌱", tag:null },
  standard:   { id:"standard",   name:"스탠다드",    price:25000,  color:"#7C3AED", bg:"#EDE9FE", classes:5,  students:20,  emoji:"🚀", tag:"인기" },
  pro:        { id:"pro",        name:"프로",        price:35000,  color:"#F59E0B", bg:"#FFFBEB", classes:10, students:35,  emoji:"👑", tag:null },
  enterprise: { id:"enterprise", name:"엔터프라이즈", price:100000, color:"#0EA5E9", bg:"#E0F2FE", classes:999,students:100, emoji:"🏛️", tag:"최대 규모" },
};
const INSTRUCTOR_FEATURES = {
  basic:      ["반 관리 (3반/10명)","출결·스케줄 관리","📋 반별 진도 관리","📊 원장님 보고 자동화","📣 학부모 단체 알림","🔁 보강·결보강 관리"],
  standard:   ["반 관리 (5반/20명)","📝 시험·레벨테스트","🔍 오답·취약단원 분석","🏆 포인트·랭킹 시스템","베이직 전체 기능 포함"],
  pro:        ["반 관리 (10반/35명)","💼 강사 성과 관리","🤝 동료 강사 협업","AI 고급 보고서","스탠다드 전체 기능 포함"],
  enterprise: ["반 무제한/100명","맞춤형 설정 지원","전담 CS 매니저","API 연동 지원","프로 전체 기능 포함"],
};

// ─── 과외 전용 PLANS ────────────────────────────────────────────
const TUTOR_PLANS = {
  basic:      { id:"basic",      name:"3명반",   price:15000, color:"#059669", bg:"#D1FAE5", classes:2,  students:3,   emoji:"🌱", tag:null },
  standard:   { id:"standard",   name:"6명반",   price:25000, color:"#7C3AED", bg:"#EDE9FE", classes:3,  students:6,   emoji:"🚀", tag:"인기" },
  pro:        { id:"pro",        name:"9명반",   price:50000, color:"#F59E0B", bg:"#FFFBEB", classes:5,  students:9,   emoji:"👑", tag:null },
  enterprise: { id:"enterprise", name:"12명 이상", price:80000, color:"#0EA5E9", bg:"#E0F2FE", classes:10, students:15,  emoji:"🏛️", tag:"최대" },
};
const TUTOR_FEATURES = {
  basic:      ["학생 최대 3명","출결·스케줄 관리","📋 학생별 진도 관리","📊 학부모 보고서 자동화","📣 학부모 개별 알림","🔁 보강·결보강 관리"],
  standard:   ["학생 최대 6명","📝 시험·레벨테스트","🔍 오답·취약단원 분석","🏆 포인트·동기부여 시스템","3명반 전체 기능 포함"],
  pro:        ["학생 최대 9명","💼 수업 성과 분석","🤝 학부모 심층 상담 자료","📊 월간 종합 보고서","6명반 전체 기능 포함"],
  enterprise: ["학생 12명 이상 (최대 15명)","맞춤형 커리큘럼 설계","📈 학생별 장기 성장 리포트","전 기능 무제한","9명반 전체 기능 포함"],
};

// ─── 모드별 플랜 선택 함수 ──────────────────────────────────────
function getPlans(mode) { return mode === 'tutor' ? TUTOR_PLANS : INSTRUCTOR_PLANS; }
function getPlanFeatures(mode) { return mode === 'tutor' ? TUTOR_FEATURES : INSTRUCTOR_FEATURES; }

let PLANS = INSTRUCTOR_PLANS;
let PLAN_FEATURES = INSTRUCTOR_FEATURES;
const FEATURE_PLAN = {
  dashboard:"basic", classes:"basic", students:"basic", attendance:"basic", schedule:"basic",
  progress:"basic", report:"basic", notify:"basic", makeup:"basic",
  exam:"standard", wrong:"standard", points:"standard",
  performance:"pro", collab:"pro",
};
const planOrder = { basic:0, standard:1, pro:2, enterprise:3 };

// ─── 계좌 정보 ──────────────────────────────────────────────────
const BANK_INFO = {
  bank: "카카오뱅크",
  account: "3333-22-1234567",
  holder: "수업노트(주)",
  csPhone: "010-1234-5678",
  csEmail: "support@suupnote.kr",
};

function PlanGate({ feature, current, onUpgrade, children }) {
  const req = FEATURE_PLAN[feature];
  if (planOrder[current] >= planOrder[req]) return children;
  const plan = PLANS[req];
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:320,padding:40,textAlign:"center" }}>
      <div style={{ fontSize:56,marginBottom:16 }}>{plan.emoji}</div>
      <div style={{ fontSize:20,fontWeight:800,marginBottom:8 }}>{plan.name} 플랜이 필요합니다</div>
      <div style={{ fontSize:14,color:C.muted,marginBottom:24,lineHeight:1.8 }}>이 기능은 <strong style={{ color:plan.color }}>{plan.name}</strong> 플랜 (월 {plan.price.toLocaleString()}원)부터 사용 가능합니다.</div>
      <div style={{ background:plan.bg,padding:"16px 28px",borderRadius:12,marginBottom:24,minWidth:260 }}>
        {PLAN_FEATURES[plan.id].map((f,i)=><div key={i} style={{ fontSize:13,padding:"4px 0" }}>✅ {f}</div>)}
      </div>
      <Btn onClick={onUpgrade} bg={plan.color} style={{ padding:"12px 36px",fontSize:15 }}>🔓 {plan.name} 플랜으로 업그레이드</Btn>
    </div>
  );
}

// ─── SUBSCRIPTION PAGE ──────────────────────────────────────────
function SubscriptionPage({ current, onSelect, onClose, mode='instructor' }) {
  const [billing,    setBilling]    = useState("monthly");
  const [step,       setStep]       = useState("plans");   // plans | confirm | payment | done
  const [selectedId, setSelectedId] = useState(null);
  const [depositor,  setDepositor]  = useState("");
  const [agreed,     setAgreed]     = useState(false);
  const [copied,     setCopied]     = useState(false);

  const disc    = billing === "yearly" ? 0.8 : 1;
  const selPlan = selectedId ? PLANS[selectedId] : null;
  const monthly = selPlan ? Math.round(selPlan.price * disc) : 0;
  const annual  = monthly * 12;
  const refCode = selPlan ? `SNOTE-${selPlan.id.toUpperCase()}-${Date.now().toString().slice(-6)}` : "";

  const rows = mode === 'tutor' ? [
    ["학생 수",             "최대 3명","최대 6명","최대 9명","12명 이상(최대15)"],
    ["출결·스케줄",        "✅","✅","✅","✅"],
    ["📋 학생별 진도 관리","✅","✅","✅","✅"],
    ["📊 학부모 보고서",   "✅","✅","✅","✅"],
    ["📣 학부모 개별 알림","✅","✅","✅","✅"],
    ["🔁 보강·결보강",     "✅","✅","✅","✅"],
    ["📝 시험·레벨테스트", "❌","✅","✅","✅"],
    ["🔍 오답·취약단원",   "❌","✅","✅","✅"],
    ["🏆 포인트·동기부여", "❌","✅","✅","✅"],
    ["💼 수업 성과 분석",  "❌","❌","✅","✅"],
    ["🤝 학부모 심층 상담","❌","❌","✅","✅"],
    ["📊 월간 종합 보고서","❌","❌","✅","✅"],
    ["📈 장기 성장 리포트","❌","❌","❌","✅"],
    ["맞춤형 커리큘럼",    "❌","❌","❌","✅"],
  ] : [
    ["반 관리",            "3반/10명","5반/20명","10반/35명","무제한/100명"],
    ["출결·스케줄",        "✅","✅","✅","✅"],
    ["📋 반별 진도 관리",  "✅","✅","✅","✅"],
    ["📊 원장님 보고",     "✅","✅","✅","✅"],
    ["📣 학부모 단체 알림","✅","✅","✅","✅"],
    ["🔁 보강·결보강",     "✅","✅","✅","✅"],
    ["📝 시험·레벨테스트", "❌","✅","✅","✅"],
    ["🔍 오답·취약단원",   "❌","✅","✅","✅"],
    ["🏆 포인트·랭킹",     "❌","✅","✅","✅"],
    ["💼 강사 성과 관리",  "❌","❌","✅","✅"],
    ["🤝 동료 강사 협업",  "❌","❌","✅","✅"],
    ["AI 고급 보고서",     "❌","❌","✅","✅"],
    ["전담 CS 매니저",     "❌","❌","❌","✅"],
    ["API 연동",           "❌","❌","❌","✅"],
  ];

  const copyAccount = () => {
    navigator.clipboard?.writeText(BANK_INFO.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16 }}
      onClick={step==="plans"?onClose:undefined}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:980,maxHeight:"95vh",overflowY:"auto",position:"relative" }}
        onClick={e=>e.stopPropagation()}>

        {/* ── 헤더 ── */}
        <div style={{ padding:"26px 32px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:22,fontWeight:900 }}>
              {step==="plans"?(mode==='tutor'?"💳 과외 선생님 구독 플랜":"💳 학원 강사 구독 플랜"):step==="confirm"?"📋 플랜 확인":step==="payment"?"🏦 계좌 입금 안내":"✅ 신청 완료"}
            </div>
            <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>
              {step==="plans"?"원하는 플랜을 선택하고 계좌로 간편하게 결제하세요":
               step==="confirm"?"선택하신 플랜을 확인해 주세요":
               step==="payment"?"아래 계좌로 입금 후 입금자명을 확인해 주세요":
               "입금 확인 후 1시간 이내에 플랜이 활성화됩니다"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:24,cursor:"pointer",color:C.muted,flexShrink:0 }}>×</button>
        </div>

        {/* ── STEP 1: 플랜 선택 ── */}
        {step==="plans"&&<div style={{ padding:"20px 32px 32px" }}>
          {/* 연/월 토글 */}
          <div style={{ display:"flex",justifyContent:"center",marginBottom:24 }}>
            <div style={{ background:"#F1F5F9",borderRadius:20,padding:4,display:"inline-flex" }}>
              {[["monthly","월간 결제"],["yearly","연간 결제 (20% 할인)"]].map(([v,l])=>(
                <button key={v} onClick={()=>setBilling(v)} style={{ padding:"8px 22px",borderRadius:16,border:"none",cursor:"pointer",background:billing===v?"#fff":"transparent",fontWeight:billing===v?700:400,color:billing===v?T.primary:C.muted,fontSize:13,transition:"all .2s",boxShadow:billing===v?"0 2px 6px rgba(0,0,0,.1)":"none" }}>{l}</button>
              ))}
            </div>
          </div>

          {/* 플랜 카드 4개 */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32 }}>
            {Object.values(PLANS).map(plan=>{
              const isCur = plan.id === current;
              const mp    = Math.round(plan.price * disc);
              const isSel = selectedId === plan.id;
              return (
                <div key={plan.id} onClick={()=>setSelectedId(plan.id)}
                  style={{ border:`2px solid ${isSel?plan.color:plan.id==="standard"?T.primary:isCur?"#F59E0B":C.border}`,borderRadius:16,padding:22,position:"relative",cursor:"pointer",
                    background:isSel?plan.bg:plan.id==="standard"?T.bg:"#fff",
                    transform:isSel?"translateY(-3px)":"none",transition:"all .2s",boxShadow:isSel?`0 8px 24px ${plan.color}33`:"none" }}>
                  {plan.tag&&<div style={{ position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:plan.id==="standard"?T.primary:plan.color,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap" }}>{plan.tag} ✨</div>}
                  {isCur&&<div style={{ position:"absolute",top:-12,right:12,background:"#F59E0B",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20 }}>현재</div>}
                  {isSel&&!isCur&&<div style={{ position:"absolute",top:-12,right:12,background:plan.color,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20 }}>선택됨 ✓</div>}
                  <div style={{ fontSize:32,marginBottom:8 }}>{plan.emoji}</div>
                  <div style={{ fontSize:16,fontWeight:800,marginBottom:8 }}>{plan.name}</div>
                  <div style={{ marginBottom:8 }}>
                    <span style={{ fontSize:26,fontWeight:900,color:plan.color }}>{mp.toLocaleString()}</span>
                    <span style={{ fontSize:12,color:C.muted }}>원/월</span>
                  </div>
                  {billing==="yearly"&&<div style={{ fontSize:11,color:C.success,marginBottom:4,fontWeight:600 }}>연 {(mp*12).toLocaleString()}원 · 2개월 무료</div>}
                  <div style={{ fontSize:12,color:C.muted,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${C.border}` }}>
                    {plan.classes===999?"반 무제한":plan.classes+"개 반"} / 학생 {plan.students}명
                  </div>
                  <div style={{ minHeight:110 }}>
                    {PLAN_FEATURES[plan.id].map((f,i)=>(
                      <div key={i} style={{ fontSize:12,display:"flex",gap:6,padding:"3px 0",color:C.text }}>
                        <span style={{ color:C.success,flexShrink:0 }}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                  <button onClick={e=>{e.stopPropagation();if(!isCur){setSelectedId(plan.id);setStep("confirm");}}}
                    style={{ width:"100%",marginTop:14,padding:"10px",background:isCur?"#F1F5F9":plan.color,color:isCur?C.muted:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:isCur?"default":"pointer",transition:"opacity .2s" }}>
                    {isCur?"현재 플랜":"이 플랜 선택 →"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 기능 비교표 */}
          <div style={{ borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden" }}>
            <div style={{ background:T.primary,color:"#fff",padding:"12px 20px",fontWeight:800,fontSize:14 }}>📋 기능 상세 비교</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse",minWidth:640 }}>
                <thead><tr style={{ background:"#F8FAFC" }}>
                  <th style={{ padding:"9px 16px",fontSize:12,color:C.muted,fontWeight:600,textAlign:"left",borderBottom:`1px solid ${C.border}`,width:"30%" }}>기능</th>
                  {Object.values(PLANS).map(p=><th key={p.id} style={{ padding:"9px 10px",fontSize:12,color:p.id==="standard"?T.primary:C.muted,fontWeight:700,textAlign:"center",borderBottom:`1px solid ${C.border}` }}>{p.emoji} {p.name}</th>)}
                </tr></thead>
                <tbody>{rows.map((row,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${C.border}`,background:i%2===0?"#fff":"#FAFAFA" }}>
                    <td style={{ padding:"9px 16px",fontSize:13 }}>{row[0]}</td>
                    {[row[1],row[2],row[3],row[4]].map((v,j)=>(
                      <td key={j} style={{ padding:"9px 10px",textAlign:"center",fontSize:13,color:v==="✅"?C.success:v==="❌"?"#CBD5E1":C.text,fontWeight:v==="✅"||v==="❌"?700:600 }}>{v}</td>
                    ))}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          {/* 하단 안내 */}
          <div style={{ marginTop:20,padding:"14px 18px",background:"#F8FAFC",borderRadius:12,display:"flex",gap:24,flexWrap:"wrap",fontSize:12,color:C.muted }}>
            <span>🏦 계좌이체 결제만 지원</span>
            <span>📅 입금 확인 후 즉시 활성화</span>
            <span>🔄 플랜 변경 언제든 가능</span>
            <span>📞 문의: {BANK_INFO.csPhone}</span>
          </div>
        </div>}

        {/* ── STEP 2: 주문 확인 ── */}
        {step==="confirm"&&selPlan&&<div style={{ padding:"24px 32px 32px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24 }}>
            <div style={{ background:selPlan.bg,borderRadius:16,padding:28,textAlign:"center",border:`2px solid ${selPlan.color}` }}>
              <div style={{ fontSize:52,marginBottom:10 }}>{selPlan.emoji}</div>
              <div style={{ fontSize:22,fontWeight:900,color:selPlan.color }}>{selPlan.name} 플랜</div>
              <div style={{ fontSize:14,color:C.muted,marginTop:4 }}>반 {selPlan.classes===999?"무제한":selPlan.classes+"개"} / 학생 {selPlan.students}명</div>
              <div style={{ marginTop:16,fontSize:32,fontWeight:900 }}>
                {monthly.toLocaleString()}<span style={{ fontSize:14,color:C.muted }}>원/월</span>
              </div>
              {billing==="yearly"&&<div style={{ marginTop:6,fontSize:13,color:C.success,fontWeight:700 }}>연간: {annual.toLocaleString()}원 (2개월 무료)</div>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <div style={{ padding:"16px 18px",background:"#F8FAFC",borderRadius:12 }}>
                <div style={{ fontSize:12,color:C.muted,marginBottom:8,fontWeight:700 }}>📦 포함 기능</div>
                {PLAN_FEATURES[selPlan.id].map((f,i)=>(
                  <div key={i} style={{ fontSize:13,display:"flex",gap:6,padding:"3px 0" }}><span style={{ color:C.success }}>✓</span>{f}</div>
                ))}
              </div>
              <div style={{ padding:"14px 18px",background:"#FFFBEB",borderRadius:12,border:"1px solid #FDE68A" }}>
                <div style={{ fontSize:12,color:C.warning,fontWeight:700,marginBottom:6 }}>⚠️ 결제 방식 안내</div>
                <div style={{ fontSize:13,lineHeight:1.8,color:C.text }}>
                  본 서비스는 <strong>계좌이체</strong>로만 결제됩니다.<br/>
                  입금 확인 후 <strong>1시간 이내</strong> 플랜이 활성화되며<br/>
                  평일 09:00~18:00에 처리됩니다.
                </div>
              </div>
            </div>
          </div>

          {/* 청구 주기 선택 */}
          <div style={{ padding:"16px 18px",background:T.bg,borderRadius:12,marginBottom:20 }}>
            <div style={{ fontSize:13,fontWeight:700,marginBottom:10 }}>📅 결제 주기</div>
            <div style={{ display:"flex",gap:12 }}>
              {[["monthly","월간 결제",`${monthly.toLocaleString()}원/월`,""],["yearly","연간 결제",`${Math.round(selPlan.price*0.8*12).toLocaleString()}원/년`,"2개월 무료 혜택"]].map(([v,l,price,tag])=>(
                <div key={v} onClick={()=>setBilling(v)} style={{ flex:1,padding:"14px 16px",borderRadius:10,border:`2px solid ${billing===v?selPlan.color:C.border}`,background:billing===v?selPlan.bg:"#fff",cursor:"pointer" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700 }}>{l}</div>
                      <div style={{ fontSize:16,fontWeight:900,color:selPlan.color,marginTop:3 }}>{price}</div>
                    </div>
                    {tag&&<Bdg text={tag} color={C.success} bg="#ECFDF5"/>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 동의 체크 */}
          <div style={{ padding:"14px 18px",background:"#F8FAFC",borderRadius:12,marginBottom:20 }}>
            <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:3,width:16,height:16,cursor:"pointer" }}/>
              <label htmlFor="agree" style={{ fontSize:13,lineHeight:1.7,cursor:"pointer",color:C.text }}>
                이용약관 및 개인정보처리방침에 동의합니다.<br/>
                <span style={{ color:C.muted,fontSize:12 }}>구독 기간 중 해지 시 남은 기간은 환불되지 않으며, 연간 결제는 월간으로 자동 전환됩니다.</span>
              </label>
            </div>
          </div>

          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={()=>setStep("plans")} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>← 플랜 다시 선택</Btn>
            <Btn onClick={()=>setStep("payment")} disabled={!agreed} style={{ flex:2,background:agreed?selPlan.color:"#CBD5E1",fontSize:15,padding:"12px" }}>
              🏦 계좌 입금 정보 확인 →
            </Btn>
          </div>
        </div>}

        {/* ── STEP 3: 계좌 입금 안내 ── */}
        {step==="payment"&&selPlan&&<div style={{ padding:"24px 32px 32px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24 }}>
            {/* 계좌 정보 */}
            <div style={{ background:"linear-gradient(135deg,#1A0A2E,#2D1B69)",borderRadius:20,padding:28,color:"#fff" }}>
              <div style={{ fontSize:13,color:"#C4B5FD",marginBottom:4 }}>입금 계좌 정보</div>
              <div style={{ fontSize:22,fontWeight:900,marginBottom:20 }}>🏦 {BANK_INFO.bank}</div>
              <div style={{ background:"rgba(255,255,255,.08)",borderRadius:12,padding:"18px 20px",marginBottom:16 }}>
                <div style={{ fontSize:12,color:"#A78BFA",marginBottom:6 }}>계좌번호</div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div style={{ fontSize:22,fontWeight:900,letterSpacing:2 }}>{BANK_INFO.account}</div>
                  <button onClick={copyAccount} style={{ padding:"7px 14px",background:copied?"#10B981":"#7C3AED",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,transition:"background .3s" }}>
                    {copied?"✓ 복사됨":"📋 복사"}
                  </button>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {[{l:"예금주",v:BANK_INFO.holder},{l:"입금액",v:`${monthly.toLocaleString()}원`},{l:"입금자명",v:"이름+연락처4자리"},{l:"결제주기",v:billing==="yearly"?"연간":"월간"}].map((x,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.08)",borderRadius:10,padding:"11px 14px" }}>
                    <div style={{ fontSize:11,color:"#A78BFA",marginBottom:4 }}>{x.l}</div>
                    <div style={{ fontSize:13,fontWeight:700 }}>{x.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16,padding:"10px 14px",background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",borderRadius:10 }}>
                <div style={{ fontSize:12,color:"#FDE68A",fontWeight:700,marginBottom:3 }}>⚠️ 입금자명 필수 기재</div>
                <div style={{ fontSize:12,color:"#FEF3C7" }}>홍길동1234 형식으로 입금해 주세요<br/>(이름 + 연락처 끝 4자리)</div>
              </div>
            </div>

            {/* 입금 신청 폼 */}
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div style={{ padding:"16px 18px",background:selPlan.bg,borderRadius:14,border:`2px solid ${selPlan.color}` }}>
                <div style={{ fontSize:13,color:C.muted,marginBottom:4 }}>선택 플랜</div>
                <div style={{ fontSize:18,fontWeight:900,color:selPlan.color }}>{selPlan.emoji} {selPlan.name}</div>
                <div style={{ fontSize:24,fontWeight:900,marginTop:4 }}>{monthly.toLocaleString()}원<span style={{ fontSize:13,color:C.muted }}>/월</span></div>
                {billing==="yearly"&&<div style={{ fontSize:12,color:C.success,marginTop:3,fontWeight:600 }}>연 {annual.toLocaleString()}원 일괄 입금</div>}
              </div>
              <div>
                <Lbl>입금자명 (이름+연락처4자리) *</Lbl>
                <input value={depositor} onChange={e=>setDepositor(e.target.value)} placeholder="홍길동1234" style={{ ...inp,fontSize:15,fontWeight:700 }}/>
                <div style={{ fontSize:11,color:C.muted,marginTop:4 }}>입력하신 내용으로 입금 확인을 진행합니다</div>
              </div>
              <div style={{ padding:"14px 18px",background:"#F8FAFC",borderRadius:12 }}>
                <div style={{ fontSize:12,fontWeight:700,color:C.muted,marginBottom:8 }}>📋 처리 절차</div>
                {[["입금 완료","지금 즉시"],["입금 확인","평일 09:00~18:00"],["플랜 활성화","확인 후 1시간 이내"],["이용 시작","즉시 모든 기능 사용"]].map(([a,b],i)=>(
                  <div key={i} style={{ display:"flex",gap:12,marginBottom:8,alignItems:"center" }}>
                    <div style={{ width:22,height:22,borderRadius:"50%",background:T.primary,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1,fontSize:13 }}>{a}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{b}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 16px",background:"#F0FDF4",borderRadius:10,border:"1px solid #BBF7D0" }}>
                <div style={{ fontSize:12,color:C.success,fontWeight:700,marginBottom:3 }}>📞 입금 문의</div>
                <div style={{ fontSize:13 }}>{BANK_INFO.csPhone} · {BANK_INFO.csEmail}</div>
              </div>
            </div>
          </div>

          <div style={{ display:"flex",gap:10 }}>
            <Btn onClick={()=>setStep("confirm")} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>← 이전</Btn>
            <Btn onClick={()=>{ if(depositor.trim().length<3) return; setStep("done"); }} disabled={depositor.trim().length<3}
              style={{ flex:2,background:depositor.trim().length>=3?selPlan.color:"#CBD5E1",fontSize:15,padding:"12px" }}>
              ✅ 입금 완료 — 확인 신청하기
            </Btn>
          </div>
        </div>}

        {/* ── STEP 4: 완료 ── */}
        {step==="done"&&selPlan&&<div style={{ padding:"40px 32px 40px",textAlign:"center" }}>
          <div style={{ fontSize:72,marginBottom:16 }}>🎉</div>
          <div style={{ fontSize:26,fontWeight:900,marginBottom:8,color:selPlan.color }}>{selPlan.name} 플랜 신청 완료!</div>
          <div style={{ fontSize:15,color:C.muted,marginBottom:28,lineHeight:1.8 }}>
            입금 확인 후 <strong>1시간 이내</strong>에 플랜이 활성화됩니다.<br/>
            평일 09:00~18:00 기준으로 처리됩니다.
          </div>
          <div style={{ display:"inline-flex",flexDirection:"column",gap:0,background:"#F8FAFC",borderRadius:16,padding:"24px 36px",marginBottom:28,minWidth:340,textAlign:"left" }}>
            {[
              {l:"신청 플랜",v:`${selPlan.emoji} ${selPlan.name}`},
              {l:"입금 금액",v:`${monthly.toLocaleString()}원 (${billing==="yearly"?"연간":"월간"})`},
              {l:"입금 계좌",v:`${BANK_INFO.bank} ${BANK_INFO.account}`},
              {l:"입금자명",v:depositor},
              {l:"신청 번호",v:refCode},
            ].map((x,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:13,color:C.muted }}>{x.l}</span>
                <span style={{ fontSize:13,fontWeight:700 }}>{x.v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:13,color:C.muted,marginBottom:24 }}>
            신청번호를 메모해 두시면 문의 시 빠른 처리가 가능합니다.<br/>
            문의: <strong>{BANK_INFO.csPhone}</strong> · <strong>{BANK_INFO.csEmail}</strong>
          </div>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            <Btn onClick={()=>{ onSelect(selPlan.id); onClose(); }} bg={selPlan.color} style={{ padding:"12px 40px",fontSize:15 }}>확인 후 이용 시작</Btn>
          </div>
        </div>}

      </div>
    </div>
  );
}

// ─── MOCK DATA ───────────────────────────────────────────────────
const INIT_CLASSES = [
  { id:1, name:"중3-A", subject:"수학", day:"월·수·금", time:"17:00", room:"3강의실", textbook:"RPM 수학③", totalWeeks:20, currentWeek:8, targetCh:"Ⅳ.함수", color:"#7C3AED" },
  { id:2, name:"고1-B", subject:"수학Ⅰ", day:"화·목",  time:"16:00", room:"2강의실", textbook:"수학의 정석 수Ⅰ", totalWeeks:20, currentWeek:6, targetCh:"Ⅱ.수열",  color:"#0EA5E9" },
  { id:3, name:"고2-C", subject:"수학Ⅱ", day:"월·목",  time:"19:00", room:"1강의실", textbook:"수학의 정석 수Ⅱ", totalWeeks:20, currentWeek:10,targetCh:"Ⅲ.미분", color:"#059669" },
];

const INIT_STUDENTS = [
  { id:1, classId:1, name:"이준서", grade:"중3", avatar:"이", level:"상", phone:"010-1111-2222", parentPhone:"010-3333-4444", absent:1, points:320, badge:["개근왕"], memo:"집중력 좋음" },
  { id:2, classId:1, name:"박서윤", grade:"중3", avatar:"박", level:"중", phone:"010-2222-3333", parentPhone:"010-4444-5555", absent:2, points:180, badge:["숙제왕"], memo:"서술형 약함" },
  { id:3, classId:1, name:"김도윤", grade:"중3", avatar:"김", level:"중", phone:"010-3333-4444", parentPhone:"010-5555-6666", absent:0, points:410, badge:["개근왕","성적왕"], memo:"" },
  { id:4, classId:2, name:"최아영", grade:"고1", avatar:"최", level:"상", phone:"010-4444-5555", parentPhone:"010-6666-7777", absent:0, points:290, badge:["성적왕"], memo:"수능 목표" },
  { id:5, classId:2, name:"정민준", grade:"고1", avatar:"정", level:"하", phone:"010-5555-6666", parentPhone:"010-7777-8888", absent:3, points:90,  badge:[], memo:"기초 부족" },
  { id:6, classId:3, name:"한지우", grade:"고2", avatar:"한", level:"상", phone:"010-6666-7777", parentPhone:"010-8888-9999", absent:1, points:500, badge:["개근왕","숙제왕","성적왕"], memo:"최상위권" },
  { id:7, classId:3, name:"윤서준", grade:"고2", avatar:"윤", level:"중", phone:"010-7777-8888", parentPhone:"010-9999-0000", absent:2, points:210, badge:[], memo:"미분 취약" },
];

const INIT_ATTENDANCE = [
  { id:1, classId:1, date:"2026-03-05", records:{ 1:"출석",2:"결석",3:"출석" } },
  { id:2, classId:2, date:"2026-03-04", records:{ 4:"출석",5:"지각" } },
  { id:3, classId:3, date:"2026-03-03", records:{ 6:"출석",7:"출석" } },
];

const INIT_PROGRESS = [
  { id:1, classId:1, week:8,  date:"2026-03-05", chapter:"§3 이차함수", planned:"이차함수 최대최소", actual:"계획대로 진행, 응용 추가", completionRate:95, note:"전체적으로 이해도 높음" },
  { id:2, classId:2, week:6,  date:"2026-03-04", chapter:"§2 수열",    planned:"등차수열 공식",   actual:"등차수열 OK, 등비까지 진행", completionRate:110, note:"진도 빠름" },
  { id:3, classId:3, week:10, date:"2026-03-03", chapter:"§3 미분",    planned:"미분의 정의",     actual:"미분 정의+접선 방정식",      completionRate:100, note:"" },
];

const INIT_EXAMS = [
  { id:1, classId:1, name:"3월 원내 테스트", date:"2026-03-20", range:"이차함수 전체", type:"원내시험",
    scores:{ 1:88, 2:72, 3:95 }, avgScore:0, passLine:70 },
  { id:2, classId:2, name:"레벨테스트 1차", date:"2026-03-15", range:"수Ⅰ 1~2단원", type:"레벨테스트",
    scores:{ 4:91, 5:54 }, avgScore:0, passLine:60 },
];

const INIT_WRONG = [
  { id:1, classId:1, unit:"이차함수", topic:"최대최소 응용", errorRate:68, students:[1,2], count:4, type:"개념오류" },
  { id:2, classId:1, unit:"이차방정식", topic:"판별식 조건",  errorRate:52, students:[2],   count:3, type:"계산실수" },
  { id:3, classId:2, unit:"등차수열",  topic:"공차 응용문제", errorRate:45, students:[5],   count:2, type:"응용부족" },
  { id:4, classId:3, unit:"미분",      topic:"접선 방정식",   errorRate:71, students:[7],   count:5, type:"개념오류" },
];

const INIT_NOTICES = [
  { id:1, classId:null, target:"전체", type:"공지", title:"3월 시험 일정 안내", content:"3월 20일(금) 원내 테스트가 있습니다. 이차함수 전 범위 대비 바랍니다.", date:"2026-03-04", sent:true },
  { id:2, classId:1,    target:"중3-A", type:"개별", title:"박서윤 결석 안내", content:"안녕하세요, 오늘 박서윤 학생이 결석했습니다. 확인 부탁드립니다.", date:"2026-03-03", sent:true },
];

const INIT_MAKEUP = [
  { id:1, classId:1, studentId:2, originalDate:"2026-03-05", makeupDate:"2026-03-08", reason:"개인 사정 결석", status:"예정", approvedByDirector:true, note:"" },
  { id:2, classId:2, studentId:5, originalDate:"2026-03-04", makeupDate:null,         reason:"지각 (30분)", status:"미정", approvedByDirector:false, note:"원장님 승인 대기" },
];

const INIT_COLLAB = [
  { id:1, studentId:5, fromInstructor:"김수학", toInstructor:"박수학", type:"인수인계", content:"정민준 학생 기초 매우 부족. 사칙연산부터 재점검 필요.", date:"2026-03-01", urgent:true },
  { id:2, studentId:7, fromInstructor:"이수학", toInstructor:"전체",   type:"공동대응", content:"윤서준 미분 개념 반복 필요. 접선 방정식 오답 5회 이상.", date:"2026-03-03", urgent:false },
];

const INIT_PERFORMANCE = [
  { month:"1월", avgScore:75, attendance:92, parentSatisfaction:4.2, newStudents:2, withdrawn:0 },
  { month:"2월", avgScore:78, attendance:88, parentSatisfaction:4.4, newStudents:3, withdrawn:1 },
  { month:"3월", avgScore:82, attendance:94, parentSatisfaction:4.5, newStudents:1, withdrawn:0 },
];

const GOALS = [
  { id:1, title:"담당 반 평균 성적 85점 달성",   current:82, target:85, unit:"점",  due:"2026-06-30", achieved:false },
  { id:2, title:"학부모 만족도 4.5점 이상 유지",  current:4.5,target:4.5,unit:"점", due:"2026-12-31", achieved:true  },
  { id:3, title:"출결률 95% 이상 유지",           current:94, target:95, unit:"%",  due:"2026-06-30", achieved:false },
];

const today = new Date().toISOString().slice(0,10);

// ═══════════════════════════════════════════════════════════════
// 🏛️ 학원 강사 / 과외 선생님 메인 앱
// ═══════════════════════════════════════════════════════════════
function InstructorApp({ mode = 'instructor' }) {
  // 모드별 플랜 적용
  PLANS = getPlans(mode);
  PLAN_FEATURES = getPlanFeatures(mode);
  
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [showSub,  setShowSub]  = useState(false);
  const [tab, setTab]           = useState("dashboard");

  const [classes,   setClasses]   = useState(INIT_CLASSES);
  const [students,  setStudents]  = useState(INIT_STUDENTS);
  const [attendance,setAttendance]= useState(INIT_ATTENDANCE);
  const [progress,  setProgress]  = useState(INIT_PROGRESS);
  const [exams,     setExams]     = useState(INIT_EXAMS);
  const [wrong,     setWrong]     = useState(INIT_WRONG);
  const [notices,   setNotices]   = useState(INIT_NOTICES);
  const [makeup,    setMakeup]    = useState(INIT_MAKEUP);
  const [collab,    setCollab]    = useState(INIT_COLLAB);
  const [performance]             = useState(INIT_PERFORMANCE);
  const [goals,     setGoals]     = useState(GOALS);

  // filters & selection
  const [selClass,  setSelClass]  = useState(null);
  const [attDate,   setAttDate]   = useState(today);
  const [attClass,  setAttClass]  = useState(classes[0]?.id||1);
  const [attRec,    setAttRec]    = useState({});

  // modals
  const [showAddClass,    setShowAddClass]    = useState(false);
  const [showAddStudent,  setShowAddStudent]  = useState(false);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [showAddExam,     setShowAddExam]     = useState(false);
  const [showAddNotice,   setShowAddNotice]   = useState(false);
  const [showAddMakeup,   setShowAddMakeup]   = useState(false);
  const [showAddCollab,   setShowAddCollab]   = useState(false);
  const [showReport,      setShowReport]      = useState(false);
  const [reportClass,     setReportClass]     = useState(null);
  const [reportText,      setReportText]      = useState("");
  const [generating,      setGenerating]      = useState(false);
  const [showPointModal,  setShowPointModal]  = useState(false);
  const [pointTarget,     setPointTarget]     = useState(null);

  // forms
  const [cForm, setCForm] = useState({ name:"",subject:"수학",day:"",time:"",room:"",textbook:"",totalWeeks:20,color:"#7C3AED" });
  const [sForm, setSForm] = useState({ classId:"",name:"",grade:"중3",avatar:"",level:"중",phone:"",parentPhone:"",memo:"" });
  const [pForm, setPForm] = useState({ classId:"",chapter:"",planned:"",actual:"",completionRate:100,note:"" });
  const [eForm, setEForm] = useState({ classId:"",name:"",date:"",range:"",type:"원내시험",passLine:70 });
  const [nForm, setNForm] = useState({ classId:"",target:"전체",type:"공지",title:"",content:"" });
  const [mForm, setMForm] = useState({ classId:"",studentId:"",originalDate:"",makeupDate:"",reason:"",note:"" });
  const [coForm,setCoForm]= useState({ studentId:"",toInstructor:"",type:"인수인계",content:"",urgent:false });

  const plan = PLANS[currentPlan];
  const isOk = (g) => !g || planOrder[currentPlan] >= planOrder[g];
  const stOf = (id) => students.find(s=>s.id===id);
  const clOf = (id) => classes.find(c=>c.id===id);
  const classStudents = (cid) => students.filter(s=>s.classId===cid);

  // 오늘 출결 미입력 반
  const noAttToday = classes.filter(cl=>!attendance.find(a=>a.classId===cl.id&&a.date===today));
  // 미수 보강
  const pendingMakeup = makeup.filter(m=>m.status==="미정"||!m.approvedByDirector);
  // 최근 오답률 높은 단원
  const highWrong = [...wrong].sort((a,b)=>b.errorRate-a.errorRate).slice(0,3);

  // 보고서 생성
  const openReport = (cl) => {
    setReportClass(cl); setReportText(""); setGenerating(true); setShowReport(true);
    const prog = progress.filter(p=>p.classId===cl.id).sort((a,b)=>b.week-a.week)[0];
    const stList = classStudents(cl.id);
    const examList = exams.filter(e=>e.classId===cl.id);
    const avgPts = stList.length ? Math.round(stList.reduce((a,s)=>a+s.points,0)/stList.length) : 0;
    const totalAbsent = stList.reduce((a,s)=>a+s.absent,0);
    const full = `[원장님 보고] ${cl.name} 주간 수업 보고서\n작성일: ${today}\n담당 강사: 김수학\n\n━━━━━━━━━━━━━━━━━━━━\n📋 수업 진도 현황\n━━━━━━━━━━━━━━━━━━━━\n• 담당반: ${cl.name} (${cl.subject})\n• 교재: ${cl.textbook}\n• 현재 진도: ${prog?.chapter||"-"} (${cl.currentWeek}주차/${cl.totalWeeks}주)\n• 진도율: ${Math.round(cl.currentWeek/cl.totalWeeks*100)}%\n• 이번 주 수업: ${prog?.actual||"기록 없음"}\n• 이행도: ${prog?.completionRate||100}%\n\n━━━━━━━━━━━━━━━━━━━━\n👥 학생 현황\n━━━━━━━━━━━━━━━━━━━━\n• 등록 학생: ${stList.length}명\n• 이번 주 결석: ${totalAbsent}건\n• 평균 포인트: ${avgPts}점\n${stList.filter(s=>s.absent>=2).length>0?`⚠️ 결석 다수: ${stList.filter(s=>s.absent>=2).map(s=>s.name).join(", ")}\n`:""}\n━━━━━━━━━━━━━━━━━━━━\n📝 시험 현황\n━━━━━━━━━━━━━━━━━━━━\n${examList.length>0?examList.map(e=>`• ${e.name} (${e.date}): 평균 ${Object.values(e.scores).length>0?Math.round(Object.values(e.scores).reduce((a,b)=>a+b,0)/Object.values(e.scores).length):"-"}점`).join("\n"):"• 예정된 시험 없음"}\n\n━━━━━━━━━━━━━━━━━━━━\n🔍 취약 단원 & 특이사항\n━━━━━━━━━━━━━━━━━━━━\n${wrong.filter(w=>w.classId===cl.id).map(w=>`• ${w.unit} > ${w.topic}: 오답률 ${w.errorRate}%`).join("\n")||"• 특이사항 없음"}\n\n다음 주 수업도 최선을 다하겠습니다.\n감사합니다 🙏`;
    let i=0; const iv=setInterval(()=>{ if(i<=full.length){setReportText(full.slice(0,i));i+=5;}else{clearInterval(iv);setGenerating(false);}},12);
  };

  // 포인트 지급
  const givePoints = (sid, pts, reason) => {
    setStudents(p=>p.map(s=>s.id===sid?{...s,points:s.points+pts}:s));
  };

  // 배지 자동 부여
  const checkBadges = (s) => {
    const badges = [...(s.badge||[])];
    if(s.absent===0 && !badges.includes("개근왕")) badges.push("개근왕");
    if(s.points>=400 && !badges.includes("성적왕")) badges.push("성적왕");
    return badges;
  };

  const nav = [
    { id:"dashboard",   icon:"⊞", label:"대시보드",       group:null },
    { id:"classes",     icon:"🏫", label:"반 관리",        group:null },
    { id:"students",    icon:"👥", label:"학생 관리",      group:null },
    { id:"attendance",  icon:"✅", label:"출결 관리",      group:null },
    { id:"schedule",    icon:"📅", label:"수업 스케줄",    group:null },
    { id:"progress",    icon:"📋", label:"반별 진도 관리", group:"basic",    isNew:true },
    { id:"report",      icon:"📊", label:"원장님 보고",    group:"basic",    isNew:true },
    { id:"notify",      icon:"📣", label:"학부모 알림",    group:"basic",    isNew:true },
    { id:"makeup",      icon:"🔁", label:"보강·결보강",    group:"basic",    isNew:true },
    { id:"exam",        icon:"📝", label:"시험·레벨테스트",group:"standard", isNew:true },
    { id:"wrong",       icon:"🔍", label:"오답·취약단원",  group:"standard", isNew:true },
    { id:"points",      icon:"🏆", label:"포인트·랭킹",   group:"standard", isNew:true },
    { id:"performance", icon:"💼", label:"강사 성과 관리", group:"pro",      isNew:true },
    { id:"collab",      icon:"🤝", label:"동료 강사 협업", group:"pro",      isNew:true },
  ];
  const sections = [
    { label:null,           ids:["dashboard","classes","students","attendance","schedule"] },
    { label:"🌱 베이직",   ids:["progress","report","notify","makeup"] },
    { label:"🚀 스탠다드+", ids:["exam","wrong","points"] },
    { label:"👑 프로+",    ids:["performance","collab"] },
  ];

  return (
    <div style={{ display:"flex",height:"100vh",fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif",background:T.bg,overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:226,background:T.sidebar,display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize:20,fontWeight:900,color:"#fff" }}>{mode==='tutor'?'과외노트':'수업노트'}</div>
          <div style={{ marginTop:8,display:"inline-flex",alignItems:"center",gap:5,background:"rgba(124,58,237,.25)",border:"1px solid rgba(124,58,237,.5)",borderRadius:6,padding:"4px 10px" }}>
            <span style={{ fontSize:11,color:"#C4B5FD",fontWeight:700 }}>{mode==='tutor'?'👨‍🏫 과외 선생님 전용':'🏛️ 학원 강사 전용'}</span>
          </div>
        </div>
        <nav style={{ flex:1,padding:"8px 8px",overflowY:"auto" }}>
          {sections.map((sec,si)=>(
            <div key={si}>
              {sec.label&&<div style={{ fontSize:10,color:"#475569",fontWeight:700,padding:"8px 12px 4px",letterSpacing:.4 }}>{sec.label}</div>}
              {sec.ids.map(id=>{
                const n=nav.find(x=>x.id===id); if(!n) return null;
                const ok=isOk(n.group);
                return (
                  <button key={n.id} onClick={()=>setTab(n.id)} style={{ display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:tab===n.id?"rgba(124,58,237,.2)":"transparent",color:tab===n.id?"#fff":ok?"#94A3B8":"#374151",fontSize:13,fontWeight:tab===n.id?700:400,textAlign:"left",opacity:ok?1:.5 }}>
                    <span>{n.icon}</span>
                    <span style={{ flex:1 }}>{n.label}</span>
                    {n.isNew&&ok&&<span style={{ fontSize:9,background:"#EC4899",color:"#fff",padding:"2px 5px",borderRadius:8,fontWeight:700 }}>NEW</span>}
                    {!ok&&<span style={{ fontSize:10 }}>🔒</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ margin:"0 12px 10px",padding:"12px 14px",background:"linear-gradient(135deg,rgba(124,58,237,.15),rgba(245,158,11,.1))",borderRadius:10,border:"1px solid rgba(124,58,237,.25)",cursor:"pointer" }} onClick={()=>setShowSub(true)}>
          <div style={{ fontSize:10,color:"#94A3B8",marginBottom:3 }}>현재 구독 플랜</div>
          <div style={{ fontSize:13,fontWeight:800,color:"#fff" }}>{plan.emoji} {plan.name} · {plan.price.toLocaleString()}원/월</div>
          <div style={{ fontSize:10,color:"#C4B5FD",marginTop:3 }}>플랜 변경 / 결제 →</div>
        </div>
        <div style={{ padding:"12px 18px",borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize:11,color:"#64748B" }}>{mode==='tutor'?'과외 선생님':'김수학 강사님'}</div>
          <div style={{ fontSize:12,color:"#94A3B8",marginTop:2 }}>파란수학학원 몰입관</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1,overflow:"auto" }}>
        {/* Header */}
        <div style={{ background:C.white,borderBottom:`1px solid ${C.border}`,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10 }}>
          <div>
            <div style={{ fontSize:17,fontWeight:800,color:C.text }}>{nav.find(n=>n.id===tab)?.label}</div>
            <div style={{ fontSize:12,color:C.muted }}>2026년 3월 6일 (금) · {classes.length}반 / 학생 {students.length}명</div>
          </div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end" }}>
            {tab==="classes"   &&<Btn onClick={()=>setShowAddClass(true)} disabled={classes.length>=plan.classes}>+ 반 개설</Btn>}
            {tab==="students"  &&<Btn onClick={()=>setShowAddStudent(true)} disabled={students.length>=plan.students}>+ 학생 등록</Btn>}
            {tab==="progress"  &&<Btn onClick={()=>setShowAddProgress(true)}>+ 진도 기록</Btn>}
            {tab==="exam"      &&<Btn onClick={()=>setShowAddExam(true)}>+ 시험 등록</Btn>}
            {tab==="notify"    &&<Btn onClick={()=>setShowAddNotice(true)}>+ 알림 작성</Btn>}
            {tab==="makeup"    &&<Btn onClick={()=>setShowAddMakeup(true)}>+ 보강 등록</Btn>}
            {tab==="collab"    &&<Btn onClick={()=>setShowAddCollab(true)}>+ 협업 노트</Btn>}
            {tab==="report"    &&<Btn onClick={()=>{ if(classes[0])openReport(classes[0]); }}>📊 보고서 생성</Btn>}
            <Btn onClick={()=>setShowSub(true)} bg="#fff" color={plan.color} style={{ border:`2px solid ${plan.color}` }}>{plan.emoji} {plan.name} · 결제</Btn>
          </div>
        </div>

        <div style={{ padding:22 }}>

          {/* ══ DASHBOARD ══ */}
          {tab==="dashboard"&&<>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="🏫" label="운영 반" value={classes.length+"반"} sub={`학생 ${students.length}명`}/>
              <Stat icon="✅" label="오늘 출결 미입력" value={noAttToday.length+"반"} color={noAttToday.length>0?C.danger:C.success} bg={noAttToday.length>0?"#FEF2F2":"#ECFDF5"} sub={noAttToday.length>0?noAttToday.map(c=>c.name).join(", "):"모두 완료"}/>
              <Stat icon="🔁" label="보강 미처리" value={pendingMakeup.length+"건"} color={pendingMakeup.length>0?C.warning:C.success} bg={pendingMakeup.length>0?"#FFFBEB":"#ECFDF5"}/>
              <Stat icon="🔍" label="고오답 단원" value={highWrong[0]?.topic||"-"} sub={highWrong[0]?`오답률 ${highWrong[0].errorRate}%`:""} color={C.danger} bg="#FEF2F2"/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14 }}>
              <Card style={{ padding:20 }}>
                <H>📋 반별 진도 현황</H>
                {classes.map(cl=>{
                  const prog=Math.round(cl.currentWeek/cl.totalWeeks*100);
                  const stCnt=classStudents(cl.id).length;
                  return <div key={cl.id} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5 }}>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <div style={{ width:10,height:10,borderRadius:"50%",background:cl.color }}/>
                        <span style={{ fontWeight:700 }}>{cl.name}</span>
                        <span style={{ fontSize:11,color:C.muted }}>{cl.subject} · {stCnt}명</span>
                      </div>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <span style={{ fontSize:11,color:C.muted }}>{cl.currentWeek}/{cl.totalWeeks}주</span>
                        <span style={{ fontWeight:700,color:cl.color }}>{prog}%</span>
                      </div>
                    </div>
                    <Bar value={prog} color={cl.color}/>
                    <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>현재: {cl.targetCh}</div>
                  </div>;
                })}
              </Card>
              <Card style={{ padding:20 }}>
                <H>🔔 오늘 할 일</H>
                <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                  {noAttToday.map(cl=><div key={cl.id} style={{ padding:"8px 11px",background:"#FEF2F2",borderRadius:8,fontSize:12 }}>✅ <strong>{cl.name}</strong> 출결 미입력</div>)}
                  {pendingMakeup.map(m=>{const s=stOf(m.studentId);return<div key={m.id} style={{ padding:"8px 11px",background:"#FFFBEB",borderRadius:8,fontSize:12 }}>🔁 <strong>{s?.name}</strong> 보강 {m.approvedByDirector?"날짜 미지정":"원장 승인 대기"}</div>;})}
                  {highWrong.slice(0,2).map(w=><div key={w.id} style={{ padding:"8px 11px",background:T.primaryLight,borderRadius:8,fontSize:12 }}>🔍 <strong>{w.topic}</strong> 오답률 {w.errorRate}%</div>)}
                  {noAttToday.length===0&&pendingMakeup.length===0&&<div style={{ color:C.muted,fontSize:13 }}>✅ 오늘 할 일이 없습니다!</div>}
                </div>
              </Card>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13 }}>
              {classes.map(cl=>{
                const stList=classStudents(cl.id);
                const topSt=[...stList].sort((a,b)=>b.points-a.points)[0];
                const lastAtt=attendance.filter(a=>a.classId===cl.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
                const absentCnt=lastAtt?Object.values(lastAtt.records).filter(v=>v==="결석").length:0;
                return <Card key={cl.id} style={{ padding:18,borderTop:`3px solid ${cl.color}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                    <div><div style={{ fontSize:15,fontWeight:800 }}>{cl.name}</div><div style={{ fontSize:12,color:C.muted }}>{cl.day} {cl.time}</div></div>
                    <Bdg text={`${stList.length}명`} color={cl.color} bg={cl.color+"22"}/>
                  </div>
                  <div style={{ fontSize:12,marginBottom:8 }}>최근 결석: <strong style={{ color:absentCnt>0?C.danger:C.success }}>{absentCnt}명</strong></div>
                  {topSt&&<div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12 }}>
                    <Av char={topSt.avatar} color={cl.color} size={26}/>
                    <div>1위 <strong>{topSt.name}</strong> {topSt.points}pts</div>
                  </div>}
                </Card>;
              })}
            </div>
          </>}

          {/* ══ 반 관리 ══ */}
          {tab==="classes"&&<>
            {classes.length>=plan.classes&&<div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 16px",marginBottom:14,fontSize:13 }}>
              ⚠️ 반 개설 한도({plan.classes}개) 도달. <button onClick={()=>setShowSub(true)} style={{ background:"none",border:"none",color:T.primary,fontWeight:700,cursor:"pointer",fontSize:13 }}>업그레이드 →</button>
            </div>}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
              {classes.map(cl=>{
                const stList=classStudents(cl.id);
                const prog=Math.round(cl.currentWeek/cl.totalWeeks*100);
                const lastProg=progress.filter(p=>p.classId===cl.id).sort((a,b)=>b.week-a.week)[0];
                return <Card key={cl.id} style={{ padding:22,borderTop:`4px solid ${cl.color}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                    <div><div style={{ fontSize:17,fontWeight:800 }}>{cl.name}</div><div style={{ fontSize:12,color:C.muted,marginTop:2 }}>{cl.subject} · {cl.room}</div></div>
                    <div style={{ width:44,height:44,borderRadius:10,background:cl.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🏫</div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
                    {[{l:"수업일",v:cl.day},{l:"시간",v:cl.time},{l:"교재",v:cl.textbook.slice(0,8)+"…"},{l:"학생",v:stList.length+"명"}].map((x,i)=>(
                      <div key={i} style={{ background:T.bg,borderRadius:7,padding:"7px 9px" }}>
                        <div style={{ fontSize:10,color:C.muted }}>{x.l}</div>
                        <div style={{ fontSize:12,fontWeight:600,marginTop:2 }}>{x.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4 }}>
                      <span style={{ color:C.muted }}>진도율</span>
                      <span style={{ fontWeight:700,color:cl.color }}>{cl.currentWeek}/{cl.totalWeeks}주 ({prog}%)</span>
                    </div>
                    <Bar value={prog} color={cl.color}/>
                  </div>
                  {lastProg&&<div style={{ fontSize:12,color:C.muted,background:T.bg,padding:"7px 10px",borderRadius:7,marginBottom:10 }}>📋 최근: {lastProg.chapter} — {lastProg.actual?.slice(0,28)}</div>}
                  <div style={{ display:"flex",gap:7 }}>
                    <button onClick={()=>openReport(cl)} style={{ flex:1,padding:7,background:T.primaryLight,color:T.primary,border:"none",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer" }}>📊 보고서</button>
                    <button onClick={()=>setClasses(p=>p.map(x=>x.id===cl.id?{...x,currentWeek:Math.min(x.currentWeek+1,x.totalWeeks)}:x))} style={{ flex:1,padding:7,background:"#F1F5F9",color:C.text,border:"none",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer" }}>진도+1주</button>
                  </div>
                </Card>;
              })}
            </div>
          </>}

          {/* ══ 학생 일괄 관리 (기능 2) ══ */}
          {tab==="students"&&<>
            {students.length>=plan.students&&<div style={{ background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 16px",marginBottom:14,fontSize:13 }}>
              ⚠️ 학생 등록 한도({plan.students}명) 도달. <button onClick={()=>setShowSub(true)} style={{ background:"none",border:"none",color:T.primary,fontWeight:700,cursor:"pointer",fontSize:13 }}>업그레이드 →</button>
            </div>}
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:14,fontSize:13,color:T.primary }}>
              👥 반 단위 일괄 관리 — 수준별 그룹 분류, 신입생 빠른 등록, 반 이동이 가능합니다.
            </div>
            {/* 반별 탭 */}
            <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
              <button onClick={()=>setSelClass(null)} style={{ padding:"7px 16px",background:selClass===null?T.primary:"#F1F5F9",color:selClass===null?"#fff":C.muted,border:"none",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer" }}>전체 ({students.length}명)</button>
              {classes.map(cl=><button key={cl.id} onClick={()=>setSelClass(cl.id)} style={{ padding:"7px 16px",background:selClass===cl.id?cl.color:"#F1F5F9",color:selClass===cl.id?"#fff":C.muted,border:"none",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer" }}>{cl.name} ({classStudents(cl.id).length}명)</button>)}
            </div>
            {/* 수준별 분포 */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
              {[["상",C.success,"#ECFDF5"],["중",C.warning,"#FFFBEB"],["하",C.danger,"#FEF2F2"]].map(([lv,c,bg])=>{
                const cnt=(selClass?students.filter(s=>s.classId===selClass):students).filter(s=>s.level===lv).length;
                return <div key={lv} style={{ padding:"12px 16px",background:bg,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div><div style={{ fontSize:11,color:C.muted }}>수준 {lv}</div><div style={{ fontSize:22,fontWeight:800,color:c }}>{cnt}명</div></div>
                  <div style={{ fontSize:28 }}>{lv==="상"?"🌟":lv==="중"?"📚":"💪"}</div>
                </div>;
              })}
            </div>
            <Card style={{ padding:0,overflow:"hidden" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"#F8FAFC" }}>
                  {["학생","반","학년","수준","출석","포인트","배지","반 이동"].map(h=><th key={h} style={{ padding:"10px 14px",fontSize:12,color:C.muted,fontWeight:600,textAlign:"left",borderBottom:`1px solid ${C.border}` }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {(selClass?students.filter(s=>s.classId===selClass):students).map(s=>{
                    const cl=clOf(s.classId);
                    return <tr key={s.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",gap:8,alignItems:"center" }}><Av char={s.avatar} color={cl?.color||T.primary} size={30}/><div><div style={{ fontWeight:700,fontSize:13 }}>{s.name}</div><div style={{ fontSize:11,color:C.muted }}>{s.memo||"-"}</div></div></div></td>
                      <td style={{ padding:"10px 14px" }}><Bdg text={cl?.name||"-"} color={cl?.color||T.primary} bg={(cl?.color||T.primary)+"22"}/></td>
                      <td style={{ padding:"10px 14px",fontSize:13 }}>{s.grade}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <select value={s.level} onChange={e=>setStudents(p=>p.map(x=>x.id===s.id?{...x,level:e.target.value}:x))} style={{ padding:"4px 8px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,background:s.level==="상"?"#ECFDF5":s.level==="중"?"#FFFBEB":"#FEF2F2" }}>
                          {["상","중","하"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </td>
                      <td style={{ padding:"10px 14px" }}><Bdg text={`결석 ${s.absent}회`} color={s.absent>=2?C.danger:C.success} bg={s.absent>=2?"#FEF2F2":"#ECFDF5"}/></td>
                      <td style={{ padding:"10px 14px",fontWeight:700,color:T.primary }}>{s.points}pts</td>
                      <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>{(s.badge||[]).map(b=><Bdg key={b} text={b} color="#8B5CF6" bg="#F5F3FF"/>)}</div></td>
                      <td style={{ padding:"10px 14px" }}>
                        <select value={s.classId} onChange={e=>setStudents(p=>p.map(x=>x.id===s.id?{...x,classId:+e.target.value}:x))} style={{ padding:"4px 8px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:12 }}>
                          {classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
                        </select>
                      </td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </Card>
          </>}

          {/* ══ 출결 관리 ══ */}
          {tab==="attendance"&&<>
            <div style={{ display:"flex",gap:12,marginBottom:16,flexWrap:"wrap" }}>
              <div><Lbl>반 선택</Lbl>
                <select value={attClass} onChange={e=>setAttClass(+e.target.value)} style={{ ...sel,width:160 }}>
                  {classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
                </select>
              </div>
              <div><Lbl>날짜</Lbl><input type="date" value={attDate} onChange={e=>setAttDate(e.target.value)} style={{ ...inp,width:160 }}/></div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 2fr",gap:14 }}>
              <Card style={{ padding:20 }}>
                <H>✅ 오늘 출결 입력</H>
                {classStudents(attClass).map(s=>(
                  <div key={s.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ display:"flex",gap:9,alignItems:"center" }}>
                      <Av char={s.avatar} color={clOf(attClass)?.color||T.primary} size={30}/>
                      <div style={{ fontWeight:600,fontSize:13 }}>{s.name}</div>
                    </div>
                    <div style={{ display:"flex",gap:5 }}>
                      {["출석","지각","결석","조퇴"].map(v=>(
                        <button key={v} onClick={()=>setAttRec(p=>({...p,[s.id]:v}))} style={{ padding:"4px 9px",background:attRec[s.id]===v?v==="출석"?C.success:v==="결석"?C.danger:C.warning:C.border,color:attRec[s.id]===v?"#fff":C.muted,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <Btn onClick={()=>{setAttendance(p=>[...p,{id:Date.now(),classId:attClass,date:attDate,records:{...attRec}}]);setAttRec({});}} style={{ width:"100%",marginTop:14 }}>💾 출결 저장</Btn>
              </Card>
              <Card style={{ padding:20 }}>
                <H>📊 출결 이력</H>
                {attendance.filter(a=>a.classId===attClass).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(a=>{
                  const absent=Object.values(a.records).filter(v=>v==="결석").length;
                  const late=Object.values(a.records).filter(v=>v==="지각").length;
                  const total=Object.values(a.records).length;
                  return <div key={a.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13,color:C.muted }}>{a.date}</span>
                    <div style={{ display:"flex",gap:8 }}>
                      <Bdg text={`출석 ${total-absent-late}명`} color={C.success} bg="#ECFDF5"/>
                      {late>0&&<Bdg text={`지각 ${late}명`} color={C.warning} bg="#FFFBEB"/>}
                      {absent>0&&<Bdg text={`결석 ${absent}명`} color={C.danger} bg="#FEF2F2"/>}
                    </div>
                  </div>;
                })}
              </Card>
            </div>
          </>}

          {/* ══ 스케줄 ══ */}
          {tab==="schedule"&&<Card style={{ padding:22 }}>
            <H>📅 주간 수업 스케줄</H>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12 }}>
              {["월","화","수","목","금"].map(day=>(
                <div key={day}>
                  <div style={{ fontSize:13,fontWeight:700,textAlign:"center",padding:"7px",background:T.primaryLight,borderRadius:8,marginBottom:8,color:T.primary }}>{day}요일</div>
                  {classes.filter(cl=>cl.day.includes(day)).map(cl=>(
                    <div key={cl.id} style={{ background:cl.color+"15",border:`1px solid ${cl.color}44`,borderRadius:8,padding:"10px 12px",marginBottom:6 }}>
                      <div style={{ fontSize:12,fontWeight:700,color:cl.color }}>{cl.name}</div>
                      <div style={{ fontSize:11,color:C.muted }}>{cl.time} · {cl.room}</div>
                      <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{classStudents(cl.id).length}명</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>}

          {/* ══ 1. 반별 진도 관리 ══ */}
          {tab==="progress"&&<PlanGate feature="progress" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              📋 반별 주차 진도를 기록하고, 반 간 편차를 관리합니다. 계획 대비 이행률을 자동으로 분석합니다.
            </div>
            {/* 진도 편차 경고 */}
            {(() => {
              const rates=classes.map(cl=>cl.currentWeek/cl.totalWeeks*100);
              const max=Math.max(...rates), min=Math.min(...rates);
              if(max-min>15) return <div style={{ padding:"11px 15px",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,marginBottom:14,fontSize:13 }}>
                ⚠️ 반 간 진도 편차 <strong>{Math.round(max-min)}%</strong> 발생 — {classes.find(c=>c.currentWeek/c.totalWeeks*100===min)?.name} 반이 가장 뒤처져 있습니다.
              </div>;
              return null;
            })()}
            <div style={{ display:"grid",gridTemplateColumns:"1fr",gap:14 }}>
              {classes.map(cl=>{
                const clProg=progress.filter(p=>p.classId===cl.id).sort((a,b)=>b.week-a.week);
                const prog=Math.round(cl.currentWeek/cl.totalWeeks*100);
                const avgComp=clProg.length?Math.round(clProg.reduce((a,p)=>a+(p.completionRate||100),0)/clProg.length):100;
                return <Card key={cl.id} style={{ padding:22 }}>
                  <div style={{ display:"flex",gap:16,marginBottom:16 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                        <div style={{ fontSize:16,fontWeight:800 }}>{cl.name} <span style={{ fontSize:13,color:C.muted,fontWeight:400 }}>— {cl.subject}</span></div>
                        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                          <Bdg text={`${cl.currentWeek}/${cl.totalWeeks}주`} color={T.primary} bg={T.primaryLight}/>
                          <Bdg text={`평균 이행률 ${avgComp}%`} color={avgComp>=90?C.success:C.warning} bg={avgComp>=90?"#ECFDF5":"#FFFBEB"}/>
                        </div>
                      </div>
                      <div style={{ marginBottom:8 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4 }}><span style={{ color:C.muted }}>전체 진도율</span><span style={{ fontWeight:700,color:cl.color }}>{prog}%</span></div>
                        <Bar value={prog} color={cl.color} height={10}/>
                      </div>
                      <div style={{ fontSize:12,color:C.muted }}>교재: {cl.textbook} · 현재: {cl.targetCh}</div>
                    </div>
                  </div>
                  {/* 주차별 이력 */}
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {clProg.slice(0,4).map(p=>(
                      <div key={p.id} style={{ display:"grid",gridTemplateColumns:"60px 1fr 1fr auto",gap:10,padding:"9px 12px",background:T.bg,borderRadius:8,fontSize:12 }}>
                        <div style={{ fontWeight:700,color:T.primary }}>{p.week}주차</div>
                        <div><div style={{ color:C.muted,fontSize:10 }}>계획</div><div>{p.planned}</div></div>
                        <div><div style={{ color:C.muted,fontSize:10 }}>실행</div><div>{p.actual}</div></div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:10,color:C.muted }}>이행률</div>
                          <div style={{ fontWeight:700,color:p.completionRate>=100?C.success:C.warning }}>{p.completionRate}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:10 }}>
                    <button onClick={()=>setShowAddProgress(true)} style={{ padding:"7px 14px",background:T.primaryLight,color:T.primary,border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer" }}>+ 진도 기록</button>
                    <button onClick={()=>setClasses(p=>p.map(x=>x.id===cl.id?{...x,currentWeek:Math.min(x.currentWeek+1,x.totalWeeks)}:x))} style={{ padding:"7px 14px",background:"#F1F5F9",color:C.muted,border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer" }}>진도 +1주</button>
                  </div>
                </Card>;
              })}
            </div>
          </PlanGate>}

          {/* ══ 3. 원장님 보고 자동화 ══ */}
          {tab==="report"&&<PlanGate feature="report" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              📊 반별 진도·출결·시험 결과를 자동으로 취합해 원장님 보고서를 원클릭으로 생성합니다.
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16 }}>
              {classes.map(cl=>{
                const stList=classStudents(cl.id);
                const prog=Math.round(cl.currentWeek/cl.totalWeeks*100);
                const lastAtt=attendance.filter(a=>a.classId===cl.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
                const absRate=lastAtt?Math.round(Object.values(lastAtt.records).filter(v=>v==="결석").length/Math.max(stList.length,1)*100):0;
                const examList=exams.filter(e=>e.classId===cl.id);
                return <Card key={cl.id} style={{ padding:20,borderTop:`3px solid ${cl.color}` }}>
                  <div style={{ fontSize:15,fontWeight:800,marginBottom:14 }}>{cl.name}</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
                    {[{l:"진도율",v:`${cl.currentWeek}주차 (${prog}%)`,c:T.primary},{l:"학생 수",v:`${stList.length}명`,c:C.text},{l:"최근 결석률",v:`${absRate}%`,c:absRate>20?C.danger:C.success},{l:"시험 수",v:`${examList.length}건`,c:C.text}].map((x,i)=>(
                      <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,borderBottom:`1px solid ${C.border}`,paddingBottom:6 }}>
                        <span style={{ color:C.muted }}>{x.l}</span><span style={{ fontWeight:700,color:x.c }}>{x.v}</span>
                      </div>
                    ))}
                  </div>
                  <Btn onClick={()=>openReport(cl)} style={{ width:"100%",padding:9,fontSize:12 }}>📊 보고서 생성</Btn>
                </Card>;
              })}
            </div>
            {/* 월간 성과 요약 */}
            <Card style={{ padding:22 }}>
              <H>📈 월간 강사 성과 요약</H>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",minWidth:600 }}>
                  <thead><tr style={{ background:"#F8FAFC" }}>
                    {["월","평균 성적","출석률","학부모 만족도","신규","퇴원"].map(h=><th key={h} style={{ padding:"9px 14px",fontSize:12,color:C.muted,fontWeight:600,textAlign:"center",borderBottom:`1px solid ${C.border}` }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{performance.map((p,i)=>(
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}`,background:i%2===0?"#fff":"#FAFAFA" }}>
                      <td style={{ padding:"10px 14px",fontWeight:700,textAlign:"center" }}>{p.month}</td>
                      <td style={{ padding:"10px 14px",textAlign:"center",fontWeight:700,color:p.avgScore>=80?C.success:C.warning }}>{p.avgScore}점</td>
                      <td style={{ padding:"10px 14px",textAlign:"center" }}>{p.attendance}%</td>
                      <td style={{ padding:"10px 14px",textAlign:"center" }}><Stars v={Math.round(p.parentSatisfaction)} /></td>
                      <td style={{ padding:"10px 14px",textAlign:"center",color:C.success,fontWeight:700 }}>+{p.newStudents}</td>
                      <td style={{ padding:"10px 14px",textAlign:"center",color:p.withdrawn>0?C.danger:C.muted,fontWeight:700 }}>{p.withdrawn>0?`-${p.withdrawn}`:"—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>
          </PlanGate>}

          {/* ══ 6. 학부모 알림 ══ */}
          {tab==="notify"&&<PlanGate feature="notify" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="📣" label="전체 발송" value={notices.length+"건"}/>
              <Stat icon="📢" label="공지" value={notices.filter(n=>n.type==="공지").length+"건"} color={T.primary} bg={T.primaryLight}/>
              <Stat icon="💌" label="개별 알림" value={notices.filter(n=>n.type==="개별").length+"건"} color={C.info} bg="#EFF6FF"/>
            </div>
            {/* 빠른 템플릿 */}
            <Card style={{ padding:20,marginBottom:16 }}>
              <H>⚡ 빠른 발송 템플릿</H>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
                {[
                  { icon:"📅",title:"시험 일정 안내", content:"이번 주 {반이름} 원내 테스트가 있습니다. {날짜} {범위} 대비 바랍니다.", tag:"시험" },
                  { icon:"🚫",title:"휴강 안내",      content:"{날짜} 공휴일로 인해 수업이 없습니다. 보강 일정은 별도 안내드립니다.", tag:"휴강" },
                  { icon:"📊",title:"성적표 발송",    content:"{학생이름} 학생의 이번 테스트 결과를 안내드립니다. 점수: {점수}점", tag:"성적" },
                  { icon:"⚠️",title:"결석 알림",      content:"{학생이름} 학생이 오늘 수업에 결석했습니다. 연락 부탁드립니다.", tag:"출결" },
                ].map((tpl,i)=>(
                  <div key={i} style={{ border:`1px solid ${C.border}`,borderRadius:10,padding:14,cursor:"pointer" }} onClick={()=>{setNForm({...nForm,title:tpl.title,content:tpl.content});setShowAddNotice(true);}}>
                    <div style={{ fontSize:24,marginBottom:6 }}>{tpl.icon}</div>
                    <div style={{ fontSize:13,fontWeight:700,marginBottom:4 }}>{tpl.title}</div>
                    <Bdg text={tpl.tag} color={T.primary} bg={T.primaryLight}/>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ padding:20 }}>
              <H>📋 발송 이력</H>
              {notices.map(n=>(
                <div key={n.id} style={{ padding:"12px 14px",background:"#F8FAFC",borderRadius:9,marginBottom:8,border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                    <div style={{ fontWeight:700,fontSize:13 }}>{n.title}</div>
                    <div style={{ display:"flex",gap:6 }}>
                      <Bdg text={n.target} color={T.primary} bg={T.primaryLight}/>
                      <Bdg text={n.type} color={n.type==="공지"?C.info:C.warning} bg={n.type==="공지"?"#EFF6FF":"#FFFBEB"}/>
                      {n.sent&&<Bdg text="✓ 발송완료" color={C.success} bg="#ECFDF5"/>}
                    </div>
                  </div>
                  <div style={{ fontSize:12,color:C.muted,marginBottom:4 }}>{n.content.slice(0,60)}...</div>
                  <div style={{ fontSize:11,color:C.muted }}>{n.date}</div>
                </div>
              ))}
            </Card>
          </PlanGate>}

          {/* ══ 9. 보강·결보강 관리 ══ */}
          {tab==="makeup"&&<PlanGate feature="makeup" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="🔁" label="전체 보강" value={makeup.length+"건"}/>
              <Stat icon="⏳" label="미처리" value={makeup.filter(m=>m.status==="미정"||!m.approvedByDirector).length+"건"} color={C.warning} bg="#FFFBEB"/>
              <Stat icon="✅" label="완료" value={makeup.filter(m=>m.status==="완료").length+"건"} color={C.success} bg="#ECFDF5"/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <Card style={{ padding:20 }}>
                <H>🔁 보강 목록</H>
                {makeup.map(m=>{
                  const s=stOf(m.studentId); const cl=clOf(m.classId);
                  return <div key={m.id} style={{ padding:"13px 14px",borderRadius:10,marginBottom:8,border:`2px solid ${m.approvedByDirector?C.border:"#FDE68A"}`,background:m.approvedByDirector?"#F8FAFC":"#FFFBEB" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <Av char={s?.avatar||"?"} color={cl?.color||T.primary} size={30}/>
                        <div><div style={{ fontWeight:700,fontSize:13 }}>{s?.name}</div><div style={{ fontSize:11,color:C.muted }}>{cl?.name}</div></div>
                      </div>
                      <div style={{ display:"flex",gap:5,flexDirection:"column",alignItems:"flex-end" }}>
                        <Bdg text={m.status} color={m.status==="완료"?C.success:m.status==="예정"?C.info:C.warning} bg={m.status==="완료"?"#ECFDF5":m.status==="예정"?"#EFF6FF":"#FFFBEB"}/>
                        {!m.approvedByDirector&&<Bdg text="원장 승인 대기" color={C.warning} bg="#FFFBEB"/>}
                      </div>
                    </div>
                    <div style={{ fontSize:12,color:C.muted,marginBottom:6 }}>
                      원래: {m.originalDate} → 보강: {m.makeupDate||"미정"}<br/>사유: {m.reason}
                    </div>
                    <div style={{ display:"flex",gap:6 }}>
                      {!m.approvedByDirector&&<button onClick={()=>setMakeup(p=>p.map(x=>x.id===m.id?{...x,approvedByDirector:true}:x))} style={{ padding:"5px 10px",background:T.primaryLight,color:T.primary,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>원장 승인</button>}
                      {m.status!=="완료"&&<button onClick={()=>setMakeup(p=>p.map(x=>x.id===m.id?{...x,status:"완료"}:x))} style={{ padding:"5px 10px",background:"#ECFDF5",color:C.success,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>완료 처리</button>}
                    </div>
                  </div>;
                })}
              </Card>
              <Card style={{ padding:20 }}>
                <H>📢 보강 자동 안내 메시지</H>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {makeup.filter(m=>m.makeupDate).map(m=>{
                    const s=stOf(m.studentId); const cl=clOf(m.classId);
                    const msg=`안녕하세요, ${s?.name} 학부모님!\n\n${m.originalDate} 결석으로 인한 보강 수업이 ${m.makeupDate}에 진행됩니다.\n\n반: ${cl?.name}\n시간: ${cl?.time}\n\n참석 부탁드립니다 🙏`;
                    return <div key={m.id} style={{ border:`1px solid ${C.border}`,borderRadius:9,padding:13 }}>
                      <div style={{ fontWeight:600,fontSize:13,marginBottom:6 }}>{s?.name} 보강 안내</div>
                      <div style={{ background:"#F8FAFC",borderRadius:7,padding:"9px 11px",fontSize:12,lineHeight:1.8,whiteSpace:"pre-line",color:C.text,marginBottom:8 }}>{msg}</div>
                      <button onClick={()=>navigator.clipboard?.writeText(msg)} style={{ padding:"5px 12px",background:T.primaryLight,color:T.primary,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>📋 복사</button>
                    </div>;
                  })}
                </div>
              </Card>
            </div>
          </PlanGate>}

          {/* ══ 4. 시험·레벨테스트 관리 ══ */}
          {tab==="exam"&&<PlanGate feature="exam" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              📝 원내 시험과 레벨테스트 결과를 관리합니다. 성적 분포, 합격선, 반 배정 추천을 자동으로 분석합니다.
            </div>
            {exams.map(e=>{
              const cl=clOf(e.classId);
              const scores=Object.values(e.scores);
              const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
              const pass=scores.filter(s=>s>=e.passLine).length;
              const fail=scores.filter(s=>s<e.passLine).length;
              const max=scores.length?Math.max(...scores):0;
              const min=scores.length?Math.min(...scores):0;
              const dist={ "90~100":scores.filter(s=>s>=90).length,"80~89":scores.filter(s=>s>=80&&s<90).length,"70~79":scores.filter(s=>s>=70&&s<80).length,"60~69":scores.filter(s=>s>=60&&s<70).length,"~59":scores.filter(s=>s<60).length };
              return <Card key={e.id} style={{ padding:24,marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:16,fontWeight:800 }}>{e.name}</div>
                    <div style={{ fontSize:12,color:C.muted,marginTop:3 }}>{cl?.name} · {e.subject||cl?.subject} · {e.date}</div>
                    <div style={{ display:"flex",gap:7,marginTop:7 }}>
                      <Bdg text={e.type} color={e.type==="레벨테스트"?"#8B5CF6":T.primary} bg={e.type==="레벨테스트"?"#F5F3FF":T.primaryLight}/>
                      <Bdg text={`범위: ${e.range}`} color={C.muted} bg="#F1F5F9"/>
                      <Bdg text={`합격선 ${e.passLine}점`} color={C.warning} bg="#FFFBEB"/>
                    </div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:220 }}>
                    {[{l:"평균",v:avg+"점",c:avg>=80?C.success:C.warning},{l:"합격",v:pass+"명",c:C.success},{l:"불합격",v:fail+"명",c:fail>0?C.danger:C.muted},{l:"최고/최저",v:`${max}/${min}`,c:C.text}].map((x,i)=>(
                      <div key={i} style={{ textAlign:"center",background:T.bg,borderRadius:8,padding:"8px" }}>
                        <div style={{ fontSize:10,color:C.muted }}>{x.l}</div>
                        <div style={{ fontSize:15,fontWeight:800,color:x.c,marginTop:2 }}>{x.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 점수 분포 */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:C.muted,marginBottom:8 }}>점수 분포</div>
                  <div style={{ display:"flex",gap:6,height:80,alignItems:"flex-end" }}>
                    {Object.entries(dist).map(([range,cnt])=>(
                      <div key={range} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                        <div style={{ fontSize:11,fontWeight:700,color:T.primary }}>{cnt}</div>
                        <div style={{ width:"100%",height:Math.max(cnt*18,4),background:range==="90~100"?C.success:range==="80~89"?T.primary:range==="70~79"?C.warning:range==="60~69"?"#FB923C":C.danger,borderRadius:"3px 3px 0 0",opacity:.85 }}/>
                        <div style={{ fontSize:9,color:C.muted,textAlign:"center" }}>{range}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 학생별 점수 */}
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {classStudents(e.classId).map(s=>{
                    const score=e.scores[s.id]||null;
                    return <div key={s.id} style={{ display:"flex",gap:8,alignItems:"center",padding:"8px 12px",background:score===null?"#F8FAFC":score>=e.passLine?"#ECFDF5":"#FEF2F2",borderRadius:9,border:`1px solid ${score===null?C.border:score>=e.passLine?"#BBF7D0":"#FECACA"}` }}>
                      <Av char={s.avatar} color={cl?.color||T.primary} size={26}/>
                      <div>
                        <div style={{ fontSize:12,fontWeight:600 }}>{s.name}</div>
                        {score!==null?<div style={{ fontSize:14,fontWeight:800,color:score>=e.passLine?C.success:C.danger }}>{score}점</div>:<input type="number" placeholder="점수" style={{ width:56,padding:"3px 6px",border:`1px solid ${C.border}`,borderRadius:5,fontSize:12 }} onBlur={v=>{ if(v.target.value) setExams(p=>p.map(x=>x.id===e.id?{...x,scores:{...x.scores,[s.id]:+v.target.value}}:x));}}/>}
                      </div>
                    </div>;
                  })}
                </div>
                {e.type==="레벨테스트"&&<div style={{ marginTop:12,padding:"11px 14px",background:"#F5F3FF",borderRadius:9 }}>
                  <div style={{ fontSize:12,fontWeight:700,color:"#8B5CF6",marginBottom:6 }}>🎯 레벨 배정 추천</div>
                  <div style={{ display:"flex",gap:10 }}>
                    {classStudents(e.classId).filter(s=>e.scores[s.id]!==undefined).map(s=>{
                      const sc=e.scores[s.id];
                      const rec=sc>=85?"상급반 이동 추천":sc>=65?"현재 반 유지":"기초반 이동 추천";
                      return <Bdg key={s.id} text={`${s.name}: ${rec}`} color={sc>=85?C.success:sc>=65?T.primary:C.danger} bg={sc>=85?"#ECFDF5":sc>=65?T.primaryLight:"#FEF2F2"}/>;
                    })}
                  </div>
                </div>}
              </Card>;
            })}
          </PlanGate>}

          {/* ══ 5. 오답·취약단원 분석 ══ */}
          {tab==="wrong"&&<PlanGate feature="wrong" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:"#FFFBEB",borderRadius:8,marginBottom:16,fontSize:13,color:C.warning }}>
              🔍 반 전체 오답 패턴을 자동 집계합니다. 반복 실수 유형을 감지하고 집중 수업 스케줄을 추천합니다.
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="📊" label="분석된 오답 단원" value={wrong.length+"개"} color={C.danger} bg="#FEF2F2"/>
              <Stat icon="⚠️" label="70% 이상 고오답" value={wrong.filter(w=>w.errorRate>=70).length+"개"} color={C.danger} bg="#FEF2F2"/>
              <Stat icon="🔄" label="반복 실수" value={wrong.filter(w=>w.type==="계산실수").length+"건"} color={C.warning} bg="#FFFBEB"/>
            </div>
            {classes.map(cl=>{
              const clWrong=wrong.filter(w=>w.classId===cl.id).sort((a,b)=>b.errorRate-a.errorRate);
              if(!clWrong.length) return null;
              return <Card key={cl.id} style={{ padding:22,marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
                  <div style={{ fontSize:15,fontWeight:800 }}>{cl.name} — 오답 분석</div>
                  <Bdg text={`${clWrong.length}개 단원 요주의`} color={C.danger} bg="#FEF2F2"/>
                </div>
                {clWrong.map(w=>{
                  const flagStudents=w.students.map(id=>stOf(id)).filter(Boolean);
                  return <div key={w.id} style={{ marginBottom:12,padding:"13px 16px",background:w.errorRate>=70?"#FEF2F2":"#FFFBEB",borderRadius:10,border:`1px solid ${w.errorRate>=70?"#FECACA":"#FDE68A"}` }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                      <div>
                        <span style={{ fontWeight:700,fontSize:14 }}>{w.unit}</span>
                        <span style={{ color:C.muted,fontSize:13,marginLeft:8 }}>&gt; {w.topic}</span>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        <Bdg text={w.type} color={w.type==="개념오류"?C.danger:C.warning} bg={w.type==="개념오류"?"#FEF2F2":"#FFFBEB"}/>
                        <span style={{ fontSize:18,fontWeight:900,color:w.errorRate>=70?C.danger:C.warning }}>{w.errorRate}%</span>
                      </div>
                    </div>
                    <div style={{ marginBottom:8 }}>
                      <Bar value={w.errorRate} color={w.errorRate>=70?C.danger:C.warning}/>
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                        {flagStudents.map(s=><Bdg key={s.id} text={s.name} color={C.danger} bg="#FEF2F2"/>)}
                      </div>
                      <div style={{ padding:"7px 12px",background:w.errorRate>=70?"#EF444420":"#F59E0B20",borderRadius:7,fontSize:12,fontWeight:600,color:w.errorRate>=70?C.danger:C.warning }}>
                        {w.errorRate>=70?"🚨 긴급 재수업 필요":"⚠️ 추가 연습 권장"}
                      </div>
                    </div>
                    <div style={{ marginTop:8,padding:"8px 11px",background:"#fff",borderRadius:7,fontSize:12 }}>
                      💡 추천: {w.type==="개념오류"?`${w.topic} 개념 재설명 + 기본문제 5개 추가`:`${w.topic} 계산 속도 훈련 + 오답노트 작성`}
                    </div>
                  </div>;
                })}
              </Card>;
            })}
          </PlanGate>}

          {/* ══ 7. 포인트·랭킹 시스템 ══ */}
          {tab==="points"&&<PlanGate feature="points" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              🏆 출석·숙제·성적 향상으로 포인트를 적립합니다. 반별 랭킹보드와 배지로 학생 동기를 부여하세요.
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
              {/* 반별 포인트 탭 */}
              {classes.map(cl=>{
                const stList=[...classStudents(cl.id)].sort((a,b)=>b.points-a.points);
                const topThree=stList.slice(0,3);
                return <Card key={cl.id} style={{ padding:22 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
                    <div style={{ fontSize:15,fontWeight:800 }}>{cl.name} 랭킹보드 🏆</div>
                    <Bdg text={`총 ${stList.reduce((a,s)=>a+s.points,0)}pts`} color={T.primary} bg={T.primaryLight}/>
                  </div>
                  {/* 포디움 */}
                  {topThree.length>=3&&<div style={{ display:"flex",justifyContent:"center",alignItems:"flex-end",gap:12,marginBottom:18,height:100 }}>
                    {[topThree[1],topThree[0],topThree[2]].map((s,i)=>{
                      const ranks=[2,1,3]; const h=[60,90,50]; const medals=["🥈","🥇","🥉"]; const bg=["#94A3B8","#F59E0B","#92400E"];
                      return s?<div key={s.id} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:20 }}>{medals[i]}</div>
                        <Av char={s.avatar} color={cl.color} size={32}/>
                        <div style={{ fontSize:11,fontWeight:700,marginTop:3 }}>{s.name}</div>
                        <div style={{ fontSize:11,color:C.muted }}>{s.points}pts</div>
                        <div style={{ width:44,height:h[i],background:bg[i],borderRadius:"4px 4px 0 0",marginTop:4 }}/>
                      </div>:null;
                    })}
                  </div>}
                  {/* 전체 순위 */}
                  {stList.map((s,i)=>(
                    <div key={s.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:22,fontWeight:800,fontSize:14,color:i===0?"#F59E0B":i===1?"#94A3B8":i===2?"#92400E":C.muted }}>{i+1}</div>
                      <Av char={s.avatar} color={cl.color} size={30}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13,fontWeight:600 }}>{s.name}</div>
                        <div style={{ display:"flex",gap:3,marginTop:2 }}>{(s.badge||[]).map(b=><Bdg key={b} text={b} color="#8B5CF6" bg="#F5F3FF"/>)}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:16,fontWeight:800,color:T.primary }}>{s.points}</div>
                        <div style={{ fontSize:10,color:C.muted }}>pts</div>
                      </div>
                      <button onClick={()=>{setPointTarget(s);setShowPointModal(true);}} style={{ padding:"4px 10px",background:T.primaryLight,color:T.primary,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>+포인트</button>
                    </div>
                  ))}
                </Card>;
              })}
            </div>
            {/* 배지 현황 */}
            <Card style={{ padding:22 }}>
              <H>🏅 배지 현황</H>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
                {[["개근왕","🏃",students.filter(s=>s.badge?.includes("개근왕")).length],["숙제왕","📝",students.filter(s=>s.badge?.includes("숙제왕")).length],["성적왕","🌟",students.filter(s=>s.badge?.includes("성적왕")).length]].map(([b,e,cnt])=>(
                  <div key={b} style={{ padding:"16px",background:T.bg,borderRadius:10,textAlign:"center" }}>
                    <div style={{ fontSize:32,marginBottom:6 }}>{e}</div>
                    <div style={{ fontSize:14,fontWeight:800 }}>{b}</div>
                    <div style={{ fontSize:22,fontWeight:900,color:T.primary,marginTop:4 }}>{cnt}명</div>
                    <div style={{ display:"flex",gap:6,marginTop:8,flexWrap:"wrap",justifyContent:"center" }}>
                      {students.filter(s=>s.badge?.includes(b)).map(s=><Bdg key={s.id} text={s.name} color={T.primary} bg={T.primaryLight}/>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14,padding:"11px 14px",background:T.bg,borderRadius:9,fontSize:12,color:C.muted }}>
                💡 배지 자동 부여 조건: 개근왕 (결석 0회) · 숙제왕 (포인트 누적) · 성적왕 (포인트 400점 이상)
              </div>
            </Card>
          </PlanGate>}

          {/* ══ 8. 강사 성과 & 자기계발 ══ */}
          {tab==="performance"&&<PlanGate feature="performance" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              💼 나의 강사 실적을 수치로 확인하고, 목표를 설정하여 원장님께 가치를 증명하세요.
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="📈" label="이번달 평균 성적" value="82점" sub="전달 대비 +4점" color={C.success} bg="#ECFDF5"/>
              <Stat icon="✅" label="출석률" value="94%" sub="목표 95% 진행중" color={T.primary} bg={T.primaryLight}/>
              <Stat icon="⭐" label="학부모 만족도" value="4.5점" color={C.warning} bg="#FFFBEB"/>
              <Stat icon="👥" label="담당 학생 수" value={students.length+"명"} sub={`${classes.length}개 반`}/>
            </div>
            {/* 성과 추이 차트 */}
            <Card style={{ padding:22,marginBottom:14 }}>
              <H>📊 월별 성과 추이</H>
              <div style={{ display:"flex",gap:16,alignItems:"flex-end",height:120,marginBottom:8 }}>
                {performance.map((p,i)=>(
                  <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:T.primary }}>{p.avgScore}</div>
                    <div style={{ width:"100%",height:p.avgScore/1.2,background:`linear-gradient(180deg,${T.primary},${T.primaryLight})`,borderRadius:"4px 4px 0 0",position:"relative" }}>
                      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:`${p.attendance}%`,background:"rgba(255,255,255,.2)",borderRadius:"4px 4px 0 0" }}/>
                    </div>
                    <div style={{ fontSize:12,color:C.muted }}>{p.month}</div>
                    <Stars v={Math.round(p.parentSatisfaction)}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:14,fontSize:11,color:C.muted }}>
                <span>■ 막대: 평균 성적점</span><span>★: 학부모 만족도</span>
              </div>
            </Card>
            {/* 자기계발 목표 */}
            <Card style={{ padding:22 }}>
              <H>🎯 자기계발 목표 설정</H>
              {goals.map(g=>{
                const pct=Math.min(Math.round(g.current/g.target*100),100);
                return <div key={g.id} style={{ padding:"14px 16px",background:g.achieved?"#ECFDF5":T.bg,borderRadius:10,marginBottom:10,border:`1px solid ${g.achieved?"#BBF7D0":C.border}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                    <div style={{ fontWeight:700,fontSize:13 }}>{g.title}</div>
                    <div style={{ display:"flex",gap:6 }}>
                      <Bdg text={`마감 ${g.due}`} color={C.muted} bg="#F1F5F9"/>
                      {g.achieved?<Bdg text="🎉 달성!" color={C.success} bg="#ECFDF5"/>:<Bdg text={`${pct}%`} color={T.primary} bg={T.primaryLight}/>}
                    </div>
                  </div>
                  <div style={{ marginBottom:6 }}>
                    <Bar value={pct} color={g.achieved?C.success:T.primary}/>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted }}>
                    <span>현재: <strong style={{ color:T.primary }}>{g.current}{g.unit}</strong></span>
                    <span>목표: <strong>{g.target}{g.unit}</strong></span>
                  </div>
                  {!g.achieved&&<button onClick={()=>setGoals(p=>p.map(x=>x.id===g.id?{...x,achieved:true}:x))} style={{ marginTop:8,padding:"5px 12px",background:T.primaryLight,color:T.primary,border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>달성 완료</button>}
                </div>;
              })}
              <Btn style={{ width:"100%",marginTop:4 }} onClick={()=>setGoals(p=>[...p,{id:Date.now(),title:"새 목표",current:0,target:100,unit:"%",due:"2026-12-31",achieved:false}])}>+ 목표 추가</Btn>
            </Card>
          </PlanGate>}

          {/* ══ 10. 동료 강사 협업 ══ */}
          {tab==="collab"&&<PlanGate feature="collab" current={currentPlan} onUpgrade={()=>setShowSub(true)}>
            <div style={{ padding:"10px 14px",background:T.primaryLight,borderRadius:8,marginBottom:16,fontSize:13,color:T.primary }}>
              🤝 같은 학생을 담당하는 강사 간 인수인계·공동 대응·수업 참관 피드백을 공유합니다.
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:16 }}>
              <Stat icon="📋" label="전체 협업 노트" value={collab.length+"건"}/>
              <Stat icon="🚨" label="긴급 공동 대응" value={collab.filter(c=>c.urgent).length+"건"} color={C.danger} bg="#FEF2F2"/>
              <Stat icon="🔄" label="인수인계" value={collab.filter(c=>c.type==="인수인계").length+"건"} color={C.warning} bg="#FFFBEB"/>
            </div>
            {collab.filter(c=>c.urgent).length>0&&<div style={{ padding:"11px 15px",background:"#FEF2F2",border:"2px solid #FECACA",borderRadius:10,marginBottom:14 }}>
              <div style={{ fontWeight:700,color:C.danger,marginBottom:6 }}>🚨 긴급 공동 대응 필요</div>
              {collab.filter(c=>c.urgent).map(c=>{const s=stOf(c.studentId);return<div key={c.id} style={{ fontSize:13 }}>• <strong>{s?.name}</strong>: {c.content.slice(0,50)}...</div>;})}
            </div>}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <Card style={{ padding:20 }}>
                <H>📋 협업 노트 목록</H>
                {collab.map(c=>{
                  const s=stOf(c.studentId);
                  return <div key={c.id} style={{ padding:"13px 14px",borderRadius:10,marginBottom:8,border:`2px solid ${c.urgent?"#FECACA":C.border}`,background:c.urgent?"#FEF2F2":"#F8FAFC" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <Av char={s?.avatar||"?"} color={T.primary} size={28}/>
                        <div><div style={{ fontWeight:700,fontSize:13 }}>{s?.name}</div><div style={{ fontSize:11,color:C.muted }}>{c.fromInstructor} → {c.toInstructor}</div></div>
                      </div>
                      <div style={{ display:"flex",gap:5,flexDirection:"column",alignItems:"flex-end" }}>
                        <Bdg text={c.type} color={c.type==="인수인계"?C.warning:"#8B5CF6"} bg={c.type==="인수인계"?"#FFFBEB":"#F5F3FF"}/>
                        {c.urgent&&<Bdg text="🚨 긴급" color={C.danger} bg="#FEF2F2"/>}
                      </div>
                    </div>
                    <div style={{ fontSize:13,color:C.text,lineHeight:1.6 }}>{c.content}</div>
                    <div style={{ fontSize:11,color:C.muted,marginTop:5 }}>{c.date}</div>
                  </div>;
                })}
              </Card>
              <Card style={{ padding:20 }}>
                <H>👀 요주의 학생 공동 관리</H>
                <div style={{ padding:"10px 13px",background:"#FFFBEB",borderRadius:8,marginBottom:12,fontSize:13 }}>
                  💡 여러 강사가 주목하는 학생을 함께 관리합니다.
                </div>
                {[...new Set(collab.map(c=>c.studentId))].map(sid=>{
                  const s=stOf(sid);
                  const sCollab=collab.filter(c=>c.studentId===sid);
                  if(!s) return null;
                  return <div key={sid} style={{ padding:"13px 14px",background:T.bg,borderRadius:9,marginBottom:8 }}>
                    <div style={{ display:"flex",gap:9,alignItems:"center",marginBottom:8 }}>
                      <Av char={s.avatar} color={T.primary} size={34}/>
                      <div>
                        <div style={{ fontWeight:700 }}>{s.name}</div>
                        <div style={{ fontSize:11,color:C.muted }}>{clOf(s.classId)?.name} · {s.level}수준</div>
                      </div>
                      <div style={{ marginLeft:"auto" }}><Bdg text={`${sCollab.length}건 기록`} color={T.primary} bg={T.primaryLight}/></div>
                    </div>
                    {sCollab.map(c=><div key={c.id} style={{ fontSize:12,padding:"6px 9px",background:"#fff",borderRadius:6,marginBottom:4,borderLeft:`3px solid ${c.urgent?C.danger:T.primary}` }}>
                      <strong style={{ color:c.urgent?C.danger:T.primary }}>[{c.type}]</strong> {c.content.slice(0,50)}
                    </div>)}
                  </div>;
                })}
              </Card>
            </div>
          </PlanGate>}

        </div>
      </div>

      {/* ── MODALS ── */}
      {showAddClass&&<Modal title="🏫 반 개설" onClose={()=>setShowAddClass(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ gridColumn:"span 2" }}><Lbl>반 이름 *</Lbl><input value={cForm.name} onChange={e=>setCForm({...cForm,name:e.target.value})} placeholder="중3-A" style={inp}/></div>
          <div><Lbl>과목</Lbl><input value={cForm.subject} onChange={e=>setCForm({...cForm,subject:e.target.value})} placeholder="수학" style={inp}/></div>
          <div><Lbl>수업 요일</Lbl><input value={cForm.day} onChange={e=>setCForm({...cForm,day:e.target.value})} placeholder="월·수·금" style={inp}/></div>
          <div><Lbl>시간</Lbl><input value={cForm.time} onChange={e=>setCForm({...cForm,time:e.target.value})} placeholder="17:00" style={inp}/></div>
          <div><Lbl>강의실</Lbl><input value={cForm.room} onChange={e=>setCForm({...cForm,room:e.target.value})} placeholder="3강의실" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>교재</Lbl><input value={cForm.textbook} onChange={e=>setCForm({...cForm,textbook:e.target.value})} placeholder="RPM 수학③" style={inp}/></div>
          <div><Lbl>총 수업 주수</Lbl><input type="number" value={cForm.totalWeeks} onChange={e=>setCForm({...cForm,totalWeeks:+e.target.value})} style={inp}/></div>
          <div><Lbl>반 색상</Lbl><input type="color" value={cForm.color} onChange={e=>setCForm({...cForm,color:e.target.value})} style={{ ...inp,height:40,padding:4 }}/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddClass(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!cForm.name.trim())return;setClasses(p=>[...p,{...cForm,id:Date.now(),currentWeek:0,targetCh:""}]);setShowAddClass(false);setCForm({name:"",subject:"수학",day:"",time:"",room:"",textbook:"",totalWeeks:20,color:"#7C3AED"});}} style={{ flex:2 }}>개설</Btn>
        </div>
      </Modal>}

      {showAddStudent&&<Modal title="👤 학생 등록" onClose={()=>setShowAddStudent(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ gridColumn:"span 2" }}><Lbl>이름 *</Lbl><input value={sForm.name} onChange={e=>setSForm({...sForm,name:e.target.value,avatar:e.target.value[0]||""})} placeholder="홍길동" style={inp}/></div>
          <div><Lbl>반 배정</Lbl><select value={sForm.classId} onChange={e=>setSForm({...sForm,classId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}</select></div>
          <div><Lbl>학년</Lbl><select value={sForm.grade} onChange={e=>setSForm({...sForm,grade:e.target.value})} style={sel}>{["중1","중2","중3","고1","고2","고3"].map(v=><option key={v}>{v}</option>)}</select></div>
          <div><Lbl>수준</Lbl><select value={sForm.level} onChange={e=>setSForm({...sForm,level:e.target.value})} style={sel}>{["상","중","하"].map(v=><option key={v}>{v}</option>)}</select></div>
          <div><Lbl>연락처</Lbl><input value={sForm.phone} onChange={e=>setSForm({...sForm,phone:e.target.value})} placeholder="010-0000-0000" style={inp}/></div>
          <div><Lbl>학부모 연락처</Lbl><input value={sForm.parentPhone} onChange={e=>setSForm({...sForm,parentPhone:e.target.value})} placeholder="010-0000-0000" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>메모</Lbl><input value={sForm.memo} onChange={e=>setSForm({...sForm,memo:e.target.value})} placeholder="특이사항" style={inp}/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddStudent(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!sForm.name.trim()||!sForm.classId)return;setStudents(p=>[...p,{...sForm,id:Date.now(),absent:0,points:0,badge:[]}]);setShowAddStudent(false);setSForm({classId:"",name:"",grade:"중3",avatar:"",level:"중",phone:"",parentPhone:"",memo:""});}} style={{ flex:2 }}>등록</Btn>
        </div>
      </Modal>}

      {showAddProgress&&<Modal title="📋 진도 기록" onClose={()=>setShowAddProgress(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ gridColumn:"span 2" }}><Lbl>반 *</Lbl><select value={pForm.classId} onChange={e=>setPForm({...pForm,classId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}</select></div>
          <div><Lbl>단원 / 챕터</Lbl><input value={pForm.chapter} onChange={e=>setPForm({...pForm,chapter:e.target.value})} placeholder="§3 이차함수" style={inp}/></div>
          <div><Lbl>계획 이행률 (%)</Lbl><input type="number" value={pForm.completionRate} onChange={e=>setPForm({...pForm,completionRate:+e.target.value})} style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>수업 전 계획</Lbl><input value={pForm.planned} onChange={e=>setPForm({...pForm,planned:e.target.value})} placeholder="이차함수 최대최소 개념 + 응용" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>실제 진행 내용</Lbl><input value={pForm.actual} onChange={e=>setPForm({...pForm,actual:e.target.value})} placeholder="계획대로 진행, 응용 추가" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>특이사항</Lbl><input value={pForm.note} onChange={e=>setPForm({...pForm,note:e.target.value})} placeholder="전체 이해도 높음" style={inp}/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddProgress(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!pForm.classId||!pForm.chapter)return;const cl=clOf(pForm.classId);setProgress(p=>[...p,{...pForm,id:Date.now(),week:cl?.currentWeek||1,date:today}]);setShowAddProgress(false);setPForm({classId:"",chapter:"",planned:"",actual:"",completionRate:100,note:""});}} style={{ flex:2 }}>저장</Btn>
        </div>
      </Modal>}

      {showAddExam&&<Modal title="📝 시험 등록" onClose={()=>setShowAddExam(false)} width={500}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ gridColumn:"span 2" }}><Lbl>반 *</Lbl><select value={eForm.classId} onChange={e=>setEForm({...eForm,classId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}</select></div>
          <div><Lbl>시험명</Lbl><input value={eForm.name} onChange={e=>setEForm({...eForm,name:e.target.value})} placeholder="3월 원내 테스트" style={inp}/></div>
          <div><Lbl>날짜</Lbl><input type="date" value={eForm.date} onChange={e=>setEForm({...eForm,date:e.target.value})} style={inp}/></div>
          <div><Lbl>유형</Lbl><select value={eForm.type} onChange={e=>setEForm({...eForm,type:e.target.value})} style={sel}>{["원내시험","레벨테스트","모의고사","기타"].map(v=><option key={v}>{v}</option>)}</select></div>
          <div><Lbl>합격선</Lbl><input type="number" value={eForm.passLine} onChange={e=>setEForm({...eForm,passLine:+e.target.value})} style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>시험 범위</Lbl><input value={eForm.range} onChange={e=>setEForm({...eForm,range:e.target.value})} placeholder="이차함수 전체" style={inp}/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddExam(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!eForm.classId||!eForm.date)return;setExams(p=>[...p,{...eForm,id:Date.now(),scores:{}}]);setShowAddExam(false);setEForm({classId:"",name:"",date:"",range:"",type:"원내시험",passLine:70});}} style={{ flex:2 }}>등록</Btn>
        </div>
      </Modal>}

      {showAddNotice&&<Modal title="📣 알림 작성" onClose={()=>setShowAddNotice(false)} width={500}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div><Lbl>수신 대상</Lbl>
            <select value={nForm.classId||""} onChange={e=>{const cl=classes.find(c=>c.id===+e.target.value);setNForm({...nForm,classId:+e.target.value,target:cl?.name||"전체"});}} style={sel}>
              <option value="">전체</option>{classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
            </select>
          </div>
          <div><Lbl>유형</Lbl><select value={nForm.type} onChange={e=>setNForm({...nForm,type:e.target.value})} style={sel}>{["공지","개별","긴급"].map(v=><option key={v}>{v}</option>)}</select></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>제목</Lbl><input value={nForm.title} onChange={e=>setNForm({...nForm,title:e.target.value})} placeholder="3월 시험 일정 안내" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>내용</Lbl><textarea value={nForm.content} onChange={e=>setNForm({...nForm,content:e.target.value})} rows={4} style={{ ...inp,resize:"vertical" }} placeholder="안내 내용을 입력하세요"/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddNotice(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!nForm.title||!nForm.content)return;setNotices(p=>[...p,{...nForm,id:Date.now(),date:today,sent:true}]);setShowAddNotice(false);setNForm({classId:"",target:"전체",type:"공지",title:"",content:""});}} style={{ flex:2 }}>발송</Btn>
        </div>
      </Modal>}

      {showAddMakeup&&<Modal title="🔁 보강 등록" onClose={()=>setShowAddMakeup(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div><Lbl>반</Lbl><select value={mForm.classId} onChange={e=>setMForm({...mForm,classId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{classes.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}</select></div>
          <div><Lbl>학생</Lbl><select value={mForm.studentId} onChange={e=>setMForm({...mForm,studentId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{(mForm.classId?students.filter(s=>s.classId===mForm.classId):students).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><Lbl>원래 수업일</Lbl><input type="date" value={mForm.originalDate} onChange={e=>setMForm({...mForm,originalDate:e.target.value})} style={inp}/></div>
          <div><Lbl>보강 예정일</Lbl><input type="date" value={mForm.makeupDate} onChange={e=>setMForm({...mForm,makeupDate:e.target.value})} style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>사유</Lbl><input value={mForm.reason} onChange={e=>setMForm({...mForm,reason:e.target.value})} placeholder="개인 사정 결석" style={inp}/></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>메모</Lbl><input value={mForm.note} onChange={e=>setMForm({...mForm,note:e.target.value})} placeholder="원장님 승인 필요" style={inp}/></div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddMakeup(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!mForm.studentId||!mForm.originalDate)return;setMakeup(p=>[...p,{...mForm,id:Date.now(),status:"예정",approvedByDirector:false}]);setShowAddMakeup(false);setMForm({classId:"",studentId:"",originalDate:"",makeupDate:"",reason:"",note:""});}} style={{ flex:2 }}>등록</Btn>
        </div>
      </Modal>}

      {showAddCollab&&<Modal title="🤝 협업 노트 작성" onClose={()=>setShowAddCollab(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ gridColumn:"span 2" }}><Lbl>대상 학생</Lbl><select value={coForm.studentId} onChange={e=>setCoForm({...coForm,studentId:+e.target.value})} style={sel}><option value="">-- 선택 --</option>{students.map(s=><option key={s.id} value={s.id}>{s.name} ({clOf(s.classId)?.name})</option>)}</select></div>
          <div><Lbl>수신 강사</Lbl><input value={coForm.toInstructor} onChange={e=>setCoForm({...coForm,toInstructor:e.target.value})} placeholder="박수학 / 전체" style={inp}/></div>
          <div><Lbl>유형</Lbl><select value={coForm.type} onChange={e=>setCoForm({...coForm,type:e.target.value})} style={sel}>{["인수인계","공동대응","참관피드백"].map(v=><option key={v}>{v}</option>)}</select></div>
          <div style={{ gridColumn:"span 2" }}><Lbl>내용</Lbl><textarea value={coForm.content} onChange={e=>setCoForm({...coForm,content:e.target.value})} rows={4} style={{ ...inp,resize:"vertical" }} placeholder="인수인계 내용, 공동 대응 사항"/></div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <input type="checkbox" checked={coForm.urgent} onChange={e=>setCoForm({...coForm,urgent:e.target.checked})} id="urg"/>
            <label htmlFor="urg" style={{ fontSize:13,cursor:"pointer" }}>🚨 긴급 처리 필요</label>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:18 }}>
          <Btn onClick={()=>setShowAddCollab(false)} bg="#F8FAFC" color={C.text} style={{ flex:1,border:`1px solid ${C.border}` }}>취소</Btn>
          <Btn onClick={()=>{if(!coForm.studentId||!coForm.content)return;setCollab(p=>[...p,{...coForm,id:Date.now(),fromInstructor:"김수학",date:today}]);setShowAddCollab(false);setCoForm({studentId:"",toInstructor:"",type:"인수인계",content:"",urgent:false});}} style={{ flex:2 }}>공유</Btn>
        </div>
      </Modal>}

      {/* 포인트 지급 모달 */}
      {showPointModal&&pointTarget&&<Modal title={`🏆 ${pointTarget.name} 포인트 지급`} onClose={()=>setShowPointModal(false)}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
          {[["출석",10,"✅"],["숙제 완료",20,"📝"],["성적 향상",50,"📈"],["발표 참여",15,"🙋"],["오답노트 제출",30,"📔"],["대회 수상",100,"🏅"]].map(([reason,pts,icon])=>(
            <button key={reason} onClick={()=>{givePoints(pointTarget.id,pts,reason);setStudents(p=>p.map(s=>s.id===pointTarget.id?{...s,badge:checkBadges({...s,points:s.points+pts})}:s));setShowPointModal(false);}} style={{ padding:"16px",border:`1px solid ${C.border}`,borderRadius:12,cursor:"pointer",background:T.bg,textAlign:"left" }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{icon}</div>
              <div style={{ fontSize:13,fontWeight:700 }}>{reason}</div>
              <div style={{ fontSize:16,fontWeight:900,color:T.primary }}>+{pts}pts</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop:14,padding:"10px 13px",background:T.bg,borderRadius:8,fontSize:12,color:C.muted }}>
          현재 포인트: <strong style={{ color:T.primary }}>{pointTarget.points}pts</strong>
        </div>
      </Modal>}

      {/* 보고서 모달 */}
      {showReport&&<Modal title={`📊 ${reportClass?.name} 원장님 보고서`} onClose={()=>!generating&&setShowReport(false)} width={520}>
        <div style={{ background:"#F8FAFC",borderRadius:10,padding:16,minHeight:240,fontSize:13,lineHeight:1.9,whiteSpace:"pre-line",fontFamily:"monospace",marginBottom:16 }}>
          {reportText||<span style={{ color:C.muted }}>보고서를 생성 중입니다...</span>}{generating&&<span style={{ animation:"blink 1s infinite" }}>▌</span>}
        </div>
        {!generating&&<div style={{ display:"flex",gap:8 }}>
          <Btn onClick={()=>navigator.clipboard?.writeText(reportText)} bg={T.primaryLight} color={T.primary} style={{ flex:1 }}>📋 복사</Btn>
          <Btn onClick={()=>setShowReport(false)} style={{ flex:1 }}>완료</Btn>
        </div>}
      </Modal>}

      {showSub&&<SubscriptionPage current={currentPlan} onSelect={setCurrentPlan} onClose={()=>setShowSub(false)} mode={mode}/>}
    </div>
  );
}
export { InstructorApp };
