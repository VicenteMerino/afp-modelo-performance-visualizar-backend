"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const n = Buffer.from("mPUZ/D1Hk6RwfbXk9EIuB94Bgh90EE93jlOhHAslur8=", "base64");
const r = Buffer.from("Tf+QdtUlzzVLy1SwXveCzA==", "base64");
const decrypt = (encryptedBase64) => {
    const encryptedBuffer = Buffer.from(encryptedBase64, "base64");
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", n, r);
    let decrypted = decipher.update(encryptedBuffer.toString("binary"), "binary", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
exports.decrypt = decrypt;
