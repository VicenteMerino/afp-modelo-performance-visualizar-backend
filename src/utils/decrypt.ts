import crypto from "crypto";

const n = Buffer.from("mPUZ/D1Hk6RwfbXk9EIuB94Bgh90EE93jlOhHAslur8=", "base64");
const r = Buffer.from("Tf+QdtUlzzVLy1SwXveCzA==", "base64");

const decrypt = (encryptedBase64: string) => {
  const encryptedBuffer = Buffer.from(encryptedBase64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", n, r);

  let decrypted = decipher.update(
    encryptedBuffer.toString("binary"),
    "binary",
    "utf8",
  );
  decrypted += decipher.final("utf8");

  return decrypted;
};

export { decrypt };
