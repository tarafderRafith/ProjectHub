import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CurrentUser } from "../../services/authService";
import {
fetchProfile,
updateProfile,
type UpdateProfileData,
} from "../../services/profileService";

const Profile = () => {
const navigate = useNavigate();

const [user, setUser] = useState<CurrentUser | null>(null);
const [isEditing, setIsEditing] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);

const [message, setMessage] = useState("");
const [error, setError] = useState("");

const [formData, setFormData] = useState<UpdateProfileData>({
fullName: "",
username: "",
contactNumber: "",
university: "",
department: "",
studentId: "",
semester: "",
graduationYear: new Date().getFullYear(),
bio: "",
skills: "",
github: "",
portfolio: "",
});

useEffect(() => {
const loadProfile = async () => {
const token =
localStorage.getItem("projecthub_token") ||
sessionStorage.getItem("projecthub_token");


  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const profile = await fetchProfile();

    setUser(profile);

    setFormData({
      fullName: profile.fullName || "",
      username: profile.username || "",
      contactNumber: profile.contactNumber || "",
      university: profile.university || "",
      department: profile.department || "",
      studentId: profile.studentId || "",
      semester: profile.semester || "",
      graduationYear:
        profile.graduationYear || new Date().getFullYear(),
      bio: profile.bio || "",
      skills: profile.skills || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
    });
  } catch (err) {
    console.error(err);

    localStorage.removeItem("projecthub_token");
    sessionStorage.removeItem("projecthub_token");

    navigate("/login");
  } finally {
    setIsLoading(false);
  }
};

loadProfile();


}, [navigate]);

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
const { name, value } = e.target;


setFormData((previous) => ({
  ...previous,
  [name]:
    name === "graduationYear"
      ? Number(value)
      : value,
}));


};

const handleSave = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();


setError("");
setMessage("");

if (!formData.fullName.trim()) {
  setError("Full name is required.");
  return;
}

if (!formData.username.trim()) {
  setError("Username is required.");
  return;
}

if (!formData.university.trim()) {
  setError("University is required.");
  return;
}

if (!formData.department.trim()) {
  setError("Department is required.");
  return;
}

setIsSaving(true);

try {
  await updateProfile(formData);

  const updatedProfile = await fetchProfile();

  setUser(updatedProfile);

  setFormData({
    fullName: updatedProfile.fullName || "",
    username: updatedProfile.username || "",
    contactNumber: updatedProfile.contactNumber || "",
    university: updatedProfile.university || "",
    department: updatedProfile.department || "",
    studentId: updatedProfile.studentId || "",
    semester: updatedProfile.semester || "",
    graduationYear:
      updatedProfile.graduationYear ||
      new Date().getFullYear(),
    bio: updatedProfile.bio || "",
    skills: updatedProfile.skills || "",
    github: updatedProfile.github || "",
    portfolio: updatedProfile.portfolio || "",
  });

  setIsEditing(false);
  setMessage("Profile updated successfully.");

  setTimeout(() => {
    setMessage("");
  }, 3000);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Unable to update your profile."
  );
} finally {
  setIsSaving(false);
}


};

const handleCancel = () => {
if (!user) {
return;
}


setFormData({
  fullName: user.fullName || "",
  username: user.username || "",
  contactNumber: user.contactNumber || "",
  university: user.university || "",
  department: user.department || "",
  studentId: user.studentId || "",
  semester: user.semester || "",
  graduationYear:
    user.graduationYear || new Date().getFullYear(),
  bio: user.bio || "",
  skills: user.skills || "",
  github: user.github || "",
  portfolio: user.portfolio || "",
});

setError("");
setMessage("");
setIsEditing(false);


};

const handleLogout = () => {
localStorage.removeItem("projecthub_token");
sessionStorage.removeItem("projecthub_token");
navigate("/login");
};

if (isLoading) {
return (
<div
style={{
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "18px",
fontWeight: 600,
}}
>
Loading profile... </div>
);
}

if (!user) {
return null;
}

const userInitial =
user.fullName?.charAt(0).toUpperCase() || "U";

