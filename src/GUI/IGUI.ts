
export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IPoint {
    x: number;
    y: number;
}
export function WithinRect(mouse: IPoint, rect: IRect): boolean {
    return mouse.x >= rect.x && mouse.x <= rect.x + rect.width && mouse.y >= rect.y && mouse.y <= rect.y + rect.height;
}
export function MouseInRect(rect: IRect): boolean {
    return WithinRect({ x: MouseX, y: MouseY }, rect);
}

