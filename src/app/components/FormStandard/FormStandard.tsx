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
import { useRouter } from "next/navigation"; // Импортируйте useRouter из next/navigation

export type FormData = {
  phone: string;
  country: string;
  email: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void; // Функция обратного вызова для успешной отправки
  form: any;
  offerButtonCustomText?: string;
}

const FormStandard: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  offerButtonCustomText
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    phone: false,
    country: false,
    email: false
  });

  const dataForm = form.form;
  const router = useRouter(); // Используйте useRouter из next/navigation

  useEffect(() => {
    const interval = setInterval(() => {
      ["phone", "country", "email"].forEach(field => {
        const input = document.getElementById(field) as HTMLInputElement;
        if (input && input.value) {
          setFilled(f => ({ ...f, [field]: true }));
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilled(prev => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const initialValues: FormData = {
    phone: "",
    country: "",
    email: "",
    agreedToPolicy: false
  };

  const validationSchema = Yup.object({
    phone: Yup.string().required(`${dataForm.validationPhoneRequired}`),
    country: Yup.string().required(`${dataForm.validationCountryRequired}`),
    email: Yup.string()
      .email(`${dataForm.validationEmailRequired}`)
      .required(`${dataForm.validationEmailInvalid}`),
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
      const response = await axios.post("/api/monday", values);
      if (response.data.message === "Email sent") {
        resetForm({});
        setFilled({ phone: false, country: false, email: false }); // Reset the filled state
        onFormSubmitSuccess && onFormSubmitSuccess();
        router.push("/success"); // Перенаправление на страницу success
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      setMessage(`${dataForm.errorMessage}`);
      setTimeout(() => {
        setMessage(null);
      }, 7000);
    } finally {
      setSubmitting(false);
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
                className={`${styles.label} ${styles.labelPhone} ${filled.phone ? styles.filled : ""}`}
              >
                {dataForm.inputPhone}
              </label>
              <PhoneInput
                // defaultCountry="PL"
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
            <div className={styles.inputWrapper}>
              <label
                htmlFor="country"
                className={`${styles.label} ${filled.country ? styles.filled : ""}`}
              >
                {dataForm.inputCountry}
              </label>
              <Field
                id="country"
                name="country"
                type="text"
                className={`${styles.inputField} w-full rounded-md`}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="country"
                component="div"
                className={styles.error}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="email"
                className={`${styles.label} ${filled.email ? styles.filled : ""}`}
              >
                {dataForm.inputEmail}
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className={`${styles.inputField} w-full rounded-md`}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="email"
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
                {isSubmitting ? (
                  <div className={styles.loader}></div>
                ) : offerButtonCustomText ? (
                  offerButtonCustomText
                ) : (
                  dataForm.buttonText
                )}
              </button>
            </div>
            <div className={styles.customCheckbox}>
              <Field
                type="checkbox"
                name="agreedToPolicy"
                id="agreedToPolicy"
              />
              <ErrorMessage
                name="agreedToPolicy"
                component="div"
                className={styles.errorCheckbox}
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

export default FormStandard;
