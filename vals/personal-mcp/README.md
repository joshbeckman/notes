# Password-Protected Key/Value Store

A simple web application that provides a password-protected interface for managing key/value pairs with both web UI and JSON API access.

## Features

- **Password-protected web interface** for viewing current values
- **Secure form** for updating values with separate write password
- **JSON API** with Bearer token authentication
- **Persistent storage** using Val Town's blob storage
- **Responsive design** with TailwindCSS

## Environment Variables

Set these environment variables in your Val Town settings:

- `READ_PASSWORD` - Password required to view the web interface and access the JSON API (default: "read123")
- `WRITE_PASSWORD` - Password required to update values via the form (default: "write123")

## Usage

### Web Interface

1. Visit the main URL
2. Enter the `READ_PASSWORD` to access the interface
3. View current values for `age` and `status` in the table
4. Use the form to update values by providing new values and the `WRITE_PASSWORD`

### JSON API

Access the values programmatically:

```bash
curl -H "Authorization: Bearer YOUR_READ_PASSWORD" https://your-val-url.web.val.run/api/values
```

Response format:
```json
{
  "age": "25",
  "status": "active"
}
```

## API Endpoints

- `GET /` - Main web interface (requires `password` query parameter)
- `POST /update` - Update values via form submission (requires write password)
- `GET /api/values` - JSON API endpoint (requires Bearer token authentication)

## Default Values

The application initializes with:
- `age`: "25"
- `status`: "active"

## Security

- Read access requires password authentication
- Write access requires separate password authentication
- API access uses Bearer token authentication
- All passwords are checked server-side
- No sensitive data is exposed in client-side code