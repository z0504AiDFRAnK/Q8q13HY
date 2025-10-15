// 代码生成时间: 2025-10-16 03:25:29
import express, { Request, Response } from 'express';
import { Bug } from './models/Bug'; // 假设有一个Bug模型定义了缺陷跟踪的数据结构

// 创建Express应用
const app = express();
const port = 3000;

// 解析JSON格式的请求体
app.use(express.json());

// 假设有一个存储缺陷的数组
let bugs: Bug[] = [];

// 获取所有缺陷
app.get('/api/bugs', async (req: Request, res: Response) => {
    try {
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 添加一个新的缺陷
app.post('/api/bugs', async (req: Request, res: Response) => {
    try {
        const newBug = new Bug(req.body); // 创建一个新的Bug实例
        bugs.push(newBug); // 添加到缺陷列表
        res.status(201).json(newBug);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// 获取单个缺陷
app.get('/api/bugs/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const bug = bugs.find(bug => bug.id === parseInt(id));
        if (!bug) {
            res.status(404).json({ message: 'Bug not found' });
        } else {
            res.status(200).json(bug);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 更新一个缺陷的状态
app.patch('/api/bugs/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const bugIndex = bugs.findIndex(bug => bug.id === parseInt(id));
        if (bugIndex === -1) {
            res.status(404).json({ message: 'Bug not found' });
        } else {
            bugs[bugIndex].status = req.body.status; // 假设我们只更新状态字段
            res.status(200).json(bugs[bugIndex]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 删除一个缺陷
app.delete('/api/bugs/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const initialLength = bugs.length;
        bugs = bugs.filter(bug => bug.id !== parseInt(id));
        if (bugs.length === initialLength) {
            res.status(404).json({ message: 'Bug not found' });
        } else {
            res.status(204).send(); // No Content
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Bug Tracking System running on port ${port}`);
});

/**
 * 类型定义和接口
 */

interface Bug {
    id: number;
    title: string;
    description: string;
    status: string;
}
