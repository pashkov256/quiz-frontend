import { Input } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import inputStyles from "../../components/UI/Input/Input.module.scss";
import { fetchRegister, selectorIsAuth } from "../../redux/slices/auth";
import styles from "../Login/Login.module.scss";
import {useAppDispatch} from "../../redux/store";
export const Registration = () => {
    const isAuth = useSelector(selectorIsAuth);
    document.title = "Регистрация";
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
        },
        mode: "onChange",
    });

    const dispatch = useAppDispatch();

    const onSubmit = async (values:any) => {
        //@ts-ignore
        const data = await dispatch(fetchRegister(values));
        console.log(data);
        if (!data.payload) {
            return alert("Не удалось зарегистрироваться");
        }

        if ("token" in data.payload) {
            console.log(data.payload.token);
            window.localStorage.setItem("token", data.payload.token);
        } else {
            alert("Произошла ошибка");
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <div className={styles.loginBoxParent}>
            <h5 className={styles.title}>Создание аккаунта</h5>
            <div className={styles.loginBox}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                >
                    <Input
                        className={styles.loginInput}
                        placeholder="Полное имя"
                        fullWidth
                        {...register("fullName", { required: "Укажите имя" })}
                        error={Boolean(errors.fullName?.message)}
                        type="text"
                    />
                    <Input
                        className={styles.loginInput}
                        placeholder="Почта"
                        fullWidth
                        error={Boolean(errors.email?.message)}
                        {...register("email", { required: "Укажите почту" })}
                    />
                    <Input
                        className={styles.loginInput}
                        placeholder="Пароль"
                        fullWidth
                        {...register("password", { required: "Укажите пароль" })}
                        error={Boolean(errors.password?.message)}
                    />
                    <button
                        className={styles.loginButton}
                        disabled={!isValid}
                        type={"submit"}
                    >
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};
