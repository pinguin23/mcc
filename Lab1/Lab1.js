console.log('Лабораторна робота №1, варіант №10, ОІ-31, Тесля Микола');

const x1 = [0, 0, 0, 1, 1, 2, 2, 2];
const x2 = [1.5, 2.5, 3.5, 1.5, 3.5, 1.5, 2.5, 2.5];
const y = [2.3, 7, 1, 3, 2, 8.1, 5.5, 7.2];

function leastSquares(x1, x2, y) {
  const n = x1.length;
  let sumX1 = 0, sumX2 = 0, sumY = 0, sumX1X1 = 0, sumX2X2 = 0, sumX1X2 = 0, sumX1Y = 0, sumX2Y = 0;

  for (let i = 0; i < n; i++) {
    sumX1 += x1[i];
    sumX2 += x2[i];
    sumY += y[i];
    sumX1X1 += x1[i] * x1[i];
    sumX2X2 += x2[i] * x2[i];
    sumX1X2 += x1[i] * x2[i];
    sumX1Y += x1[i] * y[i];
    sumX2Y += x2[i] * y[i];
  }

  const matrix = [
    [n, sumX1, sumX2, sumY],
    [sumX1, sumX1X1, sumX1X2, sumX1Y],
    [sumX2, sumX1X2, sumX2X2, sumX2Y]
  ];

  function gaussElimination(mat) {
    let size = mat.length;
    for (let i = 0; i < size; i++) {
      let maxRow = i;
      for (let k = i + 1; k < size; k++) {
        if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
          maxRow = k;
        }
      }
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];

      for (let k = i + 1; k < size; k++) {
        let factor = mat[k][i] / mat[i][i];
        for (let j = i; j <= size; j++) {
          mat[k][j] -= factor * mat[i][j];
        }
      }
    }

    let res = new Array(size);
    for (let i = size - 1; i >= 0; i--) {
      res[i] = mat[i][size] / mat[i][i];
      for (let k = i - 1; k >= 0; k--) {
        mat[k][size] -= mat[k][i] * res[i];
      }
    }
    return res;
  }

  return gaussElimination(matrix);
}

const [a0, a1, a2] = leastSquares(x1, x2, y);
console.log(`Рівняння: y = ${a0.toFixed(3)} + ${a1.toFixed(3)}*x1 + ${a2.toFixed(3)}*x2`);

const x1_test = 1.5, x2_test = 3;
const y_pred = a0 + a1 * x1_test + a2 * x2_test;
console.log(`Прогнозоване значення y для (x1=1.5, x2=3): ${y_pred.toFixed(3)}`);

function computeR2(x1, x2, y, a0, a1, a2) {
  let yMean = y.reduce((sum, val) => sum + val, 0) / y.length;
  let SS_tot = 0, SS_res = 0;

  for (let i = 0; i < y.length; i++) {
    let yPred = a0 + a1 * x1[i] + a2 * x2[i];
    SS_res += (y[i] - yPred) ** 2;
    SS_tot += (y[i] - yMean) ** 2;
  }
  return 1 - (SS_res / SS_tot);
}

const R2 = computeR2(x1, x2, y, a0, a1, a2);
console.log(`Коефіцієнт детермінації R²: ${R2.toFixed(3)}`);
