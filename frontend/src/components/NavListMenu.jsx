import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
  Typography
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon,
  NewspaperIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
const navListMenuItems = [
  {
    title: "Daily Digest",
    description:
      "Stay informed with our Daily Digest, providing you with timely updates on your shares so you never miss a crucial detail.",
  },
  {
    title: "Market Moves",
    description:
      "Access the latest news and trends in the market with our Market Moves section, ensuring you are always up-to-date with current market movements.",
  },
];

export default function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <Link to = "/news" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
              <NewspaperIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              News{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
        News{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}
