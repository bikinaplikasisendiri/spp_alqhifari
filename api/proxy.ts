/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  const { url, action, payload } = req.body || {};

  if (!url) {
    res.status(400).json({ error: "Missing Target Web App URL" });
    return;
  }

  try {
    if (action === "get") {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json({ success: true, data });
    } else if (action === "post") {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json({ success: true, data });
    } else {
      res.status(400).json({ error: "Invalid action. Use 'get' or 'post'." });
    }
  } catch (error: any) {
    console.error("[Proxy Error]:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to communicate with Google Sheets via Apps Script."
    });
  }
}
