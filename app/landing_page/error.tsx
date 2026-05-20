'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LandingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Landing page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Terjadi Kesalahan!
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6 rounded-full" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xl text-slate-300 mb-4">
            Mohon maaf, sesuatu yang tidak terduga terjadi di halaman ini.
          </p>
          <p className="text-sm text-slate-400 font-mono bg-slate-800/50 p-4 rounded-lg mb-4 break-all">
            {error.message || 'Kesalahan server internal'}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-500">
              Error ID: <span className="text-slate-400">{error.digest}</span>
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
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            Coba Lagi
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-block px-8 py-3 border-2 border-slate-400 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 transition-all"
            >
              Kembali ke Beranda
            </Link>
          </motion.div>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-slate-800/30 rounded-lg border border-slate-700/50"
        >
          <p className="text-slate-300 mb-3 font-semibold">Apa yang bisa Anda coba:</p>
          <ul className="text-left text-slate-400 space-y-2">
            <li>✓ Segarkan halaman dengan menekan F5</li>
            <li>✓ Periksa koneksi internet Anda</li>
            <li>✓ Bersihkan cache browser</li>
            <li>✓ Hubungi tim support jika masalah berlanjut</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
