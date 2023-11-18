<script lang="ts">
    import { page } from '$app/stores';
    import { trpc } from '$lib/trpc/client';
    import { parse } from '@mliebelt/pgn-parser'

    let loading = false;
    let currentCorrectPgn: string
    let currentDraftAlternative: {
        pgn: string,
        annotation: string,
    } = {
        pgn: '',
        annotation: '',
    }
    let draftBoardState: {
        correct: string,
        alternatives: {
            pgn: string,
            annotation: string,
        }[]
    } = {
        correct: '',
        alternatives: []
    }
    let lessonToAdd: {
        title: string,
        boardStates: {
            correct: string,
            alternatives: {
                pgn: string,
                annotation: string,
            }[]
        }[]
    } = {
        title: '',
        boardStates: []
    }

    const addLesson = async () => {
        loading = true;
        if (!lessonToAdd.title) return alert('Title is required')
        if (!lessonToAdd.boardStates.length) return alert('At least 1 board state is required')
        const lesson = await trpc($page).createLesson.mutate(lessonToAdd);
        console.log({ message: `Lesson ${lesson.title} created` })
        loading = false;
    };

    const addCorrectToDraft = () => {
        if (!currentCorrectPgn) return alert('PGN is required')
        const parseResult = parse(currentCorrectPgn, { startRule: "pgn" }) as unknown as { moves: Record<string, any>[]}
        if (!parseResult.moves || !parseResult.moves[0]?.moveNumber) return alert('Invalid PGN')
        draftBoardState.correct = currentCorrectPgn;
    }

    const addAlternativeToDraft = () => {
        if (!currentDraftAlternative.pgn || !currentDraftAlternative.annotation) return alert('PGN is required')
        draftBoardState = {
            ...draftBoardState,
            alternatives: [ ...draftBoardState.alternatives, currentDraftAlternative ]
        }
    }

    const addBoardState = () => {
        if (!draftBoardState || !draftBoardState.correct || !draftBoardState.alternatives) return alert('Board state is required')
        lessonToAdd.boardStates = [
                ...lessonToAdd.boardStates,
                draftBoardState
        ]
    }
</script>

<p>Title</p><input type="text" bind:value={lessonToAdd.title}/>
<p>Draft Lesson</p>
{#each lessonToAdd.boardStates as boardState}
    <p>Correct: {boardState.correct}</p>
    <p>Alternatives:</p>
    {#each boardState.alternatives as alternative}
        <p>Pgn: {alternative.pgn}</p>
        <p>Annotation: {alternative.annotation}</p>
    {/each}
{/each}

---------------------------------------------

<p>Draft board state</p>
<p>Correct: {draftBoardState.correct}</p>
<p>Alternatives:</p>
{#each draftBoardState.alternatives as alternative}
    <p>Pgn: {alternative.pgn}</p>
    <p>Annotation: {alternative.annotation}</p>
{/each}

---------------------------------------------

<p>Add correct board state to draft</p>
<input type="text" bind:value={currentCorrectPgn}/>
<button on:click={addCorrectToDraft}>Add correct</button>

<p>Add board state alternative to draft</p>
<p>Alternative Pgn:</p><input type="text" bind:value={currentDraftAlternative.pgn}/>
<p>Alternative Annotation:</p><input type="text" bind:value={currentDraftAlternative.annotation}/>
<button on:click={addAlternativeToDraft}>Add alternative</button>
<p></p>
---------------------------------------------
<p></p>
<button on:click={addBoardState}>Add board state</button>  
<button on:click={addLesson}>Add lesson</button>
