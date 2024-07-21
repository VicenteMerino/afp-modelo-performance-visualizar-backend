import crypto from "crypto";

const n = Buffer.from("mPUZ/D1Hk6RwfbXk9EIuB94Bgh90EE93jlOhHAslur8=", "base64");
const r = Buffer.from("Tf+QdtUlzzVLy1SwXveCzA==", "base64");

// Function to encrypt
const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", n, r);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};

export { encrypt };
