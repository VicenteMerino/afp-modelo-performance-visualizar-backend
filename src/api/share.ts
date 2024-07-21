import { api } from "@app/api/baseApi";
import { BaseResponse } from "@app/types/responses/base";
import { ShareParsedResponse, ShareValue } from "@app/types/responses/share";

const movementsData = {
  idPersona: process.env.AFP_MODELO_RUT?.padStart(15, "0"),
};

async function getShare(token: string): Promise<ShareValue | undefined> {
  try {
    const response = await api.post<BaseResponse>(
      "/ApiAfiliado/api/v0/ConsultaSaldo264NCG/ConsultaSaldo",
      {
        enc: movementsData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const movements: ShareParsedResponse = JSON.parse(response.data.respuesta);
    return movements.Result.Value.Saldo[0];
  } catch (error) {
    console.error(error);
  }
}

export { getShare };
