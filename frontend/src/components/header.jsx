import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton
} from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import ProfileMenu from "./ProfileMenu";
import NavList from "./NavList";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [user] = useRecoilState(userState);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const navigate = useNavigate()
  const handlebutton = ()=>{
    navigate('/signin')
  }
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar className="mx-auto p-2 sticky top-0 z-50 bg-white shadow-md lg:rounded-full">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-6 cursor-pointer py-1.5 font-semibold text-xl"
          onClick={()=>{
            navigate('/')
          }
          }
        >
          StockVibes
        </Typography>

        <div className="hidden lg:flex flex-1 justify-around">
          <NavList />
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          
          {!user ? (
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block rounded-full ml-auto mr-6"
              onClick={handlebutton}
            >
              <span>Login</span>
            </Button>
          ) : (
            <span className="hidden lg:inline-block rounded-full ml-auto mr-6">
              {user.name}
            </span>
          )}
          <ProfileMenu />
        </div>
      </div>
      
      <Collapse open={isNavOpen}>
        <NavList />
         {!user ? (
          <Button variant="gradient" size="sm" fullWidth className="mb-2 rounded-full">
            <span>Login</span>
          </Button>
        ) : (
          <span className="mb-2 rounded-full">
            {user.name}
          </span>
        )}
      </Collapse>
    </Navbar>
  );
}
