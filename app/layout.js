import './globals.css';

export const metadata = {
  title: 'Journal MVP',
  description: 'Journaling app MVP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
