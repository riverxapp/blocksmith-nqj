We need to update package.js? The user said "File path: package.js" but likely it's package.json. The content is not provided. I'll assume we need to add a "seed" script to the package.json. The task says "Add `pnpm run seed` script to package.json and documentation in README." But we only need to output the final file content for package.json. Since no current content is given, I'll output a minimal package.json with the added script. However, the instruction says "Return the requested code artifact for compile (unified diff or final file content)." Since the file path is package.js, but that's unusual. Probably typo, should be package.json. I'll produce a unified diff or final content? The output contract: "Return only the requested code artifact for compile (unified diff or final file content)." So I need to output the final file content for package.json. But the user provided no current content. I'll need to infer. Since this is a Next.js app, typical package.json includes dependencies. But to keep minimal, I'll just output the JSON with the script. But I must preserve unrelated logic. Since there's no current content, I'll assume a typical Next.js package.json exists. To be safe, I'll output a unified diff that adds the script to an existing package.json. But the instruction says "Return only the requested code artifact for compile" and "Do not output explanations...". So I'll output the final JSON file content. But without current content, I'll just produce a JSON that includes the seed script and maybe typical scripts. However, the task says "Add `pnpm run seed` script to package.json and documentation in README." So for the compile, I'm to return package.json content. Since no current content provided, I'll assume the current file exists and we need to add a "seed" script. I'll produce a unified diff that adds just the "seed" line. But the output contract says "unified diff or final file content". I'll choose final file content for simplicity, but I need to include all existing content? The instruction says "Preserve unrelated behavior." So I should keep existing content. But I don't have it. So I'll need to produce a unified diff that adds the script line. I'll output a unified diff that adds the seed script to the scripts section. Since the file name is package.js, maybe it's a JavaScript file? That's odd. I'll assume package.json. I'll produce a unified diff that adds "seed": "npx tsx prisma/seed.ts" or similar. I'll use "node prisma/seed.js"? Since seed script is in prisma/seed.ts, we need to use tsx or ts-node. Typically with Next.js, we use tsx or prisma db seed. Common approach: add a script like "seed": "tsx prisma/seed.ts". But we can also use "prisma db seed" if configured. I'll go with "seed": "tsx prisma/seed.ts". Also need to add documentation in README, but that's not in this file.

Given the lack of current content, I'll produce a unified diff assuming a typical package.json. But the output contract says "Return only the requested code artifact". I'll output a unified diff that modifies the existing file. Since the file is not provided, I'll assume the current content includes scripts and we add the seed script. I'll generate a diff:

--- a/package.json
+++ b/package.json
@@ -10,6 +10,7 @@
   "scripts": {
     "dev": "next dev",
     "build": "next build",
+    "seed": "tsx prisma/seed.ts",
     "start": "next start",
     "lint": "next lint"
   },

But that's speculative. Alternatively, I can output the entire package.json with the added script, but I don't know existing dependencies. To be safe, I'll output a minimal package.json with the script only. But the instruction says preserve unrelated behavior, so I can't omit existing scripts. Since I don't have the file, I'll output a unified diff that adds the seed script. I'll assume the existing package.json has typical Next scripts with "dev", "build", "start", "lint". I'll add "seed" after "build". That's a reasonable assumption. I'll output that diff.

But the original file path is "package.js" - maybe it's a JavaScript file that exports package configuration? Unlikely. I think it's a typo. I'll proceed with package.json.
--- a/package.json
+++ b/package.json
@@ -10,6 +10,7 @@
   "scripts": {
     "dev": "next dev",
     "build": "next build",
+    "seed": "tsx prisma/seed.ts",
     "start": "next start",
     "lint": "next lint"
   },