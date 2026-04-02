import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Firebase 초기화
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAmqER5913WWFzhVcoABBEibhouvFk2WUg",
  authDomain: "paran-math.firebaseapp.com",
  projectId: "paran-math",
  storageBucket: "paran-math.firebasestorage.app",
  messagingSenderId: "876432468378",
  appId: "1:876432468378:web:0d921baad20f3522293223"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 키를 Firestore 문서 ID로 변환 (슬래시, 콜론을 언더스코어로)
const keyToDocId = (key) => key.replace(/\//g, '_').replace(/:/g, '__');

// Firestore 기반 스토리지 구현 (window.storage 대체)
window.storage = {
  async get(key) {
    try {
      const docId = keyToDocId(key);
      const docRef = doc(db, 'storage', docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { key, value: docSnap.data().value };
      }
      return null;
    } catch (e) {
      console.error('Firestore get error:', e);
      // 오프라인 fallback: localStorage
      try {
        const value = localStorage.getItem(key);
        return value ? { key, value } : null;
      } catch (le) {
        return null;
      }
    }
  },
  
  async set(key, value) {
    try {
      const docId = keyToDocId(key);
      const docRef = doc(db, 'storage', docId);
      await setDoc(docRef, { 
        key, 
        value, 
        updatedAt: new Date().toISOString() 
      });
      
      // localStorage에도 백업
      try {
        localStorage.setItem(key, value);
      } catch (le) {
        // localStorage 용량 초과 무시
      }
      
      return { key, value };
    } catch (e) {
      console.error('Firestore set error:', e);
      // 오프라인 fallback: localStorage
      try {
        localStorage.setItem(key, value);
        return { key, value };
      } catch (le) {
        return null;
      }
    }
  },
  
  async delete(key) {
    try {
      const docId = keyToDocId(key);
      const docRef = doc(db, 'storage', docId);
      await deleteDoc(docRef);
      
      // localStorage에서도 삭제
      try {
        localStorage.removeItem(key);
      } catch (le) {
        // 무시
      }
      
      return { key, deleted: true };
    } catch (e) {
      console.error('Firestore delete error:', e);
      try {
        localStorage.removeItem(key);
        return { key, deleted: true };
      } catch (le) {
        return null;
      }
    }
  },
  
  async list(prefix = '') {
    try {
      const keys = [];
      const storageRef = collection(db, 'storage');
      const querySnapshot = await getDocs(storageRef);
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.key && data.key.startsWith(prefix)) {
          keys.push(data.key);
        }
      });
      
      return { keys, prefix };
    } catch (e) {
      console.error('Firestore list error:', e);
      // 오프라인 fallback: localStorage
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keys.push(key);
          }
        }
        return { keys, prefix };
      } catch (le) {
        return { keys: [], prefix };
      }
    }
  }
};

// 연결 상태 표시
console.log('🔥 Firebase 연결됨 - paran-math');

// ─── PWA: beforeinstallprompt를 React 마운트 이전에 잡기 위해 전역 저장 ───
if (typeof window !== 'undefined') {
  window._pwaPromptEvent = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window._pwaPromptEvent = e;
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });
}

// ─── 플랫폼 감지 유틸 ───
function detectPlatform() {
  const ua = navigator.userAgent || '';
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone) return 'installed';
  if (/android/i.test(ua)) return 'android';
  const isIPhone = /iphone|ipod/i.test(ua);
  // iPadOS 13+ 는 ua에 iPad 없이 Macintosh로 표시됨 → maxTouchPoints로 구분
  const isIPad = /ipad/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const isIOS = isIPhone || isIPad;
  if (!isIOS) return 'other';
  // 카카오톡, 인스타, 라인 등 인앱브라우저는 설치 불가
  const isInApp = /CriOS|FxiOS|OPiOS|EdgiOS|KAKAOTALK|NAVER|Line\/|Instagram|FBAN|FBIOS|Twitter/i.test(ua);
  return isInApp ? 'ios-inapp' : 'ios-safari';
}

