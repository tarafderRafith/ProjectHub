
import {
  useState,
} from "react";

import type {
  SyntheticEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./CreateProject.css";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  technologies: string;
  course: string;
  university: string;
  price: string;
  deliveryDays: string;
  deliverables: string[];
  imageUrl: string;
  isAvailable: boolean;
}

const API_BASE_URL =
  "http://localhost:5038";

const availableDeliverables = [
  "Source Code",
  "Database / SQL File",
  "Documentation",
  "Project Report",
  "UML Diagram",
  "ER Diagram",
  "Screenshots",
  "Presentation Slides",
  "Setup Guide",
  "Demo / Video",
  "Viva Support",
];

const CreateProject = () => {
  const navigate = useNavigate();

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
      deliverables: [],
      imageUrl: "",
      isAvailable: true,
    });

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // ==========================================
  // GET TOKEN
  // ==========================================

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

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    if (type === "checkbox") {
      const checked =
        (
          event.target as HTMLInputElement
        ).checked;

      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE SELECTION
  // ==========================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage("");
    setSuccessMessage("");

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

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Only JPG, JPEG, PNG and WebP images are allowed."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        "Image size must be 5 MB or smaller."
      );

      event.target.value = "";

      return;
    }

    // Remove old preview URL
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);

    setImagePreview(
      previewUrl
    );
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);

    setImagePreview("");

    const imageInput =
      document.getElementById(
        "projectImage"
      ) as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = "";
    }
  };

  // ==========================================
  // HANDLE DELIVERABLE
  // ==========================================

  const handleDeliverableChange = (
    deliverable: string
  ) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.deliverables.includes(
          deliverable
        );

      const updatedDeliverables =
        alreadySelected
          ? previous.deliverables.filter(
              (item) =>
                item !== deliverable
            )
          : [
              ...previous.deliverables,
              deliverable,
            ];

      return {
        ...previous,
        deliverables:
          updatedDeliverables,
      };
    });
  };

  // ==========================================
  // UPLOAD PROJECT IMAGE
  // ==========================================

  const uploadImage = async (
    token: string
  ): Promise<string> => {
    if (!selectedImage) {
      throw new Error(
        "No project image has been selected."
      );
    }

    const imageFormData =
      new FormData();

    imageFormData.append(
      "image",
      selectedImage,
      selectedImage.name
    );

    setUploadProgress(true);

    try {
      console.log(
        "=========================================="
      );

      console.log(
        "PROJECT IMAGE UPLOAD"
      );

      console.log(
        "File:",
        selectedImage.name
      );

      console.log(
        "Type:",
        selectedImage.type
      );

      console.log(
        "Size:",
        selectedImage.size
      );

      console.log(
        "API:",
        `${API_BASE_URL}/api/Projects/upload-image`
      );

      console.log(
        "Token exists:",
        Boolean(token)
      );

      console.log(
        "=========================================="
      );

      let response: Response;

      try {
        response = await fetch(
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
      } catch (networkError) {
        console.error(
          "IMAGE UPLOAD NETWORK ERROR:",
          networkError
        );

        throw new Error(
          "Could not connect to the ProjectHub API. Make sure the backend is running on http://localhost:5038."
        );
      }

      console.log(
        "Upload HTTP status:",
        response.status
      );

      console.log(
        "Upload status text:",
        response.statusText
      );

      console.log(
        "Upload response type:",
        response.headers.get(
          "content-type"
        )
      );

      const responseText =
        await response.text();

      console.log(
        "Upload response:",
        responseText
      );

      let result: any = null;

      if (responseText.trim()) {
        try {
          result =
            JSON.parse(
              responseText
            );
        } catch {
          result = {
            message:
              responseText,
          };
        }
      }

      // ==========================================
      // HANDLE HTTP ERRORS
      // ==========================================

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your login session has expired. Please log in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You do not have permission to upload project images. Make sure your account role is Seller."
          );
        }

        if (response.status === 404) {
          throw new Error(
            "Image upload API was not found. Make sure the backend is running the latest ProjectsController."
          );
        }

        if (response.status === 413) {
          throw new Error(
            "The image is too large for the server."
          );
        }

        if (response.status >= 500) {
          throw new Error(
            result?.message ||
            result?.error ||
            "The ProjectHub server encountered an error while saving the image."
          );
        }

        throw new Error(
          result?.message ||
          result?.error ||
          `Image upload failed with HTTP ${response.status}.`
        );
      }

      // ==========================================
      // CHECK IMAGE URL
      // ==========================================

      const uploadedImageUrl =
        result?.imageUrl;

      if (
        !uploadedImageUrl ||
        typeof uploadedImageUrl !==
          "string"
      ) {
        console.error(
          "Upload succeeded but imageUrl is missing.",
          result
        );

        throw new Error(
          "The server accepted the image but did not return an image URL."
        );
      }

      console.log(
        "Image uploaded successfully:"
      );

      console.log(
        uploadedImageUrl
      );

      console.log(
        "=========================================="
      );

      return uploadedImageUrl;
    } finally {
      setUploadProgress(false);
    }
  };

  // ==========================================
  // CREATE PROJECT
  // ==========================================

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    setSuccessMessage("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!formData.title.trim()) {
      setErrorMessage(
        "Please enter a project title."
      );

      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage(
        "Please enter a project description."
      );

      return;
    }

    if (!formData.category) {
      setErrorMessage(
        "Please select a category."
      );

      return;
    }

    if (!formData.technologies.trim()) {
      setErrorMessage(
        "Please enter the technologies used."
      );

      return;
    }

    if (!formData.course.trim()) {
      setErrorMessage(
        "Please enter the course name."
      );

      return;
    }

    if (!formData.university.trim()) {
      setErrorMessage(
        "Please enter the university name."
      );

      return;
    }

    const price =
      Number(formData.price);

    const deliveryDays =
      Number(formData.deliveryDays);

    if (
      !formData.price ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      setErrorMessage(
        "Please enter a valid project price."
      );

      return;
    }

    if (
      !formData.deliveryDays ||
      Number.isNaN(deliveryDays) ||
      deliveryDays <= 0
    ) {
      setErrorMessage(
        "Please enter a valid delivery time."
      );

      return;
    }

    if (
      formData.deliverables.length ===
      0
    ) {
      setErrorMessage(
        "Please select at least one deliverable."
      );

      return;
    }

    // ==========================================
    // TOKEN
    // ==========================================

    const token = getToken();

    if (!token) {
      setErrorMessage(
        "You are not logged in. Please login first."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      // ==========================================
      // UPLOAD IMAGE
      // ==========================================

      let uploadedImageUrl:
        string | null = null;

      if (selectedImage) {
        uploadedImageUrl =
          await uploadImage(
            token
          );
      }

      // ==========================================
      // CREATE PROJECT
      // ==========================================

      const response =
        await fetch(
          `${API_BASE_URL}/api/Projects`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              category:
                formData.category,

              technologies:
                formData.technologies.trim(),

              course:
                formData.course.trim(),

              university:
                formData.university.trim(),

              price,

              deliveryDays,

              deliverables:
                formData.deliverables.join(
                  ", "
                ),

              imageUrl:
                uploadedImageUrl,

              isAvailable:
                formData.isAvailable,
            }),
          }
        );

      const responseText =
        await response.text();

      let result: any = null;

      if (responseText.trim()) {
        try {
          result =
            JSON.parse(
              responseText
            );
        } catch {
          result = {
            message:
              responseText,
          };
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your login session has expired. Please log in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Only Seller accounts can create projects."
          );
        }

        throw new Error(
          result?.message ||
          result?.error ||
          `Unable to create the project. HTTP ${response.status}.`
        );
      }

      setSuccessMessage(
        "Project created successfully. It is now waiting for admin approval."
      );

      setTimeout(() => {
        navigate(
          "/dashboard"
        );
      }, 1500);
    } catch (error) {
      console.error(
        "CREATE PROJECT ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the project."
      );
    } finally {
      setIsSubmitting(false);

      setUploadProgress(false);
    }
  };

  return (
    <div className="seller-project-create-page">

      <div className="seller-project-create-container">

        <div className="seller-project-create-header">

          <div className="seller-project-create-header-left">

            <Link
              to="/dashboard"
              className="seller-project-create-back"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="seller-project-create-title">
              Create New Project
            </h1>

            <p className="seller-project-create-subtitle">
              List your project on ProjectHub and
              connect with students looking for
              project resources.
            </p>

          </div>

          <div className="seller-project-create-badge">
            Seller
          </div>

        </div>

        <form
          className="seller-project-create-form"
          onSubmit={handleSubmit}
        >

          {/* ==========================================
              SECTION 01
          ========================================== */}

          <section className="seller-project-create-section">

            <div className="seller-project-create-section-header">

              <div className="seller-project-create-section-number">
                01
              </div>

              <div>

                <h2 className="seller-project-create-section-title">
                  Basic Information
                </h2>

                <p className="seller-project-create-section-description">
                  Give buyers a clear idea about your
                  project.
                </p>

              </div>

            </div>

            <div className="seller-project-create-grid">

              <div className="seller-project-create-field full-width">

                <label className="seller-project-create-label">
                  Project Title
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="seller-project-create-input"
                  placeholder="e.g. Student Attendance Management System"
                />

              </div>

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  Category
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="seller-project-create-select"
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

                  <option value="Database">
                    Database
                  </option>

                  <option value="IoT">
                    IoT
                  </option>

                  <option value="Graphics">
                    Graphics
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  Technologies
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="seller-project-create-input"
                  placeholder="e.g. React, TypeScript, Node.js"
                />

                <p className="seller-project-create-help">
                  Separate technologies with commas.
                </p>

              </div>

              <div className="seller-project-create-field full-width">

                <label className="seller-project-create-label">
                  Project Description
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="seller-project-create-textarea"
                  placeholder="Explain what the project does, its main features, and what buyers will receive."
                />

              </div>

            </div>

          </section>

          {/* ==========================================
              SECTION 02
          ========================================== */}

          <section className="seller-project-create-section">

            <div className="seller-project-create-section-header">

              <div className="seller-project-create-section-number">
                02
              </div>

              <div>

                <h2 className="seller-project-create-section-title">
                  Academic Information
                </h2>

                <p className="seller-project-create-section-description">
                  Help buyers find projects relevant
                  to their courses.
                </p>

              </div>

            </div>

            <div className="seller-project-create-grid">

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  Course
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="seller-project-create-input"
                  placeholder="e.g. Web Technologies"
                />

              </div>

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  University
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="seller-project-create-input"
                  placeholder="e.g. American International University-Bangladesh"
                />

              </div>

            </div>

          </section>

          {/* ==========================================
              SECTION 03
          ========================================== */}

          <section className="seller-project-create-section">

            <div className="seller-project-create-section-header">

              <div className="seller-project-create-section-number">
                03
              </div>

              <div>

                <h2 className="seller-project-create-section-title">
                  Pricing & Delivery
                </h2>

                <p className="seller-project-create-section-description">
                  Set your project price and expected
                  delivery time.
                </p>

              </div>

            </div>

            <div className="seller-project-create-grid">

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  Price
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <div className="seller-project-create-input-prefix">

                  <span>
                    ৳
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="seller-project-create-input"
                    placeholder="5000"
                    min="1"
                  />

                </div>

              </div>

              <div className="seller-project-create-field">

                <label className="seller-project-create-label">
                  Delivery Time
                  <span className="seller-project-create-required">
                    *
                  </span>
                </label>

                <div className="seller-project-create-input-suffix">

                  <input
                    type="number"
                    name="deliveryDays"
                    value={formData.deliveryDays}
                    onChange={handleChange}
                    className="seller-project-create-input"
                    placeholder="7"
                    min="1"
                  />

                  <span>
                    days
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ==========================================
              SECTION 04
          ========================================== */}

          <section className="seller-project-create-section">

            <div className="seller-project-create-section-header">

              <div className="seller-project-create-section-number">
                04
              </div>

              <div>

                <h2 className="seller-project-create-section-title">
                  Deliverables
                </h2>

                <p className="seller-project-create-section-description">
                  Select everything that is included
                  with your project.
                </p>

              </div>

            </div>

            <div className="seller-project-create-field">

              <label className="seller-project-create-label">

                What does your project include?

                <span className="seller-project-create-required">
                  *
                </span>

              </label>

              <div className="seller-project-create-deliverables">

                {availableDeliverables.map(
                  (deliverable) => (
                    <label
                      key={deliverable}
                      className={`seller-project-create-checkbox ${
                        formData.deliverables.includes(
                          deliverable
                        )
                          ? "selected"
                          : ""
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={formData.deliverables.includes(
                          deliverable
                        )}
                        onChange={() =>
                          handleDeliverableChange(
                            deliverable
                          )
                        }
                      />

                      <span className="seller-project-create-checkbox-box">
                        ✓
                      </span>

                      <span className="seller-project-create-checkbox-text">
                        {deliverable}
                      </span>

                    </label>
                  )
                )}

              </div>

              <p className="seller-project-create-help">
                Select all deliverables that buyers
                will receive with this project.
              </p>

              {formData.deliverables.length > 0 && (
                <div className="seller-project-create-selected">

                  <span>
                    Selected:
                  </span>

                  <strong>
                    {formData.deliverables.length}
                  </strong>

                  <span>
                    {formData.deliverables.length === 1
                      ? "deliverable"
                      : "deliverables"}
                  </span>

                </div>
              )}

            </div>

          </section>

          {/* ==========================================
              SECTION 05
          ========================================== */}

          <section className="seller-project-create-section">

            <div className="seller-project-create-section-header">

              <div className="seller-project-create-section-number">
                05
              </div>

              <div>

                <h2 className="seller-project-create-section-title">
                  Listing Settings
                </h2>

                <p className="seller-project-create-section-description">
                  Configure how your project appears
                  in the marketplace.
                </p>

              </div>

            </div>

            <div className="seller-project-create-grid">

              {/* ==========================================
                  IMAGE UPLOAD
              ========================================== */}

              <div className="seller-project-create-field full-width">

                <label className="seller-project-create-label">
                  Project Image
                </label>

                <div className="project-image-upload-box">

                  {imagePreview ? (
                    <div className="project-image-preview">

                      <img
                        src={imagePreview}
                        alt="Project preview"
                      />

                      <button
                        type="button"
                        className="project-image-remove"
                        onClick={
                          removeSelectedImage
                        }
                      >
                        Remove Image
                      </button>

                    </div>
                  ) : (
                    <label
                      htmlFor="projectImage"
                      className="project-image-upload-label"
                    >

                      <div className="project-image-upload-icon">
                        ↑
                      </div>

                      <strong>
                        Choose Project Image
                      </strong>

                      <span>
                        Click to select an image
                        from your Mac or PC
                      </span>

                      <small>
                        JPG, PNG or WebP · Maximum 5 MB
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
                    className="project-image-file-input"
                  />

                </div>

                {selectedImage && (
                  <p className="seller-project-create-help">

                    Selected:
                    {" "}

                    <strong>
                      {selectedImage.name}
                    </strong>

                  </p>
                )}

              </div>

              {/* ==========================================
                  AVAILABILITY
              ========================================== */}

              <div className="seller-project-create-toggle-wrapper">

                <div className="seller-project-create-toggle-content">

                  <h3 className="seller-project-create-toggle-title">
                    Make project available
                  </h3>

                  <p className="seller-project-create-toggle-description">
                    Keep this enabled if you want the
                    project to be available after
                    admin approval.
                  </p>

                </div>

                <label className="seller-project-create-toggle">

                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={
                      formData.isAvailable
                    }
                    onChange={handleChange}
                  />

                  <span className="seller-project-create-toggle-slider"></span>

                </label>

              </div>

            </div>

          </section>

          {/* ==========================================
              MESSAGES
          ========================================== */}

          {errorMessage && (
            <div className="seller-project-create-message error">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="seller-project-create-message success">
              {successMessage}
            </div>
          )}

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="seller-project-create-actions">

            <Link
              to="/dashboard"
              className="seller-project-create-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="seller-project-create-submit"
              disabled={isSubmitting}
            >

              {uploadProgress
                ? "Uploading Image..."
                : isSubmitting
                  ? "Creating..."
                  : "Create Project"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateProject;

