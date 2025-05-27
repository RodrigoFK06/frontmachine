/**
 * @pages/api/records.ts
 * @description Proxies GET requests to the backend's /records endpoint.
 * This route handles query parameters like 'nickname', 'page', and 'limit'.
 * It's part of the Next.js API proxy layer to avoid CORS issues
 * and securely communicate with the backend services.
 */
import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Consider moving this to an environment variable for the Next.js server
const NGROK_BACKEND_URL = "https://c090-2800-200-fdd0-2611-f82b-705-e365-f53.ngrok-free.app";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Extract query parameters from the incoming request
      const { nickname, page, limit } = req.query;
      
      // Construct the URL for the backend, forwarding query parameters
      const backendUrl = new URL(`${NGROK_BACKEND_URL}/records`);
      if (nickname) backendUrl.searchParams.append("nickname", Array.isArray(nickname) ? nickname[0] : nickname);
      if (page) backendUrl.searchParams.append("page", Array.isArray(page) ? page[0] : page);
      if (limit) backendUrl.searchParams.append("limit", Array.isArray(limit) ? limit[0] : limit);

      const backendRes = await fetch(backendUrl.toString(), {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!backendRes.ok) {
        let errorBody = await backendRes.text();
        try { errorBody = JSON.parse(errorBody); } catch (e) { /* Keep as text */ }
        console.error(`Backend error for /records: ${backendRes.status}`, errorBody);
        return res.status(backendRes.status).json({ 
            message: `Error from backend: ${backendRes.statusText}`,
            details: errorBody 
        });
      }

      const data = await backendRes.json();
      res.status(backendRes.status).json(data);

    } catch (error: any) {
      console.error("Error in /api/records proxy:", error);
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