function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = React.useState(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const [updateReady, setUpdateReady] = React.useState(false);
  const [platform, setPlatform] = React.useState('unknown');

  React.useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);
    if (detected === 'installed') return;

    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    // URL에 ?pwa=1 이 있으면 차단 무시 (테스트/강제표시용)
    const forceShow = new URLSearchParams(window.location.search).get('pwa') === '1';
    const recentlyDismissed = !forceShow && dismissed && Date.now() - parseInt(dismissed) < 24 * 60 * 60 * 1000; // 1일

    if (detected === 'ios-safari') {
      if (recentlyDismissed) return;
      setTimeout(() => setShowBanner(true), 2000);
    } else if (detected === 'ios-inapp') {
      if (!recentlyDismissed) setTimeout(() => setShowBanner(true), 1500);
    } else if (detected === 'android') {
      if (recentlyDismissed) return;
      if (window._pwaPromptEvent) {
        setInstallPrompt(window._pwaPromptEvent);
        setTimeout(() => setShowBanner(true), 2000);
      }
      const onInstallable = () => {
        setInstallPrompt(window._pwaPromptEvent);
        setTimeout(() => setShowBanner(true), 500);
      };
      window.addEventListener('pwa-installable', onInstallable, { once: true });
      return () => window.removeEventListener('pwa-installable', onInstallable);
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        // 즉시 업데이트 체크 (백그라운드)
        reg.update().catch(() => {});
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw?.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              // ★ 자동 새로고침 제거 — SKIP_WAITING만 보내고 다음 방문 시 자연스럽게 적용
              nw.postMessage({ type: 'SKIP_WAITING' });
              setUpdateReady(true);
            }
          });
        });
      });
    }
  }, []);

  const handleInstall = async () => {
    if (platform === 'ios-safari' || platform === 'ios-inapp') {
      setShowIOSGuide(true);
      return;
    }
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') { setShowBanner(false); window._pwaPromptEvent = null; }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  const isInApp = platform === 'ios-inapp';
  const accentColor = isInApp ? '#f59e0b' : '#1e40af';
  const bannerTitle = isInApp ? 'Safari에서 열어주세요' : '파란수학 앱 설치하기';
  const bannerDesc = isInApp
    ? '카카오톡·인앱브라우저에서는 설치 불가 — Safari로 열어주세요 🧭'
    : platform === 'ios-safari'
    ? '홈 화면에 추가하면 앱처럼 바로 열 수 있어요 📱'
    : '앱으로 설치하면 더 빠르게 이용할 수 있어요 🚀';
  const btnLabel = isInApp ? '🧭 방법 보기' : platform === 'ios-safari' ? '📲 설치 방법' : '📲 설치하기';

  return (
    React.createElement(React.Fragment, null,
      /* 업데이트 알림 */
      updateReady && React.createElement('div', {
        style: { position:'fixed',top:0,left:0,right:0,zIndex:9999,background:'#1e40af',color:'white',
          padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',
          boxShadow:'0 2px 8px rgba(0,0,0,0.3)',fontSize:'14px' }
      },
        React.createElement('span', null, '🔄 새 버전이 있습니다!'),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style: { background:'white',color:'#1e40af',border:'none',borderRadius:'6px',padding:'6px 14px',fontWeight:'bold',cursor:'pointer',fontSize:'13px' }
        }, '지금 업데이트')
      ),

      /* 설치 배너 */
      showBanner && !showIOSGuide && React.createElement('div', {
        style: { position:'fixed',bottom:0,left:0,right:0,zIndex:9998,background:'white',
          borderTop:`3px solid ${accentColor}`,padding:'14px 16px',
          boxShadow:'0 -6px 24px rgba(0,0,0,0.18)',display:'flex',alignItems:'center',gap:'12px',
          animation:'pwaSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }
      },
        React.createElement('style', null, '@keyframes pwaSlideUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}'),
        React.createElement('div', {
          style: { width:52,height:52,borderRadius:14,flexShrink:0,background: isInApp?'#fef3c7':'#eff6ff',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:26 }
        }, isInApp ? '🧭' : '📱'),
        React.createElement('div', { style:{ flex:1,minWidth:0 } },
          React.createElement('p', { style:{margin:0,fontWeight:700,fontSize:14,color:accentColor} }, bannerTitle),
          React.createElement('p', { style:{margin:'3px 0 0',fontSize:11,color:'#6b7280',lineHeight:1.4} }, bannerDesc)
        ),
        React.createElement('div', { style:{ display:'flex',gap:8,flexShrink:0 } },
          React.createElement('button', {
            onClick: handleDismiss,
            style: { padding:'7px 10px',border:'1px solid #e5e7eb',borderRadius:8,background:'white',color:'#6b7280',fontSize:12,cursor:'pointer' }
          }, '닫기'),
          React.createElement('button', {
            onClick: handleInstall,
            style: { padding:'7px 13px',border:'none',borderRadius:8,background:accentColor,color:'white',fontSize:12,fontWeight:700,cursor:'pointer' }
          }, btnLabel)
        )
      ),

      /* iOS/인앱 가이드 모달 */
      showIOSGuide && React.createElement('div', {
        style: { position:'fixed',inset:0,zIndex:99999,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'flex-end',justifyContent:'center' },
        onClick: handleDismiss
      },
        React.createElement('div', {
          style: { background:'white',borderRadius:'24px 24px 0 0',padding:'20px 20px 48px',width:'100%',maxWidth:500,animation:'pwaSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)' },
          onClick: e => e.stopPropagation()
        },
          React.createElement('div', { style:{ width:40,height:4,background:'#e5e7eb',borderRadius:4,margin:'0 auto 18px' } }),

          isInApp
            ? React.createElement('div', null,
                React.createElement('div', { style:{ textAlign:'center',marginBottom:20 } },
                  React.createElement('div', { style:{ fontSize:48,marginBottom:8 } }, '🧭'),
                  React.createElement('p', { style:{ margin:0,fontWeight:700,fontSize:17 } }, 'Safari로 열어야 설치 가능해요'),
                  React.createElement('p', { style:{ margin:'6px 0 0',fontSize:13,color:'#6b7280' } }, '카카오톡·인스타그램 등 인앱브라우저에서는\nPWA 앱 설치가 지원되지 않습니다')
                ),
                ...[
                  { step:'1', icon:'⋯', title:'우측 ··· (더보기) 버튼 탭', desc:'브라우저 하단 또는 주소창 옆 버튼을 누르세요' },
                  { step:'2', icon:'🌐', title:'"Safari로 열기" 선택', desc:'메뉴에서 "Safari로 열기"를 탭하세요' },
                  { step:'3', icon:'📲', title:'Safari에서 설치 배너 탭', desc:'배너 → "설치 방법" → 홈 화면에 추가' },
                ].map(item => React.createElement('div', { key:item.step, style:{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:16 } },
                  React.createElement('div', { style:{ width:34,height:34,borderRadius:'50%',background:'#f59e0b',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,flexShrink:0 } }, item.step),
                  React.createElement('div', null,
                    React.createElement('p', { style:{ margin:0,fontWeight:600,fontSize:14 } }, `${item.icon} ${item.title}`),
                    React.createElement('p', { style:{ margin:'3px 0 0',fontSize:12,color:'#6b7280' } }, item.desc)
                  )
                ))
              )
            : React.createElement('div', null,
                React.createElement('div', { style:{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 } },
                  React.createElement('div', { style:{ display:'flex',alignItems:'center',gap:12 } },
                    React.createElement('img', { src:'/icons/icon-96x96.png', alt:'', style:{ width:48,height:48,borderRadius:12 } }),
                    React.createElement('div', null,
                      React.createElement('p', { style:{ margin:0,fontWeight:700,fontSize:17 } }, '파란수학 설치 방법'),
                      React.createElement('p', { style:{ margin:'2px 0 0',fontSize:13,color:'#6b7280' } }, 'iPhone · iPad (Safari)')
                    )
                  ),
                  React.createElement('button', { onClick:handleDismiss, style:{ background:'#f3f4f6',border:'none',borderRadius:'50%',width:32,height:32,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280' } }, '✕')
                ),
                ...[
                  { step:'1', icon:'📤', title:'하단 공유(□↑) 버튼 탭', desc:'Safari 화면 하단 가운데 공유 아이콘을 누르세요' },
                  { step:'2', icon:'➕', title:'"홈 화면에 추가" 선택', desc:'목록을 아래로 스크롤해서 해당 항목을 탭하세요' },
                  { step:'3', icon:'✅', title:'우측 상단 "추가" 탭', desc:'이름 확인 후 "추가"를 누르면 완료!' },
                ].map(item => React.createElement('div', { key:item.step, style:{ display:'flex',gap:16,alignItems:'flex-start',marginBottom:18 } },
                  React.createElement('div', { style:{ width:36,height:36,borderRadius:'50%',background:'#1e40af',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:15,flexShrink:0 } }, item.step),
                  React.createElement('div', null,
                    React.createElement('p', { style:{ margin:0,fontWeight:600,fontSize:15 } }, `${item.icon} ${item.title}`),
                    React.createElement('p', { style:{ margin:'4px 0 0',fontSize:13,color:'#6b7280',lineHeight:1.5 } }, item.desc)
                  )
                )),
                React.createElement('div', { style:{ padding:'12px 14px',background:'#eff6ff',borderRadius:12,fontSize:13,color:'#1d4ed8',marginBottom:16 } },
                  '⚠️ ', React.createElement('strong', null, 'Safari'), '에서만 설치 가능합니다. 카카오톡·Chrome 인앱브라우저는 지원하지 않아요.'
                )
              ),

          React.createElement('button', {
            onClick: handleDismiss,
            style: { width:'100%',padding:'14px',background:'#1e40af',color:'white',border:'none',borderRadius:14,fontWeight:700,fontSize:15,cursor:'pointer',marginTop:8 }
          }, '확인')
        )
      )
    )
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <PWAInstallBanner />
  </React.StrictMode>,
)
