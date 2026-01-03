---
layout: Post
date: '2025-08-06 03:20:57 +0000'
title: 'Don''t Forget: Remote MCP Servers are Just cURL Calls'
toc: true
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114980233146696855
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lvpjgmsesj2a
hacker_news_url: https://news.ycombinator.com/item?id=45451909
tags:
- code-snippets
- software-engineering
- llm
- popular
serial_number: 2025.BLG.123
---
You can call any [`streamable-http` transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) MCP (Model Context Protocol) [server tool](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) with any HTTP client - even cURL!

And lots of things take [cURL](https://curl.se/) as example configuration (like [Shopify Flow](https://www.shopify.com/flow)!), so it's a good starting point for building things.

## cURL Translation Template

Here's an example MCP server configuration/structure you might see documented (e.g. [the MCP server for this site](https://www.joshbeckman.org/blog/i-built-an-mcp-server-for-my-site)), for example to copy into your Claude Code or Cursor settings:
```json
{
  "mcpServers": {
    "josh-notes": {
      "type": "http",
      "url": "https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp",
      "headers": {
        "Authorization": "Bearer my-secret-token"
      }
    }
  }
}
```

That's saying that there's an MCP server called `josh-notes` which is an HTTP server at the URL specified. It requires an authorization header.

Let's say I know that this MCP server supports the tool `get_proverbs` and that tool supports a `limit` parameter:

```
Tools available on 'josh-notes':

  get_proverbs
    Description: Retrieve Josh's favorite proverbs. Proverbs are short, pithy sayings that express a general truth or piece of advice that Josh holds dear. They serve as anchors for decisions and hold value. There are dozens of proverbs.
    Parameters:
      - limit: number
```

Well, we can translate any MCP server tool call into cURL using this template:
```bash
curl -X POST <SERVER_URL> \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "<AUTH_HEADERS_IF_ANY>" \
    -d '{
      "jsonrpc": "2.0",
      "id": "<SESSION_ID>",
      "method": "tools/call",
      "params": {
        "name": "<TOOL-NAME>",
        "arguments": {
          "<ARG_1>": "<VALUE_1>"
        }
      }
    }'
```

So applying that template to this example MCP server tool call gives us the following cURL command:
```bash
curl -X POST https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "Authorization: Bearer my-secret-token" \
    -d '{
      "jsonrpc": "2.0",
      "id": "example-session-id",
      "method": "tools/call",
      "params": {
        "name": "get_proverbs",
        "arguments": {
          "limit": 1
        }
      }
    }'
```

Notes on how to fill in the template:
- If you don't have a session ID, you can use any unique string (like a UUID or a timestamp or even just `1`).
- Replace `<SERVER_URL>` with the URL of the MCP server.
- Replace `<AUTH_HEADERS_IF_ANY>` with any required authorization headers (like `Authorization` header). Or if there are no auth headers, just remove that line.
- Replace `<TOOL_NAME>` with the name of the tool you want to call.
- Replace `<ARG_1>` and `<VALUE_1>` with the actual arguments for the tool call.
- If the tool has multiple arguments, you can add more key-value pairs in the `arguments` object.
- If an argument's value is a string, make sure to wrap it in quotes. If it's a number, you can just use the number without quotes.

If you execute that, you'll see a response like this:
```
event: message
data: {"result":{"content":[{"type":"text","text":"Avoid administrative distraction."}]},"jsonrpc":"2.0","id":"example-session-id"}
```

Ah! The MCP server returns responses in Server-Sent Events (SSE) format, not plain JSON! We need to parse it.

Here's how we can use basic command line utilities to grab just the JSON from the SSE response:
```bash
# Parse SSE response to extract JSON result
curl -s -X POST <SERVER_URL> \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "<AUTH_HEADERS_IF_ANY>" \
    -d '{"jsonrpc":"2.0","id":"<SESSION_ID>","method":"tools/call","params":{"name":"<TOOL_NAME>","arguments":{"<ARG_1>": "<VALUE_1>"}}}' \
    | grep '^data: ' \
    | sed 's/^data: //' \
    | grep -v '\[DONE\]'
```

And here's how we can parse that JSON with the `jq` command line utility to, for example, extract the first `text` item from the response:
```bash
# Parse response to extract first text content
curl -s -X POST <SERVER_URL> \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "<AUTH_HEADERS_IF_ANY>" \
    -d '{"jsonrpc":"2.0","id":"<SESSION_ID>","method":"tools/call","params":{"name":"<TOOL_NAME>","arguments":{"<ARG_1>": "<VALUE_1>"}}}' \
    | grep '^data: ' \
    | sed 's/^data: //' \
    | grep -v '\[DONE\]' \
    | jq -r '.result.content[0].text'
```

You can translate this into any programming language that can make HTTP requests and parse strings. That's basically any language!

The point is that MCP server tools are just HTTP POST requests with a specific JSON structure, and the responses are in a parseable JSON format. It's not too hard to work with!

There's a whole explosion of MCP server tools out there, and you can use this pattern to call any of them. Just replace the server URL, tool name, and arguments as needed. Don't let vendors lock you into their proprietary APIs - use MCP server tools to access the functionality you need in a standardized way! It's a [lovely open protocol](https://www.joshbeckman.org/blog/using-open-protocols).

Here are some example translations:

## JavaScript

 ```js
fetch('<SERVER_URL>', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream, application/json',
    'Authorization': 'Bearer my-secret-token' // if needed
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: '<SESSION_ID>', // can be any unique string
    method: 'tools/call',
    params: {
      name: '<TOOL_NAME>',
      arguments: {
        '<ARG_1>': '<VALUE_1>'
      }
    }
  })
}).then(response => {
  const reader = response.body.getReader();
  let result = '';
  return new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          const chunk = new TextDecoder().decode(value);
          result += chunk;
          controller.enqueue(chunk);
          push();
        });
      }
      push();
    }
  });
}).then(stream => {
  return new Response(stream).text();
}).then(body => {
  const output = parseSSEResponse(body);
  console.log(output); // {"content":[{"type":"text","text":"Practicality beats purity."}]}
}).catch(error => {
  console.error('Error:', error);
});

function parseSSEResponse(body) {
  const lines = body.split('\n');
  let result = null;
  let error = null;

  for (const line of lines) {
    if (line.trim() === '') continue;

    if (line.startsWith('data: ')) {
      const data = line.substring(6);
      if (data === '[DONE]') continue;

      try {
        const json = JSON.parse(data);
        if (json.error) {
          error = json.error;
        } else if (json.result) {
          result = json.result;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }

  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }

  if (result === null) {
    throw new Error('No result received from server');
  }

  return result;
}
```

## Ruby

```ruby
require 'net/http'
require 'json'
require 'securerandom'

def call_mcp_tool(url, headers, name, arguments)
  uri = URI(url)
  message = {
    jsonrpc: '2.0',
    id: SecureRandom.uuid,
    method: 'tools/call',
    params: {
      name: name,
      arguments: arguments
    }
  }

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == 'https'
  http.read_timeout = 30

  request = Net::HTTP::Post.new(uri.path.empty? ? '/' : uri.path)
  request['Content-Type'] = 'application/json'
  request['Accept'] = 'text/event-stream, application/json'
  headers.each do |key, value|
    request[key] = value
  end
  request.body = JSON.generate(message)

  response = http.request(request)
  unless response.code == '200'
    raise "HTTP error: #{response.code} #{response.message}"
  end

  parse_sse_response(response.body)
end

def parse_sse_response(body)
  lines = body.split("\n")
  result = nil
  error = nil

  lines.each do |line|
    next if line.strip.empty?

    next unless line.start_with?('data: ')

    data = line[6..]
    next if data == '[DONE]'

    begin
      json = JSON.parse(data)
      if json['error']
        error = json['error']
      elsif json['result']
        result = json['result']
      end
    rescue JSON::ParserError
      raise "Failed to parse SSE data: #{data}"
    end
  end

  if error
    raise "MCP Error: #{error['message'] || error.to_s}"
  elsif result.nil?
    raise 'No result received from server'
  end

  result
end

call_mcp_tool(
  '<SERVER_URL>',
  {
    'Authorization' => 'Bearer my-secret-token' # if needed
  },
  '<TOOL_NAME>',
  {
    '<ARG_1>' => '<VALUE_1>'
  }
)
```

## GraphQL

Here's an example GraphQL type defition for that parsed `output` structure:

```graphql
type Output {
  content: [MCPContent!]!
}

union MCPContent = MCPTextContent | MCPImageContent | MCPResourceContent

type MCPTextContent {
  type: String! # "text"
  text: String!
}

type MCPImageContent {
  type: String! # "image"
  data: String! # base64 encoded
  mimeType: String!
}

type MCPResourceContent {
  type: String! # "resource"
  resource: MCPResource!
}

type MCPResource {
  uri: String!
  mimeType: String
  text: String
  blob: String # base64 encoded
}
```

