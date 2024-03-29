<script lang="ts">
    import { Chessboard } from "cm-chessboard";
    import { Chess } from "chess.js";
    export let selectedLine;
  
    const { playerMoves, player, computerRegex, computerMoves } = selectedLine;
  
    const onSnapEnd = () => {
        console.log({ game })
        board.position(game.fen());
    }

    const onDragStart = (source: string, piece: string, position: string, orientation: string) => {
        // do not pick up pieces if the game is over
        if (game.isGameOver()) return false;

        // only pick up pieces for the player
        if (piece.search(computerRegex) !== -1) return false;
    }

    const onDrop = (source: string, target: string) => {
        // see if the move is legal
        let move = game.move({
            from: source,
            to: target,
            promotion: "q", // NOTE: always promote to a queen for example simplicity
        });
  
        // illegal move
        if (move === null) return "snapback";
  
        moveCount++;
        updateStatus();
  
        verifyPlayerMove(source, target);
        // TODO - bad any typing
        window.setTimeout(makeComputerMove(moveCount) as any, 500);
    }

    const game = new Chess();
    let moveCount = 0;
    let config = {
        orientation: player,
        draggable: true,
        position: "start",
        onDragStart,
        onDrop,
        onSnapEnd,
    };
  
    let board = new Chessboard("board", config);

    const verifyPlayerMove = (source: string, target: string) => {
        let playerMove = source + " " + target;
        if (playerMove !== playerMoves[moveCount - 1]) {
          alert("not the right move, try again!");
          return false;
        } else {
          return true;
        }
      }
  
    const makeComputerMove = (moveCount: number) => {
        if (player === "white") {
            game.move(computerMoves[moveCount - 1]);
        } else {
            game.move(computerMoves[moveCount]);
        }

        board.position(game.fen());
    }
  
    const updateStatus = () => {
      let status = "";

      let moveColor = "White";
      if (game.turn() === "b") {
        moveColor = "Black";
      }

      // checkmate?
      if (game.isCheckmate()) {
        status = "Game over, " + moveColor + " is in checkmate.";
      }

      // draw?
      else if (game.isDraw()) {
        status = "Game over, drawn position";
      }

      // game still on
      else {
        status = moveColor + " to move";

        // check?
        if (game.inCheck()) {
          status += ", " + moveColor + " is in check";
        }
      }
    }
  
    setTimeout(() => {
      updateStatus();
  
      if (player === "black" && moveCount === 0) {
        setTimeout(() => {
          game.move(computerMoves[0]);
          board.position(game.fen());
        }, 250);
      }
    }, 0);
</script>
  
  <div id="board" />
  
  <style>
    #board {
      width: 30rem;
      height: 30rem;
    }
  </style>