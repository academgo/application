"use client";

import { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "../FormStandard/FormStandard.module.scss";
import { Form as FormType } from "@/types/form";
import Link from "next/link";

export type FormData = {
  phone: string;
  // country: string;
  // email: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void; // Функция обратного вызова для успешной отправки
  form: any;
  offerButtonCustomText?: string;
}

const FormSuperLite: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  offerButtonCustomText
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    phone: false
    // country: false,
    // email: false
  });

  const dataForm = form.form;

  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.getElementById("phone") as HTMLInputElement;
      if (input && input.value) {
        setFilled(f => ({ ...f, phone: true }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilled(prev => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const initialValues: FormData = {
    phone: "",
    agreedToPolicy: false
  };

  const validationSchema = Yup.object({
    phone: Yup.string().required(`${dataForm.validationPhoneRequired}`),
    agreedToPolicy: Yup.boolean()
      .required(`${dataForm.validationAgreementRequired}`)
      .oneOf([true], `${dataForm.validationAgreementOneOf}`)
  });

  const onSubmit = async (
    values: FormData,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/email", values);
      if (response.data.message === "Email sent") {
        setMessage(`${dataForm.successMessage}`);
        resetForm({});
        setFilled({ phone: false }); // Reset the filled state
        setTimeout(() => {
          onFormSubmitSuccess && onFormSubmitSuccess();
        }, 5000);
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      setMessage(`${dataForm.errorMessage}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setMessage(null);
      }, 7000);
    }
  };

  return (
    <>
      {message && <div className={styles.popup}>{message}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="phone"
                className={`${styles.label} ${filled.phone ? styles.filled : ""}`}
              >
                {dataForm.inputPhone}
              </label>
              <PhoneInput
                defaultCountry="PL"
                id="phone"
                name="phone"
                className={`${styles.inputField}`}
                onBlur={handleBlur}
                onChange={value => setFieldValue("phone", value)}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className={styles.error}
              />
            </div>
            <div>
              <button
                type="submit"
                className={styles.sentBtn}
                disabled={isSubmitting}
              >
                {offerButtonCustomText
                  ? offerButtonCustomText
                  : dataForm.buttonText}
              </button>
            </div>
            <div className={styles.customCheckbox}>
              <Field
                type="checkbox"
                name="agreedToPolicy"
                id="agreedToPolicy"
              />
              <label htmlFor="agreedToPolicy">
                {dataForm.agreementText}{" "}
                <Link
                  className={styles.policyLink}
                  href={dataForm.agreementLinkDestination}
                  target="_blank"
                >
                  {dataForm.agreementLinkLabel}
                </Link>
              </label>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormSuperLite;
