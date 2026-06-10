import Flow2Page from "@renderer/pages/Flow2Page";
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
  flow2Page: {
    path: '/flow-2',
    element: Flow2Page
  }
}