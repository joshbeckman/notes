import { Hono } from 'npm:hono';
import { toFetchResponse, toReqRes } from "npm:fetch-to-node";
import { z } from "npm:zod@3.25.75";
import { StreamableHTTPServerTransport } from "npm:@modelcontextprotocol/sdk@1.16.0/server/streamableHttp.js";
import { McpServer, ResourceTemplate } from "npm:@modelcontextprotocol/sdk@1.16.0/server/mcp.js";
import { email } from "https://esm.town/v/std/email";
import { blob } from "https://esm.town/v/std/blob";

const app = new Hono();

// Storage keys
const STORAGE_KEY = "personal_mcp";
const SERVER_VERSION = "1.2.0";
const FIELDS = [
  "about",
  "age",
  "status",
  "timezone",
];
// Get environment variables
const READ_PASSWORD = Deno.env.get("READ_PASSWORD") || "read123";
const WRITE_PASSWORD = Deno.env.get("WRITE_PASSWORD") || "write123";
const JINA_AI_TOKEN = Deno.env.get("JINA_AI_TOKEN");

// Initialize default values if they don't exist
async function initializeStorage() {
  const existing = await blob.getJSON(STORAGE_KEY);
  if (!existing) {
    const defaultValues: Record<string, string> = {};
    FIELDS.forEach(field => {
      if (field === "status") {
        defaultValues[field] = Math.random() > 0.5 ? "active" : "inactive";
      } else {
        defaultValues[field] = "";
      }
    });
    await blob.setJSON(STORAGE_KEY, defaultValues);
  }
}

// Helper function to get current values
async function getValues() {
  await initializeStorage();
  return await blob.getJSON(STORAGE_KEY);
}

// Helper function to update values
async function updateValues(newValues: Record<string, string>) {
  const current = await getValues();
  const updated = { ...current, ...newValues, updated_at: new Date().toISOString() };
  await blob.setJSON(STORAGE_KEY, updated);
  return updated;
}

// Helper function to build time string for a given timezone
function buildTimeString(timezone: string): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleString('sv-SE', options);
}

// Helper function to get part of day based on timezone
function getPartOfDay(timezone: string): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  };
  const hours = parseInt(date.toLocaleTimeString('en-US', options));
  if (hours < 6) {
    return "night";
  } else if (hours < 12) {
    return "morning";
  } else if (hours < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
}

function timeRelative(date) {
    var now = new Date();
    var seconds = Math.floor((now - date) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);

    // Handle future times
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        minutes = Math.abs(minutes);
        hours = Math.abs(hours);
        days = Math.abs(days);
        months = Math.abs(months);
        years = Math.abs(years);

        if (minutes < 1) {
            return "in a moment";
        } else if (minutes < 2) {
            return "in a minute";
        } else if (hours < 1) {
            return "in " + minutes + " minutes";
        } else if (hours < 2) {
            return "in an hour";
        } else if (days < 1) {
            return "in " + hours + " hours";
        } else if (days < 2) {
            return "tomorrow";
        } else if (days < 7) {
            return "in " + days + " days";
        } else if (days < 14) {
            return "next week";
        } else if (months < 1) {
            return "in " + days + " days";
        } else if (months < 2) {
            return "next month";
        } else if (years < 1) {
            return "in " + months + " months";
        } else if (years < 2) {
            return "next year";
        } else if (years < 10) {
            return "in " + years + " years";
        } else {
            return date.toLocaleDateString();
        }
    }

    // Handle past times (existing logic)
    if (minutes < 1) {
        return "just now";
    } else if (minutes < 2) {
        return "a minute ago";
    } else if (hours < 1) {
        return minutes + " minutes ago";
    } else if (hours < 2) {
        return "an hour ago";
    } else if (days < 1) {
        return hours + " hours ago";
    } else if (days < 2) {
        return "yesterday";
    } else if (days < 7) {
        return days + " days ago";
    } else if (days < 14) {
        return "last week";
    } else if (months < 1) {
        return days + " days ago";
    } else if (months < 2) {
        return "last month";
    } else if (years < 1) {
        return months + " months ago";
    } else if (years < 2) {
        return "last year";
    } else if (years < 10) {
        return years + " years ago";
    } else {
        return date.toLocaleDateString();
    }
}

