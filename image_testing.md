# Image / Receipt OCR Testing Playbook

- Use base64 encoded JPEG/PNG/WEBP only.
- Real visual features; no blank images.
- Resize large images before upload.
- Endpoint: `POST /api/receipts/ocr` with body `{ "image_base64": "..." }`
- Returns: `{ amount, merchant, date, suggested_category, currency, raw }`
