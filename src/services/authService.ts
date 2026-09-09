
const API_URL = "http://localhost:5038/api/Auth";
const USERS_API_URL = "http://localhost:5038/api/Users";

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  role: string;
  university: string;
  department: string;
  studentId: string;
  semester: string;
  graduationYear: number;
  bio: string;
  skills: string;
  github: string;
  portfolio: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;

  role: string;

  university: string;
  department: string;
  studentId: string | null;
  semester: string;
  graduationYear: number;

  bio: string | null;
  skills: string | null;
  github: string | null;
  portfolio: string | null;

  isVerified: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export const registerUser = async (
  data: RegisterData
) => {
  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Registration failed."
    );
  }

  return result;
};

export const loginUser = async (
  data: LoginData
) => {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Login failed."
    );
  }

  return result;
};

export const getCurrentUser =
  async (): Promise<CurrentUser> => {
    const token =
      localStorage.getItem(
        "projecthub_token"
      ) ||
      sessionStorage.getItem(
        "projecthub_token"
      );

    if (!token) {
      throw new Error(
        "You are not logged in."
      );
    }

    const response = await fetch(
      `${USERS_API_URL}/me`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to load your profile."
      );
    }

    return result;
  };

