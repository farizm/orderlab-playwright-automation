# Полная документация проекта InsuranceLab Playwright Automation Framework

> Current portfolio note: this repository has been domain-adapted into
> InsuranceLab, a P&C insurance QA automation portfolio simulating Commercial
> Property and General Liability quote workflows. Older historical sections may
> mention the original OrderLab demo target because the public app still exposes
> those stable routes, selectors, and API paths.

Этот документ объясняет проект простым языком: что было сделано, зачем это было
сделано, как устроена структура, какие технологии применены, какие тестовые
подходы использованы и как читать историю изменений.

## 1. Что это за проект

OrderLab Playwright Automation Framework — это публичный QA/SDET automation
framework для demo-приложения OrderLab.

OrderLab — это небольшое web-приложение для управления заказами. В нём есть:

- логин customer;
- логин admin;
- каталог продуктов;
- поиск и фильтр по продуктам;
- корзина;
- checkout;
- подтверждение заказа;
- история заказов;
- admin-управление статусом заказа;
- API для продуктов и заказов;
- test-only reset endpoint для возврата тестовых данных в предсказуемое
  состояние.

Главная ценность проекта не в том, что это “большое приложение”. Главная
ценность в том, что вокруг него построен понятный automation framework:

- UI tests;
- API tests;
- Page Object Model;
- fixtures;
- test data helpers;
- API clients;
- lightweight API contract checks;
- accessibility smoke checks;
- GitHub Actions CI;
- HTML reports, screenshots, traces, artifacts;
- документация по архитектуре, стратегии, debugging и решениям.

Проще говоря: это демонстрация того, как SDET организует тестовый проект так,
чтобы его можно было поддерживать, запускать в CI и объяснять другим людям.

## 2. Главная идея архитектуры

Проект построен вокруг простого принципа:

> Тесты должны проверять важное поведение продукта, а не случайные детали HTML.

Поэтому структура разделена на несколько слоёв:

- `tests/ui/` — browser UI tests;
- `tests/api/` — API tests;
- `tests/pages/` — Page Objects;
- `tests/support/` — общие helpers, API clients, test data, contracts;
- `tests/fixtures.ts` — reusable Playwright fixtures для customer/admin login;
- `.github/workflows/playwright.yml` — CI pipeline;
- docs-файлы — объяснение стратегии, архитектуры, решений и troubleshooting.

Это не “набор случайных тестов”. Это маленький, но полноценный test framework.

## 3. Структура проекта

```text
.
├── .github/workflows/playwright.yml
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── TEST_STRATEGY.md
├── DEBUGGING.md
├── AI_QA_WORKFLOW.md
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── docs/
│   ├── PROJECT.md
│   ├── ROADMAP.md
│   ├── STATUS.md
│   ├── DECISIONS.md
│   ├── TEST_DATA_RESET_CONTRACT.md
│   ├── LOVABLE_RESET_IMPLEMENTATION.md
│   └── PROJECT_FULL_DOCUMENTATION.md
└── tests/
    ├── api/
    ├── ui/
    ├── pages/
    ├── support/
    └── fixtures.ts
```

## 4. Для чего нужен каждый важный файл

### `README.md`

Главная страница проекта на GitHub.

Она объясняет:

- что это за framework;
- где находится demo app;
- какие технологии используются;
- какие сценарии покрыты;
- как запустить тесты локально;
- как работает CI;
- какие engineering decisions были приняты.

README должен быть понятен человеку, который впервые открыл repository.

### `ARCHITECTURE.md`

Объясняет архитектуру framework:

- почему есть UI и API слой;
- почему Page Objects маленькие;
- почему нет тяжёлого `BasePage`;
- как устроены fixtures;
- как устроен API client layer;
- почему reset endpoint важен;
- почему accessibility checks добавлены как лёгкий smoke layer.

### `TEST_STRATEGY.md`

Объясняет тестовую стратегию:

- что тестируем;
- что не тестируем в v0.1;
- почему UI tests нужны не для всего;
- почему API tests быстрее и стабильнее для backend behavior;
- как выбираются test data;
- какие locator practices используются;
- что считается “готовым” тестом.

