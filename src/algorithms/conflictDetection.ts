// ============================================================
// QUEENFORGE — Conflict Detection Module
// Efficient column and diagonal conflict checks using occupancy sets
// ============================================================

/**
 * Check whether placing a queen at (row, col) conflicts with any
 * existing queen. Uses O(1) lookups via column and diagonal occupancy sets.
 *
 * @param row       - Target row
 * @param col       - Target column
 * @param queens    - Current placements: queens[r] = column of queen in row r, -1 if empty
 * @param colSet    - Set of occupied columns
 * @param diagSet   - Set of occupied main diagonals (row - col)
 * @param antiDiagSet - Set of occupied anti-diagonals (row + col)
 * @returns true if the position is safe (no conflicts)
 */
export function isSafe(
  row: number,
  col: number,
  _queens: number[],
  colSet: Set<number>,
  diagSet: Set<number>,
  antiDiagSet: Set<number>
): boolean {
  // Column conflict
  if (colSet.has(col)) return false;

  // Main diagonal conflict (row - col is constant along a diagonal)
  if (diagSet.has(row - col)) return false;

  // Anti-diagonal conflict (row + col is constant along an anti-diagonal)
  if (antiDiagSet.has(row + col)) return false;

  return true;
}

/**
 * Compute all cells attacked by currently placed queens.
 * Returns a 2D boolean array where true = attacked.
 */
export function computeAttackedCells(
  size: number,
  queens: number[]
): boolean[][] {
  const attacked: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false)
  );

  for (let row = 0; row < size; row++) {
    const col = queens[row];
    if (col === -1) continue;

    // Mark entire row
    for (let c = 0; c < size; c++) {
      attacked[row][c] = true;
    }

    // Mark entire column
    for (let r = 0; r < size; r++) {
      attacked[r][col] = true;
    }

    // Mark diagonals
    for (let d = 1; d < size; d++) {
      if (row + d < size && col + d < size) attacked[row + d][col + d] = true;
      if (row + d < size && col - d >= 0)   attacked[row + d][col - d] = true;
      if (row - d >= 0 && col + d < size)   attacked[row - d][col + d] = true;
      if (row - d >= 0 && col - d >= 0)     attacked[row - d][col - d] = true;
    }
  }

  return attacked;
}

/**
 * Validate a complete solution:
 * - Exactly one queen per row
 * - No two queens share a column
 * - No two queens share a diagonal
 * - No queen on a restricted cell
 */
export function validateSolution(
  queens: number[],
  size: number,
  restricted: boolean[][]
): { valid: boolean; reason?: string } {
  // Check all rows have queens
  for (let row = 0; row < size; row++) {
    if (queens[row] < 0 || queens[row] >= size) {
      return { valid: false, reason: `Row ${row} has no valid queen placement` };
    }
  }

  // Check no queen on restricted cell
  for (let row = 0; row < size; row++) {
    if (restricted[row][queens[row]]) {
      return { valid: false, reason: `Queen at (${row}, ${queens[row]}) is on a restricted cell` };
    }
  }

  // Check columns
  const cols = new Set<number>();
  for (let row = 0; row < size; row++) {
    if (cols.has(queens[row])) {
      return { valid: false, reason: `Column ${queens[row]} has multiple queens` };
    }
    cols.add(queens[row]);
  }

  // Check diagonals
  const diags = new Set<number>();
  const antiDiags = new Set<number>();
  for (let row = 0; row < size; row++) {
    const d = row - queens[row];
    const ad = row + queens[row];
    if (diags.has(d)) {
      return { valid: false, reason: `Diagonal conflict at row ${row}` };
    }
    if (antiDiags.has(ad)) {
      return { valid: false, reason: `Anti-diagonal conflict at row ${row}` };
    }
    diags.add(d);
    antiDiags.add(ad);
  }

  return { valid: true };
}
