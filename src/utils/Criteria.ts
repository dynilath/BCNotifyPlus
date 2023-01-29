
export function NotBlacklisted(player: Character, C: Character): boolean {
    return player.BlackList === undefined || C.MemberNumber === undefined || player.BlackList.indexOf(C.MemberNumber) < 0;
}

export function IsPrimeNumber(player: Character, C: Character): boolean {
    if (!C.MemberNumber) return false;
    const CM = C.MemberNumber;
    for (let i = 2; i <= Math.floor(Math.sqrt(CM)); i++) {
        if (CM / i === Math.floor(CM / i)) return false;
    }
    return true;
}

function HexStr(C: number): string {
    return C.toString(16);
}

export function IsSaotome(player: Character, C: Character): boolean {
    return C.MemberNumber !== undefined && HexStr(C.MemberNumber) === `11f2d`;
}

export function IsOwnedBy(player: Character, C: Character): boolean {
    return C.MemberNumber !== undefined && player.IsOwnedByMemberNumber(C.MemberNumber);
}

export function Not(criteria: (player: Character, C: Character) => boolean): (player: Character, C: Character) => boolean {
    return (player: Character, C: Character) => C.MemberNumber !== undefined && !criteria(player, C);
}

export function IsSelf(player: Character, C: Character): boolean {
    return C.MemberNumber !== undefined && player.MemberNumber === C.MemberNumber;
}

export function NotSelf(player: Character, C: Character): boolean {
    return C.MemberNumber !== undefined && player.MemberNumber !== C.MemberNumber;
}