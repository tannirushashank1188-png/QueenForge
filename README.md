# ♛ QUEENFORGE

**Restricted Board — Complete the Queen Placement**

An interactive algorithm visualization platform that solves the **N-Queens problem** on a chessboard containing **restricted cells** using genuine **backtracking**. Built as a DAA (Design and Analysis of Algorithms) learning tool.

---

## ✨ Features

- **Interactive Chessboard** — Click to toggle restricted cells, watch queens being placed
- **Genuine Backtracking** — Real recursive backtracking algorithm, not hardcoded solutions
- **Step-by-Step Visualization** — Pause, resume, step forward/backward through the algorithm
- **Instant Solve** — Solve immediately or find all solutions
- **Restricted Squares** — Mark cells as blocked; queens can't be placed there but attack lines pass through
- **Live Statistics** — Nodes explored, backtracks, recursion depth, execution time
- **Complexity Analysis** — Theoretical O(N!) analysis alongside measured execution statistics
- **Preset Configurations** — Classic 4-Queens, 8-Queens, solvable/unsolvable restricted boards
- **Presentation Mode** — Clean slide-based mode with keyboard navigation for demos
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Premium dark navy UI with violet/cyan accents and frosted-glass cards

## 🧠 Algorithm

The solver uses **row-by-row backtracking** with O(1) conflict detection:

```
function solve(row):
    if row == N:
        record solution
        return

    for col from 0 to N - 1:
        if cell(row, col) is restricted:
            continue

        if isSafe(row, col):
            placeQueen(row, col)
            solve(row + 1)
            removeQueen(row, col)
```

### Conflict Detection

Three occupancy sets provide O(1) safety checks:
- **Column set** — tracks occupied columns
- **Diagonal set** — uses `row - col` to identify main diagonals
- **Anti-diagonal set** — uses `row + col` to identify anti-diagonals

### Complexity

| Metric | Value |
|--------|-------|
| Time Complexity | O(N!) upper bound |
| Space Complexity | O(N) auxiliary (excluding stored solutions) |
| Conflict Check | O(1) per position |

Restrictions and early pruning substantially reduce actual work from the theoretical upper bound.

## 📸 Screenshots

> Screenshots can be added here after running the application.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/queenforge.git
cd queenforge

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run solver tests |
| `npm run test:watch` | Run tests in watch mode |

## 🧪 Testing

The test suite validates:

- ✅ Classic 4-Queens → exactly 2 solutions
- ✅ Classic 8-Queens → exactly 92 solutions
- ✅ Classic 5-Queens → exactly 10 solutions
- ✅ Classic 10-Queens → exactly 724 solutions
- ✅ No two queens share a column
- ✅ No two queens share a diagonal
- ✅ No queen on a restricted cell
- ✅ Restricted board with valid solutions
- ✅ Restricted board with no valid solutions
- ✅ Preset configurations validated
- ✅ Max solution limit respected
- ✅ No duplicate solutions
- ✅ Statistics tracking accuracy

Run tests:

```bash
npm test
```

## 🛠 Tech Stack

- **React 19** + **TypeScript** — UI framework with strict typing
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon library
- **React Router** — Client-side routing
- **Vitest** — Test framework

## 📁 Project Structure

```
src/
├── algorithms/
│   ├── conflictDetection.ts    # O(1) conflict checks + solution validation
│   ├── nQueensSolver.ts        # Backtracking solver (sync + generator)
│   └── solverTypes.ts          # TypeScript type definitions
├── components/
│   ├── AlgorithmPanel.tsx      # Algorithm explanation + pseudocode
│   ├── ChessBoard.tsx          # Interactive chessboard
│   ├── ChessCell.tsx           # Individual cell with states
│   ├── ComplexityPanel.tsx     # Complexity analysis + charts
│   ├── SolutionGallery.tsx     # Paginated solution viewer
│   ├── SolverControls.tsx      # Play/pause/step/reset controls
│   └── StatisticsPanel.tsx     # Live statistics display
├── hooks/
│   └── useBacktrackingVisualizer.ts  # Solver state management
├── pages/
│   ├── AlgorithmGuide.tsx      # Algorithm education page
│   ├── AnalysisPage.tsx        # Complexity benchmarks
│   ├── Dashboard.tsx           # Landing page
│   ├── PresetsPage.tsx         # Preset configurations
│   ├── PresentationPage.tsx    # Hackathon presentation mode
│   └── Visualizer.tsx          # Main interactive board
├── utils/
│   ├── presets.ts              # Validated preset configurations
│   └── storage.ts             # Local storage persistence
├── __tests__/
│   └── solver.test.ts          # Comprehensive solver tests
├── App.tsx                     # Root component + routing
├── main.tsx                    # Entry point
└── index.css                   # Global styles + design tokens
```

## 🌐 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Add `base` to `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: '/queenforge/',
     // ...
   })
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Deploy the dist/ folder to GitHub Pages
   ```

### Netlify

Drag and drop the `dist/` folder to [Netlify](https://app.netlify.com/drop).

## 📦 Publishing to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "feat: QUEENFORGE - N-Queens backtracking visualizer"

# Create GitHub repository and push
gh repo create queenforge --public --source=. --push
# OR
git remote add origin https://github.com/YOUR_USERNAME/queenforge.git
git branch -M main
git push -u origin main
```

## 📝 Project Category

- **Subject:** Design and Analysis of Algorithms (DAA)
- **Algorithm:** Backtracking
- **Problem Type:** N-Queens with Restricted Squares
- **Problem Class:** NP-Hard / Constraint Satisfaction

## 📄 License

MIT

---

*Built with ♛ for algorithm education and hackathon demonstrations.*
