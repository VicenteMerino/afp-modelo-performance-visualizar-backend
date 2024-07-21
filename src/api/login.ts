import { api } from "@app/api/baseApi";
import { BaseResponse } from "@app/types/responses/base";
import dotenv from "dotenv";

dotenv.config();

const loginData = {
  Username: process.env.AFP_MODELO_RUT?.padStart(15, "0"),
  Password: process.env.AFP_MODELO_PASSWORD,
};

console.log(JSON.stringify(loginData));

console.log(
  JSON.stringify({
    Usernane: process.env.AFP_MODELO_RUT?.padStart(15, "0"),
    Password: process.env.AFP_MODELO_PASSWORD,
  }),
);

async function login(): Promise<string | undefined> {
  try {
    const response = await api.post<BaseResponse>("/api/AuthLog", {
      enc: loginData,
    });
    const parsedResponse: LoginParsedResponse = JSON.parse(
      response.data.respuesta,
    );
    return parsedResponse.Token;
  } catch (error) {
    console.error(error);
  }
}

export { login };
