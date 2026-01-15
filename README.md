# Device Viewport Tester

A modern Next.js application for testing webpages across multiple device viewports simultaneously. Built with TypeScript, shadcn/ui, and Tailwind CSS.

## Features

- **Multi-Device Testing**: Test your websites on 5 popular device viewports at once:
  - Samsung Galaxy S24 (360×800px)
  - iPhone 15 Pro (393×852px)
  - Google Pixel 8 (412×915px)
  - iPad Air (820×1180px)
  - MacBook Air 13" (1440×900px)

- **URL Input & Validation**: Enter any URL with automatic protocol detection and validation

- **Device Chrome Toggle**: Show/hide device bezels, notches, and rounded corners

- **Individual Device Controls**: Each device has its own reload button and loading state

- **Responsive Grid Layout**: Auto-fitting grid that adapts to screen size

- **Dark Mode Support**: Full dark mode with system preference detection

- **Error Handling**: User-friendly error messages for invalid URLs and iframe loading failures

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **next-themes** for dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd device-viewport-tester
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a URL**: Type any website URL in the input field at the top (protocol is optional - `https://` will be added automatically)

2. **Load Website**: Click "Load URL" or press Enter to load the URL across all device viewports

3. **Toggle Device Chrome**: Use the switch on each device to show/hide the device frame

4. **Reload Individual Devices**: Click the refresh button on any device to reload just that viewport

5. **Toggle Dark Mode**: Click the sun/moon icon in the header to switch themes

## Project Structure

```
device-viewport-tester/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── device-frame.tsx    # Device viewport component
│   ├── url-input.tsx       # URL input with validation
│   ├── theme-provider.tsx  # Theme context provider
│   └── theme-toggle.tsx    # Dark mode toggle button
└── lib/
    ├── device-specs.ts     # Device configurations & types
    └── utils.ts            # Utility functions
```

## Features in Detail

### Device Frame Component

Each device frame includes:
- Accurate viewport dimensions
- Visual device chrome (bezels, notches)
- Loading states with spinner
- Error handling for blocked iframes
- Individual reload functionality
- Chrome visibility toggle

### URL Validation

The app validates URLs and handles:
- Automatic protocol addition
- Invalid URL detection
- User-friendly error messages
- Empty input handling

### Responsive Design

The grid layout automatically adapts:
- 1 column on mobile
- 2 columns on large screens
- Devices scale to fit while maintaining aspect ratio

## Known Limitations

Some websites may block iframe embedding due to:
- `X-Frame-Options` headers
- Content Security Policy (CSP) restrictions
- Same-origin policy

This is expected behavior for security reasons. The app will display an error message when this occurs.

## Build for Production

```bash
npm run build
npm run start
```

## Customization

### Adding New Devices

Edit `/lib/device-specs.ts` and add new device configurations:

```typescript
{
  id: "device-id",
  name: "Device Name",
  width: 000,
  height: 000,
  userAgent: "...",
  hasNotch: false,
  borderRadius: 20,
}
```

### Styling

- Modify Tailwind classes in components
- Update theme colors in `app/globals.css`
- Customize shadcn/ui components in `components/ui/`

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
