<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import type { Lesson } from '$lib/types';

  let lessons: Lesson[] = []
  let currentLesson: Lesson | null = null;
  let currentBoardPGN = '';
  let loading = false;
  let lessonId = '';
  let validationResult: boolean | string = ''


  const loadLessons = async () => {
    loading = true;
    lessons = await trpc($page).lessonList.query();
    loading = false;
  };

  const loadLesson = async () => {
    loading = true;
    const lesson = await trpc($page).lessonById.query(lessonId);
    if (!lesson.id) {
      return alert(`Lesson ${lessonId} not found`);
    }
    currentLesson = lesson;
    loading = false;
  };

  const validateMove = async () => {
    loading = true;
    console.log({ lessonId, boardState: currentBoardPGN })
    const result = await trpc($page).validateMove.query({ lessonId, boardState: currentBoardPGN });
    console.log(result);
    validationResult = result
    loading = false;
  };
</script>

<button on:click={loadLessons}>Load lesson list</button>
<p>Lesson List:</p>
{#if lessons.length}
  <ul>
    {#each lessons as lesson}
      <li>{lesson.id}: {lesson.title}</li>
    {/each}
  </ul>
{/if}

<p>------------------------------------------------------------</p>

<p>Load lesson by ID</p>
<input type="text" bind:value={lessonId} />


<button on:click={loadLesson}>Load lesson</button>
    
{#if currentLesson}
    <h3>{currentLesson.title}</h3>
    <ul>
        {#each currentLesson.boardStates as boardState}
            <li>{boardState.correct}</li>
            {#if boardState.alternatives}
                <ul>
                    {#each boardState.alternatives as alternative}
                        <li>{JSON.stringify(alternative)}</li>
                    {/each}
                </ul>
            {/if}
        {/each}
    </ul>
{/if}

<p>------------------------------------------------------------</p>

<p>Validate Lesson</p>
<input type="text" bind:value={currentBoardPGN}/>
<button on:click={validateMove}>Validate move</button>
<p>{currentBoardPGN}</p>

{#if validationResult !== ''}
    {#if validationResult === true}
        <p>Correct!</p>
    {:else if validationResult === false}
        <p>Incorrect!</p>
    {:else}
        <p>Incorrect! {validationResult}</p>
    {/if}
{/if}

