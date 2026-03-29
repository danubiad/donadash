import "./globals.css";

export const metadata = {
  title: "Painel DonaSystem",
  description: "Painel de controle centralizado",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
