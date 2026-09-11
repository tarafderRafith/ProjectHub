import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./SellerProjectEdit.css";

interface ProjectData {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  course: string;
  university: string;
  price: number;
  deliveryDays: number;
  deliverables: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isApproved: boolean;
  sellerId: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  technologies: string;
  course: string;
  university: string;
  price: string;
  deliveryDays: string;
  deliverables: string;
  imageUrl: string;
  isAvailable: boolean;
}

const API_BASE_URL =
  "http://localhost:5038";

function SellerProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState<ProjectData | null>(null);

  const [formData, setFormData] =
    useState<ProjectFormData>({
      title: "",
      description: "",
      category: "",
      technologies: "",
      course: "",
      university: "",
      price: "",
      deliveryDays: "",
      deliverables: "",
      imageUrl: "",
      isAvailable: true,
    });

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const getToken = () => {
    return (
      localStorage.getItem(
        "projecthub_token"
      ) ||
      sessionStorage.getItem(
        "projecthub_token"
      )
    );
  };

  const getImageUrl = (
    imageUrl: string | null
  ) => {
    if (!imageUrl) {
      return "";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const loadProject = async () => {
      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError(
          "Project ID is missing."
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/api/Projects/${id}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
            "Unable to load the project."
          );
        }

        const projectData =
          result as ProjectData;

        setProject(projectData);

        setFormData({
          title:
            projectData.title || "",

          description:
            projectData.description || "",

          category:
            projectData.category || "",

          technologies:
            projectData.technologies || "",

          course:
            projectData.course || "",

          university:
            projectData.university || "",

          price:
            projectData.price.toString(),

          deliveryDays:
            projectData.deliveryDays.toString(),

          deliverables:
            projectData.deliverables || "",

          imageUrl:
            projectData.imageUrl || "",

          isAvailable:
            projectData.isAvailable,
        });

        if (projectData.imageUrl) {
          setImagePreview(
            getImageUrl(
              projectData.imageUrl
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load the project."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  const handleChange = (
    field: keyof ProjectFormData,
    value: string | boolean
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(
      file.type
    )) {
      setError(
        "Only JPG, JPEG, PNG and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);

    if (formData.imageUrl) {
      setImagePreview(
        getImageUrl(
          formData.imageUrl
        )
      );
    } else {
      setImagePreview("");
    }

    const imageInput =
      document.getElementById(
        "projectImage"
      ) as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = "";
    }
  };

  const uploadImage = async (
    token: string
  ) => {
    if (!selectedImage) {
      return null;
    }

    const imageFormData =
      new FormData();

    imageFormData.append(
      "image",
      selectedImage
    );

    setUploadProgress(true);

    const response =
      await fetch(
        `${API_BASE_URL}/api/Projects/upload-image`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: imageFormData,
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      );

    let result: any = null;

    if (
      contentType &&
      contentType.includes(
        "application/json"
      )
    ) {
      result =
        await response.json();
    } else {
      const text =
        await response.text();

      result = {
        message: text,
      };
    }

    setUploadProgress(false);

    if (!response.ok) {
      throw new Error(
        result?.message ||
        "Unable to upload the project image."
      );
    }

    return result?.imageUrl || null;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token =
      getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError(
        "Project ID is missing."
      );

      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.technologies.trim() ||
      !formData.course.trim() ||
      !formData.university.trim() ||
      !formData.price ||
      !formData.deliveryDays ||
      !formData.deliverables.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    const price =
      Number(formData.price);

    const deliveryDays =
      Number(formData.deliveryDays);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        "Please enter a valid project price."
      );

      return;
    }

    if (
      !Number.isInteger(
        deliveryDays
      ) ||
      deliveryDays <= 0
    ) {
      setError(
        "Please enter valid delivery days."
      );

      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      // ==========================================
      // UPLOAD NEW IMAGE
      // ==========================================

      let imageUrl =
        formData.imageUrl ||
        null;

      if (selectedImage) {
        const uploadedImageUrl =
          await uploadImage(token);

        if (uploadedImageUrl) {
          imageUrl =
            uploadedImageUrl;
        }
      }

      // ==========================================
      // UPDATE PROJECT
      // ==========================================

      const response =
        await fetch(
          `${API_BASE_URL}/api/Projects/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              category:
                formData.category.trim(),

              technologies:
                formData.technologies.trim(),

              course:
                formData.course.trim(),

              university:
                formData.university.trim(),

              price,

              deliveryDays,

              deliverables:
                formData.deliverables.trim(),

              imageUrl,

              isAvailable:
                formData.isAvailable,
            }),
          }
        );

      let result:
        | {
            message?: string;
            imageUrl?: string | null;
          }
        | null = null;

      try {
        result =
          await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Unable to update the project."
        );
      }

      setSuccess(
        "Project updated successfully. It is now waiting for admin approval."
      );

      setProject(
        (currentProject) =>
          currentProject
            ? {
                ...currentProject,

                title:
                  formData.title.trim(),

                description:
                  formData.description.trim(),

                category:
                  formData.category.trim(),

                technologies:
                  formData.technologies.trim(),

                course:
                  formData.course.trim(),

                university:
                  formData.university.trim(),

                price,

                deliveryDays,

                deliverables:
                  formData.deliverables.trim(),

                imageUrl,

                isAvailable:
                  formData.isAvailable,

                isApproved:
                  false,
              }
            : currentProject
      );

      setFormData(
        (currentData) => ({
          ...currentData,
          imageUrl:
            imageUrl || "",
        })
      );

      setSelectedImage(null);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the project."
      );
    } finally {
      setIsSaving(false);
      setUploadProgress(false);
    }
  };

  if (isLoading) {
    return (
      <main className="seller-edit-page">

        <div className="seller-edit-loading">

          <div className="seller-edit-logo">
            Project
            <span>Hub</span>
          </div>

          <p>
            Loading project...
          </p>

        </div>

      </main>
    );
  }

  if (!project) {
    return (
      <main className="seller-edit-page">

        <div className="seller-edit-error-page">

          <div className="seller-edit-error-icon">
            !
          </div>

          <h1>
            Project not found
          </h1>

          <p>
            {error ||
              "The project could not be found."}
          </p>

          <Link
            to="/dashboard"
            className="seller-edit-back-button"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="seller-edit-page">

      <header className="seller-edit-header">

        <Link
          to="/dashboard"
          className="seller-edit-brand"
        >

          <span className="seller-edit-logo-small">
            P
          </span>

          <span>
            Project
            <span>Hub</span>
          </span>

        </Link>

        <Link
          to="/dashboard"
          className="seller-edit-dashboard-link"
        >
          ← Back to Dashboard
        </Link>

      </header>

      <div className="seller-edit-container">

        <div className="seller-edit-heading">

          <div>

            <span className="seller-edit-eyebrow">
              SELLER WORKSPACE
            </span>

            <h1>
              Edit Project
            </h1>

            <p>
              Update your project information
              and keep your listing accurate.
            </p>

          </div>

          <div className="seller-edit-status">

            <span
              className={
                project.isApproved
                  ? "approved"
                  : "pending"
              }
            >
              {project.isApproved
                ? "Approved"
                : "Pending Approval"}
            </span>

          </div>

        </div>

        {error && (
          <div className="seller-edit-alert error">

            <span>
              !
            </span>

            <p>
              {error}
            </p>

          </div>
        )}

        {success && (
          <div className="seller-edit-alert success">

            <span>
              ✓
            </span>

            <p>
              {success}
            </p>

          </div>
        )}

        <form
          className="seller-edit-form"
          onSubmit={handleSubmit}
        >

          {/* ==========================================
              01 BASIC INFORMATION
          ========================================== */}

          <section className="seller-edit-card">

            <div className="seller-edit-card-header">

              <div className="seller-edit-card-number">
                01
              </div>

              <div>

                <h2>
                  Basic Information
                </h2>

                <p>
                  Tell buyers what your project
                  is about.
                </p>

              </div>

            </div>

            <div className="seller-edit-fields">

              <div className="seller-edit-field full">

                <label htmlFor="title">
                  Project Title
                  <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={
                    formData.title
                  }
                  onChange={(event) =>
                    handleChange(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Student Attendance Management System"
                  required
                />

              </div>

              <div className="seller-edit-field full">

                <label htmlFor="description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  value={
                    formData.description
                  }
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe your project, its purpose and what buyers will receive..."
                  rows={6}
                  required
                />

              </div>

              <div className="seller-edit-field">

                <label htmlFor="category">
                  Category
                  <span>*</span>
                </label>

                <select
                  id="category"
                  value={
                    formData.category
                  }
                  onChange={(event) =>
                    handleChange(
                      "category",
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Mobile Development">
                    Mobile Development
                  </option>

                  <option value="Desktop Application">
                    Desktop Application
                  </option>

                  <option value="AI / Machine Learning">
                    AI / Machine Learning
                  </option>

                  <option value="Data Science">
                    Data Science
                  </option>

                  <option value="Database">
                    Database
                  </option>

                  <option value="Networking">
                    Networking
                  </option>

                  <option value="Software Engineering">
                    Software Engineering
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="seller-edit-field">

                <label htmlFor="technologies">
                  Technologies
                  <span>*</span>
                </label>

                <input
                  id="technologies"
                  type="text"
                  value={
                    formData.technologies
                  }
                  onChange={(event) =>
                    handleChange(
                      "technologies",
                      event.target.value
                    )
                  }
                  placeholder="PHP, MySQL, HTML, CSS, JavaScript"
                  required
                />

                <small>
                  Separate technologies with commas.
                </small>

              </div>

            </div>

          </section>

          {/* ==========================================
              02 ACADEMIC INFORMATION
          ========================================== */}

          <section className="seller-edit-card">

            <div className="seller-edit-card-header">

              <div className="seller-edit-card-number">
                02
              </div>

              <div>

                <h2>
                  Academic Information
                </h2>

                <p>
                  Help buyers understand the
                  academic context of your project.
                </p>

              </div>

            </div>

            <div className="seller-edit-fields">

              <div className="seller-edit-field">

                <label htmlFor="course">
                  Course
                  <span>*</span>
                </label>

                <input
                  id="course"
                  type="text"
                  value={
                    formData.course
                  }
                  onChange={(event) =>
                    handleChange(
                      "course",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Web Technologies"
                  required
                />

              </div>

              <div className="seller-edit-field">

                <label htmlFor="university">
                  University
                  <span>*</span>
                </label>

                <input
                  id="university"
                  type="text"
                  value={
                    formData.university
                  }
                  onChange={(event) =>
                    handleChange(
                      "university",
                      event.target.value
                    )
                  }
                  placeholder="e.g. American International University-Bangladesh"
                  required
                />

              </div>

            </div>

          </section>

          {/* ==========================================
              03 PRICING
          ========================================== */}

          <section className="seller-edit-card">

            <div className="seller-edit-card-header">

              <div className="seller-edit-card-number">
                03
              </div>

              <div>

                <h2>
                  Pricing & Delivery
                </h2>

                <p>
                  Set your project price and
                  expected delivery time.
                </p>

              </div>

            </div>

            <div className="seller-edit-fields">

              <div className="seller-edit-field">

                <label htmlFor="price">
                  Project Price
                  <span>*</span>
                </label>

                <div className="seller-edit-input-prefix">

                  <span>
                    ৳
                  </span>

                  <input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={
                      formData.price
                    }
                    onChange={(event) =>
                      handleChange(
                        "price",
                        event.target.value
                      )
                    }
                    placeholder="5000"
                    required
                  />

                </div>

              </div>

              <div className="seller-edit-field">

                <label htmlFor="deliveryDays">
                  Delivery Time
                  <span>*</span>
                </label>

                <div className="seller-edit-input-suffix">

                  <input
                    id="deliveryDays"
                    type="number"
                    min="1"
                    step="1"
                    value={
                      formData.deliveryDays
                    }
                    onChange={(event) =>
                      handleChange(
                        "deliveryDays",
                        event.target.value
                      )
                    }
                    placeholder="7"
                    required
                  />

                  <span>
                    days
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ==========================================
              04 DELIVERABLES
          ========================================== */}

          <section className="seller-edit-card">

            <div className="seller-edit-card-header">

              <div className="seller-edit-card-number">
                04
              </div>

              <div>

                <h2>
                  Deliverables
                </h2>

                <p>
                  List everything included with
                  the project.
                </p>

              </div>

            </div>

            <div className="seller-edit-fields">

              <div className="seller-edit-field full">

                <label htmlFor="deliverables">
                  Deliverables
                  <span>*</span>
                </label>

                <textarea
                  id="deliverables"
                  value={
                    formData.deliverables
                  }
                  onChange={(event) =>
                    handleChange(
                      "deliverables",
                      event.target.value
                    )
                  }
                  placeholder="Source Code, Database SQL File, Documentation, UML Diagram, Screenshots, Setup Guide"
                  rows={5}
                  required
                />

                <small>
                  Separate deliverables with commas.
                </small>

              </div>

            </div>

          </section>

          {/* ==========================================
              05 LISTING SETTINGS
          ========================================== */}

          <section className="seller-edit-card">

            <div className="seller-edit-card-header">

              <div className="seller-edit-card-number">
                05
              </div>

              <div>

                <h2>
                  Listing Settings
                </h2>

                <p>
                  Control how your project appears
                  in the marketplace.
                </p>

              </div>

            </div>

            <div className="seller-edit-settings">

              {/* IMAGE */}

              <div className="seller-edit-setting seller-edit-image-setting">

                <div className="seller-edit-image-content">

                  <strong>
                    Project Image
                  </strong>

                  <p>
                    Upload an image from your
                    Mac or PC.
                  </p>

                  <div className="seller-edit-image-upload">

                    {imagePreview ? (
                      <div className="seller-edit-image-preview">

                        <img
                          src={imagePreview}
                          alt="Project preview"
                        />

                        <button
                          type="button"
                          onClick={
                            removeSelectedImage
                          }
                          className="seller-edit-image-remove"
                        >
                          Choose Different Image
                        </button>

                      </div>
                    ) : (
                      <label
                        htmlFor="projectImage"
                        className="seller-edit-image-label"
                      >

                        <span className="seller-edit-image-icon">
                          ↑
                        </span>

                        <strong>
                          Choose Image
                        </strong>

                        <small>
                          JPG, PNG or WebP · Max 5 MB
                        </small>

                      </label>
                    )}

                    <input
                      id="projectImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="seller-edit-file-input"
                    />

                  </div>

                  {selectedImage && (
                    <small>
                      Selected:
                      {" "}
                      <strong>
                        {selectedImage.name}
                      </strong>
                    </small>
                  )}

                </div>

              </div>

              {/* AVAILABILITY */}

              <div className="seller-edit-setting">

                <div>

                  <strong>
                    Project Availability
                  </strong>

                  <p>
                    Allow buyers to see and purchase
                    this project.
                  </p>

                </div>

                <label className="seller-edit-switch">

                  <input
                    type="checkbox"
                    checked={
                      formData.isAvailable
                    }
                    onChange={(event) =>
                      handleChange(
                        "isAvailable",
                        event.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

              <div className="seller-edit-info">

                <span>
                  ⓘ
                </span>

                <p>
                  Updating your project will send it
                  back to
                  {" "}
                  <strong>
                    Pending Approval
                  </strong>.
                  An admin will review the changes before
                  the updated listing appears in the
                  marketplace.
                </p>

              </div>

            </div>

          </section>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="seller-edit-actions">

            <Link
              to="/dashboard"
              className="seller-edit-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="seller-edit-save"
              disabled={isSaving}
            >
              {uploadProgress
                ? "Uploading Image..."
                : isSaving
                  ? "Saving Changes..."
                  : "Save Changes →"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default SellerProjectEdit;