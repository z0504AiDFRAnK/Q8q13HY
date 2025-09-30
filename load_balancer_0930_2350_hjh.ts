// 代码生成时间: 2025-09-30 23:50:42
import express from 'express';
import http from 'http';
import { random } from 'lodash';

// 定义服务端列表
const servers = [
  { url: 'http://localhost:3001', weight: 1 },
  { url: 'http://localhost:3002', weight: 2 },
  { url: 'http://localhost:3003', weight: 3 },
];

// 负载均衡器配置
const balancer = (req: express.Request, res: express.Response) => {
  const server = selectServer();
  if (!server) {
    res.status(500).send('No available servers');
    return;
  }
  req.pipe(http.get(server.url)).pipe(res);
};

// 根据权重选择服务器
const selectServer = (): http.RequestOptions | undefined => {
  const totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
  const randomPoint = random(0, totalWeight - 1);

  let accumulatedWeight = 0;
  for (const server of servers) {
    accumulatedWeight += server.weight;
    if (randomPoint < accumulatedWeight) {
      return {
        host: server.url,
        protocol: 'http:',
      };
    }
  }
  return undefined;
};

// 创建Express应用
const app = express();
app.use(express.json());

// 定义负载均衡路由
app.get('/balance', balancer);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Load balancer server running on port ${PORT}`);
});


// 请注意：
// 1. 这里的代码只是一个简单的负载均衡器示例。
// 2. 实际生产环境中，负载均衡器可能需要考虑更多的因素，例如请求健康检查、故障转移、
// 动态服务器列表管理等。
// 3. 为了简化示例，这里使用了Lodash库的random函数来生成随机数，实际应用中可能需要更复杂的随机数生成策略。