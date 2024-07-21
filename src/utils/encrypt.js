"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const n = Buffer.from("mPUZ/D1Hk6RwfbXk9EIuB94Bgh90EE93jlOhHAslur8=", "base64");
const r = Buffer.from("Tf+QdtUlzzVLy1SwXveCzA==", "base64");
// Function to encrypt
const encrypt = (data) => {
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", n, r);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
};
exports.encrypt = encrypt;
