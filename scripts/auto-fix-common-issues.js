#!/usr/bin/env node

/**
 * Auto-Fix Common Development Issues
 * Automatically fixes common problems that cause build failures
 */

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

class AutoFixer {
  constructor() {
    this.fixes = [];
  }

  log(message, color = COLORS.reset) {
    console.log(`${color}${message}${COLORS.reset}`);
  }

  /**
   * Fix 1: Replace Direct PrismaClient with Singleton
   */
  fixPrismaClientUsage() {
    this.log("\n📝 Fixing Prisma Client usage...", COLORS.blue);

    const srcDir = path.join(process.cwd(), "src");
    let filesFixed = 0;

    function fixFile(filePath) {
      if (filePath.includes("lib/db/prisma.ts")) return false;

      const content = fs.readFileSync(filePath, "utf8");
      let modified = false;
      let newContent = content;

      // Fix 1: Replace direct imports
      if (
        newContent.includes("import { PrismaClient }") &&
        newContent.includes("@prisma/client")
      ) {
        newContent = newContent.replace(
          /import\s*{\s*PrismaClient\s*}\s*from\s*["']@prisma\/client["'];?/g,
          'import prisma from "@/lib/db/prisma";'
        );
        modified = true;
      }

      // Fix 2: Remove direct instantiation
      if (newContent.includes("const prisma = new PrismaClient()")) {
        // Remove the line
        newContent = newContent.replace(
          /const\s+prisma\s*=\s*new\s+PrismaClient\(\);?\n?/g,
          ""
        );
        modified = true;
      }

      // Fix 3: Fix dynamic imports
      if (newContent.includes('await import("@prisma/client")')) {
        newContent = newContent.replace(
          /const\s*{\s*PrismaClient\s*}\s*=\s*await\s+import\(["']@prisma\/client["']\);\s*const\s+prisma\s*=\s*new\s+PrismaClient\(\);/g,
          'const prisma = (await import("@/lib/db/prisma")).default;'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, newContent, "utf8");
        return true;
      }

      return false;
    }

    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !filePath.includes("node_modules")) {
          scanDirectory(filePath);
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          if (fixFile(filePath)) {
            filesFixed++;
            this.log(
              `  ✅ Fixed: ${filePath.replace(process.cwd(), ".")}`,
              COLORS.green
            );
          }
        }
      }
    }

    scanDirectory(srcDir);

    if (filesFixed > 0) {
      this.log(
        `\n✅ Fixed Prisma usage in ${filesFixed} file(s)`,
        COLORS.green
      );
      this.fixes.push(`Fixed Prisma Client usage in ${filesFixed} files`);
    } else {
      this.log("  No Prisma issues found", COLORS.green);
    }
  }

  /**
   * Fix 2: Remove metadata exports from client component pages
   */
  fixMetadataInClientPages() {
    this.log("\n📝 Fixing metadata in client pages...", COLORS.blue);

    const appDir = path.join(process.cwd(), "src/app");
    let filesFixed = 0;

    function fixPageFile(filePath) {
      const content = fs.readFileSync(filePath, "utf8");

      const hasClientCode =
        content.includes("useState") ||
        content.includes("useEffect") ||
        content.includes('"use client"');

      const hasMetadata =
        content.includes("export const metadata") ||
        content.includes("export metadata");

      if (hasClientCode && hasMetadata) {
        // Remove metadata export
        let newContent = content.replace(
          /export\s+const\s+metadata\s*=\s*{[^}]*};?\n*/g,
          ""
        );
        newContent = newContent.replace(
          /export\s+metadata\s*=\s*{[^}]*};?\n*/g,
          ""
        );

        fs.writeFileSync(filePath, newContent, "utf8");
        return true;
      }

      return false;
    }

    function scanAppDirectory(dir) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          scanAppDirectory(filePath);
        } else if (file === "page.tsx" || file === "page.ts") {
          if (fixPageFile(filePath)) {
            filesFixed++;
            this.log(
              `  ✅ Fixed: ${filePath.replace(process.cwd(), ".")}`,
              COLORS.green
            );
          }
        }
      }
    }

    scanAppDirectory(appDir);

    if (filesFixed > 0) {
      this.log(
        `\n✅ Fixed metadata exports in ${filesFixed} file(s)`,
        COLORS.green
      );
      this.fixes.push(`Fixed metadata in ${filesFixed} client pages`);
    } else {
      this.log("  No metadata issues found", COLORS.green);
    }
  }

  /**
   * Fix 3: Clear Next.js cache
   */
  clearNextCache() {
    this.log("\n🗑️  Clearing Next.js cache...", COLORS.blue);

    const nextDir = path.join(process.cwd(), ".next");

    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
      this.log("  ✅ Cleared .next directory", COLORS.green);
      this.fixes.push("Cleared Next.js cache");
    } else {
      this.log("  No cache to clear", COLORS.green);
    }
  }

  /**
   * Fix 4: Regenerate Prisma Client
   */
  regeneratePrismaClient() {
    this.log("\n⚙️  Regenerating Prisma Client...", COLORS.blue);

    try {
      execSync("npx prisma generate", { stdio: "inherit" });
      this.log("  ✅ Prisma Client regenerated", COLORS.green);
      this.fixes.push("Regenerated Prisma Client");
    } catch (error) {
      this.log("  ❌ Failed to regenerate Prisma Client", COLORS.red);
    }
  }

  /**
   * Fix 5: Format code
   */
  formatCode() {
    this.log("\n✨ Formatting code...", COLORS.blue);

    try {
      execSync("npm run format", { stdio: "inherit" });
      this.log("  ✅ Code formatted", COLORS.green);
      this.fixes.push("Formatted code with Prettier");
    } catch (error) {
      this.log(
        "  ⚠️  Code formatting skipped (no format script)",
        COLORS.yellow
      );
    }
  }

  /**
   * Run all fixes
   */
  async runAll() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${COLORS.blue}🔧 Refleqt Auto-Fixer${COLORS.reset}`);
    console.log(`${"=".repeat(60)}\n`);

    this.fixPrismaClientUsage();
    this.fixMetadataInClientPages();
    this.clearNextCache();
    this.regeneratePrismaClient();
    this.formatCode();

    console.log(`\n${"=".repeat(60)}`);
    console.log(`${COLORS.blue}Summary${COLORS.reset}`);
    console.log(`${"=".repeat(60)}`);

    if (this.fixes.length > 0) {
      this.log(`\n✅ Applied ${this.fixes.length} fix(es):`, COLORS.green);
      this.fixes.forEach((fix) => {
        console.log(`  • ${fix}`);
      });
    } else {
      this.log("\n✨ No fixes needed!", COLORS.green);
    }

    console.log(`\n${COLORS.blue}Next steps:${COLORS.reset}`);
    console.log(`  1. Run: npm run dev`);
    console.log(`  2. Visit: http://localhost:3000/portal/intelligence-feed`);
    console.log("");
  }
}

// Run auto-fixer
const fixer = new AutoFixer();
fixer.runAll().catch((error) => {
  console.error(
    `${COLORS.red}Fatal error during auto-fix:${COLORS.reset}`,
    error
  );
  process.exit(1);
});
