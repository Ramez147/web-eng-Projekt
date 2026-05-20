'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Crash Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block text-9xl"
          >
            ⚠️
          </motion.div>
        </motion.div>

        {/* Error Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Oops! Terjadi Kesalahan
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6 rounded-full" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xl text-slate-700 mb-4">
            Maaf, dashboard mengalami masalah teknis. Tim kami telah diberitahu.
          </p>
          <p className="text-sm text-slate-600 font-mono bg-slate-100/80 p-4 rounded-lg mb-4 break-all border border-slate-300">
            {error.message || 'Kesalahan server internal'}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-500">
              Error ID: <span className="text-slate-600 font-semibold">{error.digest}</span>
            </p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Coba Lagi
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 border-2 border-slate-400 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all"
            >
              Kembali ke Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-slate-100/50 rounded-lg border border-slate-300"
        >
          <p className="text-slate-800 mb-3 font-semibold">Rekomendasi:</p>
          <ul className="text-left text-slate-700 space-y-2">
            <li>✓ Coba refresh halaman (Ctrl+R)</li>
            <li>✓ Bersihkan cache browser atau buka di mode Incognito</li>
            <li>✓ Periksa koneksi internet Anda</li>
            <li>✓ Jika masalah berlanjut, hubungi tim support</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
