import cloudinary from '../configs/cloudinary.js';

export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video', // audio dùng video
            folder: 'duckchat/audio',
            format: 'mp3', // optional
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

    const result = await uploadStream();

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      duration: result.duration,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server!',
    });
  }
};
