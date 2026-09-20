/**
 * Extensible canonical skill normalization map.
 * Key: Canonical display name
 * Value: Array of lowercased alias strings
 */
export const SKILL_ALIASES: Record<string, string[]> = {
  React: [
    "react.js",
    "reactjs",
    "react.js",
    "react frontend",
    "react library",
  ],
  "Node.js": [
    "nodejs",
    "node",
    "node js",
    "node.js",
    "node runtime",
  ],
  PostgreSQL: [
    "postgres",
    "postgresql",
    "postgre",
    "postgre sql",
    "pg",
  ],
  JavaScript: [
    "js",
    "javascript",
    "java script",
    "ecmascript",
    "es6",
    "es6+",
  ],
  TypeScript: [
    "ts",
    "typescript",
    "type script",
  ],
  MongoDB: [
    "mongo",
    "mongodb",
    "mongo db",
  ],
  "Express.js": [
    "expressjs",
    "express",
    "express js",
    "express.js framework",
  ],
  "Next.js": [
    "nextjs",
    "next",
    "next js",
    "next.js framework",
    "next app router",
  ],
  "Tailwind CSS": [
    "tailwindcss",
    "tailwind",
    "tailwind css framework",
  ],
  "REST API": [
    "restful api",
    "rest apis",
    "restful apis",
    "restful services",
    "rest web services",
    "rest api architecture",
  ],
  AWS: [
    "amazon web services",
    "amazon aws",
    "aws cloud",
  ],
  Azure: [
    "microsoft azure",
    "azure cloud",
  ],
  GCP: [
    "google cloud",
    "google cloud platform",
    "gcp cloud",
  ],
  Docker: [
    "docker containers",
    "docker engine",
    "containerization",
  ],
  Kubernetes: [
    "k8s",
    "k8",
    "kube",
  ],
  Python: [
    "python3",
    "python 3",
    "py",
  ],
  "C++": [
    "cpp",
    "c plus plus",
  ],
  "C#": [
    "csharp",
    "c sharp",
  ],
  ".NET": [
    "dotnet",
    "dot net",
    ".net core",
    "asp.net",
    "asp.net core",
  ],
  GraphQL: [
    "graphql api",
    "graph ql",
  ],
  Redis: [
    "redis cache",
    "redis store",
  ],
  MySQL: [
    "my sql",
    "mysqldb",
  ],
  Git: [
    "github",
    "gitlab",
    "git version control",
    "version control",
  ],
  CI_CD: [
    "ci/cd",
    "ci cd",
    "continuous integration",
    "continuous deployment",
    "github actions",
  ],
  HTML5: [
    "html",
    "html5",
  ],
  CSS3: [
    "css",
    "css3",
  ],
  Vue: [
    "vue.js",
    "vuejs",
    "vue 3",
  ],
  Angular: [
    "angularjs",
    "angular.js",
    "angular 2+",
  ],
  Sass: [
    "scss",
    "sass/scss",
  ],
  Webpack: [
    "webpack",
    "module bundler",
  ],
  Vite: [
    "vite.js",
    "vitejs",
  ],
  Jest: [
    "jest testing",
  ],
  Vitest: [
    "vitest testing",
  ],
  Playwright: [
    "playwright test",
  ],
  Cypress: [
    "cypress testing",
  ],
  Prisma: [
    "prisma orm",
  ],
  Drizzle: [
    "drizzle orm",
  ],
};
