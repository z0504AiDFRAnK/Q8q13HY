// 代码生成时间: 2025-09-24 00:05:09
import express from 'express';
import fs from 'fs';
import path from 'path';

// 定义批量重命名工具的类
class BatchRenameTool {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
  }

  // 初始化路由和中间件
  initializeMiddleware() {
    this.app.use(express.json());
  }

  // 定义重命名文件的路由
  initializeRoutes() {
    this.app.post('/api/rename', async (req, res) => {
      const { files } = req.body;

      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: 'No files provided for renaming.' });
      }

      try {
        for (const file of files) {
          if (!file.oldName || !file.newName) {
            throw new Error('File object must contain oldName and newName properties.');
          }
          const oldPath = path.join(process.cwd(), file.oldName);
          const newPath = path.join(process.cwd(), file.newName);

          // 检查旧文件是否存在
          if (!fs.existsSync(oldPath)) {
            throw new Error(`File ${file.oldName} does not exist.`);
          }

          // 重命名文件
          fs.renameSync(oldPath, newPath);
        }

        res.json({ message: 'Files renamed successfully.' });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  // 启动服务器
  start() {
    this.app.listen(this.port, () => {
      console.log(`Batch rename tool is running on port ${this.port}`);
    });
  }
}

// 创建工具实例并启动
const port = 3000;
const tool = new BatchRenameTool(port);
tool.initializeMiddleware();
tool.initializeRoutes();
tool.start();