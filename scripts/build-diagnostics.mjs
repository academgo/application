/**
 * Временная диагностика сборочного контейнера.
 *
 * Сборка на хостинге виснет на этапе компиляции и умирает по таймауту,
 * не печатая ни строчки. Лимиты контейнера поддержке не видны, поэтому
 * спрашиваем у него самого: сколько ядер и памяти он отдаёт процессу и
 * до каких хостов дотягивается.
 *
 * Выполняется за секунды, ничего не ломает, всегда завершается успешно —
 * сборка идёт дальше в любом случае. Удалить, когда причина найдена.
 */

import os from "node:os";
import v8 from "node:v8";

const mb = bytes => Math.round(bytes / 1024 / 1024);

console.log("=== Сборочный контейнер ===");
console.log("ядер (os.cpus):      ", os.cpus().length);
console.log("availableParallelism:", os.availableParallelism?.() ?? "нет метода");
console.log("память всего, МБ:    ", mb(os.totalmem()));
console.log("память свободна, МБ: ", mb(os.freemem()));
console.log("node:                ", process.version);
console.log("платформа:           ", `${os.platform()} ${os.arch()}`);
console.log("NODE_OPTIONS:        ", process.env.NODE_OPTIONS ?? "не задан");
console.log("куча V8, лимит МБ:   ", mb(v8.getHeapStatistics().heap_size_limit));

/** Проверяем доступность хостов, от которых зависит сборка и работа сайта */
const hosts = [
  "https://registry.npmjs.org/-/ping",
  "https://api.sanity.io/v1/ping",
  "https://apicdn.sanity.io",
  "https://cdn.sanity.io",
  "https://fonts.gstatic.com",
  "https://telemetry.nextjs.org"
];

console.log("\n=== Доступность хостов (таймаут 5 с) ===");

for (const url of hosts) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(5000)
    });
    console.log(`ok       ${url} → ${response.status} за ${Date.now() - started} мс`);
  } catch (error) {
    console.log(`ОШИБКА   ${url} → ${error.name}: ${error.message} за ${Date.now() - started} мс`);
  }
}

console.log("\n=== Диагностика закончена, запускаем сборку ===\n");
