import type { CurrentUser } from "./authService";

const API_URL = "http://localhost:5038/api/Users";

export interface UpdateProfileData {
fullName: string;
username: string;
contactNumber: string;
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

const getToken = () => {
return (
localStorage.getItem("projecthub_token") ||
sessionStorage.getItem("projecthub_token")
);
};

export const updateProfile = async (
data: UpdateProfileData
) => {
const token = getToken();

if (!token) {
throw new Error("You are not logged in.");
}

const response = await fetch(`${API_URL}/me`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(data),
});

const result = await response.json();

if (!response.ok) {
throw new Error(
result.message || "Unable to update your profile."
);
}

return result;
};

export const fetchProfile = async (): Promise<CurrentUser> => {
const token = getToken();

if (!token) {
throw new Error("You are not logged in.");
}

const response = await fetch(`${API_URL}/me`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`,
},
});

const result = await response.json();

if (!response.ok) {
throw new Error(
result.message || "Unable to load your profile."
);
}

return result;
};
