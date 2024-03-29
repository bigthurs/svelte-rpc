
<script lang="ts">
    const board = new Chessboard(
        document.getElementById("board"), 
        {
            position: FEN.start,
            assetsUrl: "../../assets" // wherever you copied the assets folder to, could also be in the node_modules folder
    })

    board.enableMoveInput(inputHandler) // This enables the move input

    const inputHandler = (event) => {
        console.log(event)
        if(event.type === INPUT_EVENT_TYPE.moveInputStarted || 
                event.type === INPUT_EVENT_TYPE.validateMoveInput) {
            return true // false cancels move
        }
    }
</script>

<link rel="stylesheet" href="./node_modules/cm-chessboard/assets/styles/cm-chessboard.css">

<div id="board"></div>