// Helper function to get granular season based on timezone and current date
function getSeason(timezone: string): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    month: 'numeric',
    day: 'numeric',
  };
  const localDate = date.toLocaleDateString('en-US', options);
  const [month, day] = localDate.split('/').map(Number);
  // Calculate day of year for more granular seasons
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  // 13 granular seasons mapped to approximate day ranges (365 days / 13 ≈ 28 days each)
  if (dayOfYear <= 28) return "New Year";
  else if (dayOfYear <= 56) return "Frozen Winter";
  else if (dayOfYear <= 84) return "Winter";
  else if (dayOfYear <= 112) return "Early Spring";
  else if (dayOfYear <= 140) return "Wet Spring";
  else if (dayOfYear <= 168) return "Spring";
  else if (dayOfYear <= 196) return "Breaking Summer";
  else if (dayOfYear <= 224) return "Summer";
  else if (dayOfYear <= 252) return "Hot Summer";
  else if (dayOfYear <= 280) return "Early Autumn";
  else if (dayOfYear <= 308) return "Autumn";
  else if (dayOfYear <= 336) return "Closing Autumn";
  else return "Early Winter";
}

// Helper function to get about information from jina.ai
async function getAbout(): Promise<string> {
  if (!JINA_AI_TOKEN) {
    return "No JINA_AI_TOKEN available";
  }
  try {
    const response = await fetch("https://r.jina.ai/https://www.joshbeckman.org/about/", {
      headers: {
        "Authorization": `Bearer ${JINA_AI_TOKEN}`
      }
    });
    if (!response.ok) {
      return `Error fetching about information: ${response.status} ${response.statusText}`;
    }
    return await response.text();
  } catch (error) {
    return `Error fetching about information: ${error.message}`;
  }
}

