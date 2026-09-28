import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // Новое правило eslint-plugin-react-hooks 6 (React Compiler). Срабатывает на
      // рабочий код вида useEffect(() => setOpen(false), [pathname]).
      // Оставлено предупреждением, пока эти места не переписаны.
      "react-hooks/set-state-in-effect": "warn"
    }
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts", "content/**", "docs/**", "public/**"])
]);
