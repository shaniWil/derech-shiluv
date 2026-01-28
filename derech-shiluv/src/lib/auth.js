export class HttpError extends Error {
    constructor(message,status) {
        super(message);
        this.status = status;
    }
}


export function getCurrentUser(_request) {
  // TODO: בעתיד - לקרוא session/JWT
  // כרגע - דמה לפיתוח
  return {
    id: "DEV_USER_ID",
    role: "admin", 
  };
}

export function requireAdmin(user) {
    if (!user) throw new HttpError("unauthorized", 401);
    if (user.role !== "admin") throw new HttpError("forbidden", 403);
}

export function requireAdminOrSelf(user, ownerId) {
    if (!user) throw new HttpError("unauthorized", 401);
    if (user.role === "admin") return;

    if (user.role === "volunteer" && user.id === ownerId) return;
    throw new HttpError("forbidden", 403);
}

export function errorToResponse(error) {
    if (error instanceof HttpError) {
        return Response.json(
            { error: error.message },
            { status: error.status }
        );
    }

    console.error(error);
    return Response.json(
        { error: "internal server error" },
        { status: 500 }
    );
}