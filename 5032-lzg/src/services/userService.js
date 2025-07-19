export const readUsers = () => {
  try {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to read user data:', error);
    return {};
  }
};

export const writeUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Failed to write user data:', error);
    return false;
  }
};

export const registerUser = (email, password, name) => {
  const users = readUsers();

  if (users[email]) {
    return { success: false, message: 'Email already registered' };
  }

  users[email] = {
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  const result = writeUsers(users);
  return result
    ? { success: true, message: 'Registration successful' }
    : { success: false, message: 'Registration failed, please try again' };
};

export const loginUser = (email, password) => {
  const users = readUsers();
  const user = users[email];

  if (!user || user.password !== password) {
    return { success: false, message: 'Incorrect email or password' };
  }

  return {
    success: true,
    user: { email, name: user.name, role: user.role }
  };
};
