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

  const loadLesson = async (event: any) => {
    lessonId = event.target.value
    const lesson = await trpc($page).lessonById.query(lessonId);
    if (!lesson.id) 
      return alert(`Lesson ${lessonId} not found`);
    
    currentLesson = lesson;
    loading = false;
  }

  const validateMove = async () => {
    loading = true;
    const result = await trpc($page).validateMove.query({ lessonId, boardState: currentBoardPGN });
    validationResult = result
    loading = false;
  };
</script>

<div class="container">
    <div class="left-div">
        {#if !currentLesson}
            <button on:click={loadLessons}>Load lesson list</button>
            <p>Lesson List:</p>
            {#if lessons.length}
            <ul>
                {#each lessons as lesson (lesson.id)}
                    <button on:click={loadLesson} value={lesson.id}> {lesson.title} </button>
                {/each}
            </ul>
            {/if}
        {/if}
        
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
            <p>Validate Move</p>
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
        {/if}
    </div>
    
    <div class="right-div">
        blah
    </div>
</div>

<style lang="css">
    .container {
        display: flex;
        justify-content: space-between;
    }

    .left-div {
        flex: 1;
    }

    .right-div {
        flex: 1;
    }
</style>

