import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod'
import delay from 'delay';
import type { Lesson } from '$lib/types';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    await delay(500); // 👈 simulate an expensive operation
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  }),
  // Queries
  lessonList: t.procedure.query(async () => {
    const lessons: Lesson[] = await fetch('http://localhost:3000/lessons')
      .then(res => res.json())

    return lessons
  }),
  lessonById: t.procedure
    .input(z.string())
    .query(async (opts) => {
      const { input: lessonId } = opts

      const lesson: Lesson = await fetch(`http://localhost:3000/lessons/${lessonId}`)
        .then(res => res.json())

      return lesson
  }),
  validateMove: t.procedure
    .input(z.object({
      boardStates: z.array(z.object({
        pgn: z.string()
      })),
      moveNumber: z.number(),
      lessonId: z.string()
    }))
    .query(async (opts) => {
      const { input: { boardStates, moveNumber, lessonId } } = opts
      const [ lastBoardState ] = boardStates.slice(-1)

      const lesson: Lesson = await fetch(`http://localhost:3000/api/lessons/${lessonId}`)
        .then(res => res.json())

      const validPgnBoardState = lesson.boardStates[moveNumber - 1]
      const validMove = validPgnBoardState.pgn === lastBoardState.pgn

      return validMove
    })
  ,

  // Mutations
  createLesson: t.procedure
    .input(z.object({
      boardStates: z.array(z.object({
        pgn: z.string()
      }))
    }))
    .mutation(async (opts) => {
      const { input: lesson } = opts

      const newLesson = await fetch('http://localhost:3000/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(lesson)
        })
        .then(res => res.json())

      return newLesson
    }
  ),
});

export type Router = typeof router
export const publicProcedure = t.procedure