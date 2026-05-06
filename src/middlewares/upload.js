import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // QUAN TRỌNG
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
