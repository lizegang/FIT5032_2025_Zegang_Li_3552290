export const readUsers = () => {
  try {
    const data = localStorage.getItem('users')
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Failed to read user data:', error)
    return {}
  }
}

export const writeUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users))
    return true
  } catch (error) {
    console.error('Failed to write user data:', error)
    return false
  }
}
export const registerUser = async (email, password, name) => {
  try {
    // 调用 Firebase 注册 API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=你的FirebaseAPIKey`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed')
    }

    // 注册成功后，可将用户信息保存到本地存储
    const user = {
      email: email,
      name: name,
      role: 'user', // 默认普通用户
      token: data.idToken,
    }

    const users = readUsers()
    users[email] = user
    writeUsers(users)

    return { success: true, user }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export const loginUser = (email, password) => {
  const users = readUsers()
  const user = users[email]

  if (!user || user.password !== password) {
    return { success: false, message: 'Incorrect email or password' }
  }

  return {
    success: true,
    user: { email, name: user.name, role: user.role },
  }
}
