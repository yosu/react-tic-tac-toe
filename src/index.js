import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Square extends React.Component {
  render() {
    let className = ["square"]
    if (this.props.isWin) {
      className.push("win")
    }
    return (
      <button className={className.join(" ")} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, isWin) {
    return (
      <Square
        value={this.props.squares[i]}
        isWin={isWin}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(col, winnerLine) {
    const columns = range(col*3, (col+1)*3).map((i) => this.renderSquare(i, winnerLine && winnerLine.includes(i)));

    return (
      <div className="board-row">
        {columns}
      </div>
    );
  }

  render() {
    const winnerLine = calculateWinnerLine(this.props.squares)
    const rows = range(0, 3).map((col) => this.renderRow(col, winnerLine));

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class History extends React.Component {
  calculatePosition(i) {
    return {
      col: i % 3,
      row: Math.floor(i / 3),
    }
  }

  render() {
    const moves = this.props.history.map((step, move) => {
      const p = this.calculatePosition(step.position)
      const desc = move ?
        `Go to move #${move} (${p.col}, ${p.row})`:
        'Go to game start (col, row)';
      const className = (move === this.props.stepNumber) ? "selected" : null;
      return (
        <li key={move} className={className}>
          <button className={className} onClick={() => this.props.onClick(move)}>{desc}</button>
        </li>
      )
    });

    if (this.props.isReverseOrder) {
      moves.reverse();
    }

    return (
      <ol className="history">{moves}</ol>
    );
  }
}

class GameStatus extends React.Component {
  render() {
    const winner = calculateWinner(this.props.squares);
    const isFull = this.props.squares.every((v) => v);

    const status = (winner) ? 'Winner: ' + winner
                 : (isFull) ? "Tie Game"
                 :'Next player: ' + (this.props.xIsNext ? 'X' : 'O')
                 ;
    return (
      <div>{status}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
      }],
      isReverseOrder: false,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleHistoryClick(move) {
    this.jumpTo(move)
  }

  handleHistoryOrderClick() {
    this.setState((state) => {
      return {
        isReverseOrder: !state.isReverseOrder
      }
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const order = "History Order " + (this.state.isReverseOrder ? "▲" : "▼")
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <GameStatus
            squares={current.squares}
            xIsNext={this.state.xIsNext}
          />
          <div className="history-order-toggle">
            <button onClick={() => this.handleHistoryOrderClick()}>{order}</button>
          </div>
          <History
            history={history}
            stepNumber={this.state.stepNumber}
            isReverseOrder={this.state.isReverseOrder}
            onClick={(move) => this.handleHistoryClick(move)}
          />
        </div>
      </div>
    );
  }
}

// ==========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinnerLine(squares) {
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
      return lines[i];
    }
  }
  return null;
}

function calculateWinner(squares) {
  const line = calculateWinnerLine(squares)
  if (line) {
    return squares[line[0]];
  }
  return null;
}

function range(start, stop) {
  const len = stop - start
  return Array.from(Array(len), (v, k) => k + start)
}
