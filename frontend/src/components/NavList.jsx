import React from "react";
import { Typography, MenuItem } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import NavListMenu from "./NavListMenu";

const navListItems = [
  {
    label:"Dashboard",
    path:"/dashboard"
  },
  {
    label: "Pricing",
    path:'#'
  }
];

export default function NavList() {
  const navigate = useNavigate();
  const handleNavigate=(path)=>{
    navigate(path);
  }
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:justify-evenly lg:w-96">
      <NavListMenu />
      {navListItems.map(({ label,path }) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="small"
          color="gray"
          className="font-medium text-blue-gray-500 text-base"
          onClick={()=> handleNavigate(path)}
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            <span className="text-gray-900">{label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}
