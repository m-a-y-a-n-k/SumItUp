import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    try {
        const docPath = path.join(__dirname, "../../API_DOCUMENTATION.md");

        // Check if file exists
        if (fs.existsSync(docPath)) {
            const docContent = fs.readFileSync(docPath, "utf-8");

            // Serve as simple HTML with pre-formatted text for now
            // This preserves the markdown structure in the browser
            res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>SumItUp API Documentation</title>
          <style>
            body { font-family: monospace; padding: 20px; background: #f5f5f5; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
            .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <pre>${docContent}</pre>
          </div>
        </body>
        </html>
      `);
        } else {
            res.status(404).json({ error: "Documentation file not found" });
        }
    } catch (error) {
        console.error("Error serving documentation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
