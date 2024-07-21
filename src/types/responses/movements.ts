type MovementData = {
  HEADER: string;
  MESSAGE: string;
  SeqMvto: string;
  PerCotizacion: string;
  CodMvto: string;
  ValMlRentaImponible: number;
  FecAcreditacion: number;
  ValMlMvto: number;
  ValCuoMvto: string | number;
  IdEmpleador: string;
  CodRegTributario: string | null;
  TipoImputacion: string;
  TipoFondo: string;
  "@id": string;
  "@rowOrder": string;
};

type NewDataSet = {
  DATA: MovementData[];
};

type Diffgram = {
  NewDataSet: NewDataSet;
};

type WmTraerMovimientosCerMov2Result = {
  schema: {
    "@id": string;
    element: {
      "@name": string;
      "@IsDataSet": string;
      "@UseCurrentLocale": string;
      complexType: {
        choice: {
          "@minOccurs": string;
          "@maxOccurs": string;
          element: {
            "@name": string;
            complexType: {
              sequence: {
                element: {
                  "@name": string;
                  "@type": string;
                  "@minOccurs": string;
                }[];
              };
            };
          };
        };
      };
    };
  };
  diffgram: Diffgram;
};

type WmTraerMovimientosCerMov2Response = {
  wmTraerMovimientosCerMov2Result: WmTraerMovimientosCerMov2Result;
};

type MovementsParsedResponse = {
  wmTraerMovimientosCerMov2Response: WmTraerMovimientosCerMov2Response;
};

export type { MovementData, MovementsParsedResponse };
