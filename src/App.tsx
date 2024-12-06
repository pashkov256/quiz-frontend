import React, {useEffect} from "react";
import Quiz from "./components/Quiz/Quiz";
import store from "./redux/store";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "../src/pages/Login/Login";
import RedirectAuthRoute from "./components/RedirectAuthRoute";
import PageLayoutAuth from "./components/PageLayoutAuth";
import {Container} from "@mui/material";
import {User} from "../src/pages/User/User";
import {Me} from "../src/components/Me/Me";
import {QuizEdit} from "../src/components/QuizEdit/QuizEdit";
import {Registration} from "../src/pages/Registration/Registration";
import Header from "../src/components/Header/Header";

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
                            <Container maxWidth="lg"  style={{display:'flex', justifyContent:'center',margin:'auto',width:'1100px',paddingTop:"120px"}}>
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
