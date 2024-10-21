type SquareProps = {
	value: string;
	onClick: () => void;
	state?: "won" | "default";
};
export default function Square({ value, onClick, state = "default" }: SquareProps) {
	return (
		<button className={`square ${state == "won" ? "won" : ""}`} onClick={onClick}>
			{value}
		</button>
	);
}
