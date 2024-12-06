import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../src/components/Header/Header";
import { Me } from "../src/components/Me/Me";
import { QuizEdit } from "../src/components/QuizEdit/QuizEdit";
import Login from "../src/pages/Login/Login";
import { Registration } from "../src/pages/Registration/Registration";
import { User } from "../src/pages/User/User";
import PageLayoutAuth from "./components/PageLayoutAuth";
import Quiz from "./components/Quiz/Quiz";
import RedirectAuthRoute from "./components/RedirectAuthRoute";
import store from "./redux/store";

function App() {

    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                    <>
                        <Header/>
                        <Login/>
                    </>

                    }
                />
                <Route
                    path="/user/:userId"
                    element={
                        <PageLayoutAuth>
                            <Container maxWidth="xl">
                                <User/>
                            </Container>
                        </PageLayoutAuth>

                    }
                />
                <Route
                    path="/me"
                    element={
                        <PageLayoutAuth>
                            <Container maxWidth="xl">
                                <Me/>
                            </Container>
                        </PageLayoutAuth>

                    }
                />
                <Route
                    path="/register"
                    element={
                          <>
                              <Header/>
                              <Container maxWidth="lg">
                                  <Registration/>
                              </Container></>

                    }
                /> 
                <Route
                    path="/quiz/:quizId"
                    element={
                        <PageLayoutAuth>
                            <Container maxWidth="lg"  style={{display:'flex', justifyContent:'center',margin:'auto',width:'1100px',paddingTop:"80px"}}>
                                <Quiz/>
                            </Container>
                        </PageLayoutAuth>
                    }
                />
                <Route
                    path="/quiz/:quizId/edit"
                    element={
                        <PageLayoutAuth haveBorder={false}>
                                <QuizEdit/>
                        </PageLayoutAuth>

                    }
                />
                <Route
                    path="/quiz/create"
                    element={
                        <PageLayoutAuth haveBorder={false}>
                            <QuizEdit/>
                        </PageLayoutAuth>

                    }
                />

                <Route
                    path="/" element={<RedirectAuthRoute/>}
                />

                <Route
                    path="*"
                    element={
                        <PageLayoutAuth>
                            <Container maxWidth="lg" style={{textAlign:'center'}}>
                                    <span style={{fontSize:'72px',fontWeight:"700"}}>404</span>
                            </Container>
                        </PageLayoutAuth>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
