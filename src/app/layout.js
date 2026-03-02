import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Pova - In sync with You 🌸',
    description: 'A secure, women-centered menstrual cycle tracking app. Track periods, get health insights, and chat with Amma — your AI health companion.',
    keywords: 'period tracker, menstrual cycle, women health, cycle prediction, pova',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                <AuthProvider>
                    <Navbar />
                    <main className="pt-20 min-h-screen">
                        {children}
                    </main>
                    <footer className="text-center py-8 text-sm text-gray-400">
                        <p>© 2026 Pova. Made with 💗 for women everywhere.</p>
                        <p className="mt-1 text-xs">This app does not replace professional medical advice.</p>
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