// Main HTML page (requires read password)
app.get("/", async (c) => {
  const password = c.req.query("password");
  if (password !== READ_PASSWORD) {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Required</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.twind.style" crossorigin></script>
      </head>
      <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 class="text-2xl font-bold mb-6 text-center">Enter Password</h1>
          <form method="GET" class="space-y-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <button 
              type="submit" 
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Access
            </button>
          </form>
        </div>
      </body>
      </html>
    `);
  }

  // Password is correct, show the main page
  const values = await getValues();
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Key/Value Store</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.twind.style" crossorigin></script>
    </head>
    <body class="bg-gray-100 min-h-screen py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">Key/Value Store</h1>
        <!-- Current Values Table -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Current Values</h2>
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 px-4 font-medium">Key</th>
                <th class="text-left py-2 px-4 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              ${FIELDS.map(field => `
                <tr class="border-b">
                  <td class="py-2 px-4">${field}</td>
                  <td class="py-2 px-4">${values[field] || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <!-- Update Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Update Values</h2>
          <form method="POST" action="/update" class="space-y-4">
            ${FIELDS.map(field => `
              <div>
                <label for="${field}" class="block text-sm font-medium text-gray-700 mb-2">${field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input 
                  type="text" 
                  id="${field}" 
                  name="${field}" 
                  value="${values[field] || ''}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            `).join('')}
            <div>
              <label for="write_password" class="block text-sm font-medium text-gray-700 mb-2">Write Password:</label>
              <input 
                type="password" 
                id="write_password" 
                name="write_password" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <button 
              type="submit" 
              class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Update Values
            </button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle form submission to update values
app.post("/update", async (c) => {
  const formData = await c.req.formData();
  const writePassword = formData.get("write_password") as string;

  if (writePassword !== WRITE_PASSWORD) {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.twind.style" crossorigin></script>
      </head>
      <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 class="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p class="mb-4">Invalid write password.</p>
          <a href="/" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 inline-block">Go Back</a>
        </div>
      </body>
      </html>
    `);
  }

  // Collect values for all fields
  const updateData: Record<string, string> = {};
  FIELDS.forEach(field => {
    const value = formData.get(field) as string;
    if (value !== null) {
      updateData[field] = value;
    }
  });

  // Fetch fresh about information from jina.ai
  const aboutText = await getAbout();
  updateData.about = aboutText;

  // Update the values
  await updateValues(updateData);

  // Redirect back to main page
  return new Response(null, {
    status: 302,
    headers: { Location: `/?password=${READ_PASSWORD}` }
  });
});

// JSON API endpoint (requires Bearer token)
app.get("/api", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  if (token !== READ_PASSWORD) {
    return c.json({ error: "Invalid token" }, 401);
  }

  const values = await getValues();
  const partOfDay = getPartOfDay(values.timezone || "UTC");
  const timeString = buildTimeString(values.timezone || "UTC");
  const season = getSeason(values.timezone || "UTC");
  return c.json({
      ...values,
      part_of_day: partOfDay,
      time: timeString,
      season,
      version: SERVER_VERSION,
  });
});

app.post("/mcp", async (c) => {
  const { req, res } = toReqRes(c.req.raw);

  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Authorization header is required",
        },
        id: null,
      },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  if (token !== READ_PASSWORD) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Invalid authorization token",
        },
        id: null,
      },
      { status: 403 }
    );
  }

  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

    // Added for extra debuggability
    transport.onerror = console.error.bind(console);

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, await c.req.json());

    res.on("close", () => {
      transport.close();
      mcpServer.close();
    });

    return toFetchResponse(res);
  } catch (e) {
    console.error(e);
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      },
      { status: 500 }
    );
  }
});

app.get("/mcp", async (c) => {
  console.log(`${new Date().toISOString()} Received GET MCP request`);
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    },
    { status: 405 }
  );
});

app.delete("/mcp", async (c) => {
  console.log(`${new Date().toISOString()} Received DELETE MCP request`);
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    },
    { status: 405 }
  );
});

async function setupMcpServer(): Promise<McpServer> {
  const server = new McpServer({
    name: "Josh Beckman Personal State",
    version: SERVER_VERSION,
    description: "MCP server that provides current state and details of Josh Beckman.",
  },
  { capabilities: { logging: {} } });

  try {
    server.registerTool(
        "get_status",
        {
            title: "Josh Beckman's Status",
            description: "Get the latest status of Josh Beckman.",
            inputSchema: {},
        },
        async () => {
            const values = await getValues();
            const updatedAt = values.updated_at ? `Updated ${timeRelative(new Date(values.updated_at))}` : "";
            return {
                content: [{ type: "text", text: `${values.status || "No status available"}\n\n${updatedAt}` }]
            };
        }
    );
    server.registerTool(
        "get_age",
        {
            title: "Josh Beckman's Age",
            description: "Get the age of Josh Beckman.",
            inputSchema: {},
        },
        async () => {
            const values = await getValues();
            return {
                content: [{ type: "text", text: values.age || "No age information available" }]
            };
        }
    );
    server.registerTool(
        "get_about",
        {
            title: "About Josh Beckman",
            description: "Get basic information about Josh Beckman.",
            inputSchema: {},
        },
        async () => {
            const values = await getValues();
            return {
                content: [{ type: "text", text: values.about || "No about information available" }]
            };
        }
    );
    server.registerTool(
        "get_current_time_of_day",
        {
            title: "Current Time of Day for Josh Beckman",
            description: "Get the current time of day Josh Beckman is experiencing, including timezone, part of day, and season.",
            inputSchema: {},
        },
        async () => {
            const values = await getValues();
            const timezone = values.timezone || "UTC";
            const timeString = buildTimeString(timezone);
            const partOfDay = getPartOfDay(timezone);
            const season = getSeason(timezone);
            return {
                content: [{ type: "text", text: `The current time for Josh (in ${timezone}) is ${timeString} and it's ${partOfDay}.\nThe season is ${season}.` }]
            };
        }
    );
    server.registerTool(
        "compare_time_relative",
        {
            title: "Time Relative to Josh Beckman",
            description: "Get the relative time from now to a given timestamp in Josh Beckman's timezone.",
            inputSchema: {
                timestamp: z.string().datetime(),
            },
        },
        async ({ timestamp }) => {
            const time = new Date(timestamp);
            if (isNaN(time.getTime())) {
                return {
                    content: [{ type: "text", text: "Invalid timestamp provided" }]
                };
            }
            return {
                content: [{ type: "text", text: timeRelative(time) }]
            };
        }
    );
    server.registerTool(
        "email_josh",
        {
            title: "Email Josh Beckman",
            description: "Send an email to Josh Beckman. The body should be a plain text message in markdown syntax.",
            inputSchema: {
                subject: z.string(),
                body: z.string(),
                replyTo: z.string().email("Must be a valid email address"),
            },
        },
        async ({ subject, body, replyTo }) => {
            await email({
              subject: subject,
              text: body,
              replyTo: replyTo,
            });
            return {
                content: [{ type: "text", text: `Email "${subject}" sent successfully!` }]
            };
        }
    );

    return server;
  } catch (error) {
    console.error("Error setting up MCP server:", error);
    throw error;
  }
}

const mcpServer = await setupMcpServer();

export default app.fetch;
