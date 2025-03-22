// This would be replaced with actual API calls in a production environment
// Mock implementations for now

interface User {
  id: string;
  name: string;
  email: string;
  userType: "consumer" | "farmer" | "admin";
  profileImage?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: "consumer" | "farmer";
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data - store in localStorage to persist across refreshes
const getMockUsers = (): User[] => {
  const usersString = localStorage.getItem("mockUsers");
  if (!usersString) {
    const defaultUsers: User[] = [
      {
        id: "user1",
        name: "John Consumer",
        email: "john@example.com",
        userType: "consumer",
        profileImage: "https://i.pravatar.cc/150?u=john"
      },
      {
        id: "user2",
        name: "Mary Farmer",
        email: "mary@example.com",
        userType: "farmer",
        profileImage: "https://i.pravatar.cc/150?u=mary"
      },
      {
        id: "user3",
        name: "Admin User",
        email: "admin@example.com",
        userType: "admin",
        profileImage: "https://i.pravatar.cc/150?u=admin"
      }
    ];
    localStorage.setItem("mockUsers", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(usersString);
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await delay(1000);
    
    const users = getMockUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // Store user in localStorage to persist session
    localStorage.setItem("user", JSON.stringify(user));
    
    return user;
  },
  
  register: async (userData: RegisterData): Promise<User> => {
    // Simulate API call
    await delay(1500);
    
    const users = getMockUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser: User = {
      id: `user${users.length + 1}`,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      profileImage: `https://i.pravatar.cc/150?u=${userData.email}`
    };
    
    // Add to mock users and save to localStorage
    users.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(users));
    
    // Store user in localStorage to persist session
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    // Simulate API call
    await delay(500);
    
    // Remove user from localStorage
    localStorage.removeItem("user");
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    // Check if user exists in localStorage
    const userString = localStorage.getItem("user");
    if (!userString) {
      return null;
    }
    
    try {
      const user = JSON.parse(userString);
      return user;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },
  
  forgotPassword: async (email: string): Promise<void> => {
    // Simulate API call
    await delay(1000);
    
    const users = getMockUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("Email not found");
    }
    
    // In a real app, this would send a password reset email
    console.log(`Password reset email sent to ${email}`);
  }
};
