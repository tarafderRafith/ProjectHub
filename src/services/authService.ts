
const API_URL = "http://localhost:5038/api/Auth";

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
      result.message || "Registration failed."
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
      result.message || "Login failed."
    );
  }

  return result;
};

