import FullFlowPage from "@renderer/pages/FullFlowPage";
import HomePage from "@renderer/pages/HomePage";
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
  }
}