### `DEBUGGING.md`

Файл для troubleshooting.

Он нужен, чтобы быстро понять:

- почему тест мог упасть;
- где смотреть HTML report;
- где искать screenshots/traces;
- что делать с browser install проблемами;
- как читать CI artifacts.

### `AI_QA_WORKFLOW.md`

Документирует AI-assisted QA workflow.

Идея не в том, что AI “магически написал проект”. Идея в том, что AI помогает:

- разложить требования;
- определить риски;
- предложить сценарии;
- сгенерировать черновик кода;
- помочь с refactoring;
- объяснить решения.

Но важные решения должны быть понятны человеку.

### `docs/PROJECT.md`

Краткое описание миссии и текущего scope.

Это stable source of truth: что проект делает и какие принципы важны.

### `docs/ROADMAP.md`

План развития.

Он помогает не прыгать хаотично между идеями. В нём есть:

- что уже сделано;
- активный improvement path;
- parking lot для идей, которые не нужно делать прямо сейчас.

### `docs/STATUS.md`

Текущий статус проекта.

Это рабочий журнал:

- active task;
- acceptance criteria;
- latest evidence;
- blockers;
- next task.

Он нужен, чтобы в следующей сессии не начинать “с нуля”.

### `docs/DECISIONS.md`

Decision log.

Тут фиксируются важные engineering decisions:

- почему API tests не зависят от UI login;
- почему reset endpoint opt-in/test-only;
- почему CI job summaries добавлены;
- почему accessibility smoke checks лёгкие;
- почему Playwright обновлён.

Это помогает объяснять проект как инженер, а не как человек, который просто
запускал команды.

### `docs/TEST_DATA_RESET_CONTRACT.md`

Описывает контракт reset endpoint:

```text
POST /api/public/test/reset
```

Зачем он нужен:

- удалить тестовые orders;
- восстановить predictable product seed data;
- сделать CI runs стабильными;
- не зависеть от мусора, оставленного предыдущими тестами.

### `docs/LOVABLE_RESET_IMPLEMENTATION.md`

Пошаговая инструкция для реализации reset endpoint в Lovable app.

Этот файл нужен потому, что automation repo и app repo разделены.

### `playwright.config.ts`

Главный config Playwright.

Там задаётся:

- base URL;
- browser project;
- retries;
- workers;
- reporter;
- traces/screenshots;
- `data-testid` attribute.

### `.env.example`

Пример переменных окружения.

Важный принцип:

- `.env.example` можно коммитить;
- `.env` нельзя коммитить;
- реальные tokens/secrets должны быть локально или в GitHub Secrets.

### `.github/workflows/playwright.yml`

GitHub Actions pipeline.

Он запускает:

1. TypeScript typecheck;
2. smoke tests;
3. API tests;
4. UI tests.

Каждый Playwright job загружает:

- HTML report;
- screenshots/traces/failure artifacts;
- GitHub Step Summary.

## 5. Технологии

### Playwright

Playwright используется для:

- UI automation;
- API testing через Playwright request context;
- HTML reports;
- screenshots;
- traces;
- test runner;
- fixtures;
- tags через `@smoke` и `@regression`.

### TypeScript

TypeScript нужен, чтобы:

- ловить ошибки до запуска тестов;
- иметь typed helpers;
- делать API clients понятнее;
- улучшать maintainability.

### Page Object Model

Page Object Model используется для UI pages:

- `LoginPage`
- `ProductsPage`
- `CartPage`
- `CheckoutPage`
- `OrdersPage`
- `AdminOrdersPage`

Page Object — это слой, который прячет детали страницы за понятными методами.

Например:

```ts
await loginPage.login(email, password);
await productsPage.addProductToCart('Classic Burger');
await checkoutPage.submitOrder(name, address);
```

Так тест читабельнее, чем если бы внутри test-файла были десятки locator-ов.

### Fixtures

`tests/fixtures.ts` создаёт готовые страницы:

