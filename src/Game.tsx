import { useState } from "react";
import Square from "./Square";

type History = {
	row: number;
	col: number;
};
type BoardProps = {
	xIsNext: boolean;
	squares: string[];
	onPlay: (nextSquares: string[], history: History) => void;
	boardSize: number;
};

function Board({ xIsNext, squares, onPlay, boardSize }: BoardProps) {
	function handleClick(i: number) {
		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares, { row: Math.floor(i / SIZE), col: i % SIZE });
	}

	const { winner, line } = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else {
		if (squares.every((square) => square)) {
			status = "It's a draw!";
		} else status = "Next player: " + (xIsNext ? "X" : "O");
	}

	return (
		<div className="game-board">
			<div className="status">{status}</div>
			{Array.from({ length: boardSize }).map((_, i) => (
				<div className="board-row" key={i}>
					{Array.from({ length: boardSize }).map((_, j) => (
						<Square
							key={i * boardSize + j}
							value={squares[i * boardSize + j]}
							onClick={() => handleClick(i * boardSize + j)}
							state={line.includes(i * boardSize + j) ? "won" : "default"}
						/>
					))}
				</div>
			))}
		</div>
	);
}

const SIZE = 3;

export default function Game() {
	const [sortAsc, setSortAsc] = useState(true);
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares: string[]) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove: number) {
		setCurrentMove(nextMove);
	}

	function resetGame() {
		setHistory([Array(9).fill(null)]);
		setCurrentMove(0);
	}

	return (
		<main>
			<h1>TIC TAC TOE GAME</h1>
			<div className="game">
				<div>
					<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={SIZE} />

					<button onClick={resetGame} className="reset-btn" disabled={currentMove == 0}>
						Reset game
					</button>
				</div>
				<div className="game-info">
					<p>You are at the move #{currentMove + 1}</p>
					<div className="toggle-switch">
						<label htmlFor="toggle-switch">Sort moves in ascending order</label>
						<input
							type="checkbox"
							id="toggle-switch"
							checked={sortAsc}
							onChange={() => setSortAsc(!sortAsc)}
						/>
						<label htmlFor="toggle-switch" className="toggle-label"></label>
					</div>
					<ol className={`move-list ${sortAsc ? "asc" : ""}`}>
						{history.map((_, move) => {
							let description;
							if (move > 0) {
								description = "Go to move #" + move;
							} else {
								description = "Go to game start";
							}
							if (move === currentMove) {
								description = "You are at move #" + move;
							}
							return (
								<li key={move}>
									{move === currentMove ? (
										<strong>{description}</strong>
									) : (
										<button onClick={() => jumpTo(move)} className="btn-history">
											{description}
										</button>
									)}
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</main>
	);
}

function calculateWinner(squares: string[]): { winner: string | null; line: number[] } {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				line: [a, b, c],
			};
		}
	}
	return {
		winner: null,
		line: [],
	};
}
