// middleware/authMiddleware.js

// Middleware untuk melindungi rute yang hanya bisa diakses setelah login
export function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    // Jika user sudah login, lanjutkan ke rute berikutnya
    next();
  } else {
    // Jika user belum login, redirect ke halaman login
    res.redirect('/login?error=unauthenticated');
  }
}

// Middleware untuk melindungi rute yang hanya bisa diakses sebelum login
export function isLoggedOut(req, res, next) {
  if (!req.session.userId) {
    // Jika user belum login, lanjutkan ke rute berikutnya
    next();
  } else {
    // Jika user sudah login, redirect ke halaman dashboard
    res.redirect('/dashboard');
  }
}
