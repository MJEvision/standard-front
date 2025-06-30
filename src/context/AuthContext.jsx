import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => console.warn("login not provided"),
  logout: () => console.warn("logout not provided"),
  refreshAccessToken: () => console.warn("refreshAccessToken not provided"),
  syncAuth: () => console.warn("syncAuth not provided"),
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const getUserFromStorage = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    return {
      userId: localStorage.getItem("userId") || "",
      name: localStorage.getItem("name") || "익명",
      email: localStorage.getItem("email") || "",
      gender: localStorage.getItem("gender") || "",
      birth: localStorage.getItem("birth") || "",
      age: localStorage.getItem("age") || "",
    };
  };

  const syncAuth = () => {
    console.log("AuthProvider: syncAuth 시작");
    const token = localStorage.getItem("accessToken");
    if (token) {
      const userData = getUserFromStorage();
      console.log(
        "AuthProvider: localStorage에서 가져온 사용자 데이터",
        userData
      );
      setIsLoggedIn(true);
      setUser(userData);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    console.log("AuthProvider: syncAuth 완료, isLoggedIn:", isLoggedIn);
  };

  useEffect(() => {
    console.log("AuthProvider: 초기 syncAuth 호출");
    syncAuth();
  }, []);

  useEffect(() => {
    const syncFromOtherTabs = () => {
      console.log("AuthProvider: storage 이벤트 트리거됨");
      syncAuth();
    };
    window.addEventListener("storage", syncFromOtherTabs);
    return () => window.removeEventListener("storage", syncFromOtherTabs);
  }, []);

  const login = (
    accessToken,
    userId,
    name,
    email,
    refreshToken,
    gender = "",
    birth = ""
  ) => {
    const age = birth ? calculateAge(birth) : "";

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken || "");
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("name", name || "익명");
    localStorage.setItem("email", email || "");
    localStorage.setItem("gender", gender);
    localStorage.setItem("birth", birth);
    localStorage.setItem("age", age);

    setIsLoggedIn(true);
    setUser({
      userId: userId.toString(),
      name: name || "익명",
      email,
      gender,
      birth,
      age,
    });

    console.log("AuthProvider: 로그인 완료, isLoggedIn:", true);
    syncAuth();
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    [
      "accessToken",
      "refreshToken",
      "userId",
      "name",
      "email",
      "gender",
      "birth",
      "age",
    ].forEach((key) => localStorage.removeItem(key));

    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    console.log("AuthProvider: 로그아웃 완료, isLoggedIn:", false);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        syncAuth();
        return data.accessToken;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      logout();
      return null;
    }
  };

  const calculateAge = (birthString) => {
    if (!birthString) return "";
    try {
      const [year, month, day] = birthString.split("-").map(Number);
      if (!year || !month || !day) throw new Error("Invalid date format");
      const today = new Date();
      let age = today.getFullYear() - year;
      if (
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day)
      ) {
        age--;
      }
      return age.toString();
    } catch (error) {
      console.error("나이 계산 오류:", error);
      return "";
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, refreshAccessToken, syncAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다.");
  }
  return context;
};
