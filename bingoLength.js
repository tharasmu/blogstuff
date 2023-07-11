function simulateBingoGame(draws, players) {
  let grids = Array.from({ length: players }, () => createGrid(draws)); // Initialize grids for each player
  let drawCount = 0;

  let availableNumbers = Array.from({ length: draws }, (_, i) => i + 1); // Available numbers for drawing
  while (true) {
    drawCount++;

    // Draw a number from the available numbers
    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let number = availableNumbers.splice(randomIndex, 1)[0];

    // Update each player's grid with the drawn number
    for (let i = 0; i < players; i++) {
      markNumber(grids[i], number);
      if (hasWinningLine(grids[i])) {
        // Exit immediately when a winning line is found
        return drawCount;
      }
    }

    // Should be impossible for this to trigger now, but it was helpful while hasWinningLine had bugs
    if(availableNumbers.length === 0) {
      break;
    }
  }
  return draws;
}

function createGrid(draws) {
  let grid = Array.from({ length: 5 }, () => Array(5).fill(0));
  let availableNumbers = Array.from({ length: draws }, (_, i) => i + 1);

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let randomIndex = Math.floor(Math.random() * availableNumbers.length);
      grid[i][j] = availableNumbers.splice(randomIndex, 1)[0];
    }
  }

  return grid;
}

function markNumber(grid, number) {
  for (let row of grid) {
    if (row.includes(number)) {
      row[row.indexOf(number)] = true;
      return;
    }
  }
}

function hasWinningLine(grid) {
  // Check horizontal lines
  for(let row of grid) {
    if(row.every((cell) => cell === true)) {
      return true;
    }
  }

  // Check vertical lines
  for(let col = 0; col < 5; col++) {
    if(
      grid[0][col] === true &&
      grid[1][col] === true &&
      grid[2][col] === true &&
      grid[3][col] === true &&
      grid[4][col] === true
    ) {
        return true;
      }
  }

  // Check diagonals 
  if(
    (
      grid[0][0] === true &&
      grid[1][1] === true &&
      grid[2][2] === true &&
      grid[3][3] === true &&
      grid[4][4] === true
    ) ||
    (
      grid[0][4] === true &&
      grid[1][3] === true &&
      grid[2][2] === true &&
      grid[3][1] === true &&
      grid[4][0] === true
    )
  ) {
    return true;
  }

  return false;
}

function estimateExpectedDraws(numEntries, numPlayers, numSimulations) {
  let totalDraws = 0;
  let highestDrawTotal = 0;
  let lowestDrawTotal = numEntries;

  for (let i = 0; i < numSimulations; i++) {
    let gameDraws = simulateBingoGame(numEntries, numPlayers);
    totalDraws += gameDraws;
    if(gameDraws > highestDrawTotal) highestDrawTotal = gameDraws;
    if(gameDraws < lowestDrawTotal) lowestDrawTotal = gameDraws;
  }

  let averageDraws = totalDraws / numSimulations;
  return {avg: averageDraws, min: lowestDrawTotal, max: highestDrawTotal};
}

const runSimulation = (numPlayers, numSimulations = 10000) => {
  const numEntries = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const res = [];
  for(let i = 0, ilen = numEntries.length; i < ilen; i++) {
    const result = estimateExpectedDraws(numEntries[i], numPlayers, numSimulations).avg;
    res.push(result);
  }
  console.log(`${performance.now()}: ${numPlayers} players`);
  console.log(res);
}
