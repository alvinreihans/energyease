// middleware/authMiddleware.js

// Middleware untuk melindungi rute yang hanya bisa diakses setelah login
export function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    // Jika user sudah login, lanjutkan ke rute berikutnya
    next();
  } else {
    // Jika user belum login, redirect ke halaman login di bawah subpath /energyease
    res.redirect('/energyease/login?error=unauthenticated');
  }
}

// Middleware untuk melindungi rute yang hanya bisa diakses sebelum login
export function isLoggedOut(req, res, next) {
  if (!req.session.userId) {
    // Jika user belum login, lanjutkan ke rute berikutnya
    next();
  } else {
    // Jika user sudah login, redirect ke dashboard di bawah subpath /energyease
    res.redirect('/energyease/dashboard');
  }
}
