// 代码生成时间: 2025-10-09 15:41:32
import express from 'express';
import { Request, Response } from 'express';

// 定义聊天机器人的响应库
const chatResponses = {
    "greeting": "Hello! How can I assist you today?",
    "farewell": "Thank you for talking with me. Have a great day!",
    "default": "I'm not sure how to respond to that. Can you please rephrase?"
};

// 创建Express应用
const app = express();

// 设置端口号
const PORT = process.env.PORT || 3000;

// 定义聊天机器人的中间件
app.use(express.json());

// 聊天机器人主函数
app.post('/chat', (req: Request, res: Response) => {
    const userMessage = req.body.message;
    
    // 错误处理：检查用户消息是否有效
    if (!userMessage) {
        return res.status(400).json({
            error: 'Invalid request, message is required.'
        });
    }
    
    // 根据用户消息生成响应
    let response = chatResponses.default;
    
    // 简单的问候识别
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = chatResponses.greeting;
    } else if (userMessage.toLowerCase().includes('bye') || userMessage.toLowerCase().includes('goodbye')) {
        response = chatResponses.farewell;
    }
    
    // 返回聊天机器人的响应
    res.json({
        message: response
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Chat bot server is running on port ${PORT}`);
});
