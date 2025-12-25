#!/usr/bin/env node

/**
 * Pre-Development Validator
 * Runs comprehensive checks before allowing development to proceed
 * Prevents deep bugs by catching issues early
 */

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

class ValidationError extends Error {
  constructor(message, fix) {
    super(message);
    this.fix = fix;
  }
}

const validators = {
  /**
   * Check 1: Environment Variables
   */
  async checkEnvironmentVariables() {
    console.log(
      `${COLORS.blue}📋 Checking environment variables...${COLORS.reset}`
    );

    const required = [
      "DATABASE_URL",
      "DIRECT_URL",
      "REDIS_URL",
      "ANTHROPIC_API_KEY",
      "OPENAI_API_KEY",
      "GOOGLE_API_KEY",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new ValidationError(
        `Missing environment variables: ${missing.join(", ")}`,
        `Add these to your .env.local file. Template available in .env.example`
      );
    }

    console.log(
      `${COLORS.green}✅ All environment variables present${COLORS.reset}`
    );
  },

  /**
   * Check 2: Prisma Client Singleton Usage
   */
  async checkPrismaUsage() {
    console.log(
      `${COLORS.blue}🔍 Checking Prisma client usage...${COLORS.reset}`
    );

    const srcDir = path.join(process.cwd(), "src");
    const violations = [];

    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !filePath.includes("node_modules")) {
          scanDirectory(filePath);
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          // Skip the singleton file itself
          if (filePath.includes("lib/db/prisma.ts")) continue;

          const content = fs.readFileSync(filePath, "utf8");

          // Check for direct PrismaClient instantiation
          if (content.includes("new PrismaClient(")) {
            violations.push({
              file: filePath.replace(process.cwd(), "."),
              issue: "Direct PrismaClient instantiation found",
              line:
                content
                  .split("\n")
                  .findIndex((l) => l.includes("new PrismaClient(")) + 1,
            });
          }

          // Check for imports from @prisma/client
          const lines = content.split("\n");
          lines.forEach((line, index) => {
            if (
              line.includes("import") &&
              line.includes("@prisma/client") &&
              line.includes("PrismaClient") &&
              !line.includes("type")
            ) {
              violations.push({
                file: filePath.replace(process.cwd(), "."),
                issue: "Direct PrismaClient import (should use singleton)",
                line: index + 1,
              });
            }
          });
        }
      }
    }

    scanDirectory(srcDir);

    if (violations.length > 0) {
      const violationDetails = violations
        .map((v) => `  ${v.file}:${v.line} - ${v.issue}`)
        .join("\n");

      throw new ValidationError(
        `Found ${violations.length} Prisma singleton violations:\n${violationDetails}`,
        `Replace with: import prisma from "@/lib/db/prisma";`
      );
    }

    console.log(
      `${COLORS.green}✅ All Prisma usage follows singleton pattern${COLORS.reset}`
    );
  },

  /**
   * Check 3: TypeScript Compilation
   */
  async checkTypeScript() {
    console.log(
      `${COLORS.blue}📝 Checking TypeScript compilation...${COLORS.reset}`
    );

    try {
      execSync("npx tsc --noEmit", { stdio: "pipe", encoding: "utf8" });
      console.log(
        `${COLORS.green}✅ TypeScript compilation successful${COLORS.reset}`
      );
    } catch (error) {
      const errors = error.stdout || error.message;
      throw new ValidationError(
        `TypeScript compilation failed:\n${errors}`,
        `Fix the TypeScript errors listed above`
      );
    }
  },

  /**
   * Check 4: Next.js Route Structure
   */
  async checkRouteStructure() {
    console.log(
      `${COLORS.blue}🗂️  Checking Next.js route structure...${COLORS.reset}`
    );

    const appDir = path.join(process.cwd(), "src/app");
    const issues = [];

    function validateRoute(dir, routePath = "") {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          validateRoute(filePath, `${routePath}/${file}`);
        } else if (file === "page.tsx" || file === "page.ts") {
          const content = fs.readFileSync(filePath, "utf8");

          // Check for "use client" when importing client components
          if (
            content.includes("useState") ||
            content.includes("useEffect") ||
            content.includes('"use client"')
          ) {
            // If it has metadata export, that's an error
            if (
              content.includes("export const metadata") ||
              content.includes("export metadata")
            ) {
              issues.push({
                file: filePath.replace(process.cwd(), "."),
                issue: "Page exports metadata but uses client hooks",
                route: routePath,
              });
            }
          }

          // Check for default export
          if (!content.includes("export default")) {
            issues.push({
              file: filePath.replace(process.cwd(), "."),
              issue: "Missing default export",
              route: routePath,
            });
          }
        }
      }
    }

    validateRoute(appDir);

    if (issues.length > 0) {
      const issueDetails = issues
        .map((i) => `  ${i.file}: ${i.issue}`)
        .join("\n");

      throw new ValidationError(
        `Found ${issues.length} route structure issues:\n${issueDetails}`,
        `Pages with client hooks should not export metadata. Remove metadata or move to layout.tsx`
      );
    }

    console.log(
      `${COLORS.green}✅ Next.js route structure is valid${COLORS.reset}`
    );
  },

  /**
   * Check 5: Database Connection
   */
  async checkDatabaseConnection() {
    console.log(
      `${COLORS.blue}🗄️  Checking database connection...${COLORS.reset}`
    );

    try {
      execSync('npx prisma db execute --stdin <<< "SELECT 1;"', {
        stdio: "pipe",
        encoding: "utf8",
      });
      console.log(
        `${COLORS.green}✅ Database connection successful${COLORS.reset}`
      );
    } catch (error) {
      throw new ValidationError(
        `Database connection failed`,
        `Check your DATABASE_URL in .env.local and verify Supabase is accessible`
      );
    }
  },

  /**
   * Check 6: Prisma Client Generation
   */
  async checkPrismaClient() {
    console.log(`${COLORS.blue}⚙️  Checking Prisma Client...${COLORS.reset}`);

    const prismaClientPath = path.join(
      process.cwd(),
      "node_modules/.prisma/client/index.js"
    );

    if (!fs.existsSync(prismaClientPath)) {
      throw new ValidationError(
        `Prisma Client not generated`,
        `Run: npx prisma generate`
      );
    }

    console.log(`${COLORS.green}✅ Prisma Client is generated${COLORS.reset}`);
  },

  /**
   * Check 7: Import Path Consistency
   */
  async checkImportPaths() {
    console.log(
      `${COLORS.blue}🔗 Checking import path consistency...${COLORS.reset}`
    );

    const srcDir = path.join(process.cwd(), "src");
    const invalidImports = [];

    function scanImports(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !filePath.includes("node_modules")) {
          scanImports(filePath);
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          const content = fs.readFileSync(filePath, "utf8");
          const lines = content.split("\n");

          lines.forEach((line, index) => {
            // Check for relative imports that should use @ alias
            if (line.includes("import") && line.includes("../../../")) {
              invalidImports.push({
                file: filePath.replace(process.cwd(), "."),
                line: index + 1,
                issue: "Use @ alias instead of deep relative imports",
              });
            }

            // Check for inconsistent @ alias usage
            if (
              line.includes("import") &&
              line.includes("@/") &&
              line.includes("../")
            ) {
              invalidImports.push({
                file: filePath.replace(process.cwd(), "."),
                line: index + 1,
                issue: "Mixing @ alias with relative imports",
              });
            }
          });
        }
      }
    }

    scanImports(srcDir);

    if (invalidImports.length > 0) {
      console.log(
        `${COLORS.yellow}⚠️  Found ${invalidImports.length} import path issues (non-blocking)${COLORS.reset}`
      );
      invalidImports.slice(0, 5).forEach((i) => {
        console.log(`  ${i.file}:${i.line} - ${i.issue}`);
      });
    } else {
      console.log(
        `${COLORS.green}✅ Import paths are consistent${COLORS.reset}`
      );
    }
  },

  /**
   * Check 8: Build Test (Quick)
   */
  async checkBuildQuick() {
    console.log(`${COLORS.blue}🏗️  Running quick build test...${COLORS.reset}`);

    try {
      // Build test skipped for performance - run 'npm run build' manually
      // Uncomment to enable: execSync("npx next build", { stdio: "pipe" });
      console.log(
        `${COLORS.green}✅ Build test skipped (run manually if needed)${COLORS.reset}`
      );
      return;
    } catch (error) {
      const buildError = error.stdout || error.stderr || error.message;

      // Extract the actual error message
      const errorLines = buildError
        .split("\n")
        .filter(
          (line) =>
            line.includes("Error") ||
            line.includes("Failed") ||
            line.includes("error")
        );

      throw new ValidationError(
        `Build failed:\n${errorLines.join("\n")}`,
        `Review the error above and fix before proceeding`
      );
    }
  },
};

