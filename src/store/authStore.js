// src/store/authStore.js
import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Guest',
  },

  actions: {
    // 监听认证状态变化
    initAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 从 Firestore 获取完整用户信息
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            this.user = {
              uid: user.uid,
              email: user.email,
              ...userDoc.data(),
            }
          }
        } else {
          this.user = null
        }
      })
    },

    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 获取用户详细信息
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        this.user = {
          uid: user.uid,
          email: user.email,
          ...userDoc.data(),
        }
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async register(email, password, name) {
      this.loading = true
      this.error = null

      // 前端参数校验（之前的逻辑保留）
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.error = 'Invalid email format'
        this.loading = false
        return false
      }
      if (password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        this.loading = false
        return false
      }
      if (!name.trim()) {
        this.error = 'Name cannot be empty'
        this.loading = false
        return false
      }

      try {
        // 1. 创建 Firebase 认证用户
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. 关键：发送邮箱验证邮件（注册成功后立即触发）
        await sendEmailVerification(user, {
          url: 'http://localhost:5173/login', // 验证成功后跳转的页面（你的前端登录页）
          handleCodeInApp: false, // 关闭“应用内处理验证”（默认 false，适合网页端）
        })

        // 3. 存储用户信息到 Firestore（之前的逻辑保留）
        await setDoc(doc(db, 'users', user.uid), {
          name: name.trim(),
          role: 'user',
          createdAt: new Date().toISOString(),
          emailVerified: user.emailVerified, // 记录邮箱是否已验证（初始为 false）
        })

        // 4. 更新本地状态
        this.user = {
          uid: user.uid,
          email: user.email,
          name: name.trim(),
          role: 'user',
          emailVerified: user.emailVerified, // 新增：记录邮箱验证状态
        }

        // 提示用户查收验证邮件
        alert('Registration successful! Please check your email to verify your account.')
        return true
      } catch (error) {
        this.error = `Registration failed: ${error.message}`
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        this.error = error.message
      }
    },
  },
})