- `customerPage`;
- `adminPage`.

Зачем:

- не повторять login steps в каждом тесте;
- держать setup в одном месте;
- сделать тесты короче и стабильнее.

### API clients

API clients находятся в `tests/support/api/`.

Они нужны, чтобы тесты не повторяли:

- URL;
- headers;
- bearer token logic;
- request payload shape.

Примеры:

- `ProductsApi`
- `OrdersApi`
- `AuthApi`
- `TestDataApi`

### Test data factory

`tests/support/testDataFactory.ts` создаёт reusable test data.

Зачем:

- не копировать payloads руками;
- иметь predictable data;
- легко менять данные в одном месте.

### Lightweight contract checks

`tests/support/contracts.ts` проверяет форму API response:

- есть нужные поля;
- правильные типы;
- массивы действительно массивы;
- цена является числом.

Это не полноценный OpenAPI schema validation, но хороший lightweight contract
signal.

### axe-core accessibility checks

`@axe-core/playwright` используется для accessibility smoke checks.

Проверяются:

- login page;
- authenticated products page.

Тест падает только на:

- `critical`;
- `serious`.

Почему не на всё подряд:

- accessibility scan может находить minor/noisy issues;
- первый слой должен быть стабильным;
- цель — поймать серьёзные проблемы, а не создать flaky gate.

Transient toast notifications исключены из page-level scan, потому что это
временный third-party UI element. Если toast станет отдельным риском, его можно
проверять отдельным focused test.

## 6. Locator strategy

Проект использует стабильные locator-ы:

1. role locators;
2. label locators;
3. meaningful text;
4. `data-testid`, когда элемент является test contract.

Избегаем:

- XPath;
- длинных CSS chains;
- locator-ов по цветам/классам/layout;
- fixed sleeps.

Почему это важно:

- UI может меняться визуально;
- тесты не должны ломаться от нормального refactoring;
- Playwright web-first assertions сами ждут нужное состояние.

## 7. Test tags

Используются tags:

- `@smoke`;
- `@regression`.

Smoke tests — это быстрый сигнал:

> “Самое важное всё ещё работает?”

Regression tests — более широкие проверки:

> “Не сломали ли мы важные edge cases и дополнительные сценарии?”

## 8. UI coverage

UI tests покрывают то, где реально важен browser:

- login form;
- invalid login error;
- customer login;
- product search/filter;
- add to cart;
- checkout;
- checkout validation;
- admin order status update;
- accessibility smoke checks.

Почему не всё через UI:

- UI tests медленнее;
- UI tests дороже поддерживать;
- backend behavior часто лучше проверять через API.

## 9. API coverage

API tests покрывают:

- product catalog;
- order creation;
- order read by ID;
- admin read access;
- missing bearer token;
- invalid bearer token;
- unknown order;
- unknown product;
- empty items array;
- zero quantity;
- reset endpoint with token;
- reset endpoint without token.

Почему это сильный слой:

- API tests быстрее UI tests;
- проверяют server behavior напрямую;
- лучше подходят для negative cases;
- помогают отделить backend проблемы от UI проблем.

## 10. Test data strategy

В проекте есть несколько уровней test data:

### Public demo accounts

Customer:

```text
customer@example.com
```

Admin:

```text
admin@example.com
```

Пароли лежат:

- локально в `.env`;
- в GitHub Secrets для CI.

### Seeded products

Product catalog predictable:

- продукты заранее известны;
- тесты могут проверять ожидаемые названия/цены;
- reset endpoint умеет re-seed catalog.

### Dynamic order data

Заказы создаются во время тестов.

Зачем:

- тест не зависит от старых заказов;
- тест можно запускать отдельно;
- меньше flaky behavior.

### Reset endpoint

Reset endpoint:

```text
POST /api/public/test/reset
```

Защищён header-ом:

```text
x-test-token
```

Он нужен, чтобы:

- чистить orders/order_items;
- возвращать product catalog в known state;
- делать CI предсказуемым.

## 11. CI/CD

CI находится в:

```text
.github/workflows/playwright.yml
```

