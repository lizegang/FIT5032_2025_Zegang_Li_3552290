import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBPu9G8yiPWKCIPHawDYHCGInMfpBJHEK4',
  authDomain: 'project-5884324628989308803.firebaseapp.com',
  projectId: 'project-5884324628989308803',
  storageBucket: 'project-5884324628989308803.firebasestorage.app',
  messagingSenderId: '1004169615289',
  appId: '1:1004169615289:web:1e02da28ed853a8f064868',
  measurementId: 'G-4NGNDVPM6C',
}

// 初始化Firebase
const app = initializeApp(firebaseConfig)

// 导出服务
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)
