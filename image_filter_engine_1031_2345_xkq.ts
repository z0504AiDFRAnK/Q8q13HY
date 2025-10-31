// 代码生成时间: 2025-10-31 23:45:34
import express from 'express';
import { Request, Response } from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import Jimp from 'jimp';

// 定义图像滤镜引擎的类
class ImageFilterEngine {
  // 构造函数
  constructor(private app: express.Application) {
    // 注册路由
    this.registerRoutes();
  }

  // 注册图像处理的路由
  private registerRoutes(): void {
    this.app.get('/apply-filter', async (req: Request, res: Response) => {
      const { image, filter } = req.query;

      // 验证请求参数
      if (!image || !filter) {
        return res.status(400).json({ error: 'Missing image or filter parameter' });
      }

      // 读取图像文件
      const imagePath = path.join(__dirname, 'public', image as string);
      try {
        const imageBuffer = await Jimp.read(imagePath);

        // 应用滤镜
        let filteredImage;
        switch (filter as string) {
          case 'grayscale':
            filteredImage = imageBuffer.clone().grayscale();
            break;
          // 添加更多滤镜案例
          default:
            return res.status(400).json({ error: 'Invalid filter' });
        }

        // 发送处理后的图像
        filteredImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if (err) {
            return res.status(500).json({ error: 'Error processing image' });
          }
          res.setHeader('Content-Type', 'image/png');
          res.send(buffer);
        });
      } catch (error) {
        return res.status(500).json({ error: 'Error loading image' });
      }
    });
  }
}

// 创建Express应用
const app = express();
app.use(express.static('public'));

// 创建图像滤镜引擎实例
const imageFilterEngine = new ImageFilterEngine(app);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});