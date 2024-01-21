import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./RouterDom/pages/NotFound/NotFound";
import Footer from "./component/Footer/Footer";
import AllPage from "./RouterDom/Page";
import Login from "./RouterDom/pages/login/Login";
import Header from "./component/Header/Header";
import Loading from "./Loading";
function App() {
  const showPageUser = (AllPage: any) => {
    if (AllPage.length > 0) {
      return AllPage.map((page: any, index: any) => (
        <Route
          key={index}
          path={page.path}
          element={
            <Suspense fallback={<Loading />}>
              {page.main}
            </Suspense>
          }
        />
      ));
    }
  };

  return (
    <div className="app">
      {/* <Header/> */}
      <Routes>
        {showPageUser(AllPage)}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      {/* <Footer/> */}
    </div>
  );
}

export default App;
