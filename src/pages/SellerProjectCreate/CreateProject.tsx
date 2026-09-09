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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
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

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

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
      formData.deliverables.length === 0
    ) {
      setErrorMessage(
        "Please select at least one deliverable."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setErrorMessage(
        "You are not logged in. Please login first."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:5038/api/Projects",
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
              formData.imageUrl.trim() ||
              null,

            isAvailable:
              formData.isAvailable,
          }),
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

      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Unable to create the project."
        );
      }

      setSuccessMessage(
        "Project created successfully. It is now waiting for admin approval."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the project."
      );
    } finally {
      setIsSubmitting(false);
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

              <div className="seller-project-create-field full-width">

                <label className="seller-project-create-label">
                  Project Image URL
                </label>

                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="seller-project-create-input"
                  placeholder="https://example.com/project-image.jpg"
                />

                <p className="seller-project-create-help">
                  Optional. You can add an image URL
                  for your project.
                </p>

              </div>

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
              {isSubmitting
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