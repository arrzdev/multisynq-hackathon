import { BiBuildingHouse } from "react-icons/bi";
import { IoMapOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";

import {setDrawerState} from "@/components/Drawer"

const Navbar = ({
  setCurrentView
}: {
  setCurrentView: (view: "map" | "list") => void
}) => {
  return (
    <>
      {/* <Drawer  views={{"Add-Event": <NewEvent/>}}/> */}
      <div className="fixed bottom-0 w-full z-10 h-20 bg-[#fdf0d5] rounded-t-3xl shadow-[0px_-2px_4px_rgba(0,0,0,0.5),0px_2px_4px_rgba(0,0,0,0.5)] flex justify-center items-center px-6 space-x-20">
        {/* IoMapOutline Border */}
        <BiBuildingHouse className="text-[#780000] cursor-pointer" size={40} onClick={() => setCurrentView("list")}/>

        {/* IoMdAddCircle Icon */}
        <IoMdAddCircle
          className="text-[#780000] cursor-pointer"
          size={50}
          onClick={() => setDrawerState("new-post")}
        />

        {/* Vector Background */}
        <IoMapOutline className="text-[#780000] cursor-pointer" size={40} onClick={() => setCurrentView("map")}/>
      </div>
    </>
  )
}

export default Navbar