Pipeline:

1. TypeScript typecheck;
2. smoke tests;
3. API tests;
4. UI tests.

Почему так:

- typecheck быстрый и ловит ошибки кода;
- smoke — первый функциональный gate;
- API и UI разделены, чтобы легче понимать, где поломка;
- artifacts помогают debugging.

CI использует Playwright Docker image:

```text
mcr.microsoft.com/playwright:v1.61.1-noble
```

Почему Docker image:

- браузеры уже установлены;
- меньше проблем с `npx playwright install`;
- CI стабильнее.

## 12. Reports and artifacts

Playwright создаёт HTML report.

CI сохраняет:

- `playwright-report/`;
- `test-results/`;
- screenshots;
- traces;
- error context.

Это важно, потому что хороший SDET не просто пишет тесты, а делает failure
удобным для расследования.

## 13. История проекта по шагам

Ниже история всех коммитов в порядке, в котором проект развивался.

### 1. `3691381` — Initial public automation framework

Было создано основание проекта:

- npm project;
- Playwright config;
- TypeScript config;
- `.env.example`;
- `.gitignore`;
- GitHub Actions workflow;
- README;
- UI tests;
- API tests;
- Page Objects;
- support helpers.

Почему это важно:

- появился минимальный runnable framework;
- можно было запускать тесты локально и в CI;
- появилась базовая структура, которую можно расширять.

### 2. `a9da137` — Architecture and coverage documentation

Добавлен `ARCHITECTURE.md` и расширен README.

Зачем:

- объяснить не только “как запустить”, но и “почему так устроено”;
- сделать проект понятным для code review.

### 3. `8b3b4af` — Negative API order tests

Добавлены negative API checks для order API.

Зачем:

- проверять не только happy path;
- убедиться, что API корректно обрабатывает плохие payloads и missing data.

### 4. `378773c` — Authenticated page fixtures

Добавлен `tests/fixtures.ts`.

Зачем:

- вынести customer/admin login setup;
- убрать дублирование из UI tests;
- сделать тесты короче и чище.

### 5. `538e5bf` — API order test helpers

Добавлен `tests/support/orders.ts`.

Зачем:

- переиспользовать создание заказов;
- не копировать одинаковую подготовку данных в API tests.

### 6. `c588b6d` — Test strategy and shared test data

Добавлены:

- `TEST_STRATEGY.md`;
- `tests/support/testData.ts`.

Зачем:

- зафиксировать подход к тестированию;
- вынести общие test constants в одно место.

### 7. `16f03f8` — API client layer

Добавлены:

- `ProductsApi`;
- `OrdersApi`.

Зачем:

- убрать low-level request details из spec files;
- сделать API tests читаемыми как сценарии.

### 8. `a4cbc23` — Checkout validation coverage

Добавлены validation checks для checkout.

Зачем:

- проверить, что required fields действительно обязательны;
- покрыть user-facing validation behavior.

### 9. `17af756` — Lightweight API contract checks

Добавлен `tests/support/contracts.ts`.

Зачем:

- проверять форму API responses;
- поймать breaking changes в response shape без тяжёлой schema tooling.

### 10. `b978398` — AI QA workflow

Добавлен `AI_QA_WORKFLOW.md`.

Зачем:

- показать, как AI используется как помощник в QA workflow;
- зафиксировать, что решения должны быть понятны человеку.

### 11. `91516d2` — Stronger SDET workflow

Добавлены/улучшены:

- API auth client;
- test data factory;
- независимость API tests от browser storage;
- улучшенные docs;
- обновлён CI workflow.

Зачем:

- API tests не должны зависеть от UI login;
- test data должна быть reusable;
- framework должен выглядеть как engineering project, а не просто набор tests.

### 12. `b82762a` — Stabilize Playwright execution and CI gates

Обновлены:

- Playwright config;
- CI gates;
- docs.

Зачем:

- повысить стабильность запусков;
- разделить быстрые и более широкие проверки.

### 13. `22cf3b6` — Use Node 24 in CI

CI переведён на Node 24.

