# auth/auth_utils.py
from passlib.context import CryptContext

# Use pbkdf2_sha256 which does not require the bcrypt C-extension and avoids bcrypt 72-byte issue.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    # passlib will handle salt and iterations
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
