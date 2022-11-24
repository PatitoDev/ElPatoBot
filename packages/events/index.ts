export type EventType = "connect" | "quack"

export interface BaseEvent<T extends EventType = EventType, C = any> {
    type: T
    content: C
}

export interface ConnectEvent extends BaseEvent<'connect', {
    channel: string
}> {}

export interface QuackEvent extends BaseEvent<'quack', null> {}