# Webapp App Simple

Proyecto de testing E2E con **Playwright**, reportes **Allure**, integración con **Oracle Database** y procesamiento de archivos **Excel**.

## 📦 Tecnologías

| Paquete | Versión | Descripción |
| --- | --- | --- |
| `@playwright/test` | ^1.58.1 | Framework de testing E2E |
| `allure-playwright` | ^3.4.5 | Reporter Allure para Playwright |
| `allure-js-commons` | ^3.4.5 | Helpers de metadata Allure |
| `@types/node` | ^25.2.1 | Definiciones de tipos Node.js |
| `@types/oracledb` | ^6.10.1 | Tipos para Oracle DB |
| `dotenv` | ^17.2.4 | Gestión de variables de entorno |
| `oracledb` | ^6.10.0 | Cliente Oracle Database |
| `xlsx` | ^0.18.5 | Procesamiento de archivos Excel |

## 📁 Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── env.config.ts          # Configuración centralizada (env vars)
│   ├── pages/
│   │   ├── base.page.ts           # Page Object base
│   │   ├── home.page.ts           # Page Object de Home
│   │   └── index.ts               # Barrel exports
│   ├── utils/
│   │   ├── excel.helper.ts        # Utilidad para leer archivos Excel
│   │   ├── oracle-db.helper.ts    # Utilidad para Oracle Database
│   │   └── index.ts               # Barrel exports
│   └── data/
│       └── test-data.xlsx         # Archivo Excel de datos de prueba
├── tests/
│   ├── fixtures.ts                # Custom fixtures de Playwright
│   └── e2e/
│       ├── home.spec.ts           # Tests de la página Home
│       ├── excel-data.spec.ts     # Tests data-driven con Excel
│       └── db-validation.spec.ts  # Tests de validación con DB
├── .env                           # Variables de entorno (local)
├── .env.example                   # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar navegadores de Playwright
npx playwright install

# 3. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales
```

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo headed (ver navegador)
npm run test:headed

# Ejecutar con UI interactiva
npm run test:ui

# Ejecutar en modo debug
npm run test:debug

# Ejecutar un test específico
npx playwright test tests/e2e/home.spec.ts
```

## 📊 Reportes Allure

```bash
# Generar reporte Allure
npm run allure:generate

# Abrir reporte Allure
npm run allure:open

# Generar y abrir en un solo paso
npm run allure:serve
```

## 🗄️ Oracle Database

Configura las credenciales en el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=XEPDB1
DB_USER=your_user
DB_PASSWORD=your_password
```

Los tests que usan la fixture `db` se conectan/desconectan automáticamente.

## 📑 Datos Excel

Coloca tus archivos Excel en `src/data/` y configura la ruta en `.env`:

```env
EXCEL_DATA_PATH=./src/data/test-data.xlsx
```

Usa `ExcelHelper` para leer datos:

```typescript
import { ExcelHelper } from '../src/utils/excel.helper';

const data = ExcelHelper.readSheet('./src/data/test-data.xlsx');
const sheets = ExcelHelper.getSheetNames('./src/data/test-data.xlsx');
```
# Updated - runner test
