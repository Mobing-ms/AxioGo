from fastapi import APIRouter

from app.api.v1 import actions, analytics, audit, auth, axis, context, datasets, reports, users, workspaces

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(workspaces.router)
api_router.include_router(datasets.router)
api_router.include_router(context.router)
api_router.include_router(analytics.router)
api_router.include_router(axis.router)
api_router.include_router(reports.router)
api_router.include_router(actions.router)
api_router.include_router(audit.router)
