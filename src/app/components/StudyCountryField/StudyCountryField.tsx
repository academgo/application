"use client";

import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import {
  STUDY_COUNTRIES,
  UNDECIDED_STUDY_COUNTRY,
  detectStudyDestinationCode
} from "@/lib/studyDestination";
import { CheckIcon, ChevronIcon, FieldIcon } from "../FormIcons/FormIcons";
import styles from "./StudyCountryField.module.scss";

type Props = {
  id: string;
  lang: string;
  value: string;
  onChange: (code: string) => void;
};

type Position = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
};

const LIST_MAX_HEIGHT = 300;
const GAP = 6;

/**
 * Поле «Страна обучения». На странице страны его не видно — страна берётся
 * из адреса. На общих страницах человек выбирает её сам.
 *
 * Список свой, в стиле сайта. Он открывается в портале поверх страницы:
 * формы стоят в попапе и карточках с overflow: hidden, внутри них список бы
 * обрезался. Обязательность поля держит скрытый нативный select — браузер
 * сам не даст отправить форму без страны и покажет подсказку у поля.
 */
const StudyCountryField: FC<Props> = ({ id, lang, value, onChange }) => {
  // До гидрации не знаем адрес — поле не рисуем, чтобы не мигало
  const [mode, setMode] = useState<"pending" | "auto" | "select">("pending");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [invalid, setInvalid] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const isEnglish = lang === "en";
  const placeholder = isEnglish ? "Country of study" : "Страна обучения";

  const options = [
    ...STUDY_COUNTRIES.map(country => ({
      value: country.code,
      label: isEnglish ? country.en : country.ru
    })),
    {
      value: UNDECIDED_STUDY_COUNTRY,
      label: isEnglish ? "Not decided yet" : "Пока не решил(а)"
    }
  ];
  const selected = options.find(option => option.value === value);

  useEffect(() => {
    const code = detectStudyDestinationCode(window.location.href);
    if (code) {
      onChange(code);
      setMode("auto");
    } else {
      setMode("select");
    }
    // onChange меняется на каждом рендере формы — определяем страну один раз
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Список под полем, а если снизу не хватает места — над ним
  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const below = window.innerHeight - rect.bottom - GAP * 2;
    const above = rect.top - GAP * 2;
    const openUp = below < Math.min(LIST_MAX_HEIGHT, 220) && above > below;

    setPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(LIST_MAX_HEIGHT, openUp ? above : below),
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP })
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    // capture: прокручиваться может и попап, а не только страница
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  // Клик мимо поля и списка закрывает список
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Активный пункт всегда в зоне видимости списка
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openList = () => {
    const index = options.findIndex(option => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setInvalid(false);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex(index => Math.min(index + 1, last));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(index => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        // Поиск по первой букве: «И» → Италия, Испания…
        if (event.key.length === 1) {
          const letter = event.key.toLowerCase();
          const start = activeIndex + 1;
          const found = [...options.slice(start), ...options.slice(0, start)]
            .map(option => option.label.toLowerCase())
            .findIndex(label => label.startsWith(letter));
          if (found >= 0) setActiveIndex((start + found) % options.length);
        }
    }
  };

  if (mode !== "select") return null;

  return (
    <div className={styles.field}>
      <FieldIcon name="cap" />

      {/* Держит обязательность поля и значение для нативной отправки формы */}
      <select
        id={id}
        name="studyCountry"
        required
        value={value}
        onChange={event => onChange(event.target.value)}
        onInvalid={() => setInvalid(true)}
        onFocus={() => buttonRef.current?.focus()}
        tabIndex={-1}
        aria-hidden="true"
        className={styles.nativeSelect}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${
          invalid && !value ? styles.triggerInvalid : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        aria-label={
          selected ? `${placeholder}: ${selected.label}` : placeholder
        }
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon className={styles.chevron} />
      </button>

      {open &&
        position &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={placeholder}
            className={styles.list}
            style={{
              left: position.left,
              width: position.width,
              top: position.top,
              bottom: position.bottom,
              maxHeight: position.maxHeight
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={option.value === value}
                className={`${styles.option} ${
                  index === activeIndex ? styles.optionActive : ""
                } ${option.value === value ? styles.optionSelected : ""} ${
                  option.value === UNDECIDED_STUDY_COUNTRY
                    ? styles.optionSeparated
                    : ""
                }`}
                onPointerEnter={() => setActiveIndex(index)}
                // mousedown гасим: кнопка поля не теряет фокус при выборе
                onMouseDown={event => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <CheckIcon className={styles.check} />
                )}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default StudyCountryField;
