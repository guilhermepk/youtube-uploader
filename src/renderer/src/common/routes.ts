import UpdateVideosFlowPage from "@renderer/pages/update-videos-flow/UpdateVideosFlowPage";
import FullFlowPage from "@renderer/pages/FullFlowPage";
import HomePage from "@renderer/pages/home/HomePage";
import LoginPage from "@renderer/pages/LoginPage";

export const routes = {
  loginPage: {
    path: '/login',
    element: LoginPage
  },
  homePage: {
    path: '/',
    element: HomePage
  },
  fullFlowPage: {
    path: '/full-flow',
    element: FullFlowPage
  },
  updateVideosFlowPage: {
    path: '/update-videos-flow',
    element: UpdateVideosFlowPage
  }
}