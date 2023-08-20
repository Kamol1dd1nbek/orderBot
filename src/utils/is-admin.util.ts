export function isAdmin(id: string): boolean {
    switch (id) {
        case process.env.ADMIN_ID_1:
            return true;
    }
    return false;
}