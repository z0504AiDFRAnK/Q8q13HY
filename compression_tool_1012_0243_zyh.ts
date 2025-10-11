// 代码生成时间: 2025-10-12 02:43:21
import express from 'express';
import compression from 'compression';
import zlib from 'zlib';

// 创建Express应用
const app = express();
const port = 3000;

// 使用compression中间件，自动对响应体进行gzip压缩
app.use(compression());

// POST接口用于接收要压缩的数据
app.post('/compress', (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).json({
      error: 'No data provided for compression'
    });
  }
  const data = req.body.data;

  zlib.deflate(data, (error, buffer) => {
    if (error) {
      return res.status(500).json({
        error: 'Compression failed'
      });
    }
    res.status(200).json({
      compressedData: buffer.toString('base64')
    });
  });
});

// POST接口用于接收要解压的数据
app.post('/decompress', (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).json({
      error: 'No data provided for decompression'
    });
  }
  const compressedData = req.body.data;

  zlib.inflate(Buffer.from(compressedData, 'base64'), (error, buffer) => {
    if (error) {
      return res.status(500).json({
        error: 'Decompression failed'
      });
    }
    res.status(200).json({
      decompressedData: buffer.toString()
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Compression tool running on port ${port}`);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});
