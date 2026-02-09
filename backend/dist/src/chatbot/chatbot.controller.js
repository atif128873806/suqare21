"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const chatbot_service_1 = require("./chatbot.service");
const chatbot_dto_1 = require("./dto/chatbot.dto");
let ChatbotController = class ChatbotController {
    chatbotService;
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    async handleMessage(body) {
        return this.chatbotService.handleMessage(body.visitorId, body.message);
    }
    async captureLead(body) {
        return this.chatbotService.captureLead(body);
    }
    async getConversations() {
        return this.chatbotService.getConversations();
    }
    async getChatLeads() {
        return this.chatbotService.getChatLeads();
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chatbot_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "handleMessage", null);
__decorate([
    (0, common_1.Post)('capture-lead'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chatbot_dto_1.CaptureChatLeadDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "captureLead", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('conversations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getConversations", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('leads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getChatLeads", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map