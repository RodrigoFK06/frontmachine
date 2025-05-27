/**
 * @pages/api/labels.ts
 * @description Proxies GET requests to the backend's /labels endpoint.
 * This route is part of the Next.js API proxy layer to avoid CORS issues
 * and securely communicate with the backend services.
 */
import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Consider moving this to an environment variable for the Next.js server
const NGROK_BACKEND_URL = "https://c090-2800-200-fdd0-2611-f82b-705-e365-f53.ngrok-free.app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const backendRes = await fetch(`${NGROK_BACKEND_URL}/labels`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          // Add any other headers your backend might expect for GET requests, if any
        },
      });

      // It's good practice to check if the backend response was successful
      if (!backendRes.ok) {
        // Attempt to parse error response from backend, or use status text
        let errorBody = await backendRes.text(); // Use text first, as it might not be JSON
        try {
            errorBody = JSON.parse(errorBody); // Try to parse if it is JSON
        } catch (e) {
            // Keep as text if not JSON
        }
        console.error(`Backend error for /labels: ${backendRes.status}`, errorBody);
        return res.status(backendRes.status).json({ 
            message: `Error from backend: ${backendRes.statusText}`,
            details: errorBody 
        });
      }

      const data = await backendRes.json(); // Assumes backend returns JSON on success

      // Forward the status code and JSON response from the backend
      res.status(backendRes.status).json(data);

    } catch (error: any) {
      console.error("Error in /api/labels proxy:", error);
      res.status(500).json({ 
        message: "Error proxying to backend", 
        error: error.message || "Unknown error"
      });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
