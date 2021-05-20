export interface Position {
    x: number,
    y: number,
    drawing: number,
    // brush color and brush width go to brush model
    brushColor?: string | CanvasGradient | CanvasPattern,
    brushWidth?: number
}