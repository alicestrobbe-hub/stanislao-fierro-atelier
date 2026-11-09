import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Stanislao Fierro — Architettura',description:'Spazi pubblici, edifici e luoghi da abitare. Lo studio di architettura di Stanislao Fierro a Bolzano.'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>){return <html lang="it"><body>{children}</body></html>}
