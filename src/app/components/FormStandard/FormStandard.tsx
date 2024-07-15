"use client";

import { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";

import styles from "../FormStandard/FormStandard.module.scss";
import { Form as FormType } from "@/types/form";
import Link from "next/link";

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

const FormStandard: FC<ContactFormProps> = ({ onFormSubmitSuccess, form }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    phone: false,
    country: false,
    email: false
  });

  const dataForm = form.form;

  // console.log("dataForm", dataForm);

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
      const response = await axios.post("/api/email", values);
      if (response.data.message === "Email sent") {
        setMessage(
          "Otrzymałem Twoją wiadomość i wkrótce się з Tobą skontaktuję. Poczekaj chwilę :)"
        );
        resetForm({});
        setFilled({ phone: false, country: false, email: false }); // Reset the filled state
        setTimeout(() => {
          onFormSubmitSuccess && onFormSubmitSuccess();
        }, 5000);
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      setMessage("Wystąpił błąd podczas wysyłania formularza");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
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
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="phone"
                className={`${styles.label} ${filled.phone ? styles.filled : ""}`}
              >
                {dataForm.inputPhone}
              </label>
              <Field
                id="phone"
                name="phone"
                type="tel"
                className={`${styles.inputField} w-full rounded-md`}
                onBlur={handleBlur}
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
            <div className={styles.customCheckbox}>
              <Field
                type="checkbox"
                name="agreedToPolicy"
                id="agreedToPolicy"
              />
              <label htmlFor="agreedToPolicy">
                {dataForm.agreementText}{" "}
                <Link href={dataForm.agreementLinkDestination} target="_blank">
                  {dataForm.agreementLinkLabel}
                </Link>
              </label>
            </div>
            <div>
              <button
                type="submit"
                className={styles.sentBtn}
                disabled={isSubmitting}
              >
                {dataForm.buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormStandard;
