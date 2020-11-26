// JWT
export const jwtSecret = process.env.JWT_SECRET;
export const jwtAlgorithm = "HS256";
// 60, "2 days", "10h", "7d" default to `ms`
// expires in 1day
export const jwtExpirationInterval = 24 * 60 * 60 * 1000;

export const bcryptSaltRounds = 10;

// APP
export const env = process.env.NODE_ENV;
export const port = parseInt(process.env.PORT || 8089, 10);

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
export const morganLogLevel = isDev ? "dev" : "combined";

// DB
export const dbName = "db.json";
export const restrictedFields = ["password"];

// App User roles
export const userRoles = ["admin", "user"];

// Payment cards
export const supportedCards = [
  "visa",
  "mastercard",
  "amex",
  "jcb",
  "discover",
  "diners-club",
];
