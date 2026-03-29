export const metadata = {
  title: 'Painel DonaSystem',
  description: 'Painel de controle centralizado',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  );
}
