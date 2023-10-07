export type Lesson = {
    boardStates: {
      correct: string,
      alternatives?: AlternativeState[]
    }[],
    id: string,
    title: string
}

type AlternativeState = {
    pgn: string
    annotation: string
}