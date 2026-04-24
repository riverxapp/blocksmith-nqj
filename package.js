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