Зачем:

- использовать актуальный runtime;
- уменьшить warnings/deprecation risk.

### 14. `337ba0a` — Update GitHub Actions runtime versions

Обновлены версии GitHub Actions.

Зачем:

- держать CI dependencies актуальными.

### 15. `23dde2c` — Update artifact upload action

Обновлён upload artifact action.

Зачем:

- корректно сохранять reports/artifacts в CI;
- использовать новую версию action.

### 16. `9efdddf` — Pin stable automation dependencies

Зависимости закреплены точными версиями.

Зачем:

- reproducible installs;
- меньше “у меня работает, у тебя нет”;
- стабильнее CI.

### 17. `588670f` — Use Playwright Docker image in CI

CI начал использовать Playwright Docker image.

Зачем:

- браузеры уже внутри image;
- меньше проблем со скачиванием browsers;
- стабильнее GitHub Actions.

### 18. `5b8c0a5` — CI evidence and debugging guide

Добавлены:

- `DEBUGGING.md`;
- screenshot green CI run;
- улучшения README.

Зачем:

- легче расследовать failures;
- есть публичное evidence, что CI реально работает.

### 19. `e4a3287` — API authorization coverage

Добавлены проверки authorization:

- admin can read customer order;
- missing token rejected;
- invalid token rejected.

Зачем:

- SDET должен проверять access control;
- auth bugs часто критичнее UI bugs.

### 20. `98d310b` — Test data reset contract

Добавлены:

- reset endpoint contract;
- opt-in reset tests;
- `TestDataApi`;
- optional env support.

Зачем:

- определить testability requirement для app;
- подготовить framework к deterministic test data.

### 21. `898cf17` — CI reviewability and reset enablement

Добавлены:

- `docs/PROJECT.md`;
- `docs/ROADMAP.md`;
- `docs/STATUS.md`;
- `docs/DECISIONS.md`;
- Lovable reset implementation guide;
- GitHub Actions step summaries;
- reset env wiring.

Зачем:

- проект получил source of truth;
- CI стал проще читать;
- reset endpoint стал подключаемым через GitHub Secrets.

### 22. `df2d945` — Green CI reset coverage evidence

README/STATUS обновлены ссылкой на green run.

Зачем:

- зафиксировать, что reset coverage работает в CI.

### 23. `4252ee6` — README explanation section

Добавлена секция для объяснения решений.

Зачем:

- быстро показать reader-у ключевые engineering choices.

### 24. `1cac461` — Engineering decisions wording

Секция переименована в `Engineering decisions`.

Зачем:

- звучит как техническая документация, а не как рекламный текст.

### 25. `f592d1e` — Accessibility smoke coverage

Добавлены:

- `@axe-core/playwright`;
- `tests/ui/accessibility.spec.ts`;
- `npm run test:a11y`;
- docs по accessibility strategy.

Зачем:

- показать, что framework смотрит не только на happy-path clicks;
- добавить lightweight accessibility quality gate.

### 26. `19fe665` — Green accessibility CI evidence

README/STATUS обновлены ссылкой на green CI run с accessibility checks.

Зачем:

- зафиксировать, что новый слой проверок работает в CI.

### 27. `1d0eb4b` — Playwright runtime upgrade

Playwright обновлён:

```text
1.53.0 -> 1.61.1
```

CI Docker image обновлён:

```text
mcr.microsoft.com/playwright:v1.61.1-noble
```

Зачем:

- `npm audit` показывал high severity advisory для старой версии;
- framework должен поддерживаться как production-quality tooling.

### 28. `0b625ab` — Green Playwright upgrade CI evidence

README/STATUS обновлены ссылкой на green CI run после Playwright upgrade.

Зачем:

- доказать, что upgrade не сломал test suite.

## 14. Почему проект развивался именно так

Порядок был не случайный:

