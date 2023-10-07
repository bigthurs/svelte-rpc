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
    currentLesson = await trpc($page).lessonById.query(lessonId);
    loading = false;
    console.log({ currentLesson })
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<button on:click={loadLessons}>Load lesson list</button>
<p>Lesson List:</p>
{#if lessons.length}
  <ul>
    {#each lessons as lesson}
      <li>{lesson.id}: {lesson.title}</li>
    {/each}
  </ul>
{/if}

<p>Load lesson by ID</p>
<input type="text" bind:value={lessonId} />


<button on:click={loadLesson}>Load lesson</button>
    
{#if currentLesson}
    <h3>{currentLesson.title}</h3>
    {#each currentLesson.boardStates as boardState}
      <p>{boardState.pgn}</p>
    {/each}
{/if}

