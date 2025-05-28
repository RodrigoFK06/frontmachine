/**
 * @pages/api/health.ts
 * @description Proxies GET requests to the backend's /health endpoint.
 * This route is part of the Next.js API proxy layer to avoid CORS issues
 * and securely communicate with the backend services.
 * It includes specific handling for potentially non-JSON health check responses.
 */
import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Consider moving this to an environment variable for the Next.js server
const NGROK_BACKEND_URL = "https://c090-200-fdd0-2611-f82b-705-e365-f53.ngrok-free.app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const backendUrl = `${NGROK_BACKEND_URL}/health`;

      const backendRes = await fetch(backendUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      // For health checks, sometimes the status code is all that matters.
      // If the response body is not JSON or is empty, .json() might fail.
      // We'll try to parse JSON, but handle cases where it might not be.
      if (!backendRes.ok) {
        let errorBody = await backendRes.text();
        try { errorBody = JSON.parse(errorBody); } catch (e) { /* Keep as text */ }
        console.error(`Backend error for /health: ${backendRes.status}`, errorBody);
        return res.status(backendRes.status).json({ 
            message: `Error from backend: ${backendRes.statusText}`,
            details: errorBody 
        });
      }
      
      // Try to get JSON, but if it's empty or not JSON, send status and a simple success message
      let data;
      try {
        const text = await backendRes.text();
        if (text) {
            data = JSON.parse(text);
        } else {
            // If body is empty, but status is OK, send a success status
            return res.status(backendRes.status).json({ status: "ok", message: backendRes.statusText });
        }
      } catch (e) {
        // If body is not JSON, but status is OK, send a success status
        console.warn("Could not parse /health response as JSON, backend might be sending plain text or empty response.");
        return res.status(backendRes.status).json({ status: "ok", message: "Health check successful, non-JSON response." });
      }
      
      res.status(backendRes.status).json(data);

    } catch (error: any) {
      console.error("Error in /api/health proxy:", error);
      res.status(500).json({ 
        message: "Error proxying to backend", 
        error: error.message || "Unknown error"
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
