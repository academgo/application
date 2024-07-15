"use client";

import { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";

import styles from "../FormStandard/FormStandard.module.scss";

export type FormData = {
  name: string;
  phone: string;
  email: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void; // Функция обратного вызова для успешной отправки
  form: any;
}

const FormSuperLite: FC<ContactFormProps> = ({ onFormSubmitSuccess, form }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    name: false,
    phone: false,
    email: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      ["name", "phone", "email"].forEach(field => {
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
    name: "",
    phone: "",
    email: "",
    agreedToPolicy: false
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Imię jest wymagane"),
    phone: Yup.string().required("Telefon jest wymagany"),
    email: Yup.string()
      .email("Nieprawidłowy адрес email")
      .required("Email jest wymagany"),
    agreedToPolicy: Yup.boolean()
      .required("Wymagana zgoda")
      .oneOf([true], "Wymagana jest zgoda na przetwarzanie danych osobowych")
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
        setFilled({ name: false, phone: false, email: false }); // Reset the filled state
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
                htmlFor="name"
                className={`${styles.label} ${filled.name ? styles.filled : ""}`}
              >
                Imię
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className={`${styles.inputField} w-full rounded-md`}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="phone"
                className={`${styles.label} ${filled.phone ? styles.filled : ""}`}
              >
                Telefon
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
                htmlFor="email"
                className={`${styles.label} ${filled.email ? styles.filled : ""}`}
              >
                E-mail
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
                Wyrażam zgodę na przetwarzanie danych osobowych
              </label>
            </div>
            <div>
              <button
                type="submit"
                className={styles.sentBtn}
                disabled={isSubmitting}
              >
                Wyślij wiadomość
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormSuperLite;
