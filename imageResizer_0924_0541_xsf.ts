// 代码生成时间: 2025-09-24 05:41:30
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 创建 Express 应用
const app = express();

// 设置静态文件目录，用于存放上传的原图和调整后的图片
app.use(express.static('public'));

// 配置 multer，用于处理图片文件的上传
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

// 路由：上传图片并调整尺寸
app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    // 检查是否有文件上传
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // 存储调整后的图片的路径和名称
    const resizedImages = [];

    // 遍历上传的文件并调整尺寸
    for (const file of req.files) {
      const inputPath = path.join(__dirname, `${file.path}`);
      const outputPath = path.join('public/resized', `${Date.now()}-${path.extname(file.originalname)}`);
      await sharp(inputPath)
        .resize({ width: 300, height: 300 }) // 调整图片尺寸
        .toFile(outputPath)
        .then(() => {
          resizedImages.push(outputPath);
        }).catch((error) => {
          console.error('Error resizing image:', error);
          return res.status(500).json({ message: 'Error resizing image.' });
        });
    }

    // 返回调整后的图片路径
    res.json({ resizedImages });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ message: 'Error handling upload.' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});