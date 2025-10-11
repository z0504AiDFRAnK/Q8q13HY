// 代码生成时间: 2025-10-11 20:42:43
import express, { Request, Response } from 'express';

// 创建一个概率分布计算器的类
class ProbabilityCalculator {
  // 计算平均值
  public static mean(values: number[]): number {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  // 计算中位数
  public static median(values: number[]): number {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const midIndex = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
      return (sortedValues[midIndex] + sortedValues[midIndex - 1]) / 2;
    } else {
      return sortedValues[midIndex];
    }
  }

  // 计算标准差
  public static standardDeviation(values: number[]): number {
    const mean = ProbabilityCalculator.mean(values);
    const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }
}

// 创建一个简单的EXPRESS服务器
const app = express();
const PORT = process.env.PORT || 3000;

// 解析JSON请求体
app.use(express.json());

// 路由：/calculate，接收POST请求进行概率分布计算
app.post('/calculate', (req: Request, res: Response) => {
  try {
    // 从请求体中获取数值数组
    const { values } = req.body;
    if (!Array.isArray(values) || !values.every(Number.isFinite)) {
      return res.status(400).json({
        error: 'Invalid input: values must be a finite number array.'
      });
    }

    // 计算概率分布
    const meanResult = ProbabilityCalculator.mean(values);
    const medianResult = ProbabilityCalculator.median(values);
    const stdDeviationResult = ProbabilityCalculator.standardDeviation(values);

    // 返回计算结果
    res.json({
      mean: meanResult,
      median: medianResult,
      standardDeviation: stdDeviationResult,
    });
  } catch (error: any) {
    // 错误处理
    res.status(500).json({ error: error.message });
  }
});

// 服务器监听指定端口
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});