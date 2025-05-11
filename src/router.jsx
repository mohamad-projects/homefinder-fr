import { createBrowserRouter } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "./components";
import {
    Home,
    Login,
    Register,
    Error,
    RealEstate,
    Office,
    Contact,
    About,
    AddHome,
    Display,
    PropertyDetails,
    OfficeList,
    OfficeDetails ,
    Profile,
    MostPages,
    
} from "./pages";
// import Profile from "./pages/Profile/Profile";

export const createRoutes = (user) => createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // تمت إزالة ProtectedRoute هنا
        children: [
            { 
                index: true, // هذه تحدد الصفحة الرئيسية
                element: <Home />,
                errorElement: <Error />
            },
            { 
                path: "/RealEstate", 
                element: user ? <RealEstate /> : <Navigate to="/" />,
                errorElement: <Error /> 
            },
            { 
                path: "/office", 
                element: <Office /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/display", 
                element:<Display /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/officelist", 
                element:<OfficeList /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/contact", 
                element :<Contact /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/officeDetails/:id", 
                element :<OfficeDetails /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/profile/:id", 
                element :<Profile /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/addhome", 
                element: user ? <AddHome /> : <Navigate to="/" />,
                errorElement: <Error /> 
            },
            { 
                path: "/about", 
                element:  <About /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/MostWatch", 
                element:  <MostPages /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/MostSearch", 
                element:  <MostPages /> ,
                errorElement: <Error /> 
            },
            { 
                path: "/property/:id", 
                element: <PropertyDetails /> ,
                errorElement: <Error /> 
            },
        ],
    },
    {
        path: "/login",
        element: user ? <Navigate to="/" /> : <Login />,
        errorElement: <Error />,
    },
    {
        path: "/register",
        element: user ? <Navigate to="/" /> : <Register />,
        errorElement: <Error />,
    },
    {
        path: "*",
        element: <Error />,
    }
]);