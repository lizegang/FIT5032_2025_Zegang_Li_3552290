export const readUsers = () => {
  try {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return {};
  }
};

// 将用户数据写入localStorage
export const writeUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('写入用户数据失败:', error);
    return false;
  }
};

// 注册新用户
export const registerUser = (email, password, name) => {
  const users = readUsers();

  if (users[email]) {
    return { success: false, message: '邮箱已被注册' };
  }

  users[email] = {
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  const result = writeUsers(users);
  return result
    ? { success: true, message: '注册成功' }
    : { success: false, message: '注册失败，请重试' };
};

// 用户登录
export const loginUser = (email, password) => {
  const users = readUsers();
  const user = users[email];

  if (!user || user.password !== password) {
    return { success: false, message: '用户名或密码错误' };
  }

  return {
    success: true,
    user: { email, name: user.name, role: user.role }
  };
};
