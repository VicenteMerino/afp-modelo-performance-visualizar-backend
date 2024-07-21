type ShareValue = {
  descripcionProducto: string;
  esCongelado: string;
  fechaValorCuota: string;
  porcentajeDistribucion: string;
  porcentajeDistribucionRecaudacion: string;
  porcentajeSaldo: string;
  producto: string;
  saldoCuotas: string;
  saldoPesos: string;
  tipoFondo: string;
  valorCuota: string;
  subSaldo: {
    categoria: string;
    codigoRegimenTributario: string;
    estadoSaldo: string;
    fechaValorCuota: string;
    saldoCuotas: string;
    saldoPesos: string;
    valorCuota: string;
  }[];
};

type ShareParsedResponse = {
  Result: {
    Value: {
      header: string;
      Saldo: ShareValue[];
    };
    Formatters: unknown[];
    ContentTypes: unknown[];
    StatusCode: number;
  };
};

export type { ShareParsedResponse, ShareValue };
