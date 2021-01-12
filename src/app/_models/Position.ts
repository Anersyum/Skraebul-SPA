export interface Position {
    x: number,
    y: number,
    drawing: number,
    brushColor?: string | CanvasGradient | CanvasPattern,
    brushWidth?: string
}