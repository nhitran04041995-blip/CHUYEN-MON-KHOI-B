import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService, INITIAL_USERS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  isLeader: boolean;
  isTeacher: boolean;
  allUsers: User[];
  loginWithGoogle: (customEmail?: string, customName?: string) => void;
  switchUser: (userIdOrUser: string | User) => void;
  logout: () => void;
  refreshUsers: () => void;
  updateCurrentUserProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    return StorageService.getCurrentUser();
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    return StorageService.getUsers();
  });

  const refreshUsers = () => {
    const updated = StorageService.getUsers();
    setAllUsers(updated);
  };

  const switchUser = (userIdOrUser: string | User) => {
    let targetUser: User | undefined;
    if (typeof userIdOrUser === 'string') {
      targetUser = allUsers.find(u => u.id === userIdOrUser);
    } else {
      targetUser = userIdOrUser;
    }

    if (targetUser) {
      setCurrentUserState(targetUser);
      StorageService.setCurrentUser(targetUser);
      StorageService.addActivityLog(
        targetUser,
        'update',
        'member',
        targetUser.name,
        `Đã chuyển phiên làm việc sang tài khoản ${targetUser.name} (${targetUser.role === 'to_truong' || targetUser.role === 'leader' ? 'Tổ trưởng' : 'Giáo viên'})`
      );
    }
  };

  const loginWithGoogle = (customEmail?: string, customName?: string) => {
    const email = customEmail?.trim() || 'nhitran04041995@gmail.com';
    const users = StorageService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create new teacher user if not exists
      const isLead = email.toLowerCase().includes('nhi') || email.toLowerCase() === 'nhitran04041995@gmail.com';
      user = {
        id: `user-${Date.now()}`,
        name: customName?.trim() || (isLead ? 'Cô Trần Thị Yến Nhi' : `Cô ${email.split('@')[0]}`),
        email: email,
        role: isLead ? 'to_truong' : 'giao_vien',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        title: isLead ? 'Tổ trưởng Chuyên môn Khối B' : 'Giáo viên Khối B',
        classAssigned: isLead ? 'Phụ trách chung Khối B' : 'Lớp Khối B',
        phone: '0905.xxx.xxx',
        status: 'active',
      };
      users.push(user);
      StorageService.saveUsers(users);
      setAllUsers(users);
    }

    setCurrentUserState(user);
    StorageService.setCurrentUser(user);
    StorageService.addActivityLog(
      user,
      'update',
      'member',
      user.name,
      `Đăng nhập thành công với tài khoản Google (${user.email})`
    );
  };

  const logout = () => {
    setCurrentUserState(null);
    localStorage.removeItem('vydamn_current_user_v2');
  };

  const updateCurrentUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUserState(newProfile);
    StorageService.setCurrentUser(newProfile);

    const users = StorageService.getUsers().map(u => (u.id === newProfile.id ? newProfile : u));
    StorageService.saveUsers(users);
    setAllUsers(users);
  };

  const isLeader = currentUser?.role === 'to_truong' || currentUser?.role === 'leader';
  const isTeacher = !isLeader;
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role: currentUser?.role || 'giao_vien',
        isLeader,
        isTeacher,
        allUsers,
        loginWithGoogle,
        switchUser,
        logout,
        refreshUsers,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
