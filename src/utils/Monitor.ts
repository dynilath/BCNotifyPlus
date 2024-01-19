type MonitorEvent = (player: Character, delta: number, current: number) => void;

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Monitor {
    _MonitorList = new Array<{ interval: number, timer: number, event: MonitorEvent }>;
    _OnceList = new Array<{ time: number, event: MonitorEvent }>;
    _TimerStart = Date.now();
    _MonitorId: number | undefined = undefined;

    constructor(resolution: number) {
        this._MonitorId = window.setInterval(() => {
            let this_pass_time = Date.now();

            if (CurrentScreen !== undefined && (CurrentScreen === "Relog" || CurrentScreen === "Login")) {
                this._TimerStart = this_pass_time
                return;
            }

            let new_T = this_pass_time

            if (Player !== undefined && Player.MemberNumber !== undefined) {
                let dt = (new_T - this._TimerStart);

                while (this._OnceList.length > 0) {
                    const f = this._OnceList[0];
                    if (f.time > this_pass_time) break;
                    f.event(Player as Character, dt, this._TimerStart);
                    this._OnceList.shift();
                }

                this._MonitorList.forEach(_ => {
                    if (_.interval > 0) {
                        _.timer += dt;
                        if (_.timer > _.interval) {
                            _.timer -= _.interval;
                            _.event(Player as Character, dt, this._TimerStart);
                        }
                    } else {
                        _.event(Player as Character, dt, this._TimerStart);
                    }
                });
            }

            this._TimerStart = new_T;
        }, resolution);
    }

    Once(delay: number, event: MonitorEvent) {
        this._OnceList.push({ time: Date.now() + delay, event });
    }

    AddEvent(event: MonitorEvent) {
        this._MonitorList.push({ interval: 0, timer: 0, event });
    }

    AddIntervalEvent(interval: number, event: MonitorEvent) {
        this._MonitorList.push({ interval, timer: 0, event });
    }

    Stop() {
        clearInterval(this._MonitorId);
    }
}