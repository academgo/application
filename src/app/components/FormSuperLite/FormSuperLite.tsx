"use client";

import { FC, useState, useEffect, useId } from "react";
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
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void;
  form: any;
  offerButtonCustomText?: string;
  buttonCustomText?: string;
}

const FormSuperLite: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  offerButtonCustomText,
  buttonCustomText
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    phone: false
  });

  const dataForm = form.form;
  const uniqueId = useId();
  const router = useRouter(); // Используйте useRouter из next/navigation

  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.getElementById(
        `phone-${uniqueId}`
      ) as HTMLInputElement;
      if (input && input.value) {
        setFilled(f => ({ ...f, phone: true }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [uniqueId]);

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
        resetForm({});
        setFilled({ phone: false });
        setTimeout(() => {
          onFormSubmitSuccess && onFormSubmitSuccess();
          router.push("/success"); // Перенаправление на страницу success
        }, 5000);
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
                htmlFor={`phone-${uniqueId}`}
                className={`${styles.label} ${styles.labelPhone} ${filled.phone ? styles.filled : ""}`}
              >
                {dataForm.inputPhone}
              </label>
              <PhoneInput
                defaultCountry="PL"
                id={`phone-${uniqueId}`}
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
                {isSubmitting ? (
                  <div className={styles.loader}></div>
                ) : buttonCustomText ? (
                  buttonCustomText
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
                id={`agreedToPolicy-${uniqueId}`}
              />
              <label htmlFor={`agreedToPolicy-${uniqueId}`}>
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
