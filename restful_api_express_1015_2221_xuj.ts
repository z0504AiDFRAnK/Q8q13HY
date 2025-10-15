// 代码生成时间: 2025-10-15 22:21:47
import express from 'express';
import { Request, Response } from 'express';

// 创建Express应用
const app = express();

// 设置端口号
const PORT = 3000;

// 定义路由前缀
const ROUTE_PREFIX = '/api/items';

// 定义一个简单的数据存储
const items: Array<{ id: number; name: string }> = [];

// 定义一个接口来处理GET请求，获取所有项目
app.get(`${ROUTE_PREFIX}`, (req: Request, res: Response) => {
    res.status(200).json(items);
});

// 定义一个接口来处理POST请求，添加新项目
app.post(`${ROUTE_PREFIX}`, (req: Request, res: Response) => {
    const { id, name } = req.body;
    if (!id || !name) {
        return res.status(400).json({ message: 'Invalid input' });
    }
    items.push({ id, name });
    res.status(201).json({ id, name });
});

// 定义一个接口来处理GET请求，通过ID获取单个项目
app.get(`${ROUTE_PREFIX}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    const item = items.find(x => x.id === parseInt(id));
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
});

// 定义一个接口来处理PUT请求，更新项目
app.put(`${ROUTE_PREFIX}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const index = items.findIndex(x => x.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    items[index] = { id: parseInt(id), name };
    res.status(200).json({ id: parseInt(id), name });
});

// 定义一个接口来处理DELETE请求，删除项目
app.delete(`${ROUTE_PREFIX}/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = items.findIndex(x => x.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    items.splice(index, 1);
    res.status(200).json({ message: 'Item deleted' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
