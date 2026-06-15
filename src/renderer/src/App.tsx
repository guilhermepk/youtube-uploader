import { HashRouter, Routes, Route } from 'react-router-dom';
import { routes } from './common/routes';
import { AuthProvider } from './contexts/AuthContext';
import NavbarLayout from './layouts/NavbarLayout';
import { UpdateVideosFlowProvider } from './contexts/UpdateVideosFlowContext';

export default function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AuthProvider />}>
          <Route path={routes.loginPage.path} element={<routes.loginPage.element />} />

          <Route element={<NavbarLayout />}>
            <Route path={routes.homePage.path} element={<routes.homePage.element />} />
            <Route path={routes.fullFlowPage.path} element={<routes.fullFlowPage.element />} />

            <Route element={<UpdateVideosFlowProvider />}>
              <Route path={routes.updateVideosFlowPage.path} element={<routes.updateVideosFlowPage.element />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}