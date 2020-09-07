import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(col) {
    const columns = range(col*3, (col+1)*3).map((i) => this.renderSquare(i));

    return (
      <div className="board-row">
        {columns}
      </div>
    );
  }

  render() {
    const rows = range(0, 3).map((col) => this.renderRow(col));

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

    return (
      <ol className="history">{moves}</ol>
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <History
            history={history}
            stepNumber={this.state.stepNumber}
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

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

function range(start, stop) {
  const len = stop - start
  return Array.from(Array(len), (v, k) => k + start)
}
