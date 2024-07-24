"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./MultiStepForm.module.scss";

type FormData = {
  question1: string;
  question2: string;
  email: string;
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    question1: "",
    question2: "",
    email: ""
  });

  const validationSchema = [
    Yup.object({
      question1: Yup.string().required("This field is required")
    }),
    Yup.object({
      question2: Yup.string().required("This field is required")
    }),
    Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("This field is required")
    })
  ];

  const handleNext = (values: FormData) => {
    setFormData({ ...formData, ...values });
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (
    values: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    setSubmitting(true);
    try {
      await axios.post("/api/email", values);
      alert("Email sent successfully!");
    } catch (error) {
      alert("Error sending email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.multiStepForm}>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema[step - 1]}
        onSubmit={step === 3 ? handleSubmit : handleNext}
      >
        {({ isSubmitting }) => (
          <Form>
            {step === 1 && (
              <div>
                <label htmlFor="question1">Question 1</label>
                <Field name="question1" type="text" />
                <ErrorMessage name="question1" component="div" />
                <button type="button" onClick={() => handleNext(formData)}>
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <label htmlFor="question2">Question 2</label>
                <Field name="question2" type="text" />
                <ErrorMessage name="question2" component="div" />
                <button type="button" onClick={handlePrev}>
                  Previous
                </button>
                <button type="button" onClick={() => handleNext(formData)}>
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div>
                <label htmlFor="email">Email</label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component="div" />
                <button type="button" onClick={handlePrev}>
                  Previous
                </button>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepForm;
