import express from 'express';
import {sentMessage , getMessageByConversation} from '../controllers/messageController.js';

const router = express.Router();

router.post('/' , sentMessage);
router.get('/:conversationId' , getMessageByConversation);

export default router;