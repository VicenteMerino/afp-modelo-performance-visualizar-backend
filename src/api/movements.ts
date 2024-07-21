import { api } from "@app/api/baseApi";
import { BaseResponse } from "@app/types/responses/base";
import {
  MovementData,
  MovementsParsedResponse,
} from "@app/types/responses/movements";

const movementsData = {
  IdePer: process.env.AFP_MODELO_RUT?.padStart(15, "0"),
  TipoProducto: "CCO",
  TipoFondo: "A",
  strPerDesde: "200001",
  strPerHasta: new Date().toISOString().slice(0, 7).replace("-", ""),
};

async function getMovements(
  token: string,
): Promise<MovementData[] | undefined> {
  try {
    const response = await api.post<BaseResponse>(
      "/wsAfiliado/wmTraerMovimientosCerMov2",
      {
        enc: movementsData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const movements: MovementsParsedResponse = JSON.parse(
      response.data.respuesta,
    );
    return movements.wmTraerMovimientosCerMov2Response
      .wmTraerMovimientosCerMov2Result.diffgram.NewDataSet.DATA;
  } catch (error) {
    console.error(error);
  }
}

export { getMovements };
