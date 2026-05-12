import './globals.css';

export const metadata = {
  title: 'Beginner Friendly Bike Demand App',
  description: 'Simple Next.js + Tailwind app that turns user input into an estimated bike demand output.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
