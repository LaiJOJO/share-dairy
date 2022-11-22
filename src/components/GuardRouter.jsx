import { useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { guard } from '../units/routerGuardHelper.js';

export default function GuardRouter(router) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    guard(navigate, location);
  }, [location, navigate, router]);
  const Route = useRoutes(router);
  return (
    Route
  )
}
