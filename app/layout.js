import './globals.css';

export const metadata = {
  title: 'CanadaCitizenTest.ca',
  description: 'Practice smarter for the Canadian citizenship test.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}