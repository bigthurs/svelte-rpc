<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import type { Lesson } from '$lib/types';

  let lessons: Lesson[] = []
  let currentLesson: Lesson | null = null;
  let loading = false;
  let lessonId = '';

  const loadLessons = async () => {
    loading = true;
    lessons = await trpc($page).lessonList.query();
    loading = false;
    console.log({ lessons })
  };

  const loadLesson = async () => {
    loading = true;
    const lesson = await trpc($page).lessonById.query(lessonId);
    if (!lesson.id) {
      return alert(`Lesson ${lessonId} not found`);
    }
    currentLesson = lesson;
    loading = false;
    console.log({ currentLesson })
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

------------------------------------------------------------

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