return (
<div
style={{
minHeight: "100vh",
background: "#f8fafc",
}}
>
<header
style={{
height: "72px",
background: "#ffffff",
borderBottom: "1px solid #e5e7eb",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "0 32px",
}}
>
<Link
to="/dashboard"
style={{
textDecoration: "none",
color: "#111827",
fontSize: "24px",
fontWeight: 800,
}}
>
Project<span style={{ color: "#2563eb" }}>Hub</span> </Link>


    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <Link
        to="/dashboard"
        style={{
          textDecoration: "none",
          color: "#4b5563",
          fontWeight: 600,
        }}
      >
        Dashboard
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          border: "none",
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "10px 16px",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  </header>

  <main
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "40px 24px 60px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#111827",
          }}
        >
          My Profile
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
          }}
        >
          Manage your ProjectHub profile and personal information.
        </p>
      </div>

      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          style={{
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            padding: "12px 22px",
            borderRadius: "9px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✏️ Edit Profile
        </button>
      )}
    </div>

    {message && (
      <div
        style={{
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
          padding: "14px 16px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontWeight: 600,
        }}
      >
        ✓ {message}
      </div>
    )}

    {error && (
      <div
        style={{
          background: "#fee2e2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          padding: "14px 16px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontWeight: 600,
        }}
      >
        {error}
      </div>
    )}

    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "28px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "22px",
      }}
    >
      <div
        style={{
          width: "82px",
          height: "82px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {userInitial}
      </div>

      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "25px",
            color: "#111827",
          }}
        >
          {user.fullName}
        </h2>

        <p
          style={{
            margin: "0 0 10px",
            color: "#6b7280",
          }}
        >
          @{user.username}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {user.role}
          </span>

          <span
            style={{
              background: user.isVerified
                ? "#dcfce7"
                : "#fef3c7",
              color: user.isVerified
                ? "#166534"
                : "#92400e",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {user.isVerified
              ? "✓ Verified"
              : "Verification Pending"}
          </span>

          <span
            style={{
              background: "#f3f4f6",
              color: "#374151",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </section>

    <form onSubmit={handleSave}>
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 22px",
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Personal Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <ProfileInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Email"
            name="email"
            value={user.email}
            onChange={() => {}}
            disabled
          />

          <ProfileInput
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 22px",
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Academic Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <ProfileInput
            label="University"
            name="university"
            value={formData.university}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <ProfileInput
            label="Graduation Year"
            name="graduationYear"
            type="number"
            value={formData.graduationYear}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 22px",
            fontSize: "20px",
            color: "#111827",
          }}
        >
          About You
        </h2>

        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 700,
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Bio
        </label>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          rows={5}
          placeholder="Tell other ProjectHub users about yourself..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #d1d5db",
            borderRadius: "9px",
            padding: "12px 14px",
            fontSize: "15px",
            resize: "vertical",
            background: isEditing ? "#ffffff" : "#f9fafb",
            color: "#111827",
            outline: "none",
          }}
        />

        <div style={{ marginTop: "20px" }}>
          <ProfileInput
            label="Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g. C#, React, SQL Server, Python"
          />
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 22px",
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Professional Links
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <ProfileInput
            label="GitHub"
            name="github"
            value={formData.github}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="https://github.com/username"
          />

          <ProfileInput
            label="Portfolio"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </section>

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Account Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              ACCOUNT ROLE
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {user.role}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              VERIFICATION
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: user.isVerified
                  ? "#15803d"
                  : "#b45309",
              }}
            >
              {user.isVerified
                ? "Verified"
                : "Not Verified"}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              ACCOUNT STATUS
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: user.isActive
                  ? "#15803d"
                  : "#b91c1c",
              }}
            >
              {user.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </section>

      {isEditing && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              padding: "12px 22px",
              borderRadius: "9px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: isSaving
                ? "not-allowed"
                : "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              border: "none",
              background: isSaving
                ? "#93c5fd"
                : "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "9px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: isSaving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  </main>
</div>


);
};

interface ProfileInputProps {
label: string;
name: string;
value: string | number;
onChange: (
e: React.ChangeEvent<HTMLInputElement>
) => void;
disabled: boolean;
type?: string;
placeholder?: string;
}

const ProfileInput = ({
label,
name,
value,
onChange,
disabled,
type = "text",
placeholder = "",
}: ProfileInputProps) => {
return ( <div>
<label
htmlFor={name}
style={{
display: "block",
fontSize: "14px",
fontWeight: 700,
color: "#374151",
marginBottom: "8px",
}}
>
{label} </label>


  <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    style={{
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #d1d5db",
      borderRadius: "9px",
      padding: "12px 14px",
      fontSize: "15px",
      background: disabled ? "#f9fafb" : "#ffffff",
      color: "#111827",
      outline: "none",
    }}
  />
</div>


);
};

export default Profile;
