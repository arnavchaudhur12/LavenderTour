from fastapi import APIRouter

from app.api import auth, engagement, quotes, recommendations

router = APIRouter()
router.include_router(auth.router, prefix='/auth', tags=['auth'])
router.include_router(recommendations.router, prefix='/recommendations', tags=['recommendations'])
router.include_router(quotes.router, prefix='/quotes', tags=['quotes'])
router.include_router(engagement.router, prefix='/engagement', tags=['engagement'])
