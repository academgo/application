"use client";

import { ComponentProps, useCallback, useEffect, useRef, useState } from "react";
import type PhoneInputType from "react-phone-number-input";

type Props = ComponentProps<typeof PhoneInputType>;

// react-phone-number-input с метаданными всех стран — ~150 КБ JS, а в HTML
// каждой формы — ~250 <option> со странами. Формы стоят ниже первого экрана,
// поэтому библиотека грузится после load (в простое браузера) или сразу,
// когда посетитель трогает поле. До этого — та же разметка без списка стран.
const loadPhoneInput = () => import("react-phone-number-input");

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void) => number;
};

const LazyPhoneInput = (props: Props) => {
  const [PhoneInput, setPhoneInput] = useState<typeof PhoneInputType | null>(
    null
  );
  const [focusOnLoad, setFocusOnLoad] = useState(false);
  const placeholderRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    loadPhoneInput().then(module => {
      // посетитель мог нажать на поле ещё до гидратации, когда onFocus не
      // работал: фокус переносим на настоящее поле
      if (document.activeElement === placeholderRef.current) {
        setFocusOnLoad(true);
      }
      setPhoneInput(() => module.default);
    });
  }, []);

  useEffect(() => {
    if (document.activeElement === placeholderRef.current) load();

    const start = () => {
      const win = window as IdleWindow;
      if (win.requestIdleCallback) win.requestIdleCallback(load);
      else setTimeout(load, 200);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => window.removeEventListener("load", start);
  }, [load]);

  const { className, id, name, placeholder, internationalIcon: Icon } = props;

  // PhoneInput не передаёт autoFocus своему полю, а поле-заглушка при замене
  // исчезает вместе с фокусом — возвращаем его вручную
  useEffect(() => {
    if (PhoneInput && focusOnLoad && id) document.getElementById(id)?.focus();
  }, [PhoneInput, focusOnLoad, id]);

  if (PhoneInput) {
    return <PhoneInput {...props} />;
  }

  return (
    <div className={`${className ? `${className} ` : ""}PhoneInput`}>
      <div className="PhoneInputCountry">
        <select
          name="phoneCountry"
          aria-label="Phone number country"
          className="PhoneInputCountrySelect"
          tabIndex={-1}
          onPointerDown={load}
        >
          <option value="">International</option>
        </select>
        <div aria-hidden="true" className="PhoneInputCountryIcon">
          {Icon ? <Icon title="International" /> : null}
        </div>
        <div className="PhoneInputCountrySelectArrow"></div>
      </div>
      <input
        ref={placeholderRef}
        type="tel"
        autoComplete="tel"
        id={id}
        className="PhoneInputInput"
        name={name}
        placeholder={placeholder}
        readOnly
        onFocus={() => {
          setFocusOnLoad(true);
          load();
        }}
        onPointerDown={load}
      />
    </div>
  );
};

export default LazyPhoneInput;
