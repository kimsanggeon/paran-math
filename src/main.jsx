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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
