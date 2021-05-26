import { Brush } from "./Brush";
import { Canvas } from "./Canvas";
import { Position } from "./Position";

export interface Move {
    position: Position,
    drawing: number,
    brush: Brush,
    canvas?: Canvas,
    isUndo: boolean
}