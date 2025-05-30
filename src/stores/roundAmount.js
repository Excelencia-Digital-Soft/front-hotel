
export default function roundAmount(amount) {
  const decimalPlaces = useParams.generalParameters.roundingDecimalPlaces; // Obtén el parámetro
  if (decimalPlaces < 0) {
    // Manejar error o simplemente no redondear si el parámetro es inválido
    console.warn("El parámetro de redondeo es negativo, no se aplicará redondeo.");
    return amount;
  }

  // Calcula la potencia de 10 basada en el número de ceros
  // Si decimalPlaces es 2, factor = 10^2 = 100 (redondea a la centena)
  // Si decimalPlaces es 3, factor = 10^3 = 1000 (redondea a la unidad de mil)
  const factor = Math.pow(10, decimalPlaces);

  // Redondea el importe al múltiplo del factor más cercano
  const roundedAmount = Math.round(amount / factor) * factor;

  return roundedAmount;
}

// Ejemplo de uso:
// const totalToPay = 45346;
// const roundedTotal = roundAmount(totalToPay); // Esto usaría el parámetro del store
// console.log(roundedTotal); // Si roundingDecimalPlaces es 3, imprimiría 46000
//                           // Si roundingDecimalPlaces es 2, imprimiría 45400