import {Input} from "@mui/material";
/* import Button from "@mui/material/Button"; */
import React from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router";
import {fetchAuth, selectorIsAuth} from "../../redux/slices/auth";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import {useAppDispatch} from "../../redux/store";

const Login = () => {
    const isAuth = useSelector(selectorIsAuth);
    document.title = "Авторизация";
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const dispatch = useAppDispatch();

    const onSubmit = async (values:any) => {
        console.log(values)
            //@ts-ignore
        const data = await dispatch(fetchAuth(values));

        if (!data.payload) {
            return alert("Не удалось авторизоваться");
        }

        if ("token" in data.payload) {
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
            <h5 className={styles.title}>Вход в аккаунт</h5>
            <div className={styles.loginBox}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        className={styles.loginInput}
                        error={Boolean(errors.email?.message)}
                        {...register("email", { required: "Укажите почту" })}
                        fullWidth
                        type="email"
                        placeholder="Укажите почту"
                    />
                    <Input
                        className={styles.loginInput}
                        fullWidth
                        {...register("password", { required: "Укажите пароль" })}
                        error={Boolean(errors.password?.message)}
                        placeholder="Укажите пароль"
                        type={"password"}
                    />
                    <Button
                        className={styles.loginButton}
                        type={"submit"}
                        size="large"
                        variant="contained"
                        fullWidth
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login