1. Сначала был создан минимальный runnable framework.
2. Потом добавлена документация и архитектура.
3. Потом улучшены API negative tests.
4. Потом убрано дублирование через fixtures/helpers.
5. Потом добавлены API clients и contract checks.
6. Потом усилена test data strategy.
7. Потом стабилизирован CI.
8. Потом добавлен reset endpoint.
9. Потом добавлены job summaries и source-of-truth docs.
10. Потом добавлен accessibility smoke layer.
11. Потом обновлён Playwright из-за security advisory.

Это нормальный engineering путь: сначала working slice, потом stability, потом
maintainability, потом maturity improvements.

## 15. Основные engineering decisions

### UI и API tests разделены

UI tests проверяют browser behavior.

API tests проверяют server behavior.

Так быстрее, стабильнее и понятнее.

### API tests не берут token из browser storage

Раньше возможный workaround был бы получить token через UI login и localStorage.

В проекте сделано лучше:

- есть direct auth client;
- API tests независимы от UI;
- UI login проверяется отдельно.

### Page Objects маленькие

Нет большого `BasePage`.

Почему:

- большой BasePage часто становится мусорной абстракцией;
- маленькие Page Objects легче читать;
- методы описывают реальные действия пользователя.

### Reset endpoint защищён token-ом

Reset endpoint публично reachable, но требует:

```text
x-test-token
```

Почему:

- endpoint нужен для tests;
- нельзя позволять любому человеку reset-ить данные без token;
- token хранится в `.env` и GitHub Secrets.

### Один worker в Playwright

Почему не parallel на максимум:

- app публичная;
- demo accounts shared;
- reliability важнее скорости;
- для этого масштаба один worker достаточно.

### Accessibility checks лёгкие

Почему не полный audit:

- полный accessibility audit требует ручной проверки;
- automated scan не покрывает всё;
- первый слой должен быть стабильным и полезным.

## 16. Как запускать проект

Установка:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Проверка типов:

```bash
npm run typecheck
```

Smoke tests:

```bash
npm run test:smoke
```

API tests:

```bash
npm run test:api
```

UI tests:

```bash
npm run test:ui
```

Accessibility smoke:

```bash
npm run test:a11y
```

Все тесты:

```bash
npm test
```

HTML report:

```bash
npm run report
```

## 17. Как читать результаты

Если тесты прошли:

- смотри terminal output;
- смотри GitHub Actions job summary;
- смотри uploaded HTML report.

Если тест упал:

- открыть Playwright HTML report;
- посмотреть screenshot;
- открыть trace;
- проверить error context;
- понять, это UI issue, API issue, env issue или test issue.

## 18. Что уже доказывает проект

Проект показывает, что автор умеет:

- строить Playwright TypeScript framework;
- писать UI tests;
- писать API tests;
- применять Page Object Model;
- использовать fixtures;
- работать с test data;
- проектировать reset/seed mechanism;
- работать с bearer auth;
- писать negative tests;
- делать lightweight contract checks;
- добавлять accessibility smoke checks;
- настраивать CI;
- публиковать artifacts;
- читать npm audit;
- обновлять runtime dependencies;
- документировать trade-offs.

## 19. Что можно улучшить дальше

Логичные следующие шаги:

1. Документировать non-blocking GitHub Actions annotation в `DEBUGGING.md`.
2. Добавить forbidden cross-user API test, если будет второй customer account.
3. Добавить release checklist для изменений framework.
4. Добавить более явный order history coverage.
5. Добавить scheduled CI только если это действительно нужно.
6. Добавить Allure только если HTML report перестанет хватать.

## 20. Короткое объяснение для новичка

Если совсем просто:

- приложение OrderLab — это “мишень” для тестов;
- Playwright — инструмент, который открывает браузер и проверяет сайт;
- API tests проверяют backend без браузера;
- Page Objects делают UI tests читаемыми;
- fixtures помогают не повторять login;
- test data helpers создают предсказуемые данные;
- reset endpoint чистит тестовые данные;
- CI запускает тесты автоматически в GitHub;
- reports/artifacts помогают понять, почему что-то упало;
- docs объясняют, почему всё устроено именно так.

Главная идея проекта:

> Не просто написать тесты, а построить маленький, поддерживаемый,
> объяснимый automation framework.