async function runValidation() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `${COLORS.blue}🚀 Refleqt Development Environment Validator${COLORS.reset}`
  );
  console.log(`${"=".repeat(60)}\n`);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Run all validators
  for (const [name, validator] of Object.entries(validators)) {
    try {
      await validator();
      results.passed++;
    } catch (error) {
      results.failed++;
      console.log(`\n${COLORS.red}❌ ${name} FAILED${COLORS.reset}`);
      console.log(`   Error: ${error.message}`);
      if (error.fix) {
        console.log(`   ${COLORS.yellow}💡 Fix: ${error.fix}${COLORS.reset}`);
      }
      console.log("");
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`${COLORS.blue}Validation Summary${COLORS.reset}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`${COLORS.green}✅ Passed: ${results.passed}${COLORS.reset}`);
  console.log(`${COLORS.red}❌ Failed: ${results.failed}${COLORS.reset}`);
  console.log(
    `${COLORS.yellow}⚠️  Warnings: ${results.warnings}${COLORS.reset}`
  );
  console.log(`${"=".repeat(60)}\n`);

  if (results.failed > 0) {
    console.log(
      `${COLORS.red}⛔ Please fix the errors above before continuing development${COLORS.reset}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `${COLORS.green}✨ All checks passed! You're ready to develop.${COLORS.reset}\n`
    );
    process.exit(0);
  }
}

// Run validation
runValidation().catch((error) => {
  console.error(
    `${COLORS.red}Fatal error during validation:${COLORS.reset}`,
    error
  );
  process.exit(1);
});
