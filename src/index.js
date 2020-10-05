import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button 
        className={ props.className }
        onClick={ props.onClick }
      >
        { props.value }
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          className={ this.props.winnerLine.includes(i) ? 'square winner' : 'square' }
          value={ this.props.squares[i] }
          key={i}
          onClick={ () => this.props.onClick(i) }  
        />
      )
    }
  
    render() {
      let boardSquares = []
      for (let row = 0; row < 3; row++) {
        let boardRow = []
        for (let col = 0; col < 3; col++) {
          boardRow.push(this.renderSquare((row * 3) + col))
        }
        boardSquares.push(<div key={row} className='board-row'>{boardRow}</div>)
      }

      return (
        <div>
          { boardSquares }
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          position: [null,null]
        }],
        stepNumber: 0,
        selectedStep: 0,
        xIsNext: true
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1]
      const squares = current.squares.slice()
      if (calculateWinner(squares) || squares[i]) {
        return
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({ 
        history: history.concat([{
          squares: squares,
          position: [i % 3 + 1, parseInt(i / 3) + 1]
        }]), 
        stepNumber: history.length,
        selectedStep: history.length,
        xIsNext: !this.state.xIsNext })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        selectedStep: step,
        xIsNext: (step % 2) === 0
      })
    }

    render() {
      const history = this.state.history
      const current = history[this.state.stepNumber]
      const winner = calculateWinner(current.squares)

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' pos(col: ' + step.position[0] + ', row: ' + step.position[1] + ')':
          'Go to game start'
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className={ move === this.state.selectedStep ? 'btn selected' : 'btn'}>{desc}</button>
          </li>
        )
      })

      let status
      if (winner) {
        status = `Winner: ${winner.player}`
      } else if (!current.squares.includes(null)) {
        status = 'DRAW!'
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      }

      return (
        <div className="game">
          {/* <h1>Tic Tac Toe</h1>
          <h1>Tic Tac Toe</h1> */}
          <div className='title'>
            <div className="perspective-text">
              <div className="perspective-line">
                <p></p>
                <p>Tic</p>
              </div>
              <div className="perspective-line">
                <p>Tic</p>
                <p>Tac</p>
              </div>
              <div className="perspective-line">
                <p>Tac</p>
                <p>Toe</p>
              </div>
              <div className="perspective-line">
                <p>Toe</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="game-board">
            <Board 
              squares={current.squares}
              winnerLine={ winner ? winner.winnerLine : [] }
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className='status'>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
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
        return { player: squares[a], winnerLine: lines[i] };
      }
    }
    return null;
  }