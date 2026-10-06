import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const PgStore = ConnectPgSimple(session);

const app: Express = express();

// Trust Railway's (and other PaaS) reverse proxy so secure cookies work over HTTPS
app.set("trust proxy", 1);

// Redirect bare domain → www (canonical hostname)
app.use((req, res, next) => {
  const host = req.headers.host ?? "";
  if (host === "escoraholidays.com") {
    return res.redirect(301, `https://www.escoraholidays.com${req.url}`);
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Build the session store backed by Postgres when DATABASE_URL is available.
// connect-pg-simple reads a table.sql file at runtime which esbuild cannot
// bundle, so we create the session table ourselves via a raw query instead of
// using createTableIfMissing:true.
let sessionStore: InstanceType<typeof PgStore> | undefined;

if (process.env["DATABASE_URL"]) {
  pool.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid"    varchar      NOT NULL COLLATE "default",
      "sess"   json         NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
    );
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `).catch((err: unknown) => logger.error({ err }, "Failed to create session table"));

  sessionStore = new PgStore({ pool, createTableIfMissing: false });
}

app.use(session({
  name: "escora.sid",
  secret: process.env["SESSION_SECRET"] ?? "escora-dev-secret-change-in-prod",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

app.use("/api", router);
app.use("/admin/api", router);

// SEO: dynamic sitemap.xml
app.get("/sitemap.xml", (_req, res) => {
  try {
    const ORIGIN = process.env["PUBLIC_URL"] ?? "https://www.escoraholidays.com";
    const webDist = path.resolve(process.cwd(), "artifacts/escora-web/dist/public");

    // Use the mtime of each pre-rendered HTML file as lastmod — accurate and automatic.
    // Falls back to today's date if the file doesn't exist.
    function lastmod(filePath: string): string {
      try {
        const stat = fs.statSync(path.join(webDist, filePath));
        return stat.mtime.toISOString().slice(0, 10);
      } catch {
        return new Date().toISOString().slice(0, 10);
      }
    }

    const staticUrls = [
      { path: "/",                                file: "index.html"                              },
      { path: "/journeys",                        file: "journeys/index.html"                     },
      { path: "/plan",                            file: "plan/index.html"                         },
      { path: "/destinations",                    file: "destinations/index.html"                 },
      { path: "/about",                           file: "about/index.html"                        },
      { path: "/collections/honeymoon",           file: "collections/honeymoon/index.html"        },
      { path: "/collections/health-wellness",     file: "collections/health-wellness/index.html"  },
      { path: "/collections/nature-wildlife",     file: "collections/nature-wildlife/index.html"  },
      { path: "/collections/hill-stations",       file: "collections/hill-stations/index.html"    },
      { path: "/collections/backwaters",          file: "collections/backwaters/index.html"       },
      { path: "/collections/beaches",             file: "collections/beaches/index.html"          },
      { path: "/collections/functional-medicine", file: "collections/functional-medicine/index.html" },
      { path: "/collections/historical-heritage", file: "collections/historical-heritage/index.html" },
      { path: "/contact",                         file: "contact/index.html"                      },
      { path: "/privacy-policy",                  file: "privacy-policy/index.html"               },
    ];

    // Clean sitemap: only <loc> and <lastmod>. Google ignores priority and changefreq.
    const urls = staticUrls.map(({ path: p, file }) =>
      `<url><loc>${ORIGIN}${p}</loc><lastmod>${lastmod(file)}</lastmod></url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("Error generating sitemap");
  }
});

// SEO: robots.txt
app.get("/robots.txt", (_req, res) => {
  const ORIGIN = process.env["PUBLIC_URL"] ?? "https://www.escoraholidays.com";
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nSitemap: ${ORIGIN}/sitemap.xml\n`);
});

// Serve built frontends in production (built by `pnpm run build:prod`)
const adminDist = path.resolve(process.cwd(), "artifacts/escora-admin/dist/public");
const webDist   = path.resolve(process.cwd(), "artifacts/escora-web/dist/public");

if (fs.existsSync(adminDist)) {
  app.use("/admin", express.static(adminDist));
  app.use("/admin", (_req, res) => res.sendFile(path.join(adminDist, "index.html")));
}

if (fs.existsSync(webDist)) {
  // redirect:false prevents express.static from 301-redirecting /foo → /foo/ when a directory exists
  app.use(express.static(webDist, { redirect: false }));
  app.use((req, res) => {
    // Serve pre-rendered file if it exists (e.g. /collections/honeymoon → collections/honeymoon/index.html)
    const prerendered = path.join(webDist, req.path, "index.html");
    if (fs.existsSync(prerendered)) {
      return res.sendFile(prerendered);
    }
    res.sendFile(path.join(webDist, "index.html"));
  });
}

export default app;
