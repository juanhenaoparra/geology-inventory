from fastapi import HTTPException


class UserError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)

class UpdateError(UserError):
    def __init__(self, detail: str = "Failed to update stock item"):
        super().__init__(detail=detail)